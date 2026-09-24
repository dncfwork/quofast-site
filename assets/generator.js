/*
 * The engine behind all four generator pages — quotation and invoice, in English and Bahasa
 * Melayu.
 *
 * The page declares which document it is with data-doc on <body> ("quotation" or "invoice") and
 * which language through <html lang>. Every field that only one document has is looked up
 * defensively, so a missing element is simply skipped rather than throwing.
 *
 * Nothing here talks to a server. The draft is kept in localStorage on the visitor's own device so
 * a reload does not wipe their work — that is the whole of the storage the page does, and the copy
 * says so. "Download PDF" is the browser's own print-to-PDF.
 */

(function () {
  'use strict';

  var DOC = document.body.dataset.doc === 'invoice' ? 'invoice' : 'quotation';
  /* The draft is keyed by document type only, never by language, so switching English ↔ Bahasa
     Melayu keeps everything the visitor has typed. */
  var STORE_KEY = 'qf-gen-' + DOC;
  var UNITS = ['nos', 'sqft', 'ft', 'set', 'lot', 'ls', 'hour', 'day', 'unit'];

  /* Everything the sheet says that is written by this script rather than by the page. The static
     labels live in each page's own HTML. */
  var LANG = document.documentElement.lang === 'ms' ? 'ms' : 'en';
  var T = {
    en: {
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      company: 'Your business name',
      client: 'Client name',
      ssm: 'SSM No. ',
      sst: 'SST No. ',
      total: 'TOTAL',
      due: 'AMOUNT DUE',
      balance: 'BALANCE DUE',
      reset: 'Clear this document and start again?',
      ui: { desc: 'Description', qty: 'Qty', unit: 'Unit', price: 'Unit price',
            hint: 'What are you charging for?', remove: 'Remove this item' },
      items: [
        { desc: 'Floor tiling — supply and lay', qty: 600, unit: 'sqft', price: 12 },
        { desc: 'Interior wall painting (2 coats)', qty: 400, unit: 'sqft', price: 3.5 },
        { desc: 'Plumbing point relocation', qty: 5, unit: 'nos', price: 120 }
      ]
    },
    ms: {
      months: ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogos', 'Sep', 'Okt', 'Nov', 'Dis'],
      company: 'Nama perniagaan anda',
      client: 'Nama pelanggan',
      ssm: 'No. SSM ',
      sst: 'No. SST ',
      total: 'JUMLAH',
      due: 'PERLU DIBAYAR',
      balance: 'BAKI PERLU DIBAYAR',
      reset: 'Kosongkan dokumen ini dan mula semula?',
      ui: { desc: 'Keterangan', qty: 'Kuantiti', unit: 'Unit', price: 'Harga seunit',
            hint: 'Apa yang anda caj?', remove: 'Buang item ini' },
      items: [
        { desc: 'Kerja jubin lantai — bekal dan pasang', qty: 600, unit: 'sqft', price: 12 },
        { desc: 'Cat dinding dalam (2 lapisan)', qty: 400, unit: 'sqft', price: 3.5 },
        { desc: 'Pindah titik paip', qty: 5, unit: 'nos', price: 120 }
      ]
    }
  }[LANG];

  var $ = function (id) { return document.getElementById(id); };
  var items = [];
  var restoring = false;

  /* ------------------------------------------------------------------ helpers */

  function val(id) {
    var el = $(id);
    return el ? String(el.value).trim() : '';
  }

  function checked(id) {
    var el = $(id);
    return !!(el && el.checked);
  }

  /*
   * The six currencies the app itself bills in. Prefixes are the unambiguous ones — "US$" and
   * "S$" rather than a bare "$", because an invoice that does not say which dollar is a dispute
   * waiting to happen. Rupiah is conventionally written without cents.
   */
  var CURRENCIES = {
    MYR: { prefix: 'RM', dp: 2 },
    SGD: { prefix: 'S$', dp: 2 },
    USD: { prefix: 'US$', dp: 2 },
    IDR: { prefix: 'Rp', dp: 0 },
    GBP: { prefix: '\u00A3', dp: 2 },
    EUR: { prefix: '\u20AC', dp: 2 }
  };

  function currency() {
    return CURRENCIES[val('currency')] || CURRENCIES.MYR;
  }

  function money(n) {
    var v = Number(n);
    if (!isFinite(v)) v = 0;
    var c = currency();
    return c.prefix + ' ' + v.toLocaleString('en-MY', { minimumFractionDigits: c.dp, maximumFractionDigits: c.dp });
  }

  function qty(n) {
    var v = Number(n);
    if (!isFinite(v)) v = 0;
    // Whole numbers read better without ".00"; fractions keep up to three places (0.5 sqft etc).
    return v.toLocaleString('en-MY', { maximumFractionDigits: 3 });
  }

  function fmtDate(iso) {
    if (!iso) return '—';
    var parts = iso.split('-');
    if (parts.length !== 3) return iso;
    var m = T.months[Number(parts[1]) - 1] || parts[1];
    return Number(parts[2]) + ' ' + m + ' ' + parts[0];
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function isoDay(d) {
    // Local date, not toISOString() — that shifts to UTC and can hand a Malaysian visitor yesterday.
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }

  /* ------------------------------------------------------------------ line items */

  function lineHtml(it, i) {
    var opts = UNITS.map(function (u) {
      return '<option value="' + u + '"' + (u === it.unit ? ' selected' : '') + '>' + u + '</option>';
    }).join('');
    return '' +
      '<div class="line">' +
        '<button type="button" class="kill" data-kill="' + i + '" aria-label="' + T.ui.remove + '">' +
          '<svg class="icon" aria-hidden="true"><use href="#i-x"/></svg>' +
        '</button>' +
        '<div class="field desc">' +
          '<label for="d' + i + '" class="sub-label">' + T.ui.desc + '</label>' +
          '<input id="d' + i + '" value="' + esc(it.desc) + '" data-set="desc" data-i="' + i + '" placeholder="' + T.ui.hint + '">' +
        '</div>' +
        '<div class="line-grid">' +
          '<div><label class="sub-label" for="q' + i + '">' + T.ui.qty + '</label>' +
            '<input id="q' + i + '" type="number" step="any" min="0" inputmode="decimal" value="' + esc(it.qty) + '" data-set="qty" data-i="' + i + '"></div>' +
          '<div><label class="sub-label" for="u' + i + '">' + T.ui.unit + '</label>' +
            '<select id="u' + i + '" data-set="unit" data-i="' + i + '">' + opts + '</select></div>' +
          '<div><label class="sub-label" for="p' + i + '">' + T.ui.price + '</label>' +
            '<input id="p' + i + '" type="number" step="any" min="0" inputmode="decimal" value="' + esc(it.price) + '" data-set="price" data-i="' + i + '"></div>' +
        '</div>' +
      '</div>';
  }

  function drawLines() {
    $('items').innerHTML = items.map(lineHtml).join('');
  }

  function addItem() {
    items.push({ desc: '', qty: 1, unit: 'nos', price: 0 });
    drawLines();
    var last = document.querySelector('.line:last-child input[data-set="desc"]');
    if (last) last.focus();
    update();
  }

  function removeItem(i) {
    items.splice(i, 1);
    if (!items.length) items.push({ desc: '', qty: 1, unit: 'nos', price: 0 });
    drawLines();
    update();
  }

  /* ------------------------------------------------------------------ preview */

  function addressLines(raw) {
    // Split on line breaks only. Splitting on commas too turns one typed address into five short
    // lines, which pushes the payment box off the bottom of the page; long lines wrap in CSS.
    return raw.split(/\r?\n/).map(function (s) { return s.trim(); }).filter(Boolean);
  }

  function fillLines(el, lines) {
    if (!el) return;
    el.innerHTML = lines.filter(Boolean).map(function (l) {
      return '<div class="sheet-line">' + esc(l) + '</div>';
    }).join('');
  }

  function setText(id, text) {
    var el = $(id);
    if (el) el.textContent = text;
  }

  function show(id, on) {
    var el = $(id);
    if (el) el.style.display = on ? '' : 'none';
  }

  function update() {
    /* Your business */
    setText('pCoName', val('coName') || T.company);
    fillLines($('pCoMeta'), addressLines(val('coAddr')).concat([
      val('coPhone'),
      val('coEmail'),
      val('coSsm') ? T.ssm + val('coSsm') : '',
      val('coSst') ? T.sst + val('coSst') : ''
    ]));

    /* Client */
    setText('pClName', val('clName') || T.client);
    fillLines($('pClMeta'), addressLines(val('clAddr')).concat([val('clPhone'), val('clEmail')]));

    /* Document meta */
    setText('pDocNo', val('docNo') || '—');
    setText('pIssue', fmtDate(val('issueDate')));
    setText('pTail', fmtDate(val('tailDate')));

    /* Items */
    var subtotal = 0;
    var rows = items.map(function (it) {
      var amount = (Number(it.qty) || 0) * (Number(it.price) || 0);
      subtotal += amount;
      return '<tr>' +
        '<td class="desc-cell">' + esc(it.desc || '—') + '</td>' +
        '<td class="num">' + qty(it.qty) + '</td>' +
        '<td class="num">' + esc(String(it.unit).toUpperCase()) + '</td>' +
        '<td class="num">' + money(it.price) + '</td>' +
        '<td class="num">' + money(amount) + '</td>' +
      '</tr>';
    }).join('');
    $('pRows').innerHTML = rows;

    /* Discount (optional) */
    var discount = Number(val('discount')) || 0;
    if (discount > subtotal) discount = subtotal;
    var afterDiscount = subtotal - discount;
    show('pDiscountRow', discount > 0);
    setText('pDiscount', '− ' + money(discount));

    /* Tax */
    var taxOn = checked('taxOn');
    var rate = Number(val('taxRate')) || 0;
    var tax = taxOn ? afterDiscount * (rate / 100) : 0;
    show('pTaxRow', taxOn);
    setText('pTaxLabel', (val('taxLabel') || 'SST') + ' (' + rate + '%)');
    setText('pTax', money(tax));

    setText('pSub', money(subtotal));
    var total = afterDiscount + tax;

    /* Invoices can carry a deposit that was already collected. */
    var paid = DOC === 'invoice' ? Number(val('paid')) || 0 : 0;
    if (paid > total) paid = total;
    show('pPaidRow', paid > 0);
    setText('pPaid', '− ' + money(paid));
    setText('pTotalLabel', paid > 0 ? T.balance : (DOC === 'invoice' ? T.due : T.total));
    setText('pTotal', money(total - paid));

    /* The money hints beside the discount and deposit fields follow the chosen currency. */
    Array.prototype.forEach.call(document.querySelectorAll('[data-cur]'), function (el) {
      el.textContent = currency().prefix;
    });

    /* Notes and payment details */
    var notes = val('notes');
    show('pNotesBlock', !!notes);
    setText('pNotes', notes);

    if (DOC === 'invoice') {
      var bank = val('bankName');
      var holder = val('bankHolder');
      var acct = val('bankAcct');
      show('pPayBox', !!(bank || holder || acct));
      setText('pBank', bank || '—');
      setText('pHolder', holder || '—');
      setText('pAcct', acct || '—');
    }

    save();
  }

  /* ------------------------------------------------------------------ fit the A4 sheet on screen */

  function fit() {
    var stage = document.querySelector('.sheet-stage');
    var sheet = $('sheet');
    if (!stage || !sheet) return;
    var scale = Math.min(1, stage.clientWidth / 794);
    stage.style.setProperty('--sheet-scale', scale);
    // The transform does not change layout height, so the stage has to be told what to reserve.
    stage.style.height = Math.ceil(sheet.offsetHeight * scale) + 'px';
  }

  /* ------------------------------------------------------------------ draft storage */

  function fieldIds() {
    // Only the document's own fields — the line-item inputs carry data-set and are stored in `items`.
    return Array.prototype.map.call(
      document.querySelectorAll('.editor input[id]:not([data-set]), .editor textarea[id]:not([data-set]), .editor select[id]:not([data-set])'),
      function (el) { return el.id; }
    );
  }

  function save() {
    if (restoring) return;
    try {
      var data = { items: items, fields: {} };
      fieldIds().forEach(function (id) {
        var el = $(id);
        data.fields[id] = el.type === 'checkbox' ? el.checked : el.value;
      });
      localStorage.setItem(STORE_KEY, JSON.stringify(data));
    } catch (e) { /* private mode, quota, disabled storage — the page still works */ }
  }

  function restore() {
    var raw;
    try { raw = localStorage.getItem(STORE_KEY); } catch (e) { return false; }
    if (!raw) return false;
    var data;
    try { data = JSON.parse(raw); } catch (e) { return false; }
    if (!data || !Array.isArray(data.items) || !data.fields) return false;

    restoring = true;
    Object.keys(data.fields).forEach(function (id) {
      var el = $(id);
      if (!el) return;
      if (el.type === 'checkbox') el.checked = !!data.fields[id];
      else el.value = data.fields[id];
    });
    items = data.items.map(function (it) {
      return {
        desc: String(it && it.desc || ''),
        qty: Number(it && it.qty) || 0,
        unit: UNITS.indexOf(it && it.unit) > -1 ? it.unit : 'nos',
        price: Number(it && it.price) || 0
      };
    });
    if (!items.length) items.push({ desc: '', qty: 1, unit: 'nos', price: 0 });
    restoring = false;
    return true;
  }

  function reset() {
    if (!window.confirm(T.reset)) return;
    try { localStorage.removeItem(STORE_KEY); } catch (e) {}
    location.reload();
  }

  /* ------------------------------------------------------------------ start */

  function defaults() {
    var today = new Date();
    var tail = new Date(today.getTime() + (DOC === 'invoice' ? 30 : 14) * 86400000);
    if ($('issueDate')) $('issueDate').value = isoDay(today);
    if ($('tailDate')) $('tailDate').value = isoDay(tail);
    if ($('docNo')) {
      $('docNo').value = (DOC === 'invoice' ? 'INV-' : 'QT-') + today.getFullYear() + '-001';
    }
    items = T.items.map(function (it) { return { desc: it.desc, qty: it.qty, unit: it.unit, price: it.price }; });
  }

  defaults();
  restore();
  drawLines();

  /* One delegated listener each, so redrawn line items never need rebinding. */
  function onEdit(e) {
    var t = e.target;
    if (t.dataset && t.dataset.set) {
      var i = Number(t.dataset.i);
      var key = t.dataset.set;
      if (items[i]) items[i][key] = (key === 'desc' || key === 'unit') ? t.value : Number(t.value);
    }
    update();
  }

  document.querySelector('.editor').addEventListener('input', onEdit);
  document.querySelector('.editor').addEventListener('change', onEdit);

  document.querySelector('.editor').addEventListener('click', function (e) {
    var kill = e.target.closest('[data-kill]');
    if (kill) { removeItem(Number(kill.dataset.kill)); return; }
    if (e.target.closest('#addItem')) addItem();
    if (e.target.closest('#resetDoc')) reset();
  });

  /* ------------------------------------------------------------------ switching document type */

  /*
   * The quotation and the invoice are separate pages so each can be found by its own search, but
   * to the visitor they are one tool. Clicking the switch carries their details across first.
   */
  var OTHER_KEY = 'qf-gen-' + (DOC === 'invoice' ? 'quotation' : 'invoice');
  var IDENTITY = ['coName', 'coAddr', 'coPhone', 'coEmail', 'coSsm', 'coSst'];
  var JOB = ['clName', 'clAddr', 'clPhone', 'clEmail', 'discount', 'taxOn', 'taxLabel', 'taxRate'];

  function read(id) {
    var el = $(id);
    if (!el) return null;
    return el.type === 'checkbox' ? el.checked : el.value;
  }

  function carryAcross() {
    try {
      var raw = localStorage.getItem(OTHER_KEY);
      var draft = raw ? JSON.parse(raw) : null;
      var fresh = !draft || typeof draft !== 'object' || !draft.fields;
      if (fresh) draft = { items: [], fields: {} };
      if (!Array.isArray(draft.items)) draft.items = [];

      // Your own business details are the same whichever document you are making.
      IDENTITY.forEach(function (id) {
        var v = read(id);
        if (v !== null) draft.fields[id] = v;
      });

      // The client and the work travel only into an empty document — never over a draft in progress.
      if (fresh) {
        JOB.forEach(function (id) {
          var v = read(id);
          if (v !== null) draft.fields[id] = v;
        });
        draft.items = items.map(function (it) {
          return { desc: it.desc, qty: it.qty, unit: it.unit, price: it.price };
        });
      }

      localStorage.setItem(OTHER_KEY, JSON.stringify(draft));
    } catch (e) { /* storage unavailable — the other page just starts fresh */ }
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-carry]')) carryAcross();
  });

  /* Play's install referrer is the only free attribution these pages get: what it
     carries arrives in Play Console, so a post that actually sends someone can be
     told apart from a stranger who searched. site.js does this for the home page,
     but these pages never load site.js — so the badges shipped without it and every
     install they earn would have read as organic. Same shape as site.js on purpose;
     if one changes, change both. The App Store has no equivalent open parameter,
     so those links stay bare rather than carrying something that does nothing. */
  (function () {
    var PLAY_URL = 'https://play.google.com/store/apps/details?id=com.quofast.app';
    var params = new URLSearchParams(window.location.search);
    var src = (params.get('src') || params.get('utm_source') || 'tool')
      .toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 32) || 'tool';
    // Which page, and which of the two blocks on it — worth knowing whether the ask
    // after the PDF outperforms the one at the foot of the page.
    var page = (location.pathname.split('/').pop() || 'tool').replace(/\.html$/, '').slice(0, 32);
    var links = document.querySelectorAll('a[data-store="android"]');
    for (var i = 0; i < links.length; i++) {
      var placement = links[i].closest('.dl-cta') ? 'after-pdf' : 'page-foot';
      links[i].href = PLAY_URL + '&referrer=' + encodeURIComponent(
        'utm_source=' + src + '&utm_medium=tool&utm_campaign=' + page + '&utm_content=' + placement);
    }
  })();

  var printBtn = $('printDoc');
  if (printBtn) printBtn.addEventListener('click', function () {
    // Someone who has just saved a PDF is the one visitor certain to want this
    // again next week, so the store links wait for that moment rather than
    // asking for a download before the tool has done anything for them. Revealed
    // before print() because the call blocks until the dialog closes in some
    // browsers, and the links should already be there when it does.
    var cta = $('dlCta');
    if (cta) cta.hidden = false;
    window.print();
  });

  update();
  fit();

  window.addEventListener('resize', fit);
  if (window.ResizeObserver) {
    // The sheet grows as items are added; the stage has to follow it.
    new ResizeObserver(fit).observe($('sheet'));
  }
  // Web fonts land after first paint and change the sheet's height.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
})();
