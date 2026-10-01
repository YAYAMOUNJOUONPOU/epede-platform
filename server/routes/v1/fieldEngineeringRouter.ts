// server/routes/v1/fieldEngineeringRouter.ts
import { Router } from 'express';
import { fieldEngineeringService } from '../../services/fieldEngineeringService';

export const fieldEngineeringRouter = Router();

// GET /api/v1/field-engineering
fieldEngineeringRouter.get('/', (_req, res) => {
  try {
    const protocols = fieldEngineeringService.getAllProtocols();
    res.json({
      success: true,
      service: 'EPEDE Field Engineering & Commissioning Protocols API',
      protocolsCount: protocols.length,
      endpoints: [
        '/api/v1/field-engineering/protocols',
        '/api/v1/field-engineering/protocols/:id',
      ],
      data: protocols,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message });
  }
});

// GET /api/v1/field-engineering/protocols
fieldEngineeringRouter.get('/protocols', (_req, res) => {
  try {
    const protocols = fieldEngineeringService.getAllProtocols();
    res.json({
      success: true,
      count: protocols.length,
      data: protocols,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message });
  }
});

// GET /api/v1/field-engineering/protocols/:id
fieldEngineeringRouter.get('/protocols/:id', (req, res) => {
  try {
    const protocol = fieldEngineeringService.getProtocolById(req.params.id);
    if (!protocol) {
      return res.status(404).json({ success: false, error: 'Protocol not found' });
    }
    return res.json({
      success: true,
      data: protocol,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});
