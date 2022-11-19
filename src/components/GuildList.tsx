import {defineComponent} from "../utils";
import {discordApi} from "../api";
import classes from "./GuildList.module.css";

const GuildListItem = defineComponent <{
    guild: SimplifiedGuildInfo,
    callback?:(guildId:SimplifiedGuildInfo)=>void,
    selectedGuild: SimplifiedGuildInfo| null
}>
    (props => {
    return (<li>

        <a onClick={event => {props.callback?.(props.guild)}} className={classes.guildlistItem} data-selected={props.selectedGuild==props.guild?"true":"false"}>
            {
                props.guild.iconUrl!==null?<img src={props.guild.iconUrl} alt={"Guild Icon"}/>:props.guild.name
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
        {
            props.guilds.map((value, index) => {
                return <GuildListItem key={index} guild={value} callback={props.onSelectGuild} selectedGuild={props.selectedGuild}/>
            })
        }
    </ul>)
})
