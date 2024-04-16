<template>
  <bcard :header="sortingAlgorithm + ' Sort Key'" class="">
    <div class="container p-0">
      <div v-for="kvp in sortingKey" :key="kvp[0]" class="row border-bottom">
        <div class="col-9 m-auto" style="white-space: normal">
          <text>{{ kvp[0] }}</text>
        </div>
        <div class="col m-auto elem p-0" :class="kvp[1]">
          <svg width="3.5vh" height="3.5vh">
            <rect width="65%" height="65%" x="4" y="4" rx="5" ry="5" />
          </svg>
        </div>
      </div>
    </div>
  </bcard>
</template>

<script lang="ts">
import { Components } from 'bootstrap-vue-3';
import { defineComponent } from 'vue';

import { useSortingStore } from '@/store/SortingStore';
import { storeToRefs } from 'pinia';

export default defineComponent({
  name: 'AlgorithmKey',
  components: {
    bcard: Components.BCard,
  },
  setup() {
    const sortingStore = useSortingStore();
    const { sortingAlgorithm, sortingKey } = storeToRefs(sortingStore);
    return {
      sortingAlgorithm,
      sortingKey,
    };
  },
});
</script>

<style></style>
