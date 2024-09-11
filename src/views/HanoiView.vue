<script setup lang="ts">
import { computed, ref } from 'vue'

const numTowers = 3
const numBlocks = 6

const startingTower: number[] = []
for (let num = numBlocks; num >= 1; --num) {
  startingTower.push(num)
}

const startingTowers: number[][] = [startingTower]
for (let i = 0; i < numTowers - 1; ++i) {
  startingTowers.push([])
}

const towers = ref(startingTowers)

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

  if (cursor.value < numTowers - 1) {
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
            :class="{
              cursor: isCursor(idx, blockIdx, tower),
              'cursor-selected': isCursor(idx, blockIdx, tower) && isSelected,
              'cursor-invalid': isCursor(idx, blockIdx, tower) && !isCursorValid
            }"
            :style="{ '--block-number': block }"
          >
            {{ block }}
          </div>
        </div>
      </div>
      <div class="controls">
        <button @click="moveLeft">Left</button>
        <button @click="toggle">Toggle</button>
        <button @click="moveRight">Right</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  --blocks: v-bind(numBlocks);
  --block-height: 3rem;
  --block-gap: 0.5rem;
  --block-border-width: 5px;

  --full-block-size: calc(var(--block-height));
}

.page {
  padding-block: 2rem;
}

.tower-container {
  height: calc(var(--full-block-size) * var(--blocks) + var(--block-gap) * (var(--blocks) - 1));

  outline: 1px red solid;

  display: grid;
  grid-template-columns: repeat(v-bind(numTowers), 1fr);
  gap: 2rem;
}

.tower {
  outline: 2px green solid;

  display: flex;
  flex-flow: column-reverse;
  align-items: center;
  gap: var(--block-gap);
}

.block {
  border: var(--block-border-width) orange solid;
  border-radius: 2rem;
  min-height: var(--block-height);

  --block: var(--block-number, var(--blocks));
  --min-width: max(var(--block-height), 40%);
  --shrink-step: calc((100% - var(--min-width)) / (var(--blocks) - 1));

  width: calc(var(--min-width) + var(--shrink-step) * calc(var(--block) - 1));

  align-content: center;
  text-align: center;

  font-size: large;
}

.cursor {
  background-color: rgba(from orange r g b / 0.3);
  border-style: dashed;
}

.cursor-selected {
  background-color: rgba(from orange r g b / 0.5);
  border-style: solid;
}

.cursor-invalid {
  background-color: rgb(from red r g b / 0.7);
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
