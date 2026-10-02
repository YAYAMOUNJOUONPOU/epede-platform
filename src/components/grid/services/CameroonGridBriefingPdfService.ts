// src/components/grid/services/CameroonGridBriefingPdfService.ts
// Observatoire du Réseau Électrique Camerounais
// Automated Executive Briefing & EPC Dossier Generator
// Uses jsPDF + jspdf-autotable

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const COLORS = {
  obsidian:    [3, 7, 18]        as [number, number, number],
  deepSlate:   [15, 23, 42]      as [number, number, number],
  slate800:    [30, 41, 59]      as [number, number, number],
  slate600:    [71, 85, 105]     as [number, number, number],
  slate400:    [148, 163, 184]   as [number, number, number],
  slate200:    [226, 232, 240]   as [number, number, number],
  white:       [255, 255, 255]   as [number, number, number],
  emerald:     [16, 185, 129]    as [number, number, number],
  cyan:        [6, 182, 212]     as [number, number, number],
  indigo:      [99, 102, 241]    as [number, number, number],
  amber:       [245, 158, 11]    as [number, number, number],
  gold:        [212, 175, 55]    as [number, number, number],
  headerBg:    [15, 23, 42]      as [number, number, number],
  rowEven:     [248, 250, 252]   as [number, number, number],
};

export class CameroonGridBriefingPdfService {
  /**
   * Generates and downloads the Official Cameroon National Electrical Grid Briefing Dossier
   */
  public static generateExecutiveBriefingPdf(): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;

    // Helper: Add running header and footer on every page
    const addHeaderFooter = (pageNumber: number, totalPages: number) => {
      // Top header bar
      doc.setFillColor(...COLORS.deepSlate);
      doc.rect(0, 0, pageWidth, 12, 'F');
      
      doc.setTextColor(...COLORS.white);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('RÉPUBLIQUE DU CAMEROUN • OBSERVATOIRE DU RÉSEAU ÉLECTRIQUE NATIONAL', margin, 7.5);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...COLORS.cyan);
      doc.text('MINEE / SONATREL / ARSEL / EDC', pageWidth - margin - 50, 7.5);

      // Bottom footer bar
      doc.setFillColor(...COLORS.slate800);
      doc.rect(0, pageHeight - 10, pageWidth, 10, 'F');
      doc.setTextColor(...COLORS.slate400);
      doc.setFontSize(7.5);
      doc.text('CONFIDENTIEL • DOSSIER TECHNIQUE D\'INGÉNIERIE & INVESTISSEMENT • EPEDE PLATFORM', margin, pageHeight - 3.5);
      doc.text(`Page ${pageNumber} / ${totalPages}`, pageWidth - margin - 15, pageHeight - 3.5);
    };

    // ─────────────────────────────────────────────────────────────────────────────
    // PAGE 1: COVER & EXECUTIVE SUMMARY
    // ─────────────────────────────────────────────────────────────────────────────
    // Title Area
    doc.setFillColor(...COLORS.obsidian);
    doc.rect(margin, 20, pageWidth - (margin * 2), 48, 'F');

    // Golden accent border
    doc.setDrawColor(...COLORS.gold);
    doc.setLineWidth(0.8);
    doc.rect(margin, 20, pageWidth - (margin * 2), 48, 'S');

    doc.setTextColor(...COLORS.gold);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('DOSSIER STRATÉGIQUE NATIONAL DE RÉFÉRENCE • COD 2026', margin + 6, 28);

    doc.setTextColor(...COLORS.white);
    doc.setFontSize(15);
    doc.text('Observatoire du Réseau Électrique Camerounais', margin + 6, 36);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.slate200);
    doc.text('Synthèse Technique des Infrastructures de Production, Transport (225/110/90 kV) et Interconnexions', margin + 6, 43);

    doc.setTextColor(...COLORS.cyan);
    doc.setFontSize(8);
    doc.text('Cadre Réglementaire Loi N° 2011/022 • Bassin de la Sanaga (Lom Pangar) • Projet PIRECT Tchad', margin + 6, 50);

    doc.setTextColor(...COLORS.slate400);
    doc.setFontSize(7.5);
    doc.text(`Édité le ${new Date().toLocaleDateString('fr-FR')} | Version 2.4 - Autorité de Conduite SONATREL`, margin + 6, 58);

    // Key Executive Metrics Cards (4 columns)
    const cardY = 74;
    const cardW = (pageWidth - (margin * 2) - 9) / 4;
    const cardH = 22;

    const kpis = [
      { label: 'PUISSANCE INSTALLÉE', val: '1 980 MW', sub: 'Hydro: 82% | Gaz: 13%', col: COLORS.emerald },
      { label: 'RÉSEAU DE TRANSPORT', val: '2 540 km', sub: '225 kV, 110 kV, 90 kV', col: COLORS.cyan },
      { label: 'RÉSERVE HYDRO SANAGA', val: '6,0 Gm³', sub: 'Lom Pangar régulateur', col: COLORS.indigo },
      { label: 'INTERCONNEXION TCHAD', val: '1 024 km', sub: 'PIRECT • Export 100 MW', col: COLORS.amber }
    ];

    kpis.forEach((kpi, idx) => {
      const cx = margin + (idx * (cardW + 3));
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(...COLORS.slate400);
      doc.setLineWidth(0.3);
      doc.roundedRect(cx, cardY, cardW, cardH, 2, 2, 'FD');

      doc.setTextColor(...COLORS.slate600);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.text(kpi.label, cx + 3, cardY + 5);

      doc.setTextColor(...kpi.col);
      doc.setFontSize(11);
      doc.text(kpi.val, cx + 3, cardY + 12);

      doc.setTextColor(...COLORS.slate600);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.text(kpi.sub, cx + 3, cardY + 18);
    });

    // Executive Summary Narrative
    doc.setTextColor(...COLORS.obsidian);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('1. Vue d\'Ensemble du Secteur Électrique Camerounais', margin, 106);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...COLORS.slate800);
    const summaryText = 
      "Le secteur électrique du Cameroun a été profondément restructuré en application de la Loi N° 2011/022 du 14 décembre 2011, " +
      "consacrant le dégroupage des activités et la création de la SONATREL (Société Nationale de Transport de l'Électricité) en tant " +
      "que gestionnaire unique du réseau de transport et exploitant du Dispatching National de Mangombé (Edéa).\n\n" +
      "Le système est historiquement scindé en deux sous-ensembles asynchrones : le Réseau Interconnecté Sud (RIS, 225 kV et 90 kV) " +
      "et le Réseau Interconnecté Nord (RIN, 110 kV et 30 kV), actuellement en cours d'unification physique grâce à la nouvelle ligne " +
      "dorsale 225 kV Nachtigal - Tibati - Ngaoundéré (460 km).\n\n" +
      "Avec la mise en service progressive des 7 groupes de l'aménagement hydroélectrique de Nachtigal Amont (420 MW) sur le fleuve Sanaga, " +
      "le Cameroun consolide un mix de production décarboné à plus de 82%, soutenu par le réservoir régulateur de Lom Pangar (6 milliards de m³). " +
      "Cette assise énergétique permet au pays de se positionner comme le hub exportateur d'électricité de référence de la sous-région Afrique Centrale (PEAC), " +
      "notamment vers le Tchad via le projet PIRECT (100 MW ferme).";

    doc.text(summaryText, margin, 113, { maxWidth: pageWidth - (margin * 2), lineHeightFactor: 1.35 });

    // Table: Institutional Architecture
    autoTable(doc, {
      startY: 168,
      margin: { left: margin, right: margin },
      head: [['Acteur Institutionnel', 'Statut / Décret', 'Rôle Clé dans le Système', 'Modèle de Rémunération']],
      body: [
        ['MINEE', 'Ministère de Tutelle', 'Politique sectorielle, planification et octroi des concessions', 'Budget de l\'État'],
        ['ARSEL', 'Loi 2011/022', 'Régulation économique, fixation des tarifs et arbitrage', 'Redevance réglementaire'],
        ['SONATREL', 'Décret 2015/442', 'Gestionnaire du Réseau de Transport (TSO), Dispatching Mangombé', 'Tarif de péage transport'],
        ['EDC', 'Décret 2006/406', 'Gestionnaire des réservoirs d\'eau (Lom Pangar, Mbakaou, Mapé)', 'Redevance hydrologique'],
        ['NHPC', 'IPP (EDF, IFC, État)', 'Propriétaire & exploitant de Nachtigal (420 MW)', 'PPA Take-or-Pay (35 ans)'],
        ['Eneo Cameroon', 'Concessionnaire', 'Exploitant historique, distribution et fourniture au détail', 'Vente aux clients MT/BT'],
      ],
      theme: 'grid',
      headStyles: { fillColor: COLORS.headerBg, textColor: COLORS.white, fontSize: 8, fontStyle: 'bold' },
      bodyStyles: { fontSize: 7.5, textColor: COLORS.slate800, cellPadding: 2 },
      alternateRowStyles: { fillColor: COLORS.rowEven }
    });

    addHeaderFooter(1, 3);

    // ─────────────────────────────────────────────────────────────────────────────
    // PAGE 2: GENERATION ASSETS & HIGH-VOLTAGE CORRIDORS
    // ─────────────────────────────────────────────────────────────────────────────
    doc.addPage();

    doc.setTextColor(...COLORS.obsidian);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('2. Inventaire Détaillé des Centrales de Production en Service', margin, 20);

    // Table: Generation Plants
    autoTable(doc, {
      startY: 25,
      margin: { left: margin, right: margin },
      head: [['Ouvrage de Production', 'Technologie / Fleuve', 'Capacité (MW)', 'Région / Réseau', 'Statut Exploitation']],
      body: [
        ['Nachtigal Amont', 'Hydro au fil de l\'eau / Sanaga', '420 MW (7x60 MW)', 'Centre (RIS)', 'En service échelonné (2024-2026)'],
        ['Songloulou', 'Hydro au fil de l\'eau / Sanaga', '384 MW (8x48 MW)', 'Littoral (RIS)', 'Opérationnel - Rénové'],
        ['Edéa I, II & III', 'Hydro au fil de l\'eau / Sanaga', '276 MW (14 groupes)', 'Littoral (RIS)', 'Opérationnel - Desserte ALUCAM'],
        ['Memve\'ele', 'Hydro au fil de l\'eau / Ntem', '211 MW (4x52.75 MW)', 'Sud (RIS)', 'Opérationnel - Évacuation 225 kV'],
        ['Kribi Gas Power Plant', 'Thermique Gaz Naturel (KPDC)', '216 MW (13x16.6 MW)', 'Sud / Littoral (RIS)', 'Opérationnel - Gaz offshore Sanaga Sud'],
        ['Dibamba HFO', 'Thermique Fuel Lourd (DPDC)', '86 MW (8x10.8 MW)', 'Douala (RIS)', 'Appoint de pointe / Secours'],
        ['Lagdo', 'Hydro à retenue / Bénoué', '72 MW (4x18 MW)', 'Nord (RIN)', 'Opérationnel - Déficit hydrologique'],
        ['Lom Pangar (Centrale pied)', 'Hydro de restitution / Sanaga', '30 MW (4x7.5 MW)', 'Est (Réseau Isolé Est)', 'Opérationnel - Électrification Est'],
        ['Scatec Maroua & Guider', 'Solaire PV Hybride + BESS', '30 MWp (2x15 MWp)', 'Extrême-Nord / Nord (RIN)', 'Opérationnel - Stockage Li-ion'],
      ],
      theme: 'grid',
      headStyles: { fillColor: COLORS.headerBg, textColor: COLORS.white, fontSize: 8, fontStyle: 'bold' },
      bodyStyles: { fontSize: 7.5, textColor: COLORS.slate800, cellPadding: 2 },
      alternateRowStyles: { fillColor: COLORS.rowEven }
    });

    // HV Transmission Corridors
    const table2End = (doc as any).lastAutoTable.finalY + 8;
    doc.setTextColor(...COLORS.obsidian);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('3. Dorsale de Transport Haute Tension (SONATREL)', margin, table2End);

    autoTable(doc, {
      startY: table2End + 4,
      margin: { left: margin, right: margin },
      head: [['Corridor Haute Tension', 'Tension (kV)', 'Longueur (km)', 'Type Conducteur', 'Rôle & Transit']],
      body: [
        ['Nachtigal ➔ Nyom II (Yaoundé)', '225 kV (Double terne)', '50 km', 'Almelec 570 mm²', 'Évacuation intégrale des 420 MW de Nachtigal'],
        ['Songloulou ➔ Mangombé (Edéa)', '225 kV (Double terne)', '22 km', 'Almelec 570 mm²', 'Collecte de la puissance de Songloulou'],
        ['Mangombé ➔ Békoko (Douala)', '225 kV (Double terne)', '85 km', 'Almelec 570 mm²', 'Alimentation pôle industriel de Douala'],
        ['Mangombé ➔ Oyomabang (Yaoundé)', '225 kV (Simple terne)', '175 km', 'Almelec 366 mm²', 'Alimentation politique de la capitale'],
        ['Memve\'ele ➔ Nomayos (Yaoundé)', '225 kV (Simple terne)', '280 km', 'Almelec 570 mm²', 'Évacuation Sud vers Yaoundé'],
        ['Nachtigal ➔ Tibati ➔ Ngaoundéré', '225 kV (Simple terne)', '460 km', 'Almelec 570 mm²', 'Interconnexion historique RIS ⇄ RIN'],
        ['Ngaoundéré ➔ Garoua ➔ Maroua', '225 kV (PIRECT Cam)', '414 km', 'Almelec 570 mm²', 'Dorsale septentrionale renforçant le RIN'],
        ['Maroua ➔ Bongor ➔ N\'Djamena', '225 kV (PIRECT Tchad)', '310 km', 'Almelec 570 mm²', 'Liaison transfrontalière d\'exportation'],
        ['Boucle 90 kV Douala & Yaoundé', '90 kV (Boucles urbaines)', '280 km', 'Almelec 228 mm²', 'Répartition intra-urbaine vers postes sources'],
      ],
      theme: 'grid',
      headStyles: { fillColor: COLORS.headerBg, textColor: COLORS.white, fontSize: 8, fontStyle: 'bold' },
      bodyStyles: { fontSize: 7.5, textColor: COLORS.slate800, cellPadding: 2 },
      alternateRowStyles: { fillColor: COLORS.rowEven }
    });

    addHeaderFooter(2, 3);

    // ─────────────────────────────────────────────────────────────────────────────
    // PAGE 3: MASTER PLAN 2035 & STRATEGIC RECOMMENDATIONS
    // ─────────────────────────────────────────────────────────────────────────────
    doc.addPage();

    doc.setTextColor(...COLORS.obsidian);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('4. Plan Directeur de Production à l\'Horizon 2035 (Vision Cameroun Émergent)', margin, 20);

    autoTable(doc, {
      startY: 25,
      margin: { left: margin, right: margin },
      head: [['Grand Projet', 'Puissance (MW)', 'Horizon', 'Promoteur / Bailleurs', 'Impact Stratégique']],
      body: [
        ['Kikot-Mbébé', '500 MW', '2030', 'KHPC (EDF 50%, Cameroun 50%)', 'Cascade Sanaga aval Nachtigal, nouvelle dorsale 400 kV'],
        ['Grand Eweng', '1 000 MW', '2033', 'Hydromine / État du Cameroun', 'Alimentation pôle bauxite Minim-Martap et ALUCAM'],
        ['Chollet (Binational)', '600 MW (300 MW CMR)', '2032', 'Cameroun - Congo / CGGC', 'Interconnexion PEAC axe Sud et stabilisation du Sud-Est'],
        ['Chutes de Menchum', '72 MW', '2029', 'MINEE / PPP', 'Sécurisation de l\'anneau Ouest et export transfrontalier Nigeria'],
        ['Song Dong', '280 MW', '2035', 'PowerChina / EDC', 'Dernier maillon optimisant le débit régulé de Lom Pangar'],
        ['Solaire BESS Grand Nord', '150 MWp additionnels', '2027-2029', 'Scatec / Bailleurs internationaux', 'Autonomie solaire diurne et nocturne du septentrion'],
      ],
      theme: 'grid',
      headStyles: { fillColor: COLORS.headerBg, textColor: COLORS.white, fontSize: 8, fontStyle: 'bold' },
      bodyStyles: { fontSize: 7.5, textColor: COLORS.slate800, cellPadding: 2 },
      alternateRowStyles: { fillColor: COLORS.rowEven }
    });

    // Strategic Recommendations Box
    const table3End = (doc as any).lastAutoTable.finalY + 8;
    doc.setTextColor(...COLORS.obsidian);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('5. Recommandations Stratégiques pour les Investisseurs & Bailleurs de Fonds', margin, table3End);

    const recs = [
      "1. Sécurisation Contractuelle des Flux : Pérennisation du compte séquestre (Escrow Account) adossé aux recettes d'exportation vers le Tchad et des gros consommateurs HT-B.",
      "2. Résilience N-1 du Réseau : Déploiement accéléré des Systèmes d'Automatismes et de Déconnexion d'Urgence (SPS/RAS) sur le transit Nachtigal-Nyom II pour prévenir les écroulements en cascade.",
      "3. Compensation d'Énergie Réactive : Installation urgente de compensateurs synchrones / STATCOM aux postes d'interconnexion de Ngaoundéré, Maroua et Bafoussam pour maîtriser le plan de tension.",
      "4. Maîtrise Hydrologique Intégrée : Modernisation des stations hydrométriques télétransmises par satellite sur le bassin versant de la Sanaga (EDC) pour optimiser les arbitrages de vidange de Lom Pangar."
    ];

    let recY = table3End + 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.slate800);
    recs.forEach(rec => {
      doc.text(rec, margin, recY, { maxWidth: pageWidth - (margin * 2), lineHeightFactor: 1.3 });
      recY += 10;
    });

    // Official Stamp & Signatures Block
    const signY = pageHeight - 55;
    doc.setDrawColor(...COLORS.slate400);
    doc.setLineWidth(0.5);
    doc.line(margin, signY, pageWidth - margin, signY);

    const colW = (pageWidth - (margin * 2)) / 3;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.obsidian);
    doc.text('Pour le Ministère de l\'Eau et de l\'Énergie', margin, signY + 6);
    doc.text('Pour la SONATREL (Direction Générale)', margin + colW, signY + 6);
    doc.text('Pour l\'ARSEL (Direction de la Régulation)', margin + (colW * 2), signY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.slate600);
    doc.text('Visa & Enregistrement Officiel', margin, signY + 11);
    doc.text('Certifié conforme pour exploitation', margin + colW, signY + 11);
    doc.text('Approbation du modèle économique', margin + (colW * 2), signY + 11);

    // Simulated signature seal
    doc.setDrawColor(...COLORS.emerald);
    doc.roundedRect(margin + colW + 5, signY + 15, 38, 14, 2, 2, 'S');
    doc.setTextColor(...COLORS.emerald);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.text('SONATREL DISPATCHING', margin + colW + 7, signY + 20);
    doc.text('VALIDE POUR PUBLICATION', margin + colW + 7, signY + 25);

    addHeaderFooter(3, 3);

    // Trigger Browser Download
    doc.save(`Dossier_Executif_Reseau_Electrique_Cameroun_EPEDE_${new Date().toISOString().slice(0, 10)}.pdf`);
  }
}
