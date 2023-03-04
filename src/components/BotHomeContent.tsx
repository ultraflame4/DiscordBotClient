import {defineComponent} from "../utils";
import classes from "./BotHomeContent.module.css";
import {discordApi} from "../api";
import {useRef} from "react";


interface BotHomeAuthProps{
    onLogin: (token: string) => void
}

const BotHomeAuth = defineComponent<BotHomeAuthProps>(props => {
    const tokenInp = useRef<HTMLInputElement>(null)


    return <>
        <label htmlFor={"token"}>Token</label>
        <input type={"password"} placeholder={"Enter Bot Api token"} id={"token"} disabled={discordApi.ready} ref={tokenInp}/>
        <button onClick={e=>props.onLogin(tokenInp.current?.value??"")}>Login</button>
    </>
})

interface BotHomeProps{
    channel_id: string,
    on_requestLogin: (token: string) => void
}

export default defineComponent<BotHomeProps>(props => {

    return <div className={classes.botHomeContent}>
        {props.channel_id === "bot-account" && <BotHomeAuth onLogin={props.on_requestLogin}/>}
    </div>
})
