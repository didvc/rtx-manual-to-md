# Core Algorithm

## HTML Structure of a Command Page

Each command page follows a consistent DITA-derived XHTML structure:

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
      <!-- nested ul + table structure -->
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

## Section Dispatch

```typescript
$('.section').each((_, section) => {
  const heading = $(section).find('h2.sectiontitle').first().text().trim()

  if (heading === '[書式]') {
    // → extractSyntax: collect li.sli text → fenced code block
  } else {
    // → sectionToMarkdown: walk children, tables → GFM, text → paragraphs
  }
})
```

## Syntax Extraction (`extractSyntax`)

Each `li.sli` inside a `[書式]` section contains one syntax variant (e.g. the positive form and the `no` form). The raw text of each list item is collected and joined into a single fenced code block:

```typescript
$section.find('li.sli').each((_, li) => {
  lines.push($(li).text().replace(/\s+/g, ' ').trim())
})
return '```\n' + lines.join('\n') + '\n```'
```

The `span.keyword.kwd`, `span.ph.var`, and `span.ph.delim` elements are all flattened to text — their CSS classes exist only for browser rendering.

## Table Conversion (`tableToMarkdown`)

HTML tables are converted row by row. The first `<tr>` becomes the header row; a separator row of `---` cells is inserted; remaining rows become body rows.

```typescript
$table.find('tr').each((_, tr) => {
  const cells = $(tr).find('th, td').map((_, c) => $(c).text().trim()).get()
  rows.push(cells)
})
// rows[0] = header, rows[1..] = body
```

**Limitation:** `rowspan` and `colspan` attributes are not handled. Cells that span multiple rows will appear in the first row only; subsequent rows will have fewer columns than the header. The text content is never lost, but the visual layout may differ from the original.

## Mixed-Content Sections

Some sections (especially `[設定値及び初期値]`) interleave plain text with tables:

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

`sectionToMarkdown` handles this by walking direct children and dispatching:
- `table` elements → `tableToMarkdown`
- elements containing nested tables → recurse one level, extract tables and non-table text separately
- all other elements → `.text()` as plain paragraph
