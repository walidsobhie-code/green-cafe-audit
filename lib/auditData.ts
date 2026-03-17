// Green Cafe 50-Point Audit Checklist
// Bilingual: Arabic (العربية) + English

export interface AuditPoint {
  id: number;
  category: string;
  categoryAr: string;
  question: string;
  questionAr: string;
  maxScore: number;
}

export interface AuditCategory {
  id: string;
  name: string;
  nameAr: string;
  points: AuditPoint[];
}

export const auditCategories: AuditCategory[] = [
  {
    id: 'food-safety',
    name: 'Food Safety & Hygiene',
    nameAr: 'السلامة الغذائية والنظافة',
    points: [
      { id: 1, category: 'food-safety', categoryAr: 'السلامة الغذائية', question: 'Handwashing: Proper 5-step technique practiced every 20 minutes?', questionAr: 'غسل اليدين: تطبيق technique الصحيح كل 20 دقيقة؟', maxScore: 2 },
      { id: 2, category: 'food-safety', categoryAr: 'السلامة الغذائية', question: 'Personal hygiene: Clean uniform, apron, hair net, no jewelry?', questionAr: 'النظافة الشخصية: زي نظيف، مريول، شبكة شعر، بدون مجوهرات؟', maxScore: 2 },
      { id: 3, category: 'food-safety', categoryAr: 'السلامة الغذائية', question: 'Illness reporting: Staff reported any illness/symptoms?', questionAr: 'الإبلاغ عن المرض: هل أبلغ الموظفون عن أي أعراض؟', maxScore: 2 },
      { id: 4, category: 'food-safety', categoryAr: 'السلامة الغذائية', question: 'Gloves: Changed when torn/soiled or switching tasks?', questionAr: 'القفازات: تم تغييرها عند الاتساخ أو الانتقال لمهام أخرى؟', maxScore: 2 },
      { id: 5, category: 'food-safety', categoryAr: 'السلامة الغذائية', question: 'Temperature control: Fridge ≤5°C, hot holding >63°C?', questionAr: 'التحكم بالحرارة: البراد ≤5°C، التسخين >63°C؟', maxScore: 2 },
      { id: 6, category: 'food-safety', categoryAr: 'السلامة الغذائية', question: 'Allergen management: Customer allergies asked proactively?', questionAr: 'إدارة مسببات الحساسية: تم询问 العملاء عن الحساسية؟', maxScore: 2 },
      { id: 7, category: 'food-safety', categoryAr: 'السلامة الغذائية', question: 'Cross-contamination: Separate cutting boards, pitchers for alt-milk?', questionAr: 'منع التلوث المتبادل: ألواح تقطيع وأباريق منفصلة؟', maxScore: 2 },
      { id: 8, category: 'food-safety', categoryAr: 'السلامة الغذائية', question: 'Pest control: No signs of infestation, clean environment?', questionAr: 'مكافحة الآفات: لا توجد علامات على وجود آفات؟', maxScore: 2 },
    ]
  },
  {
    id: 'food-prep',
    name: 'Food Preparation & Handling',
    nameAr: 'تحضير وتخزين الطعام',
    points: [
      { id: 9, category: 'food-prep', categoryAr: 'تحضير الطعام', question: 'FIFO: First In First Out applied to all products?', questionAr: 'FIFO: تطبيق مبدأ الأولوية للأقدم على جميع المنتجات؟', maxScore: 2 },
      { id: 10, category: 'food-prep', categoryAr: 'تحضير الطعام', question: 'Date labeling: Prep date & expiry on all containers?', questionAr: 'وضع التواريخ: تاريخ التحضير والانتهاء على جميع الحاويات؟', maxScore: 2 },
      { id: 11, category: 'food-prep', categoryAr: 'تحضير الطعام', question: 'Storage: Food covered, off floor, away from walls?', questionAr: 'التخزين: الطعام مغطى، بعيد عن الأرض والجدران؟', maxScore: 2 },
      { id: 12, category: 'food-prep', categoryAr: 'تحضير الطعام', question: 'Packaging: Correct attachments per order (box, bag, lid, spoon)?', questionAr: 'التعبئة:Attachments صحيحة لكل طلب (صندوق، كيس، غطاء، ملقة)؟', maxScore: 2 },
      { id: 13, category: 'food-prep', categoryAr: 'تحضير الطعام', question: 'Receiving delivery: Temperature checked, quality verified?', questionAr: 'استلام التوريد: تم فحص الحرارة والجودة؟', maxScore: 2 },
    ]
  },
  {
    id: 'customer-service',
    name: 'Customer Service',
    nameAr: 'خدمة العملاء',
    points: [
      { id: 14, category: 'customer-service', categoryAr: 'خدمة العملاء', question: 'Greeting: Warm welcome within 10 seconds?', questionAr: 'الترحيب: ترحيب دافئ خلال 10 ثوانٍ؟', maxScore: 2 },
      { id: 15, category: 'customer-service', categoryAr: 'خدمة العملاء', question: 'Order taking: CDR method (Connect, Discover, Respond)?', questionAr: 'أخذ الطلب: طريقة CDR (تواصل، استكشف، رد)؟', maxScore: 2 },
      { id: 16, category: 'customer-service', categoryAr: 'خدمة العملاء', question: 'Upselling: Suggested add-ons, size upgrades?', questionAr: 'البيع الإضافي: تم suggest الإضافات والـ upgrades؟', maxScore: 2 },
      { id: 17, category: 'customer-service', categoryAr: 'خدمة العملاء', question: 'LATTE: Complaints handled with Listen, Apologize, Solve, Thank?', questionAr: 'LATTE: تم معالجة الشكاوى بـ Listen, Apologize, Solve, Thank؟', maxScore: 2 },
      { id: 18, category: 'customer-service', categoryAr: 'خدمة العملاء', question: 'WOW moments: Created memorable customer experience?', questionAr: 'لحظات الـ WOW: تم خلق تجربة لا تُنسى للعميل؟', maxScore: 2 },
      { id: 19, category: 'customer-service', categoryAr: 'خدمة العملاء', question: 'Loyalty program: Green Card promoted effectively?', questionAr: 'برنامج الولاء: تم الترويج لبطاقة Green بنجاح؟', maxScore: 2 },
      { id: 20, category: 'customer-service', categoryAr: 'خدمة العملاء', question: 'Payment: Accurate, timely, proper handling of cash/cards?', questionAr: 'الدفع: دقيق، في الوقت المناسب، التعامل الصحيح مع النقود/البطاقات؟', maxScore: 2 },
    ]
  },
  {
    id: 'beverage',
    name: 'Beverage Preparation',
    nameAr: 'تحضير المشروبات',
    points: [
      { id: 21, category: 'beverage', categoryAr: 'تحضير المشروبات', question: 'Recipes: All beverages made per standard recipe?', questionAr: 'الوصفات: جميع المشروبات مصنوعة according to الوصفة القياسية؟', maxScore: 2 },
      { id: 22, category: 'beverage', categoryAr: 'تحضير المشروبات', question: 'Syrup shelf life: Within expiry, properly labeled?', questionAr: 'صلاحية الشراب: ضمن الصلاحية، مع properly labeled؟', maxScore: 2 },
      { id: 23, category: 'beverage', categoryAr: 'تحضير المشروبات', question: 'Quality standards: Correct temp, volume, taste, speed?', questionAr: 'معايير الجودة: الحرارة، الحجم، الطعم، السرعة صحيحة؟', maxScore: 2 },
      { id: 24, category: 'beverage', categoryAr: 'تحضير المشroughs', question: 'Espresso: Proper extraction, fresh beans, correct grind?', questionAr: 'الإسبرسو: استخراج صحيح، حبوب طازجة، طحن صحيح؟', maxScore: 2 },
      { id: 25, category: 'beverage', categoryAr: 'تحضير المشزمات', question: 'Milk steaming: Proper texture, temperature for each type?', questionAr: 'خفق الحليب: قوام ودرجة حرارة صحيحة لكل نوع؟', maxScore: 2 },
      { id: 26, category: 'beverage', categoryAr: 'تحضير المشروبات', question: 'Presentation: Proper garnish, clean cup, attractive?', questionAr: 'التقديم: الزينة الصحيحة، الكأس نظيفة، جذابة؟', maxScore: 2 },
    ]
  },
  {
    id: 'equipment',
    name: 'Equipment Operations',
    nameAr: 'تشغيل المعدات',
    points: [
      { id: 27, category: 'equipment', categoryAr: 'تشغيل المعدات', question: 'Thermoplan: Proper operation, daily cleaning?', questionAr: 'Thermoplan: التشغيل الصحيح، التنظيف اليومي؟', maxScore: 2 },
      { id: 28, category: 'equipment', categoryAr: 'تشغيل المعدات', question: 'Calibration: Espresso machine calibrated correctly?', questionAr: 'المعايرة: آلة الإسبرسو معايرة بشكل صحيح؟', maxScore: 2 },
      { id: 29, category: 'equipment', categoryAr: 'تشغيل المعدات', question: 'Troubleshooting: Minor issues resolved quickly?', questionAr: 'حل المشكلات: تم حل المشاكل البسيطة بسرعة؟', maxScore: 2 },
      { id: 30, category: 'equipment', categoryAr: 'تشغيل المعدات', question: 'Maintenance: Equipment cleaned and maintained per schedule?', questionAr: 'الصيانة: المعدات cleaned و maintained according to الجدول؟', maxScore: 2 },
    ]
  },
  {
    id: 'operations',
    name: 'Store Operations',
    nameAr: 'عمليات المتجر',
    points: [
      { id: 31, category: 'operations', categoryAr: 'عمليات المتجر', question: 'Opening: All opening procedures completed correctly?', questionAr: 'الافتتاح: جميع إجراءات الافتتاح completed بشكل صحيح؟', maxScore: 2 },
      { id: 32, category: 'operations', categoryAr: 'عمليات المتجر', question: 'Closing: All closing procedures completed correctly?', questionAr: 'الإغلاق: جميع إجراءات الإغلاق completed بشكل صحيح؟', maxScore: 2 },
      { id: 33, category: 'operations', categoryAr: 'عمليات المتجر', question: 'Ambiance: Clean, organized, pleasant environment?', questionAr: 'الجو: نظيف، منظم، بيئة ممتعة؟', maxScore: 2 },
      { id: 34, category: 'operations', categoryAr: 'عمليات المتجر', question: 'POS: Proper operation, accurate transactions?', questionAr: 'POS: التشغيل الصحيح، المعاملات الدقيقة؟', maxScore: 2 },
      { id: 35, category: 'operations', categoryAr: 'عمليات المتجر', question: 'Cash management: Proper handling, secure storage?', questionAr: 'إدارة النقود: التعامل الصحيح، التخزين الآمن؟', maxScore: 2 },
    ]
  },
  {
    id: 'inventory',
    name: 'Inventory & Waste Management',
    nameAr: 'المخزون وإدارة الهدر',
    points: [
      { id: 36, category: 'inventory', categoryAr: 'المخزون', question: 'Par levels: Stock maintained at proper levels?', questionAr: 'مستويات المخزون: maintained عند المستويات الصحيحة؟', maxScore: 2 },
      { id: 37, category: 'inventory', categoryAr: 'المخزون', question: 'Waste tracking: Daily waste recorded accurately?', questionAr: 'تتبع الهدر: الهدر اليومي مسجل بدقة؟', maxScore: 2 },
      { id: 38, category: 'inventory', categoryAr: 'المخزون', question: 'Shrink/variance: Within acceptable limits?', questionAr: 'الفرق/الاختلاف: ضمن الحدود المقبولة؟', maxScore: 2 },
      { id: 39, category: 'inventory', categoryAr: 'المخزون', question: 'Supply ordering: Timely and accurate orders?', questionAr: 'طلب المستلزمات: في الوقت المناسب ودقيق؟', maxScore: 2 },
    ]
  },
  {
    id: 'staff',
    name: 'Staff Development',
    nameAr: 'تطوير الموظفين',
    points: [
      { id: 40, category: 'staff', categoryAr: 'تطوير الموظفين', question: 'Coaching: Staff received coaching this period?', questionAr: 'التدريب: الموظفون تلقوا تدريب this الفترة؟', maxScore: 2 },
      { id: 41, category: 'staff', categoryAr: 'تطوير الموظفين', question: 'Feedback: Regular constructive feedback provided?', questionAr: 'ملاحظات: تم تقديم ملاحظات بناءة بانتظام؟', maxScore: 2 },
      { id: 42, category: 'staff', categoryAr: 'تطوير الموظفين', question: 'Training records: All required training completed?', questionAr: 'سجلات التدريب: جميع التدريبات المطلوبة completed؟', maxScore: 2 },
      { id: 43, category: 'staff', categoryAr: 'تطوير الموظفين', question: 'Performance: Staff meeting performance standards?', questionAr: 'الأداء: الموظفون meeting معايير الأداء؟', maxScore: 2 },
    ]
  },
  {
    id: 'compliance',
    name: 'Compliance & Documentation',
    nameAr: 'الامتثال والتوثيق',
    points: [
      { id: 44, category: 'compliance', categoryAr: 'الامتثال', question: 'HACCP Log: Temperature log maintained daily?', questionAr: 'سجل HACCP: سجل الحرارة maintained يومياً؟', maxScore: 2 },
      { id: 45, category: 'compliance', categoryAr: 'الامتثال', question: 'Chemical log: Cleaning chemicals properly logged?', questionAr: 'سجل المواد الكيميائية: المواد الكيميائية مسجلة بشكل صحيح؟', maxScore: 2 },
      { id: 46, category: 'compliance', categoryAr: 'الامتثال', question: 'Municipal compliance: All health standards met?', questionAr: 'الامتثال البلدي: جميع معايير الصحة meet؟', maxScore: 2 },
      { id: 47, category: 'compliance', categoryAr: 'الامتثال', question: 'Documentation: All required documents available?', questionAr: 'التوثيق: جميع الوثائق المطلوبة متاحة؟', maxScore: 2 },
    ]
  },
  {
    id: 'shift-leadership',
    name: 'Shift Leadership',
    nameAr: 'قيادة الوردية',
    points: [
      { id: 48, category: 'shift-leadership', categoryAr: 'قيادة الوردية', question: 'Delegation: Tasks properly delegated to team?', questionAr: 'التفويض: المهام properly مفوضة للفريق؟', maxScore: 2 },
      { id: 49, category: 'shift-leadership', categoryAr: 'قيادة الوردية', question: 'Problem solving: Issues resolved efficiently?', questionAr: 'حل المشكلات: المشاكل resolved بكفاءة؟', maxScore: 2 },
      { id: 50, category: 'shift-leadership', categoryAr: 'قيادة الوردية', question: 'Team morale: Positive atmosphere maintained?', questionAr: 'معنويات الفريق: تم الحفاظ على أجواء إيجابية؟', maxScore: 2 },
    ]
  }
];

export const totalPoints = auditCategories.reduce((sum, cat) => sum + cat.points.reduce((s, p) => s + p.maxScore, 0), 0);
// Total: 100 points
