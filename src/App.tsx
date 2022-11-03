import "./assets/App.css"
import GuildList from "./components/GuildList";
import {useEffect, useRef, useState} from "react";
import {discordApi} from "./api";



export default function App () {
    const [guildList,setGuildList] = useState<SimplifiedGuildInfo[]>([])

    useEffect(() => {
        discordApi.getGuildList().then(guilds => {
            setGuildList(guilds)
        })
    }, [])



    return (
        <div className="App">
            <div className={"guild-list"}>
                <GuildList guilds={guildList} onSelectGuild={undefined /*todo here*/}/>
            </div>
            <div className={"channels-header"}>

            </div>
            <div className={"channels-list"}>

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

