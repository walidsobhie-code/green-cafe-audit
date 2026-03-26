'use client';

import { useState } from 'react';

export default function PrivacyPolicy() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');

  const content = {
    en: {
      title: 'Privacy Policy',
      subtitle: 'سياسة الخصوصية',
      lastUpdated: 'Last Updated: March 2026',
      intro: 'Green Cafe Audit is committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your information.',
      sections: [
        {
          title: 'Information We Collect',
          items: [
            'Branch name and audit data',
            'Auditor name and contact information',
            'Photos and documentation uploaded during audits',
            'Temperature records and timestamps'
          ]
        },
        {
          title: 'How We Use Your Information',
          items: [
            'To generate audit reports and PDFs',
            'To track compliance and performance across branches',
            'To store audit history for future reference',
            'To improve our audit processes'
          ]
        },
        {
          title: 'Data Storage & Security',
          items: [
            'All data is stored locally on your device',
            'Photos are stored as base64 in browser storage',
            'We use localStorage for draft auto-save',
            'No data is transmitted to external servers'
          ]
        },
        {
          title: 'Your Rights',
          items: [
            'You can delete your audit history at any time',
            'You can export your data as PDF',
            'You can clear drafts from localStorage',
            'Contact us to request data deletion'
          ]
        },
        {
          title: 'Contact Us',
          items: [
            'Email: walid.sobhy@mmgunited.com',
            'We respond within 3-5 business days'
          ]
        }
      ]
    },
    ar: {
      title: 'سياسة الخصوصية',
      subtitle: 'Privacy Policy',
      lastUpdated: 'آخر تحديث: مارس ٢٠٢٦',
      intro: 'نلتزم في جرين كافيه بحماية خصوصيتك. توضح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك.',
      sections: [
        {
          title: 'المعلومات التي نجمعها',
          items: [
            'اسم الفرع وبيانات التدقيق',
            'اسم المدقق ومعلومات الاتصال',
            'الصور والوثائق المرفوعة أثناء التدقيق',
            'سجلات درجات الحرارة والطوابع الزمنية'
          ]
        },
        {
          title: 'كيف نستخدم معلوماتك',
          items: [
            'لإنشاء تقارير التدقيق وملفات PDF',
            'لتتبع الامثال والأداء عبر الفروع',
            'لتخزين تاريخ التدقيق للرجوع إليه مستقبلاً',
            'لتحسين عمليات التدقيق لدينا'
          ]
        },
        {
          title: 'التخزين والأمان',
          items: [
            'يتم تخزين جميع البيانات محلياً على جهازك',
            'يتم تخزين الصور كـ base64 في تخزين المتصفح',
            'نستخدم localStorage للحفظ التلقائي',
            'لا يتم إرسال أي بيانات إلى خوادم خارجية'
          ]
        },
        {
          title: 'حقوقك',
          items: [
            'يمكنك حذف تاريخ التدقيق في أي وقت',
            'تصدير بياناتك كملف PDF',
            'مسح المسودات من localStorage',
            'تواصل معنا لطلب حذف البيانات'
          ]
        },
        {
          title: 'اتصل بنا',
          items: [
            'البريد الإلكتروني: walid.sobhy@mmgunited.com',
            'نستجيب خلال ٣-٥ أيام عمل'
          ]
        }
      ]
    }
  };

  const t = content[lang];

  return (
    <div className="min-h-screen bg-[#f0fdf4] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Language Toggle */}
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="px-4 py-2 bg-[#16a34a] text-white rounded-lg font-medium hover:bg-[#15803d] transition-all"
          >
            {lang === 'en' ? 'العربية' : 'English'}
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#1a2e1a] mb-2">{t.title}</h1>
          <p className="text-xl text-[#16a34a] font-medium">{t.subtitle}</p>
          <p className="text-sm text-[#64748b] mt-2">{t.lastUpdated}</p>
        </div>

        {/* Intro */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-[#e2e8f0] mb-8">
          <p className="text-[#1a2e1a] leading-relaxed">{t.intro}</p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {t.sections.map((section, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-md border border-[#e2e8f0]">
              <h2 className="text-xl font-bold text-[#16a34a] mb-4">{section.title}</h2>
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-[#1a2e1a]">
                    <span className="text-[#16a34a] mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <a
            href="/"
            className="inline-block px-6 py-3 bg-[#16a34a] text-white rounded-lg font-medium hover:bg-[#15803d] transition-all"
          >
            {lang === 'en' ? '← Back to Audit' : '← العودة للتدقيق'}
          </a>
        </div>
      </div>
    </div>
  );
}
