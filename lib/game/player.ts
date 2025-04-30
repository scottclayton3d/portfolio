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
  invulnerabilityTimer: number = 0;
  sprite: Sprite;
  thrusterAnimation: number = 0;
  powerLevel: number = 1; // Power level affects bullet patterns
  
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
    // Update timers
    this.timeSinceLastShot += deltaTime;
    
    // Update invulnerability
    if (this.isInvulnerable) {
      this.invulnerabilityTime -= deltaTime;
      if (this.invulnerabilityTime <= 0) {
        this.isInvulnerable = false;
      }
    }
    
    // Update thruster animation
    this.thrusterAnimation += deltaTime * 10;
    if (this.thrusterAnimation > 100) {
      this.thrusterAnimation = 0;
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
    const bullets: Bullet[] = [];
    
    // Different bullet patterns based on power level
    switch (this.powerLevel) {
      case 1:
        // Basic dual shot
        bullets.push(
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
        );
        break;
        
      case 2:
        // Triple shot
        bullets.push(
          new Bullet({
            position: { x: this.position.x, y: this.position.y - this.size / 2 },
            velocity: { x: 0, y: -1 },
            radius: 4,
            damage: 1,
            speed: this.bulletSpeed,
            isPlayerBullet: true,
          }),
          new Bullet({
            position: { x: this.position.x - 15, y: this.position.y - this.size / 3 },
            velocity: { x: -0.1, y: -0.9 },
            radius: 4,
            damage: 1,
            speed: this.bulletSpeed * 0.9,
            isPlayerBullet: true,
          }),
          new Bullet({
            position: { x: this.position.x + 15, y: this.position.y - this.size / 3 },
            velocity: { x: 0.1, y: -0.9 },
            radius: 4,
            damage: 1,
            speed: this.bulletSpeed * 0.9,
            isPlayerBullet: true,
          })
        );
        break;
        
      case 3:
        // Quad shot with increased damage
        bullets.push(
          new Bullet({
            position: { x: this.position.x - 5, y: this.position.y - this.size / 2 },
            velocity: { x: 0, y: -1 },
            radius: 5,
            damage: 2,
            speed: this.bulletSpeed,
            isPlayerBullet: true,
          }),
          new Bullet({
            position: { x: this.position.x + 5, y: this.position.y - this.size / 2 },
            velocity: { x: 0, y: -1 },
            radius: 5,
            damage: 2,
            speed: this.bulletSpeed,
            isPlayerBullet: true,
          }),
          new Bullet({
            position: { x: this.position.x - 20, y: this.position.y - this.size / 4 },
            velocity: { x: -0.2, y: -0.8 },
            radius: 4,
            damage: 1,
            speed: this.bulletSpeed * 0.85,
            isPlayerBullet: true,
          }),
          new Bullet({
            position: { x: this.position.x + 20, y: this.position.y - this.size / 4 },
            velocity: { x: 0.2, y: -0.8 },
            radius: 4,
            damage: 1,
            speed: this.bulletSpeed * 0.85,
            isPlayerBullet: true,
          })
        );
        break;
        
      default:
        // Fallback to basic shot if power level is invalid
        bullets.push(
          new Bullet({
            position: { x: this.position.x, y: this.position.y - this.size / 2 },
            velocity: { x: 0, y: -1 },
            radius: 4,
            damage: 1,
            speed: this.bulletSpeed,
            isPlayerBullet: true,
          })
        );
        break;
    }
    
    return bullets;
  }
  
  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    
    // Apply position
    ctx.translate(this.position.x, this.position.y);
    
    // Draw player ship
    if (this.isInvulnerable) {
      // Flashing effect when invulnerable
      const flashRate = 5; // Flashes per second
      if (Math.sin(this.invulnerabilityTimer * flashRate * Math.PI) > 0) {
        ctx.globalAlpha = 0.5;
      }
    }
    
    // If we have a sprite, use it
    if (this.sprite) {
      this.sprite.render(ctx, -this.size / 2, -this.size / 2);
    } else {
      // Fallback to a simple triangle ship
      ctx.fillStyle = '#00FFFF';
      ctx.beginPath();
      ctx.moveTo(0, -this.size / 2);
      ctx.lineTo(-this.size / 2, this.size / 2);
      ctx.lineTo(this.size / 2, this.size / 2);
      ctx.closePath();
      ctx.fill();
      
      // Add some details
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.rect(-this.size / 4, 0, this.size / 2, this.size / 4);
      ctx.fill();
    }
    
    // Debug: draw hit radius
    if (process.env.NODE_ENV === 'development') {
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
      ctx.beginPath();
      ctx.arc(0, 0, this.hitRadius, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    ctx.restore();
  }
}
