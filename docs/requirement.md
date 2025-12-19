# Tiny Calc 要件定義書 (requirement.md)

## 1. 概要 (Overview)

本プロジェクトは、業務中に発生する「ちょっとした計算」を手軽に行うための、ブラウザベースのシンプル電卓アプリを開発する。  
電卓アプリを開くまでもない軽い数値演算を、即座に実行できることを目的とする。

フェーズ1でMVPを達成し、フェーズ2で式のテンプレート機能や計算結果のエクスポートなどを実現する。

- **サービス名**
  - Tiny Calc
- **目的**
  - 式を入力するだけでリアルタイムに結果を表示し、計算履歴も自動保存するシンプルな計算ツール
- **ターゲット**
  - 一般的なオフィスワーカー、エンジニア、フリーランスなど業務中に軽い計算を行いたいユーザー

---

## 2. 技術スタック (Technology Stack)

### MVP

- **フロントエンド**: Next.js 15+ (App Router)
- **バックエンド**: なし (SSR/Standalone mode)
- **ホスティング**: Google Cloud Run
- **認証**: なし
- **状態管理**: React Hooks (useState / useEffect)
- **スタイリング/コンポーネント**: Tailwind CSS（Terminal theme固定）
- **テスト**: Vitest（主要ロジックのみ）
- **データベース**: なし (localStorage利用)
- **その他**: math.js (式評価)
- **フォント**: Fira Code (monospace)

### PRODUCT v1 (製品版)

- フロントエンド、バックエンド等に大きな変更なし
- ユーザー認証やクラウド同期は検討段階

---

## 3. 機能要件 (Functional Requirements)

> **原則**: 1ファイル = 1機能要件を基本とする。各ファイルの責務を明確化し、テスト可能な単位で設計する。

### 3.1. 式入力・計算

**FR-01: `evaluateExpression.ts`**

- **要件**: ユーザーが入力した数式をリアルタイムに評価し、結果を返す
- **詳細**:
  - math.js の `evaluate()` を使用して式評価
  - インジェクション対策（許可リスト方式で安全な操作のみ許可）
  - エラーハンドリング（構文エラー、未定義変数など）
  - 結果は `Result<number, string>` 型で返却
- **関数**: `evaluateExpression(expression: string): Result<number, string>`
- **戻り値**:
  - 成功: `{ ok: true, value: 3.5 }`
  - 失敗: `{ ok: false, error: "Syntax error at position 5" }`
- **テスト観点**:
  - 正常な式の評価（`2+3`, `10*5`, `Math.sqrt(16)` など）
  - エラー式の検出（`2++3`, `undefined`, `1/0` など）
  - セキュリティ検証（危険な操作の拒否）

**FR-02: `CalculatorInput.tsx`**

- **要件**: ユーザーが数式を入力するUI
- **詳細**:
  - テキストインプット with リアルタイム検証
  - 各入力変更時に式を評価
  - バリデーション結果を表示（エラーハイライト）
  - Enter キー押下で履歴に追加
  - キーボード操作対応（Backspace, Delete など）
- **Props**: `{ onExpressionChange: (expr: string, result: Result<number, string>) => void, onSubmit: (expr: string, result: number) => void }`
- **テスト観点**: [手動確認]

**FR-03: `CalculatorResult.tsx`**

- **要件**: 計算結果をリアルタイムで表示
- **詳細**:
  - 結果が正常の場合は数値表示（小数点以下第5位まで、カラー: `terminal-cyan`）
  - エラーの場合はエラーメッセージ表示（カラー: `terminal-red`、入力と同じ行に表示）
  - 結果のコピー機能（明示的な `[ COPY ]` ボタン）
- **Props**: `{ currentResult: { expression: string, value: number | string, isError: boolean } }`
- **テスト観点**: [手動確認]

### 3.2. 計算履歴管理

**FR-04a: `historyUtils.ts` (Core Logic)**

- **要件**: 履歴データの操作に関する純粋なビジネスロジック
- **詳細**:
  - 履歴の追加（最新100件制限、先頭挿入）
  - 履歴の削除（ID指定）
  - タイムスタンプとユニークID（UUID）の付与
  - Reactに依存しない純粋関数として実装し、100%のテストカバレッジを目指す
- **型**: `HistoryItem = { id: string, expression: string, result: number | string, timestamp: number }`
- **テスト観点**:
  - 履歴の追加・削除ロジックの正確性
  - 容量制限（100件超過時の削除）の検証

**FR-04b: `useCalculationHistory.ts` (State & Persistence)**

- **要件**: 計算履歴の状態管理と localStorage への永続化
- **詳細**:
  - `historyUtils.ts` を使用して状態を更新
  - localStorage キー: `tiny-calc-history`
  - SSR（Next.js）を考慮したハイドレーション制御
- **関数**: `useCalculationHistory(): { history: HistoryItem[], addHistory, deleteHistory, clearHistory, isInitialized }`
- **テスト観点**:
  - localStorage との状態同期
  - 初期化フラグ（isInitialized）の動作確認

**FR-05: `HistoryPanel.tsx`**

- **要件**: 計算履歴をUIで表示・操作
- **詳細**:
  - 履歴一覧表示（式、結果、タイムスタンプ）
  - 履歴クリック時に式を入力欄に復元
  - クリアボタン（確認ダイアログ付き）
  - スクロール対応（縦スクロール）
  - 各履歴項目に削除ボタン
- **Props**: `{ history: CalculationRecord[], onReuse: (expr: string) => void, onClear: () => void, onDelete: (id: string) => void }`
- **テスト観点**: [手動確認]

### 3.3. レイアウト・UI

**FR-06: `page.tsx`**

- **要件**: メインページ（入力、結果、履歴の統合レイアウト）
- **詳細**:
  - 画面上部: 入力フォーム + 最新の結果を固定表示（Fixed Header）
  - 画面下部: 過去の計算履歴をスクロール表示（Scrollable History）
  - PC/モバイル共通: シングルカラムのターミナル・エミュレータ風レイアウト
  - レスポンシブデザイン
  - ダークモード固定
- **テスト観点**: [手動確認]

**FR-07: `layout.tsx`**

- **要件**: Root layout（Tailwind設定、フォント、メタデータ）
- **詳細**:
  - Terminal theme固定（`dark` クラス常時適用）
  - フォント設定（Fira Code monospace）
  - Meta tags 設定（title, description, OGP）
  - viewport 設定（レスポンシブ対応）
- **テスト観点**: [手動確認]

**FR-08: `ThemeTestComponent.tsx`**

- **要件**: ターミナルテーマの視覚確認用テストコンポーネント（一時的）
- **詳細**:
  - カラーパレット表示（terminal-gold, terminal-amber, terminal-cyan等）
  - Fira Code フォント表示確認
  - ASCII枠線表示（`┌─┐│└┘`）
  - 点滅カーソルアニメーション確認
  - テキストグロー効果確認
  - ホバー・フォーカス状態確認
  - コントラスト比視認性確認
  - 確認完了後は削除またはコメントアウト
- **Props**: なし
- **テスト観点**: [手動確認（視覚確認）]

---

## 4. 非機能要件 (Non-Functional Requirements)

**NFR-01: パフォーマンス**

- 式入力時の計算レスポンス: < 100ms
- localStorage 読み込み: < 50ms
- 初期ロード時間: < 2 秒
- バンドルサイズ: < 500KB (gzip後)

**NFR-02: ブラウザ互換性**

- Chrome 90+, Firefox 88+, Safari 14+
- モバイル (iOS Safari 14+, Android Chrome 90+)

**NFR-03: アクセシビリティ**

- WCAG 2.1 Level AA準拠
- キーボード操作対応（Tab, Enter, Escape など）
- スクリーンリーダー対応（適切な ARIA ラベル、セマンティック HTML）
- フォーカス表示（視認性確保）

**NFR-04: セキュリティ**

- math.js インジェクション対策（許可リスト方式）
- XSS対策（React標準機能で対応）
- localStorage の機密情報非保存
- 計算式の検証（危険な操作の拒否）

**NFR-05: テスタビリティ**

- ビジネスロジック（式評価、履歴管理）は単体テスト必須
- UIコンポーネント・トリビアルコードはテスト不要
- テストカバレッジ: ビジネスロジック >= 80%

**NFR-06: アーキテクチャ**

- Functional Domain Modeling
- Result<T, E> パターンで エラーハンドリング
- 関数型設計（class不使用）
- 関数は純粋関数を基本

**NFR-07: ライセンスコンプライアンス**

- 使用する全ての外部リソースのライセンス遵守
- math.js（Apache 2.0）ライセンス表記

---

## 5. ディレクトリ構成と作成ファイル (Directory Structure & Files)

### 5.1. MVP実装時のディレクトリ構成

```
tiny-calc-v1/
├─ app/
│  ├─ layout.tsx                    # FR-07: Root layout
│  ├─ page.tsx                      # FR-06: Main page (Entry point)
│  ├─ globals.css                   # Tailwind styles + Terminal effects
│  ├─ _features/                    # Feature-based modules
│  │  └─ DisplayCalculator/
│  │     └─ index.tsx               # FR-06: Main calculator feature (Fixed Header + History)
│  ├─ _components/                  # Shared UI components
│  │  ├─ CalculatorInput.tsx        # FR-02: Input form component
│  │  ├─ CalculatorResult.tsx       # FR-03: Result display component
│  │  ├─ HistoryPanel.tsx           # FR-05: History list component
│  │  └─ ThemeTestComponent.tsx     # FR-08: Theme verification component (temporary)
│  ├─ _hooks/
│  │  └─ useCalculationHistory.ts   # FR-04b: History management hook
│  └─ favicon.ico
├─ utils/
│  ├─ types.ts                      # Global types (Result<T, E>)
│  ├─ constants.ts                  # Security allowlists
│  ├─ historyUtils.ts               # FR-04a: Pure logic for history management
│  ├─ historyUtils.test.ts          # Unit tests for history logic
│  ├─ evaluateExpression.ts         # FR-01: Expression evaluation logic
│  └─ evaluateExpression.test.ts    # Unit tests for FR-01
│
├─ components/                      # Global shared UI (if needed)
├─ public/
│  └─ og.png (1200x630px)
├─ Dockerfile                       # Cloud Run container definition
├─ .dockerignore                    # Docker ignore patterns
├─ cloudbuild.yaml                  # Cloud Build configuration (optional)
├─ package.json                     # + mathjs dependency
├─ next.config.js                   # output: 'standalone' for Cloud Run
├─ tailwind.config.ts               # Tailwind config with terminal theme
└─ tsconfig.json
```

---

## 6. デザインシステム (Design System)

### デザインコンセプト

**ターミナル風UI (Modern Terminal Theme)**

クラシックなターミナルエミュレータの美学を現代的に再解釈した、ミニマルで機能的なデザインを採用。

**UI要素:**

- ターミナルプロンプト表示 (`user@tiny-calc:~$` スタイル)
- モノスペースフォント (Fira Code)
- ASCII風ボーダーライン (`┌─┐│└┘`)
- 点滅カーソルアニメーション
- テキストグロー効果（オプション）

**note**: pタグは半角スペースの連続入力を省略するので、必要に応じpreタグを使用する。

### カラーモード対応

- **ライトモード**: 不要
- **ターミナルテーマ**: 必須（固定）
- **システム設定追従**: なし

### ターミナルテーマ - カラーパレット (Modern Terminal - Amber/Black)

**背景カラー**

- Background: `#0C0C0C` - ページ背景（ほぼ黒）
- Surface: `#1A1A1A` - カード・パネル背景（チャコール）
- Surface highlight: `#242424` - ホバー時の背景

**テキストカラー**

- Text primary: `#FFD700` - メインテキスト（ゴールド）
- Text secondary: `#FFA500` - サブテキスト（オレンジ）
- Text muted: `#CC8400` - 非アクティブテキスト
- Prompt: `#00D787` - プロンプト記号（シアングリーン）

**ボーダー・装飾**

- Border: `#FFA500` - 境界線（アンバー - dim）
- Border dim: `#CC8400` - 薄いボーダー
- Glow: `rgba(255, 215, 0, 0.3)` - テキストグロー効果

**セマンティックカラー**

- Success: `#5AF78E` - 成功状態、完了（ミントグリーン）
- Warning: `#FFA500` - 警告、注意（オレンジ）
- Error: `#FF6B6B` - エラー、削除（ソフトレッド）
- Info: `#00D787` - 情報、ヘルプ（シアングリーン）

**インタラクティブ要素**

- Interactive: `#FFD700` - クリック可能要素
- Interactive hover: `#FFED4E` - ホバー時
- Interactive active: `#FFA500` - アクティブ時

**コントラスト比**

- Text primary (#FFD700) / Background (#0C0C0C): 12.8:1（WCAG AAA準拠）
- Text secondary (#FFA500) / Background (#0C0C0C): 8.2:1（WCAG AAA準拠）
- Interactive elements: 4.5:1 以上

### フォント設定

**メインフォント: Fira Code**

```typescript
// layout.tsx
import { Fira_Code } from "next/font/google";

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});
```

**特性:**

- モノスペース（等幅）
- プログラミングリガチャ対応
- 優れた可読性
- ターミナル風の雰囲気

### ターミナルエフェクト (globals.css)

```css
/* Terminal-specific effects */
.terminal-text {
  text-shadow: 0 0 5px rgba(255, 215, 0, 0.2);
}

.terminal-border {
  border: 1px solid #ffa500;
  box-shadow: 0 0 10px rgba(255, 165, 0, 0.1);
}

.cursor {
  display: inline-block;
  width: 0.6rem;
  height: 1.2rem;
  background-color: #ffd700;
  animation: blink 1s step-end infinite;
}

/* ASCII Box Drawing Characters */
.box-corner-tl::before {
  content: "┌";
}
.box-corner-tr::before {
  content: "┐";
}
.box-corner-bl::before {
  content: "└";
}
.box-corner-br::before {
  content: "┘";
}
.box-line-h::before {
  content: "─";
}
.box-line-v::before {
  content: "│";
}
```

---

## 7. 画面設計 (Screen Design)

### 7.1. 画面一覧 (Screen List)

| No  | 画面名 | URLパス | 機能概要               | 備考       |
| --- | ------ | ------- | ---------------------- | ---------- |
| 001 | ホーム | `/`     | 式入力・計算・履歴管理 | メイン画面 |

### 7.2. 画面フロー図 (Screen Flow Diagram)

```
[ホーム画面]
  ├─ 固定ヘッダー (Fixed Header)
  │   ├─ 式入力プロンプト (CalculatorInput)
  │   └─ 最新の計算結果 (CalculatorResult)
  └─ スクロール履歴エリア (HistoryPanel)
```

**Note**: MVP段階では単一画面構成。画面フロー・ワイヤーフレームは簡易的な構成とする。

---

## 8. 外部リソース・ライセンス (External Resources & Licenses)

| リソース     | 用途                | ライセンス | クレジット表記                     |
| ------------ | ------------------- | ---------- | ---------------------------------- |
| math.js      | 数式評価エンジン    | Apache 2.0 | https://mathjs.org                 |
| Tailwind CSS | スタイリング        | MIT        | https://tailwindcss.com            |
| Next.js      | Reactフレームワーク | MIT        | https://nextjs.org                 |
| Fira Code    | フォント            | OFL 1.1    | https://github.com/tonsky/FiraCode |

**ライセンス表記場所**: `app/layout.tsx` footer または `public/LICENSE.txt`

---

## 9. MVP制約・スコープ

### MVPに含まれない機能

- ユーザー認証・アカウント管理
- クラウド同期（複数デバイス間）
- 計算式のテンプレート機能
- グラフ・チャート表示
- 複数通貨計算
- オフライン対応 (PWA)

### フェーズ2以降で検討

- 式の保存テンプレート
- 計算結果のエクスポート (CSV, JSON)
- 複数言語対応
- PWA化（オフライン対応）
- ダークモード/ライトモード切り替え
- ユーザー認証（Google ログイン）

---

## 10. Cloud Run デプロイ要件

### Dockerfile構成

```dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable pnpm && pnpm build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
```

### next.config.js 設定

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // Cloud Run用
};

module.exports = nextConfig;
```

### デプロイコマンド例

```bash
# Build Docker image
gcloud builds submit --tag gcr.io/PROJECT_ID/tiny-calc

# Deploy to Cloud Run
gcloud run deploy tiny-calc \
  --image gcr.io/PROJECT_ID/tiny-calc \
  --platform managed \
  --region asia-northeast1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1
```

### 環境要件

- Node.js 20+
- pnpm (corepack)
- Google Cloud SDK
- Docker (ローカルテスト用)

---

## 11. 備考・参考資料 (Notes & References)

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [math.js Documentation](https://mathjs.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Fira Code Font](https://github.com/tonsky/FiraCode)
- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Next.js Standalone Output](https://nextjs.org/docs/app/api-reference/next-config-js/output)
