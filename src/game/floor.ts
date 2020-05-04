import Phaser from 'phaser';
import * as AssetKeys from '../constants/asset-keys';
enum FloorType {
  Cliff,
  Platform,
  Ground
}

class Floor extends Phaser.GameObjects.Container {
  tileSprite;
  left;
  right;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    length: number,
    texture: string,
    rounder: boolean
  ) {
    super(scene, x, y);
    const centerLength = length - 2;

    var rect = new Phaser.Geom.Rectangle(0, 0, 64 * centerLength, 64);
    this.left = scene.add
      .image(-32, 0, AssetKeys.GrassLeft)
      .setScale(0.5)
      .setOrigin(1, 0.5);

    this.tileSprite = scene.add
      .tileSprite(
        this.left.x + this.left.displayWidth - 32,
        0,
        128 * centerLength,
        128,
        AssetKeys.GrassMid
      )
      .setScale(0.5)
      .setOrigin(0.5);

    this.right = scene.add
      .image(
        this.left.x +
          this.left.displayWidth +
          this.tileSprite.displayWidth -
          32,
        0,
        AssetKeys.GrassRight
      )
      .setScale(0.5)
      .setOrigin(0.5);

    this.add([this.left, this.tileSprite, this.right]);

    this.setSize(64 * length, 64);

    scene.add.existing(this);
    scene.physics.add.existing(this);
  }
}

export default Floor;
