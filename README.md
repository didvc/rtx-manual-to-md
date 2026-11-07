# rtx-manual-to-md

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20-green)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org)
[![Docs](https://img.shields.io/badge/docs-yuis--ice.github.io%2Frtx--manual--to--md-blue)](https://yuis-ice.github.io/rtx-manual-to-md/)

**[日本語 README](README.ja.md)** | **[Full Documentation →](https://yuis-ice.github.io/rtx-manual-to-md/)**

---

Convert the **Yamaha RTX router command reference HTML archive** (`Cmdref_HTML_Archive.zip`) into clean **GitHub Flavored Markdown** files — ready for LLM ingestion, RAG pipelines, or offline browsing.

> See also: [`rtx-manual-to-json`](https://github.com/didvc/rtx-manual-to-json)

---

## Why

Yamaha publishes the RTX command reference as a ZIP of ~1 300 XHTML files. No structured, machine-readable version exists publicly. This tool batch-converts the entire archive into plain Markdown preserving syntax blocks, parameter tables, descriptions, notes, and applicable-model lists — reducing the raw HTML size by ~84%.

```
input  cloc : 100,065 lines  (6,435,979 chars)
output cloc :  47,694 lines  (1,019,402 chars)
reduce      :  52,371 lines  (84.2% smaller)
```

## Requirements

- Node.js 20+
- The HTML archive: download `Cmdref_HTML_Archive.zip` from [rtpro.yamaha.co.jp](https://www.rtpro.yamaha.co.jp/RT/manual/rt-common/) and extract it so the path `Cmdref_HTML_Archive (1)/html/` exists in the project root.

## Install

### Option A — Pre-built binary (no Node.js required)

Download the binary for your platform from the [Releases page](https://github.com/yuis-ice/rtx-manual-to-md/releases/latest):

| Platform | File |
|----------|------|
| Linux x64 | `rtx-manual-to-md-linux-x64` |
| Linux ARM64 | `rtx-manual-to-md-linux-arm64` |
| macOS x64 | `rtx-manual-to-md-darwin-x64` |
| macOS ARM64 (Apple Silicon) | `rtx-manual-to-md-darwin-arm64` |
| Windows x64 | `rtx-manual-to-md-win-x64.exe` |

```bash
# Linux / macOS — make executable then run
chmod +x rtx-manual-to-md-linux-x64
./rtx-manual-to-md-linux-x64 --stats
```

```powershell
# Windows — cmd.exe or PowerShell (no chmod needed)
.\rtx-manual-to-md-win-x64.exe --stats
```

### Option B — From source (Node.js 20+ required)

```bash
git clone https://github.com/yuis-ice/rtx-manual-to-md
cd rtx-manual-to-md
npm install
```

## Usage

```bash
# Convert with defaults
npm run convert

# Custom paths
npm run convert -- --input ./path/to/html --output ./my-output

# Show reduction statistics
npm run convert -- --stats

# Process only BGP-related files
npm run convert -- --include "^bgp/"

# Skip a category
npm run convert -- --exclude "^(bgp|ospf)/"
```

### Options

| Flag | Description | Default |
|------|-------------|---------|
| `--input <dir>` | Source HTML directory | `./Cmdref_HTML_Archive (1)/html` |
| `--output <dir>` | Output directory | `./output` |
| `--include <regex>` | Only process files whose relative path matches | — |
| `--exclude <regex>` | Skip files whose relative path matches | — |
| `--stats` | Print line/char reduction statistics | off |

`--include` and `--exclude` are mutually exclusive.

The regex is tested against the **relative path** from the input directory (e.g. `bgp/bgp_aggregate.html`).

## Output structure

The output mirrors the input directory tree with `.html` extensions replaced by `.md`:

```
output/
  bgp/
    bgp_aggregate.md
    bgp_always_compare_med.md
    ...
  ip/
    ip_route.md
    ...
  ipsec/
  nat/
  ...
```

### Example output

```markdown
# 32.2 経路の集約の設定

**コマンド:** `bgp aggregate`

## [書式]
```
bgp aggregate ip_address/mask filter filter_num ...
no bgp aggregate ip_address/mask [filter filter_num... ]
```

## [説明]
BGP で広告する集約経路を設定する。...

## [適用モデル]
RTX5000, RTX3500, RTX3000, RTX1220, RTX1210, RTX1200, RTX830, ...
```

## What gets converted

Each command page extracts:

- **Title** — section number and command name
- **`[書式]`** (Syntax) — rendered as a fenced code block
- **`[設定値及び初期値]`** (Parameters & defaults) — tables preserved as GFM tables
- **`[説明]`** (Description) — plain text
- **`[ノート]`** (Notes) — plain text
- **`[適用モデル]`** (Applicable models) — comma-separated list
- **Category** — parent topic link

Navigation-only files (`index.html`, `toc.html`, `*_chapter.html`, `*_concept.html`) are skipped automatically.

## Legal

"Yamaha" and "RTX" are registered trademarks of Yamaha Corporation.

This project is an independent, community-created tool with **no affiliation, endorsement, or sponsorship from Yamaha Corporation**. It is not an official Yamaha product. To avoid confusion, please do not contact Yamaha Corporation for support related to this tool.

The command reference data that this tool parses is **© Yamaha Corporation. All Rights Reserved.** This repository contains only the converter source code — no parsed data is included or distributed (Bring Your Own Data). Users must download the HTML archive directly from the official source:

> https://www.rtpro.yamaha.co.jp/RT/manual/rt-common/

By using this tool, you agree to comply with Yamaha Corporation's documentation terms of use as stated on the official RTpro site.

## Disclaimer

### Tool Accuracy

This tool is provided **"as is"** without warranty of any kind. The developer makes no guarantee that the parser is error-free or that the converted output accurately represents every command, parameter, or constraint in the source HTML. Parsing bugs may cause content to be missing, truncated, or misformatted.

### Source Data Accuracy

The output is entirely derived from the Yamaha command reference HTML. If the source documents contain errors, typos, or outdated information (e.g. unreflected firmware changes), those errors will appear in the output unchanged. This project is not responsible for inaccuracies in the upstream data.

### Operational Risk

> [!WARNING]
> This tool targets configuration of network infrastructure. **Never apply commands or configurations derived from this tool's output to a production environment without first verifying against official Yamaha documentation and testing in a non-production environment.** When used as input for an LLM or RAG pipeline, hallucination risk compounds this further.

The developer shall not be liable for any damages — including but not limited to network downtime, data loss, or security breaches — arising from the use of this tool or its output.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

Apache 2.0 — see [LICENSE](LICENSE).
