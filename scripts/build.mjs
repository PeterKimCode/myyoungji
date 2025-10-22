import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { NAV } from "../src/data/nav.js";
import { renderBaseLayout } from "../src/layouts/BaseLayout.js";
import { createWithBase } from "../src/utils/url.js";
import { siteConfig } from "../site.config.js";
import { customPageRenderers } from "./customPages.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const pagesDir = path.join(rootDir, "src", "pages");
const distDir = path.join(rootDir, "dist");
const publicDir = path.join(rootDir, "public");
const stylesDir = path.join(rootDir, "src", "styles");

const base = process.env.BASE_URL ?? siteConfig.base ?? "/";
const withBase = createWithBase(base);
const trailingSlash = siteConfig.trailingSlash ?? "always";

const ensureTrailingSlash = (route) => {
  if (route === "/") {
    return route;
  }
  return route.endsWith("/") ? route : `${route}/`;
};

const collectAstroFiles = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectAstroFiles(entryPath)));
    } else if (entry.isFile() && entry.name.endsWith(".astro")) {
      files.push(entryPath);
    }
  }
  return files;
};

const getRouteFromFile = (filePath) => {
  const relative = path.relative(pagesDir, filePath);
  if (relative === "404.astro") {
    return "/404/";
  }
  const segments = relative.split(path.sep);
  const filename = segments.pop();
  const name = filename.replace(/\.astro$/, "");
  if (name === "index") {
    const routeSegments = segments.filter(Boolean);
    if (routeSegments.length === 0) {
      return "/";
    }
    return ensureTrailingSlash(`/${routeSegments.join("/")}/`);
  }
  const route = `/${[...segments, name].filter(Boolean).join("/")}`;
  return ensureTrailingSlash(route);
};

const parseStaticAstro = (content) => {
  const layoutMatch = content.match(/<BaseLayout([\s\S]*?)>([\s\S]*)<\/BaseLayout>/);
  if (!layoutMatch) {
    throw new Error("Unable to find BaseLayout wrapper");
  }
  const attributes = layoutMatch[1];
  const body = layoutMatch[2].trim();
  const titleMatch = attributes.match(/title="([^"]*)"/);
  const descriptionMatch = attributes.match(/description="([^"]*)"/);
  return {
    title: titleMatch?.[1] ?? "",
    description: descriptionMatch?.[1] ?? "",
    content: body
  };
};

const writePage = async ({ route, title, description, content }) => {
  const normalizedRoute = trailingSlash === "always" ? ensureTrailingSlash(route) : route;
  const relativePath = normalizedRoute === "/" ? [] : normalizedRoute.replace(/^\//, "").split("/").filter(Boolean);
  const outputDir = path.join(distDir, ...relativePath);
  await fs.mkdir(outputDir, { recursive: true });
  const html = renderBaseLayout({
    title,
    description,
    currentPath: normalizedRoute,
    navItems: NAV,
    withBase,
    content
  });
  await fs.writeFile(path.join(outputDir, "index.html"), html, "utf8");
  if (normalizedRoute === "/404/") {
    await fs.writeFile(path.join(distDir, "404.html"), html, "utf8");
  }
};

const copyDirectory = async (source, destination) => {
  try {
    const entries = await fs.readdir(source, { withFileTypes: true });
    await fs.mkdir(destination, { recursive: true });
    for (const entry of entries) {
      const srcPath = path.join(source, entry.name);
      const destPath = path.join(destination, entry.name);
      if (entry.isDirectory()) {
        await copyDirectory(srcPath, destPath);
      } else if (entry.isFile()) {
        const data = await fs.readFile(srcPath);
        await fs.writeFile(destPath, data);
      }
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      return;
    }
    throw error;
  }
};

const buildPages = async () => {
  const files = await collectAstroFiles(pagesDir);
  for (const filePath of files) {
    const route = getRouteFromFile(filePath);
    const renderer = customPageRenderers[route];
    if (renderer) {
      const { title, description, content } = renderer({ navItems: NAV, withBase });
      await writePage({ route, title, description, content });
      continue;
    }
    const raw = await fs.readFile(filePath, "utf8");
    const { title, description, content } = parseStaticAstro(raw);
    await writePage({ route, title, description, content });
  }
};

const copyStyles = async () => {
  const stylesDestination = path.join(distDir, "styles");
  await fs.mkdir(stylesDestination, { recursive: true });
  const cssPath = path.join(stylesDir, "global.css");
  const css = await fs.readFile(cssPath, "utf8");
  await fs.writeFile(path.join(stylesDestination, "global.css"), css, "utf8");
};

const build = async () => {
  await fs.rm(distDir, { recursive: true, force: true });
  await fs.mkdir(distDir, { recursive: true });
  await buildPages();
  await copyDirectory(publicDir, distDir);
  await copyStyles();
  console.log(`Build complete. Output written to ${distDir}`);
};

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
