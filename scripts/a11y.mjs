import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";

const ROUTES = ["/", "/systems", "/systems/gaming-pcs", "/studio", "/studio/business-websites",
  "/studio/work", "/studio/work/coldharbour", "/about", "/about/story", "/contact",
  "/contact?intent=studio-brief", "/privacy", "/terms", "/nope-404"];

const b = await chromium.launch();
let totalViolations = 0;

for (const route of ROUTES) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(`${BASE}${route}`, { waitUntil: "networkidle" });

  const results = await new AxeBuilder({ page: p })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();

  // Heading order + landmark sanity, which axe only partly covers.
  const structure = await p.evaluate(() => {
    const hs = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map(h => +h.tagName[1]);
    let jump = null;
    for (let i = 1; i < hs.length; i++) if (hs[i] - hs[i-1] > 1) { jump = `${hs[i-1]}->${hs[i]}`; break; }
    return {
      h1: document.querySelectorAll("h1").length,
      jump,
      main: document.querySelectorAll("main").length,
      skip: !!document.querySelector('a[href="#main"]'),
      lang: document.documentElement.lang,
      title: document.title.slice(0, 60),
    };
  });

  const issues = [];
  if (structure.h1 !== 1) issues.push(`h1 count = ${structure.h1}`);
  if (structure.jump) issues.push(`heading jump ${structure.jump}`);
  if (structure.main !== 1) issues.push(`main count = ${structure.main}`);
  if (!structure.skip) issues.push("no skip link");
  if (!structure.lang) issues.push("no lang");
  if (!structure.title) issues.push("no title");

  totalViolations += results.violations.length;
  const tag = results.violations.length || issues.length ? "FAIL" : "ok  ";
  console.log(`${tag} ${route.padEnd(34)} axe=${results.violations.length} ${issues.join("; ")}`);
  for (const v of results.violations) {
    console.log(`      [${v.impact}] ${v.id}: ${v.help}`);
    for (const n of v.nodes.slice(0, 2)) console.log(`         ${n.target.join(" ")} :: ${(n.failureSummary||"").split("\n")[1]?.trim().slice(0,110)}`);
  }
  await p.close();
}
await b.close();
console.log(`\nTOTAL AXE VIOLATIONS: ${totalViolations}`);
