<template>
  <ul class="channelList">

    <img v-if="props.guildBanner" class="guildBanner" :src="props.guildBanner" alt="Guild Banner"/>
    <div v-else style="height:4rem"/>

    <ChannelList_Item v-for="(c,index) in channels"
                      :key="index"
                      :info="c"/>


  </ul>
</template>

<script lang="ts" setup>

import ChannelList_Item from "./ChannelList_Item.vue";
import {inject, Ref, ref, watch} from "vue";
import {BotHomeChannels, BotHomeGuild} from "../../utils";
import {AuthStatus, discordApi} from "../../api";

const props = defineProps<{
  guildId: string,
  guildBanner?: string|null
}>()

const channels = ref<SimplifiedChannelInfo[]>([])
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
