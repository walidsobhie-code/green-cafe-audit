'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock } from 'lucide-react';

export default function Contact() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to a backend
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const content = {
    en: {
      title: 'Contact Us',
      subtitle: 'اتصل بنا',
      description: 'Have questions about the Green Cafe Audit? We\'d love to hear from you.',
      formTitle: 'Send us a Message',
      nameLabel: 'Your Name',
      emailLabel: 'Email Address',
      messageLabel: 'Message',
      namePlaceholder: 'Enter your name',
      emailPlaceholder: 'Enter your email',
      messagePlaceholder: 'How can we help?',
      submitBtn: 'Send Message',
      sendingBtn: 'Sending...',
      successMessage: 'Thank you! We\'ll get back to you soon.',
      infoTitle: 'Contact Information',
      info: [
        { icon: Mail, label: 'Email', value: 'walid.sobhy@mmgunited.com' },
        { icon: Clock, label: 'Response Time', value: 'Within 3-5 business days' }
      ],
      backToHome: '← Back to Audit'
    },
    ar: {
      title: 'اتصل بنا',
      subtitle: 'Contact Us',
      description: 'لديك أسئلة حول تدقيق جرين كافيه؟ نود أن نسمع منك.',
      formTitle: 'أرسل لنا رسالة',
      nameLabel: 'اسمك',
      emailLabel: 'البريد الإلكتروني',
      messageLabel: 'الرسالة',
      namePlaceholder: 'أدخل اسمك',
      emailPlaceholder: 'أدخل بريدك الإلكتروني',
      messagePlaceholder: 'كيف يمكننا مساعدتك؟',
      submitBtn: 'إرسال الرسالة',
      sendingBtn: 'جاري الإرسال...',
      successMessage: 'شكراً لك! سنعود إليك قريباً.',
      infoTitle: 'معلومات الاتصال',
      info: [
        { icon: Mail, label: 'البريد الإلكتروني', value: 'walid.sobhy@mmgunited.com' },
        { icon: Clock, label: 'وقت الاستجابة', value: 'خلال ٣-٥ أيام عمل' }
      ],
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

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#16a34a] rounded-full mb-4">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[#1a2e1a] mb-2">{t.title}</h1>
          <p className="text-xl text-[#16a34a] font-medium">{t.subtitle}</p>
          <p className="text-[#64748b] mt-2">{t.description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-[#e2e8f0]">
            <h2 className="text-xl font-bold text-[#1a2e1a] mb-6">{t.formTitle}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1a2e1a] mb-1">{t.nameLabel}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t.namePlaceholder}
                  required
                  className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg focus:ring-2 focus:ring-[#16a34a] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1a2e1a] mb-1">{t.emailLabel}</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={t.emailPlaceholder}
                  required
                  className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg focus:ring-2 focus:ring-[#16a34a] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1a2e1a] mb-1">{t.messageLabel}</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={t.messagePlaceholder}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg focus:ring-2 focus:ring-[#16a34a] focus:border-transparent resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={submitted}
                className="w-full px-6 py-3 bg-[#16a34a] text-white rounded-lg font-medium hover:bg-[#15803d] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {submitted ? (
                  <>
                    <span className="text-lg">✓</span>
                    {t.successMessage}
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {t.submitBtn}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-[#e2e8f0]">
              <h2 className="text-xl font-bold text-[#1a2e1a] mb-6">{t.infoTitle}</h2>
              <div className="space-y-4">
                {t.info.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#f0fdf4] rounded-full flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-[#16a34a]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#64748b]">{item.label}</p>
                      <p className="font-medium text-[#1a2e1a]">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-gradient-to-br from-[#16a34a] to-[#15803d] rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-4">
                {lang === 'en' ? 'Quick Links' : 'روابط سريعة'}
              </h3>
              <div className="space-y-2">
                <a href="/" className="block py-2 px-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all">
                  {lang === 'en' ? '🏠 Home / Audit Form' : '🏠 الرئيسية / نموذج التدقيق'}
                </a>
                <a href="/privacy" className="block py-2 px-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all">
                  {lang === 'en' ? '🔒 Privacy Policy' : '🔒 سياسة الخصوصية'}
                </a>
                <a href="/about" className="block py-2 px-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all">
                  {lang === 'en' ? 'ℹ️ About Us' : 'ℹ️ من نحن'}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
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
