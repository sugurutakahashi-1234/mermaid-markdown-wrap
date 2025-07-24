# TypeScript テンプレート

厳格な型チェック、自動化されたワークフロー、ベストプラクティスが事前設定された、モダンなTypeScriptプロジェクトテンプレートです。

## 主な機能

- **TypeScript** - 最も厳格な型チェックを有効化
- **Bun** - 超高速なランタイムとパッケージマネージャー
- **Biome** - 高速なリンターとフォーマッター
- **GitHub Actions** - 6つの事前設定されたワークフロー
- **自動リリース** - release-pleaseによるセマンティックバージョニング
- **依存関係の自動更新** - Renovateによる自動化
- **Git フック** - Huskyとcommitlintでコミットメッセージを標準化
- **コードカバレッジ** - Codecov統合によるレポート
- **デッドコード検出** - Knipを使用した未使用コードの検出
- **ドキュメント生成** - 依存関係とコード品質の可視化

## 必要な環境

- Node.js v20以上
- Bun（最新版）

## はじめに

1. **このテンプレートをクローンまたは使用**
   ```bash
   git clone https://github.com/yourusername/typescript-template.git
   cd typescript-template
   ```

2. **依存関係をインストール**
   ```bash
   bun install
   ```

3. **CIパイプラインを実行して動作確認**
   ```bash
   bun run ci
   ```

## 利用可能なスクリプト

### 開発用コマンド

| コマンド | 説明 |
|---------|------|
| `bun run build` | TypeScriptファイルをJavaScriptにビルド（`lib/`に出力） |
| `bun run typecheck` | ビルドせずにTypeScriptの型チェックのみ実行 |
| `bun run test` | Bunのテストランナーですべてのテストを実行 |
| `bun run test:coverage` | カバレッジレポート付きでテストを実行 |
| `bun run test:coverage:html` | HTMLカバレッジレポートを生成 |

### コード品質コマンド

| コマンド | 説明 |
|---------|------|
| `bun run lint` | Biomeリンターを自動修正付きで実行 |
| `bun run lint:check` | リントの問題をチェック（修正なし） |
| `bun run format` | Biomeでコードをフォーマット |
| `bun run format:check` | フォーマットの問題をチェック（修正なし） |
| `bun run knip` | 未使用のエクスポート、依存関係、デッドコードを検出 |

### CI/CDコマンド

| コマンド | 説明 |
|---------|------|
| `bun run ci` | 完全なCIパイプラインを実行: フォーマット → 型チェック → リント → ビルド → テスト → デッドコード検出 |
| `bun run validate:codecov` | codecov.yml設定を検証 |
| `bun run validate:renovate` | renovate.json5設定を検証 |
| `bun run validate:branch` | 現在のブランチ名が規約に従っているかチェック |

### 依存関係管理

| コマンド | 説明 |
|---------|------|
| `bun run deps:check` | 古い依存関係をチェック |
| `bun run deps:update` | すべての依存関係を最新バージョンに更新 |
| `bun run deps:size:prod` | 本番用依存関係のサイズを分析 |
| `bun run deps:size:dev` | 開発専用依存関係のサイズを分析 |
| `bun run deps:size:all` | すべてのnode_modulesパッケージサイズを表示 |

### ドキュメント生成

| コマンド | 説明 |
|---------|------|
| `bun run update:docs` | すべてのドキュメントを更新（knipレポート + 依存関係グラフ） |
| `bun run update:docs:knip` | 未使用コードレポートを生成 |
| `bun run update:docs:deps-graph` | 依存関係グラフの可視化を生成 |

### ユーティリティコマンド

| コマンド | 説明 |
|---------|------|
| `bun run clean` | ビルド成果物とキャッシュを削除 |
| `bun run clean:install` | クリーン後に依存関係を再インストール |
| `bun run clean:build` | クリーン、再インストール、完全なCIを実行 |

## プロジェクト構造

```
typescript-template/
├── .github/
│   ├── workflows/          # GitHub Actionsワークフロー
│   └── pr-auto-assign-config.yml
├── .claude/               # Claude Code設定
├── .vscode/              # VSCode設定
├── src/                  # ソースコード
│   ├── calculator.ts     # 実装例
│   ├── calculator.test.ts # テスト例
│   ├── example.ts
│   └── example.test.ts
├── lib/                  # ビルド出力（gitignore対象）
├── docs/
│   └── reports/          # 自動生成レポート
├── coverage/             # テストカバレッジ（gitignore対象）
└── [設定ファイル群]
```

## 設定ファイル

| ファイル | 用途 |
|---------|------|
| `tsconfig.json` | TypeScript設定（strictモード有効） |
| `tsconfig.build.json` | TypeScriptビルド専用設定 |
| `biome.jsonc` | Biomeリンター・フォーマッター設定 |
| `commitlint.config.ts` | コンベンショナルコミットメッセージの強制 |
| `renovate.json5` | 依存関係自動更新の設定 |
| `knip.config.ts` | デッドコード検出の設定 |
| `codecov.yml` | コードカバレッジレポートの設定 |
| `bunfig.toml` | Bunランタイム設定 |
| `release-please-config.json` | 自動リリース管理 |

## GitHub Actions設定

### 必要なシークレット

リポジトリ設定でこれらのシークレットを設定してください：

1. **`CODECOV_TOKEN`**（プライベートリポジトリで必須）
   - [codecov.io](https://codecov.io)でサインアップ
   - リポジトリを追加
   - リポジトリ設定からトークンをコピー
   - リポジトリシークレットとして追加

2. **`NPM_TOKEN`**（npm公開する場合必須）
   - [npmjs.com](https://www.npmjs.com)で生成
   - Access Tokens → Generate New Tokenへ
   - "Automation"タイプを選択
   - リポジトリシークレットとして追加

### ワークフローの概要

1. **CI - プルリクエスト**（`ci-pull-request.yml`）
   - トリガー: PR作成・更新時（ドラフトはスキップ）
   - アクション: 型チェック、リント、ビルド、テスト、カバレッジアップロード
   - 目的: マージ前のコード品質確保

2. **CI - mainへのプッシュ**（`ci-push-main.yml`）
   - トリガー: mainブランチへのプッシュ時
   - アクション: PRワークフローと同じ
   - 目的: mainブランチの整合性確認

3. **CD - NPMリリース**（`cd-npm-release.yml`）
   - トリガー: mainブランチへのプッシュ時
   - アクション: リリースPR作成、npmへの公開
   - 目的: 自動バージョニングと公開

4. **PR自動アサイン**（`pr-auto-assign.yml`）
   - トリガー: PR作成・再オープン時
   - アクション: レビュアーとアサイン者を自動設定
   - 目的: PRレビュープロセスの効率化

5. **ブランチ名検証**（`validate-branch-name.yml`）
   - トリガー: PR作成・更新時
   - アクション: ブランチ命名規約のチェック
   - 目的: 一貫性のあるブランチ名の強制

6. **PRタイトル検証**（`validate-pr-title.yml`）
   - トリガー: PR作成・編集時
   - アクション: PRタイトル形式の検証
   - 目的: 意味のあるPRタイトルの確保

## TODO: セットアップチェックリスト

このテンプレートを使用する際は、以下のタスクを完了してください：

- [ ] `package.json`を更新:
  - [ ] `name`フィールドをプロジェクト名に変更
  - [ ] `description`を更新
  - [ ] `author`情報を更新
  - [ ] `repository` URLを更新
  - [ ] `bugs` URLを更新
  - [ ] 該当する場合は`homepage`を更新

- [ ] `LICENSE`ファイルを自分の名前/組織に更新

- [ ] GitHubリポジトリ設定を構成:
  - [ ] `CODECOV_TOKEN`シークレットを追加（プライベートリポジトリの場合）
  - [ ] `NPM_TOKEN`シークレットを追加（npmに公開する場合）
  - [ ] `main`ブランチの保護ルールを有効化

- [ ] 設定ファイルを更新:
  - [ ] `.github/pr-auto-assign-config.yml`のレビュアーを変更
  - [ ] `renovate.json5`のリポジトリURLを更新
  - [ ] 必要に応じて`tsconfig.json`を調整

- [ ] サンプルコードをクリーンアップ:
  - [ ] `src/calculator.ts`とそのテストを削除
  - [ ] `src/example.ts`とそのテストを削除
  - [ ] 独自のソースファイルを追加

- [ ] ドキュメント:
  - [ ] このREADMEをプロジェクト情報で更新
  - [ ] `CONTRIBUTING.md`にコンテンツを追加
  - [ ] `docs/`に初期ドキュメントを作成

## OSSから非公開プロジェクトへの変換

このテンプレートを非公開/プロプライエタリプロジェクトで使用する場合：

### 1. npm公開を削除
`.github/workflows/cd-npm-release.yml`ファイルを削除またはコメントアウトして、自動npm リリースを無効化します。

### 2. package.jsonを更新
`publishConfig`セクションを削除：
```json
"publishConfig": {
  "access": "public"
}
```

### 3. Codecovを設定
プライベートリポジトリでは、`CODECOV_TOKEN`は必須です：
- [codecov.io](https://codecov.io)にアクセス
- プライベートリポジトリを追加
- トークンをコピー
- GitHubシークレットとして追加

### 4. ライセンスを更新
MITライセンスをプロプライエタリライセンスに置き換えるか、LICENSEファイルを完全に削除します。

### 5. Renovate設定を更新
`renovate.json5`で、依存関係ダッシュボードフッターの公開リポジトリURLを削除または変更します。

### 6. GitHub Actionsをレビュー
オープンソースプロジェクト特有のワークフローを削除または修正することを検討：
- release-pleaseワークフローは内部プロジェクトでは不要かもしれません
- 追加のセキュリティスキャンやデプロイメントワークフローを追加したい場合があります

## 開発の理念

このテンプレートは以下の原則に従っています：

- **型安全性第一**: 最も厳格なTypeScript設定を有効化
- **高速フィードバック**: Bunによる高速CI/CDパイプライン
- **すべてを自動化**: フォーマットからリリースまで
- **デッドコードゼロ**: 未使用コードの継続的検出
- **常に最新**: 依存関係の自動更新
- **一貫性のあるコミット**: gitフックによる強制

## トラブルシューティング

### よくある問題

1. **Huskyフックが動作しない**
   ```bash
   bun run prepare
   ```

2. **依存関係更新後の型エラー**
   ```bash
   bun run clean:build
   ```

3. **カバレッジレポートが生成されない**
   - テストが存在し、合格していることを確認
   - `bunfig.toml`のカバレッジ設定をチェック

## コントリビューション

ガイドラインは[CONTRIBUTING.md](CONTRIBUTING.md)を参照してください。

## ライセンス

このテンプレートはMITライセンスです。詳細は[LICENSE](LICENSE)を参照してください。