# CLIリファレンス

```
npm run convert [-- オプション]
```

## オプション一覧

| フラグ | 値 | デフォルト | 説明 |
|--------|-----|-----------|------|
| `--input` | `<dir>` | `./Cmdref_HTML_Archive (1)/html` | 変換元HTMLディレクトリ |
| `--output` | `<dir>` | `./output` | 出力先ディレクトリ |
| `--include` | `<regex>` | — | 相対パスがマッチするファイルのみ処理 |
| `--exclude` | `<regex>` | — | 相対パスがマッチするファイルをスキップ |
| `--stats` | — | オフ | 変換後に行数・文字数・削減率を表示 |

`--include` と `--exclude` は同時使用不可。両方指定するとエラーで終了する。

## --input

`Cmdref_HTML_Archive.zip` を展開した `html/` ディレクトリへのパス。

```bash
npm run convert -- --input ~/Downloads/Cmdref_HTML_Archive/html
```

## --output

生成される `.md` ファイルの出力先。存在しない場合は自動作成。

```bash
npm run convert -- --output ~/rtx-docs
```

## --include `<regex>`

`--input` からの相対パスが正規表現にマッチするファイルのみ変換。

```bash
# BGPコマンドのみ
npm run convert -- --include "^bgp/"

# BGPとOSPF
npm run convert -- --include "^(bgp|ospf)/"

# "nat" を含むすべてのファイル
npm run convert -- --include "nat"
```

## --exclude `<regex>`

相対パスがマッチするファイルをスキップし、それ以外をすべて処理。

```bash
# BGPをスキップ
npm run convert -- --exclude "^bgp/"

# 使用頻度の低いカテゴリをスキップ
npm run convert -- --exclude "^(howtouse|help|cmdref)/"
```

## --stats

変換後に削減サマリーを表示。

```bash
npm run convert -- --stats
```

出力例:

```
── Stats ──────────────────────────────────────────
  files converted : 1,237
  input  cloc     : 100,065 lines  (6,435,979 chars)
  output cloc     :  47,694 lines  (1,019,402 chars)
  reduce cloc     :  52,371 lines
  reduce %        : 84.2%  (chars)
────────────────────────────────────────────────────
```

## 終了コード

| コード | 意味 |
|--------|------|
| `0` | 全ファイルの変換成功 |
| `1` | `--input` ディレクトリが見つからない、または `--include`/`--exclude` を同時指定 |

個別ファイルのパースエラーはstderrに出力されるが、実行は中断されない。
