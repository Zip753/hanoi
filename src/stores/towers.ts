import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useTowersStore = defineStore('towers', () => {
  const NUM_TOWERS = 3
  const numBlocks = ref(2)

  const towers = ref(initializeTowers(NUM_TOWERS, numBlocks.value))

  function reset(): void {
    towers.value = initializeTowers(NUM_TOWERS, numBlocks.value)
  }

  const isSolved = computed((): boolean => {
    for (const [idx, tower] of towers.value.entries()) {
      if (idx !== towers.value.length - 1) {
        if (tower.length !== 0) {
          console.debug('non-empty secondary column')
          return false
        }
        continue
      }

      if (tower.length !== numBlocks.value) {
        console.debug('size mismatch')
        return false
      }
      for (const [blockIdx, block] of tower.entries()) {
        if (block !== numBlocks.value - blockIdx) {
          console.debug("values don't match", { expected: numBlocks.value - blockIdx, got: block })
          return false
        }
      }
    }
    return true
  })

  return { NUM_TOWERS, numBlocks, towers, reset, isSolved }
})

function initializeTowers(numTowers: number, numBlocks: number): number[][] {
  const startingTower: number[] = []
  for (let num = numBlocks; num >= 1; --num) {
    startingTower.push(num)
  }

  const startingTowers: number[][] = [startingTower]
  for (let i = 0; i < numTowers - 1; ++i) {
    startingTowers.push([])
  }

  return startingTowers
}
