// Background effect class (bgeffect.ts)
// Background effect is a visual effect that is displayed behind the game.
// Background effect is maroon.

class BackgroundEffect {
    particles: Particle[];

    constructor() {
        this.particles = [];

        // Add new particles every sometimes
        setInterval(() => {
            for (let i = 0; i < 5; i++) {
                this.particles.push(new Particle(
                    Math.random() * canvas.width,
                    Math.random() * canvas.height,
                    { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 },
                    Math.random() * 5 + 2,
                    { r: 60, g: 60, b: 60 },
                    100
                ));
            }
        }, 200);
    }

    draw(): void {
        // Draw particles
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].draw();
        }
    }

    update(): void {
        // Update particles
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update(this.particles);
        }
    }
}