import React, {FunctionComponent, PropsWithChildren} from "react";

export function defineComponent<P>(component: FunctionComponent<PropsWithChildren<P>>): FunctionComponent<PropsWithChildren<P>> {
    return component
}


export const BotHomeGuild: SimplifiedGuildInfo = {
    id: "bot-home",
    name: "Bot Home",
    iconUrl: null,
    bannerUrl: "https://picsum.photos/400",

}

export const BotHomeChannels: SimplifiedChannelInfo[] = [
    {
        id: "bot-account",
        name: "Authentication",
        desc: "",
        type: "bot-home"
    },
    {
        id: "bot-others",
        name: "Others",
        desc: "",
        type: "bot-home"
    },
]
export function GetBotHomeIcon(channelId: string): string {
    switch (channelId) {
        case "bot-account":
            return "ph:key-fill"
        case "bot-others":
            return "uiw:more"

        default:
            return "material-symbols:question-mark"
    }
}
