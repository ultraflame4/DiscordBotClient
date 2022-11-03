export {};


declare global {
    interface Window {
        discord: undefined | IPreloadDiscordApi
    }

    interface IPreloadDiscordApi {
        /** Returns the username of the discord bot */
        getUsername(): Promise<string|null>;
    }
}
