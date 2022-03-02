// Player class (player.ts).
// This file stores the player class.

class Player {
    x: number; y: number; startX: number; startY: number; velX: number; velY: number; hp: number;
    trails: Trail[];
    canBeHit: boolean; gameOver: boolean;
    move: {
        left: boolean,
        right: boolean,
        up: boolean,
        down: boolean,
    };
    skin: HTMLImageElement;

    // Skin vars
    skinCreeperColor: boolean; // if true then green else black
    skinRainbowColorIndex: number;
    skinRainbowColors: {r: number; g: number; b: number}[];

    constructor(x: number, y: number) {
        // Initialize position
        this.x = x;
        this.y = y;

        // Initialize start position
        this.startX = this.x;
        this.startY = this.y;

        // Initialize velocity
        this.velX = 0;
        this.velY = 0;

        // Trail array
        this.trails = [];

        // Health-related variables
        this.hp = 100;
        this.canBeHit = true;

        // Initialize move variable
        this.move = {
            left: false,
            right: false,
            up: false,
            down: false,
        };

        // Initialize skin
        this.skin = skins.default;

        // Skin vars
        this.skinCreeperColor = false;
        this.skinRainbowColorIndex = 0;

        this.skinRainbowColors = [
            {r: 255, g: 0, b: 0},
            {r: 255, g: 165, b: 0},
            {r: 255, g: 255, b: 0},
            {r: 0, g: 255, b: 0},
            {r: 0, g: 255, b: 255},
            {r: 0, g: 0, b: 255},
            {r: 255, g: 0, b: 255}
        ];

        setInterval(() => {
            this.skinCreeperColor = !this.skinCreeperColor;
        }, 500);

        setInterval(() => {
            this.skinRainbowColorIndex++;

            if (this.skinRainbowColorIndex >= this.skinRainbowColors.length) {
                this.skinRainbowColorIndex = 0;
            }
        }, 150);

        // Key down event
        document.addEventListener("keydown", ev => {
            if (ev.key === "ArrowLeft" || ev.key === "a") {
                this.move.left = true;
            }
            if (ev.key === "ArrowRight" || ev.key === "d") {
                this.move.right = true;
            }
            if (ev.key === "ArrowUp" || ev.key === "w") {
                this.move.up = true;
            }
            if (ev.key === "ArrowDown" || ev.key === "s") {
                this.move.down = true;
            }

            // Disable keys for debugging if game is not in beta
            if (!beta) {
                return;
            }

            // Keys for debugging
            if (ev.key === "F3") {
                enemies.forEach(e => {
                    e.x = this.x;
                    e.y = this.y;
                });
            }
            if (ev.key === "F4") {
                score = nextLevel;
            }
            if (ev.key === "F5") {
                this.hp = 0;
            }
            if (ev.key === "F6")
            {
                // add coin
                coins.push(new Coin(Math.random() * (canvas.width - 32), Math.random() * (canvas.height - 32)));
            }
            if (ev.key === "F7") {
                // Spawn some smart enemies with some space between them
                for (let i = 0; i < 5; i++) {
                    enemies.push(new SmartEnemy(50 + i * 20, 100));
                }
            }
            if (ev.key === "F8") {
                // Get infinite coins
                coinCount = Infinity;
            }
            if (ev.key == "F9") {
                // Spawn some walking enemy
                enemies.push(new WalkingEnemy(50, 100));
            }
            if (ev.key == "F10") {
                // Spawn some boss enemy
                enemies.push(new BossEnemy(50, 100));
            }
        });

        // Key release event
        document.addEventListener("keyup", ev => {
            if (ev.key === "ArrowLeft" || ev.key === "a") {
                this.move.left = false;
            }
            if (ev.key === "ArrowRight" || ev.key === "d") {
                this.move.right = false;
            }

            if (ev.key === "ArrowUp" || ev.key === "w") {
                this.move.up = false;
            }
            if (ev.key === "ArrowDown" || ev.key === "s") {
                this.move.down = false;
            }
        });
    }

    draw(): void {
        // Don't draw anything if game is over
        if (this.gameOver) {
            return;
        }

        // If options.showTrail is true, draw trail
        if (options.showTrail) {
            // Draw trail segments
            this.trails.forEach(t => {
                t.draw();
            });
        }

        // Draw player
        ctx.drawImage(this.skin, this.x, this.y);

        // Draw HUD
        // Draw health bar background
        ctx.fillStyle = "gray";
        ctx.fillRect(10, 10, 200, 20);

        // Draw health bar fill
        ctx.fillStyle = "lime";
        ctx.fillRect(10, 10, this.hp * 2, 20);

        // Draw health bar outline
        ctx.strokeStyle = "yellow";
        ctx.strokeRect(10, 10, 200, 20);
        ctx.strokeRect(9, 9, 202, 22);

        // Show how much health player has
        ctx.fillStyle = "yellow";
        ctx.font = "8px press-start";
        ctx.fillText(`${this.hp}`, 220, 25);

        // Show score
        ctx.font = "10px press-start";
        ctx.fillText(`${lang[options.lang].score} ${score}`, 10, 60);

        // Show level
        ctx.fillText(`${lang[options.lang].level} ${level}`, 10, 79);

        // Show next level
        ctx.fillText(`${lang[options.lang].nextLevelp1} ${nextLevel} ${lang[options.lang].nextLevelp2}`, 10, 98);
    
        // Show coin count
        ctx.fillText(`${lang[options.lang].coins} ${coinCount}`, 10, 117);
    }

    update(): void {
        // Don't update the player if game is over
        if (this.gameOver) {
            return;
        }

        // Check if hp is 0, and if it is, game is over
        if (this.hp === 0 && !this.gameOver) {
            this.gameOver = true;
            sndGameOver.play();
        }

        // Keep health inside of boundaries from 0 to 100
        this.hp = Math.min(this.hp, 100);
        this.hp = Math.max(this.hp, 0);

        // Update score and level
        score++;
        scoreTotal++;
        if (score > nextLevel) {
            nextLevel += 250;
            score = 0;
            level++;
            screenFlashAlpha = .8;
            spawnEnemy();
            sndNextLevel.play();
        }

        // Move horizontally
        if (this.move.left) {
            this.velX = -5;
        }
        if (this.move.right) {
            this.velX = 5;
        }
        if ((!this.move.left && !this.move.right) || (this.move.left && this.move.right)) {
            this.velX = 0;
        }

        // Move vertically
        if (this.move.up) {
            this.velY = -5;
        }
        if (this.move.down) {
            this.velY = 5;
        }
        if ((!this.move.up && !this.move.down) || (this.move.up && this.move.down)) {
            this.velY = 0;
        }

        // Apply movement
        this.x += this.velX;
        this.y += this.velY;

        // Check for collision with enemies
        enemies.forEach(e => {
            // If colliding with enemy and player is not invincible
            if (e.hitbox.intersects(this.hitbox) && this.canBeHit) {
                // If enemy doesn't intersect with inner hitbox and it isn't SmartEnemy, hurt player and
                // shake the screen
                if (!e.hitbox.intersects(this.hitboxInner) || e instanceof SmartEnemy || e instanceof BossEnemy) {
                    this.hp -= 3;
                    e.velX *= -1;
                    e.velY *= -1;
                    sndHurt.play();
                    shakeScreen();

                    // Create particle effect
                    for (let i = 0; i < 5; i++) {
                        particles.push(new Particle(this.x, this.y, {
                            x: Math.random() * 8 - 4,
                            y: Math.random() * 8 - 4
                        }, Math.random() * 6 + 1, {r: 255, g: 255, b: 255}, 120));
                    }

                    // Make player invincible for 400 ms
                    this.canBeHit = false;
                    setTimeout(() => {
                        this.canBeHit = true;
                    }, 400);
                }
            }
        });

        // Check for collision with coins
        coins.forEach(c => {
            // If colliding with coin
            if (c.hitbox.intersects(this.hitbox)) {
                // Pick up coin
                c.pickUp();
            }
        });
        
        // Don't let the player go out of bounds
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.x > canvas.width - 38) {
            this.x = canvas.width - 38;
        }
        if (this.y < 0) {
            this.y = 0;
        }
        if (this.y > canvas.height - 60) {
            this.y = canvas.height - 60;
        }

        // Update trail segments
        this.trails.forEach((t, i) => {
            // If trail segment is transparent, remove it
            if (t.a <= 0) {
                this.trails.splice(i, 1);
            }
            t.update();
        });

        // Add trail segment
        switch (this.skin) {
            case skins.default:
            case skins.mask:
                this.trails.push(new Trail(this.x, this.y, 32, 32, 255, 255, 255));
                break;
            case skins.creeper:
                if (this.skinCreeperColor) {
                    this.trails.push(new Trail(this.x, this.y, 32, 32, 0, 255, 9));
                } else {
                    this.trails.push(new Trail(this.x, this.y, 32, 32, 60, 60, 60));
                }
                break;
            case skins.chicken:
                this.trails.push(new Trail(this.x, this.y, 32, 32, 255, 0, 0));
                break;
            case skins.rainbow:
                let c = this.skinRainbowColors[this.skinRainbowColorIndex];
                this.trails.push(new Trail(this.x, this.y, 32, 32, c.r, c.g, c.b));
                break;
        }

        // Empty trails array if options.showTrail is false
        if (!options.showTrail) {
            this.trails = [];
        }
    }

    reset(): void {
        // Reset position
        this.x = this.startX;
        this.y = this.startY;

        // Reset hp
        this.hp = 100;

        // Reset trail
        this.trails = [];

        // Reset score and level
        nextLevel = 1000;
        level = 1;
        score = 0;
        scoreTotal = 0;
        coinCount = 0;
    }

    get hitbox(): Hitbox {
        return new Hitbox(this.x, this.y, 32, 32);
    }

    get hitboxInner(): Hitbox {
        return new Hitbox(this.x + 10, this.y + 10, 22, 22);
    }
}