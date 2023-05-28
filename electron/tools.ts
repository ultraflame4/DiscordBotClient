import {ChannelType} from "discord-api-types/v10";

/**
 * Converts discord.js channel types to string so that we can actually pass it through electron to the client
 * @param type
 * @constructor
 */
export function ConvertChannelType(type: ChannelType): StringChannelType {
    switch (type) {
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
