---
layout: home

hero:
  name: rtx-manual-to-md
  text: Yamaha RTX コマンドリファレンス → Markdown
  tagline: HTMLアーカイブ全体を一括変換。LLM取り込み・RAGパイプライン・オフライン閲覧に対応したGFM形式で出力。
  actions:
    - theme: brand
      text: はじめに
      link: /ja/guide/getting-started
    - theme: alt
      text: GitHubで見る
      link: https://github.com/yuis-ice/rtx-manual-to-md
    - theme: alt
      text: English
      link: /

features:
  - title: アーカイブ全体を一括変換
    details: 約1,300件のXHTMLコマンドページを1回の実行で再帰処理。ディレクトリ構造をそのまま維持。
  - title: 84%のサイズ削減
    details: HTMLボイラープレート・インラインスタイル・ナビゲーションマークアップを除去。出力は文字数ベースで約84%小さくなる。
  - title: GFMテーブル
    details: パラメータ・設定値テーブルをGitHub Flavored Markdownテーブルに変換。データは欠損なく保持。
  - title: フェンスコードブロック
    details: コマンド書式行はトリプルバッククォートブロックに収まり、シンタックスハイライトに対応。
  - title: include / exclude フィルタ
    details: 正規表現パターンで必要なカテゴリのみを選択処理。相対パスにマッチする。
  - title: 統計レポート
    details: --statsオプションで変換前後の行数・文字数・削減率を表示。
---
