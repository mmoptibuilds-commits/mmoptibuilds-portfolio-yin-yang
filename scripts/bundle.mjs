import { chromium } from "@playwright/test";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const ROUTES = ["/", "/systems/gaming-pcs", "/studio", "/contact"];
const BUDGET_KB = 170;

const b = await chromium.launch();
console.log("route                          JS gz    CSS gz   font    total gz");
console.log("─".repeat(66));
const results = [];

for (const route of ROUTES) {
  const ctx = await b.newContext({ viewport: { width: 1366, height: 768 } });
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);
  await cdp.send("Network.enable");

  const seen = new Map();
  cdp.on("Network.responseReceived", (e) => {
    seen.set(e.requestId, { url: e.response.url, type: e.type });
  });
  cdp.on("Network.loadingFinished", (e) => {
    const r = seen.get(e.requestId);
    if (r) r.encoded = e.encodedDataLength;
  });

  await p.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
  await p.waitForTimeout(400);

  let js = 0, css = 0, font = 0, other = 0;
  for (const r of seen.values()) {
    const n = r.encoded ?? 0;
    if (/\.js(\?|$)/.test(r.url)) js += n;
    else if (/\.css(\?|$)/.test(r.url)) css += n;
    else if (/\.woff2?(\?|$)/.test(r.url)) font += n;
    else other += n;
  }
  const kb = (n) => (n / 1024).toFixed(0);
  const total = js + css + font + other;
  console.log(`${route.padEnd(30)} ${(kb(js)+"KB").padStart(7)} ${(kb(css)+"KB").padStart(8)} ${(kb(font)+"KB").padStart(7)} ${(kb(total)+"KB").padStart(10)}`);
  results.push({ route, jsKb: js / 1024 });
  await ctx.close();
}
await b.close();

console.log("─".repeat(66));
const over = results.filter(r => r.jsKb > BUDGET_KB);
console.log(over.length
  ? `OVER ${BUDGET_KB}KB JS budget:\n` + over.map(r => `  ${r.route}: ${r.jsKb.toFixed(0)}KB`).join("\n")
  : `All routes within the ${BUDGET_KB}KB compressed JS budget.`);
process.exitCode = over.length ? 1 : 0;
