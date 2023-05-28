import {Message} from "discord.js";
import {GetWindow} from "../window";

class MessagesEvents{
    /**
     * Sent when there is a new message
     */
    newMessage(msg:Message<boolean>) {
        let obj:SimplifiedMessageItem = {
            id: msg.id,
            author_id: msg.author.id,
            author_name: msg.author.username,
            last_edit: msg.editedAt,
            posted: msg.createdAt,
            content: msg.content
        }

        GetWindow().webContents.send("new-message",obj)
    }
}

export default new MessagesEvents()
