import { Vector2D } from './utils';       
import { Sprite } from './sprite';

export interface BulletOptions {
  position: Vector2D;
  velocity: Vector2D;
  radius: number;
  damage: number;
  speed: number;
  isPlayerBullet: boolean;
  lifespan?: number; // Optional lifespan in seconds (for auto-destruction)
  pattern?: string; // For special bullet patterns
  color?: string; // Optional custom color
}

export class Bullet {
  position: Vector2D;
  velocity: Vector2D;
  radius: number;
  damage: number;
  speed: number;
  isPlayerBullet: boolean;
  active: boolean = true;
  lifespan: number | null;
  elapsedTime: number = 0;
  pattern: string | undefined;
  color: string;
  sprite: Sprite;
  id: string;
  
  constructor(options: BulletOptions) {
    this.position = { ...options.position };
    this.velocity = { ...options.velocity };
    this.radius = options.radius;
    this.damage = options.damage;
    this.speed = options.speed;
    this.isPlayerBullet = options.isPlayerBullet;
    this.lifespan = options.lifespan || null;
    this.pattern = options.pattern;
    this.color = options.color || (this.isPlayerBullet ? '#00FFFF' : '#FF3366');
    this.id = `bullet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Set sprite based on bullet type
    this.sprite = new Sprite(
      this.isPlayerBullet ? "#player-bullet" : "#enemy-bullet",
      { width: this.radius * 2, height: this.radius * 2 }
    );
  }
  
  update(deltaTime: number): void {
    // Update position based on velocity and speed
    this.position.x += this.velocity.x * this.speed * deltaTime;
    this.position.y += this.velocity.y * this.speed * deltaTime;
    
    // Update lifespan if set
    if (this.lifespan !== null) {
      this.elapsedTime += deltaTime;
      if (this.elapsedTime >= this.lifespan) {
        this.active = false;
      }
    }
    
    // Apply pattern-specific behavior
    if (this.pattern === 'spiral') {
      // Rotate the velocity to create a spiral pattern
      const rotationSpeed = 2; // Radians per second
      const oldVx = this.velocity.x;
      const oldVy = this.velocity.y;
      
      this.velocity.x = oldVx * Math.cos(rotationSpeed * deltaTime) - oldVy * Math.sin(rotationSpeed * deltaTime);
      this.velocity.y = oldVx * Math.sin(rotationSpeed * deltaTime) + oldVy * Math.cos(rotationSpeed * deltaTime);
      
      // Normalize velocity to maintain constant speed
      const magnitude = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
      this.velocity.x /= magnitude;
      this.velocity.y /= magnitude;
    }
    else if (this.pattern === 'sin') {
      // Sine wave pattern - modifies the x velocity based on time
      this.velocity.x = Math.sin(this.elapsedTime * 5) * 0.5;
      // Keep y velocity constant for forward movement
      this.velocity.y = this.isPlayerBullet ? -1 : 1;
      
      // Normalize velocity
      const magnitude = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
      this.velocity.x /= magnitude;
      this.velocity.y /= magnitude;
    }
  }
  
  render(ctx: CanvasRenderingContext2D): void {
    // Draw the sprite
    this.sprite.render(ctx, this.position.x, this.position.y);
  }
  
  // Check if the bullet is outside the canvas bounds
  isOutOfBounds(canvasWidth: number, canvasHeight: number): boolean {
    return (
      this.position.x < -this.radius ||
      this.position.x > canvasWidth + this.radius ||
      this.position.y < -this.radius ||
      this.position.y > canvasHeight + this.radius
    );
  }
}
