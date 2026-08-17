import { spawn } from "node:child_process";

/**
 * One command that proves the site actually works.
 *
 *   npm run verify
 *
 * Runs the fast static gates, then boots a real production server and runs the
 * browser-driven suites against it. Everything is checked against built output
 * rather than the dev server, because several defects on this project only
 * appeared in production — a CSS chunk that 500'd, fonts preloading per route,
 * and compressed bundle sizes.
 *
 * Exits non-zero if any gate fails, so CI can use it directly.
 */

const PORT = Number(process.env.VERIFY_PORT ?? 3123);
const BASE = `http://localhost:${PORT}`;

const ROUTES = [
  "home",
  "systems",
  "systems/gaming-pcs",
  "systems/workstations",
  "systems/enterprise-hardware",
  "studio",
  "studio/business-websites",
  "studio/startup-websites",
  "studio/website-redesign",
  "studio/work",
  "studio/work/coldharbour",
  "about",
  "about/story",
  "contact",
  "privacy",
  "terms",
].join(",");

const results = [];

function run(label, command, args, env = {}) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      stdio: ["ignore", "pipe", "pipe"],
      shell: process.platform === "win32",
      env: { ...process.env, ...env },
    });
    let out = "";
    child.stdout.on("data", (d) => (out += d));
    child.stderr.on("data", (d) => (out += d));
    child.on("close", (code) => {
      results.push({ label, ok: code === 0, out: out.trimEnd() });
      console.log(`\n${code === 0 ? "PASS" : "FAIL"}  ${label}`);
      // Only the tail matters unless it failed.
      const lines = out.trimEnd().split("\n");
      console.log((code === 0 ? lines.slice(-6) : lines.slice(-40)).map((l) => "      " + l).join("\n"));
      resolve(code === 0);
    });
  });
}

async function portIsFree(port) {
  try {
    const res = await fetch(`http://localhost:${port}`, {
      signal: AbortSignal.timeout(1500),
    });
    // Something answered, so the port is taken.
    void res;
    return false;
  } catch {
    return true;
  }
}

/**
 * Kill the server and everything it spawned.
 *
 * On Windows, spawning through a shell means kill() terminates the cmd.exe
 * wrapper and leaves the real Next process listening. A stale server then
 * serves the PREVIOUS build's HTML against the current build's chunk hashes,
 * which produces 500s on asset requests and looks exactly like an application
 * bug. Two separate false failures on this project traced back to that, so the
 * whole process tree is killed explicitly.
 */
async function killTree(child) {
  if (!child.pid) return;
  if (process.platform === "win32") {
    await new Promise((resolve) => {
      const k = spawn("taskkill", ["/PID", String(child.pid), "/T", "/F"], {
        stdio: "ignore",
      });
      k.on("close", resolve);
      k.on("error", resolve);
    });
  } else {
    try {
      process.kill(-child.pid, "SIGTERM");
    } catch {
      child.kill("SIGKILL");
    }
  }
}

async function waitForServer(timeoutMs = 60_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const res = await fetch(BASE, { signal: AbortSignal.timeout(3000) });
      if (res.ok) return true;
    } catch {
      // Not up yet.
    }
    await new Promise((r) => setTimeout(r, 700));
  }
  return false;
}

console.log("── static gates ─────────────────────────────────────────────");
await run("typecheck", "npx", ["tsc", "--noEmit"]);
await run("lint", "npx", ["eslint", ".", "--max-warnings=0"]);
await run("unit tests", "npx", ["vitest", "run"]);
await run("production build", "npx", ["next", "build"]);

console.log("\n── booting production server ────────────────────────────────");

// Refuse to run against a port someone else owns: a stale server would serve a
// different build and every result below would be about the wrong code.
if (!(await portIsFree(PORT))) {
  console.log(
    `\nFAIL  port ${PORT} is already in use. Stop that process, or set VERIFY_PORT.`,
  );
  process.exitCode = 1;
  process.exit(1);
}

const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
  stdio: "ignore",
  shell: process.platform === "win32",
  detached: process.platform !== "win32",
});

const up = await waitForServer();
if (!up) {
  console.log(`\nFAIL  production server did not come up on ${BASE}`);
  results.push({ label: "server boot", ok: false });
} else {
  console.log(`      up on ${BASE}`);
  console.log("\n── browser gates ────────────────────────────────────────────");
  await run("accessibility (axe + structure)", "node", ["scripts/a11y.mjs"], { BASE_URL: BASE });
  await run("keyboard / reduced motion / no-JS", "node", ["scripts/keyboard.mjs"], { BASE_URL: BASE });
  await run("responsive (16 routes x 11 viewports)", "node", ["scripts/shots.mjs"], {
    BASE_URL: BASE,
    ROUTES,
  });
  await run("bundle budget", "node", ["scripts/bundle.mjs"], { BASE_URL: BASE });
  await run("core web vitals", "node", ["scripts/perf.mjs"], { BASE_URL: BASE });
}

await killTree(server);

console.log("\n── summary ──────────────────────────────────────────────────");
for (const r of results) console.log(`  ${r.ok ? "pass" : "FAIL"}  ${r.label}`);

const failed = results.filter((r) => !r.ok);
console.log(
  failed.length
    ? `\n${failed.length} gate(s) failed.`
    : `\nAll ${results.length} gates passed.`,
);
process.exitCode = failed.length ? 1 : 0;
