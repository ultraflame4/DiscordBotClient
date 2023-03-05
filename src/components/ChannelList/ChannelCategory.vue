<template>
  <div class="cat-title">{{ props.name }}</div>
  <div class="cat-container">
    <slot>

    </slot>
  </div>
</template>

<script lang="ts" setup>

const props = defineProps<{
  name: string
}>()

</script>

<style lang="scss">

.cat-title {
  padding: 0.5rem;
  font-size: 0.8em;
  font-weight: 700;
}

.cat-container {

}
</style>
