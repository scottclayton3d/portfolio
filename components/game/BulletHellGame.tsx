import { useEffect, useState } from 'react';
import { useAudio } from '../../lib/stores/useAudio';
import { useBulletHell } from '../../lib/stores/useBulletHell';
import GameCanvas from './GameCanvas';
import GameUI from './GameUI';
import StartMenu from './StartMenu';
import GameOver from './GameOver';
import { motion, AnimatePresence } from 'framer-motion';

export interface BulletHellGameProps {
  className?: string;
}

const BulletHellGame = () => {
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();
  const gameState = useBulletHell((state: { gameState: string }) => state.gameState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize audio
  useEffect(() => {
    const bgMusic = new Audio('/sounds/background.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    setBackgroundMusic(bgMusic);

    const hit = new Audio('/sounds/hit.mp3');
    hit.volume = 0.4;
    setHitSound(hit);

    const success = new Audio('/sounds/success.mp3');
    success.volume = 0.5;
    setSuccessSound(success);

    // Mark assets as loaded
    setIsLoaded(true);

    return () => {
      bgMusic.pause();
      hit.pause();
      success.pause();
    };
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  // Define animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      className={`relative w-full h-full max-w-[900px] max-h-[700px] bg-[#1A1A1A] overflow-hidden`}
      style={{ margin: '0 auto' }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* SVG Definitions for game sprites */}
      <svg width="0" height="0" style={{ position: 'absolute', visibility: 'hidden' }}>
        <defs>
          <g id="player-ship"></g>
          <g id="player-bullet"></g>
          <g id="enemy-standard"></g>
          <g id="enemy-spinner"></g>
          <g id="enemy-boss"></g>
          <g id="enemy-bullet"></g>
          <g id="explosion"></g>
        </defs>
      </svg>

      {/* Game Canvas - always render to keep game loop running */}
      {isLoaded && <GameCanvas />}
      
      {/* UI Layers with transitions */}
      <AnimatePresence mode="wait">
        {gameState === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <StartMenu />
          </motion.div>
        )}
        
        {gameState === 'playing' && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GameUI />
          </motion.div>
        )}
        
        {gameState === 'gameover' && (
          <motion.div
            key="gameover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GameOver />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BulletHellGame;
