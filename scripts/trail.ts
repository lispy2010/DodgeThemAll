// Trail class (trail.ts)
// Trail is a visual effect that will slowly disappear. It can have different colors.

class Trail {
    x: number; y: number; w: number; h: number; r: number; g: number; b: number; a: number;

    constructor(x: number, y: number, w: number, h: number, r: number, g: number, b: number) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = 1;
    }

    draw(): void {
        // Draw trail
        ctx.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }

    update(): void {
        // Make trail slowly disappear by decreasing its opacity
        this.a -= .05;
    }
}