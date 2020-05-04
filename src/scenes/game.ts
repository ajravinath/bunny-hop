import Phaser from 'phaser';
import * as SceneKeys from '../constants/scene-keys';
import * as AssetKeys from '../constants/asset-keys';
import Carrot from '~/game/carrot';
import Floor from './../game/floor';
class Game extends Phaser.Scene {
  private dead: boolean = false;
  bunny?: Phaser.Physics.Arcade.Sprite;
  platforms?: Phaser.Physics.Arcade.Group;
  carrots?: Phaser.Physics.Arcade.Group;
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys;

  collectedCarrotsLabel;
  carrotsCollected;
  carrotsDropped;

  playerCharacter: number;

  prevX;
  prevY;

  constructor() {
    super(SceneKeys.Game);
    this.playerCharacter = 1;
  }

  init(data) {
    this.carrotsCollected = 0;
    this.carrotsDropped = 0;
    this.dead = false;
    this.playerCharacter = data.player;
  }

  preload() {
    this.load.image(
      AssetKeys.BunnyStand,
      `images/bunny${this.playerCharacter}_stand.png`
    );
    this.load.image(
      AssetKeys.BunnyJump,
      `images/bunny${this.playerCharacter}_jump.png`
    );
    this.load.image(
      AssetKeys.BunnyReady,
      `images/bunny${this.playerCharacter}_ready.png`
    );
    this.load.image(
      AssetKeys.BunnyHurt,
      `images/bunny${this.playerCharacter}_hurt.png`
    );
    this.load.image(
      AssetKeys.BunnyWalk1,
      `images/bunny${this.playerCharacter}_walk1.png`
    );
    this.load.image(
      AssetKeys.BunnyWalk2,
      `images/bunny${this.playerCharacter}_walk2.png`
    );

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    this.add.image(240, 320, AssetKeys.Background).setScrollFactor(0);

    this.platforms = this.physics.add.group();
    // this.platforms = this.physics.add.staticGroup();

    this.prevX = 0;
    this.prevY = 0;
    for (let index = 0; index < 5; ++index) {
      const x = this.prevX + Phaser.Math.Between(200, 360);
      this.prevX = x;
      const y = 600 - 100 * index;
      this.prevY = y;

      const platform = new Floor(this, x, y, 3, '', false);
      this.platforms.add(platform);

      /**
       * not ideal, should have used Static Bodies but it seems pretty hard to achieve,
       * where static body container moves around and it does not update its bounds
       * it does
       */
      (platform.body as Phaser.Physics.Arcade.Body).allowGravity = false;
      (platform.body as Phaser.Physics.Arcade.Body).immovable = true;

      // const platform: Phaser.Physics.Arcade.Sprite = this.platforms
      //   .create(x, y, AssetKeys.Platform)
      //   .setOrigin(0.5);
      // platform.setScale(0.5);
      // (platform.body as Phaser.Physics.Arcade.StaticBody).updateFromGameObject();
    }

    this.bunny = this.physics.add
      .sprite(240, 320, AssetKeys.BunnyStand)
      .setOrigin(0.5)
      .setScale(0.5)
      .setDepth(1);
    // bunny.body.allow = false;
    this.bunny.setDamping(true);

    this.physics.add.collider(this.bunny, this.platforms);

    this.bunny.body.checkCollision.up = false;
    this.bunny.body.checkCollision.right = false;
    this.bunny.body.checkCollision.left = false;

    this.cameras.main.startFollow(this.bunny, false);
    this.cameras.main.followOffset.set(
      -this.scale.width * 0.32,
      this.scale.height * 0.1
    );
    // this.cameras.main.setLerp(1, 1); /* when you set lerp with round pixels true it will cause jitter */
    // this.cameras.main.setDeadzone(1, this.scale.height * 0.5);

    this.carrots = this.physics.add.group({ classType: Carrot });

    this.physics.add.collider(this.carrots, this.platforms);

    this.physics.add.overlap(
      this.bunny,
      this.carrots,
      this.handleCollectCarrot,
      undefined,
      this
    );

    const style = {
      color: '#000',
      fontSize: 24,
      fontFamily: AssetKeys.Lalezar
    };

    this.add
      .image(40, 25, AssetKeys.HUDCarrots)
      .setOrigin(1, 0.5)
      .setScale(0.5)
      .setScrollFactor(0);
    this.collectedCarrotsLabel = this.add
      .text(40, 25, ' x 0', style)
      .setScrollFactor(0)
      .setOrigin(0, 0.5)
      .setDepth(1);

    this.anims.create({
      key: 'jump',
      frames: [
        { key: AssetKeys.BunnyStand, frame: 1 },
        { key: AssetKeys.BunnyReady, frame: 1 },
        { key: AssetKeys.BunnyJump, frame: 1 }
      ]
    });
    this.anims.create({
      key: 'walk',
      frames: [
        { key: AssetKeys.BunnyWalk1, frame: 1, duration: 80 },
        { key: AssetKeys.BunnyWalk2, frame: 1, duration: 80 }
      ],
      repeat: -1
      // frameRate: 5
      /* this framerate causes vertical jitter in camera,
      /* as a workaround using duration; not ideal but sigh :/ */
    });

    // this.debug();
  }

  debug() {
    if (this.game.config.physics.arcade?.debug) {
      let graphics = this.add.graphics().setScrollFactor(0);
      graphics.lineStyle(2, 0x00ff00, 1);
      graphics.fillCircle(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        10
      );
      this.add
        .text(
          200,
          100,
          `${this.cameras.main.centerX} ${this.cameras.main.centerY}`,
          { fontSize: 20 }
        )
        .setScrollFactor(0);
      if (this.cameras.main.deadzone) {
        graphics.strokeRect(
          this.cameras.main.centerX - this.cameras.main.deadzone.width / 2,
          this.cameras.main.centerY - this.cameras.main.deadzone.height / 2,
          this.cameras.main.deadzone.width,
          this.cameras.main.deadzone.height
        );
      }
    }
  }

  update() {
    if (!this.dead) {
      const scrollY = this.cameras.main.scrollY;
      const scrollX = this.cameras.main.scrollX;

      const bunny = this.bunny as Phaser.Physics.Arcade.Sprite;
      const carrots = this.carrots as Phaser.Physics.Arcade.Group;
      const platforms = this.platforms as Phaser.Physics.Arcade.Group;

      platforms.children.each(child => {
        const platform = child as Phaser.Physics.Arcade.Sprite;
        if (platform.x <= scrollX - this.scale.width * 0.3) {
          platform.x = this.prevX + Phaser.Math.Between(250, 300);
          platform.y = this.prevY - Phaser.Math.Between(100, 120);
          this.prevX = platform.x;
          this.prevY = platform.y;

          // (platform.body as Phaser.Physics.Arcade.StaticBody).updateFromGameObject();

          this.addCarrotAbove(platform);
        }
      });

      carrots.children.iterate(child => {
        const carrot = child as Carrot;
        if (carrot.x <= scrollX - this.scale.width * 0.3) {
          if (carrot.visible) {
            this.carrotsDropped++;
            this.collectedCarrotsLabel.text = ` x ${this.carrotsCollected}`;
            // this.collectedCarrotsLabel.text = `x ${this.carrotsCollected}/${
            //   this.carrotsDropped + this.carrotsCollected
            // }`;
            carrots.killAndHide(carrot);
            this.physics.world.disableBody(carrot.body);
          }
        }
      });

      /* there is a bug here as we cannot use blocked down, player can jump on carrots */
      const isTouchingPlatform = bunny.body.touching.down;
      // const isTouchingPlatform = bunny.body.blocked.down; /* blocked for static bodies, */

      if (this.cursors?.up?.isDown && isTouchingPlatform) {
        console.log('jump');
        this.sound.play(AssetKeys.Jump);
        bunny.setVelocityY(-300);
      }
      if (this.cursors?.left?.isDown && isTouchingPlatform) {
        console.log('left');

        bunny.setFlipX(true);
        bunny.anims.play('walk', true);
        bunny.setVelocityX(-150);
      } else if (this.cursors?.right?.isDown && isTouchingPlatform) {
        bunny.setFlipX(false);
        bunny.anims.play('walk', true);
        bunny.setVelocityX(+150);
      } else {
        bunny.anims.stop();
        if (isTouchingPlatform) {
          bunny.setDragX(1);
          bunny.setVelocityX(0);
        } else {
          bunny.setDragX(0.995);
        }

        if (bunny.body.velocity.y >= 0) {
          if (bunny.texture.key !== AssetKeys.BunnyStand) {
            bunny.setTexture(AssetKeys.BunnyStand);
          }
        } else if (bunny.texture.key !== AssetKeys.BunnyJump) {
          bunny.setTexture(AssetKeys.BunnyJump);
        }
      }

      // this.horizontalWrap(bunny);

      const lowestPlatform = this.findBottomMostPlatform();
      if (bunny.y > lowestPlatform.y) {
        this.dead = true;
      }
    } else {
      this.scene.transition({
        target: SceneKeys.GameOver,
        duration: 1000,
        data: { player: this.playerCharacter }
      });
    }
  }

  horizontalWrap(sprite: Phaser.GameObjects.Sprite) {
    const halfWidth = sprite.width * 0.5;
    const gameWidth = this.scale.width;
    if (sprite.x < -halfWidth) {
      sprite.x = gameWidth + halfWidth;
    } else if (sprite.x > gameWidth + halfWidth) {
      sprite.x = -halfWidth;
    }
  }

  addCarrotAbove(sprite: Phaser.GameObjects.Sprite) {
    const carrotX = sprite.x;
    const carrotY = sprite.y - sprite.displayHeight;

    const carrot: Phaser.Physics.Arcade.Sprite = this.carrots?.get(
      carrotX,
      carrotY,
      AssetKeys.Carrot
    );

    carrot.setActive(true);
    carrot.setVisible(true);

    this.add.existing(carrot);
    carrot.body.setSize(carrot.width, carrot.height);

    this.physics.world.enable(carrot);

    return carrot;
  }

  handleCollectCarrot({}, overlapCarrot: Phaser.GameObjects.GameObject) {
    const carrot = overlapCarrot as Carrot;
    this.carrots?.killAndHide(carrot);
    this.physics.world.disableBody(carrot.body);
    this.carrotsCollected++;
    this.collectedCarrotsLabel.text = ` x ${this.carrotsCollected}`;
    // this.collectedCarrotsLabel.text = `Carrots: ${this.carrotsCollected}/${
    //   this.carrotsDropped + this.carrotsCollected
    // }`;
  }

  findBottomMostPlatform() {
    const platformsList = this.platforms?.getChildren() as Phaser.Physics.Arcade.Sprite[];
    let lowestPlatformY = platformsList[0];
    for (let index = 0; index < platformsList.length; index++) {
      const element = platformsList[index];
      if (element.y > lowestPlatformY.y) {
        lowestPlatformY = element;
      }
    }
    return lowestPlatformY;
  }
}

export default Game;
