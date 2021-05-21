const { ipcRenderer } = require('electron')
const Discord = require("discord.js")





window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#botTokenLogin').addEventListener('click', () => {
        ipcRenderer.send("LoginRequest")
    })

    ipcRenderer.on("loggedin", (e,b) => {
        document.querySelector('#botTokenLogin').disabled=b;
    });


    ipcRenderer.on("botready",(e,name,avatarUrl,tag)=>{
        document.getElementById("botstatushere").textContent = "Ready";
        document.getElementById("botnamehere").textContent = name;
        document.getElementById("profile-area-img").src=avatarUrl
        document.getElementById("profile-area-user-name").textContent = name;
        document.getElementById("profile-area-user-id").textContent = tag;
    })


    ipcRenderer.on("openHomeContent",()=>{
        // When in home, no member list, so hide it
        document.getElementById("memberlist-panel").style.display="none"
        document.getElementById("sidebar-header").style.display="none"
    })



    ipcRenderer.on("openGuildContent",(e,guildId,guildName)=>{
        // renable member list.
        document.getElementById("memberlist-panel").style.display="flex"
        let sidebar_header = document.getElementById("sidebar-header")
        sidebar_header.style.display="flex"
        sidebar_header.textContent = guildName
        // clear guild channels
        let channelContainer = document.getElementById("sidebar-channel-container")

        channelContainer.innerHTML=""
        // populate channels
        // console.log("populate")
        ipcRenderer.send("populateGuildChannel",guildId)

    })

    // Add click event listener for home
    document.getElementById("guild-home").addEventListener("click", () => {
        ipcRenderer.send("requestOpenGuildContent", "home")
        // Send signal to main process, main process thens sends back another signal with required data
    });

    ipcRenderer.on("addGuild",(e,name,guildId,imageUrl)=>{
        let guildlist = document.getElementById("guildlist")
        let guildItemContainer = document.createElement("div")
        guildItemContainer.className = "guildListItemContainer row tooltip"
        guildItemContainer.dataset.tooltip = name
        guildItemContainer.dataset.guildid = guildId

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

    ipcRenderer.on("addGuildChannel", (e, guildId, channelId, channelName) => {
        let channel_container = document.getElementById("sidebar-channel-container")
        let channel_block = document.createElement("div")
        let channel_label = document.createElement("label")
        channel_label.textContent="#"+channelName
        channel_label.style.fontSize="inherit"
        channel_block.append(channel_label)
        channel_block.className = "channel-container-item row"
        channel_block.dataset.guildId=guildId
        channel_block.dataset.channelId=channelId
        channel_container.append(channel_block)
    });

})





document.addEventListener("keydown", function (e) {
    if (e.code==="F12") {
        ipcRenderer.send("devtools")
    }
});

