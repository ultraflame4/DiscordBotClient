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
    win.webContents.send("loggedin",true); //prevent user from clicking button again

    prompt({
        title: "Discord Bot Login",
        label: "Token: ",
        type: "input",
        alwaysOnTop: true,
        skipTaskbar: false,
        inputAttrs: {
            type: "password",
            required: true
        }
    }).then(
        (r) => {
            if (r !== null) {
                win.webContents.send("loggedin", true);
                discordLogin(r)
            }
        }
    );
}

function discordLogin(token){
    if (token===null){return}

    client.login(token).catch((r) => {
        console.log(r)
        win.webContents.send("loggedin", false)
    });

}


client.on('ready', ()=>{
    win.webContents.send("botready",client.user.username)

    console.log(client.guilds.cache)
    for (const g of client.guilds.cache) {
        win.webContents.send("addGuild",g[1].name,g[1].id,g[1].iconURL())
    }

})