import {app, BrowserWindow, ipcMain} from "electron"
import * as path from "path";
import {botLogin, getBotGuilds, getBotUsername, getGuildChannels, getTextChannelMessages} from "./controllers";
import {checkBotLoggedIn, logoutClient} from "./discordHandler";

function createAppWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload/preload.js"),
        }
    })

    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL)
    } else {
        win.loadFile( "dist/index.html")
    }

    win.on("close",event => {
        logoutClient()
    })
}

app.whenReady().then(() => {

    ipcMain.handle("get-username", getBotUsername)
    ipcMain.handle("get-guild-channels", getGuildChannels)
    ipcMain.handle("get-guilds", getBotGuilds)
    ipcMain.handle("login", botLogin)
    ipcMain.handle("check-login",checkBotLoggedIn)
    ipcMain.handle("get-messages",getTextChannelMessages)

    createAppWindow()
})
