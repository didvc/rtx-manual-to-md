#!/usr/bin/env tsx
/**
 * Yamaha RTX Command Reference HTML Archive → Markdown converter
 *
 * Usage:
 *   npm run convert [-- options]
 *
 * Options:
 *   --input  <dir>    Source HTML directory (default: ./Cmdref_HTML_Archive (1)/html)
 *   --output <dir>    Output directory       (default: ./output)
 *   --include <regex> Only process files whose relative path matches the regex
 *   --exclude <regex> Skip files whose relative path matches the regex
 *                     (--include and --exclude are mutually exclusive)
 *   --stats           Print reduction statistics after conversion
 */

import * as fs from "fs";
import * as path from "path";
import { load, type CheerioAPI, type Cheerio, type AnyNode } from "cheerio";

// ── CLI args ─────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);

const getArg = (flag: string, fallback: string): string => {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : fallback;
};

const hasFlag = (flag: string): boolean => args.includes(flag);

// Default paths are relative to cwd so compiled binaries work correctly
const INPUT_DIR = getArg(
  "--input",
  path.resolve(process.cwd(), "Cmdref_HTML_Archive (1)", "html")
);
const OUTPUT_DIR = getArg("--output", path.resolve(process.cwd(), "output"));
const SHOW_STATS = hasFlag("--stats");

const includePattern = getArg("--include", "");
const excludePattern = getArg("--exclude", "");

if (includePattern && excludePattern) {
  console.error("Error: --include and --exclude cannot be used together.");
  process.exit(1);
}

const includeRe = includePattern ? new RegExp(includePattern) : null;
const excludeRe = excludePattern ? new RegExp(excludePattern) : null;

// ── HTML → Markdown conversion ────────────────────────────────────────────────

/** Convert a syntax span tree (.ph.synph) to compact text like: bgp aggregate ip_address/mask filter filter_num ... */
function extractSynph($el: Cheerio<AnyNode>): string {
  return $el
    .text()
    .replace(/\s+/g, " ")
    .trim();
}

/** Convert an HTML table to a GFM markdown table string */
function tableToMarkdown($: CheerioAPI, $table: Cheerio<AnyNode>): string {
  const rows: string[][] = [];

  $table.find("tr").each((_, tr) => {
    const cells: string[] = [];
    $(tr)
      .find("th, td")
      .each((_, cell) => {
        cells.push($(cell).text().replace(/\n/g, " ").trim());
      });
    if (cells.length > 0) rows.push(cells);
  });

  if (rows.length === 0) return "";

  const header = rows[0];
  const separator = header.map(() => "---");
  const body = rows.slice(1);

  const toRow = (cells: string[]) => `| ${cells.join(" | ")} |`;

  return [toRow(header), toRow(separator), ...body.map(toRow)].join("\n");
}

/** Convert a section div's contents to markdown text */
function sectionToMarkdown($: CheerioAPI, $section: Cheerio<AnyNode>): string {
  const parts: string[] = [];

  // Clone section and remove the h2 heading to avoid duplication
  const $clone = $section.clone();
  $clone.find("h2.sectiontitle").remove();

  // Walk direct children; handle tables specially, rest as text
  $clone.children().each((_, node) => {
    const $node = $(node);
    const tag = (node as any).tagName?.toLowerCase() ?? "";

    if (tag === "table") {
      const md = tableToMarkdown($, $node);
      if (md) parts.push(md);
    } else if ($node.find("table").length > 0) {
      // Mixed content: extract text before tables, then the tables
      // Process by visiting each child recursively at one level
      $node.children().each((_, child) => {
        const $child = $(child);
        const childTag = (child as any).tagName?.toLowerCase() ?? "";
        if (childTag === "table") {
          const md = tableToMarkdown($, $child);
          if (md) parts.push(md);
        } else if ($child.find("table").length > 0) {
          $child.find("table").each((_, t) => {
            const md = tableToMarkdown($, $(t));
            if (md) parts.push(md);
          });
          // Also get non-table text from this element
          const $textClone = $child.clone();
          $textClone.find("table").remove();
          const text = $textClone.text().replace(/\n+/g, "\n").trim();
          if (text) parts.push(text);
        } else {
          const text = $child.text().replace(/\n+/g, "\n").trim();
          if (text) parts.push(text);
        }
      });
    } else {
      const text = $node.text().replace(/\n+/g, "\n").trim();
      if (text) parts.push(text);
    }
  });

  return parts.filter(Boolean).join("\n\n");
}

/** Extract the syntax lines from [書式] section as a code block */
function extractSyntax($: CheerioAPI, $section: Cheerio<AnyNode>): string {
  const lines: string[] = [];
  $section.find("li.sli").each((_, li) => {
    lines.push($(li).text().replace(/\s+/g, " ").trim());
  });
  return lines.length > 0 ? "```\n" + lines.join("\n") + "\n```" : "";
}

/** Convert a single HTML file to Markdown string */
function htmlToMarkdown(htmlContent: string): string {
  const $ = load(htmlContent, { xmlMode: false });

  const title = $("h1.topictitle1").text().trim();
  const command = $("meta[name='DC.subject']").attr("content") ?? "";
  const models = $("meta[name='DC.title']").attr("content") ?? "";

  const mdParts: string[] = [];

  // Front matter
  mdParts.push(`# ${title}`);
  if (command) mdParts.push(`\n**コマンド:** \`${command}\``);

  // Sections
  $(".section").each((_, section) => {
    const $section = $(section);
    const heading = $section.find("h2.sectiontitle").first().text().trim();

    if (!heading) return;

    mdParts.push(`\n## ${heading}`);

    if (heading === "[書式]") {
      const syntax = extractSyntax($, $section);
      if (syntax) mdParts.push(syntax);
    } else {
      const content = sectionToMarkdown($, $section);
      if (content) mdParts.push(content);
    }
  });

  // Parent topic (related links)
  const parentLink = $(".parentlink a");
  if (parentLink.length > 0) {
    const parentText = parentLink.text().trim();
    mdParts.push(`\n---\n**カテゴリ:** ${parentText}`);
  }

  return mdParts.join("\n") + "\n";
}

// ── File walker ───────────────────────────────────────────────────────────────

function walkHtmlFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkHtmlFiles(full));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      // Skip index/toc/chapter files — they are navigation, not command refs
      if (
        entry.name === "index.html" ||
        entry.name === "toc.html" ||
        entry.name === "defaultpage.html" ||
        entry.name === "preface.html" ||
        entry.name.endsWith("_chapter.html") ||
        entry.name.endsWith("_concept.html") ||
        entry.name === "cmdref_index.html"
      ) {
        return results; // skip but continue loop below
      }
      results.push(full);
    }
  }
  return results;
}

function walkHtmlFilesFiltered(dir: string): string[] {
  const results: string[] = [];

  const skipNames = new Set([
    "index.html",
    "toc.html",
    "defaultpage.html",
    "preface.html",
    "cmdref_index.html",
  ]);

  const recurse = (d: string) => {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) {
        recurse(full);
      } else if (
        entry.isFile() &&
        entry.name.endsWith(".html") &&
        !skipNames.has(entry.name) &&
        !entry.name.endsWith("_chapter.html") &&
        !entry.name.endsWith("_concept.html")
      ) {
        results.push(full);
      }
    }
  };

  recurse(dir);
  return results;
}

// ── Stats ─────────────────────────────────────────────────────────────────────

interface Stats {
  files: number;
  inputChars: number;
  inputLines: number;
  outputChars: number;
  outputLines: number;
}

function countLines(s: string): number {
  // Count newlines + 1 for the final line (same as wc -l behaviour for non-empty)
  if (s.length === 0) return 0;
  let n = 1;
  for (let i = 0; i < s.length; i++) if (s[i] === "\n") n++;
  return n;
}

function printStats(stats: Stats): void {
  const reduceChars = stats.inputChars - stats.outputChars;
  const reducePct =
    stats.inputChars > 0
      ? ((reduceChars / stats.inputChars) * 100).toFixed(1)
      : "0.0";
  const reduceLines = stats.inputLines - stats.outputLines;

  const fmt = (n: number) => n.toLocaleString("en-US");

  console.log("\n── Stats ──────────────────────────────────────────");
  console.log(`  files converted : ${fmt(stats.files)}`);
  console.log(`  input  cloc     : ${fmt(stats.inputLines)} lines  (${fmt(stats.inputChars)} chars)`);
  console.log(`  output cloc     : ${fmt(stats.outputLines)} lines  (${fmt(stats.outputChars)} chars)`);
  console.log(`  reduce cloc     : ${fmt(reduceLines)} lines`);
  console.log(`  reduce %        : ${reducePct}%  (chars)`);
  console.log("────────────────────────────────────────────────────");
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  if (!fs.existsSync(INPUT_DIR)) {
    console.error(`Input directory not found: ${INPUT_DIR}`);
    process.exit(1);
  }

  let allFiles = walkHtmlFilesFiltered(INPUT_DIR);

  // Apply --include / --exclude filter against the relative path
  if (includeRe || excludeRe) {
    allFiles = allFiles.filter((f) => {
      const rel = path.relative(INPUT_DIR, f);
      if (includeRe) return includeRe.test(rel);
      if (excludeRe) return !excludeRe.test(rel);
      return true;
    });

    const filterDesc = includeRe
      ? `--include /${includePattern}/`
      : `--exclude /${excludePattern}/`;
    console.log(`Filter: ${filterDesc}`);
  }

  console.log(`Found ${allFiles.length} command HTML files in ${INPUT_DIR}`);

  let ok = 0;
  let errors = 0;
  const stats: Stats = {
    files: 0,
    inputChars: 0,
    inputLines: 0,
    outputChars: 0,
    outputLines: 0,
  };

  for (const htmlPath of allFiles) {
    const rel = path.relative(INPUT_DIR, htmlPath);
    const mdRel = rel.replace(/\.html$/, ".md");
    const outPath = path.join(OUTPUT_DIR, mdRel);

    fs.mkdirSync(path.dirname(outPath), { recursive: true });

    try {
      const html = fs.readFileSync(htmlPath, "utf-8");
      const md = htmlToMarkdown(html);
      fs.writeFileSync(outPath, md, "utf-8");
      ok++;

      if (SHOW_STATS) {
        stats.files++;
        stats.inputChars += html.length;
        stats.inputLines += countLines(html);
        stats.outputChars += md.length;
        stats.outputLines += countLines(md);
      }
    } catch (err) {
      console.error(`ERROR: ${rel} — ${(err as Error).message}`);
      errors++;
    }
  }

  console.log(`\nDone: ${ok} converted, ${errors} errors`);
  console.log(`Output: ${OUTPUT_DIR}`);

  if (SHOW_STATS) printStats(stats);
}

main();
