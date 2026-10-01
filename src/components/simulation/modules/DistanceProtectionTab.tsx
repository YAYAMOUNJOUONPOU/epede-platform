// src/components/simulation/modules/DistanceProtectionTab.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Target, 
  Activity, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Sliders, 
  Layers,
  Radio
} from 'lucide-react';

interface DistanceProtectionTabProps {
  locale: 'fr' | 'en';
}

export const DistanceProtectionTab: React.FC<DistanceProtectionTabProps> = ({ locale }) => {
  // 8. DISTANCE PROTECTION ANSI 21 (R-X COMPLEX PLANE) STATE
  // -------------------------------------------------------------
  const [distUnKv, setDistUnKv] = useState<number>(225); // 225 kV line (SONATREL)
  const [distLengthKm, setDistLengthKm] = useState<number>(120); // 120 km line (Mangombé - Ahala)
  const [distRPerKm, setDistRPerKm] = useState<number>(0.08); // Ω/km (Aster 570)
  const [distXPerKm, setDistXPerKm] = useState<number>(0.38); // Ω/km
  const [distCharType, setDistCharType] = useState<'mho' | 'quadrilateral'>('quadrilateral');
  const [distZ1ReachPct, setDistZ1ReachPct] = useState<number>(80); // 80% reach Zone 1
  const [distZ2ReachPct, setDistZ2ReachPct] = useState<number>(120); // 120% reach Zone 2
  const [distZ3ReachPct, setDistZ3ReachPct] = useState<number>(180); // 180% reach Zone 3
  const [distFaultLocPct, setDistFaultLocPct] = useState<number>(65); // 65% location along line
  const [distFaultRarc, setDistFaultRarc] = useState<number>(4.0); // 4 Ω arc resistance
  const [distLoadMw, setDistLoadMw] = useState<number>(180); // 180 MW line load
  const [distLoadPf, setDistLoadPf] = useState<number>(0.95); // cos phi = 0.95 inductive

  const distCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Line Impedance calculations
  const rLineTotal = distLengthKm * distRPerKm;
  const xLineTotal = distLengthKm * distXPerKm;
  const zLineMag = Math.hypot(rLineTotal, xLineTotal);
  const lineAngleRad = Math.atan2(xLineTotal, rLineTotal);
  const lineAngleDeg = (lineAngleRad * 180) / Math.PI;

  // Reach impedances
  const z1Mag = (distZ1ReachPct / 100) * zLineMag;
  const z2Mag = (distZ2ReachPct / 100) * zLineMag;
  const z3Mag = (distZ3ReachPct / 100) * zLineMag;

  // Fault apparent impedance
  const rFault = (distFaultLocPct / 100) * rLineTotal + distFaultRarc;
  const xFault = (distFaultLocPct / 100) * xLineTotal;
  const zFaultMag = Math.hypot(rFault, xFault);
  const zFaultAngleDeg = (Math.atan2(xFault, rFault) * 180) / Math.PI;

  // Load impedance calculations (primary ohms)
  const sLoadMva = distLoadMw / distLoadPf;
  const uMinKv = distUnKv * 0.95;
  const zLoadMag = (uMinKv * uMinKv) / Math.max(1, sLoadMva);
  const sinPhiLoad = Math.sin(Math.acos(Math.min(1, distLoadPf)));
  const rLoad = zLoadMag * distLoadPf;
  const xLoad = zLoadMag * sinPhiLoad;

  // Zone Evaluation helper
  const checkInsideZone = (r: number, x: number, reachMag: number): boolean => {
    if (x < 0) return false; // Strict forward directional supervision
    if (distCharType === 'mho') {
      const rCenter = (reachMag / 2) * Math.cos(lineAngleRad);
      const xCenter = (reachMag / 2) * Math.sin(lineAngleRad);
      const radius = reachMag / 2;
      return Math.hypot(r - rCenter, x - xCenter) <= radius;
    } else {
      const xReach = reachMag * Math.sin(lineAngleRad);
      const rReachForward = reachMag * Math.cos(lineAngleRad) + 12;
      if (x > xReach) return false;
      if (r < -4) return false;
      return r <= rReachForward;
    }
  };

  const isFaultInZ1 = checkInsideZone(rFault, xFault, z1Mag);
  const isFaultInZ2 = !isFaultInZ1 && checkInsideZone(rFault, xFault, z2Mag);
  const isFaultInZ3 = !isFaultInZ1 && !isFaultInZ2 && checkInsideZone(rFault, xFault, z3Mag);

  const tripStatus = isFaultInZ1 
    ? { code: 'TRIP_Z1', label: locale === 'fr' ? 'DÉCLENCHEMENT ZONE 1 (INSTANTANÉ)' : 'TRIP ZONE 1 (INSTANTANEOUS)', timeMs: 20, color: '#10B981', zone: 'Z1' }
    : isFaultInZ2
    ? { code: 'TRIP_Z2', label: locale === 'fr' ? 'DÉCLENCHEMENT ZONE 2 (TEMPORISÉ)' : 'TRIP ZONE 2 (TIME-DELAYED)', timeMs: 350, color: '#06B6D4', zone: 'Z2' }
    : isFaultInZ3
    ? { code: 'TRIP_Z3', label: locale === 'fr' ? 'DÉCLENCHEMENT ZONE 3 (SECOURS DISTANT)' : 'TRIP ZONE 3 (REMOTE BACKUP)', timeMs: 700, color: '#A855F7', zone: 'Z3' }
    : { code: 'STABLE', label: locale === 'fr' ? 'RÉGIME STABLE (HORS ZONE DE PROTECTION)' : 'SYSTEM STABLE (OUT OF ZONE)', timeMs: 0, color: '#64748B', zone: 'NONE' };

  const isLoadEncroachingZ3 = checkInsideZone(rLoad, xLoad, z3Mag);

  // Canvas R-X plane render loop
  useEffect(() => {
        const canvas = distCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let pulseAngle = 0;

    const render = () => {
      const containerW = canvas.parentElement?.clientWidth;
      const w = (canvas.width = Math.max(320, containerW && containerW > 50 ? containerW : 700));
      const h = (canvas.height = 420);

      // Coordinate scaling
      const padL = 55;
      const padR = 25;
      const padT = 30;
      const padB = 45;
      const plotW = Math.max(100, w - padL - padR);
      const plotH = Math.max(100, h - padT - padB);

      const minR = -25;
      const maxR = 115;
      const minX = -15;
      const maxX = 100;

      const toScreenX = (r: number) => padL + ((r - minR) / (maxR - minR)) * plotW;
      const toScreenY = (x: number) => padT + plotH - ((x - minX) / (maxX - minX)) * plotH;

      // Dark background
      ctx.fillStyle = '#080B10';
      ctx.fillRect(0, 0, w, h);

      // Grid lines (every 10 ohms)
      ctx.lineWidth = 1;
      ctx.font = '9px ui-monospace, monospace';

      for (let r = -20; r <= 110; r += 10) {
        const sx = toScreenX(r);
        ctx.strokeStyle = r === 0 ? 'rgba(148, 163, 184, 0.45)' : 'rgba(37, 46, 56, 0.6)';
        ctx.beginPath();
        ctx.moveTo(sx, padT);
        ctx.lineTo(sx, padT + plotH);
        ctx.stroke();

        if (r % 20 === 0) {
          ctx.fillStyle = '#64748B';
          ctx.textAlign = 'center';
          ctx.fillText(`${r}`, sx, padT + plotH + 14);
        }
      }

      for (let x = -10; x <= 90; x += 10) {
        const sy = toScreenY(x);
        ctx.strokeStyle = x === 0 ? 'rgba(148, 163, 184, 0.45)' : 'rgba(37, 46, 56, 0.6)';
        ctx.beginPath();
        ctx.moveTo(padL, sy);
        ctx.lineTo(padL + plotW, sy);
        ctx.stroke();

        if (x % 20 === 0) {
          ctx.fillStyle = '#64748B';
          ctx.textAlign = 'right';
          ctx.fillText(`${x}`, padL - 8, sy + 3);
        }
      }

      // Axis labels
      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 10px ui-monospace, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('R (Résistance - Ohms)', padL + plotW / 2, padT + plotH + 34);

      ctx.save();
      ctx.translate(padL - 32, padT + plotH / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('X (Réactance - Ohms)', 0, 0);
      ctx.restore();

      // Draw Load Encroachment blinders / wedge
      const loadRMin = 45;
      const loadAngleRad = 35 * (Math.PI / 180);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.05)';
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(toScreenX(loadRMin), toScreenY(0));
      ctx.lineTo(toScreenX(maxR), toScreenY((maxR - loadRMin) * Math.tan(loadAngleRad)));
      ctx.lineTo(toScreenX(maxR), toScreenY(-(maxR - loadRMin) * Math.tan(loadAngleRad)));
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Zones (Z3, Z2, Z1) in reverse order for layering
      const zones = [
        { name: 'Z3', mag: z3Mag, color: '#A855F7', fill: 'rgba(168, 85, 247, 0.08)', time: '700 ms' },
        { name: 'Z2', mag: z2Mag, color: '#06B6D4', fill: 'rgba(6, 182, 212, 0.12)', time: '350 ms' },
        { name: 'Z1', mag: z1Mag, color: '#10B981', fill: 'rgba(16, 185, 129, 0.18)', time: '20 ms' },
      ];

      zones.forEach(z => {
        ctx.fillStyle = z.fill;
        ctx.strokeStyle = z.color;
        ctx.lineWidth = z.name === 'Z1' ? 2 : 1.5;

        if (distCharType === 'mho') {
          // Mho circle: diameter is z.mag along line angle
          const rCenter = (z.mag / 2) * Math.cos(lineAngleRad);
          const xCenter = (z.mag / 2) * Math.sin(lineAngleRad);
          const radPixels = (z.mag / 2) * (plotW / (maxR - minR));

          ctx.beginPath();
          ctx.arc(toScreenX(rCenter), toScreenY(xCenter), radPixels, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else {
          // Quadrilateral
          const xReach = z.mag * Math.sin(lineAngleRad);
          const rReach = z.mag * Math.cos(lineAngleRad) + 12;
          const rBlinderLeft = -4;

          ctx.beginPath();
          ctx.moveTo(toScreenX(rBlinderLeft), toScreenY(0));
          ctx.lineTo(toScreenX(rReach), toScreenY(0));
          ctx.lineTo(toScreenX(rReach), toScreenY(xReach));
          ctx.lineTo(toScreenX(rBlinderLeft), toScreenY(xReach));
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }

        // Zone label text
        const lblR = (z.mag * 0.9) * Math.cos(lineAngleRad);
        const lblX = (z.mag * 0.9) * Math.sin(lineAngleRad);
        ctx.fillStyle = z.color;
        ctx.font = 'bold 10px ui-monospace, monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`${z.name} (${z.time})`, toScreenX(lblR) + 6, toScreenY(lblX));
      });

      // Draw Transmission Line Vector Z_line (bright gold #FACC15)
      ctx.strokeStyle = '#FACC15';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(toScreenX(0), toScreenY(0));
      ctx.lineTo(toScreenX(rLineTotal), toScreenY(xLineTotal));
      ctx.stroke();

      // Line tip marker (end of line 100%)
      ctx.fillStyle = '#FACC15';
      ctx.beginPath();
      ctx.arc(toScreenX(rLineTotal), toScreenY(xLineTotal), 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FEF08A';
      ctx.font = 'bold 9px ui-monospace, monospace';
      ctx.fillText(`Ligne 100% (${distLengthKm} km)`, toScreenX(rLineTotal) + 6, toScreenY(xLineTotal) - 4);

      // Draw Normal Operating Load Point (Blue diamond)
      const loadScrX = toScreenX(rLoad);
      const loadScrY = toScreenY(xLoad);
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.moveTo(loadScrX, loadScrY - 6);
      ctx.lineTo(loadScrX + 6, loadScrY);
      ctx.lineTo(loadScrX, loadScrY + 6);
      ctx.lineTo(loadScrX - 6, loadScrY);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#0284C7';
      ctx.stroke();

      ctx.fillStyle = '#7DD3FC';
      ctx.font = '9px ui-monospace, monospace';
      ctx.fillText(`Charge Z_L (${distLoadMw} MW)`, loadScrX + 8, loadScrY + 3);

      // Draw Fault Point Z_fault with pulsing animation
      pulseAngle += 0.08;
      const faultScrX = toScreenX(rFault);
      const faultScrY = toScreenY(xFault);

      // Pulsing outer halo
      const pulseRad = 8 + Math.sin(pulseAngle) * 4;
      ctx.strokeStyle = tripStatus.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(faultScrX, faultScrY, pulseRad, 0, Math.PI * 2);
      ctx.stroke();

      // Inner solid fault dot
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(faultScrX, faultScrY, 4, 0, Math.PI * 2);
      ctx.fill();

      // Crosshair on fault
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(faultScrX - 8, faultScrY);
      ctx.lineTo(faultScrX + 8, faultScrY);
      ctx.moveTo(faultScrX, faultScrY - 8);
      ctx.lineTo(faultScrX, faultScrY + 8);
      ctx.stroke();

      // Text callout for fault
      ctx.fillStyle = '#F87171';
      ctx.font = 'bold 10px ui-monospace, monospace';
      ctx.fillText(
        `Défaut Z_f (${rFault.toFixed(1)} + j${xFault.toFixed(1)} Ω)`,
        faultScrX + 12,
        faultScrY - 6
      );

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [
    distLengthKm,
    distRPerKm,
    distXPerKm,
    distCharType,
    distZ1ReachPct,
    distZ2ReachPct,
    distZ3ReachPct,
    distFaultLocPct,
    distFaultRarc,
    distLoadMw,
    distLoadPf,
    rLineTotal,
    xLineTotal,
    zLineMag,
    lineAngleRad,
    z1Mag,
    z2Mag,
    z3Mag,
    rFault,
    xFault,
    rLoad,
    xLoad,
    tripStatus
  ]);

  return (
        <div className="space-y-6">
          {/* Top Status & Tripping Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div 
              className="p-4 rounded-xl border flex items-center gap-3 transition-all"
              style={{
                backgroundColor: `${tripStatus.color}15`,
                borderColor: `${tripStatus.color}60`
              }}
            >
              <div 
                className="w-3.5 h-3.5 rounded-full animate-ping"
                style={{ backgroundColor: tripStatus.color }}
              />
              <div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">
                  {locale === 'fr' ? 'STATUT DU RELAIS (CEI 60255-121)' : 'RELAY TRIP STATUS (IEC 60255-121)'}
                </div>
                <div className="text-sm font-bold font-mono" style={{ color: tripStatus.color }}>
                  {tripStatus.label}
                </div>
              </div>
            </div>

            <div className="bg-[#11161D] p-4 rounded-xl border border-[#252E38]">
              <div className="text-[10px] text-neutral-400 font-mono uppercase">
                {locale === 'fr' ? 'Temps de Fonctionnement' : 'Trip Time t_op'}
              </div>
              <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">
                {tripStatus.timeMs > 0 ? `${tripStatus.timeMs} ms` : '∞ (Aucun)'}
              </div>
              <div className="text-[10px] text-neutral-400 mt-1">
                {tripStatus.zone === 'Z1' ? 'Déclenchement instantané' : tripStatus.zone === 'Z2' ? 'Temporisation échelon 2' : tripStatus.zone === 'Z3' ? 'Temporisation échelon 3' : 'Hors zone de déclenchement'}
              </div>
            </div>

            <div className="bg-[#11161D] p-4 rounded-xl border border-[#252E38]">
              <div className="text-[10px] text-neutral-400 font-mono uppercase">
                {locale === 'fr' ? 'Impédance Apparente Défaut' : 'Fault Apparent Impedance'}
              </div>
              <div className="text-xl font-bold font-mono text-rose-400 mt-0.5">
                {zFaultMag.toFixed(2)} Ω
              </div>
              <div className="text-[10px] text-neutral-400 mt-1 font-mono">
                {rFault.toFixed(1)} + j{xFault.toFixed(1)} Ω (∠ {zFaultAngleDeg.toFixed(1)}°)
              </div>
            </div>

            <div className={`p-4 rounded-xl border transition-all ${
              isLoadEncroachingZ3 
                ? 'bg-amber-500/10 border-amber-500/50 text-amber-300' 
                : 'bg-[#11161D] border-[#252E38] text-neutral-400'
            }`}>
              <div className="text-[10px] font-mono uppercase">
                {locale === 'fr' ? 'Empiètement de Charge (Load Encroach)' : 'Load Encroachment Risk'}
              </div>
              <div className={`text-sm font-bold font-mono mt-0.5 ${isLoadEncroachingZ3 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {isLoadEncroachingZ3 ? 'ALERTE : RISQUE ZONE 3 !' : 'NORMAL / SÉCURISÉ'}
              </div>
              <div className="text-[10px] mt-1">
                Z_charge = {zLoadMag.toFixed(1)} Ω ({distLoadMw} MW @ cos φ {distLoadPf})
              </div>
            </div>
          </div>

          {/* Main Grid: R-X Canvas and Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: R-X Complex Plane Canvas */}
            <div className="lg:col-span-2 bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="flex flex-wrap items-center justify-between border-b border-[#252E38] pb-3 text-xs font-mono gap-2">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <span className="font-bold text-[#F3F4F6]">
                    {locale === 'fr' ? 'PLAN COMPLEXE D\'IMPÉDANCE R - X (CARACTÉRISTIQUES DE DÉCLENCHEMENT)' : 'R - X IMPEDANCE PLANE (TRIPPING CHARACTERISTICS)'}
                  </span>
                </div>
                
                {/* Characteristic Switch */}
                <div className="flex items-center gap-1 bg-[#161C24] p-1 rounded-lg border border-[#252E38]">
                  <button
                    type="button"
                    onClick={() => setDistCharType('quadrilateral')}
                    className={`px-3 py-1 rounded text-[11px] font-bold transition-all ${
                      distCharType === 'quadrilateral'
                        ? 'bg-rose-500 text-white shadow'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Quadrilatérale (CEI)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDistCharType('mho')}
                    className={`px-3 py-1 rounded text-[11px] font-bold transition-all ${
                      distCharType === 'mho'
                        ? 'bg-rose-500 text-white shadow'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Mho Circulaire
                  </button>
                </div>
              </div>

              {/* Responsive Canvas */}
              <div className="relative w-full overflow-hidden rounded-xl border border-[#252E38]/80 bg-[#080B10]">
                <canvas ref={distCanvasRef} className="w-full block" />
              </div>

              {/* R-X Interactive Legend */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] font-mono">
                <div className="p-2.5 rounded-lg bg-[#11161D] border border-emerald-500/30 flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500 shrink-0" />
                  <div>
                    <div className="font-bold text-emerald-400">Zone 1 ({distZ1ReachPct}%)</div>
                    <div className="text-[10px] text-neutral-400">t = 20 ms · {z1Mag.toFixed(1)} Ω</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#11161D] border border-cyan-500/30 flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-cyan-500/30 border border-cyan-500 shrink-0" />
                  <div>
                    <div className="font-bold text-cyan-400">Zone 2 ({distZ2ReachPct}%)</div>
                    <div className="text-[10px] text-neutral-400">t = 350 ms · {z2Mag.toFixed(1)} Ω</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#11161D] border border-purple-500/30 flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-purple-500/30 border border-purple-500 shrink-0" />
                  <div>
                    <div className="font-bold text-purple-400">Zone 3 ({distZ3ReachPct}%)</div>
                    <div className="text-[10px] text-neutral-400">t = 700 ms · {z3Mag.toFixed(1)} Ω</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#11161D] border border-yellow-500/30 flex items-center gap-2">
                  <div className="w-3 h-1 bg-yellow-400 shrink-0" />
                  <div>
                    <div className="font-bold text-yellow-400">Ligne HTB (100%)</div>
                    <div className="text-[10px] text-neutral-400">{zLineMag.toFixed(1)} Ω (∠ {lineAngleDeg.toFixed(1)}°)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 1 Col: Fault Injection & Line Parameters */}
            <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-2xl space-y-5">
              <div className="border-b border-[#252E38] pb-3 flex items-center justify-between">
                <span className="font-bold text-sm text-[#F3F4F6] font-mono">
                  {locale === 'fr' ? 'SIMULATEUR DE DÉFAUT & RÉSEAU' : 'FAULT & NETWORK INJECTION'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/10 text-rose-400 font-mono font-bold">
                  ANSI 21 / 21N
                </span>
              </div>

              {/* Presets */}
              <div>
                <label className="text-[10px] text-neutral-400 font-mono uppercase block mb-1">
                  {locale === 'fr' ? 'Profils de Réseau Réels :' : 'Real Grid Line Presets:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDistUnKv(225);
                      setDistLengthKm(120);
                      setDistRPerKm(0.08);
                      setDistXPerKm(0.38);
                      setDistLoadMw(180);
                    }}
                    className="p-1.5 rounded-lg bg-[#161C24] border border-[#252E38] hover:border-cyan-400 text-left transition-all"
                  >
                    <div className="text-[10px] font-bold text-white">225 kV SONATREL</div>
                    <div className="text-[9px] text-neutral-400">120 km · Aster 570</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDistUnKv(400);
                      setDistLengthKm(220);
                      setDistRPerKm(0.03);
                      setDistXPerKm(0.31);
                      setDistLoadMw(650);
                    }}
                    className="p-1.5 rounded-lg bg-[#161C24] border border-[#252E38] hover:border-cyan-400 text-left transition-all"
                  >
                    <div className="text-[10px] font-bold text-white">400 kV Interco</div>
                    <div className="text-[9px] text-neutral-400">220 km · Faisceau x2</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDistUnKv(90);
                      setDistLengthKm(45);
                      setDistRPerKm(0.18);
                      setDistXPerKm(0.39);
                      setDistLoadMw(45);
                    }}
                    className="p-1.5 rounded-lg bg-[#161C24] border border-[#252E38] hover:border-cyan-400 text-left transition-all"
                  >
                    <div className="text-[10px] font-bold text-white">90 kV Régional</div>
                    <div className="text-[9px] text-neutral-400">45 km · Almélec 148</div>
                  </button>
                </div>
              </div>

              {/* Fault Position Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neutral-300 font-bold">{locale === 'fr' ? 'Position du Défaut :' : 'Fault Location:'}</span>
                  <span className="text-rose-400 font-bold">
                    {distFaultLocPct}% ({((distFaultLocPct / 100) * distLengthKm).toFixed(1)} km)
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="150"
                  step="1"
                  value={distFaultLocPct}
                  onChange={(e) => setDistFaultLocPct(parseFloat(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                  <span>0% (Poste Local)</span>
                  <span>100% (Poste Distant)</span>
                  <span>150% (Ligne Suivante)</span>
                </div>
              </div>

              {/* Arc Resistance Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neutral-300 font-bold">{locale === 'fr' ? 'Résistance d\'Arc R_arc :' : 'Arc Resistance R_arc:'}</span>
                  <span className="text-amber-400 font-bold">{distFaultRarc.toFixed(1)} Ω</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="0.5"
                  value={distFaultRarc}
                  onChange={(e) => setDistFaultRarc(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                  <span>0 Ω (Franch)</span>
                  <span>10 Ω (Arc typique)</span>
                  <span>25 Ω (Végétation)</span>
                </div>
              </div>

              {/* Line & Load Inputs */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#252E38] text-xs font-mono">
                <div>
                  <label className="text-[10px] text-neutral-400 block">{locale === 'fr' ? 'Tension Nominale (kV) :' : 'Voltage Un (kV):'}</label>
                  <input
                    type="number"
                    value={distUnKv}
                    onChange={(e) => setDistUnKv(parseFloat(e.target.value) || 225)}
                    className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-2.5 py-1 text-white font-bold mt-1 focus:border-rose-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-neutral-400 block">{locale === 'fr' ? 'Longueur Ligne (km) :' : 'Line Length (km):'}</label>
                  <input
                    type="number"
                    value={distLengthKm}
                    onChange={(e) => setDistLengthKm(parseFloat(e.target.value) || 120)}
                    className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-2.5 py-1 text-white font-bold mt-1 focus:border-rose-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-neutral-400 block">{locale === 'fr' ? 'Puissance Transit (MW) :' : 'Active Load (MW):'}</label>
                  <input
                    type="number"
                    value={distLoadMw}
                    onChange={(e) => setDistLoadMw(parseFloat(e.target.value) || 180)}
                    className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-2.5 py-1 text-white font-bold mt-1 focus:border-rose-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-neutral-400 block">{locale === 'fr' ? 'Facteur de Puissance cos φ :' : 'Power Factor cos φ:'}</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.7"
                    max="1"
                    value={distLoadPf}
                    onChange={(e) => setDistLoadPf(parseFloat(e.target.value) || 0.95)}
                    className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-2.5 py-1 text-white font-bold mt-1 focus:border-rose-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Zone Reach Settings */}
              <div className="pt-2 border-t border-[#252E38] space-y-2 font-mono text-[11px]">
                <div className="text-neutral-400 font-bold uppercase text-[10px]">
                  {locale === 'fr' ? 'Réglages des Portées de Zones :' : 'Zone Reach Settings:'}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 rounded bg-[#161C24] border border-[#252E38] text-center">
                    <span className="text-emerald-400 font-bold block">Zone 1</span>
                    <span className="text-white text-xs">{distZ1ReachPct}%</span>
                    <span className="text-[9px] text-neutral-500 block">20 ms</span>
                  </div>
                  <div className="p-2 rounded bg-[#161C24] border border-[#252E38] text-center">
                    <span className="text-cyan-400 font-bold block">Zone 2</span>
                    <span className="text-white text-xs">{distZ2ReachPct}%</span>
                    <span className="text-[9px] text-neutral-500 block">350 ms</span>
                  </div>
                  <div className="p-2 rounded bg-[#161C24] border border-[#252E38] text-center">
                    <span className="text-purple-400 font-bold block">Zone 3</span>
                    <span className="text-white text-xs">{distZ3ReachPct}%</span>
                    <span className="text-[9px] text-neutral-500 block">700 ms</span>
                  </div>
                </div>
              </div>

              {/* Quick Theoretical Principles */}
              <div className="p-3 rounded-lg bg-[#080B10] border border-[#252E38] space-y-1 font-mono text-[10px]">
                <div className="text-rose-400 font-bold mb-1">{locale === 'fr' ? 'Principes ANSI 21 (CEI 60255-121) :' : 'ANSI 21 Principles:'}</div>
                <div className="text-neutral-400">• Z_app = U_rel / I_rel = R_f + jX_f</div>
                <div className="text-neutral-400">• Zone 1 réglée à 80-85% pour éviter les déclenchements intempestifs</div>
                <div className="text-neutral-400">• Zone 2 (120%) couvre l'extrémité et temporise à 350 ms</div>
                <div className="text-neutral-400">• La caractéristique Quadrilatérale améliore la tolérance à la résistance d'arc</div>
              </div>
            </div>
          </div>
        </div>
  );
};
