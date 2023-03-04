import "./assets/App.css"
import GuildList from "./components/GuildList";
import {useEffect, useRef, useState} from "react";
import {discordApi} from "./api";
import ChannelList from "./components/ChannelList";
import {BotHomeGuild} from "./utils";


export default function App () {
    const [guildList,setGuildList] = useState<SimplifiedGuildInfo[]>([])
    const [openedGuild,setOpenedGuild] = useState<SimplifiedGuildInfo>(BotHomeGuild)

    function UpdateGuildList() {
        if (!discordApi.ready){
            setGuildList([])
            return
        }
        discordApi.getGuildList().then(guilds => {
            setGuildList(guilds)
        })
    }

    useEffect(() => {
        UpdateGuildList()

    }, [discordApi.ready])



    return (
        <div className="App">
            <div className={"guild-list"}>
                <GuildList guilds={guildList} onSelectGuild={(g)=>{setOpenedGuild(g)}} selectedGuild={openedGuild}/>
            </div>
            <div className={"channels-header"}>
                {openedGuild?.name??"No guild open"}
            </div>
            <div className={"channels-list"}>
                <ChannelList guildId={openedGuild.id}/>
            </div>
            <div className={"user-info"}>

            </div>
            <div className={"content-header"}>

            </div>

            <div className={"content"}>

            </div>
        </div>
    )
}

