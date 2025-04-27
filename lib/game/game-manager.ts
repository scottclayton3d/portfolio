import { Player } from './player';
import { Enemy, EnemyOptions, EnemyType, MovementPattern, BulletPattern } from './enemy';
import { Bullet } from './bullet';
import { useBulletHell } from '../stores/useBulletHell';
import { useAudio } from '../stores/useAudio';

interface KeyState {
  [key: string]: boolean;
}

export class GameManager {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  player: Player | null = null;
  enemies: Enemy[] = [];
  playerBullets: Bullet[] = [];
  enemyBullets: Bullet[] = [];
  keys: KeyState = {};
  gameActive: boolean = false;
  score: number = 0;
  level: number = 1;
  lives: number = 3;
  timeToNextEnemy: number = 0;
  enemySpawnRate: number = 1; // Enemies per second
  levelProgressTimer: number = 0;
  levelDuration: number = 30; // Seconds per level
  
  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
    
    // Initialize canvas size
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    // Set up keyboard listeners
    this.setupEventListeners();
  }
  
  private setupEventListeners(): void {
    // Keyboard controls
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      
      // Prevent default behavior for game controls
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) {
        e.preventDefault();
      }
    });
    
    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
  }
  
  startGame(): void {
    // Reset game state
    this.player = new Player({
      position: { 
        x: this.canvas.width / 2, 
        y: this.canvas.height - 100 
      },
      size: 32,
      speed: 300,
      fireRate: 5,
      bulletSpeed: 500
    });
    
    this.enemies = [];
    this.playerBullets = [];
    this.enemyBullets = [];
    this.score = 0;
    this.level = 1;
    this.lives = 3;
    this.timeToNextEnemy = 0;
    this.levelProgressTimer = 0;
    this.gameActive = true;
    
    // Update store state
    this.updateGameState();
    
    console.log('Game started!');
  }
  
  resetGame(): void {
    this.gameActive = false;
    this.player = null;
    this.enemies = [];
    this.playerBullets = [];
    this.enemyBullets = [];
    
    // Update store
    useBulletHell.setState({ gameState: 'menu' });
  }
  
  gameOver(): void {
    this.gameActive = false;
    
    // Update store state
    useBulletHell.setState({ gameState: 'gameover' });
    
    console.log('Game over! Final score:', this.score);
  }
  
  update(deltaTime: number): void {
    if (!this.gameActive) return;
    
    // Update level progress
    this.levelProgressTimer += deltaTime;
    if (this.levelProgressTimer >= this.levelDuration) {
      this.levelUp();
    }
    
    // Update player
    if (this.player) {
      this.updatePlayerControls(deltaTime);
      
      // Player shooting
      if (this.keys['Space'] && this.player.canShoot()) {
        const newBullets = this.player.shoot();
        this.playerBullets.push(...newBullets);
      }
    }
    
    // Update bullets
    this.updateBullets(deltaTime);
    
    // Update enemies
    this.updateEnemies(deltaTime);
    
    // Spawn enemies
    this.timeToNextEnemy -= deltaTime;
    if (this.timeToNextEnemy <= 0) {
      this.spawnEnemy();
      this.timeToNextEnemy = 1 / this.enemySpawnRate;
    }
    
    // Check collisions
    this.checkCollisions();
    
    // Update game state in the store
    this.updateGameState();
  }
  
  private updateGameState(): void {
    useBulletHell.setState({ 
      score: this.score,
      lives: this.lives,
      level: this.level
    });
  }
  
  private updatePlayerControls(deltaTime: number): void {
    if (!this.player) return;
    
    // Calculate direction based on WASD or arrow keys
    let dirX = 0;
    let dirY = 0;
    
    if (this.keys['KeyW'] || this.keys['ArrowUp']) {
      dirY = -1;
    }
    if (this.keys['KeyS'] || this.keys['ArrowDown']) {
      dirY = 1;
    }
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) {
      dirX = -1;
    }
    if (this.keys['KeyD'] || this.keys['ArrowRight']) {
      dirX = 1;
    }
    
    // Update player position
    this.player.move(dirX, dirY, deltaTime, this.canvas.width, this.canvas.height);
  }
  
  private updateBullets(deltaTime: number): void {
    // Update player bullets
    for (let i = this.playerBullets.length - 1; i >= 0; i--) {
      const bullet = this.playerBullets[i];
      bullet.update(deltaTime);
      
      // Remove bullets that are out of bounds or inactive
      if (!bullet.active || bullet.isOutOfBounds(this.canvas.width, this.canvas.height)) {
        this.playerBullets.splice(i, 1);
      }
    }
    
    // Update enemy bullets
    for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
      const bullet = this.enemyBullets[i];
      bullet.update(deltaTime);
      
      // Remove bullets that are out of bounds or inactive
      if (!bullet.active || bullet.isOutOfBounds(this.canvas.width, this.canvas.height)) {
        this.enemyBullets.splice(i, 1);
      }
    }
  }
  
  private updateEnemies(deltaTime: number): void {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      enemy.update(deltaTime, this.canvas.width);
      
      // Enemy shooting
      if (enemy.canShoot()) {
        const newBullets = enemy.shoot();
        this.enemyBullets.push(...newBullets);
      }
      
      // Remove enemies that are out of bounds or inactive
      if (!enemy.active || enemy.isOutOfBounds(this.canvas.height)) {
        this.enemies.splice(i, 1);
      }
    }
  }
  
  private spawnEnemy(): void {
    // Calculate spawn parameters based on level
    const spawnConfig = this.getEnemySpawnConfig();
    
    // Ensure type is always present and not undefined
    const enemyOptions: EnemyOptions = {
      position: { x: Math.random() * (this.canvas.width - 50) + 25, y: -30 },
      ...(spawnConfig as Omit<EnemyOptions, 'position' | 'type'>),
      type: spawnConfig.type as EnemyType, // type is guaranteed by logic above
    };
    
    this.enemies.push(new Enemy(enemyOptions));
  }
  
  private getEnemySpawnConfig(): Partial<EnemyOptions> {
    // Base configurations
    const baseConfig: Partial<EnemyOptions> = {
      type: 'standard',
      health: 1,
      speed: 100,
      size: 24,
      scoreValue: 100,
      movementPattern: 'linear',
      bulletPattern: 'single',
      fireRate: 1,
      bulletSpeed: 200,
      bulletDamage: 1
    };
    
    // Adjust based on level
    const levelMultiplier = 1 + (this.level - 1) * 0.2; // 20% increase per level
    
    // Random enemy type based on level
    const enemyTypes: EnemyType[] = ['standard', 'spinner', 'boss'];
    let typeIndex = 0;
    
    // Higher level = more chance of harder enemies
    if (this.level >= 3) {
      const rand = Math.random();
      if (rand < 0.6) typeIndex = 0; // standard (60%)
      else if (rand < 0.9) typeIndex = 1; // spinner (30%)
      else typeIndex = 2; // boss (10%)
    } else if (this.level >= 2) {
      typeIndex = Math.random() < 0.7 ? 0 : 1; // 70% standard, 30% spinner
    }
    
    const type = enemyTypes[typeIndex];
    
    // Adjust parameters based on enemy type
    let config: Partial<EnemyOptions> = { ...baseConfig, type };
    
    switch (type) {
      case 'standard':
        // Default stats
        break;
      case 'spinner':
        config = {
          ...config,
          health: 2,
          speed: 80,
          scoreValue: 200,
          movementPattern: Math.random() < 0.5 ? 'sine' : 'zigzag',
          bulletPattern: 'spread',
          fireRate: 1.5
        };
        break;
      case 'boss':
        config = {
          ...config,
          health: 10,
          speed: 50,
          size: 40,
          scoreValue: 500,
          movementPattern: 'circle',
          bulletPattern: Math.random() < 0.5 ? 'circle' : 'spiral',
          fireRate: 2,
          bulletSpeed: 150,
          bulletDamage: 2
        };
        break;
    }
    
    // Apply level scaling
    config.health = Math.ceil((config.health || 1) * levelMultiplier);
    config.speed = Math.ceil((config.speed || 100) * (1 + (this.level - 1) * 0.1));
    config.bulletSpeed = Math.ceil((config.bulletSpeed || 200) * (1 + (this.level - 1) * 0.05));
    config.scoreValue = Math.ceil((config.scoreValue || 100) * levelMultiplier);
    
    // Random selection for movement and bullet patterns
    const movementPatterns: MovementPattern[] = ['linear', 'sine', 'circle', 'zigzag'];
    const bulletPatterns: BulletPattern[] = ['single', 'spread', 'circle', 'spiral'];
    
    if (Math.random() < 0.7) { // 70% chance to randomize patterns further
      config.movementPattern = movementPatterns[Math.floor(Math.random() * movementPatterns.length)];
      if (type !== 'standard') { // Standard enemies always have simpler bullet patterns
        config.bulletPattern = bulletPatterns[Math.floor(Math.random() * bulletPatterns.length)];
      }
    }
    
    return config;
  }
  
  private levelUp(): void {
    this.level++;
    this.levelProgressTimer = 0;
    
    // Increase difficulty
    this.enemySpawnRate = Math.min(5, 1 + (this.level - 1) * 0.5); // Cap at 5 enemies per second
    this.levelDuration = Math.max(20, 30 - (this.level - 1) * 2); // Minimum 20 seconds per level
    
    // Play level up sound
    useAudio.getState().playSuccess();
    
    console.log(`Level up! Now at level ${this.level}`);
  }
  
  private checkCollisions(): void {
    if (!this.player || !this.gameActive) return;
    
    // Check player bullets against enemies
    for (let i = this.playerBullets.length - 1; i >= 0; i--) {
      const bullet = this.playerBullets[i];
      
      for (let j = this.enemies.length - 1; j >= 0; j--) {
        const enemy = this.enemies[j];
        
        // Simple circle collision detection
        const dx = bullet.position.x - enemy.position.x;
        const dy = bullet.position.y - enemy.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < bullet.radius + enemy.size / 2) {
          // Collision detected
          enemy.takeDamage(bullet.damage);
          bullet.active = false;
          
          // Add score if enemy is destroyed
          if (!enemy.active) {
            this.score += enemy.scoreValue;
            useAudio.getState().playHit();
          }
          
          break; // Bullet can only hit one enemy
        }
      }
    }
    
    // Check enemy bullets against player
    for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
      const bullet = this.enemyBullets[i];
      
      // Simple circle collision detection
      const dx = bullet.position.x - this.player.position.x;
      const dy = bullet.position.y - this.player.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < bullet.radius + this.player.hitRadius) {
        // Collision detected
        bullet.active = false;
        this.playerHit();
        break;
      }
    }
  }
  
  private playerHit(): void {
    if (!this.player) return;
    
    // Play hit sound
    useAudio.getState().playHit();
    
    // Reduce player lives
    this.lives--;
    
    // Check game over
    if (this.lives <= 0) {
      this.gameOver();
    } else {
      // Reset player position
      this.player.position = {
        x: this.canvas.width / 2,
        y: this.canvas.height - 100
      };
      
      // Give temporary invulnerability (implemented in Player class)
      this.player.setInvulnerable(2); // 2 seconds of invulnerability
    }
  }
  
  render(): void {
    // Clear canvas
    this.ctx.fillStyle = '#1A1A1A';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw grid background
    this.renderGridBackground();
    
    // Draw player
    if (this.player && this.gameActive) {
      this.player.render(this.ctx);
    }
    
    // Draw enemies
    this.enemies.forEach(enemy => {
      enemy.render(this.ctx);
    });
    
    // Draw player bullets
    this.playerBullets.forEach(bullet => {
      bullet.render(this.ctx);
    });
    
    // Draw enemy bullets
    this.enemyBullets.forEach(bullet => {
      bullet.render(this.ctx);
    });
  }
  
  private renderGridBackground(): void {
    const gridSize = 40;
    const gridOpacity = 0.2;
    
    this.ctx.strokeStyle = `rgba(0, 255, 255, ${gridOpacity})`;
    this.ctx.lineWidth = 1;
    
    // Draw vertical lines
    for (let x = 0; x < this.canvas.width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let y = 0; y < this.canvas.height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  }
  
  handleResize(): void {
    // Update player position when canvas is resized
    if (this.player) {
      // Keep player at bottom center
      this.player.position = {
        x: this.canvas.width / 2,
        y: this.canvas.height - 100,
      };
    }
  }
}
