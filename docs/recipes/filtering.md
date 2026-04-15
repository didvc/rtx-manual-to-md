# Filtering Files

Both `--include` and `--exclude` accept a JavaScript regex matched against the **relative path** of each file from `--input` (e.g. `bgp/bgp_aggregate.html`).

They are mutually exclusive — using both in the same invocation exits with an error.

## --include: process only matching files

```bash
# Single category
npm run convert -- --include "^bgp/"

# Multiple categories (alternation)
npm run convert -- --include "^(bgp|ospf|ip)/"

# All IP-related files regardless of subdirectory
npm run convert -- --include "ip"

# Files that mention "filter" in their name
npm run convert -- --include "filter"
```

## --exclude: skip matching files

```bash
# Skip a single category
npm run convert -- --exclude "^bgp/"

# Skip multiple categories
npm run convert -- --exclude "^(howtouse|help|cmdref|image)/"

# Skip all files containing "chapter" (redundant with built-in skip, shown as example)
npm run convert -- --exclude "_chapter"
```

## Combining with --stats

Adding `--stats` always works alongside either filter flag:

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

## Regex Tips

The regex is compiled with `new RegExp(pattern)` — no flags, so it is **case-sensitive** by default. All source paths use forward slashes on all platforms.

| Goal | Pattern |
|------|---------|
| Exact category | `^bgp/` |
| Multiple categories | `^(bgp\|ospf)/` |
| Substring in filename | `aggregate` |
| Any depth under ip/ | `^ip/` |
| Files starting with "show" | `/show` |
