import { defineStore } from 'pinia';
import { ArrayOrderingOption, IArrayCreationModel } from '@/storeModels/ArrayCreation';
import { NumberArrayGenerator } from '@/factories/NumberArrayFactory';
import { useSortingStore } from './SortingStore';

const minimumElementCount = 20;
const maximumElementCount = 50;

export const useArrayCreationStore = defineStore('arrayCreation', {
  state: () =>
    ({
      arrayOrder: ArrayOrderingOption.RANDOM,
      arraySize: 35,
    } as IArrayCreationModel),
  actions: {
    setArraySize(newSize: number) {
      this.arraySize = newSize;
    },
    setArrayOrder(newOrder: ArrayOrderingOption) {
      this.arrayOrder = newOrder;
    },
    generateArray() {
      const arrayGenerator = new NumberArrayGenerator();
      const generatedArray = arrayGenerator.generateArray(this.arrayOrder, this.arraySize);

      const sortingStore = useSortingStore();
      sortingStore.setNumberArray(generatedArray);
    },
  },
  getters: {
    minimumSize() {
      return minimumElementCount;
    },
    maximumSize() {
      return maximumElementCount;
    },
  },
});
