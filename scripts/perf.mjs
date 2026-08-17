import { chromium } from "@playwright/test";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const ROUTES = ["/", "/systems", "/systems/gaming-pcs", "/studio", "/studio/work/coldharbour", "/contact"];

const b = await chromium.launch();
console.log("route                          LCP     CLS    JS(KB)  CSS(KB)  reqs  transferKB");
console.log("─".repeat(84));

const rows = [];
for (const route of ROUTES) {
  const ctx = await b.newContext({ viewport: { width: 1366, height: 768 } });
  const p = await ctx.newPage();

  const bytes = { js: 0, css: 0, font: 0, other: 0 };
  let reqs = 0;
  p.on("response", async (res) => {
    reqs++;
    const url = res.url();
    let len = Number(res.headers()["content-length"] ?? 0);
    if (!len) { try { len = (await res.body()).length; } catch { len = 0; } }
    if (/\.js(\?|$)/.test(url)) bytes.js += len;
    else if (/\.css(\?|$)/.test(url)) bytes.css += len;
    else if (/\.(woff2?|ttf)(\?|$)/.test(url)) bytes.font += len;
    else bytes.other += len;
  });

  await p.goto(`${BASE}${route}`, { waitUntil: "networkidle" });

  const vitals = await p.evaluate(() => new Promise((resolve) => {
    let lcp = 0, cls = 0;
    new PerformanceObserver((l) => { for (const e of l.getEntries()) lcp = e.startTime; })
      .observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
    // Force one more frame, then report.
    requestAnimationFrame(() => setTimeout(() => resolve({ lcp, cls }), 700));
  }));

  const kb = (n) => (n / 1024).toFixed(0);
  const total = bytes.js + bytes.css + bytes.font + bytes.other;
  console.log(
    `${route.padEnd(30)} ${vitals.lcp.toFixed(0).padStart(5)}ms ${vitals.cls.toFixed(3).padStart(6)} ${kb(bytes.js).padStart(7)} ${kb(bytes.css).padStart(8)} ${String(reqs).padStart(5)} ${kb(total).padStart(11)}`,
  );
  rows.push({ route, lcp: vitals.lcp, cls: vitals.cls, js: bytes.js });
  await ctx.close();
}
await b.close();

console.log("─".repeat(84));
const bad = rows.filter(r => r.lcp > 2500 || r.cls > 0.1 || r.js > 170 * 1024);
if (bad.length) {
  console.log("OVER BUDGET:");
  for (const r of bad) console.log(`  ${r.route}: LCP ${r.lcp.toFixed(0)}ms CLS ${r.cls.toFixed(3)} JS ${(r.js/1024).toFixed(0)}KB`);
} else {
  console.log("All routes within budget: LCP <= 2500ms, CLS <= 0.1, JS <= 170KB.");
}
