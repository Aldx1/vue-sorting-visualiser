import { defineStore } from 'pinia';
import { ISortingModel } from '@/storeModels/Sorting';
import { SortingAlgorithmFactory } from '@/factories/SortingAlgorithmFactory';
import { useAnimationControlsStore } from './AnimationStore';

export const useSortingStore = defineStore('sorting', {
  state: () =>
    ({
      numberArray: [],
      sortingAlgorithmFactory: new SortingAlgorithmFactory(),
      algorithmChosen: false,
      sortingAlgorithm: '',
      algorithmSet: false,
    } as ISortingModel),

  actions: {
    setNumberArray(newNumberArray: number[]) {
      this.numberArray = newNumberArray;
      this.sort();
    },
    sort() {
      this.sortingAlgorithmFactory.sort(this.numberArray);
      this.selectAlgorithm(this.sortingAlgorithm == '' ? this.keys[0] : this.sortingAlgorithm);
    },
    selectAlgorithm(choice: string) {
      const animStore = useAnimationControlsStore();
      const chosenOne = this.sortingAlgorithmFactory.select(choice);
      this.sortingAlgorithm = choice;
      animStore.setHelperBitsAndSteps(this.numberArray, chosenOne.steps);
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
    numberArraySet(): boolean {
      return this.numberArray && this.numberArray.length > 0;
    },
  },
});
