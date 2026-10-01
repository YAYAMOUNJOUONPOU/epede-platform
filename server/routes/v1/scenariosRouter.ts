// server/routes/v1/scenariosRouter.ts
import { Router } from 'express';
import { scenarioService } from '../../services/scenarioService';

export const scenariosRouter = Router();

// GET /api/v1/scenarios
scenariosRouter.get('/', (_req, res) => {
  try {
    const scenarios = scenarioService.getAllScenarios();
    const rules = scenarioService.getAllRules();
    res.json({
      success: true,
      count: scenarios.length,
      rulesCount: rules.length,
      data: scenarios,
      rules,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message });
  }
});

// GET /api/v1/scenarios/:id
scenariosRouter.get('/:id', (req, res) => {
  try {
    const scenario = scenarioService.getScenarioById(req.params.id);
    if (!scenario) {
      return res.status(404).json({ success: false, error: 'Scenario not found' });
    }
    return res.json({
      success: true,
      data: scenario,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});

// POST /api/v1/scenarios/validate-transition
scenariosRouter.post('/validate-transition', (req, res) => {
  try {
    const { equipmentId, action, currentStates } = req.body;
    if (!equipmentId || !action || !currentStates) {
      return res.status(400).json({
        success: false,
        error: 'equipmentId, action, and currentStates are required in body',
      });
    }

    const result = scenarioService.validateTransition({
      equipmentId,
      action,
      currentStates,
    });

    return res.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});
