/* Kindergarten activities (letter order + K math). Everything is spoken aloud.
   Items are kind 'tap': big tiles, retry once, then the right answer is shown. */
(function () {
  'use strict';
  const KS = window.KS; const U = KS.util;
  const K = KS.gen.k = {};

  // Letter focus follows the kindergarten units by month.
  function focusLetters() {
    const m = new Date().getMonth(); // 0 = Jan
    if (m >= 7 && m <= 9) return { now: 'msaitrfhbnwpl', before: '' };                       // Aug-Oct: units 1-2
    if (m >= 10 || m === 0) return { now: 'iofckjpgdneuvyzhxq', before: 'msatrfhbnwpl' };   // Nov-Jan: units 3-4
    if (m <= 2) return { now: 'bhuregd', before: 'msaitrfnwplofckjpgdneuvyzhxq' };            // Feb-Mar: units 5-6
    return { now: 'wljkyvq', before: 'msaitrfhbnpofcgdneuvzxq' };                               // Apr-Jun: units 7-8
  }
  function pickLetter(exclude) {
    const f = focusLetters();
    const all = 'abcdefghijklmnopqrstuvwxyz'.split('').filter(l => !exclude || exclude.indexOf(l) < 0);
    return U.weighted(all, l => f.now.indexOf(l) >= 0 ? 4 : f.before.indexOf(l) >= 0 ? 2 : 0.6);
  }
  const UP = l => l.toUpperCase();
  const confuse = { b: 'dpq', d: 'bpq', p: 'qbd', q: 'pdb', m: 'nw', n: 'mh', u: 'nv', w: 'mv', i: 'lj', l: 'it' };
  function otherLetters(l, n) {
    const out = [];
    const c = (confuse[l] || '').split('');
    if (c.length && Math.random() < 0.5) out.push(U.pick(c));
    while (out.length < n) { const x = pickLetter([l].concat(out)); if (out.indexOf(x) < 0) out.push(x); }
    return out;
  }

  // Picture words: [word, emoji]. The word is always spoken, so the picture only needs to support it.
  const PICS = {
    a: [['apple', '🍎'], ['ant', '🐜'], ['alligator', '🐊']], b: [['ball', '⚽'], ['bus', '🚌'], ['bear', '🐻'], ['banana', '🍌'], ['bee', '🐝']],
    c: [['cat', '🐱'], ['cake', '🎂'], ['car', '🚗'], ['cow', '🐮']], d: [['dog', '🐶'], ['duck', '🦆'], ['door', '🚪'], ['drum', '🥁']],
    e: [['egg', '🥚'], ['elephant', '🐘'], ['elf', '🧝']], f: [['fish', '🐟'], ['fox', '🦊'], ['frog', '🐸'], ['fire', '🔥']],
    g: [['goat', '🐐'], ['gift', '🎁'], ['guitar', '🎸'], ['grapes', '🍇']], h: [['hat', '🎩'], ['horse', '🐴'], ['house', '🏠'], ['heart', '❤️']],
    i: [['insect', '🐛'], ['iguana', '🦎']], j: [['juice', '🧃'], ['jacket', '🧥'], ['jeans', '👖']], k: [['kite', '🪁'], ['key', '🔑'], ['kangaroo', '🦘'], ['king', '🤴']],
    l: [['lion', '🦁'], ['leaf', '🍃'], ['lemon', '🍋'], ['ladybug', '🐞']], m: [['moon', '🌙'], ['mouse', '🐭'], ['monkey', '🐵'], ['milk', '🥛']],
    n: [['nose', '👃'], ['nut', '🥜'], ['nine', '9️⃣'], ['net', '🥅']], o: [['octopus', '🐙'], ['otter', '🦦'], ['ox', '🐂']],
    p: [['pig', '🐷'], ['pizza', '🍕'], ['pear', '🍐'], ['penguin', '🐧']], q: [['queen', '👸']], r: [['rabbit', '🐰'], ['rainbow', '🌈'], ['robot', '🤖'], ['rocket', '🚀']],
    s: [['sun', '☀️'], ['snake', '🐍'], ['sock', '🧦'], ['star', '⭐']], t: [['tiger', '🐯'], ['tree', '🌳'], ['turtle', '🐢'], ['tooth', '🦷']],
    u: [['umbrella', '☂️'], ['up', '⬆️']], v: [['van', '🚐'], ['violin', '🎻'], ['volcano', '🌋']], w: [['whale', '🐋'], ['watch', '⌚'], ['worm', '🪱'], ['watermelon', '🍉']],
    y: [['yo-yo', '🪀'], ['yarn', '🧶']], z: [['zebra', '🦓']],
  };

  // ------------------------------------------------------------ letters
  K.letter = function () {
    const l = pickLetter(), up = Math.random() < 0.55;
    const ch = [l].concat(otherLetters(l, 3)).map(x => up ? UP(x) : x);
    return { kind: 'tap', q: 'Find the letter you hear', say: `Find the letter ${UP(l)}.`, choices: ch, answer: 0, answerSay: UP(l) };
  };
  K['case'] = function () {
    const l = pickLetter();
    const ch = [l].concat(otherLetters(l, 2));
    return { kind: 'tap', q: 'Find the little letter that matches', pic: `<span style="font-family:'Comic Sans MS','Chalkboard SE',sans-serif;font-weight:800">${UP(l)}</span>`,
      say: `This is big ${UP(l)}. Find little ${UP(l)}.`, choices: ch, answer: 0, answerSay: `little ${UP(l)}` };
  };
  K.sound = function () {
    let l; do { l = pickLetter(['x']); } while (!PICS[l]);
    const [word, emo] = U.pick(PICS[l]);
    const ch = [l].concat(otherLetters(l, 2).filter(x => x !== l));
    return { kind: 'tap', q: `${word} starts with...`, pic: emo, say: `${word}. What letter does ${word} start with?`, retry: `${word}.`,
      choices: ch, answer: 0, answerSay: `${word} starts with ${UP(l)}.` };
  };

  // -------------------------------------------------------------- words
  const SIGHT = ['I', 'a', 'the', 'see', 'like', 'to', 'and', 'we', 'can', 'go', 'is', 'my', 'it', 'me', 'you', 'he', 'she', 'look', 'in', 'up', 'at', 'on', 'no', 'yes', 'am', 'do', 'here', 'said', 'for', 'this', 'with', 'are', 'have', 'come', 'play', 'little', 'big', 'was', 'what', 'they'];
  K.sight = function (S) {
    const own = S && S.lists && S.lists.sight && S.lists.sight.length >= 3 ? S.lists.sight : null;
    const pool = own && Math.random() < 0.75 ? own : SIGHT;
    const w = U.pick(pool);
    const others = U.sample(SIGHT.concat(own || []).filter(x => x.toLowerCase() !== w.toLowerCase()), 2);
    return { kind: 'tap', tileClass: 'word', q: 'Find the word you hear', say: `Find the word: ${w}.`, retry: `${w}.`, choices: [w].concat(others), answer: 0, answerSay: w };
  };
  const RHYME = [
    [['cat', '🐱'], ['hat', '🎩'], ['bat', '🦇']], [['dog', '🐶'], ['frog', '🐸'], ['log', '🪵']], [['bee', '🐝'], ['tree', '🌳'], ['key', '🔑']],
    [['cake', '🎂'], ['snake', '🐍'], ['rake', '🧹']], [['star', '⭐'], ['car', '🚗'], ['jar', '🫙']], [['moon', '🌙'], ['spoon', '🥄'], ['balloon', '🎈']],
    [['bear', '🐻'], ['pear', '🍐'], ['chair', '🪑']], [['mouse', '🐭'], ['house', '🏠']], [['goat', '🐐'], ['boat', '⛵'], ['coat', '🧥']],
    [['king', '👑'], ['ring', '💍']], [['bed', '🛏️'], ['sled', '🛷'], ['bread', '🍞']], [['fox', '🦊'], ['box', '📦'], ['socks', '🧦']],
    [['sun', '☀️'], ['bun', '🍔'], ['run', '🏃']], [['fish', '🐟'], ['dish', '🍽️']], [['snail', '🐌'], ['whale', '🐋'], ['pail', '🪣']],
  ];
  const tileWord = (w, e) => `<div style="text-align:center"><div style="font-size:64px;line-height:1.1">${e}</div><div style="font-size:24px;font-weight:700">${w}</div></div>`;
  K.rhyme = function () {
    const fam = U.pick(RHYME); const [target, match] = U.sample(fam, 2);
    const others = U.sample(RHYME.filter(f => f !== fam), 2).map(f => U.pick(f));
    const ch = [match].concat(others);
    const order = U.shuffle([0, 1, 2]);
    const spoken = order.map(i => ch[i][0]).join('... ');
    return { kind: 'tap', keepOrder: true, q: `What rhymes with ${target[0]}?`, pic: target[1], say: `Which one rhymes with ${target[0]}? ${spoken}?`, retry: `${target[0]}... ${spoken}?`,
      choices: order.map(i => tileWord(ch[i][0], ch[i][1])), answer: order.indexOf(0), answerSay: `${target[0]}, ${match[0]}. They rhyme!` };
  };
  const SYL = [['cat', '🐱', 1], ['dog', '🐶', 1], ['sun', '☀️', 1], ['fish', '🐟', 1], ['star', '⭐', 1], ['frog', '🐸', 1], ['cake', '🎂', 1], ['bear', '🐻', 1],
    ['apple', '🍎', 2], ['pizza', '🍕', 2], ['tiger', '🐯', 2], ['rabbit', '🐰', 2], ['monkey', '🐵', 2], ['rainbow', '🌈', 2], ['turtle', '🐢', 2], ['pumpkin', '🎃', 2], ['rocket', '🚀', 2], ['cupcake', '🧁', 2], ['penguin', '🐧', 2],
    ['banana', '🍌', 3], ['elephant', '🐘', 3], ['butterfly', '🦋', 3], ['dinosaur', '🦕', 3], ['octopus', '🐙', 3], ['ladybug', '🐞', 3], ['kangaroo', '🦘', 3], ['tomato', '🍅', 3], ['computer', '💻', 3], ['umbrella', '☂️', 3]];
  K.syll = function () {
    const [w, e, n] = U.pick(SYL);
    return { kind: 'tap', keepOrder: true, q: `Clap it: ${w}`, pic: e, say: `Let's clap ${w}. How many claps in ${w}?`, retry: `${w}.`,
      choices: ['👏', '👏👏', '👏👏👏'], answer: n - 1, tileClass: 'emojis', answerSay: `${w} has ${n} clap${n > 1 ? 's' : ''}.` };
  };
  const CVC = [['cat', '🐱'], ['hat', '🎩'], ['bat', '🦇'], ['van', '🚐'], ['can', '🥫'], ['pan', '🍳'], ['sun', '☀️'], ['bun', '🍔'], ['pig', '🐷'], ['dig', '⛏️'],
    ['net', '🥅'], ['jet', '✈️'], ['pot', '🍲'], ['dot', '⚫'], ['pin', '📌'], ['bug', '🐛'], ['mug', '☕'], ['map', '🗺️'], ['cap', '🧢'], ['bed', '🛏️'], ['box', '📦'], ['fox', '🦊'], ['web', '🕸️'], ['cup', '🥤']];
  K.cvc = function () {
    const [w, e] = U.pick(CVC);
    const near = CVC.filter(x => x[0] !== w && (x[0].slice(1) === w.slice(1) || x[0][0] === w[0]));
    const others = U.sample(near.length >= 2 ? near : CVC.filter(x => x[0] !== w), 2).map(x => x[0]);
    return { kind: 'tap', tileClass: 'word', q: 'Read it! Which word matches the picture?', pic: e, say: `Which word says ${w}?`, retry: `${w}.`, choices: [w].concat(others), answer: 0, answerSay: w };
  };

  // ------------------------------------------------------------ numbers
  const THINGS = [['🍎', 'apples'], ['🐶', 'puppies'], ['⭐', 'stars'], ['🚗', 'cars'], ['🦆', 'ducks'], ['🍓', 'strawberries'], ['🐟', 'fish'], ['🎈', 'balloons'], ['🐞', 'ladybugs'], ['⚽', 'balls']];
  const rows = (emo, n) => { let h = ''; for (let i = 0; i < n; i += 5) h += `<div>${emo.repeat(Math.min(5, n - i))}</div>`; return h; };
  function maxNum() { const m = new Date().getMonth(); return (m >= 7 && m <= 9) ? 10 : (m >= 10 || m === 0) ? 20 : m <= 2 ? 30 : 50; }
  function nearNums(n, k, lo, hi) {
    const out = [];
    for (const d of U.shuffle([-2, -1, 1, 2, 3, -3, 10, -10])) { const v = n + d; if (v >= lo && v <= hi && out.indexOf(v) < 0 && v !== n) out.push(v); if (out.length === k) break; }
    return out;
  }
  K.count = function () {
    const t = U.pick(THINGS), n = U.ri(1, Math.min(20, maxNum()));
    return { kind: 'tap', q: `How many ${t[1]}?`, pic: rows(t[0], n), picRows: true, say: `How many ${t[1]}? Count them!`, retry: 'Touch each one and count.',
      choices: [n].concat(nearNums(n, 3, 1, 25)).map(String), answer: 0, answerSay: `${n}!` };
  };
  K.num = function () {
    const n = U.ri(0, maxNum());
    const others = nearNums(n, 3, 0, Math.max(30, maxNum()));
    if (n >= 11 && n <= 19 && Math.random() < 0.5) others[0] = (n - 10) * 10; // 13 vs 30
    const ch = [n].concat(others.filter((v, i, a) => a.indexOf(v) === i && v !== n)).slice(0, 4).map(String);
    return { kind: 'tap', q: 'Find the number you hear', say: `Find the number ${n}.`, retry: `${n}.`, choices: ch, answer: 0, answerSay: String(n) };
  };
  K.more = function () {
    const t = U.pick(THINGS); let a = U.ri(1, 9), b = U.ri(1, 9); if (a === b) b = a < 9 ? a + 1 : a - 2;
    const more = Math.random() < 0.6;
    const ans = more ? (a > b ? 0 : 1) : (a < b ? 0 : 1);
    return { kind: 'tap', keepOrder: true, tileClass: 'emojis', q: `Which group has ${more ? 'MORE' : 'FEWER'}?`, say: `Which group has ${more ? 'more' : 'fewer'} ${t[1]}?`,
      choices: [t[0].repeat(a), t[0].repeat(b)], answer: ans, answerSay: `This group has ${more ? 'more' : 'fewer'}.` };
  };
  K.next = function () {
    const max = Math.max(10, maxNum()), after = Math.random() < 0.65;
    const n = after ? U.ri(1, max - 1) : U.ri(2, max);
    const ans = after ? n + 1 : n - 1;
    const ch = [ans].concat(nearNums(ans, 2, 0, max + 1).filter(v => v !== n)).slice(0, 3);
    for (let d = 2; ch.length < 3; d++) { if (ans + d !== n && ch.indexOf(ans + d) < 0) ch.push(ans + d); }
    return { kind: 'tap', q: `What comes ${after ? 'after' : 'before'} ${n}?`, say: `What number comes ${after ? 'after' : 'before'} ${n}?`, retry: `${after ? 'after' : 'before'} ${n}?`,
      choices: ch.map(String), answer: 0, answerSay: `${ans}!` };
  };
  K.add = function () {
    const t = U.pick(THINGS), a = U.ri(1, 5), b = U.ri(1, 5), n = a + b;
    return { kind: 'tap', q: `${a} and ${b} more. How many in all?`, pic: `<div>${t[0].repeat(a)}</div><div style="font-size:34px">➕</div><div>${t[0].repeat(b)}</div>`, picRows: true,
      say: `${a} ${t[1]}, and ${b} more ${t[1]}. How many ${t[1]} in all?`, retry: 'Count them all.', choices: [n].concat(nearNums(n, 2, 1, 12)).map(String), answer: 0, answerSay: `${a} and ${b} make ${n}.` };
  };
  K.tens = function () {
    const start = U.ri(1, 6) * 10, seq = [start, start + 10, start + 20];
    const ans = start + 30;
    return { kind: 'tap', q: `${seq.join(', ')}, ...?`, say: `Count by tens. ${seq.join(', ')}. What comes next?`, choices: [ans, ans + 10, ans + 1].map(String), answer: 0, answerSay: `${ans}!` };
  };

  // ----------------------------------------------------- shapes & patterns
  const COLORS = ['#e4572e', '#3a86ff', '#ffbe0b', '#2ec4b6', '#8338ec', '#fb5607'];
  function shapeSvg(type, color) {
    const s = 110;
    const body = type === 'circle' ? `<circle cx="55" cy="55" r="45" fill="${color}"/>`
      : type === 'square' ? `<rect x="14" y="14" width="82" height="82" fill="${color}" rx="3"/>`
        : type === 'rectangle' ? `<rect x="4" y="30" width="102" height="52" fill="${color}" rx="3"/>`
          : U.pick([`<polygon points="55,8 104,98 6,98" fill="${color}"/>`, `<polygon points="10,10 10,100 100,100" fill="${color}"/>`, `<polygon points="20,15 100,55 20,98" fill="${color}"/>`]);
    return `<svg viewBox="0 0 ${s} ${s}" width="${s}" height="${s}">${body}</svg>`;
  }
  const SHAPES = ['circle', 'square', 'triangle', 'rectangle'];
  K.shape = function () {
    const t = U.ri(0, 2);
    if (t === 2) {
      const f = U.pick([['has 3 sides', 'triangle'], ['has no corners', 'circle'], ['is round', 'circle'], ['has 4 sides that are all the same', 'square']]);
      const ch = U.shuffle(SHAPES.filter(s => s !== f[1])).slice(0, 2).concat([f[1]]);
      const order = U.shuffle([0, 1, 2]);
      return { kind: 'tap', keepOrder: true, q: `Which shape ${f[0]}?`, say: `Which shape ${f[0]}?`, choices: order.map(i => shapeSvg(ch[i], U.pick(COLORS))), answer: order.indexOf(2), answerSay: `The ${f[1]}.` };
    }
    const target = U.pick(SHAPES);
    const ch = [target].concat(U.sample(SHAPES.filter(s => s !== target), t === 0 ? 2 : 3));
    return { kind: 'tap', q: `Find the ${target}`, say: `Find the ${target}.`, choices: ch.map(s => shapeSvg(s, U.pick(COLORS))), answer: 0, answerSay: `This is the ${target}.` };
  };
  const PAT = [['🔴', '🔵', '🟡'], ['🐶', '🐱', '🐭'], ['⭐', '🌙', '☀️'], ['🍎', '🍌', '🍇'], ['🟩', '🟥', '🟦']];
  K.pattern = function () {
    const set = U.pick(PAT); const core = U.pick(['AB', 'AAB', 'ABB', 'ABC']);
    const unit = core.split('').map(c => set['ABC'.indexOf(c)]);
    const len = core.length * 2 + U.ri(0, core.length - 1);
    const seq = []; for (let i = 0; i < len; i++) seq.push(unit[i % unit.length]);
    const ans = unit[len % unit.length];
    const opts = Array.from(new Set(set.concat([]))).slice(0, 3);
    if (opts.indexOf(ans) < 0) opts[0] = ans;
    const order = U.shuffle(opts);
    return { kind: 'tap', keepOrder: true, q: 'What comes next?', pic: `<div style="font-size:44px;letter-spacing:4px">${seq.join('')}❓</div>`, say: 'What comes next in the pattern?',
      choices: order, answer: order.indexOf(ans), answerSay: 'That one comes next!' };
  };
})();
