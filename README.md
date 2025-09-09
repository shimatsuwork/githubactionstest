# GitHub Actions on Kubernetes

KubernetesクラスターでGitHub Actions self-hosted runnerを動作させ、プルリクエストに対して自動チェックを実行するサンプル実装です。

## システム構成

```
Pull Request → GitHub Actions → Kubernetes Runner Pods → Test/Lint/Build → Result to PR
                                         ↑
                               Secret + RBAC + Namespace
```

## 全体の動作フロー

1. **プルリクエスト作成** → GitHubでワークフロートリガー
2. **GitHub Actions実行** → `.github/workflows/pr-check.yml`が開始
3. **Kubernetes Runner受信** → self-hosted runnerがジョブを取得
4. **CI/CD実行** → テスト・リント・ビルド・セキュリティスキャン
5. **結果返却** → GitHub APIでプルリクエストのステータス更新
6. **ステータス表示** → プルリクエストページにチェック結果表示

## ファイル構成と役割

### 🚀 GitHub Actions設定
- **`.github/workflows/pr-check.yml`** - メインワークフロー定義

### ☸️ Kubernetes設定
- **`k8s/namespace.yaml`** - GitHub Actions専用名前空間
- **`k8s/secret.yaml`** - GitHub認証情報（PAT + Repository URL）
- **`k8s/rbac.yaml`** - Runner用サービスアカウント・権限設定
- **`k8s/deployment.yaml`** - Runner Pod deployment設定

### 🛠️ サンプルアプリケーション
- **`src/index.js`** - Express.js APIサーバー（テスト対象）
- **`src/utils.js`** - ユーティリティ関数群
- **`__tests__/`** - Jest単体テスト・統合テスト
- **`package.json`** - Node.js依存関係・スクリプト定義

### ⚙️ 開発環境設定
- **`.eslintrc.js`** - ESLint静的解析ルール
- **`jest.config.js`** - Jestテスト設定
- **`webpack.config.js`** - ビルド設定
- **`.gitignore`** - 機密情報除外設定

## セットアップ手順

### 1️⃣ GitHub Personal Access Token作成
```bash
# GitHub → Settings → Developer settings → Personal access tokens
# 必要権限: repo, workflow
```

### 2️⃣ Kubernetes Secret設定
```bash
# Base64エンコード
echo -n 'your-github-token' | base64
echo -n 'https://github.com/your-username/your-repo' | base64

# k8s/secret.yamlを編集してエンコード値を設定
```

### 3️⃣ Kubernetesリソースデプロイ
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/rbac.yaml
kubectl apply -f k8s/deployment.yaml

# ステータス確認
kubectl get pods -n github-actions-runner
kubectl logs -f deployment/github-actions-runner -n github-actions-runner
```

### 4️⃣ Node.js依存関係インストール
```bash
npm install
```

### 5️⃣ 動作確認
```bash
npm test      # Jest単体テスト実行
npm run lint  # ESLint静的解析
npm run build # Webpack本番ビルド
npm start     # アプリケーション起動
```

## 実際の動作

### ワークフロー実行順序
1. **コードチェックアウト** - actions/checkout@v4
2. **Node.js環境構築** - actions/setup-node@v4 (Node 18)
3. **依存関係インストール** - npm install
4. **静的解析実行** - npm run lint (ESLint)
5. **単体テスト実行** - npm test (Jest)
6. **セキュリティスキャン** - npm audit
7. **本番ビルド** - npm run build (Webpack)
8. **ステータス更新** - actions/github-script@v7

### Runner Pod仕様
- **イメージ**: myoung34/github-runner:latest
- **レプリカ数**: 2台（並列処理対応）
- **ラベル**: self-hosted, kubernetes
- **リソース制限**: CPU 1000m, Memory 2Gi

## API仕様

### エンドポイント
- `GET /` - Hello World応答 + タイムスタンプ + バージョン
- `GET /health` - ヘルスチェック（status: healthy）
- `POST /api/data` - データ処理（nameパラメータ必須）

### テストカバレッジ
- ✅ 正常系レスポンステスト
- ✅ 異常系バリデーションテスト
- ✅ ユーティリティ関数テスト
- ✅ HTTPステータスコード検証

## セキュリティ対策

### 機密情報保護
- GitHub Personal Access Token → Kubernetes Secret（Base64）
- 環境変数 → .env* ファイルを.gitignore除外
- Docker socket → HostPath マウント（最小権限）

### RBAC権限
```yaml
# github-runner-service-account
- pods: get, list, create, delete
- deployments: get, list, create, update, delete
```

## トラブルシューティング

### Runner Pod起動失敗
```bash
kubectl describe pods -n github-actions-runner
kubectl logs -n github-actions-runner [pod-name]
```

### GitHub認証エラー
1. Personal Access Tokenの権限確認（repo, workflow）
2. Base64エンコード値の正確性確認
3. Repository URL形式確認

### リソース不足エラー
```bash
kubectl top nodes
kubectl top pods -n github-actions-runner
```

## カスタマイズ例

### Runner台数変更
```yaml
# k8s/deployment.yaml
spec:
  replicas: 3  # 2 → 3に変更
```

### 追加テストステップ
```yaml
# .github/workflows/pr-check.yml
- name: E2E Test
  run: npm run test:e2e
```

### リソース制限調整
```yaml
resources:
  requests:
    memory: "2Gi"    # 1Gi → 2Gi
    cpu: "1000m"     # 500m → 1000m
```

## ライセンス
MIT License

## 貢献
Pull Requestお待ちしています!
