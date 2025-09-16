# 📘 Phaser Manager クラスまとめ

## 1. Managerの基本概念
- **Manager = リソースやインスタンスを一括管理する倉庫**
- 役割:
  1. 登録（load / create）
  2. 参照（get / exists）
  3. 共有（シーン間で使える）

👉 Sprite や Emitter のような個別インスタンスは、**Managerの在庫を参照して動く**

---

## 2. 主な Manager 一覧

### 🎨 TextureManager
- 管理対象: **画像, アトラス, スプライトシート**
- アクセス: `this.textures`
- 主なAPI:
  - `get(key)` → Texture を取得
  - `exists(key)` → 存在確認
  - `getFrame(key, frameName)` → フレーム取得
- 仕組み:
  - Sprite は自前で画像を持たず、TextureManager に登録された画像を参照する

---

### ✨ ParticleEmitterManager
- 管理対象: **粒子描画**
- アクセス: `this.add.particles(key)`
- 構造:
  - **Manager** = 粒子描画とテクスチャ保持
  - **Emitter** = 粒子放出ルール（速度・寿命など）
  - **Particle** = 実際の粒子（位置・速度・寿命を持つ）
- 主なAPI:
  - `createEmitter(config)` → Emitterを生成
  - `emitParticleAt(x, y)` → 任意位置で放出
- ポイント:
  - 描画は Manager がまとめて処理
  - Emitter はルールを管理するだけ

---

### 🎞️ AnimationManager
- 管理対象: **アニメーション定義**
- アクセス: `this.anims`
- 主なAPI:
  - `create(config)` → アニメーションを登録
  - `exists(key)` → 存在確認
  - `generateFrameNames(atlasKey, config)` → フレーム名リストを生成
- 仕組み:
  - アニメーション定義は Manager に1つ置けば、複数Spriteで共有できる

---

### 📦 CacheManager
- 管理対象: **非ビジュアルリソース（JSON, テキスト, シェーダーなど）**
- アクセス: `this.cache`
- 主なAPI:
  - `this.cache.json.add(key, data)`
  - `this.cache.json.get(key)`
- ポイント:
  - コンフィグや外部データを保持して再利用できる

---

## 3. 関係図

TextureManager (全画像を保持)
├── "player" (Texture)
│ └── Frame
├── "enemy" (Texture)
│ └── Frame
└── "particle" (Texture)
└── Frame

ParticleEmitterManager ("particle"を使用)
├── EmitterA (爆発)
│ └── Particle[], Particle[]...
├── EmitterB (雨)
│ └── Particle[], Particle[]...
└── EmitterC (煙)
└── Particle[]...

AnimationManager
├── "walk"
└── "attack"

CacheManager
├── JSON: config
└── Text: dialog


---

## 4. ベストプラクティス
1. **ロードや生成は一度だけ**（Managerに登録すれば全シーンで共有可能）
2. **インスタンスは参照するだけ**（Sprite, Emitterは使い回し）
3. **存在確認をしてからロード**（`exists` を活用）
4. **プール利用時は状態リセットのみ**（TextureやEmitterを作り直さない）
5. **アニメーション定義は Manager にまとめる**（コード重複を避ける）

---
