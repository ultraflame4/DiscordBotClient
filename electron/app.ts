import {app, BrowserWindow, ipcMain} from "electron"
import * as path from "path";


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
    ipcMain.handle("get-username", async (e) => {
        return null
    })
    createAppWindow()
})
