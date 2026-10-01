// src/components/calculators/modules/ArcFlashCalculator.tsx
import React, { useState } from 'react';
import { Flame, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

interface ArcFlashCalculatorProps {
  locale: 'fr' | 'en';
  onOpenReport?: () => void;
}

export const ArcFlashCalculator: React.FC<ArcFlashCalculatorProps> = ({ locale, onOpenReport }) => {
  // 7. ARC FLASH INCIDENT ENERGY (IEEE 1584-2018 / NFPA 70E)
  const [arcVoltageV, setArcVoltageV] = useState<number>(400); // 400 V rated
  const [arcIbfKa, setArcIbfKa] = useState<number>(25); // 25 kA bolted fault
  const [arcWorkingDistMm, setArcWorkingDistMm] = useState<number>(457); // 18 inches = 457 mm
  const [arcDurationMs, setArcDurationMs] = useState<number>(100); // 100 ms trip time
  const [arcElectrodeConfig, setArcElectrodeConfig] = useState<'VCB' | 'VCBB' | 'HCB'>('VCB');
  const [arcGapMm, setArcGapMm] = useState<number>(32); // 32 mm busbar gap

  // IEEE 1584-2018 Simplified Model
  const kConf = arcElectrodeConfig === 'VCB' ? 1.0 : arcElectrodeConfig === 'VCBB' ? 1.25 : 1.45;
  const iArcKa = arcIbfKa * (0.85 - 0.05 * (arcVoltageV / 1000));
  const arcPowerMw = Math.sqrt(3) * (arcVoltageV / 1000) * iArcKa * 0.75;
  const arcDurationSec = arcDurationMs / 1000;
  
  // Incident Energy (cal/cm²) at working distance D
  const dInches = arcWorkingDistMm / 25.4;
  const incidentEnergyCalCm2 = Math.max(0.1, (4.184 * 1000 * 0.005 * arcPowerMw * arcDurationSec * kConf) / (Math.PI * (dInches * 2.54) ** 2 * 0.004184));
  
  // Arc Flash Boundary (distance where E = 1.2 cal/cm² - threshold of second degree burn)
  const afbDistanceCm = Math.sqrt((4.184 * 1000 * 0.005 * arcPowerMw * arcDurationSec * kConf) / (Math.PI * 1.2 * 0.004184));

  // PPE Category classification according to NFPA 70E
  let ppeCategory: { cat: string; maxCal: number; color: string; desc_fr: string; desc_en: string; equipment: string[] };
  if (incidentEnergyCalCm2 <= 1.2) {
    ppeCategory = {
      cat: 'CATÉGORIE 0 (Risque Minime)',
      maxCal: 1.2,
      color: 'text-emerald-400 border-emerald-800 bg-emerald-950/40',
      desc_fr: 'Vêtements de travail en coton ininflammable (non-melting)',
      desc_en: 'Untreated natural fiber clothing · Safety glasses mandatory',
      equipment: ['Lunettes de sécurité avec protections latérales', 'Gants de travail cuir', 'Protection auditive (bouchons)', 'Vêtements coton non-synthétique']
    };
  } else if (incidentEnergyCalCm2 <= 4.0) {
    ppeCategory = {
      cat: 'CATÉGORIE 1',
      maxCal: 4.0,
      color: 'text-cyan-400 border-cyan-800 bg-cyan-950/40',
      desc_fr: 'EPI Arc Flash min 4 cal/cm² · Visière d\'électricien',
      desc_en: 'Min 4 cal/cm² arc-rated FR clothing · Arc face shield',
      equipment: ['Chemise et pantalon ignifugés (Arc-Rated FR ≥ 4 cal/cm²)', 'Écran facial teinté Arc Flash', 'Gants isolants électricien classe 00 + surgants cuir', 'Casque de sécurité électricien']
    };
  } else if (incidentEnergyCalCm2 <= 8.0) {
    ppeCategory = {
      cat: 'CATÉGORIE 2',
      maxCal: 8.0,
      color: 'text-amber-400 border-amber-800 bg-amber-950/40',
      desc_fr: 'Risque modéré · Visière teintée + Cagoule ignifugée 8 cal/cm²',
      desc_en: 'Moderate risk · Face shield + Balaclava mandatory',
      equipment: ['Cagoule d\'arc (balaclava) 8 cal/cm²', 'Veste et pantalon de protection d\'arc (min 8 cal/cm²)', 'Écran facial teinté anti-UV/IR', 'Gants d\'électricien classe 00/0 + surgants cuir']
    };
  } else if (incidentEnergyCalCm2 <= 25.0) {
    ppeCategory = {
      cat: 'CATÉGORIE 3',
      maxCal: 25.0,
      color: 'text-orange-400 border-orange-800 bg-orange-950/40',
      desc_fr: 'Risque élevé · Scaphandre d\'arc complet requis',
      desc_en: 'High risk · Full arc flash suit required',
      equipment: ['Combinaison intégrale 25 cal/cm² (salopette + veste)', 'Scaphandre d\'arc avec ventilation intégrée', 'Bouchons d\'oreilles anti-blast phonique', 'Chaussures de sécurité diélectriques certifiées']
    };
  } else if (incidentEnergyCalCm2 <= 40.0) {
    ppeCategory = {
      cat: 'CATÉGORIE 4',
      maxCal: 40.0,
      color: 'text-red-400 border-red-800 bg-red-950/40',
      desc_fr: 'Risque très sévère · Scaphandre lourd 40 cal/cm²',
      desc_en: 'Severe risk · Heavy duty 40 cal/cm² suit',
      equipment: ['Ensemble scaphandre multicouche ≥ 40 cal/cm²', 'Protection auditive haute atténuation (blast pressure)', 'Interdiction stricte de travail sous tension sans permis d\'accès']
    };
  } else {
    ppeCategory = {
      cat: 'DANGER EXTRÊME (> 40 cal/cm²)',
      maxCal: 999,
      color: 'text-rose-500 border-rose-800 bg-rose-950/60',
      desc_fr: 'TRAVAIL SOUS TENSION STRICTEMENT PROHIBÉ',
      desc_en: 'ENERGIZED WORK STRICTLY PROHIBITED',
      equipment: ['Aucun EPI n\'est homologué au-delà de 40 cal/cm²', 'Souffle de surpression mortel (onde de choc blast)', 'Consignation et mise hors tension obligatoire avant approche']
    };
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-[#0D1117] border border-[#252E38] rounded-2xl p-6 shadow-2xl space-y-6">
        <div className="text-xs font-mono font-bold text-[#F3F4F6] uppercase border-b border-[#252E38] pb-3 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" />
            {locale === 'fr' ? 'CALCUL DE L\'ÉNERGIE INCIDENTE D\'ARC FLASH (IEEE 1584-2018 / NFPA 70E)' : 'ARC FLASH INCIDENT ENERGY (IEEE 1584-2018 / NFPA 70E)'}
          </span>
          <span className="text-orange-400">ÉNERGIE CALORIFIQUE</span>
        </div>

        {/* Big Alert KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
          <div className="bg-[#161C24] p-4 rounded-xl border border-orange-900/50 space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase">ÉNERGIE INCIDENTE (E)</div>
            <div className={`text-3xl font-black ${incidentEnergyCalCm2 > 40 ? 'text-red-500 animate-pulse' : incidentEnergyCalCm2 > 8 ? 'text-orange-400' : 'text-emerald-400'}`}>
              {incidentEnergyCalCm2.toFixed(2)} <span className="text-xs font-normal text-neutral-400">cal/cm²</span>
            </div>
            <div className="text-[10px] text-neutral-500">
              {locale === 'fr' ? `À distance de travail : ${arcWorkingDistMm} mm` : `At working distance: ${arcWorkingDistMm} mm`}
            </div>
          </div>

          <div className="bg-[#161C24] p-4 rounded-xl border border-[#252E38] space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase">FRONTIÈRE D'ARC (AFB)</div>
            <div className="text-2xl font-black text-cyan-300">
              {(afbDistanceCm / 100).toFixed(2)} <span className="text-xs font-normal text-neutral-400">m</span>
            </div>
            <div className="text-[10px] text-neutral-500">
              {locale === 'fr' ? `Rayon limite où E = 1.2 cal/cm² (${afbDistanceCm.toFixed(0)} cm)` : `Boundary limit where E = 1.2 cal/cm²`}
            </div>
          </div>

          <div className={`p-4 rounded-xl border space-y-1 ${ppeCategory.color}`}>
            <div className="text-[10px] uppercase font-bold tracking-wider opacity-80">NIVEAU EPI EXIGÉ</div>
            <div className="text-lg font-black">{ppeCategory.cat}</div>
            <div className="text-[10px] leading-tight opacity-90">
              {locale === 'fr' ? ppeCategory.desc_fr : ppeCategory.desc_en}
            </div>
          </div>
        </div>

        {/* Mandatory PPE Checklist */}
        <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38] space-y-3 font-mono text-xs">
          <div className="text-neutral-300 font-bold uppercase text-[11px] flex justify-between">
            <span>{locale === 'fr' ? 'ÉQUIPEMENTS DE PROTECTION INDIVIDUELLE (EPI) OBLIGATOIRES :' : 'MANDATORY PPE CHECKLIST (NFPA 70E):'}</span>
            <span className="text-orange-400 font-normal">Limite max: {ppeCategory.maxCal} cal/cm²</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ppeCategory.equipment.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-neutral-300 text-[11px]">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Severity Warning Banner */}
        <div className={`p-4 rounded-xl border flex items-start gap-3 font-mono text-xs ${
          incidentEnergyCalCm2 > 40
            ? 'bg-rose-950/40 border-rose-800 text-rose-300'
            : incidentEnergyCalCm2 > 8
            ? 'bg-orange-950/30 border-orange-800 text-orange-300'
            : 'bg-emerald-950/30 border-emerald-800 text-emerald-300'
        }`}>
          {incidentEnergyCalCm2 > 40 ? (
            <AlertTriangle className="h-5 w-5 shrink-0 text-red-500 animate-bounce" />
          ) : incidentEnergyCalCm2 > 8 ? (
            <AlertTriangle className="h-5 w-5 shrink-0 text-orange-400" />
          ) : (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
          )}
          <div className="space-y-1">
            <div className="font-bold text-sm">
              {incidentEnergyCalCm2 > 40
                ? (locale === 'fr' ? 'ZONE DE DANGER MORTEL - TRAVAIL INTERDIT' : 'EXTREME BLAST HAZARD - NO LIVE WORK')
                : incidentEnergyCalCm2 > 8
                ? (locale === 'fr' ? 'Intervention sous Haute Surveillance Réglementaire' : 'High Energy Arc Flash Risk')
                : (locale === 'fr' ? 'Risque Thermique Modéré et Maîtrisé' : 'Low to Moderate Controlled Thermal Risk')}
            </div>
            <p className="text-[11px] text-neutral-300 leading-relaxed font-sans">
              {incidentEnergyCalCm2 > 40
                ? (locale === 'fr'
                    ? 'L\'énergie dépasse le seuil absolu de 40 cal/cm². Le risque de souffle blast létal, d\'inhalation de vapeurs de cuivre et de brûlures de 3e degré est garanti. Réduire impérativement le temps de déclenchement (détecteur optique d\'arc, protection différentielle de barre).'
                    : 'Energy exceeds 40 cal/cm². Massive blast pressure hazard. Fast arc optical detection required.')
                : (locale === 'fr'
                    ? `Le temps de coupure de ${arcDurationMs} ms et le courant franc de ${arcIbfKa} kA génèrent une frontière de sécurité de ${(afbDistanceCm / 100).toFixed(2)} m. Tout intervenant franchissant cette limite doit être équipé de l'EPI de niveau ${ppeCategory.cat}.`
                    : `Safety boundary is ${(afbDistanceCm / 100).toFixed(2)} m. Personnel within boundary must wear Category ${ppeCategory.cat} PPE.`)}
            </p>
          </div>
        </div>

        {/* Arc Flash Parameters and Formulas */}
        <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38] space-y-1.5 font-mono text-[11px]">
          <div className="text-orange-400 font-bold mb-1">{locale === 'fr' ? 'Formulations IEEE 1584-2018 :' : 'IEEE 1584-2018 Formulas:'}</div>
          <div className="text-neutral-300">• Courant d'arc effectif I_arc = {iArcKa.toFixed(2)} kA (I_bolted = {arcIbfKa} kA)</div>
          <div className="text-neutral-300">• Puissance d'arc P_arc = √3 · U · I_arc · cos φ_arc = {arcPowerMw.toFixed(2)} MW</div>
          <div className="text-neutral-300">• Facteur géométrique d'électrodes K_conf ({arcElectrodeConfig}) = {kConf.toFixed(2)}</div>
        </div>
      </div>

      {/* Right Inputs Sidebar */}
      <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-6 shadow-2xl space-y-5 font-mono text-xs">
        <div className="text-xs font-bold text-[#F3F4F6] uppercase border-b border-[#252E38] pb-3 flex items-center justify-between">
          <span>{locale === 'fr' ? 'PARAMÈTRES DU TABLEAU' : 'PANEL PARAMETERS'}</span>
          <span className="text-orange-400 font-normal">IEEE 1584</span>
        </div>

        <div className="space-y-1">
          <label className="text-neutral-300 flex justify-between">
            <span>{locale === 'fr' ? 'Tension nominale tableau :' : 'Rated Voltage:'}</span>
            <span className="text-cyan-400 font-bold">{arcVoltageV} V</span>
          </label>
          <select
            value={arcVoltageV}
            onChange={(e) => setArcVoltageV(parseInt(e.target.value, 10))}
            className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-white font-bold focus:border-cyan-400 focus:outline-none"
          >
            <option value={400}>400 V BT (TGBT Industriel)</option>
            <option value={480}>480 V BT (Standard US)</option>
            <option value={690}>690 V BT (Procédés Lourds / Mines)</option>
            <option value={3300}>3.3 kV MT (Moteurs MT)</option>
            <option value={6600}>6.6 kV MT (Centrales / Auxiliaires)</option>
            <option value={11000}>11 kV MT (Distribution Publique)</option>
            <option value={20000}>20 kV MT (Postes de Distribution)</option>
            <option value={33000}>33 kV MT (Éolien / Solaire)</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-neutral-300 flex justify-between">
            <span>{locale === 'fr' ? 'Courant C-C franc (Ibf) :' : 'Bolted Fault (Ibf):'}</span>
            <span className="text-red-400 font-bold">{arcIbfKa} kA</span>
          </label>
          <input
            type="range"
            min={5}
            max={65}
            step={1}
            value={arcIbfKa}
            onChange={(e) => setArcIbfKa(parseFloat(e.target.value))}
            className="w-full accent-red-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-neutral-300 flex justify-between">
            <span>{locale === 'fr' ? 'Temps d\'élimination d\'arc :' : 'Arc Duration:'}</span>
            <span className="text-orange-400 font-bold">{arcDurationMs} ms</span>
          </label>
          <input
            type="range"
            min={20}
            max={1000}
            step={10}
            value={arcDurationMs}
            onChange={(e) => setArcDurationMs(parseFloat(e.target.value))}
            className="w-full accent-orange-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-neutral-300 flex justify-between">
            <span>{locale === 'fr' ? 'Distance de travail :' : 'Working Distance:'}</span>
            <span className="text-emerald-400 font-bold">{arcWorkingDistMm} mm</span>
          </label>
          <input
            type="range"
            min={300}
            max={1200}
            step={25}
            value={arcWorkingDistMm}
            onChange={(e) => setArcWorkingDistMm(parseFloat(e.target.value))}
            className="w-full accent-emerald-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-neutral-300">{locale === 'fr' ? 'Configuration des barres :' : 'Electrode Configuration:'}</label>
          <select
            value={arcElectrodeConfig}
            onChange={(e) => setArcElectrodeConfig(e.target.value as any)}
            className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-white font-bold focus:border-cyan-400 focus:outline-none"
          >
            <option value="VCB">VCB · Barres verticales en coffret fermé</option>
            <option value="VCBB">VCBB · Barres verticales terminées par une barrière</option>
            <option value="HCB">HCB · Barres horizontales en coffret (Focus direct)</option>
          </select>
        </div>

        {onOpenReport && (
          <div className="pt-2 border-t border-[#252E38]">
            <button
              type="button"
              onClick={onOpenReport}
              className="w-full py-2.5 rounded-xl font-mono text-xs font-bold bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 border border-orange-500/30 flex items-center justify-center gap-2 transition-colors"
            >
              <FileText className="h-4 w-4" />
              <span>{locale === 'fr' ? 'Éditer Note de Calcul Arc Flash' : 'Generate Arc Flash Report'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
