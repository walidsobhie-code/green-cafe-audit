import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

  // Results by Category
  doc.setTextColor(0, 0, 0);
  const categories = [
    { id: 'customer-experience', name: 'Customer Experience' },
    { id: 'food-safety', name: 'Food Safety' },
    { id: 'beverage-quality', name: 'Beverage Quality' },
    { id: 'operations', name: 'Operations' },
    { id: 'equipment', name: 'Equipment' },
    { id: 'inventory', name: 'Inventory' },
    { id: 'staff-development', name: 'Staff Development' },
    { id: 'compliance', name: 'Compliance' },
    { id: 'shift-leadership', name: 'Shift Leadership' },
  ];

  const tableData = categories.map(cat => {
    const weight = weightByCategory[cat.id] || 1;
    let catTotal = 0, catMax = 0;
    
    Object.entries(submission.scores).forEach(([id, entry]) => {
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

  // Action Items
  if (submission.actionItems.length > 0) {
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Action Plan', 14, finalY);
    
    const actionData = submission.actionItems.map(item => [item.point, item.action, item.responsible, item.deadline]);
    autoTable(doc, {
      startY: finalY + 3,
      head: [['Question', 'Action Required', 'Responsible', 'Date']],
      body: actionData,
      theme: 'grid',
      headStyles: { fillColor: [220, 53, 69] },
      styles: { fontSize: 8 },
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
