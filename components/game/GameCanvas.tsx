import { useEffect, useRef } from 'react';
import { useBulletHell } from '../../lib/stores/useBulletHell';
import { GameManager } from '../../lib/game/game-manager';

const GameCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameManagerRef = useRef<GameManager | null>(null);
  const gameState = useBulletHell((state: { gameState: any }) => state.gameState);
  const setGameManager = useBulletHell((state: { setGameManager: (manager: GameManager) => void }) => state.setGameManager);

  // Initialize game engine
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Get canvas context
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Create game manager
    const gameManager = new GameManager(canvas, ctx);
    gameManagerRef.current = gameManager;
    setGameManager(gameManager);
    
    // Start game loop
    let animationId: number;
    let lastTime = 0;
    
    const gameLoop = (timestamp: number) => {
      // Calculate deltaTime (for frame-rate independence)
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      
      // Skip the first frame to avoid large deltaTime
      if (deltaTime > 0) {
        // Update and render game
        gameManager.update(deltaTime / 1000); // Convert to seconds
        gameManager.render();
      }
      
      // Continue the game loop
      animationId = requestAnimationFrame(gameLoop);
    };
    
    // Start the game loop
    animationId = requestAnimationFrame(gameLoop);
    
    // Clean up
    return () => {
      cancelAnimationFrame(animationId);
      gameManagerRef.current = null;
    };
  }, [setGameManager]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current || !gameManagerRef.current) return;
      
      // Update canvas size
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      
      // Update game manager
      gameManagerRef.current.handleResize();
    };
    
    // Initial size setup
    handleResize();
    
    // Listen for resize events
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full"
      style={{ backgroundColor: '#1A1A1A' }}
    />
  );
};

export default GameCanvas;
