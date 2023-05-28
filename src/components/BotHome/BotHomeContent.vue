<template>
  <div class="botHomeContent">
    <BotHomeAuth v-if="props.channel_id==='botEvents-account'"/>
  </div>
</template>

<script lang="ts" setup>
import BotHomeAuth from "./BotHomeAuth.vue";

const props = defineProps<{
  channel_id?: string
}>()

</script>

<style lang="scss">

.botHomeContent{

  height: 100%;
  width: 100%;
  padding: 0.25rem 1.5rem;
  box-sizing: border-box;
  white-space: break-spaces;
}
</style>
