<script setup lang="ts">
import { useCursorStore } from '@/stores/cursor'

const cursorStore = useCursorStore()
const { moveLeft, toggle, moveRight } = cursorStore
</script>

<template>
  <div class="controls">
    <button v-shortkey="['arrowleft']" @shortkey="moveLeft" @click="moveLeft">Left</button>
    <button v-shortkey="['space']" @shortkey="toggle" @click="toggle">Toggle</button>
    <button v-shortkey="['arrowright']" @shortkey="moveRight" @click="moveRight">Right</button>
  </div>
</template>

<style scoped>
.controls {
  display: flex;
  margin-inline: auto;
  gap: 1rem;
}
</style>
