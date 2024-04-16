<template>
  <bcard header="Generate" class="sortingCard shadow-lg" bodyClass="flex-col-space">
    <BRange
      :minRangeValue="minArraySize"
      :maxRangeValue="maxArraySize"
      rangeId="array-size-range"
      :rangeModel="arraySize"
      :rangeInput="setArraySize"
      rangeClass="mt-1"
    />

    <BDButton
      :options="arrayOrderOptions"
      :selectedOption="arrayOrderText"
      :handleOptionClick="setArrayOrderDropdown"
      :handleClick="setArrayOrder"
      dropdownId="select-order-button"
      dropdownClass="mt-4"
      :variant="'outline-secondary'"
    />
  </bcard>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useArrayCreationStore } from '@/store/ArrayCreationStore';
import { ArrayOrderingOption } from '@/storeModels/ArrayCreation';
import BDButton from '../bootstrapComponents/BDButton.vue';
import BRange from '../bootstrapComponents/BRange.vue';
import { computed } from 'vue';
import { Components } from 'bootstrap-vue-3';

import { storeToRefs } from 'pinia';

export default defineComponent({
  name: 'ArrayGenerator',
  components: {
    bcard: Components.BCard,
    BRange,
    BDButton,
  },
  setup() {
    const arrayCreationStore = useArrayCreationStore();
    const minArraySize = arrayCreationStore.minimumSize;
    const maxArraySize = arrayCreationStore.maximumSize;
    const arrayOrderOptions = Object.values(ArrayOrderingOption);
    let { arraySize, arrayOrder } = storeToRefs(arrayCreationStore);

    const setArraySize = (newValue: string) => {
      arraySize.value = Number(newValue);
      arrayCreationStore.setArraySize(arraySize.value);
      arrayCreationStore.generateArray();
    };

    const setArrayOrder = () => {
      arrayCreationStore.setArrayOrder(arrayOrder.value);
      arrayCreationStore.generateArray();
    };

    const setArrayOrderDropdown = (value: ArrayOrderingOption) => {
      arrayOrder.value = value;
      setArrayOrder();
    };

    const rangeLabel = computed(() => {
      return `Size: ${arraySize.value}`;
    });

    const arrayOrderText = computed(() => {
      return arrayOrder.value.split(' ')[0];
    });

    return {
      arrayOrderText,
      arrayOrderOptions,
      arraySize,
      minArraySize,
      maxArraySize,
      rangeLabel,
      setArraySize,
      setArrayOrder,
      setArrayOrderDropdown,
    };
  },
});
</script>

<style></style>
