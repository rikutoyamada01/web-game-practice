# 3_phaser_game 学習ノート

## 概要

このプロジェクトでは、JavaScriptのCanvas APIを直接操作する代わりに、Phaser 3ゲームフレームワークを導入し、さらにモダンな開発ワークフローを確立するためにParcelバンドラを活用する方法について学習しました。

## 学習内容

### 1. Phaser 3 フレームワークの基本

*   **Phaserの導入**: `npm install phaser` を使用してプロジェクトにPhaserを組み込みました。
*   **ゲームの初期化**: `Phaser.Game` クラスと `Phaser.Types.Core.GameConfig` オブジェクトを使用して、ゲームの基本的な設定（レンダラーの種類、画面サイズ、物理エンジンなど）を行う方法を学びました。
*   **シーン (`Phaser.Scene`)**: Phaserゲームがシーン（画面）単位で構成されることを理解しました。各シーンは以下の主要なライフサイクルメソッドを持ちます。
    *   `constructor()`: シーンの初期設定。
    *   `preload()`: アセット（画像、音声など）の読み込み。今回はグラフィックプリミティブを使用したため、明示的なアセット読み込みは行いませんでした。
    *   `create()`: シーンが開始されたときに一度だけ実行され、ゲームオブジェクトの作成や初期配置を行います。
    *   `update()`: ゲームループとして機能し、毎フレーム実行されるロジック（プレイヤーの動き、当たり判定など）を記述します。
*   **ゲームオブジェクト**: `this.add.graphics()` を使用して円形のプレイヤーとボールを作成し、`this.add.text()` でテキストを表示する方法を学びました。
*   **物理エンジン**: PhaserのArcade物理エンジンを有効にし、`this.physics.world.enable()` でオブジェクトに物理ボディを追加しました。`setCircle()` で円形の物理ボディを設定し、`setBounce()` で跳ね返り、`setCollideWorldBounds()` で画面端との衝突、`setVelocity()` で速度を設定する方法を学びました。
*   **衝突判定**: `this.physics.add.collider()` を使用して、プレイヤーとボール間の衝突を簡単に検出・処理する方法を学びました。衝突時に`gameOver()`メソッドを呼び出すことで、ゲームオーバー状態を実装しました。
*   **入力処理**: `this.input.on('pointermove', ...)` を使用して、マウスの動きにプレイヤーを追従させる方法を学びました。
*   **ゲームループの抽象化**: Phaserが内部でゲームループを管理するため、`requestAnimationFrame` を手動で記述する必要がないことを理解しました。

### 2. Parcel バンドラの活用

*   **Parcelの導入**: `npm install --save-dev parcel` を使用して開発環境にParcelを導入しました。
*   **設定不要のビルド**: Parcelが`index.html`をエントリーポイントとして指定するだけで、TypeScriptのコンパイル、モジュールの解決、開発サーバーの起動、ホットリロードなどを自動的に処理してくれることを体験しました。
*   **`package.json`スクリプトの簡素化**: `npm start` や `npm run build` コマンドをParcelに置き換えることで、開発ワークフローが大幅に簡素化されました。
*   **`index.html`の簡素化**: `phaser.min.js`のCDN読み込みや、コンパイル後の`dist`ディレクトリ内のJavaScriptファイルを直接参照する必要がなくなり、元のTypeScriptファイルを直接参照するだけでよくなりました。
*   **`tsconfig.json`の簡素化**: ParcelがTypeScriptのコンパイルを内部で処理するため、`tsconfig.json`の設定を最小限に抑えることができました。
