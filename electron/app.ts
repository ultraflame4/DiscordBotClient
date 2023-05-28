import {app, BrowserWindow, ipcMain} from "electron"
import * as path from "path";

import {checkBotLoggedIn, logoutClient} from "./bot/discordHandler";
import BotInfoController from "./controllers/BotInfoController";
import GuildsController from "./controllers/GuildsController";
import ChannelsController from "./controllers/ChannelsController";

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
        win.loadFile("dist/index.html")
    }

    win.on("close", event => {
        logoutClient()
    })
}

app.whenReady().then(() => {

    ipcMain.handle("get-username", BotInfoController.username)
    ipcMain.handle("get-guild-channels", GuildsController.channels)
    ipcMain.handle("get-guilds", GuildsController.guilds)
    ipcMain.handle("login", BotInfoController.login)
    ipcMain.handle("get-messages", ChannelsController.messages)
    ipcMain.handle("check-login", checkBotLoggedIn)

    createAppWindow()
})
