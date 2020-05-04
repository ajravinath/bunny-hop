import Phaser from 'phaser';

import * as SceneKeys from '../constants/scene-keys';
import * as AssetKeys from '../constants/asset-keys';
import * as Colors from '../constants/colors';

import WebFontFile from '../loaders/web-font-file';

class GameOver extends Phaser.Scene {
  gameTitle;
  pressToStart;

  data: any;
  constructor() {
    super(SceneKeys.GameOver);
  }

  init(data) {
    this.data = data;
  }

  preload() {
    const fonts = new WebFontFile(this.load, AssetKeys.Lalezar);
    this.load.addFile(fonts);
  }

  create() {
    const anchorX = this.scale.width * 0.5;

    this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor(
      Colors.bhBlue
    );
    const titleStyles = {
      fontSize: 56,
      fontFamily: AssetKeys.Lalezar,
      color: Colors.bhPurple
    };

    this.gameTitle = this.add
      .text(anchorX, 100, 'Game Over', titleStyles)
      .setOrigin(0.5);

    this.anims.create({
      key: 'hurt',
      frames: [
        { key: AssetKeys.BunnyStand, frame: 1, duration: 1000 },
        { key: AssetKeys.BunnyHurt, frame: 1 }
      ],
      frameRate: 5,
      repeat: 0
    });

    this.add
      .sprite(anchorX, 300, AssetKeys.BunnyStand)
      .setOrigin(0.5)
      .play('hurt');

    const pressToStartStyles = {
      fontSize: 26,
      fontFamily: AssetKeys.Lalezar,
      color: Colors.bhPurple
    };

    this.pressToStart = this.add
      .text(anchorX, 480, 'Press  Space  to Play Again', pressToStartStyles)
      .setOrigin(0.5);

    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start(SceneKeys.Game, this.data);
    });
  }
}

export default GameOver;
