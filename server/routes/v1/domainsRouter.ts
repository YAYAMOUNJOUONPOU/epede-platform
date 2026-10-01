// server/routes/v1/domainsRouter.ts
import { Router } from 'express';
import { domainService } from '../../services/domainService';

export const domainsRouter = Router();

// GET /api/v1/domains
domainsRouter.get('/', (_req, res) => {
  try {
    const domains = domainService.getAllDomains();
    res.json({
      success: true,
      count: domains.length,
      data: domains,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message });
  }
});

// GET /api/v1/domains/:id
domainsRouter.get('/:id', (req, res) => {
  try {
    const domain = domainService.getDomainById(req.params.id);
    if (!domain) {
      return res.status(404).json({ success: false, error: 'Domain not found' });
    }
    const equipment = domainService.getDomainEquipment(domain.id);
    const standards = domainService.getDomainStandards(domain.id);

    return res.json({
      success: true,
      data: {
        ...domain,
        equipment,
        standards,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});
