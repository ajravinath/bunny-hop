import Phaser from 'phaser';

import * as SceneKeys from '../constants/scene-keys';
import * as AssetKeys from '../constants/asset-keys';

import WebFontFile from './../loaders/web-font-file';
import * as Colors from '~/constants/colors';

class TitleScreen extends Phaser.Scene {
  gameTitle;
  pressToStart;
  constructor() {
    super(SceneKeys.TitleScreen);
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
      .text(anchorX, 120, 'Bunny Hop', titleStyles)
      .setOrigin(0.5);

    this.add.image(anchorX, 300, AssetKeys.BunnyCouple).setOrigin(0.5);

    const pressToStartStyles = {
      fontSize: 26,
      fontFamily: AssetKeys.Lalezar,
      color: Colors.bhPurple
    };

    this.pressToStart = this.add
      .text(anchorX, 480, 'Press  Space  to Start', pressToStartStyles)
      .setOrigin(0.5);

    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.transition({
        target: SceneKeys.CharacterSelect,
        duration: 500
      });
    });
  }
}

export default TitleScreen;
