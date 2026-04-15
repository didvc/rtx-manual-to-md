# Getting Started

## Requirements

- **Node.js 20+**
- **Yamaha RTX HTML Archive** — download `Cmdref_HTML_Archive.zip` from [rtpro.yamaha.co.jp](https://www.rtpro.yamaha.co.jp/RT/manual/rt-common/) and extract it so the path `Cmdref_HTML_Archive (1)/html/` exists in the project root.

## Install

```bash
git clone https://github.com/yuis-ice/rtx-manual-to-md
cd rtx-manual-to-md
npm install
```

## First Run

```bash
npm run convert
```

This will:
1. Walk `./Cmdref_HTML_Archive (1)/html/` recursively
2. Convert every command page to Markdown
3. Write output to `./output/` mirroring the original directory structure

Expected output:

```
Found 1237 command HTML files in .../html
Done: 1237 converted, 0 errors
Output: .../output
```

## Verify the Output

```bash
cat output/bgp/bgp_aggregate.md
```

You should see a clean Markdown file with a fenced syntax block, parameter tables, and description.

## Custom Paths

```bash
npm run convert -- --input /path/to/html --output /path/to/out
```

## Next Steps

- [CLI Reference](./cli-reference) — all available flags
- [Filtering Files](../recipes/filtering) — process only what you need
- [LLM / RAG Ingestion](../recipes/rag-ingestion) — feed the output into an AI pipeline
