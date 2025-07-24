---
allowed-tools:
  - Bash
  - TodoWrite
description: 完全なPRワークフローを実行（add, commit, push, PR作成）
argument-hint: "<コミットメッセージ>"
---

# プルリクエスト作成ワークフロー

指定されたコミットメッセージでプルリクエストを作成します: $ARGUMENTS

まず、TodoWriteを使用してワークフローの手順を追跡します:
1. git status の確認
2. すべての変更をステージング
3. メッセージ付きでコミット作成
4. リモートにプッシュ
5. プルリクエスト作成

各手順の実行:

1. まず、現在のgit statusを確認して、変更されたファイルを確認
2. git add を使用してすべての変更をステージング
3. 指定されたメッセージでコミット（未指定の場合は自動生成）
4. 現在のブランチをリモートにプッシュ（必要に応じてupstreamを作成）
5. gh CLIを使用してプルリクエストを作成

重要事項:
- $ARGUMENTS にコミットメッセージが指定されていない場合、変更内容を分析して適切なコミットメッセージを生成
- コミットメッセージにClaude Codeの帰属フッターを含める
- ファイルを変更する可能性のあるpre-commitフックを処理
- 変更内容に基づいて意味のあるPRタイトルと説明を作成

## PRタイトルの規則

PRタイトルもコミットメッセージと同様に Conventional Commits 形式に従います：

**形式**: `<type>(<scope>): <subject>`

**例**:
- `feat: add user authentication system`
- `fix(auth): resolve JWT token expiration issue`
- `docs: update API documentation`
- `refactor(core): simplify error handling logic`

PRタイトルは最初のコミットメッセージと同じか、複数のコミットがある場合は変更内容を要約した形式にします。

ワークフローを開始します！