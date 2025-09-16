# 4 State Management学習ノート

## 概要

このプロジェクトでは、Phaserを利用して、ステート管理やボタンについて学びました

## 学習内容

- **シーン管理:**
  - `TitleScene`、`GameScene`、`GameOverScene` の3つのシーンを作成し、ゲームの状態（タイトル、ゲーム中、ゲームオーバー）を分離しました。
  - `this.scene.start('SceneName')` を使用して、特定のイベント（例: ボタンクリック、衝突検知）に応じてシーンを切り替える方法を学びました。

- **シーン間のデータ受け渡し:**
  - ゲームオーバー時に `GameScene` から `GameOverScene` へスコアを渡すため、`this.scene.start('GameOverScene', { score: this.score })` のように第二引数にデータを設定しました。
  - `GameOverScene` の `init(data)` メソッド内で渡されたデータ `data.score` を受け取り、画面に表示する方法を学びました。

- **カスタムUIコンポーネント:**
  - `Phaser.GameObjects.Rectangle` を継承して、再利用可能な `Button` クラスを作成しました。
  - このクラスは、見た目の描画、テキストの表示、`setInteractive()` を使ったインタラクションの有効化、クリックイベントの処理をカプセル化しています。

- **クラスベースのオブジェクト:**
  - `Phaser.Physics.Arcade.Sprite` を継承して `Player` と `Enemy` クラスを作成し、それぞれの振る舞い（移動ロジックなど）をクラス内にまとめました。