// Logging system (log.ts)
// Logging system is used to display messages to the log file for debugging.
// It can be useful to see what is happening in the game.

// Get fs module
const fs = require("fs");

function logStart(): void {
    // Destroy log file if it exists
    if (fs.existsSync("log.txt")) {
        fs.unlinkSync("log.txt");
    }

    // Create log file
    fs.writeFileSync("log.txt", "", { flag: "wx" });

    // Write "Log started: " and current date to log file
    fs.appendFileSync("log.txt", "Log started: " + new Date().toLocaleString() + "\n");
}

function log(str: string): void {
    // Write string to log file with date and time stamp and new line
    fs.appendFileSync("log.txt", "[" + new Date().toLocaleString() + "]: " + str + "\n");
}

function logError(err: Error): void {
    // Write error to log file with date and time stamp and say that it is an error
    fs.appendFileSync("log.txt", "[" + new Date().toLocaleString() + "] ERR: " + err.message + "\n");
}