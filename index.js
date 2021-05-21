const {app,BrowserWindow,ipcMain} = require("electron")
const prompt = require('electron-prompt');
const path = require('path')


const Discord = require('discord.js');
const client = new Discord.Client();
var win = null;

function createWindow(){

    win = new BrowserWindow(
        {
            width:800,
            height:600,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        }
    )
    win.setMenu(null)

    win.loadFile("index.html")

    ipcMain.on("devtools",()=>{win.webContents.toggleDevTools()})

    ipcMain.on("LoginRequest",login_request_callback)

}


app.whenReady().then(()=>{
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    })

})

app.on("before-quit", () => {
    // Logout of discord
    client.destroy()
});



function login_request_callback() {
    prompt({
        title: "Discord Bot Login",
        label: "Token: ",
        type: "input",
        inputAttrs: {
            type: "password",
            required: true
        }
    }).then(
        (r)=>{
            if(r !== null) {
                win.webContents.send("loggedin");
                discordLogin(r)
            }
        }
    );
}

function discordLogin(token){
    if (token===null){return}
    client.login(token)
}


client.on('ready', ()=>{
    win.webContents.send("botready")
    win.webContents.send("botname",client.user.username)
})