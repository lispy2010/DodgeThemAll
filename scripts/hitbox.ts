// Hitbox class (hitbox.ts)
// Hitboxes are used to check if two objects collided with each other.

class Hitbox {
    x: number; y: number; w: number; h: number;

    constructor(x: number, y: number, w: number, h: number) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    intersects(other: Hitbox): boolean {
        return !(other.x > this.x + this.w || 
            other.x + other.w < this.x || 
            other.y > this.y + this.h ||
            other.y + other.h < this.y);
    }
}