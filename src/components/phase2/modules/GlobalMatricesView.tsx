// src/components/phase2/modules/GlobalMatricesView.tsx
import React, { useState, useMemo } from 'react';
import { Search, Download, ArrowRight, ExternalLink } from 'lucide-react';
import { ALL_SUBDOMAINS } from '../../../data/epedeData';
import {
  COMPLETENESS_MATRIX,
  RELATIONSHIP_MATRIX,
  STANDARDS_MATRIX,
  ROLE_MATRIX,
  LIFECYCLE_MATRIX,
  FAILURE_MAINTENANCE_MATRIX
} from '../../../data/phase2Matrices';

export type MatrixTab = 'completeness' | 'relationships' | 'standards' | 'roles' | 'lifecycle' | 'failures';

interface GlobalMatricesViewProps {
  locale: 'fr' | 'en';
  onNavigateStandard?: (stdRef: string) => void;
  onNavigateRole?: (roleSlug: string) => void;
  onSelectSubdomainDirect?: (domainCode: string, subdomainCode: string) => void;
}

export const GlobalMatricesView: React.FC<GlobalMatricesViewProps> = ({
  locale,
  onNavigateStandard,
  onNavigateRole,
  onSelectSubdomainDirect
}) => {
  const [activeMatrixTab, setActiveMatrixTab] = useState<MatrixTab>('completeness');
  const [matrixSearchQuery, setMatrixSearchQuery] = useState('');

  // Matrix filter
  const q = matrixSearchQuery.toLowerCase().trim();

  const filteredCompleteness = useMemo(() => {
    if (!q) return COMPLETENESS_MATRIX;
    return COMPLETENESS_MATRIX.filter(
      (r) => r.domainCode.toLowerCase().includes(q) || r.domainName.toLowerCase().includes(q)
    );
  }, [q]);

  const filteredRelationships = useMemo(() => {
    if (!q) return RELATIONSHIP_MATRIX;
    return RELATIONSHIP_MATRIX.filter(
      (r) =>
        r.sourceObject.toLowerCase().includes(q) ||
        r.relationship.toLowerCase().includes(q) ||
        r.targetObject.toLowerCase().includes(q) ||
        r.domain.toLowerCase().includes(q)
    );
  }, [q]);

  const filteredStandards = useMemo(() => {
    if (!q) return STANDARDS_MATRIX;
    return STANDARDS_MATRIX.filter(
      (r) =>
        r.standard.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.equipment.toLowerCase().includes(q) ||
        r.role.toLowerCase().includes(q)
    );
  }, [q]);

  const filteredRoles = useMemo(() => {
    if (!q) return ROLE_MATRIX;
    return ROLE_MATRIX.filter(
      (r) =>
        r.role.toLowerCase().includes(q) ||
        r.discipline.toLowerCase().includes(q) ||
        r.domain.toLowerCase().includes(q) ||
        r.deliverable.toLowerCase().includes(q) ||
        r.tool.toLowerCase().includes(q)
    );
  }, [q]);

  const filteredLifecycle = useMemo(() => {
    if (!q) return LIFECYCLE_MATRIX;
    return LIFECYCLE_MATRIX.filter(
      (r) =>
        r.objectName.toLowerCase().includes(q) ||
        r.domain.toLowerCase().includes(q) ||
        r.testing.toLowerCase().includes(q) ||
        r.commissioning.toLowerCase().includes(q)
    );
  }, [q]);

  const filteredFailures = useMemo(() => {
    if (!q) return FAILURE_MAINTENANCE_MATRIX;
    return FAILURE_MAINTENANCE_MATRIX.filter(
      (r) =>
        r.equipment.toLowerCase().includes(q) ||
        r.failureMode.toLowerCase().includes(q) ||
        r.cause.toLowerCase().includes(q) ||
        r.protection.toLowerCase().includes(q)
    );
  }, [q]);

  const handleExportMatrix = (format: 'json' | 'csv') => {
    let data: any[] = [];
    const filename = `EPEDE_Matrix_${activeMatrixTab}_${new Date().toISOString().slice(0, 10)}`;
    if (activeMatrixTab === 'completeness') data = filteredCompleteness;
    else if (activeMatrixTab === 'relationships') data = filteredRelationships;
    else if (activeMatrixTab === 'standards') data = filteredStandards;
    else if (activeMatrixTab === 'roles') data = filteredRoles;
    else if (activeMatrixTab === 'lifecycle') data = filteredLifecycle;
    else if (activeMatrixTab === 'failures') data = filteredFailures;

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      if (data.length === 0) return;
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map((obj) =>
        Object.values(obj)
          .map((val) => `"${String(val).replace(/"/g, '""')}"`)
          .join(',')
      );
      const csvContent = [headers, ...rows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      {/* Matrix Subtabs & Search bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Matrix selector pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'completeness', label_fr: 'Matrice A: Complétude (16 Domaines)', label_en: 'Matrix A: Completeness' },
              { id: 'relationships', label_fr: 'Matrice B: Relations & Graphe', label_en: 'Matrix B: Relationships' },
              { id: 'standards', label_fr: 'Matrice C: Applicabilité Normes', label_en: 'Matrix C: Standards' },
              { id: 'roles', label_fr: 'Matrice D: Métiers & Rôles', label_en: 'Matrix D: Engineering Roles' },
              { id: 'lifecycle', label_fr: 'Matrice E: Cycle de Vie (13 phases)', label_en: 'Matrix E: Lifecycle' },
              { id: 'failures', label_fr: 'Matrice F: Défaillances & Maintenance', label_en: 'Matrix F: FMECA' },
            ].map((mtab) => {
              const isMActive = activeMatrixTab === mtab.id;
              return (
                <button
                  key={mtab.id}
                  type="button"
                  onClick={() => setActiveMatrixTab(mtab.id as MatrixTab)}
                  className={`text-xs font-mono font-bold px-3.5 py-1.5 rounded-lg border transition-all ${
                    isMActive
                      ? 'bg-sky-100 text-sky-900 border-sky-400 shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-slate-200 shadow-xs'
                  }`}
                >
                  {locale === 'fr' ? mtab.label_fr : mtab.label_en}
                </button>
              );
            })}
          </div>

          {/* Quick Search & Export Tools */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={matrixSearchQuery}
                onChange={(e) => setMatrixSearchQuery(e.target.value)}
                placeholder={locale === 'fr' ? 'Filtrer les matrices...' : 'Filter matrices...'}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 font-mono shadow-xs"
              />
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => handleExportMatrix('csv')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 shadow-xs transition-colors"
                title={locale === 'fr' ? 'Exporter la matrice active en CSV' : 'Export active matrix to CSV'}
              >
                <Download className="h-3.5 w-3.5 text-sky-600" />
                <span>CSV</span>
              </button>
              <button
                type="button"
                onClick={() => handleExportMatrix('json')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 shadow-xs transition-colors"
                title={locale === 'fr' ? 'Exporter la matrice active en JSON' : 'Export active matrix to JSON'}
              >
                <Download className="h-3.5 w-3.5 text-emerald-600" />
                <span>JSON</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Render Active Matrix Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        {/* MATRIX A */}
        {activeMatrixTab === 'completeness' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 text-slate-800 border-b border-slate-200 uppercase font-bold text-[11px]">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Domaine</th>
                  <th className="px-3 py-3">Sous-Domaines</th>
                  <th className="px-3 py-3">Systèmes</th>
                  <th className="px-3 py-3">Matériel</th>
                  <th className="px-3 py-3">Protections</th>
                  <th className="px-3 py-3">Contrôle</th>
                  <th className="px-3 py-3">Normes</th>
                  <th className="px-3 py-3">Sécurité</th>
                  <th className="px-3 py-3">Rôles</th>
                  <th className="px-3 py-3">Statut Global</th>
                  <th className="px-3 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredCompleteness.map((row) => (
                  <tr 
                    key={row.domainCode} 
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    onClick={() => {
                      const firstSub = ALL_SUBDOMAINS.find(s => s.domain_code === row.domainCode);
                      onSelectSubdomainDirect?.(row.domainCode, firstSub?.code || `${row.domainCode}.01`);
                    }}
                  >
                    <td className="px-4 py-2.5 font-bold text-sky-700 group-hover:underline">{row.domainCode}</td>
                    <td className="px-4 py-2.5 font-semibold text-slate-900 group-hover:text-sky-700">{row.domainName}</td>
                    <td className="px-3 py-2.5 text-emerald-700 font-bold">{row.subdomains}</td>
                    <td className="px-3 py-2.5 text-emerald-700">{row.systems}</td>
                    <td className="px-3 py-2.5 text-emerald-700">{row.equipment}</td>
                    <td className="px-3 py-2.5 text-emerald-700">{row.protection}</td>
                    <td className="px-3 py-2.5 text-emerald-700">{row.control}</td>
                    <td className="px-3 py-2.5 text-emerald-700">{row.standards}</td>
                    <td className="px-3 py-2.5 text-emerald-700">{row.safety}</td>
                    <td className="px-3 py-2.5 text-emerald-700">{row.roles}</td>
                    <td className="px-3 py-2.5">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold">
                        {row.overallStatus}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] text-sky-700 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Spéc. 43-Pts</span>
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MATRIX B */}
        {activeMatrixTab === 'relationships' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 text-slate-800 border-b border-slate-200 uppercase font-bold text-[11px]">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Objet Source</th>
                  <th className="px-4 py-3">Relation</th>
                  <th className="px-4 py-3">Objet Cible</th>
                  <th className="px-4 py-3">Interface</th>
                  <th className="px-4 py-3">Provenance / Référence</th>
                  <th className="px-4 py-3">Vérification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredRelationships.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-2.5 text-slate-400 font-bold">{row.id}</td>
                    <td className="px-4 py-2.5 text-slate-900 font-semibold">{row.sourceObject}</td>
                    <td className="px-4 py-2.5 text-sky-700 font-bold">──[{row.relationship}]──&gt;</td>
                    <td className="px-4 py-2.5 text-amber-800 font-semibold">{row.targetObject}</td>
                    <td className="px-4 py-2.5 text-slate-500">{row.domain}</td>
                    <td className="px-4 py-2.5 text-slate-600">{row.provenance}</td>
                    <td className="px-4 py-2.5">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold">
                        {row.verification}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MATRIX C */}
        {activeMatrixTab === 'standards' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 text-slate-800 border-b border-slate-200 uppercase font-bold text-[11px]">
                <tr>
                  <th className="px-4 py-3">Norme</th>
                  <th className="px-4 py-3">Titre de la Norme</th>
                  <th className="px-4 py-3">Équipement Concerne</th>
                  <th className="px-4 py-3">Fonction & Exigences</th>
                  <th className="px-4 py-3">Phase Cycle de Vie</th>
                  <th className="px-4 py-3">Rôle Responsable</th>
                  <th className="px-4 py-3">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredStandards.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-2.5 font-bold whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onNavigateStandard?.(row.standard)}
                        className="text-sky-700 hover:text-sky-900 hover:underline inline-flex items-center gap-1 group text-left font-bold"
                        title={locale === 'fr' ? 'Consulter le référentiel des normes' : 'View in standards library'}
                      >
                        <span>{row.standard}</span>
                        <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                      </button>
                    </td>
                    <td className="px-4 py-2.5 text-slate-900 font-semibold">{row.title}</td>
                    <td className="px-4 py-2.5 text-amber-800 font-semibold">{row.equipment}</td>
                    <td className="px-4 py-2.5 text-slate-700">{row.function}</td>
                    <td className="px-4 py-2.5 text-slate-500">{row.phase}</td>
                    <td className="px-4 py-2.5 text-slate-700">{row.role}</td>
                    <td className="px-4 py-2.5">
                      <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-300 text-[10px] font-bold">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MATRIX D */}
        {activeMatrixTab === 'roles' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 text-slate-800 border-b border-slate-200 uppercase font-bold text-[11px]">
                <tr>
                  <th className="px-4 py-3">Rôle / Spécialiste</th>
                  <th className="px-4 py-3">Discipline</th>
                  <th className="px-4 py-3">Domaine & Système</th>
                  <th className="px-4 py-3">Tâches Clés</th>
                  <th className="px-4 py-3">Livrables d'Ingénierie</th>
                  <th className="px-4 py-3">Outils Logiciels</th>
                  <th className="px-4 py-3">Normes Clés</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredRoles.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-2.5 font-bold whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => {
                          const roleSlug = row.role.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                          onNavigateRole?.(roleSlug);
                        }}
                        className="text-sky-700 hover:text-sky-900 hover:underline inline-flex items-center gap-1 group text-left font-bold"
                        title={locale === 'fr' ? 'Ouvrir fiche profil ingénierie' : 'Open engineering role profile'}
                      >
                        <span>{row.role}</span>
                        <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                      </button>
                    </td>
                    <td className="px-4 py-2.5 text-slate-900 font-semibold">{row.discipline}</td>
                    <td className="px-4 py-2.5 text-slate-500">{row.domain}</td>
                    <td className="px-4 py-2.5 text-slate-700">{row.task}</td>
                    <td className="px-4 py-2.5 text-amber-800 font-semibold">{row.deliverable}</td>
                    <td className="px-4 py-2.5 text-sky-800">{row.tool}</td>
                    <td className="px-4 py-2.5 text-slate-600">{row.standard}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MATRIX E */}
        {activeMatrixTab === 'lifecycle' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 text-slate-800 border-b border-slate-200 uppercase font-bold text-[11px]">
                <tr>
                  <th className="px-4 py-3">Objet</th>
                  <th className="px-3 py-3">Faisabilité</th>
                  <th className="px-3 py-3">Concept & Basic</th>
                  <th className="px-3 py-3">Ing. Détaillée</th>
                  <th className="px-3 py-3">Usine (FAT)</th>
                  <th className="px-3 py-3">Chantier (SAT)</th>
                  <th className="px-3 py-3">Exploitation</th>
                  <th className="px-3 py-3">Maintenance</th>
                  <th className="px-3 py-3">Rénovation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredLifecycle.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-2.5 font-bold text-sky-700 whitespace-nowrap">
                      <span className="text-slate-900">{row.objectName}</span>
                      <button
                        type="button"
                        onClick={() => {
                          if (row.domain && row.domain.startsWith('D')) {
                            const parts = row.domain.split('.');
                            onSelectSubdomainDirect?.(parts[0], row.domain);
                          }
                        }}
                        className="text-[10px] text-sky-700 hover:underline block mt-0.5"
                        title="Ouvrir spécification du sous-domaine"
                      >
                        {row.domain} ➔
                      </button>
                    </td>
                    <td className="px-3 py-2.5 text-slate-700">{row.feasibility}</td>
                    <td className="px-3 py-2.5 text-slate-700">{row.basicEng}</td>
                    <td className="px-3 py-2.5 text-amber-800 font-medium">{row.detailedEng}</td>
                    <td className="px-3 py-2.5 text-sky-800">{row.manufacturing}</td>
                    <td className="px-3 py-2.5 text-emerald-700 font-medium">{row.commissioning}</td>
                    <td className="px-3 py-2.5 text-slate-700">{row.operation}</td>
                    <td className="px-3 py-2.5 text-slate-500">{row.maintenance}</td>
                    <td className="px-3 py-2.5 text-sky-700">{row.refurbishment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MATRIX F */}
        {activeMatrixTab === 'failures' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 text-slate-800 border-b border-slate-200 uppercase font-bold text-[11px]">
                <tr>
                  <th className="px-4 py-3">Équipement</th>
                  <th className="px-4 py-3">Mode de Défaillance</th>
                  <th className="px-4 py-3">Cause Racine</th>
                  <th className="px-4 py-3">Effet Système</th>
                  <th className="px-4 py-3">Détection & Protection</th>
                  <th className="px-4 py-3">Stratégie Maintenance</th>
                  <th className="px-4 py-3">Pièces de Rechange</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredFailures.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-2.5 font-bold text-slate-900 whitespace-nowrap">
                      {row.equipment}
                      <div className="text-[10px] text-slate-400">{row.domain}</div>
                    </td>
                    <td className="px-4 py-2.5 text-rose-700 font-semibold">{row.failureMode}</td>
                    <td className="px-4 py-2.5 text-slate-600">{row.cause}</td>
                    <td className="px-4 py-2.5 text-amber-800 font-medium">{row.effect}</td>
                    <td className="px-4 py-2.5 text-sky-800 font-medium">
                      <div>{row.detection}</div>
                      <div className="text-emerald-700 text-[11px] font-bold mt-0.5">{row.protection}</div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-300 text-[10px] font-bold">
                        {row.maintenanceStrategy}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-600">{row.spareParts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
