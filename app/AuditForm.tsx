'use client';

import { useState, useRef } from 'react';
import { auditCategories, totalPoints } from '@/lib/auditData';
import { generatePDFBlob, AuditSubmission } from '@/lib/pdfGenerator';

interface ScoreEntry {
  score: number;
  note: string;
  photo?: string;
}

export default function AuditForm() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [formData, setFormData] = useState({
    branchName: '',
    branchNameAr: '',
    auditorName: '',
    auditorNameAr: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [scores, setScores] = useState<Record<number, ScoreEntry>>({});
  const [emailList, setEmailList] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRefs = useRef<Record<number, HTMLInputElement>>({});

  const handleScoreChange = (pointId: number, field: 'score' | 'note', value: number | string) => {
    setScores(prev => ({
      ...prev,
      [pointId]: {
        ...prev[pointId],
        [field]: value
      }
    }));
  };

  const handlePhotoUpload = (pointId: number, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setScores(prev => ({
        ...prev,
        [pointId]: {
          ...prev[pointId],
          photo: reader.result as string
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  const calculateTotal = () => {
    let total = 0;
    Object.values(scores).forEach(entry => {
      if (entry && entry.score) total += entry.score;
    });
    return total;
  };

  const percentage = Math.round((calculateTotal() / totalPoints) * 100);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const submission: AuditSubmission = {
      id: Date.now().toString(),
      ...formData,
      scores,
      totalScore: calculateTotal(),
      percentage,
      actionItems: Object.entries(scores)
        .filter(([_, entry]) => entry && entry.score < 2)
        .map(([pointId, entry]) => ({
          point: `Question ${pointId}`,
          action: entry?.note || 'Needs improvement',
          responsible: formData.auditorName,
          deadline: formData.date
        })),
      emailList: emailList.split(',').map(e => e.trim()).filter(e => e)
    };

    // Generate PDF
    const pdfBlob = generatePDFBlob(submission);
    
    // Create download link
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Green_Cafe_Audit_${formData.branchName}_${formData.date}.pdf`;
    link.click();
    URL.revokeObjectURL(url);

    // If emails provided, show alert (EmailJS integration would go here)
    if (emailList) {
      alert(`Audit submitted! Report downloaded. Would send to: ${emailList}`);
    }

    setSubmitted(true);
    setIsSubmitting(false);
  };

  const isArabic = lang === 'ar';

  return (
    <div className="min-h-screen bg-gray-50" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-green-700 text-white py-6 px-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              {isArabic ? 'نظام تدقيق جرين كافيه' : 'Green Cafe Audit System'}
            </h1>
            <p className="text-green-100">
              {isArabic ? 'قائمة التحقق من 50 نقطة' : '50-Point Audit Checklist'}
            </p>
          </div>
          <button
            onClick={() => setLang(isArabic ? 'en' : 'ar')}
            className="bg-white text-green-700 px-4 py-2 rounded-lg font-semibold hover:bg-green-50"
          >
            {isArabic ? 'English' : 'العربية'}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {submitted ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-green-600 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {isArabic ? 'تم إرسال التaudit بنجاح!' : 'Audit Submitted Successfully!'}
            </h2>
            <p className="text-gray-600 mb-4">
              {isArabic ? 'تم تنزيل التقرير كملف PDF' : 'Report has been downloaded as PDF'}
            </p>
            <div className="bg-green-50 p-4 rounded-lg inline-block">
              <p className="font-bold text-green-800">
                {isArabic ? 'النتيجة:' : 'Score:'} {calculateTotal()}/100 ({percentage}%)
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Basic Info */}
            <section className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {isArabic ? 'معلومات الفرع' : 'Branch Information'}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isArabic ? 'اسم الفرع' : 'Branch Name'}
                  </label>
                  <input
                    type="text"
                    value={formData.branchName}
                    onChange={e => setFormData({ ...formData, branchName: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder={isArabic ? 'الرياض - العليا' : 'Riyadh - Olaya'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isArabic ? 'اسم المدقق' : 'Auditor Name'}
                  </label>
                  <input
                    type="text"
                    value={formData.auditorName}
                    onChange={e => setFormData({ ...formData, auditorName: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder={isArabic ? 'أحمد محمد' : 'Ahmed Mohammed'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isArabic ? 'التاريخ' : 'Date'}
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isArabic ? 'البريد الإلكتروني لإرسال التقرير' : 'Email to send report'}
                  </label>
                  <input
                    type="text"
                    value={emailList}
                    onChange={e => setEmailList(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder={isArabic ? 'manager@green.com, hr@green.com' : 'manager@green.com, hr@green.com'}
                  />
                </div>
              </div>
            </section>

            {/* Score Summary */}
            <div className="bg-green-600 text-white rounded-xl p-4 mb-6 flex justify-between items-center">
              <span className="font-bold">
                {isArabic ? 'النتيجة الحالية:' : 'Current Score:'} {calculateTotal()}/{totalPoints}
              </span>
              <span className="text-2xl font-bold">{percentage}%</span>
            </div>

            {/* Audit Categories */}
            {auditCategories.map(category => (
              <section key={category.id} className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold text-green-700 mb-4">
                  {isArabic ? category.nameAr : category.name}
                </h2>
                <div className="space-y-4">
                  {category.points.map(point => (
                    <div key={point.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            <span className="text-green-600 mr-2">#{point.id}</span>
                            {isArabic ? point.questionAr : point.question}
                          </p>
                        </div>
                        <div className="flex gap-2 items-center">
                          <select
                            value={scores[point.id]?.score ?? -1}
                            onChange={e => handleScoreChange(point.id, 'score', parseInt(e.target.value))}
                            className={`border rounded-lg px-2 py-1 ${
                              scores[point.id]?.score === 2 ? 'bg-green-100 border-green-500' :
                              scores[point.id]?.score === 1 ? 'bg-yellow-100 border-yellow-500' :
                              scores[point.id]?.score === 0 ? 'bg-red-100 border-red-500' : ''
                            }`}
                          >
                            <option value={-1}>-</option>
                            <option value={2}>{isArabic ? 'ممتاز (2)' : 'Excellent (2)'}</option>
                            <option value={1}>{isArabic ? 'يحتاج تحسين (1)' : 'Needs Improvement (1)'}</option>
                            <option value={0}>{isArabic ? 'غير متوفر (0)' : 'Not Available (0)'}</option>
                          </select>
                          <input
                            type="file"
                            accept="image/*"
                            ref={el => { if (el) fileInputRefs.current[point.id] = el }}
                            onChange={e => e.target.files?.[0] && handlePhotoUpload(point.id, e.target.files[0])}
                            className="hidden"
                            id={`photo-${point.id}`}
                          />
                          <label
                            htmlFor={`photo-${point.id}`}
                            className="cursor-pointer bg-gray-100 p-2 rounded-lg hover:bg-gray-200"
                            title={isArabic ? 'إضافة صورة' : 'Add photo'}
                          >
                            📷
                          </label>
                        </div>
                      </div>
                      <input
                        type="text"
                        placeholder={isArabic ? 'ملاحظات...' : 'Notes...'}
                        value={scores[point.id]?.note ?? ''}
                        onChange={e => handleScoreChange(point.id, 'note', e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 mt-2 text-sm"
                      />
                      {scores[point.id]?.photo && (
                        <div className="mt-2">
                          <img src={scores[point.id].photo} alt="Evidence" className="h-20 w-auto rounded" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.branchName || !formData.auditorName}
              className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 
                (isArabic ? 'جاري المعالجة...' : 'Processing...') : 
                (isArabic ? 'إنشاء وتقرير PDF' : 'Generate PDF Report')
              }
            </button>
          </>
        )}
      </main>

      <footer className="bg-gray-800 text-gray-400 py-6 text-center mt-12">
        <p>Green Cafe Audit System © 2026</p>
      </footer>
    </div>
  );
}
