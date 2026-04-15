# LLM / RAG取り込み

Markdown出力はLLMコンテキストウィンドウとRAGベクトルストアに直接投入できる設計になっている。

## 生HTMLよりMarkdownが優れる理由

| | 生HTML | 変換済みMarkdown |
|--|--------|----------------|
| ファイルサイズ | 平均約5.2 KB | 平均約0.8 KB |
| トークンの無駄 | 大（タグ・CSS・XML宣言） | 最小 |
| 構造の保持 | タグに暗黙的 | 見出し・テーブルで明示的 |
| チャンク品質 | 低（タグ境界≠意味境界） | 高（セクション=自然な境界） |

## 推奨チャンク戦略

各 `.md` ファイルは1コマンドページに対応しており、ほとんどのエンベディングウィンドウにそのまま収まるサイズ。より細かい粒度が必要な場合は `## ` 見出しで分割するとセクション単位のチャンクが得られる:

```
# 32.2 経路の集約の設定          ← ドキュメントタイトルチャンク
## [書式]                        ← 書式チャンク
## [説明]                        ← 説明チャンク
## [適用モデル]                   ← モデルチャンク
```

## 全ファイルの読み込み

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
print(f"{len(documents)}件のドキュメントを読み込み")
```

## LangChain使用例

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

## 選択的取り込み

`--include` で用途に関連するカテゴリのみを生成:

```bash
# VPNアシスタント向け
npm run convert -- --include "^(ipsec|l2tp|pptp|tunneling)/" --output output-vpn

# ルーティングアシスタント向け
npm run convert -- --include "^(bgp|ospf|ospfv3|ip)/" --output output-routing
```

## Amazon Bedrock / Knowledge Bases

`output/` ディレクトリをS3バケットにアップロードし、Bedrock Knowledge BaseのデータソースとしてS3を指定する。Markdownファイルはネイティブのデータソースタイプとしてサポートされている。

## OpenAI File Search

Markdownファイルは直接OpenAIベクトルストアにアップロードできる:

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
