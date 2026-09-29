import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  محتوى الوثيقة                                                      */
/* ------------------------------------------------------------------ */

const DOCUMENT_META = {
  title: 'وثيقة البقاء الكوكبي',
  subtitle: 'بيانٌ لحراسة الأرض في القرن الحاسم',
  motto: 'كوكبٌ واحد · بشريةٌ واحدة · فرصةٌ واحدة',
  edition: 'الإصدار الأول',
};

const CHAPTERS = [
  {
    id: '01',
    title: 'الإنذار',
    subtitle: 'حين تتكلم الأرض بلغة الأرقام',
    paragraphs: [
      'لم تعد الأرض تهمس. إنها تصرخ بلغةٍ لا تحتمل التأويل: حرارةٌ تتجاوز كل سجلٍّ عرفه الإنسان، وجليدٌ يذوب أسرع من كل نموذجٍ توقّعه العلماء، ومحيطاتٌ تمتصّ من الحرارة ما يكفي لتغيير مصير القارات.',
      'هذه الوثيقة ليست نبوءة خراب، بل خريطة نجاة. كُتبت لأن الصمت صار تواطؤاً، ولأن الوقت الذي كنّا نظنه ممتداً قد انكمش إلى عقدٍ واحد حاسم.',
    ],
    hammer: 'لسنا الجيل الأول الذي يشعر بتغيّر المناخ، لكننا الجيل الأخير الذي يستطيع إيقافه.',
    algorithm: {
      condition: 'إذا تجاهلنا الإنذار',
      result: 'صار الإنذار هو الحكم',
    },
  },
  {
    id: '02',
    title: 'الحدود الكوكبية',
    subtitle: 'تسعة جدران تحمي سقف الحضارة',
    paragraphs: [
      'حدّد العلم تسعة حدودٍ كوكبية تمثل «مساحة التشغيل الآمنة» للبشرية: المناخ، وسلامة المحيط الحيوي، وتغيّر استخدام الأراضي، والمياه العذبة، وتدفقات النيتروجين والفوسفور، وتحمّض المحيطات، واستنفاد الأوزون، والهباء الجوي، والكيانات المستحدثة.',
      'تجاوزنا معظمها بالفعل. وكل حدٍّ مخترق لا يعمل منفرداً؛ إنها منظومة مترابطة، إذا انهار فيها جدارٌ اهتزّت البقية.',
    ],
    hammer: 'الكوكب لا يتفاوض. لديه قوانين فيزيائية، لا مواقف سياسية.',
    algorithm: {
      condition: 'إذا تجاوزنا الحدود',
      result: 'تجاوزتنا العواقب',
    },
    showDashboard: true,
  },
  {
    id: '03',
    title: 'الحُمّى',
    subtitle: 'المناخ حين يفقد توازنه',
    paragraphs: [
      'ارتفاع درجة حرارة الأرض بمقدار درجة ونصف ليس رقماً مجرداً؛ إنه موجات حرٍّ تقتل عشرات الآلاف، وجفافٌ يُفرغ السلال، وأعاصير تُعيد رسم السواحل.',
      'كل عُشر درجة نتجنّبه يعني ملايين البشر الذين لن يُهجَّروا، وأنواعاً لن تنقرض، ومدناً لن تغرق.',
    ],
    hammer: 'كل جزءٍ من الدرجة مهم. كل سنةٍ مهمة. كل قرارٍ مهم.',
    algorithm: {
      condition: 'إذا خفّضنا الانبعاثات إلى النصف بحلول 2030',
      result: 'أبقينا الباب مفتوحاً',
    },
  },
  {
    id: '04',
    title: 'الماء',
    subtitle: 'الذهب الأزرق الذي نهدره',
    paragraphs: [
      'يعيش مليارا إنسان بلا مياه شربٍ آمنة، بينما تُستنزف الأحواض الجوفية بوتيرةٍ تفوق قدرتها على التجدد، وتتراجع الأنهار الجليدية التي تغذّي أنهار آسيا الكبرى.',
      'حروب القرن القادم قد لا تكون على النفط، بل على الماء. والحكمة أن نجعل كل قطرةٍ محسوبة قبل أن تصبح كل قطرةٍ مُتنازعاً عليها.',
    ],
    hammer: 'من لا يحمي منابع الماء اليوم، سيقاتل على آخر قطرةٍ غداً.',
    algorithm: {
      condition: 'إذا أدرنا الماء بعدالة',
      result: 'أطفأنا حروب العطش قبل اشتعالها',
    },
  },
  {
    id: '05',
    title: 'نسيج الحياة',
    subtitle: 'التنوع الحيوي كشبكة أمان',
    paragraphs: [
      'تنقرض الأنواع اليوم بمعدلٍ يفوق المعدل الطبيعي بعشرات إلى مئات المرات. ومع كل نوعٍ يختفي، تنقطع خيوطٌ في النسيج الذي يمنحنا الغذاء والدواء والهواء النقي.',
      'النحلة التي تلقّح محاصيلنا، والشعاب المرجانية التي تحمي سواحلنا، والغابات التي تتنفس عنّا — ليست رفاهيةً بيئية، بل بنيةٌ تحتية للحياة.',
    ],
    hammer: 'لسنا أسياد الطبيعة. نحن خيطٌ واحد في نسيجها، وإن قطعناه سقطنا معه.',
    algorithm: {
      condition: 'إذا حمينا 30% من اليابسة والبحار',
      result: 'منحنا الحياة فرصة للتعافي',
    },
  },
  {
    id: '06',
    title: 'التربة والغذاء',
    subtitle: 'الأرض التي تُطعمنا',
    paragraphs: [
      'ثلث الغذاء المنتج عالمياً يُهدر، بينما يبيت مئات الملايين جياعاً. وتفقد التربة خصوبتها بسبب الزراعة المكثفة، وهي موردٌ يحتاج قروناً ليتكوّن بضعة سنتيمترات منه.',
      'الزراعة التجديدية، وتقليل الهدر، وتنويع مصادر البروتين، ليست خيارات تقنية فحسب، بل التزامٌ أخلاقي تجاه الجائع وتجاه الأرض معاً.',
    ],
    hammer: 'التربة ليست تراباً. إنها الجلد الحيّ للكوكب، ونحن نسلخه.',
    algorithm: {
      condition: 'إذا أعدنا الحياة إلى التربة',
      result: 'أعادت التربة الحياة إلينا',
    },
  },
  {
    id: '07',
    title: 'الطاقة',
    subtitle: 'من النار القديمة إلى الشمس',
    paragraphs: [
      'قامت الحضارة الصناعية على حرق ما خزّنته الأرض عبر ملايين السنين. واليوم صارت الطاقة الشمسية وطاقة الرياح أرخص مصادر الكهرباء في معظم أنحاء العالم.',
      'العائق لم يعد تقنياً ولا اقتصادياً، بل سياسياً ونفسياً. التحول ممكن، والسؤال الوحيد: هل سنقوده أم سيُفرض علينا؟',
    ],
    hammer: 'العصر الحجري لم ينتهِ لنفاد الحجارة، وعصر الوقود الأحفوري لن ينتهي لنفاد النفط.',
    algorithm: {
      condition: 'إذا تحوّلنا إلى الطاقة النظيفة',
      result: 'تحرّرنا من الكربون ومن الارتهان معاً',
    },
  },
  {
    id: '08',
    title: 'المدن',
    subtitle: 'حيث يُحسم مصير المناخ',
    paragraphs: [
      'يعيش أكثر من نصف البشرية في المدن، وتُنتج المدن معظم الانبعاثات العالمية. هي ساحة المعركة الحقيقية، ومختبر الحلول الأسرع.',
      'مدنٌ تمشي فيها الأقدام، وتتنفس فيها الأشجار، ويتحرك فيها الناس بالنقل العام، وتُصمَّم مبانيها لتنتج طاقتها — هذه ليست يوتوبيا، بل مخطط هندسي قابل للتنفيذ.',
    ],
    hammer: 'المدينة التي لا تتكيّف مع المناخ، سيُعيد المناخ تشكيلها بالقوة.',
    algorithm: {
      condition: 'إذا صمّمنا المدن للإنسان لا للسيارة',
      result: 'استعدنا الهواء والوقت والحياة',
    },
  },
  {
    id: '09',
    title: 'العدالة',
    subtitle: 'من لوّث أكثر، يدفع أكثر',
    paragraphs: [
      'أفقر نصف سكان العالم مسؤولٌ عن جزءٍ ضئيل من الانبعاثات، لكنه يتحمّل النصيب الأكبر من الكوارث. هذه ليست أزمة مناخ فحسب، بل أزمة عدالة.',
      'اقتصادٌ يقيس النجاح بالنمو وحده، ويتجاهل استنزاف رأس المال الطبيعي، هو اقتصادٌ يسرق من المستقبل ليدفع للحاضر.',
    ],
    hammer: 'لا بقاء لكوكبٍ ينجو فيه الأغنياء وحدهم.',
    algorithm: {
      condition: 'إذا تقاسمنا العبء بعدل',
      result: 'تقاسمنا النجاة',
    },
  },
  {
    id: '10',
    title: 'المعرفة والتقنية',
    subtitle: 'أدوات الإنقاذ في يد الحكمة',
    paragraphs: [
      'الأقمار الصناعية ترصد كل شجرةٍ تُقطع، والذكاء الاصطناعي يحسّن شبكات الطاقة ويتنبأ بالكوارث، والعلوم المفتوحة تتيح المعرفة لكل من يحتاجها.',
      'لكن التقنية مرآةٌ لنوايانا: قد تكون أداة إنقاذٍ أو أداة استنزافٍ أسرع. المعرفة بلا حكمة تُسرّع الانهيار، والحكمة بلا معرفة تعجز عن منعه.',
    ],
    hammer: 'لن تنقذنا التقنية وحدها، لكننا لن ننجو بدونها.',
    algorithm: {
      condition: 'إذا قادت الحكمةُ التقنية',
      result: 'صارت الآلة حارساً لا جلّاداً',
    },
  },
  {
    id: '11',
    title: 'العهد',
    subtitle: 'الإنسان حارساً للأرض',
    paragraphs: [
      'البقاء ليس مهمة الحكومات وحدها، ولا العلماء وحدهم، ولا الناشطين وحدهم. إنه عهدٌ يوقّعه كل إنسانٍ بخياراته اليومية: ما يأكله، وكيف يتنقّل، ومن يختار ليمثّله، وما يعلّمه لأطفاله.',
      'نحن لا نرث الأرض من آبائنا، بل نستعيرها من أبنائنا. وهذا العهد هو إيصال الأمانة.',
    ],
    hammer: 'أنت لست قطرةً في المحيط. أنت المحيط كلّه في قطرة.',
    algorithm: {
      condition: 'إذا تحرّك كل فرد',
      result: 'تحرّك الكوكب',
    },
  },
];

/* قيم تقريبية مستندة إلى تقارير «الحدود الكوكبية» ومؤشرات المناخ العالمية الحديثة */
const DASHBOARD = [
  {
    indicator: 'تركيز ثاني أكسيد الكربون',
    current: '≈ 425 جزء في المليون',
    safe: '350 جزء في المليون',
    status: 'critical',
    trend: 'up',
  },
  {
    indicator: 'ارتفاع حرارة سطح الأرض',
    current: '≈ +1.5 °م',
    safe: 'أقل من +1.5 °م',
    status: 'critical',
    trend: 'up',
  },
  {
    indicator: 'سلامة المحيط الحيوي (معدل الانقراض)',
    current: 'أكثر من 100 انقراض/مليون نوع/سنة',
    safe: 'أقل من 10',
    status: 'critical',
    trend: 'up',
  },
  {
    indicator: 'تدفق النيتروجين',
    current: '≈ 190 مليون طن/سنة',
    safe: '62 مليون طن/سنة',
    status: 'critical',
    trend: 'up',
  },
  {
    indicator: 'تدفق الفوسفور',
    current: '≈ 22 مليون طن/سنة',
    safe: '11 مليون طن/سنة',
    status: 'critical',
    trend: 'up',
  },
  {
    indicator: 'الغطاء الحرجي العالمي',
    current: '≈ 60% من الأصل',
    safe: '75% من الأصل',
    status: 'danger',
    trend: 'down',
  },
  {
    indicator: 'المياه العذبة (الخضراء والزرقاء)',
    current: 'خارج النطاق الآمن',
    safe: 'ضمن التقلب الطبيعي',
    status: 'danger',
    trend: 'up',
  },
  {
    indicator: 'تحمّض المحيطات',
    current: 'عند الحدّ أو تجاوزه',
    safe: '≥ 80% من تشبّع الأراغونيت',
    status: 'danger',
    trend: 'up',
  },
  {
    indicator: 'الكيانات المستحدثة (بلاستيك وملوثات)',
    current: 'غير مُقاسة كمياً — متجاوزة',
    safe: 'صفر إطلاق غير مُختبر',
    status: 'critical',
    trend: 'up',
  },
  {
    indicator: 'الهباء الجوي',
    current: 'قريب من الحد إقليمياً',
    safe: 'فرق نصفي الكرة أقل من 0.1',
    status: 'warning',
    trend: 'stable',
  },
  {
    indicator: 'طبقة الأوزون',
    current: 'في طور التعافي',
    safe: '≥ 276 وحدة دوبسون',
    status: 'safe',
    trend: 'down',
  },
];

const STATUS_META = {
  critical: {
    label: 'حرج',
    classes:
      'bg-red-100 text-red-800 ring-red-300 dark:bg-red-500/15 dark:text-red-300 dark:ring-red-500/40',
    dot: 'bg-red-500',
  },
  danger: {
    label: 'خطر',
    classes:
      'bg-orange-100 text-orange-800 ring-orange-300 dark:bg-orange-500/15 dark:text-orange-300 dark:ring-orange-500/40',
    dot: 'bg-orange-500',
  },
  warning: {
    label: 'تحذير',
    classes:
      'bg-amber-100 text-amber-800 ring-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/40',
    dot: 'bg-amber-500',
  },
  safe: {
    label: 'آمن',
    classes:
      'bg-emerald-100 text-emerald-800 ring-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/40',
    dot: 'bg-emerald-500',
  },
};

const TREND_META = {
  up: { symbol: '▲', label: 'في تصاعد' },
  down: { symbol: '▼', label: 'في تراجع' },
  stable: { symbol: '◆', label: 'مستقر' },
};

const EPILOGUE = {
  title: 'الخاتمة',
  subtitle: 'نشيد الحرّاس',
  stanzas: [
    ['في البدء كانت الأرض زرقاءَ،', 'تدور بصبرِ أربعة مليارات عام،', 'تنتظر من يفهم أنها ليست ملكاً لأحد…', 'بل أمانةٌ في يد الجميع.'],
    ['وجئنا نحن —', 'أشعلنا النار، وشقَقنا الجبال،', 'وأضأنا الليل حتى نسينا النجوم،', 'وظننّا أن الكوكب لا ينتهي.'],
    ['واليوم،', 'يقف التاريخ على حافة سطرٍ واحد:', 'إما أن نكون الجيل الذي أطفأ النور،', 'أو الجيل الذي أعاد إشعاله.'],
    ['فلنكن الحرّاس، لا الورثة الجاحدين.', 'لنكن الجذور، لا الفؤوس.', 'لنكن الذين قال عنهم أحفادهم:', '«لقد رأوا العاصفة… فبنوا السفينة».'],
  ],
  finalLine: 'لا كوكبَ بديلاً… ولا جيلَ بعدنا يملك الفرصة ذاتها.',
  signature: 'الأرض تنتظر توقيعك.',
};

/* ------------------------------------------------------------------ */
/*  تحويل الوثيقة إلى نص قابل للنسخ                                    */
/* ------------------------------------------------------------------ */

function buildPlainText() {
  const divider = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  const lines = [
    `🌍 ${DOCUMENT_META.title}`,
    DOCUMENT_META.subtitle,
    DOCUMENT_META.motto,
    divider,
    '',
  ];

  CHAPTERS.forEach((chapter) => {
    lines.push(`الفصل ${chapter.id}: ${chapter.title} — ${chapter.subtitle}`);
    lines.push('');
    chapter.paragraphs.forEach((p) => lines.push(p, ''));
    lines.push(`⚡ المطرقة: «${chapter.hammer}»`);
    lines.push(
      `⟨ خوارزمية البقاء ⟩ ${chapter.algorithm.condition} ← ${chapter.algorithm.result}`
    );
    lines.push('');

    if (chapter.showDashboard) {
      lines.push('📊 لوحة القيادة الكوكبية');
      lines.push('المؤشر | القيمة الحالية | الحد الآمن | الحالة | الاتجاه');
      DASHBOARD.forEach((row) => {
        lines.push(
          `${row.indicator} | ${row.current} | ${row.safe} | ${STATUS_META[row.status].label} | ${TREND_META[row.trend].label}`
        );
      });
      lines.push('');
    }
    lines.push(divider, '');
  });

  lines.push(`${EPILOGUE.title}: ${EPILOGUE.subtitle}`, '');
  EPILOGUE.stanzas.forEach((stanza) => {
    lines.push(...stanza, '');
  });
  lines.push(divider);
  lines.push(EPILOGUE.finalLine);
  lines.push(EPILOGUE.signature);

  return lines.join('\n');
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
/*  مكونات فرعية                                                       */
/* ------------------------------------------------------------------ */

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

function CopyButton({ onCopy, state }) {
  const label =
    state === 'copied' ? 'تم النسخ' : state === 'error' ? 'تعذّر النسخ' : 'نسخ الوثيقة';
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
      <span>{label}</span>
    </button>
  );
}

function Toast({ state }) {
  const visible = state === 'copied' || state === 'error';
  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed inset-x-4 bottom-6 z-50 mx-auto flex max-w-sm items-center justify-center gap-3 rounded-2xl px-5 py-4 text-sm font-semibold shadow-2xl ring-1 transition-all duration-300 sm:inset-x-auto sm:left-1/2 sm:w-full sm:-translate-x-1/2 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      } ${
        state === 'error'
          ? 'bg-red-600 text-white ring-red-400'
          : 'bg-emerald-600 text-white ring-emerald-400'
      }`}
    >
      {state === 'error' ? (
        <span>تعذّر النسخ — يرجى المحاولة مرة أخرى</span>
      ) : (
        <span>✓ نُسخت الوثيقة كاملةً إلى الحافظة</span>
      )}
    </div>
  );
}

function Hammer({ text }) {
  return (
    <blockquote className="relative my-8 overflow-hidden rounded-2xl border-2 border-amber-400/70 bg-gradient-to-l from-amber-50 via-orange-50 to-rose-50 px-6 py-7 shadow-lg shadow-amber-500/10 dark:border-amber-500/50 dark:from-amber-500/10 dark:via-orange-500/5 dark:to-rose-500/10 sm:px-10">
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
        {text}
      </p>
    </blockquote>
  );
}

function SurvivalAlgorithm({ condition, result }) {
  return (
    <div className="my-6 rounded-xl border border-emerald-500/40 bg-slate-950 p-4 font-mono text-sm shadow-inner shadow-emerald-500/10 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-2 border-b border-emerald-500/20 pb-2">
        <span className="font-arabic text-xs font-bold tracking-wider text-emerald-400">
          ⟨ خوارزمية البقاء ⟩
        </span>
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
        </span>
      </div>
      <p className="flex flex-wrap items-center gap-x-3 gap-y-2 font-arabic text-base leading-loose sm:text-lg">
        <span className="text-sky-300">{condition}</span>
        <span className="font-mono text-amber-400" aria-hidden="true">
          ←
        </span>
        <span className="font-bold text-emerald-300">{result}</span>
        <span className="inline-block h-5 w-2 animate-pulse bg-emerald-400/80" aria-hidden="true" />
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${meta.classes}`}
    >
      <span className={`h-2 w-2 rounded-full ${meta.dot}`} aria-hidden="true" />
      {meta.label}
    </span>
  );
}

function Trend({ trend }) {
  const meta = TREND_META[trend];
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap text-xs text-slate-600 dark:text-slate-400">
      <span aria-hidden="true">{meta.symbol}</span>
      {meta.label}
    </span>
  );
}

function PlanetaryDashboard() {
  const counts = useMemo(
    () =>
      DASHBOARD.reduce((acc, row) => {
        acc[row.status] = (acc[row.status] || 0) + 1;
        return acc;
      }, {}),
    []
  );

  return (
    <section
      aria-labelledby="dashboard-title"
      className="my-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900"
    >
      <header className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50 px-5 py-5 dark:border-slate-800 dark:bg-slate-900/60 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h3 id="dashboard-title" className="text-lg font-extrabold text-slate-900 dark:text-white sm:text-xl">
            📊 لوحة القيادة الكوكبية
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            قراءة حيّة لمؤشرات الحياة الحيوية على كوكب الأرض
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.keys(STATUS_META).map((key) =>
            counts[key] ? (
              <span
                key={key}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold ring-1 ${STATUS_META[key].classes}`}
              >
                {STATUS_META[key].label}
                <span className="tabular-nums">{counts[key]}</span>
              </span>
            ) : null
          )}
        </div>
      </header>

      {/* جدول للشاشات المتوسطة والكبيرة */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-right text-sm">
          <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600 dark:bg-slate-800/60 dark:text-slate-400">
            <tr>
              <th scope="col" className="px-6 py-3 font-bold">المؤشر</th>
              <th scope="col" className="px-6 py-3 font-bold">القيمة الحالية</th>
              <th scope="col" className="px-6 py-3 font-bold">الحد الآمن</th>
              <th scope="col" className="px-6 py-3 font-bold">الحالة</th>
              <th scope="col" className="px-6 py-3 font-bold">الاتجاه</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {DASHBOARD.map((row) => (
              <tr
                key={row.indicator}
                className="transition-colors odd:bg-white even:bg-slate-50/60 hover:bg-sky-50 dark:odd:bg-slate-900 dark:even:bg-slate-900/40 dark:hover:bg-slate-800/70"
              >
                <th scope="row" className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">
                  {row.indicator}
                </th>
                <td className="px-6 py-4 tabular-nums text-slate-700 dark:text-slate-300">{row.current}</td>
                <td className="px-6 py-4 tabular-nums text-slate-500 dark:text-slate-400">{row.safe}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-6 py-4">
                  <Trend trend={row.trend} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* بطاقات للشاشات الصغيرة */}
      <ul className="divide-y divide-slate-200 dark:divide-slate-800 md:hidden">
        {DASHBOARD.map((row) => (
          <li key={row.indicator} className="px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <p className="font-semibold text-slate-900 dark:text-slate-100">{row.indicator}</p>
              <StatusBadge status={row.status} />
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg bg-slate-100 p-2.5 dark:bg-slate-800/60">
                <dt className="text-slate-500 dark:text-slate-400">القيمة الحالية</dt>
                <dd className="mt-1 font-semibold text-slate-800 dark:text-slate-200">{row.current}</dd>
              </div>
              <div className="rounded-lg bg-slate-100 p-2.5 dark:bg-slate-800/60">
                <dt className="text-slate-500 dark:text-slate-400">الحد الآمن</dt>
                <dd className="mt-1 font-semibold text-slate-800 dark:text-slate-200">{row.safe}</dd>
              </div>
            </dl>
            <div className="mt-2">
              <Trend trend={row.trend} />
            </div>
          </li>
        ))}
      </ul>

      <p className="border-t border-slate-200 px-5 py-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-500 sm:px-6">
        * القيم تقريبية ومستندة إلى إطار «الحدود الكوكبية» ومؤشرات المناخ العالمية الحديثة، وتُحدَّث دورياً.
      </p>
    </section>
  );
}

function Chapter({ chapter }) {
  return (
    <article
      id={`chapter-${chapter.id}`}
      aria-labelledby={`chapter-${chapter.id}-title`}
      className="scroll-mt-24 border-b border-slate-200 py-14 last:border-b-0 dark:border-slate-800 sm:py-20"
    >
      <header className="mb-8 flex items-start gap-4 sm:gap-6">
        <span
          aria-hidden="true"
          className="bg-gradient-to-b from-sky-500 to-emerald-500 bg-clip-text font-mono text-5xl font-black leading-none text-transparent sm:text-7xl"
        >
          {chapter.id}
        </span>
        <div className="pt-1">
          <p className="text-xs font-bold tracking-[0.25em] text-sky-600 dark:text-sky-400">
            الفصل {chapter.id}
          </p>
          <h2
            id={`chapter-${chapter.id}-title`}
            className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white sm:text-4xl"
          >
            {chapter.title}
          </h2>
          <p className="mt-2 text-base text-slate-500 dark:text-slate-400 sm:text-lg">{chapter.subtitle}</p>
        </div>
      </header>

      <div className="space-y-5 font-naskh text-lg leading-[2.1] text-slate-700 dark:text-slate-300 sm:text-xl">
        {chapter.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      <Hammer text={chapter.hammer} />
      <SurvivalAlgorithm {...chapter.algorithm} />

      {chapter.showDashboard && <PlanetaryDashboard />}
    </article>
  );
}

function Epilogue() {
  return (
    <section
      id="epilogue"
      aria-labelledby="epilogue-title"
      className="relative scroll-mt-24 overflow-hidden bg-gradient-to-b from-slate-100 via-sky-50 to-white py-20 dark:from-slate-950 dark:via-indigo-950 dark:to-black sm:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-100"
        style={{
          backgroundImage:
            'radial-gradient(1px 1px at 20% 30%, #fff 50%, transparent), radial-gradient(1px 1px at 70% 20%, #fff 50%, transparent), radial-gradient(1.5px 1.5px at 40% 80%, #fde68a 50%, transparent), radial-gradient(1px 1px at 85% 65%, #fff 50%, transparent), radial-gradient(1px 1px at 10% 70%, #bae6fd 50%, transparent), radial-gradient(1px 1px at 55% 45%, #fff 50%, transparent)',
        }}
      />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <p className="text-xs font-bold tracking-[0.35em] text-amber-600 dark:text-amber-400">
          {EPILOGUE.title}
        </p>
        <h2
          id="epilogue-title"
          className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-5xl"
        >
          {EPILOGUE.subtitle}
        </h2>

        <div className="mt-14 space-y-12">
          {EPILOGUE.stanzas.map((stanza, i) => (
            <div key={i} className="space-y-2">
              {stanza.map((line) => (
                <p
                  key={line}
                  className="font-naskh text-xl leading-loose text-slate-700 dark:text-slate-200 sm:text-2xl"
                >
                  {line}
                </p>
              ))}
              {i < EPILOGUE.stanzas.length - 1 && (
                <p aria-hidden="true" className="pt-6 text-amber-500/70">
                  ✦
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mx-auto mt-20 max-w-2xl">
          <div className="mx-auto mb-10 h-px w-40 bg-gradient-to-l from-transparent via-amber-500 to-transparent" />
          <p className="bg-gradient-to-l from-amber-500 via-rose-500 to-sky-500 bg-clip-text text-2xl font-black leading-relaxed text-transparent dark:from-amber-300 dark:via-rose-300 dark:to-sky-300 sm:text-4xl">
            {EPILOGUE.finalLine}
          </p>
          <p className="mt-8 text-lg font-semibold tracking-wide text-slate-600 dark:text-slate-400">
            {EPILOGUE.signature}
          </p>
          <PlanetLogo className="mx-auto mt-10 h-16 w-16 opacity-80" />
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
  const resetTimer = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    try {
      localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
    } catch {
      /* التخزين غير متاح — نتجاهل */
    }
  }, [isDark]);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const handleCopy = useCallback(async () => {
    clearTimeout(resetTimer.current);
    try {
      await copyToClipboard(buildPlainText());
      setCopyState('copied');
    } catch {
      setCopyState('error');
    }
    resetTimer.current = setTimeout(() => setCopyState('idle'), 2500);
  }, []);

  return (
    <div
      dir="rtl"
      lang="ar"
      className="min-h-screen bg-white font-arabic text-slate-800 antialiased transition-colors duration-300 dark:bg-slate-950 dark:text-slate-200"
    >
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
            <CopyButton onCopy={handleCopy} state={copyState} />
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark((d) => !d)} />
          </div>
        </div>
        <nav aria-label="فهرس الفصول" className="mx-auto max-w-5xl overflow-x-auto px-4 pb-2 sm:px-6">
          <ol className="flex gap-1.5 whitespace-nowrap text-xs">
            {CHAPTERS.map((c) => (
              <li key={c.id}>
                <a
                  href={`#chapter-${c.id}`}
                  className="inline-block rounded-full px-3 py-1 text-slate-600 transition hover:bg-sky-100 hover:text-sky-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-sky-300"
                >
                  <span className="font-mono">{c.id}</span> · {c.title}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#epilogue"
                className="inline-block rounded-full px-3 py-1 text-amber-700 transition hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-slate-800"
              >
                الخاتمة
              </a>
            </li>
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
          <p className="mt-8 rounded-full border border-sky-500/30 bg-white/60 px-4 py-1 text-xs font-bold tracking-[0.3em] text-sky-700 dark:bg-slate-900/60 dark:text-sky-300">
            {DOCUMENT_META.edition}
          </p>
          <h1 className="mt-6 bg-gradient-to-l from-sky-700 via-emerald-600 to-sky-700 bg-clip-text text-4xl font-black leading-tight text-transparent dark:from-sky-300 dark:via-emerald-300 dark:to-sky-300 sm:text-6xl lg:text-7xl">
            {DOCUMENT_META.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-300 sm:text-2xl">
            {DOCUMENT_META.subtitle}
          </p>
          <p className="mt-8 text-sm font-semibold tracking-widest text-amber-700 dark:text-amber-400 sm:text-base">
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
        </div>
      </header>

      {/* الفصول */}
      <main className="mx-auto max-w-3xl px-4 sm:px-6">
        {CHAPTERS.map((chapter) => (
          <Chapter key={chapter.id} chapter={chapter} />
        ))}
      </main>

      <Epilogue />

      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-black dark:text-slate-500">
        {DOCUMENT_META.title} · {DOCUMENT_META.motto}
      </footer>

      <Toast state={copyState} />
    </div>
  );
}
