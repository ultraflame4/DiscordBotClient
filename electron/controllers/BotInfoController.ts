import {getClient, loginClient} from "../discordHandler";
import {IpcMainInvokeEvent} from "electron";

class BotInfoController_{
    username(e:IpcMainInvokeEvent) {
        return getClient().user?.username ?? "< Error client.user is null >";
    }

    async login(e: IpcMainInvokeEvent,token:string) {
        return await loginClient(token)
    }
}

export default new BotInfoController_()
