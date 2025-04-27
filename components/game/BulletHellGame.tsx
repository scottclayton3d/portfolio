import { useEffect } from 'react';
import { useAudio } from '../../lib/stores/useAudio';
import { useBulletHell } from '../../lib/stores/useBulletHell';
import GameCanvas from './GameCanvas';
import GameUI from './GameUI';
import StartMenu from './StartMenu';
import GameOver from './GameOver';

export interface BulletHellGameProps {
  className?: string;
}

const BulletHellGame = ({ className = "" }: BulletHellGameProps) => {
  const { setBackgroundMusic: setBackgroundAudio, setHitSound: setHitAudio, setSuccessSound: setSuccessAudio } = useAudio();
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();
  const gameState = useBulletHell((state: { gameState: string }) => state.gameState);

  // Initialize audio
  useEffect(() => {
    const bgMusic = new Audio('/sounds/background.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    setBackgroundAudio(bgMusic);
    setBackgroundMusic(bgMusic);

    const hit = new Audio('/sounds/hit.mp3');
    hit.volume = 0.4;
    setHitAudio(hit);
    setHitSound(hit);

    const success = new Audio('/sounds/success.mp3');
    success.volume = 0.5;
    setSuccessAudio(success);
    setSuccessSound(success);

    return () => {
      bgMusic.pause();
      hit.pause();
      success.pause();
    };
  }, [
    setBackgroundMusic,
    setHitSound,
    setSuccessSound,
    setBackgroundAudio,
    setHitAudio,
    setSuccessAudio
  ]);

  return (
    <div className={`relative w-full h-full bg-[#1A1A1A] overflow-hidden ${className}`}>
      {/* Game Canvas - always render to keep game loop running */}
      <GameCanvas />
      
      {/* UI Layers */}
      {gameState === 'menu' && <StartMenu />}
      {gameState === 'playing' && <GameUI />}
      {gameState === 'gameover' && <GameOver />}
    </div>
  );
};

export default BulletHellGame;
