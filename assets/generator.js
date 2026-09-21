/*
 * The engine behind quotation-generator.html and invoice-generator.html.
 *
 * One script serves both pages. The page declares which document it is with data-doc on <body>
 * ("quotation" or "invoice"); every field that only one of them has is looked up defensively, so
 * a missing element is simply skipped rather than throwing.
 *
 * Nothing here talks to a server. The draft is kept in localStorage on the visitor's own device so
 * a reload does not wipe their work — that is the whole of the storage the page does, and the copy
 * says so. "Download PDF" is the browser's own print-to-PDF.
 */

(function () {
  'use strict';

  var DOC = document.body.dataset.doc === 'invoice' ? 'invoice' : 'quotation';
  var STORE_KEY = 'qf-gen-' + DOC;
  var UNITS = ['nos', 'sqft', 'ft', 'set', 'lot', 'ls', 'hour', 'day', 'unit'];

  var SAMPLES = {
    quotation: [
      { desc: 'Floor tiling — supply and lay', qty: 600, unit: 'sqft', price: 12 },
      { desc: 'Interior wall painting (2 coats)', qty: 400, unit: 'sqft', price: 3.5 },
      { desc: 'Plumbing point relocation', qty: 5, unit: 'nos', price: 120 }
    ],
    invoice: [
      { desc: 'Floor tiling — supply and lay', qty: 600, unit: 'sqft', price: 12 },
      { desc: 'Interior wall painting (2 coats)', qty: 400, unit: 'sqft', price: 3.5 },
      { desc: 'Plumbing point relocation', qty: 5, unit: 'nos', price: 120 }
    ]
  };

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

  function money(n) {
    var v = Number(n);
    if (!isFinite(v)) v = 0;
    return 'RM ' + v.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
    var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var m = MONTHS[Number(parts[1]) - 1] || parts[1];
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
        '<button type="button" class="kill" data-kill="' + i + '" aria-label="Remove this item">' +
          '<svg class="icon" aria-hidden="true"><use href="#i-x"/></svg>' +
        '</button>' +
        '<div class="field desc">' +
          '<label for="d' + i + '" class="sub-label">Description</label>' +
          '<input id="d' + i + '" value="' + esc(it.desc) + '" data-set="desc" data-i="' + i + '" placeholder="What are you charging for?">' +
        '</div>' +
        '<div class="line-grid">' +
          '<div><label class="sub-label" for="q' + i + '">Qty</label>' +
            '<input id="q' + i + '" type="number" step="any" min="0" inputmode="decimal" value="' + esc(it.qty) + '" data-set="qty" data-i="' + i + '"></div>' +
          '<div><label class="sub-label" for="u' + i + '">Unit</label>' +
            '<select id="u' + i + '" data-set="unit" data-i="' + i + '">' + opts + '</select></div>' +
          '<div><label class="sub-label" for="p' + i + '">Unit price</label>' +
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
    setText('pCoName', val('coName') || 'Your business name');
    fillLines($('pCoMeta'), addressLines(val('coAddr')).concat([
      val('coPhone'),
      val('coEmail'),
      val('coSsm') ? 'SSM No. ' + val('coSsm') : '',
      val('coSst') ? 'SST No. ' + val('coSst') : ''
    ]));

    /* Client */
    setText('pClName', val('clName') || 'Client name');
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
    setText('pTotalLabel', paid > 0 ? 'BALANCE DUE' : (DOC === 'invoice' ? 'AMOUNT DUE' : 'TOTAL'));
    setText('pTotal', money(total - paid));

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
    if (!window.confirm('Clear this ' + DOC + ' and start again?')) return;
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
    items = SAMPLES[DOC].map(function (it) { return { desc: it.desc, qty: it.qty, unit: it.unit, price: it.price }; });
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

  var printBtn = $('printDoc');
  if (printBtn) printBtn.addEventListener('click', function () { window.print(); });

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
