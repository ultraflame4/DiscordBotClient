<template>
  <ul class="channelList">

    <img v-if="props.guildBanner" class="guildBanner" :src="props.guildBanner" alt="Guild Banner"/>
    <div v-else style="height:4rem"/>

    <ChannelCategory v-for="(cat,index) in channelsTree" :name="cat.name">
      <ChannelList_Item v-for="(c,index) in cat.channels"
                        :key="index"
                        :info="c"/>

    </ChannelCategory>


  </ul>
</template>

<script lang="ts" setup>

import ChannelList_Item from "./ChannelList_Item.vue";
import ChannelCategory from "./ChannelCategory.vue";

import {inject, Ref, ref, watch} from "vue";
import {BotHomeChannels, BotHomeGuild} from "../../utils";
import {AuthStatus, discordApi} from "../../api";

const props = defineProps<{
  guildId: string,
  guildBanner?: string|null
}>()

interface ChannelCategory{
  id: string,
  name: string,
  channels: SimplifiedChannelInfo[]
}


const channels = ref<SimplifiedChannelInfo[]>([])
const channelsTree = ref<ChannelCategory[]>([])

const currentChannel = inject<Ref<SimplifiedChannelInfo>>("selectedChannel")
const authState = inject("authStatus") as Ref<AuthStatus>;

function UpdateChannels() {
  if (props.guildId === BotHomeGuild.id) {
    channels.value=BotHomeChannels
    console.log("BotHomeChannels", BotHomeChannels)
    return
  }
  channels.value = []
  if (authState.value === AuthStatus.LoggedIn) {
    discordApi.getGuildChannels(props.guildId).then(channels_=> {
      channels.value = channels_
    })
  }
}

watch(()=>props.guildId,()=>{
  UpdateChannels()
},{
  immediate:true
})
watch(channels,()=>{
  currentChannel!.value = channels.value[0]
  channelsTree.value=[]
  channels.value.filter(c=>c.type==="category").forEach(c=>{
    channelsTree.value.push({
      id: c.id,
      name: c.name,
      channels: channels.value.filter(c2=>c2.parentId===c.id)
    })
  })
  console.log(channelsTree.value)

},{
  immediate:true
})





</script>

<style lang="scss" scoped>
.guildBanner{
  height: 6em;
  width: 100%;
  object-fit: cover;
}


.channelList {
  margin: 0;

  padding: 0;
  overflow-y: auto;
  height: 100%;
  background: var(--surface-color);
}

::-webkit-scrollbar{
  width: 0;
}
</style>
