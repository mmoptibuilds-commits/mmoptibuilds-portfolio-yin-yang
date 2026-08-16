/**
 * Verifies every text/background pair in the token system against WCAG 2.2.
 * Run with: node scripts/check-contrast.mjs
 *
 * Values are parsed out of app/globals.css so this cannot drift from the
 * real tokens.
 */
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

function tokensFor(scope) {
  const block = css.match(new RegExp(`\\.division-${scope}\\s*\\{([\\s\\S]*?)\\n\\}`));
  if (!block) throw new Error(`no .division-${scope} block found`);
  const out = {};
  for (const [, name, value] of block[1].matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{3,8})\s*;/g)) {
    out[name] = value;
  }
  return out;
}

function toRgb(hex) {
  let h = hex.replace("#", "");
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

function luminance(hex) {
  const [r, g, b] = toRgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// [foreground, background, minimum required, description]
const checks = [];
for (const scope of ["systems", "studio"]) {
  const t = tokensFor(scope);
  const on = (fg, bg, min, why) => checks.push([scope, fg, bg, t[fg], t[bg], min, why]);

  on("ink", "surface", 4.5, "body text");
  on("ink", "surface-raised", 4.5, "body text on raised");
  on("ink", "surface-sunken", 4.5, "body text on sunken");
  on("ink-muted", "surface", 4.5, "secondary text");
  on("ink-muted", "surface-raised", 4.5, "secondary text on raised");
  on("ink-faint", "surface", 3.0, "non-essential text (large only)");
  on("accent", "surface", 4.5, "link and interactive text");
  on("accent", "surface-raised", 4.5, "link on raised");
  on("accent-contrast", "accent", 4.5, "text on an accent fill");
  on("signal", "surface", 3.0, "status indicator (non-text carrier)");
  on("border-control", "surface", 3.0, "control boundary (WCAG 1.4.11)");
  on("border-control", "surface-raised", 3.0, "control boundary on raised");
}

let failures = 0;
let widest = 0;
for (const c of checks) widest = Math.max(widest, `${c[0]}/${c[6]}`.length);

console.log("WCAG 2.2 contrast verification\n");
for (const [scope, fgName, bgName, fg, bg, min, why] of checks) {
  if (!fg || !bg) {
    console.log(`?? ${scope} ${fgName} on ${bgName} — token missing`);
    failures++;
    continue;
  }
  const r = ratio(fg, bg);
  const pass = r >= min;
  if (!pass) failures++;
  const tag = `${scope}/${why}`.padEnd(widest);
  console.log(
    `${pass ? "PASS" : "FAIL"}  ${tag}  ${fgName} on ${bgName}  ` +
      `${r.toFixed(2)}:1 (min ${min.toFixed(1)})  ${fg}/${bg}`,
  );
}

console.log(`\n${checks.length - failures}/${checks.length} pass`);
if (failures > 0) {
  console.error(`${failures} contrast failure(s)`);
  process.exit(1);
}
