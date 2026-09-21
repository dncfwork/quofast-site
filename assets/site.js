/*
 * QuoFast site: language switching and store links.
 *
 * The English text is also written into index.html, so the page reads correctly with scripts off
 * and search engines index it as is. Every key used in the page must exist in `en`; `ms` and `zh`
 * fall back to English for anything they lack rather than showing a raw key.
 *
 * No analytics, cookies or third-party requests: the only thing remembered is the chosen
 * language, in this browser's localStorage.
 */
(function () {
  'use strict';

  var STRINGS = {
    en: {
      'meta.title': 'QuoFast — Quotation & Invoice App for Malaysian Contractors',
      'meta.description': 'Create professional quotations and invoices on your phone in under a minute and send them on WhatsApp. SST-ready, in English, Bahasa Melayu and Mandarin.',
      'lang.label': 'Language',
      'nav.how': 'How it works',
      'nav.features': 'Features',
      'nav.pricing': 'Pricing',
      'nav.faq': 'FAQ',
      'nav.download': 'Download',
      'hero.eyebrow': 'Built for Malaysian contractors',
      'hero.title': 'Send a professional quotation before you leave the site.',
      'hero.lede': 'Create quotations and invoices on your phone in under a minute, then send the PDF straight to WhatsApp. SST-ready, in English, Bahasa Melayu and Mandarin.',
      'hero.free': 'Free to download · Your first 3 documents are free to send',
      'hero.chip.title': 'Quotation sent',
      'hero.chip.sub': 'RM 8,460.00 · just now',
      'trust.made': 'Made in Malaysia',
      'trust.sst': 'SST-ready',
      'trust.private': 'No ads, no tracking',
      'badge.appstore': 'Download on the App Store',
      'badge.googleplay': 'Get it on Google Play',
      'alt.quote': 'QuoFast quotation preview for a RM 8,460 renovation job',
      'alt.editor': 'Editing the line items of a quotation in QuoFast',
      'alt.convert': 'An invoice created from a quotation',
      'alt.track': 'Invoice list showing this month’s total and a paid invoice',
      'alt.tax': 'SST rate and currency settings',
      'alt.report': 'Report with cash flow and quotation conversion',
      'how.kicker': 'How it works',
      'how.title': 'From quote to paid in three steps',
      'how.s1.title': 'Add the job',
      'how.s1.text': 'Pick a client from your phone contacts and list the work — hacking, plastering, painting — with quantity and unit price.',
      'how.s2.title': 'Make it look like you',
      'how.s2.text': 'Your logo, company details and bank account appear on every PDF. Pick the template and colour you like.',
      'how.s3.title': 'Send it and get paid',
      'how.s3.text': 'Share on WhatsApp or email. When the client agrees, turn the quotation into an invoice in one tap and see who has paid.',
      'feat.kicker': 'Features',
      'feat.title': 'Everything your paperwork needs',
      'feat.f1.title': 'Quotation to invoice in one tap',
      'feat.f1.text': 'No retyping — the invoice carries over the items from your quotation.',
      'feat.f2.title': 'See who still owes you',
      'feat.f2.text': 'Paid, unpaid and overdue at a glance, with your total for the month.',
      'feat.f3.title': 'SST and six currencies',
      'feat.f3.text': 'Set your SST rate and registration number once. Bill in MYR, SGD, USD, IDR, GBP or EUR.',
      'feat.f4.title': 'Reports that answer real questions',
      'feat.f4.text': 'Cash collected, quotations won and SST collected — this month, the last 3 months or this year.',
      'price.kicker': 'Pricing',
      'price.title': 'Simple, honest pricing',
      'price.sub': 'Start free. Upgrade when you need to send more.',
      'plan.free.name': 'Free',
      'plan.free.caption': 'Free to start',
      'plan.free.f1': 'Unlimited quotations & invoices',
      'plan.free.f2': 'Send, share or print your first 3 documents',
      'plan.free.f3': 'All templates, SST and 3 languages',
      'plan.monthly.name': 'Pro Monthly',
      'plan.per.month': '/ month',
      'plan.monthly.caption': 'Billed monthly',
      'plan.pro.f1': 'Unlimited sending, sharing & printing',
      'plan.pro.f2': 'Everything in Free',
      'plan.pro.f3': 'Cancel anytime',
      'plan.yearly.name': 'Pro Yearly',
      'plan.per.year': '/ year',
      'plan.yearly.badge': 'Best value',
      'plan.yearly.save': '≈ RM 16.66 a month — save 44%',
      'plan.cta': 'Try now',
      'price.note': 'Subscriptions are currently sold through Google Play. Prices in Malaysian ringgit.',
      'faq.kicker': 'FAQ',
      'faq.title': 'Questions contractors ask',
      'faq.q1': 'Is QuoFast free?',
      'faq.a1': 'Yes, to start. Create as many quotations and invoices as you like — your first 3 documents are free to send. After that, Pro gives you unlimited sending.',
      'faq.q2': 'Does it work on iPhone and Android?',
      'faq.a2': 'Yes. Download it from the App Store or Google Play.',
      'faq.q3': 'Do I need an SSM-registered company?',
      'faq.a3': 'No. Freelancers and one-person contractors use QuoFast too. SST settings are optional.',
      'faq.q4': 'Can I put my own logo on the documents?',
      'faq.a4': 'Yes. Upload your logo once and it appears on every quotation and invoice.',
      'faq.q5': 'Is my data safe?',
      'faq.a5': 'Your data is encrypted in transit and never sold. No ads, no tracking. You can delete your account and all its data at any time.',
      'faq.q6': 'How do I cancel Pro?',
      'faq.a6': 'Any time in Google Play, under Payments & subscriptions. Pro stays active until the end of the period you have paid for.',
      'faq.more': 'Still have a question? Email us at',
      'cta.title': 'Your next quotation can be on its way in a minute.',
      'cta.sub': 'Free to download on iPhone and Android.',
      'footer.quote': 'Quotation generator',
      'footer.invoice': 'Invoice generator',
      'footer.privacy': 'Privacy Policy',
      'footer.contact': 'Contact'
    },

    ms: {
      'meta.title': 'QuoFast — Aplikasi Sebut Harga & Invois untuk Kontraktor Malaysia',
      'meta.description': 'Cipta sebut harga dan invois profesional di telefon dalam masa kurang seminit dan hantar melalui WhatsApp. Sedia SST, dalam Bahasa Melayu, English dan Mandarin.',
      'lang.label': 'Bahasa',
      'nav.how': 'Cara guna',
      'nav.features': 'Ciri-ciri',
      'nav.pricing': 'Harga',
      'nav.faq': 'Soalan lazim',
      'nav.download': 'Muat turun',
      'hero.eyebrow': 'Dibina untuk kontraktor Malaysia',
      'hero.title': 'Hantar sebut harga profesional sebelum anda tinggalkan tapak.',
      'hero.lede': 'Cipta sebut harga dan invois di telefon dalam masa kurang seminit, kemudian hantar PDF terus ke WhatsApp. Sedia SST, dalam Bahasa Melayu, English dan Mandarin.',
      'hero.free': 'Percuma dimuat turun · 3 dokumen pertama percuma untuk dihantar',
      'hero.chip.title': 'Sebut harga dihantar',
      'hero.chip.sub': 'RM 8,460.00 · baru sahaja',
      'trust.made': 'Dibuat di Malaysia',
      'trust.sst': 'Sedia SST',
      'trust.private': 'Tiada iklan, tiada penjejakan',
      'badge.appstore': 'Muat turun di App Store',
      'badge.googleplay': 'Dapatkan di Google Play',
      'alt.quote': 'Pratonton sebut harga QuoFast untuk kerja ubah suai bernilai RM 8,460',
      'alt.editor': 'Mengedit item sebut harga dalam QuoFast',
      'alt.convert': 'Invois yang dicipta daripada sebut harga',
      'alt.track': 'Senarai invois dengan jumlah bulan ini dan invois yang telah dibayar',
      'alt.tax': 'Tetapan kadar SST dan mata wang',
      'alt.report': 'Laporan dengan aliran tunai dan kadar kejayaan sebut harga',
      'how.kicker': 'Cara ia berfungsi',
      'how.title': 'Dari sebut harga ke bayaran dalam tiga langkah',
      'how.s1.title': 'Masukkan kerja',
      'how.s1.text': 'Pilih pelanggan daripada kenalan telefon dan senaraikan kerja — pecah dinding, lepa, cat — dengan kuantiti dan harga seunit.',
      'how.s2.title': 'Tampil dengan jenama anda',
      'how.s2.text': 'Logo, maklumat syarikat dan akaun bank anda dipaparkan pada setiap PDF. Pilih templat dan warna kegemaran anda.',
      'how.s3.title': 'Hantar dan terima bayaran',
      'how.s3.text': 'Kongsi melalui WhatsApp atau e-mel. Bila pelanggan setuju, tukar sebut harga kepada invois dengan satu ketukan dan lihat siapa yang sudah bayar.',
      'feat.kicker': 'Ciri-ciri',
      'feat.title': 'Semua yang kertas kerja anda perlukan',
      'feat.f1.title': 'Sebut harga ke invois, satu ketukan',
      'feat.f1.text': 'Tak perlu taip semula — invois membawa semua item daripada sebut harga anda.',
      'feat.f2.title': 'Lihat siapa yang belum bayar',
      'feat.f2.text': 'Dibayar, belum dibayar dan lewat tempoh sepintas lalu, berserta jumlah bulan ini.',
      'feat.f3.title': 'SST dan enam mata wang',
      'feat.f3.text': 'Tetapkan kadar dan nombor pendaftaran SST sekali sahaja. Bil dalam MYR, SGD, USD, IDR, GBP atau EUR.',
      'feat.f4.title': 'Laporan yang menjawab soalan sebenar',
      'feat.f4.text': 'Tunai diterima, sebut harga dimenangi dan SST dikutip — bulan ini, 3 bulan lepas atau tahun ini.',
      'price.kicker': 'Harga',
      'price.title': 'Harga yang mudah dan telus',
      'price.sub': 'Mula percuma. Naik taraf bila perlu hantar lebih banyak.',
      'plan.free.name': 'Percuma',
      'plan.free.caption': 'Percuma untuk bermula',
      'plan.free.f1': 'Sebut harga & invois tanpa had',
      'plan.free.f2': 'Hantar, kongsi atau cetak 3 dokumen pertama',
      'plan.free.f3': 'Semua templat, SST dan 3 bahasa',
      'plan.monthly.name': 'Pro Bulanan',
      'plan.per.month': '/ bulan',
      'plan.monthly.caption': 'Dibil setiap bulan',
      'plan.pro.f1': 'Hantar, kongsi & cetak tanpa had',
      'plan.pro.f2': 'Semua dalam pelan Percuma',
      'plan.pro.f3': 'Batal bila-bila masa',
      'plan.yearly.name': 'Pro Tahunan',
      'plan.per.year': '/ tahun',
      'plan.yearly.badge': 'Paling jimat',
      'plan.yearly.save': '≈ RM 16.66 sebulan — jimat 44%',
      'plan.cta': 'Cuba sekarang',
      'price.note': 'Langganan kini dijual melalui Google Play. Harga dalam ringgit Malaysia.',
      'faq.kicker': 'Soalan lazim',
      'faq.title': 'Soalan yang sering ditanya',
      'faq.q1': 'Adakah QuoFast percuma?',
      'faq.a1': 'Ya, untuk bermula. Cipta seberapa banyak sebut harga dan invois yang anda mahu — 3 dokumen pertama percuma untuk dihantar. Selepas itu, Pro memberi penghantaran tanpa had.',
      'faq.q2': 'Boleh guna di iPhone dan Android?',
      'faq.a2': 'Boleh. Muat turun dari App Store atau Google Play.',
      'faq.q3': 'Perlukah syarikat berdaftar SSM?',
      'faq.a3': 'Tidak. Pekerja bebas dan kontraktor persendirian juga menggunakan QuoFast. Tetapan SST adalah pilihan.',
      'faq.q4': 'Boleh letak logo sendiri pada dokumen?',
      'faq.a4': 'Boleh. Muat naik logo anda sekali dan ia dipaparkan pada setiap sebut harga dan invois.',
      'faq.q5': 'Adakah data saya selamat?',
      'faq.a5': 'Data anda disulitkan semasa dihantar dan tidak pernah dijual. Tiada iklan, tiada penjejakan. Anda boleh memadam akaun dan semua datanya pada bila-bila masa.',
      'faq.q6': 'Bagaimana hendak membatalkan Pro?',
      'faq.a6': 'Bila-bila masa di Google Play, di bawah Pembayaran & langganan. Pro kekal aktif sehingga akhir tempoh yang telah dibayar.',
      'faq.more': 'Masih ada soalan? E-mel kami di',
      'cta.title': 'Sebut harga seterusnya boleh dihantar dalam seminit.',
      'cta.sub': 'Percuma dimuat turun di iPhone dan Android.',
      'footer.quote': 'Penjana sebut harga',
      'footer.invoice': 'Penjana invois',
      'footer.privacy': 'Dasar Privasi',
      'footer.contact': 'Hubungi'
    },

    zh: {
      'meta.title': 'QuoFast — 马来西亚承包商的报价单和发票 App',
      'meta.description': '手机上一分钟做好专业报价单和发票，直接发到 WhatsApp。支持 SST，中文、Bahasa Melayu、English 三语。',
      'lang.label': '语言',
      'nav.how': '使用流程',
      'nav.features': '功能',
      'nav.pricing': '价格',
      'nav.faq': '常见问题',
      'nav.download': '下载',
      'hero.eyebrow': '专为马来西亚承包商打造',
      'hero.title': '客户还没走，报价单已经发到他手机。',
      'hero.lede': '手机上一分钟做好报价单和发票，PDF 直接发到 WhatsApp。支持 SST，中文、Bahasa Melayu、English 三语。',
      'hero.free': '免费下载 · 前 3 份单据免费发送',
      'hero.chip.title': '报价单已发送',
      'hero.chip.sub': 'RM 8,460.00 · 刚刚',
      'trust.made': '马来西亚开发',
      'trust.sst': '支持 SST',
      'trust.private': '无广告、不追踪',
      'badge.appstore': '在 App Store 下载',
      'badge.googleplay': '在 Google Play 上获取',
      'alt.quote': 'QuoFast 报价单预览：一份 RM 8,460 的装修报价',
      'alt.editor': '在 QuoFast 编辑报价单项目',
      'alt.convert': '由报价单转成的发票',
      'alt.track': '发票列表：本月总额与已付款发票',
      'alt.tax': 'SST 税率与币种设置',
      'alt.report': '报表：现金流与报价成交率',
      'how.kicker': '使用流程',
      'how.title': '三步搞定：报价到收款',
      'how.s1.title': '填写工程',
      'how.s1.text': '从手机通讯录选客户，列出工程项目——打墙、批荡、油漆——填上数量和单价。',
      'how.s2.title': '换上你的门面',
      'how.s2.text': '每份 PDF 自动带上你的 Logo、公司资料和银行户口，模板和颜色随你选。',
      'how.s3.title': '发出去，收到钱',
      'how.s3.text': '用 WhatsApp 或电邮发送。客户点头后，一键把报价单转成发票，谁付了一目了然。',
      'feat.kicker': '功能',
      'feat.title': '开单需要的，都在这里',
      'feat.f1.title': '报价单一键转发票',
      'feat.f1.text': '不用重打，发票自动带上报价单里的项目。',
      'feat.f2.title': '谁还没付钱，一眼看清',
      'feat.f2.text': '已付、未付、逾期清清楚楚，还有本月总额。',
      'feat.f3.title': 'SST 与六种币种',
      'feat.f3.text': 'SST 税率和注册号设一次就好，可用 MYR、SGD、USD、IDR、GBP、EUR 开单。',
      'feat.f4.title': '看得懂的报表',
      'feat.f4.text': '收了多少钱、赢了几张报价、收了多少 SST——本月、近 3 个月或全年。',
      'price.kicker': '价格',
      'price.title': '价格简单透明',
      'price.sub': '免费开始，需要发更多单再升级。',
      'plan.free.name': '免费版',
      'plan.free.caption': '免费开始使用',
      'plan.free.f1': '报价单、发票无限创建',
      'plan.free.f2': '前 3 份可免费发送、分享或打印',
      'plan.free.f3': '全部模板、SST、三种语言',
      'plan.monthly.name': 'Pro 月付',
      'plan.per.month': '/ 月',
      'plan.monthly.caption': '按月扣款',
      'plan.pro.f1': '无限发送、分享、打印',
      'plan.pro.f2': '包含免费版全部功能',
      'plan.pro.f3': '随时取消',
      'plan.yearly.name': 'Pro 年付',
      'plan.per.year': '/ 年',
      'plan.yearly.badge': '最划算',
      'plan.yearly.save': '约 RM 16.66/月，省 44%',
      'plan.cta': '立即试用',
      'price.note': '订阅目前通过 Google Play 购买，价格以马币计。',
      'faq.kicker': '常见问题',
      'faq.title': '师傅们常问的问题',
      'faq.q1': 'QuoFast 免费吗？',
      'faq.a1': '可以免费开始。报价单和发票想建多少都行，前 3 份可以免费发送；之后升级 Pro 就能无限发送。',
      'faq.q2': 'iPhone 和安卓都能用吗？',
      'faq.a2': '都可以，到 App Store 或 Google Play 下载即可。',
      'faq.q3': '一定要有 SSM 注册的公司吗？',
      'faq.a3': '不用。自由职业者、个人师傅也在用。SST 设置可开可关。',
      'faq.q4': '单据上可以放自己的 Logo 吗？',
      'faq.a4': '可以。上传一次 Logo，之后每份报价单和发票都会显示。',
      'faq.q5': '我的资料安全吗？',
      'faq.a5': '资料传输全程加密，绝不出售。没有广告、不追踪。你随时可以删除账号和所有资料。',
      'faq.q6': '怎么取消 Pro？',
      'faq.a6': '随时在 Google Play 的「付款和订阅」里取消。已付费的期间内，Pro 照常可用。',
      'faq.more': '还有其他问题？发邮件到',
      'cta.title': '下一张报价单，一分钟就能发出去。',
      'cta.sub': 'iPhone 与安卓免费下载。',
      'footer.quote': '报价单生成器',
      'footer.invoice': '发票生成器',
      'footer.privacy': '隐私政策',
      'footer.contact': '联系我们'
    }
  };

  var PLAY_URL = 'https://play.google.com/store/apps/details?id=com.quofast.app';
  var APP_STORE_URL = 'https://apps.apple.com/my/app/quofast-quote-invoice/id6797022510';
  var STORAGE_KEY = 'qf-lang';

  var root = document.documentElement;

  function t(lang, key) {
    var table = STRINGS[lang] || STRINGS.en;
    return Object.prototype.hasOwnProperty.call(table, key) ? table[key] : STRINGS.en[key];
  }

  function each(selector, fn) {
    Array.prototype.forEach.call(document.querySelectorAll(selector), fn);
  }

  function applyLanguage(lang) {
    if (!STRINGS[lang]) lang = 'en';
    root.setAttribute('data-lang', lang);
    root.lang = lang === 'zh' ? 'zh-Hans' : lang;

    each('[data-i18n]', function (el) { el.textContent = t(lang, el.getAttribute('data-i18n')); });
    each('[data-i18n-alt]', function (el) { el.alt = t(lang, el.getAttribute('data-i18n-alt')); });
    each('[data-i18n-aria]', function (el) { el.setAttribute('aria-label', t(lang, el.getAttribute('data-i18n-aria'))); });
    // Each store publishes its badge in the visitor's language; swapping the artwork keeps the
    // badges as recognisable as the official ones they are.
    each('img[data-badge]', function (img) {
      var kind = img.getAttribute('data-badge');
      img.src = 'assets/badges/' + kind + '-' + lang + (kind === 'app-store' ? '.svg' : '.png');
    });
    each('.lang button', function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang') === lang));
    });

    document.title = t(lang, 'meta.title');
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', t(lang, 'meta.description'));

    root.classList.remove('i18n-pending');
  }

  function rememberLanguage(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* private mode: not remembered */ }
    // Put the choice in the address too, so a copied link opens in the language it was read in.
    if (window.history && window.URL) {
      var url = new URL(window.location.href);
      url.searchParams.set('lang', lang);
      window.history.replaceState(null, '', url);
    }
  }

  each('.lang button', function (btn) {
    btn.addEventListener('click', function () {
      var lang = btn.getAttribute('data-lang');
      rememberLanguage(lang);
      applyLanguage(lang);
    });
  });

  /*
   * Store links.
   *
   * A bio link such as quofast.app/?src=tiktok is passed on to Google Play as the install referrer,
   * so Play Console can still tell which platform a download came from after it went through this
   * page. It is only a label in a link the visitor is already following — nothing is stored or sent
   * anywhere else.
   */
  var params = new URLSearchParams(window.location.search);
  var source = (params.get('src') || params.get('utm_source') || 'website')
    .toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 32) || 'website';

  function playLink(placement) {
    var referrer = 'utm_source=' + source + '&utm_medium=website&utm_content=' + placement;
    return PLAY_URL + '&referrer=' + encodeURIComponent(referrer);
  }

  var ua = navigator.userAgent || '';
  var isAndroid = /Android/i.test(ua);
  // iPadOS reports itself as a Mac; a touch screen gives it away.
  var isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  each('a[data-store="android"]', function (a) {
    a.href = playLink(a.getAttribute('data-placement') || 'page');
  });
  // "Download" buttons go straight to the right store on a phone, and to the badges on a computer.
  each('a[data-store="auto"]', function (a) {
    if (isAndroid) a.href = playLink(a.getAttribute('data-placement') || 'page');
    else if (isIOS) a.href = APP_STORE_URL;
  });
  if (isAndroid) each('.stores', function (el) { el.classList.add('android-first'); });

  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  applyLanguage(root.getAttribute('data-lang') || 'en');
})();
