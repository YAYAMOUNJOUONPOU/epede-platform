// server/routes/v1/cameroonGridRouter.ts
// EPEDE Backend API v1 — Verified Cameroon Power Network & Provenance Service

import { Router } from 'express';
import {
  CAMEROON_GRID_SUMMARY,
  CAMEROON_POWER_PLANTS,
  CAMEROON_SUBSTATIONS,
  CAMEROON_TRANSMISSION_CORRIDORS,
} from '../../../src/data/cameroonGridData';

export const cameroonGridRouter = Router();

// GET /api/v1/cameroon-grid
cameroonGridRouter.get('/', (_req, res) => {
  res.json({
    success: true,
    summary: CAMEROON_GRID_SUMMARY,
    counts: {
      powerPlants: CAMEROON_POWER_PLANTS.length,
      substations: CAMEROON_SUBSTATIONS.length,
      transmissionCorridors: CAMEROON_TRANSMISSION_CORRIDORS.length,
    },
    data: {
      powerPlants: CAMEROON_POWER_PLANTS,
      substations: CAMEROON_SUBSTATIONS,
      transmissionCorridors: CAMEROON_TRANSMISSION_CORRIDORS,
    },
  });
});

// GET /api/v1/cameroon-grid/plants
cameroonGridRouter.get('/plants', (req, res) => {
  const gridSystem = typeof req.query.grid === 'string' ? req.query.grid.toUpperCase() : undefined;
  const plants = gridSystem
    ? CAMEROON_POWER_PLANTS.filter((p) => p.grid_system === gridSystem)
    : CAMEROON_POWER_PLANTS;
  res.json({
    success: true,
    count: plants.length,
    data: plants,
  });
});

// GET /api/v1/cameroon-grid/substations
cameroonGridRouter.get('/substations', (req, res) => {
  const gridSystem = typeof req.query.grid === 'string' ? req.query.grid.toUpperCase() : undefined;
  const substations = gridSystem
    ? CAMEROON_SUBSTATIONS.filter((s) => s.grid_system === gridSystem)
    : CAMEROON_SUBSTATIONS;
  res.json({
    success: true,
    count: substations.length,
    data: substations,
  });
});

// GET /api/v1/cameroon-grid/corridors
cameroonGridRouter.get('/corridors', (_req, res) => {
  res.json({
    success: true,
    count: CAMEROON_TRANSMISSION_CORRIDORS.length,
    data: CAMEROON_TRANSMISSION_CORRIDORS,
  });
});

