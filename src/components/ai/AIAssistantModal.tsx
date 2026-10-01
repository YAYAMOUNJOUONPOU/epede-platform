// src/components/ai/AIAssistantModal.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
  ShieldCheck,
  Sparkles,
  Calculator,
  Activity,
  ArrowRight,
  Globe,
  Scale,
  GitMerge,
  Zap,
  Mic,
  MicOff,
  Image as ImageIcon,
  Search,
  Loader2,
  Trash2,
  Cpu,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import type { DomainCode } from '../../types/epede';
import type { CalculatorTabType } from '../calculators/services/calculationReportService';
import type { SimulationTabType } from '../simulation/SimulationLabView';
import { useAuth } from '../../services/AuthContext';

export interface RecommendedEngineeringTool {
  type: 'calculator' | 'simulation' | 'grid' | 'regulatory' | 'lifecycle' | 'diagram' | 'journey' | 'context-stack' | 'protection' | 'commissioning';
  id: string;
  label_fr: string;
  label_en: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{ title: string; uri: string }>;
  recommendedTool?: RecommendedEngineeringTool;
  imageUrl?: string;
  timestamp: string;
}

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: 'fr' | 'en';
  activeEquipmentId?: string;
  activeDomainId?: string;
  onNavigateDomain: (code: DomainCode) => void;
  onNavigateEquipment: (id: string) => void;
  onNavigateStandard: (ref: string) => void;
  onNavigateCalculator?: (tab: CalculatorTabType) => void;
  onNavigateSimulation?: (tab: SimulationTabType) => void;
  onNavigateCameroonGrid?: () => void;
  onNavigateRegulatory?: () => void;
  onNavigateLifecycle?: () => void;
  onNavigateDiagram?: () => void;
  onNavigateJourney?: () => void;
  onNavigateContextStack?: (nodeId?: string) => void;
  onNavigateProtection?: () => void;
  onNavigateCommissioning?: () => void;
}

function detectRecommendedTool(query: string): RecommendedEngineeringTool | undefined {
  const lower = query.toLowerCase();
  if (lower.includes('arc flash') || lower.includes('1584')) {
    return { type: 'calculator', id: 'arc-flash', label_fr: 'Calculateur Arc Flash IEEE 1584', label_en: 'Arc Flash Hazard Calculator (IEEE 1584)' };
  }
  if (lower.includes('chute de tension') || lower.includes('voltage drop') || lower.includes('câble')) {
    return { type: 'calculator', id: 'voltage-drop', label_fr: 'Calculateur Chute de Tension (CEI 60364-5-52)', label_en: 'Voltage Drop & Cable Sizing (IEC 60364-5-52)' };
  }
  if (lower.includes('court-circuit') || lower.includes('short circuit') || lower.includes('ik') || lower.includes('60909')) {
    return { type: 'simulation', id: 'short-circuit', label_fr: 'Laboratoire Court-Circuit CEI 60909', label_en: 'Short-Circuit Simulation Lab (IEC 60909)' };
  }
  if (lower.includes('terre') || lower.includes('grounding') || lower.includes('earthing') || lower.includes('ieee 80')) {
    return { type: 'calculator', id: 'earthing', label_fr: 'Calculateur Prise de Terre IEEE Std 80', label_en: 'Substation Grounding Calculator (IEEE 80)' };
  }
  if (lower.includes('87t') || lower.includes('différentiel') || lower.includes('differential')) {
    return { type: 'simulation', id: 'differential-protection', label_fr: 'Simulateur Différentielle 87T Bipente', label_en: '87T Differential Protection Lab' };
  }
  if (lower.includes('arsel') || lower.includes('code réseau') || lower.includes('grid code')) {
    return { type: 'regulatory', id: 'regulatory', label_fr: 'Cadre Réglementaire & Code Réseau SONATREL', label_en: 'SONATREL Regulatory Framework & Grid Code' };
  }
  if (lower.includes('ris') || lower.includes('rin') || lower.includes('songloulou') || lower.includes('nachtigal') || lower.includes('ahala')) {
    return { type: 'grid', id: 'cameroon-grid', label_fr: 'Observatoire du Réseau Cameroun RIS/RIN', label_en: 'Cameroon Grid Observatory RIS/RIN' };
  }
  if (lower.includes('protection') || lower.includes('tcc') || lower.includes('sélectivité') || lower.includes('relais')) {
    return { type: 'protection', id: 'protection', label_fr: 'Atelier de Protection & Plan R-X', label_en: 'Protection Engineering Workbench' };
  }
  if (lower.includes('fat') || lower.includes('sat') || lower.includes('commissioning') || lower.includes('réception') || lower.includes('consuel')) {
    return { type: 'commissioning', id: 'commissioning', label_fr: 'Atelier Réception FAT / SAT & Essais', label_en: 'FAT / SAT Commissioning Workbench' };
  }
  return undefined;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  locale,
  activeEquipmentId,
  activeDomainId,
  onNavigateCalculator,
  onNavigateSimulation,
  onNavigateCameroonGrid,
  onNavigateRegulatory,
  onNavigateLifecycle,
  onNavigateDiagram,
  onNavigateJourney,
  onNavigateContextStack,
  onNavigateProtection,
  onNavigateCommissioning,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'chat' | 'image' | 'voice'>('chat');
  const [input, setInput] = useState('');
  const [useSearch, setUseSearch] = useState(false);
  const [complexity, setComplexity] = useState<'fast' | 'general' | 'complex'>('general');
  const [loading, setLoading] = useState(false);

  // Chat history
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content:
        locale === 'fr'
          ? "Bonjour, je suis l'assistant multi-tours EPEDE propulsé par Gemini. Je maintiens le fil de discussion, réponds à vos questions sur les réseaux HT/MT/BT, et dispose de la recherche web en direct ainsi que de la transcription vocale et génération de schémas techniques."
          : "Hello, I am the EPEDE multi-turn Power Systems assistant powered by Gemini. I maintain full conversation context, answer questions on HV/MV/LV grids, and support real-time Google Search grounding, voice microphone transcription, and technical diagram/image rendering.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Audio Recording State (Gemini Transcribe API)
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [transcribing, setTranscribing] = useState(false);

  // Web Speech API — quick in-browser voice dictation (no API needed, works offline)
  const [isSpeechListening, setIsSpeechListening] = useState(false);
  const speechRecognitionRef = useRef<any>(null);

  const startSpeechRecognition = () => {
    const SpeechRecognitionCtor =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) return;
    const recognition = new SpeechRecognitionCtor();
    recognition.lang = locale === 'fr' ? 'fr-FR' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0]?.[0]?.transcript || '';
      if (transcript) setInput(prev => prev ? `${prev} ${transcript}` : transcript);
    };
    recognition.onend = () => setIsSpeechListening(false);
    recognition.onerror = () => setIsSpeechListening(false);
    recognition.start();
    speechRecognitionRef.current = recognition;
    setIsSpeechListening(true);
  };

  const stopSpeechRecognition = () => {
    speechRecognitionRef.current?.stop();
    setIsSpeechListening(false);
  };

  // Image Generation / Editing State
  const [imagePrompt, setImagePrompt] = useState('');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<Array<{ id: string; url: string; prompt: string; text?: string }>>([]);
  const [generatingImage, setGeneratingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, activeTab]);

  if (!isOpen) return null;

  // Handle Multi-turn Chat Send
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = input.trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    const recTool = detectRecommendedTool(query);

    try {
      const response = await fetch('/api/v1/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          locale,
          complexity,
          useSearchGrounding: useSearch,
        }),
      });

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `assist-${Date.now()}`,
        role: 'assistant',
        content: data.text || (data.fallback ? data.text : 'Erreur de génération.'),
        sources: data.sources || [],
        recommendedTool: recTool,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: locale === 'fr' ? 'Erreur de communication avec le modèle.' : 'Error communicating with AI service.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Start / Stop Microphone Audio Transcription using gemini-3.5-transcribe
  const toggleRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioChunksRef.current = [];
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        recorder.onstop = async () => {
          stream.getTracks().forEach((track) => track.stop());
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64Data = (reader.result as string).split(',')[1];
            setTranscribing(true);
            try {
              const res = await fetch('/api/v1/ai/transcribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  audioBase64: base64Data,
                  mimeType: 'audio/webm',
                }),
              });
              const transData = await res.json();
              if (transData.text) {
                setInput((prev) => (prev ? `${prev} ${transData.text}` : transData.text));
              }
            } catch (err) {
              console.error('Transcription error:', err);
            } finally {
              setTranscribing(false);
            }
          };
        };

        recorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Mic error:', err);
      }
    }
  };

  // Image Generation / Editing
  const handleGenerateImage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!imagePrompt.trim() || generatingImage) return;

    setGeneratingImage(true);
    try {
      let base64Image: string | undefined = undefined;
      if (referenceImage) {
        base64Image = referenceImage.split(',')[1];
      }

      const res = await fetch('/api/v1/ai/image-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: imagePrompt,
          base64Image,
          aspectRatio: '1:1',
        }),
      });

      const data = await res.json();
      if (data.imageUrl) {
        setGeneratedImages((prev) => [
          {
            id: `img-${Date.now()}`,
            url: data.imageUrl,
            prompt: imagePrompt,
            text: data.text,
          },
          ...prev,
        ]);
        setImagePrompt('');
        setReferenceImage(null);
      }
    } catch (err) {
      console.error('Image gen error:', err);
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 font-mono"
    >
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-4xl h-[90vh] rounded-2xl border border-slate-800 bg-[#0A0E17] shadow-2xl flex flex-col overflow-hidden">
        {/* Top Guardrail Banner */}
        <div className="border-b border-slate-800 bg-[#06080E] px-4 py-2.5 text-xs text-neutral-300 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-amber-400 shrink-0" />
            <p className="leading-snug text-[11px]">
              <span className="font-bold text-white uppercase tracking-wider">
                {locale === 'fr' ? 'COPILOTE INGÉNIERIE ÉLECTRIQUE EPEDE' : 'EPEDE POWER ENGINEERING COPILOT'} :
              </span>{' '}
              {locale === 'fr'
                ? 'Modèles Gemini configurés (3.5-flash avec Google Search, 3.1-pro pour raisonnement complexe, 3.5-transcribe pour le vocal).'
                : 'Configured Gemini models (3.5-flash with Google Search, 3.1-pro for complex STEM reasoning, 3.5-transcribe for audio).'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="border-b border-slate-800 bg-[#0B0F19] px-4 py-2 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                activeTab === 'chat'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bot className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? 'Chat Multi-Tours' : 'Multi-Turn Chat'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('image')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                activeTab === 'image'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ImageIcon className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? 'Créer & Éditer Images' : 'Create & Edit Images'}</span>
            </button>
          </div>

          {/* Quick Model Complexity Pill */}
          {activeTab === 'chat' && (
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="text-slate-400 font-bold uppercase">{locale === 'fr' ? 'Modèle :' : 'Model:'}</span>
              <button
                type="button"
                onClick={() => setComplexity('fast')}
                className={`px-2 py-0.5 rounded border transition-colors ${
                  complexity === 'fast'
                    ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 font-bold'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                Flash-Lite (Rapide)
              </button>
              <button
                type="button"
                onClick={() => setComplexity('general')}
                className={`px-2 py-0.5 rounded border transition-colors ${
                  complexity === 'general'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                3.5-Flash (Général)
              </button>
              <button
                type="button"
                onClick={() => setComplexity('complex')}
                className={`px-2 py-0.5 rounded border transition-colors ${
                  complexity === 'complex'
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-bold'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                3.1-Pro (Complexe)
              </button>
            </div>
          )}
        </div>

        {/* TAB 1: MULTI-TURN CHAT */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Active Context Ribbon */}
            {(activeDomainId || activeEquipmentId) && (
              <div className="bg-[#0A0F1A] border-b border-cyan-900/40 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs font-mono shrink-0">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-slate-400 font-bold uppercase">{locale === 'fr' ? 'Contexte Actif :' : 'Active Context:'}</span>
                  {activeDomainId && (
                    <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold">
                      {activeDomainId}
                    </span>
                  )}
                  {activeEquipmentId && (
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                      {activeEquipmentId}
                    </span>
                  )}
                </div>
                {/* Context Suggestion Chips */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {(locale === 'fr'
                    ? ['Normes CEI applicables ?', 'Calculer court-circuit Isc', 'Critères de sélectivité']
                    : ['Applicable IEC standards?', 'Calculate Isc short-circuit', 'Selectivity criteria']
                  ).map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setInput(chip)}
                      className="px-2 py-0.5 bg-slate-800 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-500/50 rounded text-[11px] text-slate-300 hover:text-cyan-300 transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Scrollable messages thread */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-sans text-xs sm:text-sm">
              {messages.map((m) => {
                const isUser = m.role === 'user';
                return (
                  <div key={m.id} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                    {!isUser && (
                      <div className="h-7 w-7 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                        <Bot className="h-3.5 w-3.5" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-xl p-4 leading-relaxed font-medium space-y-3 ${
                        isUser
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                          : 'bg-[#0E131F] border border-slate-800 text-neutral-200'
                      }`}
                    >
                      <div className="space-y-2">
                        {m.content.split('\n\n').map((para, pIdx) => {
                          // Check if paragraph looks like a mathematical equation or formula
                          const isFormula = para.includes(' = ') || para.includes('$$') || para.includes('\\sqrt') || (para.includes('·') && para.length < 120);
                          if (isFormula && !isUser) {
                            return (
                              <div
                                key={pIdx}
                                className="my-2 p-2.5 rounded-lg bg-[#070B12] border border-cyan-500/30 text-cyan-300 font-mono text-xs overflow-x-auto"
                              >
                                <div className="text-[9px] uppercase tracking-wider text-cyan-400/70 mb-1 font-bold">
                                  {locale === 'fr' ? 'Formule Électrotechnique' : 'Electrotechnical Equation'}
                                </div>
                                <div className="font-bold">{para.replace(/\$\$/g, '')}</div>
                              </div>
                            );
                          }
                          return (
                            <p key={pIdx} className="whitespace-pre-line leading-relaxed">
                              {para}
                            </p>
                          );
                        })}
                      </div>

                      {/* Google Search Grounding Sources */}
                      {m.sources && m.sources.length > 0 && (
                        <div className="pt-2 border-t border-slate-700/60 font-mono text-[11px] space-y-1">
                          <span className="text-amber-400 font-bold flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {locale === 'fr' ? 'Sources Google Search vérifiées :' : 'Google Search Grounding Sources:'}
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {m.sources.map((s, idx) => (
                              <a
                                key={idx}
                                href={s.uri}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-sky-400 border border-slate-700 hover:border-sky-400 flex items-center gap-1 transition-colors"
                              >
                                <span>{s.title}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Recommended Tool Launcher */}
                      {m.recommendedTool && (
                        <div className="pt-2 border-t border-slate-800">
                          <button
                            type="button"
                            onClick={() => {
                              if (m.recommendedTool?.type === 'calculator' && onNavigateCalculator) {
                                onNavigateCalculator(m.recommendedTool.id as CalculatorTabType);
                              } else if (m.recommendedTool?.type === 'simulation' && onNavigateSimulation) {
                                onNavigateSimulation(m.recommendedTool.id as SimulationTabType);
                              } else if (m.recommendedTool?.type === 'grid' && onNavigateCameroonGrid) {
                                onNavigateCameroonGrid();
                              } else if (m.recommendedTool?.type === 'regulatory' && onNavigateRegulatory) {
                                onNavigateRegulatory();
                              } else if (m.recommendedTool?.type === 'lifecycle' && onNavigateLifecycle) {
                                onNavigateLifecycle();
                              } else if (m.recommendedTool?.type === 'diagram' && onNavigateDiagram) {
                                onNavigateDiagram();
                              } else if (m.recommendedTool?.type === 'journey' && onNavigateJourney) {
                                onNavigateJourney();
                              } else if (m.recommendedTool?.type === 'context-stack' && onNavigateContextStack) {
                                onNavigateContextStack(m.recommendedTool.id);
                              } else if (m.recommendedTool?.type === 'protection' && onNavigateProtection) {
                                onNavigateProtection();
                              } else if (m.recommendedTool?.type === 'commissioning' && onNavigateCommissioning) {
                                onNavigateCommissioning();
                              }
                              onClose();
                            }}
                            className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-left transition-colors"
                          >
                            <span className="text-amber-300 font-bold text-xs">{m.recommendedTool.label_fr}</span>
                            <ArrowRight className="h-3.5 w-3.5 text-amber-400" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="flex gap-3 justify-start items-center">
                  <div className="h-7 w-7 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  </div>
                  <span className="text-xs text-slate-400 font-mono animate-pulse">
                    {useSearch
                      ? locale === 'fr'
                        ? 'Consultation des données Google Search & analyse...'
                        : 'Querying Google Search & analyzing...'
                      : locale === 'fr'
                      ? 'Réflexion en cours...'
                      : 'Generating response...'}
                  </span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form with Audio Transcription Button & Google Search Toggle */}
            <form onSubmit={handleSendMessage} className="p-3 sm:p-4 border-t border-slate-800 bg-[#06080E] space-y-2">
              <div className="flex items-center justify-between px-1">
                {/* Search Grounding Toggle */}
                <button
                  type="button"
                  onClick={() => setUseSearch(!useSearch)}
                  className={`text-xs px-2.5 py-1 rounded-md border flex items-center gap-1.5 transition-all ${
                    useSearch
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                  title="Enable Google Search Grounding with gemini-3.5-flash"
                >
                  <Search className="h-3.5 w-3.5 text-sky-400" />
                  <span>{locale === 'fr' ? 'Recherche Web (Google Search Grounding)' : 'Google Search Grounding'}</span>
                  {useSearch && <CheckCircle2 className="h-3 w-3 text-sky-400" />}
                </button>

                {transcribing && (
                  <span className="text-xs text-amber-400 font-mono flex items-center gap-1 animate-pulse">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>{locale === 'fr' ? 'Transcription audio (gemini-3.5-transcribe)...' : 'Transcribing voice...'}</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    locale === 'fr'
                      ? 'Posez une question technique (ex. protection 87T, poste 225/30 kV Ahala, norme CEI 61850)...'
                      : 'Ask a power engineering question (e.g., 87T protection, 225/30 kV substation, IEC 61850)...'
                  }
                  className="flex-1 bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />

                {/* Microphone Audio Transcription Button */}
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`p-2.5 rounded-xl border transition-all ${
                    isRecording
                      ? 'bg-red-500 text-white border-red-400 animate-pulse'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white hover:border-slate-700'
                  }`}
                  title={isRecording ? 'Arrêter l\'enregistrement' : 'Dicter avec le micro (gemini-3.5-transcribe)'}
                >
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>

                {/* Web Speech API Quick Dictate (no API — in-browser) */}
                {typeof window !== 'undefined' && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) && (
                  <button
                    type="button"
                    onClick={isSpeechListening ? stopSpeechRecognition : startSpeechRecognition}
                    className={`p-2.5 rounded-xl border text-[10px] font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${
                      isSpeechListening
                        ? 'bg-emerald-500 text-white border-emerald-400 animate-pulse'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-emerald-400 hover:border-emerald-500/50'
                    }`}
                    title={locale === 'fr' ? 'Dictée vocale rapide (Web Speech API — offline)' : 'Quick voice dictate (Web Speech API — offline)'}
                  >
                    <Mic className="h-3.5 w-3.5" />
                    <span className="text-[9px]">{isSpeechListening ? (locale === 'fr' ? 'STOP' : 'STOP') : (locale === 'fr' ? 'VITE' : 'QUICK')}</span>
                  </button>
                )}

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{locale === 'fr' ? 'Envoyer' : 'Send'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: CREATE & EDIT IMAGES WITH gemini-3.1-flash-image-preview */}
        {activeTab === 'image' && (
          <div className="flex-1 flex flex-col min-h-0 p-4 sm:p-6 space-y-4 overflow-y-auto">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <ImageIcon className="h-4 w-4" />
                <span>{locale === 'fr' ? 'Génération & Édition d\'Images avec gemini-3.1-flash-image-preview' : 'Image Generation & Editing with gemini-3.1-flash-image-preview'}</span>
              </div>
              <p className="text-xs text-slate-400">
                {locale === 'fr'
                  ? 'Générez des schémas d\'ingénierie, des écorchés de postes HTB, ou éditez une image existante en envoyant une invite textuelle et une image de référence.'
                  : 'Generate engineering cutaways, HV substation schematics, or edit an existing image with text prompts and reference image input.'}
              </p>

              <form onSubmit={handleGenerateImage} className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      placeholder={
                        locale === 'fr'
                          ? 'Prompt : ex. Schéma écorché réaliste d\'un disjoncteur SF6 225 kV avec chambre de coupure...'
                          : 'Prompt: e.g. Realistic cutaway of a 225 kV SF6 circuit breaker with arcing chamber...'
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                    />

                    {/* Reference image preview */}
                    {referenceImage && (
                      <div className="flex items-center gap-2 p-2 bg-slate-950 border border-purple-500/40 rounded-lg">
                        <img src={referenceImage} alt="Ref preview" className="h-10 w-10 object-cover rounded" />
                        <span className="text-[11px] text-purple-300 flex-1">{locale === 'fr' ? 'Image de référence attachée pour modification' : 'Reference image attached for editing'}</span>
                        <button
                          type="button"
                          onClick={() => setReferenceImage(null)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <ImageIcon className="h-3.5 w-3.5 text-purple-400" />
                      <span>{referenceImage ? (locale === 'fr' ? 'Changer Image' : 'Change') : (locale === 'fr' ? 'Joindre Image' : 'Attach')}</span>
                    </button>

                    <button
                      type="submit"
                      disabled={!imagePrompt.trim() || generatingImage}
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md"
                    >
                      {generatingImage ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>{locale === 'fr' ? 'Création...' : 'Generating...'}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>{referenceImage ? (locale === 'fr' ? 'Éditer' : 'Edit') : (locale === 'fr' ? 'Générer' : 'Generate')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Generated Images Gallery */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {locale === 'fr' ? 'Galerie des visuels générés' : 'Generated Visuals Gallery'}
              </h3>

              {generatedImages.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500 text-xs">
                  {locale === 'fr'
                    ? 'Aucune image générée pour le moment. Entrez une description pour créer un visuel.'
                    : 'No images generated yet. Type a prompt above to create an engineering visual.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generatedImages.map((img) => (
                    <div key={img.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden p-3 space-y-2">
                      <img src={img.url} alt={img.prompt} className="w-full h-48 object-cover rounded-lg bg-slate-950" />
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-white line-clamp-2">{img.prompt}</p>
                        {img.text && <p className="text-[11px] text-slate-400 line-clamp-2">{img.text}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
