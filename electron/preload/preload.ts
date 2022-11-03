import {contextBridge, ipcRenderer} from "electron";

const discordApi: IPreloadDiscordApi = {
    getUsername: () => ipcRenderer.invoke('get-username')
}

contextBridge.exposeInMainWorld('discord', discordApi)
