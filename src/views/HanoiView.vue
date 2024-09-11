<script setup lang="ts">
import { useTowersStore } from '@/stores/towers'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const towersStore = useTowersStore()
const { towers, numBlocks } = storeToRefs(towersStore)
const { NUM_TOWERS } = towersStore

const cursor = ref(0)
const isSelected = ref(false)

function toggle() {
  if (!isCursorValid.value) {
    return
  }
  isSelected.value = !isSelected.value
}

function moveLeft() {
  if (!isSelected.value) {
    let nextValidCursor = cursor.value - 1
    while (nextValidCursor >= 0 && towers.value[nextValidCursor].length === 0) {
      --nextValidCursor
    }
    if (nextValidCursor >= 0) {
      cursor.value = nextValidCursor
    }
    return
  }

  if (cursor.value > 0) {
    const valueToMove = towers.value[cursor.value].pop()
    if (valueToMove === undefined) {
      return
    }
    cursor.value -= 1
    towers.value[cursor.value].push(valueToMove)
  }
}

function moveRight() {
  if (!isSelected.value) {
    let nextValidCursor = cursor.value + 1
    while (nextValidCursor < towers.value.length && towers.value[nextValidCursor].length === 0) {
      ++nextValidCursor
    }
    if (nextValidCursor < towers.value.length) {
      cursor.value = nextValidCursor
    }
    return
  }

  if (cursor.value < NUM_TOWERS - 1) {
    const valueToMove = towers.value[cursor.value].pop()
    if (valueToMove === undefined) {
      return
    }
    cursor.value += 1
    towers.value[cursor.value].push(valueToMove)
  }
}

function isCursor(idx: number, blockIdx: number, tower: number[]) {
  return idx === cursor.value && blockIdx === tower.length - 1
}

const isCursorValid = computed(() => {
  if (!isSelected.value) {
    return true
  }
  const tower = towers.value[cursor.value]
  if (tower.length < 2) {
    return true
  }
  return tower[tower.length - 1] < tower[tower.length - 2]
})
</script>

<template>
  <div class="page">
    <div class="container">
      <div class="tower-container">
        <div class="tower" v-for="(tower, idx) in towers" :key="idx">
          <div
            class="block"
            v-for="(block, blockIdx) in tower"
            :key="block"
            :class="[
              {
                cursor: isCursor(idx, blockIdx, tower),
                'cursor-selected': isCursor(idx, blockIdx, tower) && isSelected,
                'cursor-invalid': isCursor(idx, blockIdx, tower) && !isCursorValid
              },
              `block-color-${(block % 3) + 1}`
            ]"
            :style="{ '--block-number': block }"
          ></div>
        </div>
      </div>
      <div class="controls">
        <button v-shortkey="['arrowleft']" @shortkey="moveLeft" @click="moveLeft">Left</button>
        <button v-shortkey="['space']" @shortkey="toggle" @click="toggle">Toggle</button>
        <button v-shortkey="['arrowright']" @shortkey="moveRight" @click="moveRight">Right</button>
      </div>
      <div class="congrats">
        <h1 v-if="towersStore.isSolved">YOU DID IT!!!111</h1>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  --blocks: v-bind(numBlocks);
  --block-height: 3rem;
  --block-gap: 0.5rem;

  --full-block-size: calc(var(--block-height));
}

.page {
  padding-block: 2rem;
}

.tower-container {
  height: calc(var(--full-block-size) * var(--blocks) + var(--block-gap) * (var(--blocks) - 1));

  display: grid;
  grid-template-columns: repeat(v-bind(NUM_TOWERS), 1fr);
  gap: 2rem;
}

.tower {
  display: flex;
  flex-flow: column-reverse;
  align-items: center;
  gap: var(--block-gap);
  box-shadow: 0rem 3rem 1rem -2rem rgb(179, 200, 228);
}

.block {
  border: 4px var(--block-color) solid;
  border-radius: 2rem;
  background-color: rgb(from var(--block-color) r g b / 0.6);

  min-height: var(--block-height);

  --block: var(--block-number, var(--blocks));
  --min-width: max(var(--block-height), 40%);
  --shrink-step: calc((100% - var(--min-width)) / (var(--blocks) - 1));

  width: calc(var(--min-width) + var(--shrink-step) * calc(var(--block) - 1));

  align-content: center;
  text-align: center;

  font-size: large;
}

.block-color-1 {
  --block-color: rgb(103, 230, 187);
}
.block-color-2 {
  --block-color: plum;
}
.block-color-3 {
  --block-color: rgb(228, 212, 96);
}

.cursor {
  --cursor-color: rgb(from var(--block-color) r g b / 0.7);

  border-color: var(--cursor-color);
  background-color: rgb(from var(--cursor-color) r g b / 0.4);

  border-style: dashed;
}

.cursor-selected {
  border-style: solid;
  --cursor-color: rgb(255, 153, 0);
  background-color: rgb(from var(--cursor-color) r g b / 0.6);

  box-shadow: 0 0 0.7rem var(--cursor-color);
}

.cursor-invalid {
  --cursor-color: rgb(from red r g b / 0.6);

  background: repeating-linear-gradient(
    135deg,
    rgb(from var(--cursor-color) r g b / 0.3),
    rgb(from var(--cursor-color) r g b / 0.3) 6px,
    rgb(from var(--cursor-color) r g b / 0.6) 6px,
    rgb(from var(--cursor-color) r g b / 0.6) 12px
  );
}

.container {
  display: grid;
  gap: 4rem;
}

.controls {
  display: flex;
  margin-inline: auto;
  gap: 1rem;
}
</style>
