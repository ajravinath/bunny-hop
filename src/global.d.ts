import Phaser from 'phaser';

declare global {
  interface Window {
    game: Phaser.Game;
  }
}
