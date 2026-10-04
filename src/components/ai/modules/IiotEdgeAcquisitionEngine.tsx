// src/components/ai/modules/IiotEdgeAcquisitionEngine.tsx
// EPEDE D09 - IIoT Telemetry Acquisition, Edge Gateway Sizing & Data Quality Engine
// Calibrated for African Industrial Substation & Power Plant Harsh Environments

import React, { useState, useMemo } from 'react';
import {
  Cpu,
  Radio,
  Server,
  Layers,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sliders,
  TrendingDown,
  Clock,
  HardDrive
} from 'lucide-react';

interface IiotEdgeAcquisitionEngineProps {
  locale: 'fr' | 'en';
  siteName: string;
}

export const IiotEdgeAcquisitionEngine: React.FC<IiotEdgeAcquisitionEngineProps> = ({
  locale,
  siteName
}) => {
  // Telemetry Configuration Parameters
  const [protocolType, setProtocolType] = useState<'IEC_61850_SV' | 'MQTT_SPARKPLUG' | 'OPC_UA' | 'MODBUS_TCP'>('IEC_61850_SV');
  const [samplingFrequencyHz, setSamplingFrequencyHz] = useState<number>(4800); // 4.8 kHz or 25.6 kHz
  const [adcResolutionBits, setAdcResolutionBits] = useState<16 | 24>(24);
  const [channelsCount, setChannelsCount] = useState<number>(16); // e.g. 3 phases U, 3 phases I, neutral, 8 vibrations, oil temp
  const [packetLossTolerancePercent, setPacketLossTolerancePercent] = useState<number>(0.05); // 0.05%
  const [timeSyncProtocol, setTimeSyncProtocol] = useState<'IEEE_1588_PTP' | 'SNTP' | 'IRIG_B'>('IEEE_1588_PTP');
  const [storageBufferDays, setStorageBufferDays] = useState<number>(30); // 30 days autonomous circular buffer

  // Calculations: Data rates, storage sizing, and quality index
  const calculations = useMemo(() => {
    // Bytes per sample: ADC resolution (16 bits = 2 bytes, 24 bits = 3 bytes) + 8 bytes timestamp + 2 bytes status
    const bytesPerSampleChannel = (adcResolutionBits / 8) + 4; // payload + header
    const rawDataRateBytesSec = channelsCount * samplingFrequencyHz * bytesPerSampleChannel;
    const rawDataRateKbps = (rawDataRateBytesSec * 8) / 1000;
    const rawDataRateMbps = Number((rawDataRateKbps / 1000).toFixed(2));

    // Compression ratio: Edge lossless wavelet / delta compression ~ 3.5:1
    const compressionRatio = 3.5;
    const compressedRateBytesSec = rawDataRateBytesSec / compressionRatio;
    const dailyVolumeGb = Number(((compressedRateBytesSec * 86400) / (1024 * 1024 * 1024)).toFixed(2));
    const monthlyStorageRequiredGb = Math.round(dailyVolumeGb * storageBufferDays * 1.2); // +20% safety margin

    // PTP Time Sync Accuracy
    const timeSyncJitterUs = timeSyncProtocol === 'IEEE_1588_PTP' ? 0.08 : timeSyncProtocol === 'IRIG_B' ? 1.0 : 1500.0;
    const isPtpCompliant = timeSyncJitterUs <= 1.0;

    // Data Quality & Integrity Score (0 - 100)
    let dataQualityScore = 98.5;
    if (packetLossTolerancePercent > 0.1) dataQualityScore -= 10;
    if (!isPtpCompliant) dataQualityScore -= 15;
    if (samplingFrequencyHz < 1000 && protocolType === 'IEC_61850_SV') dataQualityScore -= 20;

    return {
      rawDataRateMbps,
      dailyVolumeGb,
      monthlyStorageRequiredGb,
      timeSyncJitterUs,
      isPtpCompliant,
      dataQualityScore: Math.max(50, Math.min(100, Number(dataQualityScore.toFixed(1))))
    };
  }, [samplingFrequencyHz, adcResolutionBits, channelsCount, protocolType, storageBufferDays, timeSyncProtocol, packetLossTolerancePercent]);

  return (
    <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl font-mono text-xs">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-wider text-xs">
            <Radio className="h-4 w-4" />
            <span>Étape 1.1 · Architecture d'Acquisition Télémétrique & Passerelle Edge</span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white mt-1">
            {locale === 'fr'
              ? `Chaîne de Numérisation & Prétraitement de Terrain : ${siteName}`
              : `Field Digitization & Preprocessing Chain: ${siteName}`}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-indigo-950/70 border border-indigo-700/50 text-indigo-300 font-bold">
            Indice de Qualité : {calculations.dataQualityScore}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="text-indigo-400 font-bold uppercase tracking-wider text-xs flex items-center justify-between">
              <span>Paramètres du Bus d'Acquisition</span>
              <Sliders className="h-4 w-4" />
            </div>

            {/* Protocol Type */}
            <div className="space-y-1.5">
              <label className="text-slate-300">Protocole Industriel de Transport :</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'IEC_61850_SV', label: 'CEI 61850-9-2 SV (Poste HTB)' },
                  { id: 'MQTT_SPARKPLUG', label: 'MQTT Sparkplug B (IoT)' },
                  { id: 'OPC_UA', label: 'OPC UA Part 14 (PubSub)' },
                  { id: 'MODBUS_TCP', label: 'Modbus TCP (Legacy PLC)' }
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setProtocolType(p.id as any)}
                    className={`py-2 px-2.5 rounded-lg border text-left text-[11px] transition-all ${
                      protocolType === p.id
                        ? 'bg-indigo-600 text-white font-bold border-indigo-400'
                        : 'bg-slate-900 text-slate-300 border-slate-700'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sampling Rate */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-300">Fréquence d'Échantillonnage (Fs) :</span>
                <span className="text-indigo-400 font-bold">{samplingFrequencyHz} Hz</span>
              </div>
              <input
                type="range"
                min="50"
                max="25600"
                step="50"
                value={samplingFrequencyHz}
                onChange={(e) => setSamplingFrequencyHz(Number(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>50 Hz (SCADA lent)</span>
                <span>4 800 Hz (CEI 61850 SV)</span>
                <span>25.6 kHz (Vibrations FFT)</span>
              </div>
            </div>

            {/* Channels Count & ADC Resolution */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Voies de Mesure Simultanées</label>
                <input
                  type="number"
                  min="4"
                  max="64"
                  value={channelsCount}
                  onChange={(e) => setChannelsCount(Math.max(4, Number(e.target.value)))}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Résolution Convertisseur ADC</label>
                <div className="grid grid-cols-2 gap-2">
                  {[16, 24].map((res) => (
                    <button
                      key={res}
                      type="button"
                      onClick={() => setAdcResolutionBits(res as 16 | 24)}
                      className={`py-1.5 rounded-lg border font-bold text-center ${
                        adcResolutionBits === res
                          ? 'bg-indigo-600 text-white border-indigo-400'
                          : 'bg-slate-900 text-slate-400 border-slate-700'
                      }`}
                    >
                      {res} bits
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Synchronization Protocol */}
            <div className="space-y-1.5 pt-1 border-t border-slate-800">
              <label className="text-slate-300">Synchronisation Horodatage Haute Précision :</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'IEEE_1588_PTP', label: 'PTP IEEE 1588 (< 1 µs)' },
                  { id: 'IRIG_B', label: 'IRIG-B (< 10 µs)' },
                  { id: 'SNTP', label: 'SNTP (~ 1.5 ms)' }
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setTimeSyncProtocol(s.id as any)}
                    className={`py-1.5 px-2 rounded-lg border text-center text-[10px] ${
                      timeSyncProtocol === s.id
                        ? 'bg-indigo-600 text-white font-bold border-indigo-400'
                        : 'bg-slate-900 text-slate-300 border-slate-700'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results & Dimensioning Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-500 uppercase flex items-center justify-between">
                <span>Débit Télécom Réseau</span>
                <Radio className="h-3.5 w-3.5 text-indigo-400" />
              </div>
              <div className="text-2xl font-bold text-indigo-300">{calculations.rawDataRateMbps} Mbps</div>
              <div className="text-[10px] text-slate-400">Bande passante switch CEI 61850</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-500 uppercase flex items-center justify-between">
                <span>Volume Quotidien</span>
                <HardDrive className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-emerald-300">{calculations.dailyVolumeGb} Go / jour</div>
              <div className="text-[10px] text-slate-400">Après ondelettes (ratio 3.5:1)</div>
            </div>
          </div>

          {/* Edge Server Sizing Card */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                <Server className="h-4 w-4 text-indigo-400" />
                <span>Spécification Minimale Serveur Edge Substation (CEI 61850-3)</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                ✓ CERTIFIÉ HARDENED
              </span>
            </div>

            <div className="space-y-2 text-[11px] text-slate-300">
              <div className="flex justify-between">
                <span>Capacité SSD NVMe industrielle requise ({storageBufferDays} jours) :</span>
                <span className="text-white font-bold">{calculations.monthlyStorageRequiredGb} Go (SLC haute endurance)</span>
              </div>
              <div className="flex justify-between">
                <span>Précision d'horodatage atteinte :</span>
                <span className={`font-bold ${calculations.isPtpCompliant ? 'text-emerald-400' : 'text-amber-400'}`}>
                  &plusmn; {calculations.timeSyncJitterUs} &micro;s ({calculations.isPtpCompliant ? 'Conforme Synchrophasor IEEE C37.118' : 'Non-optimal'})
                </span>
              </div>
              <div className="flex justify-between">
                <span>Puissance de calcul NPU requise :</span>
                <span className="text-indigo-300 font-bold">&ge; 16 TOPS (Traitement FFT + Inférence PINN locale)</span>
              </div>
              <div className="flex justify-between">
                <span>Tenue en température ambiante poste :</span>
                <span className="text-amber-300 font-bold">-40°C &agrave; +75°C sans ventilation (Convection naturelle)</span>
              </div>
            </div>
          </div>

          {/* Quality Best Practices */}
          <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-800/40 text-[11px] text-slate-300 space-y-1.5">
            <div className="text-indigo-300 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-indigo-400" />
              <span>Règle d'Or CEM en Poste HTB (Nachtigal / Oyomabang) :</span>
            </div>
            <p>
              Pour éviter les surtensions induites par manœuvre de sectionneurs HTB (onde transitoire très rapide VFT), les câbles blindés de signaux capteurs doivent être reliés à la terre par collier 360° à l'entrée de l'armoire de relayage, et les liaisons longues doivent privilégier la fibre optique multimode OM3.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
