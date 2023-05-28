import {ChannelManager, Client, GatewayIntentsString} from "discord.js";

let client: Client | null;

export function getClient():Client {
    if (!client) {
        throw new Error("Client not initialized!");
    }
    return client;
}


export const ClientIntentsConfig:Partial<Record<GatewayIntentsString, boolean>> = {
    Guilds: true
}

export function loginClient(token: string): Promise<boolean> {
    let client_ = new Client({
        intents: <GatewayIntentsString[]>Object.entries(ClientIntentsConfig).filter(([k,v])=>v).map(([k,v])=>k)
    });

    return new Promise((resolve, reject) => {
        client_.on("ready", (e) => {
            client = client_;
            console.log("Logged in as", client?.user);

            resolve(true);
        })
        console.log("Logging in...");
        client_.login(token).catch((e) => {
            console.error("Failed to login", e);
            resolve(false);
        })

    })


}

export function checkBotLoggedIn(): boolean {
    return client?.isReady()??false;
}

export function logoutClient(): void {
    client?.destroy();
}
