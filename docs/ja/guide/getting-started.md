# はじめに

## 必要な環境

- **Node.js 20以上**
- **Yamaha RTX HTMLアーカイブ** — [rtpro.yamaha.co.jp](https://www.rtpro.yamaha.co.jp/RT/manual/rt-common/) から `Cmdref_HTML_Archive.zip` をダウンロードし、プロジェクトルートに展開して `Cmdref_HTML_Archive (1)/html/` というパスが存在する状態にする。

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

## 最初の実行

```bash
# オプション A（バイナリ）
./rtx-manual-to-md-linux-x64

# オプション B（ソース）
npm run convert
```

処理の流れ:
1. `./Cmdref_HTML_Archive (1)/html/` を再帰的に走査
2. 各コマンドページをMarkdownに変換
3. 元のディレクトリ構造を維持したまま `./output/` に出力

期待される出力:

```
Found 1237 command HTML files in .../html
Done: 1237 converted, 0 errors
Output: .../output
```

## 出力の確認

```bash
cat output/bgp/bgp_aggregate.md
```

フェンスコードブロック付きの書式、パラメータテーブル、説明が含まれたクリーンなMarkdownファイルが表示される。

## カスタムパス

```bash
npm run convert -- --input /path/to/html --output /path/to/out
```

## 次のステップ

- [CLIリファレンス](./cli-reference) — 利用可能なオプション一覧
- [ファイルフィルタリング](../recipes/filtering) — 必要なカテゴリだけ処理する
- [LLM / RAG取り込み](../recipes/rag-ingestion) — 出力をAIパイプラインに接続する
