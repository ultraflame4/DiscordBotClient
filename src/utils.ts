import {Ref, ref, UnwrapRef, watch} from "vue";

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
        type: "bot-home",
        position: 0,
    },
    {
        id: "bot-others",
        name: "Others",
        desc: "",
        type: "bot-home",
        position: 1
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



class ContextStorageProperty<T>  {
    private ctxStore: ContextStore;
    private readonly key: ()=>string;
    private readonly defaultValue: (()=>T)|null;

    constructor(ctxStore: ContextStore, keyGetter: ()=>string, defaultValue: (()=>T)|null=null) {
        this.ctxStore = ctxStore
        this.key = keyGetter;
        this.defaultValue = defaultValue;

    }

    public get(defaultVal_: T | null = null): T {
        // @ts-ignore
        return this.ctxStore.get<T>(this.key(), defaultVal_ ?? this.defaultValue)
    }

    set(val: T) {
        this.ctxStore.set<T>(this.key(), val)
    }
}

class ContextStore {
    private data: Record<string, any> = {}

    constructor() {
        this.data = {}
    }

    set<T>(key: string, value: any) {
        this.data[key] = value
    }

    get<T>(key: string, default_: T): T {

        return this.data[key] ?? default_
    }

    use<T>(keyGetter:()=>string,default_val: (()=>T)|null=null): ContextStorageProperty<T>{
        return new ContextStorageProperty<T>(this,keyGetter,default_val)
    }

    /**
     * Like this.use(), but returns a ref, and watches it for changes. When there are changes, also calls set
     * @param key
     * @param default_val
     */
    useRef<T>(key:()=>string,default_val: ()=>T):[Ref<UnwrapRef<T>>,ContextStorageProperty<T>]{
        let val = this.use(key,default_val)
        let valRef = ref<T>(val.get())
        watch(valRef,value => {val.set(<T>value)})

        return [valRef,val]
    }
}

export const ChannelListCtx = new ContextStore()
//@ts-ignore
window.ChannelListCtx=ChannelListCtx
