<template>
  <bcard header="Select" class="sortingCard shadow-lg" bodyClass="flex-col-space">
    <div></div>
    <BDButton
      dropdownId="select-algo-button"
      dropdownClass="mt-4"
      :options="sortingOptions"
      :selectedOption="chosenAlgorithm"
      :handleOptionClick="updateChosenOne"
      :handleClick="selectAlgorithm"
      :variant="'outline-secondary'"
    />
  </bcard>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useSortingStore } from '@/store/SortingStore';
import BDButton from '../bootstrapComponents/BDButton.vue';
import { Components } from 'bootstrap-vue-3';

export default defineComponent({
  name: 'AlgorithmSelector',
  components: {
    bcard: Components.BCard,
    BDButton,
  },
  setup() {
    const sortingStore = useSortingStore();
    const sortingOptions = sortingStore.keys;
    const chosenAlgorithm = ref(sortingStore.sortingAlgorithm);

    const selectAlgorithm = () => {
      sortingStore.selectAlgorithm(chosenAlgorithm.value);
      sortingStore.startAnim();
    };

    const updateChosenAlgorithm = (value: string) => {
      chosenAlgorithm.value = value;
      selectAlgorithm();
    };

    return {
      sortingOptions,
      chosenAlgorithm,
      selectAlgorithm,
      updateChosenOne: updateChosenAlgorithm,
    };
  },
});
</script>

<style></style>
