/**
 * GitHub Actions on Kubernetes - Sample Express.js Application
 * 
 * このアプリケーションはKubernetes上のGitHub Actions self-hosted runnerで
 * 自動テスト・リント・ビルドが実行されることをデモンストレーションします。
 * 
 * 実行される検証:
 * - ESLint静的解析
 * - Jest単体テスト
 * - npm audit セキュリティスキャン
 * - Webpack本番ビルド
 * 
 * プルリクエスト作成時に.github/workflows/pr-check.ymlが
 * 自動実行され、結果がGitHubに反映されます。
 */

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// JSONリクエストボディの解析を有効化
app.use(express.json());

/**
 * ルートエンドポイント - 基本情報を返却
 * GitHub Actionsのテストで正常系レスポンステストされます
 */
app.get('/', (req, res) => {
  res.json({ 
    message: 'Hello World!', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

/**
 * ヘルスチェックエンドポイント
 * Kubernetes ProbeやCI/CDパイプラインで使用されます
 */
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

/**
 * データ処理API
 * バリデーション機能付き - nameパラメータ必須
 * GitHub Actionsで異常系テストも実行されます
 */
app.post('/api/data', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  res.json({ message: `Hello, ${name}!` });
});

// サーバー起動
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// テスト用にappとserverをエクスポート
module.exports = { app, server };
