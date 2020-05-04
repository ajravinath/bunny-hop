import Phaser from 'phaser';

import { bhTealGray } from '../constants/colors';

class CharacterButton extends Phaser.GameObjects.Container {
  private padding: number;
  private paddingSide: number;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    contentTexture: string,
    onClick: () => void
  ) {
    super(scene, x, y);

    this.padding = 30;
    this.paddingSide = this.padding * 0.5;

    const content = scene.add
      .image(this.paddingSide, this.paddingSide, contentTexture)
      .setOrigin(0);

    var rect = new Phaser.Geom.Rectangle(
      0,
      0,
      content.width + this.padding,
      content.height + this.padding
    );

    const container = scene.add
      .graphics({
        x: 0,
        y: 0,
        fillStyle: {
          color: Phaser.Display.Color.HexStringToColor(bhTealGray).color
        }
      })
      .fillRoundedRect(rect.x, rect.y, rect.width, rect.height, 15);
    container.alpha = 0.3;

    this.add(container);
    this.add(content);

    this.setSize(rect.width, rect.height);

    /** https://github.com/photonstorm/phaser/issues/3722#issuecomment-393538541
     * Richard Davey wrote:
     * This is because the hit area shapes are centered on the Container. 
     * So in your code, you create a hit area rectangle that is 360 x 640, 
     * but the center of that rectangle is the Container x/y, 
     * which is why clicks only "work" in the top-left of your list view, 
     * because all of your children are positioned as if the Container x/y is the top-left.

     * To solve it you can do this in your measure function:
     * this.input.hitArea.x += this.w / 2;
     * this.input.hitArea.y += this.h / 2;
     */

    /**
     * move the Geom.Rect origin to top left by force, group / group child origin is always (0,0) top left
     */

    const hitArea = new Phaser.Geom.Rectangle(
      this.width / 2,
      this.height / 2,
      this.width,
      this.height
    );

    this.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains).on(
      Phaser.Input.Events.GAMEOBJECT_POINTER_OVER,
      function () {
        container.alpha = 0.5;
      },
      this
    );
    this.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains).on(
      Phaser.Input.Events.GAMEOBJECT_POINTER_OUT,
      function () {
        container.alpha = 0.3;
      },
      this
    );

    this.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains).on(
      Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN,
      onClick,
      this
    );
  }
}
export default CharacterButton;
