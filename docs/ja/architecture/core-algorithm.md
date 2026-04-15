# コアアルゴリズム

## コマンドページのHTML構造

各コマンドページはDITA由来の一貫したXHTML構造に従っている:

```html
<body id="bgp_aggregate">
  <h1 class="title topictitle1">32.2 経路の集約の設定</h1>
  <div class="body refbody">

    <div class="section">
      <h2 class="title sectiontitle">[書式]</h2>
      <ul class="sl simple">
        <li class="sli">
          <span class="ph synph">
            <span class="keyword kwd">bgp</span>
            <span class="ph delim"> </span>
            <span class="keyword kwd">aggregate</span>
            ...
          </span>
        </li>
      </ul>
    </div>

    <div class="section">
      <h2 class="title sectiontitle">[設定値及び初期値]</h2>
      <!-- ネストされたul + table構造 -->
    </div>

    <div class="section">
      <h2 class="title sectiontitle">[説明]</h2>
      <p class="p">...</p>
    </div>

  </div>
  <div class="related-links">
    <div class="parentlink"><a href="...">BGP</a></div>
  </div>
</body>
```

## セクションのディスパッチ

```typescript
$('.section').each((_, section) => {
  const heading = $(section).find('h2.sectiontitle').first().text().trim()

  if (heading === '[書式]') {
    // → extractSyntax: li.sliのテキストを収集 → フェンスコードブロック
  } else {
    // → sectionToMarkdown: 子要素を走査、テーブル→GFM、テキスト→段落
  }
})
```

## 書式の抽出 (`extractSyntax`)

`[書式]` セクション内の各 `li.sli` には1つの書式バリアント（例: 肯定形と `no` 形）が含まれる。各リストアイテムのテキストを収集して1つのフェンスコードブロックにまとめる:

```typescript
$section.find('li.sli').each((_, li) => {
  lines.push($(li).text().replace(/\s+/g, ' ').trim())
})
return '```\n' + lines.join('\n') + '\n```'
```

`span.keyword.kwd`・`span.ph.var`・`span.ph.delim` 要素はすべてテキストにフラット化される。これらのCSSクラスはブラウザレンダリング用にのみ存在する。

## テーブルの変換 (`tableToMarkdown`)

HTMLテーブルは行単位で変換される。最初の `<tr>` がヘッダ行になり、`---` セルのセパレータ行が挿入され、残りの行がボディ行になる:

```typescript
$table.find('tr').each((_, tr) => {
  const cells = $(tr).find('th, td').map((_, c) => $(c).text().trim()).get()
  rows.push(cells)
})
// rows[0] = ヘッダ, rows[1..] = ボディ
```

**制限:** `rowspan` と `colspan` 属性は処理されない。複数行にまたがるセルは最初の行にのみ現れ、後続の行はヘッダより列数が少なくなる。テキストコンテンツは欠損しない。

## 混在コンテンツのセクション

一部のセクション（特に `[設定値及び初期値]`）はプレーンテキストとテーブルが混在している:

```
<ul>
  <li>
    <var>ip_address/mask</var>
    <ul>
      <li>[設定値]: ...</li>
    </ul>
    <table>...</table>
    <li>[初期値]: ...</li>
  </li>
</ul>
```

`sectionToMarkdown` は直接の子要素を走査してディスパッチする:
- `table` 要素 → `tableToMarkdown`
- ネストされたテーブルを含む要素 → 1レベル再帰し、テーブルとテキストを個別に抽出
- その他の要素 → `.text()` を段落テキストとして出力
