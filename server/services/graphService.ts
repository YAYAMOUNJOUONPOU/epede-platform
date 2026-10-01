// server/services/graphService.ts
// Knowledge Graph Traversal & Context Resolution Engine for EPEDE Backend

import { canonicalDb } from '../db/canonicalDataStore';
import { ApiRelationship, ApiEquipment } from '../models/types';

export interface GraphNodeWithEdges {
  node: ApiEquipment | null;
  upstream: Array<{ relationship: ApiRelationship; equipment: ApiEquipment | null }>;
  downstream: Array<{ relationship: ApiRelationship; equipment: ApiEquipment | null }>;
  protections: Array<{ relationship: ApiRelationship; equipment: ApiEquipment | null }>;
  controls: Array<{ relationship: ApiRelationship; equipment: ApiEquipment | null }>;
  measurements: Array<{ relationship: ApiRelationship; equipment: ApiEquipment | null }>;
  standards: Array<{ relationship: ApiRelationship; standard: any }>;
  allRelationshipsCount: number;
}

export class GraphService {
  public getNodeContext(equipmentId: string): GraphNodeWithEdges {
    const node = canonicalDb.equipment.get(equipmentId) || null;
    const allRels = canonicalDb.relationships.filter(
      (r) => r.sourceId === equipmentId || r.targetId === equipmentId
    );

    const upstream: GraphNodeWithEdges['upstream'] = [];
    const downstream: GraphNodeWithEdges['downstream'] = [];
    const protections: GraphNodeWithEdges['protections'] = [];
    const controls: GraphNodeWithEdges['controls'] = [];
    const measurements: GraphNodeWithEdges['measurements'] = [];
    const standards: GraphNodeWithEdges['standards'] = [];

    const seenStandardIds = new Set<string>();

    for (const rel of allRels) {
      const partnerId = rel.sourceId === equipmentId ? rel.targetId : rel.sourceId;
      const partnerEq = canonicalDb.equipment.get(partnerId) || null;

      if (rel.relation === 'SUPPLIES' || rel.relation === 'TRANSFORMS') {
        if (rel.targetId === equipmentId) {
          // Source supplies this equipment -> upstream
          upstream.push({
            relationship: rel,
            equipment: partnerEq,
          });
        } else {
          // This equipment supplies target -> downstream
          downstream.push({
            relationship: rel,
            equipment: partnerEq,
          });
        }
      } else if (rel.relation === 'PROTECTED_BY') {
        protections.push({
          relationship: rel,
          equipment: partnerEq,
        });
      } else if (rel.relation === 'CONTROLLED_BY') {
        controls.push({
          relationship: rel,
          equipment: partnerEq,
        });
      } else if (rel.relation === 'MEASURED_BY') {
        measurements.push({
          relationship: rel,
          equipment: partnerEq,
        });
      } else if (rel.relation === 'GOVERNED_BY') {
        const std = canonicalDb.standards.get(rel.targetId) || null;
        if (std && !seenStandardIds.has(std.id)) {
          seenStandardIds.add(std.id);
          standards.push({
            relationship: rel,
            standard: std,
          });
        }
      }
    }

    // Also enrich with standards declared directly on the node
    if (node?.standards) {
      for (const stdCode of node.standards) {
        const std = canonicalDb.standards.get(stdCode) || null;
        if (std && !seenStandardIds.has(std.id)) {
          seenStandardIds.add(std.id);
          standards.push({
            relationship: {
              id: `rel-std-${node.id}-${std.id}`,
              sourceId: node.id,
              sourceType: 'EQUIPMENT',
              targetId: std.id,
              targetType: 'STANDARD',
              relation: 'GOVERNED_BY',
              description: {
                fr: `Conformité technique aux exigences normatives ${std.code}`,
                en: `Technical compliance with ${std.code} normative requirements`,
              },
            },
            standard: std,
          });
        }
      }
    }

    return {
      node,
      upstream,
      downstream,
      protections,
      controls,
      measurements,
      standards,
      allRelationshipsCount: allRels.length,
    };
  }

  public getAllRelationships(): ApiRelationship[] {
    return canonicalDb.relationships;
  }
}

export const graphService = new GraphService();
