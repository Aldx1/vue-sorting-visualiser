<template>
  <bcard tag="article" style="max-width: 14rem; color: white" class="m-2 bg-secondary shadow-lg">
    <label for="btnSelectAlgorithm">Sorting Algorithm:</label>
    <b-dropdown
      id="btnSelectAlgorithm"
      split
      @click="selectAlgorithm"
      :text="selectedOne"
      variant="primary"
      class="m-2"
    >
      <b-dropdown-item
        v-for="sortingOption in sortingOptions"
        :key="sortingOption"
        @click="updateChosenOne(sortingOption)"
        >{{ sortingOption }}</b-dropdown-item
      >
    </b-dropdown>
  </bcard>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { Components } from 'bootstrap-vue-3';
import { useSortingStore } from '@/store/SortingStore';

export default defineComponent({
  name: 'AlgorithmSelect',
  components: {
    bcard: Components.BCard,
    btn: Components.BButton,
    'b-dropdown': Components.BDropdown,
    'b-dropdown-item': Components.BDropdownItem,
  },
  setup() {
    const sortingStore = useSortingStore();
    const sortingOptions = sortingStore.keys;

    let chosenOne = ref(sortingOptions[0]);
    const selectedOne = computed(() => {
      return chosenOne.value;
    });

    const selectAlgorithm = () => {
      sortingStore.selectAlgorithm(chosenOne.value);
      sortingStore.startAnim();
    };

    const updateChosenOne = (value: string) => {
      chosenOne.value = value;
      selectAlgorithm();
    };

    return {
      sortingOptions,
      selectedOne,
      selectAlgorithm,
      updateChosenOne,
    };
  },
});
</script>

<style></style>
