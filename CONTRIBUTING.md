# Contributing

Thank you for your interest in contributing to rtx-manual-to-md!

## Getting started

1. Fork the repository and clone your fork.
2. Install dependencies: `npm install`
3. Download the HTML archive and extract it to `Cmdref_HTML_Archive (1)/html/` (see README).
4. Run the converter to confirm it works: `npm run convert -- --stats`

## Making changes

- Keep changes focused — one fix or feature per pull request.
- Run a full conversion (`npm run convert -- --stats`) before submitting to confirm zero errors and that the reduction numbers look reasonable.
- If you change the HTML parsing logic, spot-check a few output `.md` files for correctness.

## Reporting issues

Open a GitHub Issue with:
- A brief description of the problem
- The command you ran
- The relevant HTML file path (relative to the `html/` root) if applicable
- The actual vs. expected output

## Pull request checklist

- [ ] `npm run convert` exits with 0 errors
- [ ] No secrets or personal data introduced
- [ ] PR description explains what changed and why

## License

By contributing you agree that your contributions will be licensed under the Apache 2.0 License.
