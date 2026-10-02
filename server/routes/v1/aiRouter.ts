// server/routes/v1/aiRouter.ts
import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';
import { graphService } from '../../services/graphService';
import { canonicalDb } from '../../db/canonicalDataStore';

export const aiRouter = Router();

// In-memory sliding-window rate limiter (prevents API token exhaustion and denial-of-service)
const ipRateLimitMap = new Map<string, { count: number; resetTime: number }>();
function checkRateLimit(ip: string, maxRequests = 40, windowMs = 60000): boolean {
  const now = Date.now();
  const record = ipRateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    ipRateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  if (record.count >= maxRequests) return false;
  record.count++;
  return true;
}

aiRouter.use((req, res, next) => {
  const ip = req.ip || req.socket.remoteAddress || 'anonymous-client';
  if (!checkRateLimit(ip, 40, 60000)) {
    return res.status(429).json({
      error: 'Rate limit exceeded. Please wait a minute before sending further AI queries.',
      retryAfterSec: 60,
    });
  }
  next();
});

let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

const EPEDE_SYSTEM_INSTRUCTION = `You are the EPEDE Senior Electrical Power Engineering Copilot (Encyclopédie Pratique de l'Ingénierie Électrique & Postes HT/BT).
You are an authoritative, practical, and highly pedagogical expert in electrical power transmission, substations (AIS/GIS), medium/low voltage distribution, industrial electrical design, and power grid automation.
You have direct access to IEC/IEEE standards base and regional power grids (specifically Cameroon RIS operated by SONATREL and Eneo).
Structure responses cleanly using markdown bullet points, clear technical terms, and standard electrical symbols.
Always append a concise note reminding the user that EPEDE is an engineering knowledge and conceptual reference system, and execution designs require formal verification by licensed engineers and certified engineering software (e.g., ETAP, DIgSILENT PowerFactory).
Respond in the language requested by the user (French if queried in French, English if queried in English).`;

// 1. Multi-turn Chat Endpoint (gemini-2.5-flash for general/fast, gemini-2.5-pro for complex STEM reasoning)
aiRouter.post('/chat', async (req, res) => {
  try {
    const { messages, locale, complexity = 'general', useSearchGrounding = false } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const ai = getAI();
    if (!ai) {
      return res.status(200).json({
        fallback: true,
        text: locale === 'en'
          ? 'AI services are currently operating in local catalog reference mode. Please configure GEMINI_API_KEY for live generative analysis.'
          : 'Le service IA fonctionne actuellement en mode référentiel local. Configurez GEMINI_API_KEY pour l\'analyse générative en direct.',
      });
    }

    // Model selection based on user request criteria:
    // - gemini-2.5-pro for complex STEM reasoning
    // - gemini-2.5-flash for general tasks and search grounding
    let selectedModel = 'gemini-2.5-flash';
    if (useSearchGrounding) {
      selectedModel = 'gemini-2.5-flash';
    } else if (complexity === 'complex') {
      selectedModel = 'gemini-2.5-pro';
    } else if (complexity === 'fast') {
      selectedModel = 'gemini-2.5-flash';
    }

    const contents = messages.map((m: { role: 'user' | 'assistant' | 'model'; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const config: any = {
      systemInstruction: EPEDE_SYSTEM_INSTRUCTION,
      temperature: 0.25,
      maxOutputTokens: 2048,
    };

    if (useSearchGrounding) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config,
    });

    const text = response.text || '';
    const groundingChunks = (response.candidates?.[0] as any)?.groundingMetadata?.groundingChunks || [];
    const webSearchSources = groundingChunks
      .map((c: any) => c.web?.uri ? { title: c.web.title || c.web.uri, uri: c.web.uri } : null)
      .filter(Boolean);

    return res.json({
      fallback: false,
      text,
      model: selectedModel,
      sources: webSearchSources,
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: error?.message || 'Chat generation error' });
  }
});

// 2. Audio Transcription using gemini-2.5-flash
aiRouter.post('/transcribe', async (req, res) => {
  try {
    const { audioBase64, mimeType = 'audio/webm' } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ error: 'audioBase64 is required' });
    }

    const ai = getAI();
    if (!ai) {
      return res.status(503).json({ error: 'Gemini API not configured on server' });
    }

    const audioPart = {
      inlineData: {
        mimeType,
        data: audioBase64,
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          audioPart,
          { text: 'Transcribe this electrical engineering audio verbatim. Retain all technical codes (ANSI, IEC, MW, kV, MVA, TGBT, SF6, etc.).' },
        ],
      },
    });

    return res.json({
      text: response.text || '',
      model: 'gemini-2.5-flash',
    });
  } catch (error: any) {
    console.error('Transcription error:', error);
    return res.status(500).json({ error: error?.message || 'Audio transcription error' });
  }
});

// 3. Create & Edit Images using imagen-3.0-generate-002 / gemini-2.5-flash
aiRouter.post('/image-generate', async (req, res) => {
  try {
    const { prompt, base64Image, mimeType = 'image/png', aspectRatio = '1:1' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = getAI();
    if (!ai) {
      return res.status(503).json({ error: 'Gemini API not configured on server' });
    }

    const parts: any[] = [];
    if (base64Image) {
      parts.push({
        inlineData: {
          mimeType,
          data: base64Image,
        },
      });
    }
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts },
    });

    let generatedImageUrl = '';
    let responseText = '';

    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          generatedImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        } else if (part.text) {
          responseText += part.text;
        }
      }
    }

    return res.json({
      imageUrl: generatedImageUrl,
      text: responseText,
      model: 'gemini-2.5-flash',
    });
  } catch (error: any) {
    console.error('Image generation/edit error:', error);
    return res.status(500).json({ error: error?.message || 'Image generation error' });
  }
});

// 4. Multimodal Nameplate & Substation Photo Diagnostics
aiRouter.post('/analyze-nameplate', async (req, res) => {
  try {
    const { base64Image, mimeType = 'image/jpeg', locale = 'fr' } = req.body;

    if (!base64Image) {
      return res.status(400).json({ error: 'Base64 image data is required' });
    }

    const ai = getAI();
    if (!ai) {
      return res.status(503).json({ error: 'Gemini API not configured on server' });
    }

    const prompt = `You are the Senior Power Engineering Multimodal Inspector for the EPEDE platform.
Analyze this photo of an electrical equipment nameplate or substation bay installation.
Extract the technical specifications accurately and return a structured JSON response matching this schema:
{
  "detectedEquipment": "Transformer | CircuitBreaker | Disconnector | CT | VT | SurgeArrester | InductionMotor | HydroGenerator | CapacitorBank | Relay | Switchboard | Unknown",
  "equipmentTitle": "A concise, technical name of the equipment in ${locale === 'fr' ? 'French' : 'English'}",
  "confidenceScore": 0.95,
  "manufacturer": "e.g. ABB, Schneider Electric, Siemens, Alstom, or Unspecified",
  "serialNumber": "string or null",
  "ratedVoltage": "e.g. 225 kV, 30 kV, 400 V",
  "ratedCurrent": "e.g. 1250 A",
  "ratedPower": "e.g. 63 MVA, 250 kW, or null",
  "frequency": "50 Hz / 60 Hz",
  "shortCircuitWithstand": "e.g. 31.5 kA / 3s or null",
  "applicableStandards": ["IEC 62271-100", "IEC 60076", etc.],
  "keyParameters": [
    {"label": "Parameter Name", "value": "Value with SI unit"}
  ],
  "operationalDiagnosis": "Clear engineering commentary explaining condition, design characteristics, and maintenance precautions in ${locale === 'fr' ? 'French' : 'English'}",
  "recommendedEpedeCalculator": "power | voltage-drop | transformer | motor | sil | earthing | arc-flash | ct-sizing | pfc | surge-arrester | busbar-electrodynamic | cable-ampacity | relay-tcc"
}

Important: Return ONLY valid JSON, no markdown code fence blocks if possible.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64Image,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const candidate = response.candidates?.[0];
    const textContent = candidate?.content?.parts?.[0]?.text || '{}';
    let parsedData = {};
    try {
      parsedData = JSON.parse(textContent);
    } catch {
      parsedData = { rawText: textContent };
    }

    return res.json({
      success: true,
      analysis: parsedData,
      model: 'gemini-2.5-flash',
    });
  } catch (error: any) {
    console.error('Nameplate inspection error:', error);
    return res.status(500).json({ error: error?.message || 'Nameplate analysis error' });
  }
});

// 5. Copilot with graph context injection
aiRouter.post('/copilot', async (req, res) => {
  try {
    const { query, locale, activeEquipmentId, activeDomainId, history } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ success: false, error: 'Query string is required' });
    }

    const ai = getAI();
    if (!ai) {
      return res.status(200).json({
        success: true,
        fallback: true,
        message: 'No GEMINI_API_KEY configured. Falling back to structured local knowledge.',
      });
    }

    let contextBlock = '';
    if (activeEquipmentId) {
      const eq = canonicalDb.equipment.get(activeEquipmentId);
      if (eq) {
        const graphContext = graphService.getNodeContext(activeEquipmentId);
        contextBlock += `\n[ACTIVE ENGINEERING OBJECT CONTEXT]\n`;
        contextBlock += `Equipment: ${eq.name.fr} (${eq.name.en})\n`;
        contextBlock += `Domain: ${eq.domainId} | Tag: ${eq.tag || 'N/A'} | Nominal Voltage: ${eq.voltageNominal || 'N/A'}\n`;
        contextBlock += `Function: ${eq.primaryFunction.fr}\n`;
        contextBlock += `Assigned Protections: ${eq.protectionFunctions.join(', ') || 'None'}\n`;
        contextBlock += `Specifications: ${JSON.stringify(eq.specifications)}\n`;
        contextBlock += `Standards: ${eq.standards.join(', ')}\n`;
        if (graphContext.upstream.length > 0) {
          contextBlock += `Upstream Feeds: ${graphContext.upstream.map((u) => u.equipment?.name.fr).filter(Boolean).join(', ')}\n`;
        }
        if (graphContext.downstream.length > 0) {
          contextBlock += `Downstream Loads: ${graphContext.downstream.map((d) => d.equipment?.name.fr).filter(Boolean).join(', ')}\n`;
        }
      }
    } else if (activeDomainId) {
      const domain = canonicalDb.domains.get(activeDomainId);
      if (domain) {
        contextBlock += `\n[ACTIVE DOMAIN CONTEXT]\n`;
        contextBlock += `Domain: ${domain.code} - ${domain.name.fr} (${domain.name.en})\n`;
        contextBlock += `Description: ${domain.description.fr}\n`;
        contextBlock += `Key Technologies: ${domain.keyTechnologies.join(', ')}\n`;
        if (domain.cameroonContext) {
          contextBlock += `Cameroon Regional Context: ${domain.cameroonContext.fr}\n`;
        }
      }
    }

    const langDirective =
      locale === 'en'
        ? 'Respond in English with rigorous engineering terminology.'
        : 'Réponds en Français avec la terminologie électrotechnique de référence.';

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
      parts: [
        {
          text: `${langDirective}\n${contextBlock}\n\nUser Question:\n${query}`,
        },
      ],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction: EPEDE_SYSTEM_INSTRUCTION,
        temperature: 0.25,
        maxOutputTokens: 1200,
      },
    });

    return res.json({
      success: true,
      fallback: false,
      text: response.text || '',
      contextInjected: Boolean(contextBlock),
      model: 'gemini-2.5-flash',
    });
  } catch (error: any) {
    console.error('EPEDE Copilot Error:', error);
    return res.status(500).json({
      success: false,
      fallback: true,
      error: error?.message || 'Error communicating with AI Service',
    });
  }
});
