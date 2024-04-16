import { defineStore } from 'pinia';
import { ISortingModel } from '@/storeModels/Sorting';
import { SortingAlgorithmFactory } from '@/factories/SortingAlgorithmFactory';
import { useAnimationControlsStore } from './AnimationStore';

export const useSortingStore = defineStore('sorting', {
  state: () =>
    ({
      numberArray: [],
      sortingAlgorithmFactory: new SortingAlgorithmFactory(),
      sortingAlgorithm: 'Bubble',
      sortingKey: new Map(),
    } as ISortingModel),

  actions: {
    setNumberArray(newNumberArray: number[]) {
      this.numberArray = newNumberArray;
      this.sort();
    },
    sort() {
      this.sortingAlgorithmFactory.sort(this.numberArray);
      this.selectAlgorithm(this.sortingAlgorithm);
    },
    selectAlgorithm(choice: string) {
      this.sortingAlgorithm = choice;
      const chosenOne = this.sortingAlgorithmFactory.select(choice);
      this.sortingKey = chosenOne.keyMap;
      const animStore = useAnimationControlsStore();
      animStore.setHelperBitsAndSteps(this.numberArray, chosenOne.steps, choice);
    },
    startAnim() {
      const animStore = useAnimationControlsStore();
      animStore.resume();
    },
  },
  getters: {
    keys(): string[] {
      return this.sortingAlgorithmFactory.getKeys();
    },
  },
});
