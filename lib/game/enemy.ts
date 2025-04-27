import { Vector2D } from './utils';
import { Bullet, BulletOptions } from './bullet';
import { Sprite } from './sprite';

export type EnemyType = 'standard' | 'spinner' | 'boss';
export type MovementPattern = 'linear' | 'sine' | 'circle' | 'zigzag';
export type BulletPattern = 'single' | 'spread' | 'circle' | 'spiral';

export interface EnemyOptions {
  position: Vector2D;
  type: EnemyType;
  health: number;
  speed: number;
  size: number;
  scoreValue: number;
  movementPattern: MovementPattern;
  bulletPattern: BulletPattern;
  fireRate: number; // Bullets per second
  bulletSpeed: number;
  bulletDamage: number;
}

export class Enemy {
  position: Vector2D;
  velocity: Vector2D = { x: 0, y: 0 };
  type: EnemyType;
  health: number;
  maxHealth: number;
  speed: number;
  size: number;
  scoreValue: number;
  movementPattern: MovementPattern;
  bulletPattern: BulletPattern;
  fireRate: number;
  bulletSpeed: number;
  bulletDamage: number;
  
  active: boolean = true;
  timeSinceLastShot: number = 0;
  movementTime: number = 0; // Tracks time for movement patterns
  sprite: Sprite;
  
  constructor(options: EnemyOptions) {
    this.position = { ...options.position };
    this.type = options.type;
    this.health = options.health;
    this.maxHealth = options.health;
    this.speed = options.speed;
    this.size = options.size;
    this.scoreValue = options.scoreValue;
    this.movementPattern = options.movementPattern;
    this.bulletPattern = options.bulletPattern;
    this.fireRate = options.fireRate;
    this.bulletSpeed = options.bulletSpeed;
    this.bulletDamage = options.bulletDamage;
    
    // Setup initial velocity based on movement pattern
    this.initializeMovement();
    
    // Set sprite based on enemy type
    let spriteId: string;
    switch (this.type) {
      case 'spinner':
        spriteId = "#enemy-spinner";
        break;
      case 'boss':
        spriteId = "#enemy-boss";
        break;
      case 'standard':
      default:
        spriteId = "#enemy-standard";
        break;
    }
    
    this.sprite = new Sprite(spriteId, { width: this.size, height: this.size });
  }
  
  private initializeMovement(): void {
    // Set initial velocity based on movement pattern
    switch (this.movementPattern) {
      case 'linear':
        this.velocity = { x: 0, y: 1 }; // Move straight down
        break;
      case 'sine':
        this.velocity = { x: 0, y: 1 }; // Initial direction, will be modified in update
        break;
      case 'circle':
        this.velocity = { x: 1, y: 0 }; // Initial direction, will be modified in update
        break;
      case 'zigzag':
        this.velocity = { x: 1, y: 0.5 }; // Initial direction, will be modified in update
        break;
    }
  }
  
  update(deltaTime: number, canvasWidth: number): void {
    // Update position and movement pattern
    this.updateMovement(deltaTime, canvasWidth);
    
    // Update shooting timer
    this.timeSinceLastShot += deltaTime;
  }
  
  private updateMovement(deltaTime: number, canvasWidth: number): void {
    this.movementTime += deltaTime;
    
    // Apply movement pattern
    switch (this.movementPattern) {
      case 'linear':
        // Simple linear movement, no changes needed
        break;
      case 'sine':
        // Sine wave movement pattern
        const frequency = 2; // Oscillations per second
        const amplitude = 100; // Maximum horizontal movement
        
        // Calculate horizontal position using sine function
        const centerX = this.position.x; // Current x position as center
        const offsetX = amplitude * Math.sin(this.movementTime * frequency * Math.PI);
        
        // Apply sine wave movement to x velocity
        this.velocity.x = offsetX - centerX;
        break;
      case 'circle':
        // Circular movement pattern
        const radius = 80; // Radius of circular path
        const angularSpeed = 1; // Radians per second
        
        // Calculate position on circle
        const angle = this.movementTime * angularSpeed;
        const circleX = Math.cos(angle) * radius;
        const circleY = Math.sin(angle) * radius;
        
        // Update velocity to move toward the next point on the circle
        // while continuing downward
        this.velocity.x = circleX;
        this.velocity.y = 0.5 + Math.abs(circleY * 0.01); // Add slight vertical movement
        break;
      case 'zigzag':
        // Zigzag movement pattern
        const zigzagPeriod = 2; // Time to complete one zigzag
        const phase = (this.movementTime % zigzagPeriod) / zigzagPeriod;
        
        // Determine direction based on phase
        if (phase < 0.5) {
          this.velocity.x = 1; // Move right
        } else {
          this.velocity.x = -1; // Move left
        }
        
        // Ensure enemy stays within screen bounds
        if (this.position.x < this.size) {
          this.velocity.x = Math.abs(this.velocity.x); // Force right movement
        } else if (this.position.x > canvasWidth - this.size) {
          this.velocity.x = -Math.abs(this.velocity.x); // Force left movement
        }
        break;
    }
    
    // Apply velocity to position
    this.position.x += this.velocity.x * this.speed * deltaTime;
    this.position.y += this.velocity.y * this.speed * deltaTime;
  }
  
  canShoot(): boolean {
    return this.timeSinceLastShot >= 1 / this.fireRate;
  }
  
  shoot(): Bullet[] {
    this.timeSinceLastShot = 0;
    
    // Create bullets based on bullet pattern
    const bullets: Bullet[] = [];
    
    switch (this.bulletPattern) {
      case 'single':
        // Single bullet straight down
        bullets.push(this.createBullet({ x: 0, y: 1 }));
        break;
      case 'spread':
        // Three bullets in a spread pattern
        bullets.push(this.createBullet({ x: -0.3, y: 0.95 }));
        bullets.push(this.createBullet({ x: 0, y: 1 }));
        bullets.push(this.createBullet({ x: 0.3, y: 0.95 }));
        break;
      case 'circle':
        // Bullets in a circle pattern
        const bulletCount = 8;
        for (let i = 0; i < bulletCount; i++) {
          const angle = (i / bulletCount) * Math.PI * 2;
          bullets.push(this.createBullet({
            x: Math.cos(angle),
            y: Math.sin(angle)
          }));
        }
        break;
      case 'spiral':
        // Spiral of bullets (will be controlled by the bullet pattern)
        for (let i = 0; i < 3; i++) {
          const angle = (this.movementTime * 2 + i * (Math.PI * 2 / 3)) % (Math.PI * 2);
          const bullet = this.createBullet({
            x: Math.cos(angle),
            y: Math.sin(angle)
          });
          bullet.pattern = 'spiral';
          bullets.push(bullet);
        }
        break;
    }
    
    return bullets;
  }
  
  private createBullet(velocity: Vector2D): Bullet {
    // Normalize velocity
    const magnitude = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
    velocity.x /= magnitude;
    velocity.y /= magnitude;
    
    // Create bullet
    return new Bullet({
      position: { x: this.position.x, y: this.position.y + this.size / 2 },
      velocity,
      radius: 4, // Size of the bullet
      damage: this.bulletDamage,
      speed: this.bulletSpeed,
      isPlayerBullet: false,
      lifespan: 5, // 5 seconds lifespan
    });
  }
  
  takeDamage(amount: number): void {
    this.health -= amount;
    if (this.health <= 0) {
      this.active = false;
    }
  }
  
  render(ctx: CanvasRenderingContext2D): void {
    // Draw the sprite
    this.sprite.render(ctx, this.position.x, this.position.y);
    
    // Draw health bar for boss type enemies
    if (this.type === 'boss') {
      const healthBarWidth = this.size;
      const healthBarHeight = 6;
      const healthPercentage = this.health / this.maxHealth;
      
      // Background of health bar
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(
        this.position.x - healthBarWidth / 2,
        this.position.y - this.size / 2 - 15,
        healthBarWidth,
        healthBarHeight
      );
      
      // Health bar fill
      ctx.fillStyle = '#FF3366';
      ctx.fillRect(
        this.position.x - healthBarWidth / 2,
        this.position.y - this.size / 2 - 15,
        healthBarWidth * healthPercentage,
        healthBarHeight
      );
    }
  }
  
  // Check if enemy is outside bottom of the canvas
  isOutOfBounds(canvasHeight: number): boolean {
    return this.position.y > canvasHeight + this.size;
  }
}
