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
import {ref, watch} from "vue";
import {BotHomeChannels, BotHomeGuild} from "../../utils";
import {discordApi} from "../../api";

const props = defineProps<{
  guildId: string,
  guildBanner?: string|null
}>()

const channels = ref<SimplifiedChannelInfo[]>([])

function UpdateChannels() {
  if (props.guildId === BotHomeGuild.id) {
    channels.value=BotHomeChannels
    return
  }

  if (discordApi.ready) {
    discordApi.getGuildChannels(props.guildId).then(channels_=> {
      channels.value = channels_

    })
  }
}

watch(()=>props.guildId,()=>{
  UpdateChannels()
})


</script>

<style lang="scss" scoped>

</style>
