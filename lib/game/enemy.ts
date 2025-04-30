import { Vector2D } from './utils';
import { Bullet } from './bullet';
import { Sprite } from './sprite';

export enum EnemyType {
  BASIC = 'basic',
  SHOOTER = 'shooter',
  SPINNER = 'spinner',
  BOSS = 'boss'
}

export interface EnemyOptions {
  position: Vector2D;
  size: number;
  health: number;
  speed: number;
  type: EnemyType;
  scoreValue: number;
  bulletSpeed?: number;
  fireRate?: number; // Bullets per second
  movementPattern?: string;
}

export class Enemy {
  position: Vector2D;
  size: number;
  health: number;
  maxHealth: number;
  speed: number;
  type: EnemyType;
  scoreValue: number;
  bulletSpeed: number;
  fireRate: number;
  timeSinceLastShot: number = 0;
  movementPattern: string;
  movementTime: number = 0;
  sprite: Sprite;
  hitRadius: number;
  isActive: boolean = true;
  
  // Animation properties
  rotation: number = 0;
  scale: number = 1;
  opacity: number = 1;
  
  constructor(options: EnemyOptions) {
    this.position = { ...options.position };
    this.size = options.size;
    this.health = options.health;
    this.maxHealth = options.health;
    this.speed = options.speed;
    this.type = options.type;
    this.scoreValue = options.scoreValue;
    this.bulletSpeed = options.bulletSpeed || 200;
    this.fireRate = options.fireRate || 0.5;
    this.movementPattern = options.movementPattern || 'linear';
    this.hitRadius = this.size / 2;
    
    // Set up sprite based on enemy type
    const spriteId = this.getSpriteId();
    this.sprite = new Sprite(spriteId, { width: this.size, height: this.size });
  }
  
  private getSpriteId(): string {
    switch (this.type) {
      case EnemyType.BASIC:
        return "#enemy-standard";
      case EnemyType.SHOOTER:
        return "#enemy-shooter";
      case EnemyType.SPINNER:
        return "#enemy-spinner";
      case EnemyType.BOSS:
        return "#enemy-boss";
      default:
        return "#enemy-standard";
    }
  }
  
  update(deltaTime: number, canvasWidth: number, canvasHeight: number): void {
    // Update timers
    this.timeSinceLastShot += deltaTime;
    this.movementTime += deltaTime;
    
    // Update animation properties
    this.updateAnimation(deltaTime);
    
    // Update position based on movement pattern
    this.updateMovement(deltaTime, canvasWidth, canvasHeight);
  }
  
  private updateAnimation(deltaTime: number): void {
    // Update rotation for spinner enemies
    if (this.type === EnemyType.SPINNER) {
      this.rotation += deltaTime * 2; // Rotate 2 radians per second
    }
    
    // Pulse scale for boss enemies
    if (this.type === EnemyType.BOSS) {
      this.scale = 1 + Math.sin(this.movementTime * 2) * 0.05;
    }
  }
  
  private updateMovement(deltaTime: number, canvasWidth: number, canvasHeight: number): void {
    switch (this.movementPattern) {
      case 'linear':
        // Simple downward movement
        this.position.y += this.speed * deltaTime;
        break;
        
      case 'sine':
        // Sine wave movement
        this.position.y += this.speed * 0.7 * deltaTime;
        this.position.x += Math.sin(this.movementTime * 2) * this.speed * deltaTime;
        break;
        
      case 'zigzag':
        // Zigzag movement
        this.position.y += this.speed * 0.8 * deltaTime;
        
        const zigzagPeriod = 2; // Time to complete one zigzag
        const zigzagPhase = (this.movementTime % zigzagPeriod) / zigzagPeriod;
        
        if (zigzagPhase < 0.5) {
          this.position.x += this.speed * deltaTime;
        } else {
          this.position.x -= this.speed * deltaTime;
        }
        break;
        
      case 'circle':
        // Circular movement
        const centerX = this.position.x;
        const radius = 50;
        const angularSpeed = 1; // Radians per second
        
        this.position.x = centerX + Math.cos(this.movementTime * angularSpeed) * radius;
        this.position.y += this.speed * 0.5 * deltaTime;
        break;
        
      case 'boss':
        // Boss movement - slow side to side at the top
        const amplitude = canvasWidth * 0.4;
        const period = 5; // Time to complete one full movement
        
        // Keep boss at the top area
        if (this.position.y < 100) {
          this.position.y += this.speed * 0.5 * deltaTime;
        } else {
          this.position.y = 100;
        }
        
        // Move side to side
        this.position.x = canvasWidth / 2 + Math.sin(this.movementTime * (2 * Math.PI / period)) * amplitude;
        break;
    }
    
    // Keep enemy within canvas bounds
    this.position.x = Math.max(this.size / 2, Math.min(canvasWidth - this.size / 2, this.position.x));
  }
  
  canShoot(): boolean {
    return this.timeSinceLastShot >= 1 / this.fireRate;
  }
  
  shoot(playerPosition: Vector2D): Bullet[] {
    this.timeSinceLastShot = 0;
    const bullets: Bullet[] = [];
    
    // Different bullet patterns based on enemy type
    switch (this.type) {
      case EnemyType.SHOOTER:
        // Aimed shot at player
        const dirToPlayer = {
          x: playerPosition.x - this.position.x,
          y: playerPosition.y - this.position.y
        };
        
        // Normalize direction
        const magnitude = Math.sqrt(dirToPlayer.x * dirToPlayer.x + dirToPlayer.y * dirToPlayer.y);
        const normalizedDir = {
          x: dirToPlayer.x / magnitude,
          y: dirToPlayer.y / magnitude
        };
        
        bullets.push(
          new Bullet({
            position: { x: this.position.x, y: this.position.y + this.size / 2 },
            velocity: normalizedDir,
            radius: 5,
            damage: 1,
            speed: this.bulletSpeed,
            isPlayerBullet: false,
          })
        );
        break;
        
      case EnemyType.SPINNER:
        // Spiral pattern - 4 bullets in different directions
        for (let i = 0; i < 4; i++) {
          const angle = this.rotation + (i * Math.PI / 2);
          bullets.push(
            new Bullet({
              position: { x: this.position.x, y: this.position.y },
              velocity: { x: Math.cos(angle), y: Math.sin(angle) },
              radius: 4,
              damage: 1,
              speed: this.bulletSpeed * 0.8,
              isPlayerBullet: false,
            })
          );
        }
        break;
        
      case EnemyType.BOSS:
        // Boss pattern - multiple bullets including aimed shot
        const toPlayer = {
          x: playerPosition.x - this.position.x,
          y: playerPosition.y - this.position.y
        };
        const mag = Math.sqrt(toPlayer.x * toPlayer.x + toPlayer.y * toPlayer.y);
        const normalized = {
          x: toPlayer.x / mag,
          y: toPlayer.y / mag
        };
        
        // Center shot aimed at player
        bullets.push(
          new Bullet({
            position: { x: this.position.x, y: this.position.y + this.size / 2 },
            velocity: normalized,
            radius: 6,
            damage: 2,
            speed: this.bulletSpeed * 1.2,
            isPlayerBullet: false,
          })
        );
        
        // Side shots
        for (let i = -2; i <= 2; i++) {
          if (i === 0) continue; // Skip center (already added)
          
          const spreadAngle = i * 0.2; // Spread in radians
          const rotatedVelocity = {
            x: normalized.x * Math.cos(spreadAngle) - normalized.y * Math.sin(spreadAngle),
            y: normalized.x * Math.sin(spreadAngle) + normalized.y * Math.cos(spreadAngle)
          };
          
          bullets.push(
            new Bullet({
              position: { x: this.position.x, y: this.position.y + this.size / 2 },
              velocity: rotatedVelocity,
              radius: 4,
              damage: 1,
              speed: this.bulletSpeed,
              isPlayerBullet: false,
            })
          );
        }
        break;
        
      default:
        // Basic enemy - simple downward shot
        bullets.push(
          new Bullet({
            position: { x: this.position.x, y: this.position.y + this.size / 2 },
            velocity: { x: 0, y: 1 },
            radius: 4,
            damage: 1,
            speed: this.bulletSpeed,
            isPlayerBullet: false,
          })
        );
        break;
    }
    
    return bullets;
  }
  
  takeDamage(damage: number): boolean {
    this.health -= damage;
    
    // Flash effect when taking damage
    this.scale = 1.2;
    setTimeout(() => {
      this.scale = 1;
    }, 100);
    
    // Check if enemy is destroyed
    if (this.health <= 0) {
      this.isActive = false;
      return true;
    }
    return false;
  }
  
  isOutOfBounds(canvasHeight: number): boolean {
    // Check if enemy has moved below the canvas
    return this.position.y > canvasHeight + this.size;
  }
  
  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    
    // Apply transformations
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.rotation);
    ctx.scale(this.scale, this.scale);
    ctx.globalAlpha = this.opacity;
    
    // Draw sprite
    this.sprite.render(ctx, -this.size / 2, -this.size / 2);
    
    // Draw health bar for bosses and larger enemies
    if (this.type === EnemyType.BOSS || this.size > 50) {
      const healthBarWidth = this.size;
      const healthBarHeight = 5;
      const healthPercentage = this.health / this.maxHealth;
      
      // Background
      ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
      ctx.fillRect(-healthBarWidth / 2, -this.size / 2 - 10, healthBarWidth, healthBarHeight);
      
      // Health
      ctx.fillStyle = 'rgba(0, 255, 0, 0.7)';
      ctx.fillRect(-healthBarWidth / 2, -this.size / 2 - 10, healthBarWidth * healthPercentage, healthBarHeight);
    }
    
    ctx.restore();
  }
}
