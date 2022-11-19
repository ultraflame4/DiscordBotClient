import {defineComponent} from "../utils";
import classes from "./ChannelList.module.css";
import {useEffect, useState} from "react";
import {discordApi} from "../api";

const ChannelListItem = defineComponent<{ info: SimplifiedChannelInfo }>(props => {
    return (<li>
        {props.info.name}
    </li>)
})

export default defineComponent<{
    guildId: string|undefined
}>(props => {
    const [channels, setChannels] = useState<SimplifiedChannelInfo[]>([])

    useEffect(() => {

        if (props.guildId) {
            discordApi.getChannelList(props.guildId).then(channels => {
                setChannels(channels)

            })
        }
    }, [props.guildId])


    return (<ul className={classes.channelList}>
        <img className={classes.guildBanner} src={"https://picsum.photos/400"} alt={"Guild Banner"}/>
        {
            channels.map((value, index) => <ChannelListItem info={value} key={index}/>)
        }
    </ul>)
})
