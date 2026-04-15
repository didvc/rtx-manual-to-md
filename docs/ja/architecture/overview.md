# アーキテクチャ概要

## このツールの存在意義

YamahaはRTXコマンドリファレンスを、約1,300件のXHTMLファイルを含むZIPアーカイブ（`Cmdref_HTML_Archive.zip`）としてのみ配布している。構造化されたマシンリーダブル形式での公開は存在しない。

生のHTMLは以下の用途には不向き:
- **LLMコンテキストウィンドウ** — タグ・CSSリンク・XML宣言・ナビゲーションマークアップが情報を持たないトークンを大量に消費する。
- **RAGパイプライン** — 生HTMLをチャンク分割すると品質の低いエンベディングが生成される。クリーンなMarkdownのほうが検索精度が大幅に向上する。
- **オフライン閲覧** — XHTMLはブラウザとアーカイブ全体が必要だが、Markdownは任意のエディタで開ける。

このツールはボイラープレートを除去し、文字数ベースで約84%小さいクリーンなMarkdownを出力する。

## 処理パイプライン

```
Cmdref_HTML_Archive (1)/html/
        │
        ▼
  walkHtmlFilesFiltered()
  • .htmlファイルを再帰的にリストアップ
  • ナビゲーションファイルをスキップ (_chapter, _concept, index, toc…)
  • --include / --exclude 正規表現フィルタを適用
        │
        ▼  (ファイルごと)
  fs.readFileSync()  →  htmlToMarkdown()
        │
        ├─ cheerio.load()          XHTMLをパース
        ├─ h1.topictitle1          → # タイトル
        ├─ meta[DC.subject]        → **コマンド:** `cmd`
        ├─ .section × N           → ## [セクション見出し]
        │     ├─ [書式]  li.sli   → フェンスコードブロック
        │     ├─ tables           → GFMテーブル (tableToMarkdown)
        │     └─ テキストノード   → 段落テキスト
        └─ .parentlink a          → --- **カテゴリ:**
        │
        ▼
  fs.writeFileSync()  →  output/<同じ相対パス>.md
```

## 主な設計判断

**cheerioを採用した理由** — ファイルはXHTML 1.0 Transitionalで、エンコーディングの扱いが混在する。Cheerioは不正形式・ブラウザ依存のHTMLを柔軟に処理でき、1,300ファイルを数秒で処理できるほど高速。

**セクション単位の抽出** — 各 `div.section` は独立して処理される。これにより、セクションタイプごとに異なるレンダリングルールを適用しやすい（`[書式]` はコードブロック、パラメータグリッドはGFMテーブル、説明はプレーンテキスト）。

**h2見出しの重複除去** — セクション `h2` はテキスト抽出前にcloneから削除し、見出しが2回出力されるのを防ぐ。

**スタイルシート・画像の無視** — ナビゲーション用アセット（CSS・画像・JavaScript）はコンテンツに無関係のため完全に無視する。
