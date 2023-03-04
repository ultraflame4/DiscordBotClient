import {BotHomeChannels, BotHomeGuild, defineComponent, GetBotHomeIcon} from "../utils";
import classes from "./ChannelList.module.css";
import {useEffect, useState} from "react";
import {discordApi} from "../api";
import {InlineIcon} from "@iconify/react";


interface channelItemProps {
    info: SimplifiedChannelInfo,
    icon?: string,
    selectedChannel: SimplifiedChannelInfo
    onSelectChannel?: (channel: SimplifiedChannelInfo) => void
}

function getChannelIcon(channel: SimplifiedChannelInfo): string {

    switch (channel.type) {

        case "voice":
            return "mingcute:voice-fill"
        case "text":
            return "fa-solid:hashtag"
        default:
            return "material-symbols:question-mark"
    }
}

const ChannelListItem = defineComponent<channelItemProps>(props => {
    let icon = props.icon ?? (props.info.type === "bot-home" ? GetBotHomeIcon(props.info.id) : getChannelIcon(props.info))


    return (<li className={classes.channelItem} data-selected={props.selectedChannel === props.info}
                onClick={()=>props.onSelectChannel?.(props.info)}>
        <InlineIcon icon={icon} className={classes.item_icon}/>
        {props.info.name}
    </li>)
})


interface ChannelListProps {
    guildId: string

}

export default defineComponent<ChannelListProps>(props => {
    const [channels, setChannels] = useState<SimplifiedChannelInfo[]>([])
    const [openedChannel,setOpenedChannel] = useState<SimplifiedChannelInfo>(channels[0])

    const guildBanner = "https://picsum.photos/400"

    function UpdateChannels() {
        if (props.guildId === BotHomeGuild.id) {
            setChannels(BotHomeChannels)
            return
        }

        if (discordApi.ready) {
            discordApi.getGuildChannels(props.guildId).then(channels => {
                setChannels(channels)
            })
        }
    }

    useEffect(() => {
        UpdateChannels()
        setChannels((prev)=>{
            setOpenedChannel(prev[0])
            return prev
        })

    }, [props.guildId])

    return (<ul className={classes.channelList}>
        {guildBanner ? <img className={classes.guildBanner} src={guildBanner} alt={"Guild Banner"}/> :
            <div style={{height: "3rem"}}/>}
        {
            channels.map((value, index) => <ChannelListItem info={value} key={index}
                                                            selectedChannel={openedChannel} onSelectChannel={(c)=>setOpenedChannel(c)}/>)
        }
    </ul>)
})
