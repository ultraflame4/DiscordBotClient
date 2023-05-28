import {IpcMainInvokeEvent} from "electron";
import {getClient} from "../bot/discordHandler";
import {ChannelType} from "discord-api-types/v10";


class ChannelsController_ {
    async messages(e: IpcMainInvokeEvent, channelId: string): Promise<SimplifiedMessageItem[]> {
        const channel = await getClient().channels.fetch(channelId)
        if (channel.type !== ChannelType.GuildText || !channel.viewable) {
            return []
        }
        let messages = await channel.messages.fetch({
            limit: 20
        })

        let simplified: SimplifiedMessageItem[] = messages.map((value, id) => {

            let content: string | null;
            try {
                content = value.content
            } catch (e) {
                content = null
            }

            return {
                author_id: value.author.id,
                author_name: value.author.username,
                author_icon: value.author.avatarURL(),
                content: content,
                last_edit: value.editedAt ?? value.createdAt,
                posted: value.createdAt,
                id: value.id
            }
        })
        simplified.sort((a, b) => {
            return a.posted.getTime() - b.posted.getTime()
        })

        return simplified
    }
}

export default new ChannelsController_();
