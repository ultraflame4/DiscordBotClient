import {contextBridge, ipcRenderer} from "electron";
import {IPreloadDiscordApi} from "../../global";

const discordApi: IPreloadDiscordApi = {
    getUsername: () => ipcRenderer.invoke('get-username')
}

contextBridge.exposeInMainWorld('discord', discordApi)
