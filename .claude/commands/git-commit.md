---
allowed-tools:
  - Bash
  - TodoWrite
description: 変更をステージングしてコミットする
argument-hint: "<コミットメッセージ>"
---

# 変更をコミット

指定されたメッセージで変更をコミットします: $ARGUMENTS

実行手順を追跡します:
1. git status で変更されたファイルを確認
2. git add ですべての変更をステージング
3. 指定されたメッセージでコミットを作成

処理内容:

1. まず git status を実行して、未追跡ファイルと変更されたファイルをすべて確認
2. git add -A ですべての変更をステージング
3. $ARGUMENTS にコミットメッセージが指定されていない場合、変更内容を分析して適切なコミットメッセージを生成
4. Claude Code の帰属フッターを含めてコミットを作成

## コミットメッセージの規則

このプロジェクトは Conventional Commits 形式に従います：

**形式**: `<type>(<scope>): <subject>`

**タイプ**:
- feat: 新機能
- fix: バグ修正
- docs: ドキュメントのみの変更
- style: コードの意味に影響しない変更（空白、フォーマット、セミコロンなど）
- refactor: バグ修正や機能追加ではないコード変更
- perf: パフォーマンス改善
- test: テストの追加や修正
- build: ビルドシステムや外部依存関係に影響する変更
- ci: CI設定ファイルやスクリプトの変更
- chore: その他の変更（ビルドプロセスやツールの変更など）

**ルール**:
- subject は最小5文字、最大72文字
- body の行長制限なし（詳細な説明が可能）
- WIP、TODO、Merge、Revert、Initial commit は除外

**例**:
- `feat: add user authentication`
- `fix(auth): resolve login timeout issue`
- `docs: update README with installation instructions`

注意: このコマンドはステージングとコミットのみ行います。リモートへのプッシュやPR作成は行いません。