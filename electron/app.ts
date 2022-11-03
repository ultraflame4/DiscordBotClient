import {app, BrowserWindow} from "electron"

function createAppWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600
    })

    win.loadFile('index.html')
}

app.whenReady().then(() => {
    createAppWindow()
})
