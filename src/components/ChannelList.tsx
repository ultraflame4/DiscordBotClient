import {BotHomeGuild, defineComponent} from "../utils";
import classes from "./ChannelList.module.css";
import {useEffect, useState} from "react";
import {discordApi} from "../api";

const ChannelListItem = defineComponent<{ info: SimplifiedChannelInfo }>(props => {
    return (<li>
        {props.info.name}
    </li>)
})

export default defineComponent<{
    guildId: string
}>(props => {
    const [channels, setChannels] = useState<SimplifiedChannelInfo[]>([])

    function UpdateChannels() {
        if (props.guildId!==BotHomeGuild.id && discordApi.ready) {
            discordApi.getGuildChannels(props.guildId).then(channels => {
                setChannels(channels)

            })
        }
    }

    useEffect(() => {
        UpdateChannels()
    }, [props.guildId])


    return (<ul className={classes.channelList}>
        <img className={classes.guildBanner} src={"https://picsum.photos/400"} alt={"Guild Banner"}/>
        {
            channels.map((value, index) => <ChannelListItem info={value} key={index}/>)
        }
    </ul>)
})
