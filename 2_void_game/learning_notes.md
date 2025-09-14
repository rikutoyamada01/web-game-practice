# 2_void_game 学習ノート

## 概要

このプロジェクトでは、JavaScriptのCanvas APIを使用してシンプルなゲームを実装し、特に以下の概念について学習しました。

## 学習内容

### 1. Canvas APIの基本

*   `HTMLCanvasElement` と `CanvasRenderingContext2D` の取得方法。
*   `ctx.beginPath()`, `ctx.arc()`, `ctx.closePath()`, `ctx.fillStyle`, `ctx.fill()` を使った円の描画。
*   `ctx.clearRect()` や `ctx.fillRect()` を使った画面のクリアと描画。
*   `requestAnimationFrame` を利用したゲームループの実装。

### 2. オブジェクト指向プログラミング (OOP)

*   `Player` クラスと `Ball` クラスを定義し、それぞれのオブジェクトの状態（位置、速度、半径など）と振る舞い（描画、更新、衝突判定）をカプセル化しました。
*   クラスのプロパティとメソッドの定義方法を学びました。

### 3. 衝突判定 (Collision Detection)

*   `Player` と `Ball` の間で円と円の衝突判定を実装しました。
*   2つの円の中心間の距離が、それぞれの半径の合計よりも小さい場合に衝突と判断する数学的なロジック (`squaredDistance < (this.radius + ball.radius) ** 2`) を理解しました。
*   平方根の計算を避けるために、距離の二乗で比較することでパフォーマンスを向上させるテクニックを学びました。

### 4. ゲームロジックの基本

*   ボールの移動、壁との衝突時の跳ね返り処理。
*   重力 (`this.vy += 0.25`) のような物理演算の簡易的な実装。
*   プレイヤーがマウスに追従する動きの実装。
*   ゲームオーバー条件の判定と表示。
