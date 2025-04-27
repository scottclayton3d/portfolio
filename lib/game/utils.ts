// Vector operations for game entities
export interface Vector2D {
    x: number;
    y: number;
  }
  
  export function normalizeVector(vector: Vector2D): Vector2D {
    const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    
    if (magnitude === 0) {
      return { x: 0, y: 0 };
    }
    
    return {
      x: vector.x / magnitude,
      y: vector.y / magnitude
    };
  }
  
  export function vectorDistance(v1: Vector2D, v2: Vector2D): number {
    const dx = v1.x - v2.x;
    const dy = v1.y - v2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  // Generate unique IDs for game entities
  export function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
  
  // Utility function to check collision between two circles
  export function circleCollision(
    pos1: Vector2D,
    radius1: number,
    pos2: Vector2D,
    radius2: number
  ): boolean {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    return distance < radius1 + radius2;
  }
  
  // Linear interpolation function
  export function lerp(start: number, end: number, amt: number): number {
    return (1 - amt) * start + amt * end;
  }
  
  // Clamp value between min and max
  export function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }
  
  // Convert degrees to radians
  export function degToRad(degrees: number): number {
    return degrees * Math.PI / 180;
  }
  
  // Convert radians to degrees
  export function radToDeg(radians: number): number {
    return radians * 180 / Math.PI;
  }
  
  // Get angle between two points
  export function angleBetweenPoints(p1: Vector2D, p2: Vector2D): number {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
  }
  
  // Get random integer between min and max (inclusive)
  export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  // Get random from array
  export function randomFromArray<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }
  