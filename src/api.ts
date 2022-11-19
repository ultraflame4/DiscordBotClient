
if (!window.discord){
    console.warn("Backend access to Discord API not available, assuming development");
    window.discord = {

        getUsername: async () => "DevUser",
        async getGuildList(): Promise<SimplifiedGuildInfo[]> {
            let testGuilds: SimplifiedGuildInfo[] = []
            for (let i = 0; i < 30; i++) {
                testGuilds.push({
                    id: `0xTestGuildId-${i}`,
                    name: `Test Guild ${i}`,
                    iconUrl: (i%2===0)?null:"https://picsum.photos/400"
                })
            }
            return testGuilds;
        },
        async getChannelList(guildId: string): Promise<SimplifiedChannelInfo[]> {
            let testChannels: SimplifiedChannelInfo[] = []
            for (let i = 0; i < 30; i++) {
                testChannels.push({
                    id: "testchannel1234-"+i,
                    name: `${guildId} - Test Channel ${i}`,
                    desc: "d",
                    type: "text"
                })
            }
            return testChannels
        },

    }
}

export const discordApi:IPreloadDiscordApi = window.discord;
