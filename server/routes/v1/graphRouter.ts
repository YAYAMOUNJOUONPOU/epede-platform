// server/routes/v1/graphRouter.ts
import { Router } from 'express';
import { graphService } from '../../services/graphService';

export const graphRouter = Router();

// GET /api/v1/graph
graphRouter.get('/', (_req, res) => {
  try {
    const relationships = graphService.getAllRelationships();
    res.json({
      success: true,
      service: 'EPEDE Canonical Knowledge Graph API',
      totalRelationships: relationships.length,
      endpoints: [
        '/api/v1/graph/relationships',
        '/api/v1/graph/node/:id',
        '/api/v1/graph/equipment/:id',
      ],
      data: relationships.slice(0, 20),
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message });
  }
});

// GET /api/v1/graph/relationships
graphRouter.get('/relationships', (_req, res) => {
  try {
    const relationships = graphService.getAllRelationships();
    res.json({
      success: true,
      count: relationships.length,
      data: relationships,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message });
  }
});

// GET /api/v1/graph/node/:id
graphRouter.get('/node/:id', (req, res) => {
  try {
    const context = graphService.getNodeContext(req.params.id);
    if (!context.node) {
      return res.status(404).json({ success: false, error: 'Node not found in canonical graph' });
    }
    return res.json({
      success: true,
      data: context,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});

// GET /api/v1/graph/equipment/:id
graphRouter.get('/equipment/:id', (req, res) => {
  try {
    const context = graphService.getNodeContext(req.params.id);
    return res.json({
      success: true,
      data: context,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});
