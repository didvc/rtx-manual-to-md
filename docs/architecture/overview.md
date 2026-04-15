# Architecture Overview

## Why This Tool Exists

Yamaha distributes the RTX command reference exclusively as a ZIP archive of ~1,300 XHTML files (`Cmdref_HTML_Archive.zip`). No structured, machine-readable version is publicly available.

The raw HTML is impractical for:
- **LLM context windows** — each file contains hundreds of lines of boilerplate HTML, CSS links, XML declarations, and navigation markup that consume tokens without adding information.
- **RAG pipelines** — chunking raw HTML produces noisy embeddings; clean Markdown produces much better retrieval quality.
- **Offline reading** — XHTML requires a browser and the full archive; Markdown opens in any editor.

This tool eliminates the boilerplate and outputs clean Markdown that is ~84% smaller in character count.

## Processing Pipeline

```
Cmdref_HTML_Archive (1)/html/
        │
        ▼
  walkHtmlFilesFiltered()
  • Recursively lists .html files
  • Skips navigation files (_chapter, _concept, index, toc…)
  • Applies --include / --exclude regex filter
        │
        ▼  (per file)
  fs.readFileSync()  →  htmlToMarkdown()
        │
        ├─ cheerio.load()          parse XHTML
        ├─ h1.topictitle1          → # Title
        ├─ meta[DC.subject]        → **コマンド:** `cmd`
        ├─ .section × N           → ## [Section heading]
        │     ├─ [書式]  li.sli   → fenced code block
        │     ├─ tables           → GFM table (tableToMarkdown)
        │     └─ text nodes       → plain paragraphs
        └─ .parentlink a          → --- **カテゴリ:**
        │
        ▼
  fs.writeFileSync()  →  output/<same relative path>.md
```

## Key Design Decisions

**cheerio over a DOM parser** — The files are XHTML 1.0 Transitional with mixed encoding. Cheerio handles malformed or browser-quirky HTML gracefully and is fast enough for 1,300 files in a few seconds.

**Section-by-section extraction** — Each `div.section` is processed independently. This makes it easy to apply different rendering rules per section type (code block for `[書式]`, GFM table for parameter grids, plain text for description).

**h2 heading deduplication** — The section `h2` is cloned out before text extraction to avoid the heading appearing twice in the output.

**No external stylesheet or image handling** — Navigation assets (CSS, images, JavaScript) are irrelevant to content and are ignored entirely.
