'use client';

import { useState, useRef, useEffect } from 'react';
import { auditCategories, getShortlistPoints, getFullIds, AuditPoint, priorities, Priority } from '@/lib/auditData';
import { generatePDFBlob, AuditSubmission } from '@/lib/pdfGenerator';
import { saveAuditRecord, saveActionItem, STORES_LIST } from '@/lib/history';
import { Toaster, toast } from 'sonner';
import { Search, Copy, Check } from 'lucide-react';

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
  { s: 2, l: '✓', c: 'bg-gradient-to-br from-green-500 to-green-700 text-gray-900' },
  { s: 1, l: '△', c: 'bg-gradient-to-br from-yellow-500 to-amber-600 text-gray-900' },
  { s: 0, l: '✗', c: 'bg-gradient-to-br from-red-500 to-red-700 text-gray-900' },
  { s: -1, l: 'N', c: 'bg-gray-300 text-gray-600' },
];

export default function AuditForm() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [showHelp, setShowHelp] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
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

  // Filter questions by search - will be applied after categoriesToShow is defined

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

  // Enhanced calculation with CCP & Priority weighting
  const calc = (ids: number[], categories: typeof auditCategories) => {
    let t = 0, m = 0, ccpPassed = 0, ccpTotal = 0, ccpFailed: number[] = [];
    
    // Priority breakdown
    const priorityScores: Record<Priority, { total: number; max: number; passed: number }> = {
      CCP: { total: 0, max: 0, passed: 0 },
      HIGH: { total: 0, max: 0, passed: 0 },
      STANDARD: { total: 0, max: 0, passed: 0 }
    };
    
    // Category breakdown
    const categoryScores: Record<string, { total: number; max: number }> = {
      safety: { total: 0, max: 0 },
      operations: { total: 0, max: 0 },
      service: { total: 0, max: 0 },
      hygiene: { total: 0, max: 0 },
      storage: { total: 0, max: 0 },
      beverage: { total: 0, max: 0 },
    };
    
    ids.forEach(id => {
      const s = scores[id]?.score;
      // Find the point to check if it's CCP
      let point: AuditPoint | undefined;
      let category = 'service';
      for (const cat of categories) {
        point = cat.points.find(p => p.id === id);
        if (point) {
          category = point.category?.toLowerCase() || 'service';
          break;
        }
      }
      
      const priority = point?.priority || (point?.isCCP ? 'CCP' : 'STANDARD');
      const weight = point?.isCCP && point?.ccpWeight ? point.ccpWeight : 2;
      
      if (s !== undefined && s >= 0) {
        t += s * (weight / 2);
        priorityScores[priority].total += s * (weight / 2);
        
        // Add to category score
        if (categoryScores[category]) {
          categoryScores[category].total += s * (weight / 2);
        }
        
        if (point?.isCCP) {
          ccpTotal += weight;
          if (s === 2) ccpPassed += weight;
          else ccpFailed.push(id);
        }
      }
      m += weight;
      priorityScores[priority].max += weight;
      if (categoryScores[category]) {
        categoryScores[category].max += weight;
      }
      if (s === 2) priorityScores[priority].passed += weight;
    });
    
    return { 
      total: Math.round(t * 10) / 10, 
      max: m, 
      pct: m ? Math.round((t / m) * 100) : 0,
      ccpPassed,
      ccpTotal,
      ccpFailed,
      ccpPct: ccpTotal ? Math.round((ccpPassed / ccpTotal) * 100) : 100,
      priorityScores: {
        CCP: { ...priorityScores.CCP, pct: priorityScores.CCP.max ? Math.round((priorityScores.CCP.total / priorityScores.CCP.max) * 100) : 0 },
        HIGH: { ...priorityScores.HIGH, pct: priorityScores.HIGH.max ? Math.round((priorityScores.HIGH.total / priorityScores.HIGH.max) * 100) : 0 },
        STANDARD: { ...priorityScores.STANDARD, pct: priorityScores.STANDARD.max ? Math.round((priorityScores.STANDARD.total / priorityScores.STANDARD.max) * 100) : 0 }
      },
      categoryScores: Object.fromEntries(
        Object.entries(categoryScores).map(([k, v]) => [k, { ...v, pct: v.max ? Math.round((v.total / v.max) * 100) : 0 }])
      )
    };
  };

  const shortlistIds = getShortlistPoints();
  const fullIds = getFullIds();
  const shortlist = calc(shortlistIds, auditCategories);
  const full = calc(fullIds, auditCategories);
  
  // Use correct calculation based on audit mode
  const currentCalc = auditMode === 'shortlist' ? shortlist : full;
  
  // CCP must pass = no failed CCPs (score < 2)
  const ccpPassed = currentCalc.ccpFailed.length === 0;

  // Pass requires: 90%+ score AND all CCPs passed
  const canSubmit = formData.branchName.trim() !== '' && formData.auditorName.trim() !== '';
  const canPass = currentCalc.pct >= 90 && ccpPassed;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    
    // Check CCP requirement
    if (!ccpPassed) {
      alert(`❌ Cannot pass: Failed ${currentCalc.ccpFailed.length} Critical Control Point(s)\n\nFix CCP failures first before submitting.`);
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
        scores, totalScore: currentCalc.total + full.total, percentage: currentCalc.pct, actionItems,
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
Score: ${currentCalc.pct}% (${currentCalc.total}/${currentCalc.max})

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
              score: `${currentCalc.pct}% (${currentCalc.total}/${currentCalc.max})`,
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
    
    // Save to history
    const failedItems = Object.entries(scores)
      .filter(([_, e]) => e && e.score !== undefined && e.score < 2 && e.score >= 0)
      .map(([id, e]) => {
        const point = getPoint(parseInt(id as string));
        return {
          questionId: parseInt(id as string),
          question: point ? (isArabic ? point.questionAr : point.question) : `Q${id}`,
          branchName: formData.branchName,
          assignedTo: formData.auditorName,
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'pending' as const
        };
      });
    
    // Save failed items as action items
    failedItems.forEach(item => saveActionItem(item));
    
    // Save audit record to history
    const categoryData = categoriesToShow.map(cat => {
      const catIds = cat.points.map(p => p.id);
      const catCalc = calc(catIds, auditCategories);
      return {
        name: isArabic ? cat.nameAr : cat.name,
        score: catCalc.total,
        maxScore: catCalc.max,
        percentage: catCalc.pct
      };
    });
    
    saveAuditRecord({
      branchName: formData.branchName,
      auditorName: formData.auditorName,
      date: formData.date,
      score: currentCalc.total,
      percentage: currentCalc.pct,
      ccpPercentage: currentCalc.ccpPct,
      passed: canPass,
      auditMode: auditMode,
      categories: categoryData,
      actionItems: [] // Action items saved separately via saveActionItem
    });
    
    setSubmitted(true); setIsSubmitting(false);
  };

  const isArabic = lang === 'ar';
  const t = (ar: string, en: string) => isArabic ? ar : en;

  // Get point details helper
  const getPoint = (id: number): AuditPoint | undefined => {
    for (const cat of auditCategories) {
      const p = cat.points.find(p => p.id === id);
      if (p) return p;
    }
    return undefined;
  };
  
  // Get all points sorted by ID - filter to 25 or 50 based on mode
  const allPointsSorted = auditCategories
    .flatMap(cat => cat.points)
    .filter(p => auditMode === 'shortlist' ? p.id <= 25 : p.id > 0)
    .sort((a, b) => a.id - b.id);
  
  // Single category for simple numbering
  const categoriesToShow = [{
    id: 'all',
    name: auditMode === 'shortlist' ? '📋 25 Point Audit' : '📋 50 Point Audit',
    nameAr: auditMode === 'shortlist' ? '📋 تدقيق 25 نقطة' : '📋 تدقيق 50 نقطة',
    priority: 'STANDARD' as Priority,
    points: allPointsSorted
  }];

  // Filter questions by search
  const filteredCategories = showSearch && searchQuery
    ? categoriesToShow.map(cat => ({
        ...cat,
        points: cat.points.filter(p => 
          p.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.questionAr.includes(searchQuery)
        )
      })).filter(cat => cat.points.length > 0)
    : categoriesToShow;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 transition-colors">
      <Toaster position="top-center" richColors />
      {/* Clean Header */}
      <header className="bg-white border-b-2 border-gray-200 shadow-lg">
        <div className="px-3 sm:px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Left: Logo + Title */}
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="w-12 h-12 rounded-xl shadow-md" />
              <div>
                <h1 className="text-xl font-black text-gray-900">Green Cafe</h1>
                <p className="text-xs text-gray-500 font-medium">{t('Branch Audit', 'تدقيق الفروع')}</p>
              </div>
            </div>
            
            {/* Right: Controls */}
            <div className="flex items-center gap-2">
              <button onClick={() => setShowSearch(!showSearch)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600">
                <Search className="w-4 h-4" />
              </button>
              {hasDraft && !submitted && (
                <button onClick={clearDraft} className="px-2 py-1.5 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg text-xs font-bold text-amber-700" title="Clear draft">
                  📝
                </button>
              )}
              <a href="/dashboard" className="px-3 py-1.5 bg-green-500 hover:bg-green-600 rounded-lg text-xs font-bold text-white">
                📊
              </a>
              <select value={auditMode} onChange={(e) => setAuditMode(e.target.value as 'shortlist' | 'full')} className="px-2 py-1.5 bg-gray-100 border border-gray-200 rounded-lg text-xs font-bold text-gray-700">
                <option value="shortlist">{t('25', '25')}</option>
                <option value="full">{t('50', '50')}</option>
              </select>
              <button onClick={() => setLang(isArabic ? 'en' : 'ar')} className="px-2 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold text-gray-700">
                {isArabic ? 'EN' : 'عربي'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Search Bar */}
        {showSearch && (
          <div className="px-3 pb-3">
            <input type="text" placeholder={t('Search...', 'بحث...')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" autoFocus />
          </div>
        )}
        
        {/* Score Display */}
        <div className="px-3 pb-3">
          <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3 border border-gray-200">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-500">{t('Score', 'النتيجة')}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${ccpPassed && currentCalc.pct >= 90 ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
                {currentCalc.pct >= 90 && ccpPassed ? 'PASS ✓' : 'PENDING'}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-black text-gray-900">{currentCalc.pct}%</div>
                <div className="text-xs text-gray-600">{currentCalc.total}/{currentCalc.max}</div>
              </div>
              {/* Progress bar */}
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full ${currentCalc.pct >= 90 ? 'bg-green-500' : currentCalc.pct >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${currentCalc.pct}%` }} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Category Breakdown - Big 3D Circles sized by question count */}
        <div className="px-3 pb-3">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {[
              { id: 'safety', label: 'السلامة', size: 'w-14 h-14', font: 'text-sm' },
              { id: 'operations', label: 'العمليات', size: 'w-16 h-16', font: 'text-lg' },
              { id: 'service', label: 'الخدمة', size: 'w-20 h-20', font: 'text-xl' },
              { id: 'hygiene', label: 'النظافة', size: 'w-14 h-14', font: 'text-sm' },
            ].map(cat => {
              const catData = (currentCalc.categoryScores as Record<string, {total: number, max: number, pct: number}>)?.[cat.id] || { total: 0, max: 0, pct: 0 };
              const pct = catData?.pct || 0;
              const pointCount = catData?.max || 0;
              const isPass = pct >= 90;
              const isWarn = pct >= 70 && pct < 90;
              return (
                <div key={cat.id} className="flex flex-col items-center">
                  <div className={`relative ${cat.size} drop-shadow-xl`}>
                    <svg className={`${cat.size} transform -rotate-90`} viewBox="0 0 36 36">
                      <defs>
                        <linearGradient id={`grad-${cat.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor={isPass ? '#22c55e' : isWarn ? '#eab308' : '#ef4444'} />
                          <stop offset="100%" stopColor={isPass ? '#16a34a' : isWarn ? '#ca8a04' : '#dc2626'} />
                        </linearGradient>
                      </defs>
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={`url(#grad-${cat.id})`} strokeWidth="3.5" strokeDasharray={`${pct}, 100`} strokeLinecap="round" className="transition-all duration-700" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`${cat.font} font-black ${isPass ? 'text-green-600' : isWarn ? 'text-yellow-600' : 'text-red-600'}`}>{pct}%</span>
                    </div>
                  </div>
                  <div className="text-center mt-1">
                    <span className="text-xs font-bold text-gray-600 block">{cat.label}</span>
                    <span className="text-xs text-gray-500">{pointCount}pts</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </header>

      <main className="px-3 sm:px-4 py-4 sm:py-5 pb-28">
        {submitted ? (
          <div className="bg-white rounded-3xl shadow-xl p-10 text-center border border-gray-100">
            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
              <span className="text-5xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('تم!', 'Done!')}</h2>
            <p className="text-gray-500 mb-5">{t('تم تحميل PDF', 'PDF downloaded')}</p>
            <div className={`text-4xl font-extrabold ${currentCalc.pct >= 90 ? 'text-green-600' : 'text-yellow-600'}`}>
              {currentCalc.pct}%
            </div>
          </div>
        ) : (
          <>
            {/* Branch Info - Mobile Responsive */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-5 mb-4 sm:mb-5 border border-gray-100/80">
              <h2 className="text-base sm:text-sm font-bold text-gray-800 mb-3 sm:mb-3 flex items-center gap-2">
                <span className="w-1.5 h-5 sm:h-6 bg-green-600 rounded-full inline-block"></span>
                {t('معلومات التفتيش', 'Inspection Details')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">{t('الفرع', 'Branch')} *</label>
                  <input 
                    list="stores-list" 
                    type="text" 
                    value={formData.branchName} 
                    onChange={e => setFormData({...formData, branchName: e.target.value})}
                    className="w-full border-2 border-gray-200 rounded-xl px-3.5 py-3 text-sm font-semibold text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all outline-none" 
                    placeholder={t('Select or type branch', 'اختر أو اكتب الفرع')}
                  />
                  <datalist id="stores-list">
                    {STORES_LIST.map(store => (
                      <option key={store} value={store} />
                    ))}
                  </datalist>
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
                <p className="text-3xl sm:text-4xl font-black text-gray-900">{currentCalc.total}<span className="text-gray-300 text-xl sm:text-2xl">/{currentCalc.max}</span></p>
              </div>
              <div className={`relative px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-extrabold text-xl sm:text-2xl shadow-lg ${currentCalc.pct >= 90 ? 'bg-gradient-to-r from-green-600 to-emerald-600 shadow-green-500/30' : currentCalc.pct >= 70 ? 'bg-gradient-to-r from-yellow-500 to-amber-500 shadow-yellow-500/30' : 'bg-gradient-to-r from-red-600 to-rose-600 shadow-red-500/30'}`}>
                {currentCalc.pct}%
              </div>
            </div>

            {auditMode === 'shortlist' && (
              <div className={`rounded-2xl p-4 mb-5 flex flex-col gap-2 shadow-sm ${currentCalc.pct >= 90 && ccpPassed ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200' : 'bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200'}`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{currentCalc.pct >= 90 && ccpPassed ? '🎉' : '⚠️'}</span>
                  <span className={`font-bold text-sm ${currentCalc.pct >= 90 && ccpPassed ? 'text-green-700' : 'text-red-700'}`}>
                    {currentCalc.pct >= 90 && ccpPassed ? t('ممتاز! تم اجتياز التفتيش', 'Excellent! Audit Passed') : t('تحتاج 90% للاجتياز', 'Need 90% to Pass')}
                  </span>
                </div>
                {/* CCP Status */}
                <div className="flex items-center gap-2 text-xs">
                  <span className={`px-2 py-1 rounded font-bold ${ccpPassed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    CCP: {currentCalc.ccpPct}%
                  </span>
                  {!ccpPassed && (
                    <span className="text-red-600">
                      {t('فشل', 'Failed')}: Q{currentCalc.ccpFailed.join(', Q')}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Legend - Enhanced */}
            <div className="flex gap-2 mb-5 text-xs font-bold flex-wrap justify-center sm:justify-start">
              {scoreButtons.map(b => (
                <span key={b.s} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl shadow-md ${b.c}`}>
                  <span className="text-sm">{b.l}</span>
                  <span className="text-[10px] opacity-80">{b.s === 2 ? 'Full' : b.s === 1 ? 'Partial' : b.s === 0 ? 'Fail' : 'N/A'}</span>
                </span>
              ))}
            </div>

            {/* Categories with Icons */}
            {filteredCategories.map(cat => {
              const catIds = cat.points.map(p => p.id);
              const catCalc = calc(catIds, auditCategories);
              
              const catConfig: Record<string, { icon: string; gradient: string; light: string }> = {
                'food-safety': { icon: '🍎', gradient: 'from-red-600 to-red-700', light: 'bg-red-50' },
                'customer-service': { icon: '😊', gradient: 'from-blue-600 to-blue-700', light: 'bg-blue-50' },
                'customer': { icon: '😊', gradient: 'from-blue-600 to-blue-700', light: 'bg-blue-50' },
                'beverage-quality': { icon: '☕', gradient: 'from-purple-600 to-purple-700', light: 'bg-purple-50' },
                'beverage': { icon: '☕', gradient: 'from-purple-600 to-purple-700', light: 'bg-purple-50' },
                'operations': { icon: '⚙️', gradient: 'from-orange-600 to-orange-700', light: 'bg-orange-50' },
                'equipment': { icon: '🔧', gradient: 'from-teal-600 to-teal-700', light: 'bg-teal-50' },
                'food-safety-ext': { icon: '🍎', gradient: 'from-red-600 to-red-700', light: 'bg-red-50' },
                'customer-ext': { icon: '😊', gradient: 'from-blue-600 to-blue-700', light: 'bg-blue-50' },
                'beverage-ext': { icon: '☕', gradient: 'from-purple-600 to-purple-700', light: 'bg-purple-50' },
                'operations-ext': { icon: '⚙️', gradient: 'from-orange-600 to-orange-700', light: 'bg-orange-50' },
              };
              const config = catConfig[cat.id] || { icon: '📋', gradient: 'from-green-700 to-green-800', light: 'bg-green-50' };
              
              return (
                <div key={cat.id} className="bg-white rounded-2xl shadow-lg mb-5 overflow-hidden border border-gray-100">
                  {/* Category Header with Progress */}
                  <div className={`bg-gradient-to-r ${config.gradient} px-4 py-3`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{config.icon}</span>
                        <div>
                          <h3 className="font-bold text-gray-900 text-base">{isArabic ? cat.nameAr : cat.name}</h3>
                          <p className="text-gray-900/70 text-xs">{cat.points.length} questions</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-gray-900">{catCalc.pct}%</div>
                        <div className="h-1.5 w-20 bg-white/30 rounded-full overflow-hidden">
                          <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${catCalc.pct}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5 space-y-5">
                    {cat.points.map(p => (
                      <div key={p.id} className={`border-2 rounded-2xl p-5 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 ${p.isCCP ? 'border-red-300 bg-red-50/50' : 'border-gray-100 hover:border-green-300'}`}>
                        {/* Question Header with Big Number */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-gray-900 text-lg shadow-md ${p.isCCP ? 'bg-gradient-to-br from-red-500 to-red-700' : 'bg-gradient-to-br from-green-500 to-green-700'}`}>
                              {p.id}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                {p.isCCP && (
                                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-bold flex items-center gap-1">
                                    🔴 CCP <span className="text-red-500">(×{p.ccpWeight || 3})</span>
                                  </span>
                                )}
                                {p.requiresTemp && (
                                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold flex items-center gap-1">
                                    🌡️ {p.tempMin}-{p.tempMax}°C
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 font-medium uppercase tracking-wider mt-1">
                                {isArabic ? p.categoryAr : p.category}
                              </p>
                            </div>
                          </div>
                          {/* Score Indicator */}
                          {scores[p.id]?.score !== undefined && (
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-gray-900 shadow-md ${
                              scores[p.id]?.score === 2 ? 'bg-gradient-to-br from-green-500 to-green-700' :
                              scores[p.id]?.score === 1 ? 'bg-gradient-to-br from-yellow-500 to-amber-600' :
                              scores[p.id]?.score === 0 ? 'bg-gradient-to-br from-red-500 to-red-700' :
                              'bg-gray-300'
                            }`}>
                              {scores[p.id]?.score === 2 ? '✓' : scores[p.id]?.score === 1 ? '△' : scores[p.id]?.score === 0 ? '✗' : '?'}
                            </div>
                          )}
                        </div>
                        
                        {/* Question Text */}
                        <p className="text-sm font-semibold text-gray-800 leading-relaxed mb-3">
                          {isArabic ? p.questionAr : p.question}
                        </p>
                        
                        {/* CCP Critical Reason - shown as subtitle */}
                        {p.isCCP && p.criticalReason && (
                          <div className="text-xs text-gray-600 bg-red-50 rounded-lg p-2 mb-2 border-l-2 border-red-400">
                            <span className="font-bold text-red-600">⚠️ {t('Critical', 'حرج')}:</span> {p.criticalReason}
                          </div>
                        )}
                        
                        {/* Score Buttons - Compact */}
                        <div className="flex items-center gap-1.5 mb-3">
                          {scoreButtons.map(b => (
                            <button 
                              key={b.s} 
                              onClick={() => handleScore(p.id, b.s)}
                              className={`w-9 h-9 rounded-lg font-bold text-xs transition-all duration-200 ${
                                scores[p.id]?.score === b.s 
                                  ? `${b.c} shadow-lg scale-105 ring-2 ring-offset-1 ring-current` 
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
                              }`}
                            >
                              {b.l}
                            </button>
                          ))}
                          
                          {/* Photo Button with Preview */}
                          <div className="relative">
                            <input type="file" accept="image/*" ref={el => { if (el) fileInputRefs.current[p.id] = el }}
                              onChange={e => e.target.files?.[0] && handlePhoto(p.id, e.target.files[0])} className="hidden" id={`ph${p.id}`} />
                            <label htmlFor={`ph${p.id}`} className={`w-12 h-12 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 ${
                              scores[p.id]?.photo ? 'bg-gradient-to-br from-green-500 to-green-700 text-gray-900 shadow-lg' : 'bg-gray-100 hover:bg-gray-200'
                            }`}>
                              {scores[p.id]?.photo ? (
                                <div className="w-8 h-8 rounded-lg overflow-hidden">
                                  <img src={scores[p.id]?.photo} alt="" className="w-full h-full object-cover" />
                                </div>
                              ) : '📷'}
                            </label>
                          </div>
                        </div>
                        
                        {/* Temperature Input for CCP */}
                        {p.requiresTemp && (
                          <div className="flex items-center gap-2 mb-3 p-2 bg-blue-50 rounded-xl border border-blue-200">
                            <span className="text-sm">🌡️</span>
                            <input type="number" 
                              placeholder={`${p.tempMin}-${p.tempMax}°C`} 
                              value={scores[p.id]?.temperature ?? ''} 
                              onChange={e => setScores(prev => ({ ...prev, [p.id]: { ...prev[p.id], temperature: e.target.value } }))}
                              className="flex-1 bg-white border-2 border-blue-200 rounded-lg px-3 py-2 text-sm font-bold text-blue-700 focus:border-blue-400 outline-none" />
                          </div>
                        )}
                        
                        {/* Notes Field - Expandable */}
                        <div className="relative">
                          <textarea 
                            placeholder={t('Add notes...', 'أضف ملاحظات...')} 
                            value={scores[p.id]?.note ?? ''} 
                            onChange={e => handleNote(p.id, e.target.value)}
                            rows={2}
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 py-2 text-sm text-gray-700 focus:border-green-400 outline-none resize-none transition-all"
                          />
                          {scores[p.id]?.note && (
                            <span className="absolute bottom-2 right-2 text-xs text-gray-600">
                              {scores[p.id]?.note.length}/200
                            </span>
                          )}
                        </div>
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
                    className="w-full py-5 rounded-2xl font-extrabold text-gray-900 bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-800 hover:to-emerald-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all active:scale-[0.98]">
                    {isSubmitting ? '...' : canPass ? t('تحميل PDF + خطة العمل', 'Download PDF + Plan') : !ccpPassed ? t('فشل CCP أولاً', 'Fix CCP First') : t('تحتاج 90%', 'Need 90%')}
                  </button>
                  {currentCalc.max > 0 && currentCalc.pct < 90 && (
                    <button onClick={() => setAuditMode('full')} className="w-full py-4 rounded-2xl font-bold text-gray-900 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md hover:shadow-lg transition-all">
                      {t('أكمل 50 سؤال ←', 'Complete 50 Q ←')}
                    </button>
                  )}
                </>
              ) : (
                <button onClick={handleSubmit} disabled={!canSubmit || isSubmitting}
                  className="w-full py-5 rounded-2xl font-extrabold text-gray-900 bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-800 hover:to-emerald-800 disabled:from-gray-300 disabled:to-gray-400 shadow-lg hover:shadow-xl transition-all active:scale-[0.98]">
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
              <span className="text-gray-900 font-bold">G</span>
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
