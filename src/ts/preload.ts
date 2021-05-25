import { ipcRenderer } from 'electron'

class currentInfo{
    static guildId :string|null = null
    static txtChannelId :string|null = null

    static reset(){
        // Update Ids to null : no channel open yet
        currentInfo.guildId=null
        currentInfo.txtChannelId=null
    }


    static openHomeContentPanels(){
        // Update Ids to null : no channel open yet
        currentInfo.reset()
        currentInfo.clearSidebarContents()
        currentInfo.clearChatContents()

        // When in home, no member list, so hide it
        document.getElementById("guild-sidebar-header").style.display="none"
        document.getElementById("memberlist-panel").style.display="none"
        document.getElementById("sidebar-home-options").style.display="flex"
        document.getElementById("sidebar-home-dms-container").style.display="flex"
        document.getElementById("chat_content_area").style.display="none"
    }

    static openGuildContentPanels(){
        currentInfo.reset()
        currentInfo.clearSidebarContents()
        currentInfo.clearMemberList()
        document.getElementById("guild-sidebar-header").style.display="flex"
        document.getElementById("memberlist-panel").style.display="flex"
        document.getElementById("sidebar-home-options").style.display="none"
        document.getElementById("sidebar-home-dms-container").style.display="none"
        document.getElementById("chat_content_area").style.display="flex"

    }

    static clearMemberList(){
        document.getElementById("memberlist-panel").innerHTML=""
    }

    static clearChatContents(){
        document.getElementById("messages-container").innerHTML=""
    }

    static clearSidebarContents(){
        document.getElementById("sidebar-channel-container").innerHTML=""
    }

    static scrollToBottom(){
        let e = document.getElementById("messages-container")
        e.scrollTop=e.scrollHeight
    }
}

window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#botTokenLogin').addEventListener('click', () => {
        ipcRenderer.send("LoginRequest")
    })

    ipcRenderer.on("loggedin", (e,b:boolean) => {
        (<HTMLButtonElement>document.getElementById('botTokenLogin')).disabled=b;
    });


    ipcRenderer.on("botready",(e,name,avatarUrl,tag)=>{
        document.getElementById("botstatushere").textContent = "Ready";
        document.getElementById("botnamehere").textContent = name;
        (<HTMLImageElement>document.getElementById("profile-area-img")).src=avatarUrl
        document.getElementById("profile-area-user-name").textContent = name;
        document.getElementById("profile-area-user-id").textContent = tag;

        // setup listener for chat-textinput
        let chattxt_input=(<HTMLInputElement>document.getElementById("chat-textinput"))
        chattxt_input.addEventListener("keyup",(event:KeyboardEvent)=>{
            if (event.key=="Enter"){
                ipcRenderer.send("textinput-send",chattxt_input.value, currentInfo.txtChannelId)
                chattxt_input.value=""
                currentInfo.scrollToBottom()
            }
        })


    })

    // Add click event listener for home
    document.getElementById("guild-home").addEventListener("click", () => {
        ipcRenderer.send("requestOpenGuildContent", "home")
        // Send signal to main process, main process thens sends back another signal with required data
    });



    // Open Content Listeners

    ipcRenderer.on("openHomeContent",()=>{
        currentInfo.openHomeContentPanels()
    })



    ipcRenderer.on("openGuildContent",(e,guildId,guildName)=>{
        currentInfo.openGuildContentPanels()

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

        // populate channels

        currentInfo.guildId=guildId
        ipcRenderer.send("populateGuildChannel",guildId)
        // populate memberlist
        ipcRenderer.send("populateMemberList",guildId)

    })

    ipcRenderer.on("openChannelContent",(e,channelId,channelName)=>{
        document.getElementById("chat-title").textContent = "# "+channelName
        // Clear chat elements
        currentInfo.clearChatContents()
        currentInfo.txtChannelId=channelId
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


    // M E S S A G E  A P P E N D  L I S T E N E R S

    ipcRenderer.on("addChatMessage",(e,text,authorData,createdTimeData,reversed:boolean=false)=>{
        let message_container = document.getElementById("messages-container")

        let message_item;
        let message_content;
        let message_text_container;

        let prev_item;
        if (!reversed){
            prev_item=message_container.firstChild
        }
        else {prev_item=message_container.lastChild}

        // Check if msg container has any children   | Get prev message item author Id
        if (message_container.childElementCount > 0 &&
            // @ts-ignore
            prev_item.dataset.authorId===authorData.id &&
            // @ts-ignore
            (prev_item.dataset.timestamp-createdTimeData.timestamp) <=300){
            // if same author, set the new message-text to same msg-text-container

            message_item = prev_item
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

            if (!reversed){
                message_container.insertBefore(message_item,message_container.firstChild)
            }
            else {
                message_container.append(message_item)
            }

        }

        let message_text = document.createElement("div")
        message_text.className="message-text row"
        message_text.textContent = text

        // appends
        if (!reversed){
            message_text_container.insertBefore(message_text,message_text_container.firstChild)
        }
        else{
            message_text_container.append(message_text)
        }
        currentInfo.scrollToBottom()

    })


    ipcRenderer.on("addMember",(e,member)=>{
        let container = document.getElementById("memberlist-panel")

        let person_item = document.createElement("div")
        person_item.className="row person-item"

        let person_item_avatar = document.createElement("input")
        person_item_avatar.type="image";person_item_avatar.className="person-avatar";person_item_avatar.src=member.avatarURL
        person_item.append(person_item_avatar)

        let person_info = document.createElement("div")
        person_info.className="person-info column"


        let person_info_name = document.createElement("div")
        person_info_name.textContent = member.username
        let person_info_status = document.createElement("div")
        person_info_status.textContent = member.status

        person_info.append(person_info_name);person_info.append(person_info_status)

        person_item.append(person_info)

        container.append(person_item)

    })

})





document.addEventListener("keydown", function (e) {
    if (e.code==="F12") {
        ipcRenderer.send("devtools")
    }

    if (e.code==="F5") {
        ipcRenderer.send("reload")
    }
});

