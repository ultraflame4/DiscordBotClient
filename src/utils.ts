import React, {FunctionComponent, PropsWithChildren} from "react";

export function defineComponent<P>(component: FunctionComponent<PropsWithChildren<P>>): FunctionComponent<PropsWithChildren<P>> {
    return component
}



export const BotHomeGuild : SimplifiedGuildInfo = {
    id: "bot-home",
    name: "Bot Home",
    iconUrl: null
}
