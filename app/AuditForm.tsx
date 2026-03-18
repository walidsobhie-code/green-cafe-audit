'use client';

import { useState, useRef } from 'react';
import { auditCategories, shortlistIds } from '@/lib/auditData';
import { generatePDFBlob, AuditSubmission } from '@/lib/pdfGenerator';
import emailjs from 'emailjs-com';

interface ScoreEntry { score: number; note: string; photo?: string; }

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
  const [emailList, setEmailList] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRefs = useRef<Record<number, HTMLInputElement>>({});

  const handleScore = (id: number, score: number) => setScores(p => ({ ...p, [id]: { ...p[id], score } }));
  const handleNote = (id: number, note: string) => setScores(p => ({ ...p, [id]: { ...p[id], note } }));
  const handlePhoto = (id: number, file: File) => {
    const r = new FileReader();
    r.onloadend = () => setScores(p => ({ ...p, [id]: { ...p[id], photo: r.result as string } }));
    r.readAsDataURL(file);
  };

  const calc = (ids: number[]) => {
    let t = 0, m = 0;
    ids.forEach(id => { const s = scores[id]?.score; if (s !== undefined && s >= 0) { t += s; m += 2; } });
    return { total: t, max: m, pct: m ? Math.round((t / m) * 100) : 0 };
  };

  const shortlist = calc(shortlistIds);
  const fullIds = auditCategories.filter(c => !c.isCritical).flatMap(c => c.points.map(p => p.id));
  const full = calc(fullIds);

  const canSubmit = formData.branchName.trim() !== '' && formData.auditorName.trim() !== '';

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    
    const actionItems = Object.entries(scores)
      .filter(([_, e]) => e && e.score !== undefined && e.score < 2 && e.score !== -1)
      .map(([id, e]) => ({ point: `Q${id}`, action: e?.note || 'Needs improvement', responsible: formData.auditorName, deadline: formData.date }));

    const submission: AuditSubmission = {
      id: Date.now().toString(), branchName: formData.branchName, branchNameAr: formData.branchName,
      auditorName: formData.auditorName, auditorNameAr: formData.auditorName, date: formData.date,
      scores, totalScore: shortlist.total + full.total, percentage: shortlist.pct, actionItems,
      emailList: emailList.split(',').map(e => e.trim()).filter(e => e)
    };
    
    // Generate PDF
    const blob = generatePDFBlob(submission);
    
    // Download PDF
    const a = document.createElement('a'); 
    a.href = URL.createObjectURL(blob);
    a.download = `Green_Audit_${formData.branchName}_${formData.date}.pdf`; 
    a.click();
    
    // Send via EmailJS if emails provided
    if (emailList.trim()) {
      const emails = emailList.split(',').map(e => e.trim()).filter(e => e);
      
      // Build detailed results
      const allResults = Object.entries(scores).map(([id, entry]: [string, any]) => {
        const scoreLabel = entry?.score === 2 ? '✅' : entry?.score === 1 ? '⚠️' : entry?.score === 0 ? '❌' : '⏳';
        return `${scoreLabel} Q${id}: ${entry?.note || (entry?.score === 2 ? 'Passed' : 'Needs action')}`;
      }).join('\n');
      
      const actionText = actionItems.length > 0 
        ? actionItems.map((a: any) => `• Q${a.point}: ${a.action}`).join('\n')
        : '✅ All items passed!';
      
      const detailedMsg = `Branch: ${formData.branchName}
Auditor: ${formData.auditorName}
Date: ${formData.date}
Score: ${shortlist.pct}% (${shortlist.total}/${shortlist.max})

Action Items (${actionItems.length}):
${actionText}

All Results:
${allResults}`;
      
      for (const email of emails) {
        try {
          emailjs.init('UPuEMQIU60vxk09Rd');
          const result = await emailjs.send(
            'service_l4f63ne',
            'template_t1ob5uh',
            { 
              branch: formData.branchName,
              auditor: formData.auditorName,
              date: formData.date,
              score: `${shortlist.pct}% (${shortlist.total}/${shortlist.max})`,
              actions: actionText,
              results: allResults
            },
            'UPuEMQIU60vxk09Rd'
          );
          console.log('Email sent to:', email, result);
        } catch (e) { 
          console.log('Email error:', JSON.stringify(e));
          alert('Email failed: ' + JSON.stringify(e));
        }
      }
      alert(`✅ Report sent to ${emails.length} email(s)!`);
    }
    
    setSubmitted(true); setIsSubmitting(false);
  };

  const isArabic = lang === 'ar';
  const t = (ar: string, en: string) => isArabic ? ar : en;
  const categoriesToShow = auditCategories.filter(c => auditMode === 'full' ? !c.isCritical : c.isCritical);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Bright Header */}
      <header className="bg-gradient-to-r from-green-900 via-green-800 to-emerald-900 text-white shadow-lg">
        <div className="px-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center p-1 shadow-md">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{t('نظام تدقيق الفروع', 'Branch Audit System')}</h1>
                <p className="text-green-200 text-xs font-medium">{t('شركة جرين كافيه - مصر', 'Green Cafe Egypt')}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowHelp(!showHelp)} className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold text-sm">?</button>
              <button onClick={() => setLang(isArabic ? 'en' : 'ar')} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold">
                {isArabic ? 'EN' : 'عربي'}
              </button>
            </div>
          </div>
        </div>
        <div className="px-4 pb-4 mt-3">
          <div className="flex justify-between text-xs font-medium text-green-200 mb-1">
            <span>{t('تقدم التقييم', 'Audit Progress')}</span>
            <span>{shortlist.pct}%</span>
          </div>
          <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-500 ${shortlist.pct >= 90 ? 'bg-green-400' : shortlist.pct >= 70 ? 'bg-yellow-400' : 'bg-red-400'}`} style={{ width: `${shortlist.pct}%` }} />
          </div>
        </div>
      </header>

      {showHelp && (
        <div className="px-4 pt-4">
          <div className="bg-green-50 rounded-xl p-3 border border-green-100">
            <p className="text-sm text-green-800 font-medium"><b>1.</b> {t('املأ البيانات', 'Fill info')} → <b>2.</b> {t('25 سؤال', '25 Q')} → <b>3.</b> {t('90%+', '90%+')} → <b>4.</b> PDF</p>
          </div>
        </div>
      )}

      <main className="px-4 py-4 pb-24">
        {submitted ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">✅</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{t('تم!', 'Done!')}</h2>
            <p className="text-gray-500 mb-4">{t('تم تحميل PDF', 'PDF downloaded')}</p>
            <div className={`text-3xl font-bold ${shortlist.pct >= 90 ? 'text-green-600' : 'text-yellow-600'}`}>
              {shortlist.pct}%
            </div>
          </div>
        ) : (
          <>
            {/* Branch Info */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{t('الفرع', 'Branch')} *</label>
                  <input type="text" value={formData.branchName} onChange={e => setFormData({...formData, branchName: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-900" placeholder="القاهرة - مصر" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{t('المدقق', 'Auditor')} *</label>
                  <input type="text" value={formData.auditorName} onChange={e => setFormData({...formData, auditorName: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-900" placeholder="Ahmed" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{t('التاريخ', 'Date')}</label>
                  <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-900" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{t('البريد', 'Email')}</label>
                  <input type="email" value={emailList} onChange={e => setEmailList(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-900" placeholder="email@green.com" />
                </div>
              </div>
            </div>

            {/* Score Card */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-gray-600">{t('النتيجة', 'Score')}</p>
                <p className="text-2xl font-bold text-gray-900">{shortlist.total}/{shortlist.max}</p>
              </div>
              <div className={`px-4 py-2 rounded-xl font-bold text-white ${shortlist.pct >= 90 ? 'bg-green-600' : shortlist.pct >= 70 ? 'bg-yellow-500' : 'bg-red-600'}`}>
                {shortlist.pct}%
              </div>
            </div>

            {auditMode === 'shortlist' && (
              <div className={`rounded-xl p-3 mb-4 ${shortlist.pct >= 90 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <span className={`font-semibold ${shortlist.pct >= 90 ? 'text-green-700' : 'text-red-700'}`}>
                  {shortlist.pct >= 90 ? '🎉 ' + t('ممتاز!', 'Passed!') : '⚠️ ' + t('تحتاج 90%', 'Need 90%')}
                </span>
              </div>
            )}

            {/* Legend */}
            <div className="flex gap-2 mb-4 text-xs font-medium flex-wrap">
              {scoreButtons.map(b => (
                <span key={b.s} className={`flex items-center gap-1 px-2 py-1 rounded ${b.c}`}>
                  <b>{b.l}</b>
                </span>
              ))}
            </div>

            {/* Categories */}
            {categoriesToShow.map(cat => {
              const catIds = cat.points.map(p => p.id);
              const catCalc = calc(catIds);
              
              // Green-themed colors for each category
              const catColors: Record<string, string> = {
                'food-safety': 'from-red-500 to-red-600',
                'customer': 'from-blue-500 to-blue-600', 
                'customer-service': 'from-blue-500 to-blue-600',
                'beverage': 'from-purple-500 to-purple-600',
                'beverage-quality': 'from-purple-500 to-purple-600',
                'operations': 'from-orange-500 to-orange-600',
                'equipment': 'from-teal-500 to-teal-600',
                'leadership': 'from-indigo-500 to-indigo-600',
              };
              const colorClass = catColors[cat.id] || 'from-green-600 to-green-700';
              
              return (
                <div key={cat.id} className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden">
                  <div className={`bg-gradient-to-r ${colorClass} px-4 py-3 flex justify-between items-center`}>
                    <div className="flex items-center gap-2">
                      {cat.isCritical && <span className="px-2 py-0.5 bg-white/20 text-white text-xs font-bold rounded">{t('حرج', 'CRIT')}</span>}
                      <span className="font-bold text-white text-sm">{isArabic ? cat.nameAr : cat.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white/80 text-xs font-medium">{cat.points.length} {t('سؤال', 'Q')}</span>
                      <span className="bg-white/20 px-2 py-0.5 rounded text-white text-xs font-bold">{catCalc.pct}%</span>
                    </div>
                  </div>
                  
                  <div className="p-3 space-y-2">
                    {cat.points.map(p => (
                      <div key={p.id} className="border border-gray-100 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-green-600 font-bold text-xs bg-green-50 px-1.5 py-0.5 rounded">#{p.id}</span>
                          <span className="text-xs text-gray-500 font-medium">{isArabic ? p.categoryAr : p.category}</span>
                        </div>
                        <p className="text-sm font-bold text-gray-800 mb-2">{isArabic ? p.questionAr : p.question}</p>
                        <div className="flex gap-1">
                          {scoreButtons.map(b => (
                            <button key={b.s} onClick={() => handleScore(p.id, b.s)}
                              className={`w-9 h-9 rounded-lg text-xs font-bold ${scores[p.id]?.score === b.s ? b.c : 'bg-gray-100 text-gray-600'}`}>
                              {b.l}
                            </button>
                          ))}
                          <input type="file" accept="image/*" ref={el => { if (el) fileInputRefs.current[p.id] = el }}
                            onChange={e => e.target.files?.[0] && handlePhoto(p.id, e.target.files[0])} className="hidden" id={`ph${p.id}`} />
                          <label htmlFor={`ph${p.id}`} className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm ${scores[p.id]?.photo ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>📷</label>
                        </div>
                        <input type="text" placeholder={t('ملاحظات', 'Notes')} value={scores[p.id]?.note ?? ''} onChange={e => handleNote(p.id, e.target.value)}
                          className="w-full mt-2 border border-gray-200 rounded px-2 py-1.5 text-xs font-medium text-gray-900" />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Actions */}
            <div className="space-y-2 pt-2">
              {auditMode === 'shortlist' ? (
                <>
                  <button onClick={handleSubmit} disabled={!canSubmit || isSubmitting || shortlist.pct < 90}
                    className="w-full py-4 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed">
                    {isSubmitting ? '...' : shortlist.pct >= 90 ? t('تحميل PDF + خطة العمل', 'Download PDF + Plan') : t('تحتاج 90%', 'Need 90%')}
                  </button>
                  {shortlist.max > 0 && shortlist.pct < 90 && (
                    <button onClick={() => setAuditMode('full')} className="w-full py-3 rounded-xl font-medium text-white bg-orange-500 hover:bg-orange-600">
                      {t('أكمل 50 سؤال ←', 'Complete 50 Q ←')}
                    </button>
                  )}
                </>
              ) : (
                <button onClick={handleSubmit} disabled={!canSubmit || isSubmitting}
                  className="w-full py-4 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-300">
                  {isSubmitting ? '...' : t('تحميل PDF + خطة العمل', 'Download PDF + Plan')}
                </button>
              )}
            </div>
          </>
        )}
      </main>

      {/* Bright Footer */}
      <footer className="bg-gradient-to-r from-green-900 via-green-800 to-emerald-900 text-white py-8 text-center shadow-lg">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-center gap-3 mb-3">
            <img src="/logo.png" alt="Logo" className="h-10 rounded-lg shadow" />
            <div className="text-left">
              <span className="text-lg font-bold block">Green Cafe</span>
              <span className="text-xs text-green-200">Egypt</span>
            </div>
          </div>
          <div className="border-t border-green-600 pt-4 mt-4">
            <p className="text-sm text-green-200 font-medium">© 2026 {t('جميع الحقوق محفوظة', 'All Rights Reserved')}</p>
            <p className="text-xs text-green-300 mt-1">{t('نظام التدقيق الاحترافي', 'Professional Audit System')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
