const {app, BrowserWindow, ipcMain} = require("electron")
const prompt = require('electron-prompt');
const path = require('path')
const moment = require("moment")









const Discord = require('discord.js');
const client = new Discord.Client();
var win = null;

function createWindow() {

    win = new BrowserWindow(
        {
            width: 1000,
            height: 600,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        }
    )
    win.setMenu(null)

    win.loadFile("index.html")

    ipcMain.on("devtools", () => {
        win.webContents.toggleDevTools()
    })

    ipcMain.on("LoginRequest", login_request_callback)


    // Requests to open contet listeners

    ipcMain.on("requestOpenGuildContent", (e, guild_id) => {
        if (guild_id === "home") { //check if user is opening the "home"
            e.sender.send("openHomeContent"); // if opening home, send required data for home
            return
        }

        client.guilds.fetch(guild_id).then((guild) => {
            e.sender.send("openGuildContent", guild.id, guild.name);
            // Send back a signal with required data


        })

    })


    ipcMain.on("requestOpenChannelContent", (e, channelId) => {
        client.channels.fetch(channelId).then((channel) => {
            e.sender.send("openChannelContent", channel.id, channel.name)
        })

    })


    // Populate content listeners


    ipcMain.on("populateGuildChannel", (e, guildId) => {
        // console.log("populating...")
        // Loop through guild channels and add them tto sidebar
        client.guilds.fetch(guildId).then((guild) => {
            for (const c of guild.channels.cache) {

                let channel = c[1]
                // Skip category and voice channels for now. todo add support for categories and voice
                if (channel.type === "category" || channel.type === "voice") {
                    continue
                }

                // skip deleted channels
                if (channel.deleted === true) {
                    continue
                }
                e.sender.send("addGuildChannel", channel.id, channel.name)
            }
        })
    })

    ipcMain.on("populateChannelChat", (e, channelId) => {
        client.channels.fetch(channelId).then((channel) => {
            if (channel.type != "text") {
                console.error("Error while populating channel chat: channel not of text type")
                return
            }

            channel.messages.fetch({limit: 50}).then((messages) => {
                messages.forEach((msg, msgId) => {
                    // note: oldest text comes first.
                    let moment_date = moment(msg.createdAt)
                    console.log(msg.createdAt)
                    // Format date to string
                    e.sender.send("addChatMessage", msg.content,
                                  {id: msg.author.id, name: msg.author.username, avatarURL: msg.author.avatarURL()},
                                  {date:msg.createdAt,string:moment_date.calendar(),timestamp:moment_date.unix()});
                })
            })


        })

    })


}


app.whenReady().then(() => {
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
    win.webContents.send("loggedin", true); //prevent user from clicking button again

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

function discordLogin(token) {
    if (token === null) {
        return
    }

    client.login(token).catch((r) => {

        win.webContents.send("loggedin", false)
    });

}


client.on('ready', () => {
    win.webContents.send("botready", client.user.username, client.user.avatarURL(), client.user.tag)

    for (const g of client.guilds.cache) {
        win.webContents.send("addGuild", g[1].name, g[1].id, g[1].iconURL())
    }

})

