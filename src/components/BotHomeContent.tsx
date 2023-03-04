import {defineComponent} from "../utils";
import classes from "./BotHomeContent.module.css";
import {AuthStatus, discordApi} from "../api";
import {ReactHTML, ReactNode, useRef, useState} from "react";
import {Icon} from "@iconify/react";


interface BotHomeAuthProps {
    onLogin: (token: string) => void,
    authState: AuthStatus
}

const BotHomeAuth = defineComponent<BotHomeAuthProps>(props => {
    const tokenInp = useRef<HTMLInputElement>(null)

    const _disabled = props.authState===AuthStatus.LoggedIn||props.authState===AuthStatus.LoggingIn

    let btnContents: ReactNode;
    switch (props.authState) {
        case AuthStatus.LoggedIn:
            btnContents = "Logged in"
            break;
        case AuthStatus.LoggingIn:
            btnContents = ". . ."
            break;
        case AuthStatus.LoggedOut:
            btnContents = "Login"
            break;
    }

    return <>
        <label htmlFor={"token"}>Token</label>
        <input type={"password"} placeholder={"Enter Bot Api token"} id={"token"} disabled={_disabled}
               ref={tokenInp}/>
        <button onClick={e => props.onLogin(tokenInp.current?.value ?? "")} disabled={_disabled}>
            {btnContents}
        </button>
    </>
})

interface BotHomeProps {
    channel_id: string,
    on_requestLogin: (token: string) => void,
    authState: AuthStatus
}

export default defineComponent<BotHomeProps>(props => {

    return <div className={classes.botHomeContent}>
        {props.channel_id === "bot-account" && <BotHomeAuth onLogin={props.on_requestLogin} authState={props.authState}/>}
    </div>
})
