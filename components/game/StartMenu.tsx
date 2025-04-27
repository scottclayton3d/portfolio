import { useAudio } from '../../lib/stores/useAudio';
import { useBulletHell } from '../../lib/stores/useBulletHell';

const StartMenu = () => {
  const { toggleMute, isMuted } = useAudio();
  const startGame = useBulletHell((state: { startGame: () => void }) => state.startGame);
  
  const handleStartClick = () => {
    startGame();
    if (isMuted) {
      toggleMute(); // Unmute when game starts
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-[#1A1A1A] bg-opacity-90">
      <div className="text-center mb-16">
        <h1 className="game-title mb-2 text-shadow-lg">BULLET HELL</h1>
        <p className="game-text text-[#00FFFF] mb-8">
          Navigate through waves of bullets and defeat enemies!
        </p>
      </div>
      
      <div className="flex flex-col items-center space-y-6">
        <button 
          onClick={handleStartClick}
          className="menu-text text-[#00FFFF] hover:text-white px-6 py-3 border-2 border-[#00FFFF] hover:border-white hover:shadow-glow transition-all duration-200 rounded-md"
        >
          START GAME
        </button>
        
        <div 
          onClick={toggleMute}
          className="menu-text text-[#FFD700] flex items-center cursor-pointer hover:text-white transition-colors duration-200"
        >
          {isMuted ? 'SOUND: OFF' : 'SOUND: ON'}
        </div>
      </div>
      
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="game-text text-sm text-white opacity-70">
          CONTROLS: WASD/ARROWS to move, SPACE to shoot
        </p>
      </div>
    </div>
  );
};

export default StartMenu;
