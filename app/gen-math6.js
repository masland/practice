/* Grade 6 math generators. Every call returns one fresh item. */
(function () {
  'use strict';
  const KS = window.KS; const U = KS.util, R = KS.rat;
  const M = KS.gen.math6 = {};
  const sn = U.sn, pn = U.pn;
  const fr = (n, d) => U.frHtml(n, d);
  const rh = r => R.html(r);
  // Mixed-number display for a positive or negative rational.
  function mixedHtml(r) {
    const neg = r.n < 0, n = Math.abs(r.n);
    if (r.d === 1) return sn(r.n);
    if (n < r.d) return (neg ? '−' : '') + fr(n, r.d);
    return (neg ? '−' : '') + Math.floor(n / r.d) + ' ' + fr(n % r.d, r.d);
  }

  // ------------------------------------------------------------- data
  const dataCtx = [
    ['points scored in', 'games'], ['minutes of reading on', 'days'], ['goals scored in', 'soccer games'],
    ['quiz scores (out of 20) on', 'quizzes'], ['laps swum on', 'days'], ['pages read on', 'nights'],
  ];
  M.data = function () {
    const t = U.ri(0, 5);
    const c = U.pick(dataCtx);
    if (t === 0) { // mean
      const n = U.ri(4, 6), m = U.ri(6, 16);
      let v = [], sum = 0;
      for (let i = 0; i < n - 1; i++) { const x = U.ri(Math.max(1, m - 6), m + 6); v.push(x); sum += x; }
      const last = m * n - sum;
      if (last < 1 || last > 30) return M.data();
      v.push(last); v = U.shuffle(v);
      return U.num(`Here are the ${c[0]} ${n} ${c[1]}: <b>${v.join(', ')}</b>.<br>What is the <b>mean</b>?`, m,
        `Add them up: ${v.join(' + ')} = ${m * n}. Then divide by how many there are: ${m * n} ÷ ${n} = ${m}.`);
    }
    if (t === 1) { // median
      const n = U.ri(5, 8); const v = Array.from({ length: n }, () => U.ri(1, 25));
      const s = v.slice().sort((a, b) => a - b);
      let med, how;
      if (n % 2) { med = s[(n - 1) / 2]; how = `The middle number is ${med}.`; }
      else { const a = s[n / 2 - 1], b = s[n / 2]; med = (a + b) / 2; how = `There are two middle numbers, ${a} and ${b}. Their mean is (${a} + ${b}) ÷ 2 = ${med}.`; }
      return U.num(`Find the <b>median</b>: <b>${v.join(', ')}</b>`, med, `Put them in order: ${s.join(', ')}. ${how}`);
    }
    if (t === 2) { // mode
      const n = U.ri(5, 7); const pool = U.sample(Array.from({ length: 20 }, (x, i) => i + 2), n - 1);
      const mode = pool[0]; const v = U.shuffle(pool.concat([mode]));
      return U.num(`Find the <b>mode</b>: <b>${v.join(', ')}</b>`, mode, `The mode is the number that shows up most often. ${mode} appears twice; every other number appears once.`);
    }
    if (t === 3) { // range
      const n = U.ri(5, 7); const v = Array.from({ length: n }, () => U.ri(1, 40));
      const mx = Math.max.apply(null, v), mn = Math.min.apply(null, v);
      if (mx === mn) return M.data();
      return U.num(`Find the <b>range</b>: <b>${v.join(', ')}</b>`, mx - mn, `Range = greatest − least = ${mx} − ${mn} = ${mx - mn}.`);
    }
    if (t === 4) { // circle graph
      const opts = [[10, [20, 30, 40, 50, 60, 80, 100, 200]], [20, [20, 30, 40, 50, 60, 80, 100, 200]], [25, [20, 40, 60, 80, 100, 200]],
        [50, [20, 30, 40, 50, 60, 80, 100]], [75, [20, 40, 60, 80, 100, 200]], [30, [20, 30, 40, 50, 60, 100, 200]], [40, [20, 30, 40, 50, 60, 100]]];
      const o = U.pick(opts), p = o[0], total = U.pick(o[1]), ans = total * p / 100;
      const thing = U.pick([['students were surveyed about their favorite sport', 'chose soccer', 'How many students chose soccer?'], ['people voted for a class pet', 'voted for a hamster', 'How many voted for a hamster?'], ['students named their favorite season', 'chose summer', 'How many chose summer?']]);
      return U.num(`${total} ${thing[0]}. A circle graph shows that <b>${p}%</b> ${thing[1]}. ${thing[2]}`, ans,
        `${p}% means ${p} out of 100, or ${p / 100}. ${p / 100} × ${total} = ${ans}.`);
    }
    // outlier
    const base = U.ri(15, 25); const v = Array.from({ length: 5 }, () => base + U.ri(-2, 2));
    const out = U.pick([base + U.ri(20, 35), base - U.ri(11, 14)]);
    const all = U.shuffle(v.concat([out]));
    const wrongs = U.shuffle(Array.from(new Set(v.filter(x => x !== out))));
    if (wrongs.length < 3) return M.data();
    return U.mc(`Which number is an <b>outlier</b> in this data? <b>${all.join(', ')}</b>`, out, wrongs,
      `An outlier is far away from the rest of the data. Most values are near ${base}, but ${out} is far away.`);
  };

  // ---------------------------------------------------------- integers
  M.int = function () {
    const t = U.ri(0, 7);
    if (t === 0) { // compare
      let a = U.ri(-15, 15), b = U.ri(-15, 15);
      if (Math.random() < 0.15) b = a;
      const sym = a < b ? '<' : a > b ? '>' : '=';
      return { kind: 'mc', html: true, keepOrder: true, q: `Which symbol makes this true?<br><span class="big">${sn(a)} ___ ${sn(b)}</span>`,
        choices: ['&lt;', '&gt;', '='], answer: ['<', '>', '='].indexOf(sym),
        explain: `On a number line, numbers get bigger as you go right. ${a === b ? 'They are the same number.' : `${sn(Math.min(a, b))} is to the left of ${sn(Math.max(a, b))}, so it is less.`}` };
    }
    if (t === 1) { // absolute value
      const a = U.ri(-30, 30) || -7;
      return U.num(`What is <span class="big">|${sn(a)}|</span>?`, Math.abs(a), `Absolute value is the distance from 0. ${sn(a)} is ${Math.abs(a)} units from 0.`);
    }
    if (t === 2) { // order
      const v = U.sample(Array.from({ length: 31 }, (x, i) => i - 15), 4);
      const s = v.slice().sort((a, b) => a - b);
      const f = arr => arr.map(sn).join(', ');
      const wrong1 = v.slice().sort((a, b) => Math.abs(a) - Math.abs(b));
      const wrong2 = s.slice().reverse();
      const wrong3 = U.shuffle(v);
      return U.mc(`Order from <b>least to greatest</b>: ${f(v)}`, f(s), [f(wrong1), f(wrong2), f(wrong3), f([s[1], s[0], s[2], s[3]])],
        `The most negative number is the least. In order: ${f(s)}.`);
    }
    if (t <= 5) { // operations
      const op = U.pick(['+', '−', '×', '÷']);
      let a = U.ri(-15, 15) || 4, b = U.ri(-12, 12) || -3, ans, how;
      if (op === '+') { ans = a + b; how = Math.sign(a) === Math.sign(b) ? `Same signs: add ${Math.abs(a)} + ${Math.abs(b)} = ${Math.abs(ans)} and keep the sign.` : `Different signs: subtract the absolute values (${Math.max(Math.abs(a), Math.abs(b))} − ${Math.min(Math.abs(a), Math.abs(b))}) and keep the sign of the number farther from 0.`; }
      if (op === '−') { ans = a - b; how = `Subtracting is adding the opposite: ${sn(a)} + ${pn(-b)} = ${sn(ans)}.`; }
      if (op === '×') { a = U.ri(-12, 12) || -6; b = U.ri(-9, 9) || 4; ans = a * b; how = `${Math.abs(a)} × ${Math.abs(b)} = ${Math.abs(ans)}. ${(a < 0) !== (b < 0) ? 'Different signs give a negative.' : 'Same signs give a positive.'}`; }
      if (op === '÷') { b = U.ri(-9, 9) || 3; ans = U.ri(-12, 12) || -5; a = ans * b; how = `${Math.abs(a)} ÷ ${Math.abs(b)} = ${Math.abs(ans)}. ${(a < 0) !== (b < 0) ? 'Different signs give a negative.' : 'Same signs give a positive.'}`; }
      return U.num(`<span class="big">${sn(a)} ${op} ${pn(b)} = ?</span>`, ans, how);
    }
    if (t === 6) { // temperature
      const start = U.ri(-12, 5), ch = U.ri(-10, 14) || 6, end = start + ch;
      return U.num(`At 6 a.m. the temperature was <b>${sn(start)}°F</b>. By noon it had ${ch > 0 ? 'risen' : 'dropped'} <b>${Math.abs(ch)} degrees</b>. What was the temperature at noon?`, end,
        `${sn(start)} ${ch > 0 ? '+' : '−'} ${Math.abs(ch)} = ${sn(end)}°F.`, { unit: '°F' });
    }
    const a = U.ri(-40, -5), b = U.ri(5, 40);
    return U.num(`A diver is at <b>${sn(a)} feet</b> (below sea level). A bird is flying at <b>${b} feet</b>. How many feet apart are they?`, b - a,
      `Distance = ${b} − (${sn(a)}) = ${b} + ${Math.abs(a)} = ${b - a} feet.`, { unit: 'ft' });
  };

  // ------------------------------------------------------- inequalities
  const sym = { '>': '&gt;', '<': '&lt;', '>=': '≥', '<=': '≤' };
  M.ineq = function () {
    const t = U.ri(0, 2);
    if (t === 0) { // which is a solution
      const p = U.ri(-6, 8), op = U.pick(['>', '<', '>=', '<=']);
      const test = x => op === '>' ? x > p : op === '<' ? x < p : op === '>=' ? x >= p : x <= p;
      const cand = U.shuffle(Array.from({ length: 21 }, (x, i) => p - 10 + i));
      const good = cand.find(test); const bad = cand.filter(x => !test(x)).slice(0, 3);
      if (good === undefined || bad.length < 3) return M.ineq();
      return U.mc(`Which number is a solution of <b><i>x</i> ${sym[op]} ${sn(p)}</b>?`, sn(good), bad.map(sn),
        `A solution makes the inequality true. ${sn(good)} ${sym[op]} ${sn(p)} is true.${op.length > 1 ? ` (${sym[op]} includes ${sn(p)} itself.)` : ` (${sn(p)} itself is not included.)`}`);
    }
    if (t === 1) { // words
      const ctx = U.pick([
        ['You must be <b>at least</b> {n} inches tall to ride.', 'h', '>=', 48, 54],
        ['An elevator can hold <b>at most</b> {n} people.', 'p', '<=', 8, 15],
        ['The temperature stayed <b>below</b> {n}°F all day.', 't', '<', 20, 40],
        ['You need <b>more than</b> {n} points to win.', 's', '>', 50, 100],
        ['Spend <b>no more than</b> ${n} at the book fair.', 'd', '<=', 15, 30],
        ['The class needs <b>fewer than</b> {n} absences.', 'a', '<', 3, 6],
        ['The game is for kids <b>older than</b> {n}.', 'k', '>', 6, 10],
        ['Bags that weigh <b>no less than</b> {n} pounds get a heavy-bag tag.', 'w', '>=', 40, 50],
      ]);
      const n = U.ri(ctx[3], ctx[4]);
      const text = ctx[0].replace('{n}', n).replace('${n}', '$' + n);
      const v = `<i>${ctx[1]}</i>`;
      const ch = ['>', '<', '>=', '<='].map(o => `${v} ${sym[o]} ${n}`);
      const correct = `${v} ${sym[ctx[2]]} ${n}`;
      return U.mc(`${text}<br>Which inequality matches?`, correct, ch.filter(c => c !== correct),
        `"At least" means ≥, "at most" or "no more than" means ≤, "more than" means &gt;, "fewer/less than" or "below" means &lt;.`);
    }
    const p = U.ri(-5, 5), op = U.pick(['>', '<', '>=', '<=']);
    const vis = KS.svg.numberLine({ min: p - 5, max: p + 5, point: p, open: op.length === 1, dir: op[0] === '>' ? 'right' : 'left' });
    const correct = `<i>x</i> ${sym[op]} ${sn(p)}`;
    return U.mc('Which inequality does this graph show?', correct, ['>', '<', '>=', '<='].filter(o => o !== op).map(o => `<i>x</i> ${sym[o]} ${sn(p)}`),
      `An open circle means the number is NOT included (&gt; or &lt;). A closed circle means it IS included (≥ or ≤). The arrow points ${op[0] === '>' ? 'right, to greater numbers' : 'left, to smaller numbers'}.`, { visual: vis });
  };

  // ----------------------------------------------------- factors & primes
  M.factors = function () {
    const t = U.ri(0, 3);
    if (t === 0) {
      const g = U.pick([2, 3, 4, 5, 6, 7, 8, 9, 12]); let a = g * U.ri(2, 9), b = g * U.ri(2, 9);
      if (a === b) b += g;
      const G = U.gcd(a, b);
      return U.num(`What is the <b>greatest common factor (GCF)</b> of ${a} and ${b}?`, G, `${G} is the biggest number that divides both: ${a} ÷ ${G} = ${a / G} and ${b} ÷ ${G} = ${b / G}.`);
    }
    if (t === 1) {
      const a = U.ri(2, 12), b = U.ri(2, 12); if (a === b) return M.factors();
      const L = U.lcm(a, b);
      return U.num(`What is the <b>least common multiple (LCM)</b> of ${a} and ${b}?`, L, `List multiples of ${a}: ${[1, 2, 3, 4, 5].map(k => a * k).join(', ')}... The first one that ${b} also divides is ${L}.`);
    }
    if (t === 2) {
      const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
      const comps = [9, 15, 21, 25, 27, 33, 35, 39, 49, 51, 57, 1];
      const p = U.pick(primes.slice(3));
      return U.mc('Which number is <b>prime</b>?', p, U.sample(comps, 3), `A prime number has exactly two factors: 1 and itself. ${p} only divides by 1 and ${p}.`);
    }
    const n = U.pick([12, 18, 20, 24, 28, 30, 36, 40, 42, 45, 48, 50, 60, 72]);
    const f = []; let x = n; for (let d = 2; d <= x; d++) { while (x % d === 0) { f.push(d); x /= d; } }
    const str = arr => arr.join(' × ');
    const w1 = f.slice(0, -1).concat([f[f.length - 1] * (f.length > 1 ? 1 : 2)]);
    const wrongs = [str([2].concat(f)), str(f.slice(1).concat([f[0] + 1])), str([n / f[0], f[0]]), str(w1)].filter(s => s !== str(f));
    return U.mc(`What is the <b>prime factorization</b> of ${n}?`, str(f), wrongs, `Keep dividing by primes: ${n} = ${str(f)}. Every factor is prime.`);
  };

  // --------------------------------------------------- ratios & rates
  M.ratio = function () {
    const t = U.ri(0, 4);
    if (t === 0) {
      const a = U.ri(1, 9), b = U.ri(2, 9), k = U.ri(2, 8);
      if (a === b) return M.ratio();
      return U.num(`Find the missing number: <span class="big">${a} : ${b} = ${a * k} : ?</span>`, b * k, `${a} was multiplied by ${k} to get ${a * k}, so multiply ${b} by ${k}: ${b * k}.`);
    }
    if (t === 1) {
      const items = U.pick([['notebooks', 'notebook', '$', ''], ['bottles of water', 'bottle', '$', ''], ['packs of cards', 'pack', '$', '']]);
      const unit = U.ri(2, 9), n = U.ri(3, 9);
      return U.num(`${n} ${items[0]} cost <b>$${unit * n}</b>. What is the cost for <b>one</b> ${items[1]}?`, unit, `Unit rate: $${unit * n} ÷ ${n} = $${unit} per ${items[1]}.`, { unit: 'dollars' });
    }
    if (t === 2) {
      const sp = U.ri(25, 65), h = U.ri(2, 6);
      return U.num(`A car drives <b>${sp * h} miles</b> in <b>${h} hours</b>. How many miles per hour is that?`, sp, `${sp * h} ÷ ${h} = ${sp} miles per hour.`, { unit: 'mph' });
    }
    if (t === 3) {
      const a = U.ri(1, 5), b = U.ri(1, 5); if (a === b) return M.ratio();
      const k = U.ri(2, 7), tot = (a + b) * k;
      const which = U.pick([0, 1]);
      const names = U.pick([['dogs', 'cats'], ['boys', 'girls'], ['red marbles', 'blue marbles'], ['fiction books', 'nonfiction books']]);
      return U.num(`The ratio of ${names[0]} to ${names[1]} is <b>${a} : ${b}</b>. There are <b>${tot}</b> in all. How many are ${names[which]}?`, which ? b * k : a * k,
        `${a} + ${b} = ${a + b} parts. ${tot} ÷ ${a + b} = ${k} in each part. ${names[which]}: ${which ? b : a} × ${k} = ${which ? b * k : a * k}.`);
    }
    const a = U.ri(1, 4), b = U.ri(3, 15);
    const col = [1, 2, 3].map(k => [a * k, b * k]);
    const k = U.ri(4, 6);
    return U.num(`Complete the ratio table.<br>Cups of flour: ${col.map(c => c[0]).join(', ')}, <b>${a * k}</b><br>Cookies: ${col.map(c => c[1]).join(', ')}, <b>?</b>`, b * k,
      `The flour row goes ${a}, ${a * 2}, ${a * 3}... ${a * k} is ${k} × ${a}, so the cookies are ${k} × ${b} = ${b * k}.`);
  };

  // ------------------------------------------------ percents & decimals
  M.pct = function () {
    const t = U.ri(0, 4);
    if (t === 0) {
      const p = U.pick([10, 20, 25, 30, 40, 50, 60, 75, 80]), base = U.pick([20, 40, 60, 80, 100, 120, 200, 300]);
      const ans = p * base / 100; if (ans !== Math.round(ans)) return M.pct();
      return U.num(`What is <b>${p}%</b> of <b>${base}</b>?`, ans, `${p}% = ${p / 100}. ${p / 100} × ${base} = ${ans}.`);
    }
    if (t === 1) {
      const pairs = [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 10], [3, 10], [7, 10], [9, 10], [1, 20], [7, 20], [3, 25], [1, 25], [9, 50]];
      const [n, d] = U.pick(pairs);
      return U.num(`Write ${fr(n, d)} as a <b>percent</b>.`, n * 100 / d, `Make the denominator 100: ${fr(n, d)} = ${fr(n * 100 / d, 100)} = ${n * 100 / d}%.`, { unit: '%' });
    }
    if (t === 2) {
      const p = U.pick([5, 8, 12, 15, 35, 45, 60, 72, 90, 125]);
      return U.num(`Write <b>${p}%</b> as a <b>decimal</b>.`, p / 100, `Percent means "out of 100." ${p}% = ${p} ÷ 100 = ${p / 100}.`);
    }
    if (t === 3) {
      const p = U.pick([10, 20, 25, 40, 50, 75, 5, 15, 35, 45, 60, 80]);
      const r = R.make(p, 100);
      return U.num(`Write <b>${p}%</b> as a fraction in <b>simplest form</b>.`, R.str(r), `${p}% = ${fr(p, 100)}. Divide top and bottom by ${U.gcd(p, 100)}: ${rh(r)}.`, { ansShow: rh(r) });
    }
    const whole = U.pick([20, 25, 40, 50, 80]), p = U.pick([10, 20, 25, 40, 50, 60, 75, 80]);
    const part = whole * p / 100; if (part !== Math.round(part)) return M.pct();
    return U.num(`You got <b>${part} out of ${whole}</b> questions right. What <b>percent</b> is that?`, p, `${part} ÷ ${whole} = ${p / 100} = ${p}%.`, { unit: '%' });
  };

  // ---------------------------------------------------------- exponents
  M.exp = function () {
    const t = U.ri(0, 3);
    if (t === 0) {
      const [b, e] = U.pick([[2, 3], [2, 4], [2, 5], [2, 6], [3, 2], [3, 3], [3, 4], [4, 2], [4, 3], [5, 2], [5, 3], [6, 2], [7, 2], [8, 2], [9, 2], [10, 2], [10, 3], [10, 4], [11, 2], [12, 2], [1, 7], [6, 0], [9, 1]]);
      const v = Math.pow(b, e);
      return U.num(`<span class="big">${b}<sup>${e}</sup> = ?</span>`, v,
        e === 0 ? 'Any nonzero number to the power 0 is 1.' : e === 1 ? `Power 1 means just ${b}.` : `${b}<sup>${e}</sup> means ${Array(e).fill(b).join(' × ')} = ${v}. (Not ${b} × ${e}!)`);
    }
    if (t === 1) {
      const sq = U.pick([16, 25, 36, 49, 64, 81, 100, 121, 144]);
      const non = U.sample([18, 24, 32, 40, 45, 50, 60, 72, 90, 99, 120], 3);
      return U.mc('Which number is a <b>perfect square</b>?', sq, non, `${sq} = ${Math.sqrt(sq)} × ${Math.sqrt(sq)}, a whole number times itself.`);
    }
    if (t === 2) {
      const a = U.ri(2, 5), b = U.ri(2, 3), c = U.ri(2, 9), d = U.ri(2, 6);
      const v = Math.pow(a, b) + c * d;
      return U.num(`<span class="big">${a}<sup>${b}</sup> + ${c} × ${d} = ?</span>`, v, `Exponents first: ${a}<sup>${b}</sup> = ${Math.pow(a, b)}. Then multiply: ${c} × ${d} = ${c * d}. Then add: ${v}.`);
    }
    const b = U.ri(2, 9), e = U.ri(3, 5);
    return U.mc(`Which is the same as ${Array(e).fill(b).join(' × ')}?`, `${b}<sup>${e}</sup>`, [`${e}<sup>${b}</sup>`, `${b} × ${e}`, `${b * e}`],
      `${b} is multiplied by itself ${e} times, so it's ${b}<sup>${e}</sup>.`);
  };

  // -------------------------------------------------- coordinate plane
  const quad = (x, y) => x > 0 && y > 0 ? 'I' : x < 0 && y > 0 ? 'II' : x < 0 && y < 0 ? 'III' : 'IV';
  const pt = (x, y) => `(${sn(x)}, ${sn(y)})`;
  M.coord = function () {
    const t = U.ri(0, 4);
    const nz = () => (U.ri(1, 7)) * U.pick([1, -1]);
    if (t === 0) {
      const x = nz(), y = nz();
      return { kind: 'mc', html: true, keepOrder: true, q: `In which quadrant is the point <b>${pt(x, y)}</b>?`, choices: ['I', 'II', 'III', 'IV'], answer: ['I', 'II', 'III', 'IV'].indexOf(quad(x, y)),
        explain: `x is ${x > 0 ? 'positive (right)' : 'negative (left)'} and y is ${y > 0 ? 'positive (up)' : 'negative (down)'}, so it's in Quadrant ${quad(x, y)}. Quadrants go I, II, III, IV counterclockwise starting top-right.` };
    }
    if (t === 1) {
      const x = nz(), y = nz();
      const vis = KS.svg.plane({ min: -8, max: 8, points: [{ x, y, label: 'A' }] });
      return U.mc('What are the coordinates of point <b>A</b>?', pt(x, y), [pt(y, x), pt(-x, y), pt(x, -y), pt(-x, -y)],
        `Start at the origin. Move ${Math.abs(x)} ${x > 0 ? 'right' : 'left'} (x = ${sn(x)}), then ${Math.abs(y)} ${y > 0 ? 'up' : 'down'} (y = ${sn(y)}).`, { visual: vis });
    }
    if (t === 2) {
      const same = U.pick(['x', 'y']); const k = U.ri(-6, 6); let a = U.ri(-8, 8), b = U.ri(-8, 8);
      if (a === b) b = a + U.ri(2, 6);
      const p1 = same === 'y' ? pt(a, k) : pt(k, a), p2 = same === 'y' ? pt(b, k) : pt(k, b);
      return U.num(`How many units apart are <b>${p1}</b> and <b>${p2}</b>?`, Math.abs(a - b),
        `They share the same ${same}-coordinate, so count along the other one: |${sn(a)} − ${pn(b)}| = ${Math.abs(a - b)}.`, { unit: 'units' });
    }
    if (t === 3) {
      const x = nz(), y = nz(), ax = U.pick(['x', 'y']);
      const ans = ax === 'x' ? pt(x, -y) : pt(-x, y);
      return U.mc(`Point <b>${pt(x, y)}</b> is reflected across the <b>${ax}-axis</b>. Where does it land?`, ans,
        [ax === 'x' ? pt(-x, y) : pt(x, -y), pt(-x, -y), pt(y, x)],
        `Reflecting across the ${ax}-axis flips the ${ax === 'x' ? 'y' : 'x'}-coordinate's sign and keeps the ${ax}-coordinate.`);
    }
    const facts = [
      ['Two figures are <b>congruent</b> when they have...', 'the same size and the same shape', ['the same shape but different sizes', 'the same color', 'the same number of sides only']],
      ['The point where the x-axis and y-axis cross is called the...', 'origin', ['quadrant', 'vertex', 'ordered pair']],
      ['In the ordered pair (x, y), which number comes first?', 'the x-coordinate (left or right)', ['the y-coordinate (up or down)', 'the bigger number', 'it doesn’t matter']],
      ['Congruent line segments are marked with...', 'matching tick marks', ['matching arrows', 'right-angle boxes', 'dotted lines']],
    ];
    const f = U.pick(facts);
    return U.mc(f[0], f[1], f[2], `The answer is: ${f[1]}.`);
  };

  // ---------------------------------------------------------- fractions
  M.frac = function () {
    const t = U.ri(0, 4);
    const d1 = U.ri(2, 10), d2 = U.ri(2, 10);
    const n1 = U.ri(1, d1 - 1) || 1, n2 = U.ri(1, d2 - 1) || 1;
    const A = R.make(n1, d1), B = R.make(n2, d2);
    if (A.d === 1 || B.d === 1) return M.frac();
    if (t === 0 || t === 1) {
      const add = t === 0;
      let a = A, b = B;
      if (!add && a.n * b.d < b.n * a.d) { const tmp = a; a = b; b = tmp; }
      if (!add && R.eq(a, b)) return M.frac();
      const L = U.lcm(a.d, b.d);
      const res = R.make(add ? a.n * (L / a.d) + b.n * (L / b.d) : a.n * (L / a.d) - b.n * (L / b.d), L);
      return U.num(`<span class="big">${rh(a)} ${add ? '+' : '−'} ${rh(b)} = ?</span>`, R.str(res),
        `Common denominator ${L}: ${fr(a.n * L / a.d, L)} ${add ? '+' : '−'} ${fr(b.n * L / b.d, L)} = ${fr(add ? a.n * L / a.d + b.n * L / b.d : a.n * L / a.d - b.n * L / b.d, L)}${res.d !== L ? ' = ' + mixedHtml(res) : (res.n > res.d ? ' = ' + mixedHtml(res) : '')}.`,
        { ansShow: mixedHtml(res), mixed: true });
    }
    if (t === 2) {
      const res = R.make(A.n * B.n, A.d * B.d);
      return U.num(`<span class="big">${rh(A)} × ${rh(B)} = ?</span>`, R.str(res),
        `Multiply tops and bottoms: ${fr(A.n * B.n, A.d * B.d)}${(A.n * B.n) !== res.n ? ' = ' + rh(res) : ''}.`, { ansShow: mixedHtml(res), mixed: true });
    }
    if (t === 3) {
      const res = R.make(A.n * B.d, A.d * B.n);
      return U.num(`<span class="big">${rh(A)} ÷ ${rh(B)} = ?</span>`, R.str(res),
        `Keep, change, flip: ${rh(A)} × ${fr(B.d, B.n)} = ${fr(A.n * B.d, A.d * B.n)}${(A.n * B.d) !== res.n || res.n > res.d ? ' = ' + mixedHtml(res) : ''}.`, { ansShow: mixedHtml(res), mixed: true });
    }
    // mixed-number word problem
    const w = U.ri(1, 3), d = U.pick([2, 3, 4]), n = U.ri(1, d - 1);
    const per = R.make(w * d + n, d), k = U.ri(2, 4);
    const tot = R.make(per.n * k, per.d);
    const thing = U.pick([['A recipe needs', 'cups of flour', 'batches'], ['Each lap of the trail is', 'miles', 'laps'], ['Each ribbon is', 'feet long', 'ribbons']]);
    return U.num(`${thing[0]} <b>${mixedHtml(per)}</b> ${thing[1]}. How much for <b>${k}</b> ${thing[2]}?`, R.str(tot),
      `${mixedHtml(per)} = ${rh(per)}. ${rh(per)} × ${k} = ${rh(tot)} = ${mixedHtml(tot)}.`, { ansShow: mixedHtml(tot), mixed: true });
  };

  // ------------------------------------------- expressions & equations
  M.expr = function () {
    const t = U.ri(0, 4);
    if (t === 0) {
      const x = U.ri(2, 9), a = U.ri(2, 9), b = U.ri(1, 15), form = U.ri(0, 2);
      if (form === 0) return U.num(`Evaluate <b>${a}<i>x</i> + ${b}</b> when <i>x</i> = ${x}.`, a * x + b, `Replace x with ${x}: ${a} × ${x} + ${b} = ${a * x} + ${b} = ${a * x + b}.`);
      if (form === 1) { const c = U.ri(1, x - 1) || 1; return U.num(`Evaluate <b>${a}(<i>x</i> − ${c})</b> when <i>x</i> = ${x}.`, a * (x - c), `Parentheses first: ${x} − ${c} = ${x - c}. Then ${a} × ${x - c} = ${a * (x - c)}.`); }
      return U.num(`Evaluate <b><i>x</i><sup>2</sup> + ${b}</b> when <i>x</i> = ${x}.`, x * x + b, `${x}<sup>2</sup> = ${x} × ${x} = ${x * x}. Then ${x * x} + ${b} = ${x * x + b}.`);
    }
    if (t === 1) {
      const k = U.ri(2, 9);
      const w = U.pick([
        [`${k} less than a number <i>n</i>`, `<i>n</i> − ${k}`, [`${k} − <i>n</i>`, `${k}<i>n</i>`, `<i>n</i> + ${k}`], '"Less than" flips the order: start with n, then subtract.'],
        [`the product of ${k} and <i>y</i>`, `${k}<i>y</i>`, [`${k} + <i>y</i>`, `<i>y</i> ÷ ${k}`, `<i>y</i> − ${k}`], 'Product means multiply.'],
        [`a number <i>n</i> divided by ${k}`, `<i>n</i> ÷ ${k}`, [`${k} ÷ <i>n</i>`, `${k}<i>n</i>`, `<i>n</i> − ${k}`], 'The number comes first, then divide by the other.'],
        [`twice a number <i>n</i>, plus ${k}`, `2<i>n</i> + ${k}`, [`2(<i>n</i> + ${k})`, `<i>n</i> + 2 + ${k}`, `${k}<i>n</i> + 2`], 'Twice means 2 times. Then add.'],
        [`${k} more than 3 times a number <i>x</i>`, `3<i>x</i> + ${k}`, [`${k}<i>x</i> + 3`, `3(<i>x</i> + ${k})`, `3<i>x</i> − ${k}`], '"3 times x" is 3x; "more than" adds.'],
        [`the sum of <i>a</i> and ${k}, times 4`, `4(<i>a</i> + ${k})`, [`4<i>a</i> + ${k}`, `<i>a</i> + 4 × ${k}`, `4 + <i>a</i> + ${k}`], 'Find the sum first (parentheses), then multiply.'],
      ]);
      return U.mc(`Which expression means: <b>${w[0]}</b>?`, w[1], w[2], w[3]);
    }
    if (t === 2) { // one-step equations
      const x = U.ri(-6, 15) || 4, a = U.ri(2, 12), f = U.ri(0, 3);
      if (f === 0) return U.num(`Solve: <b><i>x</i> + ${a} = ${x + a}</b>. What is <i>x</i>?`, x, `Subtract ${a} from both sides: x = ${x + a} − ${a} = ${sn(x)}.`);
      if (f === 1) return U.num(`Solve: <b><i>x</i> − ${a} = ${sn(x - a)}</b>. What is <i>x</i>?`, x, `Add ${a} to both sides: x = ${sn(x - a)} + ${a} = ${sn(x)}.`);
      if (f === 2) return U.num(`Solve: <b>${a}<i>x</i> = ${sn(a * x)}</b>. What is <i>x</i>?`, x, `Divide both sides by ${a}: x = ${sn(a * x)} ÷ ${a} = ${sn(x)}.`);
      return U.num(`Solve: <b><i>x</i> ÷ ${a} = ${sn(x)}</b>. What is <i>x</i>?`, x * a, `Multiply both sides by ${a}: x = ${sn(x)} × ${a} = ${sn(x * a)}.`);
    }
    if (t === 3) {
      const a = U.ri(10, 30), b = U.ri(2, 6), c = U.ri(2, 6), d = U.ri(1, 9);
      return U.num(`<span class="big">${a} − ${b} × ${c} + ${d} = ?</span>`, a - b * c + d, `Multiply first: ${b} × ${c} = ${b * c}. Then left to right: ${a} − ${b * c} = ${a - b * c}, then + ${d} = ${a - b * c + d}.`);
    }
    const a = U.ri(2, 6), b = U.ri(2, 9);
    return U.mc(`Which expression is equivalent to <b>${a}(<i>x</i> + ${b})</b>?`, `${a}<i>x</i> + ${a * b}`, [`${a}<i>x</i> + ${b}`, `<i>x</i> + ${a * b}`, `${a + b}<i>x</i>`],
      `Distribute: ${a} × x + ${a} × ${b} = ${a}x + ${a * b}.`);
  };
})();
