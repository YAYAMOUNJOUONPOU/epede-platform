// server/services/searchService.ts
// Unified Multi-Faceted Engineering Search Service

import { canonicalDb } from '../db/canonicalDataStore';
import { SearchFacetItem } from '../models/types';

export class SearchService {
  public search(query: string, limit = 20): SearchFacetItem[] {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const rawQ = query.trim().toLowerCase();
    const tokens = [rawQ];
    if (rawQ === 'trafo' || rawQ === 'transfo') tokens.push('transformateur', 'transformer');
    if (rawQ === 'cb' || rawQ === 'dj') tokens.push('disjoncteur', 'breaker');
    if (rawQ === 'ct' || rawQ === 'tc') tokens.push('courant', 'tc');
    if (rawQ === 'vt' || rawQ === 'tt') tokens.push('tension', 'tt');
    if (rawQ === 'gis') tokens.push('blindé', 'enveloppe métallique');
    if (rawQ === 'ais') tokens.push('ouvert', 'air');
    if (rawQ === 'dg' || rawQ === 'genset') tokens.push('groupe électrogène', 'diesel');

    const matchesAny = (target?: string) => {
      if (!target) return false;
      const lower = target.toLowerCase();
      return tokens.some((tok) => lower.includes(tok));
    };

    const results: SearchFacetItem[] = [];

    // 1. Search Domains
    for (const domain of canonicalDb.domains.values()) {
      let score = 0;
      if (domain.code.toLowerCase() === rawQ) score += 100;
      if (matchesAny(domain.name.fr) || matchesAny(domain.name.en)) score += 50;
      if (matchesAny(domain.description.fr) || matchesAny(domain.description.en)) score += 20;

      if (score > 0) {
        results.push({
          id: domain.id,
          type: 'DOMAIN',
          title: `${domain.code} · ${domain.name.fr}`,
          subtitle: domain.description.fr.slice(0, 120) + '...',
          domainCode: domain.code,
          route: `#/domain/${domain.code}`,
          relevanceScore: score,
        });
      }
    }

    // 2. Search Equipment
    for (const eq of canonicalDb.equipment.values()) {
      let score = 0;
      if (eq.tag && matchesAny(eq.tag)) score += 80;
      if (matchesAny(eq.name.fr) || matchesAny(eq.name.en)) score += 60;
      if (eq.protectionFunctions.some((ansi) => matchesAny(ansi))) score += 40;
      if (matchesAny(eq.primaryFunction.fr) || matchesAny(eq.primaryFunction.en)) score += 20;

      if (score > 0) {
        results.push({
          id: eq.id,
          type: 'EQUIPMENT',
          title: eq.name.fr,
          subtitle: `${eq.voltageNominal || ''} · ${eq.primaryFunction.fr.slice(0, 100)}...`,
          domainCode: eq.domainId,
          voltage: eq.voltageNominal,
          route: `#/equipment/${eq.id}`,
          relevanceScore: score,
        });
      }
    }

    // 3. Search Standards
    for (const std of canonicalDb.standards.values()) {
      let score = 0;
      if (matchesAny(std.code)) score += 70;
      if (matchesAny(std.title.fr) || matchesAny(std.title.en)) score += 50;
      if (matchesAny(std.scope.fr) || matchesAny(std.scope.en)) score += 20;

      if (score > 0) {
        results.push({
          id: std.id,
          type: 'STANDARD',
          title: `${std.code} - ${std.title.fr}`,
          subtitle: std.scope.fr.slice(0, 120) + '...',
          route: `#/standards`,
          relevanceScore: score,
        });
      }
    }

    // 4. Search Workbenches
    for (const wb of canonicalDb.workbenches.values()) {
      let score = 0;
      if (matchesAny(wb.name.fr) || matchesAny(wb.name.en)) score += 60;
      if (matchesAny(wb.category)) score += 30;

      if (score > 0) {
        results.push({
          id: wb.id,
          type: 'CALCULATOR',
          title: wb.name.fr,
          subtitle: wb.description.fr.slice(0, 120) + '...',
          route: `#/calculators/${wb.id}`,
          relevanceScore: score,
        });
      }
    }

    return results.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, limit);
  }
}

export const searchService = new SearchService();
