# 変換対象の詳細

## 変換されるファイル

`--input` 以下にある `.html` ファイルのうち、ナビゲーションファイルでないものはすべてコマンドページとして変換される。

## スキップされるファイル

以下のパターンに該当するファイルはコマンドリファレンスではなくナビゲーション・構造ページのため、自動的にスキップされる:

| パターン | 例 |
|---------|----|
| `index.html` | `html/index.html` |
| `toc.html` | `html/toc.html` |
| `defaultpage.html` | `html/defaultpage.html` |
| `preface.html` | `html/preface.html` |
| `cmdref_index.html` | `html/cmdref_index.html` |
| `*_chapter.html` | `html/bgp/bgp_chapter.html` |
| `*_concept.html` | `html/ip/ip_rip_concept.html` |

## 1ページあたりの抽出セクション

各コマンドページは以下のセクションを解析して変換:

| HTMLセクション見出し | Markdown出力 |
|----------------------|-------------|
| `[書式]` | フェンスコードブロック ` ``` ` |
| `[設定値及び初期値]` | GFMテーブル + プレーンテキスト |
| `[説明]` | 段落テキスト |
| `[ノート]` | 段落テキスト |
| `[使用例]` | プレーンテキスト（存在する場合） |
| `[適用モデル]` | カンマ区切りリスト |

ページタイトル（`h1`）が `#` 見出しになる。コマンド名（`<meta name="DC.subject">`）は **コマンド:** `` `cmd name` `` として表示。親カテゴリ（関連リンクフッター）はページ末尾に表示。

## テーブルの変換

HTMLテーブル（パラメータ値テーブル）はGFMテーブルに変換:

```markdown
| 設定値 | 説明 |
| --- | --- |
| on  | データを蓄積する |
| off | データを蓄積しない |
```

`rowspan` セルを持つテーブルはスパン情報が失われるが（MarkdownはRowspanに対応しない）、セルのテキスト内容はすべて保持される。

## 出力例

入力 (`bgp/bgp_aggregate.html`) → 出力 (`bgp/bgp_aggregate.md`):

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
RTX5000, RTX3500, RTX1220, RTX1210, RTX1200, RTX830, ...

---
**カテゴリ:** BGP
```
