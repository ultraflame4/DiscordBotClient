<template>
  <ul class="guildlist">
    <GuildList_Item :guild="BotHomeGuild" icon="material-symbols:robot"/>

    <GuildList_Item v-for="(g,index) in props.guilds"
                    :key="index"
                    :guild="g"
    />


  </ul>
</template>

<script lang="ts" setup>

import GuildList_Item from "./GuildList_Item.vue";
import {BotHomeGuild} from "../../utils";

const props = defineProps<{
  guilds: SimplifiedGuildInfo[]
}>()


</script>

<style lang="scss" scoped>
.guildlist{
  list-style: none;
  padding: 0.5em 0.1em;

  margin: 0;
  height: 100vh;
  overflow-y: auto;

}

.guildlist::-webkit-scrollbar{
  display: none;
}

.guildlist > li{

  width: 100%;

  margin: 8px 0;
  overflow: visible;
  padding: 0 0.5em;
  position: relative;
  box-sizing: border-box;
}


.guildlist > li::before {
  display: block;
  content: "";
  width: 3px;
  position: absolute;
  background: white;
  border-radius: 0 1em 1em 0;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  z-index: 2;
  height: 0%;
  transition: all 100ms linear;
}

.guildlist > li:has(> .guildlistItem:hover)::before{
  height: 30%;
}
.guildlist > li:has(> .guildlistItem[data-selected="true"])::before{
  height: 60%;
}


</style>
