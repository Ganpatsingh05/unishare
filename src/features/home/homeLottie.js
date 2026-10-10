// Lottie animations for the home page, drawn in code in the UniShare colours
// so they ship with the bundle (no files to fetch) and stay on brand. Each
// builder returns plain Lottie JSON for lottie-react. Coordinates are in each
// composition's own pixel box; the player scales them to fit.

const FPS = 60;

const rgba = (hex, a = 1) => {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255, a];
};
const still = (k) => ({ a: 0, k });
const EASE = { i: { x: [0.22], y: [1] }, o: { x: [0.5], y: [0] } };
const LINEAR = { i: { x: [1], y: [1] }, o: { x: [0], y: [0] } };
const POP = { i: { x: [0.3], y: [1.4] }, o: { x: [0.4], y: [0] } };

/** Keyframes from [frame, value, hold?] rows; `hold` jumps instead of easing. */
function keys(rows, ease = EASE) {
  return {
    a: 1,
    k: rows.map(([t, v, hold], n) => {
      const s = [].concat(v);
      if (n === rows.length - 1) return { t, s };
      return hold ? { t, s, h: 1 } : { t, s, ...ease };
    }),
  };
}
const xy = (rows, ease) => keys(rows.map(([t, [x, y], h]) => [t, [x, y, 0], h]), ease);
const sc = (rows, ease) => keys(rows.map(([t, v, h]) => [t, Array.isArray(v) ? [v[0], v[1], 100] : [v, v, 100], h]), ease);

const tr = (o = {}) => ({ ty: "tr", p: still([0, 0]), a: still([0, 0]), s: still([100, 100]), r: still(0), o: still(100), sk: still(0), sa: still(0), ...o });
const fill = (hex, a = 1) => ({ ty: "fl", c: still(rgba(hex, a)), o: still(100), r: 1 });
const stroke = (hex, w, a = 1) => ({ ty: "st", c: still(rgba(hex, a)), o: still(100), w: still(w), lc: 2, lj: 2, ml: 4 });
const ellipse = (w, h = w, p = [0, 0]) => ({ ty: "el", p: still(p), s: still([w, h]), d: 1 });
const rect = (w, h, r = 0, p = [0, 0]) => ({ ty: "rc", p: still(p), s: still([w, h]), r: still(r), d: 1 });
const path = (v, closed = false) => ({ ty: "sh", ks: still({ v, i: v.map(() => [0, 0]), o: v.map(() => [0, 0]), c: closed }) });
const trim = (e, s = still(0)) => ({ ty: "tm", s, e, o: still(0), m: 1 });
const group = (items, t) => ({ ty: "gr", it: [...items, tr(t)] });

function layer(ind, shapes, op, ks = {}) {
  return {
    ddd: 0,
    ind,
    ty: 4,
    sr: 1,
    ks: { o: still(100), r: still(0), p: still([0, 0, 0]), a: still([0, 0, 0]), s: still([100, 100, 100]), ...ks },
    ao: 0,
    shapes,
    ip: 0,
    op,
    st: 0,
    bm: 0,
  };
}
const comp = (w, h, op, layers) => ({ v: "5.7.4", fr: FPS, ip: 0, op, w, h, nm: "UniShare", ddd: 0, assets: [], layers });

/** A live dot: a solid core with two rings breathing out of it, forever. */
export function pulse(color = "#00A6E0") {
  const op = 120;
  const ring = (ind, rows) =>
    layer(ind, [group([ellipse(80), stroke(color, 5)])], op, {
      p: still([50, 50, 0]),
      s: sc(rows.map(([t, s, , h]) => [t, s, h]), LINEAR),
      o: keys(rows.map(([t, , o, h]) => [t, o, h]), LINEAR),
    });
  return comp(100, 100, op, [
    layer(1, [group([ellipse(30), fill(color)])], op, { p: still([50, 50, 0]), s: sc([[0, 100], [60, 116], [120, 100]]) }),
    ring(2, [[0, 25, 90], [120, 100, 0]]),
    ring(3, [[0, 62, 45], [60, 100, 0, true], [61, 25, 90], [120, 62, 45]]),
  ]);
}

/** Step one: a profile card slides up and gets its blue tick. */
export function signin() {
  const op = 160;
  const card = layer(
    3,
    [
      group([rect(30, 30, 15, [0, -26]), fill("#3CC3F2")]),
      group([rect(54, 8, 4, [0, 8]), fill("#A8D3DE")]),
      group([rect(36, 8, 4, [-9, 24]), fill("#A8D3DE")]),
      group([rect(92, 112, 18), fill("#FFFFFF"), stroke("#12233A", 4)]),
    ],
    op,
    {
      p: xy([[0, [80, 98]], [24, [80, 78]], [138, [80, 78]], [160, [80, 70]]]),
      o: keys([[0, 0], [16, 100], [140, 100], [158, 0]]),
    }
  );
  const tick = layer(
    1,
    [group([path([[-9, 0], [-3, 7], [10, -7]]), trim(keys([[0, 0, true], [52, 0], [74, 100]])), stroke("#FFFFFF", 6)])],
    op,
    { p: still([112, 116, 0]), o: keys([[0, 100], [140, 100], [158, 0]]) }
  );
  const badge = layer(2, [group([ellipse(44), fill("#1565D8"), stroke("#FFFFFF", 4)])], op, {
    p: still([112, 116, 0]),
    s: sc([[0, 0, true], [38, 0], [52, 118], [62, 100]], POP),
    o: keys([[0, 100], [140, 100], [158, 0]]),
  });
  return comp(160, 160, op, [tick, badge, card]);
}

/** Step two: a pin drops onto the map, bounces and sends out a ripple. */
export function pin() {
  const op = 160;
  const tip = [80, 126];
  return comp(160, 160, op, [
    layer(
      1,
      [
        group([ellipse(16, 16, [0, -44]), fill("#FFFFFF")]),
        group([ellipse(46, 46, [0, -44]), fill("#E5097F")]),
        group([path([[-19, -32], [19, -32], [0, 0]], true), fill("#E5097F")]),
      ],
      op,
      {
        p: xy([[0, [tip[0], 30]], [28, tip], [36, [tip[0], tip[1] - 10]], [44, tip], [136, tip], [158, [tip[0], 92]]]),
        s: sc([[0, 100], [28, [116, 84]], [36, [94, 106]], [46, 100]]),
        o: keys([[0, 0], [10, 100], [138, 100], [156, 0]]),
      }
    ),
    layer(2, [group([ellipse(20, 6), stroke("#E5097F", 3)])], op, {
      p: still([...tip, 0]),
      s: sc([[0, 50, true], [28, 50], [70, 320]]),
      o: keys([[0, 0, true], [28, 90], [70, 0]]),
    }),
    layer(3, [group([ellipse(46, 12), fill("#12233A", 0.18)])], op, {
      p: still([tip[0], tip[1] + 2, 0]),
      s: sc([[0, 20], [28, 100], [36, 80], [44, 100], [136, 100], [158, 40]]),
      o: keys([[0, 0], [20, 100], [138, 100], [156, 0]]),
    }),
    layer(4, [group([path([[16, 140], [144, 140]]), stroke("#12233A", 3, 0.25)])], op),
  ]);
}

/** Step three: two students walk up to each other and it clicks. */
export function meet() {
  const op = 170;
  const person = (ind, color, from, to) =>
    layer(ind, [group([ellipse(24, 24, [0, -24]), fill(color), stroke("#12233A", 3)]), group([rect(38, 34, 17, [0, 12]), fill(color), stroke("#12233A", 3)])], op, {
      p: xy([[0, [from, 98]], [44, [to, 98]], [140, [to, 98]], [168, [from, 98]]]),
      o: keys([[0, 0], [12, 100], [146, 100], [166, 0]]),
    });
  const spokes = Array.from({ length: 8 }, (_, n) => {
    const a = (n / 8) * Math.PI * 2;
    const p = (r) => [Math.round(Math.cos(a) * r * 10) / 10, Math.round(Math.sin(a) * r * 10) / 10];
    return group([path([p(16), p(28)]), stroke(n % 2 ? "#FFD24C" : "#E5097F", 5)]);
  });
  return comp(160, 160, op, [
    layer(1, [...spokes.map((g) => ({ ...g, it: [g.it[0], trim(keys([[0, 0, true], [46, 0], [62, 100]]), keys([[0, 0, true], [58, 0], [80, 100]])), ...g.it.slice(1)] }))], op, { p: still([80, 52, 0]) }),
    person(2, "#FFD24C", 140, 96),
    person(3, "#3CC3F2", 20, 64),
  ]);
}

/** A burst of brand confetti from the centre, then a pause before the next. */
export function confetti() {
  const op = 150;
  const colors = ["#00A6E0", "#E5097F", "#FFD24C", "#1565D8", "#662483", "#FFFFFF"];
  const bits = Array.from({ length: 16 }, (_, n) => {
    const a = (n / 16) * Math.PI * 2 + (n % 3) * 0.2;
    const d = 70 + (n % 4) * 18;
    const end = [100 + Math.cos(a) * d, 100 + Math.sin(a) * d * 0.8];
    const shape = n % 3 === 0 ? ellipse(9) : rect(12, 7, 2);
    return layer(n + 1, [group([shape, fill(colors[n % colors.length])])], op, {
      p: xy([[0, [100, 100]], [40, end], [80, [end[0], end[1] + 26]]]),
      r: keys([[0, 0], [80, (n % 2 ? 1 : -1) * (180 + n * 20)]]),
      s: sc([[0, 0], [8, 100]]),
      o: keys([[0, 100, true], [50, 100], [80, 0]]),
    });
  });
  return comp(200, 200, op, bits);
}

/** A mouse outline with its wheel dot rolling down: "keep scrolling". */
export function scrollCue(color = "#12233A") {
  const op = 100;
  return comp(60, 90, op, [
    layer(1, [group([rect(6, 10, 3), fill(color)])], op, { p: xy([[0, [30, 28]], [60, [30, 46]], [61, [30, 28], true], [100, [30, 28]]]), o: keys([[0, 100], [60, 0], [61, 0, true], [80, 100]]) }),
    layer(2, [group([rect(32, 52, 16), stroke(color, 3.5)])], op, { p: still([30, 45, 0]) }),
  ]);
}

export const STEP_ART = { signin, pin, meet };
