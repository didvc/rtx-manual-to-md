---
layout: home

hero:
  name: rtx-manual-to-md
  text: Yamaha RTX Command Reference → Markdown
  tagline: Batch-convert the entire HTML archive into clean GFM files, ready for LLM ingestion, RAG pipelines, or offline browsing.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/yuis-ice/rtx-manual-to-md
    - theme: alt
      text: 日本語
      link: /ja/

features:
  - title: Full Archive Conversion
    details: Recursively processes all ~1,300 XHTML command pages in one run, preserving directory structure.
  - title: 84% Size Reduction
    details: Strips HTML boilerplate, inline styles, and navigation markup. Output is ~84% smaller in characters.
  - title: GFM Tables
    details: Parameter/setting tables are converted to GitHub Flavored Markdown tables — no data loss.
  - title: Fenced Code Blocks
    details: Command syntax lines land in triple-backtick blocks, ready for syntax highlighting.
  - title: Include / Exclude Filters
    details: Process only the categories you need with regex patterns matched against relative file paths.
  - title: Stats Reporting
    details: "--stats prints line counts, char counts, and reduction percentage before and after conversion."
---
