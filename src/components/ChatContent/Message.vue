<template>
  <div class="message">

    <template v-if="!props.short">
      <img v-if="msg.author_icon" :src="msg.author_icon" class="icon"/>
      <div v-else class="icon">{{msg.author_name[0]}}</div>
      <h4>{{msg.author_name}} <span>{{FancyFormatDateTime(msg.posted)}}</span></h4>
    </template>

    <p>
      {{msg.content??"cannot see message"}}
    </p>
  </div>
</template>

<script lang="ts" setup>

import dayjs from "dayjs";
import {FancyFormatDateTime} from "../../utils";

const props = defineProps<{
  msg:SimplifiedMessageItem,
  short?:boolean
}>()


</script>

<style lang="scss" scoped>
.message{
  display: grid;
  grid-template-columns: min-content 1fr;
  grid-template-rows: min-content 1fr;
  margin-top: 1rem;
  grid-column-gap: 1rem;
  grid-row-gap: 0.3rem;
}
.message > .icon{
  grid-row: 1/3;
  grid-column: 1;
  aspect-ratio: 1;
  height: 2.75rem;
  border-radius: 2rem;
}

.message > div.icon{
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.1em;
  background: var(--accent-color);

}

.message > h4{
  grid-row: 1;
  grid-column: 2;
  margin: 0;
  font-weight: 800;
  font-size: 0.85em;
  font-family: "Open Sans";
}

.message > h4 > span{
  font-size: 0.725em;
  font-weight: 700;
  letter-spacing: 0.03em;
  font-family: "Poppins";
  margin-left: 0.25rem;
  color: var(--text-b);

}

.message > p{
  grid-row: 2;
  grid-column: 2;
  margin: 0;
  font-size: 0.8em;
  white-space: normal;
}


</style>
