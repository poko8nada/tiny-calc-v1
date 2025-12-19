# MVP実装タスク (tasks-mvp.md)

## Phase 1: プロジェクトセットアップ・基盤構築

### Task 1.1: プロジェクト初期化・依存関係インストール

- [x] `package.json` - 依存関係追加（Next.js 16, React 19, Tailwind CSS, math.js, Vitest）
- [x] `pnpm install` - 依存パッケージインストール
- [x] `next.config.js` - Cloud Run用設定（output: 'standalone'）
- [x] `tsconfig.json` - TypeScript設定確認
- [x] `.gitignore` - 不要ファイル除外設定

**依存関係**: なし  
**成果物**: 実行可能なNext.jsプロジェクト環境  
**完了条件**: `pnpm dev` でローカルサーバーが起動すること  
**テスト**: 手動確認

### Task 1.2: Tailwind CSS + ターミナルテーマ設定

- [x] `tailwind.config.ts` - ターミナルテーマ用カラーパレット設定（Modern Terminal - Amber/Black）
- [x] `app/globals.css` - ターミナルエフェクト（glow, cursor blink, ASCII border）追加
- [x] `postcss.config.js` - PostCSS設定確認

**依存関係**: Task 1.1  
**成果物**: ターミナル風スタイリング基盤  
**完了条件**: Tailwindのターミナルカラー（terminal-gold, terminal-amber等）が使用可能  
**テスト**: 手動確認

### Task 1.3: Fira Code フォント設定

- [x] `app/layout.tsx` - Fira Code フォント読み込み（next/font/google）
- [x] フォント変数設定（--font-mono）
- [x] メタデータ設定（title, description, OGP準備）

**依存関係**: Task 1.2  
**成果物**: Fira Code適用済みRoot Layout（FR-07）  
**完了条件**: ページ全体でFira Codeが適用されること  
**テスト**: 手動確認

### Task 1.4: ターミナルテーマ視覚確認用テストコンポーネント作成

- [x] `app/_components/ThemeTestComponent.tsx` - ターミナルテーマ確認用ミニマムコンポーネント
  - カラーパレット表示（terminal-gold, terminal-amber, terminal-cyan等）
  - Fira Code フォント表示確認
  - ASCII枠線表示（`┌─┐│└┘`）
  - 点滅カーソルアニメーション確認
  - テキストグロー効果確認
  - ホバー・フォーカス状態確認
  - コントラスト比視認性確認
- [x] `app/page.tsx` - テストコンポーネント一時配置
- [x] ブラウザで視覚確認
  - 全カラーが想定通り表示されること
  - Fira Codeが適用されていること
  - アニメーション・エフェクトが動作すること
  - レスポンシブ表示確認
- [x] 確認完了後、テストコンポーネントコメントアウト

**依存関係**: Task 1.3  
**成果物**: ターミナルテーマ動作確認済み環境  
**完了条件**: ブラウザでターミナルテーマが想定通り表示されること  
**テスト**: 手動確認（視覚確認）

---

## Phase 2: 型定義・コアロジック実装

### Task 2.1: 共通型定義

- [x] `utils/types.ts` - `Result<T, E>` 型定義

**依存関係**: Task 1.1  
**成果物**: プロジェクト全体で使用する型定義  
**完了条件**: 型定義ファイルがimport可能  
**テスト**: TypeScriptコンパイル確認

### Task 2.2: 式評価ロジック実装

- [x] `utils/evaluateExpression.ts` - math.jsを使用した式評価関数（FR-01）
  - `evaluateExpression(expression: string): Result<number, string>` 実装
  - セキュリティ対策（許可リスト方式）
  - エラーハンドリング（構文エラー、未定義変数、除算ゼロ等）
- [x] `utils/evaluateExpression.test.ts` - 単体テスト
  - 正常系テスト（基本四則演算、三角関数、べき乗等）
  - 異常系テスト（不正な式、危険な操作）
  - セキュリティテスト

**依存関係**: Task 2.1  
**成果物**: テスト済み式評価ロジック  
**完了条件**: 単体テストが全てパスすること（カバレッジ >= 80%）  
**テスト**: 単体テスト必須（Vitest）

---

## Phase 3: UI コンポーネント実装

### Task 3.1: 入力コンポーネント実装

- [ ] `app/_components/CalculatorInput.tsx` - 数式入力UI（FR-02）
  - ターミナル風プロンプト表示（`user@tiny-calc:~$`）
  - リアルタイム式評価
  - 点滅カーソル実装
  - バリデーション・エラーハイライト
  - Enterキーで履歴追加
  - キーボード操作対応（Backspace, Delete, Escape等）

**依存関係**: Task 2.2  
**成果物**: ターミナル風入力フォーム  
**完了条件**: 入力・評価・送信が正常動作すること  
**テスト**: 手動確認

### Task 3.2: 結果表示コンポーネント実装

- [ ] `app/_components/CalculatorResult.tsx` - 計算結果表示UI（FR-03）
  - 結果数値表示（小数点以下第2位まで）
  - ターミナル風スタイリング（gold/amber配色）
  - エラーメッセージ表示（赤色）
  - 結果コピー機能（ワンクリック）
  - コピー成功通知（ツールチップまたはトースト）

**依存関係**: Task 2.2  
**成果物**: 計算結果表示UI  
**完了条件**: 正常結果・エラーの両方が適切に表示されること  
**テスト**: 手動確認

---

## Phase 4: 履歴管理機能実装

### Task 4.1: 履歴管理カスタムフック実装

- [ ] `app/_hooks/useCalculationHistory.ts` - 履歴管理ロジック（FR-04）
  - `useCalculationHistory()` フック実装
  - localStorage 永続化（キー: `tiny-calc-history`）
  - 履歴追加（最新100件まで）
  - 履歴クリア機能
  - 履歴再利用機能
  - タイムスタンプ記録

**依存関係**: Task 2.1  
**成果物**: テスト済み履歴管理ロジック  
**完了条件**: localStorage連携が正常動作すること  
**テスト**: 単体テスト推奨（localStorage mock使用）

### Task 4.2: 履歴パネルコンポーネント実装

- [ ] `app/_components/HistoryPanel.tsx` - 履歴表示UI（FR-05）
  - ターミナル風履歴リスト表示（ASCII枠線使用）
  - 履歴項目クリックで式を入力欄に復元
  - 各履歴に削除ボタン
  - クリアボタン（確認ダイアログ付き）
  - 縦スクロール対応
  - タイムスタンプ表示（相対時間 or 絶対時間）

**依存関係**: Task 4.1  
**成果物**: 履歴表示・操作UI  
**完了条件**: 履歴の追加・削除・クリア・再利用が正常動作すること  
**テスト**: 手動確認

---

## Phase 5: メインページ統合・レイアウト実装

### Task 5.1: メインページ実装

- [ ] `app/page.tsx` - メインページレイアウト（FR-06）
  - デスクトップ: 左70%入力+結果、右30%履歴
  - タブレット: 上下分割レイアウト
  - モバイル: 履歴はアコーディオンまたはドロワー
  - 全コンポーネント統合
  - 状態管理（useState/useEffect）
  - レスポンシブ対応（Tailwind breakpoints使用）

**依存関係**: Task 3.1, Task 3.2, Task 4.2  
**成果物**: 完全統合されたメインページ  
**完了条件**: 全機能が統合され、レスポンシブ表示されること  
**テスト**: 手動確認

### Task 5.2: ターミナルUI仕上げ

- [ ] ASCII枠線装飾追加（`┌─┐│└┘`）
- [ ] テキストグロー効果微調整
- [ ] ホバーエフェクト追加
- [ ] フォーカスインジケータ強化（アクセシビリティ対応）
- [ ] ターミナル風アニメーション追加（オプション）

**依存関係**: Task 5.1  
**成果物**: 完成度の高いターミナル風UI  
**完了条件**: デザインシステムに沿った統一感のあるUI  
**テスト**: 手動確認

---

## Phase 6: Cloud Run デプロイ準備

### Task 6.1: Dockerfile 作成

- [ ] `Dockerfile` - マルチステージビルド設定
  - base, deps, builder, runner ステージ
  - pnpm使用（corepack enable）
  - Node.js 20-alpine
  - ユーザー権限設定（nextjs:nodejs）
  - ポート3000公開
- [ ] `.dockerignore` - 不要ファイル除外設定

**依存関係**: Phase 5完了  
**成果物**: Cloud Run用Dockerイメージ定義  
**完了条件**: ローカルでDockerビルド・起動が成功すること  
**テスト**: `docker build . -t tiny-calc` で確認

### Task 6.2: Cloud Run デプロイ設定

- [ ] `cloudbuild.yaml` - Cloud Build設定（オプション）
- [ ] デプロイスクリプト作成（`scripts/deploy.sh`等）
- [ ] 環境変数設定確認（必要に応じて）
- [ ] リージョン設定（asia-northeast1推奨）

**依存関係**: Task 6.1  
**成果物**: デプロイ自動化設定  
**完了条件**: gcloudコマンドでデプロイ可能な状態  
**テスト**: 手動確認

---

## Phase 7: 検証・最適化・デプロイ

### Task 7.1: ブラウザ互換性・パフォーマンス確認

- [ ] ブラウザ互換性テスト（手動確認）
  - Chrome 90+: 全機能動作確認
  - Firefox 88+: 全機能動作確認
  - Safari 14+: 全機能動作確認
  - モバイル（iOS Safari 14+, Android Chrome 90+）
- [ ] パフォーマンス測定
  - 式入力時の計算レスポンス: < 100ms
  - localStorage 読み込み: < 50ms
  - 初期ロード時間: < 2秒
  - バンドルサイズ: < 500KB (gzip後)
- [ ] Lighthouse監査
  - Performance: 90+
  - Accessibility: 90+
  - Best Practices: 90+
- [ ] アクセシビリティ監査（axe DevTools）
  - WCAG 2.1 Level AA準拠確認
  - キーボードナビゲーション確認
  - スクリーンリーダー対応確認
- [ ] 単体テスト実行
  - `pnpm test:run` 全テストパス確認
  - カバレッジ確認（ビジネスロジック >= 80%）

**依存関係**: Phase 5完了  
**成果物**: 品質保証済みアプリケーション  
**完了条件**: 全ブラウザで動作確認完了、全テストパス、Lighthouse 90+  
**テスト**: 手動確認 + 自動テスト

### Task 7.2: リソース準備・メタデータ設定

- [ ] OGP画像作成・配置
  - `/public/og.png` (1200x630px)
  - ターミナル風デザイン
  - サービス名・コンセプト表示
- [ ] Favicon準備・追加
  - `/app/favicon.ico`
  - `/app/icon.png` (512x512px推奨)
  - ターミナル風アイコンデザイン
- [ ] メタデータ最終確認
  - title: "Tiny Calc - Terminal Style Calculator"
  - description設定
  - OGP設定（og:image, og:title, og:description）
  - Twitter Card設定
- [ ] ライセンス表記確認
  - math.js (Apache 2.0)
  - Fira Code (OFL 1.1)
  - Tailwind CSS (MIT)
  - Next.js (MIT)

**依存関係**: Task 7.1  
**成果物**: 完全なメタデータ・リソース設定  
**完了条件**: OGP・Faviconが正しく表示されること  
**テスト**: 手動確認（OGPチェッカー使用）

### Task 7.3: Cloud Run 本番デプロイ・動作確認

- [ ] Docker イメージビルド
  - `gcloud builds submit --tag gcr.io/PROJECT_ID/tiny-calc`
- [ ] Cloud Run デプロイ実行
  - リージョン: asia-northeast1
  - メモリ: 512Mi
  - CPU: 1
  - 認証: allow-unauthenticated
- [ ] 本番環境での動作確認
  - 全機能の動作確認
  - レスポンシブ表示確認
  - パフォーマンス確認
  - エラーハンドリング確認
- [ ] カスタムドメイン設定（オプション）
- [ ] SSL証明書確認

**依存関係**: Task 7.2, Task 6.2  
**成果物**: デプロイ済み本番環境  
**完了条件**: 本番URLで全機能が正常動作すること  
**テスト**: 本番環境での手動確認

### Task 7.4: ドキュメント整備

- [ ] README.md 更新
  - プロジェクト概要
  - セットアップ手順
  - 開発コマンド
  - デプロイ手順
  - ライセンス情報
- [ ] CHANGELOG.md 作成
  - MVP v1.0.0 リリースノート
- [ ] Phase 2 準備ドキュメント作成
  - 次フェーズで実装する機能リスト
  - 技術的負債・改善点メモ

**依存関係**: Task 7.3  
**成果物**: 完全なプロジェクトドキュメント  
**完了条件**: README が正確で、他者が理解できる内容  
**テスト**: レビュー確認

---

## チェックリスト（デプロイ前最終確認）

### テスト

- [ ] 単体テストが全てパス（`pnpm test:run`）
- [ ] テストカバレッジ >= 80%（ビジネスロジック）
- [ ] 全ブラウザで手動動作確認完了（Chrome, Firefox, Safari）
- [ ] モバイルブラウザ動作確認（iOS Safari, Android Chrome）

### リソース・メタデータ

- [ ] OGP画像設置完了（`/public/og.png`）
- [ ] Favicon設置完了（`/app/favicon.ico`, `/app/icon.png`）
- [ ] ライセンスクレジット表示確認（footer または LICENSE.txt）
- [ ] メタデータ設定完了（title, description, OGP, Twitter Card）

### 機能確認

- [ ] 式入力・リアルタイム評価 動作確認
- [ ] 計算結果表示（正常・エラー） 動作確認
- [ ] 結果コピー機能 動作確認
- [ ] 履歴追加・表示 動作確認
- [ ] 履歴再利用 動作確認
- [ ] 履歴削除・クリア 動作確認
- [ ] localStorage永続化 動作確認
- [ ] エラーハンドリング（不正な式、構文エラー等）動作確認

### Cloud Run デプロイ

- [ ] Dockerfile ビルド成功確認
- [ ] ローカルDockerコンテナ動作確認
- [ ] Cloud Run デプロイ成功確認
- [ ] 本番環境で全機能動作確認
- [ ] 本番環境パフォーマンス確認
- [ ] カスタムドメイン設定完了（該当する場合）
- [ ] SSL証明書有効確認

### ドキュメント

- [ ] README.md 更新完了
- [ ] CHANGELOG.md 作成完了
- [ ] ライセンス情報記載完了
- [ ] デプロイ手順ドキュメント作成完了
