// src/components/ai/FieldEquipmentVisionInspectorModal.tsx
import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  X,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Zap,
  Layers,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  FileText
} from 'lucide-react';

interface NameplateAnalysisResult {
  detectedEquipment?: string;
  equipmentTitle?: string;
  confidenceScore?: number;
  manufacturer?: string;
  serialNumber?: string;
  ratedVoltage?: string;
  ratedCurrent?: string;
  ratedPower?: string;
  frequency?: string;
  shortCircuitWithstand?: string;
  applicableStandards?: string[];
  keyParameters?: Array<{ label: string; value: string }>;
  operationalDiagnosis?: string;
  recommendedEpedeCalculator?: string;
}

interface FieldEquipmentVisionInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: 'fr' | 'en';
  onNavigateCalculator?: (calcTab: string) => void;
}

export const FieldEquipmentVisionInspectorModal: React.FC<FieldEquipmentVisionInspectorModalProps> = ({
  isOpen,
  onClose,
  locale,
  onNavigateCalculator,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<NameplateAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setImagePreview(base64);
      setResult(null);
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!imagePreview) return;
    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const commaIndex = imagePreview.indexOf(',');
      const mimeMatch = imagePreview.match(/^data:(.*);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      const base64Data = commaIndex !== -1 ? imagePreview.substring(commaIndex + 1) : imagePreview;

      const resp = await fetch('/api/v1/ai/analyze-nameplate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64Image: base64Data,
          mimeType,
          locale,
        }),
      });

      const data = await resp.json();
      if (!resp.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de l\'analyse');
      }

      setResult(data.analysis);
    } catch (err: any) {
      setErrorMessage(err.message || 'Impossible d\'analyser la plaque signalétique');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] bg-[#0D1117] border border-[#252E38] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#252E38] bg-[#11161D]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-white uppercase">
                  {locale === 'fr' ? 'Diagnostic Visuel & Plaque Signalétique' : 'Field Equipment Vision & Nameplate AI'}
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Gemini Vision
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">
                {locale === 'fr' 
                  ? 'Reconnaissance optique de plaques de transformateurs, disjoncteurs, TC et travées'
                  : 'Optical recognition of transformer nameplates, breakers, CTs and substation bays'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#161C24] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs font-mono">
          
          {/* Upload Dropzone */}
          {!imagePreview ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#252E38] hover:border-amber-500/50 bg-[#161C24]/50 hover:bg-[#161C24] rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all space-y-3"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Upload className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">
                  {locale === 'fr' ? 'Prendre une photo ou importer une plaque signalétique' : 'Take a photo or upload an equipment nameplate'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-md">
                  {locale === 'fr'
                    ? 'Glissez-déposez ou cliquez pour sélectionner l\'image d\'un transformateur, disjoncteur, cellule HTA, moteur ou parafoudre.'
                    : 'Drag & drop or click to select a photo of a transformer, circuit breaker, MV cubicle, motor, or surge arrester.'}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-800 text-[10px] text-slate-400 border border-slate-700">
                JPG, PNG, WebP (Max 10 MB)
              </span>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-black flex items-center justify-center max-h-64">
                <img
                  src={imagePreview}
                  alt="Nameplate Preview"
                  className="max-h-64 w-auto object-contain"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setResult(null);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/80 hover:bg-black text-slate-300 hover:text-white border border-slate-700 transition-colors"
                  title={locale === 'fr' ? 'Changer d\'image' : 'Change image'}
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>

              {!result && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 border border-amber-400 shadow-md shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin text-slate-950" />
                        <span>{locale === 'fr' ? 'Analyse Gemini en cours...' : 'Analyzing with Gemini...'}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 text-slate-950" />
                        <span>{locale === 'fr' ? 'Lancer le Diagnostic IA' : 'Run AI Diagnostics'}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 flex items-center gap-2.5">
              <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Analysis Results Display */}
          {result && (
            <div className="space-y-5 animate-in fade-in duration-300">
              
              {/* Verdict Banner */}
              <div className="p-4 rounded-xl bg-[#161C24] border border-amber-500/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {result.detectedEquipment || 'Équipement Haute Tension'}
                    </span>
                    {result.manufacturer && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {result.manufacturer}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">
                    {result.equipmentTitle || 'Matériel Identifié'}
                  </h3>
                </div>

                {result.recommendedEpedeCalculator && onNavigateCalculator && (
                  <button
                    type="button"
                    onClick={() => {
                      onNavigateCalculator(result.recommendedEpedeCalculator!);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow transition-all cursor-pointer text-xs"
                  >
                    <span>{locale === 'fr' ? 'Ouvrir Calculateur Dédié' : 'Open Sizing Calculator'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase">{locale === 'fr' ? 'Tension Assignée' : 'Rated Voltage'}</div>
                  <div className="font-bold text-cyan-300 text-sm">{result.ratedVoltage || 'N/A'}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase">{locale === 'fr' ? 'Courant Assigné' : 'Rated Current'}</div>
                  <div className="font-bold text-amber-300 text-sm">{result.ratedCurrent || 'N/A'}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase">{locale === 'fr' ? 'Puissance / Icc' : 'Power / Isc'}</div>
                  <div className="font-bold text-emerald-300 text-sm">{result.ratedPower || result.shortCircuitWithstand || 'N/A'}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase">{locale === 'fr' ? 'Fréquence' : 'Frequency'}</div>
                  <div className="font-bold text-white text-sm">{result.frequency || '50 Hz'}</div>
                </div>
              </div>

              {/* Key Parameters */}
              {result.keyParameters && result.keyParameters.length > 0 && (
                <div className="p-4 rounded-xl bg-[#111722] border border-slate-800 space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {locale === 'fr' ? 'Paramètres Clés Extraits' : 'Extracted Parameters'}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {result.keyParameters.map((param, idx) => (
                      <div key={idx} className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800/80">
                        <span className="text-slate-400">{param.label}</span>
                        <span className="font-bold text-white">{param.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Applicable Standards */}
              {result.applicableStandards && result.applicableStandards.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-slate-400 text-[11px]">{locale === 'fr' ? 'Normes Applicables :' : 'Applicable Standards:'}</span>
                  {result.applicableStandards.map((std, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800 text-[10px] font-bold">
                      {std}
                    </span>
                  ))}
                </div>
              )}

              {/* Operational Commentary */}
              {result.operationalDiagnosis && (
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 leading-relaxed text-slate-300">
                  <div className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4" />
                    <span>{locale === 'fr' ? 'Avis Technique & Diagnostic Opérationnel' : 'Technical & Operational Diagnosis'}</span>
                  </div>
                  <p className="text-[11px] whitespace-pre-wrap">{result.operationalDiagnosis}</p>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
