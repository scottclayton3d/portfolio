import { useBulletHell } from '../../lib/stores/useBulletHell';

const GameOver = () => {
  const score = useBulletHell((state: { score: number }) => state.score);
  const resetGame = useBulletHell((state: { resetGame: () => void }) => state.resetGame);
  const level = useBulletHell((state: { level: number }) => state.level);

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-[#1A1A1A] bg-opacity-90">
      <div className="text-center mb-12">
        <h1 className="game-title text-[#FF3366] mb-3">GAME OVER</h1>
        <div className="game-text text-[#FFD700] mb-2">FINAL SCORE: {score.toLocaleString()}</div>
        <div className="game-text text-[#00FFFF]">LEVEL REACHED: {level}</div>
      </div>
      
      <div className="flex flex-col space-y-6">
        <button 
          onClick={resetGame}
          className="menu-text text-[#00FFFF] hover:text-white px-6 py-3 border-2 border-[#00FFFF] hover:border-white hover:shadow-glow transition-all duration-200 rounded-md"
        >
          PLAY AGAIN
        </button>
      </div>
    </div>
  );
};

export default GameOver;
