"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var prompt = require("electron-prompt");
var path = require("path");
var moment = require("moment");
var Discord = require("discord.js");
var client = new Discord.Client();
var win = null;
function createWindow() {
    win = new electron_1.BrowserWindow({
        width: 1000,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });
    win.setMenu(null);
    win.loadFile(path.join(__dirname, "../gui/index.html"));
    electron_1.ipcMain.on("devtools", function () {
        win.webContents.toggleDevTools();
    });
    electron_1.ipcMain.on("LoginRequest", login_request_callback);
    // Send chat text input listener
    electron_1.ipcMain.on("textinput-send", function (e, text_input, channelId) {
        if (channelId === null) {
            console.log("No channel open");
            return;
        }
        console.log("Sending ", text_input, "to ", channelId);
        client.channels.fetch(channelId).then(function (channel) {
            channel.send(text_input);
        });
    });
    // Requests to open content listeners
    electron_1.ipcMain.on("requestOpenGuildContent", function (e, guild_id) {
        if (guild_id === "home") { //check if user is opening the "home"
            e.sender.send("openHomeContent"); // if opening home, send required data for home
            return;
        }
        client.guilds.fetch(guild_id).then(function (guild) {
            e.sender.send("openGuildContent", guild.id, guild.name); // Send back a signal with required data
        });
    });
    electron_1.ipcMain.on("requestOpenChannelContent", function (e, channelId) {
        client.channels.fetch(channelId).then(function (channel) {
            e.sender.send("openChannelContent", channel.id, channel.name);
        });
    });
    // Populate content listeners
    electron_1.ipcMain.on("populateGuildChannel", function (e, guildId) {
        // Loop through guild channels and add them tto sidebar
        client.guilds.fetch(guildId).then(function (guild) {
            guild.channels.cache.forEach(function (channel) {
                // Skip category and voice channels for now. todo add support for categories and voice
                if (channel.type === "category" || channel.type === "voice") {
                    return;
                }
                // skip deleted channels
                if (channel.deleted === true) {
                    return;
                }
                e.sender.send("addGuildChannel", channel.id, channel.name);
            });
        });
    });
    electron_1.ipcMain.on("populateChannelChat", function (e, channelId) {
        client.channels.fetch(channelId).then(function (channel) {
            if (channel.type != "text") {
                console.error("Error while populating channel chat: channel not of text type");
                return;
            }
            channel.messages.fetch({ limit: 50 }).then(function (messages) {
                messages.forEach(function (msg, msgId) {
                    // note: oldest text comes first.
                    var moment_date = moment(msg.createdAt);
                    // Format date to string
                    e.sender.send("addChatMessage", msg.content, { id: msg.author.id, name: msg.author.username, avatarURL: msg.author.avatarURL() }, { date: msg.createdAt, string: moment_date.calendar(), timestamp: moment_date.unix() });
                });
            });
        });
    });
}
electron_1.app.whenReady().then(function () {
    createWindow();
    electron_1.app.on('activate', function () {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
    electron_1.app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') {
            electron_1.app.quit();
        }
    });
});
electron_1.app.on("before-quit", function () {
    // Logout of discord
    client.destroy();
});
function login_request_callback() {
    win.webContents.send("loggedin", true); //prevent user from clicking button again
    console.log("test");
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
    }).then(function (r) {
        if (r !== null) {
            win.webContents.send("loggedin", true);
            discordLogin(r);
        }
        else {
            win.webContents.send("loggedin", false);
        }
    });
}
function discordLogin(token) {
    if (token === null) {
        return;
    }
    client.login(token).catch(function (r) {
        win.webContents.send("loggedin", false);
    });
}
client.on('ready', function () {
    win.webContents.send("botready", client.user.username, client.user.avatarURL(), client.user.tag);
    client.guilds.cache.forEach(function (guild) {
        win.webContents.send("addGuild", guild.name, guild.id, guild.iconURL());
    });
});
//# sourceMappingURL=index.js.map