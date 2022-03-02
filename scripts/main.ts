// Main file (main.ts)
// It's responsible for loading the game's assets (except fonts) and contains the game loop.

logStart();

function mouseOver(mx: number, my: number, x: number, y: number, w: number, h: number): boolean {
    return mx >= x && mx <= x + w && my >= y && my <= y + h;
}

// Load sounds
const sndHurt = new Audio("sounds/hurt.wav");
const sndSelect = new Audio("sounds/select.wav");
const sndNextLevel = new Audio("sounds/nextlevel.wav");
const sndGameOver = new Audio("sounds/gameover.wav");
const sndPause = new Audio("sounds/pause.wav");
const sndError = new Audio("sounds/error.wav");
const sndCoin = new Audio("sounds/coin.wav");
const sndCoinAppear = new Audio("sounds/coinappear.wav");
const sndReset = new Audio("sounds/reset.wav");
const sndLoad = new Audio("sounds/load.wav");
const sndBuy = new Audio("sounds/buy.wav");

log("Loaded sounds");

// Load skins
let skins = {
    "default": <HTMLImageElement>document.getElementById("img-skin-default"),
    "creeper": <HTMLImageElement>document.getElementById("img-skin-creeper"),
    "chicken": <HTMLImageElement>document.getElementById("img-skin-chicken"),
    "mask": <HTMLImageElement>document.getElementById("img-skin-mask"),
    "rainbow": <HTMLImageElement>document.getElementById("img-skin-rainbow"),
};

log("Loaded skins");

// Canvas and context
const canvas = <HTMLCanvasElement> document.getElementById("canvas");
const ctx = canvas.getContext("2d");

/**
 * @author GameAlchemist https://stackoverflow.com/questions/28023696/html-canvas-animation-which-incorporates-a-shaking-effect
 */
function shakeScreen() {
    ctx.save();
    let dx = Math.random() * 20;
    let dy = Math.random() * 20;
    ctx.translate(dx, dy);
}

function spawnEnemy() {
    let enemyType = Math.floor(Math.random() * 5);
    switch (enemyType) {
        case 0:
            enemies.push(new BasicEnemy(Math.floor(Math.random() * canvas.width - 64),
                                        Math.floor(Math.random() * canvas.height - 64)));
            break;
        case 1:
            enemies.push(new FastEnemy(Math.floor(Math.random() * canvas.width - 64),
                                        Math.floor(Math.random() * canvas.height - 64)));
            break;
        case 2:
            enemies.push(new SmartEnemy(Math.floor(Math.random() * canvas.width - 64),
                                        Math.floor(Math.random() * canvas.height - 64)));
            break;
        case 3:
            enemies.push(new RainbowEnemy(Math.floor(Math.random() * canvas.width - 64),
                                        Math.floor(Math.random() * canvas.height - 64)));
            break;
        case 4:
            enemies.push(new SlowEnemy(Math.floor(Math.random() * canvas.width - 64),
                                        Math.floor(Math.random() * canvas.height - 64)));
            break;
        case 5:
            enemies.push(new RandomEnemy(Math.floor(Math.random() * canvas.width - 64),
                                        Math.floor(Math.random() * canvas.height - 64)));
            break;
        case 6:
            enemies.push(new WalkingEnemy(Math.floor(Math.random() * canvas.width - 64),
                                        Math.floor(Math.random() * canvas.height - 64)));
            break;
    }
    // Log enemy spawn
    log("Spawned enemy of type " + enemyType);
}

let buttons = {
    pauseMainMenu: document.getElementById("btn-pause-main-menu"),
    mainMenuPlay: document.getElementById("btn-main-menu-play"),
    mainMenuOptions: document.getElementById("btn-main-menu-options"),
    mainMenuSandbox: document.getElementById("btn-main-menu-sandbox"),
    optionsBack: document.getElementById("btn-options-back"),
    optionsLang: document.getElementById("btn-options-lang"),
    optionsShowTrail: document.getElementById("btn-options-show-trail"),
    gameOverRetry: document.getElementById("btn-game-over-retry"),
    gameOverMainMenu: document.getElementById("btn-game-over-main-menu"),
    sandboxSetVel: document.getElementById("btn-sandbox-setvel"),
    sandboxColorRed: document.getElementById("btn-sandbox-color-red"),
    sandboxColorBlue: document.getElementById("btn-sandbox-color-blue"),
    sandboxColorGreen: document.getElementById("btn-sandbox-color-green"),
    sandboxColorWhite: document.getElementById("btn-sandbox-color-white"),
    sandboxColorCyan: document.getElementById("btn-sandbox-color-cyan"),
    sandboxColorMagenta: document.getElementById("btn-sandbox-color-magenta"),
    sandboxColorYellow: document.getElementById("btn-sandbox-color-yellow"),
    sandboxColorDarkRed: document.getElementById("btn-sandbox-color-dark-red"),
    sandboxColorDarkBlue: document.getElementById("btn-sandbox-color-dark-blue"),
    sandboxColorDarkGreen: document.getElementById("btn-sandbox-color-dark-green"),
    sandboxColorGray: document.getElementById("btn-sandbox-color-gray"),
    sandboxColorDarkCyan: document.getElementById("btn-sandbox-color-dark-cyan"),
    sandboxColorDarkMagenta: document.getElementById("btn-sandbox-color-dark-magenta"),
    sandboxColorDarkYellow: document.getElementById("btn-sandbox-color-dark-yellow"),
    sandboxColorRandom: document.getElementById("btn-sandbox-color-random"),
    sandboxColorCustom: document.getElementById("btn-sandbox-color-custom"),
    sandboxCustomColorOK: document.getElementById("btn-sandbox-custom-color-ok"),
    sandboxCustomColorCancel: document.getElementById("btn-sandbox-custom-color-cancel"),
    sandboxResetEnemy: document.getElementById("btn-sandbox-reset-enemy"),
    shopBuyAddHp: document.getElementById("btn-shop-buy-add-hp"),
};

let textBoxes = {
    sandboxVelX: <HTMLInputElement>document.getElementById("txt-sandbox-velx"),
    sandboxVelY: <HTMLInputElement>document.getElementById("txt-sandbox-vely"),
    sandboxCustomColorR: <HTMLInputElement>document.getElementById("txt-sandbox-custom-color-r"),
    sandboxCustomColorG: <HTMLInputElement>document.getElementById("txt-sandbox-custom-color-g"),
    sandboxCustomColorB: <HTMLInputElement>document.getElementById("txt-sandbox-custom-color-b"),
};

let dialogs = {
    sandboxCustomColor: document.getElementById("dlg-sandbox-custom-color"),
};

let options = {
    showTrail: true,
    lang: "en",
};

// Load options
if (localStorage.getItem("showTrail") != null) {
    options.showTrail = localStorage.getItem("showTrail") == "yes";
}
if (localStorage.getItem("lang") != null) {
    options.lang = localStorage.getItem("lang");
}

log("Loaded options");

// Game constants
const beta = true;
const version = "0.3";
const splash = getSplash();

// Game variables
let fps = 60;
let _frames = 0;
let validGameStates = ["game", "mainMenu", "options", "sandbox"];
let gameState = "mainMenu";
let paused = false;
let pauseBlink = false;
let shop = false;
let score = 0;
let scoreTotal = 0;
let level = 1;
let nextLevel = 1000;
let screenFlashAlpha = 0;
let player = new Player(canvas.width / 2 - 32, canvas.height / 2 - 32);
let customEnemy = new CustomEnemy(100, 100);
let bgEffect = new BackgroundEffect();
let enemies: Enemy[] = [];
let particles: Particle[] = [];
let coins: Coin[] = [];
let coinCount = 0;

function draw() {
    // Draw background
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw flashing
    ctx.fillStyle = `rgba(255, 255, 255, ${screenFlashAlpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Game draw
    if (gameState == "game") {
        // If game is not over, draw stuff
        if (!player.gameOver && !shop) {
            // Draw background
            bgEffect.draw();

            // Draw enemies
            enemies.forEach(enemy => {
                enemy.draw();
            });

            // Draw coins
            coins.forEach(coin => {
                coin.draw();
            });

            // Draw particles
            particles.forEach(particle => {
                particle.draw();
            });

            // Draw player
            player.draw();

            // Restore canvas after shake effect
            ctx.restore();

            // Draw pause menu if paused
            if (paused) {
                // Background
                ctx.fillStyle = "rgba(1, 1, 1, .5)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // "Paused" text
                ctx.font = "24px press-start";
                ctx.fillStyle = pauseBlink ? "red" : "white";
                ctx.fillText(loadString("paused"), 15, 36);

                // Subtext
                ctx.font = "12px press-start";
                ctx.fillStyle = "white";
                ctx.fillText(loadString("pausedSubtext"), 15, 57);
            }
        } else {
            if (shop) {
                // Draw shop text
                ctx.font = "36px press-start";
                ctx.fillStyle = "white";
                ctx.fillText(loadString("shop"), canvas.width / 2 - ctx.measureText(loadString("shop")).width / 2, 120);
                
                // Draw shop subtext
                ctx.font = "12px press-start";
                ctx.fillStyle = "white";
                ctx.fillText(loadString("shopSubtext"), canvas.width / 2 - ctx.measureText(loadString("shopSubtext")).width / 2, 150);
                
                // Display coins text
                ctx.font = "14px press-start";
                ctx.fillStyle = "white";
                ctx.fillText(`${loadString("coins")}`, 10, 20);

                // Display coins count
                ctx.font = "14px press-start";
                ctx.fillStyle = "yellow";
                ctx.fillText(`${coinCount}`, 130, 20);

                // Display health shop item text
                ctx.font = "13px press-start";
                ctx.fillStyle = "white";
                ctx.fillText(`${loadString("shopItemHealth")}`, 30, 200);
            } else {
                // Draw game over text
                ctx.fillStyle = "white";
                ctx.font = "36px press-start";
                ctx.fillText(loadString("gameOver"), canvas.width / 2 - ctx.measureText(loadString("gameOver")).width / 2, 140);
                
                // Draw score text
                ctx.font = "12px press-start";
                ctx.fillText(`${lang[options.lang].gameScorep1} ${scoreTotal} ${lang[options.lang].gameScorep2}`, 200, 170);
            }
        }
    } else if (gameState == "mainMenu") {
        // Draw header
        ctx.fillStyle = "white";
        ctx.font = "36px press-start";
        ctx.fillText("Dodge them all!", 130, 140);

        // Draw "Beta version!" if game is in beta version
        if (beta) {
            ctx.fillStyle = "yellow";
            ctx.font = "12px press-start";
            ctx.fillText(lang[options.lang].beta, 130, 160);
        }
    } else if (gameState == "options") {
        // Draw header
        ctx.fillStyle = "white";
        ctx.font = "36px press-start";
        ctx.fillText(loadString("options"), 250, 140);

        // Draw select skin text
        ctx.font = "16px press-start";
        ctx.fillStyle = "white";
        ctx.fillText(loadString("selectSkin"), 450, 210);

        // Draw skin select border
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(450, 230, 240, 220);

        // Draw skins
        ctx.drawImage(skins.default, 460, 240, 32, 32);
        ctx.drawImage(skins.creeper, 460, 280, 32, 32);
        ctx.drawImage(skins.mask, 460, 320, 32, 32);
        ctx.drawImage(skins.chicken, 460, 360, 32, 32);
        ctx.drawImage(skins.rainbow, 460, 400, 32, 32);

        // Draw skin names
        ctx.font = "12px press-start";
        ctx.fillStyle = "white";
        ctx.fillText(loadString("skinDefault"), 510, 260);
        ctx.fillText(loadString("skinCreeper"), 510, 300);
        ctx.fillText(loadString("skinMask"), 510, 340);
        ctx.fillText(loadString("skinChicken"), 510, 380);
        ctx.fillText(loadString("skinRainbow"), 510, 420);

        // Draw an outline around the selected skin
        ctx.strokeStyle = "lime";
        ctx.lineWidth = 2;
        switch (player.skin) {
            case skins.default:
                ctx.strokeRect(460, 240, 32, 32);
                break;
            case skins.creeper:
                ctx.strokeRect(460, 280, 32, 32);
                break;
            case skins.mask:
                ctx.strokeRect(460, 320, 32, 32);
                break;
            case skins.chicken:
                ctx.strokeRect(460, 360, 32, 32);
                break;
            case skins.rainbow:
                ctx.strokeRect(460, 400, 32, 32);
                break;
        }
    } else if (gameState == "sandbox") {
        // Draw particles
        particles.forEach(particle => {
            particle.draw();
        });

        // Draw enemy space boundaries
        ctx.strokeStyle = "white";
        ctx.lineWidth = 3;
        ctx.strokeRect(30, 50, 250, 500);

        // Draw velocity header
        ctx.font = "16px press-start";
        ctx.fillStyle = "white";
        ctx.fillText(lang[options.lang].vel, 290, 70);

        // Draw color header
        ctx.fillText(lang[options.lang].color, 290, 180);

        // Draw enemy
        customEnemy.draw();
    }
}

function update() {
    // Put update code into a try-catch block, so that we can handle errors.
    try {
        // Check if game state is valid
        if (!validGameStates.includes(gameState)) {
            throw new Error(`Invalid game state: ${gameState}`);
        }

        // Update background
        bgEffect.update();

        // Make game unpaused and not over if player is not in game
        if (gameState != "game") {
            paused = false;
            player.gameOver = false;
            shop = false;
        }
        
        // Make game over buttons visible, if game is over
        if (player.gameOver) {
            buttons.gameOverRetry.style.display = "block";
            buttons.gameOverMainMenu.style.display = "block";
        } else {
            buttons.gameOverRetry.style.display = "none";
            buttons.gameOverMainMenu.style.display = "none";
        }

        // Make flash effect go away if game is over
        if (player.gameOver) {
            screenFlashAlpha = 0;
        }

        // Game update
        if (gameState == "game") {
            // Update game if game is not over
            if (!player.gameOver && !shop) {
                // Make all non-game buttons invisible
                buttons.mainMenuPlay.style.display = "none";
                buttons.mainMenuOptions.style.display = "none";
                buttons.mainMenuSandbox.style.display = "none";
                buttons.optionsBack.style.display = "none";
                buttons.optionsLang.style.display = "none";
                buttons.optionsShowTrail.style.display = "none";
                buttons.sandboxSetVel.style.display = "none";
                buttons.sandboxColorRed.style.display = "none";
                buttons.sandboxColorBlue.style.display = "none";
                buttons.sandboxColorGreen.style.display = "none";
                buttons.sandboxColorWhite.style.display = "none";
                buttons.sandboxColorCyan.style.display = "none";
                buttons.sandboxColorMagenta.style.display = "none";
                buttons.sandboxColorYellow.style.display = "none";
                buttons.sandboxColorDarkRed.style.display = "none";
                buttons.sandboxColorDarkBlue.style.display = "none";
                buttons.sandboxColorDarkGreen.style.display = "none";
                buttons.sandboxColorGray.style.display = "none";
                buttons.sandboxColorDarkCyan.style.display = "none";
                buttons.sandboxColorDarkMagenta.style.display = "none";
                buttons.sandboxColorDarkYellow.style.display = "none";
                buttons.sandboxColorRandom.style.display = "none";
                buttons.sandboxColorCustom.style.display = "none";
                buttons.sandboxCustomColorOK.style.display = "none";
                buttons.sandboxCustomColorCancel.style.display = "none";
                buttons.shopBuyAddHp.style.display = "none";

                // Make all text boxes invisible
                textBoxes.sandboxVelX.style.display = "none";
                textBoxes.sandboxVelY.style.display = "none";

                // Make all dialogs invisible
                dialogs.sandboxCustomColor.style.display = "none";

                // Update every enemy, particles and player if the game is not paused
                if (!paused) {
                    enemies.forEach(enemy => {
                        enemy.update(player);
                    });
                    particles.forEach(particle => {
                        particle.update();
                    });
                    coins.forEach(coin => {
                        coin.update();
                    });
                    player.update();

                    // Create coins randomly
                    if (Math.random() < 0.0008) {
                        coins.push(new Coin(Math.random() * canvas.width, Math.random() * canvas.height));
                    }
                }

                // Make flashing go away
                screenFlashAlpha -= 0.04;
                if (screenFlashAlpha <= 0) {
                    screenFlashAlpha = 0;
                }

                // Visibility checker for "Main menu" button
                if (paused) {
                    buttons.pauseMainMenu.style.display = "block";
                } else {
                    buttons.pauseMainMenu.style.display = "none";
                }

                // Update button text to match player's language
                buttons.pauseMainMenu.innerText = lang[options.lang].mainmenu;
            } else {
                if (!shop) {
                    // Update button text to match player's language
                    buttons.gameOverRetry.innerText = lang[options.lang].retry;
                    buttons.gameOverMainMenu.innerText = lang[options.lang].mainmenu;

                    // Other language-dependent style settings for buttons
                    if (options.lang == "ru") {
                        buttons.gameOverMainMenu.style.fontSize = "medium";
                    } else {
                        buttons.gameOverMainMenu.style.fontSize = "large";
                    }
                } else {
                    // Make all shop buttons visible
                    buttons.shopBuyAddHp.style.display = "block";

                    // Update button text to match player's language
                    buttons.shopBuyAddHp.innerText = lang[options.lang].buy;

                    // Other language-dependent style settings for buttons
                    if (options.lang == "ru") {
                        buttons.shopBuyAddHp.style.fontSize = "small";
                    } else {
                        buttons.shopBuyAddHp.style.fontSize = "medium";
                    }
                }
            }
        } else if (gameState == "mainMenu") {
            // Make all non-main menu buttons invisible
            buttons.pauseMainMenu.style.display = "none";
            buttons.optionsBack.style.display = "none";
            buttons.optionsLang.style.display = "none";
            buttons.optionsShowTrail.style.display = "none";
            buttons.sandboxSetVel.style.display = "none";
            buttons.sandboxColorRed.style.display = "none";
            buttons.sandboxColorBlue.style.display = "none";
            buttons.sandboxColorGreen.style.display = "none";
            buttons.sandboxColorWhite.style.display = "none";
            buttons.sandboxColorCyan.style.display = "none";
            buttons.sandboxColorMagenta.style.display = "none";
            buttons.sandboxColorYellow.style.display = "none";
            buttons.sandboxColorDarkRed.style.display = "none";
            buttons.sandboxColorDarkBlue.style.display = "none";
            buttons.sandboxColorDarkGreen.style.display = "none";
            buttons.sandboxColorGray.style.display = "none";
            buttons.sandboxColorDarkCyan.style.display = "none";
            buttons.sandboxColorDarkMagenta.style.display = "none";
            buttons.sandboxColorDarkYellow.style.display = "none";
            buttons.sandboxColorRandom.style.display = "none";
            buttons.sandboxColorCustom.style.display = "none";
            buttons.sandboxCustomColorOK.style.display = "none";
            buttons.sandboxCustomColorCancel.style.display = "none";
            buttons.shopBuyAddHp.style.display = "none";
            buttons.sandboxResetEnemy.style.display = "none";

            // Make all menu buttons visible
            buttons.mainMenuPlay.style.display = "block";
            buttons.mainMenuOptions.style.display = "block";
            buttons.mainMenuSandbox.style.display = "block";

            // Make all text boxes invisible
            textBoxes.sandboxVelX.style.display = "none";
            textBoxes.sandboxVelY.style.display = "none";

            // Make all dialogs invisible
            dialogs.sandboxCustomColor.style.display = "none";

            // Update button text to match player's language
            buttons.mainMenuPlay.innerText = lang[options.lang].play;
            buttons.mainMenuOptions.innerText = lang[options.lang].options;
            buttons.mainMenuSandbox.innerText = lang[options.lang].sandbox;

            // Other language-dependent style settings for buttons
            if (options.lang == "ru") {
                buttons.mainMenuOptions.style.fontSize = "small";
                buttons.mainMenuSandbox.style.fontSize = "small";
            } else {
                buttons.mainMenuOptions.style.fontSize = "medium";
                buttons.mainMenuSandbox.style.fontSize = "medium";
            }
        } else if (gameState == "options") {
            // Make all non-options buttons invisible
            buttons.pauseMainMenu.style.display = "none";
            buttons.mainMenuPlay.style.display = "none";
            buttons.mainMenuOptions.style.display = "none";
            buttons.mainMenuSandbox.style.display = "none";
            buttons.sandboxSetVel.style.display = "none";
            buttons.sandboxColorRed.style.display = "none";
            buttons.sandboxColorBlue.style.display = "none";
            buttons.sandboxColorGreen.style.display = "none";
            buttons.sandboxColorWhite.style.display = "none";
            buttons.sandboxColorCyan.style.display = "none";
            buttons.sandboxColorMagenta.style.display = "none";
            buttons.sandboxColorYellow.style.display = "none";
            buttons.sandboxColorDarkRed.style.display = "none";
            buttons.sandboxColorDarkBlue.style.display = "none";
            buttons.sandboxColorDarkGreen.style.display = "none";
            buttons.sandboxColorGray.style.display = "none";
            buttons.sandboxColorDarkCyan.style.display = "none";
            buttons.sandboxColorDarkMagenta.style.display = "none";
            buttons.sandboxColorDarkYellow.style.display = "none";
            buttons.sandboxColorRandom.style.display = "none";
            buttons.sandboxColorCustom.style.display = "none";
            buttons.sandboxCustomColorOK.style.display = "none";
            buttons.sandboxCustomColorCancel.style.display = "none";

            // Make all options buttons visible
            buttons.optionsBack.style.display = "block";
            buttons.optionsLang.style.display = "block";
            buttons.optionsShowTrail.style.display = "block";

            // Make all text boxes invisible
            textBoxes.sandboxVelX.style.display = "none";
            textBoxes.sandboxVelY.style.display = "none";

            // Make all dialogs invisible
            dialogs.sandboxCustomColor.style.display = "none";

            // Update button text to match player's language
            buttons.optionsLang.innerText = lang[options.lang].language;
            buttons.optionsShowTrail.innerText = `${loadString("showTrailSetting")} ${options.showTrail ? lang[options.lang].yes : lang[options.lang].no}`;
        } else if (gameState == "sandbox") {
            // Make all non-sandbox buttons invisible
            buttons.pauseMainMenu.style.display = "none";
            buttons.mainMenuPlay.style.display = "none";
            buttons.mainMenuOptions.style.display = "none";
            buttons.mainMenuSandbox.style.display = "none";
            buttons.gameOverRetry.style.display = "none";
            buttons.gameOverMainMenu.style.display = "none";
            buttons.optionsLang.style.display = "none";
            buttons.optionsShowTrail.style.display = "none";

            // Make all sandbox buttons visible
            buttons.optionsBack.style.display = "block";
            buttons.sandboxSetVel.style.display = "block";
            buttons.sandboxColorRed.style.display = "block";
            buttons.sandboxColorBlue.style.display = "block";
            buttons.sandboxColorGreen.style.display = "block";
            buttons.sandboxColorWhite.style.display = "block";
            buttons.sandboxColorCyan.style.display = "block";
            buttons.sandboxColorMagenta.style.display = "block";
            buttons.sandboxColorYellow.style.display = "block";
            buttons.sandboxColorDarkRed.style.display = "block";
            buttons.sandboxColorDarkBlue.style.display = "block";
            buttons.sandboxColorDarkGreen.style.display = "block";
            buttons.sandboxColorGray.style.display = "block";
            buttons.sandboxColorDarkCyan.style.display = "block";
            buttons.sandboxColorDarkMagenta.style.display = "block";
            buttons.sandboxColorDarkYellow.style.display = "block";
            buttons.sandboxColorRandom.style.display = "block";
            buttons.sandboxColorCustom.style.display = "block";
            buttons.sandboxResetEnemy.style.display = "block";

            // Update button text to match player's language
            buttons.sandboxSetVel.innerText = loadString("setvel");
            buttons.sandboxResetEnemy.innerText = loadString("resetEnemy");

            // Make all sandbox text boxes visible
            textBoxes.sandboxVelX.style.display = "block";
            textBoxes.sandboxVelY.style.display = "block";

            // Update text box placeholders to match player's language
            textBoxes.sandboxVelX.placeholder = loadString("velx");
            textBoxes.sandboxVelY.placeholder = loadString("vely");

            // Other language-dependent style settings for buttons
            if (options.lang == "ru") {
                buttons.sandboxResetEnemy.style.fontSize = "small";
            } else {
                buttons.sandboxResetEnemy.style.fontSize = "large";
            }

            // Update custom enemy
            customEnemy.update(player);

            // Update particles
            particles.forEach(particle => {
                particle.update();
            });
        }

        draw();
        _frames++;
        requestAnimationFrame(update);
    } catch (err) {
        alert(`Error: ${err}\nThe game will be exited.\nSee log for more details.`);
        err.stack = `Error: ${err}\n${err.stack}\n`;
        logError(err);
        process.stderr.write(err.stack);
        process.exit(1);
    }
}

document.addEventListener("keydown", ev => {
    // Pause or unpause when space key is pressed and player is playing the game
    if (ev.key == "Escape" && gameState == "game" && !player.gameOver && !shop) {
        paused = !paused;
        // Play sndPause at oruiginal pitch when pausing, but at higher pitch when unpausing
        sndPause.playbackRate = paused ? 1 : 2;
        sndPause.play();
    }

    // Go to shop when enter key is pressed and player is playing the game
    if (ev.key == "Enter" && gameState == "game" && !player.gameOver && !paused) {
        shop = !shop;
    }
});

// Click handlers for buttons

// Main menu: Play button
buttons.mainMenuPlay.addEventListener("click", _ => {
    enemies = [];
    particles = [];
    enemies.push(new BasicEnemy(Math.floor(Math.random() * canvas.width - 64),
                                Math.floor(Math.random() * canvas.height - 64)));
    player.reset();
    gameState = "game";
    log("Game started");
});

// Main menu: Options button
buttons.mainMenuOptions.addEventListener("click", _ => {
    gameState = "options";
    log("Options menu opened");
});

// Main menu: Sandbox button
buttons.mainMenuSandbox.addEventListener("click", _ => {
    gameState = "sandbox";
    log("Sandbox menu opened");
});

// Options: Back button
buttons.optionsBack.addEventListener("click", _ => {
    gameState = "mainMenu";
    log("Options menu closed");
});

// Options: Language button
buttons.optionsLang.addEventListener("click", _ => {
    if (options.lang == "en") {
        options.lang = "ru";
    } else if (options.lang == "ru") {
        options.lang = "en";
    }
    localStorage.setItem("lang", options.lang);
    log("Language changed to " + options.lang);
});

// Options: Show trail button
buttons.optionsShowTrail.addEventListener("click", _ => {
    options.showTrail = !options.showTrail;
    localStorage.setItem("showTrail", options.showTrail ? "yes" : "no");
    log("Show trail setting changed to " + options.showTrail);
});

// Pause menu: Main menu button
buttons.pauseMainMenu.addEventListener("click", _ => {
    enemies = [];
    player.reset();
    gameState = "mainMenu";
    log("Main menu opened from pause menu");
});

// Game over: Retry button
buttons.gameOverRetry.addEventListener("click", _ => {
    player.reset();
    player.gameOver = false;
    enemies = [];
    enemies.push(new BasicEnemy(Math.floor(Math.random() * canvas.width - 64),
                                Math.floor(Math.random() * canvas.height - 64)));
    log("Game started from game over menu");
});

// Game over: Main menu button
buttons.gameOverMainMenu.addEventListener("click", _ => {
    gameState = "mainMenu";
    log("Main menu opened from game over menu");
});

// Sandbox: Set velocity button
buttons.sandboxSetVel.addEventListener("click", _ => {
    if (textBoxes.sandboxVelX.value !== "" && textBoxes.sandboxVelY.value !== "") {
        customEnemy.setVel(Number.parseFloat(textBoxes.sandboxVelX.value),
                           Number.parseFloat(textBoxes.sandboxVelY.value));
        log("Custom enemy velocity set to (" + customEnemy.velX + ", " + customEnemy.velY + ")");
    }
});

// Sandbox: Red color button
buttons.sandboxColorRed.addEventListener("click", _ => {
    customEnemy.setColor(255, 0, 0);
    log("Custom enemy color set to red");
});

// Sandbox: Blue color button
buttons.sandboxColorBlue.addEventListener("click", _ => {
    customEnemy.setColor(0, 0, 255);
    log("Custom enemy color set to blue");
});

// Sandbox: Green color button
buttons.sandboxColorGreen.addEventListener("click", _ => {
    customEnemy.setColor(0, 255, 0);
    log("Custom enemy color set to green");
});

// Sandbox: White color button
buttons.sandboxColorWhite.addEventListener("click", _ => {
    customEnemy.setColor(255, 255, 255);
    log("Custom enemy color set to white");
});

// Sandbox: Cyan color button
buttons.sandboxColorCyan.addEventListener("click", _ => {
    customEnemy.setColor(0, 255, 255);
    log("Custom enemy color set to cyan");
});

// Sandbox: Magenta color button
buttons.sandboxColorMagenta.addEventListener("click", _ => {
    customEnemy.setColor(255, 0, 255);
    log("Custom enemy color set to magenta");
});

// Sandbox: Yellow color button
buttons.sandboxColorYellow.addEventListener("click", _ => {
    customEnemy.setColor(255, 255, 0);
    log("Custom enemy color set to yellow");
});

// Sandbox: Dark red color button
buttons.sandboxColorDarkRed.addEventListener("click", _ => {
    customEnemy.setColor(128, 0, 0);
    log("Custom enemy color set to dark red");
});

// Sandbox: Dark blue color button
buttons.sandboxColorDarkBlue.addEventListener("click", _ => {
    customEnemy.setColor(0, 0, 128);
    log("Custom enemy color set to dark blue");
});

// Sandbox: Dark green color button
buttons.sandboxColorDarkGreen.addEventListener("click", _ => {
    customEnemy.setColor(0, 128, 0);
    log("Custom enemy color set to dark green");
});

// Sandbox: Gray color button
buttons.sandboxColorGray.addEventListener("click", _ => {
    customEnemy.setColor(128, 128, 128);
    log("Custom enemy color set to gray");
});

// Sandbox: Dark cyan color button
buttons.sandboxColorDarkCyan.addEventListener("click", _ => {
    customEnemy.setColor(0, 128, 128);
    log("Custom enemy color set to dark cyan");
});

// Sandbox: Dark magenta color button
buttons.sandboxColorDarkMagenta.addEventListener("click", _ => {
    customEnemy.setColor(128, 0, 128);
    log("Custom enemy color set to dark magenta");
});

// Sandbox: Dark yellow color button
buttons.sandboxColorDarkYellow.addEventListener("click", _ => {
    customEnemy.setColor(128, 128, 0);
    log("Custom enemy color set to dark yellow");
});

// Sandbox: Random color button
buttons.sandboxColorRandom.addEventListener("click", _ => {
    customEnemy.setColor(Math.floor(Math.random() * 255),
                            Math.floor(Math.random() * 255),
                            Math.floor(Math.random() * 255));
    log("Custom enemy color set to random");
});

// Sandbox: Custom color button
buttons.sandboxColorCustom.addEventListener("click", _ => {
    dialogs.sandboxCustomColor.style.display = "block";
    buttons.sandboxCustomColorOK.style.display = "block";
    buttons.sandboxCustomColorCancel.style.display = "block";
});

// Custom color dialog: OK button
buttons.sandboxCustomColorOK.addEventListener("click", _ => {
    // If the user didn't enter one of the required fields, or entered invalid values,
    // for example, less than 0 or greater than 255, then don't close the dialog
    if (textBoxes.sandboxCustomColorR.value !== "" && textBoxes.sandboxCustomColorG.value !== "" && textBoxes.sandboxCustomColorB.value !== "") {
        // Check if the entered values are valid
        if (Number.parseInt(textBoxes.sandboxCustomColorR.value) >= 0 && Number.parseInt(textBoxes.sandboxCustomColorR.value) <= 255 && Number.parseInt(textBoxes.sandboxCustomColorG.value) >= 0 && Number.parseInt(textBoxes.sandboxCustomColorG.value) <= 255 && Number.parseInt(textBoxes.sandboxCustomColorB.value) >= 0 && Number.parseInt(textBoxes.sandboxCustomColorB.value) <= 255) {
            customEnemy.setColor(Number.parseInt(textBoxes.sandboxCustomColorR.value),
                                Number.parseInt(textBoxes.sandboxCustomColorG.value),
                                Number.parseInt(textBoxes.sandboxCustomColorB.value));
            dialogs.sandboxCustomColor.style.display = "none";
            log("Custom enemy color set to (" + customEnemy.r + ", " + customEnemy.g + ", " + customEnemy.b + ")");
        } else {
            sndError.currentTime = 0;
            sndError.play();
        }
    } else {
        sndError.currentTime = 0;
        sndError.play();
    }
});

// Custom color dialog: Cancel button
buttons.sandboxCustomColorCancel.addEventListener("click", _ => {
    dialogs.sandboxCustomColor.style.display = "none";
});

// Sandbox: Reset enemy button
buttons.sandboxResetEnemy.addEventListener("click", _ => {
    sndReset.currentTime = 0;
    sndReset.play();
    customEnemy.reset();
});

// Shop: Buy hp button
buttons.shopBuyAddHp.addEventListener("click", _ => {
    // If player has 7 coins or more, buy 10 hp
    if (coinCount >= 7) {
        sndBuy.currentTime = 0;
        sndBuy.play();
        coinCount -= 7;
        player.hp += 10;
        log("Bought 10 hp");
    } else {
        sndError.currentTime = 0;
        sndError.play();
    }
});

// Options: On mouse down event
document.addEventListener("mousedown", ev => {
    if (gameState === "options") {
        // If the mouse is over one of the skins, change the skin
        if (mouseOver(ev.x, ev.y, 460, 240, 32, 32)) {
            player.skin = skins.default;
            log("Skin set to default");
        } else if (mouseOver(ev.x, ev.y, 460, 280, 32, 32)) {
            player.skin = skins.creeper;
            log("Skin set to creeper");
        } else if (mouseOver(ev.x, ev.y, 460, 320, 32, 32)) {
            player.skin = skins.mask;
            log("Skin set to mask");
        } else if (mouseOver(ev.x, ev.y, 460, 360, 32, 32)) {
            player.skin = skins.chicken;
            log("Skin set to chicken");
        } else if (mouseOver(ev.x, ev.y, 460, 400, 32, 32)) {
            player.skin = skins.rainbow;
            log("Skin set to rainbow");
        }
    }
});

// Make sndNextLevel play on every sandbox color button (they start with sandboxColor)
// in buttons object
for (let key in buttons) {
    if (key.startsWith("sandboxColor") && key !== "sandboxColorCustom") {
        buttons[key].addEventListener("click", (_: any) => {
            sndNextLevel.currentTime = 0;
            sndNextLevel.play();
        });
    }
}

// Make every button play a sound on hover
Object.keys(buttons).forEach(key => {
    try {
        buttons[key].addEventListener("mouseenter", (_: any) => {
            sndSelect.currentTime = 0;
            sndSelect.play();
        });
    } catch (_) {
        // Say that button failed to add event listener using process.stdout
        process.stdout.write(`Failed to add event listener to ${key}\nPlease check ID of the button\n`);
        // And also log it to the log
        log(`Failed to add event listener to ${key}`);
    }
});

// Make pause text blink every .5 seconds
setInterval(() => {
    pauseBlink = !pauseBlink;
}, 500);

// Update fps counter every second
setInterval(() => {
    document.title = `Dodge them all: ${splash}`;
    _frames = 0;
}, 1000);