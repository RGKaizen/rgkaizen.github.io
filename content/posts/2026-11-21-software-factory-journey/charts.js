// Draws the commits-per-week and beads-per-week charts.
const commits = [["W13",3],["W14",2],["W15",3],["W16",3],["W17",4],["W18",1],["W19",4],["W20",4],["W21",3],["W22",0],["W23",0],["W24",2],["W25",6],["W26",15],["W27",10],["W28",3],["W29",2],["W30",6],["W31",14],["W32",0],["W33",0],["W34",40],["W35",32],["W36",61],["W37",46],["W38",31],["W39",85],["W40",187],["W41",51],["W42",247],["W43",411],["W44",389],["W45",217],["W46",530],["W47",1334]];
const beads = [["W34",36],["W35",32],["W36",74],["W37",39],["W38",34],["W39",71],["W40",134],["W41",63],["W42",209],["W43",395],["W44",514],["W45",157],["W46",538],["W47",931]];
// Stage bands by first and last ISO week.
const stages = [[13,25,"1"],[26,33,"2"],[34,38,"3"],[39,41,"4"],[42,43,"5"],[44,47,"6"]];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
// Monday of an ISO week in 2026 (week 2 starts on January 5).
const weekMonday = w => { const d = new Date(Date.UTC(2026,0,5)); d.setUTCDate(d.getUTCDate() + (w-2)*7); return d; };
const monthOf = w => MONTHS[weekMonday(w).getUTCMonth()];
const dayLabel = w => { const d = weekMonday(w); return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`; };

function draw(id, data, opts) {
  const W = 880, H = 300, m = {l: 48, r: 12, t: 26, b: 34};
  const iw = W - m.l - m.r, ih = H - m.t - m.b;
  const first = +data[0][0].slice(1), n = data.length, bw = iw / n;
  const max = Math.max(...data.map(d => d[1]));
  const y = opts.log
    ? v => v <= 0 ? ih : ih - (Math.log10(v) / Math.log10(2000)) * ih
    : v => ih - (v / (Math.ceil(max/200)*200)) * ih;
  const ticks = opts.log ? [1,10,100,1000] : Array.from({length: Math.ceil(max/200)+1}, (_,i) => i*200);
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${opts.label}"><g transform="translate(${m.l},${m.t})">`;
  stages.forEach(([a,b,name], i) => {
    const x0 = Math.max(0, (a-first)*bw), x1 = Math.min(iw, (b-first+1)*bw);
    if (x1 <= 0) return;
    if (i % 2 === 0) s += `<rect x="${x0}" y="-20" width="${x1-x0}" height="${ih+20}" fill="var(--band)"/>`;
    s += `<text class="band-lbl" x="${(x0+x1)/2}" y="-6" text-anchor="middle">${name}</text>`;
  });
  s += `<g class="axis">`;
  ticks.forEach(t => { s += `<line class="grid" x1="0" x2="${iw}" y1="${y(t)}" y2="${y(t)}"/><text x="-8" y="${y(t)+4}" text-anchor="end">${t}</text>`; });
  // Label the first week of each month with the month name.
  data.forEach(([w], i) => {
    const mon = monthOf(+w.slice(1));
    if (i === 0 || mon !== monthOf(+data[i-1][0].slice(1))) s += `<text x="${i*bw+bw/2}" y="${ih+18}" text-anchor="middle">${mon}</text>`;
  });
  s += `</g>`;
  data.forEach(([w,v], i) => {
    const bx = i*bw + 2, bwid = Math.max(2, bw - 4), top = v > 0 ? y(v) : ih, h = ih - top;
    const r = Math.min(4, bwid/2, h);
    const path = h > 0 ? `M${bx},${ih} V${top+r} q0,-${r} ${r},-${r} H${bx+bwid-r} q${r},0 ${r},${r} V${ih} Z` : "";
    s += `<rect class="hit" x="${i*bw}" y="0" width="${bw}" height="${ih}" data-w="${w}" data-v="${v}"/>`;
    if (path) s += `<path d="${path}" fill="var(--series-1)" pointer-events="none"/>`;
  });
  s += `</g></svg>`;
  const el = document.getElementById(id); el.innerHTML = s;
  const tip = document.getElementById("tip");
  el.querySelectorAll("rect.hit").forEach(r => {
    r.addEventListener("mousemove", e => {
      const w = r.dataset.w;
      tip.textContent = `Week of ${dayLabel(+w.slice(1))}: ${(+r.dataset.v).toLocaleString()} ${opts.unit}`;
      tip.style.left = (e.clientX + 12) + "px"; tip.style.top = (e.clientY - 34) + "px"; tip.style.opacity = 1;
    });
    r.addEventListener("mouseleave", () => tip.style.opacity = 0);
  });
}
draw("commits", commits, {log: true, unit: "commits", label: "Commits per week, log scale"});
draw("beads", beads, {log: false, unit: "beads closed", label: "Beads closed per week"});
