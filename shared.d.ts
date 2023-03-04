import {Snowflake} from "discord.js";
import {ChannelType} from "discord-api-types/v10";
export {};


declare global {
    interface Window {
        discord: undefined | IPreloadDiscordApi
    }

    interface SimplifiedGuildInfo{ // to expand this later on as needed
        id: Snowflake,
        name: string,
        iconUrl: string | null,
    }

    interface SimplifiedChannelInfo{ // to expand this later on as needed
        id: Snowflake,
        name: string,
        desc: string|null,
        type: ChannelType
    }

    interface IPreloadDiscordApi {
        ready: boolean;
        login(token: string): Promise<boolean>;
        /** Returns the username of the discord bot */
        getUsername(): Promise<string|null>;
        /** Returns the username of the discord bot */
        getGuildList(): Promise<SimplifiedGuildInfo[]>;
        getGuildChannels(guildId: Snowflake): Promise<SimplifiedChannelInfo[]>;

    }
}
