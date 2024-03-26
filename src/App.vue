<template>
  <div style="float: left">
    <ArrayGenerator />
    <AlgorithmSelector />
    <SortingControls />
    <AlgorithmKey />
  </div>

  <SortingVisualiser style="float: left" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ArrayGenerator from './components/ArrayGenerator.vue';
import AlgorithmSelector from './components/AlgorithmSelector.vue';
import SortingControls from './components/SortingControls.vue';
import SortingVisualiser from './components/SortingVisualiser.vue';
import AlgorithmKey from './components/AlgorithmKey.vue';

export default defineComponent({
  name: 'App',
  setup() {},
  components: {
    ArrayGenerator,
    AlgorithmSelector,
    SortingControls,
    SortingVisualiser,
    AlgorithmKey,
  },
});
</script>

<style></style>
