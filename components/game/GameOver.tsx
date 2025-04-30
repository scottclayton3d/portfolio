import { useBulletHell } from '../../lib/stores/useBulletHell';
import { motion } from 'framer-motion';

const GameOver = () => {
  const score = useBulletHell((state: { score: number }) => state.score);
  const resetGame = useBulletHell((state: { resetGame: () => void }) => state.resetGame);
  const level = useBulletHell((state: { level: number }) => state.level);

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-[#1A1A1A] bg-opacity-90">
      <motion.div 
        className="text-center mb-12"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className="game-title text-[#FF3366] mb-3"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          GAME OVER
        </motion.h1>
        
        <motion.div 
          className="game-text text-[#FFD700] mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          FINAL SCORE: {score.toLocaleString()}
        </motion.div>
        
        <motion.div 
          className="game-text text-[#00FFFF]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          LEVEL REACHED: {level}
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="flex flex-col space-y-6"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <button 
          onClick={resetGame}
          className="menu-text text-[#00FFFF] hover:text-white px-6 py-3 border-2 border-[#00FFFF] hover:border-white hover:shadow-glow transition-all duration-200 rounded-md"
          // whileHover needs to be moved to a motion.button component
          //whileTap={{ scale: 0.95 }}
        >
          PLAY AGAIN
        </button>
      </motion.div>
    </div>
  );
};

export default GameOver;
