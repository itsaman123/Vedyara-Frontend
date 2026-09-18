// Post-build step: launches the production build, visits every route in a real
// headless browser (so all client-side data-fetching + useSEO effects run), and
// writes the fully-rendered HTML back into dist/<route>/index.html.
//
// This is what makes crawlers that don't execute JS (Bing, WhatsApp/Facebook/Twitter
// link-preview bots, most third-party SEO auditors) see real content, real per-page
// <title>/meta/canonical/JSON-LD, instead of the empty SPA shell. Real browsers still
// get this same fully-painted HTML on first load, then React quietly takes over
// (createRoot re-renders in place — no hydration mismatch risk since it fully replaces
// the DOM with the same content the API would produce anyway).
import { chromium } from "playwright";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;
const API_BASE_URL = "https://vedyara-backend.onrender.com";
const DIST_DIR = path.resolve("dist");

const staticRoutes = ["/", "/products", "/about", "/contact"];

async function fetchProductSlugs() {
  const slugs = [];
  let page = 1;
  const limit = 100;
  while (true) {
    const res = await fetch(`${API_BASE_URL}/api/v1/products?page=${page}&limit=${limit}`);
    if (!res.ok) throw new Error(`Product fetch failed: ${res.status}`);
    const payload = await res.json();
    if (!payload.success) throw new Error(payload.message || "Product fetch failed");
    slugs.push(...payload.data.items.map((p) => p.slug).filter(Boolean));
    if (page >= payload.data.pagination.pages) break;
    page += 1;
  }
  return slugs;
}

function waitForServer(url, child, timeoutMs = 30_000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    child.once("exit", (code) => {
      if (code !== 0) reject(new Error(`Preview server exited early with code ${code}`));
    });
    const tick = async () => {
      try {
        const res = await fetch(url);
        if (res.ok || res.status === 404) return resolve();
      } catch {
        // server not up yet
      }
      if (Date.now() - start > timeoutMs) return reject(new Error(`Server at ${url} did not start in time`));
      setTimeout(tick, 300);
    };
    tick();
  });
}

function killProcessTree(child) {
  return new Promise((resolve) => {
    if (child.exitCode !== null || child.killed) return resolve();
    if (process.platform === "win32") {
      spawn("taskkill", ["/pid", String(child.pid), "/t", "/f"], { stdio: "ignore" }).on("close", resolve);
    } else {
      try {
        process.kill(-child.pid, "SIGKILL");
      } catch {
        child.kill("SIGKILL");
      }
      resolve();
    }
  });
}

function outPathFor(route) {
  if (route === "/") return path.join(DIST_DIR, "index.html");
  return path.join(DIST_DIR, route.replace(/^\//, ""), "index.html");
}

async function prerenderRoute(browser, route) {
  const page = await browser.newPage();
  try {
    await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle", timeout: 60_000 });
    // useSEO() and data fetching run in a useEffect after mount — networkidle
    // usually covers it, but give React one more tick to flush.
    await page.waitForTimeout(500);
    const html = await page.content();
    const outPath = outPathFor(route);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, html);
    console.log(`  prerendered ${route} -> ${path.relative(DIST_DIR, outPath)}`);
  } finally {
    await page.close();
  }
}

async function main() {
  if (!fs.existsSync(DIST_DIR)) {
    console.error("dist/ not found — run `vite build` before prerendering.");
    process.exit(1);
  }

  console.log("Warming up API (Render free tier can cold-start slowly)...");
  try {
    await fetch(`${API_BASE_URL}/api/v1/products?limit=1`);
  } catch {
    // ignore — prerenderRoute calls will retry via page navigation
  }

  let productSlugs = [];
  try {
    productSlugs = await fetchProductSlugs();
  } catch (err) {
    console.error("Could not fetch product slugs, product pages will not be prerendered:", err.message);
  }

  const routes = [...staticRoutes, ...productSlugs.map((slug) => `/product/${slug}`)];

  console.log(`Starting preview server on port ${PORT}...`);
  const viteBin = path.resolve(
    "node_modules/.bin",
    process.platform === "win32" ? "vite.cmd" : "vite"
  );
  // shell:true is required on Windows to exec a .cmd file (spawning it directly
  // throws EINVAL); killProcessTree() below uses taskkill /T to clean up the
  // whole tree it creates, since a plain child.kill() only kills the shell wrapper.
  const server = spawn(
    viteBin,
    ["preview", "--port", String(PORT), "--strictPort"],
    { stdio: "pipe", shell: process.platform === "win32", detached: process.platform !== "win32" }
  );
  server.stderr.on("data", (d) => process.stderr.write(d));

  try {
    await waitForServer(BASE_URL, server, 30_000);

    const browser = await chromium.launch();
    try {
      for (const route of routes) {
        await prerenderRoute(browser, route);
      }
    } finally {
      await browser.close();
    }
  } finally {
    await killProcessTree(server);
  }

  console.log(`Prerendered ${routes.length} routes.`);
}

main().catch((err) => {
  // Prerendering is an enhancement, not a requirement — dist/ already contains a
  // working SPA build from the `vite build` step that ran before this. If Chromium
  // can't launch here (e.g. a CI image missing system libs), fall back to shipping
  // the plain SPA rather than failing the whole deploy.
  console.error("Prerendering failed, shipping plain SPA build instead:", err.message);
});
