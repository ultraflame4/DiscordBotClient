import {IpcMainInvokeEvent} from 'electron';
import {getClient} from "./discordHandler";
import {Snowflake, TextChannel} from "discord.js";

export async function getBotUsername(e: IpcMainInvokeEvent) {
    return getClient().user?.username ?? "< Error client.user is null >";
}

/**
 * Returns a list of channels for a given guild
 * @param e
 * @param guildId
 */
export async function getGuildChannels(e: IpcMainInvokeEvent, guildId: Snowflake): Promise<SimplifiedChannelInfo[]> {
    const guild = await getClient().guilds.fetch(guildId)
    if (!guild.available) {
        console.error("Unable to get guild channels for guild ", guildId, ". Guild is unavailable.")
        return [];
    }
    let channels = (await guild.channels.fetch())
    return channels.map((channel,id) => {
        if (!channel){
            console.warn(`Channel ${id} is null!`)
        }
        return {
            id: id,
            name: channel!.name,
            desc: (<TextChannel>channel).topic ?? null,
            type: channel!.type

        }
    })
}

export async function getBotGuilds(e: IpcMainInvokeEvent): Promise<SimplifiedGuildInfo[]> {
    const guilds = await getClient().guilds.fetch();
    return guilds.map((guild, id) => {
        return {
            id: id,
            name: guild.name,
            iconUrl: guild.iconURL()
        }
    })
}
