import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

/**
 * Visual inspection pass. Captures every route at every breakpoint that
 * spec 22 requires reviewing, plus reduced-motion and forced-colors variants.
 *
 *   ROUTES=home,systems,systems/gaming-pcs node scripts/shots.mjs
 *
 * Routes are written WITHOUT a leading slash, and "home" means "/". Git Bash
 * on Windows rewrites any argument that starts with "/" into a filesystem
 * path, so leading slashes cannot survive the shell.
 */

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = "screenshots";

const VIEWPORTS = [
  { name: "320", width: 320, height: 800 },
  { name: "375", width: 375, height: 812 },
  { name: "390", width: 390, height: 844 },
  { name: "768", width: 768, height: 1024 },
  { name: "1024", width: 1024, height: 768 },
  { name: "1366", width: 1366, height: 768 },
  { name: "1440", width: 1440, height: 900 },
  { name: "1920", width: 1920, height: 1080 },
  { name: "2560", width: 2560, height: 1200 },
  // Awkward intermediate widths, where breakpoints usually break.
  { name: "700", width: 700, height: 900 },
  { name: "900", width: 900, height: 900 },
];

const routes = (process.env.ROUTES ?? "home")
  .split(",")
  .map((r) => r.trim())
  .filter(Boolean)
  .map((r) => (r === "home" ? "/" : `/${r.replace(/^\/+/, "")}`));

const slug = (r) => (r === "/" ? "gateway" : r.replace(/^\//, "").replace(/\//g, "-"));

const browser = await chromium.launch();
const problems = [];

for (const route of routes) {
  await mkdir(`${OUT}/${slug(route)}`, { recursive: true });

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
      isMobile: vp.width < 768,
      hasTouch: vp.width < 768,
    });
    const page = await ctx.newPage();

    const consoleErrors = [];
    page.on("console", (m) => {
      if (m.type() === "error") consoleErrors.push(m.text());
    });
    page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${e.message}`));

    const res = await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
    if (!res || res.status() >= 400) {
      problems.push(`${route} @${vp.name}: HTTP ${res?.status()}`);
    }

    // Horizontal overflow is the most common responsive defect; measure it.
    const overflow = await page.evaluate(() => {
      const de = document.documentElement;
      return {
        scrollW: de.scrollWidth,
        clientW: de.clientWidth,
        offenders: [...document.querySelectorAll("*")]
          .filter((el) => el.getBoundingClientRect().right > de.clientWidth + 1)
          .slice(0, 5)
          .map((el) => {
            const r = el.getBoundingClientRect();
            return `${el.tagName.toLowerCase()}${el.className && typeof el.className === "string" ? "." + el.className.split(" ").slice(0, 2).join(".") : ""} right=${Math.round(r.right)}`;
          }),
      };
    });
    if (overflow.scrollW > overflow.clientW + 1) {
      problems.push(
        `${route} @${vp.name}: horizontal overflow ${overflow.scrollW}>${overflow.clientW} :: ${overflow.offenders.join(" | ")}`,
      );
    }

    if (consoleErrors.length) {
      problems.push(`${route} @${vp.name}: console ${consoleErrors.slice(0, 3).join(" | ")}`);
    }

    await page.screenshot({
      path: `${OUT}/${slug(route)}/${vp.name}.png`,
      fullPage: vp.width >= 768,
    });
    await ctx.close();
  }

  // Accessibility-preference variants, desktop only.
  for (const variant of [
    { name: "reduced-motion", opts: { reducedMotion: "reduce" } },
    { name: "forced-colors", opts: { forcedColors: "active" } },
    { name: "dark-pref", opts: { colorScheme: "dark" } },
  ]) {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      ...variant.opts,
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
    await page.screenshot({ path: `${OUT}/${slug(route)}/${variant.name}.png`, fullPage: true });
    await ctx.close();
  }
}

await browser.close();

if (problems.length) {
  console.log("PROBLEMS FOUND:\n" + problems.map((p) => "  - " + p).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`No overflow, HTTP or console errors across ${routes.length} route(s) x ${VIEWPORTS.length} viewports.`);
}
