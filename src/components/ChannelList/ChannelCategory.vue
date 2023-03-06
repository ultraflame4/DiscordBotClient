<template>
  <div class="cat-title" @click="expanded=!expanded">
    <Icon class="icon" icon="ic:expand-more" inline="true" :data-expanded="expanded"/>
    {{ props.name }}
  </div>
  <slot v-if="expanded">

  </slot>
</template>

<script lang="ts" setup>
import {Icon} from "@iconify/vue";
import {ChannelListCtx} from "../../utils";

const props = defineProps<{
  id:string,
  name: string
}>()


const expanded = ChannelListCtx.useRef(()=>`category-${props.id}-expanded`,true,null,[()=>props.id])

</script>

<style lang="scss">

.cat-title {
  padding: 0.25rem 0.75rem 0.25rem 0.25rem;
  font-size: 0.8em;
  font-weight: 700;
  user-select: none;
}
.cat-title:hover {
  color: var(--text);
  cursor: pointer;
}
.icon[data-expanded="false"] {
  transform: rotate(-90deg);
}



</style>
