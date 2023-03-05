<template>
  <li>

    <a class="guildlistItem"
       :data-selected="selectedGuild?.id == props.guild.id ? 'true' : 'false'"
       @click="selectThisGuild"
    >

      <img v-if="props.guild.iconUrl !== null" :src="props.guild.iconUrl" alt="Guild Icon"/>
      <Icon v-else :icon="props.icon??'zondicons:servers'" class="item_icon"/>
    </a>

  </li>
</template>

<script lang="ts" setup>
import {Icon} from "@iconify/vue";
import {inject, Ref} from "vue";

const props = defineProps<{
  guild: SimplifiedGuildInfo,
  icon?: string
}>()
const selectedGuild = inject<Ref<SimplifiedGuildInfo>>('selectedGuild')
console.log(selectedGuild?.value.id, props.guild.id)
function selectThisGuild(){
  selectedGuild!.value = props.guild
}

</script>

<style lang="scss" scoped>
.guildlistItem {
  display: flex;
  cursor: pointer;
  border-radius: 100%;


  width: 100%;
  aspect-ratio: 1;

  transition: all 300ms ease-out;
  align-items: center;
  position: relative;
  overflow: visible;
  background: transparent;

}

.guildlistItem:hover,.guildlistItem[data-selected="true"]{
  border-radius: 35%;
  background: var(--accent-color);
}

.guildlistItem>img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
}


.item_icon{
  width: 100%;
  height: 100%;
  padding: 0.55rem;
}
</style>
