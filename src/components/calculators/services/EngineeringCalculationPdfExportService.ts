// src/components/calculators/services/EngineeringCalculationPdfExportService.ts
// EPEDE - Certified Engineering Calculation Sheet PDF Generator
// Standardized executive calculation note generator for IEC 60909, IEC 60364-5-52, NF C 15-100, IEEE 80
// Built with jsPDF + jspdf-autotable

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { CalculationReportData } from '../CalculationReportModal';

const PDF_COLORS = {
  obsidian:    [15, 23, 42]     as [number, number, number], // #0f172a
  navyBlue:    [30, 58, 138]    as [number, number, number], // #1e3a8a
  slate900:    [15, 23, 42]     as [number, number, number],
  slate800:    [30, 41, 59]     as [number, number, number],
  slate600:    [71, 85, 105]    as [number, number, number],
  slate400:    [148, 163, 184]  as [number, number, number],
  slate200:    [226, 232, 240]  as [number, number, number],
  slate100:    [241, 245, 249]  as [number, number, number],
  white:       [255, 255, 255]  as [number, number, number],
  emerald:     [16, 185, 129]   as [number, number, number],
  emeraldDark: [5, 150, 105]    as [number, number, number],
  emeraldBg:   [236, 253, 245]  as [number, number, number],
  cyan:        [6, 182, 212]    as [number, number, number],
  purple:      [126, 34, 206]   as [number, number, number],
  amber:       [217, 119, 6]    as [number, number, number],
  amberBg:     [254, 243, 199]  as [number, number, number],
  red:         [220, 38, 38]    as [number, number, number],
  redBg:       [254, 242, 242]  as [number, number, number],
  gold:        [212, 175, 55]   as [number, number, number],
  headerBg:    [30, 41, 59]     as [number, number, number],
  rowEven:     [248, 250, 252]  as [number, number, number],
};

/**
 * Sanitizes Unicode mathematical & Greek characters into WinAnsi/ASCII-safe tokens
 * so standard jsPDF Helvetica/Courier fonts render every formula and unit without garbled glyphs.
 */
function sanitizePdfText(input: string | number | undefined | null): string {
  if (input === undefined || input === null) return '';
  return String(input)
    .replace(/√3/g, 'sqrt(3)')
    .replace(/√/g, 'sqrt')
    .replace(/ΔU/g, 'Delta_U')
    .replace(/ΔP/g, 'Delta_P')
    .replace(/Δθ/g, 'Delta_theta')
    .replace(/Δt/g, 'Delta_t')
    .replace(/Δ/g, 'Delta ')
    .replace(/cos\s*φ/gi, 'cos(phi)')
    .replace(/sin\s*φ/gi, 'sin(phi)')
    .replace(/tan\s*φ/gi, 'tan(phi)')
    .replace(/φ/g, 'phi')
    .replace(/Ω/g, 'Ohm')
    .replace(/μ/g, 'u')
    .replace(/θ/g, 'theta')
    .replace(/ρ/g, 'rho')
    .replace(/λ/g, 'lambda')
    .replace(/η/g, 'eta')
    .replace(/α/g, 'alpha')
    .replace(/β/g, 'beta')
    .replace(/γ/g, 'gamma')
    .replace(/τ/g, 'tau')
    .replace(/ω/g, 'omega')
    .replace(/∑|Σ/g, 'Sum')
    .replace(/≤/g, '<=')
    .replace(/≥/g, '>=')
    .replace(/≈/g, '~')
    .replace(/≠/g, '!=')
    .replace(/±/g, '+/-')
    .replace(/×/g, 'x')
    .replace(/·/g, '*')
    .replace(/•/g, '-')
    .replace(/►|▸/g, '>')
    .replace(/✓|✔/g, '[OK]')
    .replace(/★/g, '*')
    .replace(/₀/g, '0')
    .replace(/₁/g, '1')
    .replace(/₂/g, '2')
    .replace(/₃/g, '3')
    .replace(/₄/g, '4')
    .replace(/₅/g, '5')
    .replace(/₆/g, '6')
    .replace(/₇/g, '7')
    .replace(/₈/g, '8')
    .replace(/₉/g, '9')
    .replace(/ⁿ/g, '^n');
}

export class EngineeringCalculationPdfExportService {
  /**
   * Generates and downloads a standardized, certified A4 engineering design calculation note
   */
  public static exportCalculationPdf(data: CalculationReportData, locale: 'fr' | 'en' = 'fr'): void {
    const isFr = locale === 'fr';
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    const contentWidth = pageWidth - (margin * 2);

    // Running Header and Footer on every page
    const addHeaderFooter = (pageNumber: number, totalPages: number) => {
      // Top header bar
      doc.setFillColor(...PDF_COLORS.obsidian);
      doc.rect(0, 0, pageWidth, 11, 'F');

      doc.setTextColor(...PDF_COLORS.white);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text(
        isFr 
          ? 'EPEDE - NOTE DE CALCUL TECHNIQUE NORMALISEE (CEI / IEEE / NF C)' 
          : 'EPEDE - CERTIFIED ELECTRICAL ENGINEERING DESIGN NOTE (IEC / IEEE / NF C)',
        margin,
        7.2
      );

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...PDF_COLORS.cyan);
      doc.text(sanitizePdfText(data.standard || 'CEI 60909 / CEI 60364-5-52'), pageWidth - margin - 60, 7.2);

      // Bottom footer bar
      doc.setFillColor(...PDF_COLORS.slate800);
      doc.rect(0, pageHeight - 9, pageWidth, 9, 'F');
      doc.setTextColor(...PDF_COLORS.slate400);
      doc.setFontSize(7);
      doc.text(
        isFr 
          ? `DOSSIER D'EXECUTION : ${sanitizePdfText(data.referenceId)} - SYSTEME NUMERIQUE EPEDE CAD ENGINE v2.4`
          : `DESIGN DOSSIER: ${sanitizePdfText(data.referenceId)} - EPEDE CAD ENGINE v2.4 VERIFIED`,
        margin,
        pageHeight - 3.2
      );
      doc.text(`Page ${pageNumber} / ${totalPages}`, pageWidth - margin - 15, pageHeight - 3.2);
    };

    // ─────────────────────────────────────────────────────────────────────────────
    // SECTION 1: HEADER BANNER & IDENTIFICATION
    // ─────────────────────────────────────────────────────────────────────────────
    let currentY = 17;

    // Header banner box
    doc.setFillColor(...PDF_COLORS.obsidian);
    doc.rect(margin, currentY, contentWidth, 38, 'F');

    // Accent line
    doc.setDrawColor(...PDF_COLORS.cyan);
    doc.setLineWidth(0.8);
    doc.rect(margin, currentY, contentWidth, 38, 'S');

    // Title & Ref ID
    doc.setTextColor(...PDF_COLORS.cyan);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(
      isFr 
        ? `NOTE TECHNIQUE OFFICIELLE - REF : ${sanitizePdfText(data.referenceId)}` 
        : `OFFICIAL CALCULATION NOTE - REF: ${sanitizePdfText(data.referenceId)}`,
      margin + 5,
      currentY + 7
    );

    doc.setTextColor(...PDF_COLORS.white);
    doc.setFontSize(13);
    const titleLines = doc.splitTextToSize(sanitizePdfText(data.title), contentWidth - 10);
    doc.text(titleLines, margin + 5, currentY + 15);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...PDF_COLORS.slate200);
    doc.text(
      `${isFr ? 'Norme de gouvernance :' : 'Governing standard:'} ${sanitizePdfText(data.standard)}  |  ${isFr ? 'Date d\'emission :' : 'Date of issue:'} ${sanitizePdfText(data.date)}`,
      margin + 5,
      currentY + 28
    );

    doc.setTextColor(...PDF_COLORS.slate400);
    doc.setFontSize(7.5);
    doc.text(
      `${isFr ? 'Module de calcul :' : 'Calculation module:'} ${sanitizePdfText(data.calcType)} - ${isFr ? 'Classification : Document d\'Ingenierie Controle' : 'Classification: Controlled Engineering Document'}`,
      margin + 5,
      currentY + 34
    );

    currentY += 43;

    // ─────────────────────────────────────────────────────────────────────────────
    // COMPLIANCE VERDICT STAMP BADGE
    // ─────────────────────────────────────────────────────────────────────────────
    const isCompliant = data.complianceVerdict.status === 'COMPLIANT';
    const isNonCompliant = data.complianceVerdict.status === 'NON_COMPLIANT';
    
    const badgeBg = isCompliant ? PDF_COLORS.emeraldBg : isNonCompliant ? PDF_COLORS.redBg : PDF_COLORS.amberBg;
    const badgeBorder = isCompliant ? PDF_COLORS.emerald : isNonCompliant ? PDF_COLORS.red : PDF_COLORS.amber;
    const badgeText = isCompliant ? PDF_COLORS.emeraldDark : isNonCompliant ? PDF_COLORS.red : PDF_COLORS.amber;

    doc.setFillColor(...badgeBg);
    doc.setDrawColor(...badgeBorder);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, currentY, contentWidth, 18, 2, 2, 'FD');

    doc.setTextColor(...badgeText);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    const verdictTitle = isCompliant 
      ? (isFr ? 'VERDICT NORMATIF : CONFORME' : 'NORMATIVE VERDICT: COMPLIANT')
      : isNonCompliant 
      ? (isFr ? 'VERDICT NORMATIF : NON CONFORME' : 'NORMATIVE VERDICT: NON-COMPLIANT')
      : (isFr ? 'AVIS D\'INGENIERIE : PRECONISATION TECHNIQUE' : 'ENGINEERING NOTICE: TECHNICAL RECOMMENDATION');
    doc.text(verdictTitle, margin + 5, currentY + 6.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...PDF_COLORS.slate800);
    const messageLines = doc.splitTextToSize(sanitizePdfText(data.complianceVerdict.message), contentWidth - 10);
    doc.text(messageLines, margin + 5, currentY + 12);

    currentY += 22;

    // ─────────────────────────────────────────────────────────────────────────────
    // APPARATUS PROVENANCE (IF AVAILABLE)
    // ─────────────────────────────────────────────────────────────────────────────
    if (data.apparatusProvenance) {
      doc.setFillColor(...PDF_COLORS.slate100);
      doc.setDrawColor(...PDF_COLORS.slate400);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, currentY, contentWidth, 12, 1.5, 1.5, 'FD');

      doc.setTextColor(...PDF_COLORS.slate800);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.text(isFr ? 'MATERIEL DU RESEAU ASSOCIE :' : 'ASSOCIATED GRID APPARATUS:', margin + 4, currentY + 5);

      doc.setFont('helvetica', 'normal');
      doc.text(
        sanitizePdfText(`Tag: ${data.apparatusProvenance.equipmentTag || 'N/A'}  |  ${isFr ? 'Designation :' : 'Name:'} ${data.apparatusProvenance.equipmentName || 'Equipement Reseau'}  |  ${isFr ? 'Poste/Depart :' : 'Substation/Feeder:'} ${data.apparatusProvenance.substationOrFeeder || 'Poste Source'}`),
        margin + 4,
        currentY + 9.5
      );

      currentY += 16;
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // SECTION 2: INPUT PARAMETERS (INPUTS TABLE)
    // ─────────────────────────────────────────────────────────────────────────────
    doc.setTextColor(...PDF_COLORS.obsidian);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text(isFr ? '1. Hypotheses de Calcul & Donnees d\'Entree' : '1. Design Hypotheses & Input Parameters', margin, currentY);

    const inputRows = data.inputs.map((item) => [
      sanitizePdfText(item.label),
      sanitizePdfText(item.value),
      sanitizePdfText(item.unit || '-'),
      sanitizePdfText(item.status || 'OK')
    ]);

    autoTable(doc, {
      startY: currentY + 2.5,
      margin: { left: margin, right: margin },
      head: [[
        isFr ? 'Grandeur Physique / Parametre' : 'Physical Parameter',
        isFr ? 'Valeur Assignee' : 'Assigned Value',
        isFr ? 'Unite' : 'Unit',
        isFr ? 'Validation' : 'Status'
      ]],
      body: inputRows,
      theme: 'grid',
      headStyles: { 
        fillColor: PDF_COLORS.headerBg, 
        textColor: PDF_COLORS.white, 
        fontSize: 7.5, 
        fontStyle: 'bold', 
        cellPadding: 2 
      },
      bodyStyles: { 
        fontSize: 7, 
        textColor: PDF_COLORS.slate800, 
        cellPadding: 1.8 
      },
      alternateRowStyles: { 
        fillColor: PDF_COLORS.rowEven 
      },
      columnStyles: {
        0: { cellWidth: 90 },
        1: { cellWidth: 45, halign: 'right', fontStyle: 'bold' },
        2: { cellWidth: 25, halign: 'center' },
        3: { cellWidth: 22, halign: 'center' },
      }
    });

    currentY = (doc as any).lastAutoTable.finalY + 6;

    // ─────────────────────────────────────────────────────────────────────────────
    // SECTION 3: MATHEMATICAL FORMULATIONS APPLIED
    // ─────────────────────────────────────────────────────────────────────────────
    doc.setTextColor(...PDF_COLORS.obsidian);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text(isFr ? '2. Formulations Mathematiques & Equations Normatives' : '2. Applied Mathematical Formulations & Standards Equations', margin, currentY);

    const formulaRows = data.formulas.map((f) => [
      sanitizePdfText(f.name),
      sanitizePdfText(f.expr)
    ]);

    autoTable(doc, {
      startY: currentY + 2.5,
      margin: { left: margin, right: margin },
      head: [[
        isFr ? 'Designation de la Formule' : 'Formula Designation',
        isFr ? 'Expression Mathematique Appliquee (CEI / NF C / IEEE)' : 'Applied Formula Expression (IEC / NF C / IEEE)'
      ]],
      body: formulaRows,
      theme: 'grid',
      headStyles: { 
        fillColor: PDF_COLORS.headerBg, 
        textColor: PDF_COLORS.white, 
        fontSize: 7.5, 
        fontStyle: 'bold', 
        cellPadding: 2 
      },
      bodyStyles: { 
        fontSize: 7, 
        textColor: PDF_COLORS.slate900, 
        font: 'courier', 
        cellPadding: 1.8 
      },
      alternateRowStyles: { 
        fillColor: PDF_COLORS.rowEven 
      },
      columnStyles: {
        0: { cellWidth: 65, font: 'helvetica', fontStyle: 'bold' },
        1: { cellWidth: 117 },
      }
    });

    currentY = (doc as any).lastAutoTable.finalY + 6;

    // Check if we need a new page for results & sign-off
    if (currentY > pageHeight - 75) {
      addHeaderFooter(doc.getNumberOfPages(), doc.getNumberOfPages() + 1);
      doc.addPage();
      currentY = 20;
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // SECTION 4: COMPUTED RESULTS & SIZING OUTPUT
    // ─────────────────────────────────────────────────────────────────────────────
    doc.setTextColor(...PDF_COLORS.obsidian);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text(isFr ? '3. Resultats du Calcul & Dimensionnement Valide' : '3. Sizing Results & Validated Parameters', margin, currentY);

    const resultRows = data.results.map((r) => [
      sanitizePdfText(r.label),
      sanitizePdfText(r.value),
      sanitizePdfText(r.unit || '-'),
      r.status === 'DANGER' ? (isFr ? 'NON CONFORME' : 'DANGER') : sanitizePdfText(r.status || 'OK')
    ]);

    autoTable(doc, {
      startY: currentY + 2.5,
      margin: { left: margin, right: margin },
      head: [[
        isFr ? 'Grandeur Calculee' : 'Computed Parameter',
        isFr ? 'Valeur Resultante' : 'Result Value',
        isFr ? 'Unite SI' : 'SI Unit',
        isFr ? 'Verdict' : 'Status'
      ]],
      body: resultRows,
      theme: 'grid',
      headStyles: { 
        fillColor: PDF_COLORS.navyBlue, 
        textColor: PDF_COLORS.white, 
        fontSize: 7.5, 
        fontStyle: 'bold', 
        cellPadding: 2.2 
      },
      bodyStyles: { 
        fontSize: 7.5, 
        textColor: PDF_COLORS.slate900, 
        cellPadding: 2 
      },
      alternateRowStyles: { 
        fillColor: PDF_COLORS.rowEven 
      },
      columnStyles: {
        0: { cellWidth: 90, fontStyle: 'bold' },
        1: { cellWidth: 45, halign: 'right', fontStyle: 'bold', textColor: [15, 23, 42] },
        2: { cellWidth: 25, halign: 'center', fontStyle: 'bold' },
        3: { cellWidth: 22, halign: 'center', fontStyle: 'bold' },
      }
    });

    currentY = (doc as any).lastAutoTable.finalY + 6;

    // ─────────────────────────────────────────────────────────────────────────────
    // SECTION 5: ENGINEERING NOTES & RULES OF ART
    // ─────────────────────────────────────────────────────────────────────────────
    if (data.engineeringNotes && data.engineeringNotes.length > 0) {
      if (currentY > pageHeight - 50) {
        addHeaderFooter(doc.getNumberOfPages(), doc.getNumberOfPages() + 1);
        doc.addPage();
        currentY = 20;
      }

      doc.setTextColor(...PDF_COLORS.obsidian);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(isFr ? '4. Recommandations & Regles de l\'Art' : '4. Engineering Guidelines & Good Practice Rules', margin, currentY);
      currentY += 4;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...PDF_COLORS.slate600);

      data.engineeringNotes.forEach((note, idx) => {
        const bulletLines = doc.splitTextToSize(sanitizePdfText(`[${idx + 1}] ${note}`), contentWidth - 4);
        doc.text(bulletLines, margin + 2, currentY);
        currentY += (bulletLines.length * 3.4) + 1.5;
      });

      currentY += 3;
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // SECTION 6: CERTIFICATION & SIGNATURE BLOCK
    // ─────────────────────────────────────────────────────────────────────────────
    if (currentY > pageHeight - 38) {
      addHeaderFooter(doc.getNumberOfPages(), doc.getNumberOfPages() + 1);
      doc.addPage();
      currentY = 20;
    }

    const signBoxY = currentY + 2;
    const boxW = (contentWidth - 6) / 3;

    // Box 1: Lead Engineer
    doc.setFillColor(...PDF_COLORS.slate100);
    doc.setDrawColor(...PDF_COLORS.slate400);
    doc.roundedRect(margin, signBoxY, boxW, 20, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(...PDF_COLORS.slate800);
    doc.text(isFr ? 'INGENIEUR D\'ETUDES (CALCULATEUR)' : 'ELECTRICAL DESIGN ENGINEER', margin + 3, signBoxY + 4);
    doc.setFont('helvetica', 'normal');
    doc.text('EPEDE Algorithmic Solver Engine v2.4', margin + 3, signBoxY + 8);
    doc.text(`${isFr ? 'Date :' : 'Date:'} ${sanitizePdfText(data.date)}`, margin + 3, signBoxY + 12);
    doc.setTextColor(...PDF_COLORS.emeraldDark);
    doc.text('[OK] Auto-calcul verifie', margin + 3, signBoxY + 16.5);

    // Box 2: Verification / Visa
    doc.setFillColor(...PDF_COLORS.slate100);
    doc.setDrawColor(...PDF_COLORS.slate400);
    doc.roundedRect(margin + boxW + 3, signBoxY, boxW, 20, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(...PDF_COLORS.slate800);
    doc.text(isFr ? 'VISA TECHNIQUE & VALIDATION' : 'TECHNICAL APPROVAL & VISA', margin + boxW + 6, signBoxY + 4);
    doc.setFont('helvetica', 'normal');
    doc.text(isFr ? 'Conformite normative CEI / NF C' : 'Normative standard compliance', margin + boxW + 6, signBoxY + 8);
    doc.text(isFr ? 'Statut : DOSSIER VALIDE' : 'Status: VALIDATED DOSSIER', margin + boxW + 6, signBoxY + 12);
    doc.setTextColor(...PDF_COLORS.navyBlue);
    doc.text('Visa Electrique Reseau EPEDE', margin + boxW + 6, signBoxY + 16.5);

    // Box 3: Certified Stamp
    doc.setFillColor(...PDF_COLORS.slate100);
    doc.setDrawColor(...PDF_COLORS.gold);
    doc.roundedRect(margin + (boxW * 2) + 6, signBoxY, boxW, 20, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(...PDF_COLORS.gold);
    doc.text('SCEAU NUMERIQUE CERTIFIE', margin + (boxW * 2) + 9, signBoxY + 4);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...PDF_COLORS.slate600);
    doc.text(`Hash: ${sanitizePdfText(data.referenceId)}`, margin + (boxW * 2) + 9, signBoxY + 8);
    doc.text('CEI 60909 / CEI 60364 Suite', margin + (boxW * 2) + 9, signBoxY + 12);
    doc.setTextColor(...PDF_COLORS.cyan);
    doc.text('* EPEDE CERTIFIED CAD NOTE', margin + (boxW * 2) + 9, signBoxY + 16.5);

    // Apply header & footer across all pages
    const totalPages = doc.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      addHeaderFooter(p, totalPages);
    }

    // Save and download PDF file
    const safeRef = data.referenceId.replace(/[^a-zA-Z0-9_-]/g, '_');
    doc.save(`Note-Calcul-${data.calcType}-${safeRef}.pdf`);
  }
}
