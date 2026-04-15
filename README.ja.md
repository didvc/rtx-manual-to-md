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

### オプション A — ビルド済みバイナリ（Node.js不要）

[Releasesページ](https://github.com/yuis-ice/rtx-manual-to-md/releases/latest)からプラットフォームに合ったバイナリをダウンロード:

| プラットフォーム | ファイル |
|----------------|---------|
| Linux x64 | `rtx-manual-to-md-linux-x64` |
| Linux ARM64 | `rtx-manual-to-md-linux-arm64` |
| macOS x64 | `rtx-manual-to-md-darwin-x64` |
| macOS ARM64 (Apple Silicon) | `rtx-manual-to-md-darwin-arm64` |
| Windows x64 | `rtx-manual-to-md-win-x64.exe` |

```bash
# Linux / macOS — 実行権限を付与して実行
chmod +x rtx-manual-to-md-linux-x64
./rtx-manual-to-md-linux-x64 --stats
```

```powershell
# Windows — cmd.exe または PowerShell（chmod 不要）
.\rtx-manual-to-md-win-x64.exe --stats
```

### オプション B — ソースから（Node.js 20以上が必要）

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

## 法的事項

「Yamaha」および「RTX」はヤマハ株式会社の登録商標です。

本プロジェクトは独立した有志によるものであり、**ヤマハ株式会社とは一切関係（提携・承認・スポンサーシップ）がありません**。ヤマハ公式ツールではありません。混同防止のため、本ツールに関するサポート問い合わせはヤマハ株式会社へ行わないでください。

本ツールがパース対象とするコマンドリファレンスデータの著作権は **© Yamaha Corporation. All Rights Reserved.** に帰属します。本リポジトリにはコンバータのソースコードのみが含まれ、パース済みデータは一切含まれません（BYOD形式）。データはユーザー自身が公式サイトから直接ダウンロードしてください:

> https://www.rtpro.yamaha.co.jp/RT/manual/rt-common/

本ツールを使用する際は、RTproサイトに記載されているヤマハ株式会社のドキュメント利用規約を遵守してください。

## 免責事項

### ツールの動作保証

本ツールは**「現状のまま（As-is）」**提供されます。開発者はパーサーが完全にエラーフリーであること、または変換結果がソースHTMLのすべてのコマンド・パラメータ・制約を正確に表現することを保証しません。パースロジックのバグにより、コンテンツが欠落・切り捨て・誤変換される可能性があります。

### 元データの正確性

出力はヤマハのコマンドリファレンスHTMLから生成されます。ソースドキュメントに誤記・タイポ・古い情報（ファームウェア変更の未反映など）が含まれる場合、それらはそのまま出力に反映されます。本プロジェクトは元データの不正確さに対して責任を負いません。

### 実機投入のリスク

> [!WARNING]
> 本ツールはネットワーク機器の設定を対象とします。**本ツールの出力から得たコマンドや設定を本番環境に適用する前に、必ずヤマハ公式ドキュメントと照らし合わせ、非本番環境でのテストを行ってください。** LLM・RAGパイプラインの入力として使用する場合、ハルシネーションのリスクがさらに加わります。

開発者は、本ツールまたはその出力の使用に起因するいかなる損害（ネットワーク停止・データ損失・セキュリティ侵害を含むがこれに限らない）についても責任を負いません。

## コントリビュート

[CONTRIBUTING.md](CONTRIBUTING.md) を参照。

## ライセンス

Apache 2.0 — [LICENSE](LICENSE) を参照。
