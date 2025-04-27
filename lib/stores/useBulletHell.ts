import { create } from 'zustand';
import { GameManager } from '@/lib/game/game-manager';
import { useAudio } from './useAudio';

export type GameState = 'menu' | 'playing' | 'gameover';

interface BulletHellStore {
  // Game state
  gameState: GameState;
  gameManager: GameManager | null;
  score: number;
  lives: number;
  level: number;
  
  // Game actions
  setGameManager: (gameManager: GameManager) => void;
  startGame: () => void;
  resetGame: () => void;
  updateScore: (score: number) => void;
  updateLives: (lives: number) => void;
  updateLevel: (level: number) => void;
}

export const useBulletHell = create<BulletHellStore>((set, get) => ({
  // Initial state
  gameState: 'menu',
  gameManager: null,
  score: 0,
  lives: 3,
  level: 1,
  
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
      
      set({ gameState: 'playing' });
    }
  },
  
  resetGame: () => {
    const { gameManager } = get();
    if (gameManager) {
      gameManager.resetGame();
    }
    set({ gameState: 'menu', score: 0, lives: 3, level: 1 });
  },
  
  updateScore: (score) => set({ score }),
  updateLives: (lives) => set({ lives }),
  updateLevel: (level) => set({ level }),
}));
