/* Little Easier grown-up check.
   LEGate.ask(onPass): shows "Tap the number seventy-five" with a number pad. Easy for a grown-up,
   not something a young child can do by guessing; the number changes every time. Used in front of
   grown-up settings and "play again" after a wind-down timer. Works the same in every Little Easier app. */
(function () {
  var ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  var TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  function words(n) { return TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : ''); }
  // two different digits, never a round ten
  function pick(not) { var n; do { n = 21 + Math.floor(Math.random() * 78); } while (n % 10 === 0 || Math.floor(n / 10) === n % 10 || n === not); return n; }

  var css = '.legate *{box-sizing:border-box;position:static;letter-spacing:normal;text-transform:none}.legate{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.5);' +
    'font-family:ui-rounded,"SF Pro Rounded",Nunito,system-ui,-apple-system,sans-serif;-webkit-user-select:none;user-select:none;touch-action:manipulation}' +
    '.legate .le-card{background:#FBF7EE;color:#2E3A3A;border-radius:26px;padding:20px;width:300px;max-width:calc(100vw - 32px);box-shadow:0 14px 40px rgba(0,0,0,.35)}' +
    '.legate .le-top{display:flex;align-items:center;gap:8px;font-weight:800;font-size:19px}' +
    '.legate .le-top span{flex:1}' +
    '.legate .le-x{width:36px;height:36px;border-radius:50%;border:0;background:#fff;font-size:18px;color:#2E3A3A;cursor:pointer}' +
    '.legate .le-ask{margin:14px 0 4px;text-align:center;font-weight:600;opacity:.7;font-size:15px}' +
    '.legate .le-num{text-align:center;font-weight:800;font-size:27px;margin-bottom:12px}' +
    '.legate .le-boxes{display:flex;justify-content:center;gap:10px;margin-bottom:14px}' +
    '.legate .le-boxes b{width:50px;height:58px;border-radius:12px;background:#fff;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:800}' +
    '.legate .le-pad{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}' +
    '.legate .le-pad button{height:54px;border-radius:16px;border:0;background:#fff;font:inherit;font-size:24px;font-weight:700;color:#2E3A3A;cursor:pointer;box-shadow:0 1px 0 rgba(0,0,0,.08)}' +
    '.legate .le-pad button:active{transform:scale(.96)}' +
    '.legate .le-pad .le-blank{visibility:hidden}' +
    '@keyframes leshake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-9px)}40%,80%{transform:translateX(9px)}}' +
    '.legate .le-boxes.le-no{animation:leshake .4s}';

  function buzz(ms) { try { if (window.LittleEasierHaptic) window.LittleEasierHaptic(ms > 20 ? 'warning' : 'light'); else if (navigator.vibrate) navigator.vibrate(ms); } catch (e) {} }

  function ask(onPass) {
    if (!document.getElementById('legate-css')) {
      var st = document.createElement('style'); st.id = 'legate-css'; st.textContent = css; document.head.appendChild(st);
    }
    var target = pick(), typed = '';
    var wrap = document.createElement('div');
    wrap.className = 'legate';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-label', 'For grown-ups');
    wrap.innerHTML = '<div class="le-card"><div class="le-top"><svg width="18" height="18" viewBox="0 0 24 24" fill="#2B8783"><path d="M17 10V7a5 5 0 0 0-10 0v3H5v12h14V10h-2zm-8 0V7a3 3 0 0 1 6 0v3H9z"/></svg>' +
      '<span>For grown-ups</span><button class="le-x" type="button" aria-label="Cancel">✕</button></div>' +
      '<div class="le-ask">Tap the number</div><div class="le-num"></div><div class="le-boxes"><b></b><b></b></div><div class="le-pad"></div></div>';
    var num = wrap.querySelector('.le-num'), boxes = wrap.querySelector('.le-boxes'), pad = wrap.querySelector('.le-pad');
    function show() { num.textContent = words(target); var b = boxes.children; b[0].textContent = typed[0] || ''; b[1].textContent = typed[1] || ''; }
    function close() { wrap.remove(); document.removeEventListener('keydown', onKey); }
    function press(d) {
      if (typed.length >= 2) return;
      typed += d; show(); buzz(5);
      if (typed.length < 2) return;
      if (+typed === target) { close(); onPass(); return; }
      buzz(30); boxes.classList.remove('le-no'); void boxes.offsetWidth; boxes.classList.add('le-no');
      setTimeout(function () { typed = ''; target = pick(target); show(); }, 450);
    }
    [1, 2, 3, 4, 5, 6, 7, 8, 9, -1, 0, -2].forEach(function (d) {
      var b = document.createElement('button'); b.type = 'button';
      if (d === -1) { b.className = 'le-blank'; b.tabIndex = -1; b.setAttribute('aria-hidden', 'true'); }
      else if (d === -2) { b.textContent = '⌫'; b.setAttribute('aria-label', 'Delete'); b.onclick = function () { typed = typed.slice(0, -1); show(); }; }
      else { b.textContent = d; b.onclick = function () { press(String(d)); }; }
      pad.appendChild(b);
    });
    function onKey(e) { if (e.key === 'Escape') close(); else if (/^[0-9]$/.test(e.key)) press(e.key); else if (e.key === 'Backspace') { typed = typed.slice(0, -1); show(); } }
    wrap.querySelector('.le-x').onclick = close;
    wrap.addEventListener('pointerdown', function (e) { e.stopPropagation(); if (e.target === wrap) close(); });
    document.addEventListener('keydown', onKey);
    show();
    document.body.appendChild(wrap);
  }
  window.LEGate = { ask: ask };
})();
