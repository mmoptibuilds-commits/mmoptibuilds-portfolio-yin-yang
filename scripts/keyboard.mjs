import { chromium } from "@playwright/test";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const b = await chromium.launch();
const fails = [];

// 1. Skip link must be first stop and actually move focus into main.
{
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(`${BASE}/systems`, { waitUntil: "networkidle" });
  await p.keyboard.press("Tab");
  const first = await p.evaluate(() => ({
    text: document.activeElement?.textContent?.trim().slice(0, 24),
    href: document.activeElement?.getAttribute("href"),
    visible: document.activeElement?.getBoundingClientRect().width > 1,
  }));
  console.log("1. first tab stop:", JSON.stringify(first));
  if (first.href !== "#main") fails.push("skip link is not the first tab stop");
  if (!first.visible) fails.push("skip link is not visible when focused");
}

// 2. Every focusable element must have a visible focus indicator.
{
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(`${BASE}/contact`, { waitUntil: "networkidle" });
  let noOutline = 0, checked = 0;
  for (let i = 0; i < 40; i++) {
    await p.keyboard.press("Tab");
    const r = await p.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      return { tag: el.tagName, outlineW: cs.outlineWidth, outlineStyle: cs.outlineStyle };
    });
    if (!r) break;
    checked++;
    if (r.outlineStyle === "none" || r.outlineW === "0px") noOutline++;
  }
  console.log(`2. focus ring: ${checked} focusable, ${noOutline} without a visible outline`);
  if (noOutline > 0) fails.push(`${noOutline} focusable elements lack a focus ring`);
}

// 3. Mobile nav. Asserts behaviour, not a library's markup: the sheet is a
//    native <dialog>, so `:modal` and the implicit dialog role are what matter,
//    and focus trapping / Escape / focus restoration come from the platform.
{
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })).newPage();
  await p.goto(`${BASE}/systems`, { waitUntil: "networkidle" });

  await p.click('button:has-text("Menu")');
  await p.waitForTimeout(500);
  const opened = await p.evaluate(() => {
    const d = document.querySelector("dialog");
    return {
      isModal: d?.matches(":modal") ?? false,
      focusInside: d ? d.contains(document.activeElement) : false,
      scrollLocked: getComputedStyle(document.documentElement).overflow === "hidden",
    };
  });

  // Focus must not escape the sheet.
  for (let i = 0; i < 25; i++) await p.keyboard.press("Tab");
  const trapped = await p.evaluate(() =>
    document.querySelector("dialog")?.contains(document.activeElement) ?? false);

  await p.keyboard.press("Escape");
  await p.waitForTimeout(400);
  const closed = await p.evaluate(() => ({
    open: document.querySelector("dialog")?.open ?? false,
    focusOnTrigger: (document.activeElement?.textContent ?? "").includes("Menu"),
    scrollReleased: getComputedStyle(document.documentElement).overflow !== "hidden",
  }));

  // Following a link inside the sheet must navigate AND close it.
  await p.click('button:has-text("Menu")');
  await p.waitForTimeout(300);
  await p.click('dialog a[href="/systems/workstations"]');
  await p.waitForTimeout(1600);
  const navigated = await p.evaluate(() => ({
    path: location.pathname,
    stillOpen: document.querySelector("dialog")?.open ?? false,
  }));

  console.log("3. mobile nav:", JSON.stringify({ ...opened, trapped, ...closed, ...navigated }));
  if (!opened.isModal) fails.push("mobile nav did not open as a modal");
  if (!opened.focusInside) fails.push("focus did not move into the sheet");
  if (!opened.scrollLocked) fails.push("page scroll not locked while sheet open");
  if (!trapped) fails.push("focus escaped the sheet");
  if (closed.open) fails.push("Escape did not close the sheet");
  if (!closed.focusOnTrigger) fails.push("focus not restored to the trigger");
  if (!closed.scrollReleased) fails.push("scroll lock not released on close");
  if (navigated.path !== "/systems/workstations") fails.push("sheet link did not navigate");
  if (navigated.stillOpen) fails.push("sheet stayed open after navigating");
}

// 4. Reduced motion: content readable, no transform left applied.
{
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" })).newPage();
  await p.goto(`${BASE}/studio`, { waitUntil: "networkidle" });
  const r = await p.evaluate(() => {
    const els = [...document.querySelectorAll("[data-reveal]")];
    return {
      count: els.length,
      transformed: els.filter(e => {
        const t = getComputedStyle(e).transform;
        return t && t !== "none" && t !== "matrix(1, 0, 0, 1, 0, 0)";
      }).length,
      hidden: els.filter(e => Number(getComputedStyle(e).opacity) < 0.99).length,
    };
  });
  console.log("4. reduced motion:", JSON.stringify(r));
  if (r.transformed > 0) fails.push(`${r.transformed} reveals still transformed under reduced motion`);
  if (r.hidden > 0) fails.push(`${r.hidden} reveals not fully opaque under reduced motion`);
}

// 5. Content must survive with JavaScript disabled.
{
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false })).newPage();
  await p.goto(`${BASE}/systems/gaming-pcs`, { waitUntil: "load" });
  const r = await p.evaluate(() => ({
    h1: document.querySelector("h1")?.textContent?.trim().slice(0, 30),
    questions: document.querySelectorAll("ol li h3").length,
    words: document.body.innerText.split(/\s+/).length,
  }));
  console.log("5. no-JS:", JSON.stringify(r));
  if (!r.h1) fails.push("no-JS: no h1");
  if (r.questions < 5) fails.push(`no-JS: only ${r.questions} questions rendered`);
  if (r.words < 300) fails.push(`no-JS: only ${r.words} words`);
}

await b.close();
console.log(fails.length ? "\nFAILURES:\n" + fails.map(f => "  - " + f).join("\n") : "\nAll keyboard, motion and no-JS checks passed.");
process.exitCode = fails.length ? 1 : 0;
