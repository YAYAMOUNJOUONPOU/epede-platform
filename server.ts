import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { domainsRouter } from './server/routes/v1/domainsRouter';
import { equipmentRouter } from './server/routes/v1/equipmentRouter';
import { graphRouter } from './server/routes/v1/graphRouter';
import { workbenchesRouter } from './server/routes/v1/workbenchesRouter';
import { searchRouter } from './server/routes/v1/searchRouter';
import { aiRouter } from './server/routes/v1/aiRouter';
import { scenariosRouter } from './server/routes/v1/scenariosRouter';
import { fieldEngineeringRouter } from './server/routes/v1/fieldEngineeringRouter';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// API health endpoints
const healthHandler = (_req: express.Request, res: express.Response) => {
  res.json({
    status: 'ok',
    service: 'EPEDE Power Engineering Platform',
    version: '2.1.0',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    apis: [
      '/api/v1/domains',
      '/api/v1/equipment',
      '/api/v1/graph',
      '/api/v1/workbenches',
      '/api/v1/search',
      '/api/v1/scenarios',
      '/api/v1/field-engineering',
      '/api/v1/ai',
    ],
    timestamp: new Date().toISOString(),
  });
};

app.get('/api/health', healthHandler);
app.get('/api/v1/health', healthHandler);

// Mount Canonical API v1 Services
app.use('/api/v1/domains', domainsRouter);
app.use('/api/v1/equipment', equipmentRouter);
app.use('/api/v1/graph', graphRouter);
app.use('/api/v1/workbenches', workbenchesRouter);
app.use('/api/v1/search', searchRouter);
app.use('/api/v1/scenarios', scenariosRouter);
app.use('/api/v1/field-engineering', fieldEngineeringRouter);
app.use('/api/v1/ai', aiRouter);

// EPEDE AI Power Systems Copilot API
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

const EPEDE_SYSTEM_INSTRUCTION = `You are the EPEDE Senior Electrical Power Systems Engineering Copilot (Encyclopédie Pratique de l'Ingénierie Électrique & Postes HT/BT).
You are an authoritative, practical, and highly pedagogical expert in electrical power transmission, substations (AIS/GIS), medium/low voltage distribution, industrial electrical design, and power grid automation.

Your expertise spans:
1. International Standards:
   - IEC Standards: IEC 60076 (Power Transformers), IEC 60909 (Short-Circuit Currents), IEC 60255 (Protection Relays), IEC 62271 (HV Switchgear & Controlgear), IEC 61850 (Substation Automation, GOOSE, MMS, SV), IEC 60364 (Low-Voltage Installations), IEC 61869 (Instrument Transformers CT/VT).
   - IEEE Standards: IEEE 80 (Substation Grounding Safety & Step/Touch Potentials), IEEE 1584-2018 (Arc Flash Hazard Analysis), IEEE 242 (Buff Book - Protection & Coordination), IEEE C37.
   - NFPA 70E & CSA Z462: Electrical Workplace Safety & PPE Categories.

2. Substation & Switchgear Engineering:
   - Primary equipment: Circuit breakers (SF6, Vacuum), disconnectors & earthing switches (interlocking logic), surge arresters, CT/VT sizing and knee-point (Vk) saturation checks, busbar schemes (single, double, breaker-and-a-half).
   - Transformers: Vector groups (Dyn11, YNd11), OLTC on-load tap changers, impedance (%Uk), loss evaluation, cooling modes (ONAN, ONAF, OFAF).
   - Substation Grounding: Ground grid mesh, touch and step voltage limits per IEEE 80, crushed rock surfacing layer.

3. Protection & Control Schemes:
   - ANSI functions: 87T (transformer differential with 2nd/5th harmonic restraint), 21 (distance relay, mho/quadrilateral zones), 50/51 & 50N/51N (instantaneous and time overcurrent with IEC curves SI/VI/EI), 67/67N (directional), 49 (thermal overload), 63 (Buchholz), 59N / 64R (restricted earth fault).
   - Selectivity and coordination margins (grading margin Delta-t >= 250-300 ms).

4. Regional & National Grid Topologies (specifically Cameroon RIS & Central Africa):
   - RIS (Réseau Interconnecté Sud) & RIN operated by SONATREL (Transmission System Operator, 225 kV bulk transmission, 90 kV regional sub-transmission).
   - Distribution operator: Eneo Cameroon (standardized MV voltage of 30 kV, legacy 15 kV; equipment rated for 36 kV insulation per IEC 62271-200).
   - Power plants: Hydroelectric Songloulou (384 MW, 8 Francis units), Edéa (276 MW), Lom Pangar reservoir (regulating Sanaga flow at 1000 m³/s, 30 MW plant), Nachtigal (420 MW run-of-river), Memve'ele (211 MW on Ntem river); Thermal Kribi Gas (216 MW).
   - Key nodal substations: Ahala 225/30 kV (Yaoundé), Mangombé 225/90/30 kV (Edéa), Oyomabang, Bekoko, Logbaba, Kondengui.

5. Guardrails & Tone:
   - Structure responses cleanly using markdown bullet points, clear technical terms, and standard electrical symbols.
   - Never produce formal unverified contractual calculation notes. Always append a concise note reminding the user that EPEDE is an engineering knowledge and conceptual reference system, and execution designs require formal verification by licensed engineers and certified engineering software (e.g., ETAP, DIgSILENT PowerFactory).
   - Respond in the language requested by the user (French if queried in French, English if queried in English).`;

// Sliding-window IP rate limiter for /api/assistant
const assistantRateLimits = new Map<string, number[]>();
const ASSISTANT_MAX_PER_MINUTE = 40;

const assistantRateLimiter: express.RequestHandler = (req, res, next) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const timestamps = (assistantRateLimits.get(ip) || []).filter((t) => now - t < 60000);
  if (timestamps.length >= ASSISTANT_MAX_PER_MINUTE) {
    return res.status(429).json({
      error: 'Rate limit exceeded: Max 40 assistant requests per minute per IP.',
      retryAfterSeconds: Math.ceil((timestamps[0] + 60000 - now) / 1000),
    });
  }
  timestamps.push(now);
  assistantRateLimits.set(ip, timestamps);
  next();
};

app.post('/api/assistant', assistantRateLimiter, async (req, res) => {
  try {
    const { query, locale, history } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query is required' });
    }

    const ai = getAI();
    if (!ai) {
      return res.status(200).json({
        fallback: true,
        message: 'No GEMINI_API_KEY configured on the server. Falling back to local engineering knowledge engine.',
      });
    }

    const langDirective = locale === 'en' ? 'Respond in English.' : 'Réponds en Français avec la terminologie technique de référence.';

    // Construct contents with optional short conversation context
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      for (const h of history.slice(-4)) {
        if (h.sender === 'user') {
          contents.push({ role: 'user', parts: [{ text: h.text }] });
        } else if (h.sender === 'assistant' && !h.isRefusal) {
          contents.push({ role: 'model', parts: [{ text: h.text }] });
        }
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: `${langDirective}\n\nQuestion d'ingénierie électrique :\n${query}` }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction: EPEDE_SYSTEM_INSTRUCTION,
        temperature: 0.3,
        maxOutputTokens: 1024,
      },
    });

    const text = response.text || '';

    return res.json({
      fallback: false,
      text,
      model: 'gemini-2.5-flash',
    });
  } catch (error: any) {
    console.error('EPEDE Gemini Assistant Error:', error);
    return res.status(500).json({
      fallback: true,
      error: error?.message || 'Error communicating with Gemini API',
    });
  }
});

// API 404 JSON Catch-All: ensures unhandled /api/* requests return JSON rather than falling through to SPA HTML
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API endpoint ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production' || (typeof __filename !== 'undefined' && __filename.includes('dist'));

  // Vite middleware for development
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[EPEDE] Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
