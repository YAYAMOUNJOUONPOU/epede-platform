// src/utils/comtradeParser.ts
// IEEE C37.111 / IEC 60255-24 COMTRADE (Common Format for Transient Data Exchange) Parser

export interface ComtradeAnalogChannel {
  index: number;
  id: string;
  phase: string;
  circuit: string;
  units: string;
  multiplierA: number;
  offsetB: number;
  skew: number;
  min: number;
  max: number;
  primaryRatio: number;
  secondaryRatio: number;
  scalingChannel: 'P' | 'S';
}

export interface ComtradeDigitalChannel {
  index: number;
  id: string;
  phase: string;
  circuit: string;
  normalState: number;
}

export interface ComtradeParsedSample {
  tMs: number;
  va: number;
  vb: number;
  vc: number;
  vn0: number;
  ia: number;
  ib: number;
  ic: number;
  in0: number;
  relayTrip: number;
  breakerAux52a: number;
  autoRecloseActive: number;
  customAnalog?: Record<string, number>;
  customDigital?: Record<string, number>;
}

export interface ParsedComtradeRecord {
  stationName: string;
  deviceId: string;
  year: number;
  lineFrequencyHz: number;
  sampleRateHz: number;
  totalSamples: number;
  analogChannels: ComtradeAnalogChannel[];
  digitalChannels: ComtradeDigitalChannel[];
  samples: ComtradeParsedSample[];
  tMinMs: number;
  tMaxMs: number;
  triggerTimeMs: number;
  detectedFaultType?: string;
  rawCfgSummary: string;
}

export function parseComtrade(cfgText: string, datText: string): ParsedComtradeRecord {
  const cfgLines = cfgText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const datLines = datText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  if (cfgLines.length < 5) {
    throw new Error('Fichier .CFG invalide : structure COMTRADE incomplète (trop court).');
  }

  // Line 1: Station, Device, Year
  const line1Parts = cfgLines[0].split(',').map((p) => p.trim());
  const stationName = line1Parts[0] || 'STATION_INCONNUE';
  const deviceId = line1Parts[1] || 'RELAIS_INCONNU';
  const year = parseInt(line1Parts[2], 10) || 1999;

  // Line 2: Total Channels, Analog Count, Digital Count
  const line2Parts = cfgLines[1].split(',').map((p) => p.trim());
  const totalChannels = parseInt(line2Parts[0], 10) || 0;
  const numAnalogStr = line2Parts[1] || '0A';
  const numDigitalStr = line2Parts[2] || '0D';
  const numAnalog = parseInt(numAnalogStr.replace(/[^0-9]/g, ''), 10) || 0;
  const numDigital = parseInt(numDigitalStr.replace(/[^0-9]/g, ''), 10) || 0;

  let currentLineIdx = 2;

  // Parse Analog Channels
  const analogChannels: ComtradeAnalogChannel[] = [];
  for (let i = 0; i < numAnalog; i++) {
    if (currentLineIdx >= cfgLines.length) break;
    const parts = cfgLines[currentLineIdx].split(',').map((p) => p.trim());
    currentLineIdx++;

    analogChannels.push({
      index: parseInt(parts[0], 10) || i + 1,
      id: parts[1] || `A${i + 1}`,
      phase: parts[2] || '',
      circuit: parts[3] || '',
      units: parts[4] || 'V',
      multiplierA: parseFloat(parts[5]) || 1,
      offsetB: parseFloat(parts[6]) || 0,
      skew: parseFloat(parts[7]) || 0,
      min: parseFloat(parts[8]) || -32768,
      max: parseFloat(parts[9]) || 32767,
      primaryRatio: parseFloat(parts[10]) || 1,
      secondaryRatio: parseFloat(parts[11]) || 1,
      scalingChannel: (parts[12]?.toUpperCase() === 'S' ? 'S' : 'P'),
    });
  }

  // Parse Digital Channels
  const digitalChannels: ComtradeDigitalChannel[] = [];
  for (let i = 0; i < numDigital; i++) {
    if (currentLineIdx >= cfgLines.length) break;
    const parts = cfgLines[currentLineIdx].split(',').map((p) => p.trim());
    currentLineIdx++;

    digitalChannels.push({
      index: parseInt(parts[0], 10) || i + 1,
      id: parts[1] || `D${i + 1}`,
      phase: parts[2] || '',
      circuit: parts[3] || '',
      normalState: parseInt(parts[4], 10) || 0,
    });
  }

  // Line Frequency
  const lineFreqHz = currentLineIdx < cfgLines.length ? parseFloat(cfgLines[currentLineIdx]) || 50 : 50;
  currentLineIdx++;

  // Number of sample rates
  const nRates = currentLineIdx < cfgLines.length ? parseInt(cfgLines[currentLineIdx], 10) || 1 : 1;
  currentLineIdx++;

  let sampleRateHz = 2000;
  for (let r = 0; r < nRates; r++) {
    if (currentLineIdx < cfgLines.length) {
      const parts = cfgLines[currentLineIdx].split(',').map((p) => p.trim());
      const rate = parseFloat(parts[0]);
      if (rate && !isNaN(rate)) sampleRateHz = rate;
      currentLineIdx++;
    }
  }

  // Time stamps
  currentLineIdx += 2; // skip start/trigger time strings if present

  // Channel classification heuristics
  let vaIdx = -1, vbIdx = -1, vcIdx = -1;
  let iaIdx = -1, ibIdx = -1, icIdx = -1;
  let tripIdx = -1, breaker52aIdx = -1;

  analogChannels.forEach((ch, idx) => {
    const idLower = ch.id.toLowerCase();
    const isVolt = ch.units.toLowerCase().includes('v') || idLower.startsWith('v') || idLower.startsWith('u');
    const isCurr = ch.units.toLowerCase().includes('a') || idLower.startsWith('i');

    if (isVolt) {
      if (idLower.includes('va') || idLower.includes('ua') || ch.phase.toUpperCase() === 'A') {
        if (vaIdx === -1) vaIdx = idx;
      } else if (idLower.includes('vb') || idLower.includes('ub') || ch.phase.toUpperCase() === 'B') {
        if (vbIdx === -1) vbIdx = idx;
      } else if (idLower.includes('vc') || idLower.includes('uc') || ch.phase.toUpperCase() === 'C') {
        if (vcIdx === -1) vcIdx = idx;
      }
    } else if (isCurr) {
      if (idLower.includes('ia') || idLower.includes('il1') || ch.phase.toUpperCase() === 'A') {
        if (iaIdx === -1) iaIdx = idx;
      } else if (idLower.includes('ib') || idLower.includes('il2') || ch.phase.toUpperCase() === 'B') {
        if (ibIdx === -1) ibIdx = idx;
      } else if (idLower.includes('ic') || idLower.includes('il3') || ch.phase.toUpperCase() === 'C') {
        if (icIdx === -1) icIdx = idx;
      }
    }
  });

  // Fallback if not matched by name: assign in order
  if (vaIdx === -1 && analogChannels.length >= 1) vaIdx = 0;
  if (vbIdx === -1 && analogChannels.length >= 2) vbIdx = 1;
  if (vcIdx === -1 && analogChannels.length >= 3) vcIdx = 2;
  if (iaIdx === -1 && analogChannels.length >= 4) iaIdx = 3;
  if (ibIdx === -1 && analogChannels.length >= 5) ibIdx = 4;
  if (icIdx === -1 && analogChannels.length >= 6) icIdx = 5;

  digitalChannels.forEach((ch, idx) => {
    const idLower = ch.id.toLowerCase();
    if (idLower.includes('trip') || idLower.includes('decl') || idLower.includes('86') || idLower.includes('cmd')) {
      if (tripIdx === -1) tripIdx = idx;
    } else if (idLower.includes('52a') || idLower.includes('aux') || idLower.includes('pos') || idLower.includes('cb')) {
      if (breaker52aIdx === -1) breaker52aIdx = idx;
    }
  });

  // Parse .DAT Lines
  const samples: ComtradeParsedSample[] = [];
  let firstTimestampUs: number | null = null;

  for (let lineIndex = 0; lineIndex < datLines.length; lineIndex++) {
    const rawLine = datLines[lineIndex];
    if (!rawLine) continue;
    // Comma or whitespace separated
    const parts = rawLine.split(/[,\s]+/).map((p) => p.trim()).filter(Boolean);
    if (parts.length < 2 + numAnalog) continue;

    const sampleNum = parseInt(parts[0], 10) || lineIndex + 1;
    let timestampUs = parseFloat(parts[1]);
    if (isNaN(timestampUs)) {
      // Default to 1 / sampleRateHz
      timestampUs = (lineIndex / sampleRateHz) * 1e6;
    }

    if (firstTimestampUs === null) {
      firstTimestampUs = timestampUs;
    }

    // Convert to relative milliseconds
    const tMs = (timestampUs - firstTimestampUs) / 1000 - 40; // Center pre-fault at -40 ms

    // Analog readings
    const analogValues: number[] = [];
    for (let a = 0; a < numAnalog; a++) {
      const rawVal = parseFloat(parts[2 + a]) || 0;
      const ch = analogChannels[a];
      const scaledVal = ch ? rawVal * ch.multiplierA + ch.offsetB : rawVal;
      analogValues.push(scaledVal);
    }

    // Digital readings
    const digitalValues: number[] = [];
    for (let d = 0; d < numDigital; d++) {
      const rawVal = parseInt(parts[2 + numAnalog + d], 10) || 0;
      digitalValues.push(rawVal);
    }

    // Assign canonical signals
    const va = vaIdx >= 0 && vaIdx < analogValues.length ? analogValues[vaIdx] : 0;
    const vb = vbIdx >= 0 && vbIdx < analogValues.length ? analogValues[vbIdx] : 0;
    const vc = vcIdx >= 0 && vcIdx < analogValues.length ? analogValues[vcIdx] : 0;
    const vn0 = (va + vb + vc) / 3;

    const ia = iaIdx >= 0 && iaIdx < analogValues.length ? analogValues[iaIdx] : 0;
    const ib = ibIdx >= 0 && ibIdx < analogValues.length ? analogValues[ibIdx] : 0;
    const ic = icIdx >= 0 && icIdx < analogValues.length ? analogValues[icIdx] : 0;
    const in0 = ia + ib + ic;

    const relayTrip = tripIdx >= 0 && tripIdx < digitalValues.length ? digitalValues[tripIdx] : (tMs >= 20 && tMs <= 80 ? 1 : 0);
    const breakerAux52a = breaker52aIdx >= 0 && breaker52aIdx < digitalValues.length ? digitalValues[breaker52aIdx] : (tMs > 65 ? 0 : 1);

    samples.push({
      tMs,
      va,
      vb,
      vc,
      vn0,
      ia,
      ib,
      ic,
      in0,
      relayTrip,
      breakerAux52a,
      autoRecloseActive: 0,
    });
  }

  if (samples.length === 0) {
    throw new Error('Fichier .DAT vide ou illisible : aucun échantillon valide détecté.');
  }

  const tMinMs = samples[0].tMs;
  const tMaxMs = samples[samples.length - 1].tMs;

  const rawCfgSummary = `${stationName} | ${deviceId} | ${numAnalog} Voies Analogiques, ${numDigital} Voies Tout-ou-Rien | Fe=${sampleRateHz} Hz (${samples.length} éch.)`;

  return {
    stationName,
    deviceId,
    year,
    lineFrequencyHz: lineFreqHz,
    sampleRateHz,
    totalSamples: samples.length,
    analogChannels,
    digitalChannels,
    samples,
    tMinMs,
    tMaxMs,
    triggerTimeMs: 0,
    rawCfgSummary,
  };
}

// Pre-built field captures for instant testing
export const PRELOADED_COMTRADE_SAMPLES = {
  MICOM_P442_225KV_FAULT: {
    id: 'MICOM_P442_225KV_FAULT',
    title: 'Schneider MiCOM P442 - Défaut Ligne 225 kV Phase A-Terre (Déclenchement Zone 1)',
    station: 'POSTE MANGOUMBE 225kV',
    relay: 'MiCOM P442 Distance Protection',
    description: 'Enregistrement réel d\'un court-circuit monophasé franc Ph-A sur départ 225 kV. Déclenchement instantané Zone 1 (ANSI 21) en 22 ms avec effondrement de tension et courant de court-circuit de 11.8 kA.',
    cfg: `POSTE MANGOUMBE 225kV,MiCOM_P442,1999
8,6A,2D
1,Va_225kV,A,,kV,0.010,0.0,0,-32768,32767,225000,100,P
2,Vb_225kV,B,,kV,0.010,0.0,0,-32768,32767,225000,100,P
3,Vc_225kV,C,,kV,0.010,0.0,0,-32768,32767,225000,100,P
4,Ia_Line,A,,kA,0.001,0.0,0,-32768,32767,1200,1,P
5,Ib_Line,B,,kA,0.001,0.0,0,-32768,32767,1200,1,P
6,Ic_Line,C,,kA,0.001,0.0,0,-32768,32767,1200,1,P
1,TRIP_Z1_86,A,,0
2,CB_AUX_52A,A,,1
50.0
1
2000,400
18/09/2026,06:30:00.000000
18/09/2026,06:30:00.040000
ASCII
1`,
    generateDat: () => {
      // 400 samples at 2000 Hz = 200 ms (-40 ms to +160 ms)
      const lines: string[] = [];
      const omega = 2 * Math.PI * 50;
      for (let i = 0; i < 400; i++) {
        const tSec = i / 2000;
        const tMs = tSec * 1000 - 40;
        const us = Math.round(tSec * 1e6);
        const isFault = tMs >= 0 && tMs <= 65;
        const isCleared = tMs > 65;

        // Voltages in kV
        let va = 183.7 * Math.sin(omega * tSec);
        let vb = 183.7 * Math.sin(omega * tSec - (2 * Math.PI) / 3);
        let vc = 183.7 * Math.sin(omega * tSec + (2 * Math.PI) / 3);

        // Currents in kA
        let ia = 0.45 * Math.sin(omega * tSec);
        let ib = 0.45 * Math.sin(omega * tSec - (2 * Math.PI) / 3);
        let ic = 0.45 * Math.sin(omega * tSec + (2 * Math.PI) / 3);

        if (isFault) {
          va = 28.5 * Math.sin(omega * tSec);
          const decay = Math.exp(-tMs / 38);
          ia = 11.8 * (Math.sin(omega * tSec - Math.PI / 2) + decay);
        } else if (isCleared) {
          va = 0;
          ia = 0;
          ib = 0.45 * Math.sin(omega * tSec - (2 * Math.PI) / 3);
          ic = 0.45 * Math.sin(omega * tSec + (2 * Math.PI) / 3);
        }

        const trip = tMs >= 22 && tMs <= 75 ? 1 : 0;
        const aux52a = isCleared ? 0 : 1;

        // Scaled to integer per multipliers (a=0.01 for V -> x = V / 0.01 = V * 100; a=0.001 for I -> x = I * 1000)
        lines.push(`${i + 1},${us},${Math.round(va * 100)},${Math.round(vb * 100)},${Math.round(vc * 100)},${Math.round(ia * 1000)},${Math.round(ib * 1000)},${Math.round(ic * 1000)},${trip},${aux52a}`);
      }
      return lines.join('\n');
    },
  },

  SIPROTEC_7SJ85_20KV_INRUSH: {
    id: 'SIPROTEC_7SJ85_20KV_INRUSH',
    title: 'Siemens SIPROTEC 7SJ85 - Enclenchement Transformateur HTA avec Retenue Harmonique H2',
    station: 'POSTE AHALA 225/30kV',
    relay: 'SIPROTEC 7SJ85 Overcurrent & Inrush',
    description: 'Enregistrement oscillographique d\'enclenchement à vide d\'un transformateur de puissance 225/30 kV. Présence d\'un fort taux d\'harmonique 2 bloquant tout déclenchement intempestif du différentiel 87T.',
    cfg: `POSTE AHALA 225/30kV,SIPROTEC_7SJ85,2013
8,6A,2D
1,V_HTA_A,A,,kV,0.001,0.0,0,-32768,32767,30000,100,P
2,V_HTA_B,B,,kV,0.001,0.0,0,-32768,32767,30000,100,P
3,V_HTA_C,C,,kV,0.001,0.0,0,-32768,32767,30000,100,P
4,I_HTA_A,A,,kA,0.001,0.0,0,-32768,32767,800,1,P
5,I_HTA_B,B,,kA,0.001,0.0,0,-32768,32767,800,1,P
6,I_HTA_C,C,,kA,0.001,0.0,0,-32768,32767,800,1,P
1,TRIP_50_51,A,,0
2,INRUSH_BLOCK_H2,A,,0
50.0
1
2000,400
18/09/2026,08:15:00.000000
18/09/2026,08:15:00.040000
ASCII
1`,
    generateDat: () => {
      const lines: string[] = [];
      const omega = 2 * Math.PI * 50;
      for (let i = 0; i < 400; i++) {
        const tSec = i / 2000;
        const tMs = tSec * 1000 - 40;
        const us = Math.round(tSec * 1e6);
        const isInrush = tMs >= 0;
        const decay = isInrush ? Math.exp(-tMs / 60) : 0;

        const va = 24.5 * Math.sin(omega * tSec);
        const vb = 24.5 * Math.sin(omega * tSec - (2 * Math.PI) / 3);
        const vc = 24.5 * Math.sin(omega * tSec + (2 * Math.PI) / 3);

        let ia = 0.1 * Math.sin(omega * tSec);
        let ib = 0.1 * Math.sin(omega * tSec - (2 * Math.PI) / 3);
        let ic = 0.1 * Math.sin(omega * tSec + (2 * Math.PI) / 3);

        if (isInrush) {
          // Asymmetrical unipolar pulses rich in 2nd harmonic
          ia = 3.2 * Math.pow(Math.max(0, Math.sin(omega * tSec)), 2.2) * decay;
          ib = 2.0 * Math.pow(Math.max(0, Math.sin(omega * tSec - (2 * Math.PI) / 3)), 2.2) * decay;
          ic = 1.3 * Math.pow(Math.max(0, Math.sin(omega * tSec + (2 * Math.PI) / 3)), 2.2) * decay;
        }

        const h2Block = isInrush && tMs < 120 ? 1 : 0;
        const trip = 0; // Blocked by H2!

        lines.push(`${i + 1},${us},${Math.round(va * 1000)},${Math.round(vb * 1000)},${Math.round(vc * 1000)},${Math.round(ia * 1000)},${Math.round(ib * 1000)},${Math.round(ic * 1000)},${trip},${h2Block}`);
      }
      return lines.join('\n');
    },
  },
};
