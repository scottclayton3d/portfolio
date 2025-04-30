import { useAudio } from '../../lib/stores/useAudio';
import { useBulletHell } from '../../lib/stores/useBulletHell';
import { motion } from 'framer-motion';

const StartMenu = () => {
  const { toggleMute, isMuted } = useAudio();
  const startGame = useBulletHell((state: { startGame: () => void }) => state.startGame);
  
  const handleStartClick = () => {
    startGame();
    if (isMuted) {
      toggleMute(); // Unmute when game starts
    }
  };

  const titleVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  const buttonVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (custom: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: custom * 0.2,
        duration: 0.4
      }
    }),
    hover: { 
      scale: 1.05,
      textShadow: "0 0 8px rgb(0, 255, 255)",
      boxShadow: "0 0 8px rgb(0, 255, 255)",
      transition: {
        duration: 0.3,
        yoyo: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-[#1A1A1A] bg-opacity-90">
      <motion.div 
        className="text-center mb-16"
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="game-title mb-2 text-shadow-lg"
          variants={titleVariants}
        >
          BULLET HELL
        </motion.h1>
        
        <motion.p 
          className="game-text text-[#00FFFF] mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Navigate through waves of bullets and defeat enemies!
        </motion.p>
      </motion.div>
      
      <div className="flex flex-col items-center space-y-6">
        <motion.button 
          onClick={handleStartClick}
          className="menu-text text-[#00FFFF] hover:text-white px-6 py-3 border-2 border-[#00FFFF] hover:border-white hover:shadow-glow transition-all duration-200 rounded-md"
          variants={buttonVariants}
          custom={1}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          whileTap={{ scale: 0.95 }}
        >
          START GAME
        </motion.button>
        
        <motion.div 
          onClick={toggleMute}
          className="menu-text text-[#FFD700] flex items-center cursor-pointer hover:text-white transition-colors duration-200"
          variants={buttonVariants}
          custom={2}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {isMuted ? 'SOUND: OFF' : 'SOUND: ON'}
        </motion.div>
      </div>
      
      <motion.div 
        className="absolute bottom-8 left-0 right-0 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.7, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <p className="game-text text-sm text-white">
          CONTROLS: WASD/ARROWS to move, SPACE to shoot
        </p>
      </motion.div>
    </div>
  );
};

export default StartMenu;
