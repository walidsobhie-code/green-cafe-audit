
// ============================================
// GREEN CAFE AUDIT - OPTIMIZED 25 POINTS
// 5 Critical CCPs | 20 Standard Points
// ============================================

// PRIORITY MAPPING:
// 🔴 CCP (Critical) - MUST PASS - 5 points
// ⚡ High Priority - 8 points  
// 📋 Standard - 12 points

export type Priority = 'CCP' | 'HIGH' | 'STANDARD';

export interface AuditPoint {
  id: number;
  category: string;
  categoryAr: string;
  question: string;
  questionAr: string;
  maxScore: number;
  priority?: Priority;
  isCCP?: boolean;
  ccpWeight?: number;
  requiresTemp?: boolean;
  tempMin?: number;
  tempMax?: number;
  criticalReason?: string;
  guidance?: string;
  guidanceAr?: string;
}

export interface AuditCategory {
  id: string;
  name: string;
  nameAr: string;
  points: AuditPoint[];
  priority: Priority;
  shortlistOnly?: boolean; // If true, only show in shortlist mode
}

// OPTIMIZED 25-POINT AUDIT (5 CCPs + 20 Standard)
// Priority-based selection from all original 50 points
export const auditCategories: AuditCategory[] = [
  // ============================================
  // 🔴 CCPs - CRITICAL (5 points - MUST PASS)
  // ============================================
  {
    id: 'ccp-1',
    name: '🔴 Critical Control Points',
    nameAr: 'نقاط التحكم الحرجة',
    priority: 'CCP',
    points: [
      { 
        id: 1, 
        category: 'ccp', 
        categoryAr: 'CCP',
        question: 'Hand Hygiene: Do ALL food handlers wash hands with soap for 20+ seconds every 20 minutes AND after: restroom use, touching face/hair, handling raw materials, waste, or contaminated surfaces? Are disposable towels used?', 
        questionAr: 'غسل اليدين: هل جميع العاملين يغسلون أيديهم بالصابون لمدة 20+ ثانية كل 20 دقيقة وبعد: استخدام الحمام، لمس الوجه/الشعر، التعامل مع المواد الخام، النفايات، أو الأسطح الملوثة؟ هل تستخدم المناشف الورقية؟',
        maxScore: 2, 
        isCCP: true, 
        ccpWeight: 3, 
        priority: 'CCP',
        criticalReason: 'Hands spread most foodborne illnesses. Primary defense against contamination.',
        guidance: 'Wash 20+ seconds with soap. Every 20 min during work + after restroom/face/hair/raw materials/waste. Use disposable towels. Sanitizer alone is NOT enough.',
        guidanceAr: 'اغسل 20+ ثانية بالصابون. كل 20 دقيقة أثناء العمل + بعد الحمام/الوجه/الشعر/المواد الخام/النفايات. استخدم مناشف ورقية. المعقم وحده غير كافٍ.'
      },
      { 
        id: 3, 
        category: 'ccp', 
        categoryAr: 'CCP',
        question: 'Refrigeration Temperature: Are ALL refrigeration units (walk-in, reach-in, under-counter) maintaining temperature at 5°C (41°F) or BELOW? Temperature checked at opening AND every 4 hours during operation with calibrated thermometer?', 
        questionAr: 'درجة حرارة التبريد: هل جميع وحدات التبريد (المشي، العالية، تحت المنضدة) تحافظ على 5°C أو أقل؟ فحص الحرارة عند الفتح وكل 4 ساعات أثناء العمل بمقياس حرارة مُعايَر؟',
        maxScore: 2, 
        isCCP: true, 
        ccpWeight: 3, 
        requiresTemp: true, 
        tempMin: 0, 
        tempMax: 5,
        priority: 'CCP',
        criticalReason: 'Below 5°C stops bacterial growth. Above 5°C = rapid multiplication in Danger Zone (5-60°C).',
        guidance: 'Check at opening + every 4 hours. Log temps in record book. Keep thermometer calibrated. Never leave door open. Store thermometers in warmest part of fridge.',
        guidanceAr: 'فحص عند الفتح وكل 4 ساعات. سجّل temps في كتاب السجل. حافظ على معايرة المقياس. لا تترك الباب مفتوحًا. ضع المقاييس في warmest جزء من الثلاجة.'
      },
      { 
        id: 4, 
        category: 'ccp', 
        categoryAr: 'CCP',
        question: 'Hot Holding Temperature: Are ALL hot-held foods (soups, coffee, tea, milk, food in bain-marie) maintained at 63°C (145°F) or ABOVE? Temperature checked every hour with calibrated thermometer? Food heated to 74°C+ before placing in hot hold?', 
        questionAr: 'درجة حرارة التسخين: هل يتم الحفاظ على ALL hot-held foods (الشوربات، القهوة، الشاي، الألبان، food in bain-marie) عند 63°C أو أعلى؟ فحص الحرارة كل ساعة بمقياس حرارة مُعايَر؟ food يسخن إلى 74°C+ قبل وضعه في hot hold؟',
        maxScore: 2, 
        isCCP: true, 
        ccpWeight: 3, 
        requiresTemp: true, 
        tempMin: 63, 
        tempMax: 74,
        priority: 'CCP',
        criticalReason: 'Above 63°C prevents bacteria growth. Below 63°C for 2+ hours = DANGER. Bacteria multiply rapidly in Danger Zone.',
        guidance: 'Check every hour. If temp drops below 63°C, reheat to 74°C+ or discard within 2 hours. Stir food to ensure even heat. Cover containers. Use calibrated probe thermometer.',
        guidanceAr: 'فحص كل ساعة. إذا انخفضت الحرارة عن 63°C، أعد التسخين إلى 74°C+ أو تخلص خلال ساعتين. حرك food لضمان تساوي الحرارة. غطّ الحاويات. استخدم مقياس حرارة.'
      },
      { 
        id: 5, 
        category: 'ccp', 
        categoryAr: 'CCP',
        question: 'Allergen Awareness: Do staff ask customers about allergies before taking orders? Can staff identify common allergens in all menu items?', 
        questionAr: 'الوعي بالمسببات الحساسية: هل يسأل الموظفون عن الحساسية قبل أخذ الطلبات؟',
        maxScore: 2, 
        isCCP: true, 
        ccpWeight: 3,
        priority: 'CCP',
        criticalReason: 'Allergic reactions can be fatal. Staff must identify and warn about allergens.',
        guidance: 'Ask before order. Display allergen info. Train on dairy, gluten, nuts, soy, eggs.',
        guidanceAr: 'السؤال قبل الطلب. عرض معلومات الحساسية. تدريب على الألبان والغلوتين والمكسرات والصويا والبيض.'
      },
      { 
        id: 6, 
        category: 'ccp', 
        categoryAr: 'CCP',
        question: 'Cross-Contamination: Raw materials on bottom shelves? Color-coded boards? Equipment sanitized?', 
        questionAr: 'منع التلوث المتقاطع: هل المواد الخام مخزنة على الرفوف السفلية؟',
        maxScore: 2, 
        isCCP: true, 
        ccpWeight: 3,
        priority: 'CCP',
        criticalReason: 'Raw foods have bacteria that transfer to ready-to-eat foods, causing illness.',
        guidance: 'Raw proteins/dairy/eggs on BOTTOM shelves. Separate containers. Color-coded boards. Sanitize between uses.',
        guidanceAr: 'البروتينات/الألبان/البيض على الرفوف السفلية. حاويات منفصلة. ألواح ملونة. تعقيم بين الاستخدامات.'
      },
    ]
  },

  // ============================================
  // ⚡ HIGH PRIORITY (8 points)
  // ============================================
  {
    id: 'high-priority',
    name: '⚡ High Priority',
    nameAr: 'أولوية عالية',
    priority: 'HIGH',
    points: [
      { id: 2, category: 'hygiene', categoryAr: 'النظافة', question: 'Personal Grooming: Clean uniforms, hairnets, clean aprons, no jewelry except wedding band, short clean nails?', questionAr: 'المظهر الشخصي: أزيار نظيفة، أغطية شعر، مريولات نظيفة، لا مجوهرات؟', maxScore: 2, priority: 'HIGH' },
      { id: 7, category: 'operations', categoryAr: 'العمليات', question: 'FIFO Rotation: First-In-First-Out method? Receipt dates visible? Stock rotated during delivery and weekly?', questionAr: 'نظام FIFO: الوارد أولاً الصادر أولاً؟ تواريخ الاستلام مرئية؟', maxScore: 2, priority: 'HIGH' },
      { id: 8, category: 'operations', categoryAr: 'العمليات', question: 'Date Labeling: All prepared items labeled with prep date/time AND expiry date? Shelf life guidelines followed?', questionAr: 'وضع التواريخ: جميع العناصر المحضرة عليها تاريخ تحضير وانتهاء؟', maxScore: 2, priority: 'HIGH' },
      { id: 10, category: 'hygiene', categoryAr: 'النظافة', question: 'Equipment Sanitization: All food contact surfaces cleaned AND sanitized between uses? Correct sanitizer concentration?', questionAr: 'تعقيم المعدات: جميع الأسطح الملامسة للطعام مُعقَّمة؟', maxScore: 2, priority: 'HIGH' },
      { id: 37, category: 'service', categoryAr: 'الخدمة', question: 'Warm Greeting: Every customer acknowledged with smile and eye contact within 10 seconds of entering?', questionAr: 'ترحيب دافئ: كل عميل تم إشعاره بابتسامة واتصال بالعين خلال 10 ثوانٍ؟', maxScore: 2, priority: 'HIGH' },
      { id: 38, category: 'service', categoryAr: 'الخدمة', question: 'Order Accuracy: Every drink made exactly as ordered - correct size, milk type, espresso shots, syrup, temperature?', questionAr: 'دقة الطلب: كل مشروب مصنوع تماماً كما طلب - الحجم الصحيح، نوع الحليب، الشوتات؟', maxScore: 2, priority: 'HIGH' },
      { id: 21, category: 'beverage', categoryAr: 'المشروبات', question: 'Recipe Adherence: Every drink made exactly according to standard recipe card - correct shots, milk, syrup, ice?', questionAr: 'الالتزام بالوصفات: كل مشروب مصنوع وفقاً لبطاقة الوصفة القياسية؟', maxScore: 2, priority: 'HIGH' },
      { id: 27, category: 'operations', categoryAr: 'العمليات', question: 'Store Cleanliness: Entire store clean and presentable throughout the day? Bathroom checked every 2 hours?', questionAr: 'نظافة المتجر: المتجر نظيف ومُعرض طوال اليوم؟ الحمام فحص كل ساعتين؟', maxScore: 2, priority: 'HIGH' },
    ]
  },

  // ============================================
  // 📋 STANDARD (12 points)
  // ============================================
  {
    id: 'standard',
    name: '📋 Standard',
    nameAr: 'قياسي',
    priority: 'STANDARD',
    points: [
      { id: 9, category: 'storage', categoryAr: 'التخزين', question: 'Food Storage Separation: Raw proteins, eggs stored on bottom shelves? Separate containers? Items covered/sealed?', questionAr: 'فصل التخزين: البروتينات الخام والبيض على الرفوف السفلية؟ حاويات منفصلة؟', maxScore: 2, priority: 'STANDARD' },
      { id: 39, category: 'service', categoryAr: 'الخدمة', question: 'CONNECT Method: Staff use CONNECT - Confirm, Offer additions, Note requests, Connect personally, Express thanks?', questionAr: 'طريقة CONNECT: تأكيد، عرض الإضافات، ملاحظة الطلبات، التواصل شخصياً، أظهر الشكر؟', maxScore: 2, priority: 'STANDARD' },
      { id: 14, category: 'service', categoryAr: 'الخدمة', question: 'Upselling: Staff suggest relevant upgrades - larger sizes, extra shots, food pairings, seasonal specials?', questionAr: 'البيع الإضافي: اقتراح ترقيات - أحجام أكبر، شوتات إضافية، اقترانات طعام؟', maxScore: 2, priority: 'STANDARD' },
      { id: 15, category: 'service', categoryAr: 'الخدمة', question: 'Complaint Handling (LATTE): Listen, Apologize, Take action, Thank, Explain?', questionAr: 'التعامل مع الشكاوى (LATTE): استمع، اعتذر، اتخذ إجراء، اشكر، شرح؟', maxScore: 2, priority: 'STANDARD' },
      { id: 16, category: 'service', categoryAr: 'الخدمة', question: 'Product Knowledge: Staff explain ingredients, flavor profiles, caffeine content of signature drinks?', questionAr: 'معرفة المنتج: شرح المكونات وملفات النكهة ومحتوى الكافيين للمشروبات المميزة؟', maxScore: 2, priority: 'STANDARD' },
      { id: 19, category: 'beverage', categoryAr: 'المشروبات', question: 'Espresso Extraction: 25-30 seconds extraction? 25-30ml single, 50-60ml double? Golden-brown color?', questionAr: 'استخراج الإسبريسو: 25-30 ثانية؟ 25-30مل للفردي؟ لون بني ذهبي؟', maxScore: 2, priority: 'STANDARD' },
      { id: 20, category: 'beverage', categoryAr: 'المشروبات', question: 'Steamed Milk Temperature: Heated to 60-70°C? Temperature verified with thermometer?', questionAr: 'درجة حرارة الحليب المُبخر: 60-70°C؟ التحقق بمقياس حرارة؟', maxScore: 2, priority: 'STANDARD', requiresTemp: true, tempMin: 60, tempMax: 70 },
      { id: 22, category: 'beverage', categoryAr: 'المشروبات', question: 'Freshly Ground Coffee: Ground fresh for each order? No pre-ground sitting >30 minutes?', questionAr: 'القهوة المطحونة طازجة: طحن طازج لكل طلب؟ لا جلوس >30 دقيقة؟', maxScore: 2, priority: 'STANDARD' },
      { id: 23, category: 'beverage', categoryAr: 'المشروبات', question: 'Presentation: Cups clean, properly sized, presented with care? Latte art centered?', questionAr: 'التقديم: أكواب نظيفة، بالحجم الصحيح، مُقدمة بعناية؟ فن اللاتيه في المنتصف؟', maxScore: 2, priority: 'STANDARD' },
      { id: 26, category: 'operations', categoryAr: 'العمليات', question: 'Opening Procedures: Opening checklist completed - temperature checks, stock rotation, supply verification?', questionAr: 'إجراءات الفتح: قائمة الفتح مكتملة - فحص درجات الحرارة، تدوير المخزون؟', maxScore: 2, priority: 'STANDARD' },
      { id: 30, category: 'operations', categoryAr: 'العمليات', question: 'Closing Procedures: Closing checklist completed - equipment cleaned/shut off, stock stored, areas cleaned?', questionAr: 'إجراءات الإغلاق: قائمة الإغلاق مكتملة - المعدات نظيفة ومُغلقة، المخزون مُخزن؟', maxScore: 2, priority: 'STANDARD' },
      { id: 48, category: 'safety', categoryAr: 'السلامة', question: 'Safety Hazards: Store free of hazards - no wet floors without signs, no trailing cords, no blocked exits?', questionAr: 'مخاطر السلامة: المتجر خالٍ من المخاطر - لا أرضيات مبللة بدون علامات، لا مخارج طوارئ مسدودة؟', maxScore: 2, priority: 'STANDARD' },
    ]
  },

  // ============================================
  // 📋 ADDITIONAL POINTS (Full Mode Only)
  // ============================================
  {
    id: 'additional',
    name: '📋 Additional Points',
    nameAr: 'نقاط إضافية',
    priority: 'STANDARD',
    shortlistOnly: true, // Only show in full mode
    points: [
      { id: 17, category: 'service', categoryAr: 'الخدمة', question: 'Mobile Order Accuracy: Are mobile/online orders prepared correctly - correct items, modifications, special requests?', questionAr: 'دقة الطلبات المحمولة: هل الطلبات المحمولة مُعدة بشكل صحيح؟', maxScore: 2, priority: 'STANDARD' },
      { id: 18, category: 'service', categoryAr: 'الخدمة', question: 'Order Ready Notification: Customers notified when order ready (text/call/bell)? CONNECT method used (Confirm, Offer, Note, Connect, Thank)? Staff upsell relevant upgrades?', questionAr: 'إشعار جاهزية الطلب: تم إخطار العميل عند جاهزية طلبه (رسالة/مكالمة/جرس)؟ هل يستخدم الموظف طريقة CONNECT؟ هل يقترح ترقيات مناسبة؟', maxScore: 2, priority: 'STANDARD' },
      { id: 24, category: 'beverage', categoryAr: 'المشروبات', question: 'Blended Drinks: Ice ratio correct? blender noise normal? consistency smooth? no ice chunks?', questionAr: 'المشروبات المخلوطة: نسبة الثلج صحيحة؟ قوام ناعم؟', maxScore: 2, priority: 'STANDARD' },
      { id: 25, category: 'beverage', categoryAr: 'المشويات', question: 'Tea Preparation: Steeped for correct time? Water at right temperature? Fresh tea bags used?', questionAr: 'تحضير الشاي: نقع للوقت الصحيح؟ ماء بالحرارة المناسبة؟', maxScore: 2, priority: 'STANDARD' },
      { id: 28, category: 'operations', categoryAr: 'العمليات', question: 'Inventory Management: Stock levels adequate? Par levels maintained? Orders placed before running low?', questionAr: 'إدارة المخزون: مستويات المخزون كافية؟ أوامر وضعت قبل النفاد؟', maxScore: 2, priority: 'STANDARD' },
      { id: 29, category: 'operations', categoryAr: 'العمليات', question: 'Waste Management: Waste properly sorted? Recyclables separated? Grease trap cleaned?', questionAr: 'إدارة النفايات: النفايات مفروزة بشكل صحيح؟ فواصل القمامة؟', maxScore: 2, priority: 'STANDARD' },
      { id: 31, category: 'maintenance', categoryAr: 'الصيانة', question: 'Equipment Maintenance: Equipment clean and functional? No visible wear or damage?', questionAr: 'صيانة المعدات: المعدات نظيفة وظيفية؟ لا تلف واضح؟', maxScore: 2, priority: 'STANDARD' },
      { id: 32, category: 'maintenance', categoryAr: 'الصيانة', question: 'Coffee Machine: Group heads clean? Portafilters spotless? No coffee residue?', questionAr: 'آلة القهوة: رؤساء المجموعات نظيفة؟ لا بقايا قهوة؟', maxScore: 2, priority: 'STANDARD' },
      { id: 33, category: 'maintenance', categoryAr: 'الصيانة', question: 'Blenders: Blades sharp? Jars clean? No buildup or residue?', questionAr: 'الخلاطات: الشفرات حادة؟ الأبران نظيفة؟', maxScore: 2, priority: 'STANDARD' },
      { id: 34, category: 'maintenance', categoryAr: 'الصيانة', question: 'Refrigeration: Condenser coils clean? Door seals tight? No frost buildup?', questionAr: 'التبريد: ملفات المكثف نظيفة؟ أختام الأبواب محكمة؟', maxScore: 2, priority: 'STANDARD' },
      { id: 35, category: 'maintenance', categoryAr: 'الصيانة', question: 'HVAC: Store temperature comfortable? Filters clean? No unusual noises?', questionAr: 'التدفئة والتهوية: درجة حرارة المتجر مريحة؟ الفلاتر نظيفة؟', maxScore: 2, priority: 'STANDARD' },
      { id: 36, category: 'maintenance', categoryAr: 'الصيانة', question: 'Lighting: All lights working? Correct brightness? Menu boards readable?', questionAr: 'الإضاءة: جميع الأضواء تعمل؟ سطوع صحيح؟', maxScore: 2, priority: 'STANDARD' },
      { id: 11, category: 'safety', categoryAr: 'السلامة', question: 'Fire Safety: Extinguisher accessible? Exits clear? Evacuation plan posted?', questionAr: 'السلامة من الحرائق: extinguisher متاح؟ المخارج واضحة؟', maxScore: 2, priority: 'STANDARD' },
      { id: 12, category: 'safety', categoryAr: 'السلامة', question: 'Chemical Storage: Chemicals stored separately from food? Proper labels? Safety data sheets available?', questionAr: 'تخزين المواد الكيميائية: المواد الكيميائية منفصلة عن الطعام؟', maxScore: 2, priority: 'STANDARD' },
      { id: 13, category: 'safety', categoryAr: 'السلامة', question: 'First Aid: Kit stocked? Expired items replaced? Staff know location?', questionAr: 'الإسعافات الأولية: صندوق مُجهز؟ العناصر منتهية الاستبدال؟', maxScore: 2, priority: 'STANDARD' },
      { id: 40, category: 'hr', categoryAr: 'الموارد البشرية', question: 'Staffing: Adequate staff for volume? Breaks scheduled? No overtime issues?', questionAr: 'التوظيف: موظفين كافيين للvolume؟ فترات راحة مجدولة؟', maxScore: 2, priority: 'STANDARD' },
      { id: 41, category: 'hr', categoryAr: 'الموارد البشرية', question: 'Uniform Compliance: All staff in proper uniform? Name tags visible? Professional appearance?', questionAr: 'الزي الموحد: جميع الموظفين في زي مناسب؟ شارات الأسماء مرئية؟', maxScore: 2, priority: 'STANDARD' },
      { id: 42, category: 'hr', categoryAr: 'الموارد البشرية', question: 'Staff Attitude: Positive demeanor? Enthusiastic? Teamwork evident?', questionAr: 'موقف الموظفين: إيجابي؟ متحمس؟ عمل جماعي واضح؟', maxScore: 2, priority: 'STANDARD' },
      { id: 43, category: 'hr', categoryAr: 'الموارد البشرية', question: 'Knowledge Assessment: Can staff answer product questions? Know allergens? Understand procedures?', questionAr: 'تقييم المعرفة: يمكن للموظفين الإجابة على أسئلة المنتج؟', maxScore: 2, priority: 'STANDARD' },
      { id: 44, category: 'finance', categoryAr: 'المالية', question: 'Cash Handling: Cash drawer balanced? Proper procedures followed? No discrepancies?', questionAr: 'التعامل مع النقود: درج النقود متوازن؟ إجراءات صحيحة؟', maxScore: 2, priority: 'STANDARD' },
      { id: 45, category: 'finance', categoryAr: 'المالية', question: 'Price Accuracy: Menu prices match system? No pricing errors?', questionAr: 'دقة الأسعار: أسعار القائمة تطابق النظام؟', maxScore: 2, priority: 'STANDARD' },
      { id: 46, category: 'finance', categoryAr: 'المالية', question: 'Transaction Records: All transactions recorded? Receipts given? Tips properly distributed?', questionAr: 'سجلات المعاملات: جميع المعاملات مسجلة؟ إيصالات مُعطاة؟', maxScore: 2, priority: 'STANDARD' },
      { id: 47, category: 'security', categoryAr: 'الأمان', question: 'Theft Prevention: No shrinkage? Proper inventory controls? Security cameras functional?', questionAr: 'منع السرقة: لا نقص؟ ضوابط المخزون المناسبة؟', maxScore: 2, priority: 'STANDARD' },
      { id: 49, category: 'hr', categoryAr: 'الموارد البشرية', question: 'Staff Training: All staff completed required training? Training records current? New staff supervised?', questionAr: 'تدريب الموظفين: جميع الموظفين أكملوا التدريب المطلوب؟', maxScore: 2, priority: 'STANDARD' },
      { id: 50, category: 'safety', categoryAr: 'السلامة', question: 'Emergency Preparedness: Emergency contacts posted? Staff know procedures? Drills conducted?', questionAr: 'الاستعداد للطوارئ: أرقام الطوارئ مُعلقة؟ الموظفون يعرفون الإجراءات؟', maxScore: 2, priority: 'STANDARD' },
    ]
  },
];

// Shortlist = 25 points (5 CCP + 8 HIGH + 12 STANDARD)
// Shortlist = first 25 questions (IDs 1-25)
export function getShortlistPoints(): number[] {
  return Array.from({length: 25}, (_, i) => i + 1);
}

// Full audit = 50 points (all original questions)
export function getFullIds(): number[] {
  return Array.from({length: 50}, (_, i) => i + 1);
}

// Export priorities for UI
export const priorities = {
  CCP: { label: '🔴 CCP', color: 'red', weight: 3 },
  HIGH: { label: '⚡ High', color: 'yellow', weight: 2 },
  STANDARD: { label: '📋 Standard', color: 'gray', weight: 1 },
};
