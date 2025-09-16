# ゲーム開発規約 (Game Development Guidelines)

## 1. 基本理念 (Core Philosophy)

このドキュメントは、保守性、拡張性、そしてパフォーマンスに優れた高品質なゲームを開発するための絶対的な規約を定めるものである。

すべてのコードは、以下の3つの理念に基づかなければならない：

- **関心の分離 (Separation of Concerns):** 各コードは単一の責任を持つべきである。
- **コンポーネント設計 (Component-Based Design):** すべての要素は再利用可能な部品として設計されるべきである。
- **パフォーマンス第一 (Performance First):** ユーザー体験を損なう非効率なコードは許容されない。

## 2. 命名規則 (Naming Conventions)

| 対象 | 形式 | 例 | 備考 |
|:---|:---|:---|:---|
| ファイル | `kebab-case.ts` | `play-scene.ts`, `player-character.ts` | すべて小文字 |
| クラス | `PascalCase` | `PlayScene`, `PlayerCharacter` | |
| メソッド / 関数 | `camelCase` | `createPlayer`, `handleInput` | |
| 変数 / プロパティ | `camelCase` | `playerSpeed`, `isJumping` | |
| 定数 | `UPPER_SNAKE_CASE` | `MAX_ENEMIES`, `PLAYER_SPEED` | ファイルの先頭で定義 |
| Phaser Sceneキー | `PascalCase` | `this.scene.start('PlayScene')` | シーンクラス名と一致させる |

## 3. ディレクトリ構成 (Directory Structure)

プロジェクトは以下の構造を厳守すること。

```
/src
├── /scenes/         # ゲームシーン (PlayScene.ts, UIScene.ts)
├── /objects/        # ゲームオブジェクトのクラス (Player.ts, Enemy.ts, Bullet.ts)
├── /ui/             # UIコンポーネントのクラス (Button.ts, ScoreLabel.ts)
├── /assets/         # 画像、音声、タイルマップなどの元ファイル
│   ├── /images/
│   └── /audio/
├── /services/       # サーバー通信など、ゲームロジックではない外部サービス
├── /types/          # グローバルなTypeScriptの型定義
└── main.ts          # PhaserのGameConfigとゲームの起動処理
```

## 4. アーキテクチャ原則 (Architectural Principles)

### 4.1. シーンによる状態管理

- **単一責任:** 1つのシーンは1つのゲーム状態（Preload, MainMenu, Play, GameOver）のみを管理する。
- **データ受け渡し:** シーン間のデータ受け渡しは `this.scene.start('SceneKey', data)` の `data` 引数のみを使用する。グローバル変数での状態共有は原則禁止。
- **UIの分離:** UIは `UIScene` として独立させ、`this.scene.launch('UIScene')` でゲームプレイシーンと並行起動する。これにより、ゲームロジックと描画ロジックを完全に分離する。

### 4.2. オブジェクト指向とコンポーネント化

- **クラス化の徹底:** プレイヤー、敵、弾など、ゲームに登場するすべての動的要素は `Phaser.Physics.Arcade.Sprite` などを継承したクラスとして定義する。
- **カプセル化:** オブジェクトのデータ（プロパティ）と振る舞い（メソッド）は、そのオブジェクトのクラス内に完全にカプセル化する。外部のManagerクラスがオブジェクトを操作するような設計は禁止。
- **コンストラクタの役割:** `constructor` では依存性の注入とプロパティの初期化のみを行い、オブジェクトの生成（スプライトの追加など）は `create` や `add` のような専用メソッドで行う。

### 4.3. パフォーマンス最適化

- **オブジェクトプーリングの義務化:** 弾、エフェクト、コインなど、頻繁に生成・破棄される可能性のあるオブジェクトは、すべて `Phaser.GameObjects.Group` を使ってプーリングする。ゲームプレイ中に `new` や `destroy` を直接呼び出すことは原則禁止。
- **アセットの事前読み込み:** すべてのアセットは、ゲーム開始前の専用の `PreloadScene` で完全に読み込むこと。これにより、ゲーム中のカクつきを防ぐ。

## 5. コーディングスタイル (Coding Style)

- **TypeScriptの厳格な利用:** すべてのコードはTypeScriptで記述する。`any` 型の使用は、それが不可避である理由をコメントで説明できる場合を除き、固く禁止する。
- **マジックナンバーの禁止:** コード内に直接記述された意味不明な数値（マジックナンバー）は禁止。`const PLAYER_SPEED = 200;` のように、すべて定数として定義する。
- **コメント:** コードは「何をしているか」が読めばわかるように書く。コメントは、なぜその複雑な、あるいは一見して非自明な実装方法を選んだのかという「理由」を説明するためにのみ使用する。

## 6. Git利用規約 (Git Usage Rules)

- **コミット粒度:** 1つのコミットは1つの論理的な変更のみを含むこと。「UIの修正とバグ修正」のような複数の変更を1つのコミットに含めない。
- **コミットメッセージ:** `feat: プレイヤーのジャンプ機能を追加` や `fix: 衝突判定のバグを修正` のように、変更の種類（`feat`, `fix`, `refactor`など）をプレフィックスとして付ける。
- **ブランチ戦略:** `main` ブランチは常に安定版とする。機能開発は必ず専用のブランチ（例: `feature/player-jump`）で行い、完了後に `main` にマージする。

## 7. 有名な躓きポイントと解決策 (Common Pitfalls & Solutions)

以下のパターンはPhaser開発で陥りがちなアンチパターンである。これらを避け、常に「Phaser流の解決策」を実践すること。

### 7.1. 巨大なManagerクラスやグローバル変数の利用

ゲーム全体の状態を単一の`GameManager`クラスやグローバル変数で管理するパターン。

> **なぜ問題か？**
> コードの追跡が困難になり、デバッグを悪化させる。シーンの独立性が失われ、再利用性やテスト性が著しく低下する。

> **Phaser流の解決策**
> - **シーン間のデータ共有:** `this.scene.start('SceneKey', data)` で次のシーンにデータを渡す。
> - **シーンをまたぐデータ:** `this.registry.set('key', value)` を利用する。レジストリはシーンをまたいでデータを保持するためのPhaserの公式な仕組みである。

### 7.2. 物理オブジェクトの座標(x, y)の直接操作

物理エンジンを適用したオブジェクトに対し、`update`ループ内で `sprite.x += 1` のように座標を直接書き換えるパターン。

> **なぜ問題か？**
> 物理シミュレーションと処理が競合し、オブジェクトが壁をすり抜けたり、震えたりする原因になる。

> **Phaser流の解決策**
> - オブジェクトの `body` に対して速度や力を与えることで操作する。
>   - `player.body.setVelocityX(200);`
>   - `player.body.setAccelerationX(100);`

### 7.3. オブジェクトプーリングの無視

弾やエフェクトなどを、その都度 `new` で生成し `destroy()` で破棄するパターン。

> **なぜ問題か？**
> JavaScriptのガベージコレクションが頻発し、ゲームが一瞬停止する「カクつき」の主な原因となる。

> **Phaser流の解決策**
> - `Phaser.GameObjects.Group` をオブジェクトプールとして利用する。`group.get()` で取得し、`setActive(false).setVisible(false)` でプールに戻すサイクルを徹底する。

### 7.4. コールバック関数内での `this` の喪失

当たり判定のコールバックなどで、`this` がシーンを指さずに `undefined` となるパターン。

> **なぜ問題か？**
> `this.scene` や `this.add` など、シーンが持つプロパティやメソッドにアクセスできず、エラーが発生する。

> **Phaser流の解決策**
> - **コンテキスト引数の利用:** `this.physics.add.collider(player, enemy, callback, undefined, this);` のように、最後の引数に `this` を渡してコンテキストを束縛する。
> - **アロー関数の利用:** `this.physics.add.collider(player, enemy, () => { this.gameOver(); });` のようにアロー関数を使えば、`this` は自動的に引き継がれる。

### 7.5. シーンのライフサイクルへの無理解

アセットを不適切なタイミングで読み込んだり、シーン終了時にリソースをクリーンアップしなかったりするパターン。

> **なぜ問題か？**
> ゲームのフリーズや、メモリリークによるパフォーマンスの低下を引き起こす。

> **Phaser流の解決策**
> - **`preload()`:** アセットの読み込みは、専用の`PreloadScene`の`preload`メソッドで行う。
> - **`shutdown()`:** シーンが停止する際に呼ばれる。`create`で登録したカスタムイベントリスナーの解除やBGMの停止などは、ここで行うことでメモリリークを防ぐ。