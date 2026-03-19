'use client';

import { useState, useRef, useEffect } from 'react';
import { auditCategories, getShortlistPoints, AuditPoint } from '@/lib/auditData';
import { generatePDFBlob, AuditSubmission } from '@/lib/pdfGenerator';

interface ScoreEntry { score: number; note: string; photo?: string; temperature?: string; }

// Auto-save key
const STORAGE_KEY = 'green-cafe-audit-draft';

interface SavedDraft {
  formData: { branchName: string; auditorName: string; date: string };
  scores: Record<number, ScoreEntry>;
  auditMode: 'shortlist' | 'full';
  lang: 'en' | 'ar';
  savedAt: number;
}

const scoreButtons = [
  { s: 2, l: '✓', c: 'bg-green-600 text-white' },
  { s: 1, l: '△', c: 'bg-yellow-500 text-white' },
  { s: 0, l: '✗', c: 'bg-red-600 text-white' },
  { s: -1, l: 'N/A', c: 'bg-gray-300 text-gray-700' },
];

export default function AuditForm() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [showHelp, setShowHelp] = useState(true);
  const [auditMode, setAuditMode] = useState<'shortlist' | 'full'>('shortlist');
  const [formData, setFormData] = useState({ branchName: '', auditorName: '', date: new Date().toISOString().split('T')[0] });
  const [scores, setScores] = useState<Record<number, ScoreEntry>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const fileInputRefs = useRef<Record<number, HTMLInputElement>>({});

  // Auto-save: Load draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const draft: SavedDraft = JSON.parse(saved);
        // Only load if less than 7 days old
        if (Date.now() - draft.savedAt < 7 * 24 * 60 * 60 * 1000) {
          setFormData(draft.formData);
          setScores(draft.scores);
          setAuditMode(draft.auditMode);
          setLang(draft.lang);
          setHasDraft(true);
        }
      }
    } catch (e) { console.log('No draft found'); }
  }, []);

  // Auto-save: Save on changes
  useEffect(() => {
    if (!submitted && (formData.branchName || formData.auditorName || Object.keys(scores).length > 0)) {
      const draft: SavedDraft = { formData, scores, auditMode, lang, savedAt: Date.now() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    }
  }, [formData, scores, auditMode, lang, submitted]);

  // Clear draft after successful submission
  const clearDraft = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHasDraft(false);
  };

  const handleScore = (id: number, score: number) => setScores(p => ({ ...p, [id]: { ...p[id], score } }));
  const handleNote = (id: number, note: string) => setScores(p => ({ ...p, [id]: { ...p[id], note } }));
  const handlePhoto = (id: number, file: File) => {
    const r = new FileReader();
    r.onloadend = () => setScores(p => ({ ...p, [id]: { ...p[id], photo: r.result as string } }));
    r.readAsDataURL(file);
  };

  // Enhanced calculation with CCP weighting
  const calc = (ids: number[], categories: typeof auditCategories) => {
    let t = 0, m = 0, ccpPassed = 0, ccpTotal = 0, ccpFailed: number[] = [];
    
    ids.forEach(id => {
      const s = scores[id]?.score;
      // Find the point to check if it's CCP
      let point: AuditPoint | undefined;
      for (const cat of categories) {
        point = cat.points.find(p => p.id === id);
        if (point) break;
      }
      
      const weight = point?.isCCP && point?.ccpWeight ? point.ccpWeight : 2;
      
      if (s !== undefined && s >= 0) {
        t += s * (weight / 2); // Scale score by weight ratio
        if (point?.isCCP) {
          ccpTotal += weight;
          if (s === 2) ccpPassed += weight;
          else ccpFailed.push(id);
        }
      }
      m += weight;
    });
    
    return { 
      total: Math.round(t * 10) / 10, 
      max: m, 
      pct: m ? Math.round((t / m) * 100) : 0,
      ccpPassed,
      ccpTotal,
      ccpFailed,
      ccpPct: ccpTotal ? Math.round((ccpPassed / ccpTotal) * 100) : 100
    };
  };

  const shortlist = calc(getShortlistPoints(), auditCategories);
  const fullIds = Array.from({length: 50}, (_, i) => i + 1);
  const full = calc(fullIds, auditCategories);
  
  // CCP must pass = no failed CCPs (score < 2)
  const ccpPassed = shortlist.ccpFailed.length === 0;

  // Pass requires: 90%+ score AND all CCPs passed
  const canSubmit = formData.branchName.trim() !== '' && formData.auditorName.trim() !== '';
  const canPass = shortlist.pct >= 90 && ccpPassed;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    
    // Check CCP requirement
    if (!ccpPassed) {
      alert(`❌ Cannot pass: Failed ${shortlist.ccpFailed.length} Critical Control Point(s)\n\nFix CCP failures first before submitting.`);
      return;
    }
    
    setIsSubmitting(true);
    clearDraft(); // Clear saved draft after submit
    
    const actionItems = Object.entries(scores)
      .filter(([_, e]) => e && e.score !== undefined && e.score < 2 && e.score !== -1)
      .map(([id, e]) => ({ point: `Q${id}`, action: e?.note || 'Needs improvement', responsible: formData.auditorName, deadline: formData.date }));

    // Generate PDF
    let pdfBase64 = '';
    let blob: Blob;
    
    try {
      const submission: AuditSubmission = {
        id: Date.now().toString(), branchName: formData.branchName, branchNameAr: formData.branchName,
        auditorName: formData.auditorName, auditorNameAr: formData.auditorName, date: formData.date,
        scores, totalScore: shortlist.total + full.total, percentage: shortlist.pct, actionItems,
        emailList: [], lang: lang
      };
      blob = generatePDFBlob(submission);
      
      // Convert to base64
      const reader = new FileReader();
      pdfBase64 = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      
      // Download PDF locally
      const a = document.createElement('a'); 
      a.href = URL.createObjectURL(blob);
      a.download = `Green_Audit_${formData.branchName.replace(/[^a-zA-Z0-9]/g, '_')}_${formData.date}.pdf`; 
      a.click();
    } catch (pdfError: any) {
      console.error('PDF Error:', pdfError);
      // Continue without PDF if it fails
    }
    
    // Text report (fallback if PDF fails)
    const actionText = actionItems.length > 0 
      ? actionItems.map((a: any) => `• ${a.point}: ${a.action}`).join('\n')
      : '✅ All items passed!';
    
    const reportText = `Green Cafe Audit Report

Branch: ${formData.branchName}
Auditor: ${formData.auditorName}
Date: ${formData.date}
Score: ${shortlist.pct}% (${shortlist.total}/${shortlist.max})

Action Items:
${actionText}`;

    // Send via API - always send to default email
    const emails = ['walid.sobhy@mmgunited.com'];
      
      for (const email of emails) {
        try {
          const response = await fetch('/api/send-audit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              branchName: formData.branchName,
              auditorName: formData.auditorName,
              date: formData.date,
              score: `${shortlist.pct}% (${shortlist.total}/${shortlist.max})`,
              actionItems: actionText,
              reportText: reportText,
              pdfBase64: pdfBase64 || undefined
            })
          });
          
          if (response.ok) {
            console.log('Email sent to:', email);
          } else {
            console.log('Email failed');
          }
        } catch (e) { 
          console.log('Email error:', e);
        }
      }
      alert(`✅ Report sent!`);
    
    setSubmitted(true); setIsSubmitting(false);
  };

  const isArabic = lang === 'ar';
  const t = (ar: string, en: string) => isArabic ? ar : en;
  // Shortlist = first 25 questions (ids 1-25)
  // Full = all 50 questions
  const shortlistIds = Array.from({length: 25}, (_, i) => i + 1);

  // Get point details helper
  const getPoint = (id: number): AuditPoint | undefined => {
    for (const cat of auditCategories) {
      const p = cat.points.find(p => p.id === id);
      if (p) return p;
    }
    return undefined;
  };
  
  const categoriesToShow = auditMode === 'shortlist'
    ? auditCategories.map(cat => ({
        ...cat,
        points: cat.points.filter(p => shortlistIds.includes(p.id))
      })).filter(cat => cat.points.length > 0)
    : auditCategories;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* White Header - Clean & Bold */}
      <header className="bg-white border-b-2 border-gray-200 shadow-lg">
        <div className="px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            {/* Logo & Title */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <img src="/logo.png" alt="Logo" className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl shadow-md" />
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-black text-gray-900 tracking-wide">Green Cafe</h1>
                <p className="text-xs sm:text-sm text-gray-500 font-semibold">{t('Branch Audit', 'تدقيق الفروع')}</p>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <select 
                value={auditMode} 
                onChange={(e) => setAuditMode(e.target.value as 'shortlist' | 'full')}
                className="px-2 sm:px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer"
              >
                <option value="shortlist" className="text-gray-800">{t('25', '25')}</option>
                <option value="full" className="text-gray-800">{t('50', '50')}</option>
              </select>
              <button onClick={() => setLang(isArabic ? 'en' : 'ar')} className="px-2 sm:px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold text-gray-700 transition-colors">
                {isArabic ? 'EN' : 'عربي'}
              </button>
              <button onClick={() => setShowHelp(!showHelp)} className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center text-sm font-bold text-gray-600 transition-colors">?</button>
            </div>
          </div>
        </div>
        
        {/* Score Bar */}
        <div className="px-3 sm:px-4 pb-3 sm:pb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('Score', 'النتيجة')}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${ccpPassed && shortlist.pct >= 90 ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
                {shortlist.pct >= 90 && ccpPassed ? t('PASS', 'ناجح') : t('PENDING', 'قيد')}
              </span>
            </div>
            <span className="text-2xl sm:text-3xl font-black text-gray-900">{shortlist.pct}%</span>
          </div>
          
          {/* Progress Bar with Glow */}
          <div className="h-2.5 sm:h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
            <div 
              className={`h-full transition-all duration-500 rounded-full ${shortlist.pct >= 90 && ccpPassed ? 'bg-green-500 shadow-lg shadow-green-500/50' : shortlist.pct >= 70 ? 'bg-yellow-500 shadow-lg shadow-yellow-500/50' : 'bg-red-500 shadow-lg shadow-red-500/50'}`} 
              style={{ width: `${shortlist.pct}%` }} 
            />
          </div>
          
          {/* Quick Stats */}
          <div className="flex justify-between mt-2 text-xs font-bold text-gray-500">
            <span>{shortlist.total}/{shortlist.max} pts</span>
            <span>CCP: {shortlist.ccpPct}%</span>
          </div>
        </div>
      </header>

      {showHelp && (
        <div className="px-3 sm:px-4 pt-3 sm:pt-4">
          <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
            {[
              { n: '1', t: t('Fill', 'املأ'), c: 'bg-blue-500 shadow-lg shadow-blue-500/30' },
              { n: '2', t: t('Score', 'نتيجة'), c: 'bg-purple-500 shadow-lg shadow-purple-500/30' },
              { n: '3', t: '90%+ CCP', c: 'bg-green-500 shadow-lg shadow-green-500/30' },
              { n: '4', t: 'PDF', c: 'bg-orange-500 shadow-lg shadow-orange-500/30' },
            ].map((step, i) => (
              <div key={i} className="flex items-center">
                <span className={`${step.c} text-white px-2 sm:px-3 py-1.5 rounded-lg text-xs font-bold`}>
                  {step.n}. {step.t}
                </span>
                {i < 3 && <span className="text-gray-400 mx-1">→</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Draft Restore Banner */}
      {hasDraft && !submitted && (
        <div className="px-3 sm:px-4 pt-3">
          <div className="bg-amber-100 border-2 border-amber-300 rounded-xl sm:rounded-2xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">📝</span>
              <span className="text-sm font-bold text-amber-800">{t('Draft Saved', 'مسودة محفوظة')}</span>
            </div>
            <button onClick={clearDraft} className="text-xs font-bold text-amber-600 hover:text-amber-800 px-2 py-1">
              {t('Clear', 'مسح')}
            </button>
          </div>
        </div>
      )}

      <main className="px-3 sm:px-4 py-4 sm:py-5 pb-28">
        {submitted ? (
          <div className="bg-white rounded-3xl shadow-xl p-10 text-center border border-gray-100">
            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
              <span className="text-5xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('تم!', 'Done!')}</h2>
            <p className="text-gray-500 mb-5">{t('تم تحميل PDF', 'PDF downloaded')}</p>
            <div className={`text-4xl font-extrabold ${shortlist.pct >= 90 ? 'text-green-600' : 'text-yellow-600'}`}>
              {shortlist.pct}%
            </div>
          </div>
        ) : (
          <>
            {/* Branch Info - Mobile Responsive */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-5 mb-4 sm:mb-5 border border-gray-100/80">
              <h3 className="text-base sm:text-sm font-bold text-gray-800 mb-3 sm:mb-3 flex items-center gap-2">
                <span className="w-1.5 h-5 sm:h-6 bg-green-600 rounded-full inline-block"></span>
                {t('معلومات التفتيش', 'Inspection Details')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">{t('الفرع', 'Branch')} *</label>
                  <input type="text" value={formData.branchName} onChange={e => setFormData({...formData, branchName: e.target.value})}
                    className="w-full border-2 border-gray-200 rounded-xl px-3.5 py-3 text-sm font-semibold text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all outline-none" placeholder={t('Cairo - Egypt', 'القاهرة - مصر')} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">{t('المدقق', 'Auditor')} *</label>
                  <input type="text" value={formData.auditorName} onChange={e => setFormData({...formData, auditorName: e.target.value})}
                    className="w-full border-2 border-gray-200 rounded-xl px-3.5 py-3 text-sm font-semibold text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all outline-none" placeholder={t('Ahmed', 'أحمد')} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">{t('التاريخ', 'Date')}</label>
                  <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full border-2 border-gray-200 rounded-xl px-3.5 py-3 text-sm font-semibold text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all outline-none" />
                </div>
              </div>
            </div>

            {/* Score Card with Glow */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 mb-4 sm:mb-5 flex justify-between items-center border border-gray-100/80 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5"></div>
              <div className="relative">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t('النتيجة', 'Score')}</p>
                <p className="text-3xl sm:text-4xl font-black text-gray-900">{shortlist.total}<span className="text-gray-300 text-xl sm:text-2xl">/{shortlist.max}</span></p>
              </div>
              <div className={`relative px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-extrabold text-xl sm:text-2xl shadow-lg ${shortlist.pct >= 90 ? 'bg-gradient-to-r from-green-600 to-emerald-600 shadow-green-500/30' : shortlist.pct >= 70 ? 'bg-gradient-to-r from-yellow-500 to-amber-500 shadow-yellow-500/30' : 'bg-gradient-to-r from-red-600 to-rose-600 shadow-red-500/30'}`}>
                {shortlist.pct}%
              </div>
            </div>

            {auditMode === 'shortlist' && (
              <div className={`rounded-2xl p-4 mb-5 flex flex-col gap-2 shadow-sm ${shortlist.pct >= 90 && ccpPassed ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200' : 'bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200'}`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{shortlist.pct >= 90 && ccpPassed ? '🎉' : '⚠️'}</span>
                  <span className={`font-bold text-sm ${shortlist.pct >= 90 && ccpPassed ? 'text-green-700' : 'text-red-700'}`}>
                    {shortlist.pct >= 90 && ccpPassed ? t('ممتاز! تم اجتياز التفتيش', 'Excellent! Audit Passed') : t('تحتاج 90% للاجتياز', 'Need 90% to Pass')}
                  </span>
                </div>
                {/* CCP Status */}
                <div className="flex items-center gap-2 text-xs">
                  <span className={`px-2 py-1 rounded font-bold ${ccpPassed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    CCP: {shortlist.ccpPct}%
                  </span>
                  {!ccpPassed && (
                    <span className="text-red-600">
                      {t('فشل', 'Failed')}: Q{shortlist.ccpFailed.join(', Q')}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Legend - Mobile Responsive */}
            <div className="flex gap-2 mb-4 sm:mb-5 text-xs font-bold flex-wrap justify-center sm:justify-start">
              {scoreButtons.map(b => (
                <span key={b.s} className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg shadow-sm ${b.c}`}>
                  <b>{b.l}</b>
                </span>
              ))}
            </div>

            {/* Categories */}
            {categoriesToShow.map(cat => {
              const catIds = cat.points.map(p => p.id);
              const catCalc = calc(catIds, auditCategories);
              
              const catColors: Record<string, string> = {
                'food-safety': 'from-red-600 to-red-700',
                'customer': 'from-blue-600 to-blue-700', 
                'customer-service': 'from-blue-600 to-blue-700',
                'beverage': 'from-purple-600 to-purple-700',
                'beverage-quality': 'from-purple-600 to-purple-700',
                'operations': 'from-orange-600 to-orange-700',
                'equipment': 'from-teal-600 to-teal-700',
                'leadership': 'from-indigo-600 to-indigo-700',
              };
              const colorClass = catColors[cat.id] || 'from-green-700 to-green-800';
              
              return (
                <div key={cat.id} className="bg-white rounded-xl sm:rounded-2xl shadow-md mb-4 sm:mb-5 overflow-hidden border border-gray-100/80">
                  <div className={`bg-gradient-to-r ${colorClass} px-3 sm:px-5 py-3 sm:py-4 flex justify-between items-center`}>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm sm:text-base">{isArabic ? cat.nameAr : cat.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white/80 text-xs font-medium">{cat.points.length} {t('Q', 'سؤال')}</span>
                      <span className="bg-white/20 px-2 py-0.5 rounded text-white text-xs font-bold">{catCalc.pct}%</span>
                    </div>
                  </div>
                  
                  <div className="p-3 sm:p-4 space-y-3">
                    {cat.points.map(p => (
                      <div key={p.id} className={`border-2 rounded-xl p-4 hover:shadow-sm transition-all ${p.isCCP ? 'border-red-300 bg-red-50' : 'border-gray-100 hover:border-green-200'}`}>
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className={`text-white font-extrabold text-xs px-2 py-1 rounded-lg shadow-sm ${p.isCCP ? 'bg-red-600' : 'bg-green-600'}`}>#{p.id}</span>
                          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{isArabic ? p.categoryAr : p.category}</span>
                          {p.isCCP && (
                            <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                              🔴 CCP
                              <span className="font-normal text-red-600">(×{p.ccpWeight || 3})</span>
                            </span>
                          )}
                          {p.requiresTemp && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">🌡️ {p.tempMin}-{p.tempMax}°C</span>}
                        </div>
                        <p className="text-sm font-medium text-gray-800 mb-2 leading-relaxed">{isArabic ? p.questionAr : p.question}</p>
                        
                        {/* CCP Critical Reason - Only show for CCP questions */}
                        {p.isCCP && p.criticalReason && (
                          <div className="text-xs text-gray-600 bg-red-50 rounded-lg p-2 mb-2 border-l-2 border-red-400">
                            <span className="font-semibold text-red-600">⚠️ {t('Why Critical', 'لماذا حرج')}:</span> {p.criticalReason}
                          </div>
                        )}
                        <div className="flex gap-1.5">
                          {scoreButtons.map(b => (
                            <button key={b.s} onClick={() => handleScore(p.id, b.s)}
                              className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${scores[p.id]?.score === b.s ? b.c + ' shadow-lg scale-110' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                              {b.l}
                            </button>
                          ))}
                          <input type="file" accept="image/*" ref={el => { if (el) fileInputRefs.current[p.id] = el }}
                            onChange={e => e.target.files?.[0] && handlePhoto(p.id, e.target.files[0])} className="hidden" id={`ph${p.id}`} />
                          <label htmlFor={`ph${p.id}`} className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm cursor-pointer transition-all ${scores[p.id]?.photo ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-100 hover:bg-gray-200'}`}>📷</label>
                        </div>
                        {/* Temperature input for CCP questions */}
                        {p.requiresTemp && (
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs font-bold text-blue-600">🌡️ Temp:</span>
                            <input type="number" placeholder={p.tempMin ? `${p.tempMin}-${p.tempMax}°C` : '°C'} 
                              value={scores[p.id]?.temperature ?? ''} 
                              onChange={e => setScores(prev => ({ ...prev, [p.id]: { ...prev[p.id], temperature: e.target.value } }))}
                              className="flex-1 border-2 border-blue-200 rounded-lg px-2 py-1 text-xs font-bold text-blue-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none" />
                          </div>
                        )}
                        <input type="text" placeholder={t('ملاحظات', 'Notes')} value={scores[p.id]?.note ?? ''} onChange={e => handleNote(p.id, e.target.value)}
                          className="w-full mt-3 border-2 border-gray-100 rounded-xl px-3 py-2 text-xs font-medium text-gray-900 focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all outline-none" />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Actions */}
            <div className="space-y-3 pt-3">
              {auditMode === 'shortlist' ? (
                <>
                  <button onClick={handleSubmit} disabled={!canSubmit || isSubmitting || !canPass}
                    className="w-full py-5 rounded-2xl font-extrabold text-white bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-800 hover:to-emerald-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all active:scale-[0.98]">
                    {isSubmitting ? '...' : canPass ? t('تحميل PDF + خطة العمل', 'Download PDF + Plan') : !ccpPassed ? t('فشل CCP أولاً', 'Fix CCP First') : t('تحتاج 90%', 'Need 90%')}
                  </button>
                  {shortlist.max > 0 && shortlist.pct < 90 && (
                    <button onClick={() => setAuditMode('full')} className="w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md hover:shadow-lg transition-all">
                      {t('أكمل 50 سؤال ←', 'Complete 50 Q ←')}
                    </button>
                  )}
                </>
              ) : (
                <button onClick={handleSubmit} disabled={!canSubmit || isSubmitting}
                  className="w-full py-5 rounded-2xl font-extrabold text-white bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-800 hover:to-emerald-800 disabled:from-gray-300 disabled:to-gray-400 shadow-lg hover:shadow-xl transition-all active:scale-[0.98]">
                  {isSubmitting ? '...' : t('تحميل PDF + خطة العمل', 'Download PDF + Plan')}
                </button>
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 sm:py-6 text-center shadow-sm">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">G</span>
            </div>
            <span className="text-sm sm:text-base font-bold text-gray-700">Green Cafe Egypt</span>
          </div>
          <div className="border-t border-gray-100 pt-2 sm:pt-3 mt-2 sm:mt-3">
            <p className="text-xs text-gray-400">© 2026 {t('All Rights Reserved', 'جميع الحقوق محفوظة')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
