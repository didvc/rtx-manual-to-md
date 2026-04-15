# FAQ

## Legal

### Is this an official Yamaha product?

No. This project is an independent, community-created tool with **no affiliation, endorsement, or sponsorship from Yamaha Corporation**. Please do not contact Yamaha Corporation for support related to this tool.

### Where does the copyright for the source data sit?

The command reference data parsed by this tool is **© Yamaha Corporation. All Rights Reserved.** This repository contains only the converter source code. No parsed output is included or distributed. Users must download the HTML archive themselves from the official source:

> https://www.rtpro.yamaha.co.jp/RT/manual/rt-common/

This design (Bring Your Own Data) ensures no copyrighted content is redistributed via this project.

### Are "Yamaha" and "RTX" trademarks?

Yes. "Yamaha" and "RTX" are registered trademarks of Yamaha Corporation. Their use in this project is purely descriptive — identifying the data source — and does not imply any official relationship.

### What terms of use apply to the source data?

By using this tool to process the HTML archive, you are responsible for complying with Yamaha Corporation's documentation terms of use as stated on the official RTpro site.

---

## Why is the output still in Japanese?

The source material — Yamaha's command reference — is published only in Japanese. This tool converts the *format* (HTML → Markdown) but does not translate the content. The Japanese text is preserved verbatim.

## Why do some parameter tables look misaligned?

The source HTML uses `rowspan` and `colspan` in some tables. Standard Markdown tables do not support spanning cells. The converter outputs all cell text but cannot reproduce the visual span — rows that shared a spanned cell will appear to have fewer columns than the header. No data is lost.

## How many files are converted?

A typical run converts around **1,237 command pages** (navigation files are automatically skipped). The exact count depends on the version of the archive.

## Can I run it on a specific firmware version's archive?

Yes. Pass the path to the `html/` directory of any version of the archive via `--input`. The converter does not assume a specific version.

## The `output/` directory already exists. Will it be overwritten?

Yes. Files are written with `fs.writeFileSync` and will overwrite any existing file at the same path. The directory itself and its parent structure are created if missing.

## Does it work offline?

Yes. The converter has no network calls. Once the npm dependencies are installed, everything runs fully offline.

## Why Apache 2.0 and not MIT?

Apache 2.0 adds an explicit patent grant clause that MIT lacks, which reduces legal risk for corporate users. It is otherwise equally permissive for use, modification, and distribution.

## How do I update when Yamaha releases a new archive?

Download the new `Cmdref_HTML_Archive.zip`, extract it, and re-run `npm run convert`. The output directory is regenerated completely on each run.

## Can I contribute a translation of the docs?

Yes — see [CONTRIBUTING.md](https://github.com/yuis-ice/rtx-manual-to-md/blob/master/CONTRIBUTING.md). Additional language directories under `docs/` are welcome.
