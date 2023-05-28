import path from "path";
import {logoutClient} from "./discordHandler";
import {BrowserWindow} from "electron";
import {Client} from "discord.js";

let _window:BrowserWindow|null = null

export function createAppWindow() {
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
    _window=win

}


export function GetWindow():BrowserWindow {
    if (!_window) {
        throw new Error("Client not initialized!");
    }
    return _window;
}
