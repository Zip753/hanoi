import { defineStore, storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useTowersStore } from './towers'

export const useCursorStore = defineStore('cursor', () => {
  const cursor = ref(0)
  const isSelected = ref(false)

  const towersStore = useTowersStore()
  const { towers } = storeToRefs(towersStore)

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

    if (cursor.value < towersStore.NUM_TOWERS - 1) {
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

  return { isSelected, toggle, moveLeft, moveRight, isCursor, isCursorValid }
})
