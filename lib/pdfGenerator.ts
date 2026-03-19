import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { auditCategories } from './auditData';

export interface AuditSubmission {
  id: string;
  branchName: string;
  branchNameAr: string;
  auditorName: string;
  auditorNameAr: string;
  date: string;
  scores: Record<number, { score: number; note: string; photo?: string; temperature?: string }>;
  totalScore: number;
  percentage: number;
  actionItems: { point: string; action: string; responsible: string; deadline: string }[];
  emailList: string[];
  lang: 'en' | 'ar';
}

// Get all points as flat array
const allPoints = auditCategories.flatMap(cat => cat.points);

export function generatePDF(submission: AuditSubmission): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const isArabic = submission.lang === 'ar';
  
  const percentage = submission.percentage || 0;
  const totalScore = submission.totalScore || 0;
  const branchName = submission.branchName || 'N/A';
  const auditorName = submission.auditorName || 'N/A';
  
  // Helper function to get question data
  const getPoint = (id: number) => allPoints.find(p => p.id === id);
  
  // Helper to calculate category scores with CCP weights
  const calcCategoryScores = () => {
    return auditCategories.map(cat => {
      let earned = 0, maxScore = 0, ccpEarned = 0, ccpMax = 0;
      let failedCCPs: number[] = [];
      
      cat.points.forEach(p => {
        const entry = submission.scores[p.id];
        const weight = p.isCCP && p.ccpWeight ? p.ccpWeight : 2;
        
        maxScore += weight;
        if (p.isCCP) ccpMax += weight;
        
        if (entry && entry.score !== undefined && entry.score >= 0) {
          earned += entry.score * (weight / 2);
          if (p.isCCP) {
            ccpEarned += entry.score * (weight / 2);
            if (entry.score < 2) failedCCPs.push(p.id);
          }
        }
      });
      
      return {
        name: isArabic ? cat.nameAr : cat.name,
        earned: Math.round(earned * 10) / 10,
        max: maxScore,
        pct: maxScore > 0 ? Math.round((earned / maxScore) * 100) : 0,
        ccpEarned: Math.round(ccpEarned * 10) / 10,
        ccpMax,
        ccpPct: ccpMax > 0 ? Math.round((ccpEarned / ccpMax) * 100) : 100,
        failedCCPs
      };
    });
  };

  const catScores = calcCategoryScores();
  const totalCCPs = catScores.reduce((sum, c) => sum + c.ccpMax, 0);
  const totalCCPEarned = catScores.reduce((sum, c) => sum + c.ccpEarned, 0);
  const overallCCP = totalCCPs > 0 ? Math.round((totalCCPEarned / totalCCPs) * 100) : 100;
  const passStatus = percentage >= 90 && overallCCP === 100;

  // ============ HEADER ============
  doc.setFillColor(22, 160, 133); // Green Cafe green
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  // Logo placeholder
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(12, 8, 30, 30, 3, 3, 'F');
  doc.setTextColor(22, 160, 133);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Green', 15, 18);
  doc.text('Cafe', 15, 25);
  doc.setFontSize(7);
  doc.text('Egypt', 15, 31);
  
  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text(isArabic ? 'تقرير تدقيق cafe أخضر' : 'Green Cafe Audit Report', pageWidth / 2, 18, { align: 'center' });
  doc.setFontSize(10);
  doc.text(isArabic ? 'تقرير تدقيق شامل' : 'Comprehensive Audit Report', pageWidth / 2, 28, { align: 'center' });
  
  // Score Box
  const passColor: [number, number, number] = passStatus ? [39, 174, 96] : percentage >= 70 ? [243, 156, 18] : [231, 76, 60];
  doc.setFillColor(passColor[0], passColor[1], passColor[2]);
  doc.roundedRect(pageWidth - 60, 8, 50, 30, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text(`${percentage}%`, pageWidth - 35, 18, { align: 'center' });
  doc.setFontSize(9);
  doc.text(passStatus ? (isArabic ? 'ناجح' : 'PASS') : (isArabic ? 'تحتاج تحسين' : 'NEEDS WORK'), pageWidth - 35, 26, { align: 'center' });
  doc.setFontSize(8);
  doc.text(`${totalScore} pts`, pageWidth - 35, 33, { align: 'center' });

  // ============ INFO SECTION ============
  const infoY = 55;
  
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(isArabic ? 'معلومات التفتيش' : 'Inspection Details', 15, infoY);
  
  // Info boxes
  const infoBoxes = [
    { label: isArabic ? 'الفرع' : 'Branch', value: branchName },
    { label: isArabic ? 'المدقق' : 'Auditor', value: auditorName },
    { label: isArabic ? 'التاريخ' : 'Date', value: submission.date },
    { label: isArabic ? 'الحالة' : 'Status', value: passStatus ? (isArabic ? 'ناجح' : 'PASS') : (isArabic ? 'تحتاج تحسين' : 'NEEDS WORK') }
  ];
  
  infoBoxes.forEach((box, i) => {
    const x = 15 + (i * 48);
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(x, infoY + 5, 44, 22, 2, 2, 'F');
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(7);
    doc.text(box.label, x + 4, infoY + 10);
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    const truncated = box.value.length > 18 ? box.value.substring(0, 18) + '...' : box.value;
    doc.text(truncated, x + 4, infoY + 18);
  });

  // ============ SCORE SUMMARY ============
  const summaryY = infoY + 38;
  doc.setFontSize(11);
  doc.setTextColor(22, 160, 133);
  doc.text(isArabic ? 'ملخص النتيجة' : 'Score Summary', 15, summaryY);
  
  // Summary boxes
  const summaries = [
    { label: isArabic ? 'النتيجة' : 'Score', value: `${totalScore}`, sub: isArabic ? 'من 50' : 'of 50' },
    { label: isArabic ? 'النسبة' : 'Percentage', value: `${percentage}%`, sub: passStatus ? '✓' : '✗' },
    { label: isArabic ? 'CCP' : 'CCP', value: `${overallCCP}%`, sub: isArabic ? 'حرجة' : 'Critical' },
    { label: isArabic ? 'الفئات' : 'Categories', value: `${auditCategories.length}`, sub: isArabic ? 'مجموع' : 'Total' }
  ];
  
  summaries.forEach((s, i) => {
    const x = 15 + (i * 48);
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(x, summaryY + 5, 44, 20, 2, 2, 'F');
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(s.label, x + 4, summaryY + 10);
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(s.value, x + 4, summaryY + 17);
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(s.sub, x + 30, summaryY + 17);
  });

  // ============ CATEGORY BREAKDOWN ============
  const catY = summaryY + 35;
  doc.setFontSize(11);
  doc.setTextColor(22, 160, 133);
  doc.text(isArabic ? 'تفصيل حسب الفئة' : 'Category Breakdown', 15, catY);
  
  const catTableData = catScores.map(cat => [
    cat.name,
    `${cat.earned}/${cat.max}`,
    `${cat.pct}%`,
    cat.ccpMax > 0 ? `${cat.ccpPct}%` : '-',
    cat.pct >= 90 && (cat.ccpMax === 0 || cat.ccpPct === 100) ? '✓' : cat.pct >= 70 ? '△' : '✗'
  ]);

  autoTable(doc, {
    startY: catY + 3,
    head: [[
      isArabic ? 'الفئة' : 'Category',
      isArabic ? 'النتيجة' : 'Score',
      isArabic ? 'النسبة' : '%',
      isArabic ? 'CCP' : 'CCP',
      isArabic ? 'الحالة' : 'Status'
    ]],
    body: catTableData,
    theme: 'striped',
    headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 4 },
    columnStyles: {
      0: { fontStyle: 'bold' },
      4: { fontStyle: 'bold', halign: 'center' }
    }
  });

  // ============ CCP DETAILS ============
  let currentY = (doc as any).lastAutoTable?.finalY + 15 || catY + 60;
  
  if (currentY > 240) {
    doc.addPage();
    currentY = 20;
  }
  
  doc.setFontSize(11);
  doc.setTextColor(220, 53, 69);
  doc.text(isArabic ? 'نقاط التحكم الحرجة (CCP)' : 'Critical Control Points (CCP)', 15, currentY);
  
  const ccps = allPoints.filter(p => p.isCCP).map(p => {
    const entry = submission.scores[p.id];
    const score = entry?.score ?? -1;
    const weight = p.ccpWeight || 3;
    const status = score === 2 ? '✓' : score === 1 ? '△' : '✗';
    const statusColor = score === 2 ? [39, 174, 96] : score === 1 ? [243, 156, 18] : [220, 53, 69];
    return {
      id: p.id,
      question: isArabic ? p.questionAr : p.question,
      score,
      weight,
      status,
      statusColor,
      reason: p.criticalReason || '',
      note: entry?.note || ''
    };
  });

  const ccpData = ccps.map(c => [
    `Q${c.id}`,
    c.question.substring(0, 40) + (c.question.length > 40 ? '...' : ''),
    c.status,
    c.note ? '📝' : '-'
  ]);

  autoTable(doc, {
    startY: currentY + 3,
    head: [[
      '#',
      isArabic ? 'السؤال' : 'Question',
      isArabic ? 'الحالة' : 'Status',
      isArabic ? 'ملاحظة' : 'Note'
    ]],
    body: ccpData,
    theme: 'grid',
    headStyles: { fillColor: [220, 53, 69] },
    styles: { fontSize: 8, cellPadding: 3 }
  });

  // ============ FAILED ITEMS ============
  const failedItems = allPoints.filter(p => {
    const entry = submission.scores[p.id];
    return entry && entry.score !== undefined && entry.score < 2 && entry.score !== -1;
  });

  if (failedItems.length > 0) {
    doc.addPage();
    
    doc.setFillColor(243, 156, 18);
    doc.rect(0, 0, pageWidth, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text(isArabic ? 'خطة العمل - تحتاج تحسين' : 'Action Plan - Needs Improvement', pageWidth / 2, 16, { align: 'center' });

    const actionData = failedItems.map(p => {
      const entry = submission.scores[p.id];
      const scoreTxt = entry?.score === 1 ? (isArabic ? 'جزئي' : 'Partial') : (isArabic ? 'فشل' : 'Fail');
      return [
        `Q${p.id}`,
        isArabic ? p.questionAr : p.question,
        scoreTxt,
        entry?.note || (isArabic ? 'يحتاج تحسين' : 'Needs improvement')
      ];
    });

    autoTable(doc, {
      startY: 35,
      head: [[
        '#',
        isArabic ? 'السؤال' : 'Question',
        isArabic ? 'النتيجة' : 'Result',
        isArabic ? 'الإجراء المطلوب' : 'Action Required'
      ]],
      body: actionData,
      theme: 'grid',
      headStyles: { fillColor: [243, 156, 18], textColor: 255 },
      styles: { fontSize: 9, cellPadding: 4 }
    });
  }

  // ============ SIGNATURE PAGE ============
  doc.addPage();
  doc.setFillColor(22, 160, 133);
  doc.rect(0, 0, pageWidth, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text(isArabic ? 'التوقيعات' : 'Signatures', pageWidth / 2, 16, { align: 'center' });

  const sigY = 50;
  doc.setTextColor(50, 50, 50);
  
  // Auditor signature
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(15, sigY, 80, 50, 3, 3, 'F');
  doc.setFontSize(10);
  doc.text(isArabic ? 'توقيع المدقق' : 'Auditor Signature', 20, sigY + 10);
  doc.setFontSize(9);
  doc.text(auditorName, 20, sigY + 20);
  doc.text(submission.date, 20, sigY + 30);
  doc.setDrawColor(150, 150, 150);
  doc.line(20, sigY + 45, 90, sigY + 45);
  
  // Manager signature
  doc.roundedRect(110, sigY, 80, 50, 3, 3, 'F');
  doc.setFontSize(10);
  doc.text(isArabic ? 'توقيع المدير' : 'Manager Signature', 115, sigY + 10);
  doc.setFontSize(9);
  doc.text('________________', 115, sigY + 30);
  doc.line(115, sigY + 45, 185, sigY + 45);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 280, { align: 'center' });
  doc.text('Green Cafe Egypt - Professional Audit System', pageWidth / 2, 286, { align: 'center' });

  return doc;
}

export function generatePDFBlob(submission: AuditSubmission): Blob {
  const doc = generatePDF(submission);
  return doc.output('blob');
}