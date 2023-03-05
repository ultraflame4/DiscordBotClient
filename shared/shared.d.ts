export {};

declare global {
    interface Window {
        discord: undefined | IPreloadDiscordApi
    }

    type StringChannelType = "text" | "bot-home" | "dm" | "voice" | "category" | "news" | "unknown" | "thread"

    interface SimplifiedGuildInfo{ // to expand this later on as needed
        id: string,
        name: string,
        iconUrl: string | null,
        bannerUrl?: string | null,
    }

    interface SimplifiedChannelInfo{ // to expand this later on as needed
        id: string,
        name: string,
        desc: string|null,
        type: StringChannelType
    }



    interface IPreloadDiscordApi {
        ready: boolean;
        login(token: string): Promise<boolean>;
        /** Returns the username of the discord bot */
        getUsername(): Promise<string|null>;
        /** Returns the username of the discord bot */
        getGuildList(): Promise<SimplifiedGuildInfo[]>;
        getGuildChannels(guildId: Snowflake): Promise<SimplifiedChannelInfo[]>;
        checkBotLoggedIn(): Promise<boolean>;

    }
}
