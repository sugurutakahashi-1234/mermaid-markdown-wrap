---
allowed-tools:
  - Bash
  - TodoWrite
description: Gitブランチの作成・切り替え
argument-hint: "<ブランチ名>"
---

# Gitブランチの作成・切り替え

## ブランチ命名ルール

プロジェクトでは以下のブランチ命名規則を採用しています：

**形式**: `<タイプ>/<名前>`

**使用可能なタイプ**:
- **GitFlowタイプ**: feature, release, hotfix, bugfix
- **Conventional Commitsタイプ**: feat, fix, perf, docs, style, refactor, test, build, ci, chore

**名前の規則**:
- 小文字、数字、ハイフンのみ使用可能
- 長さは5文字以上50文字以下
- 例: `feature/user-authentication`, `fix/login-error-handling`

**除外ブランチ**: main, develop（直接切り替え可能）

## 実行内容

引数が指定されている場合: ブランチ「$ARGUMENTS」に切り替えます。
引数が指定されていない場合: 変更内容から自動的にブランチ名を生成して新しいブランチを作成します。

## 処理の詳細

1. まず `git status` で現在のブランチと未コミットの変更を確認

2. $ARGUMENTS にブランチ名が指定されていない場合：
   - 未コミットの変更がある場合:
     - `git diff --name-only` で変更されたファイルを確認
     - 変更内容から適切なブランチタイプと名前を自動決定
     - 例: package.json変更 → `chore/update-dependencies`
     - 例: src/内のファイル変更 → `feat/` または `fix/` + 適切な名前
   - 未コミットの変更がない場合:
     - 「どのような作業をしますか？」と質問
     - 回答に基づいて適切なブランチ名を生成
     - 例: 「ログイン機能を追加」→ `feat/add-login`
     - 例: 「タイポを修正」→ `fix/typo-correction`

3. ブランチ名が指定されている場合（または自動生成された場合）：
   - ブランチ名が命名規則に従っているか確認（main/developは除外）
   - `git checkout -b` で新規ブランチを作成、または既存ブランチに切り替え
   - ローカルに存在しない場合、リモートに存在するか確認
   - リモートに存在する場合、ローカルにトラッキングブランチを作成

4. 切り替えが成功したか現在のブランチを確認

注意：未コミットの変更がある場合、ブランチ切り替え時に失われる可能性があることを警告します。