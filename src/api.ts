
if (!window.discord){
    console.warn("Backend access to Discord API not available, assuming development");
    window.discord = {
        getUsername: async () => "DevUser",
        async getGuildList(): Promise<SimplifiedGuildInfo[]> {
            let testGuilds: SimplifiedGuildInfo[] = []
            for (let i = 0; i < 30; i++) {
                testGuilds.push({
                    id: `000147328957xTestId-${i}`,
                    name: `Test Guild ${i}`,
                    iconUrl: (i%2===0)?null:"https://picsum.photos/400"
                })
            }
            return testGuilds;
        }

    }
}

export const discordApi:IPreloadDiscordApi = window.discord;
