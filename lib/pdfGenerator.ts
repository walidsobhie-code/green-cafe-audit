import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { auditCategories, AuditPoint } from './auditData';

export interface AuditSubmission {
  id: string;
  branchName: string;
  branchNameAr: string;
  auditorName: string;
  auditorNameAr: string;
  date: string;
  scores: Record<number, { score: number; note: string; photo?: string }>;
  totalScore: number;
  percentage: number;
  actionItems: { point: string; action: string; responsible: string; deadline: string }[];
  emailList: string[];
}

const weightByCategory: Record<string, number> = {
  'customer-experience': 3,
  'food-safety': 3,
  'beverage-quality': 3,
  'operations': 2,
  'equipment': 2,
  'inventory': 1,
  'staff-development': 2,
  'compliance': 3,
  'shift-leadership': 2,
};

// Flatten all points
const allPoints: AuditPoint[] = auditCategories.flatMap(cat => cat.points);

export function generatePDF(submission: AuditSubmission): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFillColor(34, 139, 34);
  doc.rect(0, 0, pageWidth, 30, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Green Cafe Audit Report', pageWidth / 2, 12, { align: 'center' });
  doc.setFontSize(10);
  doc.text('تقرير تدقيق جرين كافيه', pageWidth / 2, 20, { align: 'center' });

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  
  const infoY = 40;
  doc.text(`Branch: ${submission.branchName}`, 14, infoY);
  doc.text(`Auditor: ${submission.auditorName}`, 14, infoY + 6);
  doc.text(`Date: ${submission.date}`, 14, infoY + 12);

  // Score
  const scoreColor = submission.percentage >= 80 ? [34, 139, 34] : submission.percentage >= 60 ? [255, 165, 0] : [220, 20, 60];
  doc.setFillColor(...scoreColor as [number, number, number]);
  doc.rect(140, infoY - 5, 50, 18, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text(`${submission.percentage}%`, 165, infoY + 5, { align: 'center' });
  doc.setFontSize(10);
  doc.text(`${submission.totalScore} pts`, 165, infoY + 11, { align: 'center' });

  // Category Summary
  doc.setTextColor(0, 0, 0);
  const tableData = auditCategories.map(cat => {
    const weight = weightByCategory[cat.id] || 1;
    let catTotal = 0, catMax = 0;
    
    cat.points.forEach(point => {
      const entry = submission.scores[point.id];
      if (entry?.score !== undefined && entry.score >= 0) {
        catTotal += entry.score * weight;
        catMax += 2 * weight;
      }
    });
    
    const pct = catMax > 0 ? Math.round((catTotal / catMax) * 100) : 0;
    return [cat.name, `${catTotal}/${catMax}`, `${pct}%`];
  });

  autoTable(doc, {
    startY: infoY + 20,
    head: [['Category', 'Score', '%']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [34, 139, 34] },
    styles: { fontSize: 9 },
  });

  // ALL QUESTIONS RESULTS
  doc.addPage();
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('All Questions Results', 14, 20);
  
  const allQuestionsData = allPoints.map(point => {
    const scoreEntry = submission.scores[point.id];
    const score = scoreEntry?.score ?? -1;
    const status = score === 2 ? 'PASS' : score === 1 ? 'PARTIAL' : score === 0 ? 'FAIL' : 'N/A';
    const note = scoreEntry?.note || '-';
    return [
      `#${point.id}`,
      point.category.substring(0, 8),
      point.question.substring(0, 45) + (point.question.length > 45 ? '...' : ''),
      status,
      note.substring(0, 35)
    ];
  });

  autoTable(doc, {
    startY: 25,
    head: [['#', 'Cat', 'Question', 'Status', 'Notes']],
    body: allQuestionsData,
    theme: 'striped',
    headStyles: { fillColor: [34, 139, 34] },
    styles: { fontSize: 7 },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 15 },
      2: { cellWidth: 90 },
      3: { cellWidth: 15 },
      4: { cellWidth: 'auto' },
    },
    didParseCell: function(data) {
      if (data.column.index === 3 && data.section === 'body') {
        if (data.cell.raw === 'FAIL') {
          data.cell.styles.textColor = [220, 20, 60];
          data.cell.styles.fontStyle = 'bold';
        } else if (data.cell.raw === 'PARTIAL') {
          data.cell.styles.textColor = [255, 165, 0];
          data.cell.styles.fontStyle = 'bold';
        } else if (data.cell.raw === 'PASS') {
          data.cell.styles.textColor = [34, 139, 34];
        }
      }
    }
  });

  // ACTION PLAN
  const actionItems = submission.actionItems.length > 0 ? submission.actionItems : 
    Object.entries(submission.scores)
      .filter(([_, e]) => e && e.score !== undefined && e.score < 2 && e.score !== -1)
      .map(([id, e]) => ({ 
        point: id, 
        action: e?.note || 'Needs improvement', 
        responsible: submission.auditorName, 
        deadline: submission.date 
      }));

  if (actionItems.length > 0) {
    doc.addPage();
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(220, 53, 69);
    doc.text(`Action Plan (${actionItems.length} items)`, 14, 20);
    
    const actionData = actionItems.map(item => {
      const pointId = parseInt(item.point.replace('Q', ''));
      const point = allPoints.find(p => p.id === pointId);
      const question = point ? point.question.substring(0, 45) : `Q${item.point}`;
      return [item.point, question, item.action, item.responsible, item.deadline];
    });
    
    autoTable(doc, {
      startY: 25,
      head: [['#', 'Question', 'Action Required', 'Responsible', 'Deadline']],
      body: actionData,
      theme: 'grid',
      headStyles: { fillColor: [220, 53, 69] },
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 65 },
        2: { cellWidth: 65 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 },
      },
    });
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(128, 128, 128);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 8, { align: 'center' });
  }

  return doc;
}

export function generatePDFBlob(submission: AuditSubmission): Blob {
  const doc = generatePDF(submission);
  return doc.output('blob');
}
