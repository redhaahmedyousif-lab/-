import { Fragment, useCallback, useEffect, useRef, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  محتوى الوثيقة — النص النهائي المعتمد                               */
/*                                                                    */
/*  كل فصل يتكون من «كتل» (blocks) مرتبة، ولكل نوع كتلة مكوّن عرض      */
/*  خاص به، ومحوّل نصي يُستخدم عند نسخ الوثيقة إلى الحافظة.            */
/*  النص الغامق داخل الفقرات يُكتب بين نجمتين مزدوجتين **هكذا**.       */
/* ------------------------------------------------------------------ */

const DOCUMENT_META = {
  title: 'وثيقة البقاء الكوكبي',
  motto: '»خوارزميات الحياة — إعادة كتابة مستقبل الأرض«',
};

const SURVIVAL_AXES = ['الأثر', 'الطاقة', 'المياه', 'التكلفة', 'السلامة', 'قابلية التوسع'];

const PILLAR_FIELDS = [
  ['problem', 'المشكلة'],
  ['mechanism', 'الآلية'],
  ['ai', 'دور الذكاء الاصطناعي'],
  ['target', 'هدف التصميم المقترح'],
  ['baseline', 'خط الأساس'],
  ['test', 'اختبار قابلية البقاء'],
];

const ARCHITECTURE = {
  neural: {
    title: 'الطبقة العصبية الكوكبية',
    parts: ['الذكاء الاصطناعي', 'إنترنت الأشياء', 'الأقمار', 'العقود الذكية', 'إطار MRV'],
  },
  sectors: ['قطاع الطاقة', 'قطاع الصناعة', 'قطاع النقل'],
  pipeline: ['خفض الانبعاثات', 'إدارة الكربون', 'استعادة الغابات والمحيطات'],
  ascii: `           [ الطبقة العصبية الكوكبية ]
(الذكاء الاصطناعي • إنترنت الأشياء • الأقمار • العقود الذكية • إطار MRV)
                 |
   +-------------+-------------+
   |             |             |
قطاع الطاقة  قطاع الصناعة  قطاع النقل
   |             |             |
[خفض الانبعاثات] -> [إدارة الكربون] -> [استعادة الغابات والمحيطات]`,
};

const DASHBOARD_COLUMNS = [
  ['sector', 'القطاع المستهدف'],
  ['target', 'هدف التصميم المقترح'],
  ['baseline', 'خط الأساس (Baseline)'],
  ['method', 'طريقة القياس والتحقق'],
];

const DASHBOARD = [
  {
    sector: 'الطاقة (CEIG)',
    target: 'حصة كهرباء منخفضة الكربون >70% بحلول 2040؛ موثوقية وفق SAIDI/SAIFI',
    baseline: 'المزيج الكهربائي ومعدل الانقطاعات الحالي',
    method: 'عدادات الشبكات الذكية والاستشعار المباشر المتوافق مع المنهجيات الدولية',
  },
  {
    sector: 'الانبعاثات الكوكبية',
    target: 'خفض الانبعاثات الصافية بنسبة 43% (2030) و84% (2050)',
    baseline: 'مستويات انبعاثات عام 2019',
    method: 'إطار MRV الموحد (استناداً إلى إرشادات IPCC وWMO)',
  },
  {
    sector: 'تنقية الهواء الحضري',
    target: 'خفض PM_{2.5} بنسبة 35% في الموقع بحلول 2030',
    baseline: 'قراءات الـ 12 شهراً السابقة للتدخل',
    method: 'شبكات IoT الميدانية والأبراج الحضرية',
  },
  {
    sector: 'الغابات والتصحر',
    target: 'معدل بقاء النباتات >80% بعد 3 سنوات',
    baseline: 'معدلات البقاء في المشاريع التقليدية',
    method: 'الأقمار الصناعية والمسح الجوي بالطائرات المسيرة',
  },
  {
    sector: 'النظم البحرية',
    target: 'استقرار ونجاح نمو الشعاب المستعادة وعدم تدهور pH أو O_{2} بحلول 2040',
    baseline: 'قراءات التدهور ودرجات الحموضة قبل التدخل',
    method: 'المسبارات الذكية وأسراب الروبوتات البحرية',
  },
];

const CHAPTERS = [
  {
    id: '01',
    title: 'إنذار النظام',
    blocks: [
      {
        type: 'drum',
        word: 'قفوا…',
        lines: ['الأرض تصرخ.', 'القلب يختنق.', 'الشبكة الكونية ترتجف.'],
      },
      {
        type: 'p',
        text: 'وإذا توقف القلب، سيتوقف كل شيء؛ وإذا لم نُعد كتابة البرمجيات الحيوية المعتمدة عليه الآن، فسيتوقف نظام التشغيل عن الاستجابة، وتنهار دفقات الحياة المعتمدة عليه.',
      },
      {
        type: 'stat',
        value: '1.43°C',
        note: '±0.13°C',
        caption: 'فوق مستوى ما قبل الثورة الصناعية (1850–1900) — عام 2025',
        source: 'WMO State of the Global Climate 2025',
      },
      {
        type: 'p',
        text: 'في عام 2025، تجاوز متوسط حرارة سطح الأرض مستوى ما قبل الثورة الصناعية (1850–1900) بنحو **1.43 درجة مئوية (بهامش عدم يقين ±0.13°C)** — وفق تقرير المنظمة العالمية للأرصاد الجوية (WMO State of the Global Climate 2025) — ليكون بين أحرّ ثلاثة أحدث أعوام مسجلة في السجل المناخي الحديث. والأرقام وحدها لا تصف حجم الخطر؛ فكل جزء إضافي من الاحترار تزيد المخاطر والآثار السلبية على الأنظمة البشرية والطبيعية، ويسبب انكسار شرايين الحضارة، وتوقف نبض الأسواق واختلال التوازن البيئي (IPCC).',
      },
      {
        type: 'hammer',
        text: 'الانبعاثات ليست مجرد غازات، بل شظايا جحيم تتسرب إلى رئة الكوكب، كأننا نغرس جمرة في صدره. وكل غاز متصاعد ليس مجرد رقم في تقرير، بل هو سهم مسموم يخترق صدر الكوكب.',
      },
    ],
  },
  {
    id: '02',
    title: 'لماذا لا تكفي الحلول الجزئية؟',
    algorithm: 'نقيس لننقذ.',
    blocks: [
      {
        type: 'p',
        text: 'الحلول الجزئية أو الإجراءات الفردية الترقيعية لن تكون كافية أمام مشكلة تعمل على مستوى منظومة الكوكب بأكمله:',
      },
      {
        type: 'bullets',
        items: [
          {
            label: 'قطاع النقل والانبعاثات',
            text: 'يُمثّل النقل أحد أكبر مصادر الانبعاثات؛ حيث شكّل نحو **23%** من انبعاثات ثاني أكسيد الكربون المرتبطة بالطاقة عالمياً، واستحوذت المركبات البرية على **70%** من انبعاثات النقل المباشرة (IPCC AR6 WGIII).',
          },
          {
            label: 'حدود الخفض المطلوب',
            text: 'تؤكد المسارات المناخية المتوافقة مع مسار 1.5°C أن أمر الانبعاثات يطلب خفضاً عميقاً وسريعاً بنسبة **43% بحلول عام 2030** و**84% بحلول عام 2050**، مقارنة بمستويات عام 2019 (IPCC AR6 WGIII).',
          },
          {
            label: 'تهديد الأنظمة الحيوية',
            text: 'تشير التقييمات العلمية إلى أن الشعاب المرجانية الاستوائية تفقد **70% إلى 90%** من مساحتها عند ارتفاع الحرارة بـ 1.5°C، بينما ستتجاوز نسبة الفقدان **99%** إذا بلغ الاحترار 2°C (IPCC).',
          },
        ],
      },
      {
        type: 'hammer',
        text: 'كل ثانية تمر ليست مجرد وقت، بل نبضة تُسجل في سجل البقاء. وكل دقيقة تأخير هي خطوة نحو الهاوية.',
      },
    ],
  },
  {
    id: '03',
    title: 'مبدأ التصميم والفرضية الهندسية',
    algorithm: 'نزرع لنحيا.',
    blocks: [
      { type: 'label', text: 'المبدأ المركزي للوثيقة' },
      {
        type: 'principle',
        text: 'لا نعتمد على تقنية لمجرد أنها مذهلة؛ نعتمد عليها عندما تكون قابلة للقياس، قابلة للتوسع، وقابلة للمحاسبة.',
      },
      { type: 'label', text: 'الفرضية الهندسية' },
      {
        type: 'p',
        text: 'لا يوجد حل منفرد قادر على معالجة الأزمة المناخية. تقترح الوثيقة بنية متعددة الطبقات لحماية الكوكب: فنخفض مصادر الانبعاث أولاً، ثم نتعامل مع الانبعاثات المتبقية عبر التكنولوجيا، ثم نستعيد الأنظمة البيئية الحيوية، بينما تعمل البيانات، الحوكمة، والتمويل كـ **«طبقة عصبية كوكبية»** تغذي المنظومة بأكملها توجهاً وتنسيقاً.',
      },
    ],
  },
  {
    id: '04',
    title: 'المعمارية الكوكبية للنظام',
    algorithm: 'البنية المتكاملة هي وحدها القادرة على امتصاص الصدمات الكوكبية.',
    blocks: [{ type: 'architecture' }],
  },
  {
    id: '05',
    title: 'هرم الجاهزية والأركان التكنولوجية',
    algorithm: 'نكتب لنفتح عهدًا جديدًا.',
    blocks: [
      {
        type: 'p',
        text: 'تم تصنيف التقنيات بحسب مستويات الجاهزية التكنولوجية (TRL) لضمان تمييز الحلول المتاحة اليوم عن التقنيات الناشئة والتجريبية. ويخضع كل ركن لاختبار قابلية البقاء (**Survival Test**) عبر ستة محاور: الأثر - الطاقة - المياه - التكلفة - السلامة - قابلية التوسع.',
      },
      { type: 'axes' },
      {
        type: 'tier',
        level: 'A',
        title: 'منظومات مثبتة وقابلة للتوسع الفوري',
        en: 'Scalable & Grounded',
        pillars: [
          {
            num: 1,
            title: 'الشبكة الذكية للطاقة النظيفة',
            en: 'CEIG - Clean Energy Intelligence Grid',
            problem: 'تقطع مصادر الطاقة المتجددة وتذبذب أحمال الشبكات التقليدية.',
            mechanism: 'دمج الطاقة الشمسية، الرياح، والمائية مع أنظمة التخزين المتقدمة وربط الشبكات الكهربائية الوطنية ببعضها.',
            ai: 'موازنة الأحمال لحظياً والتنبؤ بالإنتاج والاستهلاك عبر خوارزميات التعلم العميق.',
            target: 'رفع حصة الكهرباء منخفضة الكربون إلى أكثر من 70% بحلول 2040، مع بلوغ مستوى موثوقية كهربائية مستهدف يحدد وفق مؤشرات قياسية لانقطاعات الشبكة مثل SAIDI وSAIFI.',
            baseline: 'نسبة التغطية الحالية للطاقة المتجددة ومعدل انقطاعات الشبكة التقليدية قبل ربط المنظومة الذكية.',
            test: 'هل تضمن الشبكة استقرار التغذية الكهربائية في ظروف المناخ المتطرفة بإنتاج نظيف بالكامل ودون زيادة هيكلية في تكلفة التوليد؟',
          },
        ],
      },
      {
        type: 'tier',
        level: 'B',
        title: 'منظومات ناشئة قابلة للتوسع والتجربة الحقلية',
        en: 'Emerging Systems',
        pillars: [
          {
            num: 2,
            title: 'أبراج الهواء النقي الحضرية',
            en: 'Clean-Air Towers',
            problem: 'تركز التلوث الشديد والجسيمات الدقيقة في المناطق الحضرية والصناعية المزدحمة.',
            mechanism: 'بنية تحتية حضرية معززة بمصفيات متطورة لمعالجة الهواء الملوث في النقاط الساخنة، تعمل بالطاقة النظيفة كحل مكمل لخفض الانبعاثات من المصدر.',
            ai: 'تشغيل الأبراج آلياً بناءً على مستشعرات جودة الهواء في الوقت الفعلي.',
            target: 'خفض مستويات الجسيمات الدقيقة (PM_{2.5}) بنسبة 35% بحلول 2030 في المحيط الحضري المستهدف، مقارنة بخط أساس محدد للموقع.',
            baseline: 'متوسط مستويات PM_{2.5} المسجلة في الموقع التجريبي خلال فترة الرصد الممتدة لـ 12 شهراً قبل التشغيل.',
            test: 'هل تنقي الأبراج حجماً من الهواء يتجاوز بصمتها الطاقية والبيئية مع تحقيق فائدة مناخية وصحية مثبتة؟',
          },
          {
            num: 3,
            title: 'الاستعادة البيئية المؤتمتة',
            en: 'Automated Ecological Restoration',
            problem: 'اتساع رقعة التصحر وبطء عمليات الاستعادة البيئية التقليدية.',
            mechanism: 'أنظمة استعادة بيئية تجمع بين الروبوتات الحقلية، الطائرات بدون طيار (Drones) والري الدقيق لتوسيع الغطاء النباتي وتثبيت الكربون في التربة.',
            ai: 'اختيار البذور المناسبة لطبيعة التربة وتوجيه عمليات الري والصيانة ومراقبة نمو النباتات تلقائياً.',
            target: 'تحقيق معدل بقاء للأشجار والنباتات يتجاوز 80% بعد 3 سنوات من الزراعة في المشاريع المستهدفة.',
            baseline: 'معدل البقاء ونسبة نمو الغطاء النباتي المتبعة في مشاريع الاستعادة التقليدية في المنطقة الجغرافية نفسها.',
            test: 'هل تحقق الغابات المؤتمتة التوازن المائي المباشر دون استنزاف المياه الجوفية المتاحة أو الإضرار بالتنوع الحيوي المحلي؟',
          },
        ],
      },
      {
        type: 'hammer',
        text: 'انصتوا… الأوراق تتساقط يائسة. كل شجرة تُحرق، كأننا نقتلع نبضًا من قلب الأرض.',
      },
      {
        type: 'tier',
        level: 'C',
        title: 'تقنيات بحثية وتجريبية',
        en: 'Experimental & High-Risk',
        pillars: [
          {
            num: 4,
            title: 'شبكة المحيطات الذكية',
            en: 'Ocean-Net',
            problem: 'ارتفاع حرارة المياه وتحمض المحيطات وتدهور الشعاب المرجانية والنظم البيئية البحرية.',
            mechanism: 'أسراب من الروبوتات والمستشعرات البحرية الذكية لرصد التغيرات البيئية وتوجيه عمليات استعادة الشعاب المرجانية ومسارات إزالة الكربون البحري التجريبية.',
            ai: 'تحليل التغيرات الفيزيائية والكيميائية للمياه وتوجيه المسبارات ذاتية التحكم للتعامل مع المناطق المتضررة.',
            target: 'زيادة أو استقرار الغطاء المرجاني الحي ومعدلات بقاء الشعاب المستعادة، مع عدم إحداث تدهور قابل للقياس في pH أو الأكسجين المذاب أو التنوع الحيوي في الموقع بحلول 2040.',
            baseline: 'معدلات التدهور ودرجات الحموضة المسجلة في الحقل البحري المستهدف قبل التدخل.',
            test: 'هل تتم أتمتة التدخل دون إحداث اضطراب في السلسلة الغذائية أو التأثير سلباً على التنوع الحيوي البحري الطبيعي؟',
          },
          {
            num: 5,
            title: 'إدارة الكربون المتقدمة وتقنيات النانو',
            en: 'Advanced Carbon Management',
            problem: 'صعوبة معالجة الانبعاثات المتبقية في القطاعات الصناعية الثقيلة (مثل الأسمنت والصلب).',
            mechanism: 'استخدام الأغشية المتقدمة، المواد الماصة ذات البنية النانوية، وتقنيات احتجاز واستخدام الكربون وتحويله إلى مواد بناء صلبة أو منتجات ذات قيمة.',
            ai: 'أتمتة التحكم في التفاعلات الجزيئية وتحسين كفاءة الطاقة في وحدات الاحتجاز.',
            target: 'خفض تكلفة الاحتجاز إلى أقل من 50 دولاراً لكل طن من صافي ثاني أكسيد الكربون بحلول 2035.',
            baseline: 'التكلفة الحالية لاحتجاز الطن وكفاءة استهلاك الطاقة في وحدات الاحتجاز المباشر التقليدية.',
            test: 'هل تحقق التقنية فائدة مناخية صافية بعد احتساب مدخلات الطاقة والانبعاثات عبر دورة الحياة الكاملة؟',
          },
        ],
      },
    ],
  },
  {
    id: '06',
    title: 'نظام القياس والإبلاغ والتحقق والتدقيق',
    en: 'MRV & Audit Layer',
    algorithm: 'نقيس لننقذ.',
    blocks: [
      {
        type: 'p',
        text: 'لن تعتمد الوثيقة على تقديرات غير موثوقة؛ بل على إطار صارم يقوم على أربع مراحل أساسية:',
      },
      {
        type: 'flow',
        steps: [
          { en: 'Measure', ar: 'قياس' },
          { en: 'Report', ar: 'أبلغ' },
          { en: 'Verify', ar: 'تحقق' },
          { en: 'Audit', ar: 'دقق' },
        ],
      },
      {
        type: 'bullets',
        items: [
          {
            label: 'القياس (Measurement)',
            text: 'عبر أجهزة استشعار إنترنت الأشياء (IoT) الميدانية المباشرة، والأقمار الصناعية ذات التحليل الطيفي.',
          },
          {
            label: 'الإبلاغ (Reporting)',
            text: 'تدفق بيانات شفاف ومفتوح المصدر يُرفع آلياً إلى منصات المحاسبة الموحدة دون تدخل بشري يدوي.',
          },
          {
            label: 'التحقق (Verification)',
            text: 'مطابقة البيانات من خلال خوارزميات الذكاء الاصطناعي ومقارنتها بسجلات الاستشعار البعيد.',
          },
          {
            label: 'التدقيق المستقل (Audit)',
            text: 'لا تُعد النتائج معتمدة لمجرد أن الخوارزمية أعلنتها؛ بل يجب أن تكون القياسات قابلة لإعادة الفحص والتدقيق من جهات علمية وهيئات رقابية مستقلة.',
          },
          {
            label: 'تعريف النتيجة',
            text: '«أطنان مكافئ ثاني أكسيد الكربون (tCO_{2}e) التي تم قياسها، والإبلاغ عنها، والتحقق منها، وتدقيقها وفق منهجية علمية معتمدة هي فقط ما يُسجل في سجل الإنجاز.»',
          },
        ],
      },
    ],
  },
  {
    id: '07',
    title: 'اقتصاد البقاء: التمويل والحوافز',
    algorithm: 'نزرع لنحيا.',
    blocks: [
      {
        type: 'p',
        text: 'تتحول الوثيقة من مجرد كلفة بيئية إلى فرصة استثمارية هيكلية:',
      },
      {
        type: 'bullets',
        items: [
          {
            label: 'الأساس الواقعي',
            text: 'يوضح تقرير البنك الدولي (State and Trends of Carbon Pricing 2026) أن التسعير المباشر للكربون أصبح يغطي نحو **30%** من انبعاثات غازات الدفيئة عالمياً عبر 87 سياسة مطبقة، وحشد أكثر من **107 مليارات دولار** للإيرادات العامة خلال عام 2025 (World Bank).',
          },
          {
            label: 'البنية المقترحة',
            text: 'لا تبدأ هذه الوثيقة من الصفر، بل تبني على آليات تسعير الكربون وأسواق الائتمان القائمة، لتقدم طبقة مستقبلية موحدة تربط التسعير، المحاسبة، والتمويل عبر منصة رقمية مؤتمتة.',
          },
          {
            label: 'آليات التمويل',
            text: '',
            sub: [
              'إعادة استثمار عوائد آليات تسعير الكربون في مشاريع الخفض والاستعادة.',
              'إصدار السندات الخضراء السيادية والخاصة المربوطة بمؤشرات قياس موثوقة (MRV).',
              'الشراكات بين القطاعين العام والخاص (PPP) لتمويل البنية التحتية من المستويين A وB.',
            ],
          },
        ],
      },
      {
        type: 'hammer',
        text: 'انصتوا… الجداول تنضب. من يملك العلم ولا يطلقه، كمن يملك المفتاح ويترك الباب مغلقًا.',
      },
    ],
  },
  {
    id: '08',
    title: 'خارطة التنفيذ وبوابات القرار',
    en: 'Stage-Gate Framework',
    algorithm: 'نكتب لنفتح عهدًا جديدًا.',
    blocks: [
      {
        type: 'timeline',
        ascii:
          '[2027-2030: Pilot] --(بوابة قرار 1)--> [2030-2040: Scale] --(بوابة قرار 2)--> [2040-2050: Integrate]',
        phases: [
          {
            name: 'المرحلة الأولى',
            years: '2027-2030',
            en: 'Pilot',
            ar: 'اختبار',
            text: 'اختبار التجارب الحقلية، بناء البنية الرقمية، تطوير أنظمة MRV، وإطلاق مشاريع المدن والشبكات التجريبية.',
            gate: {
              name: 'بوابة القرار 1',
              text: 'لا تنتقل التقنية إلى مرحلة التوسع إلا إذا أثبتت جدارتها في اختبار قابلية البقاء وحققت أهداف التصميم الأولية.',
            },
          },
          {
            name: 'المرحلة الثانية',
            years: '2030-2040',
            en: 'Scale',
            ar: 'توسيع',
            text: 'التوسيع الصناعي والإقليمي في الشبكات الذكية، تطبيقات الاستعادة البيئية، وأنظمة الكربون الموحدة.',
            gate: {
              name: 'بوابة القرار 2',
              text: 'تقييم الجدوى الاقتصادية والأثر البيئي الصافي على النطاق الكبير قبل الدمج الشامل.',
            },
          },
          {
            name: 'المرحلة الثالثة',
            years: '2040-2050',
            en: 'Integrate',
            ar: 'دمج',
            text: 'دمج الأنظمة على نطاق كوكبي عابر للحدود وتوسيع التقنيات التي أثبتت فعاليتها للوصول إلى الحياد الصفري.',
          },
        ],
      },
    ],
  },
  {
    id: '09',
    title: 'المخاطر، حدود الخوارزمية، والحوكمة',
    algorithm: 'نقيس لننقذ.',
    blocks: [
      { type: 'heading', text: 'حدود الخوارزمية — ما الذي لن تفعله الوثيقة؟' },
      {
        type: 'limits',
        items: [
          'لا تقترح الوثيقة تقنية واحدة سحرية لإنقاذ الكوكب.',
          'لا تعتبر إزالة الكربون بديلاً عن خفض الانبعاثات المباشرة من المصدر.',
          'لا تفترض أن كل تقنية ناشئة جاهزة للتوسع دون اختبار ميداني.',
          'لا تعتبر الذكاء الاصطناعي بديلاً عن الخبرة البشرية أو الرقابة العلمية المستقلة.',
        ],
      },
      { type: 'heading', text: 'إدارة المخاطر' },
      {
        type: 'p',
        text: 'تتضمن المنظومة صمامات أمان هندسية؛ ففي حال ظهور آثار بيئية غير مقصودة أو ارتفاع غير محسوب في استهلاك الطاقة لأي تقنية، يتم تعليق التوسع تلقائياً وإعادة التقييم وفق المبدأ الأساسي للوثيقة:',
      },
      {
        type: 'principle',
        text: 'لا توسّع ما لم تُثبت التجربة أثره، وسلامته، وقابليته للقياس والتوسع.',
      },
      { type: 'heading', text: 'حوكمة النظام' },
      {
        type: 'ordered',
        items: [
          {
            label: 'بيانات قابلة للتتبع والتدقيق',
            text: 'مع إتاحة البيانات العامة للبحث العلمي وفق أطر الوصول والأمن المناسبة.',
          },
          {
            label: 'العنصر البشري في الحلقة (Human-in-the-Loop)',
            text: 'القرارات الاستراتيجية الحساسة خاضعة لإشراف بشري وأكاديمي ملزم.',
          },
          {
            label: 'شفافية الخوارزميات',
            text: 'إخضاع خوارزميات التنبؤ والموازنة للتدقيق المستمر لمنع التحيز أو التضليل.',
          },
        ],
      },
    ],
  },
  {
    id: '10',
    title: 'لوحة القيادة الكوكبية',
    en: 'Planetary Dashboard',
    algorithm: 'نزرع لنحيا.',
    blocks: [{ type: 'dashboard' }],
  },
];

const FINALE = {
  id: '11',
  title: 'السطر الأخير',
  call: {
    opening: 'قفوا… أنصتوا جميعاً:',
    addressees: [
      'أيها القادة',
      'أيها المستثمرون',
      'أيها المعلمون',
      'أيها الطلبة',
      'أيها الأطفال',
      'أيها الأمهات',
      'أيها الشعراء',
      'أيها العلماء',
    ],
    tail: 'وكل من يتنفس هواء هذا الكوكب…',
    oath: 'أنتم لا توقعون على ورق، بل على مستقبل الحياة.',
  },
  // tone: base | strong | dark | hope — يحدد الإيقاع البصري للتدرج الخاتمي
  crescendo: [
    {
      tone: 'base',
      text: 'إن الشيفرة الأساسية لنظام الأرض تحتاج إلى إعادة كتابة، وما زال في هذه الشيفرة سطرٌ لم يُكتب بعد.',
    },
    { tone: 'base', text: 'نحن لا ننتظر أن تكتب الكارثة السطر الأخير.' },
    { tone: 'strong', text: 'سنكتبه نحن.' },
    { tone: 'base', text: 'لا بالحبر؛ بالعلم، والهندسة، والقياس، والقرار.' },
    { tone: 'dark', text: 'إذا تعطلت الأرض، ارتجّ الكون كله.' },
    { tone: 'dark', text: 'إذا ضاع الكوكب، ضاع الإنسان. وإذا ضاع الإنسان، ضاع المعنى.' },
    {
      tone: 'hope',
      text: 'لكن إذا كتبنا السطر الأخير بالعلم، سيبقى الكوكب، وسيبقى الإنسان، وسيبقى المعنى.',
    },
  ],
  finalLine:
    'فلنكتب السطر الأخير لا بالحبر، بل بأشعة الشمس، بقطرات المطر، وبأصوات الغابات التي تعود للحياة.',
  signature: 'هذه الوثيقة ليست مجرد كلمات، بل خطة بقاء كوكبي.',
};

const NAV_ITEMS = [
  ...CHAPTERS.map((c) => ({ id: c.id, title: c.title })),
  { id: FINALE.id, title: FINALE.title },
];

/* ------------------------------------------------------------------ */
/*  تحويل الوثيقة إلى نص قابل للنسخ                                    */
/* ------------------------------------------------------------------ */

const SUBSCRIPT_DIGITS = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉' };

// يحوّل علامات التنسيق إلى نص عادي: **غامق** ← غامق، و PM_{2.5} ← PM₂.₅
const stripMarks = (text) =>
  text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/_\{(.+?)\}/g, (_, sub) => sub.replace(/\d/g, (d) => SUBSCRIPT_DIGITS[d]));

function blockToText(block) {
  switch (block.type) {
    case 'drum':
      return `«${block.lines.map((l) => `${block.word} ${l}`).join(' ')}»`;
    case 'p':
      return stripMarks(block.text);
    case 'stat':
      return null; // الرقم مذكور في الفقرة التالية
    case 'hammer':
    case 'principle':
      return `«${block.text}»`;
    case 'label':
      return `${block.text}:`;
    case 'heading':
      return `■ ${block.text}`;
    case 'bullets':
      return block.items
        .map((item) => {
          const head = `• ${item.label}${item.text ? `: ${stripMarks(item.text)}` : ':'}`;
          const sub = (item.sub || []).map((s, i) => `   ${i + 1}. ${s}`);
          return [head, ...sub].join('\n');
        })
        .join('\n');
    case 'ordered':
      return block.items.map((item, i) => `${i + 1}. ${item.label}: ${item.text}`).join('\n');
    case 'limits':
      return block.items.map((item) => `✕ ${item}`).join('\n');
    case 'architecture':
      return ARCHITECTURE.ascii;
    case 'axes':
      return null; // المحاور مذكورة في الفقرة السابقة
    case 'tier':
      return [
        `◆ المستوى ${block.level}: ${block.title} (${block.en})`,
        ...block.pillars.map((p) =>
          [
            `  ${p.num}. ${p.title} (${p.en})`,
            ...PILLAR_FIELDS.map(([key, label]) => `   - ${label}: ${stripMarks(p[key])}`),
          ].join('\n')
        ),
      ].join('\n');
    case 'flow':
      return block.steps.map((s) => `${s.en} (${s.ar})`).join(' ← ');
    case 'timeline':
      return [
        block.ascii,
        ...block.phases.flatMap((ph) => [
          `• ${ph.name} (${ph.years}) — ${ph.en} (${ph.ar}): ${ph.text}`,
          ...(ph.gate ? [`   ⟐ ${ph.gate.name}: ${ph.gate.text}`] : []),
        ]),
      ].join('\n');
    case 'dashboard':
      return [
        DASHBOARD_COLUMNS.map(([, label]) => label).join(' | '),
        ...DASHBOARD.map((row) => DASHBOARD_COLUMNS.map(([key]) => stripMarks(row[key])).join(' | ')),
      ].join('\n');
    default:
      return null;
  }
}

function buildPlainText() {
  const divider = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  const out = [DOCUMENT_META.title, DOCUMENT_META.motto, divider];

  CHAPTERS.forEach((chapter) => {
    out.push('', `${chapter.id} — ${chapter.title}${chapter.en ? ` (${chapter.en})` : ''}`);
    if (chapter.algorithm) out.push(`خوارزمية البقاء: ${chapter.algorithm}`);
    chapter.blocks.forEach((block) => {
      const text = blockToText(block);
      if (text) out.push('', text);
    });
    out.push('', divider);
  });

  const { call } = FINALE;
  out.push(
    '',
    `${FINALE.id} — ${FINALE.title}`,
    '',
    `${call.opening} ${call.addressees.join('، ')}، ${call.tail} ${call.oath}`,
    ...FINALE.crescendo.flatMap((line) => ['', line.text]),
    '',
    FINALE.finalLine,
    '',
    FINALE.signature
  );

  return out.join('\n');
}

async function copyToClipboard(text) {
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // بديل للمتصفحات القديمة أو السياقات غير الآمنة
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand('copy');
  document.body.removeChild(textarea);
  if (!ok) throw new Error('copy failed');
}

/* ------------------------------------------------------------------ */
/*  مكونات العرض الأساسية                                               */
/* ------------------------------------------------------------------ */

function Inline({ text }) {
  // **غامق** و _{منخفض} (مثل PM_{2.5})
  return text.split(/(\*\*.+?\*\*|_\{.+?\})/g).map((part, i) => {
    if (part.startsWith('**')) {
      return (
        <strong key={i} className="font-bold text-sky-700 dark:text-sky-300">
          <Inline text={part.slice(2, -2)} />
        </strong>
      );
    }
    if (part.startsWith('_{')) return <sub key={i}>{part.slice(2, -1)}</sub>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}

function PlanetLogo({ className = '' }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="psd-planet" cx="38%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="45%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#0c4a6e" />
        </radialGradient>
        <linearGradient id="psd-ring" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="34" fill="url(#psd-planet)" />
      <path
        d="M40 50c6-6 14-4 18 1s10 3 13-2M45 72c5 3 11 2 15-2s11-3 15 1"
        fill="none"
        stroke="#ecfeff"
        strokeOpacity="0.55"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <ellipse
        cx="60"
        cy="60"
        rx="54"
        ry="16"
        fill="none"
        stroke="url(#psd-ring)"
        strokeWidth="3"
        transform="rotate(-18 60 60)"
      />
      <circle cx="108" cy="44" r="4" fill="#fbbf24" />
    </svg>
  );
}

function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع المظلم'}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white/80 text-lg text-slate-700 shadow-sm backdrop-blur transition hover:scale-105 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-slate-700 dark:bg-slate-900/80 dark:text-amber-300 dark:hover:bg-slate-800"
    >
      <span aria-hidden="true">{isDark ? '☀' : '☾'}</span>
    </button>
  );
}

function CopyButton({ onCopy, state, compact = false }) {
  const label = state === 'copied' ? 'تم النسخ' : state === 'error' ? 'تعذّر النسخ' : 'نسخ الوثيقة';
  return (
    <button
      type="button"
      onClick={onCopy}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 sm:px-5 ${
        state === 'copied'
          ? 'bg-emerald-600 text-white'
          : state === 'error'
            ? 'bg-red-600 text-white'
            : 'bg-sky-600 text-white hover:bg-sky-500 active:scale-95 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400'
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        {state === 'copied' ? (
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <>
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M5 15V5a2 2 0 0 1 2-2h10" strokeLinecap="round" />
          </>
        )}
      </svg>
      <span className={compact ? 'sr-only sm:not-sr-only' : ''}>{label}</span>
    </button>
  );
}

function Toast({ toast }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed inset-x-4 bottom-6 z-50 mx-auto flex max-w-sm items-center justify-center gap-3 rounded-2xl px-5 py-4 text-sm font-semibold shadow-2xl ring-1 transition-all duration-300 sm:inset-x-auto sm:left-1/2 sm:w-full sm:-translate-x-1/2 ${
        toast.visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      } ${toast.tone === 'error' ? 'bg-red-600 text-white ring-red-400' : 'bg-emerald-600 text-white ring-emerald-400'}`}
    >
      <span>{toast.message}</span>
    </div>
  );
}

function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const percent = Math.round(progress * 100);
  return (
    <div
      role="progressbar"
      aria-label="تقدم القراءة"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      className="fixed inset-x-0 top-0 z-[60] h-1 bg-emerald-500/15"
    >
      {/* يمتلئ من اليمين إلى اليسار بما يتوافق مع اتجاه القراءة العربية */}
      <div
        className="h-full origin-right bg-gradient-to-l from-emerald-400 to-emerald-600 shadow-[0_0_8px_rgba(16,185,129,0.7)] transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  المشاركة                                                           */
/* ------------------------------------------------------------------ */

const SHARE_TEXT = `${DOCUMENT_META.title} — ${DOCUMENT_META.motto}`;

function currentPageUrl() {
  return `${window.location.origin}${window.location.pathname}`;
}

function WhatsAppIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

function XIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}

function LinkIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" {...props}>
      <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5" />
      <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5" />
    </svg>
  );
}

function ShareIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" {...props}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
    </svg>
  );
}

function useShareActions(notify) {
  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const copyLink = useCallback(async () => {
    try {
      await copyToClipboard(currentPageUrl());
      notify('✓ نُسخ رابط الوثيقة');
    } catch {
      notify('تعذّر نسخ الرابط', 'error');
    }
  }, [notify]);

  const nativeShare = useCallback(async () => {
    try {
      await navigator.share({ title: DOCUMENT_META.title, text: SHARE_TEXT, url: currentPageUrl() });
    } catch {
      /* ألغى المستخدم المشاركة */
    }
  }, []);

  const links = () => {
    const url = currentPageUrl();
    return {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT}\n${url}`)}`,
      x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(url)}`,
    };
  };

  return { canNativeShare, copyLink, nativeShare, links };
}

const SHARE_BTN =
  'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 active:scale-95';

function ShareButtons({ notify, label = 'شارك الوثيقة', className = '' }) {
  const { canNativeShare, copyLink, nativeShare, links } = useShareActions(notify);
  const { whatsapp, x } = links();
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <p className="text-xs font-bold tracking-widest text-slate-500 dark:text-slate-400">{label}</p>
      <div className="flex flex-wrap justify-center gap-2">
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className={`${SHARE_BTN} bg-[#25D366] text-white hover:bg-[#1ebe5a]`}
        >
          <WhatsAppIcon className="h-4 w-4" />
          واتساب
        </a>
        <a
          href={x}
          target="_blank"
          rel="noopener noreferrer"
          className={`${SHARE_BTN} bg-black text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200`}
        >
          <XIcon className="h-3.5 w-3.5" />
          إكس
        </a>
        <button
          type="button"
          onClick={copyLink}
          className={`${SHARE_BTN} border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800`}
        >
          <LinkIcon className="h-4 w-4" />
          نسخ الرابط
        </button>
        {canNativeShare && (
          <button
            type="button"
            onClick={nativeShare}
            className={`${SHARE_BTN} border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800`}
          >
            <ShareIcon className="h-4 w-4" />
            المزيد
          </button>
        )}
      </div>
    </div>
  );
}

const MENU_ITEM =
  'flex w-full items-center gap-3 px-4 py-2.5 text-right text-sm font-semibold text-slate-800 transition hover:bg-slate-100 focus:bg-slate-100 focus:outline-none dark:text-slate-100 dark:hover:bg-slate-800 dark:focus:bg-slate-800';

function ShareMenu({ notify }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const { canNativeShare, copyLink, nativeShare, links } = useShareActions(notify);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const close = () => setOpen(false);
  const { whatsapp, x } = open ? links() : {};

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="مشاركة الوثيقة"
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white/80 text-slate-700 shadow-sm backdrop-blur transition hover:scale-105 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-slate-700 dark:bg-slate-900/80 dark:text-emerald-300 dark:hover:bg-slate-800"
      >
        <ShareIcon className="h-4 w-4" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute left-0 top-12 z-50 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white py-1 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
        >
          <a role="menuitem" href={whatsapp} target="_blank" rel="noopener noreferrer" onClick={close} className={MENU_ITEM}>
            <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
            واتساب
          </a>
          <a role="menuitem" href={x} target="_blank" rel="noopener noreferrer" onClick={close} className={MENU_ITEM}>
            <XIcon className="h-3.5 w-3.5" />
            إكس (تويتر)
          </a>
          <button
            role="menuitem"
            type="button"
            onClick={() => {
              close();
              copyLink();
            }}
            className={MENU_ITEM}
          >
            <LinkIcon className="h-4 w-4 text-sky-500" />
            نسخ الرابط
          </button>
          {canNativeShare && (
            <button
              role="menuitem"
              type="button"
              onClick={() => {
                close();
                nativeShare();
              }}
              className={MENU_ITEM}
            >
              <ShareIcon className="h-4 w-4 text-emerald-500" />
              خيارات أخرى…
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  مكونات الكتل                                                       */
/* ------------------------------------------------------------------ */

function Drum({ word, lines }) {
  return (
    <div className="my-8 space-y-2 border-r-4 border-red-500 pr-5 sm:pr-7">
      {lines.map((line) => (
        <p key={line} className="text-2xl font-black leading-snug sm:text-4xl">
          <span className="text-red-600 dark:text-red-400">{word}</span>{' '}
          <span className="text-slate-900 dark:text-white">{line}</span>
        </p>
      ))}
    </div>
  );
}

function Paragraph({ text }) {
  return (
    <p className="my-5 font-naskh text-lg leading-[2.1] text-slate-700 dark:text-slate-300 sm:text-xl">
      <Inline text={text} />
    </p>
  );
}

function Stat({ value, note, caption, source }) {
  return (
    <div className="my-8 flex flex-col items-center gap-2 rounded-2xl border border-red-300 bg-gradient-to-br from-red-50 to-orange-50 px-6 py-8 text-center dark:border-red-500/30 dark:from-red-500/10 dark:to-orange-500/5">
      <p dir="ltr" className="font-mono text-6xl font-black tracking-tight text-red-600 dark:text-red-400 sm:text-7xl">
        +{value}
        <span className="ms-2 align-top text-lg font-semibold text-red-500/80">{note}</span>
      </p>
      <p className="text-base font-semibold text-slate-800 dark:text-slate-200">{caption}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{source}</p>
    </div>
  );
}

const CALL_WORD = /^(انصتوا…|أنصتوا…|قفوا…)\s*/;

function Hammer({ text }) {
  const match = text.match(CALL_WORD);
  const call = match?.[1];
  const rest = match ? text.slice(match[0].length) : text;
  return (
    <blockquote className="relative my-10 overflow-hidden rounded-2xl border-2 border-amber-400/70 bg-gradient-to-l from-amber-50 via-orange-50 to-rose-50 px-6 py-7 shadow-lg shadow-amber-500/10 dark:border-amber-500/50 dark:from-amber-500/10 dark:via-orange-500/5 dark:to-rose-500/10 sm:px-10">
      <span
        aria-hidden="true"
        className="absolute -top-6 right-3 select-none font-serif text-8xl leading-none text-amber-400/40 dark:text-amber-400/20"
      >
        ”
      </span>
      <div className="mb-3 flex items-center gap-2 text-xs font-bold tracking-widest text-amber-700 dark:text-amber-400">
        <span aria-hidden="true">⚡</span>
        <span>مطرقة</span>
      </div>
      <p className="relative text-xl font-extrabold leading-relaxed text-slate-900 dark:text-amber-50 sm:text-2xl">
        «
        {call && <span className="text-red-600 dark:text-red-400">{call} </span>}
        {rest}»
      </p>
    </blockquote>
  );
}

function Principle({ text }) {
  return (
    <blockquote className="my-6 rounded-2xl border border-sky-300 bg-sky-50 px-6 py-6 text-center dark:border-sky-500/40 dark:bg-sky-500/10 sm:px-10">
      <p className="text-lg font-extrabold leading-relaxed text-sky-900 dark:text-sky-100 sm:text-2xl">«{text}»</p>
    </blockquote>
  );
}

function SurvivalAlgorithm({ text }) {
  return (
    <div className="mb-8 rounded-xl border border-emerald-500/40 bg-slate-950 p-4 shadow-inner shadow-emerald-500/10 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-2 border-b border-emerald-500/20 pb-2">
        <span className="text-xs font-bold tracking-wider text-emerald-400">⟨ خوارزمية البقاء ⟩</span>
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
        </span>
      </div>
      <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-lg font-bold leading-loose text-emerald-300 sm:text-xl">
        <span className="font-mono text-amber-400" aria-hidden="true">
          ›_
        </span>
        <span>{text}</span>
        <span className="inline-block h-5 w-2 animate-pulse bg-emerald-400/80" aria-hidden="true" />
      </p>
    </div>
  );
}

function Label({ text }) {
  return (
    <p className="mt-8 flex items-center gap-2 text-sm font-bold tracking-wide text-sky-700 dark:text-sky-400">
      <span className="h-2 w-2 rounded-full bg-sky-500" aria-hidden="true" />
      {text}
    </p>
  );
}

function Heading({ text }) {
  return <h3 className="mb-4 mt-10 text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl">{text}</h3>;
}

function Bullets({ items }) {
  return (
    <ul className="my-6 space-y-4">
      {items.map((item) => (
        <li
          key={item.label}
          className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60 sm:p-5"
        >
          <p className="font-bold text-slate-900 dark:text-white">{item.label}</p>
          {item.text && (
            <p className="mt-2 font-naskh text-base leading-loose text-slate-700 dark:text-slate-300 sm:text-lg">
              <Inline text={item.text} />
            </p>
          )}
          {item.sub && (
            <ol className="mt-3 space-y-2">
              {item.sub.map((s, i) => (
                <li key={s} className="flex gap-3 font-naskh text-base leading-loose text-slate-700 dark:text-slate-300 sm:text-lg">
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 font-mono text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          )}
        </li>
      ))}
    </ul>
  );
}

function Ordered({ items }) {
  return (
    <ol className="my-6 space-y-3">
      {items.map((item, i) => (
        <li key={item.label} className="flex gap-4">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-600 font-mono text-sm font-bold text-white">
            {i + 1}
          </span>
          <p className="font-naskh text-base leading-loose text-slate-700 dark:text-slate-300 sm:text-lg">
            <strong className="font-arabic font-bold text-slate-900 dark:text-white">{item.label}:</strong> {item.text}
          </p>
        </li>
      ))}
    </ol>
  );
}

function Limits({ items }) {
  return (
    <ul className="my-6 grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-3 rounded-xl border border-red-200 bg-red-50/60 p-4 text-sm leading-relaxed text-slate-800 dark:border-red-500/25 dark:bg-red-500/5 dark:text-slate-200 sm:text-base"
        >
          <span className="font-bold text-red-600 dark:text-red-400" aria-hidden="true">
            ✕
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Architecture() {
  const { neural, sectors, pipeline } = ARCHITECTURE;
  return (
    <figure className="my-8" aria-label="مخطط المعمارية الكوكبية">
      <div className="rounded-2xl border-2 border-violet-400/60 bg-violet-50 p-5 text-center dark:border-violet-500/50 dark:bg-violet-500/10">
        <p className="text-lg font-extrabold text-violet-900 dark:text-violet-200">[ {neural.title} ]</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {neural.parts.map((part) => (
            <span
              key={part}
              className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-violet-800 ring-1 ring-violet-300 dark:bg-slate-900 dark:text-violet-300 dark:ring-violet-500/40"
            >
              {part}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto h-6 w-px bg-violet-400/60" aria-hidden="true" />
      <div className="mx-[16.66%] h-px bg-violet-400/60" aria-hidden="true" />

      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {sectors.map((sector) => (
          <div key={sector} className="flex flex-col items-center">
            <div className="h-6 w-px bg-violet-400/60" aria-hidden="true" />
            <div className="w-full rounded-xl border border-slate-300 bg-white px-2 py-3 text-center text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 sm:text-sm">
              {sector}
            </div>
            <div className="h-6 w-px bg-slate-400/60" aria-hidden="true" />
          </div>
        ))}
      </div>

      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
        {pipeline.map((step, i) => (
          <Fragment key={step}>
            <div className="flex-1 rounded-xl bg-gradient-to-l from-emerald-600 to-sky-600 px-3 py-3 text-center text-sm font-bold text-white shadow">
              {step}
            </div>
            {i < pipeline.length - 1 && (
              <span className="text-center text-xl font-bold text-emerald-600 dark:text-emerald-400" aria-hidden="true">
                <span className="sm:hidden">↓</span>
                <span className="hidden sm:inline">←</span>
              </span>
            )}
          </Fragment>
        ))}
      </div>
    </figure>
  );
}

function SurvivalAxes() {
  return (
    <div className="my-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
      {SURVIVAL_AXES.map((axis, i) => (
        <div
          key={axis}
          className="rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-3 text-center dark:border-emerald-500/30 dark:bg-emerald-500/10"
        >
          <span className="block font-mono text-xs text-emerald-600 dark:text-emerald-400">0{i + 1}</span>
          <span className="text-sm font-bold text-emerald-900 dark:text-emerald-200">{axis}</span>
        </div>
      ))}
    </div>
  );
}

const TIER_STYLES = {
  A: {
    badge: 'bg-emerald-600 text-white',
    border: 'border-emerald-400/60 dark:border-emerald-500/40',
    accent: 'text-emerald-700 dark:text-emerald-400',
  },
  B: {
    badge: 'bg-sky-600 text-white',
    border: 'border-sky-400/60 dark:border-sky-500/40',
    accent: 'text-sky-700 dark:text-sky-400',
  },
  C: {
    badge: 'bg-violet-600 text-white',
    border: 'border-violet-400/60 dark:border-violet-500/40',
    accent: 'text-violet-700 dark:text-violet-400',
  },
};

function Tier({ level, title, en, pillars }) {
  const style = TIER_STYLES[level];
  return (
    <section className="mt-12">
      <header className="mb-5 flex items-center gap-4">
        <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl font-mono text-3xl font-black shadow-lg ${style.badge}`}>
          {level}
        </span>
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white sm:text-xl">
            المستوى {level}: {title}
          </h3>
          <p dir="ltr" className={`text-end font-mono text-xs font-semibold sm:text-sm ${style.accent}`}>
            {en}
          </p>
        </div>
      </header>
      <div className="space-y-6">
        {pillars.map((pillar) => (
          <Pillar key={pillar.num} pillar={pillar} style={style} />
        ))}
      </div>
    </section>
  );
}

function Pillar({ pillar, style }) {
  return (
    <article className={`overflow-hidden rounded-2xl border-2 bg-white shadow-sm dark:bg-slate-900 ${style.border}`}>
      <header className="flex items-start gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/80">
        <span className={`font-mono text-2xl font-black ${style.accent}`}>{pillar.num}.</span>
        <div>
          <h4 className="text-base font-extrabold text-slate-900 dark:text-white sm:text-lg">{pillar.title}</h4>
          <p dir="ltr" className="text-end font-mono text-xs text-slate-500 dark:text-slate-400">
            {pillar.en}
          </p>
        </div>
      </header>
      <dl className="grid gap-px bg-slate-200 dark:bg-slate-800 md:grid-cols-2">
        {PILLAR_FIELDS.map(([key, label]) => (
          <div
            key={key}
            className={`px-5 py-4 ${
              key === 'test' ? 'bg-amber-50 dark:bg-amber-950 md:col-span-2' : `bg-white dark:bg-slate-900 ${key === 'baseline' ? 'md:col-span-2' : ''}`
            }`}
          >
            <dt className={`text-xs font-bold tracking-wide ${key === 'test' ? 'text-amber-700 dark:text-amber-400' : style.accent}`}>
              {key === 'test' ? '⚖ ' : ''}
              {label}
            </dt>
            <dd className="mt-1.5 font-naskh text-base leading-loose text-slate-700 dark:text-slate-300">
              <Inline text={pillar[key]} />
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

function Flow({ steps }) {
  return (
    <ol className="my-8 grid grid-cols-2 gap-3 sm:flex sm:items-stretch sm:gap-0">
      {steps.map((step, i) => (
        <li key={step.en} className="flex items-center sm:flex-1">
          <div className="w-full rounded-xl border border-sky-300 bg-gradient-to-b from-sky-50 to-white px-3 py-4 text-center dark:border-sky-500/40 dark:from-sky-500/15 dark:to-slate-900">
            <span className="block font-mono text-sm font-bold text-sky-700 dark:text-sky-300">{step.en}</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white">{step.ar}</span>
          </div>
          {i < steps.length - 1 && (
            <span className="hidden px-2 text-xl font-bold text-sky-500 sm:inline" aria-hidden="true">
              ←
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

function Timeline({ phases }) {
  return (
    <ol className="relative my-8 space-y-0 border-r-2 border-dashed border-slate-300 pr-6 dark:border-slate-700 sm:pr-8">
      {phases.map((phase, i) => (
        <li key={phase.en} className="relative pb-8">
          <span
            className="absolute -right-[2.45rem] top-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 font-mono text-xs font-bold text-white ring-4 ring-white dark:ring-slate-950 sm:-right-[2.95rem]"
            aria-hidden="true"
          >
            {i + 1}
          </span>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-slate-900 px-3 py-1 font-mono text-xs font-bold text-white dark:bg-white dark:text-slate-900">
                {phase.years}
              </span>
              <span className="font-mono text-sm font-bold text-emerald-700 dark:text-emerald-400">{phase.en}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">({phase.ar})</span>
            </div>
            <p className="mt-2 font-bold text-slate-900 dark:text-white">{phase.name}</p>
            <p className="mt-1 font-naskh text-base leading-loose text-slate-700 dark:text-slate-300 sm:text-lg">
              {phase.text}
            </p>
          </div>
          {phase.gate && (
            <div className="mt-4 flex gap-3 rounded-xl border-2 border-amber-400/70 bg-amber-50 p-4 dark:border-amber-500/40 dark:bg-amber-500/10">
              <span className="text-xl text-amber-600 dark:text-amber-400" aria-hidden="true">
                ⟐
              </span>
              <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200 sm:text-base">
                <strong className="text-amber-800 dark:text-amber-300">{phase.gate.name}:</strong> {phase.gate.text}
              </p>
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}

function PlanetaryDashboard() {
  return (
    <section
      aria-label="لوحة القيادة الكوكبية"
      className="my-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900"
    >
      <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/60 sm:px-6">
        <p className="text-base font-extrabold text-slate-900 dark:text-white sm:text-lg">📊 Planetary Dashboard</p>
        <span className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" aria-hidden="true" />
          {DASHBOARD.length} قطاعات
        </span>
      </header>

      {/* جدول للشاشات الكبيرة */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full text-right text-sm">
          <thead className="bg-slate-100 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-400">
            <tr>
              {DASHBOARD_COLUMNS.map(([key, label]) => (
                <th key={key} scope="col" className="px-5 py-3 font-bold">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {DASHBOARD.map((row) => (
              <tr
                key={row.sector}
                className="align-top transition-colors odd:bg-white even:bg-slate-50/60 hover:bg-sky-50 dark:odd:bg-slate-900 dark:even:bg-slate-900/40 dark:hover:bg-slate-800/70"
              >
                <th scope="row" className="whitespace-nowrap px-5 py-4 font-bold text-slate-900 dark:text-white">
                  {row.sector}
                </th>
                <td className="px-5 py-4 font-semibold leading-relaxed text-emerald-800 dark:text-emerald-300">
                  <Inline text={row.target} />
                </td>
                <td className="px-5 py-4 leading-relaxed text-slate-600 dark:text-slate-400">{row.baseline}</td>
                <td className="px-5 py-4 leading-relaxed text-slate-700 dark:text-slate-300">{row.method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* بطاقات للشاشات الصغيرة والمتوسطة */}
      <ul className="divide-y divide-slate-200 dark:divide-slate-800 lg:hidden">
        {DASHBOARD.map((row) => (
          <li key={row.sector} className="px-5 py-5">
            <p className="text-base font-extrabold text-slate-900 dark:text-white">{row.sector}</p>
            <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
              {DASHBOARD_COLUMNS.slice(1).map(([key, label]) => (
                <div key={key} className="rounded-lg bg-slate-100 p-3 dark:bg-slate-800/60">
                  <dt className="text-xs text-slate-500 dark:text-slate-400">{label}</dt>
                  <dd
                    className={`mt-1 leading-relaxed ${
                      key === 'target'
                        ? 'font-semibold text-emerald-800 dark:text-emerald-300'
                        : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <Inline text={row[key]} />
                  </dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </section>
  );
}

const BLOCKS = {
  drum: Drum,
  p: Paragraph,
  stat: Stat,
  hammer: Hammer,
  principle: Principle,
  label: Label,
  heading: Heading,
  bullets: Bullets,
  ordered: Ordered,
  limits: Limits,
  architecture: Architecture,
  axes: SurvivalAxes,
  tier: Tier,
  flow: Flow,
  timeline: Timeline,
  dashboard: PlanetaryDashboard,
};

function ChapterHeader({ id, title, en }) {
  return (
    <header className="mb-8 flex items-start gap-4 sm:gap-6">
      <span
        aria-hidden="true"
        className="bg-gradient-to-b from-sky-500 to-emerald-500 bg-clip-text font-mono text-5xl font-black leading-none text-transparent sm:text-7xl"
      >
        {id}
      </span>
      <div className="pt-1">
        <p className="text-xs font-bold tracking-[0.25em] text-sky-600 dark:text-sky-400">الفصل {id}</p>
        <h2 id={`chapter-${id}-title`} className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
          {title}
        </h2>
        {en && (
          <p dir="ltr" className="mt-2 text-end font-mono text-sm text-slate-500 dark:text-slate-400">
            {en}
          </p>
        )}
      </div>
    </header>
  );
}

function Chapter({ chapter }) {
  return (
    <article
      id={`chapter-${chapter.id}`}
      aria-labelledby={`chapter-${chapter.id}-title`}
      className="scroll-mt-28 border-b border-slate-200 py-14 dark:border-slate-800 sm:py-20"
    >
      <ChapterHeader id={chapter.id} title={chapter.title} en={chapter.en} />
      {chapter.algorithm && <SurvivalAlgorithm text={chapter.algorithm} />}
      {chapter.blocks.map((block, i) => {
        const Block = BLOCKS[block.type];
        return Block ? <Block key={i} {...block} /> : null;
      })}
    </article>
  );
}

const CRESCENDO_TONES = {
  base: 'text-xl text-slate-700 dark:text-slate-200 sm:text-2xl',
  strong: 'text-3xl font-black text-slate-900 dark:text-white sm:text-5xl',
  dark: 'text-xl font-semibold text-red-700 dark:text-red-300 sm:text-2xl',
  hope: 'text-xl font-bold text-emerald-700 dark:text-emerald-300 sm:text-3xl',
};

function Finale({ notify }) {
  const { call } = FINALE;
  return (
    <section
      id={`chapter-${FINALE.id}`}
      aria-labelledby={`chapter-${FINALE.id}-title`}
      className="relative scroll-mt-28 overflow-hidden bg-gradient-to-b from-slate-100 via-sky-50 to-white py-20 dark:from-slate-950 dark:via-indigo-950 dark:to-black sm:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-100"
        style={{
          backgroundImage:
            'radial-gradient(1px 1px at 20% 30%, #fff 50%, transparent), radial-gradient(1px 1px at 70% 20%, #fff 50%, transparent), radial-gradient(1.5px 1.5px at 40% 80%, #fde68a 50%, transparent), radial-gradient(1px 1px at 85% 65%, #fff 50%, transparent), radial-gradient(1px 1px at 10% 70%, #bae6fd 50%, transparent), radial-gradient(1px 1px at 55% 45%, #fff 50%, transparent), radial-gradient(1px 1px at 30% 55%, #fff 50%, transparent), radial-gradient(1.5px 1.5px at 90% 10%, #fde68a 50%, transparent)',
        }}
      />
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
        <ChapterHeader id={FINALE.id} title={FINALE.title} />

        {/* النداء الشامل */}
        <div className="mt-12 text-center">
          <p className="text-3xl font-black text-red-600 dark:text-red-400 sm:text-5xl">{call.opening}</p>
          <ul className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-3">
            {call.addressees.map((who) => (
              <li
                key={who}
                className="rounded-full border border-slate-300 bg-white/70 px-4 py-2 text-sm font-bold text-slate-800 backdrop-blur dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 sm:text-base"
              >
                {who}
              </li>
            ))}
          </ul>
          <p className="mt-8 font-naskh text-xl text-slate-600 dark:text-slate-300 sm:text-2xl">{call.tail}</p>
          <p className="mx-auto mt-6 max-w-2xl rounded-2xl border-2 border-amber-400/70 bg-amber-50 px-6 py-5 text-xl font-extrabold leading-relaxed text-slate-900 dark:border-amber-500/50 dark:bg-amber-500/10 dark:text-amber-50 sm:text-3xl">
            {call.oath}
          </p>
        </div>

        {/* التدرج الخاتمي */}
        <div className="mt-20 space-y-8 text-center">
          {FINALE.crescendo.map((line) => (
            <p key={line.text} className={`font-naskh leading-loose ${CRESCENDO_TONES[line.tone]}`}>
              {line.text}
            </p>
          ))}
        </div>

        {/* السطر الأخير */}
        <div className="mx-auto mt-24 max-w-3xl text-center">
          <div className="mx-auto mb-10 h-px w-48 bg-gradient-to-l from-transparent via-amber-500 to-transparent" />
          <p className="text-xs font-bold tracking-[0.4em] text-amber-600 dark:text-amber-400">السطر الأخير</p>
          <p className="mt-6 bg-gradient-to-l from-amber-500 via-sky-500 to-emerald-500 bg-clip-text text-2xl font-black leading-[1.9] text-transparent dark:from-amber-300 dark:via-sky-300 dark:to-emerald-300 sm:text-4xl sm:leading-[1.8]">
            {FINALE.finalLine}
          </p>
          <div className="mt-8 flex justify-center gap-4 text-3xl" aria-hidden="true">
            <span>☀</span>
            <span>💧</span>
            <span>🌳</span>
          </div>
          <p className="mt-12 font-naskh text-lg italic text-slate-600 dark:text-slate-300 sm:text-2xl">
            {FINALE.signature}
          </p>
          <PlanetLogo className="mx-auto mt-10 h-16 w-16 opacity-80" />
          <ShareButtons notify={notify} label="انشر الوثيقة… ووقّع على مستقبل الحياة" className="mt-12" />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  المكون الرئيسي                                                     */
/* ------------------------------------------------------------------ */

const THEME_KEY = 'psd-theme';

function readStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
}

export default function PlanetarySurvivalDocument() {
  const [isDark, setIsDark] = useState(() => readStoredTheme() !== 'light');
  const [copyState, setCopyState] = useState('idle'); // idle | copied | error
  const [toast, setToast] = useState({ message: '', tone: 'success', visible: false });
  const resetTimer = useRef(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    try {
      localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
    } catch {
      /* التخزين غير متاح — نتجاهل */
    }
  }, [isDark]);

  useEffect(
    () => () => {
      clearTimeout(resetTimer.current);
      clearTimeout(toastTimer.current);
    },
    []
  );

  const notify = useCallback((message, tone = 'success') => {
    clearTimeout(toastTimer.current);
    setToast({ message, tone, visible: true });
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2500);
  }, []);

  const handleCopy = useCallback(async () => {
    clearTimeout(resetTimer.current);
    try {
      await copyToClipboard(buildPlainText());
      setCopyState('copied');
      notify('✓ نُسخت الوثيقة كاملةً إلى الحافظة');
    } catch {
      setCopyState('error');
      notify('تعذّر النسخ — يرجى المحاولة مرة أخرى', 'error');
    }
    resetTimer.current = setTimeout(() => setCopyState('idle'), 2500);
  }, [notify]);

  return (
    <div
      dir="rtl"
      lang="ar"
      className="min-h-screen bg-white font-arabic text-slate-800 antialiased transition-colors duration-300 dark:bg-slate-950 dark:text-slate-200"
    >
      <ReadingProgress />

      {/* شريط علوي ثابت */}
      <div className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <a href="#top" className="flex min-w-0 items-center gap-2">
            <PlanetLogo className="h-8 w-8 shrink-0" />
            <span className="truncate text-sm font-extrabold text-slate-900 dark:text-white sm:text-base">
              {DOCUMENT_META.title}
            </span>
          </a>
          <div className="flex shrink-0 items-center gap-2">
            <CopyButton onCopy={handleCopy} state={copyState} compact />
            <ShareMenu notify={notify} />
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark((d) => !d)} />
          </div>
        </div>
        <nav aria-label="فهرس الفصول" className="mx-auto max-w-5xl overflow-x-auto px-4 pb-2 sm:px-6">
          <ol className="flex gap-1.5 whitespace-nowrap text-xs">
            {NAV_ITEMS.map((c) => (
              <li key={c.id}>
                <a
                  href={`#chapter-${c.id}`}
                  className={`inline-block rounded-full px-3 py-1 transition ${
                    c.id === FINALE.id
                      ? 'text-amber-700 hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-slate-800'
                      : 'text-slate-600 hover:bg-sky-100 hover:text-sky-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-sky-300'
                  }`}
                >
                  <span className="font-mono">{c.id}</span> · {c.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* الترويسة الرئيسية */}
      <header
        id="top"
        className="relative overflow-hidden bg-gradient-to-br from-sky-100 via-white to-emerald-100 dark:from-slate-950 dark:via-sky-950 dark:to-emerald-950"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-sky-400/30 blur-3xl dark:bg-sky-500/20"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-emerald-400/30 blur-3xl dark:bg-emerald-500/20"
        />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28">
          <PlanetLogo className="h-28 w-28 drop-shadow-2xl sm:h-36 sm:w-36" />
          <h1 className="mt-8 bg-gradient-to-l from-sky-700 via-emerald-600 to-sky-700 bg-clip-text text-4xl font-black leading-tight text-transparent dark:from-sky-300 dark:via-emerald-300 dark:to-sky-300 sm:text-6xl lg:text-7xl">
            {DOCUMENT_META.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-bold text-slate-700 dark:text-slate-200 sm:text-2xl">
            {DOCUMENT_META.motto}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a
              href="#chapter-01"
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              ابدأ القراءة ↓
            </a>
            <CopyButton onCopy={handleCopy} state={copyState} />
          </div>
          <ShareButtons notify={notify} className="mt-8" />
        </div>
      </header>

      {/* الفصول 01–10 */}
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-4xl">
        {CHAPTERS.map((chapter) => (
          <Chapter key={chapter.id} chapter={chapter} />
        ))}
      </main>

      {/* الفصل 11 — السطر الأخير */}
      <Finale notify={notify} />

      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-black dark:text-slate-500">
        {DOCUMENT_META.title} · {DOCUMENT_META.motto}
      </footer>

      <Toast toast={toast} />
    </div>
  );
}
