// server/routes/v1/workbenchesRouter.ts
import { Router } from 'express';
import { workbenchService } from '../../services/workbenchService';

export const workbenchesRouter = Router();

// GET /api/v1/workbenches
workbenchesRouter.get('/', (_req, res) => {
  try {
    const list = workbenchService.getAllWorkbenches();
    res.json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message });
  }
});

// GET /api/v1/workbenches/:id
workbenchesRouter.get('/:id', (req, res) => {
  try {
    const wb = workbenchService.getWorkbenchById(req.params.id);
    if (!wb) {
      return res.status(404).json({ success: false, error: 'Workbench not found' });
    }
    return res.json({
      success: true,
      data: wb,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});

// POST /api/v1/workbenches/:id/run
workbenchesRouter.post('/:id/run', (req, res) => {
  try {
    const { inputs } = req.body;
    if (!inputs || typeof inputs !== 'object') {
      return res.status(400).json({ success: false, error: 'Invalid calculation inputs payload' });
    }

    const result = workbenchService.executeCalculation(req.params.id, inputs);
    return res.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});
