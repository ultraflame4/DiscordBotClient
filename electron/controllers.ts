import {IpcMainInvokeEvent} from 'electron';
import {getClient, loginClient} from "./discordHandler";
import {Snowflake, TextChannel} from "discord.js";
import {ChannelType} from "discord-api-types/v10";
import {ConvertChannelType} from "./tools";


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

export async function getTextChannelMessages(e: IpcMainInvokeEvent, channelId: string): Promise<SimplifiedMessageItem[]> {
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
            last_edit: value.editedAt??value.createdAt,
            posted: value.createdAt,
            id:value.id
        }
    })
    simplified.sort((a,b)=>{
        return a.posted.getTime()-b.posted.getTime()
    })

    return simplified
}
