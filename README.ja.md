# rtx-manual-to-md

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20-green)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org)

**Yamaha RTX ルーターのコマンドリファレンスHTMLアーカイブ**（`Cmdref_HTML_Archive.zip`）をクリーンな **GitHub Flavored Markdown** ファイルに一括変換するツール。LLM取り込み・RAGパイプライン・オフライン閲覧に対応。

**[English README](README.md)** | **[ドキュメントサイト →](https://yuis-ice.github.io/rtx-manual-to-md/ja/)**

---

## なぜこのツールが必要か

YamahaはRTXコマンドリファレンスを約1,300件のXHTMLファイルのZIPとしてのみ配布している。構造化されたマシンリーダブル形式は存在しない。このツールはHTML全体をMarkdownに変換し、サイズを約84%削減する。

```
変換前: 100,065行  (6,435,979文字)
変換後:  47,694行  (1,019,402文字)
削減率: 84.2%
```

## 必要な環境

- Node.js 20以上
- HTMLアーカイブ: [rtpro.yamaha.co.jp](https://www.rtpro.yamaha.co.jp/RT/manual/rt-common/) から `Cmdref_HTML_Archive.zip` をダウンロードし、プロジェクトルートに展開して `Cmdref_HTML_Archive (1)/html/` というパスを用意する。

## インストール

```bash
git clone https://github.com/yuis-ice/rtx-manual-to-md
cd rtx-manual-to-md
npm install
```

## 使い方

```bash
# デフォルト設定で変換
npm run convert

# カスタムパス
npm run convert -- --input ./path/to/html --output ./my-output

# 統計表示
npm run convert -- --stats

# BGP関連のみ処理
npm run convert -- --include "^bgp/"

# 特定カテゴリをスキップ
npm run convert -- --exclude "^(bgp|ospf)/"
```

### オプション一覧

| フラグ | 説明 | デフォルト |
|--------|------|-----------|
| `--input <dir>` | 変換元HTMLディレクトリ | `./Cmdref_HTML_Archive (1)/html` |
| `--output <dir>` | 出力先ディレクトリ | `./output` |
| `--include <regex>` | 相対パスがマッチするファイルのみ処理 | — |
| `--exclude <regex>` | 相対パスがマッチするファイルをスキップ | — |
| `--stats` | 変換後に行数・文字数・削減率を表示 | オフ |

`--include` と `--exclude` は同時使用不可。

## 出力構造

出力は元のディレクトリ構造を維持し、拡張子を `.html` から `.md` に変換:

```
output/
  bgp/
    bgp_aggregate.md
    ...
  ip/
    ip_route.md
    ...
  ipsec/
  nat/
  ...
```

## 変換内容

各コマンドページから以下を抽出:

- **タイトル** — セクション番号とコマンド名
- **`[書式]`** — フェンスコードブロックに変換
- **`[設定値及び初期値]`** — GFMテーブルに変換
- **`[説明]`** — プレーンテキスト
- **`[ノート]`** — プレーンテキスト
- **`[適用モデル]`** — カンマ区切りリスト
- **カテゴリ** — 親トピックリンク

## コントリビュート

[CONTRIBUTING.md](CONTRIBUTING.md) を参照。

## ライセンス

Apache 2.0 — [LICENSE](LICENSE) を参照。
