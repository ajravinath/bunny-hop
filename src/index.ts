import Phaser from 'phaser';

import GameScene from './scenes/game';
import PreloadScene from './scenes/preload';
import TitleScreen from './scenes/title-screen';

import * as SceneKeys from './constants/scene-keys';
import GameOver from './scenes/game-over';
import CharacterSelect from './scenes/character-select';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { y: 200 }
    }
  },
  scene: [PreloadScene, GameOver],
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH,
    mode: Phaser.Scale.ScaleModes.NONE
  }
};

const game = new Phaser.Game(config);
window.game = game;

game.scene.add(SceneKeys.Game, GameScene);
game.scene.add(SceneKeys.TitleScreen, TitleScreen);
game.scene.add(SceneKeys.CharacterSelect, CharacterSelect);
