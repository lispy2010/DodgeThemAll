// Enemy file (enemy.ts)
// This file contains all enemy classes, including the main Enemy class.
// Enemies will hurt the player.

// Enemy class.
// This class is a parent for all enemy implementations.
abstract class Enemy {
    x: number; y: number; velX: number; velY: number;
    trails: Trail[]; // Array for trail segments

    constructor(x: number, y: number) {
        this.x = x + 32;
        this.y = y + 32;
        this.velX = 0;
        this.velY = 0;
        this.trails = [];
    }

    abstract draw(): void;
    abstract update(player: Player): void; // The player parameter is for enemies that need player's position.

    // This method is for updating that is fixed for all enemies.
    fixedUpdate(): void {

    }

    get hitbox(): Hitbox {
        return new Hitbox(this.x, this.y, 16, 16);
    }
}

// Basic enemy class.
// Basic enemy moves around the leve, changing its direction when hitting walls.
class BasicEnemy extends Enemy {
    constructor(x: number, y: number) {
        super(x, y);

        // Set random speed
        this.velX = [-5, 5][Math.floor(Math.random() * 2)];
        this.velY = [-5, 5][Math.floor(Math.random() * 2)];
    }

    draw(): void {
        if (options.showTrail) {
            // Draw trail segments
            this.trails.forEach(t => {
                t.draw();
            });
        }

        // Draw enemy
        ctx.fillStyle = "red";  
        ctx.fillRect(this.x, this.y, 16, 16);
    }

    update(_: Player): void {
        // Move
        this.x += this.velX;
        this.y += this.velY;

        // If hit left or right of the screen, go in the opposite X direction
        if (this.x < 0 || this.x > canvas.width - 30) {
            this.velX *= -1;
            // Create particle effect with speed as an object that contains x and y values
            // make its life 120, color red, and size  between 1 and 6
            // create 5 particles
            for (let i = 0; i < 5; i++) {
                particles.push(new Particle(this.x, this.y, { x: Math.random() * 6 - 3, y: Math.random() * 6 - 3 }, Math.floor(Math.random() * 6) + 1, {
                    r: 255, g: 0, b: 0
                }, 120));
            }
        }

        // If hit bottom or top of the screen, go in the opposite Y direction
        if (this.y < 0 || this.y > canvas.height - 48) {
            this.velY *= -1;
            // Create particle effect with speed as an object that contains x and y values
            // make its life 120, color red, and size  between 1 and 6
            // create 5 particles
            for (let i = 0; i < 5; i++) {
                particles.push(new Particle(this.x, this.y, { x: Math.random() * 6 - 3, y: Math.random() * 6 - 3 }, Math.floor(Math.random() * 6) + 1, {
                    r: 255,
                    g: 0,
                    b: 0
                }, 120));
            }
        }

        // Update trail segments
        this.trails.forEach((t, i) => {
            // If trail segment is transparent, remove it
            if (t.a <= 0) {
                this.trails.splice(i, 1);
            }
            t.update();
        });

        // Add a trail segment
        this.trails.push(new Trail(this.x, this.y, 16, 16, 255, 0, 0));

        // If options.showTrail is false, remove all trail segments
        if (!options.showTrail) {
            this.trails = [];
        }
    }
}

// Fast enemy class.
// Fast enemy is like basic enemy, but moves faster in the Y direction.
class FastEnemy extends Enemy {
    constructor(x: number, y: number) {
        super(x, y);
        this.velX = [-2, 2][Math.floor(Math.random() * 2)];
        this.velY = [-9, 9][Math.floor(Math.random() * 2)];
    }

    draw(): void {
        // If options.showTrail is true, draw trail segments
        if (options.showTrail) {
            // Draw trail segments
            this.trails.forEach(t => {
                t.draw();
            });
        }

        // Draw enemy
        ctx.fillStyle = "cyan";
        ctx.fillRect(this.x, this.y, 16, 16);
    }

    update(_: Player): void {
        // Move
        this.x += this.velX;
        this.y += this.velY;

        // If hit left or right side of the screen, go in the opposite X direction
        if (this.x < 0 || this.x > canvas.width - 30) {
            this.velX *= -1;
            // Create particle effect with speed as an object that contains x and y values
            // make its life 120, color cyan, and size  between 1 and 6
            // create 5 particles
            for (let i = 0; i < 5; i++) {
                particles.push(new Particle(this.x, this.y, { x: Math.random() * 6 - 3, y: Math.random() * 6 - 3 }, Math.floor(Math.random() * 6) + 1, {
                    r: 0,
                    g: 255,
                    b: 255
                }, 120));
            }
        }

        // If hit top or bottom of the screen, go in the opposite Y direction
        if (this.y < 0 || this.y > canvas.height - 48) {
            this.velY *= -1;
            // Create particle effect with speed as an object that contains x and y values
            // make its life 120, color cyan, and size  between 1 and 6
            // create 5 particles
            for (let i = 0; i < 5; i++) {
                particles.push(new Particle(this.x, this.y, { x: Math.random() * 6 - 3, y: Math.random() * 6 - 3 }, Math.floor(Math.random() * 6) + 1, {
                    r: 0,
                    g: 255,
                    b: 255
                }, 120));
            }
        }

        // Update trail segments
        this.trails.forEach((t, i) => {
            // If trail segment is transpaernt, remove it
            if (t.a <= 0) {
                this.trails.splice(i, 1);
            }
            t.update();
        });

        // Add a trail segment
        this.trails.push(new Trail(this.x, this.y, 16, 16, 0, 255, 255));

        // If options.showTrail is false, remove all trail segments
        if (!options.showTrail) {
            this.trails = [];
        }
    }
}

// Rainbow enemy class.
// Rainbow enemy bounces around, when it hits the ground, it jumps, when it hits a wall, it goes in the
// opposite X direction. It can also have inverted gravity.
class RainbowEnemy extends Enemy {
    colors = ["red", "orange", "yellow", "lime", "deepskyblue", "blue", "purple"];
    color: number;
    invertedGravity: boolean;

    constructor(x: number, y: number) {
        super(x, y);
        this.velX = [-5, 5][Math.floor(Math.random() * 2)];
        this.velY = 0;
        this.color = 0;

        // Enable inverted grabity with 50% chance
        this.invertedGravity = !Math.floor(Math.random() * 2);

        // Change color every 150 ms
        setInterval(() => {
            this.color++;

            // If color is out of bounds, go to red color
            if (this.color > this.colors.length - 1) {
                this.color = 0;
            }
        }, 150);
    }

    draw(): void {
        // If options.showTrail is true, draw trail segments
        if (options.showTrail) {
            // Draw trail segments
            this.trails.forEach(t => {
                t.draw();
            });
        }

        // Draw enemy
        ctx.fillStyle = this.colors[this.color];
        ctx.fillRect(this.x, this.y, 16, 16);
    }

    update(_: Player): void {
        // Move
        this.x += this.velX;
        this.y += this.velY;

        // Apply gravity
        this.velY += this.invertedGravity ? -.5 : .5;

        // If hit either of the walls, create particles
        if (this.x < 0 || this.x > canvas.width - 30 || this.y < 0 || this.y > canvas.height - 48) {
            // Create particle effect with speed as an object that contains x and y values
            // make its life 120, and size  between 1 and 6
            // create 5 particles
            // Set its color to color array at current color index
            for (let i = 0; i < 5; i++) {
                particles.push(new Particle(this.x, this.y, { x: Math.random() * 6 - 3, y: Math.random() * 6 - 3 }, Math.floor(Math.random() * 6) + 1, this.getColor(), 120));
            }
        }

        // If hit left or right side of the screen, go in the opposite X direction
        if (this.x < 0 || this.x > canvas.width - 30) {
            this.velX *= -1;
        }

        // If hit top or bottom of the screen, go in the opposite Y direction
        if (this.y < 0 || this.y > canvas.height - 48) {
            this.velY = this.invertedGravity? 19 : -19;
        }

        // If colliding with another rainbow enemy, invert gravity
        enemies.forEach(e => {
            if (e instanceof RainbowEnemy && e !== this && this.hitbox.intersects(e.hitbox)) {
                this.invertedGravity = !this.invertedGravity;
            }
        });

        // Update trail segments
        this.trails.forEach((t, i) => {
            // If trail segment is transparent, remove it
            if (t.a <= 0) {
                this.trails.splice(i, 1);
            }
            t.update();
        });

        // Add trail segment based on the color index
        if (this.color == 0) {
            this.trails.push(new Trail(this.x, this.y, 16, 16, 255, 0, 0));
        } else if (this.color == 1) {
            this.trails.push(new Trail(this.x, this.y, 16, 16, 255, 215, 0));
        } else if (this.color == 2) {
            this.trails.push(new Trail(this.x, this.y, 16, 16, 255, 255, 0));
        } else if (this.color == 3) {
            this.trails.push(new Trail(this.x, this.y, 16, 16, 0, 255, 0));
        } else if (this.color == 4) {
            this.trails.push(new Trail(this.x, this.y, 16, 16, 0, 191, 255));
        } else if (this.color == 5) {
            this.trails.push(new Trail(this.x, this.y, 16, 16, 0, 0, 255));
        } else if (this.color == 6) {
            this.trails.push(new Trail(this.x, this.y, 16, 16, 128, 0, 128));
        }

        // If options.showTrail is false, remove all trail segments
        if (!options.showTrail) {
            this.trails = [];
        }
    }

    getColor(): { r: number, g: number, b: number } {
        let col = this.colors[this.color];
        switch (col) {
            case "red":
                return { r: 255, g: 0, b: 0 };
            case "orange":
                return { r: 255, g: 165, b: 0 };
            case "yellow":
                return { r: 255, g: 255, b: 0 };
            case "lime":
                return { r: 0, g: 255, b: 0 };
            case "deepskyblue":
                return { r: 0, g: 191, b: 255 };
            case "blue":
                return { r: 0, g: 0, b: 255 };
            case "purple":
                return { r: 128, g: 0, b: 128 };
            default:
                return { r: 0, g: 0, b: 0 };
        }
    }
}

// Smart enemy class.
// Smart enemy follows the player.
class SmartEnemy extends Enemy {
    baseVelX: number;
    baseVelY: number;

    constructor(x: number, y: number) {
        super(x, y);
        // make base velocity be from 1 to 4
        this.baseVelX = Math.random() * 3 + 1;
        this.baseVelY = Math.random() * 3 + 1;
    }

    draw(): void {
        // If options.showTrail is true, draw trail segments
        if (options.showTrail) {
            // Draw trail segments
            this.trails.forEach(t => {
                t.draw();
            });
        }

        // Draw enemy
        ctx.fillStyle = "pink";
        ctx.fillRect(this.x, this.y, 16, 16);
    }

    update(player: Player): void {
        // Move
        this.x += this.velX;
        this.y += this.velY;

        // Calculate difference between enemy position and player position
        let diffX = this.x - player.x - 16;
        let diffY = this.y - player.y - 16;

        // Calculate distance between enemy position and player position
        let dist = Math.sqrt(((this.x - player.x) * (this.x - player.x) + (this.y - player.y) * (this.y - player.y)));

        // Use the difference and distance to move enemy to the player
        this.velX = (-1 / dist * diffX) * this.baseVelX;
        this.velY = (-1 / dist * diffY) * this.baseVelY;

        // Update trail segments
        this.trails.forEach((t, i) => {
            // If trail segment is transparent, remove it
            if (t.a <= 0) {
                this.trails.splice(i, 1);
            }
            t.update();
        });

        // Add trail segment
        this.trails.push(new Trail(this.x, this.y, 16, 16, 255, 192, 203));

        // If options.showTrail is false, remove all trail segments
        if (!options.showTrail) {
            this.trails = [];
        }
    }
}

// Slow enemy class.
// Slow enemy is like basic enemy but brown and slow.
class SlowEnemy extends Enemy {
    constructor(x: number, y: number) {
        super(x, y);

        // Set random speed
        this.velX = [-2, 2][Math.floor(Math.random() * 2)];
        this.velY = [-2, 2][Math.floor(Math.random() * 2)];
    }

    draw(): void {
        // If options.showTrail is true, draw trail segments
        if (options.showTrail) {
            // Draw trail segments
            this.trails.forEach(t => {
                t.draw();
            });
        }

        // Draw enemy
        ctx.fillStyle = "saddlebrown";  
        ctx.fillRect(this.x, this.y, 16, 16);
    }

    update(_: Player): void {
        // Move
        this.x += this.velX;
        this.y += this.velY;

        // If hit left or right of the screen, go in the opposite X direction
        if (this.x < 0 || this.x > canvas.width - 30) {
            this.velX *= -1;
            // Create particle effect with speed as an object that contains x and y values
            // make its life 120, color saddle brown, and size  between 1 and 6
            // create 5 particles
            for (let i = 0; i < 5; i++) {
                particles.push(new Particle(this.x, this.y, { x: Math.random() * 6 - 3, y: Math.random() * 6 - 3 }, Math.floor(Math.random() * 6) + 1, {
                    r: 139,
                    g: 69,
                    b: 19
                }, 120));
            }
        }

        // If hit bottom or top of the screen, go in the opposite Y direction
        if (this.y < 0 || this.y > canvas.height - 48) {
            this.velY *= -1;
            // Create particle effect with speed as an object that contains x and y values
            // make its life 120, color saddle brown, and size  between 1 and 6
            // create 5 particles
            for (let i = 0; i < 5; i++) {
                particles.push(new Particle(this.x, this.y, { x: Math.random() * 6 - 3, y: Math.random() * 6 - 3 }, Math.floor(Math.random() * 6) + 1, {
                    r: 139,
                    g: 69,
                    b: 19
                }, 120));
            }
        }

        // Update trail segments
        this.trails.forEach((t, i) => {
            // If trail segment is transparent, remove it
            if (t.a <= 0) {
                this.trails.splice(i, 1);
            }
            t.update();
        });

        // Add a trail segment
        this.trails.push(new Trail(this.x, this.y, 16, 16, 139, 69, 19));

        // If options.showTrail is false, remove all trail segments
        if (!options.showTrail) {
            this.trails = [];
        }
    }
}

// Custom enemy class.
// Custom enemy is the enemy that appears in the sandbox mode.
class CustomEnemy extends Enemy {
    r: number; g: number; b: number;

    constructor(x: number, y: number) {
        super(x, y);

        // Set random speed
        this.velX = [-5, 5][Math.floor(Math.random() * 2)];
        this.velY = [-5, 5][Math.floor(Math.random() * 2)];

        // Set initial color
        this.r = 255;
        this.g = 0;
        this.b = 0;
    }

    draw(): void {
        // If options.showTrails is true, draw trail segments
        if (options.showTrail) {
            // Draw trail segments
            this.trails.forEach(t => {
                t.draw();
            });
        }

        // Draw enemy
        ctx.fillStyle = `rgb(${this.r}, ${this.g}, ${this.b})`;
        ctx.fillRect(this.x, this.y, 16, 16);
    }

    update(_: Player): void {
        // Move
        this.x += this.velX;
        this.y += this.velY;

        // If hit left or right of the screen, go in the opposite X direction
        if (this.x < 34 || this.x > 280 - 20) {
            this.velX *= -1;
            // Create particle effect with speed as an object that contains x and y values
            // make its life 120, and size  between 1 and 6
            // create 5 particles
            // set its color to the enemy's color in rgb format
            for (let i = 0; i < 5; i++) {
                particles.push(new Particle(this.x, this.y, { x: Math.random() * 6 - 3, y: Math.random() * 6 - 3 }, Math.floor(Math.random() * 6) + 1, {
                    r: this.r,
                    g: this.g,
                    b: this.b                
                }, 120));
            }
        }

        // If hit bottom or top of the screen, go in the opposite Y direction
        if (this.y < 54 || this.y > 550 - 20) {
            this.velY *= -1;
            // Create particle effect with speed as an object that contains x and y values
            // make its life 120, and size  between 1 and 6
            // create 5 particles
            // set its color to the enemy's color in rgb format
            for (let i = 0; i < 5; i++) {
                particles.push(new Particle(this.x, this.y, { x: Math.random() * 6 - 3, y: Math.random() * 6 - 3 }, Math.floor(Math.random() * 6) + 1, {
                    r: this.r,
                    g: this.g,
                    b: this.b                
                }, 120));
            }
        }

        // Update trail segments
        this.trails.forEach((t, i) => {
            // If trail segment is transparent, remove it
            if (t.a <= 0) {
                this.trails.splice(i, 1);
            }
            t.update();
        });

        // Add a trail segment
        this.trails.push(new Trail(this.x, this.y, 16, 16, this.r, this.g, this.b));

        // If options.showTrail is false, remove all trail segments
        if (!options.showTrail) {
            this.trails = [];
        }
    }

    setVel(x: number, y: number) {
        // Set X velocity to negative, if it is less than 0, otherwise set it to positive
        if (this.velX < 0) {
            this.velX = -x;
        } else {
            this.velX = x;
        }

        // Set Y velocity to negative, if it is less than 0, otherwise set it to positive
        if (this.velY < 0) {
            this.velY = -y;
        } else {
            this.velY = y;
        }
    }

    setColor(r: number, g: number, b: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    reset(): void {
        this.r = 255;
        this.g = 0;
        this.b = 0;
        this.x = 100;
        this.y = 100;
        this.velX = 5;
        this.velY = 5;
    }
}

// Random enemy class.
// Random enemy sometimes updates its velocity and color.
// I don't think it is used in the game.
// It's a great example of how not to code.
class RandomEnemy extends Enemy {
    r: number; g: number; b: number;

    constructor(x: number, y: number) {
        super(x, y);

        this.randomizeSpeed();
        this.randomizeColor();
    }

    draw(): void {
        // Draw enemy
        ctx.fillStyle = `rgb(${this.r}, ${this.g}, ${this.b})`;
        ctx.fillRect(this.x, this.y, 16, 16);

        // If show trail from options variable is no, don't draw trail
        if (options.showTrail) {
            // Draw trail segments
            this.trails.forEach(t => {
                t.draw();
            });
        }
    }

    update(_: Player): void {
        // Move
        this.x += this.velX;
        this.y += this.velY;

        // If hit left or right of the screen, go in the opposite X direction
        if (this.x < 0 || this.x > canvas.width - 16) {
            this.randomizeColor();
            this.randomizeSpeed();

            this.velX *= -1;
            // Create particle effect with speed as an object that contains x and y values
            // make its life 120, and size  between 1 and 6
            // create 5 particles
            // set its color to the enemy's color in rgb format
            for (let i = 0; i < 5; i++) {
                particles.push(new Particle(this.x, this.y, { x: Math.random() * 6 - 3, y: Math.random() * 6 - 3 }, Math.floor(Math.random() * 6) + 1, {
                    r: this.r,
                    g: this.g,
                    b: this.b
                }, 120));
            }
        }

        // If hit bottom or top of the screen, go in the opposite Y direction
        if (this.y < 0 || this.y > canvas.height - 20) {
            this.randomizeColor();
            this.randomizeSpeed();

            this.velY *= -1;
            // Create particle effect with speed as an object that contains x and y values
            // make its life 120, and size  between 1 and 6
            // create 5 particles
            // set its color to the enemy's color in rgb format
            for (let i = 0; i < 5; i++) {
                particles.push(new Particle(this.x, this.y, { x: Math.random() * 6 - 3, y: Math.random() * 6 - 3 }, Math.floor(Math.random() * 6) + 1, {
                    r: this.r,
                    g: this.g,
                    b: this.b
                }, 120));
            }
        }

        // Randomize color and speed every sometimes
        if (Math.random() < 0.01) {
            this.randomizeColor();
            this.randomizeSpeed();
        }

        // Update trail segments
        this.trails.forEach((t, i) => {
            // If trail segment is transparent, remove it
            if (t.a <= 0) {
                this.trails.splice(i, 1);
            }
            t.update();
        });

        // Add a trail segment
        this.trails.push(new Trail(this.x, this.y, 16, 16, this.r, this.g, this.b));

        // If options.showTrail is false, remove all trail segments
        if (!options.showTrail) {
            this.trails = [];
        }
    }

    randomizeColor(): void {
        // Set random color
        this.r = Math.floor(Math.random() * 255);
        this.g = Math.floor(Math.random() * 255);
        this.b = Math.floor(Math.random() * 255);
    }

    randomizeSpeed(): void {
        // Set random speed
        // Set X velocity to negative, if it is less than 0, otherwise set it to positive
        if (this.velX < 0) {
            this.velX = -Math.floor(Math.random() * 7);
        } else {
            this.velX = Math.floor(Math.random() * 7);
        }

        // Set Y velocity to negative, if it is less than 0, otherwise set it to positive
        if (this.velY < 0) {
            this.velY = -Math.floor(Math.random() * 7);
        } else {
            this.velY = Math.floor(Math.random() * 7);
        }
    }
}

// Walking enemy class.
// Walking enemy has a point to walk to.
// He does not care about the player.
// He moves towards the point.
// And that is all.
class WalkingEnemy extends Enemy {
    point: {x: number, y: number};

    constructor(x: number, y: number) {
        super(x, y);
        this.randomizePoint();
    }

    draw(): void {
        // Draw enemy
        ctx.fillStyle = "green";
        ctx.fillRect(this.x, this.y, 16, 16);

        // If show trail from options variable is no, don't draw trail
        if (options.showTrail) {
            // Draw trail segments
            this.trails.forEach(t => {
                t.draw();
            });
        }
    }

    update(_: Player): void {
        // Move
        this.x += this.velX;
        this.y += this.velY;

        // If we reached the point, set a new point
        if (this.hitbox.intersects(new Hitbox(this.point.x, this.point.y, 4, 4))) {
            this.randomizePoint();
        }

        // Move towards the point
        if (this.x < this.point.x) {
            this.velX = 2;
        } else if (this.x > this.point.x) {
            this.velX = -2;
        } else {
            this.velX = 0;
        }

        if (this.y < this.point.y) {
            this.velY = 2;
        } else if (this.y > this.point.y) {
            this.velY = -2;
        } else {
            this.velY = 0;
        }

        // Update trail segments
        this.trails.forEach((t, i) => {
            // If trail segment is transparent, remove it
            if (t.a <= 0) {
                this.trails.splice(i, 1);
            }
            t.update();
        });

        // Add a trail segment
        this.trails.push(new Trail(this.x, this.y, 16, 16, 0, 255, 0));

        // If options.showTrail is false, remove all trail segments
        if (!options.showTrail) {
            this.trails = [];
        }
    }

    randomizePoint(): void {
        this.point = {
            x: Math.floor(Math.random() * canvas.width),
            y: Math.floor(Math.random() * canvas.height)
        };
    }
}

// Boss enemy bullet class.
// Boss enemy bullets are fired by the boss.
// They move in a straight line.
// They are orange.
// They despawn when they fall off the screen.
// They fall down with some X velocity.
// They are gray.
class BossEnemyBullet extends Enemy {
    constructor(x: number, y: number) {
        super(x, y);
        this.velX = Math.floor(Math.random() * 3) - 1;
        this.velY = 10;
    }

    draw(): void {
        // Draw trail segments
        this.trails.forEach(t => {
            t.draw();
        });

        // Draw bullet
        ctx.fillStyle = "orange";
        ctx.fillRect(this.x, this.y, 12, 12);
    }

    update(_: Player): void {
        // Move
        this.x += this.velX;
        this.y += this.velY;

        // If we reached the bottom of the screen, remove this bullet
        if (this.y > canvas.height + 16) {
            // Create particle effect with speed as an object that contains x and y values
            // make its life 120, and size  between 1 and 6
            // create 5 particles
            // set its color to 255, 160, 0 in rgb format
            for (let i = 0; i < 7; i++) {
                particles.push(new Particle(this.x, this.y, { x: Math.random() * 6 - 3, y: Math.random() * 6 - 3 }, Math.floor(Math.random() * 6) + 1, {
                    r: 255,
                    g: 160,
                    b: 0
                }, 120));
            }
            enemies.splice(enemies.indexOf(this), 1);
        }

        // Update trail segments
        this.trails.forEach((t, i) => {
            // If trail segment is transparent, remove it
            if (t.a <= 0) {
                this.trails.splice(i, 1);
            }
            t.update();
        });

        // Add a trail segment
        this.trails.push(new Trail(this.x, this.y, 12, 12, 255, 160, 0));
    }

    get hitbox(): Hitbox {
        return new Hitbox(this.x, this.y, 12, 12);
    }
}

// Boss enemy class.
// Boss enemy goes back and forth horizontally.
// He disappears after a certain amount of time.
// Boss enemy shoots bullets.
// He is red and big - 128 x 128.
class BossEnemy extends Enemy {
    // Time since last shot
    timeSinceLastShot: number = 0;
    startLevel: number;

    cutscene: boolean;

    constructor() {
        super(100, -128);
        this.velX = 10;
        this.velY = 3;
        this.startLevel = level;
        this.cutscene = true;

        setTimeout(() => {
            this.velY = 0;

            setTimeout(() => {
                this.cutscene = false;
            }, 500);
        }, 1000);
    }

    draw(): void {
        // Draw enemy
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, 128, 128);

        // If show trail from options variable is no, don't draw trail
        if (options.showTrail) {
            // Draw trail segments
            this.trails.forEach(t => {
                t.draw();
            });
        }
    }

    update(_: Player): void {
        if (level > this.startLevel) {
            // Explode into particles, shake and remove boss
            for (let i = 0; i < 50; i++) {
                particles.push(new Particle(this.x, this.y, { x: Math.random() * 20 - 3, y: Math.random() * 20 - 3 }, Math.floor(Math.random() * 15) + 1, {
                    r: 255,
                    g: 0,
                    b: 0
                }, 120));
            }
            sndBossDie.play();
            enemies.splice(enemies.indexOf(this), 1);
            shakeScreen(190);
            return;
        }

        if (this.cutscene) {
            this.y += this.velY;
        } else {
            // Move
            this.x += this.velX;

            // If we reached the left or right edge of the screen, reverse direction
            if (this.x < 0 || this.x > canvas.width - 64) {
                this.velX *= -1;
                // Spawn particles
                for (let i = 0; i < 10; i++) {
                    particles.push(new Particle(this.x + 64, this.y + 64, { x: Math.random() * 6 - 3, y: Math.random() * 6 - 3 }, Math.floor(Math.random() * 12) + 1, {
                        r: 255,
                        g: 0,
                        b: 0
                    }, 120));
                }
                sndBossBoom.play();
                shakeScreen(50);
            }

            // Update time since last shot
            this.timeSinceLastShot++;

            // If time since last shot is greater than or equal to 1000, shoot a bullet
            if (this.timeSinceLastShot >= 25) {
                this.timeSinceLastShot = 0;
                enemies.push(new BossEnemyBullet(this.x + 64, this.y + 64));
            }
        }

        // Update trail segments
        this.trails.forEach((t, i) => {
            // If trail segment is transparent, remove it
            if (t.a <= 0) {
                this.trails.splice(i, 1);
            }
            t.update();
        });

        // Add a trail segment
        this.trails.push(new Trail(this.x, this.y, 128, 128, 255, 0, 0));

        // If options.showTrail is false, remove all trail segments
        if (!options.showTrail) {
            this.trails = [];
        }
    }

    get hitbox(): Hitbox {
        return new Hitbox(this.x, this.y, 128, 128);
    }
}

// Snake enemy class.
// Snake enemy moves in a sine wave.
// They are purple.
class SnakeEnemy extends Enemy {
    waviness: number;

    constructor(x: number, y: number) {
        super(x, y);
        // X Speed is between 4 and 7
        this.velX = Math.floor(Math.random() * 5) + 4;

        this.velY = 0;

        // Make waviness from 3 to 10
        this.waviness = Math.floor(Math.random() * 7) + 3;
    }

    draw(): void {
        // Draw trail segments
        this.trails.forEach(t => {
            t.draw();
        });

        // Draw enemy
        ctx.fillStyle = "purple";
        ctx.fillRect(this.x, this.y, 16, 16);
    }

    update(_: Player): void {
        // Move
        this.x += this.velX;
        this.y += this.velY;

        // Update Y velocity to be a sine wave
        this.velY = Math.sin(this.x / 30) * this.waviness;

        // If we reached the left or right edge of the screen, reverse direction
        if (this.x < 0 || this.x > canvas.width - 16) {
            this.velX *= -1;
        }

        // If we reached the top or bottom edge of the screen, reverse direction
        if (this.y > canvas.height - 16) {
            this.y = -16;
        }

        // Update trail segments
        this.trails.forEach((t, i) => {
            // If trail segment is transparent, remove it
            if (t.a <= 0) {
                this.trails.splice(i, 1);
            }
            t.update();
        });

        // Add a trail segment
        this.trails.push(new Trail(this.x, this.y, 16, 16, 128, 0, 128));
    }
}