# What Gets Converted

## Included Files

Any `.html` file under `--input` that is **not** a navigation file is treated as a command page and converted.

## Skipped Files

The following are silently skipped because they are navigation/structural pages, not command references:

| Pattern | Example |
|---------|---------|
| `index.html` | `html/index.html` |
| `toc.html` | `html/toc.html` |
| `defaultpage.html` | `html/defaultpage.html` |
| `preface.html` | `html/preface.html` |
| `cmdref_index.html` | `html/cmdref_index.html` |
| `*_chapter.html` | `html/bgp/bgp_chapter.html` |
| `*_concept.html` | `html/ip/ip_rip_concept.html` |

## Sections Extracted Per Page

Each command page is parsed for the following sections:

| HTML section title | Markdown output |
|--------------------|-----------------|
| `[書式]` (Syntax) | Fenced code block ` ``` ` |
| `[設定値及び初期値]` (Parameters & defaults) | GFM tables + plain text |
| `[説明]` (Description) | Plain paragraph text |
| `[ノート]` (Notes) | Plain paragraph text |
| `[使用例]` (Usage examples) | Plain text (if present) |
| `[適用モデル]` (Applicable models) | Comma-separated list |

The page title (`h1`) becomes the `#` heading. The command name (from `<meta name="DC.subject">`) is shown as **コマンド:** `` `cmd name` ``. The parent category (from the related-links footer) is shown at the bottom.

## Table Handling

HTML tables (parameter value tables) are converted to GFM tables:

```markdown
| 設定値 | 説明 |
| --- | --- |
| on  | データを蓄積する |
| off | データを蓄積しない |
```

Tables with `rowspan` cells lose the span information (Markdown does not support rowspan) but all cell text is preserved.

## Example

Input (`bgp/bgp_aggregate.html`) → output (`bgp/bgp_aggregate.md`):

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
