<template>
  <bcard tag="article" style="max-width: 14rem; color: white" class="m-2 shadow-lg bg-secondary">
    <label for="array-size-range">Array Size: {{ arraySize }}</label>
    <b-form-input
      id="array-size-range"
      type="range"
      style="align-items: center; max-width: 15rem"
      :min="minArraySize"
      :max="maxArraySize"
      v-model="arraySize"
      @input="setSize"
    ></b-form-input>
    <label for="btnSelectOrder">Array Order:</label>
    <b-dropdown id="btnSelectOrder" split @click="setOrder" :text="arrayOrder" variant="primary" class="m-2">
      <b-dropdown-item
        v-for="orderOption in arrayOrderOptions"
        :key="orderOption"
        @click="updateSelectedOption(orderOption)"
        >{{ orderOption }}</b-dropdown-item
      >
    </b-dropdown>
  </bcard>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useArrayCreationStore } from '@/store/ArrayCreationStore';
import { Components } from 'bootstrap-vue-3';
import { ArrayOrderingOption } from '@/storeModels/ArrayCreation';

export default defineComponent({
  name: 'ArrayGenerator',
  components: {
    bcard: Components.BCard,
    btn: Components.BButton,
    'b-dropdown': Components.BDropdown,
    'b-dropdown-item': Components.BDropdownItem,
    'b-form-input': Components.BFormInput,
  },
  setup() {
    const arrayCreationStore = useArrayCreationStore();
    const minArraySize = arrayCreationStore.minimumSize;
    const maxArraySize = arrayCreationStore.maximumSize;
    const arrayOrderOptions = Object(ArrayOrderingOption);

    let arraySize = ref(arrayCreationStore.elementSize);
    let arrayOrder = ref(arrayCreationStore.ordering);

    const setSize = (newValue: string) => {
      arraySize.value = Number(newValue);
      arrayCreationStore.setArraySize(arraySize.value);
    };

    const setOrder = () => {
      arrayCreationStore.setArrayOrder(arrayOrder.value);
    };

    const updateSelectedOption = (value: ArrayOrderingOption) => {
      arrayOrder.value = value;
      setOrder();
    };

    onMounted(() => {
      setOrder();
    });

    return {
      minArraySize,
      maxArraySize,
      arraySize,
      setSize,
      setOrder,
      updateSelectedOption,
      arrayOrder,
      arrayOrderOptions,
    };
  },
});
</script>

<style></style>
