/* Algebra 1 generators, unit order: U1 equations/inequalities, U2 linear equations,
   U3 linear functions + data, U4 systems. Every call returns one fresh item. */
(function () {
  'use strict';
  const KS = window.KS; const U = KS.util, R = KS.rat;
  const A = KS.gen.alg1 = {};
  const sn = U.sn, pn = U.pn, fr = (n, d) => U.frHtml(n, d), rh = r => R.html(r);
  const X = '<i>x</i>', Y = '<i>y</i>';

  function coef(r, v) {
    if (r.n === 0) return '';
    const neg = r.n < 0, an = Math.abs(r.n);
    const c = r.d === 1 ? (an === 1 ? '' : String(an)) : fr(an, r.d);
    return (neg ? '−' : '') + c + `<i>${v}</i>`;
  }
  function lin(m, b, v) {
    m = typeof m === 'number' ? R.make(m) : m; b = typeof b === 'number' ? R.make(b) : b;
    const t1 = coef(m, v || 'x');
    if (!t1) return rh(b);
    if (b.n === 0) return t1;
    return t1 + (b.n < 0 ? ' − ' : ' + ') + rh(R.make(Math.abs(b.n), b.d));
  }
  const yeq = (m, b) => `${Y} = ${lin(m, b)}`;
  const pt = (x, y) => `(${sn(x)}, ${sn(y)})`;
  const nz = (lo, hi) => { let v = 0; while (!v) v = U.ri(lo, hi); return v; };

  // ------------------------------------------------- U1 solving equations
  A.solve = function () {
    const t = U.ri(0, 3), x = U.ri(-9, 9);
    if (t === 0) {
      const a = nz(-9, 9), b = U.ri(-15, 15), c = a * x + b;
      return U.num(`Solve for ${X}: <span class="big">${lin(a, b)} = ${sn(c)}</span>`, x,
        `${b ? `${b > 0 ? 'Subtract' : 'Add'} ${Math.abs(b)} on both sides: ${coef(R.make(a), 'x')} = ${sn(c - b)}. ` : ''}Divide by ${sn(a)}: x = ${sn(x)}.`);
    }
    if (t === 1) {
      const a = nz(-6, 6), b = nz(-8, 8), c = a * (x + b);
      return U.num(`Solve for ${X}: <span class="big">${sn(a)}(${lin(1, b)}) = ${sn(c)}</span>`, x,
        `Divide both sides by ${sn(a)}: x ${b > 0 ? '+' : '−'} ${Math.abs(b)} = ${sn(c / a)}. Then x = ${sn(x)}. (Or distribute first: ${lin(a, a * b)} = ${sn(c)}.)`);
    }
    if (t === 2) {
      let a = nz(-8, 8), c = nz(-8, 8); if (a === c) c = a + U.pick([2, -3]);
      const b = U.ri(-12, 12), d = (a - c) * x + b;
      return U.num(`Solve for ${X}: <span class="big">${lin(a, b)} = ${lin(c, d)}</span>`, x,
        `Get the x terms on one side: ${lin(a - c, b)} = ${sn(d)}. Then ${coef(R.make(a - c), 'x')} = ${sn(d - b)}, so x = ${sn(x)}.`);
    }
    const a = U.ri(2, 5), b = U.ri(1, 6), kind = U.ri(0, 2);
    const left = `${a}(${lin(1, b)})`;
    const right = kind === 0 ? lin(a, a * b) : kind === 1 ? lin(a, a * b + U.pick([1, 2, -1, -3])) : lin(a + 1, a * b);
    const ans = ['Infinitely many solutions', 'No solution', 'One solution'][kind];
    return { kind: 'mc', html: true, keepOrder: true, q: `How many solutions does this equation have?<br><span class="big">${left} = ${right}</span>`,
      choices: ['One solution', 'No solution', 'Infinitely many solutions'], answer: ['One solution', 'No solution', 'Infinitely many solutions'].indexOf(ans),
      explain: `Distribute: ${lin(a, a * b)} = ${right}. ` + (kind === 0 ? 'Both sides are identical, so every x works.' : kind === 1 ? 'Same x term but different constants: it can never be true.' : 'Different x coefficients, so there is exactly one x that works.') };
  };

  // --------------------------------------------------------- inequalities
  const S = { '<': '&lt;', '>': '&gt;', '<=': '≤', '>=': '≥' };
  const flip = { '<': '>', '>': '<', '<=': '>=', '>=': '<=' };
  A.ineq = function () {
    const a = nz(-6, 6), x0 = U.ri(-8, 8), b = U.ri(-12, 12), c = a * x0 + b;
    const op = U.pick(['<', '>', '<=', '>=']);
    const sol = a < 0 ? flip[op] : op;
    const correct = `${X} ${S[sol]} ${sn(x0)}`;
    const wrongs = [`${X} ${S[a < 0 ? op : flip[op]]} ${sn(x0)}`, `${X} ${S[sol]} ${sn(-x0)}`, `${X} ${S[op.length === 2 ? op[0] : op + '=']} ${sn(x0)}`];
    if (x0 === 0) wrongs[1] = `${X} ${S[sol]} ${sn(c - b === 0 ? 1 : c - b)}`;
    return U.mc(`Solve: <span class="big">${lin(a, b)} ${S[op]} ${sn(c)}</span>`, correct, wrongs,
      `${b ? `${b > 0 ? 'Subtract' : 'Add'} ${Math.abs(b)}: ${coef(R.make(a), 'x')} ${S[op]} ${sn(c - b)}. ` : ''}Divide by ${sn(a)}.` +
      (a < 0 ? ' <b>Dividing by a negative flips the inequality sign.</b>' : ' Dividing by a positive keeps the sign.') + ` So ${correct}.`);
  };

  // ------------------------------------------------------ literal equations
  const LIT = [
    ['<i>A</i> = <i>lw</i>', '<i>w</i>', '<i>w</i> = <i>A</i> ÷ <i>l</i>', ['<i>w</i> = <i>A</i> − <i>l</i>', '<i>w</i> = <i>l</i> ÷ <i>A</i>', '<i>w</i> = <i>Al</i>'], 'Divide both sides by l.'],
    ['<i>d</i> = <i>rt</i>', '<i>t</i>', '<i>t</i> = <i>d</i> ÷ <i>r</i>', ['<i>t</i> = <i>dr</i>', '<i>t</i> = <i>r</i> ÷ <i>d</i>', '<i>t</i> = <i>d</i> − <i>r</i>'], 'Divide both sides by r.'],
    ['<i>P</i> = 2<i>l</i> + 2<i>w</i>', '<i>l</i>', '<i>l</i> = (<i>P</i> − 2<i>w</i>) ÷ 2', ['<i>l</i> = <i>P</i> − 2<i>w</i>', '<i>l</i> = (<i>P</i> + 2<i>w</i>) ÷ 2', '<i>l</i> = 2<i>P</i> − 2<i>w</i>'], 'Subtract 2w, then divide by 2.'],
    ['<i>y</i> = <i>mx</i> + <i>b</i>', '<i>x</i>', '<i>x</i> = (<i>y</i> − <i>b</i>) ÷ <i>m</i>', ['<i>x</i> = <i>y</i> ÷ <i>m</i> − <i>b</i>', '<i>x</i> = (<i>y</i> + <i>b</i>) ÷ <i>m</i>', '<i>x</i> = <i>m</i>(<i>y</i> − <i>b</i>)'], 'Subtract b first, then divide everything by m.'],
    ['<i>ax</i> + <i>by</i> = <i>c</i>', '<i>y</i>', '<i>y</i> = (<i>c</i> − <i>ax</i>) ÷ <i>b</i>', ['<i>y</i> = (<i>c</i> + <i>ax</i>) ÷ <i>b</i>', '<i>y</i> = <i>c</i> − <i>ax</i> ÷ <i>b</i>', '<i>y</i> = <i>b</i>(<i>c</i> − <i>ax</i>)'], 'Subtract ax, then divide the whole right side by b.'],
    ['<i>C</i> = 2π<i>r</i>', '<i>r</i>', '<i>r</i> = <i>C</i> ÷ (2π)', ['<i>r</i> = 2π<i>C</i>', '<i>r</i> = <i>C</i> − 2π', '<i>r</i> = 2<i>C</i> ÷ π'], 'Divide both sides by 2π.'],
    ['<i>V</i> = <i>lwh</i>', '<i>h</i>', '<i>h</i> = <i>V</i> ÷ (<i>lw</i>)', ['<i>h</i> = <i>V</i> − <i>lw</i>', '<i>h</i> = <i>lwV</i>', '<i>h</i> = <i>lw</i> ÷ <i>V</i>'], 'Divide both sides by lw.'],
    ['<i>F</i> = (9/5)<i>C</i> + 32', '<i>C</i>', '<i>C</i> = (5/9)(<i>F</i> − 32)', ['<i>C</i> = (5/9)<i>F</i> − 32', '<i>C</i> = (9/5)(<i>F</i> − 32)', '<i>C</i> = (5/9)<i>F</i> + 32'], 'Subtract 32, then multiply by 5/9 (the reciprocal of 9/5).'],
    ['<i>A</i> = ½<i>bh</i>', '<i>h</i>', '<i>h</i> = 2<i>A</i> ÷ <i>b</i>', ['<i>h</i> = <i>A</i> ÷ (2<i>b</i>)', '<i>h</i> = 2<i>Ab</i>', '<i>h</i> = <i>A</i> − ½<i>b</i>'], 'Multiply both sides by 2, then divide by b.'],
    ['<i>I</i> = <i>prt</i>', '<i>r</i>', '<i>r</i> = <i>I</i> ÷ (<i>pt</i>)', ['<i>r</i> = <i>Ipt</i>', '<i>r</i> = <i>pt</i> ÷ <i>I</i>', '<i>r</i> = <i>I</i> − <i>pt</i>'], 'Divide both sides by pt.'],
  ];
  A.literal = function () {
    if (Math.random() < 0.35) { // standard form to slope-intercept, a concrete one
      const B = U.pick([2, 3, 4, 5]), Acoef = nz(-6, 6), k = U.ri(1, 4) * B;
      const m = R.make(-Acoef, B), b = R.make(k, B);
      return U.mc(`Solve for ${Y}: <span class="big">${lin(Acoef, 0)} + ${B}${Y} = ${k}</span>`, yeq(m, b),
        [yeq(R.make(Acoef, B), b), yeq(R.make(-Acoef, 1), R.make(k, 1)), yeq(m, R.make(k, 1))],
        `${Acoef < 0 ? 'Add ' + lin(-Acoef, 0) : 'Subtract ' + lin(Acoef, 0)} on both sides: ${B}y = ${lin(-Acoef, k)}. Divide every term by ${B}: ${yeq(m, b)}.`);
    }
    const f = U.pick(LIT);
    return U.mc(`Solve ${f[0]} for ${f[1]}.`, f[2], f[3], f[4]);
  };

  // ------------------------------------------------------------- slope
  A.slope = function () {
    const t = U.ri(0, 4);
    if (t === 0) {
      const x1 = U.ri(-6, 6), y1 = U.ri(-6, 6); let x2 = U.ri(-6, 6); if (x2 === x1) x2 = x1 + U.ri(1, 4);
      const y2 = U.ri(-6, 6), m = R.make(y2 - y1, x2 - x1);
      return U.num(`What is the slope of the line through <b>${pt(x1, y1)}</b> and <b>${pt(x2, y2)}</b>?`, R.str(m),
        `Slope = (y₂ − y₁) ÷ (x₂ − x₁) = (${sn(y2)} − ${pn(y1)}) ÷ (${sn(x2)} − ${pn(x1)}) = ${sn(y2 - y1)} ÷ ${sn(x2 - x1)} = ${rh(m)}.`, { ansShow: rh(m) });
    }
    if (t === 1) {
      const run = U.ri(1, 4), rise = nz(-4, 4), m = R.make(rise, run);
      const x1 = U.ri(-4, 0), y1 = U.ri(-3, 3), x2 = x1 + run, y2 = y1 + rise;
      const b = R.make(y1 * run - rise * x1, run);
      const vis = KS.svg.plane({ min: -7, max: 7, lines: [{ m: rise / run, b: b.n / b.d }], points: [{ x: x1, y: y1 }, { x: x2, y: y2 }] });
      return U.num('What is the slope of this line?', R.str(m),
        `From ${pt(x1, y1)} to ${pt(x2, y2)}: rise ${sn(rise)}, run ${run}. Slope = ${sn(rise)} ÷ ${run} = ${rh(m)}.${rise < 0 ? ' The line goes down to the right, so the slope is negative.' : ''}`, { visual: vis, ansShow: rh(m) });
    }
    if (t === 2) {
      const m = R.make(nz(-5, 5), U.ri(1, 5)), perp = Math.random() < 0.6;
      const ans = perp ? R.make(-m.d, m.n) : m;
      return U.num(`A line has slope <b>${rh(m)}</b>. What is the slope of a line <b>${perp ? 'perpendicular' : 'parallel'}</b> to it?`, R.str(ans),
        perp ? `Perpendicular slopes are opposite reciprocals: flip ${rh(m)} and change the sign to get ${rh(ans)}.` : 'Parallel lines have the same slope.', { ansShow: rh(ans) });
    }
    if (t === 3) {
      const k = U.pick([-7, -6, -5, -4, -3, -2, -1, 2, 3, 4, 5, 6, 7]), vert = Math.random() < 0.5;
      return { kind: 'mc', html: true, keepOrder: true, q: `What is the slope of the line <b>${vert ? X : Y} = ${sn(k)}</b>?`, choices: ['0', 'Undefined', sn(k), '1'], answer: vert ? 1 : 0,
        explain: vert ? `x = ${sn(k)} is a vertical line. The run is 0, and you can't divide by 0, so the slope is undefined.` : `y = ${sn(k)} is a horizontal line. The rise is 0, so the slope is 0.` };
    }
    const m = nz(-4, 5), b = U.ri(-5, 9), x0 = U.ri(0, 2), step = U.ri(1, 3);
    const xs = [0, 1, 2, 3].map(i => x0 + i * step), ys = xs.map(x => m * x + b);
    return U.num(`What is the rate of change?<br><table class="stats" style="width:auto;margin-top:8px"><tr><th>x</th>${xs.map(x => `<td>${sn(x)}</td>`).join('')}</tr><tr><th>y</th>${ys.map(y => `<td>${sn(y)}</td>`).join('')}</tr></table>`, m,
      `Each time x goes up ${step}, y changes by ${sn(m * step)}. Rate = ${sn(m * step)} ÷ ${step} = ${sn(m)}.`);
  };

  // ------------------------------------------------- forms of a line (U2)
  A.forms = function () {
    const t = U.ri(0, 4);
    if (t === 0) { // slope and point
      const m = nz(-5, 5), x1 = nz(-5, 5), y1 = U.ri(-8, 8), b = y1 - m * x1;
      return U.mc(`Which equation is the line with slope <b>${sn(m)}</b> through <b>${pt(x1, y1)}</b>?`, yeq(m, b),
        [yeq(m, y1), yeq(m, y1 + m * x1), yeq(-m, b), yeq(x1, y1)],
        `Use y = mx + b: ${sn(y1)} = ${sn(m)}(${sn(x1)}) + b, so ${sn(y1)} = ${sn(m * x1)} + b and b = ${sn(b)}. The line is ${yeq(m, b)}.`);
    }
    if (t === 1) { // two points
      const m = nz(-4, 4), b = U.ri(-6, 6), xa = U.ri(-4, 0), xb = xa + U.ri(1, 4);
      const ya = m * xa + b, yb = m * xb + b;
      return U.mc(`Which equation is the line through <b>${pt(xa, ya)}</b> and <b>${pt(xb, yb)}</b>?`, yeq(m, b),
        [yeq(-m, b), yeq(m, -b), yeq(R.make(1, m === 1 || m === -1 ? 2 * m : m), b), yeq(m, ya)],
        `Slope = (${sn(yb)} − ${pn(ya)}) ÷ (${sn(xb)} − ${pn(xa)}) = ${sn(m)}. Then plug in a point to get b = ${sn(b)}.`);
    }
    if (t === 2) { // intercepts of standard form
      const a = nz(-6, 6), bb = nz(-6, 6), xi = nz(-6, 6), c = a * xi;
      if (c % bb !== 0) return A.forms();
      const which = Math.random() < 0.5 ? 'x' : 'y';
      const ans = which === 'x' ? xi : c / bb;
      return U.num(`What is the <b>${which}-intercept</b> of <b>${lin(a, 0)} ${bb < 0 ? '−' : '+'} ${Math.abs(bb) === 1 ? '' : Math.abs(bb)}${Y} = ${sn(c)}</b>?`, ans,
        which === 'x' ? `At the x-intercept, y = 0: ${sn(a)}x = ${sn(c)}, so x = ${sn(xi)}.` : `At the y-intercept, x = 0: ${sn(bb)}y = ${sn(c)}, so y = ${sn(c / bb)}.`);
    }
    if (t === 3) { // point-slope reading
      const m = nz(-6, 6), x1 = nz(-6, 6), y1 = nz(-6, 6);
      const eq = `${Y} ${y1 < 0 ? '+' : '−'} ${Math.abs(y1)} = ${sn(m)}(${X} ${x1 < 0 ? '+' : '−'} ${Math.abs(x1)})`;
      return U.mc(`The line <b>${eq}</b> has which slope and point?`, `slope ${sn(m)}, point ${pt(x1, y1)}`,
        [`slope ${sn(m)}, point ${pt(-x1, -y1)}`, `slope ${sn(m)}, point ${pt(y1, x1)}`, `slope ${sn(-m)}, point ${pt(x1, y1)}`],
        `Point-slope form is y − y₁ = m(x − x₁). The signs inside flip: the point is ${pt(x1, y1)} and the slope is ${sn(m)}.`);
    }
    // parallel / perpendicular through a point
    const m = nz(-4, 4), b0 = U.ri(-6, 6), x1 = nz(-4, 4), perp = Math.random() < 0.5;
    const ms = perp ? R.make(-1, m) : R.make(m);
    const y1v = perp ? m * U.ri(-2, 2) : U.ri(-6, 6); // keep b nice for perpendicular
    const xp = perp ? m * U.ri(-2, 2) || m : x1;
    const bR = R.make(y1v * ms.d - ms.n * xp, ms.d);
    return U.mc(`Which line is <b>${perp ? 'perpendicular' : 'parallel'}</b> to <b>${yeq(m, b0)}</b> and passes through <b>${pt(xp, y1v)}</b>?`, yeq(ms, bR),
      [yeq(perp ? R.make(m) : R.make(-m), bR), yeq(ms, R.make(b0)), yeq(perp ? R.make(1, m) : R.make(m), R.make(y1v))],
      `${perp ? `Perpendicular slope = opposite reciprocal of ${sn(m)} = ${rh(ms)}.` : `Parallel slope = ${sn(m)}.`} Plug in ${pt(xp, y1v)} to find b = ${rh(bR)}.`);
  };

  // ------------------------------------------------------ functions (U3)
  A.func = function () {
    const t = U.ri(0, 4);
    if (t === 0) {
      const m = nz(-6, 6), b = U.ri(-10, 10), x = U.ri(-5, 6);
      return U.num(`If <b><i>f</i>(${X}) = ${lin(m, b)}</b>, what is <b><i>f</i>(${sn(x)})</b>?`, m * x + b, `Replace x with ${sn(x)}: ${sn(m)}(${sn(x)}) ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${sn(m * x + b)}.`);
    }
    if (t === 1) {
      const m = nz(-6, 6), b = U.ri(-10, 10), x = U.ri(-6, 8), k = m * x + b;
      return U.num(`If <b><i>f</i>(${X}) = ${lin(m, b)}</b>, for what value of ${X} does <b><i>f</i>(${X}) = ${sn(k)}</b>?`, x, `Set ${lin(m, b)} = ${sn(k)}. Then ${sn(m)}x = ${sn(k - b)}, so x = ${sn(x)}.`);
    }
    if (t === 2) {
      const m = nz(-6, 6), z = U.ri(-6, 6), b = -m * z;
      return U.num(`What is the <b>zero</b> of <b><i>f</i>(${X}) = ${lin(m, b)}</b>?`, z, `The zero is where f(x) = 0: ${lin(m, b)} = 0, so x = ${sn(z)}. It's the x-intercept.`);
    }
    if (t === 3) {
      const m = nz(-5, 5), b = U.ri(-8, 8), x1 = U.ri(0, 3), x2 = x1 + U.ri(2, 4), x3 = x2 + U.ri(2, 4);
      return U.num(`<i>f</i> is a linear function. <b><i>f</i>(${x1}) = ${sn(m * x1 + b)}</b> and <b><i>f</i>(${x2}) = ${sn(m * x2 + b)}</b>. What is <b><i>f</i>(${x3})</b>?`, m * x3 + b,
        `Slope = (${sn(m * x2 + b)} − ${pn(m * x1 + b)}) ÷ (${x2} − ${x1}) = ${sn(m)}. From x = ${x2} to ${x3} is ${x3 - x2} more, so add ${sn(m)} × ${x3 - x2} = ${sn(m * (x3 - x2))}: f(${x3}) = ${sn(m * x3 + b)}.`);
    }
    const k = U.ri(2, 6);
    const f = U.pick([
      [`${Y} = ${X} + ${k}`, `It is the graph of y = x shifted up ${k}.`, [`It is shifted down ${k}.`, `It is ${k} times steeper.`, `It is shifted right ${k}.`], `Adding ${k} raises every y-value by ${k}.`],
      [`${Y} = ${X} − ${k}`, `It is the graph of y = x shifted down ${k}.`, [`It is shifted up ${k}.`, `It is less steep.`, `It is shifted left ${k}.`], `Subtracting ${k} lowers every y-value by ${k}.`],
      [`${Y} = ${k}${X}`, 'It is steeper than y = x.', ['It is less steep than y = x.', `It is shifted up ${k}.`, 'It is flipped upside down.'], `A slope of ${k} is bigger than 1, so the line rises faster.`],
      [`${Y} = −${X}`, 'It is y = x reflected (it goes down to the right).', ['It is shifted down 1.', 'It is steeper than y = x.', 'It is the same line as y = x.'], 'A negative slope makes the line decrease.'],
      [`${Y} = ${fr(1, k)}${X}`, 'It is less steep than y = x.', ['It is steeper than y = x.', `It is shifted down ${k}.`, 'It is reflected over the x-axis.'], `A slope between 0 and 1 rises more slowly.`],
    ]);
    return U.mc(`How does the graph of <b>${f[0]}</b> compare to the graph of <b>${Y} = ${X}</b>?`, f[1], f[2], f[3]);
  };

  // ------------------------------- real-world linear models ("Performance Matters")
  const CTX = [
    { s: (b, m) => `A gym charges a <b>$${b}</b> sign-up fee plus <b>$${m} per month</b>.`, f: 'C', v: 'm', unit: 'month', units: 'months', out: 'total cost in dollars', mi: [10, 25], bi: [20, 60], inc: true, mMean: 'the cost for each month', bMean: 'the one-time sign-up fee', dollars: true },
    { s: (b, m) => `A plumber charges a <b>$${b}</b> service fee plus <b>$${m} per hour</b>.`, f: 'C', v: 'h', unit: 'hour', units: 'hours', out: 'total cost in dollars', mi: [40, 90], bi: [50, 120], inc: true, mMean: 'the cost for each hour of work', bMean: 'the service fee charged before any work', dollars: true },
    { s: (b, m) => `You have <b>$${b}</b> saved and add <b>$${m} each week</b>.`, f: 'S', v: 'w', unit: 'week', units: 'weeks', out: 'money saved in dollars', mi: [5, 20], bi: [10, 80], inc: true, mMean: 'the amount added each week', bMean: 'the money you started with', dollars: true },
    { s: (b, m) => `A plant is <b>${b} cm</b> tall and grows <b>${m} cm each week</b>.`, f: 'H', v: 'w', unit: 'week', units: 'weeks', out: 'height in cm', mi: [2, 6], bi: [5, 20], inc: true, mMean: 'how many cm the plant grows each week', bMean: 'the plant’s height at the start' },
    { s: (b, m) => `A candle is <b>${b} cm</b> tall and burns down <b>${m} cm each hour</b>.`, f: 'L', v: 't', unit: 'hour', units: 'hours', out: 'height in cm', mi: [2, 4], bi: [20, 36], inc: false, mMean: 'how many cm the candle loses each hour', bMean: 'the candle’s height before it is lit', zero: 'the time when the candle has burned all the way down' },
    { s: (b, m) => `A water tank holds <b>${b} gallons</b> and drains <b>${m} gallons per minute</b>.`, f: 'W', v: 't', unit: 'minute', units: 'minutes', out: 'gallons left', mi: [4, 12], bi: [120, 240], inc: false, mMean: 'the gallons that drain out each minute', bMean: 'the amount of water at the start', zero: 'the time when the tank is empty' },
    { s: (b, m) => `A phone has <b>${b}%</b> battery and loses <b>${m}% each hour</b> of gaming.`, f: 'B', v: 'h', unit: 'hour', units: 'hours', out: 'battery percent', mi: [8, 20], bi: [80, 100], inc: false, mMean: 'the battery percent used each hour', bMean: 'the battery percent at the start', zero: 'the time when the battery hits 0%' },
  ];
  A.context = function () {
    const c = U.pick(CTX);
    let m = U.ri(c.mi[0], c.mi[1]), b = U.ri(c.bi[0], c.bi[1]);
    if (!c.inc) {
      const ns = [];
      for (let n0 = 2; n0 <= 60; n0++) { const v = m * n0; if (v >= c.bi[0] && v <= c.bi[1]) ns.push(n0); }
      if (!ns.length) return A.context();
      b = m * U.pick(ns);
    }
    const slope = c.inc ? m : -m;
    const fx = `<i>${c.f}</i>(<i>${c.v}</i>) = ${lin(slope, b, c.v)}`;
    const t = U.ri(0, 5);
    const pre = c.s(b, m) + ` The function <b>${fx}</b> gives the ${c.out} after <i>${c.v}</i> ${c.units}.<br>`;
    if (t === 0) {
      return U.mc(c.s(b, m) + ` Which function gives the ${c.out} after <i>${c.v}</i> ${c.units}?`, fx,
        [`<i>${c.f}</i>(<i>${c.v}</i>) = ${lin(b, slope, c.v)}`, `<i>${c.f}</i>(<i>${c.v}</i>) = ${lin(-slope, b, c.v)}`, `<i>${c.f}</i>(<i>${c.v}</i>) = ${lin(slope + b, 0, c.v)}`],
        `The rate (${sn(slope)} per ${c.unit}) multiplies ${c.v}. The starting amount (${b}) is the constant.`);
    }
    if (t === 1) {
      return U.mc(pre + `What does the <b>${sn(slope)}</b> represent?`, c.mMean, [c.bMean, `the ${c.out} after 1 ${c.unit}`, `the number of ${c.units}`],
        `The slope is the rate of change: ${c.mMean} (${m} per ${c.unit}).`);
    }
    if (t === 2) {
      return U.mc(pre + `What does the <b>${b}</b> represent?`, c.bMean, [c.mMean, `the ${c.out} after ${b} ${c.units}`, `the most ${c.units} possible`],
        `The constant is the value when ${c.v} = 0, the starting point: ${c.bMean}.`);
    }
    if (t === 3) {
      const maxN = c.inc ? 12 : Math.floor(b / m) - 1;
      const n = U.ri(2, Math.max(2, maxN));
      return U.num(pre + `What is <b><i>${c.f}</i>(${n})</b>?`, slope * n + b,
        `${c.f}(${n}) = ${sn(slope)}(${n}) + ${b} = ${sn(slope * n)} + ${b} = ${slope * n + b}. That's the ${c.out} after ${n} ${c.units}.`, { unit: c.dollars ? 'dollars' : '' });
    }
    if (t === 4) {
      const n = c.inc ? U.ri(3, 12) : U.ri(1, Math.max(1, Math.floor(b / m) - 1)), T = slope * n + b;
      return U.num(pre + `After how many ${c.units} will the ${c.out.replace(/ in .*/, '')} be <b>${T}</b>?`, n,
        `Set ${lin(slope, b, c.v)} = ${T}. ${c.inc ? `Subtract ${b}: ${m}${c.v} = ${T - b}` : `Subtract ${b}: −${m}${c.v} = ${T - b}`}. Divide: ${c.v} = ${n}.`, { unit: c.units });
    }
    if (c.inc) {
      return U.mc(pre + `Which is a reasonable <b>domain</b>?`, `whole numbers of ${c.units} ≥ 0`, [`all real numbers, including negatives`, `only numbers ${'≥'} ${b}`, `only the number ${m}`],
        `You can't have a negative number of ${c.units}, and the ${c.v} counts whole ${c.units} starting at 0.`);
    }
    const end = b / m;
    return U.mc(pre + `What does the <b>zero</b> of the function mean?`, c.zero, [c.bMean, c.mMean, `the ${c.out} after 1 ${c.unit}`],
      `The zero is when ${c.f}(${c.v}) = 0. Here that happens at ${c.v} = ${end % 1 ? end.toFixed(1) : end}: ${c.zero}.`);
  };

  // ------------------------------------------------- data & scatterplots (U3)
  A.data = function () {
    const t = U.ri(0, 4);
    if (t === 0) {
      const kind = U.pick(['positive', 'negative', 'none']);
      const ctx = { positive: ['Hours practiced', 'Free throws made'], negative: ['Outside temperature (°F)', 'Hot cocoa sold'], none: ['Shoe size', 'Quiz score'] }[kind];
      const pts = Array.from({ length: 12 }, () => {
        const x = U.ri(1, 10);
        const y = kind === 'positive' ? 10 + 7 * x + U.ri(-9, 9) : kind === 'negative' ? 92 - 7 * x + U.ri(-9, 9) : U.ri(8, 92);
        return [x, Math.max(2, Math.min(98, y))];
      });
      const vis = KS.svg.scatter({ points: pts, xmax: 10, ymax: 100, xLabel: ctx[0], yLabel: ctx[1] });
      return { kind: 'mc', html: true, keepOrder: true, visual: vis, q: 'What kind of correlation does this scatterplot show?',
        choices: ['Positive correlation', 'Negative correlation', 'No correlation'], answer: ['positive', 'negative', 'none'].indexOf(kind),
        explain: kind === 'positive' ? 'As x goes up, y tends to go up.' : kind === 'negative' ? 'As x goes up, y tends to go down.' : 'The points are scattered with no up or down trend.' };
    }
    if (t === 1) {
      const m = U.pick([2, 3, 4, 5, 1.5, 2.5]), b = U.ri(5, 20), x = U.ri(4, 12) * (m % 1 ? 2 : 1);
      const ctx = U.pick([['hours practiced', 'free throws made'], ['days', 'inches of plant growth'], ['minutes studied', 'quiz points'], ['weeks of training', 'push-ups in a row']]);
      const yv = m * x + b;
      return U.num(`The line of best fit for ${ctx[0]} (<i>x</i>) and ${ctx[1]} (<i>y</i>) is <b>${Y} = ${m}${X} + ${b}</b>. Predict ${ctx[1]} when <i>x</i> = ${x}.`, yv,
        `Plug in: ${m} × ${x} + ${b} = ${m * x} + ${b} = ${yv}.`);
    }
    if (t === 2) {
      const vars = [['favorite color', 'categorical'], ['height in inches', 'quantitative'], ['zip code', 'categorical'], ['number of pets', 'quantitative'], ['type of pet', 'categorical'],
        ['jersey number', 'categorical'], ['time to run a mile', 'quantitative'], ['eye color', 'categorical'], ['daily high temperature', 'quantitative'], ['favorite sport', 'categorical'], ['hours of sleep', 'quantitative'], ['phone brand', 'categorical']];
      const v = U.pick(vars);
      return { kind: 'mc', html: true, keepOrder: true, q: `Is <b>${v[0]}</b> categorical or quantitative data?`, choices: ['Categorical', 'Quantitative'], answer: v[1] === 'categorical' ? 0 : 1,
        explain: v[1] === 'categorical' ? `It names a group or label.${/zip|jersey/.test(v[0]) ? ' Even though it uses numbers, averaging them makes no sense.' : ''}` : 'It is a measured amount or count, so you can do math with it.' };
    }
    if (t === 3) {
      const c = U.pick([
        ['Ice cream sales and sunburns both go up in the summer.', 'No. Hot, sunny weather causes both.'],
        ['Kids with bigger shoe sizes tend to read at higher levels.', 'No. Older kids have bigger feet AND read better; age causes both.'],
        ['Towns with more firefighters have more fires.', 'No. Bigger towns have more fires AND more firefighters.'],
        ['Students who carry umbrellas are late more often.', 'No. Rainy days cause both umbrellas and slow traffic.'],
      ]);
      return U.mc(`${c[0]} Does one <b>cause</b> the other?`, c[1], ['Yes. A strong correlation proves one causes the other.', 'Yes, but only if the correlation is negative.', 'No, because they are not correlated at all.'],
        'Correlation is not causation. A third factor (a "lurking variable") can make two things rise and fall together.');
    }
    const lo = U.ri(5, 9), hi = lo + U.ri(4, 6), far = hi + U.ri(15, 30);
    return U.mc(`A scatterplot uses data from kids ages <b>${lo} to ${hi}</b>. Its best-fit line is used to predict a value for age <b>${far}</b>. How reliable is that prediction?`,
      'Not very reliable: it is far outside the data (extrapolation).', ['Very reliable: the line works for any age.', 'Very reliable, because the line is straight.', 'Not reliable, because predictions are never useful.'],
      'Predictions inside the data range (interpolation) are more trustworthy. Far outside the range, the pattern may not continue.');
  };

  // ----------------------------------------------------- systems (U4 preview)
  A.systems = function () {
    if (Math.random() < 0.35) {
      const m = nz(-4, 4), b = U.ri(-6, 6), kind = U.ri(0, 2);
      const l1 = yeq(m, b);
      const l2 = kind === 0 ? yeq(m, b + U.pick([2, -3, 4])) : kind === 1 ? `${2}${Y} = ${lin(2 * m, 2 * b)}` : yeq(m + U.pick([1, -2]), b);
      const ans = ['No solution', 'Infinitely many solutions', 'One solution'][kind];
      return { kind: 'mc', html: true, keepOrder: true, q: `How many solutions does this system have?<br><b>${l1}</b><br><b>${l2}</b>`,
        choices: ['One solution', 'No solution', 'Infinitely many solutions'], answer: ['One solution', 'No solution', 'Infinitely many solutions'].indexOf(ans),
        explain: kind === 0 ? 'Same slope, different y-intercepts: parallel lines never meet.' : kind === 1 ? 'Divide the second equation by 2: it is the same line, so every point works.' : 'Different slopes: the lines cross at exactly one point.' };
    }
    const x = U.ri(-5, 5), y = U.ri(-5, 5);
    const a1 = nz(-4, 4), b1 = nz(-3, 3), a2 = nz(-4, 4), b2 = nz(-3, 3);
    if (a1 * b2 === a2 * b1) return A.systems();
    const c1 = a1 * x + b1 * y, c2 = a2 * x + b2 * y;
    const eq = (a, b, c) => `${lin(a, 0)} ${b < 0 ? '−' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}${Y} = ${sn(c)}`;
    return U.mc(`Solve the system:<br><b>${eq(a1, b1, c1)}</b><br><b>${eq(a2, b2, c2)}</b>`, pt(x, y), [pt(y, x), pt(x, -y), pt(-x, y), pt(x + 1, y - 1)],
      `Check ${pt(x, y)}: ${sn(a1)}(${sn(x)}) + ${pn(b1)}(${sn(y)}) = ${sn(c1)} ✔ and ${sn(a2)}(${sn(x)}) + ${pn(b2)}(${sn(y)}) = ${sn(c2)} ✔. Use substitution or elimination to find it.`);
  };
})();
