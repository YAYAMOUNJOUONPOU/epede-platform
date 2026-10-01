// server/services/domainService.ts
// Business Logic for Domain & Subdomain Retrieval and Hierarchy

import { canonicalDb } from '../db/canonicalDataStore';
import { ApiDomain } from '../models/types';

export class DomainService {
  public getAllDomains(): ApiDomain[] {
    return Array.from(canonicalDb.domains.values()).sort((a, b) => a.sortOrder - b.sortOrder);
  }

  public getDomainById(id: string): ApiDomain | null {
    return canonicalDb.domains.get(id) || null;
  }

  public getDomainEquipment(domainId: string) {
    return Array.from(canonicalDb.equipment.values()).filter((eq) => eq.domainId === domainId);
  }

  public getDomainStandards(domainId: string) {
    const domain = this.getDomainById(domainId);
    if (!domain) return [];
    return domain.standardIds
      .map((sid) => canonicalDb.standards.get(sid))
      .filter((s): s is NonNullable<typeof s> => Boolean(s));
  }
}

export const domainService = new DomainService();
