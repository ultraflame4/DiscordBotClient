import {app, BrowserWindow, ipcMain} from "electron"
import * as path from "path";
import {getBotGuilds, getBotUsername, getGuildChannels} from "./controllers";
import {loginClient} from "./discordHandler";


function createAppWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload/preload.js"),
        }
    })

    if (process.env.ELECTRON_DEV) {
        win.loadURL("http://localhost:5173")
    } else {
        win.loadFile( "dist/index.html")
    }
}

app.whenReady().then(() => {

    ipcMain.handle("get-username", getBotUsername)
    ipcMain.handle("get-guild-channels", getGuildChannels)
    ipcMain.handle("get-guilds", getBotGuilds)

    createAppWindow()
})
