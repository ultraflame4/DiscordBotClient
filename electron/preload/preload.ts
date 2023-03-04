import {contextBridge, ipcRenderer} from "electron";

const discordApi: IPreloadDiscordApi = {
    ready: false,
    async login (token){
        const success = await ipcRenderer.invoke('login', token)
        this.ready = success;
        return success;
    },

    getUsername: async () => await ipcRenderer.invoke('get-username'),
    getGuildChannels: async (guildId) => ipcRenderer.invoke('get-guild-channels', guildId),
    getGuildList: async () => await ipcRenderer.invoke('get-guilds')


}

contextBridge.exposeInMainWorld('discord', discordApi)
