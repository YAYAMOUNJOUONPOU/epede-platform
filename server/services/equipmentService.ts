// server/services/equipmentService.ts
// Business Logic for Equipment Catalogue, Technical Specs & Relationships

import { canonicalDb } from '../db/canonicalDataStore';
import { ApiEquipment } from '../models/types';

export interface EquipmentFilterOptions {
  domainId?: string;
  type?: string;
  voltage?: string;
  protectionAnsi?: string;
  q?: string;
}

export class EquipmentService {
  public getAllEquipment(options?: EquipmentFilterOptions): ApiEquipment[] {
    let list = Array.from(canonicalDb.equipment.values());

    if (!options) return list;

    if (options.domainId) {
      list = list.filter((eq) => eq.domainId.toLowerCase() === options.domainId!.toLowerCase());
    }

    if (options.type) {
      list = list.filter((eq) => eq.type.toLowerCase() === options.type!.toLowerCase());
    }

    if (options.voltage) {
      list = list.filter(
        (eq) => eq.voltageNominal && eq.voltageNominal.toLowerCase().includes(options.voltage!.toLowerCase())
      );
    }

    if (options.protectionAnsi) {
      list = list.filter((eq) =>
        eq.protectionFunctions.some((ansi) => ansi.toLowerCase() === options.protectionAnsi!.toLowerCase())
      );
    }

    if (options.q) {
      const query = options.q.toLowerCase();
      list = list.filter(
        (eq) =>
          eq.name.fr.toLowerCase().includes(query) ||
          eq.name.en.toLowerCase().includes(query) ||
          eq.primaryFunction.fr.toLowerCase().includes(query) ||
          eq.primaryFunction.en.toLowerCase().includes(query) ||
          (eq.tag && eq.tag.toLowerCase().includes(query))
      );
    }

    return list;
  }

  public getEquipmentById(id: string): ApiEquipment | null {
    return canonicalDb.equipment.get(id) || null;
  }

  public getEquipmentRelationships(id: string) {
    return canonicalDb.relationships.filter(
      (rel) => rel.sourceId === id || rel.targetId === id
    );
  }

  public getEquipmentStandards(id: string) {
    const eq = this.getEquipmentById(id);
    if (!eq) return [];
    return eq.standards
      .map((sid) => canonicalDb.standards.get(sid))
      .filter((s): s is NonNullable<typeof s> => Boolean(s));
  }
}

export const equipmentService = new EquipmentService();
