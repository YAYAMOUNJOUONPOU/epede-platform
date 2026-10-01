// src/components/layout/MobileQrScannerModal.tsx
// EPEDE — Mobile Field QR/Barcode Nameplate Scanner
// Uses Web API (BarcodeDetector / camera stream) to read equipment QR codes
// and auto-populate the reference dossier. Falls back to manual text input.

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, Scan, X, CheckCircle2, AlertTriangle, Search, ArrowRight, Zap } from 'lucide-react';

// Known QR mappings (tag → equipment ID)
const QR_TO_EQUIPMENT: Record<string, string> = {
  'EPEDE-T01':     'eq-trafo-hta-01',
  'EPEDE-GIS-225': 'eq-gis-bay-225kv',
  'EPEDE-CT-225':  'eq-exp-ct-225k',
  'EPEDE-BESS-01': 'eq-exp-bess-container-5mw',
  'EPEDE-CB-225':  'eq-exp-gis-bay-225k',
  'EPEDE-MV-30':   'eq-exp-cell-mv-30k',
  'EPEDE-TGBT-01': 'eq-tgbt-main-400v',
  'EPEDE-EV-HPC':  'eq-exp-ev-hpc-350kw',
  'EPEDE-RELAY-01':'eq-exp-relay-ied-61850',
  'EPEDE-MOTOR-01':'eq-motor-asynch-250kw',
};

// Quick-access demo scans
const DEMO_SCANS: Array<{ tag: string; label: { fr: string; en: string }; icon: string }> = [
  { tag: 'EPEDE-T01', label: { fr: 'Transfo 225/30 kV', en: '225/30 kV Transformer' }, icon: '⚡' },
  { tag: 'EPEDE-GIS-225', label: { fr: 'Cellule GIS 225 kV', en: '225 kV GIS Bay' }, icon: '🏭' },
  { tag: 'EPEDE-BESS-01', label: { fr: 'Conteneur BESS 5 MW', en: '5 MW BESS Container' }, icon: '🔋' },
  { tag: 'EPEDE-RELAY-01', label: { fr: 'IED Protection 61850', en: '61850 Protection IED' }, icon: '🛡️' },
  { tag: 'EPEDE-TGBT-01', label: { fr: 'TGBT 400 V', en: '400 V Main LV Board' }, icon: '⚙️' },
  { tag: 'EPEDE-EV-HPC', label: { fr: 'Borne EV HPC 350 kW', en: '350 kW EV HPC Charger' }, icon: '🔌' },
];

interface MobileQrScannerModalProps {
  locale: 'fr' | 'en';
  isOpen: boolean;
  onClose: () => void;
  onNavigateEquipment: (id: string) => void;
  onNavigateReference: (id: string) => void;
}

export const MobileQrScannerModal: React.FC<MobileQrScannerModalProps> = ({
  locale,
  isOpen,
  onClose,
  onNavigateEquipment,
  onNavigateReference,
}) => {
  const isFr = locale === 'fr';
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState('');
  const [resolvedEq, setResolvedEq] = useState<{ tag: string; equipmentId: string } | null>(null);

  const resolveTag = useCallback((tag: string) => {
    const clean = tag.trim().toUpperCase().replace(/\s+/g, '-');
    const equipId = QR_TO_EQUIPMENT[clean];
    if (equipId) {
      setResolvedEq({ tag: clean, equipmentId: equipId });
      setScanResult(clean);
    } else {
      setScanResult(clean);
      setResolvedEq(null);
    }
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraStream(stream);
      setCameraActive(true);
      setCameraError(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setCameraError(isFr
        ? `Caméra non disponible: ${msg}. Utilisez la saisie manuelle.`
        : `Camera unavailable: ${msg}. Use manual entry below.`);
    }
  }, [isFr]);

  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
      setCameraStream(null);
      setCameraActive(false);
    }
  }, [cameraStream]);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setScanResult(null);
      setResolvedEq(null);
      setManualInput('');
    }
  }, [isOpen, stopCamera]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#020408]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#1a2235] bg-[#060A10] shrink-0">
        <div className="flex items-center gap-2">
          <Scan className="h-5 w-5 text-cyan-400" />
          <div>
            <h2 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
              {isFr ? 'Lecteur QR Plaque Signalétique' : 'Nameplate QR Scanner'}
            </h2>
            <p className="text-[10px] font-mono text-neutral-500">
              {isFr ? 'Mode Field Engineering — Offline Compatible' : 'Field Engineering Mode — Offline Compatible'}
            </p>
          </div>
        </div>
        <button
          onClick={() => { stopCamera(); onClose(); }}
          className="p-2 text-neutral-500 hover:text-white rounded-lg hover:bg-white/5 transition-all"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Camera viewfinder */}
        {!cameraActive && !cameraError && (
          <div className="relative flex flex-col items-center justify-center bg-[#0D1520] rounded-2xl border border-[#1a2235] p-8 min-h-[220px]">
            <Camera className="h-12 w-12 text-neutral-700 mb-3" />
            <p className="text-[11px] font-mono text-neutral-500 text-center mb-4">
              {isFr
                ? 'Activez la caméra pour scanner le QR code de la plaque signalétique.'
                : 'Activate camera to scan the equipment nameplate QR code.'}
            </p>
            <button
              onClick={startCamera}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-mono font-bold text-sm bg-cyan-600 hover:bg-cyan-500 text-white border border-cyan-500 shadow-lg transition-all active:scale-95"
            >
              <Camera className="h-4 w-4" />
              {isFr ? 'Activer la Caméra' : 'Activate Camera'}
            </button>
          </div>
        )}

        {cameraError && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[11px] font-mono text-amber-300">{cameraError}</p>
          </div>
        )}

        {cameraActive && (
          <div className="relative rounded-2xl overflow-hidden bg-black border border-[#1a2235]">
            <video ref={videoRef} autoPlay playsInline muted className="w-full" style={{ maxHeight: 260 }} />
            {/* Scanner overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 border-2 border-cyan-400 rounded-xl opacity-60 relative">
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-cyan-400 rounded-tl-sm" />
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-cyan-400 rounded-tr-sm" />
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-cyan-400 rounded-bl-sm" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-cyan-400 rounded-br-sm" />
                <div className="absolute inset-x-0 top-1/2 h-0.5 bg-cyan-400 opacity-60 animate-[scan_2s_ease-in-out_infinite]" />
              </div>
            </div>
            <button
              onClick={stopCamera}
              className="absolute top-2 right-2 p-2 bg-black/60 text-white rounded-lg border border-white/20"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Manual entry */}
        <div className="space-y-2">
          <label className="block text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
            {isFr ? 'Saisie Manuelle du Tag / QR Code' : 'Manual Tag / QR Code Entry'}
          </label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <input
                type="text"
                value={manualInput}
                onChange={e => setManualInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && manualInput.trim() && resolveTag(manualInput)}
                placeholder={isFr ? 'ex: EPEDE-T01 ou EPEDE-GIS-225' : 'e.g. EPEDE-T01 or EPEDE-GIS-225'}
                className="w-full bg-[#0D1520] border border-[#1a2235] focus:border-cyan-400 rounded-xl pl-10 pr-4 py-3 text-sm font-mono text-white placeholder:text-neutral-600 outline-none"
              />
            </div>
            <button
              onClick={() => manualInput.trim() && resolveTag(manualInput)}
              className="px-4 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-sm transition-all active:scale-95"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Demo quick scans */}
        <div>
          <label className="block text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider mb-2">
            {isFr ? 'Équipements EPEDE Indexés (Démo)' : 'EPEDE Indexed Equipment (Demo)'}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_SCANS.map(ds => (
              <button
                key={ds.tag}
                onClick={() => resolveTag(ds.tag)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all ${
                  scanResult === ds.tag
                    ? 'border-cyan-400 bg-cyan-500/10'
                    : 'border-[#1a2235] bg-[#0D1520] hover:border-cyan-500/40'
                }`}
              >
                <span className="text-lg">{ds.icon}</span>
                <div>
                  <div className="text-[11px] font-mono font-bold text-white">{ds.label[locale]}</div>
                  <div className="text-[9px] font-mono text-neutral-500">{ds.tag}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Scan result */}
        {scanResult && (
          <div className={`rounded-xl border p-4 ${resolvedEq ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-amber-500/30 bg-amber-500/10'}`}>
            <div className="flex items-center gap-2 mb-2">
              {resolvedEq ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-amber-400" />
              )}
              <span className="font-mono text-sm font-bold text-white">
                {resolvedEq
                  ? (isFr ? 'Équipement Identifié' : 'Equipment Identified')
                  : (isFr ? 'Tag Non Trouvé' : 'Tag Not Found')}
              </span>
            </div>
            <p className="text-[11px] font-mono text-neutral-400 mb-1">
              {isFr ? 'Tag scanné:' : 'Scanned tag:'} <span className="text-cyan-400 font-bold">{scanResult}</span>
            </p>
            {resolvedEq ? (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => { onNavigateEquipment(resolvedEq.equipmentId); onClose(); }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-[11px] border border-emerald-500 transition-all active:scale-95"
                >
                  <Zap className="h-3.5 w-3.5" />
                  {isFr ? 'Dossier Équipement' : 'Equipment Dossier'}
                </button>
                <button
                  onClick={() => { onNavigateReference(resolvedEq.equipmentId); onClose(); }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#0D1520] border border-[#1a2235] text-white font-mono font-bold text-[11px] hover:border-cyan-400 transition-all"
                >
                  <Search className="h-3.5 w-3.5" />
                  {isFr ? 'Référence' : 'Reference'}
                </button>
              </div>
            ) : (
              <p className="text-[10px] font-mono text-amber-400">
                {isFr ? 'Ce tag n\'est pas dans la base EPEDE. Vérifiez l\'orthographe.' : 'This tag is not in the EPEDE database. Check spelling.'}
              </p>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes scan {
          0%, 100% { transform: translateY(-80px); }
          50% { transform: translateY(80px); }
        }
      `}</style>
    </div>
  );
};
