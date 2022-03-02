// Particle class (particle.ts).
// Particle is a visual effect that is displayed on the screen.
// Particles don't have a physical presence, they are just visual.

class Particle {
    x: number; y: number; speed: {x: number, y: number}; size: number;
    life: number; r: number; g: number; b: number; a: number;

    // Constructor
    // It can have a position, speed, size, color, and life.
    // Particle is a square.
    constructor(x: number, y: number, speed: {x: number, y: number}, size: number, color: {r: number, g: number, b: number}, life: number) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.size = size;
        this.life = life;

        this.a = 1;

        // Get the color from the color object.
        this.r = color.r;
        this.g = color.g;
        this.b = color.b;
    }

    // Draw method
    draw() {

        // Draw the particle.
        ctx.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }

    // Update method
    update(pa?: Particle[]) {
        // Update the particle.
        this.x += this.speed.x;
        this.y += this.speed.y;
        this.life--;

        // If the particle is dead, remove it from the array.
        if (this.life <= 0) {
            // If pa is passed, remove the particle from the array.
            if (pa) {
                pa.splice(pa.indexOf(this), 1);
            } else {
                // If pa is not passed, remove the particle from the main array.
                particles.splice(particles.indexOf(this), 1);
            }
        }

        // Reduce the opacity of the particle.
        this.a -= .02;
    }
}