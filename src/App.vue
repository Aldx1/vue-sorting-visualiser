<template>
  <!--  <SortingVisualiser /> -->
  <div style="float: left">
    <ArrayGenerator />
    <AlgorithmSelector />
    <!-- <SortingControls /> -->
  </div>
  <div v-if="numberArraySet">
    <SortingVisualiser />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ArrayGenerator from './components/ArrayGenerator.vue';
import AlgorithmSelector from './components/AlgorithmSelector.vue';
import { useSortingStore } from './store/sortingVisualiserStore';
import { storeToRefs } from 'pinia';

import SortingControls from './components/SortingControls.vue';
import SortingVisualiser from './components/SortingVisualiser.vue';

export default defineComponent({
  name: 'App',
  setup() {
    const sortingStore = useSortingStore();

    const numberArraySet = storeToRefs(sortingStore).numberArraySet;

    return { numberArraySet };
  },
  components: {
    ArrayGenerator,
    AlgorithmSelector,
    SortingControls,
    SortingVisualiser,
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
