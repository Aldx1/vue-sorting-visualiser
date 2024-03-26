<template>
  <bcard :header="sortingAlgorithm + ' Sort Key'" style="max-width: 14rem" class="m-2 shadow-lg">
    <div class="container">
      <div v-for="kvp in sortingKey" :key="kvp[0]" class="row border-bottom">
        <div class="col-md-auto m-auto" style="white-space: nowrap">
          <text>{{ kvp[0] }}:</text>
        </div>
        <div class="col-md-auto elem p-1" style="position: relative; right: 0px" :class="kvp[1]">
          <svg width="40" height="40">
            <rect width="20" height="20" x="10" y="10" rx="5" ry="5" />
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
