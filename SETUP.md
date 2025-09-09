# GitHub Actions on Kubernetes セットアップ

このプロジェクトは、KubernetesクラスターでGitHub Actions self-hosted runnerを動作させ、プルリクエストに対して自動チェックを実行するサンプル実装です。

## 構成

```
.
├── .github/workflows/
│   └── pr-check.yml          # GitHub Actionsワークフロー定義
├── k8s/
│   ├── namespace.yaml        # Kubernetes名前空間
│   ├── secret.yaml           # GitHub認証情報
│   ├── rbac.yaml            # RBAC設定
│   └── deployment.yaml       # Runner deployment設定
├── src/
│   ├── index.js             # サンプルアプリケーション
│   └── utils.js             # ユーティリティ関数
├── __tests__/               # テストファイル
└── package.json             # Node.js依存関係
```

## セットアップ手順

### 1. GitHub Personal Access Token の作成

1. GitHub > Settings > Developer settings > Personal access tokens > Tokens (classic)
2. 新しいトークンを作成（repo権限が必要）
3. トークンをコピーして保存

### 2. Kubernetes Secretの設定

```bash
# GitHubトークンをBase64エンコード
echo -n 'your-github-token' | base64

# リポジトリURLをBase64エンコード
echo -n 'https://github.com/your-username/your-repo' | base64
```

`k8s/secret.yaml`のGITHUB_TOKENとREPO_URLを上記の値で更新してください。

### 3. Kubernetesリソースのデプロイ

```bash
# 名前空間の作成
kubectl apply -f k8s/namespace.yaml

# Secret、RBAC、Deploymentの適用
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/rbac.yaml
kubectl apply -f k8s/deployment.yaml

# デプロイメント状況の確認
kubectl get pods -n github-actions-runner
```

### 4. Node.js依存関係のインストール

```bash
npm install

# 追加でSuperTestをインストール（テスト用）
npm install --save-dev supertest
```

### 5. 動作確認

```bash
# ローカルでのテスト実行
npm test

# リンター実行
npm run lint

# ビルド実行
npm run build

# アプリケーション起動
npm start
```

## GitHub Actions ワークフロー

`.github/workflows/pr-check.yml`で定義されているワークフローは以下を実行します：

1. **コードのチェックアウト**
2. **Node.js環境のセットアップ**
3. **依存関係のインストール**
4. **ESLintによる静的解析**
5. **Jestによる単体テスト**
6. **npm auditによるセキュリティスキャン**
7. **アプリケーションのビルド**
8. **プルリクエストのステータス更新**

## 使用方法

1. このリポジトリをGitHubにプッシュ
2. 新しいブランチを作成してコード変更
3. プルリクエストを作成
4. GitHub ActionsがKubernetes上のself-hosted runnerで自動実行
5. 結果がプルリクエストに反映される

## トラブルシューティング

### Runner Podが起動しない場合

```bash
# Pod状態の確認
kubectl describe pods -n github-actions-runner

# ログの確認
kubectl logs -f deployment/github-actions-runner -n github-actions-runner
```

### GitHub認証エラーの場合

1. Personal Access Tokenの権限を確認
2. Secret.yamlの値が正しくBase64エンコードされているか確認
3. リポジトリURLが正確か確認

### Docker socket エラーの場合

Kubernetesノードで`/var/run/docker.sock`が利用可能か確認してください。

## カスタマイズ

- Runnerの数を変更：`k8s/deployment.yaml`のreplicasを調整
- リソース制限の変更：`resources`セクションを調整
- 追加のワークフローステップ：`.github/workflows/pr-check.yml`を編集

## セキュリティ考慮事項

- Personal Access Tokenは最小権限で作成
- Kubernetes SecretはBase64エンコードのみ（暗号化推奨）
- ネットワークポリシーの設定を検討
- Docker socketの共有に注意