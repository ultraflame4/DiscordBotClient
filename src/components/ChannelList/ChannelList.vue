<template>
  <ul class="channelList">

    <img v-if="props.guildBanner" class="guildBanner" :src="props.guildBanner" alt="Guild Banner"/>
    <div v-else style="height:4rem"/>
    <template v-for="(c,index) in channels">
      <ChannelCategory  v-if="isCategory(c)" :key="c.data.id" :name="c.data.name" >
        <ChannelList_Item v-for="(c2,index) in c.data.channels"
                          :key="c2.id"
                          :info="c2"/>

      </ChannelCategory>
      <ChannelList_Item v-else :key="c.data.id"
                        :info="c.data"/>

    </template>


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
  guildBanner?: string | null
}>()

interface CategoryGroup {
  id: string,
  name: string,
  channels: SimplifiedChannelInfo[],
  position: number
}

interface ChannelItemType<T> {
  type: StringChannelType
  data: T
  position: number,

}
interface BaseChannelItemType extends ChannelItemType<any>{}
interface CategoryItem extends ChannelItemType<CategoryGroup>{}
interface ChannelItem extends ChannelItemType<SimplifiedChannelInfo>{}


function isCategory(item:ChannelItemType<any>): item is CategoryItem{
  return item.type==="category"
}


const channels = ref<BaseChannelItemType[]>([])


const currentChannel = inject<Ref<SimplifiedChannelInfo>>("selectedChannel")
const authState = inject("authStatus") as Ref<AuthStatus>;


function CategoriseChannels(channels_: SimplifiedChannelInfo[]) { // group, sort and categories channels, and then put them into the ui
  channels.value = []

  channels_.forEach(c => {

    let data=null;

    if (c.parentId !== null) return

    if (c.type==="category"){
      let children = channels_.filter(c2 => c2.parentId === c.id)
      children.sort((a, b) => a.position - b.position)
      data = {
        id: c.id,
        name: c.name,
        channels: children,
        position: c.position
      }

    }


    channels.value.push({
      type: c.type,
      position: c.position,
      data: data??c
    })

  })

  channels.value.sort((a, b) => {
    // In the discord app, channels with no category are always displayed first
    if (a.type==="category" && b.type!=="category"){
      return 1
    }
    return a.position - b.position
  })
}


function UpdateChannels() {
  if (props.guildId === BotHomeGuild.id) {
    CategoriseChannels(BotHomeChannels)
    return
  }

  if (authState.value === AuthStatus.LoggedIn) {
    discordApi.getGuildChannels(props.guildId).then(channels_ => {
      CategoriseChannels(channels_)
    })
  }
}

watch(() => props.guildId, () => {
  UpdateChannels()

}, {
  immediate: true
})


</script>

<style lang="scss" scoped>
.guildBanner {
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
  color: var(--text-b);
}

::-webkit-scrollbar {
  width: 0;
}
</style>
