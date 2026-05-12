import { AudioManager } from '../src/index';

// Mock howler
jest.mock('howler', () => {
  const mHowl = {
    play: jest.fn(),
    stop: jest.fn(),
  };
  return { Howl: jest.fn(() => mHowl) };
});

import { Howl } from 'howler';

describe('AudioManager', () => {
  let audioManager: AudioManager;

  beforeEach(() => {
    audioManager = new AudioManager();
    jest.clearAllMocks();
  });

  describe('initAmbientSounds', () => {
    it('should initialize and play ambient sound', () => {
      audioManager.initAmbientSounds('ambient.mp3');

      expect(Howl).toHaveBeenCalledTimes(1);
      expect(Howl).toHaveBeenCalledWith({
        src: ['ambient.mp3'],
        loop: true,
        volume: 0.5,
      });

      const howlInstance = (Howl as jest.Mock).mock.results[0].value;
      expect(howlInstance.play).toHaveBeenCalledTimes(1);
    });

    it('should stop previous ambient sound if initialized again', () => {
      audioManager.initAmbientSounds('ambient1.mp3');
      const firstHowlInstance = (Howl as jest.Mock).mock.results[0].value;

      audioManager.initAmbientSounds('ambient2.mp3');

      expect(firstHowlInstance.stop).toHaveBeenCalledTimes(1);
      expect(Howl).toHaveBeenCalledTimes(2);
    });
  });

  describe('playImpactSound', () => {
    it('should not play sound if velocity is too low', () => {
      audioManager.playImpactSound(0.5, 'impact.mp3'); // volume = 0.5/20 = 0.025 (less than 0.05)
      expect(Howl).not.toHaveBeenCalled();
    });

    it('should play sound with calculated volume based on velocity', () => {
      audioManager.playImpactSound(10, 'impact.mp3'); // volume = 10/20 = 0.5

      expect(Howl).toHaveBeenCalledTimes(1);
      expect(Howl).toHaveBeenCalledWith({
        src: ['impact.mp3'],
        volume: 0.5,
      });

      const howlInstance = (Howl as jest.Mock).mock.results[0].value;
      expect(howlInstance.play).toHaveBeenCalledTimes(1);
    });

    it('should cap volume at 1 for very high velocity', () => {
      audioManager.playImpactSound(30, 'impact.mp3'); // volume = 30/20 = 1.5, capped at 1.0

      expect(Howl).toHaveBeenCalledTimes(1);
      expect(Howl).toHaveBeenCalledWith({
        src: ['impact.mp3'],
        volume: 1.0,
      });

      const howlInstance = (Howl as jest.Mock).mock.results[0].value;
      expect(howlInstance.play).toHaveBeenCalledTimes(1);
    });
  });
});
