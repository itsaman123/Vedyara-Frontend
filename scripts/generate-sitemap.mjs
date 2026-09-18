// Regenerates public/sitemap.xml with every static route + every active product page.
// Run manually (`node scripts/generate-sitemap.mjs`) or wire into the build (`npm run build`).
import fs from "fs";
import path from "path";

const SITE_URL = "https://vedyara.in";
const API_BASE_URL = "https://vedyara-backend.onrender.com";
const OUT_PATH = path.resolve("public/sitemap.xml");

const today = new Date().toISOString().slice(0, 10);

const staticRoutes = [
  { loc: "/", changefreq: "weekly", priority: "1.0" },
  { loc: "/products", changefreq: "weekly", priority: "0.9" },
  { loc: "/about", changefreq: "monthly", priority: "0.7" },
  { loc: "/contact", changefreq: "monthly", priority: "0.6" },
];

async function fetchAllProducts() {
  const products = [];
  let page = 1;
  const limit = 100;

  while (true) {
    const url = `${API_BASE_URL}/api/v1/products?page=${page}&limit=${limit}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Product fetch failed: ${res.status} ${res.statusText}`);
    const payload = await res.json();
    if (!payload.success) throw new Error(payload.message || "Product fetch failed");

    products.push(...payload.data.items);

    const { pages } = payload.data.pagination;
    if (page >= pages) break;
    page += 1;
  }

  return products;
}

function urlEntry({ loc, lastmod, changefreq, priority }) {
  return [
    "  <url>",
    `    <loc>${SITE_URL}${loc}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ].join("\n");
}

async function main() {
  let products = [];
  try {
    products = await fetchAllProducts();
  } catch (err) {
    console.error("Could not fetch products from API, sitemap will only include static pages:", err.message);
  }

  const entries = [
    ...staticRoutes.map((r) => urlEntry({ ...r, lastmod: today })),
    ...products
      .filter((p) => p.slug)
      .map((p) =>
        urlEntry({
          loc: `/product/${p.slug}`,
          lastmod: (p.updatedAt || today).slice(0, 10),
          changefreq: "weekly",
          priority: "0.8",
        })
      ),
  ];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    "</urlset>",
    "",
  ].join("\n");

  fs.writeFileSync(OUT_PATH, xml);
  console.log(`Wrote ${entries.length} URLs (${products.length} products) to ${OUT_PATH}`);
}

main();
