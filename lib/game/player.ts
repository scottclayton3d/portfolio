import { Vector2D } from './utils';
import { Bullet } from './bullet';
import { Sprite } from '@/lib/game/sprite';

export interface PlayerOptions {
  position: Vector2D;
  size: number;
  speed: number;
  fireRate: number; // Bullets per second
  bulletSpeed: number;
}

export class Player {
  position: Vector2D;
  size: number;
  speed: number;
  fireRate: number;
  bulletSpeed: number;
  timeSinceLastShot: number = 0;
  hitRadius: number;
  isInvulnerable: boolean = false;
  invulnerabilityTime: number = 0;
  sprite: Sprite;
  
  constructor(options: PlayerOptions) {
    this.position = { ...options.position };
    this.size = options.size;
    this.speed = options.speed;
    this.fireRate = options.fireRate;
    this.bulletSpeed = options.bulletSpeed;
    this.hitRadius = this.size / 3; // Smaller hit box than visual size
    
    // Set up sprite
    this.sprite = new Sprite("#player-ship", { width: this.size, height: this.size });
  }
  
  move(dirX: number, dirY: number, deltaTime: number, canvasWidth: number, canvasHeight: number): void {
    // Update timer
    this.timeSinceLastShot += deltaTime;
    
    // Update invulnerability
    if (this.isInvulnerable) {
      this.invulnerabilityTime -= deltaTime;
      if (this.invulnerabilityTime <= 0) {
        this.isInvulnerable = false;
      }
    }
    
    // Calculate movement
    const movement: Vector2D = { x: 0, y: 0 };
    
    // Only move if there's a direction
    if (dirX !== 0 || dirY !== 0) {
      // Calculate normalized direction
      const magnitude = Math.sqrt(dirX * dirX + dirY * dirY);
      const normalizedDirX = dirX / magnitude;
      const normalizedDirY = dirY / magnitude;
      
      // Apply movement with speed and delta time
      movement.x = normalizedDirX * this.speed * deltaTime;
      movement.y = normalizedDirY * this.speed * deltaTime;
      
      // Apply movement
      this.position.x += movement.x;
      this.position.y += movement.y;
      
      // Clamp position within canvas bounds
      this.position.x = Math.max(this.size / 2, Math.min(canvasWidth - this.size / 2, this.position.x));
      this.position.y = Math.max(this.size / 2, Math.min(canvasHeight - this.size / 2, this.position.y));
    }
  }
  
  canShoot(): boolean {
    return this.timeSinceLastShot >= 1 / this.fireRate;
  }
  
  shoot(): Bullet[] {
    this.timeSinceLastShot = 0;
    
    // Create bullet
    return [
      new Bullet({
        position: { x: this.position.x - 10, y: this.position.y - this.size / 2 },
        velocity: { x: 0, y: -1 },
        radius: 4,
        damage: 1,
        speed: this.bulletSpeed,
        isPlayerBullet: true,
      }),
      new Bullet({
        position: { x: this.position.x + 10, y: this.position.y - this.size / 2 },
        velocity: { x: 0, y: -1 },
        radius: 4,
        damage: 1,
        speed: this.bulletSpeed,
        isPlayerBullet: true,
      })
    ];
  }
  
  setInvulnerable(duration: number): void {
    this.isInvulnerable = true;
    this.invulnerabilityTime = duration;
  }
  
  render(ctx: CanvasRenderingContext2D): void {
    // Don't render if game is not active
    
    // Handle invulnerability blinking
    if (this.isInvulnerable) {
      // Make player blink when invulnerable
      const blinksPerSecond = 8;
      const shouldShow = Math.floor(this.invulnerabilityTime * blinksPerSecond) % 2 === 0;
      
      if (!shouldShow) {
        return;
      }
    }
    
    // Draw player sprite
    this.sprite.render(ctx, this.position.x, this.position.y);
    
    // Draw hit box for debugging (uncomment if needed)
    // ctx.beginPath();
    // ctx.arc(this.position.x, this.position.y, this.hitRadius, 0, Math.PI * 2);
    // ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    // ctx.stroke();
  }
}
