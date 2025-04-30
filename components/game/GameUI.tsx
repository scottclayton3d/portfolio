import { useBulletHell } from '../../lib/stores/useBulletHell';
import { motion } from 'framer-motion';

const GameUI = () => {
  const score = useBulletHell((state: { score: number }) => state.score);
  const lives = useBulletHell((state: { lives: number }) => state.lives);
  const level = useBulletHell((state: { level: number }) => state.level);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      {/* Top HUD */}
      <motion.div 
        className="absolute top-4 left-0 right-0 flex justify-between px-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="game-text text-[#FFD700]">SCORE: {score.toLocaleString()}</div>
        <div className="game-text text-[#00FFFF]">LEVEL: {level}</div>
      </motion.div>
      
      {/* Lives indicator */}
      <motion.div 
        className="absolute bottom-4 left-6 flex items-center"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="game-text text-[#FF3366] mr-3">LIVES:</div>
        <div className="flex">
          {[...Array(lives)].map((_, i) => (
            <motion.div 
              key={i}
              className="w-6 h-6 mx-1 bg-[#FF3366]"
              style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default GameUI;
