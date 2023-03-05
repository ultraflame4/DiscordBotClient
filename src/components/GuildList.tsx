import {BotHomeGuild, defineComponent} from "../utils";
import {discordApi} from "../api";
import classes from "./GuildList.module.css";
import {Icon} from "@iconify/react";


interface guildItemProps {
    guild: SimplifiedGuildInfo,
    callback?: (guildId: SimplifiedGuildInfo) => void,
    selectedGuild: SimplifiedGuildInfo | null,
    icon?: string
}

const GuildListItem = defineComponent<guildItemProps>
(props => {
    return (<li>

        <a
            onClick={event => {props.callback?.(props.guild)}}
            className={classes.guildlistItem}
            data-selected={props.selectedGuild == props.guild ? "true" : "false"}
        >
            {
                props.guild.iconUrl !== null ?
                    <img src={props.guild.iconUrl} alt={"Guild Icon"}/> : <Icon icon={props.icon??"zondicons:servers"} className={classes.item_icon}/>
            }
        </a>
    </li>)
})


interface props {
    guilds: SimplifiedGuildInfo[],
    onSelectGuild?: (guildId: SimplifiedGuildInfo) => void,
    selectedGuild: SimplifiedGuildInfo | null
}


export default defineComponent<props>(props => {

    return (<ul className={classes.guildlist}>
        <GuildListItem callback={props.onSelectGuild} selectedGuild={props.selectedGuild}
                       guild={BotHomeGuild} icon={"material-symbols:robot"}/>
        {
            props.guilds.map((value, index) => {
                return <GuildListItem key={index} guild={value} callback={props.onSelectGuild}
                                      selectedGuild={props.selectedGuild}/>
            })
        }
    </ul>)
})
