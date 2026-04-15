# CLI Reference

```
npm run convert [-- options]
```

## Options

| Flag | Value | Default | Description |
|------|-------|---------|-------------|
| `--input` | `<dir>` | `./Cmdref_HTML_Archive (1)/html` | Source HTML directory |
| `--output` | `<dir>` | `./output` | Output directory |
| `--include` | `<regex>` | — | Only process files whose relative path matches |
| `--exclude` | `<regex>` | — | Skip files whose relative path matches |
| `--stats` | — | off | Print line/char reduction statistics after conversion |

`--include` and `--exclude` are mutually exclusive — using both together exits with an error.

## --input

Path to the extracted `html/` directory from `Cmdref_HTML_Archive.zip`.

```bash
npm run convert -- --input ~/Downloads/Cmdref_HTML_Archive/html
```

## --output

Destination for the generated `.md` files. Created automatically if it does not exist.

```bash
npm run convert -- --output ~/rtx-docs
```

## --include `<regex>`

Only convert files whose path relative to `--input` matches the regex.

```bash
# BGP commands only
npm run convert -- --include "^bgp/"

# BGP and OSPF
npm run convert -- --include "^(bgp|ospf)/"

# Any file containing "nat"
npm run convert -- --include "nat"
```

## --exclude `<regex>`

Skip files whose relative path matches the regex. Processes everything else.

```bash
# Skip BGP
npm run convert -- --exclude "^bgp/"

# Skip navigation / rarely-used categories
npm run convert -- --exclude "^(howtouse|help|cmdref)/"
```

## --stats

Prints a reduction summary after conversion.

```bash
npm run convert -- --stats
```

Example output:

```
── Stats ──────────────────────────────────────────
  files converted : 1,237
  input  cloc     : 100,065 lines  (6,435,979 chars)
  output cloc     :  47,694 lines  (1,019,402 chars)
  reduce cloc     :  52,371 lines
  reduce %        : 84.2%  (chars)
────────────────────────────────────────────────────
```

## Exit Codes

| Code | Meaning |
|------|---------|
| `0` | All files converted successfully |
| `1` | `--input` directory not found, or `--include`/`--exclude` used together |

Individual file parse errors are logged to stderr but do not abort the run.
