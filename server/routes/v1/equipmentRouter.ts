// server/routes/v1/equipmentRouter.ts
import { Router } from 'express';
import { equipmentService } from '../../services/equipmentService';
import { graphService } from '../../services/graphService';

export const equipmentRouter = Router();

// GET /api/v1/equipment
equipmentRouter.get('/', (req, res) => {
  try {
    const { domainId, type, voltage, protectionAnsi, q } = req.query;
    const list = equipmentService.getAllEquipment({
      domainId: domainId as string,
      type: type as string,
      voltage: voltage as string,
      protectionAnsi: protectionAnsi as string,
      q: q as string,
    });

    res.json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message });
  }
});

// GET /api/v1/equipment/:id
equipmentRouter.get('/:id', (req, res) => {
  try {
    const eq = equipmentService.getEquipmentById(req.params.id);
    if (!eq) {
      return res.status(404).json({ success: false, error: 'Equipment not found' });
    }

    const context = graphService.getNodeContext(eq.id);
    const standards = equipmentService.getEquipmentStandards(eq.id);

    return res.json({
      success: true,
      data: {
        ...eq,
        context,
        standards,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});
