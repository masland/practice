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
  // Rate m and start b for a context; decreasing ones start at a multiple of m so the zero is a whole number.
  function ctxNums(c) {
    const m = U.ri(c.mi[0], c.mi[1]);
    if (c.inc) return { m, b: U.ri(c.bi[0], c.bi[1]) };
    const ns = [];
    for (let n0 = 2; n0 <= 60; n0++) { const v = m * n0; if (v >= c.bi[0] && v <= c.bi[1]) ns.push(n0); }
    return ns.length ? { m, b: m * U.pick(ns) } : null;
  }
  A.context = function () {
    const c = U.pick(CTX), nums = ctxNums(c);
    if (!nums) return A.context();
    const m = nums.m, b = nums.b;
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

  // ================================================================ Unit 3 test prep
  // Built from the FCPS Algebra 1 (Honors) Unit 3 "Linear Functions" objectives: key features,
  // transformations of y = x, matching and comparing representations, scatterplots, honors extras.
  const U3 = {};
  const SL = [[1, 1], [2, 1], [3, 1], [-1, 1], [-2, 1], [-3, 1], [1, 2], [-1, 2], [3, 2], [-3, 2], [2, 3], [-2, 3]];
  const rs = r => R.str(r);
  const dec = v => sn(Math.round(v * 100) / 100);
  const cap = s => s[0].toUpperCase() + s.slice(1);
  const fx = (m, b, f, v) => `<i>${f || 'f'}</i>(<i>${v || 'x'}</i>) = ${lin(m, b, v)}`;
  const tbl = (xs, ys, xl, yl) => `<table class="stats" style="width:auto;margin-top:8px"><tr><th>${xl || X}</th>${xs.map(x => `<td>${sn(x)}</td>`).join('')}</tr><tr><th>${yl || Y}</th>${ys.map(y => `<td>${sn(y)}</td>`).join('')}</tr></table>`;
  const commas = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const tag = (o, sub) => Object.assign(o, { sub });

  // read an intercept off a graph
  U3.graphInt = function () {
    let m, z, b, g = 0;
    do { m = R.make(...U.pick(SL)); const k = nz(-3, 3); z = k * m.d; b = -m.n * k; } while ((Math.abs(z) > 6 || Math.abs(b) > 6) && ++g < 60);
    const vis = KS.svg.plane({ min: -7, max: 7, lines: [{ m: m.n / m.d, b }] });
    return tag(Math.random() < 0.5
      ? U.num('What is the <b>zero</b> (x-intercept) of the function graphed here?', z, `The zero is where the line crosses the x-axis (where y = 0). It crosses at (${sn(z)}, 0), so the zero is ${sn(z)}.`, { visual: vis })
      : U.num('What is the <b>y-intercept</b> of the function graphed here?', b, `The y-intercept is where the line crosses the y-axis (where x = 0). It crosses at (0, ${sn(b)}).`, { visual: vis }), 'Key features');
  };

  // ---- 1. key features: slope, y-intercept, zero, domain and range
  U3.features = function () {
    const t = U.ri(0, 3), S1 = 'Key features';
    if (t === 0) {
      const m = R.make(...U.pick(SL)), b = U.ri(-8, 8), ask = U.ri(0, 2), f = `<b>${fx(m, b)}</b>`;
      if (ask === 0) return tag(U.num(`What is the <b>slope</b> of ${f}?`, rs(m), `In f(x) = mx + b, the slope is m, the number multiplying x. Here m = ${rh(m)}.`, { ansShow: rh(m) }), S1);
      if (ask === 1) return tag(U.num(`What is the <b>y-intercept</b> of ${f}?`, b, `The y-intercept is f(0). When x = 0 the x term is 0, so f(0) = ${sn(b)}. The graph crosses the y-axis at (0, ${sn(b)}).`), S1);
      const z = R.make(-b * m.d, m.n);
      return tag(U.num(`What is the <b>zero</b> of ${f}?`, rs(z),
        `The zero is the x-value where f(x) = 0. Solve ${lin(m, b)} = 0. ${b ? `${b > 0 ? 'Subtract' : 'Add'} ${Math.abs(b)}: ${coef(m, 'x')} = ${sn(-b)}. ` : ''}` +
        `Divide by ${rh(m)}${m.d > 1 ? ` (the same as multiplying by ${rh(R.make(m.d, m.n))})` : ''}: x = ${rh(z)}. That is where the graph crosses the x-axis.`, { ansShow: rh(z) }), S1);
    }
    if (t === 1) return U3.graphInt();
    if (t === 2) { // from a table that does not start at x = 0
      const m = nz(-4, 4), x0 = U.ri(1, 3), step = U.ri(1, 2), askZ = Math.random() < 0.4, zv = U.ri(-4, 6);
      const b = askZ ? -m * zv : U.ri(-9, 9);
      const xs = [0, 1, 2, 3].map(i => x0 + i * step), ys = xs.map(x => m * x + b), y0 = ys[0];
      const rate = `The rate of change is ${sn(m * step)} ÷ ${step} = ${sn(m)}.`;
      if (askZ) return tag(U.num(`This table shows a linear function. What is its <b>zero</b>?${tbl(xs, ys)}`, zv,
        `${rate} To get from y = ${sn(y0)} to y = 0, x must change by ${sn(-y0)} ÷ ${pn(m)} = ${sn(-y0 / m)}. So the zero is x = ${x0} + ${pn(-y0 / m)} = ${sn(zv)}.`), S1);
      return tag(U.num(`This table shows a linear function. What is its <b>y-intercept</b>?${tbl(xs, ys)}`, b,
        `${rate} Work back to x = 0: y = ${sn(y0)} − ${pn(m)} × ${x0} = ${sn(b)}.`), S1);
    }
    const b = U.ri(-6, 6);
    if (Math.random() < 0.3) return tag(U.mc(`What is the <b>range</b> of <b>${fx(0, b)}</b>?`, `only ${Y} = ${sn(b)}`, ['all real numbers', `${Y} ≥ ${sn(b)}`, `${Y} ≤ ${sn(b)}`],
      `This is a horizontal line: every input gives ${sn(b)}, so the range is just ${sn(b)}. (The domain is still all real numbers.)`), S1);
    const m = nz(-5, 5), dom = Math.random() < 0.5;
    return tag(U.mc(`What is the <b>${dom ? 'domain' : 'range'}</b> of <b>${fx(m, b)}</b>?`, 'all real numbers',
      dom ? [`${X} ≥ 0`, `${X} ≥ ${sn(b)}`, 'only whole numbers', `−10 ≤ ${X} ≤ 10`] : [`${Y} ≥ ${sn(b)}`, `${Y} ≥ 0`, `only ${Y} = ${sn(b)}`, `${Y} ≤ ${sn(m)}`],
      dom ? 'With no real-world limits, any number can go in for x, so the domain is all real numbers.' : 'A slanted line keeps going up and down forever, so it reaches every y-value: the range is all real numbers.'), S1);
  };

  // ---- 1b. value AND meaning of slope, y-intercept or zero in a real-world context
  U3.meaning = function () {
    const c = U.pick(CTX), nums = ctxNums(c);
    if (!nums) return U3.meaning();
    const m = nums.m, b = nums.b, slope = c.inc ? m : -m;
    if (m === b) return U3.meaning();
    const pre = c.s(b, m) + ` So <b><i>${c.f}</i>(<i>${c.v}</i>) = ${lin(slope, b, c.v)}</b> gives the ${c.out} after <i>${c.v}</i> ${c.units}.<br>`;
    const V = (v, s) => `<b>${sn(v)}</b>: ${s}`;
    const ask = c.inc ? U.ri(0, 1) : U.ri(0, 2);
    if (ask === 2) {
      const z = b / m;
      return tag(U.mc(pre + 'What is the <b>zero</b> of the function, and what does it mean?', V(z, c.zero), [V(b, c.zero), V(z, c.bMean), V(m, c.mMean)],
        `Set ${c.f}(${c.v}) = 0: ${b} − ${m}${c.v} = 0, so ${c.v} = ${b} ÷ ${m} = ${z}. The zero is ${c.zero}.`), 'Meaning in context');
    }
    if (ask === 1) return tag(U.mc(pre + 'What is the <b>y-intercept</b>, and what does it mean?', V(b, c.bMean), [V(m, c.bMean), V(b, c.mMean), V(slope + b, c.bMean)],
      `The y-intercept is the value when ${c.v} = 0: ${c.f}(0) = ${b}. It is ${c.bMean}.`), 'Meaning in context');
    return tag(U.mc(pre + 'What is the <b>slope</b>, and what does it mean?', V(slope, c.mMean), [V(b, c.mMean), V(slope, c.bMean), V(slope + b, c.mMean)],
      `The slope is the rate of change, ${sn(slope)} per ${c.unit}: ${c.mMean}.`), 'Meaning in context');
  };

  // ---- 2. transformations of the parent function y = x
  const MT = [[2, 1], [3, 1], [4, 1], [-1, 1], [-2, 1], [-3, 1], [1, 2], [1, 3], [-1, 2], [1, 1]];
  U3.trans = function () {
    const t = U.ri(0, 2), S2 = 'Transformations';
    if (t < 2) {
      const m = R.make(...U.pick(MT)), mv = m.n / m.d, am = Math.abs(mv);
      const b = mv === 1 ? nz(-6, 6) : U.ri(-6, 6);
      const why = `Slope ${rh(m)}: ${am > 1 ? 'its size is bigger than 1, so the line is steeper' : am < 1 ? 'its size is less than 1, so the line is less steep' : 'its size is 1, the same steepness as y = x'}` +
        `${mv < 0 ? ', and it is negative, so the line falls left to right (a reflection)' : ''}. The y-intercept ${sn(b)} ${b ? `moves the line ${b > 0 ? 'up' : 'down'} ${Math.abs(b)}` : 'keeps it through the origin'}.`;
      if (t === 0) {
        const st = am > 1 ? 'steeper' : am < 1 ? 'less steep' : 'just as steep';
        const dr = mv < 0 ? 'reflected (falls left to right)' : 'rises left to right';
        const sh = b > 0 ? `shifted up ${b}` : b < 0 ? `shifted down ${-b}` : 'not shifted up or down';
        const D = (a, c, e) => `${cap(a)}, ${c}, ${e}`;
        return tag(U.mc(`How does the graph of <b>${yeq(m, b)}</b> compare to the graph of <b>${Y} = ${X}</b>?`, D(st, dr, sh),
          [D(st === 'steeper' ? 'less steep' : 'steeper', dr, sh), D(st, mv < 0 ? 'rises left to right' : 'reflected (falls left to right)', sh),
            D(st, dr, b > 0 ? `shifted down ${b}` : b < 0 ? `shifted up ${-b}` : `shifted up ${Math.abs(m.n)}`), D(st, dr, b ? `shifted ${b > 0 ? 'right' : 'left'} ${Math.abs(b)}` : 'shifted right 1')], why), S2);
      }
      const parts = [];
      if (am !== 1) parts.push(am > 1 ? `stretched so it is ${am} times as steep` : `squished so it is ${rh(R.make(Math.abs(m.n), m.d))} as steep`);
      if (mv < 0) parts.push('reflected so it falls left to right');
      if (b) parts.push(`shifted ${b > 0 ? 'up' : 'down'} ${Math.abs(b)}`);
      const steps = parts.length > 1 ? parts.slice(0, -1).join(', ') + ', and then ' + parts[parts.length - 1] : parts[0];
      return tag(U.mc(`The graph of <b>${Y} = ${X}</b> is ${steps}. Which equation is the new line?`, yeq(m, b),
        [yeq(m, R.make(m.n * b, m.d)), yeq(R.make(b), m), yeq(m, -b), yeq(R.make(-m.n, m.d), b), yeq(m, b + 1)],
        `Start with y = x (slope 1, y-intercept 0). ${why} So the line is ${yeq(m, b)}.${b && am !== 1 ? ` (Not ${yeq(m, R.make(m.n * b, m.d))}: the shift is added after the slope.)` : ''}`), S2);
    }
    // change one number in y = mx + b
    const m1 = U.pick([-4, -3, -2, 2, 3, 4]); let b1 = nz(-6, 6);
    const eq = `<b>${yeq(m1, b1)}</b>`;
    if (Math.random() < 0.5) {
      let b2 = U.ri(-8, 8); if (b2 === b1) b2 = b1 + 3;
      const d = b2 - b1, up = d > 0 ? 'up' : 'down', dn = d > 0 ? 'down' : 'up';
      return tag(U.mc(`In ${eq}, the y-intercept is changed from ${sn(b1)} to ${sn(b2)}. How does the graph change?`, `It shifts ${up} ${Math.abs(d)}.`,
        [`It shifts ${dn} ${Math.abs(d)}.`, `It shifts ${up} ${Math.abs(b2) || Math.abs(d) + 1}.`, `It gets ${d > 0 ? 'steeper' : 'less steep'}.`, `It shifts ${d > 0 ? 'right' : 'left'} ${Math.abs(d)}.`],
        `Only the y-intercept changes, from ${sn(b1)} to ${sn(b2)}. That moves the whole line ${up} ${Math.abs(d)} and keeps the slope ${sn(m1)}.`), S2);
    }
    let m2 = nz(-6, 6); while (m2 === m1) m2 = nz(-6, 6);
    const a1 = Math.abs(m1), a2 = Math.abs(m2), flipS = (m1 < 0) !== (m2 < 0);
    const st = a2 > a1 ? 'steeper' : a2 < a1 ? 'less steep' : 'same steepness';
    const D2 = (s, f) => `${cap(s)}${f ? ' and reflected' : ''}, same y-intercept`;
    return tag(U.mc(`In ${eq}, the slope is changed from ${sn(m1)} to ${sn(m2)}. How does the graph change?`, D2(st, flipS),
      [D2(st === 'steeper' ? 'less steep' : 'steeper', flipS), D2(st, !flipS), `${cap(st)}, and it shifts ${m2 > m1 ? 'up' : 'down'} ${Math.abs(m2 - m1)}`],
      `Only the slope changes. Its size goes from ${a1} to ${a2}, so the line is ${st === 'same steepness' ? 'just as steep' : st}.${flipS ? ` The sign changed, so it now ${m2 < 0 ? 'falls' : 'rises'} left to right (a reflection).` : ''} The y-intercept ${sn(b1)} stays the same.`), S2);
  };

  // ---- 3. matching graph, equation, table
  U3.match = function () {
    const t = U.ri(0, 2), S3 = 'Matching';
    if (t === 0) {
      const m = R.make(...U.pick(SL)), b = U.ri(-4, 4);
      const vis = KS.svg.plane({ min: -7, max: 7, lines: [{ m: m.n / m.d, b }], points: [{ x: 0, y: b }, { x: m.d, y: b + m.n }] });
      return tag(U.mc('Which equation matches this graph?', yeq(m, b),
        [yeq(R.make(-m.n, m.d), b), yeq(m, -b), yeq(R.make(m.d, m.n), b), yeq(m, b + U.pick([1, -1])), yeq(R.make(b || 2), m)],
        `It crosses the y-axis at (0, ${sn(b)}), so b = ${sn(b)}. From there go right ${m.d} and ${m.n > 0 ? 'up' : 'down'} ${Math.abs(m.n)} to the next marked point, so the slope is ${rh(m)}. The line is ${yeq(m, b)}.`, { visual: vis }), S3);
    }
    if (t === 1) {
      const m = nz(-4, 4), b = U.ri(-6, 6), xs = [1, 2, 3];
      const P = (mm, bb) => xs.map(x => pt(x, mm * x + bb)).join(', ');
      return tag(U.mc(`Which points are all on the line <b>${yeq(m, b)}</b>?`, P(m, b), [P(-m, b), P(m, -b), P(b || 3, m), P(m, b + m), P(m + 1, b)],
        `Plug in each x. ${xs.map(x => `x = ${x}: ${sn(m)}(${x}) ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${sn(m * x + b)}`).join('. ')}.`), S3);
    }
    const m = nz(-5, 5), b = U.ri(-8, 8), x0 = U.ri(1, 3), step = U.ri(1, 2);
    const xs = [0, 1, 2, 3].map(i => x0 + i * step), ys = xs.map(x => m * x + b);
    return tag(U.mc(`Which equation matches this table?${tbl(xs, ys)}`, yeq(m, b), [yeq(m, ys[0]), yeq(-m, b), yeq(m * step, b), yeq(m, -b), yeq(m + 1, b)],
      `Each time x goes up ${step}, y changes by ${sn(m * step)}, so the slope is ${sn(m * step)} ÷ ${step} = ${sn(m)}. Work back to x = 0: b = ${sn(ys[0])} − ${pn(m)} × ${x0} = ${sn(b)}. So ${yeq(m, b)}.`), S3);
  };

  // ---- 4. comparing two functions shown different ways
  U3.compare = function () {
    const askRate = Math.random() < 0.55, form = U.ri(0, 2), S4 = 'Comparing';
    const pick3 = (a, b) => a > b ? 0 : b > a ? 1 : 2;
    if (form === 2) {
      const mA = U.ri(3, 12), bA = U.ri(10, 60); let mB = U.ri(3, 12), bB = U.ri(10, 60);
      if (Math.random() < 0.15) { if (askRate) mB = mA; else bB = bA; }
      const ws = [1, 2, 3, 4], ys = ws.map(w => mA * w + bA);
      return { kind: 'mc', html: true, keepOrder: true, sub: S4,
        q: `<b>Ana’s savings</b> are in the table.${tbl(ws, ys, 'Week', 'Dollars')}<b>Ben</b> started with $${bB} and saves $${mB} each week.<br>${askRate ? 'Who saves more <b>each week</b>?' : 'Who <b>started</b> with more money?'}`,
        choices: ['Ana', 'Ben', 'They are the same'], answer: askRate ? pick3(mA, mB) : pick3(bA, bB),
        explain: `Ana adds ${ys[1]} − ${ys[0]} = $${mA} each week. Going back one week from week 1: ${ys[0]} − ${mA} = $${bA} at the start. Ben saves $${mB} each week and started with $${bB}. Compare ${askRate ? `$${mA} and $${mB}` : `$${bA} and $${bB}`}.` };
    }
    let mA = nz(-4, 4), bA = U.ri(-6, 6), mB = nz(-3, 3), bB = U.ri(-4, 4);
    if (Math.random() < 0.15) { if (askRate) { mA = nz(-3, 3); mB = mA; } else bB = U.ri(-4, 4), bA = bB; }
    const x0 = U.ri(-2, 1), xs = [0, 1, 2, 3].map(i => x0 + 2 * i), ys = xs.map(x => mA * x + bA);
    const vis = form === 1 ? KS.svg.plane({ min: -7, max: 7, lines: [{ m: mB, b: bB }], points: [{ x: 0, y: bB }, { x: 1, y: bB + mB }] }) : '';
    const B = form === 1 ? 'is graphed below.' : `is <b>${fx(mB, bB, 'g')}</b>.`;
    return { kind: 'mc', html: true, keepOrder: true, sub: S4, visual: vis || undefined,
      q: `<b>Function A</b> is shown in the table.${tbl(xs, ys)}<b>Function B</b> ${B}<br>Which has the greater <b>${askRate ? 'rate of change' : 'y-intercept'}</b>?`,
      choices: ['Function A', 'Function B', 'They are the same'], answer: askRate ? pick3(mA, mB) : pick3(bA, bB),
      explain: `A: slope = (${sn(ys[1])} − ${pn(ys[0])}) ÷ 2 = ${sn(mA)}, and the y-intercept is ${sn(ys[0])} − ${pn(mA)} × ${pn(x0)} = ${sn(bA)}. B: slope ${sn(mB)}, y-intercept ${sn(bB)}. ` +
        `Compare ${askRate ? `${sn(mA)} and ${sn(mB)}` : `${sn(bA)} and ${sn(bB)}`}${askRate && (mA < 0 || mB < 0) ? ' (a negative rate is less than a positive one)' : ''}.` };
  };

  // ---- 5. scatterplots and lines of best fit
  const CORR = {
    positive: [['Hours of practice', 'Free throws made'], ['Height (in)', 'Arm span (in)'], ['Minutes of exercise', 'Calories burned']],
    negative: [['Outside temp (°F)', 'Hot cocoa sold'], ['Age of car (years)', 'Value ($1,000s)'], ['Hours of TV', 'Test score']],
    none: [['Shoe size', 'Test score'], ['Birth month', 'Height (in)'], ['Last digit of phone number', 'Quiz score']],
  };
  const CAUSE = [
    ['Ice cream sales and sunburns both go up in the summer.', 'hot, sunny weather'],
    ['Kids with bigger shoe sizes tend to read at higher levels.', 'age'],
    ['Towns with more firefighters have more fires.', 'the size of the town'],
    ['Students who carry umbrellas are late more often.', 'rainy weather'],
    ['Cities with more libraries report more crimes.', 'the number of people living there'],
    ['On days when more hot cocoa is sold, more snowmen are built.', 'cold, snowy weather'],
    ['People who own more cookbooks tend to own more shoes.', 'having more money to spend'],
  ];
  const PRED = [
    { xl: 'Hours practiced', yl: 'Points scored', m10: [15, 35], b: [5, 15], xmax: 12 },
    { xl: 'Days', yl: 'Plant height (cm)', m10: [8, 25], b: [2, 10], xmax: 20 },
    { xl: 'Age of car (years)', yl: 'Value ($1,000s)', m10: [-28, -15], b: [32, 45], xmax: 10 },
  ];
  const BF = [
    { x: 'hours studied', y: 'test score', m: [35, 60, 10], b: [55, 70],
      sl: v => `For each extra hour studied, the predicted score goes up about ${v} points.`, ic: v => `A student who studies 0 hours is predicted to score about ${v} points.`, cap: v => `No student can score more than ${v} points.` },
    { x: 'outside temperature (°F)', y: 'cups of hot cocoa sold', m: [-5, -2, 1], b: [150, 200],
      sl: v => `For each 1°F warmer, about ${v} fewer cups are predicted to sell.`, ic: v => `At 0°F, about ${v} cups are predicted to sell.`, cap: v => `The stand can never sell more than ${v} cups.` },
    { x: 'age of a car (years)', y: 'value (thousands of dollars)', m: [-35, -15, 10], b: [25, 40],
      sl: v => `Each year older, the car’s predicted value drops about $${commas(Math.round(v * 1000))}.`, ic: v => `A brand-new car is predicted to be worth about $${commas(Math.round(v * 1000))}.`, cap: v => `No car is worth more than $${commas(Math.round(v * 1000))}.` },
    { x: 'minutes of exercise', y: 'calories burned', m: [7, 11, 1], b: [5, 20],
      sl: v => `Each extra minute of exercise is predicted to burn about ${v} more calories.`, ic: v => `With 0 minutes of exercise, the model predicts about ${v} calories burned.`, cap: v => `Nobody can burn more than ${v} calories.` },
  ];
  U3.scatter = function () {
    const t = U.ri(0, 6), S5 = 'Scatterplots';
    if (t === 0) {
      const kind = U.pick(['positive', 'negative', 'none']), lab = U.pick(CORR[kind]);
      const pts = Array.from({ length: 12 }, () => {
        const x = U.ri(1, 10), y = kind === 'positive' ? 10 + 7 * x + U.ri(-9, 9) : kind === 'negative' ? 92 - 7 * x + U.ri(-9, 9) : U.ri(8, 92);
        return [x, Math.max(2, Math.min(98, y))];
      });
      return { kind: 'mc', html: true, keepOrder: true, sub: S5, visual: KS.svg.scatter({ points: pts, xmax: 10, ymax: 100, xLabel: lab[0], yLabel: lab[1] }),
        q: 'What kind of correlation does this scatterplot show?', choices: ['Positive correlation', 'Negative correlation', 'No correlation'], answer: ['positive', 'negative', 'none'].indexOf(kind),
        explain: kind === 'positive' ? 'As x goes up, y tends to go up.' : kind === 'negative' ? 'As x goes up, y tends to go down.' : 'The points are scattered with no up or down trend.' };
    }
    if (t === 1) { // which kind of model fits
      const kind = U.ri(0, 2), arch = Math.random() < 0.5, upL = Math.random() < 0.5, pts = [];
      for (let i = 0; i < 13; i++) {
        const x = Math.round((0.4 + i * 0.75 + Math.random() * 0.3) * 10) / 10;
        let y = kind === 0 ? (upL ? 8 + 7 * x : 92 - 7 * x) : kind === 1 ? (arch ? 90 - 3.4 * (x - 5) * (x - 5) : 10 + 3.4 * (x - 5) * (x - 5)) : 3 * Math.pow(1.4, x);
        y += (Math.random() - 0.5) * (kind === 2 ? Math.max(2, y * 0.12) : 8);
        pts.push([x, Math.max(1, Math.min(99, Math.round(y)))]);
      }
      return { kind: 'mc', html: true, keepOrder: true, sub: S5, visual: KS.svg.scatter({ points: pts, xmax: 10, ymax: 100, xLabel: 'x', yLabel: 'y' }),
        q: 'Which type of function would best fit this data?', choices: ['Linear: a straight line', 'Quadratic: a U shape or an arch', 'Exponential: a curve that keeps getting steeper'], answer: kind,
        explain: ['The points go ' + (upL ? 'up' : 'down') + ' by about the same amount each step, so they follow a straight line.', `The points ${arch ? 'go up, then come back down' : 'go down, then come back up'}: that is a quadratic shape.`, 'The points start almost flat and then shoot up faster and faster: that is exponential growth.'][kind] };
    }
    if (t === 2) { // predict with a best-fit line
      const c = U.pick(PRED), m10 = U.ri(c.m10[0], c.m10[1]), b = U.ri(c.b[0], c.b[1]), m = m10 / 10, yAt = x => m * x + b;
      const ymax = Math.ceil((Math.max(yAt(0), yAt(c.xmax)) + 6) / 25) * 25;
      const pts = Array.from({ length: 12 }, () => { const x = Math.round((0.5 + Math.random() * (c.xmax - 1)) * 10) / 10; return [x, Math.max(1, Math.round(yAt(x) + (Math.random() - 0.5) * ymax * 0.12))]; });
      const x = U.ri(2, c.xmax - 1), ans = (m10 * x + 10 * b) / 10;
      return tag(U.num(`The scatterplot shows ${c.xl.toLowerCase()} (<i>x</i>) and ${c.yl.replace(/ \(.*\)/, '').toLowerCase()} (<i>y</i>). The line of best fit is <b>${Y} = ${dec(m)}${X} + ${b}</b>. Predict <i>y</i> when <i>x</i> = ${x}.`, ans,
        `Plug in x = ${x}: ${dec(m)} × ${x} + ${b} = ${dec(m * x)} + ${b} = ${dec(ans)}.`, { visual: KS.svg.scatter({ points: pts, xmax: c.xmax, ymax, xLabel: c.xl, yLabel: c.yl, line: { m, b } }) }), S5);
    }
    if (t === 3) { // interpolation or extrapolation
      const lo = U.ri(0, 5), hi = lo + U.ri(6, 12), inside = Math.random() < 0.5;
      const k = inside ? U.ri(lo + 1, hi - 1) : (lo > 2 && Math.random() < 0.3 ? U.ri(0, lo - 1) : hi + U.ri(2, 15));
      return { kind: 'mc', html: true, keepOrder: true, sub: S5,
        q: `A scatterplot has data for <i>x</i> = ${lo} to <i>x</i> = ${hi}. Its line of best fit is used to predict <i>y</i> when <i>x</i> = <b>${k}</b>. What kind of prediction is this?`,
        choices: ['Interpolation: inside the data, so it is more reliable', 'Extrapolation: outside the data, so it is less reliable'], answer: inside ? 0 : 1,
        explain: `${k} is ${inside ? `between ${lo} and ${hi}, inside` : `not between ${lo} and ${hi}, outside`} the data. Predictions inside the data are interpolation; outside are extrapolation, which is riskier because the pattern may not continue.` };
    }
    if (t === 4) { // is the prediction reasonable?
      const inside = Math.random() < 0.4, ctx = U.ri(0, 2);
      let q, why;
      if (ctx === 0) {
        const a = inside ? U.ri(3, 11) : U.pick([30, 40, 50, 60]), h = 2.5 * a + 31;
        q = `Data on kids ages 2 to 12 gives the best-fit line <b>h = 2.5a + 31</b> (height in inches). It predicts a height of <b>${dec(h)} inches</b> at age <b>${a}</b>.`;
        why = inside ? `Age ${a} is inside the data (2 to 12), and ${dec(h)} inches (about ${dec(h / 12)} feet) is a normal height.` : `Age ${a} is far outside the data, and ${dec(h)} inches is about ${dec(h / 12)} feet tall. Adults stop growing, so the line does not continue.`;
      } else if (ctx === 1) {
        const tt = inside ? U.ri(1, 7) : U.pick([14, 16, 18, 20]), v = 30 - 2.4 * tt;
        q = `Data on cars 0 to 8 years old gives the best-fit line <b>v = −2.4t + 30</b> (value in thousands of dollars). It predicts a value of <b>${dec(v)}</b> thousand dollars at <b>${tt}</b> years old.`;
        why = inside ? `${tt} years is inside the data (0 to 8), and $${commas(Math.round(v * 1000))} is a sensible value.` : `${tt} years is outside the data, and a value of ${dec(v)} thousand dollars is ${v < 0 ? 'negative, which is impossible' : 'not supported by the data'}.`;
      } else {
        const hh = inside ? U.ri(1, 9) : U.pick([25, 30, 40]), f = 1.8 * hh + 4;
        q = `A player shoots 25 free throws after each week of practice. Data for 0 to 10 hours of practice gives <b>f = 1.8h + 4</b> free throws made. It predicts <b>${dec(f)}</b> made after <b>${hh}</b> hours.`;
        why = inside ? `${hh} hours is inside the data (0 to 10), and ${dec(f)} out of 25 is possible.` : `${hh} hours is far outside the data, and ${dec(f)} made is more than the 25 shots taken.`;
      }
      return tag(U.mc(q + ' Is this prediction reasonable?', inside ? 'Yes: it is inside the data (interpolation) and the result makes sense.' : 'No: it is far outside the data (extrapolation) and the result does not make sense.',
        [inside ? 'No: it is far outside the data (extrapolation) and the result does not make sense.' : 'Yes: it is inside the data (interpolation) and the result makes sense.',
          'Yes: a line of best fit works for any x-value.', 'No: a line of best fit can never be used to predict.'], why), S5);
    }
    if (t === 5) { // meaning of slope / intercept of a best-fit line
      const c = U.pick(BF), m = U.ri(c.m[0], c.m[1]) / c.m[2], am = Math.abs(m), sl = Math.random() < 0.55;
      let b = U.ri(c.b[0], c.b[1]); if (b === am) b++;
      const q = `A line of best fit for ${c.x} (<i>x</i>) and ${c.y} (<i>y</i>) is <b>${Y} = ${dec(m)}${X} + ${b}</b>. What does the <b>${sl ? dec(m) : b}</b> mean?`;
      return tag(sl ? U.mc(q, c.sl(am), [c.ic(am), c.sl(b), c.cap(am)], `The slope ${dec(m)} is the predicted change in ${c.y} for each 1 more unit of ${c.x}.`)
        : U.mc(q, c.ic(b), [c.sl(b), c.ic(am), c.cap(b)], `The y-intercept ${b} is the predicted ${c.y} when ${c.x} is 0.`), S5);
    }
    const c = U.pick(CAUSE);
    return tag(U.mc(`${c[0]} Does one <b>cause</b> the other?`, `No. A third factor (${c[1]}) likely makes both happen.`,
      ['Yes. A strong correlation proves one causes the other.', 'Yes, but only if the correlation is negative.', 'No, because they are not correlated at all.'],
      `Correlation is not causation. Here ${c[1]} is a lurking variable that makes both rise together.`), S5);
  };

  // ---- 6. honors objectives
  const QV = ['height', 'arm span', 'hours of sleep', 'minutes of homework', 'number of books read', 'mile run time'];
  const CV = ['favorite color', 'eye color', 'favorite sport', 'type of pet', 'favorite subject'];
  const TRICK = [['zip code', 0], ['jersey number', 0], ['phone area code', 0], ['daily high temperature', 1], ['number of siblings', 1]];
  const RD = [
    { s: (b, m) => `A pool has ${b} gallons in it and is filled at ${m} gallons per minute.`, f: 'P', what: 'filling', units: 'minutes', inc: true, m: [5, 15], b: [100, 300], d: [10, 30] },
    { s: (b, m) => `A hiker starts at ${b} feet above sea level and climbs ${m} feet per minute.`, f: 'E', what: 'climb', units: 'minutes', inc: true, m: [10, 40], b: [500, 1500], d: [20, 60] },
    { s: (b, m) => `A tank holds ${b} gallons and drains ${m} gallons per minute.`, f: 'W', what: 'draining', units: 'minutes', inc: false, m: [4, 12], T: [12, 30], d: [5, 10] },
    { s: (b, m) => `A candle is ${b} cm tall and burns ${m} cm per hour.`, f: 'L', what: 'burning', units: 'hours', inc: false, m: [1, 3], T: [8, 15], d: [3, 7] },
  ];
  const ZD = [
    { s: (b, m) => `A candle is ${b} cm tall and burns down ${m} cm each hour.`, f: 'L', thing: 'candle height', units: 'hours', m: [1, 3], T: [6, 16] },
    { s: (b, m) => `A tank holds ${b} gallons and drains ${m} gallons each minute.`, f: 'W', thing: 'water in the tank', units: 'minutes', m: [4, 12], T: [10, 30] },
    { s: (b, m) => `A gift card has $${b} on it, and you spend $${m} each week.`, f: 'G', thing: 'card balance', units: 'weeks', m: [5, 15], T: [4, 10] },
  ];
  const BFD = [
    { s: 'kids', xv: 'age', unit: 'years old', lo: [6, 9], span: [4, 6], m10: [20, 28], b: [28, 34], y: 'height (inches)' },
    { s: 'students', xv: 'hours studied', unit: 'hours', lo: [0, 1], span: [4, 6], m10: [40, 60], b: [55, 65], y: 'test score' },
    { s: 'days', xv: 'temperature', unit: '°F', lo: [30, 45], span: [20, 30], m10: [-30, -20], b: [230, 260], y: 'cups of cocoa sold' },
  ];
  U3.honors = function () {
    const t = U.ri(0, 5), S6 = 'Honors';
    if (t === 0) {
      const q = U.sample(QV, 4), c = U.sample(CV, 3);
      return tag(U.mc('A class collects data on each student. Which data could be shown on a <b>scatterplot</b>?', `each student’s ${q[0]} and ${q[1]}`,
        [`each student’s ${q[2]} only`, `each student’s ${c[0]} and ${c[1]}`, `each student’s ${q[3]} and ${c[2]}`],
        'A scatterplot needs bivariate data: two quantitative (number) variables measured on the same individuals. One variable alone is univariate, and a category like eye color cannot go on a number axis.'), S6);
    }
    if (t === 1) {
      if (Math.random() < 0.5) {
        const two = Math.random() < 0.5, q = U.sample(QV, 2);
        return { kind: 'mc', html: true, keepOrder: true, sub: S6, q: `A survey records each student’s <b>${two ? q[0] + ' and ' + q[1] : q[0]}</b>. Is this univariate or bivariate data?`,
          choices: ['Univariate', 'Bivariate'], answer: two ? 1 : 0, explain: two ? 'Two variables for each student: bivariate. You could graph it on a scatterplot.' : 'Only one variable for each student: univariate. You could use a histogram or box plot.' };
      }
      const pool = QV.map(v => [v, 1]).concat(CV.map(v => [v, 0]), TRICK, TRICK), v = U.pick(pool);
      return { kind: 'mc', html: true, keepOrder: true, sub: S6, q: `Is <b>${v[0]}</b> categorical or quantitative data?`, choices: ['Categorical', 'Quantitative'], answer: v[1] ? 1 : 0,
        explain: v[1] ? 'It is a measured amount or a count, so math with it makes sense.' : `It names a group or label.${/code|number/.test(v[0]) ? ' It uses digits, but averaging them makes no sense.' : ''}` };
    }
    if (t === 2) { // two translations, one line
      const m = U.pick([2, 3, 4, -2, -3, -4, 1, -1]), h = nz(-4, 4), b0 = U.pick([0, 0, U.ri(-5, 5)]), k = -m * h;
      const hs = v => `${v > 0 ? 'right' : 'left'} ${Math.abs(v)}`, vs = v => `${v > 0 ? 'up' : 'down'} ${Math.abs(v)}`;
      const fact = `${Y} = ${sn(m)}(${X} ${h > 0 ? '−' : '+'} ${Math.abs(h)})${b0 ? ` ${b0 < 0 ? '−' : '+'} ${Math.abs(b0)}` : ''}`;
      if (Math.random() < 0.5) {
        return tag(U.mc(`The line <b>${yeq(m, b0)}</b> is shifted <b>${vs(k)}</b>. Which <b>horizontal</b> shift of the original line gives the same new line?`, hs(h),
          [hs(-h), hs(Math.sign(h) * Math.abs(k)), hs(-Math.sign(h) * Math.abs(k)), hs(2 * h), hs(h + Math.sign(h)), hs(-2 * h)],
          `Shifted ${vs(k)}: ${yeq(m, b0 + k)}. Factor out the slope: ${fact}. Replacing x with x ${h > 0 ? '−' : '+'} ${Math.abs(h)} moves a graph ${hs(h)}. So both shifts give the same line.`), S6);
      }
      return tag(U.mc(`The line <b>${yeq(m, b0)}</b> is shifted <b>${hs(h)}</b>. Which <b>vertical</b> shift of the original line gives the same new line?`, vs(k),
        [vs(-k), vs(Math.sign(k) * Math.abs(h)), vs(h), vs(-Math.sign(k) * Math.abs(h)), vs(2 * k), vs(-2 * k), vs(k + Math.sign(k))],
        `Shifting ${hs(h)} replaces x with x ${h > 0 ? '−' : '+'} ${Math.abs(h)}: ${fact} = ${lin(m, b0 + k)}. The y-intercept changed by ${sn(k)}, the same as shifting ${vs(k)}.`), S6);
    }
    if (t === 3) { // restricted domain -> range
      const c = U.pick(RD), m = U.ri(c.m[0], c.m[1]);
      const b = c.inc ? Math.round(U.ri(c.b[0], c.b[1]) / 10) * 10 : m * U.ri(c.T[0], c.T[1]);
      const D = U.ri(c.d[0], c.d[1]), end = c.inc ? b + m * D : b - m * D, lo = Math.min(b, end), hi = Math.max(b, end);
      const F = `<i>${c.f}</i>`, rg = (a, z) => `${a} ≤ ${F} ≤ ${z}`, wrongEnd = c.inc ? b - m * D : b + m * D;
      return tag(U.mc(`${c.s(b, m)} So ${F}(<i>t</i>) = ${lin(c.inc ? m : -m, b, 't')}. The ${c.what} lasts ${D} ${c.units}, so the domain is <b>0 ≤ <i>t</i> ≤ ${D}</b>. What is the <b>range</b>?`, rg(lo, hi),
        [rg(0, D), rg(Math.min(b, wrongEnd), Math.max(b, wrongEnd)), rg(0, hi), rg(m, hi)],
        `The function is ${c.inc ? 'increasing' : 'decreasing'}, so the outputs at the ends of the domain are the smallest and largest: ${c.f}(0) = ${b} and ${c.f}(${D}) = ${b} ${c.inc ? '+' : '−'} ${m}(${D}) = ${end}. Range: ${lo} ≤ ${c.f} ≤ ${hi}.`), S6);
    }
    if (t === 4) { // domain that makes sense, ending at the zero
      const c = U.pick(ZD), m = U.ri(c.m[0], c.m[1]), T = U.ri(c.T[0], c.T[1]), b = m * T, F = `<i>${c.f}</i>`, rangeQ = Math.random() < 0.35;
      const q = `${c.s(b, m)} The model is ${F}(<i>t</i>) = ${b} − ${m}<i>t</i>. Which <b>${rangeQ ? 'range' : 'domain'}</b> makes sense?`;
      const why = `Time starts at 0, and the model stops when ${c.thing} reaches 0: ${b} − ${m}t = 0, so t = ${T}. After that it can’t go below 0. So the domain is 0 ≤ t ≤ ${T} and the range is 0 ≤ ${c.f} ≤ ${b}.`;
      return tag(rangeQ ? U.mc(q, `0 ≤ ${F} ≤ ${b}`, ['all real numbers', `${F} ≥ 0`, `0 ≤ ${F} ≤ ${T}`, `${F} ≤ ${b}`], why)
        : U.mc(q, `0 ≤ <i>t</i> ≤ ${T}`, ['all real numbers', '<i>t</i> ≥ 0', `0 ≤ <i>t</i> ≤ ${b}`, `0 ≤ <i>t</i> ≤ ${m}`], why), S6);
    }
    // domain / range of a best-fit line built from data
    const c = U.pick(BFD), lo = U.ri(c.lo[0], c.lo[1]), hi = lo + U.ri(c.span[0], c.span[1]), m10 = U.ri(c.m10[0], c.m10[1]), b = U.ri(c.b[0], c.b[1]);
    const m = m10 / 10, yl = (m10 * lo + 10 * b) / 10, yh = (m10 * hi + 10 * b) / 10, ylo = Math.min(yl, yh), yhi = Math.max(yl, yh);
    const pre = `A best-fit line was made from data on ${c.s} with ${c.xv} from <b>${lo} to ${hi}</b> ${c.unit}: <b>${Y} = ${dec(m)}${X} + ${b}</b>, where <i>y</i> is ${c.y}.`;
    if (Math.random() < 0.5) {
      return tag(U.mc(`${pre} For which ${c.xv} values is it most reasonable to use the line?`, `about ${lo} to ${hi} ${c.unit}, the values in the data`,
        ['all real numbers', `0 to ${hi * 10} ${c.unit}`, `only values above ${hi} ${c.unit}`], `A best-fit line is only trusted near the data it was built from. Far outside ${lo} to ${hi}, the pattern may not continue (extrapolation).`), S6);
    }
    const rg = (a, z) => `${dec(a)} ≤ <i>y</i> ≤ ${dec(z)}`;
    return tag(U.mc(`${pre} If the domain is ${lo} ≤ <i>x</i> ≤ ${hi}, what is the range of predicted values?`, rg(ylo, yhi),
      [rg(lo, hi), rg(Math.min(b, yh), Math.max(b, yh)), rg(Math.min(m * lo, m * hi), Math.max(m * lo, m * hi)), rg(lo, yhi), rg(ylo - Math.abs(m), yhi)],
      `Plug in the ends of the domain: x = ${lo} gives ${dec(yl)} and x = ${hi} gives ${dec(yh)}. A line is always increasing or always decreasing, so the range is ${dec(ylo)} ≤ y ≤ ${dec(yhi)}.`), S6);
  };

  // ================================================ Mr. Levine's Unit 3 quiz + test study guides
  const setStr = a => `{${a.map(v => sn(v)).join(', ')}}`;
  const uniqSort = a => Array.from(new Set(a)).sort((p, q) => p - q);
  const pairStr = ps => `{${ps.map(p => pt(p[0], p[1])).join(', ')}}`;
  const ineq = (open) => open ? '&lt;' : '≤';
  const SB = (v, lo, hi, loOpen, hiOpen) => `{<i>${v}</i> | ${sn(lo)} ${ineq(loOpen)} <i>${v}</i> ${ineq(hiOpen)} ${sn(hi)}}`;
  const RE = v => `{<i>${v}</i> | <i>${v}</i> ∈ ℝ}`;
  const fn = (f, v) => `<i>${f}</i>(<i>${v || 'x'}</i>)`;

  // ---- Functions and relations
  U3.func = function () {
    const t = U.ri(0, 4), SF = 'Functions & relations';
    if (t <= 1) { // ordered pairs or a table
      const isFn = Math.random() < 0.5, repY = Math.random() < 0.6;
      const xs = U.sample([-8, -6, -5, -3, -2, -1, 0, 1, 2, 3, 4, 5, 7, 9], 5);
      const ps = xs.map(x => [x, U.ri(-9, 9)]);
      if (!isFn) { const i = U.ri(0, 4), j = (i + U.ri(1, 4)) % 5; ps[j] = [ps[i][0], ps[i][1] + U.pick([-4, -3, 2, 3, 5])]; }
      else if (repY) ps[3][1] = ps[1][1];
      const sh = U.shuffle(ps), rep = isFn ? null : sh.filter(p => sh.some(q => q !== p && q[0] === p[0]));
      const yDup = new Set(sh.map(p => p[1])).size < sh.length;
      if (!isFn && yDup) return U3.func(); // when it fails, only one "No" reason may be true
      const shown = t === 0 ? `<br><span class="big">${pairStr(sh)}</span>` : tbl(sh.map(p => p[0]), sh.map(p => p[1]));
      return { kind: 'mc', html: true, keepOrder: true, sub: SF, q: `Is this relation a function?${shown}`,
        choices: ['Yes, it is a function', 'No: an x-value is paired with two different y-values', 'No: a y-value repeats'], answer: isFn ? 0 : 1,
        explain: isFn ? `Every x-value appears only once, so each input has exactly one output.${yDup ? ' A repeated y-value is fine: different inputs can share an output.' : ''}`
          : `x = ${sn(rep[0][0])} is paired with both ${sn(rep[0][1])} and ${sn(rep[1][1])}. One input with two outputs is not a function.` };
    }
    if (t === 2) { // graph and the vertical line test
      const kind = U.ri(0, 5), pts = [];
      let isFn = true, why = '';
      if (kind === 0) { const m = nz(-3, 3), b = U.ri(-3, 3); pts.push([-8, -8 * m + b], [8, 8 * m + b]); why = 'a slanted line'; }
      else if (kind === 1) { const a = U.pick([1, -1, 0.5, -0.5]), h = U.ri(-2, 2), k = a > 0 ? U.ri(-5, 0) : U.ri(0, 5); for (let x = -7; x <= 7.01; x += 0.25) pts.push([x, a * (x - h) * (x - h) + k]); why = 'a parabola that opens up or down'; }
      else if (kind === 2) { const h = U.ri(-2, 2), k = U.ri(-4, 2); for (let x = -7; x <= 7.01; x += 0.5) pts.push([x, Math.abs(x - h) + k]); why = 'a V shape'; }
      else if (kind === 3) { isFn = false; const r = U.ri(3, 5), h = U.ri(-1, 1), k = U.ri(-1, 1); for (let i = 0; i <= 64; i++) { const a = i / 64 * 2 * Math.PI; pts.push([h + r * Math.cos(a), k + r * Math.sin(a)]); } why = 'a circle'; }
      else if (kind === 4) { isFn = false; const h = U.ri(-5, -2), k = U.ri(-2, 2), a = U.pick([0.5, 1]); for (let y = -7; y <= 7.01; y += 0.25) pts.push([a * (y - k) * (y - k) + h, y]); why = 'a sideways parabola'; }
      else { isFn = false; const c = nz(-5, 5); pts.push([c, -8], [c, 8]); why = 'a vertical line'; }
      const vis = KS.svg.plane({ min: -7, max: 7, curves: [{ pts }] });
      return { kind: 'mc', html: true, keepOrder: true, sub: SF, visual: vis, q: 'Is this graph a function?',
        choices: ['Yes: it passes the vertical line test', 'No: it fails the vertical line test'], answer: isFn ? 0 : 1,
        explain: isFn ? `This is ${why}. Any vertical line crosses it at most once, so each x has only one y.` : `This is ${why}. Some vertical line crosses it more than once, so one x has two y-values.` };
    }
    if (t === 3) { // which added point breaks it
      const xs = U.sample([-7, -5, -4, -2, -1, 0, 2, 3, 5, 6, 7], 3), ps = xs.map(x => [x, U.ri(-9, 9)]);
      const i = U.ri(0, 2), ny = ps[i][1] + U.pick([-5, -3, 2, 4, 6]);
      const fresh = [-9, -8, -6, -3, 1, 4, 8, 9].filter(v => xs.indexOf(v) < 0), fx1 = U.sample(fresh, 3);
      const wr = [pt(fx1[0], ps[i][1]), pt(fx1[1], ny), pt(fx1[2], ps[(i + 1) % 3][1])];
      if (xs.indexOf(ps[i][1]) < 0 && ps[i][1] !== ps[i][0]) wr.unshift(pt(ps[i][1], ps[i][0]));
      return tag(U.mc(`Which point, when added to <b>${pairStr(ps)}</b>, makes the relation <b>NOT</b> a function?`, pt(ps[i][0], ny), wr,
        `A relation is not a function when one x-value has two different y-values. ${pt(ps[i][0], ny)} gives x = ${sn(ps[i][0])} a second y-value (it already has ${sn(ps[i][1])}). Repeating a y-value is fine.`), SF);
    }
    // fill in the blank
    const xs = U.sample([-8, -6, -3, -1, 0, 2, 3, 5, 7, 11], 5), ys = xs.map(() => U.ri(-9, 10));
    const bi = 1, k = U.ri(2, 4); ys[bi] = ys[k];
    for (let j = 0; j < 5; j++) if (j !== k && j !== bi && ys[j] === ys[bi]) ys[j] = ys[bi] + 1;
    const others = xs.filter((x, j) => j !== bi && j !== k);
    const ans = U.pick(others), newX = [-9, -7, -5, -4, 1, 4, 6, 9].filter(v => xs.indexOf(v) < 0);
    const shown = xs.map((x, j) => j === bi ? `(___, ${sn(ys[j])})` : pt(x, ys[j])).join(', ');
    return tag(U.mc(`Which number in the blank makes this relation <b>NOT</b> a function?<br><span class="big">{${shown}}</span>`, sn(ans),
      [xs[k], U.pick(newX), ys[bi]].concat(newX.slice(0, 3)).filter(v => others.indexOf(v) < 0).map(sn),
      `Pick an x that is already used with a different y. ${sn(ans)} would be paired with two y-values. ${sn(xs[k])} looks tempting, but (${sn(xs[k])}, ${sn(ys[bi])}) is already in the set: repeating the exact same pair is still a function.`), SF);
  };

  // ---- Domain and range, list form and set-builder form
  const CD = [
    () => { const T = U.pick([60, 75, 90, 120]); return { s: `A phone is charging. Its battery level <i>B</i> (percent) depends on the time <i>t</i> (minutes). It goes from 0% to full in ${T} minutes.`,
      dom: `0 ≤ <i>t</i> ≤ ${T} minutes`, rng: '0 ≤ <i>B</i> ≤ 100 percent', wd: [`0 ≤ <i>t</i> ≤ 100 minutes`, `0 ≤ <i>t</i> ≤ ${T} percent`, 'all real numbers'], wr: [`0 ≤ <i>B</i> ≤ ${T} percent`, '0 ≤ <i>B</i> ≤ 100 minutes', 'all real numbers'] }; },
    () => { const D = U.pick([60, 90, 120, 150]), T = D / 15; return { s: `A scuba diver goes from the surface down to ${D} feet below sea level in ${T} minutes. Her elevation <i>e</i> (feet) depends on the time <i>t</i> (minutes).`,
      dom: `0 ≤ <i>t</i> ≤ ${T} minutes`, rng: `−${D} ≤ <i>e</i> ≤ 0 feet`, wd: [`−${T} ≤ <i>t</i> ≤ 0 minutes`, `0 ≤ <i>t</i> ≤ ${D} minutes`, 'all real numbers'], wr: [`0 ≤ <i>e</i> ≤ ${D} feet`, `−${T} ≤ <i>e</i> ≤ 0 feet`, `<i>e</i> ≤ ${D} feet`] }; },
    () => { const r = U.pick([10, 12, 15, 20]), T = U.pick([25, 30, 40, 50]), G = r * T; return { s: `A pool holds ${G} gallons and drains at ${r} gallons per minute. The water left <i>g</i> (gallons) depends on the time <i>m</i> (minutes).`,
      dom: `0 ≤ <i>m</i> ≤ ${T} minutes`, rng: `0 ≤ <i>g</i> ≤ ${G} gallons`, wd: [`0 ≤ <i>m</i> ≤ ${G} minutes`, `0 ≤ <i>m</i> ≤ ${r} minutes`, 'all real numbers'], wr: [`0 ≤ <i>g</i> ≤ ${T} gallons`, `${r} ≤ <i>g</i> ≤ ${G} gallons`, `<i>g</i> ≥ 0 gallons`] }; },
  ];
  U3.domrange = function () {
    const t = U.ri(0, 4), SD = 'Domain & range';
    if (t === 0) { // discrete relation, list form
      const xs = U.sample([-6, -4, -3, -1, 0, 1, 2, 4, 5, 6], 4), ps = xs.map(x => [x, U.ri(-7, 8)]);
      ps[2][1] = ps[0][1];
      const dom = Math.random() < 0.5, vals = ps.map(p => p[dom ? 0 : 1]), other = ps.map(p => p[dom ? 1 : 0]), v = dom ? 'x' : 'y';
      const right = uniqSort(vals), extra = right.concat([right[right.length - 1] + 2]);
      return tag(U.mc(`What is the <b>${dom ? 'domain' : 'range'}</b> of <b>${pairStr(ps)}</b>?`, setStr(right),
        [setStr(uniqSort(other)), dom ? setStr(extra) : setStr(vals), SB(v, right[0], right[right.length - 1]), setStr(right.slice(1))],
        `The ${dom ? 'domain is the set of x-values (first numbers)' : 'range is the set of y-values (second numbers)'}. List each value once: ${setStr(right)}. For a list of points use set (list) notation, not an interval.`), SD);
    }
    if (t === 1) { // range for a given domain list
      const m = nz(-4, 4), b = U.ri(-6, 6), D = uniqSort(U.sample([-3, -2, -1, 0, 1, 2, 3, 4, 5], 4)), r = uniqSort(D.map(x => m * x + b));
      return tag(U.mc(`<b>${fx(m, b)}</b> has domain <b>${setStr(D)}</b>. What is the range?`, setStr(r),
        [setStr(D), setStr(uniqSort(D.map(x => -m * x + b))), setStr(uniqSort(D.map(x => m * x))), SB('y', r[0], r[r.length - 1]), setStr(r.slice(1))],
        `Plug in each x: ${D.map(x => `f(${sn(x)}) = ${sn(m * x + b)}`).join(', ')}. Range: ${setStr(r)}.`), SD);
    }
    if (t === 2) { // graphed segment, set-builder
      const dom = Math.random() < 0.5;
      let pts = [], ends, x1, x2, ylo, yhi, loOpen = false, hiOpen = false, x1o = false, x2o = false, endsOnly = null;
      if (Math.random() < 0.5) { // parabola piece
        const a = U.pick([1, -1]), h = U.ri(-1, 1), pq = U.sample([1, 2, 3], 2), M = Math.max(pq[0], pq[1]);
        const k = a > 0 ? U.ri(-6, 7 - M * M) : U.ri(-7 + M * M, 6);
        x1 = h - pq[0]; x2 = h + pq[1];
        for (let x = x1; x <= x2 + 1e-9; x += 0.125) pts.push([x, a * (x - h) * (x - h) + k]);
        const y1 = a * pq[0] * pq[0] + k, y2 = a * pq[1] * pq[1] + k;
        ylo = a > 0 ? k : Math.min(y1, y2); yhi = a > 0 ? Math.max(y1, y2) : k;
        endsOnly = [Math.min(y1, y2), Math.max(y1, y2)];
        ends = [{ x: x1, y: y1 }, { x: x2, y: y2 }];
      } else { // line segment, sometimes open ends
        x1 = U.ri(-6, 0); x2 = x1 + U.ri(3, 8); let y1 = U.ri(-6, 6), y2 = U.ri(-6, 6); if (y1 === y2) y2 = y1 > 0 ? y1 - 4 : y1 + 4;
        x1o = Math.random() < 0.25; x2o = Math.random() < 0.25;
        pts = [[x1, y1], [x2, y2]]; ends = [{ x: x1, y: y1, open: x1o }, { x: x2, y: y2, open: x2o }];
        ylo = Math.min(y1, y2); yhi = Math.max(y1, y2); loOpen = y1 < y2 ? x1o : x2o; hiOpen = y1 < y2 ? x2o : x1o;
      }
      const vis = KS.svg.plane({ min: -7, max: 7, curves: [{ pts }], points: ends.map(e => ({ x: e.x, y: e.y, open: e.open, color: '#6c4cf0' })) });
      const right = dom ? SB('x', x1, x2, x1o, x2o) : SB('y', ylo, yhi, loOpen, hiOpen);
      const wr = dom ? [SB('y', x1, x2, x1o, x2o), SB('x', ylo, yhi, loOpen, hiOpen), SB('x', x1, x2, !x1o, !x2o), setStr([x1, x2])]
        : [SB('x', ylo, yhi, loOpen, hiOpen), SB('y', x1, x2), endsOnly ? SB('y', endsOnly[0], endsOnly[1]) : SB('y', ylo, yhi, !loOpen, !hiOpen), setStr([ylo, yhi])];
      return tag(U.mc(`What is the <b>${dom ? 'domain' : 'range'}</b> of the graph?`, right, wr,
        dom ? `Read left to right: the graph runs from x = ${sn(x1)} to x = ${sn(x2)}.${x1o || x2o ? ' An open circle means that endpoint is not included, so use &lt; there.' : ' Both endpoints are filled in, so use ≤.'}`
          : `Read bottom to top: the lowest point has y = ${sn(ylo)} and the highest has y = ${sn(yhi)}.${endsOnly ? ' The lowest or highest point of a parabola can be its vertex, not an endpoint.' : ''}${loOpen || hiOpen ? ' An open circle is not included, so use &lt; there.' : ''}`, { visual: vis }), SD);
    }
    if (t === 3) { // a whole line
      const b = U.ri(-8, 8);
      if (Math.random() < 0.3) return tag(U.mc(`What is the <b>range</b> of <b>${fx(0, b)}</b>?`, `{${sn(b)}}`, [RE('y'), `{<i>y</i> | <i>y</i> ≥ ${sn(b)}}`, RE('x')],
        `Every input gives ${sn(b)}, so the range has just one value: {${sn(b)}}. The domain is still ${RE('x')}.`), SD);
      const m = nz(-6, 6), dom = Math.random() < 0.5;
      return tag(U.mc(`What is the <b>${dom ? 'domain' : 'range'}</b> of <b>${fx(m, b)}</b>?`, RE(dom ? 'x' : 'y'),
        dom ? [`{<i>x</i> | <i>x</i> ≥ 0}`, `{<i>x</i> | <i>x</i> ≥ ${sn(b)}}`, `{${sn(b)}}`, RE('y')] : [`{<i>y</i> | <i>y</i> ≥ ${sn(b)}}`, `{<i>y</i> | <i>y</i> ≥ 0}`, `{${sn(b)}}`, RE('x')],
        `A line that is not horizontal or vertical goes on forever in both directions, so ${dom ? 'every x-value can go in' : 'every y-value comes out'}. In set-builder form: ${RE(dom ? 'x' : 'y')} (ℝ means all real numbers).`), SD);
    }
    const c = U.pick(CD)(), dom = Math.random() < 0.5;
    return tag(U.mc(`${c.s} What is a reasonable <b>${dom ? 'domain' : 'range'}</b>?`, dom ? c.dom : c.rng, dom ? c.wd : c.wr,
      `The domain is the inputs (here, time), and the range is the outputs, each with its own units. Domain: ${c.dom}. Range: ${c.rng}.`), SD);
  };

  // ---- Evaluating functions and zeros
  const ZM = [
    () => { const r = U.pick([20, 25, 40, 50]), T = U.pick([30, 45, 60, 80]), H = r * T; return { s: `A hiker starts at ${commas(H)} feet and walks down ${r} feet per minute: <b><i>E</i>(<i>t</i>) = ${H} − ${r}<i>t</i></b>.`, z: T,
      mean: 'the number of minutes until the hiker reaches 0 feet', w: [[H, 'the number of minutes until the hiker reaches 0 feet'], [T, 'the hiker’s starting height'], [r, 'the number of minutes until the hiker reaches 0 feet']] }; },
    () => { const r = U.pick([10, 15, 20, 30]), T = U.pick([4, 5, 6, 8]), D = r * T; return { s: `A diver starts ${D} feet below the surface and rises ${r} feet per minute: <b><i>e</i>(<i>t</i>) = −${D} + ${r}<i>t</i></b>.`, z: T,
      mean: 'the number of minutes until the diver reaches the surface', w: [[-D, 'the number of minutes until the diver reaches the surface'], [T, 'the diver’s starting depth'], [r, 'how deep the diver is after 1 minute']] }; },
    () => { const r = U.pick([10, 12, 15, 20]), T = U.pick([25, 30, 40, 50]), G = r * T; return { s: `A pool has ${G} gallons and drains ${r} gallons per minute: <b><i>g</i>(<i>m</i>) = ${G} − ${r}<i>m</i></b>.`, z: T,
      mean: 'the number of minutes until the pool is empty', w: [[G, 'the number of minutes until the pool is empty'], [T, 'the gallons in the pool at the start'], [r, 'the number of minutes until the pool is empty']] }; },
  ];
  const cst = c => c ? ` ${c < 0 ? '−' : '+'} ${Math.abs(c)}` : '';
  const NLF = [ // some not linear, for "which function has f(a) = v"
    { s: c => `<i>x</i>²${cst(c)}`, f: (x, c) => x * x + c },
    { s: c => `<i>x</i>³${cst(c)}`, f: (x, c) => x * x * x + c },
    { s: c => `|<i>x</i>|${cst(c)}`, f: (x, c) => Math.abs(x) + c },
    { s: c => `2<i>x</i>${cst(c)}`, f: (x, c) => 2 * x + c },
    { s: c => `−<i>x</i>${cst(c)}`, f: (x, c) => -x + c },
    { s: c => `2<i>x</i>²${cst(c)}`, f: (x, c) => 2 * x * x + c },
  ];
  U3.evalz = function () {
    const t = U.ri(0, 5), SE = 'Evaluate & zeros', F = U.pick(['f', 'g', 'h']);
    if (t === 0) {
      const m = nz(-7, 7), b = U.ri(-12, 12), x = nz(-6, 6);
      return tag(U.num(`If <b>${fx(m, b, F)}</b>, find <b>${F}(${sn(x)})</b>.`, m * x + b, `Replace x with ${pn(x)}: ${sn(m)}(${sn(x)}) ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${sn(m * x)} ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${sn(m * x + b)}.`), SE);
    }
    if (t === 1) { // fraction coefficient that divides evenly
      const d = U.pick([2, 3, 4, 5]), n = U.pick([1, 2, 3, -1, -3].filter(v => U.gcd(v, d) === 1)), b = U.ri(-9, 9), x = d * nz(-3, 3), m = R.make(n, d);
      return tag(U.num(`If <b>${fx(m, b, F)}</b>, find <b>${F}(${sn(x)})</b>.`, n * x / d + b,
        `${rh(m)} × ${pn(x)} = ${sn(x)} ÷ ${d} × ${pn(n)} = ${sn(n * x / d)}. Then ${sn(n * x / d)} ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${sn(n * x / d + b)}.`), SE);
    }
    if (t === 2) { // which function has this zero
      const z = nz(-6, 6), ms = [R.make(1), R.make(2), R.make(3), R.make(-2)].concat(z % 2 === 0 ? [R.make(1, 2)] : []), m = U.pick(ms);
      const right = yeq(m, R.make(-m.n * z, m.d)), zeroOf = (mm, bb) => R.make(-bb.n * mm.d, bb.d * mm.n);
      const cands = [[R.make(1), R.make(z)], [R.make(z), R.make(0)], [R.make(2), R.make(2 * z)], [R.make(3), R.make(z)], [R.make(-1), R.make(-z)], [R.make(1), R.make(-2 * z)], [R.make(-2), R.make(z)]]
        .filter(c => !R.eq(zeroOf(c[0], c[1]), R.make(z))).map(c => yeq(c[0], c[1]));
      return tag(U.mc(`Which function has a <b>zero of ${sn(z)}</b>?`, right, U.shuffle(cands),
        `A zero of ${sn(z)} means y = 0 when x = ${sn(z)}. Check: ${lin(m, R.make(-m.n * z, m.d)).replace(/<i>x<\/i>/g, `(${sn(z)})`)} = 0. For the others, plugging in ${sn(z)} does not give 0.`), SE);
    }
    if (t === 3) { // which function has f(a) = v (some are not linear)
      const a = U.pick([-3, -2, -1, 2, 3]), fams = U.shuffle(NLF), r = fams[0], c0 = U.ri(-6, 6), v = r.f(a, c0);
      const wr = fams.slice(1, 5).map(fm => { let c = v; if (fm.f(a, c) === v) c = v + 1; return [fm, c]; }).filter(w => w[0].f(a, w[1]) !== v);
      return tag(U.mc(`Which function has <b><i>f</i>(${sn(a)}) = ${sn(v)}</b>?`, `${fn('f')} = ${r.s(c0)}`, wr.map(w => `${fn('f')} = ${w[0].s(w[1])}`),
        `Plug in x = ${sn(a)}. ${r.s(c0).replace(/<i>x<\/i>/g, `(${sn(a)})`)} = ${sn(v)} ✔. ${wr.slice(0, 2).map(w => `${w[0].s(w[1]).replace(/<i>x<\/i>/g, `(${sn(a)})`)} = ${sn(w[0].f(a, w[1]))}`).join('; ')}.`), SE);
    }
    if (t === 4) return tag(U3.graphInt(), SE);
    const c = U.pick(ZM)();
    return tag(U.mc(`${c.s} What is the <b>zero</b>, and what does it mean?`, `<b>${sn(c.z)}</b>: ${c.mean}`, c.w.map(w => `<b>${sn(w[0])}</b>: ${w[1]}`),
      `Set the function equal to 0 and solve: the input is ${sn(c.z)}. The zero is the input that makes the output 0: ${c.mean}.`), SE);
  };

  // ---- Linear functions in context: write the rule, read a table, find a range
  const RULES = [
    { s: (S, r) => `A pool has ${S} gallons and drains ${r} gallons per minute. Which rule gives the gallons <i>g</i> left after <i>m</i> minutes?`, o: 'g', i: 'm', inc: false, S: [400, 900, 50], r: [8, 20], u: 'minute' },
    { s: (S, r) => `A gym charges a $${S} sign-up fee plus $${r} per month. Which rule gives the total cost <i>C</i> for <i>m</i> months?`, o: 'C', i: 'm', inc: true, S: [15, 50, 5], r: [25, 60], u: 'month' },
    { s: (S, r) => `A store has ${S} cartons of milk and sells ${r} cartons each day. Which rule gives the cartons <i>c</i> left after <i>d</i> days?`, o: 'c', i: 'd', inc: false, S: [200, 400, 5], r: [40, 70], u: 'day' },
    { s: (S, r) => `A plumber charges $${S} to come out plus $${r} per hour. Which rule gives the cost <i>P</i> for <i>h</i> hours?`, o: 'P', i: 'h', inc: true, S: [40, 100, 10], r: [50, 95], u: 'hour' },
    { s: (S, r) => `A phone starts at ${S}% battery and loses ${r}% each hour. Which rule gives the battery <i>B</i> after <i>h</i> hours?`, o: 'B', i: 'h', inc: false, S: [70, 100, 5], r: [5, 12], u: 'hour' },
  ];
  const TBLS = [['h', 'Hours', 'd', 'Miles'], ['g', 'Members', 'b', 'Boxes'], ['w', 'Weeks', 's', 'Dollars saved'], ['t', 'Tickets sold', 'p', 'Profit ($)']];
  U3.ctx = function () {
    const t = U.ri(0, 3), SC = 'Linear context';
    if (t === 0) {
      const c = U.pick(RULES), S = U.ri(c.S[0] / c.S[2], c.S[1] / c.S[2]) * c.S[2], r = U.ri(c.r[0], c.r[1]);
      const o = `<i>${c.o}</i>`, i = `<i>${c.i}</i>`, E = a => `${o} = ${a}`;
      const right = c.inc ? E(`${r}${i} + ${S}`) : E(`${S} − ${r}${i}`);
      const wr = c.inc ? [E(`${S}${i} + ${r}`), E(`${r + S}${i}`), E(`${r}${i} − ${S}`), `${i} = ${r}${o} + ${S}`] : [E(`${S} + ${r}${i}`), E(`${r}${i} − ${S}`), E(`${r} − ${S}${i}`), `${i} = ${S} − ${r}${o}`];
      return tag(U.mc(c.s(S, r), right, wr, `The starting amount (${S}) is the constant. The rate (${r} per ${c.u}) multiplies ${c.i}${c.inc ? ' and adds on' : ' and is subtracted, because the amount goes down'}. So ${right}.`), SC);
    }
    if (t === 1) { // table to rule, using the given letters
      const L = U.pick(TBLS), prop = Math.random() < 0.35, step = U.pick([1, 2]), x0 = U.ri(1, 3);
      const m = prop ? U.pick([15, 20, 45, 60]) : U.ri(2, 9), b = prop ? 0 : U.ri(1, 12), xs = [0, 1, 2, 3].map(k => x0 + k * step), ys = xs.map(x => m * x + b);
      const I = `<i>${L[0]}</i>`, O = `<i>${L[2]}</i>`, E = (mm, bb) => `${O} = ${mm}${I}${bb ? ` + ${bb}` : ''}`;
      return tag(U.mc(`Write a rule for this table. Use <i>${L[0]}</i> for ${L[1].toLowerCase()} and <i>${L[2]}</i> for ${L[3].toLowerCase()}.${tbl(xs, ys, L[1] + ` (${L[0]})`, L[3] + ` (${L[2]})`)}`, E(m, b),
        [E(m * step === m ? m + 1 : m * step, b), `${I} = ${m}${O}${b ? ` + ${b}` : ''}`, E(m, ys[0]), E(b || m + 2, m)],
        `Each time ${L[0]} goes up ${step}, ${L[2]} goes up ${m * step}: rate = ${m * step} ÷ ${step} = ${m}. Work back to ${L[0]} = 0: ${ys[0]} − ${m} × ${x0} = ${b}. Rule: ${E(m, b)}.`), SC);
    }
    if (t === 2) return tag(U3.meaning(), SC);
    // range of a context with whole days
    const r = U.pick([40, 50, 60, 75]), k = U.ri(3, 5), left = U.pick([0, U.ri(5, r - 5)]), N = r * k + left;
    const R0 = Array.from({ length: k + 1 }, (_, d) => N - r * d).sort((p, q) => p - q);
    return tag(U.mc(`A store has ${N} cartons of milk and sells ${r} each day, so <b><i>c</i> = ${N} − ${r}<i>d</i></b>. The cartons are counted at the end of each whole day until there are not enough for another day. What is the <b>range</b>?`, setStr(R0),
      [setStr(Array.from({ length: k + 1 }, (_, d) => d)), setStr(R0.concat([]).map((v, j) => j === 0 ? v - r : v)), SB('c', 0, N), setStr([left, N])],
      `d = 0, 1, …, ${k} whole days. Plug each in: ${R0.slice().reverse().map(sn).join(', ')}. ${left ? `After day ${k} only ${left} are left, not enough for another day.` : `After day ${k} the milk is gone.`} Range: ${setStr(R0)}.`), SC);
  };

  // ---- Transformations, Mr. Levine's way: a·f(x) + k applied to the whole function
  U3.ltrans = function () {
    const t = U.ri(0, 3), ST = 'Transformations';
    const vk = k => `${k > 0 ? 'up' : 'down'} ${Math.abs(k)}`;
    if (t === 0) {
      const m = nz(-4, 4), b = nz(-6, 6), a = U.pick([2, 3, 4]), k = nz(-6, 6);
      return tag(U.mc(`<b>${fx(m, b)}</b>. The function <i>g</i> is <i>f</i> made <b>steeper by a factor of ${a}</b> and then shifted <b>${vk(k)}</b>. Which is ${fn('g')}?`, `${fn('g')} = ${lin(a * m, a * b + k)}`,
        [`${fn('g')} = ${lin(a * m, b + k)}`, `${fn('g')} = ${lin(a * m, a * (b + k))}`, `${fn('g')} = ${lin(m, a * b + k)}`, `${fn('g')} = ${lin(m + a, b + k)}`, `${fn('g')} = ${lin(a * m, a * b - k)}`, `${fn('g')} = ${lin(a * m, a * b)}`],
        `Multiply the whole function by ${a}, then ${k > 0 ? 'add' : 'subtract'} ${Math.abs(k)}: g(x) = ${a}(${lin(m, b)}) ${k > 0 ? '+' : '−'} ${Math.abs(k)} = ${lin(a * m, a * b)} ${k > 0 ? '+' : '−'} ${Math.abs(k)} = ${lin(a * m, a * b + k)}. The ${a} multiplies the ${sn(b)} too.`), ST);
    }
    if (t === 1) {
      const m = 2 * nz(-3, 3), b = 2 * nz(-4, 4), k = nz(-6, 6);
      return tag(U.mc(`<b>${fx(m, b)}</b>. The function <i>g</i> is <i>f</i> made <b>less steep by a factor of ${fr(1, 2)}</b> and then shifted <b>${vk(k)}</b>. Which is ${fn('g')}?`, `${fn('g')} = ${lin(m / 2, b / 2 + k)}`,
        [`${fn('g')} = ${lin(m / 2, b + k)}`, `${fn('g')} = ${lin(2 * m, 2 * b + k)}`, `${fn('g')} = ${lin(m / 2, R.make(b + k, 2))}`, `${fn('g')} = ${lin(m, b / 2 + k)}`],
        `Multiply the whole function by ½, then ${k > 0 ? 'add' : 'subtract'} ${Math.abs(k)}: g(x) = ½(${lin(m, b)}) ${k > 0 ? '+' : '−'} ${Math.abs(k)} = ${lin(m / 2, b / 2)} ${k > 0 ? '+' : '−'} ${Math.abs(k)} = ${lin(m / 2, b / 2 + k)}.`), ST);
    }
    const h = nz(-5, 5), k = nz(-6, 6), hs = `${Math.abs(h)} ${h > 0 ? 'right' : 'left'}`;
    const inner = hh => `<i>x</i> ${hh > 0 ? '−' : '+'} ${Math.abs(hh)}`, out = (hh, kk) => `<i>g</i>(${inner(hh)}) ${kk > 0 ? '+' : '−'} ${Math.abs(kk)}`;
    if (t === 2) {
      return tag(U.mc(`The graph of ${fn('g')} is shifted <b>${hs}</b> and <b>${vk(k)}</b>. Which is the new function?`, out(h, k), [out(-h, k), out(h, -k), out(-h, -k), `${fn('g')} ${h + k > 0 ? '+' : '−'} ${Math.abs(h + k) || 1}`],
        `Horizontal shifts go inside and work backwards: ${Math.abs(h)} ${h > 0 ? 'right' : 'left'} means x ${h > 0 ? '−' : '+'} ${Math.abs(h)}. Vertical shifts go outside: ${vk(k)} means ${k > 0 ? '+' : '−'} ${Math.abs(k)}. So ${out(h, k)}.`), ST);
    }
    const m = U.pick([-4, -3, -2, 2, 3, 4]), b = U.ri(-6, 6), nb = b - m * h + k;
    return tag(U.mc(`<b>${fx(m, b)}</b> is shifted <b>${hs}</b> and <b>${vk(k)}</b>. Which is the new function?`, `${fn('g')} = ${lin(m, nb)}`,
      [`${fn('g')} = ${lin(m, b + m * h + k)}`, `${fn('g')} = ${lin(m, b - h + k)}`, `${fn('g')} = ${lin(m, b - m * h - k)}`, `${fn('g')} = ${lin(m, b + h + k)}`],
      `Replace x with (${inner(h)}), then ${k > 0 ? 'add' : 'subtract'} ${Math.abs(k)}: ${sn(m)}(${inner(h)})${b ? ` ${b < 0 ? '−' : '+'} ${Math.abs(b)}` : ''} ${k > 0 ? '+' : '−'} ${Math.abs(k)} = ${lin(m, nb)}. Distribute the ${sn(m)} to the ${sn(-h)} as well.`), ST);
  };

  // ---- Test only: the data cycle
  const IV = [['hours the store is open', 'number of shoes sold'], ['hours of training', 'number of backflips a gymnast can do'], ['outside temperature', 'heating bill'],
    ['number of people at a party', 'pizzas needed'], ['minutes spent shoveling', 'snow left on the driveway'], ['amount of fertilizer used', 'plant height'], ['miles driven', 'gas left in the tank']];
  U3.vars = function () {
    const p = U.pick(IV), indep = Math.random() < 0.5;
    return tag(U.mc(`A study looks at the <b>${p[0]}</b> and the <b>${p[1]}</b>. Which is the <b>${indep ? 'independent' : 'dependent'}</b> variable?`, `the ${indep ? p[0] : p[1]}`,
      [`the ${indep ? p[1] : p[0]}`, 'both of them', 'neither of them'], `The ${p[1]} depends on the ${p[0]}, so the ${p[1]} is the dependent variable (y) and the ${p[0]} is the independent variable (x).`), 'Data cycle');
  };
  const QS = ['Is the heating bill higher the colder it is outside?', 'Do taller students have longer arm spans?', 'Do students who sleep more get higher test scores?', 'Does a car lose value as it gets older?', 'Do players who practice longer make more free throws?'];
  const QU = ['What is the most popular lunch choice?', 'How many students ride the bus?', 'What is the average height of a sixth grader?', 'Which sport do most students like best?', 'What color car is most common in the parking lot?'];
  U3.question = function () {
    return tag(U.mc('Which question would lead to data you could show on a <b>scatterplot</b>?', U.pick(QS), U.sample(QU, 3),
      'A scatterplot needs two number variables for each person or thing, to see if they are related. The other questions are about one variable or a category.'), 'Data cycle');
  };
  const CW = [['time spent shoveling', 'snow left on the driveway', 2], ['hours of practice', 'free throws made', 1], ['height', 'shoe size', 1], ['outside temperature', 'heating bill', 2],
    ['shoe size', 'favorite number', 0], ['minutes running', 'calories burned', 1], ['age of a car', 'its value', 2], ['birthday month', 'height', 0], ['number of absences', 'test score', 2], ['hours of sunlight', 'last digit of a phone number', 0]];
  U3.corr = function () {
    const c = U.pick(CW);
    return { kind: 'mc', html: true, keepOrder: true, sub: 'Data cycle', q: `What kind of correlation would you expect between <b>${c[0]}</b> and <b>${c[1]}</b>?`,
      choices: ['No correlation', 'Positive correlation', 'Negative correlation'], answer: c[2],
      explain: ['The two have nothing to do with each other, so there is no pattern.', 'When one goes up, the other tends to go up too.', 'When one goes up, the other tends to go down.'][c[2]] };
  };
  const LS = [
    { xl: 'Temperature (°F)', yl: 'Beach visitors', xs: [70, 74, 78, 82, 86, 90], m: [8, 16], b: -500, noise: 25, at: [92, 95, 97, 100] },
    { xl: 'Hours studied', yl: 'Test score', xs: [0, 1, 2, 3, 4, 5], m: [4, 6], b: 55, noise: 4, at: [6, 7] },
    { xl: 'Minutes of exercise', yl: 'Calories burned', xs: [10, 15, 20, 25, 30, 35], m: [7, 11], b: 15, noise: 12, at: [40, 45, 50] },
  ];
  U3.lsrl = function () {
    const c = U.pick(LS), m0 = U.ri(c.m[0], c.m[1]), ys = c.xs.map(x => Math.max(1, Math.round(m0 * x + c.b + (Math.random() - 0.5) * 2 * c.noise)));
    const n = c.xs.length, mx = c.xs.reduce((p, q) => p + q, 0) / n, my = ys.reduce((p, q) => p + q, 0) / n;
    let sxy = 0, sxx = 0; c.xs.forEach((x, i) => { sxy += (x - mx) * (ys[i] - my); sxx += (x - mx) * (x - mx); });
    const s100 = Math.round(sxy / sxx * 100), i100 = Math.round((my - sxy / sxx * mx) * 100);
    const eq = (a, b) => `${Y} = ${(a / 100).toFixed(2)}${X} ${b < 0 ? '−' : '+'} ${(Math.abs(b) / 100).toFixed(2)}`;
    const table = tbl(c.xs, ys, c.xl, c.yl);
    if (Math.random() < 0.6) {
      const x = U.pick(c.at), y100 = s100 * x + i100, ans = Math.round(y100 / 100);
      return tag(U.num(`The line of best fit for this data, rounded to hundredths, is <b>${eq(s100, i100)}</b>.${table}Predict the ${c.yl.replace(/ \(.*\)/, '').toLowerCase()} when ${c.xl.replace(/ \(.*\)/, '').toLowerCase()} is <b>${x}</b>. Round to the nearest whole number.`, ans,
        `Plug in x = ${x}: ${(s100 / 100).toFixed(2)} × ${x} ${i100 < 0 ? '−' : '+'} ${(Math.abs(i100) / 100).toFixed(2)} = ${(y100 / 100).toFixed(2)}, which rounds to ${ans}.`, { accept: [String(y100 / 100)] }), 'Line of best fit');
    }
    const fa = Math.round((ys[n - 1] - ys[0]) / (c.xs[n - 1] - c.xs[0]) * 100), fb = Math.round((ys[0] - fa / 100 * c.xs[0]) * 100);
    return tag(U.mc(`Use a calculator (Desmos linear regression) to find the line of best fit for this data, rounded to hundredths.${table}`, eq(s100, i100),
      [eq(s100, -i100), eq(fa === s100 ? fa + 37 : fa, fb === i100 ? fb + 151 : fb), eq(s100 + 125, i100 - 1000), eq(i100, s100)],
      `In Desmos, type the table, then y₁ ~ mx₁ + b. It gives m ≈ ${(s100 / 100).toFixed(2)} and b ≈ ${i100 < 0 ? '−' : ''}${(Math.abs(i100) / 100).toFixed(2)}. A line through only the first and last points is not the best fit.`), 'Line of best fit');
  };
  const NLR = [
    { s: '2<i>x</i>² + 3', f: x => 2 * x * x + 3 }, { s: '<i>x</i>² − 4', f: x => x * x - 4 }, { s: '|<i>x</i>| + 1', f: x => Math.abs(x) + 1 },
    { s: '−<i>x</i>² + 5', f: x => -x * x + 5 }, { s: '<i>x</i>³', f: x => x * x * x }, { s: '3<i>x</i>² − 2', f: x => 3 * x * x - 2 },
  ];
  U3.range2 = function () {
    const r = U.pick(NLR), D = U.pick([[-2, -1, 0, 1, 2], [-1, 0, 1, 2, 3], [-3, -1, 0, 1, 3]]), vals = D.map(r.f), R2 = uniqSort(vals);
    const lin2 = uniqSort(D.map(x => r.f(Math.abs(x)) * (x < 0 ? -1 : 1)));
    return tag(U.mc(`What is the range of <b>${fn('f')} = ${r.s}</b> for the domain <b>${setStr(D)}</b>?`, setStr(R2),
      [setStr(vals), setStr(D), setStr(lin2), SB('y', R2[0], R2[R2.length - 1]), setStr(R2.slice(0, -1))],
      `Plug in each x: ${D.map(x => `f(${sn(x)}) = ${sn(r.f(x))}`).join(', ')}. List each output once, smallest to largest: ${setStr(R2)}.`), 'Domain & range');
  };

  // ---- the two practice areas
  const QW = [['func', 3], ['domrange', 3.5], ['evalz', 3], ['ctx', 2.5], ['ltrans', 2.5]];
  const TW = QW.map(w => [w[0], w[1] / 2]).concat([['vars', 1], ['question', 1], ['corr', 1], ['lsrl', 2], ['range2', 1], ['scatter', 2],
    ['meaning', 1], ['features', 0.6], ['match', 0.6], ['compare', 0.6], ['trans', 0.6], ['honors', 0.6], ['context', 0.5]]);
  const mix = W => function () {
    const p = U.weighted(W, w => w[1])[0];
    const it = p === 'context' ? A.context() : U3[p]();
    if (!it.sub) it.sub = p === 'context' ? 'Real-world models' : '';
    return it;
  };
  A.u3quiz = mix(QW);
  A.u3test = mix(TW);
  A.u3quiz.parts = U3;
})();
