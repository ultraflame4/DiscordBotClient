export {};


declare global {
    interface Window {
        discord: undefined | IPreloadDiscordApi
    }

    interface SimplifiedGuildInfo{ // to expand this later on as needed
        id: string,
        name: string,
        iconUrl: string | null,
    }

    interface SimplifiedChannelInfo{ // to expand this later on as needed
        id: string,
        name: string,
        desc: string,
        type: "text" | "voice" | "thread" | "category" | "news" | "stage" | "forum"
    }

    interface IPreloadDiscordApi {
        /** Returns the username of the discord bot */
        getUsername(): Promise<string|null>;
        /** Returns the username of the discord bot */
        getGuildList(): Promise<SimplifiedGuildInfo[]>;
        getChannelList(guildId: string): Promise<SimplifiedChannelInfo[]>;

    }
}
