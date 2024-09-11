<script setup lang="ts">
import { ref } from 'vue'

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

const towers = ref([[6, 5, 4, 1], [3, 2], []])
// const towers = ref(startingTowers)
</script>

<template>
  <div class="page">
    <div class="container">
      <div class="tower" v-for="(tower, idx) in towers" :key="idx">
        <div class="block" v-for="block in tower" :key="block" :style="{ '--block-number': block }">
          {{ block }}
        </div>
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

.container {
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
</style>
