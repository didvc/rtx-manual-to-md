# LLM / RAG Ingestion

The Markdown output is designed to be fed directly into LLM context windows and RAG vector stores.

## Why Markdown Over Raw HTML

| | Raw HTML | Converted Markdown |
|--|----------|-------------------|
| File size | ~5.2 KB avg | ~0.8 KB avg |
| Token waste | High (tags, CSS, XML decl.) | Minimal |
| Structure preservation | Implicit in tags | Explicit headings/tables |
| Chunking quality | Poor (tag boundaries ≠ semantic) | Good (sections = natural chunks) |

## Recommended Chunking Strategy

Each `.md` file is a single command page and is already small enough to fit in most embedding windows as-is. For finer granularity, split on `## ` headings to get per-section chunks:

```
# 32.2 経路の集約の設定          ← document title chunk
## [書式]                        ← syntax chunk
## [説明]                        ← description chunk
## [適用モデル]                   ← models chunk
```

## Loading All Files

```python
import os, pathlib

docs_dir = pathlib.Path("output")
documents = []
for md_file in docs_dir.rglob("*.md"):
    text = md_file.read_text(encoding="utf-8")
    documents.append({
        "source": str(md_file.relative_to(docs_dir)),
        "content": text,
    })
print(f"Loaded {len(documents)} documents")
```

## LangChain Example

```python
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain.text_splitter import MarkdownHeaderTextSplitter

loader = DirectoryLoader("output/", glob="**/*.md", loader_cls=TextLoader)
docs = loader.load()

splitter = MarkdownHeaderTextSplitter(
    headers_to_split_on=[("#", "title"), ("##", "section")]
)
chunks = []
for doc in docs:
    chunks.extend(splitter.split_text(doc.page_content))
```

## Selective Ingestion

Use `--include` to generate only the categories relevant to your deployment:

```bash
# VPN-focused assistant
npm run convert -- --include "^(ipsec|l2tp|pptp|tunneling)/" --output output-vpn

# Routing-focused assistant
npm run convert -- --include "^(bgp|ospf|ospfv3|ip)/" --output output-routing
```

## Amazon Bedrock / Knowledge Bases

Upload the `output/` directory to an S3 bucket and point a Bedrock Knowledge Base at it. The Markdown files are natively supported as a data source type. Each file becomes one or more chunks depending on your chunking configuration.

## OpenAI File Search

The Markdown files can be uploaded directly to an OpenAI vector store:

```python
from openai import OpenAI
import pathlib

client = OpenAI()
store = client.beta.vector_stores.create(name="rtx-cmdref")

for md_file in pathlib.Path("output").rglob("*.md"):
    with open(md_file, "rb") as f:
        client.beta.vector_stores.files.upload(
            vector_store_id=store.id, file=f
        )
```
