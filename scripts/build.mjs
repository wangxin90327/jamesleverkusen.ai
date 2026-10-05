import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDirectory = path.join(projectRoot, "src");
const outputDirectory = path.join(projectRoot, "dist");
const partialsDirectory = path.join(sourceDirectory, "partials");

const [sharedHeader, sharedFooter, sharedHeadIcons] = await Promise.all([
  readFile(path.join(partialsDirectory, "header.html"), "utf8"),
  readFile(path.join(partialsDirectory, "footer.html"), "utf8"),
  readFile(path.join(partialsDirectory, "head-icons.html"), "utf8"),
]);

function routeFor(relativeFilePath) {
  const normalized = relativeFilePath.split(path.sep).join("/");
  if (normalized === "index.html") return "/";
  return `/${path.posix.dirname(normalized)}/`;
}

function renderHeader(route) {
  return sharedHeader
    .replaceAll(`data-nav-route="${route}"`, 'aria-current="page"')
    .replace(/\sdata-nav-route="[^"]*"/g, "");
}

async function collectHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectHtmlFiles(fullPath)));
    } else if (entry.name.endsWith(".html")) {
      files.push(fullPath);
    }
  }

  return files;
}

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await cp(sourceDirectory, outputDirectory, { recursive: true });

const htmlFiles = (await collectHtmlFiles(outputDirectory)).filter(
  (filePath) => !filePath.startsWith(path.join(outputDirectory, "partials")),
);

for (const htmlFile of htmlFiles) {
  const relativePath = path.relative(outputDirectory, htmlFile);
  const route = routeFor(relativePath);
  const source = await readFile(htmlFile, "utf8");

  if (
    !source.includes("<!-- @include:head-icons -->") ||
    !source.includes("<!-- @include:header -->") ||
    !source.includes("<!-- @include:footer -->")
  ) {
    throw new Error(`Missing shared layout marker in ${relativePath}`);
  }

  const rendered = source
    .replace("<!-- @include:head-icons -->", sharedHeadIcons)
    .replace("<!-- @include:header -->", renderHeader(route))
    .replace("<!-- @include:footer -->", sharedFooter);

  await writeFile(htmlFile, rendered);
}

await rm(path.join(outputDirectory, "partials"), { recursive: true, force: true });

console.log(`James Leverkusen website built in dist/ (${htmlFiles.length} pages).`);
