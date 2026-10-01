// server/routes/v1/searchRouter.ts
import { Router } from 'express';
import { searchService } from '../../services/searchService';

export const searchRouter = Router();

// GET /api/v1/search?q=...
searchRouter.get('/', (req, res) => {
  try {
    const q = req.query.q as string;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;

    const results = searchService.search(q || '', limit);
    res.json({
      success: true,
      query: q || '',
      count: results.length,
      data: results,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message });
  }
});
