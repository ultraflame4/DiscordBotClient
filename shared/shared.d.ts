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
        type: StringChannelType,
        /**
         * The id of the parent channel, if this is a child channel.
         *
         * Used for threads and categories (if this channel is in a category).
         */
        parentId?: string|null,
        position: number,
        viewable:boolean
    }

    interface SimplifiedMessageItem{
        id:string,
        author_id:string,
        author_name:string,
        author_icon?:string,
        last_edit:Date,
        posted:Date,
        /**
         * Requires Message Content Intent, else will be null
         */
        content:string|null,

    }

    interface IPreloadDiscordApi {
        ready: boolean;
        login(token: string): Promise<boolean>;
        /** Returns the username of the discord bot */
        getUsername(): Promise<string|null>;
        /** Returns the username of the discord bot */
        getGuildList(): Promise<SimplifiedGuildInfo[]>;
        getGuildChannels(guildId: string): Promise<SimplifiedChannelInfo[]>;
        checkBotLoggedIn(): Promise<boolean>;
        getChannelMessages(channelId: string): Promise<SimplifiedMessageItem[]>

    }
}
