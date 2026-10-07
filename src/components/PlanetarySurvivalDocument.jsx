import { Fragment, useCallback, useEffect, useId, useRef, useState } from 'react';

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

const CREDITS = {
  title: 'التوثيق والحقوق',
  people: [
    {
      role: 'إعداد وتطوير',
      name: 'الطالب رضا أحمد يوسف',
      detail: 'الصف الثاني الإعدادي — برنامج السنوات المتوسطة MYP',
    },
    {
      role: 'تحت إشراف ومراجعة',
      name: 'أستاذ حسن معيوف',
      detail: 'معلم مادة الأفراد والمجتمعات',
    },
    {
      role: 'المؤسسة',
      name: 'مدرسة الميثاق الإعدادية للبنين',
    },
  ],
  copyright:
    '© 2026-2027 جميع الحقوق محفوظة ضمن متطلبات مشاريع مادة الأفراد والمجتمعات (MYP\u00a0A).', // مسافة غير قابلة للكسر تُبقي «MYP A» في سطر واحد
  footer: '© 2026-2027 رضا أحمد يوسف · مدرسة الميثاق الإعدادية للبنين',
  statement:
    'هذه الوثيقة الرقمية وخوارزميات البقاء الكوكبي ثمرة جهد أكاديمي وفكري، ويُحفظ العمل بالكامل باسم المعد وتحت إشراف معلم المادة.',
};

// الخلاصة التنفيذية: إيجاز لركائز الوثيقة، مستمد من نصوص الفصول 01–10
const SUMMARY = {
  title: 'الخلاصة التنفيذية',
  en: 'Executive Summary',
  lead: 'وثيقة البقاء الكوكبي في دقيقة واحدة: إنذار مُقاس، وخوارزميات واضحة، وتقنيات مصنّفة بحسب جاهزيتها، وإطار تحقق لا يعترف إلا بما يُقاس ويُدقَّق.',
  stats: [
    { value: '+1.43°C', label: 'احترار عام 2025 فوق مستوى ما قبل الصناعة' },
    { value: '43%', label: 'خفض مطلوب للانبعاثات بحلول 2030' },
    { value: '84%', label: 'خفض مطلوب للانبعاثات بحلول 2050' },
    { value: '5', label: 'أركان تكنولوجية في ثلاثة مستويات جاهزية' },
  ],
  pillars: [
    {
      icon: '🚨',
      title: 'الإنذار',
      chapters: '01–02',
      points: [
        'الأرض تجاوزت 1.43°C فوق مستوى ما قبل الصناعة، وكل جزء من الدرجة تزيد معه المخاطر.',
        'الحلول الجزئية لا تكفي: المطلوب خفض عميق وسريع على مستوى منظومة الكوكب.',
      ],
    },
    {
      icon: '⟨⟩',
      title: 'خوارزميات البقاء',
      chapters: '02–10',
      points: ['نقيس لننقذ.', 'نزرع لنحيا.', 'نكتب لنفتح عهدًا جديدًا.'],
    },
    {
      icon: '△',
      title: 'هرم الجاهزية',
      chapters: '03–05',
      points: [
        'A — مثبتة وقابلة للتوسع: الشبكة الذكية للطاقة النظيفة (CEIG).',
        'B — ناشئة: أبراج الهواء النقي والاستعادة البيئية المؤتمتة.',
        'C — تجريبية: شبكة المحيطات الذكية وإدارة الكربون المتقدمة.',
        'كل ركن يخضع لاختبار قابلية البقاء عبر ستة محاور.',
      ],
    },
    {
      icon: '✓',
      title: 'إطار MRV والتدقيق',
      chapters: '06',
      points: [
        'قياس ← إبلاغ ← تحقق ← تدقيق مستقل.',
        'لا يُسجَّل في سجل الإنجاز إلا ما قيس وأُبلغ عنه وتُحقق منه ودُقّق.',
      ],
    },
    {
      icon: '⟶',
      title: 'التنفيذ والحوكمة',
      chapters: '07–09',
      points: [
        'اختبار (2027–2030) ← توسيع (2030–2040) ← دمج (2040–2050)، عبر بوابتَي قرار.',
        'تمويل من عوائد تسعير الكربون والسندات الخضراء والشراكات.',
        'لا توسّع ما لم تُثبت التجربة أثره وسلامته وقابليته للقياس.',
      ],
    },
  ],
};

const NAV_ITEMS = [
  // الخلاصة أولاً: تظهر في أول الفهرس على شاشة الهاتف دون تمرير جانبي
  { href: '#summary', num: '◆', title: SUMMARY.title, tone: 'summary' },
  ...CHAPTERS.map((c) => ({ href: `#chapter-${c.id}`, num: c.id, title: c.title })),
  { href: `#chapter-${FINALE.id}`, num: FINALE.id, title: FINALE.title, tone: 'finale' },
  { href: '#credits', num: '©', title: CREDITS.title, tone: 'credits' },
];

const NAV_TONES = {
  default:
    'text-slate-600 hover:bg-sky-100 hover:text-sky-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-sky-300',
  summary: 'text-emerald-700 hover:bg-emerald-100 dark:text-emerald-400 dark:hover:bg-slate-800',
  finale: 'text-amber-700 hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-slate-800',
  credits: 'text-slate-500 hover:bg-slate-100 dark:text-slate-500 dark:hover:bg-slate-800',
};

/* ------------------------------------------------------------------ */
/*  تحويل الوثيقة إلى نص قابل للنسخ                                    */
/* ------------------------------------------------------------------ */

const SUBSCRIPT_DIGITS = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉' };

// PM_{2.5} ← PM₂.₅
const toSubscripts = (text) =>
  text.replace(/_\{(.+?)\}/g, (_, sub) => sub.replace(/\d/g, (d) => SUBSCRIPT_DIGITS[d]));

// يحوّل علامات التنسيق إلى نص عادي: **غامق** ← غامق، و PM_{2.5} ← PM₂.₅
const stripMarks = (text) => toSubscripts(text).replace(/\*\*(.+?)\*\*/g, '$1');

// يحوّل كتلة محتوى إلى نص؛ md=true ينتج Markdown (عناوين، اقتباسات، جداول)
function blockToText(block, md = false) {
  const fmt = md ? toSubscripts : stripMarks; // Markdown يحتفظ بالغامق **…**
  const bold = (t) => (md ? `**${t}**` : t);
  switch (block.type) {
    case 'drum':
      return md
        ? block.lines.map((l) => `**${block.word}** ${l}`).join('  \n')
        : `«${block.lines.map((l) => `${block.word} ${l}`).join(' ')}»`;
    case 'p':
      return fmt(block.text);
    case 'stat':
      return null; // الرقم مذكور في الفقرة التالية
    case 'hammer':
      return md ? `> ⚡ **«${block.text}»**` : `«${block.text}»`;
    case 'principle':
      return md ? `> **«${block.text}»**` : `«${block.text}»`;
    case 'label':
      return bold(`${block.text}:`);
    case 'heading':
      return md ? `### ${block.text}` : `■ ${block.text}`;
    case 'bullets':
      return block.items
        .map((item) => {
          const head = md
            ? `- **${item.label}:** ${fmt(item.text)}`.trimEnd()
            : `• ${item.label}${item.text ? `: ${fmt(item.text)}` : ':'}`;
          const sub = (item.sub || []).map((s, i) => `   ${i + 1}. ${s}`);
          return [head, ...sub].join('\n');
        })
        .join('\n');
    case 'ordered':
      return block.items.map((item, i) => `${i + 1}. ${bold(`${item.label}:`)} ${item.text}`).join('\n');
    case 'limits':
      return block.items.map((item) => `${md ? '- ' : ''}✕ ${item}`).join('\n');
    case 'architecture':
      return md ? `\`\`\`text\n${ARCHITECTURE.ascii}\n\`\`\`` : ARCHITECTURE.ascii;
    case 'axes':
      return null; // المحاور مذكورة في الفقرة السابقة
    case 'tier':
      return md
        ? [
            `### المستوى ${block.level}: ${block.title} (${block.en})`,
            ...block.pillars.map((p) =>
              [
                `\n#### ${p.num}. ${p.title} (${p.en})\n`,
                ...PILLAR_FIELDS.map(([key, label]) => `- **${label}:** ${toSubscripts(p[key])}`),
              ].join('\n')
            ),
          ].join('\n')
        : [
            `◆ المستوى ${block.level}: ${block.title} (${block.en})`,
            ...block.pillars.map((p) =>
              [
                `  ${p.num}. ${p.title} (${p.en})`,
                ...PILLAR_FIELDS.map(([key, label]) => `   - ${label}: ${stripMarks(p[key])}`),
              ].join('\n')
            ),
          ].join('\n');
    case 'flow':
      return block.steps.map((s) => bold(`${s.en} (${s.ar})`)).join(' ← ');
    case 'timeline':
      return [
        md ? `\`\`\`text\n${block.ascii}\n\`\`\`\n` : block.ascii,
        ...block.phases.flatMap((ph) => [
          `${md ? '-' : '•'} ${bold(`${ph.name} (${ph.years}) — ${ph.en} (${ph.ar}):`)} ${ph.text}`,
          ...(ph.gate ? [`   ${md ? '- ' : ''}⟐ ${bold(`${ph.gate.name}:`)} ${ph.gate.text}`] : []),
        ]),
      ].join('\n');
    case 'dashboard': {
      const cells = (values) => values.map((v) => v.replace(/\|/g, '\\|'));
      const header = DASHBOARD_COLUMNS.map(([, label]) => label);
      const rows = DASHBOARD.map((row) => DASHBOARD_COLUMNS.map(([key]) => toSubscripts(row[key])));
      return md
        ? [header, header.map(() => '---'), ...rows].map((r) => `| ${cells(r).join(' | ')} |`).join('\n')
        : [header, ...rows].map((r) => r.join(' | ')).join('\n');
    }
    default:
      return null;
  }
}

// نص الوثيقة كاملاً: format = 'txt' (للنسخ وملف النص) أو 'md' (ملف Markdown)
function buildDocumentText(format = 'txt') {
  const md = format === 'md';
  const divider = md ? '---' : '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  const h = (level, text) => (md ? `${'#'.repeat(level)} ${text}` : text);
  const out = md
    ? [h(1, DOCUMENT_META.title), '', `**${DOCUMENT_META.motto}**`, '', divider]
    : [DOCUMENT_META.title, DOCUMENT_META.motto, divider];

  CHAPTERS.forEach((chapter) => {
    out.push('', h(2, `${chapter.id} — ${chapter.title}${chapter.en ? ` (${chapter.en})` : ''}`));
    if (chapter.algorithm) out.push(md ? `\n*خوارزمية البقاء: ${chapter.algorithm}*` : `خوارزمية البقاء: ${chapter.algorithm}`);
    chapter.blocks.forEach((block) => {
      const text = blockToText(block, md);
      if (text) out.push('', text);
    });
    out.push('', divider);
  });

  out.push('', h(2, `${SUMMARY.title} (${SUMMARY.en})`), '', SUMMARY.lead, '');
  out.push(
    md
      ? SUMMARY.stats.map((st) => `- **${st.value}** ${st.label}`).join('\n')
      : SUMMARY.stats.map((st) => `${st.value} ${st.label}`).join(' | ')
  );
  SUMMARY.pillars.forEach((pillar) => {
    out.push(
      '',
      md ? h(3, `${pillar.title} (الفصول ${pillar.chapters})`) : `◆ ${pillar.title} (الفصول ${pillar.chapters})`,
      ...(md ? [''] : []),
      ...pillar.points.map((pt) => `${md ? '-' : '•'} ${pt}`)
    );
  });
  out.push('', divider);

  const { call } = FINALE;
  out.push(
    '',
    h(2, `${FINALE.id} — ${FINALE.title}`),
    '',
    `${call.opening} ${call.addressees.join('، ')}، ${call.tail} ${md ? `**${call.oath}**` : call.oath}`,
    ...FINALE.crescendo.flatMap((line) => ['', md && line.tone === 'strong' ? `**${line.text}**` : line.text]),
    '',
    md ? `> **${FINALE.finalLine}**` : FINALE.finalLine,
    '',
    md ? `*${FINALE.signature}*` : FINALE.signature,
    '',
    divider,
    '',
    h(2, CREDITS.title),
    '',
    ...CREDITS.people.map(
      (p) => `${md ? '- **' : ''}${p.role}:${md ? '**' : ''} ${p.name}${p.detail ? ` (${p.detail})` : ''}`
    ),
    '',
    CREDITS.copyright.replace(/\u00a0/g, ' '),
    '',
    md ? `> «${CREDITS.statement}»` : `«${CREDITS.statement}»`
  );

  return `${out.join('\n')}\n`;
}

function downloadTextFile(filename, content, mime) {
  // BOM لملف النص حتى تعرضه برامج ويندوز القديمة بترميز UTF-8 الصحيح
  const blob = new Blob([mime === 'text/plain' ? `\uFEFF${content}` : content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
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

// وحدات تُعرض كتلة واحدة من اليسار لليمين داخل النص العربي. بعد حرف عربي تُعامَل الأرقام
// كـ«أرقام عربية» في خوارزمية الاتجاه (Unicode Bidi)، فتنفصل عنها الوحدة أو ينعكس النطاق:
// «1.5°C» كانت تظهر «C°1.5»، و«1850–1900» كانت تظهر «1900–1850».
const LTR_UNITS = [
  '[±+]?\\d+(?:\\.\\d+)?°C', // درجات الحرارة: 1.5°C، ±0.13°C، +1.43°C
  '\\d+(?:\\.\\d+)?[–-]\\d+(?:\\.\\d+)?', // النطاقات: 1850–1900، 01–02، 2026-2027
];
const LTR_UNIT = new RegExp(`^(?:${LTR_UNITS.join('|')})$`);
const INLINE_TOKENS = new RegExp(`(\\*\\*.+?\\*\\*|_\\{.+?\\}|${LTR_UNITS.join('|')})`, 'g');

function Inline({ text }) {
  // **غامق**، و _{منخفض} (مثل PM_{2.5})، والوحدات الرقمية التي تُعزل باتجاه LTR
  return text.split(INLINE_TOKENS).map((part, i) => {
    if (part.startsWith('**')) {
      return (
        <strong key={i} className="font-bold text-sky-700 dark:text-sky-300">
          <Inline text={part.slice(2, -2)} />
        </strong>
      );
    }
    if (part.startsWith('_{')) return <sub key={i}>{part.slice(2, -1)}</sub>;
    if (LTR_UNIT.test(part)) {
      return (
        <bdi key={i} dir="ltr">
          {part}
        </bdi>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

function PlanetLogo({ className = '' }) {
  // معرّفات تدرّج فريدة لكل نسخة: لو تشاركت النسخ معرّفاً واحداً وأُخفيت الأولى
  // (مثل الشريط العلوي عند الطباعة) لفقدت بقية النسخ ألوانها
  const uid = useId();
  const planetId = `psd-planet-${uid}`;
  const ringId = `psd-ring-${uid}`;
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={planetId} cx="38%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="45%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#0c4a6e" />
        </radialGradient>
        <linearGradient id={ringId} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="34" fill={`url(#${planetId})`} />
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
        stroke={`url(#${ringId})`}
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
      className={`pointer-events-none fixed inset-x-4 bottom-6 z-50 print:hidden mx-auto flex max-w-sm items-center justify-center gap-3 rounded-2xl px-5 py-4 text-sm font-semibold shadow-2xl ring-1 transition-all duration-300 sm:inset-x-auto sm:left-1/2 sm:w-full sm:-translate-x-1/2 ${
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
      className="fixed inset-x-0 top-0 z-[60] h-1 bg-emerald-500/15 print:hidden"
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

// يُولَّد هذا الملف تلقائياً عند كل نشر (scripts/generate-pdf.mjs)، فيعمل التحميل حتى في
// متصفحات الهاتف والمتصفحات المدمجة في التطبيقات التي لا تدعم الطباعة
const PDF_FILE = 'planetary-survival-document.pdf';

function printDocument(notify) {
  if (typeof window.print === 'function') {
    window.print();
  } else {
    notify('الطباعة غير مدعومة هنا — استخدم «تحميل PDF»', 'error');
  }
}

function PdfIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
    </svg>
  );
}

function PrintIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1h-2" />
      <path d="M6 14h12v7H6z" />
    </svg>
  );
}

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
    <div className={`flex flex-col items-center gap-3 print:hidden ${className}`}>
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
      <div className="flex flex-wrap justify-center gap-2">
        <a
          href={PDF_FILE}
          download
          className={`${SHARE_BTN} bg-red-600 text-white hover:bg-red-500`}
        >
          <PdfIcon className="h-4 w-4" />
          تحميل PDF
        </a>
        <button
          type="button"
          onClick={() => printDocument(notify)}
          className={`${SHARE_BTN} border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800`}
        >
          <PrintIcon className="h-4 w-4" />
          طباعة
        </button>
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
          <div className="my-1 border-t border-slate-200 dark:border-slate-700" />
          <a role="menuitem" href={PDF_FILE} download onClick={close} className={MENU_ITEM}>
            <PdfIcon className="h-4 w-4 text-red-500" />
            تحميل PDF
          </a>
          <button
            role="menuitem"
            type="button"
            onClick={() => {
              close();
              printDocument(notify);
            }}
            className={MENU_ITEM}
          >
            <PrintIcon className="h-4 w-4 text-slate-500" />
            طباعة
          </button>
          {Object.entries(EXPORTS).map(([format, { label }]) => (
            <button
              key={format}
              role="menuitem"
              type="button"
              onClick={() => {
                close();
                exportDocument(format, notify);
              }}
              className={MENU_ITEM}
            >
              <FileIcon className="h-4 w-4 text-slate-500" />
              تحميل {label}
            </button>
          ))}
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
      <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
        <Inline text={caption} />
      </p>
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
      <div className="hidden overflow-x-auto lg:block print:block">
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
      <ul className="divide-y divide-slate-200 dark:divide-slate-800 lg:hidden print:hidden">
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
        className="bg-gradient-to-b from-sky-500 to-emerald-500 bg-clip-text font-mono print:bg-none print:text-sky-600 text-5xl font-black leading-none text-transparent sm:text-7xl"
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

function ExecutiveSummary() {
  return (
    <section
      id="summary"
      aria-labelledby="summary-title"
      className="scroll-mt-28 border-t border-slate-200 bg-gradient-to-b from-emerald-50 via-white to-sky-50 py-16 dark:border-slate-800 dark:from-emerald-950/40 dark:via-slate-950 dark:to-sky-950/30 sm:py-24"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <header className="text-center">
          <p className="text-xs font-bold tracking-[0.35em] text-emerald-700 dark:text-emerald-400">◆ {SUMMARY.en}</p>
          <h2 id="summary-title" className="mt-3 text-3xl font-black text-slate-900 dark:text-white sm:text-5xl">
            {SUMMARY.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl font-naskh text-lg leading-loose text-slate-600 dark:text-slate-300 sm:text-xl">
            {SUMMARY.lead}
          </p>
        </header>

        <dl className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {SUMMARY.stats.map((st) => (
            <div
              key={st.label}
              className="rounded-2xl border border-emerald-300/70 bg-white p-4 text-center shadow-sm dark:border-emerald-500/30 dark:bg-slate-900 sm:p-5"
            >
              <dd dir="ltr" className="font-mono text-3xl font-black text-emerald-600 dark:text-emerald-400 sm:text-4xl">
                {st.value}
              </dd>
              <dt className="mt-2 text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-400 sm:text-sm">
                {st.label}
              </dt>
            </div>
          ))}
        </dl>

        {/* flex بدل grid حتى يتوسّط الصف الأخير غير المكتمل */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {SUMMARY.pillars.map((pillar) => (
            <article
              key={pillar.title}
              className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-6 md:w-[calc(50%-0.5rem)] lg:w-[calc((100%-2rem)/3)]"
            >
              <header className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-sky-600 font-mono text-base font-bold text-white shadow"
                >
                  {pillar.icon}
                </span>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{pillar.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    الفصول <Inline text={pillar.chapters} />
                  </p>
                </div>
              </header>
              <ul className="mt-4 space-y-2">
                {pillar.points.map((pt) => (
                  <li key={pt} className="flex gap-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300 sm:text-base">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
                    <span>
                      <Inline text={pt} />
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollUp = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'instant' : 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={scrollUp}
      aria-label="العودة إلى أعلى الصفحة"
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-6 left-4 z-40 flex print:hidden h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-1 ring-emerald-400/50 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 sm:left-6 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  الطباعة                                                            */
/* ------------------------------------------------------------------ */

const WATERMARK = {
  title: 'وثيقة البقاء الكوكبي — MYP A',
  subtitle: 'مدرسة الميثاق الإعدادية للبنين',
};

// علامة مائية تظهر في الطباعة فقط؛ العنصر الثابت (fixed) يتكرر على كل صفحة مطبوعة
function PrintWatermark() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[70] hidden select-none items-center justify-center overflow-hidden print:flex"
    >
      <div className="flex -rotate-[30deg] flex-col items-center gap-4 text-center text-emerald-900/[0.07]">
        <p className="whitespace-nowrap text-6xl font-black">{WATERMARK.title}</p>
        <p className="whitespace-nowrap text-3xl font-extrabold tracking-wide">{WATERMARK.subtitle}</p>
      </div>
    </div>
  );
}

// بيانات التسليم الأكاديمي على صفحة الغلاف المطبوعة
function PrintCoverCredits() {
  return (
    <dl className="mt-16 hidden w-full max-w-xl grid-cols-1 gap-3 border-t border-slate-300 pt-8 text-sm print:grid">
      {CREDITS.people.map((p) => (
        <div key={p.role} className="flex justify-between gap-6">
          <dt className="font-bold text-slate-500">{p.role}</dt>
          <dd className="text-left font-bold text-slate-900">
            {p.name}
            {p.detail && <span className="block text-xs font-normal text-slate-600">{p.detail}</span>}
          </dd>
        </div>
      ))}
      <p className="mt-6 text-center text-xs text-slate-500">
        <Inline text={CREDITS.copyright} />
      </p>
    </dl>
  );
}

function Credits() {
  return (
    <section
      id="credits"
      aria-labelledby="credits-title"
      className="scroll-mt-28 border-t border-slate-200 bg-slate-50 py-16 dark:border-slate-800 dark:bg-slate-950 sm:py-20"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <PlanetLogo className="mx-auto h-12 w-12" />
          <h2 id="credits-title" className="mt-4 text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
            {CREDITS.title}
          </h2>
          <div className="mx-auto mt-4 h-px w-32 bg-gradient-to-l from-transparent via-emerald-500 to-transparent" />
        </div>

        <dl className="mt-10 grid gap-4 sm:grid-cols-3">
          {CREDITS.people.map((p) => (
            <div
              key={p.role}
              className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <dt className="text-xs font-bold tracking-wide text-emerald-700 dark:text-emerald-400">{p.role}</dt>
              <dd className="mt-2 text-base font-extrabold text-slate-900 dark:text-white">{p.name}</dd>
              {p.detail && (
                <dd className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{p.detail}</dd>
              )}
            </div>
          ))}
        </dl>

        <div className="mt-8 rounded-2xl border-2 border-emerald-500/40 bg-emerald-50 px-6 py-6 text-center dark:border-emerald-500/30 dark:bg-emerald-500/10">
          <p className="text-sm font-bold leading-relaxed text-slate-800 dark:text-slate-100 sm:text-base">
            <Inline text={CREDITS.copyright} />
          </p>
          <p className="mt-4 font-naskh text-base italic leading-loose text-slate-700 dark:text-slate-300 sm:text-lg">
            «{CREDITS.statement}»
          </p>
        </div>
      </div>
    </section>
  );
}

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
          <p className="mt-6 bg-gradient-to-l from-amber-500 via-sky-500 to-emerald-500 bg-clip-text print:bg-none print:text-emerald-800 text-2xl font-black leading-[1.9] text-transparent dark:from-amber-300 dark:via-sky-300 dark:to-emerald-300 sm:text-4xl sm:leading-[1.8]">
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

/* ------------------------------------------------------------------ */
/*  التصدير إلى ملف                                                     */
/* ------------------------------------------------------------------ */

const EXPORTS = {
  md: { label: 'Markdown', file: 'planetary-survival-document.md', mime: 'text/markdown' },
  txt: { label: 'نص TXT', file: 'planetary-survival-document.txt', mime: 'text/plain' },
};

function exportDocument(format, notify) {
  const { file, mime, label } = EXPORTS[format];
  try {
    downloadTextFile(file, buildDocumentText(format), mime);
    notify(`✓ حُمّلت الوثيقة كملف ${label}`);
  } catch {
    notify('تعذّر تحميل الملف', 'error');
  }
}

function FileIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" strokeLinecap="round" />
    </svg>
  );
}

function ExportButtons({ notify }) {
  return (
    <>
      {Object.entries(EXPORTS).map(([format, { label }]) => (
        <button
          key={format}
          type="button"
          onClick={() => exportDocument(format, notify)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-white active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-slate-800 sm:px-5"
        >
          <FileIcon className="h-4 w-4" />
          تحميل {label}
        </button>
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  أدوات الشريط العلوي: طباعة، عرض تقديمي، بحث                         */
/* ------------------------------------------------------------------ */

const TOOL_BTN =
  'inline-flex h-10 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/80 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800';

function SearchIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function SlidesIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M12 16v4M8 20h8" strokeLinecap="round" />
      <path d="m10 8 4 2-4 2z" fill="currentColor" />
    </svg>
  );
}

function PrintButton({ notify }) {
  return (
    <button
      type="button"
      onClick={() => printDocument(notify)}
      className={`${TOOL_BTN} w-10 sm:w-auto sm:px-4`}
      title="طباعة / حفظ PDF"
    >
      <PrintIcon className="h-4 w-4 shrink-0" />
      <span className="sr-only sm:not-sr-only">طباعة / حفظ PDF</span>
    </button>
  );
}

/* ---------------------------- العرض التقديمي ---------------------------- */

// أبرز جملة في الفصل: أول مطرقة أو مبدأ، وإلا سطور «قفوا…»
function chapterHighlight(chapter) {
  const quote = chapter.blocks.find((b) => b.type === 'hammer' || b.type === 'principle');
  if (quote) return quote.text;
  const drum = chapter.blocks.find((b) => b.type === 'drum');
  return drum ? drum.lines.map((l) => `${drum.word} ${l}`).join(' ') : null;
}

// نقاط موجزة من كتل الفصل (بحد أقصى 5)
function chapterPoints(chapter) {
  const points = chapter.blocks.flatMap((b) => {
    switch (b.type) {
      case 'bullets':
      case 'ordered':
        return b.items.map((item) => item.label);
      case 'label':
      case 'heading':
        return [b.text];
      case 'tier':
        return [`المستوى ${b.level}: ${b.title}`];
      case 'flow':
        return [b.steps.map((st) => st.ar).join(' ← ')];
      case 'timeline':
        return b.phases.map((ph) => `${ph.years} — ${ph.en} (${ph.ar})`);
      case 'dashboard':
        return DASHBOARD.map((row) => row.sector);
      case 'architecture':
        return [ARCHITECTURE.neural.title, ARCHITECTURE.pipeline.join(' ← ')];
      case 'limits':
        return b.items;
      default:
        return [];
    }
  });
  return points.slice(0, 5);
}

const SLIDES = [
  { kind: 'cover' },
  ...CHAPTERS.map((chapter) => ({
    kind: 'chapter',
    chapter,
    highlight: chapterHighlight(chapter),
    points: chapterPoints(chapter),
    stat: chapter.blocks.find((b) => b.type === 'stat'),
  })),
  { kind: 'summary-stats' },
  { kind: 'summary-pillars' },
  { kind: 'call' },
  { kind: 'final' },
  { kind: 'credits' },
];

function SlideContent({ slide }) {
  switch (slide.kind) {
    case 'cover':
      return (
        <div className="text-center">
          <PlanetLogo className="mx-auto h-28 w-28 sm:h-40 sm:w-40" />
          <h2 className="mt-8 text-4xl font-black text-emerald-300 sm:text-7xl">{DOCUMENT_META.title}</h2>
          <p className="mt-6 text-xl font-bold text-slate-200 sm:text-3xl">{DOCUMENT_META.motto}</p>
          <p className="mt-10 text-sm text-slate-400 sm:text-lg">
            {CREDITS.people[0].name} · {CREDITS.people[2].name} · MYP A
          </p>
        </div>
      );
    case 'chapter': {
      const { chapter, highlight, points, stat } = slide;
      return (
        <div className="w-full max-w-4xl">
          <div className="flex items-end gap-4 sm:gap-6">
            <span className="font-mono text-6xl font-black leading-none text-sky-400 sm:text-8xl">{chapter.id}</span>
            <div>
              <h2 className="text-3xl font-black text-white sm:text-5xl">{chapter.title}</h2>
              {chapter.en && (
                <p dir="ltr" className="mt-1 text-end font-mono text-sm text-slate-400">
                  {chapter.en}
                </p>
              )}
            </div>
          </div>
          {chapter.algorithm && (
            <p className="mt-6 inline-block rounded-lg bg-emerald-500/15 px-4 py-2 text-lg font-bold text-emerald-300 sm:text-2xl">
              ›_ {chapter.algorithm}
            </p>
          )}
          {stat && (
            <p dir="ltr" className="mt-6 text-end font-mono text-5xl font-black text-red-400 sm:text-7xl">
              +{stat.value}
            </p>
          )}
          {highlight && (
            <blockquote className="mt-8 border-r-4 border-amber-400 pr-5 text-xl font-extrabold leading-relaxed text-amber-50 sm:text-3xl">
              «<Inline text={highlight} />»
            </blockquote>
          )}
          {points.length > 0 && (
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {points.map((pt) => (
                <li key={pt} className="flex gap-3 rounded-xl bg-white/5 px-4 py-3 text-base text-slate-200 sm:text-lg">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-sky-400" aria-hidden="true" />
                  <span>
                    <Inline text={pt} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }
    case 'summary-stats':
      return (
        <div className="w-full max-w-5xl text-center">
          <p className="text-sm font-bold tracking-[0.35em] text-emerald-400">◆ {SUMMARY.en}</p>
          <h2 className="mt-3 text-4xl font-black text-white sm:text-6xl">{SUMMARY.title}</h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-loose text-slate-300 sm:text-xl">{SUMMARY.lead}</p>
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {SUMMARY.stats.map((st) => (
              <div key={st.label} className="rounded-2xl bg-white/5 p-5">
                <p dir="ltr" className="font-mono text-4xl font-black text-emerald-400 sm:text-5xl">
                  {st.value}
                </p>
                <p className="mt-2 text-sm text-slate-300 sm:text-base">{st.label}</p>
              </div>
            ))}
          </div>
        </div>
      );
    case 'summary-pillars':
      return (
        <div className="w-full max-w-5xl">
          <h2 className="text-center text-3xl font-black text-white sm:text-5xl">ركائز الوثيقة</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SUMMARY.pillars.map((pillar) => (
              <div key={pillar.title} className="rounded-2xl bg-white/5 p-5">
                <p className="text-xl font-extrabold text-emerald-300">
                  <span aria-hidden="true">{pillar.icon}</span> {pillar.title}
                </p>
                <p className="mt-2 text-base leading-relaxed text-slate-300">
                  <Inline text={pillar.points[0]} />
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    case 'call':
      return (
        <div className="w-full max-w-4xl text-center">
          <p className="text-4xl font-black text-red-400 sm:text-6xl">{FINALE.call.opening}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {FINALE.call.addressees.map((who) => (
              <span key={who} className="rounded-full bg-white/10 px-4 py-2 text-base font-bold text-white sm:text-lg">
                {who}
              </span>
            ))}
          </div>
          <p className="mt-8 text-xl text-slate-300 sm:text-2xl">{FINALE.call.tail}</p>
          <p className="mt-6 text-2xl font-black leading-relaxed text-amber-200 sm:text-4xl">{FINALE.call.oath}</p>
        </div>
      );
    case 'final':
      return (
        <div className="w-full max-w-4xl text-center">
          <p className="text-sm font-bold tracking-[0.4em] text-amber-400">{FINALE.title}</p>
          <p className="mt-8 text-3xl font-black leading-[1.8] text-emerald-300 sm:text-5xl">{FINALE.finalLine}</p>
          <p className="mt-10 text-lg italic text-slate-300 sm:text-2xl">{FINALE.signature}</p>
        </div>
      );
    case 'credits':
      return (
        <div className="w-full max-w-3xl text-center">
          <h2 className="text-3xl font-black text-white sm:text-5xl">{CREDITS.title}</h2>
          <dl className="mt-8 space-y-4">
            {CREDITS.people.map((person) => (
              <div key={person.role}>
                <dt className="text-sm font-bold text-emerald-400">{person.role}</dt>
                <dd className="mt-1 text-xl font-extrabold text-white sm:text-2xl">{person.name}</dd>
                {person.detail && <dd className="text-sm text-slate-400 sm:text-base">{person.detail}</dd>}
              </div>
            ))}
          </dl>
          <p className="mt-8 text-sm text-slate-400 sm:text-base">
            <Inline text={CREDITS.copyright} />
          </p>
        </div>
      );
    default:
      return null;
  }
}

function Slideshow({ onClose }) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef(null);
  const closeRef = useRef(null);
  const last = SLIDES.length - 1;

  const go = useCallback((delta) => setIndex((i) => Math.min(last, Math.max(0, i + delta))), [last]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    // اتجاه عربي: السهم الأيسر للشريحة التالية، والأيمن للسابقة
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (['ArrowLeft', 'PageDown', ' ', 'Enter'].includes(e.key)) {
        e.preventDefault();
        go(1);
      } else if (['ArrowRight', 'PageUp', 'Backspace'].includes(e.key)) {
        e.preventDefault();
        go(-1);
      } else if (e.key === 'Home') setIndex(0);
      else if (e.key === 'End') setIndex(last);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    };
  }, [go, last, onClose]);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    else document.documentElement.requestFullscreen?.().catch(() => {});
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    // سحب الإصبع نحو اليمين = الشريحة التالية (اتجاه الصفحات العربية)
    if (Math.abs(dx) > 50) go(dx > 0 ? 1 : -1);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="العرض التقديمي للوثيقة"
      className="fixed inset-0 z-[80] flex flex-col bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white print:hidden"
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={onTouchEnd}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <p className="truncate text-sm font-bold text-slate-400">{DOCUMENT_META.title}</p>
        <div className="flex shrink-0 gap-2">
          {document.documentElement.requestFullscreen && (
            <button
              type="button"
              onClick={toggleFullscreen}
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20"
            >
              ملء الشاشة
            </button>
          )}
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="إغلاق العرض التقديمي"
            className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            ✕ إغلاق
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto px-5 py-6 sm:px-12">
        <div key={index} className="psd-slide-in flex w-full justify-center">
          <SlideContent slide={SLIDES[index]} />
        </div>
      </div>

      <div className="px-4 pb-4 sm:px-6">
        <div className="mb-3 h-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full origin-right bg-emerald-400 transition-transform duration-300"
            style={{ transform: `scaleX(${(index + 1) / SLIDES.length})` }}
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={index === 0}
            className="rounded-full bg-white/10 px-5 py-2.5 text-sm font-bold hover:bg-white/20 disabled:opacity-30"
          >
            → السابقة
          </button>
          {/* dir=ltr: المسافات حول «/» تجعل خوارزمية الاتجاه تعكس الرقمين في سياق عربي */}
          <p dir="ltr" className="font-mono text-sm text-slate-400" aria-live="polite">
            {index + 1} / {SLIDES.length}
          </p>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={index === last}
            className="rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-30"
          >
            التالية ←
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ البحث السريع ----------------------------- */

// البحث يتجاهل التشكيل والتطويل ويوحّد صور الحروف (أ/إ/آ ← ا، ى ← ي، ة ← ه…)
const AR_IGNORED = /[ؐ-ًؚ-ٰٟۖ-ۭـ]/;
const AR_FOLD = { أ: 'ا', إ: 'ا', آ: 'ا', ٱ: 'ا', ى: 'ي', ة: 'ه', ؤ: 'و', ئ: 'ي' };

function normalizeForSearch(text) {
  let normalized = '';
  const offsets = []; // موضع كل حرف مُطبَّع في النص الأصلي
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (AR_IGNORED.test(ch)) continue;
    const lower = ch.toLowerCase();
    normalized += AR_FOLD[ch] ?? (lower.length === 1 ? lower : ch);
    offsets.push(i);
  }
  return { normalized, offsets };
}

const SECTION_SELECTOR = 'article[id^="chapter-"], section[id^="chapter-"], #summary, #credits, #top';
const SECTION_TITLES = Object.fromEntries([
  ...NAV_ITEMS.map((item) => [item.href.slice(1), item.num === '◆' || item.num === '©' ? item.title : `${item.num} · ${item.title}`]),
  ['top', 'الترويسة'],
]);
const MAX_MATCHES = 300;

function findMatches(root, query) {
  const needle = normalizeForSearch(query.trim()).normalized;
  if (needle.length < 2) return [];
  const matches = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const el = node.parentElement;
      if (!el || el.closest('[data-search-skip]')) return NodeFilter.FILTER_REJECT;
      const visible = el.checkVisibility ? el.checkVisibility() : el.offsetParent !== null;
      return visible ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });
  while (walker.nextNode() && matches.length < MAX_MATCHES) {
    const node = walker.currentNode;
    const { normalized, offsets } = normalizeForSearch(node.data);
    let from = 0;
    let at;
    while ((at = normalized.indexOf(needle, from)) !== -1 && matches.length < MAX_MATCHES) {
      const start = offsets[at];
      const end = offsets[at + needle.length - 1] + 1;
      const range = document.createRange();
      range.setStart(node, start);
      range.setEnd(node, end);
      const section = node.parentElement.closest(SECTION_SELECTOR);
      matches.push({
        range,
        section: (section && SECTION_TITLES[section.id]) || '',
        before: node.data.slice(Math.max(0, start - 28), start),
        text: node.data.slice(start, end),
        after: node.data.slice(end, end + 28),
      });
      from = at + needle.length;
    }
  }
  return matches;
}

const supportsHighlights = () => typeof CSS !== 'undefined' && 'highlights' in CSS && typeof Highlight !== 'undefined';

function QuickFinder({ rootRef, onClose }) {
  const [query, setQuery] = useState('');
  const [matches, setMatches] = useState([]);
  const [current, setCurrent] = useState(-1);
  const [listOpen, setListOpen] = useState(true);
  const inputRef = useRef(null);
  const rowRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      if (supportsHighlights()) {
        CSS.highlights.delete('psd-search');
        CSS.highlights.delete('psd-search-current');
      }
    };
  }, [onClose]);

  // يعيد البحث بعد توقف الكتابة لحظة
  useEffect(() => {
    const timer = setTimeout(() => {
      const found = rootRef.current ? findMatches(rootRef.current, query) : [];
      setMatches(found);
      setCurrent(-1);
      setListOpen(true);
      if (supportsHighlights()) {
        CSS.highlights.set('psd-search', new Highlight(...found.map((m) => m.range)));
        CSS.highlights.delete('psd-search-current');
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [query, rootRef]);

  const jumpTo = useCallback(
    (i) => {
      const match = matches[i];
      if (!match) return;
      setCurrent(i);
      setListOpen(false); // يُطوى بعد الانتقال حتى لا يغطي النص على الهاتف
      if (supportsHighlights()) CSS.highlights.set('psd-search-current', new Highlight(match.range));
      // اللوحة طبقة فوق الصفحة: تظهر النتيجة أسفل صف البحث لا خلفه
      const coveredUntil = rowRef.current?.getBoundingClientRect().bottom ?? 160;
      const top = match.range.getBoundingClientRect().top + window.scrollY - coveredUntil - 32;
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top, behavior: reduceMotion ? 'instant' : 'smooth' });
    },
    [matches]
  );

  const step = (delta) => {
    if (!matches.length) return;
    jumpTo((current + delta + matches.length) % matches.length);
  };

  const hasQuery = normalizeForSearch(query.trim()).normalized.length >= 2;

  return (
    <div data-search-skip className="mx-auto max-w-5xl px-4 pb-3 sm:px-6" role="search">
      <div ref={rowRef} className="flex items-center gap-2">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setListOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                step(e.shiftKey ? -1 : 1);
              }
            }}
            placeholder="ابحث في الوثيقة… (مثال: الشعاب، MRV، 2030)"
            aria-label="البحث في الوثيقة"
            className="h-10 w-full rounded-full border border-slate-300 bg-white pl-4 pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </div>
        <span className="min-w-[3.5rem] text-center font-mono text-xs text-slate-500 dark:text-slate-400" aria-live="polite">
          {hasQuery ? `${matches.length ? current + 1 : 0}/${matches.length}${matches.length === MAX_MATCHES ? '+' : ''}` : ''}
        </span>
        <button type="button" onClick={() => step(-1)} disabled={!matches.length} aria-label="النتيجة السابقة" className={`${TOOL_BTN} w-10 disabled:opacity-40`}>
          ↑
        </button>
        <button type="button" onClick={() => step(1)} disabled={!matches.length} aria-label="النتيجة التالية" className={`${TOOL_BTN} w-10 disabled:opacity-40`}>
          ↓
        </button>
        <button type="button" onClick={onClose} aria-label="إغلاق البحث" className={`${TOOL_BTN} w-10`}>
          ✕
        </button>
      </div>

      {hasQuery && listOpen && (
        <ul className="mt-2 max-h-56 overflow-y-auto rounded-2xl border border-slate-200 bg-white text-sm shadow-lg dark:border-slate-700 dark:bg-slate-900">
          {matches.length === 0 && <li className="px-4 py-3 text-slate-500 dark:text-slate-400">لا توجد نتائج</li>}
          {matches.slice(0, 50).map((m, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => jumpTo(i)}
                className={`block w-full px-4 py-2 text-right transition hover:bg-emerald-50 dark:hover:bg-slate-800 ${
                  i === current ? 'bg-emerald-50 dark:bg-slate-800' : ''
                }`}
              >
                <span className="block text-xs font-bold text-emerald-700 dark:text-emerald-400">{m.section}</span>
                <span className="text-slate-600 dark:text-slate-300">
                  …{m.before}
                  <mark className="rounded bg-amber-200 px-0.5 text-slate-900">{m.text}</mark>
                  {m.after}…
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const THEME_KEY = 'psd-theme';

function readStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
}

// الأقسام بترتيب ظهورها في الوثيقة (الخلاصة تسبق الفصل 11)
const DOC_ORDER = [...CHAPTERS.map((c) => `#chapter-${c.id}`), '#summary', `#chapter-${FINALE.id}`, '#credits'];
const SECTIONS_IN_ORDER = DOC_ORDER.map((href) => NAV_ITEMS.find((item) => item.href === href));

// ينقل إلى عنوان القسم مباشرة تحت الشريط العلوي (بدل بداية القسم وحشوته العلوية)،
// ويحدّث الرابط في شريط العنوان ليمكن مشاركته
function jumpToSection(href, navEl, { instant = false } = {}) {
  const section = document.querySelector(href);
  if (!section) return;
  const anchor = section.querySelector('h2') ?? section;
  const headerBottom = navEl?.getBoundingClientRect().bottom ?? 0;
  const top = anchor.getBoundingClientRect().top + window.scrollY - headerBottom - 20;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: Math.max(0, top), behavior: instant || reduceMotion ? 'instant' : 'smooth' });
  history.replaceState(null, '', href);
}

// لوحة الفهرس: كل الأقسام دفعة واحدة، أسرع من تمرير الشريط الأفقي على الهاتف
function SectionsPanel({ active, onPick, onClose }) {
  const panelRef = useRef(null);

  useEffect(() => {
    panelRef.current?.querySelector('[aria-current], a')?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    const onPointer = (e) => {
      if (!panelRef.current?.contains(e.target) && !e.target.closest('[data-toc-toggle]')) onClose();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [onClose]);

  return (
    <div ref={panelRef} data-search-skip className="mx-auto max-w-5xl px-4 pb-3 sm:px-6">
      {/* ارتفاع محدود مع تمرير داخلي: اللوحة داخل الشريط الثابت، ودون هذا تتجاوز شاشة الهاتف
          فتتعذّر رؤية آخر الأقسام أو الإغلاق بالنقر خارجها */}
      <ol className="grid max-h-[70vh] grid-cols-1 gap-1 overflow-y-auto overscroll-contain rounded-2xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS_IN_ORDER.map((item) => {
          const isActive = active === item.href;
          return (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={isActive ? 'location' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  onPick(item.href);
                }}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  isActive
                    ? 'bg-emerald-600 font-bold text-white dark:bg-emerald-500 dark:text-slate-950'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold ${
                    isActive ? 'bg-white/20' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {item.num}
                </span>
                <span className="truncate">{item.title}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// القسم الظاهر حالياً، لإبرازه في شريط التنقل السريع
function useActiveSection(navRef) {
  const [active, setActive] = useState(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const header = navRef.current?.closest('.sticky');
      const line = (header?.getBoundingClientRect().bottom ?? 120) + 40;
      let current = null;
      let currentTop = -Infinity;
      for (const item of NAV_ITEMS) {
        const el = document.querySelector(item.href);
        const top = el?.getBoundingClientRect().top;
        if (top !== undefined && top <= line && top > currentTop) {
          current = item.href;
          currentTop = top;
        }
      }
      setActive(current);
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
  }, [navRef]);

  // إبقاء الرابط النشط ظاهراً داخل الشريط الأفقي (تمرير الشريط فقط، لا الصفحة)
  useEffect(() => {
    const nav = navRef.current;
    const chip = active && nav?.querySelector(`a[href="${active}"]`);
    if (!chip) return;
    const navBox = nav.getBoundingClientRect();
    const chipBox = chip.getBoundingClientRect();
    nav.scrollBy({ left: chipBox.left + chipBox.width / 2 - (navBox.left + navBox.width / 2) });
  }, [active, navRef]);

  return active;
}

export default function PlanetarySurvivalDocument() {
  const [isDark, setIsDark] = useState(() => readStoredTheme() !== 'light');
  const [copyState, setCopyState] = useState('idle'); // idle | copied | error
  const [toast, setToast] = useState({ message: '', tone: 'success', visible: false });
  const [searchOpen, setSearchOpen] = useState(false);
  const [slideshowOpen, setSlideshowOpen] = useState(false);
  const resetTimer = useRef(null);
  const toastTimer = useRef(null);
  const navRef = useRef(null);
  const contentRef = useRef(null);
  const activeSection = useActiveSection(navRef);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const closeSlideshow = useCallback(() => setSlideshowOpen(false), []);
  const [tocOpen, setTocOpen] = useState(false);
  const closeToc = useCallback(() => setTocOpen(false), []);
  const jump = useCallback((href) => {
    setTocOpen(false);
    jumpToSection(href, navRef.current);
  }, []);
  // رابط مُشارَك إلى قسم (مثل #chapter-07): ضبط الموضع بدقة عند فتح الصفحة،
  // وعند تغيّر الرابط داخل الصفحة نفسها (hashchange)
  useEffect(() => {
    let frame = 0;
    const alignToHash = (instant) => {
      const { hash } = window.location;
      if (!NAV_ITEMS.some((item) => item.href === hash)) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => jumpToSection(hash, navRef.current, { instant }));
    };
    const onHashChange = () => alignToHash(false);
    alignToHash(true);
    window.addEventListener('hashchange', onHashChange);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  // يفتح لوحة واحدة فقط في كل مرة (البحث أو الفهرس)
  const toggleSearch = () => {
    setTocOpen(false);
    setSearchOpen((o) => !o);
  };
  const toggleToc = () => {
    setSearchOpen(false);
    setTocOpen((o) => !o);
  };

  // «/» يفتح البحث السريع (ما لم يكن المستخدم يكتب في حقل)
  useEffect(() => {
    const onKey = (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;
      if (e.key === '/' && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    try {
      localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
    } catch {
      /* التخزين غير متاح — نتجاهل */
    }
  }, [isDark]);

  // الطباعة دائماً بالألوان الفاتحة مهما كان الوضع المختار على الشاشة
  useEffect(() => {
    const root = document.documentElement;
    const toLight = () => root.classList.remove('dark');
    const restore = () => root.classList.toggle('dark', isDark);
    const printQuery = window.matchMedia('print');
    const onChange = (e) => (e.matches ? toLight() : restore());
    window.addEventListener('beforeprint', toLight);
    window.addEventListener('afterprint', restore);
    // Safari الأقدم من 14 لا يدعم addEventListener على MediaQueryList
    if (printQuery.addEventListener) printQuery.addEventListener('change', onChange);
    else printQuery.addListener(onChange);
    return () => {
      window.removeEventListener('beforeprint', toLight);
      window.removeEventListener('afterprint', restore);
      if (printQuery.removeEventListener) printQuery.removeEventListener('change', onChange);
      else printQuery.removeListener(onChange);
    };
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
      await copyToClipboard(buildDocumentText());
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
      <div
        className="sticky top-0 z-40 border-b print:hidden border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80"
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-6">
          <a href="#top" className="flex min-w-0 items-center gap-2">
            <PlanetLogo className="h-8 w-8 shrink-0" />
            <span className="hidden truncate text-sm font-extrabold text-slate-900 dark:text-white sm:inline sm:text-base">
              {DOCUMENT_META.title}
            </span>
          </a>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={toggleSearch}
              aria-label="البحث في الوثيقة"
              aria-expanded={searchOpen}
              title="بحث (/)"
              className={`${TOOL_BTN} w-10 ${searchOpen ? '!border-emerald-500 !text-emerald-600 dark:!text-emerald-400' : ''}`}
            >
              <SearchIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setSlideshowOpen(true)}
              aria-label="العرض التقديمي"
              title="العرض التقديمي"
              className={`${TOOL_BTN} w-10`}
            >
              <SlidesIcon className="h-4 w-4" />
            </button>
            <PrintButton notify={notify} />
            <CopyButton onCopy={handleCopy} state={copyState} compact />
            <ShareMenu notify={notify} />
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark((d) => !d)} />
          </div>
        </div>
        <nav ref={navRef} aria-label="التنقل السريع بين الأقسام" className="mx-auto max-w-5xl overflow-x-auto px-4 pb-2 sm:px-6">
          <ol className="flex items-center gap-1.5 whitespace-nowrap text-xs">
            <li className="sticky right-0 z-10 bg-white/90 pl-1 dark:bg-slate-950/90">
              <button
                type="button"
                data-toc-toggle
                onClick={toggleToc}
                aria-expanded={tocOpen}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 font-bold transition ${
                  tocOpen
                    ? 'border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500 dark:text-slate-950'
                    : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <span aria-hidden="true">☰</span> الفهرس
              </button>
            </li>
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    jump(item.href);
                  }}
                  aria-current={activeSection === item.href ? 'location' : undefined}
                  className={`inline-block rounded-full px-3 py-1 transition ${NAV_TONES[item.tone || 'default']} ${
                    activeSection === item.href ? 'bg-emerald-600 !text-white shadow-sm dark:bg-emerald-500 dark:!text-slate-950' : ''
                  }`}
                >
                  <span className="font-mono">{item.num}</span> · {item.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        {/* اللوحات طبقة فوق المحتوى (absolute) لا جزءاً من تدفق الصفحة: لو كانت داخل التدفق
            لدفعت الصفحة كلها للأسفل عند فتحها ثم قفزت بها للأعلى عند إغلاقها */}
        {(tocOpen || searchOpen) && (
          <div className="absolute inset-x-0 top-full border-b border-slate-200/80 bg-white/95 pt-3 shadow-lg backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/95">
            {tocOpen && <SectionsPanel active={activeSection} onPick={jump} onClose={closeToc} />}
            {searchOpen && <QuickFinder rootRef={contentRef} onClose={closeSearch} />}
          </div>
        )}
      </div>

      {/* محتوى الوثيقة (نطاق البحث السريع) */}
      <div ref={contentRef}>
        {/* الترويسة الرئيسية */}
        <header
          id="top"
          className="print-cover relative overflow-hidden bg-gradient-to-br from-sky-100 via-white to-emerald-100 dark:from-slate-950 dark:via-sky-950 dark:to-emerald-950"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 print:hidden rounded-full bg-sky-400/30 blur-3xl dark:bg-sky-500/20"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-40 -right-24 h-96 w-96 print:hidden rounded-full bg-emerald-400/30 blur-3xl dark:bg-emerald-500/20"
          />
          <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28">
            <PlanetLogo className="h-28 w-28 drop-shadow-2xl print:drop-shadow-none sm:h-36 sm:w-36" />
            <h1 className="mt-8 bg-gradient-to-l from-sky-700 via-emerald-600 to-sky-700 bg-clip-text print:bg-none print:text-emerald-800 text-4xl font-black leading-tight text-transparent dark:from-sky-300 dark:via-emerald-300 dark:to-sky-300 sm:text-6xl lg:text-7xl">
              {DOCUMENT_META.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-bold text-slate-700 dark:text-slate-200 sm:text-2xl">
              {DOCUMENT_META.motto}
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3 print:hidden">
              <a
                href="#chapter-01"
                onClick={(e) => {
                  e.preventDefault();
                  jump('#chapter-01');
                }}
                className="rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              >
                ابدأ القراءة ↓
              </a>
              <a
                href="#summary"
                onClick={(e) => {
                  e.preventDefault();
                  jump('#summary');
                }}
                className="rounded-full border-2 border-emerald-600 px-6 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-300 dark:hover:bg-emerald-950"
              >
                ◆ الخلاصة في دقيقة
              </a>
              <button
                type="button"
                onClick={() => setSlideshowOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-indigo-500"
              >
                <SlidesIcon className="h-4 w-4" />
                العرض التقديمي
              </button>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2 print:hidden">
              <CopyButton onCopy={handleCopy} state={copyState} />
              <ExportButtons notify={notify} />
            </div>
            <ShareButtons notify={notify} className="mt-8" />
            <PrintCoverCredits />
          </div>
        </header>

        {/* الفصول 01–10 */}
        <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-4xl">
          {CHAPTERS.map((chapter) => (
            <Chapter key={chapter.id} chapter={chapter} />
          ))}
        </main>

        <ExecutiveSummary />

        {/* الفصل 11 — السطر الأخير */}
        <Finale notify={notify} />

        <Credits />

        <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-black dark:text-slate-500">
          {DOCUMENT_META.title} · <Inline text={CREDITS.footer} />
        </footer>
      </div>

      <ScrollToTop />
      <Toast toast={toast} />
      <PrintWatermark />
      {slideshowOpen && <Slideshow onClose={closeSlideshow} />}
    </div>
  );
}
