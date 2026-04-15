# ファイルフィルタリング

`--include` と `--exclude` はいずれも、`--input` からの**相対パス**（例: `bgp/bgp_aggregate.html`）に対してマッチするJavaScript正規表現を受け取る。

同時使用は不可。両方指定するとエラーで終了する。

## --include: マッチしたファイルのみ処理

```bash
# 単一カテゴリ
npm run convert -- --include "^bgp/"

# 複数カテゴリ（交替）
npm run convert -- --include "^(bgp|ospf|ip)/"

# サブディレクトリに関係なくIPを含むすべてのファイル
npm run convert -- --include "ip"

# ファイル名に "filter" を含むファイル
npm run convert -- --include "filter"
```

## --exclude: マッチしたファイルをスキップ

```bash
# 単一カテゴリをスキップ
npm run convert -- --exclude "^bgp/"

# 複数カテゴリをスキップ
npm run convert -- --exclude "^(howtouse|help|cmdref|image)/"
```

## --stats との組み合わせ

`--stats` はどちらのフィルタフラグとも併用できる:

```bash
npm run convert -- --include "^nat/" --stats
```

```
Filter: --include /^nat\//
Found 38 command HTML files in .../html

Done: 38 converted, 0 errors
Output: .../output

── Stats ──────────────────────────────────────────
  files converted :     38
  input  cloc     :  3,102 lines  (198,444 chars)
  output cloc     :  1,471 lines   (31,207 chars)
  reduce cloc     :  1,631 lines
  reduce %        : 84.3%  (chars)
────────────────────────────────────────────────────
```

## 正規表現のヒント

正規表現は `new RegExp(pattern)` でコンパイルされる。フラグなしのため**大文字小文字を区別する**。すべてのソースパスはプラットフォームに関わらずフォワードスラッシュを使用する。

| 目的 | パターン |
|------|---------|
| 特定カテゴリ | `^bgp/` |
| 複数カテゴリ | `^(bgp\|ospf)/` |
| ファイル名に含まれる文字列 | `aggregate` |
| ip/ 配下すべて | `^ip/` |
| "show" で始まるファイル | `/show` |
