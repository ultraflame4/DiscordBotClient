import {getClient} from "../bot/discordHandler";
import {IpcMainInvokeEvent} from "electron";
import {Snowflake, TextChannel} from "discord.js";
import {ConvertChannelType} from "../tools";

class GuildsController_ {
    async guilds(e: IpcMainInvokeEvent): Promise<SimplifiedGuildInfo[]> {
        const guilds = await getClient().guilds.fetch();


        return await Promise.all(guilds.map(async (guild_, id) => {
            const guild = await guild_.fetch();

            return {
                id: id,
                name: guild.name,
                iconUrl: guild.iconURL(),
                bannerUrl: guild.bannerURL(),
            }
        }))
    }

    /**
     * Returns all the channels in the guild
     * @param e
     * @param guildId
     */
    async channels(e: IpcMainInvokeEvent, guildId: Snowflake): Promise<SimplifiedChannelInfo[]>{
        const guild = await getClient().guilds.fetch(guildId)
        if (!guild.available) {
            console.error("Unable to get guild channels for guild ", guildId, ". Guild is unavailable.")
            return [];
        }
        let channels = (await guild.channels.fetch())


        return channels.map((channel, id) => {
            if (!channel) {
                console.warn(`Channel ${id} is null!`)
            }

            return {
                id: id,
                name: channel.name,
                desc: (<TextChannel>channel).topic ?? null,
                type: ConvertChannelType(channel!.type),
                parentId: channel.parentId,
                position: channel.position,
                viewable: channel.viewable
            }
        })
    }
}

export default new GuildsController_()
