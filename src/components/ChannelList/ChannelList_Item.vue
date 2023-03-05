<template>
  <li class="channelItem" :data-selected="selectedChannel?.id === props.info.id" @click="selectThisChannel">
    <InlineIcon :icon="icon" class="item_icon"/>
    {{ props.info.name }}}
  </li>
</template>

<script lang="ts" setup>
import {inject, Ref} from "vue";
import {GetBotHomeIcon} from "../../utils";

const props = defineProps<{
  info: SimplifiedChannelInfo,
  icon?: string
}>()

const selectedChannel = inject<Ref<SimplifiedChannelInfo>>('selectedChannel')

const icon = props.icon ?? (props.info.type === "bot-home" ? GetBotHomeIcon(props.info.id) : getChannelIcon(props.info))

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
  selectedChannel!.value = props.info
}

</script>

<style lang="scss" scoped>

</style>
