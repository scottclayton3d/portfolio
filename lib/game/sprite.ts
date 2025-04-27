export interface SpriteSize {
    width: number;
    height: number;
  }
  
  export class Sprite {
    private svgId: string;
    private width: number;
    private height: number;
    private rotation: number = 0; // In radians
    
    constructor(svgId: string, size: SpriteSize, rotation: number = 0) {
      this.svgId = svgId;
      this.width = size.width;
      this.height = size.height;
      this.rotation = rotation;
    }
    
    render(ctx: CanvasRenderingContext2D, x: number, y: number): void {
      // Save current context state
      ctx.save();
      
      // Move to the center position
      ctx.translate(x, y);
      
      // Apply rotation if needed
      if (this.rotation !== 0) {
        ctx.rotate(this.rotation);
      }
      
      try {
        // Get the SVG element and render it (if exists)
        const svgElement = document.querySelector(this.svgId) as SVGElement;
        
        if (svgElement) {
          // Create a temporary SVG image
          const svgData = new XMLSerializer().serializeToString(svgElement);
          const img = new Image();
          
          // Use a data URL to draw the SVG
          const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(svgBlob);
          
          // Draw the image directly (this is synchronous, no need to wait for onload)
          const existingImage = ctx.createImageData(this.width, this.height);
          
          // For pixel art style, draw using primitive shapes based on the SVG ID
          if (this.svgId === '#player-ship') {
            this.drawPlayerShip(ctx);
          } else if (this.svgId === '#player-bullet') {
            this.drawPlayerBullet(ctx);
          } else if (this.svgId === '#enemy-standard') {
            this.drawEnemyStandard(ctx);
          } else if (this.svgId === '#enemy-spinner') {
            this.drawEnemySpinner(ctx);
          } else if (this.svgId === '#enemy-boss') {
            this.drawEnemyBoss(ctx);
          } else if (this.svgId === '#enemy-bullet') {
            this.drawEnemyBullet(ctx);
          } else if (this.svgId === '#explosion') {
            this.drawExplosion(ctx);
          } else {
            // Draw a fallback shape
            ctx.fillStyle = '#FF3366';
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
          }
          
          // Clean up the URL.createObjectURL
          URL.revokeObjectURL(url);
        } else {
          console.warn(`SVG element not found: ${this.svgId}`);
          // Draw a fallback rectangle
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        }
      } catch (error) {
        console.error('Error rendering sprite:', error);
        // Fallback rendering
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
      }
      
      // Restore context state
      ctx.restore();
    }
    
    private drawPlayerShip(ctx: CanvasRenderingContext2D): void {
      const w = this.width / 2;
      const h = this.height / 2;
      
      // Draw ship body
      ctx.fillStyle = '#FF3366';
      ctx.beginPath();
      ctx.moveTo(0, -h);
      ctx.lineTo(-w, h);
      ctx.lineTo(0, h / 2);
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();
      
      // Draw ship outline
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw engine
      ctx.fillStyle = '#00FFFF';
      ctx.beginPath();
      ctx.arc(0, 0, w / 3, 0, Math.PI * 2);
      ctx.fill();
    }
    
    private drawPlayerBullet(ctx: CanvasRenderingContext2D): void {
      // Draw bullet
      ctx.fillStyle = '#00FFFF';
      ctx.beginPath();
      ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw bullet outline
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    
    private drawEnemyStandard(ctx: CanvasRenderingContext2D): void {
      const w = this.width / 2;
      const h = this.height / 2;
      
      // Draw enemy body
      ctx.fillStyle = '#FF3366';
      ctx.fillRect(-w, -h, this.width, this.height);
      
      // Draw enemy outline
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.strokeRect(-w, -h, this.width, this.height);
      
      // Draw eyes
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(-w / 2, -h / 2, w / 4, 0, Math.PI * 2);
      ctx.arc(w / 2, -h / 2, w / 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw mouth
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-w / 2, h / 2);
      ctx.lineTo(w / 2, h / 2);
      ctx.stroke();
    }
    
    private drawEnemySpinner(ctx: CanvasRenderingContext2D): void {
      const r = this.width / 2;
      
      // Draw enemy body
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw enemy outline
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw cross
      ctx.strokeStyle = '#FF3366';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(0, r);
      ctx.moveTo(-r, 0);
      ctx.lineTo(r, 0);
      ctx.stroke();
      
      // Rotate the sprite over time
      this.rotation += 0.01;
    }
    
    private drawEnemyBoss(ctx: CanvasRenderingContext2D): void {
      const r = this.width / 2;
      
      // Draw boss body
      ctx.fillStyle = '#FF3366';
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(r * 0.7, -r * 0.3);
      ctx.lineTo(r, r * 0.5);
      ctx.lineTo(0, r);
      ctx.lineTo(-r, r * 0.5);
      ctx.lineTo(-r * 0.7, -r * 0.3);
      ctx.closePath();
      ctx.fill();
      
      // Draw boss outline
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw center
      ctx.fillStyle = '#00FFFF';
      ctx.beginPath();
      ctx.arc(0, 0, r / 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw eyes
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(-r / 4, -r / 4, r / 8, 0, Math.PI * 2);
      ctx.arc(r / 4, -r / 4, r / 8, 0, Math.PI * 2);
      ctx.fill();
    }
    
    private drawEnemyBullet(ctx: CanvasRenderingContext2D): void {
      // Draw bullet
      ctx.fillStyle = '#FF3366';
      ctx.beginPath();
      ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw bullet outline
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    
    private drawExplosion(ctx: CanvasRenderingContext2D): void {
      const r = this.width / 2;
      
      // Draw outer explosion
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw inner explosion
      ctx.fillStyle = '#FF3366';
      ctx.beginPath();
      ctx.arc(0, 0, r / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  