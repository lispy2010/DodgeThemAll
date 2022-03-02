// Coin class (coin.ts)
// Coin is a collectable item that can be picked up by the player.
// It can be used in the shop to buy upgrades like health.
// It disappears when picked up.
// It gives points when picked up.
// It creates particles and plays sound when picked up.
// If it is not picked up, it slowly disappears.

class Coin {
    x: number; y: number; life: number;
    pickedUp: boolean;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.life = 500;
        this.pickedUp = false;

        sndCoinAppear.play();
    }

    draw(): void {
        // Draw coin as a gold square
        ctx.fillStyle = "gold";
        ctx.fillRect(this.x, this.y, 10, 10);
    }

    update(): void {
        // Update coin
        this.life--;

        // If coin is dead or picked up, remove it from the array and create particles
        if (this.life <= 0 || this.pickedUp) {
            for (let i = 0; i < 5; i++) {
                particles.push(new Particle(this.x, this.y, { x: Math.random() * 10 - 5, y: Math.random() * 10 - 5 }, Math.random() * 5, { r: 255, g: 215, b: 0 }, 100));
            }
            coins.splice(coins.indexOf(this), 1);
        }
    }

    pickUp(): void {
        // Pick up coin
        this.pickedUp = true;

        // Add points
        score += 100;

        // Play sound
        sndCoin.play();

        // Add 1 to the number of coins collected
        coinCount++;

        // Create particles
        for (let i = 0; i < 5; i++) {
            particles.push(new Particle(this.x + 5, this.y + 5, { x: Math.random() * 6 - 3, y: Math.random() * 6 - 3 }, Math.random() * 5 + 5, {r: 255, g: 215, b: 0}, 100));
        }
    }

    get hitbox(): Hitbox {
        // Return hitbox of coin
        return new Hitbox(this.x, this.y, 10, 10);
    }
}