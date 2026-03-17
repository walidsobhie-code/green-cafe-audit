// Green Cafe Professional Audit - Based on 4 Files Only
// 1. Welcome to Green Experience (CS) 2. Arabic Basic Food Safety 3. Shift Leader Skills 4. Complete Recipe Manual

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
  isCritical: boolean;
  points: AuditPoint[];
}

export const auditCategories: AuditCategory[] = [
  // ========== SHORTLIST - 25 CRITICAL ==========
  // FOOD SAFETY (8 points)
  {
    id: 'food-safety',
    name: 'Food Safety & Hygiene',
    nameAr: 'السلامة الغذائية والنظافة',
    isCritical: true,
    points: [
      { id: 1, category: 'food-safety', categoryAr: 'السلامة', question: 'Hand Hygiene: Do all team members practice proper 20-second handwashing technique every 20 minutes and after handling trash, money, or touching their face/body?', questionAr: 'غسل اليدين: هل يمارس جميع أعضاء الفريق تقنية غسل اليدين الصحيحة لمدة 20 ثانية كل 20 دقيقة وبعد التعامل مع القمامة أو النقود أو لمس الوجه والجسم؟', maxScore: 2 },
      { id: 2, category: 'food-safety', categoryAr: 'السلامة', question: 'Personal Grooming: Are all team members wearing clean uniforms, proper aprons, hairnets, no jewelry, and maintaining good personal hygiene?', questionAr: 'المظهر الشخصي: هل يرتدي جميع أعضاء الفريق أزيار نظيفة، مريول مناسب، شبكة شعر، بدون مجوهرات، والحفاظ على نظافة شخصية جيدة؟', maxScore: 2 },
      { id: 3, category: 'food-safety', categoryAr: 'السلامة', question: 'Refrigeration: Is the refrigerator temperature maintained at 5°C or below as required by food safety regulations?', questionAr: 'التبريد: هل يتم الحفاظ على درجة حرارة البراد عند 5°C أو أقل وفقاً لمتطلبات سلامة الغذاء؟', maxScore: 2 },
      { id: 4, category: 'food-safety', categoryAr: 'السلامة', question: 'Hot Holding: Are all hot food items held at temperature above 63°C (140°F) to prevent bacterial growth?', questionAr: 'التسخين: هل يتم الحفاظ على جميع foods الساخنة عند درجة حرارة أعلى من 63°C لمنع نمو البكتيريا؟', maxScore: 2 },
      { id: 5, category: 'food-safety', categoryAr: 'السلامة', question: 'Allergen Awareness: Do team members proactively ask customers about any food allergies before preparing their orders?', questionAr: 'الوعي بالحساسية: هل يسأل أعضاء الفريق العملاء بشكل استباقي عن أي حساسية غذائية قبل preparing طلباتهم؟', maxScore: 2 },
      { id: 6, category: 'food-safety', categoryAr: 'السلامة', question: 'Cross-Contamination: Are cutting boards, pitchers, and equipment properly separated between raw and ready-to-eat foods?', questionAr: 'منع التلوث: هل ألواح التقطيع وأباريق المعدات مفصولة بشكل صحيح between المواد الخام والجاهزة للأكل؟', maxScore: 2 },
      { id: 7, category: 'food-safety', categoryAr: 'السلامة', question: 'FIFO System: Is the First In First Out rotation system properly implemented with older products used first?', questionAr: 'نظام FIFO: هل يتم تطبيق نظام التدوير بشكل صحيح مع استخدام المنتجات الأقدم أولاً؟', maxScore: 2 },
      { id: 8, category: 'food-safety', categoryAr: 'السلامة', question: 'Date Labeling: Are all food products properly labeled with preparation date and expiration date?', questionAr: 'وضع التواريخ: هل يتم وضع علامات تواريخ التحضير والانتهاء على جميع المنتجات الغذائية بشكل صحيح؟', maxScore: 2 },
    ]
  },
  
  // CUSTOMER SERVICE (7 points)
  {
    id: 'customer-service',
    name: 'Customer Experience',
    nameAr: 'تجربة العميل',
    isCritical: true,
    points: [
      { id: 9, category: 'customer', categoryAr: 'العملاء', question: 'Greeting: Does every team member greet customers within 10 seconds with a warm smile and maintain eye contact?', questionAr: 'الترحيب: هل يقوم كل عضو بالفريق بتحية العملاء خلال 10 ثوانٍ بابتسامة دافئة والحفاظ على تواصل بصري؟', maxScore: 2 },
      { id: 10, category: 'customer', categoryAr: 'العملاء', question: 'Order Accuracy: Are all drinks and food items prepared exactly as ordered with no mistakes?', questionAr: 'دقة الطلب: هل يتم تحضير جميع المشروبات والطعام exactly كما تم طلبهم بدون أخطاء؟', maxScore: 2 },
      { id: 11, category: 'customer', categoryAr: 'العملاء', question: 'CONNECT Method: Do team members use CONNECT for every order (Coffee Knowledge, Offer extras, Name, Thank you, Enjoy)?', questionAr: 'طريقة CONNECT: هل يستخدم أعضاء الفريق CONNECT لكل طلب (معرفة القهوة، عرض الإضافات، الاسم، شكر، استمتع)؟', maxScore: 2 },
      { id: 12, category: 'customer', categoryAr: 'العملاء', question: 'Upselling: Do team members suggest add-ons such as extra shot, alternative milk, size upgrades, or pastries?', questionAr: 'البيع الإضافي: هل يقترح أعضاء الفريق إضافات مثل جرعة إضافية، حليب بديل، ترقية الحجم، أو معجنات؟', maxScore: 2 },
      { id: 13, category: 'customer', categoryAr: 'العملاء', question: 'LATTE Complaint Handling: Are complaints handled using LATTE method (Listen, Apologize, Solve, Thank, Explain)?', questionAr: 'LATTE: هل يتم التعامل مع الشكاوى باستخدام طريقة LATTE (استمع، اعتذر، حل، شكر، explained)؟', maxScore: 2 },
      { id: 14, category: 'customer', categoryAr: 'العملاء', question: 'Product Knowledge: Can team members explain coffee origins, brewing methods, and flavor profiles to customers?', questionAr: 'معرفة المنتج: هل يستطيع أعضاء الفريق شرح مصادر البن، طرق التحضير، وملفات النكهة للعملاء؟', maxScore: 2 },
      { id: 15, category: 'customer', categoryAr: 'العملاء', question: 'Payment Processing: Are transactions processed accurately and timely with proper handling of cash and cards?', questionAr: 'معالجة الدفع: هل تتم معالجة المعاملات بدقة وفي الوقت المناسب مع التعامل الصحيح مع النقود والبطاقات؟', maxScore: 2 },
    ]
  },
  
  // BEVERAGE QUALITY (6 points)
  {
    id: 'beverage-quality',
    name: 'Beverage Quality',
    nameAr: 'جودة المشروبات',
    isCritical: true,
    points: [
      { id: 16, category: 'beverage', categoryAr: 'المشروبات', question: 'Espresso Extraction: Is the espresso properly extracted at 25-30 seconds with correct 9 bar pressure and 36-40ml yield?', questionAr: 'استخراج الإسبرسو: هل يتم استخراج الإسبرسو بشكل صحيح عند 25-30 ثانية مع ضغط صحيح 9 بار و36-40 مل؟', maxScore: 2 },
      { id: 17, category: 'beverage', categoryAr: 'المشروبات', question: 'Milk Texturing: Is milk steamed to correct temperature (60-65°C) with silky microfoam suitable for latte art?', questionAr: 'تحضير الحليب: هل يتم خفق الحليب لدرجة الحرارة الصحيحة (60-65°C) مع رغوة حريرية مناسبة لفن اللاتيه؟', maxScore: 2 },
      { id: 18, category: 'beverage', categoryAr: 'المشروبات', question: 'Recipe Adherence: Are all beverages prepared exactly according to standard recipes with correct ratios?', questionAr: 'الالتزام بالوصفات: هل يتم تحضير جميع المشروبات exactly according للوصفات القياسية بالنسبة الصحيحة؟', maxScore: 2 },
      { id: 19, category: 'beverage', categoryAr: 'المشروبات', question: 'Fresh Coffee: Is coffee ground fresh per order using high-quality beans within expiry?', questionAr: 'البن الطازج: هل يتم طحن البن طازج لكل طلب using حبوب عالية الجودة ضمن الصلاحية؟', maxScore: 2 },
      { id: 20, category: 'beverage', categoryAr: 'المشروبات', question: 'Presentation: Are drinks served in clean cups with proper lids, sleeves, and attractive garnishes?', questionAr: 'التقديم: هل تقدم المشروبات في أكواب نظيفة مع أغطية وأكمام الصحيحة وزينة جذابة؟', maxScore: 2 },
      { id: 21, category: 'beverage', categoryAr: 'المشروبات', question: 'Quality Check: Does the barista verify temperature, volume, and taste before serving each drink?', questionAr: 'فحص الجودة: هل يتحقق Barista من الحرارة والحجم والطعم قبل تقديم كل مشروب؟', maxScore: 2 },
    ]
  },
  
  // OPERATIONS (4 points)
  {
    id: 'operations',
    name: 'Store Operations',
    nameAr: 'عمليات المتجر',
    isCritical: true,
    points: [
      { id: 22, category: 'operations', categoryAr: 'العمليات', question: 'Opening Procedures: Are all pre-opening procedures completed including temperature checks, stock rotation, and setup?', questionAr: 'إجراءات الافتتاح: هل تم completion جميع إجراءات ما قبل الافتتاح including فحص الحرارة وتدوير المخزون والإعداد؟', maxScore: 2 },
      { id: 23, category: 'operations', categoryAr: 'العمليات', question: 'Store Cleanliness: Are tables, chairs, floor, and washrooms clean and tidy throughout the shift?', questionAr: 'نظافة المحل: هل الطاولات والكرسي والأرضية والحمامات نظيفة ومرتبة طوال الوردية؟', maxScore: 2 },
      { id: 24, category: 'operations', categoryAr: 'العمليات', question: 'POS System: Is the point of sale system working properly with accurate transactions?', questionAr: 'نظام نقاط البيع: هل يعمل نظام نقاط البيع بشكل صحيح مع معاملات دقيقة؟', maxScore: 2 },
      { id: 25, category: 'operations', categoryAr: 'العمليات', question: 'Store Ambiance: Is the store environment pleasant with appropriate music, lighting, and comfortable temperature?', questionAr: 'جو المحل: هل بيئة المحل ممتعة مع موسيقى مناسبة وإضاءة ودرجة حرارة مريحة؟', maxScore: 2 },
    ]
  },
  
  // ========== FULL AUDIT - Additional Categories ==========
  {
    id: 'customer-full',
    name: 'Customer Service - Additional',
    nameAr: 'خدمة العملاء - إضافي',
    isCritical: false,
    points: [
      { id: 26, category: 'customer', categoryAr: 'العملاء', question: 'Personal Connection: Does the barista use the customer\'s name during the order when known?', questionAr: 'الاتصال الشخصي: هل يستخدم Barista اسم العميل during الطلب عند معرفته؟', maxScore: 2 },
      { id: 27, category: 'customer', categoryAr: 'العملاء', question: 'Eye Contact: Is eye contact maintained throughout the interaction with the customer?', questionAr: 'التواصل البصري: هل يتم الحفاظ على التواصل البصري throughout التفاعل مع العميل؟', maxScore: 2 },
      { id: 28, category: 'customer', categoryAr: 'العملاء', question: 'Closing: Is the customer thanked and wished to enjoy their drink before leaving?', questionAr: 'الختام: هل يُشكر العميل ويُتمنى لهم الاستمتاع بمشروبهم قبل المغادرة؟', maxScore: 2 },
      { id: 29, category: 'customer', categoryAr: 'العملاء', question: 'WOW Moments: Does the team create memorable experiences for customers through personalization or surprises?', questionAr: 'لحظات الـ WOW: هل يخلق الفريق تجارب لا تُنسى للعملاء through التخصيص أو المفاجآت؟', maxScore: 2 },
      { id: 30, category: 'customer', categoryAr: 'العملاء', question: 'Loyalty Program: Is the Green Card loyalty program promoted and explained to customers?', questionAr: 'برنامج الولاء: هل يتم الترويج لبطاقة جرين وشرحها للعملاء؟', maxScore: 2 },
    ]
  },
  
  {
    id: 'food-safety-full',
    name: 'Food Safety - Additional',
    nameAr: 'السلامة - إضافي',
    isCritical: false,
    points: [
      { id: 31, category: 'food-safety', categoryAr: 'السلامة', question: 'Illness Reporting: Have all team members reported any illness or symptoms as required?', questionAr: 'الإبلاغ عن المرض: هل أبلغ جميع أعضاء الفريق عن أي مرض أو symptoms كما هو مطلوب؟', maxScore: 2 },
      { id: 32, category: 'food-safety', categoryAr: 'السلامة', question: 'Glove Usage: Are gloves changed properly when torn, soiled, or when switching between tasks?', questionAr: 'استخدام القفازات: هل يتم تغيير القفازات بشكل صحيح when تمزق أو اتساخ أو when التبديل between المهام؟', maxScore: 2 },
      { id: 33, category: 'food-safety', categoryAr: 'السلامة', question: 'Pest Control: Are there no signs of pest infestation and is the store clean and well-maintained?', questionAr: 'مكافحة الآفات: هل لا توجد علامات على وجود آفات والمح clean ومُحافظ عليه بشكل جيد؟', maxScore: 2 },
      { id: 34, category: 'food-safety', categoryAr: 'السلامة', question: 'Chemical Safety: Are cleaning chemicals properly stored away from food and is SDS available?', questionAr: 'السلامة الكيميائية: هل يتم تخزين المواد الكيميائية بشكل صحيح بعيداً عن food ويتوفر SDS؟', maxScore: 2 },
      { id: 35, category: 'food-safety', categoryAr: 'السلامة', question: 'Cleaning Schedule: Is the cleaning schedule followed and documented throughout the day?', questionAr: 'جدول التنظيف: هل يتم following جدول التنظيف وتوثيقه throughout اليوم؟', maxScore: 2 },
    ]
  },
  
  {
    id: 'beverage-full',
    name: 'Beverage - Additional',
    nameAr: 'المشروبات - إضافي',
    isCritical: false,
    points: [
      { id: 36, category: 'beverage', categoryAr: 'المشروبات', question: 'Espresso Dose: Is the correct dose of 18-20g of coffee used for each espresso shot?', questionAr: 'جرعة الإسبرسو: هل يتم استخدام الجرعة الصحيحة من 18-20 جم من coffee لكل shot إسبرسو؟', maxScore: 2 },
      { id: 37, category: 'beverage', categoryAr: 'المشروبات', question: 'Yield Measurement: Is the espresso yield measured at 36-40ml for double shots?', questionAr: 'قياس المحصول: هل يتم قياس محصول الإسبرسو at 36-40 مل للجرعات المزدوجة؟', maxScore: 2 },
      { id: 38, category: 'beverage', categoryAr: 'المشروبات', question: 'Milk Foam Quality: Is the milk foam silky and smooth with no large bubbles?', questionAr: 'جودة رغوة الحليب: هل رغوة milk حريرية وناعمة without فقاعات كبيرة؟', maxScore: 2 },
      { id: 39, category: 'beverage', categoryAr: 'المشوبات', question: 'Syrup Shelf Life: Are all syrups and modifiers within expiry and properly labeled?', questionAr: 'صلاحية الشراب: هل جميع الشرابات والمعدلات within expiry ومُعلَّمة بشكل صحيح؟', maxScore: 2 },
      { id: 40, category: 'beverage', categoryAr: 'المشروبات', question: 'Blending: Are frappe and iced drinks blended to the correct consistency with no ice chunks?', questionAr: 'الخلط: هل يتم خلط مشروبات الفرايب والثلج to القوام الصحيح without قطع ثلج؟', maxScore: 2 },
    ]
  },
  
  {
    id: 'operations-full',
    name: 'Operations - Additional',
    nameAr: 'العمليات - إضافي',
    isCritical: false,
    points: [
      { id: 41, category: 'operations', categoryAr: 'العمليات', question: 'Closing Procedures: Are all closing procedures completed including deep cleaning and proper shutdown?', questionAr: 'إجراءات الإغلاق: هل تم completion جميع إجراءات الإغلاق including التنظيف العميق والإيقاف الصحيح؟', maxScore: 2 },
      { id: 42, category: 'operations', categoryAr: 'العمليات', question: 'Cash Handling: Is cash properly counted, secured, and reconciled at end of shift?', questionAr: 'التعامل مع النقود: هل يتم عد النقود بشكل صحيح وتأمينها وتسويتها at end of الوردية؟', maxScore: 2 },
      { id: 43, category: 'operations', categoryAr: 'العمليات', question: 'Waste Disposal: Is waste properly sorted and disposed according to regulations?', questionAr: 'التخلص من النفايات: هل يتم فرز والتخلص من النفايات بشكل صحيح according للوائح؟', maxScore: 2 },
      { id: 44, category: 'operations', categoryAr: 'العمليات', question: 'Security: Are doors properly locked and safe secured at closing?', questionAr: 'الأمان: هل الأبواب مؤمنة بشكل صحيح والخزنة مؤمنة at الإغلاق؟', maxScore: 2 },
    ]
  },
  
  {
    id: 'equipment-full',
    name: 'Equipment Maintenance',
    nameAr: 'صيانة المعدات',
    isCritical: false,
    points: [
      { id: 45, category: 'equipment', categoryAr: 'المعدات', question: 'Daily Cleaning: Is the espresso machine and all equipment cleaned according to daily schedule?', questionAr: 'التنظيف اليومي: هل يتم تنظيف آلة الإسبرسو وجميع المعدات according to الجدول اليومي؟', maxScore: 2 },
      { id: 46, category: 'equipment', categoryAr: 'المعدات', question: 'Grinder Calibration: Is the grinder properly calibrated with consistent grind size?', questionAr: 'معايرة الطاحونة: هل الطاحونة معايَرة بشكل صحيح with حجم طحن متسق؟', maxScore: 2 },
      { id: 47, category: 'equipment', categoryAr: 'المعدات', question: 'Issue Resolution: Are minor equipment issues resolved quickly before they become major problems?', questionAr: 'حل المشاكل: هل يتم حل مشاكل المعدات البسيطة quickly قبل أن become مشاكل كبيرة؟', maxScore: 2 },
    ]
  },
  
  {
    id: 'leadership-full',
    name: 'Shift Leadership',
    nameAr: 'قيادة الوردية',
    isCritical: false,
    points: [
      { id: 48, category: 'leadership', categoryAr: 'القيادة', question: 'Task Delegation: Are tasks properly delegated to team members based on their skills?', questionAr: 'تفويض المهام: هل المهام مفوضة بشكل صحيح لأعضاء الفريق based on مهاراتهم؟', maxScore: 2 },
      { id: 49, category: 'leadership', categoryAr: 'القيادة', question: 'Staff Coaching: Have team members received coaching and training this week?', questionAr: 'تدريب الموظفين: هل تلقى أعضاء الفريق التدريب هذا الأسبوع؟', maxScore: 2 },
      { id: 50, category: 'leadership', categoryAr: 'القيادة', question: 'Team Morale: Is there a positive atmosphere with good team collaboration?', questionAr: 'معنويات الفريق: هل هناك أجواء positive with تعاون جيد بين الفريق؟', maxScore: 2 },
    ]
  }
];

export const shortlistIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
