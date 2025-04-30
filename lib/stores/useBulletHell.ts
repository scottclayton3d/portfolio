import { create } from 'zustand';
import { GameManager } from '@/lib/game/game-manager';
import { useAudio } from './useAudio';

export type GameState = 'menu' | 'playing' | 'paused' | 'gameover';

interface BulletHellStore {
  // Game state
  gameState: GameState;
  gameManager: GameManager | null;
  score: number;
  lives: number;
  level: number;
  highScore: number;
  
  // Game actions
  setGameManager: (gameManager: GameManager) => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  updateScore: (score: number) => void;
  updateLives: (lives: number) => void;
  updateLevel: (level: number) => void;
}

// Get high score from localStorage if available
const getInitialHighScore = (): number => {
  if (typeof window !== 'undefined') {
    const savedHighScore = localStorage.getItem('bulletHellHighScore');
    return savedHighScore ? parseInt(savedHighScore, 10) : 0;
  }
  return 0;
};

export const useBulletHell = create<BulletHellStore>((set, get) => ({
  // Initial state
  gameState: 'menu',
  gameManager: null,
  score: 0,
  lives: 3,
  level: 1,
  highScore: getInitialHighScore(),
  
  // Actions
  setGameManager: (gameManager) => set({ gameManager }),
  
  startGame: () => {
    const { gameManager } = get();
    if (gameManager) {
      gameManager.startGame();
      
      // Start background music
      const audio = useAudio.getState();
      if (audio.backgroundMusic && !audio.isMuted) {
        audio.backgroundMusic.currentTime = 0;
        audio.backgroundMusic.play().catch(error => {
          console.log("Background music play prevented:", error);
        });
      }
      
      set({ gameState: 'playing', score: 0, lives: 3, level: 1 });
    }
  },
  
  pauseGame: () => {
    const { gameState } = get();
    if (gameState === 'playing') {
      // Pause background music
      const audio = useAudio.getState();
      if (audio.backgroundMusic && !audio.isMuted) {
        audio.backgroundMusic.pause();
      }
      
      set({ gameState: 'paused' });
    }
  },
  
  resumeGame: () => {
    const { gameState } = get();
    if (gameState === 'paused') {
      // Resume background music
      const audio = useAudio.getState();
      if (audio.backgroundMusic && !audio.isMuted) {
        audio.backgroundMusic.play().catch(error => {
          console.log("Background music play prevented:", error);
        });
      }
      
      set({ gameState: 'playing' });
    }
  },
  
  resetGame: () => {
    const { gameManager, score, highScore } = get();
    
    // Update high score if current score is higher
    let newHighScore = highScore;
    if (score > highScore) {
      newHighScore = score;
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('bulletHellHighScore', score.toString());
      }
    }
    
    if (gameManager) {
      gameManager.resetGame();
    }
    
    set({ 
      gameState: 'menu', 
      score: 0, 
      lives: 3, 
      level: 1,
      highScore: newHighScore
    });
  },
  
  updateScore: (score) => {
    set({ score });
    
    // Check for high score
    const { highScore } = get();
    if (score > highScore) {
      set({ highScore: score });
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('bulletHellHighScore', score.toString());
      }
    }
  },
  
  updateLives: (lives) => set({ lives }),
  updateLevel: (level) => set({ level }),
}));
