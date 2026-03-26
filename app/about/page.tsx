'use client';

import { useState } from 'react';
import { Leaf, Award, Users, Target, CheckCircle, Coffee } from 'lucide-react';

export default function About() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');

  const content = {
    en: {
      title: 'About Green Cafe Audit',
      subtitle: 'عن تدقيق جرين كافيه',
      hero: 'Comprehensive audit solution for food safety and branch performance',
      heroAr: 'حل شامل لتدقيق سلامة الغذاء وأداء الفروع',
      mission: 'Our Mission',
      missionText: 'To provide a comprehensive, bilingual audit system that helps Green Cafe maintain the highest standards of food safety, hygiene, and branch performance across all locations.',
      vision: 'Our Vision',
      visionText: 'To be the leading audit framework for coffee shops and food service businesses in the region, setting new standards for quality and compliance.',
      features: 'Key Features',
      featuresList: [
        { icon: CheckCircle, text: '50-point comprehensive audit checklist' },
        { icon: CheckCircle, text: 'Bilingual Arabic/English interface' },
        { icon: CheckCircle, text: 'Real-time scoring and calculations' },
        { icon: CheckCircle, text: 'PDF report generation' },
        { icon: CheckCircle, text: 'Photo documentation support' },
        { icon: CheckCircle, text: 'Temperature tracking for food safety' },
        { icon: CheckCircle, text: 'Action items and corrective measures' },
        { icon: CheckCircle, text: 'Priority-based scoring (CCP, High, Standard)' }
      ],
      why: 'Why Green Cafe Audit?',
      whyList: [
        { icon: Leaf, title: 'Sustainability Focus', desc: 'Ensures environmental compliance and sustainability practices' },
        { icon: Award, title: 'Quality Standards', desc: 'Maintains consistent quality across all branches' },
        { icon: Users, title: 'Team Accountability', desc: 'Clear tracking of auditor responsibilities' },
        { icon: Target, title: 'Data-Driven', desc: 'Makes informed decisions with detailed reports' }
      ],
      stats: 'Impact & Numbers',
      statsData: [
        { number: '50+', label: 'Audit Points' },
        { number: '100%', label: 'Coverage' },
        { number: '3', label: 'Priority Levels' },
        { number: 'Bilingual', label: 'Support' }
      ],
      footer: 'Ready to improve your branch performance?',
      backToHome: '← Back to Audit'
    },
    ar: {
      title: 'عن تدقيق جرين كافيه',
      subtitle: 'About Green Cafe Audit',
      hero: 'حل شامل لتدقيق سلامة الغذاء وأداء الفروع',
      heroAr: 'Comprehensive audit solution for food safety and branch performance',
      mission: 'مهمتنا',
      missionText: 'تقديم نظام تدقيق شامل ثنائي اللغة يساعد جرين كافيه على الحفاظ على أعلى معايير سلامة الغذاء والنظافة وأداء الفروع في جميع المواقع.',
      vision: 'رؤيتنا',
      visionText: 'أن نكون إطار التدقيقة الرائد لمقاهي ومطاعم الخدمات الغذائية في المنطقة، ووضع معايير جديدة للجودة والامتثال.',
      features: 'المميزات الرئيسية',
      featuresList: [
        { icon: CheckCircle, text: 'قائمة تدقيق شاملة من ٥٠ نقطة' },
        { icon: CheckCircle, text: 'واجهة ثنائية اللغة العربية والإنجليزية' },
        { icon: CheckCircle, text: 'حساب الدرجات في الوقت الفعلي' },
        { icon: CheckCircle, text: 'إنشاء تقارير PDF' },
        { icon: CheckCircle, text: 'دعم التوثيق بالصور' },
        { icon: CheckCircle, text: 'تتبع درجة الحرارة لسلامة الغذاء' },
        { icon: CheckCircle, text: 'عناصر الإجراء والتصحيحات' },
        { icon: CheckCircle, text: 'تحديد الأولويات (CCP، عالي، قياسي)' }
      ],
      why: 'لماذا تدقيق جرين كافيه؟',
      whyList: [
        { icon: Leaf, title: 'التركيز على الاستدامة', desc: 'يضمن الامتثال البيئي وممارسات الاستدامة' },
        { icon: Award, title: 'معايير الجودة', desc: 'يحافظ على جودة متسقة عبر جميع الفروع' },
        { icon: Users, title: 'المساءلة الفريق', desc: 'تتبع واضح لمسؤوليات المدققين' },
        { icon: Target, title: 'قائم على البيانات', desc: 'اتخاذ قرارات مستنيرة مع تقارير مفصلة' }
      ],
      stats: 'الأثر والأرقام',
      statsData: [
        { number: '٥٠+', label: 'نقاط التدقيق' },
        { number: '١٠٠٪', label: 'التغطية' },
        { number: '٣', label: 'مستويات الأولوية' },
        { number: 'ثنائي اللغة', label: 'الدعم' }
      ],
      footer: 'على استعداد لتحسين أداء فروعك؟',
      backToHome: '← العودة للتدقيق'
    }
  };

  const t = content[lang];

  return (
    <div className="min-h-screen bg-[#f0fdf4] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Language Toggle */}
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="px-4 py-2 bg-[#16a34a] text-white rounded-lg font-medium hover:bg-[#15803d] transition-all"
          >
            {lang === 'en' ? 'العربية' : 'English'}
          </button>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#16a34a] rounded-full mb-4">
            <Coffee className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[#1a2e1a] mb-2">{t.title}</h1>
          <p className="text-xl text-[#16a34a] font-medium">{t.subtitle}</p>
          <p className="text-[#64748b] mt-2">{lang === 'en' ? t.hero : t.heroAr}</p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-[#e2e8f0]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#16a34a] rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-[#1a2e1a]">{t.mission}</h2>
            </div>
            <p className="text-[#64748b] leading-relaxed">{t.missionText}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md border border-[#e2e8f0]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#84cc16] rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-[#1a2e1a]">{t.vision}</h2>
            </div>
            <p className="text-[#64748b] leading-relaxed">{t.visionText}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-br from-[#16a34a] to-[#15803d] rounded-2xl p-8 mb-12">
          <h2 className="text-xl font-bold text-white text-center mb-6">{t.stats}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {t.statsData.map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-3xl font-bold text-white">{stat.number}</p>
                <p className="text-green-100 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-[#e2e8f0] mb-12">
          <h2 className="text-xl font-bold text-[#1a2e1a] mb-6">{t.features}</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {t.featuresList.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 text-[#1a2e1a]">
                <feature.icon className="w-5 h-5 text-[#16a34a] flex-shrink-0" />
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Why Green Cafe Audit */}
        <h2 className="text-2xl font-bold text-[#1a2e1a] mb-6 text-center">{t.why}</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {t.whyList.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-md border border-[#e2e8f0]">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#f0fdf4] rounded-xl flex items-center justify-center">
                  <item.icon className="w-7 h-7 text-[#16a34a]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1a2e1a]">{item.title}</h3>
                  <p className="text-sm text-[#64748b]">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mb-12">
          <p className="text-lg text-[#1a2e1a] font-medium mb-4">{t.footer}</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-[#16a34a] text-white rounded-lg font-medium hover:bg-[#15803d] transition-all"
          >
            {t.backToHome}
          </a>
        </div>
      </div>
    </div>
  );
}
