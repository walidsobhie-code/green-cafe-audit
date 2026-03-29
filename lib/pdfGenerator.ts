import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { auditCategories } from './auditData';
import QRCode from 'qrcode';

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

// ============ CHART FUNCTIONS ============
function drawBarChart(doc: jsPDF, data: { label: string; value: number; max: number }[], startX: number, startY: number, width: number, height: number, isArabic: boolean): number {
  const maxValue = Math.max(...data.map(d => d.max), 1);
  const barWidth = (width - 20) / data.length;
  const maxBarHeight = height - 25;

  let currentX = startX;

  data.forEach((item, i) => {
    const barHeight = (item.value / maxValue) * maxBarHeight;
    const x = startX + 10 + (i * barWidth);

    // Bar color based on percentage
    const pct = item.max > 0 ? (item.value / item.max) * 100 : 0;
    let barColor: [number, number, number];
    if (pct >= 90) barColor = [39, 174, 96]; // green
    else if (pct >= 70) barColor = [243, 156, 18]; // orange
    else barColor = [231, 76, 60]; // red

    doc.setFillColor(barColor[0], barColor[1], barColor[2]);
    doc.roundedRect(x, startY + maxBarHeight - barHeight + 20, barWidth - 3, barHeight - 3, 1, 1, 'F');

    // Label
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(7);
    doc.text(item.label.substring(0, 8), x + barWidth / 6, startY + maxBarHeight + 5);

    // Value
    doc.setFontSize(8);
    doc.setTextColor(40, 40, 40);
    doc.text(`${Math.round(pct)}%`, x + barWidth / 6, startY + maxBarHeight - barHeight + 18);
  });

  return startY + maxBarHeight + 15;
}

function drawPieChart(doc: jsPDF, data: { label: string; value: number; color: [number, number, number] }[], centerX: number, centerY: number, radius: number, isArabic: boolean): void {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) return;

  let startAngle = -Math.PI / 2;

  data.forEach((item) => {
    const sliceAngle = (item.value / total) * 2 * Math.PI;
    const endAngle = startAngle + sliceAngle;

    doc.setFillColor(item.color[0], item.color[1], item.color[2]);
    doc.triangle(
      centerX, centerY,
      centerX + radius * Math.cos(startAngle), centerY + radius * Math.sin(startAngle),
      centerX + radius * Math.cos(endAngle), centerY + radius * Math.sin(endAngle),
      'F'
    );
    (doc as any).arc(centerX, centerY, radius, startAngle, endAngle, 'F');

    startAngle = endAngle;
  });
}

export async function generatePDF(submission: AuditSubmission): Promise<jsPDF> {
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

  // QR Code - link to the audit details
  try {
    const qrData = `https://green-cafe-audit.vercel.app/audit/${submission.id || 'preview'}`;
    const qrImage = await QRCode.toDataURL(qrData, {
      width: 80,
      margin: 1,
      color: { dark: '#16A085', light: '#FFFFFF' }
    });
    doc.addImage(qrImage, 'PNG', pageWidth - 95, 8, 25, 25);
    doc.setFontSize(6);
    doc.setTextColor(120, 120, 120);
    doc.text(isArabic ? 'مسح' : 'Scan', pageWidth - 82.5, 36, { align: 'center' });
  } catch (e) {
    // QR code failed, continue without it
  }

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

  // ============ SCORE CHART ============
  const chartData = catScores.map(cat => ({
    label: cat.name.substring(0, 12),
    value: cat.earned,
    max: cat.max
  }));
  const chartY = summaryY + 32;
  drawBarChart(doc, chartData, 15, chartY, 180, 50, isArabic);

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

  // ============ EVIDENCE PHOTOS ============
  let photoY = (doc as any).lastAutoTable?.finalY + 10 || catY + 60;
  if (photoY > 200) {
    doc.addPage();
    photoY = 20;
  }

  // Find items with photos
  const itemsWithPhotos = allPoints.filter(p => {
    const entry = submission.scores[p.id];
    return entry?.photo;
  });

  if (itemsWithPhotos.length > 0) {
    doc.setFontSize(11);
    doc.setTextColor(22, 160, 133);
    doc.text(isArabic ? 'صور الأدلة' : 'Evidence Photos', 15, photoY);

    let col = 0;
    const cols = 4;
    const photoSize = 38;
    let photoRowY = photoY + 8;

    for (const point of itemsWithPhotos) {
      const entry = submission.scores[point.id];
      if (!entry?.photo) continue;

      try {
        const x = 15 + (col * (photoSize + 8));

        if (photoRowY + photoSize > 270) {
          doc.addPage();
          photoRowY = 20;
          col = 0;
        }

        doc.addImage(entry.photo, 'JPEG', x, photoRowY, photoSize, photoSize * 0.75);

        doc.setFontSize(7);
        doc.setTextColor(255, 255, 255);
        doc.setFillColor(0, 0, 0);
        doc.roundedRect(x, photoRowY + photoSize * 0.75 - 7, 14, 7, 1, 1, 'F');
        doc.text(`Q${point.id}`, x + 2, photoRowY + photoSize * 0.75 - 2);

        col++;
        if (col >= cols) {
          col = 0;
          photoRowY += photoSize * 0.75 + 12;
        }
      } catch (e) {
        console.log('Failed to add photo for question', point.id);
      }
    }

    photoY = col > 0 ? photoRowY + photoSize * 0.75 + 5 : photoRowY;
  }

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

export async function generatePDFBlob(submission: AuditSubmission): Promise<Blob> {
  const doc = await generatePDF(submission);
  return doc.output('blob');
}