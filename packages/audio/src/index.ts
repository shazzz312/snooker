import { Howl } from 'howler';

export class AudioManager {
  private ambientSound: Howl | null = null;

  constructor() {
    // constructor setup
  }

  /**
   * Initializes looping ambient soundscapes.
   * Plays a single track representing distant city sounds, murmurs, and clinking glasses.
   * @param src - URL or path to the ambient sound audio file
   */
  public initAmbientSounds(src: string): void {
    if (this.ambientSound) {
      this.ambientSound.stop();
    }

    this.ambientSound = new Howl({
      src: [src],
      loop: true,
      volume: 0.5,
    });

    this.ambientSound.play();
  }

  /**
   * Calculates the volume and plays an impact sound based on collision velocity.
   * @param velocity - The collision velocity from the physics engine
   * @param src - URL or path to the impact sound audio file
   */
  public playImpactSound(velocity: number, src: string): void {
    // Example calculation: scale velocity to a volume between 0 and 1
    // Assuming a max reasonable velocity of 20 for scaling purposes
    let volume = velocity / 20;

    // Clamp volume between 0 and 1
    volume = Math.max(0, Math.min(volume, 1));

    // Only play if volume is somewhat significant
    if (volume > 0.05) {
      const impactHowl = new Howl({
        src: [src],
        volume: volume,
      });

      impactHowl.play();
    }
  }

  /**
   * Stops ambient sound if needed.
   */
  public stopAmbientSounds(): void {
    if (this.ambientSound) {
      this.ambientSound.stop();
    }
  }
}
