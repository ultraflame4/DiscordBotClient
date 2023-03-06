<template>
  <li class="channelItem" :data-selected="selectedChannel?.id === props.info.id" @click="selectThisChannel" :data-viewable="props.viewable">
    <Icon :icon="getIcon()" class="item_icon" :inline="true"/>
    {{ props.info.name }}
  </li>
</template>

<script lang="ts" setup>
import {inject, Ref} from "vue";
import {Icon} from "@iconify/vue";
import {GetBotHomeIcon} from "../../utils";

const props = defineProps<{
  info: SimplifiedChannelInfo,
  viewable?: boolean,
  icon?: string
}>()

const selectedChannel = inject<Ref<SimplifiedChannelInfo>>('selectedChannel')

const getIcon = ()=> props.icon ?? (props.info.type === "bot-home" ? GetBotHomeIcon(props.info.id) : getChannelIcon(props.info))

function getChannelIcon(channel: SimplifiedChannelInfo): string {

  switch (channel.type) {

    case "voice":
      return "mingcute:voice-fill"
    case "text":
      return "fa-solid:hashtag"
    default:
      return "material-symbols:question-mark"
  }
}
function selectThisChannel(){
  if (!props.viewable) return
  selectedChannel!.value = props.info
}

</script>

<style lang="scss" scoped>
.channelItem{

  padding: 0.4em 0.5rem;
  cursor: pointer;
  transition: all 200ms linear;
  border-radius: 0.5em;
  background: transparent;
  font-size: 0.85em;
  font-weight: 500;
  margin: 0.1rem 0.25rem 0.25rem;

}
.channelItem:hover{
  background-color: var(--hover-color);
}
.channelItem:active{
  transition: all 100ms ease;
  background-color: var(--pressed-color);
}

.channelItem:not([data-viewable="true"]):active{
  background: var(--hover-color);
}
.channelItem:not([data-viewable="true"]){
  font-style: italic;
  color: var(--bg-color);
  cursor: not-allowed;

}

.channelItem[data-selected="true"]{
  background-color: var(--accent-color);
  color: var(--text);
}


.item_icon{
  margin-right: 0.25rem;
  font-size: 1em;
}

</style>
