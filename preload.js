const { ipcRenderer } = require('electron')
const Discord = require("discord.js")


window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#botTokenLogin').addEventListener('click', () => {
        ipcRenderer.send("LoginRequest")
    })

    ipcRenderer.on("loggedin", (e,b) => {
        document.querySelector('#botTokenLogin').disabled=b;
    });


    ipcRenderer.on("botready",(e,name,guilds)=>{
        document.getElementById("botstatushere").textContent = "Ready";
        document.getElementById("botnamehere").textContent = name;

    })

    ipcRenderer.on("openGuildContent",(e,guildId)=>{
        //todo
    })


    ipcRenderer.on("addGuild",(e,name,guildId,imageUrl)=>{
        let guildlist = document.getElementById("guildlist")
        let guildItemContainer = document.createElement("div")
        guildItemContainer.className = "guildListItemContainer row tooltip"
        guildItemContainer.dataset.tooltip = name
        guildItemContainer.dataset.guildId = guildId

        guildItemContainer.addEventListener("click", () => {
            ipcRenderer.send("requestOpenGuildContent", guildId)
            // Send signal to main process, main process thens sends back another signal with required data
        });




        let guildnameIcon = document.createElement("img")
        guildnameIcon.className = "guildListItemIcon"
        guildnameIcon.src=imageUrl

        guildItemContainer.append(guildnameIcon)
        guildlist.append(guildItemContainer)
    })


})


document.addEventListener("keydown", function (e) {
    if (e.code==="F12") {
        ipcRenderer.send("devtools")
    }
});

