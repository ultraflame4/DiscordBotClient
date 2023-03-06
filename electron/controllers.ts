import {IpcMainInvokeEvent} from 'electron';
import {getClient, loginClient} from "./discordHandler";
import {ChannelType, Snowflake, TextChannel} from "discord.js";
import {ChannelType} from "discord-api-types/v10";

export async function getBotUsername(e: IpcMainInvokeEvent) {
    return getClient().user?.username ?? "< Error client.user is null >";
}

function convertChannelType(type:ChannelType) : StringChannelType{
    switch (type){
        case ChannelType.GuildText:
            return "text";

        case ChannelType.DM:
            return "dm";

        case ChannelType.GuildVoice:
            return "voice";

        case ChannelType.GroupDM:
            return "dm";

        case ChannelType.GuildCategory:
            return "category";

        case ChannelType.GuildAnnouncement:
            return "news";

        case ChannelType.AnnouncementThread:
            return "news";
        case ChannelType.PublicThread:
            return "thread";
        case ChannelType.PrivateThread:
            return "thread";
        case ChannelType.GuildStageVoice:
            return "voice";
        case ChannelType.GuildDirectory:
            return "unknown";
        case ChannelType.GuildForum:
            return "unknown";
        default:
            return "unknown";
    }
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
            name: channel.name,
            desc: (<TextChannel>channel).topic ?? null,
            type: convertChannelType(channel!.type),
            parentId: channel.parentId,
            position: channel.position,

        }
    })
}

export async function getBotGuilds(e: IpcMainInvokeEvent): Promise<SimplifiedGuildInfo[]> {
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

export async function botLogin(e: IpcMainInvokeEvent, token: string) {
    return await loginClient(token)
}

export async function getTextChannelMessages(e: IpcMainInvokeEvent, channelId: string){
    const channel = await getClient().channels.fetch(channelId)
    if (channel.type !== ChannelType.GuildText) {
        return []
    }
    let messages = await channel.messages.fetch({
        limit: 20
    })

    // todo
}
