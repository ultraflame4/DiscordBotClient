import {Ref, ref, UnwrapRef, watch, WatchSource} from "vue";

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


/**
 * A handler to ease the use of store with a fixed key
 */
class ContextStoreHandler<T>  {
    private ctxStore: ContextStore;
    private readonly key: string;
    private readonly defaultValue: T;

    constructor(ctxStore: ContextStore, keyGetter: string, defaultValue: T) {
        this.ctxStore = ctxStore
        this.key = keyGetter;
        this.defaultValue = defaultValue;

    }

    get(defaultVal_: T | null = null): T {

        return this.ctxStore.get<T>(this.key, defaultVal_ ?? this.defaultValue)
    }

    set(val: T) {
        this.ctxStore.set<T>(this.key, val)
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

    use<T>(key:string,default_val: T): ContextStoreHandler<T>{
        return new ContextStoreHandler<T>(this,key,default_val)
    }

    /**
     * Watches this ref and updates data in the store whenever there are changes
     * @param key
     * @param default_val
     * @param ref
     */
    watchRef<T>(key:()=>string,ref:Ref<T>){
        watch<T>(ref,value => {
            this.set(key(),value)
        })
    }




    /**
     * Similar to watch ref, instead creates a ref, that can be updated to read from the store depending on the dependencies
     * @param key Key of the store. Is a callback to allow for dynamic key changes. Eg. the key is a ref.
     * @param initial_value The initial value of the ref and default value used as fallback unless new_val specified otherwise.
     * @param new_val Called whenever the ref cannot get a value from the store and needs to fallback on a default value. Return null to use initial_value
     * @param dependencies List of sources that when change tells the ref to read stored data from the store. Typically, any variables used in the key shld be in here.
     */
    useRef<T>(key:()=>string,initial_value:T,new_val:null|((ref:Ref<UnwrapRef<T>>)=>void)=null,dependencies:WatchSource[]=[]):Ref<UnwrapRef<T>>{
        let valRef = ref<T>(initial_value)
        this.watchRef(key,valRef)

        if (dependencies.length>0){
            watch(dependencies,value => {

                let _val = this.get<T|null>(key(),null)
                if (_val===null) {
                    if (new_val) {
                        new_val(valRef);
                        return
                    }
                    _val=initial_value
                }
                //@ts-ignore
                valRef.value=_val
            })
        }
        return valRef
    }
}

export const ChannelListCtx = new ContextStore()
//@ts-ignore
window.ChannelListCtx=ChannelListCtx
