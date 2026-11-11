/* Kids School practice engine. Plain script, no build step.
   Each kid page loads content banks + generators, then calls KS.start(config). */
(function () {
  'use strict';
  const KS = window.KS = window.KS || {};
  KS.bank = KS.bank || {};
  KS.gen = KS.gen || {};

  // ---------------------------------------------------------------- utils
  const U = KS.util = {
    ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); },
    pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; },
    shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
      return a;
    },
    sample(arr, n) { return U.shuffle(arr).slice(0, n); },
    gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; },
    lcm(a, b) { return Math.abs(a * b) / U.gcd(a, b); },
    fmtDate(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); },
    today() { return U.fmtDate(new Date()); },
    addDays(ds, n) { const d = new Date(ds + 'T12:00:00'); d.setDate(d.getDate() + n); return U.fmtDate(d); },
    dayDiff(a, b) { return Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 864e5); },
    esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); },
    // Signed number for display, with a real minus sign.
    sn(n) { return n < 0 ? '−' + Math.abs(n) : String(n); },
    // Parenthesised if negative (for use inside expressions).
    pn(n) { return n < 0 ? '(−' + Math.abs(n) + ')' : String(n); },
    frHtml(n, d) {
      if (d === 1) return U.sn(n);
      const neg = n < 0;
      return (neg ? '−' : '') + '<span class="fr"><span>' + Math.abs(n) + '</span><span>' + d + '</span></span>';
    },
    // Build an mc item from a correct value and candidate wrong values (deduped).
    mc(q, correct, wrongs, explain, extra) {
      const seen = new Set([String(correct)]);
      const ws = [];
      for (const w of wrongs) { const k = String(w); if (!seen.has(k)) { seen.add(k); ws.push(w); } if (ws.length === 3) break; }
      return Object.assign({ kind: 'mc', html: true, q, choices: [correct].concat(ws).map(String), answer: 0, explain }, extra || {});
    },
    num(q, ans, explain, extra) {
      return Object.assign({ kind: 'num', html: true, q, ans: String(ans), explain }, extra || {});
    },
    weighted(items, wfn) {
      const ws = items.map(wfn);
      let t = ws.reduce((a, b) => a + b, 0);
      if (t <= 0) return U.pick(items);
      let r = Math.random() * t;
      for (let i = 0; i < items.length; i++) { r -= ws[i]; if (r <= 0) return items[i]; }
      return items[items.length - 1];
    },
  };

  // ------------------------------------------------------------ rationals
  const R = KS.rat = {
    make(n, d) {
      if (d === undefined) d = 1;
      if (d < 0) { n = -n; d = -d; }
      const g = U.gcd(n, d) || 1;
      return { n: n / g, d: d / g };
    },
    parse(s) {
      if (s === null || s === undefined) return null;
      s = String(s).trim().replace(/−/g, '-').replace(/\s+/g, ' ');
      if (!s) return null;
      let m;
      if ((m = s.match(/^(-?)(\d+) (\d+)\/(\d+)$/))) {
        const b = +m[4]; if (!b) return null;
        const r = R.make(+m[2] * b + +m[3], b);
        return m[1] ? R.make(-r.n, r.d) : r;
      }
      if ((m = s.match(/^(-?\d+)\/(-?\d+)$/))) { const b = +m[2]; if (!b) return null; return R.make(+m[1], b); }
      if (/^-?(\d+\.?\d*|\.\d+)$/.test(s)) {
        const neg = s[0] === '-';
        const t = neg ? s.slice(1) : s;
        const parts = t.split('.');
        const fp = parts[1] || '';
        const d = Math.pow(10, fp.length);
        const n = (+(parts[0] || 0)) * d + (+(fp || 0));
        return R.make(neg ? -n : n, d);
      }
      return null;
    },
    eq(a, b) { return !!a && !!b && a.n * b.d === b.n * a.d; },
    str(r) { return r.d === 1 ? String(r.n) : r.n + '/' + r.d; },
    html(r) { return U.frHtml(r.n, r.d); },
  };

  // --------------------------------------------------------------- speech
  let voice = null;
  function pickVoice() {
    if (!('speechSynthesis' in window)) return;
    const vs = speechSynthesis.getVoices() || [];
    const en = vs.filter(v => /^en(-|_)US/i.test(v.lang));
    voice = en.find(v => /Samantha/i.test(v.name)) || en.find(v => /Google US English/i.test(v.name)) ||
      en.find(v => v.localService) || en[0] || vs.find(v => /^en/i.test(v.lang)) || null;
  }
  if ('speechSynthesis' in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  KS.say = function (text, opts) {
    if (!('speechSynthesis' in window) || !text) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = (opts && opts.rate) || (C && C.young ? 0.88 : 0.95);
      if (voice) u.voice = voice;
      u.lang = 'en-US';
      speechSynthesis.speak(u);
    } catch (e) { /* ignore */ }
  };
  KS.hush = function () { if ('speechSynthesis' in window) speechSynthesis.cancel(); };

  // ----------------------------------------------------------------- svg
  const SVG = KS.svg = {
    plane(o) {
      const min = o.min !== undefined ? o.min : -8, max = o.max !== undefined ? o.max : 8;
      const size = o.size || 340, pad = 22, W = size - 2 * pad;
      const X = x => pad + (x - min) / (max - min) * W;
      const Y = y => pad + (max - y) / (max - min) * W;
      let s = `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" font-family="-apple-system,sans-serif">`;
      s += `<rect x="0" y="0" width="${size}" height="${size}" fill="#fff" rx="14"/>`;
      for (let v = min; v <= max; v++) {
        s += `<line x1="${X(v)}" y1="${Y(min)}" x2="${X(v)}" y2="${Y(max)}" stroke="#e6e3f0" stroke-width="1"/>`;
        s += `<line x1="${X(min)}" y1="${Y(v)}" x2="${X(max)}" y2="${Y(v)}" stroke="#e6e3f0" stroke-width="1"/>`;
      }
      s += `<line x1="${X(min)}" y1="${Y(0)}" x2="${X(max)}" y2="${Y(0)}" stroke="#555" stroke-width="2"/>`;
      s += `<line x1="${X(0)}" y1="${Y(min)}" x2="${X(0)}" y2="${Y(max)}" stroke="#555" stroke-width="2"/>`;
      const step = (max - min) > 12 ? 2 : 1;
      for (let v = min; v <= max; v += step) {
        if (v === 0) continue;
        s += `<text x="${X(v)}" y="${Y(0) + 15}" font-size="11" text-anchor="middle" fill="#666">${v}</text>`;
        s += `<text x="${X(0) - 6}" y="${Y(v) + 4}" font-size="11" text-anchor="end" fill="#666">${v}</text>`;
      }
      s += `<text x="${X(max) - 4}" y="${Y(0) - 6}" font-size="13" text-anchor="end" fill="#333" font-style="italic">x</text>`;
      s += `<text x="${X(0) + 8}" y="${Y(max) + 12}" font-size="13" fill="#333" font-style="italic">y</text>`;
      s += `<clipPath id="pc"><rect x="${pad}" y="${pad}" width="${W}" height="${W}"/></clipPath>`;
      (o.lines || []).forEach(l => {
        let x1, y1, x2, y2;
        if (l.vertical !== undefined) { x1 = x2 = l.vertical; y1 = min; y2 = max; }
        else { x1 = min; x2 = max; y1 = l.m * min + l.b; y2 = l.m * max + l.b; }
        s += `<line clip-path="url(#pc)" x1="${X(x1)}" y1="${Y(y1)}" x2="${X(x2)}" y2="${Y(y2)}" stroke="${l.color || '#6c4cf0'}" stroke-width="3"/>`;
      });
      (o.curves || []).forEach(c => {
        s += `<polyline clip-path="url(#pc)" fill="none" stroke="${c.color || '#6c4cf0'}" stroke-width="3" stroke-linejoin="round" points="${c.pts.map(p => X(p[0]).toFixed(1) + ',' + Y(p[1]).toFixed(1)).join(' ')}"/>`;
      });
      (o.points || []).forEach(p => {
        const col = p.color || '#e4572e';
        s += `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="6" fill="${p.open ? '#fff' : col}" stroke="${col}" stroke-width="${p.open ? 3 : 0}"/>`;
        if (p.label) s += `<text x="${X(p.x) + 9}" y="${Y(p.y) - 8}" font-size="15" font-weight="700" fill="#222">${p.label}</text>`;
      });
      return s + '</svg>';
    },
    numberLine(o) {
      const min = o.min, max = o.max, w = o.width || 360, h = 64, pad = 22;
      const X = x => pad + (x - min) / (max - min) * (w - 2 * pad);
      const y = 30, col = o.color || '#6c4cf0';
      let s = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" font-family="-apple-system,sans-serif">`;
      s += `<line x1="${pad - 12}" y1="${y}" x2="${w - pad + 12}" y2="${y}" stroke="#555" stroke-width="2"/>`;
      s += `<path d="M${pad - 14} ${y} l8 -5 v10z M${w - pad + 14} ${y} l-8 -5 v10z" fill="#555"/>`;
      for (let v = min; v <= max; v++) {
        s += `<line x1="${X(v)}" y1="${y - 6}" x2="${X(v)}" y2="${y + 6}" stroke="#555" stroke-width="1.5"/>`;
        s += `<text x="${X(v)}" y="${y + 24}" font-size="13" text-anchor="middle" fill="#444">${v < 0 ? '−' + Math.abs(v) : v}</text>`;
      }
      if (o.point !== undefined) {
        if (o.dir) {
          const end = o.dir === 'right' ? w - pad + 10 : pad - 10;
          s += `<line x1="${X(o.point)}" y1="${y}" x2="${end}" y2="${y}" stroke="${col}" stroke-width="6"/>`;
          s += o.dir === 'right' ? `<path d="M${end + 6} ${y} l-12 -9 v18z" fill="${col}"/>` : `<path d="M${end - 6} ${y} l12 -9 v18z" fill="${col}"/>`;
        }
        s += `<circle cx="${X(o.point)}" cy="${y}" r="8" fill="${o.open ? '#fff' : col}" stroke="${col}" stroke-width="3"/>`;
      }
      return s + '</svg>';
    },
    scatter(o) {
      const w = o.width || 360, h = o.height || 260, pl = 46, pb = 40, pt = 14, pr = 14;
      const xmax = o.xmax, ymax = o.ymax;
      const X = x => pl + x / xmax * (w - pl - pr);
      const Y = y => h - pb - y / ymax * (h - pb - pt);
      let s = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" font-family="-apple-system,sans-serif">`;
      s += `<rect width="${w}" height="${h}" fill="#fff" rx="12"/>`;
      for (let i = 0; i <= 5; i++) {
        const yv = ymax * i / 5, xv = xmax * i / 5;
        s += `<line x1="${pl}" y1="${Y(yv)}" x2="${w - pr}" y2="${Y(yv)}" stroke="#eee"/>`;
        s += `<text x="${pl - 6}" y="${Y(yv) + 4}" font-size="11" text-anchor="end" fill="#666">${Math.round(yv)}</text>`;
        s += `<text x="${X(xv)}" y="${h - pb + 16}" font-size="11" text-anchor="middle" fill="#666">${Math.round(xv)}</text>`;
      }
      s += `<line x1="${pl}" y1="${Y(0)}" x2="${w - pr}" y2="${Y(0)}" stroke="#555" stroke-width="2"/>`;
      s += `<line x1="${pl}" y1="${Y(0)}" x2="${pl}" y2="${pt}" stroke="#555" stroke-width="2"/>`;
      if (o.xLabel) s += `<text x="${(pl + w - pr) / 2}" y="${h - 6}" font-size="12" text-anchor="middle" fill="#333">${U.esc(o.xLabel)}</text>`;
      if (o.yLabel) s += `<text x="12" y="${(pt + h - pb) / 2}" font-size="12" text-anchor="middle" fill="#333" transform="rotate(-90 12 ${(pt + h - pb) / 2})">${U.esc(o.yLabel)}</text>`;
      if (o.line) s += `<line x1="${X(0)}" y1="${Y(o.line.b)}" x2="${X(xmax)}" y2="${Y(o.line.m * xmax + o.line.b)}" stroke="#6c4cf0" stroke-width="2.5" stroke-dasharray="6 4"/>`;
      (o.points || []).forEach(p => { s += `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="5" fill="#e4572e"/>`; });
      return s + '</svg>';
    },
  };

  // ----------------------------------------------------------- writing
  KS.checkWriting = function (text, type, minWords) {
    const out = [];
    const t = (text || '').trim();
    const words = t ? t.split(/\s+/).filter(w => /[A-Za-z0-9]/.test(w)) : [];
    const wc = words.length;
    out.push(wc >= minWords
      ? { ok: true, msg: `Length: ${wc} words. You hit the goal of ${minWords}.` }
      : { ok: false, msg: `Length: ${wc} words. Aim for at least ${minWords}. Add a detail or an example.` });
    if (!wc) return out;
    const sentences = t.replace(/([.!?])(["”']?)\s+(?=(.))/g, (m, p, q, nx) => p + q + (q && /[a-z]/.test(nx) ? ' ' : '\n')).split(/\n+/).map(s => s.trim()).filter(s => /[A-Za-z]/.test(s));
    const lowerStarts = sentences.filter(s => /^["“']?[a-z]/.test(s));
    out.push(lowerStarts.length
      ? { ok: false, msg: `Capital letters: ${lowerStarts.length} sentence${lowerStarts.length > 1 ? 's start' : ' starts'} with a lowercase letter: "${lowerStarts[0].slice(0, 40)}..."` }
      : { ok: true, msg: 'Capital letters: every sentence starts with one.' });
    if (/(^|\s)i(\s|'|’|,|\.|$)/.test(t)) out.push({ ok: false, msg: 'The word "I" should always be a capital letter.' });
    if (!/[.!?]["”']?\s*$/.test(t)) out.push({ ok: false, msg: 'End punctuation: your last sentence needs a period, question mark, or exclamation point.' });
    const long = sentences.filter(s => s.split(/\s+/).length > 32);
    out.push(long.length
      ? { ok: false, msg: `Run-on check: one sentence has ${long[0].split(/\s+/).length} words. Try splitting it into two: "${long[0].slice(0, 50)}..."` }
      : { ok: true, msg: 'Run-on check: your sentences are a good length.' });
    const starts = {};
    sentences.forEach(s => { const w = (s.match(/[A-Za-z']+/) || [''])[0].toLowerCase(); if (w) starts[w] = (starts[w] || 0) + 1; });
    const rep = Object.keys(starts).filter(k => starts[k] >= 3 && sentences.length >= 4);
    if (rep.length) out.push({ ok: false, msg: `Variety: ${starts[rep[0]]} sentences start with "${rep[0]}". Start some sentences differently.` });
    const lower = ' ' + t.toLowerCase().replace(/[^a-z' ]/g, ' ') + ' ';
    const weak = ['very', 'really', 'good', 'bad', 'nice', 'stuff', 'things', 'a lot', 'got', 'awesome'];
    const used = weak.filter(w => (lower.split(' ' + w + ' ').length - 1) >= 2);
    if (used.length) out.push({ ok: false, msg: `Word choice: you used "${used[0]}" more than once. Try a stronger, more exact word.` });
    else out.push({ ok: true, msg: 'Word choice: no overused words.' });
    const has = re => re.test(t.toLowerCase());
    if (type === 'argument') {
      out.push(has(/\b(should|i think|i believe|in my opinion|must|best)\b/) ? { ok: true, msg: 'Claim: you stated your opinion.' } : { ok: false, msg: 'Claim: say your opinion clearly, like "I believe..." or "Schools should..."' });
      out.push(has(/\b(because|since|so that|this means)\b/) ? { ok: true, msg: 'Reasons: you explained why.' } : { ok: false, msg: 'Reasons: use "because" to give a reason for your claim.' });
      out.push(has(/\b(for example|for instance|such as|one time|studies|research)\b/) ? { ok: true, msg: 'Evidence: you backed it up with an example.' } : { ok: false, msg: 'Evidence: add "For example, ..." to support a reason.' });
    } else if (type === 'informative') {
      out.push(has(/\b(first|second|also|another|in addition|next|finally|for example|however|because)\b/) ? { ok: true, msg: 'Transitions: you connected your ideas.' } : { ok: false, msg: 'Transitions: link ideas with words like "First," "Also," "In addition," "Finally."' });
      out.push(sentences.length >= 4 ? { ok: true, msg: 'Facts: you included several details.' } : { ok: false, msg: 'Facts: add more details or facts about your topic.' });
    } else if (type === 'narrative') {
      out.push(has(/\b(then|after|later|suddenly|finally|when|before|next|meanwhile)\b/) ? { ok: true, msg: 'Order: time words show what happened when.' } : { ok: false, msg: 'Order: use time words like "Suddenly," "Later," or "Finally."' });
      out.push(/["“”]/.test(t) ? { ok: true, msg: 'Dialogue: your characters talk. Nice.' } : { ok: false, msg: 'Dialogue: add a line where a character speaks, in quotation marks.' });
      out.push(has(/\b(felt|heart|nervous|excited|scared|proud|happy|sad|smiled|shook|whispered)\b/) ? { ok: true, msg: 'Feelings: you showed how a character feels.' } : { ok: false, msg: 'Feelings: show how your character feels (heart pounding, hands shaking...).' });
    }
    if (wc > 110 && !/\n\s*\n|\n/.test(t)) out.push({ ok: false, msg: 'Paragraphs: this is long. Start a new paragraph when you move to a new idea.' });
    return out;
  };

  // --------------------------------------------------------------- state
  let C = null, S = null, KEY = '';
  const app = () => document.getElementById('app');
  function fresh() {
    return { v: 1, stars: 0, streak: { n: 0, last: null }, days: {}, areas: {}, review: {}, seen: {}, writing: [],
      lists: { spelling: [], vocab: [], sight: [], updated: null }, session: null, draft: null, created: U.today() };
  }
  function load() {
    try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v === 1) return Object.assign(fresh(), s); } catch (e) { /* ignore */ }
    return fresh();
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage full or private mode */ } }
  KS.state = () => S;
  function day() { const t = U.today(); return S.days[t] || (S.days[t] = { sec: 0, q: 0, c: 0, done: false, rounds: 0 }); }
  function areaStat(k) { return S.areas[k] || (S.areas[k] = { n: 0, c: 0, r: [], last: null }); }
  function recentAcc(k) { const a = S.areas[k]; return a && a.r.length ? a.r.reduce((x, y) => x + y, 0) / a.r.length : null; }
  function record(areaKey, ok, sec) {
    const a = areaStat(areaKey);
    a.n++; if (ok) a.c++;
    a.r.push(ok ? 1 : 0); if (a.r.length > 20) a.r.shift();
    a.last = U.today();
    const d = day(); d.q++; if (ok) d.c++;
    d.sec += Math.max(0, Math.min(sec, 180));
    if (ok) addStars(1);
    save();
  }
  let newSticker = false;
  function stickerCount() { return Math.min(C.stickers.length, Math.floor(S.stars / (C.stickerEvery || 25))); }
  function addStars(n) { const before = stickerCount(); S.stars += n; if (stickerCount() > before) newSticker = true; }
  function reviewMark(id, ok) {
    if (!id) return;
    const r = S.review[id];
    if (!ok) S.review[id] = { box: 1, due: U.addDays(U.today(), 1) };
    else if (r) {
      if (r.box >= 3) delete S.review[id];
      else { r.box++; r.due = U.addDays(U.today(), r.box === 2 ? 3 : 7); }
    }
  }

  // --------------------------------------------------------------- areas
  function areaByKey(k) { return C.areas.find(a => a.key === k); }
  function resolveGen(path) { const p = path.split('.'); let o = KS.gen; for (const k of p) { o = o && o[k]; } return typeof o === 'function' ? o : null; }
  function bankPool(a) {
    const b = KS.bank[a.bank] || [];
    return b.filter(it => it.skill === a.skill && (!a.sub || it.sub === a.sub));
  }
  function listFresh() { return S.lists.updated && U.dayDiff(S.lists.updated, U.today()) <= 10; }
  function avail(a) {
    switch (a.type) {
      case 'gen': return !!resolveGen(a.gen);
      case 'bank': return bankPool(a).length >= 4;
      case 'passage': return !!(KS.bank.reading && KS.bank.reading.length);
      case 'writing': return !!(KS.bank.writing && KS.bank.writing.length);
      case 'spelling': return !!(KS.bank.spelling && KS.bank.spelling.length);
      case 'spell-list': return S.lists.spelling.length >= 3;
      case 'vocab-list': return S.lists.vocab.length >= 4;
      default: return false;
    }
  }
  function areaWeight(a) {
    const acc = recentAcc(a.key);
    const st = S.areas[a.key];
    const days = st && st.last ? U.dayDiff(st.last, U.today()) : 7;
    const stale = Math.min(2, 1 + days / 7);
    const need = 0.5 + (1 - (acc === null ? 0.6 : acc)) * 2;
    return (a.weight || 1) * need * stale;
  }
  function chooseArea(spec, used) {
    if (spec[0] === '@') { const a = areaByKey(spec.slice(1)); return a && avail(a) ? a : null; }
    const cands = C.areas.filter(a => a.subject === spec && avail(a) && !used.has(a.key));
    if (!cands.length) return null;
    const list = cands.find(a => (a.type === 'spell-list' || a.type === 'vocab-list') && listFresh() &&
      !(S.areas[a.key] && S.areas[a.key].last === U.today()));
    if (list) return list;
    return U.weighted(cands, areaWeight);
  }
  function buildToday() {
    const used = new Set(), rounds = [];
    const dayIdx = Math.floor(new Date(U.today() + 'T12:00:00').getTime() / 864e5);
    C.today.plan.forEach(slot => {
      const opts = slot.split('|');
      let a = null;
      for (let k = 0; k < opts.length && !a; k++) a = chooseArea(opts[(dayIdx + k) % opts.length], used);
      if (a) { used.add(a.key); rounds.push(a.key); }
    });
    return rounds;
  }

  // ---------------------------------------------------------- item makers
  function bankToItem(it) {
    return { kind: 'mc', q: it.q, choices: it.choices, answer: it.answer, explain: it.explain, id: it.id };
  }
  function pickBank(a, n) {
    const pool = bankPool(a), t = U.today();
    const due = U.shuffle(pool.filter(it => S.review[it.id] && S.review[it.id].due <= t)).slice(0, 2);
    const rest = pool.filter(it => due.indexOf(it) < 0);
    rest.sort((x, y) => (S.seen[x.id] || '') < (S.seen[y.id] || '') ? -1 : (S.seen[x.id] || '') > (S.seen[y.id] || '') ? 1 : 0);
    const fresh = U.sample(rest.slice(0, Math.max(n * 3, Math.ceil(rest.length / 3))), n - due.length);
    return U.shuffle(due.concat(fresh)).map(bankToItem);
  }
  function makeGenItems(a, n) {
    const f = resolveGen(a.gen); const out = [], keys = new Set();
    let guard = 0;
    while (out.length < n && guard++ < n * 10) {
      const it = f(S);
      if (!it) continue;
      const k = it.q + '|' + (it.choices || []).join(',');
      if (keys.has(k)) continue;
      keys.add(k); it.gen = a.gen; out.push(it);
    }
    return out;
  }
  function pickPassage() {
    const ps = KS.bank.reading.slice().sort((x, y) => (S.seen[x.id] || '') < (S.seen[y.id] || '') ? -1 : 1);
    const p = U.pick(ps.slice(0, Math.min(3, ps.length)));
    S.seen[p.id] = U.today();
    return p;
  }
  function spellingItems(n) {
    const pats = KS.bank.spelling;
    S.spellPat = S.spellPat || {};
    const minN = Math.min.apply(null, pats.map(p => S.spellPat[p.pattern] || 0));
    const p = U.pick(pats.filter(x => (S.spellPat[x.pattern] || 0) === minN));
    S.spellPat[p.pattern] = (S.spellPat[p.pattern] || 0) + 1;
    const missed = p.words.filter(w => S.review['sp:' + w.w]);
    const ws = missed.slice(0, 2).concat(U.sample(p.words.filter(w => missed.indexOf(w) < 0), n));
    return ws.slice(0, n).map(w => ({ kind: 'spell', word: w.w, sentence: w.s, id: 'sp:' + w.w, pattern: p.pattern }));
  }
  function listSpellItems(n) {
    const words = S.lists.spelling;
    const missed = words.filter(w => S.review['sl:' + w.toLowerCase()]);
    const ws = U.shuffle(missed).concat(U.shuffle(words.filter(w => missed.indexOf(w) < 0))).slice(0, Math.max(n, Math.min(words.length, 8)));
    return ws.map(w => ({ kind: 'spell', word: w, sentence: '', id: 'sl:' + w.toLowerCase(), pattern: 'This week’s list' }));
  }
  function vocabItems(n) {
    const v = S.lists.vocab;
    return U.sample(v, Math.min(n, v.length)).map(e => {
      const others = U.sample(v.filter(x => x !== e), 3);
      if (Math.random() < 0.6) {
        return { kind: 'mc', q: `What does “${e.w}” mean?`, choices: [e.d].concat(others.map(o => o.d)), answer: 0,
          explain: `“${e.w}” means: ${e.d}.`, id: 'vl:' + e.w.toLowerCase() };
      }
      return { kind: 'mc', q: `Which word means “${e.d}”?`, choices: [e.w].concat(others.map(o => o.w)), answer: 0,
        explain: `“${e.w}” means: ${e.d}.`, id: 'vl:' + e.w.toLowerCase() };
    });
  }
  function writingItem() {
    const used = {};
    S.writing.slice(-12).forEach(w => { used[w.id] = 1; });
    const types = C.writingTypes || ['argument', 'informative', 'narrative'];
    const lastType = S.writing.length ? S.writing[S.writing.length - 1].type : null;
    const wantType = U.pick(types.filter(t => t !== lastType).length ? types.filter(t => t !== lastType) : types);
    let pool = KS.bank.writing.filter(w => w.type === wantType && !used[w.id]);
    if (!pool.length) pool = KS.bank.writing.filter(w => !used[w.id]);
    if (!pool.length) pool = KS.bank.writing;
    const p = U.pick(pool);
    return { kind: 'write', id: p.id, type: p.type, prompt: p.prompt, tips: p.tips || [], minWords: p.minWords || 80 };
  }
  function makeItems(a, n) {
    switch (a.type) {
      case 'gen': return makeGenItems(a, n);
      case 'bank': return pickBank(a, n);
      case 'writing': return [writingItem()];
      case 'spelling': return spellingItems(n);
      case 'spell-list': return listSpellItems(n);
      case 'vocab-list': return vocabItems(n);
      default: return [];
    }
  }

  // ------------------------------------------------------------ run state
  let RUN = null;
  function startToday() {
    if (!S.session || S.session.date !== U.today()) S.session = { date: U.today(), rounds: buildToday(), idx: 0 };
    save();
    RUN = { mode: 'today' };
    nextRound();
  }
  function startFree(areaKey) { RUN = { mode: 'free' }; beginRound(areaByKey(areaKey)); }
  function nextRound() {
    const s = S.session;
    if (!s || s.idx >= s.rounds.length) { finishDay(); return; }
    const a = areaByKey(s.rounds[s.idx]);
    if (!a || !avail(a)) { s.idx++; save(); nextRound(); return; }
    beginRound(a);
  }
  function beginRound(a) {
    const n = a.n || C.perRound || 5;
    const round = { area: a, i: 0, results: [], base: n };
    if (a.type === 'passage') {
      const p = pickPassage();
      round.passage = p;
      round.items = p.questions.map(q => Object.assign({}, q, { kind: q.type === 'evidence' ? 'evidence' : 'mc', id: p.id + ':' + p.questions.indexOf(q) }));
    } else {
      round.items = makeItems(a, n);
    }
    if (!round.items.length) {
      if (RUN.mode === 'today') { S.session.idx++; save(); nextRound(); } else renderHome();
      return;
    }
    RUN.round = round;
    renderRoundIntro();
  }
  function finishRound() {
    const r = RUN.round;
    const ok = r.results.filter(x => x).length;
    addStars(2);
    if (RUN.mode === 'today') { S.session.idx++; day().rounds++; }
    save();
    renderRoundEnd(ok, r.results.length);
  }
  function finishDay() {
    const d = day();
    const first = !d.done;
    if (first) {
      d.done = true;
      const t = U.today(), y = U.addDays(t, -1);
      if (S.streak.last === y) S.streak.n++;
      else if (S.streak.last !== t) S.streak.n = 1;
      S.streak.last = t;
      addStars(10);
      save();
    }
    renderDayDone(first);
  }

  // ------------------------------------------------------------- render
  function set(html) { app().innerHTML = html; window.scrollTo(0, 0); }
  function subjectOf(k) { return (C.subjects.find(s => s.key === k) || { label: k, icon: '' }); }
  function cheer() { return U.pick(C.young ? ['Yes!', 'Great job!', 'You got it!', 'Awesome!', 'Super!', 'Way to go!'] : ['Nice!', 'Correct!', 'Got it!', 'Yes!', 'Well done!', 'Exactly!']); }
  function stickersHtml() {
    const n = stickerCount();
    const next = (n + 1) * (C.stickerEvery || 25) - S.stars;
    return `<div class="collection">${C.stickers.slice(0, n).join('') || '<span class="small muted" style="letter-spacing:0">No stickers yet</span>'}</div>` +
      (n < C.stickers.length ? `<div class="small muted">${next} more ⭐ for the next sticker</div>` : '');
  }
  function sessionPreview() {
    if (!S.session || S.session.date !== U.today()) return null;
    return S.session;
  }

  function renderHome() {
    KS.hush();
    RUN = null;
    const d = S.days[U.today()];
    const sess = sessionPreview();
    let big;
    if (d && d.done) {
      big = `<button class="bigbtn done" data-act="today">✅ Today’s practice is done!<span class="sub">Want more? Pick anything below, or tap to play another round set.</span></button>`;
    } else if (sess && sess.idx > 0) {
      big = `<button class="bigbtn" data-act="today">▶ Keep going: round ${sess.idx + 1} of ${sess.rounds.length}<span class="sub">You’re almost there</span></button>`;
    } else {
      big = `<button class="bigbtn" data-act="today">${C.young ? '▶ Play!' : `▶ Start today’s ${C.minutes} minutes`}<span class="sub">${C.young ? 'Letters, numbers and more' : 'A few short rounds picked just for you'}</span></button>`;
    }
    const subjects = C.subjects.map(s => {
      const areas = C.areas.filter(a => a.subject === s.key && avail(a));
      if (!areas.length) return '';
      if (C.young) {
        return `<button class="tile" data-act="subject" data-s="${s.key}"><span class="ic">${s.icon}</span><span class="nm">${s.label}</span></button>`;
      }
      return `<h3>${s.icon} ${s.label}</h3><div class="tiles">` + areas.map(a => {
        const acc = recentAcc(a.key);
        return `<button class="tile" data-act="free" data-k="${a.key}"><span class="ic">${a.icon || s.icon}</span><span class="nm">${U.esc(a.label)}</span>` +
          (acc === null ? `<span class="small muted">Not started</span>` : `<div class="meter"><i style="width:${Math.round(acc * 100)}%"></i></div>`) + `</button>`;
      }).join('') + `</div>`;
    }).join('');
    set(`
      <div class="topbar">
        <span class="pill">🔥 ${S.streak.n} day${S.streak.n === 1 ? '' : 's'}</span>
        <span class="pill">⭐ ${S.stars}</span>
        <span class="spacer"></span>
        <button class="iconbtn" data-act="progress" aria-label="My progress">📊</button>
      </div>
      <div class="hello"><span class="face">${C.face}</span><div><h1>Hi ${U.esc(C.name)}!</h1><div class="muted">${greeting()}</div></div></div>
      ${big}
      ${C.young ? `<div class="tiles">${subjects}</div>` : `<h2>Practice anything</h2>${subjects}`}
      <div class="card"><h3>My sticker collection</h3>${stickersHtml()}</div>
      <div class="links"><button class="btn ghost holdbtn" data-hold="grownups"><span class="fill"></span>🔒 Grown-ups (press and hold)</button></div>
    `);
  }
  function greeting() {
    const d = S.days[U.today()];
    if (d && d.done) return 'You did your practice today. Nice work!';
    if (S.streak.n >= 2 && S.streak.last === U.addDays(U.today(), -1)) return `Keep your ${S.streak.n}-day streak going!`;
    return U.pick(['Ready to get a little stronger today?', 'Let’s do this!', 'Small steps every day add up.']);
  }
  function renderSubject(sk) {
    const s = subjectOf(sk);
    const areas = C.areas.filter(a => a.subject === sk && avail(a));
    set(`<div class="topbar"><button class="iconbtn" data-act="home">←</button><h2 style="margin:0">${s.icon} ${s.label}</h2></div>
      <div class="tiles">${areas.map(a => `<button class="tile" data-act="free" data-k="${a.key}"><span class="ic" style="font-size:44px">${a.icon || s.icon}</span><span class="nm">${U.esc(a.label)}</span></button>`).join('')}</div>`);
    KS.say(s.label);
  }
  function renderRoundIntro() {
    const r = RUN.round, a = r.area, s = subjectOf(a.subject);
    const sess = S.session;
    const label = RUN.mode === 'today' && sess ? `Round ${sess.idx + 1} of ${sess.rounds.length}` : 'Practice';
    const what = a.type === 'passage' ? `Read “${U.esc(r.passage.title)}” and answer ${r.items.length} questions.`
      : a.type === 'writing' ? 'One writing prompt. Take your time.'
        : (r.items[0].kind === 'spell' ? `Listen and spell ${r.items.length} words.` : `${r.items.length} questions.`);
    set(`<div class="topbar"><button class="iconbtn" data-act="home">✕</button><span class="roundlabel" style="margin:0">${label}</span></div>
      <div class="card celebrate"><div class="huge">${a.icon || s.icon}</div><h1>${U.esc(a.label)}</h1>
      <p class="muted">${C.young ? '' : what}</p><button class="btn" data-act="go">${C.young ? 'Go! ▶' : 'Start →'}</button></div>`);
  }
  function dots() {
    const r = RUN.round;
    return `<div class="progressdots">${r.items.map((it, i) => `<i class="${i < r.results.length ? (r.results[i] ? 'ok' : 'no') : (i === r.i ? 'on' : '')}"></i>`).join('')}</div>`;
  }
  function passageHtml(p, tap) {
    const poem = p.genre === 'poem';
    return `<div class="card passage ${poem ? 'poem' : ''} ${tap ? 'tapmode' : ''}" id="psg">
      <div class="row"><h3 style="margin:0">${U.esc(p.title)}</h3><span class="spacer"></span><button class="btn ghost listen" data-act="listen">🔊 Listen</button></div>
      <div style="height:10px"></div>
      ${p.paragraphs.map((para, pi) => `<p>${para.map((s, si) => `<span class="s" data-sid="${pi}.${si}">${U.esc(s)}</span>`).join(' ')}</p>`).join('')}
    </div>`;
  }
  function renderItem() {
    const r = RUN.round, it = r.items[r.i];
    it._t0 = Date.now();
    RUN.answered = false; RUN.input = ''; RUN.sel = null; RUN.tries = 0; RUN.lock = false;
    const head = `<div class="topbar"><button class="iconbtn" data-act="home" aria-label="Quit">✕</button>${dots()}</div>
      <div class="roundlabel">${U.esc(r.area.label)}${it.sub ? ' · ' + U.esc(it.sub) : ''}</div>`;
    const qh = it.html ? it.q : U.esc(it.q);
    const vis = it.visual ? `<div class="visual">${it.visual}</div>` : '';
    let body = '';
    if (it.kind === 'tap') { renderTap(it, head); return; }
    if (r.passage) body += passageHtml(r.passage, it.kind === 'evidence');
    if (it.kind === 'mc') {
      it._order = it.keepOrder ? it.choices.map((c, i) => i) : U.shuffle(it.choices.map((c, i) => i));
      body += `<div class="qtext">${qh}</div>${vis}<div class="choices">` +
        it._order.map((ci, k) => `<button class="choice" data-act="mc" data-ci="${ci}"><span class="key">${'ABCDEF'[k]}</span><span>${it.html ? it.choices[ci] : U.esc(it.choices[ci])}</span></button>`).join('') +
        `</div><div id="fb"></div>`;
    } else if (it.kind === 'num') {
      body += `<div class="qtext">${qh}</div>${vis}
        <div class="answerbox" id="ab"><span class="ph">Type your answer</span></div>
        <div class="pad">${['7', '8', '9', '⌫', '4', '5', '6', '−', '1', '2', '3', '/', '0', '.', it.mixed ? '␣' : '', 'C'].map(k => k ? `<button class="${/[0-9.]/.test(k) ? '' : 'fn'}" data-act="key" data-k="${k}">${k === '␣' ? 'space' : k}</button>` : '<span></span>').join('')}</div>
        <div style="height:12px"></div><button class="btn wide" data-act="numcheck" id="chk">Check</button><div id="fb"></div>`;
    } else if (it.kind === 'evidence') {
      body += `<div class="qtext">${qh}</div><p class="small muted">Tap a sentence in the passage above, then press Check.</p>
        <button class="btn wide" data-act="evcheck" id="chk" disabled>Check</button><div id="fb"></div>`;
    } else if (it.kind === 'spell') {
      body += `<div class="qtext">Listen, then type the word.${it.pattern ? `<div class="small muted">${U.esc(it.pattern)}</div>` : ''}</div>
        <div class="row" style="margin-bottom:12px"><button class="btn ghost" data-act="sayword">🔊 Hear it again</button></div>
        <input class="spell" id="sp" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="done">
        <div style="height:12px"></div><button class="btn wide" data-act="spellcheck" id="chk">Check</button><div id="fb"></div>`;
    } else if (it.kind === 'write') {
      const draft = S.draft && S.draft.id === it.id ? S.draft.text : '';
      body += `<div class="card"><div class="qtext">${U.esc(it.prompt)}</div>
        <ul class="tips">${it.tips.map(t => `<li>${U.esc(t)}</li>`).join('')}</ul></div>
        <textarea class="write" id="wr" placeholder="Start writing here...">${U.esc(draft)}</textarea>
        <div class="row" style="margin-top:10px"><span class="wc" id="wc"></span><span class="spacer"></span>
        <button class="btn ghost" data-act="wcheck">Check my writing</button><button class="btn" data-act="wsave">I’m done</button></div><div id="fb"></div>`;
    }
    set(head + body);
    if (it.kind === 'spell') { sayWord(it); setTimeout(() => { const el = document.getElementById('sp'); if (el) el.focus(); }, 50); }
    if (it.kind === 'write') { updateWc(); }
  }
  function sayWord(it) { KS.say(it.sentence ? `${it.word}. ${it.sentence} ${it.word}.` : `${it.word}. ... ${it.word}.`); }
  function updateWc() {
    const el = document.getElementById('wr'), wc = document.getElementById('wc');
    if (!el || !wc) return;
    const n = el.value.trim() ? el.value.trim().split(/\s+/).length : 0;
    const it = RUN.round.items[RUN.round.i];
    wc.textContent = `${n} / ${it.minWords} words`;
  }
  function feedback(ok, it, answerHtml, note) {
    const fb = document.getElementById('fb');
    const ex = it.explain ? (it.html ? it.explain : U.esc(it.explain)) : '';
    fb.innerHTML = `<div class="feedback ${ok ? 'ok' : 'no'}"><b class="title">${ok ? '✅ ' + cheer() + ' +1 ⭐' : '❌ Not quite'}</b>` +
      (!ok && answerHtml ? `The answer is <b>${answerHtml}</b>.<br>` : '') + (note ? `<b>${note}</b><br>` : '') +
      (ex ? `<span class="${ok ? 'small' : ''}">${ex}</span>` : '') + `</div>
      <div class="nextbar"><button class="btn wide" data-act="next">Next →</button></div>`;
    const chk = document.getElementById('chk'); if (chk) chk.classList.add('hidden');
    fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  function grade(ok) {
    const r = RUN.round, it = r.items[r.i];
    RUN.answered = true;
    r.results.push(ok);
    record(r.area.key, ok, (Date.now() - it._t0) / 1000);
    if (it.id) { reviewMark(it.id, ok); S.seen[it.id] = U.today(); save(); }
    // One more like it after a miss on generated practice.
    if (!ok && it.gen && !C.young && r.items.length < r.base + 2) {
      const f = resolveGen(it.gen); const extra = f && f(S);
      if (extra) { extra.gen = it.gen; extra.sub = 'One more like that'; r.items.push(extra); }
    }
  }
  function advance() {
    KS.hush();
    const r = RUN.round;
    r.i++;
    if (r.i >= r.items.length) finishRound(); else renderItem();
  }

  // young (Henry) tap items
  function renderTap(it, head) {
    const n = it.choices.length;
    set(`${head}
      <div class="kcenter"><button class="speakbtn" data-act="ksay" aria-label="Say it again">🔊</button></div>
      <div class="qtext">${it.html ? it.q : U.esc(it.q)}</div>
      ${it.pic ? `<div class="kpic ${it.picRows ? 'rows' : ''}">${it.pic}</div>` : ''}
      <div class="ktiles ${n === 3 ? 'three' : ''}">${it.choices.map((c, i) => ({ c, i })).sort(() => it.keepOrder ? 0 : Math.random() - 0.5)
        .map(o => `<button class="ktile ${it.tileClass || ''}" data-act="tap" data-ci="${o.i}">${o.c}</button>`).join('')}</div>`);
    KS.say(it.say || it.q);
  }
  function tapAnswer(btn) {
    if (RUN.lock || RUN.answered) return;
    const r = RUN.round, it = r.items[r.i];
    const ci = +btn.dataset.ci;
    if (ci === it.answer) {
      btn.classList.add('ok');
      RUN.lock = true;
      if (RUN.tries === 0) grade(true); else { /* already graded wrong */ }
      KS.say(cheer());
      setTimeout(advance, 1300);
    } else {
      btn.classList.add('no');
      setTimeout(() => btn.classList.remove('no'), 450);
      RUN.tries++;
      if (RUN.tries === 1) { grade(false); RUN.answered = false; KS.say('Try again! ' + (it.retry || '')); }
      else {
        RUN.lock = true;
        const good = app().querySelector(`.ktile[data-ci="${it.answer}"]`);
        if (good) good.classList.add('hint');
        KS.say('It’s this one! ' + (it.answerSay || ''));
        setTimeout(advance, 2600);
      }
    }
  }

  function renderRoundEnd(ok, total) {
    const isToday = RUN.mode === 'today';
    const more = isToday && S.session.idx < S.session.rounds.length;
    const stickerMsg = newSticker ? `<p><b>🎉 New sticker unlocked: ${C.stickers[stickerCount() - 1]}</b></p>` : '';
    newSticker = false;
    const r = RUN.round;
    const msg = r.area.type === 'writing' ? 'Writing saved to your journal.' : C.young ? 'Great job!' : `${ok} of ${total} right`;
    set(`<div class="card celebrate"><div class="huge">${ok === total ? '🌟' : ok >= total / 2 ? '👍' : '💪'}</div>
      <h1>${ok === total ? 'Perfect round!' : ok >= total / 2 ? 'Round done!' : 'Good effort!'}</h1>
      <p class="muted">${msg} · +2 ⭐ bonus</p>${stickerMsg}
      ${more ? `<button class="btn" data-act="nextround">Next round →</button>` : isToday ? `<button class="btn" data-act="nextround">Finish →</button>` :
        `<div class="row" style="justify-content:center"><button class="btn" data-act="again">Another round</button><button class="btn ghost" data-act="home">Home</button></div>`}
    </div>`);
    if (C.young) KS.say(ok === total ? 'Perfect! You got them all!' : 'Great job! Round done!');
  }
  function renderDayDone(first) {
    const d = day();
    const min = Math.max(1, Math.round(d.sec / 60));
    const stickerMsg = newSticker ? `<p><b>🎉 New sticker unlocked: ${C.stickers[stickerCount() - 1]}</b></p>` : '';
    newSticker = false;
    set(`<div class="card celebrate"><div class="huge">🏆</div>
      <h1>${first ? 'You finished today’s practice!' : 'All done for today!'}</h1>
      <p>🔥 Streak: <b>${S.streak.n} day${S.streak.n === 1 ? '' : 's'}</b> · ⏱ ${min} min ${C.young ? '' : `· ${d.c}/${d.q} right`}${first ? ' · +10 ⭐' : ''}</p>${stickerMsg}
      <p class="muted">${C.young ? '' : 'Come back tomorrow to keep your streak going.'}</p>
      <button class="btn" data-act="home">Home</button></div>`);
    if (C.young) KS.say(`Hooray, ${C.name}! You finished! See you tomorrow!`);
  }

  // ------------------------------------------------------------ progress
  function weekBars() {
    const t = U.today(); let html = '<div class="bars">'; let max = 1;
    const days = [];
    for (let i = 6; i >= 0; i--) { const ds = U.addDays(t, -i); const d = S.days[ds]; const m = d ? Math.round(d.sec / 60) : 0; days.push([ds, m, d && d.done]); max = Math.max(max, m); }
    days.forEach(([ds, m, done]) => {
      const wd = new Date(ds + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' });
      html += `<div class="b"><span>${m ? m + 'm' : ''}</span><i style="height:${Math.round(m / max * 100)}%"></i><span>${done ? '✅' : ''}${wd}</span></div>`;
    });
    return html + '</div>';
  }
  function areaRows(showNums) {
    return C.subjects.map(s => {
      const areas = C.areas.filter(a => a.subject === s.key && avail(a));
      if (!areas.length) return '';
      return `<h3 style="margin-top:14px">${s.icon} ${s.label}</h3>` + areas.map(a => {
        const st = S.areas[a.key]; const acc = recentAcc(a.key);
        const tag = acc === null ? '<span class="muted small">Not started</span>' : acc >= 0.85 ? '💪 Strong' : acc >= 0.65 ? '📈 Getting there' : '🎯 Keep practicing';
        return `<div style="margin:8px 0"><div class="row"><span>${a.icon || ''} ${U.esc(a.label)}</span><span class="spacer"></span><span class="small">${tag}${showNums && st ? ` · ${Math.round(acc * 100)}% of last ${st.r.length}` : ''}</span></div>
          <div class="meter"><i style="width:${acc === null ? 0 : Math.round(acc * 100)}%"></i></div></div>`;
      }).join('');
    }).join('');
  }
  function journalHtml(limit) {
    if (!S.writing.length) return '<p class="muted">No writing yet.</p>';
    return S.writing.slice().reverse().slice(0, limit || 50).map(w => `<div class="journal-entry"><b>${w.date}</b> · ${U.esc(w.type)} · ${w.words} words<br><span class="muted">${U.esc(w.prompt)}</span><br><br>${U.esc(w.text)}</div>`).join('');
  }
  function renderProgress() {
    let wkMin = 0, wkQ = 0;
    for (let i = 0; i < 7; i++) { const d = S.days[U.addDays(U.today(), -i)]; if (d) { wkMin += d.sec / 60; wkQ += d.q; } }
    set(`<div class="topbar"><button class="iconbtn" data-act="home">←</button><h2 style="margin:0">My progress</h2></div>
      <div class="row" style="margin-bottom:14px"><span class="pill">🔥 ${S.streak.n}-day streak</span><span class="pill">⭐ ${S.stars} stars</span><span class="pill">⏱ ${Math.round(wkMin)} min this week</span><span class="pill">❓ ${wkQ} questions this week</span></div>
      <div class="card"><h3>This week</h3>${weekBars()}</div>
      <div class="card"><h3>My skills</h3><p class="small muted">Based on your last 20 answers in each skill.</p>${areaRows(false)}</div>
      ${C.young ? '' : `<div class="card"><h3>My writing journal</h3>${journalHtml(10)}</div>`}
      <div class="card"><h3>My sticker collection</h3>${stickersHtml()}</div>`);
  }
  function renderGrownups(confirmReset) {
    const L = S.lists;
    const rows = C.areas.filter(avail).map(a => {
      const st = S.areas[a.key]; const acc = recentAcc(a.key);
      return `<tr><td>${a.icon || ''} ${U.esc(a.label)}</td><td>${st ? st.n : 0}</td><td>${st && st.n ? Math.round(st.c / st.n * 100) + '%' : '–'}</td><td>${acc === null ? '–' : Math.round(acc * 100) + '%'}</td><td>${st && st.last ? st.last.slice(5) : '–'}</td></tr>`;
    }).join('');
    let days14 = '';
    for (let i = 13; i >= 0; i--) { const ds = U.addDays(U.today(), -i); const d = S.days[ds]; days14 += `<tr><td>${ds.slice(5)}</td><td>${d ? Math.round(d.sec / 60) : 0} min</td><td>${d ? d.c + '/' + d.q : '–'}</td><td>${d && d.done ? '✅' : ''}</td></tr>`; }
    set(`<div class="topbar"><button class="iconbtn" data-act="home">←</button><h2 style="margin:0">Grown-ups</h2></div>
      <div class="card"><p class="small muted">Progress is saved on this device only. Lists you add here go into ${U.esc(C.name)}’s daily practice for the next 10 days.</p>
      ${C.young ? `<h3>Sight words from school</h3><p class="small muted">One word per line.</p>
        <textarea class="list" id="l-sight" placeholder="the\nsee\nlike">${U.esc(L.sight.join('\n'))}</textarea>` : `
        <h3>This week’s spelling words</h3><p class="small muted">One word per line.</p>
        <textarea class="list" id="l-spell" placeholder="thirsty\nharbor\nsquirrel">${U.esc(L.spelling.join('\n'))}</textarea>
        <h3 style="margin-top:14px">This week’s vocabulary</h3><p class="small muted">One per line: word - meaning (at least 4).</p>
        <textarea class="list" id="l-vocab" placeholder="migrate - to move from one place to another">${U.esc(L.vocab.map(v => v.w + ' - ' + v.d).join('\n'))}</textarea>`}
      <div style="height:10px"></div><button class="btn" data-act="savelists">Save lists</button> <span id="savedmsg" class="small muted"></span></div>
      <div class="card"><h3>Skills</h3><table class="stats"><tr><th>Skill</th><th>Tries</th><th>All-time</th><th>Last 20</th><th>Last</th></tr>${rows}</table></div>
      <div class="card"><h3>Last 14 days</h3><table class="stats"><tr><th>Day</th><th>Time</th><th>Right</th><th>Done</th></tr>${days14}</table></div>
      ${C.young ? '' : `<div class="card"><h3>Writing journal</h3>${journalHtml(100)}</div>`}
      <div class="card"><button class="btn ghost" data-act="reset">${confirmReset ? '⚠️ Tap again to erase ALL progress' : 'Reset progress'}</button></div>`);
  }

  // ------------------------------------------------------------- events
  const ACT = {
    home() { renderHome(); },
    today() {
      const d = S.days[U.today()];
      if (d && d.done && S.session && S.session.idx >= S.session.rounds.length) {
        S.session = { date: U.today(), rounds: buildToday(), idx: 0 }; save();
      }
      startToday();
    },
    free(el) { startFree(el.dataset.k); },
    subject(el) { renderSubject(el.dataset.s); },
    progress() { renderProgress(); },
    go() { renderItem(); },
    next() { advance(); },
    nextround() { nextRound(); },
    again() { beginRound(RUN.round.area); },
    listen() {
      const p = RUN && RUN.round && RUN.round.passage; if (!p) return;
      if ('speechSynthesis' in window && speechSynthesis.speaking) { KS.hush(); return; }
      KS.say(p.title + '. ' + p.paragraphs.map(x => x.join(' ')).join(' '), { rate: 0.95 });
    },
    mc(el) {
      if (RUN.answered) return;
      const r = RUN.round, it = r.items[r.i];
      const ci = +el.dataset.ci, ok = ci === it.answer;
      app().querySelectorAll('.choice').forEach(b => {
        b.disabled = true;
        if (+b.dataset.ci === it.answer) b.classList.add('ok');
      });
      if (!ok) el.classList.add('no');
      grade(ok);
      feedback(ok, it, it.html ? it.choices[it.answer] : U.esc(it.choices[it.answer]));
    },
    key(el) {
      if (RUN.answered) return;
      const k = el.dataset.k;
      let s = RUN.input;
      if (k === '⌫') s = s.slice(0, -1);
      else if (k === 'C') s = '';
      else if (k === '−') s = s.startsWith('-') ? s.slice(1) : '-' + s;
      else if (k === '␣') s = s.endsWith(' ') || !s ? s : s + ' ';
      else if (s.length < 12) s += k;
      RUN.input = s;
      const it = RUN.round.items[RUN.round.i];
      const ab = document.getElementById('ab');
      ab.innerHTML = s ? U.esc(s.replace(/-/g, '−')) + (it.unit ? ` <span class="unit">${U.esc(it.unit)}</span>` : '') : '<span class="ph">Type your answer</span>';
    },
    numcheck() {
      if (RUN.answered) return;
      const it = RUN.round.items[RUN.round.i];
      const got = R.parse(RUN.input);
      if (!got) { const ab = document.getElementById('ab'); ab.style.animation = 'shake .4s'; setTimeout(() => { ab.style.animation = ''; }, 450); return; }
      const targets = [it.ans].concat(it.accept || []).map(R.parse).filter(Boolean);
      const ok = targets.some(t => R.eq(t, got));
      let note = '';
      const m = RUN.input.match(/(\d+)\/(\d+)/);
      if (ok && m && U.gcd(+m[1], +m[2]) > 1) note = `Simplest form: ${it.ansShow || it.ans}`;
      grade(ok);
      feedback(ok, it, it.ansShow || U.esc(String(it.ans).replace(/-/g, '−')), note);
    },
    evcheck() {
      if (RUN.answered || !RUN.sel) return;
      const it = RUN.round.items[RUN.round.i];
      const ok = it.answer.indexOf(RUN.sel) >= 0;
      app().querySelectorAll('.passage .s').forEach(s => {
        if (it.answer.indexOf(s.dataset.sid) >= 0) s.classList.add('ok');
        else if (s.dataset.sid === RUN.sel) s.classList.add('no');
      });
      document.getElementById('psg').classList.remove('tapmode');
      grade(ok);
      feedback(ok, it, ok ? '' : 'the sentence now highlighted in green', '');
    },
    sayword() { sayWord(RUN.round.items[RUN.round.i]); },
    spellcheck() {
      if (RUN.answered) return;
      const it = RUN.round.items[RUN.round.i];
      const el = document.getElementById('sp');
      const norm = x => x.trim().toLowerCase().replace(/[‘’]/g, "'").replace(/[.!?,]$/, '');
      const v = norm(el.value || '');
      if (!v) { el.focus(); return; }
      const ok = v === norm(it.word);
      el.disabled = true;
      el.style.borderColor = ok ? 'var(--good)' : 'var(--bad)';
      grade(ok);
      it.explain = ok ? '' : `You wrote “${v}”.`;
      feedback(ok, it, U.esc(it.word));
    },
    wcheck() {
      const it = RUN.round.items[RUN.round.i];
      const text = document.getElementById('wr').value;
      const checks = KS.checkWriting(text, it.type, it.minWords);
      document.getElementById('fb').innerHTML = `<div class="card"><h3>Writing check</h3><ul class="checks">${checks.map(c => `<li>${c.ok ? '✅' : '💡'} ${U.esc(c.msg)}</li>`).join('')}</ul>
        <p class="small muted">Fix the 💡 items, then press “I’m done.”</p></div>`;
    },
    wsave() {
      if (RUN.answered) return;
      const it = RUN.round.items[RUN.round.i];
      const text = document.getElementById('wr').value.trim();
      const words = text ? text.split(/\s+/).length : 0;
      if (words < Math.ceil(it.minWords * 0.6)) {
        document.getElementById('fb').innerHTML = `<div class="feedback no"><b class="title">Keep going!</b>Write at least ${Math.ceil(it.minWords * 0.6)} words to finish. You have ${words}.</div>`;
        return;
      }
      const checks = KS.checkWriting(text, it.type, it.minWords);
      const passed = checks.filter(c => c.ok).length;
      RUN.answered = true;
      const r = RUN.round;
      r.results.push(true);
      const sec = Math.min(900, (Date.now() - it._t0) / 1000);
      const a = areaStat(r.area.key); a.n++; a.c++; a.r.push(1); if (a.r.length > 20) a.r.shift(); a.last = U.today();
      const d = day(); d.sec += sec;
      S.writing.push({ date: U.today(), id: it.id, type: it.type, prompt: it.prompt, text, words, passed, total: checks.length });
      S.draft = null;
      addStars(3 + passed);
      save();
      document.getElementById('fb').innerHTML = `<div class="feedback ok"><b class="title">✅ Saved to your journal! +${3 + passed} ⭐</b>
        ${passed} of ${checks.length} writing checks passed.<ul class="checks">${checks.map(c => `<li>${c.ok ? '✅' : '💡'} ${U.esc(c.msg)}</li>`).join('')}</ul></div>
        <div class="nextbar"><button class="btn wide" data-act="next">Next →</button></div>`;
      document.getElementById('wr').disabled = true;
    },
    ksay() { const it = RUN.round.items[RUN.round.i]; KS.say(it.say || it.q); },
    tap(el) { tapAnswer(el); },
    savelists() {
      const L = S.lists;
      if (C.young) {
        L.sight = (document.getElementById('l-sight').value || '').split(/\n|,/).map(s => s.trim().toLowerCase()).filter(Boolean);
      } else {
        L.spelling = (document.getElementById('l-spell').value || '').split(/\n|,/).map(s => s.trim()).filter(s => /^[A-Za-z' -]+$/.test(s));
        L.vocab = (document.getElementById('l-vocab').value || '').split('\n').map(line => {
          const m = line.match(/^\s*([^\-:–—]+?)\s*[-:–—]\s*(.+)$/);
          return m ? { w: m[1].trim(), d: m[2].trim() } : null;
        }).filter(Boolean);
      }
      L.updated = U.today();
      S.session = S.session && S.session.date === U.today() && S.session.idx > 0 ? S.session : null;
      save();
      document.getElementById('savedmsg').textContent = 'Saved ✔';
    },
    reset(el) {
      if (!RUN || !RUN.resetArmed) { RUN = { resetArmed: true }; renderGrownups(true); return; }
      const lists = S.lists;
      S = fresh(); S.lists = lists; save();
      renderHome();
    },
  };

  function onClick(e) {
    const t = e.target.closest('[data-act]');
    if (t && !t.disabled) { ACT[t.dataset.act] && ACT[t.dataset.act](t, e); return; }
    const s = e.target.closest('.passage.tapmode .s');
    if (s && RUN && !RUN.answered) {
      app().querySelectorAll('.passage .s.sel').forEach(x => x.classList.remove('sel'));
      s.classList.add('sel'); RUN.sel = s.dataset.sid;
      const chk = document.getElementById('chk'); if (chk) chk.disabled = false;
    }
  }
  // press-and-hold for the grown-ups area
  let holdT = null;
  function holdStart(e) {
    const t = e.target.closest('[data-hold]'); if (!t) return;
    const fill = t.querySelector('.fill');
    if (fill) { fill.style.transition = 'width 1.5s linear'; fill.style.width = '100%'; }
    holdT = setTimeout(() => { holdT = null; RUN = null; renderGrownups(false); }, 1500);
  }
  function holdEnd() {
    if (holdT) { clearTimeout(holdT); holdT = null; }
    app().querySelectorAll('[data-hold] .fill').forEach(f => { f.style.transition = 'none'; f.style.width = '0'; });
  }
  function onKey(e) {
    if (!RUN || !RUN.round || RUN.answered === undefined) return;
    const it = RUN.round.items[RUN.round.i]; if (!it) return;
    if (it.kind === 'spell' && e.key === 'Enter') { e.preventDefault(); ACT.spellcheck(); return; }
    if (it.kind !== 'num' || RUN.answered) { if (e.key === 'Enter' && RUN.answered && it.kind !== 'write') advance(); return; }
    const map = { Backspace: '⌫', '-': '−', ' ': '␣' };
    const k = map[e.key] || e.key;
    if (/^[0-9./]$/.test(k) || k === '⌫' || k === '−' || (k === '␣' && it.mixed)) { e.preventDefault(); ACT.key({ dataset: { k } }); }
    else if (e.key === 'Enter') { e.preventDefault(); ACT.numcheck(); }
  }
  function onInput(e) {
    if (e.target.id === 'wr') {
      updateWc();
      const it = RUN.round.items[RUN.round.i];
      S.draft = { id: it.id, text: e.target.value };
      clearTimeout(onInput.t); onInput.t = setTimeout(save, 600);
    }
  }

  // --------------------------------------------------------------- start
  KS.start = function (config) {
    C = config;
    C.minutes = C.minutes || 15;
    C.stickers = C.stickers || ['⭐'];
    KEY = 'ks:' + C.kid;
    S = load();
    const th = C.theme || {};
    Object.keys(th).forEach(k => document.documentElement.style.setProperty('--' + k, th[k]));
    if (C.young) document.body.classList.add('young');
    document.title = C.name + '’s Practice';
    const el = app();
    el.addEventListener('click', onClick);
    el.addEventListener('pointerdown', holdStart);
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => el.addEventListener(ev, holdEnd));
    el.addEventListener('input', onInput);
    document.addEventListener('keydown', onKey);
    el.addEventListener('contextmenu', e => { if (e.target.closest('[data-hold]')) e.preventDefault(); });
    renderHome();
  };
  // test hooks
  KS._test = { buildToday: () => buildToday(), makeItems: (k, n) => makeItems(areaByKey(k), n || 5), areas: () => C.areas, avail: k => avail(areaByKey(k)) };
})();
