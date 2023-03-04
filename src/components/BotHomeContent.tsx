import {defineComponent} from "../utils";
import classes from "./BotHomeContent.module.css";
import {discordApi} from "../api";


const BotHomeAuth = defineComponent(props => {
    return <div className={classes.botHomeContent}>
        <label htmlFor={"token"}>Bot Key</label>
        <input type={"password"} placeholder={"Enter Api Key"} id={"token"} disabled={discordApi.ready}/>
        <button>Login</button>
    </div>
})

interface BotHomeProps{
    channel_id: string
}

export default defineComponent<BotHomeProps>(props => {

    return <div className={classes.botHomeContent}>
        {props.channel_id === "bot-account" && <BotHomeAuth/>}
    </div>
})
