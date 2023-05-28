import {app, BrowserWindow, ipcMain} from "electron"
import * as path from "path";

import {checkBotLoggedIn, logoutClient} from "./discordHandler";
import BotInfoController from "./controllers/BotInfoController";
import GuildsController from "./controllers/GuildsController";
import ChannelsController from "./controllers/ChannelsController";
import {createAppWindow} from "./window";


app.whenReady().then(() => {

    ipcMain.handle("get-username", BotInfoController.username)
    ipcMain.handle("get-guild-channels", GuildsController.channels)
    ipcMain.handle("get-guilds", GuildsController.guilds)
    ipcMain.handle("login", BotInfoController.login)
    ipcMain.handle("get-messages", ChannelsController.messages)
    ipcMain.handle("check-login", checkBotLoggedIn)

    createAppWindow()
})
