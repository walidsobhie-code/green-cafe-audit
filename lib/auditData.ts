
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
        question: 'Hand Hygiene: Do all food handlers wash hands with soap for 20 seconds every 20 minutes AND after restroom use, touching face/hair, handling raw materials, waste, or contaminated surfaces?', 
        questionAr: 'غسل اليدين: هل جميع العاملين يغسلون أيديهم بالصابون لمدة 20 ثانية كل 20 دقيقة وبعد استخدام الحمام؟',
        maxScore: 2, 
        isCCP: true, 
        ccpWeight: 3, 
        priority: 'CCP',
        criticalReason: 'Hands spread most foodborne illnesses. Primary defense against contamination.',
        guidance: '20 seconds with soap, every 20 min + after restroom/face/hair/raw materials/waste/contaminated surfaces',
        guidanceAr: '20 ثانية بالصابون، كل 20 دقيقة + بعد الحمام/الوجه/الشعر/المواد الخام/النفايات'
      },
      { 
        id: 3, 
        category: 'ccp', 
        categoryAr: 'CCP',
        question: 'Refrigeration Temperature: Are all refrigeration units maintaining temperature at 5°C (41°F) or below? Temperature checked at opening and every 4 hours?', 
        questionAr: 'درجة حرارة التبريد: هل جميع وحدات التبريد تحافظ على 5°C أو أقل؟',
        maxScore: 2, 
        isCCP: true, 
        ccpWeight: 3, 
        requiresTemp: true, 
        tempMin: 0, 
        tempMax: 5,
        priority: 'CCP',
        criticalReason: 'Below 5°C stops bacterial growth. Above 5°C = rapid multiplication in Danger Zone.',
        guidance: 'Check at opening + every 4 hours. Log temperatures.',
        guidanceAr: 'فحص عند الفتح وكل 4 ساعات. تسجيل درجات الحرارة.'
      },
      { 
        id: 4, 
        category: 'ccp', 
        categoryAr: 'CCP',
        question: 'Hot Holding Temperature: Are all hot-held foods maintained at 63°C (145°F) or above? Temperature checked every hour?', 
        questionAr: 'درجة حرارة التسخين: هل يتم الحفاظ على 63°C أو أعلى؟',
        maxScore: 2, 
        isCCP: true, 
        ccpWeight: 3, 
        requiresTemp: true, 
        tempMin: 63, 
        tempMax: 74,
        priority: 'CCP',
        criticalReason: 'Above 63°C prevents bacteria. Below 63°C for 2+ hours = food safety risk.',
        guidance: 'Check every hour. Discard if below 63°C for 2+ hours.',
        guidanceAr: 'فحص كل ساعة. التخلص إذا أقل من 63°C لمدة ساعتين.'
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
        question: 'Cross-Contamination Prevention: Are raw materials stored on bottom shelves below ready-to-eat foods? Color-coded cutting boards? Equipment sanitized between uses?', 
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
      { id: 10, category: 'hygiene', categoryAr: 'النظافة', question: 'Equipment Sanitization: All food contact surfaces cleaned AND sanitized between uses? Correct sanitizer concentration?', questionAr: 'تعقيم المعدات: جميع الأسطح الملامسة للطعامmw清净 وتعقيم؟', maxScore: 2, priority: 'HIGH' },
      { id: 11, category: 'service', categoryAr: 'الخدمة', question: 'Warm Greeting: Every customer acknowledged with smile and eye contact within 10 seconds of entering?', questionAr: 'ترحيب دافئ: كل عميل تم إشعاره بابتسامة واتصال بالعين خلال 10 ثوانٍ؟', maxScore: 2, priority: 'HIGH' },
      { id: 12, category: 'service', categoryAr: 'الخدمة', question: 'Order Accuracy: Every drink made exactly as ordered - correct size, milk type, espresso shots, syrup, temperature?', questionAr: 'دقة الطلب: كل مشروب مصنوع تماماً كما طلب - الحجم الصحيح، نوع الحليب، الشوتات؟', maxScore: 2, priority: 'HIGH' },
      { id: 21, category: 'beverage', categoryAr: 'المشروبات', question: 'Recipe Adherence: Every drink made exactly according to standard recipe card - correct shots, milk, syrup, ice?', questionAr: 'الالتزام بالوصفات: كل مشروب مصنوع وفقاً لبطاقة الوصفة القياسية؟', maxScore: 2, priority: 'HIGH' },
      { id: 27, category: 'operations', categoryAr: 'العمليات', question: 'Store Cleanliness: Entire store clean and presentable throughout the day? Bathroom checked every 2 hours?', questionAr: 'نظافة المتجر:整个 المتجر نظيف ومُعرض طوال اليوم؟ الحمام فحص كل ساعتين؟', maxScore: 2, priority: 'HIGH' },
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
      { id: 13, category: 'service', categoryAr: 'الخدمة', question: 'CONNECT Method: Staff use CONNECT - Confirm, Offer additions, Note requests, Connect personally, Express thanks?', questionAr: 'طريقة CONNECT: تأكيد، عرض الإضافات، ملاحظة الطلبات، التواصل شخصياً، express الشكر؟', maxScore: 2, priority: 'STANDARD' },
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
];

// Shortlist = 25 points (5 CCP + 8 HIGH + 12 STANDARD)
export function getShortlistPoints(): number[] {
  const points: number[] = [];
  auditCategories.forEach(cat => {
    cat.points.forEach(p => points.push(p.id));
  });
  return points.sort((a, b) => a - b);
}

// Full audit = 25 points (same as shortlist for optimized version)
// Keep for compatibility
export function getFullIds(): number[] {
  return getShortlistPoints();
}

// Export priorities for UI
export const priorities = {
  CCP: { label: '🔴 CCP', color: 'red', weight: 3 },
  HIGH: { label: '⚡ High', color: 'yellow', weight: 2 },
  STANDARD: { label: '📋 Standard', color: 'gray', weight: 1 },
};