import {defineComponent} from "../utils";
import {discordApi} from "../api";
import classes from "./GuildList.module.css";

const GuildListItem = defineComponent<{ guild: SimplifiedGuildInfo, callback?:(guildId:string)=>void }>(props => {
    return (<li>
        <button onClick={event => {props.callback?.(props.guild.id)}}>
            {props.guild.name}
        </button>
    </li>)
})

interface props {
    guilds: SimplifiedGuildInfo[],
    onSelectGuild?: (guildId: string) => void
}

export default defineComponent<props>(props => {

    return (<ul className={classes.guildlist}>
        {
            props.guilds.map((value, index) => {
                return <GuildListItem key={index} guild={value} callback={props.onSelectGuild}/>
            })
        }
    </ul>)
})
