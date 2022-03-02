const {app, BrowserWindow} = require("electron");
const url = require("url");
const path = require("path");

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 800, height: 600, webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
        }
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        "slashes": true
    }));
    win.removeMenu();
    win.resizable = false;
}

app.on("ready", _ => {
    createWindow();
});