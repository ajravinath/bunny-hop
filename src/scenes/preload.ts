import Phaser from 'phaser';
import * as SceneKeys from '../constants/scene-keys';
import * as AssetKeys from '../constants/asset-keys';
import WebFontFile from '~/loaders/web-font-file';

class Preload extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Preload);
  }

  preload() {
    /* ui */
    this.load.image(AssetKeys.BunnyCouple, 'images/bunny_couple.png');
    this.load.image(AssetKeys.Player1, 'images/bunny1_stand.png');
    this.load.image(AssetKeys.Player2, 'images/bunny2_stand.png');

    /* background */
    this.load.image(AssetKeys.Background, 'images/bg_layer1.png');

    /* object */
    this.load.image(AssetKeys.Carrot, 'images/carrot.png');

    /* ground */
    this.load.image(AssetKeys.GrassMid, 'images/grass-mid.png');
    this.load.image(AssetKeys.GrassLeft, 'images/grass-left.png');
    this.load.image(AssetKeys.GrassRight, 'images/grass-right.png');
    this.load.image(AssetKeys.Platform, 'images/ground_grass.png');

    /* HUD */
    this.load.image(AssetKeys.HUDCarrots, 'images/hud_carrots.png');

    /* sound */
    this.load.audio(AssetKeys.Jump, 'audio/phaseJump1.ogg');

    /* font */
    const fonts = new WebFontFile(this.load, AssetKeys.Lalezar);
    this.load.addFile(fonts);
  }

  create() {
    this.scene.start(SceneKeys.TitleScreen);
  }
}

export default Preload;
