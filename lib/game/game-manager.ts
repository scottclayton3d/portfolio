import { Player } from './player';
import { Enemy, EnemyOptions } from './enemy';
import { Bullet } from './bullet';
import { circleCollision, Vector2D, randomInt } from './utils';
import { useBulletHell } from '../stores/useBulletHell';
import { useAudio } from '../stores/useAudio';

interface KeyState {
  [key: string]: boolean;
}

export class GameManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private player: Player;
  private enemies: Enemy[] = [];
  private playerBullets: Bullet[] = [];
  private enemyBullets: Bullet[] = [];
  private score: number = 0;
  private level: number = 1;
  private lives: number = 3;
  private gameOver: boolean = false;
  private isPaused: boolean = false;
  private lastEnemySpawn: number = 0;
  private enemySpawnRate: number = 2; // Enemies per second
  private explosions: { position: Vector2D, size: number, time: number }[] = [];

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
    
    // Initialize player in the center bottom of the screen
    this.player = new Player({
      position: { 
        x: canvas.width / 2, 
        y: canvas.height - 100 
      },
      size: 40,
      speed: 300,
      fireRate: 5,
      bulletSpeed: 500
    });
    
    // Set initial canvas size
    this.handleResize();
  }

  update(deltaTime: number): void {
    if (this.gameOver || this.isPaused) return;
    
    // Update player
    // In a real implementation, you'd get input from keyboard/touch
    const input = { x: 0, y: 0 }; // Placeholder for input handling
    this.player.move(input.x, input.y, deltaTime, this.canvas.width, this.canvas.height);
    
    // Player shooting
    if (this.player.canShoot()) {
      const bullets = this.player.shoot();
      this.playerBullets.push(...bullets);
    }
    
    // Update bullets
    this.updateBullets(deltaTime);
    
    // Update enemies
    this.updateEnemies(deltaTime);
    
    // Spawn enemies
    this.spawnEnemies(deltaTime);
    
    // Check collisions
    this.checkCollisions();
    
    // Update explosions
    this.updateExplosions(deltaTime);
    
    // Check game over condition
    if (this.lives <= 0) {
      this.gameOver = true;
    }
  }

  render(): void {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Render player
    this.player.render(this.ctx);
    
    // Render bullets
    [...this.playerBullets, ...this.enemyBullets].forEach(bullet => {
      bullet.render(this.ctx);
    });
    
    // Render enemies
    this.enemies.forEach(enemy => {
      enemy.render(this.ctx);
    });
    
    // Render explosions
    this.renderExplosions();
    
    // Render UI (score, lives, etc.)
    this.renderUI();
  }

  private updateBullets(deltaTime: number): void {
    // Update player bullets
    this.playerBullets = this.playerBullets.filter(bullet => {
      bullet.update(deltaTime);
      return bullet.active && !bullet.isOutOfBounds(this.canvas.width, this.canvas.height);
    });
    
    // Update enemy bullets
    this.enemyBullets = this.enemyBullets.filter(bullet => {
      bullet.update(deltaTime);
      return bullet.active && !bullet.isOutOfBounds(this.canvas.width, this.canvas.height);
    });
  }

  private updateEnemies(deltaTime: number): void {
    this.enemies = this.enemies.filter(enemy => {
      enemy.update(deltaTime, this.canvas.width);
      
      // Enemy shooting
      if (enemy.canShoot()) {
        const bullets = enemy.shoot();
        this.enemyBullets.push(...bullets);
      }
      
      // Remove enemies that are out of bounds or not active
      return enemy.active && !enemy.isOutOfBounds(this.canvas.height);
    });
  }

  private spawnEnemies(deltaTime: number): void {
    this.lastEnemySpawn += deltaTime;
    
    // Spawn rate increases with level
    const spawnInterval = 1 / (this.enemySpawnRate + (this.level * 0.2));
    
    if (this.lastEnemySpawn >= spawnInterval) {
      this.lastEnemySpawn = 0;
      
      // Create enemy options
      const enemyOptions: EnemyOptions = {
        position: { 
          x: randomInt(50, this.canvas.width - 50), 
          y: -50 
        },
        type: Math.random() > 0.8 ? 'spinner' : 'standard',
        health: 1 + Math.floor(this.level / 3),
        speed: 50 + (this.level * 5),
        size: 40,
        scoreValue: 100,
        movementPattern: Math.random() > 0.7 ? 'sine' : 'linear',
        bulletPattern: 'single',
        fireRate: 0.5 + (this.level * 0.1),
        bulletSpeed: 200,
        bulletDamage: 1
      };
      
      // Spawn boss every 5 levels
      if (this.level % 5 === 0 && this.enemies.length < 5) {
        enemyOptions.type = 'boss';
        enemyOptions.health = 10 + (this.level * 2);
        enemyOptions.size = 80;
        enemyOptions.scoreValue = 1000;
        enemyOptions.bulletPattern = 'spread';
      }
      
      this.enemies.push(new Enemy(enemyOptions));
    }
  }

  private checkCollisions(): void {
    // Player bullets vs enemies
    this.playerBullets.forEach(bullet => {
      this.enemies.forEach(enemy => {
        if (bullet.active && enemy.active) {
          if (circleCollision(
            bullet.position, bullet.radius,
            enemy.position, enemy.size / 2
          )) {
            // Bullet hit enemy
            bullet.active = false;
            enemy.takeDamage(bullet.damage);
            
            // Add explosion if enemy is destroyed
            if (!enemy.active) {
              this.score += enemy.scoreValue;
              this.addExplosion(enemy.position, enemy.size);
              
              // Level up based on score
              this.level = Math.floor(this.score / 5000) + 1;
            }
          }
        }
      });
    });
    
    // Enemy bullets vs player
    if (!this.player.isInvulnerable) {
      this.enemyBullets.forEach(bullet => {
        if (bullet.active) {
          if (circleCollision(
            bullet.position, bullet.radius,
            this.player.position, this.player.hitRadius
          )) {
            // Bullet hit player
            bullet.active = false;
            this.lives--;
            
            // Make player invulnerable for a short time
            this.player.setInvulnerable(2);
            
            // Add explosion
            this.addExplosion(this.player.position, this.player.size);
          }
        }
      });
    }
    
    // Enemies vs player (collision damage)
    if (!this.player.isInvulnerable) {
      this.enemies.forEach(enemy => {
        if (enemy.active) {
          if (circleCollision(
            enemy.position, enemy.size / 2,
            this.player.position, this.player.hitRadius
          )) {
            // Enemy hit player
            enemy.active = false;
            this.lives--;
            
            // Make player invulnerable for a short time
            this.player.setInvulnerable(2);
            
            // Add explosions
            this.addExplosion(enemy.position, enemy.size);
            this.addExplosion(this.player.position, this.player.size);
          }
        }
      });
    }
  }

  private addExplosion(position: Vector2D, size: number): void {
    this.explosions.push({
      position: { ...position },
      size: size,
      time: 0
    });
  }

  private updateExplosions(deltaTime: number): void {
    this.explosions = this.explosions.filter(explosion => {
      explosion.time += deltaTime;
      return explosion.time < 0.5; // Explosion lasts for 0.5 seconds
    });
  }

  private renderExplosions(): void {
    this.explosions.forEach(explosion => {
      const sprite = {
        width: explosion.size * 1.5,
        height: explosion.size * 1.5
      };
      
      // Use the explosion sprite from your sprite class
      const explosionSprite = sprite;
      this.ctx.fillStyle = '#FFA500';
      this.ctx.beginPath();
      this.ctx.arc(explosion.position.x, explosion.position.y, explosionSprite.width / 2, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  private renderUI(): void {
    // Render score
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = '20px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Score: ${this.score}`, 20, 30);
    
    // Render level
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`Level: ${this.level}`, this.canvas.width / 2, 30);
    
    // Render lives
    this.ctx.textAlign = 'right';
    this.ctx.fillText(`Lives: ${this.lives}`, this.canvas.width - 20, 30);
    
    // Render game over message
    if (this.gameOver) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.ctx.fillStyle = '#FF3366';
      this.ctx.font = '48px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 40);
      
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.font = '24px Arial';
      this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
    }
  }

  handleResize(): void {
    // Update canvas size
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    // Reposition player
    if (this.player) {
      this.player.position.y = this.canvas.height - 100;
    }
  }

  // Public methods for game control
  pauseGame(): void {
    this.isPaused = true;
  }

  resumeGame(): void {
    this.isPaused = false;
  }

  resetGame(): void {
    this.enemies = [];
    this.playerBullets = [];
    this.enemyBullets = [];
    this.explosions = [];
    this.score = 0;
    this.level = 1;
    this.lives = 3;
    this.gameOver = false;
    this.isPaused = false;
    
    // Reset player position
    this.player.position = { 
      x: this.canvas.width / 2, 
      y: this.canvas.height - 100 
    };
  }

  // Getters for game state
  getScore(): number {
    return this.score;
  }

  getLevel(): number {
    return this.level;
  }

  getLives(): number {
    return this.lives;
  }

  isGameOver(): boolean {
    return this.gameOver;
  }

  start(): void {
    this.resetGame();
    this.gameOver = false;
    this.isPaused = false;
    
    // Reposition player at the start
    this.player.position = { 
      x: this.canvas.width / 2, 
      y: this.canvas.height - 100 
    };
    
    // Play background music if available and not muted
    const audio = useAudio.getState();
    if (audio.backgroundMusic && !audio.isMuted) {
      audio.backgroundMusic.currentTime = 0;
      audio.backgroundMusic.play().catch(error => {
        console.log("Background music play prevented:", error);
      });
    }

    // Optionally, update UI state or trigger any other start-of-game logic here
  }
}
