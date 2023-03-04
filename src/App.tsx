import "./assets/App.css"
import GuildList from "./components/GuildList";
import {useEffect, useState} from "react";
import {AuthStatus, discordApi} from "./api";
import ChannelList from "./components/ChannelList";
import {BotHomeGuild} from "./utils";
import BotHomeContent from "./components/BotHomeContent";


export default function App() {
    const [guildList, setGuildList] = useState<SimplifiedGuildInfo[]>([])
    const [openedGuild, setOpenedGuild] = useState<SimplifiedGuildInfo>(BotHomeGuild)
    const [currentChannel, setCurrentChannel] = useState<SimplifiedChannelInfo | null>(null)
    const [authStatus, setAuthStatus] = useState<AuthStatus>(AuthStatus.LoggedOut)

    function UpdateGuildList() {
        if (authStatus!==AuthStatus.LoggedIn) {
            setGuildList([])
            return
        }
        console.log("Updating guild list")

        discordApi.getGuildList().then(guilds => {
            setGuildList(guilds)
        })
    }

    function LoginApi(token: string) {
        setAuthStatus(AuthStatus.LoggingIn)
        discordApi.login(token).then((success) => {
            if (success) {
                setAuthStatus(AuthStatus.LoggedIn)
                return
            }
            alert("Login failed")
            setAuthStatus(AuthStatus.LoggedOut)
        })
    }



    useEffect(() => {
        discordApi.checkBotLoggedIn().then(value => {
            setAuthStatus(value?AuthStatus.LoggedIn:AuthStatus.LoggedOut)
            console.log("Logged in: " + value)
            UpdateGuildList()
        })

    }, [discordApi.ready])

    useEffect(() => {
        UpdateGuildList()
    }, [authStatus])


    return (
        <div className="App">
            <div className={"guild-list"}>
                <GuildList guilds={guildList} onSelectGuild={(g) => {
                    setOpenedGuild(g)
                }} selectedGuild={openedGuild}/>
            </div>
            <div className={"channels-header"}>
                {openedGuild?.name ?? "No guild open"}
            </div>
            <div className={"channels-list"}>
                <ChannelList guildId={openedGuild.id} onSetCurrentChannel={setCurrentChannel}
                             currentChannel={currentChannel}/>
            </div>
            <div className={"user-info"}>

            </div>
            <div className={"content-header"}>
                {currentChannel?.name}
            </div>

            <div className={"content"}>
                {currentChannel?.type === "bot-home" &&
                    <BotHomeContent channel_id={currentChannel.id} on_requestLogin={LoginApi}
                                    authState={authStatus}/>}
            </div>
        </div>
    )
}

