// src/services/epedeApiClient.ts
// Dual-Read Resilient API Client for EPEDE Frontend Architecture
// Seamlessly fetches from /api/v1 with automatic graceful fallback to local data.

export interface ApiDomainDto {
  id: string;
  code: string;
  name: { fr: string; en: string };
  category: string;
  description: { fr: string; en: string };
  subdomainCount: number;
  equipmentCount: number;
  keyTechnologies: string[];
  engineeringRoles: string[];
  cameroonContext?: { fr: string; en: string };
}

export interface ApiEquipmentDto {
  id: string;
  domainId: string;
  type: string;
  tag?: string;
  name: { fr: string; en: string };
  voltageNominal?: string;
  powerRating?: string;
  primaryFunction: { fr: string; en: string };
  specifications: Record<string, any>;
  protectionFunctions: string[];
  standards: string[];
}

export interface SearchResultDto {
  id: string;
  type: 'DOMAIN' | 'EQUIPMENT' | 'STANDARD' | 'PROTECTION' | 'CALCULATOR' | 'GRID_NODE';
  title: string;
  subtitle: string;
  domainCode?: string;
  voltage?: string;
  route: string;
  relevanceScore: number;
}

export interface GraphRelationshipItem {
  relationship: {
    id: string;
    sourceId: string;
    sourceType: string;
    targetId: string;
    targetType: string;
    relation: string;
    description?: { fr?: string; en?: string };
  };
  equipment?: ApiEquipmentDto | null;
  standard?: any;
}

export interface GraphContextDto {
  node: ApiEquipmentDto | null;
  upstream: GraphRelationshipItem[];
  downstream: GraphRelationshipItem[];
  protections: GraphRelationshipItem[];
  controls?: GraphRelationshipItem[];
  measurements?: GraphRelationshipItem[];
  standards: GraphRelationshipItem[];
  allRelationshipsCount?: number;
}

export interface CommissioningProtocolDto {
  id: string;
  code: string;
  title: { fr: string; en: string };
  standard: string;
  equipmentType: 'TRANSFORMER' | 'DISTANCE_RELAY' | 'OVERCURRENT_RELAY' | 'SUBSTATION_EARTHING' | 'CIRCUIT_BREAKER';
  testCategory: 'FAT' | 'SAT' | 'PERIODIC_MAINTENANCE';
  requiredTools: string[];
  safetyPrecautions: { fr: string; en: string }[];
  testSteps: {
    step: number;
    description: { fr: string; en: string };
    acceptanceCriteria: { fr: string; en: string };
    tolerance: string;
  }[];
}

export class EpedeApiClient {
  private baseUrl = '/api/v1';

  public async getFieldEngineeringProtocols(): Promise<CommissioningProtocolDto[]> {
    try {
      const res = await fetch(`${this.baseUrl}/field-engineering/protocols`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          return json.data;
        }
      }
    } catch {
      // offline fallback
    }
    return [];
  }

  public async getFieldEngineeringProtocolById(id: string): Promise<CommissioningProtocolDto | null> {
    try {
      const res = await fetch(`${this.baseUrl}/field-engineering/protocols/${encodeURIComponent(id)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch {
      // offline fallback
    }
    return null;
  }

  public async getDomains(): Promise<ApiDomainDto[]> {
    try {
      const res = await fetch(`${this.baseUrl}/domains`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          return json.data;
        }
      }
    } catch {
      // Offline fallback
    }
    return [];
  }

  public async getEquipment(query?: { domainId?: string; q?: string }): Promise<ApiEquipmentDto[]> {
    try {
      const params = new URLSearchParams();
      if (query?.domainId) params.set('domainId', query.domainId);
      if (query?.q) params.set('q', query.q);

      const res = await fetch(`${this.baseUrl}/equipment?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          return json.data;
        }
      }
    } catch {
      // Offline fallback
    }
    return [];
  }

  public async getEquipmentById(id: string): Promise<ApiEquipmentDto | null> {
    try {
      const res = await fetch(`${this.baseUrl}/equipment/${encodeURIComponent(id)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch {
      // Offline fallback
    }
    return null;
  }

  public async getGraphContext(id: string): Promise<GraphContextDto | null> {
    try {
      const res = await fetch(`${this.baseUrl}/graph/equipment/${encodeURIComponent(id)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch {
      // Offline fallback
    }
    return null;
  }

  public async search(q: string): Promise<SearchResultDto[]> {
    try {
      const res = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          return json.data;
        }
      }
    } catch {
      // Offline fallback
    }
    return [];
  }

  public async executeCalculation(
    workbenchId: string,
    inputs: Record<string, number>
  ): Promise<any> {
    try {
      const res = await fetch(`${this.baseUrl}/workbenches/${encodeURIComponent(workbenchId)}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch (err) {
      console.warn('API calculation failed, fallback will apply:', err);
    }
    return null;
  }

  public async askCopilot(payload: {
    query: string;
    locale: 'fr' | 'en';
    activeEquipmentId?: string;
    activeDomainId?: string;
    history?: any[];
  }): Promise<{ text: string; fallback: boolean; contextInjected?: boolean }> {
    try {
      const res = await fetch(`${this.baseUrl}/ai/copilot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const json = await res.json();
        return {
          text: json.text || '',
          fallback: Boolean(json.fallback),
          contextInjected: Boolean(json.contextInjected),
        };
      }
    } catch (err) {
      console.warn('Copilot API call failed:', err);
    }
    return { text: '', fallback: true };
  }
}

export const epedeApi = new EpedeApiClient();
