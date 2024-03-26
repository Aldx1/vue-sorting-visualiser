import { defineStore } from 'pinia';
import { ArrayOrderingOption, IArrayCreationModel } from '@/storeModels/ArrayCreation';
import { NumberArrayGenerator } from '@/factories/NumberArrayFactory';
import { useSortingStore } from './SortingStore';

const minimumElementCount = 5;
const maximumElementCount = 25;

export const useArrayCreationStore = defineStore('arrayCreation', {
  state: () =>
    ({
      ordering: ArrayOrderingOption.RANDOM,
      elementSize: 15,
    } as IArrayCreationModel),
  actions: {
    setArraySize(newSize: number) {
      this.elementSize = newSize;
    },
    setArrayOrder(newOrder: ArrayOrderingOption) {
      this.ordering = newOrder;
      this.generateArray();
    },
    async generateArray() {
      const arrayGenerator = new NumberArrayGenerator();
      const generatedArray = arrayGenerator.generateArray(this.ordering, this.elementSize);

      const sortingStore = useSortingStore();
      sortingStore.setNumberArray(generatedArray);
      sortingStore.sort();
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
