import Phaser from 'phaser';
import CharacterButton from '../ui/character-button';
import WebFontFile from '~/loaders/web-font-file';

import * as SceneKeys from '../constants/scene-keys';
import * as AssetKeys from '../constants/asset-keys';
import * as Colors from '../constants/colors';

class CharacterSelect extends Phaser.Scene {
  gameTitle;
  pressToStart;
  selectedPlayer: number;

  constructor() {
    super(SceneKeys.CharacterSelect);
    this.selectedPlayer = 1;
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

    const character1SelectButton = new CharacterButton(
      this,
      220,
      190,
      AssetKeys.Player1,
      () => this.handlePlayerSelect(1)
    );
    this.add.existing(character1SelectButton);

    const character2SelectButton = new CharacterButton(
      this,
      420,
      190,
      AssetKeys.Player2,
      () => this.handlePlayerSelect(2)
    );
    this.add.existing(character2SelectButton);

    const pressToStartStyles = {
      fontSize: 26,
      fontFamily: AssetKeys.Lalezar,
      color: Colors.bhPurple
    };

    this.pressToStart = this.add
      .text(anchorX, 480, 'Select character to start', pressToStartStyles)
      .setOrigin(0.5);
  }

  handlePlayerSelect(player: number) {
    this.selectedPlayer = player;
    this.scene.transition({
      target: SceneKeys.Game,
      duration: 100,
      data: { player: this.selectedPlayer }
    });
  }
}

export default CharacterSelect;
