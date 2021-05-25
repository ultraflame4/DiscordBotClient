"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var currentInfo = /** @class */ (function () {
    function currentInfo() {
    }
    currentInfo.reset = function () {
        // Update Ids to null : no channel open yet
        currentInfo.guildId = null;
        currentInfo.txtChannelId = null;
    };
    currentInfo.openHomeContentPanels = function () {
        // Update Ids to null : no channel open yet
        currentInfo.reset();
        currentInfo.clearSidebarContents();
        currentInfo.clearChatContents();
        // When in home, no member list, so hide it
        document.getElementById("guild-sidebar-header").style.display = "none";
        document.getElementById("memberlist-panel").style.display = "none";
        document.getElementById("sidebar-home-options").style.display = "flex";
        document.getElementById("sidebar-home-dms-container").style.display = "flex";
        document.getElementById("chat_content_area").style.display = "none";
    };
    currentInfo.openGuildContentPanels = function () {
        currentInfo.reset();
        currentInfo.clearSidebarContents();
        document.getElementById("guild-sidebar-header").style.display = "flex";
        document.getElementById("memberlist-panel").style.display = "flex";
        document.getElementById("sidebar-home-options").style.display = "none";
        document.getElementById("sidebar-home-dms-container").style.display = "none";
        document.getElementById("chat_content_area").style.display = "flex";
    };
    currentInfo.clearChatContents = function () {
        document.getElementById("messages-container").innerHTML = "";
    };
    currentInfo.clearSidebarContents = function () {
        document.getElementById("sidebar-channel-container").innerHTML = "";
    };
    currentInfo.scrollToBottom = function () {
        var e = document.getElementById("messages-container");
        e.scrollTop = e.scrollHeight;
    };
    currentInfo.guildId = null;
    currentInfo.txtChannelId = null;
    return currentInfo;
}());
window.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#botTokenLogin').addEventListener('click', function () {
        electron_1.ipcRenderer.send("LoginRequest");
    });
    electron_1.ipcRenderer.on("loggedin", function (e, b) {
        document.getElementById('botTokenLogin').disabled = b;
    });
    electron_1.ipcRenderer.on("botready", function (e, name, avatarUrl, tag) {
        document.getElementById("botstatushere").textContent = "Ready";
        document.getElementById("botnamehere").textContent = name;
        document.getElementById("profile-area-img").src = avatarUrl;
        document.getElementById("profile-area-user-name").textContent = name;
        document.getElementById("profile-area-user-id").textContent = tag;
        // setup listener for chat-textinput
        var chattxt_input = document.getElementById("chat-textinput");
        chattxt_input.addEventListener("keyup", function (event) {
            if (event.key == "Enter") {
                electron_1.ipcRenderer.send("textinput-send", chattxt_input.value, currentInfo.txtChannelId);
                chattxt_input.value = "";
                currentInfo.scrollToBottom();
            }
        });
    });
    // Add click event listener for home
    document.getElementById("guild-home").addEventListener("click", function () {
        electron_1.ipcRenderer.send("requestOpenGuildContent", "home");
        // Send signal to main process, main process thens sends back another signal with required data
    });
    // Open Content Listeners
    electron_1.ipcRenderer.on("openHomeContent", function () {
        currentInfo.openHomeContentPanels();
    });
    electron_1.ipcRenderer.on("openGuildContent", function (e, guildId, guildName) {
        currentInfo.openGuildContentPanels();
        // renable member list.
        document.getElementById("memberlist-panel").style.display = "flex";
        var sidebar_header = document.getElementById("sidebar-header-guildname");
        sidebar_header.style.display = "flex";
        if (guildName.length > 26) {
            sidebar_header.textContent = guildName.slice(0, 26) + " ...";
        }
        else {
            sidebar_header.textContent = guildName;
        }
        // clear guild channels
        var channelContainer = document.getElementById("sidebar-channel-container");
        // populate channels
        // console.log("populate")
        currentInfo.guildId = guildId;
        electron_1.ipcRenderer.send("populateGuildChannel", guildId);
    });
    electron_1.ipcRenderer.on("openChannelContent", function (e, channelId, channelName) {
        document.getElementById("chat-title").textContent = "# " + channelName;
        // Clear chat elements
        currentInfo.clearChatContents();
        currentInfo.txtChannelId = channelId;
        electron_1.ipcRenderer.send("populateChannelChat", channelId);
    });
    // addContent Listeners
    electron_1.ipcRenderer.on("addGuild", function (e, name, guildId, imageUrl) {
        var guildlist = document.getElementById("guildlist");
        var guildItemContainer = document.createElement("div");
        guildItemContainer.className = "guildListItemContainer row tooltip";
        guildItemContainer.dataset.tooltip = name;
        guildItemContainer.dataset.guildid = guildId;
        guildItemContainer.addEventListener("click", function () {
            electron_1.ipcRenderer.send("requestOpenGuildContent", guildId);
            // Send signal to main process, main process thens sends back another signal with required data
        });
        var guildnameIcon = document.createElement("img");
        guildnameIcon.className = "guildListItemIcon";
        guildnameIcon.src = imageUrl;
        guildItemContainer.append(guildnameIcon);
        guildlist.append(guildItemContainer);
    });
    electron_1.ipcRenderer.on("addGuildChannel", function (e, channelId, channelName) {
        var channel_container = document.getElementById("sidebar-channel-container");
        var channel_block = document.createElement("div");
        var channel_label = document.createElement("label");
        channel_label.textContent = "# " + channelName;
        channel_label.style.fontSize = "inherit";
        channel_block.append(channel_label);
        channel_block.className = "channel-container-item row";
        channel_block.dataset.channelId = channelId;
        // Add event handler
        channel_block.addEventListener("click", function () {
            electron_1.ipcRenderer.send("requestOpenChannelContent", channelId);
        });
        channel_container.append(channel_block);
    });
    // M E S S A G E  A P P E N D  L I S T E N E R S
    electron_1.ipcRenderer.on("addChatMessage", function (e, text, authorData, createdTimeData, reversed) {
        if (reversed === void 0) { reversed = false; }
        var message_container = document.getElementById("messages-container");
        var message_item;
        var message_content;
        var message_text_container;
        var prev_item;
        if (!reversed) {
            prev_item = message_container.firstChild;
        }
        else {
            prev_item = message_container.lastChild;
        }
        // Check if msg container has any children   | Get prev message item author Id
        if (message_container.childElementCount > 0 &&
            // @ts-ignore
            prev_item.dataset.authorId === authorData.id &&
            // @ts-ignore
            (prev_item.dataset.timestamp - createdTimeData.timestamp) <= 300) {
            // if same author, set the new message-text to same msg-text-container
            message_item = prev_item;
            message_content = message_item.lastChild;
            message_text_container = message_content.lastChild;
        }
        else {
            // else construct new message item
            message_item = document.createElement("div");
            message_item.className = "message-container-item row";
            message_item.dataset.authorId = authorData.id;
            message_item.dataset.timestamp = createdTimeData.timestamp;
            var message_avatar = document.createElement("input");
            message_avatar.className = "message-item-profile";
            message_avatar.type = "image";
            message_avatar.src = authorData.avatarURL;
            message_item.append(message_avatar);
            message_content = document.createElement("div");
            message_content.className = "message-item-content column";
            var message_content_header = document.createElement("div");
            message_content_header.className = "row message-content-header";
            var message_header_authorname = document.createElement("div");
            message_header_authorname.textContent = authorData.name;
            message_content_header.append(message_header_authorname);
            var message_header_timestamp = document.createElement("div");
            message_header_timestamp.className = "msg-header-timestamp";
            message_header_timestamp.textContent = createdTimeData.string;
            message_content_header.append(message_header_timestamp);
            message_text_container = document.createElement("div");
            message_text_container.className = "message-text-container column";
            message_content.append(message_content_header);
            message_content.append(message_text_container);
            message_item.append(message_content);
            if (!reversed) {
                message_container.insertBefore(message_item, message_container.firstChild);
            }
            else {
                message_container.append(message_item);
            }
        }
        var message_text = document.createElement("div");
        message_text.className = "message-text row";
        message_text.textContent = text;
        // appends
        if (!reversed) {
            message_text_container.insertBefore(message_text, message_text_container.firstChild);
        }
        else {
            message_text_container.append(message_text);
        }
        currentInfo.scrollToBottom();
    });
});
document.addEventListener("keydown", function (e) {
    if (e.code === "F12") {
        electron_1.ipcRenderer.send("devtools");
    }
    if (e.code === "F5") {
        electron_1.ipcRenderer.send("reload");
    }
});
//# sourceMappingURL=preload.js.map