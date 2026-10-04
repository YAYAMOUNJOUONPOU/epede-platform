// src/components/metering/modules/MeteringAmiProtocolEngine.tsx
// EPEDE Domain D15 - Stage 1 & 2: Metrology, DLMS/COSEM OBIS Objects & STS 20-Digit Prepayment Token Engine

import React, { useState } from 'react';
import {
  Gauge,
  Sliders,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  Sparkles,
  Zap,
  Coins,
  Cpu,
  Radio,
  FileCode,
  Key
} from 'lucide-react';
import { type MeteringProjectStoreType } from '../services/useMeteringProjectStore';

interface MeteringAmiProtocolEngineProps {
  locale: 'fr' | 'en';
  store: MeteringProjectStoreType;
}

export const MeteringAmiProtocolEngine: React.FC<MeteringAmiProtocolEngineProps> = ({
  locale,
  store
}) => {
  const {
    accuracyClass,
    setAccuracyClass,
    meterType,
    setMeterType,
    nominalVoltageV,
    setNominalVoltageV,
    nominalCurrentA,
    setNominalCurrentA,
    maxCurrentA,
    setMaxCurrentA,
    protocolType,
    setProtocolType,
    commsArchitecture,
    setCommsArchitecture,
    stsTokenValueXaf,
    setStsTokenValueXaf,
    electricityTariffXafPerKwh,
    setElectricityTariffXafPerKwh,
    simulatedTokenDigits,
    generateNewStsToken,
    tokenPurchasedKwh
  } = store;

  const [activeTab, setActiveTab] = useState<'metrology' | 'obis' | 'sts_token'>('metrology');

  // DLMS/COSEM OBIS Table Definition
  const obisCatalog = [
    { code: '1.0.1.8.0.255', nameFr: 'Énergie Active Positive Totale (A+)', nameEn: 'Total Positive Active Energy (A+)', unit: 'kWh', classId: 3 },
    { code: '1.0.2.8.0.255', nameFr: 'Énergie Active Négative Exportée (A-)', nameEn: 'Total Reverse Active Energy (A-)', unit: 'kWh', classId: 3 },
    { code: '1.0.3.8.0.255', nameFr: 'Énergie Réactive Quadrant Q1 (Inductive)', nameEn: 'Reactive Energy Q1 (Inductive)', unit: 'kvarh', classId: 3 },
    { code: '1.0.4.8.0.255', nameFr: 'Énergie Réactive Quadrant Q4 (Capacitive)', nameEn: 'Reactive Energy Q4 (Capacitive)', unit: 'kvarh', classId: 3 },
    { code: '1.0.32.7.0.255', nameFr: 'Tension Instantanée Phase L1', nameEn: 'Instantaneous Voltage Phase L1', unit: 'V', classId: 3 },
    { code: '1.0.31.7.0.255', nameFr: 'Courant Instantané Phase L1', nameEn: 'Instantaneous Current Phase L1', unit: 'A', classId: 3 },
    { code: '1.0.13.7.0.255', nameFr: 'Facteur de Puissance Global (cos φ)', nameEn: 'Total Power Factor (cos phi)', unit: 'ratio', classId: 3 },
    { code: '0.0.96.1.0.255', nameFr: 'Numéro de Série du Compteur (Matricule)', nameEn: 'Meter Manufacturing Serial Number', unit: 'ASCII', classId: 1 }
  ];

  return (
    <div className="space-y-6">
      {/* Sub-tab navigation */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 w-fit">
        <button
          onClick={() => setActiveTab('metrology')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'metrology'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Gauge className="w-4 h-4" />
          <span>{locale === 'fr' ? '1. Métrologie & Matériel CEI' : '1. Metrology & Hardware'}</span>
        </button>
        <button
          onClick={() => setActiveTab('obis')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'obis'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>{locale === 'fr' ? '2. Registres OBIS DLMS/COSEM' : '2. DLMS OBIS Registers'}</span>
        </button>
        <button
          onClick={() => setActiveTab('sts_token')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'sts_token'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>{locale === 'fr' ? '3. Générateur Token STS (20 Digits)' : '3. STS Token Generator'}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: METROLOGY & HARDWARE SPECIFICATIONS */}
      {/* ========================================================================= */}
      {activeTab === 'metrology' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
            <h3 className="text-sm font-bold font-mono text-emerald-400 flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              {locale === 'fr' ? 'CARACTÉRISTIQUES DU COMPTEUR (CEI 62053)' : 'METER SPECIFICATIONS (IEC 62053)'}
            </h3>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Classe de Précision Métrologique :</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['0.2S', '0.5S', '1.0', '2.0'] as const).map((cls) => (
                    <button
                      key={cls}
                      onClick={() => setAccuracyClass(cls)}
                      className={`py-1.5 text-xs font-mono rounded-lg border transition-all ${
                        accuracyClass === cls
                          ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      Classe {cls}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Type de Compteur Physique :</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setMeterType('SINGLE_PHASE_SPLIT')}
                    className={`p-2 text-xs font-mono rounded-lg border text-left transition-all ${
                      meterType === 'SINGLE_PHASE_SPLIT'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 font-bold'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    Monophasé Split (Anti-Fraude)
                  </button>
                  <button
                    onClick={() => setMeterType('THREE_PHASE_POLYPHASE')}
                    className={`p-2 text-xs font-mono rounded-lg border text-left transition-all ${
                      meterType === 'THREE_PHASE_POLYPHASE'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 font-bold'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    Triphasé Polyphasé 4 Fils
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <span className="text-xs font-mono text-slate-400">Courant Nominal Ib (A) :</span>
                  <input
                    type="number"
                    value={nominalCurrentA}
                    onChange={(e) => setNominalCurrentA(Number(e.target.value))}
                    className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs font-mono text-white"
                  />
                </div>
                <div>
                  <span className="text-xs font-mono text-slate-400">Courant Maximal Imax (A) :</span>
                  <input
                    type="number"
                    value={maxCurrentA}
                    onChange={(e) => setMaxCurrentA(Number(e.target.value))}
                    className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs font-mono text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-mono text-slate-300">Architecture de Communication :</label>
                <select
                  value={commsArchitecture}
                  onChange={(e) => setCommsArchitecture(e.target.value as any)}
                  className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="G3_PLC_CONCENTRATOR">CPL G3-PLC & Concentrateur DCU de Poste (Urbain)</option>
                  <option value="CELLULAR_4G_NBIOT">Cellulaire Point-to-Point 4G LTE-M / NB-IoT (Résidentiel/Grands Comptes)</option>
                  <option value="WIFI_RF_MESH">Réseau Radio Fréquence Mesh Wi-SUN 868 MHz</option>
                </select>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
            <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              {locale === 'fr' ? 'SCHÉMA BLOC FONCTIONNEL DU SMART METER AMI' : 'AMI SMART METER FUNCTIONAL BLOCK DIAGRAM'}
            </h3>

            {/* Visual Architecture Diagram */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-emerald-500/40 text-emerald-300">
                  <div className="font-bold">Capteur Shunt / TC</div>
                  <div className="text-[10px] text-slate-400">Échantillonnage Sigma-Delta 24-bit</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-cyan-500/40 text-cyan-300">
                  <div className="font-bold">DSP Métrologique</div>
                  <div className="text-[10px] text-slate-400">Calcul P, Q, S, V, I & cos φ</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-violet-500/40 text-violet-300">
                  <div className="font-bold">Microcontrôleur Sécurisé</div>
                  <div className="text-[10px] text-slate-400">Pile DLMS/COSEM & STS</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono pt-2 border-t border-slate-800">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-amber-500/40 text-amber-300">
                  <div className="font-bold">Relais Bistable 100A</div>
                  <div className="text-[10px] text-slate-400">Télé-coupure et rétablissement</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-blue-500/40 text-blue-300">
                  <div className="font-bold">Modem CPL / 4G / BLE</div>
                  <div className="text-[10px] text-slate-400">Remontée vers le HES/MDM</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
              <div className="font-bold text-emerald-400">Prescription Métrologique CEI 62053-21 :</div>
              <p>
                L'erreur maximale tolérée pour la classe 1.0 est de &plusmn; 1.0% sur la plage de courant 0.1 Ib &le; I &le; Imax avec cos φ = 1. Le compteur intègre une double mesure sur la phase et sur le neutre pour détecter immédiatement toute tentative de contournement ou de dérivation frauduleuse.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: DLMS/COSEM OBIS CODES REGISTRY */}
      {/* ========================================================================= */}
      {activeTab === 'obis' && (
        <div className="space-y-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <FileCode className="w-4 h-4 text-emerald-400" />
              {locale === 'fr'
                ? 'TABLE D’OBJETS COSEM & CODES OBIS DE FACTURATION (CEI 62056-61)'
                : 'COSEM OBJECT DICTIONARY & OBIS CODES (IEC 62056-61)'}
            </h3>
            <span className="text-xs font-mono text-emerald-400">Profil OBIS Eneo Homologué</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">Code OBIS (A.B.C.D.E.F)</th>
                  <th className="p-3">Désignation Grandeur Électrique</th>
                  <th className="p-3 text-center">Unité</th>
                  <th className="p-3 text-center">Class ID</th>
                  <th className="p-3">Usage Métier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/40 text-slate-300">
                {obisCatalog.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-bold text-cyan-400">{row.code}</td>
                    <td className="p-3 text-white">{locale === 'fr' ? row.nameFr : row.nameEn}</td>
                    <td className="p-3 text-center font-bold text-emerald-400">{row.unit}</td>
                    <td className="p-3 text-center text-slate-400">{row.classId}</td>
                    <td className="p-3 text-[11px] text-slate-400">Télé-relève HES / Profilage</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: STS 20-DIGIT PREPAYMENT TOKEN GENERATOR */}
      {/* ========================================================================= */}
      {activeTab === 'sts_token' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
            <h3 className="text-sm font-bold font-mono text-emerald-400 flex items-center gap-2">
              <Key className="w-4 h-4" />
              {locale === 'fr' ? 'SIMULATEUR DE RECHARGE STS (CEI 62055-41)' : 'STS 20-DIGIT VENDING SIMULATOR'}
            </h3>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Montant d'Achat Crédit :</span>
                  <span className="text-emerald-400 font-bold">{stsTokenValueXaf.toLocaleString()} FCFA</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="50000"
                  step="1000"
                  value={stsTokenValueXaf}
                  onChange={(e) => setStsTokenValueXaf(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Tarif Réglementaire de l'Énergie :</span>
                  <span className="text-cyan-400 font-bold">{electricityTariffXafPerKwh} FCFA / kWh</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  step="5"
                  value={electricityTariffXafPerKwh}
                  onChange={(e) => setElectricityTariffXafPerKwh(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1">
                <div className="text-slate-400">Énergie Convertie Achetée :</div>
                <div className="text-2xl font-bold text-white">{tokenPurchasedKwh} kWh</div>
                <div className="text-[10px] text-slate-500">Formule : Montant / Tarif Unitaire</div>
              </div>

              <button
                onClick={generateNewStsToken}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{locale === 'fr' ? 'Générer un Nouveau Token STS Chiffré' : 'Generate New Encrypted STS Token'}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                <Coins className="w-4 h-4 text-emerald-400" />
                {locale === 'fr' ? 'TICKET DE RECHARGE VIRTUEL & CLÉ STS' : 'VIRTUAL VENDING RECEIPT & STS KEY'}
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Standard Transfer Specification (STS Edition 2 - Chiffrement DES/AES 128-bit)
              </p>
            </div>

            {/* Virtual STS Token Display Box */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/50 shadow-inner space-y-3 text-center font-mono">
              <div className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">
                CODE DE RECHARGE ÉLECTRICITÉ (TOKEN 20 CHIFFRES)
              </div>
              <div className="text-2xl md:text-3xl font-black text-emerald-400 tracking-wider font-mono py-2 bg-slate-900/80 rounded-xl border border-emerald-800/60">
                {simulatedTokenDigits}
              </div>
              <div className="flex justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2 px-2">
                <span>Crédit : <strong className="text-white">{tokenPurchasedKwh} kWh</strong></span>
                <span>TID : <strong className="text-white">2026-04-04</strong></span>
                <span>KRN : <strong className="text-white">Key Revision 2</strong></span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
              <span className="text-emerald-400 font-bold">Sécurité Anti-Rejeu STS : </span>
              Chaque token 20 chiffres ne peut être injecté qu'une seule fois dans le compteur associé à son numéro de série unique. Le Token Identifier (TID) empêche tout rechargement rétroactif ou duplication de ticket.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
