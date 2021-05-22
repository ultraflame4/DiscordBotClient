const { ipcRenderer } = require('electron')


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

    // Add click event listener for home
    document.getElementById("guild-home").addEventListener("click", () => {
        ipcRenderer.send("requestOpenGuildContent", "home")
        // Send signal to main process, main process thens sends back another signal with required data
    });



    // Open Content Listeners

    ipcRenderer.on("openHomeContent",()=>{
        // When in home, no member list, so hide it
        document.getElementById("memberlist-panel").style.display="none"
        document.getElementById("sidebar-header").style.display="none"
    })



    ipcRenderer.on("openGuildContent",(e,guildId,guildName)=>{
        // renable member list.
        document.getElementById("memberlist-panel").style.display="flex"
        let sidebar_header = document.getElementById("sidebar-header-guildname")
        sidebar_header.style.display="flex"
        if (guildName.length > 26){
            sidebar_header.textContent = guildName.slice(0,26) + " ..."
        }
        else{
            sidebar_header.textContent = guildName
        }
        // clear guild channels
        let channelContainer = document.getElementById("sidebar-channel-container")

        channelContainer.innerHTML=""
        // populate channels
        // console.log("populate")
        ipcRenderer.send("populateGuildChannel",guildId)

    })

    ipcRenderer.on("openChannelContent",(e,channelId,channelName)=>{
        document.getElementById("chat-title").textContent = "# "+channelName
        // Clear chat elements
        document.getElementById("messages-container").innerHTML=""
        ipcRenderer.send("populateChannelChat",channelId)
    })


    // addContent Listeners

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

    ipcRenderer.on("addGuildChannel", (e, channelId, channelName) => {
        let channel_container = document.getElementById("sidebar-channel-container")
        let channel_block = document.createElement("div")
        let channel_label = document.createElement("label")
        channel_label.textContent="# "+channelName
        channel_label.style.fontSize="inherit"
        channel_block.append(channel_label)
        channel_block.className = "channel-container-item row"
        channel_block.dataset.channelId=channelId

        // Add event handler
        channel_block.addEventListener("click",()=>{
            ipcRenderer.send("requestOpenChannelContent",channelId)
        })

        channel_container.append(channel_block)
    });


    ipcRenderer.on("addChatMessage",(e,text,authorData,createdTimeData)=>{
        let message_container = document.getElementById("messages-container")

        let message_item;
        let message_content;
        let message_text_container;

        // Check if msg container has any children   | Get prev message item author Id
        if (message_container.childElementCount>0){
            console.log(createdTimeData.timestamp-message_container.firstChild.dataset.timestamp)
            console.log(createdTimeData.timestamp,message_container.firstChild.dataset.timestamp)
        }
        if (message_container.childElementCount > 0 &&
            message_container.firstChild.dataset.authorId===authorData.id &&
            (message_container.firstChild.dataset.timestamp-createdTimeData.timestamp) <=300){
            // if same author, set the new message-text to same msg-text-container

            message_item = message_container.firstChild
            message_content = message_item.lastChild
            message_text_container = message_content.lastChild

        }
        else{
            // else construct new message item

            message_item = document.createElement("div")
            message_item.className = "message-container-item row"
            message_item.dataset.authorId = authorData.id
            message_item.dataset.timestamp = createdTimeData.timestamp

            let message_avatar = document.createElement("input")
            message_avatar.className = "message-item-profile"
            message_avatar.type="image"
            message_avatar.src = authorData.avatarURL
            message_item.append(message_avatar)

            message_content = document.createElement("div")
            message_content.className="message-item-content column"

            let message_content_header = document.createElement("div")
            message_content_header.className="row message-content-header"

            let message_header_authorname = document.createElement("div")
            message_header_authorname.textContent=authorData.name

            message_content_header.append(message_header_authorname)

            let message_header_timestamp = document.createElement("div")
            message_header_timestamp.className="msg-header-timestamp"
            message_header_timestamp.textContent = createdTimeData.string
            message_content_header.append(message_header_timestamp)

            message_text_container = document.createElement("div")
            message_text_container.className="message-text-container column"

            message_content.append(message_content_header)
            message_content.append(message_text_container)

            message_item.append(message_content)
            message_container.insertBefore(message_item,message_container.firstChild)

        }

        let message_text = document.createElement("div")
        message_text.className="message-text row"
        message_text.textContent = text

        // appends

        message_text_container.insertBefore(message_text,message_text_container.firstChild)


    })

})





document.addEventListener("keydown", function (e) {
    if (e.code==="F12") {
        ipcRenderer.send("devtools")
    }
});

