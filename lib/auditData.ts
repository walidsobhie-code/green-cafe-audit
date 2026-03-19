// Green Cafe Audit - 50 Points (Balanced Length)
// Shortlist = 25 points | Full = 50 points

export interface AuditPoint {
  id: number;
  category: string;
  categoryAr: string;
  question: string;
  questionAr: string;
  maxScore: number;
  isCCP?: boolean;
  ccpWeight?: number;
  requiresTemp?: boolean;
  tempMin?: number;
  tempMax?: number;
  criticalReason?: string;
}

export interface AuditCategory {
  id: string;
  name: string;
  nameAr: string;
  points: AuditPoint[];
}

export const auditCategories: AuditCategory[] = [
  // Category 1: Food Safety - 10 questions
  {
    id: 'food-safety',
    name: 'Food Safety & Hygiene',
    nameAr: 'السلامة الغذائية والنظافة',
    points: [
      { id: 1, category: 'food-safety', categoryAr: 'السلامة', question: 'Hand Hygiene: Do all food handlers wash hands with soap for 20 seconds every 20 minutes AND after restroom use, touching face/hair, handling raw materials, waste, or contaminated surfaces?', questionAr: 'غسل اليدين: هل جميع العاملين يغسلون أيديهم بالصابون لمدة 20 ثانية كل 20 دقيقة وبعد استخدام الحمام، لمس الوجه/الشعر، التعامل مع المواد الخام، النفايات، أو الأسطح الملوثة؟', maxScore: 2, isCCP: true, ccpWeight: 3, criticalReason: 'Hands spread most foodborne illnesses. Primary defense against contamination.' },
      { id: 2, category: 'food-safety', categoryAr: 'السلامة', question: 'Personal Grooming: Are all staff wearing clean, properly buttoned uniforms with hairnets covering all hair, clean aprons changed when soiled, no jewelry except wedding band, short clean nails without polish?', questionAr: 'المظهر الشخصي: هل يرتدي جميع الموظفين أزيار نظيفة ومزودة بشكل صحيح مع أغطية شعر تغطي جميع الشعر، مريولات نظيفة يتم تغييرها عند الاتساخ، لا مجوهرات إلا خاتم زفاف، أظافر قصيرة نظيفة بدون طلاء؟', maxScore: 2, criticalReason: 'Proper grooming prevents physical contamination from hair, skin, and jewelry.' },
      { id: 3, category: 'food-safety', categoryAr: 'السلامة', question: 'Refrigeration Temperature: Are all refrigeration units maintaining temperature at 5°C (41°F) or below? Is temperature checked and logged at opening and every 4 hours throughout the day?', questionAr: 'درجة حرارة التبريد: هل تحافظ جميع وحدات التبريد على درجة حرارة 5°C (41°F) أو أقل؟ هل يتم فحص وتسجيل درجة حرارة الفتح وكل 4 ساعات طوال اليوم؟', maxScore: 2, isCCP: true, ccpWeight: 3, requiresTemp: true, tempMin: 0, tempMax: 5, criticalReason: 'Below 5°C stops bacterial growth. Above 5°C = rapid multiplication in Danger Zone.' },
      { id: 4, category: 'food-safety', categoryAr: 'السلامة', question: 'Hot Holding Temperature: Are all hot-held foods maintained at 63°C (145°F) or above? Is temperature checked and logged every hour? Is any food in Danger Zone (below 63°C) for more than 2 hours discarded immediately?', questionAr: 'درجة حرارة التسخين: هل يتم الحفاظ على جميع foods المحفوظة ساخنة عند 63°C (145°F) أو أعلى؟ هل يتم فحص وتسجيل درجة الحرارة كل ساعة؟ هل يتم التخلص من أي طعام في Zone الخطر (أقل من 63°C) لأكثر من ساعتين فوراً؟', maxScore: 2, isCCP: true, ccpWeight: 3, requiresTemp: true, tempMin: 63, tempMax: 74, criticalReason: 'Above 63°C prevents bacteria. Below 63°C for 2+ hours = food safety risk.' },
      { id: 5, category: 'food-safety', categoryAr: 'السلامة', question: 'Allergen Awareness: Do staff proactively ask customers about food allergies before taking orders? Is allergen information available for all menu items? Can staff identify common allergens (dairy, gluten, nuts, soy, eggs) in key drinks?', questionAr: 'الوعي بالمسببات الحساسية: هل يسأل الموظفون بشكل استباقي العملاء عن الحساسية الغذائية قبل أخذ الطلبات؟ هل معلومات الحساسية متاحة لجميع أصناف القائمة؟ هل يستطيع الموظفون تحديد المواد المسببة للحساسية الشائعة (الألبان، الغلوتين، المكسرات، الصويا، البيض) في المشروبات الرئيسية؟', maxScore: 2, isCCP: true, ccpWeight: 3, criticalReason: 'Allergic reactions can be fatal. Staff must identify and warn about allergens.' },
      { id: 6, category: 'food-safety', categoryAr: 'السلامة', question: 'Cross-Contamination Prevention: Are raw materials (especially dairy, eggs, raw proteins) stored on bottom shelves below and completely separate from ready-to-eat foods? Are color-coded cutting boards used? Is equipment cleaned and sanitized between uses?', questionAr: 'منع التلوث المتقاطع: هل يتم تخزين المواد الخام (خاصة الألبان، البيض، البروتينات الخام) على الرفوف السفلية تماماً ومنفصلة عن foods الجاهزة للأكل؟ هل تُستخدم ألواح تقطيع ملونة؟ هل يتم تنظيف وتعقيم المعدات بين الاستخدامات؟', maxScore: 2, isCCP: true, ccpWeight: 3, criticalReason: 'Raw foods have bacteria that transfer to ready-to-eat foods, causing illness.' },
      { id: 7, category: 'food-safety', categoryAr: 'السلامة', question: 'FIFO Rotation: Are all food products stored using First-In-First-Out method where new deliveries go to back and older items pulled to front? Are receipt dates visible on all items? Is stock rotated during each delivery and weekly?', questionAr: 'نظام FIFO: هل يتم تخزين جميع المنتجات الغذائية باستخدام طريقة الوارد أولاً صادراً أولاً حيث توضع التوريدات الجديدة بالخلف والعناصر القديمة تُسحب للأمام؟ هل تواريخ الاستلام مرئية على جميع العناصر؟ هل يتم تدوير المخزون أثناء كل توريد وأسبوعياً؟', maxScore: 2, criticalReason: 'FIFO prevents serving expired products and reduces waste.' },
      { id: 8, category: 'food-safety', categoryAr: 'السلامة', question: 'Date Labeling: Are all prepared items (pre-made drinks, sauces, syrups once opened, in-house items) clearly labeled with prep date/time AND expiry date? Are shelf life guidelines followed? Are labels clear and visible?', questionAr: 'وضع التواريخ: هل يتم وضع ملصقات واضحة على جميع العناصر المحضرة (مشروبات جاهزة، صلصات، شرابات بمجرد فتحها، عناصر домаية) مع تاريخ/وقت التحضير AND تاريخ الانتهاء؟ هل يتم الالتزام بإرشادات shelf life؟ هل الملصقات واضحة ومرئية؟', maxScore: 2, criticalReason: 'Without proper dating, impossible to determine if food is safe to consume.' },
      { id: 9, category: 'food-safety', categoryAr: 'السلامة', question: 'Food Storage Separation: Are raw proteins, eggs, and unpasteurized items stored on bottom shelves below ready-to-eat foods? Are separate containers used for raw materials? Are all items properly covered/sealed? Is storage temperature-appropriate for each product?', questionAr: 'فصل التخزين: هل يتم تخزين البروتينات الخام والبيض والعناصر غير المبسترة على الرفوف السفلية تحت foods الجاهزة للأكل؟ هل تُستخدم حاويات منفصلة للمواد الخام؟ هل جميع العناصر مغطاة/مغلقة بشكل صحيح؟ هل درجة حرارة التخزين مناسبة لكل منتج؟', maxScore: 2, isCCP: true, ccpWeight: 3, criticalReason: 'Raw juices contaminate ready-to-eat foods. Top cause of outbreaks.' },
      { id: 10, category: 'food-safety', categoryAr: 'السلامة', question: 'Equipment Sanitization: Are all food contact surfaces (blender bases, shaker tins, steam wands, countertops, cutting boards, utensils) cleaned AND sanitized between uses? Is sanitizer at correct concentration? Are supplies readily available?', questionAr: 'تعقيم المعدات: هل يتم تنظيف وتعقيم جميع أسطح ملامسة food (قواعد الخلاط، أوعية الرج، أعواد البخار، أسطح العمل، ألواح التقطيع، الأدوات) بين الاستخدامات؟ هل التعقيم بالتركيز الصحيح؟ هل المستلزمات متاحة بسهولة؟', maxScore: 2, criticalReason: 'Sanitization kills remaining bacteria. Critical final step for safety.' },
    ]
  },
  // Category 2: Customer Service - 8 questions
  {
    id: 'customer-service',
    name: 'Customer Experience',
    nameAr: 'تجربة العميل',
    points: [
      { id: 11, category: 'customer', categoryAr: 'العملاء', question: 'Warm Greeting: Is every customer acknowledged with a warm smile and eye contact within 10 seconds of entering? Does the greeting feel genuine and welcoming, not rushed or forced?', questionAr: 'ترحيب دافئ: هل يتم إشعار كل عميل بابتسامة دافئة واتصال بالعين خلال 10 ثوانٍ من الدخول؟ هل الشعور بالترحيب حقيقي ومرحّب، وليس متسرعاً أو مصطنعاً؟', maxScore: 2 },
      { id: 12, category: 'customer', categoryAr: 'العملاء', question: 'Order Accuracy: Is every drink made exactly as ordered - correct size, milk type, espresso shots, syrup flavors/quantity, temperature, and customizations? Does staff read back the order to verify?', questionAr: 'دقة الطلب: هل يتم تحضير كل مشروب تماماً كما طلب - الحجم الصحيح، نوع الحليب، شوتات القهوة، نكهات/كمية الشراب، الحرارة، والتخصيصات؟ هل يقرأ الموظف الطلب للعميل للتأكد؟', maxScore: 2 },
      { id: 13, category: 'customer', categoryAr: 'العملاء', question: 'CONNECT Method: Does staff use CONNECT for every transaction - Confirm order details, Offer additions, Note special requests, Connect with customer personally, Express thanks?', questionAr: 'طريقة CONNECT: هل يستخدم الموظفون CONNECT لكل معاملة - تأكيد تفاصيل الطلب، عرض الإضافات، ملاحظة الطلبات الخاصة، التواصل مع العميل شخصياً، express الشكر؟', maxScore: 2 },
      { id: 14, category: 'customer', categoryAr: 'العملاء', question: 'Upselling: Does staff proactively suggest relevant upgrades and additions such as larger sizes, extra shots, food pairings, seasonal specials, or loyalty program signup? Are suggestions natural, not pushy?', questionAr: 'البيع الإضافي: هل يقترح الموظفون بشكل استباقي ترقيات وإضافات مناسبة مثل الأحجام الأكبر، الشوتات الإضافية، اقترانات الطعام، الموسميات، أو تسجيل برنامج الولاء؟ هل الاقتراحات طبيعية وليست ضاغطة؟', maxScore: 2 },
      { id: 15, category: 'customer', categoryAr: 'العملاء', question: 'Complaint Handling (LATTE): When a customer has a complaint, does staff fully Listen without interrupting, offer a sincere Apology, Take immediate action, Thank the customer, and Explain what went wrong?', questionAr: 'التعامل مع الشكاوى (LATTE): عندما يكون لدى العميل شكوى، هل يستمع الموظف بالكامل بدون انقطاع، يقدم اعتذاراً صادقاً، يتخذ إجراءً فورياً، يشكر العميل، ويشرح ما الخطأ؟', maxScore: 2 },
      { id: 16, category: 'customer', categoryAr: 'العملاء', question: 'Product Knowledge: Can staff thoroughly explain the ingredients, flavor profiles, caffeine content, and sourcing of at least 3 signature drinks? Can they recommend drinks based on customer preferences?', questionAr: 'معرفة المنتج: هل يستطيع الموظفون شرح المكونات وملفات النكهة ومحتوى الكافيين ومصادر 3 مشروبات مميزة على الأقل؟ هل يستطيعون التوصية بالمشروبات بناءً على تفضيلات العملاء؟', maxScore: 2 },
      { id: 17, category: 'customer', categoryAr: 'العملاء', question: 'Payment Processing: Is the correct amount charged for each order? Is proper change given? Is the payment method confirmed before processing? Is a receipt offered? For cash over $20, is it counted twice?', questionAr: 'معالجة الدفع: هل يتم charge المبلغ الصحيح لكل طلب؟ هل يُعطى التغيير الصحيح؟ هل يتم تأكيد طريقة الدفع قبل المعالجة؟ هل يُعرض إيصال؟ للنقد أكثر من 20 دولار، هل يُعد مرتين؟', maxScore: 2 },
      { id: 18, category: 'customer', categoryAr: 'العملاء', question: 'Thank You / Closing: Does every customer receive a genuine thank you at the end of their transaction, with a warm smile and eye contact? Is there acknowledgment that they are valued and welcome to return?', questionAr: 'الشكر / الإغلاق: هل receives كل عميل شكراً حقيقياً في نهاية معاملته، مع ابتسامة دافئة واتصال بالعين؟ هل هناك إشعار بأنهم مُقدَّرون ومرحب بهم للعودة؟', maxScore: 2 },
    ]
  },
  // Category 3: Beverage Quality - 7 questions
  {
    id: 'beverage-quality',
    name: 'Beverage Quality',
    nameAr: 'جودة المشروبات',
    points: [
      { id: 19, category: 'beverage', categoryAr: 'المشروبات', question: 'Espresso Extraction: Does the espresso extraction take 25-30 seconds for optimal flavor? Is the resulting shot 25-30ml for single or 50-60ml for double, with golden-brown color showing tiger striping?', questionAr: 'استخراج الإسبريسو: هل يستغرق استخراج الإسبريسو 25-30 ثانية للنكهة المثلى؟ هل resulting shot هو 25-30ml للفردي أو 50-60ml للثنائي، مع لون بني ذهبي يظهر tiger striping؟', maxScore: 2, isCCP: true, ccpWeight: 3, criticalReason: '<25s = sour/weak. >30s = bitter. 25-30s = perfect extraction.' },
      { id: 20, category: 'beverage', categoryAr: 'المشروبات', question: 'Steamed Milk Temperature: Is steamed milk heated to 60-70°C (ideally 65°C)? Is temperature verified with a thermometer? Below 60°C is a safety risk, above 70°C scalds the milk and destroys sweetness.', questionAr: 'درجة حرارة الحليب المُبخر: هل يتم تسخين الحليب المُبخر إلى 60-70°C (من الناحية المثالية 65°C)? هل يتم التحقق من درجة الحرارة بمقياس حرارة؟ أقل من 60°C خطر سلامة، أكثر من 70°C يحرق milk.', maxScore: 2, requiresTemp: true, tempMin: 60, tempMax: 70, criticalReason: '<60°C = bacteria risk. >70°C = burnt taste. 60-70°C = perfect.' },
      { id: 21, category: 'beverage', categoryAr: 'المشروبات', question: 'Recipe Adherence: Is every drink made exactly according to the standard recipe card - correct number of espresso shots, milk quantity, syrup pumps, ice level, and all specifications? Are recipe cards accessible?', questionAr: 'الالتزام بالوصفات: هل يتم تحضير كل مشروب تماماً according toبطاقة الوصفة القياسية - عدد صحيح من شوتات القهوة، كمية milk، مضخات شراب، مستوى ثلج، وجميع المواصفات؟ هل بطاقات الوصفات accessible؟', maxScore: 2 },
      { id: 22, category: 'beverage', categoryAr: 'المشروبات', question: 'Freshly Ground Coffee: Is coffee ground fresh for each order (within seconds of extraction)? Is pre-ground coffee not sitting in the hopper for more than 30 minutes? Does ground coffee have strong aromatic smell?', questionAr: 'القهوة المطحونة طازجة: هل يتم طحن القهوة طازجة لكل طلب (خلال ثوانٍ من الاستخراج)? هل القهوة المطحونة مسبقاً لا تجلس في hopper لأكثر من 30 دقيقة? هل القهوة المطحونة لها رائحة عطرية قوية؟', maxScore: 2 },
      { id: 23, category: 'beverage', categoryAr: 'المشروبات', question: 'Presentation: Are cups clean (no fingerprints, residue), properly sized for the drink ordered, and presented with care? Is latte art centered and neat on appropriate drinks? Are hot drinks served with sleeves when needed?', questionAr: 'التقديم: هل الأكواب نظيفة (لا بصمات، بقع)، الحجم correct للمشروب المطلوب، ومُقدمة بعناية? هل فن اللاتيه centered وأنيق على المشروبات المناسبة? هل المشروبات الساخنة تُقدم مع sleeves عند الحاجة?', maxScore: 2 },
      { id: 24, category: 'beverage', categoryAr: 'المشروبات', question: 'Quality Verification: Does the barista visually inspect each drink before serving - checking correct milk type, proper foam level, accurate syrup amount, and overall appearance? Does the drink match order specifications?', questionAr: 'التحقق من الجودة: هل يقوم الباريستا بفحص بصري لكل مشروب قبل التقديم - يتحقق من نوع milk الصحيح، مستوى رغوة صحيح، كمية شراب دقيقة، والمظهر العام? هل المشروب يتطابق مع مواصفات الطلب؟', maxScore: 2, isCCP: true, ccpWeight: 3, criticalReason: 'Visual inspection catches errors before customer receives them.' },
      { id: 25, category: 'beverage', categoryAr: 'المشروبات', question: 'Correct Cup Sizing: Is each drink served in the correct cup size for its category to maintain proper liquid-to-foam ratio, comfortable drinking experience, and appropriate temperature retention?', questionAr: 'حجم الكوب الصحيح: هل يُقدم كل مشروب في حجم الكوب الصحيح لفئته maintain نسبة سائل إلى رغوة صحيحة، تجربة饮用 مريحة، والاحتفاظ بدرجة حرارة مناسبة؟', maxScore: 2 },
    ]
  },
  // Category 4: Operations - 5 questions
  {
    id: 'operations',
    name: 'Store Operations',
    nameAr: 'عمليات المتجر',
    points: [
      { id: 26, category: 'operations', categoryAr: 'العمليات', question: 'Opening Procedures: Is the opening checklist completed in full before the store opens - including temperature checks of all equipment, stock rotation, supply verification, cleanliness inspection, equipment test, and sign-off?', questionAr: 'إجراءات الفتح: هل قائمة الفتح مُكتملة بالكامل قبل فتح المتجر - بما في ذلك فحص درجات حرارة جميع المعدات، تدوير المخزون، التحقق من المستلزمات، فحص النظافة، اختبار المعدات، والتوقيع؟', maxScore: 2 },
      { id: 27, category: 'operations', categoryAr: 'العمليات', question: 'Store Cleanliness: Is the entire store (floor, counters, equipment, bathroom, dining area) clean and presentable throughout the day? Is the bathroom checked and cleaned at minimum every 2 hours?', questionAr: 'نظافة المتجر: هل整个 المتجر (الأرضية، العدادات، المعدات، الحمام، منطقة تناول الطعام) نظيف ومُعرض طوال اليوم? هل يتم فحص وتنظيف الحمام كل ساعتين كحد أدنى؟', maxScore: 2 },
      { id: 28, category: 'operations', categoryAr: 'العمليات', question: 'POS System Functionality: Is the point-of-sale system fully functional with all menu items available, current pricing loaded, promotions correctly applied, and responsive? Are any system issues reported and resolved immediately?', questionAr: 'وظيفة نظام POS: هل نظام نقاط البيع يعمل بالكامل مع جميع عناصر القائمة المتاحة، التسعير current loaded، العروض correctly applied، وresponsive? هل أي مشاكل في النظام reported وresolved فوراً؟', maxScore: 2 },
      { id: 29, category: 'operations', categoryAr: 'العمليات', question: 'Store Ambiance: Is the store environment comfortable with appropriate lighting (not too bright or dim), background music at suitable volume, temperature maintained at comfortable levels (not too hot or cold)?', questionAr: 'بيئة المتجر: هل بيئة المتجر مريحة مع إضاءة مناسبة (ليست bright جداً أو dim جداً)، موسيقى خلفية بمستوى صوت مناسب، درجة حرارة maintained at levels مريحة (ليست ساخنة جداً أو باردة جداً)?', maxScore: 2 },
      { id: 30, category: 'operations', categoryAr: 'العمليات', question: 'Closing Procedures: Is the closing checklist completed in full at end of day - including all equipment properly cleaned and turned off, stock rotated and correctly stored, all areas cleaned, money counted and secured, alarm set?', questionAr: 'إجراءات الإغلاق: هل قائمة الإغلاق مُكتملة بالكامل في نهاية اليوم - بما في ذلك جميع المعدات properly cleaned وأُغلقت بشكل صحيح، المخزون rotated وstored بشكل صحيح، جميع المناطق cleaned، Money counted وsecured، alarm set؟', maxScore: 2 },
    ]
  },
  // Extended Categories (31-50)
  {
    id: 'food-safety-ext',
    name: 'Food Safety Extended',
    nameAr: 'السلامة - إضافي',
    points: [
      { id: 31, category: 'food-safety', categoryAr: 'السلامة', question: 'Chemical Storage: Are all cleaning chemicals, sanitizers, and cleaning agents stored in a designated area completely separate from food products - never on shelves above or near food items?', questionAr: 'تخزين المواد الكيميائية: هل يتم تخزين جميع مواد التنظيف والتعقيم في منطقة مُخصصة completely منفصلة عن منتجات food - never على الرفوف above أو بالقرب من عناصر food؟', maxScore: 2 },
      { id: 32, category: 'food-safety', categoryAr: 'السلامة', question: 'Pest Control: Is there no evidence of pest activity in the store - no droppings, no nests, no damaged packaging, no pest sightings? Is there a contracted pest control service with documented records?', questionAr: 'مكافحة الآفات: هل لا يوجد دليل على نشاط الآفات في المتجر - no براز، no أعشاش، no تغليف تالف، no رؤية للآفات? هل هناك خدمة مكافحة آفات متعاقد عليها مع سجلات موثقة؟', maxScore: 2 },
      { id: 33, category: 'food-safety', categoryAr: 'السلامة', question: 'Waste Management: Are waste bins properly used with food waste in designated bins, recyclables properly separated, and general waste properly bagged? Is trash removed regularly throughout the day?', questionAr: 'إدارة النفايات: هل تُستخدم صناديق النفايات بشكل صحيح مع نفايات food في صناديق مُخصصة، المعادلات properly separated، والنفايات العامة properly bagged? هل تتم إزالة القمامة بانتظام throughout اليوم؟', maxScore: 2 },
      { id: 34, category: 'food-safety', categoryAr: 'السلامة', question: 'Water Quality: Is only clean, potable water used for all food preparation and cleaning? Is the water source verified as safe? Is ice made from potable water? Are water filters changed per manufacturer schedule?', questionAr: 'جودة المياه: هل تُستخدم مياه نظيفة وصالحة للشرب لجميع تحضير food والتنظيف? هل يتم التحقق من مصدر المياه comme آمن? هل الجليد made from مياه صالحة للشرب? هل تُغير فلاتر المياه per جدول الشركة المصنعة؟', maxScore: 2 },
      { id: 35, category: 'food-safety', categoryAr: 'السلامة', question: 'Approved Suppliers: Are all food suppliers approved and verified through proper vendor verification process? Is the approved supplier list current with no use of unverified or random suppliers?', questionAr: 'الموردون المُعتمدون: هل جميع موردين food مُعتمدون ومُتحقق من خلال عملية التحقق من المورد? هل قائمة الموردين المُعتمدين current مع no استخدام من موردين غير مُتحققين أو عشوائيين؟', maxScore: 2 },
    ]
  },
  {
    id: 'customer-ext',
    name: 'Customer Extended',
    nameAr: 'العملاء - إضافي',
    points: [
      { id: 36, category: 'customer', categoryAr: 'العملاء', question: 'Professional Appearance: Do all staff maintain neat, professional appearance meeting brand standards - clean uniforms, proper grooming, branded apron visible, name tag displayed?', questionAr: 'المظهر المهني: هل يحافظ جميع الموظفين على مظهر نظيف ومهني meeting معايير العلامة التجارية - أزيار نظيفة، grooming مناسب، مريول العلامة التجارية مرئي، name tag displayed؟', maxScore: 2 },
      { id: 37, category: 'customer', categoryAr: 'العملاء', question: 'Positive Body Language: Do staff display open, welcoming, and attentive body language - good eye contact, uncrossed arms, facing the customer, not looking at phone during interaction?', questionAr: 'لغة جسد إيجابية: هل يُظهر الموظفون لغة جسد مفتوحة ومنتبهة ومرحبة - اتصال بالعين جيد، ذراعين غير متقاطعتين، facing العميل، not looking at phone during التفاعل؟', maxScore: 2 },
      { id: 38, category: 'customer', categoryAr: 'العملاء', question: 'Service Speed: Are drinks prepared within standard time (2-3 minutes for espresso-based drinks, 4-5 minutes for complex orders)? Do staff work efficiently and inform customers of wait times?', questionAr: 'سرعة الخدمة: هل تُحضر المشروبات within الوقت القياسي (2-3 دقائق للمشروبات القائمة على espresso، 4-5 دقائق للطلبات المعقدة)? هل يعمل الموظفون بكفاءة ويُعلمون العملاء بأوقات الانتظار؟', maxScore: 2 },
      { id: 39, category: 'customer', categoryAr: 'العملاء', question: 'Mobile Order Functionality: If the store accepts mobile orders, does the system function properly - orders appear in queue correctly, staff acknowledge, preparation follows standard timing?', questionAr: 'وظيفة الطلب المحمول: إذا كان المتجر accepts الطلبات المحمولة، هل النظام يعمل بشكل صحيح - الطلبات appear في queue بشكل صحيح، الموظفون acknowledges، التحضير follows التوقيت القياسي؟', maxScore: 2 },
      { id: 40, category: 'customer', categoryAr: 'العملاء', question: 'Digital Payment Options: Are all digital payment methods (Apple Pay, Google Pay, Samsung Pay, contactless cards) properly functional and accepted without issues?', questionAr: 'خيارات الدفع الرقمي: هل جميع طرق الدفع الرقمية (Apple Pay، Google Pay، Samsung Pay، البطاقات اللاتلامسية) properly functional وaccepted بدون مشاكل؟', maxScore: 2 },
    ]
  },
  {
    id: 'beverage-ext',
    name: 'Beverage Extended',
    nameAr: 'المشروبات - إضافي',
    points: [
      { id: 41, category: 'beverage', categoryAr: 'المشروبات', question: 'Brewed Coffee Freshness: Is brewed coffee (for batch brew, pour-over, or coffee servers) made fresh and discarded if older than 30 minutes? Does brewed coffee maintain proper temperature of 80-85°C?', questionAr: 'freshness القهوة المطهوة: هل القهوة المطهوة (للbatch brew، pour-over، أو coffee servers) made طازجة ومُDiscarded if older من 30 دقيقة? هل تحافظ القهوة المطهوة على درجة حرارة مناسبة من 80-85°C؟', maxScore: 2 },
      { id: 42, category: 'beverage', categoryAr: 'المشروبات', question: 'Espresso Machine Daily Maintenance: Is the espresso machine cleaned daily per proper procedures - group heads flushed, portafilters cleaned, steam wands wiped, drip tray emptied and cleaned?', questionAr: 'الصيانة اليومية لآلة الإسبريسو: هل يتم تنظيف آلة espresso يومياً per إجراءات صحيحة - رؤيات group flushed، portfilters cleaned، أعواد البخار wiped، صينية بالتنقيط emptied وcleaned؟', maxScore: 2 },
      { id: 43, category: 'beverage', categoryAr: 'المشروبات', question: 'Milk and Dairy Freshness: Are all milk and dairy alternatives within expiration date and properly stored? Once opened, are products dated and used within safe timeframe (typically 7-10 days)?', questionAr: 'freshness الحليب ومنتجات الألبان: هل جميع الحليب وبدائل الألبان within تاريخ الانتهاء ومُخزن بشكل صحيح? Once opened، هل المنتجات مؤرخة وused within الإطار الزمني الآمن (typically 7-10 days)؟', maxScore: 2 },
      { id: 44, category: 'beverage', categoryAr: 'المشروبات', question: 'Syrup Expiration: Are all syrups within their expiration date? For opened syrups, are they used within 30 days of opening? Are bottles properly sealed and stored per manufacturer recommendations?', questionAr: 'انتهاء الشرابات: هل جميع الشرابات within تاريخ الانتهاء الخاص بها? للشرابات المفتوحة، هل تُستخدم within 30 يوم من الفتح? هل الزجاجات properly sealed وstored per توصيات الشركة المصنعة؟', maxScore: 2 },
      { id: 45, category: 'beverage', categoryAr: 'المشوبات', question: 'Blending Technique: Are blended drinks (frappuccinos, smoothies, blended teas) made with proper technique - correct sequence of ingredients, appropriate blending time, proper ice-to-base ratio?', questionAr: 'تقنية الخلط: هل تُحضر المشروبات المخلطة (frappuccinos، smoothies، الشاي المخلوط) avec تقنية صحيحة - تسلسل صحيح من المكونات، وقت خلط مناسب، نسبة ثلج إلى base صحيحة؟', maxScore: 2 },
    ]
  },
  {
    id: 'operations-ext',
    name: 'Operations Extended',
    nameAr: 'العمليات - إضافي',
    points: [
      { id: 46, category: 'operations', categoryAr: 'العمليات', question: 'Inventory Management: Are inventory levels monitored and tracked with par levels maintained? Are low-stock items identified and ordered before depletion to prevent out-of-stock during service?', questionAr: 'إدارة المخزون: هل مستويات المخزون monitored وtracked مع المستويات الدنيا maintained? هل عناصر المخزون المنخفضة identified وordered before النفاد لمنع out-of-stock during الخدمة؟', maxScore: 2 },
      { id: 47, category: 'operations', categoryAr: 'العمليات', question: 'Cash Handling: Is cash handled properly following cash management procedures - cashier drawer properly stocked with change, cash counted at opening, closing, and shift changes, excess cash secured?', questionAr: 'التعامل مع النقد: هل يتم التعامل مع النقد بشكل صحيح following إجراءات إدارة النقد - درج الكاشير properly مُجهز بـ change، النقد counted عند الفتح والإغلاق وتغييرات الوردية، الفائض cash secured؟', maxScore: 2 },
      { id: 48, category: 'operations', categoryAr: 'العمليات', question: 'Safety Hazards: Is the store free of safety hazards - no wet floors without warning signs, no trailing electrical cords creating trip hazards, no blocked emergency exits?', questionAr: 'مخاطر السلامة: هل المتجر خالياً من مخاطر السلامة - no أرضيات مبللة بدون علامات تحذير، no أسلاك كهربائية متدلية create مخاطر التعثر، no مخارج طوارئ blocked؟', maxScore: 2 },
      { id: 49, category: 'operations', categoryAr: 'العمليات', question: 'Staff Training: Have all staff completed required training modules? Are training records current? Are new staff properly supervised? Can staff demonstrate competence in all procedures?', questionAr: 'تدريب الموظفين: هل أكمل جميع الموظفين وحدات التدريب المطلوبة? هل سجلات التدريب current? هل الموظفون الجدد properly supervised? هل يستطيع الموظفون إظهار الكفاءة في جميع الإجراءات؟', maxScore: 2 },
      { id: 50, category: 'operations', categoryAr: 'العمليات', question: 'First Aid Kit: Is a first aid kit available, properly stocked with unexpired supplies, and accessible to staff? Do staff know the kit location? Are emergency numbers posted and visible?', questionAr: 'صندوق الإسعافات الأولية: هل صندوق إسعافات أولية available، properly مُجهز بمستلزمات غير منتهية، وaccessible للموظفين? هل يعرف الموظفون موقع الصندوق? هل أرقام الطوارئ posted ومرئية؟', maxScore: 2 },
    ]
  },
];

// Shortlist = IDs 1-25, Full = IDs 1-50
export function getShortlistPoints(): number[] {
  return Array.from({length: 25}, (_, i) => i + 1);
}

export function getFullIds(): number[] {
  return Array.from({length: 50}, (_, i) => i + 1);
}