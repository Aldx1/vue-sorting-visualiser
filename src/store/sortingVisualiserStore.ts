import { defineStore } from "pinia";
import {
  ArrayOrderingOption,
  IArrayConfigModel,
} from "@/storeModels/ArrayConfigModel";
import { ISortingModel } from "@/storeModels/SortingModel";
import { NumberArrayGenerator } from "@/factories/NumberArrayFactory";
import { SortingAlgorithmFactory } from "@/factories/SortingAlgorithmFactory";
import SortingStep from "@/sortingAlgorithms/SortingStep";

const minimumElementCount = 5;
const maximumElementCount = 25;

export const useNumberArrayCreationStore = defineStore("numberArrayCreation", {
  state: () =>
    ({
      ordering: ArrayOrderingOption.RANDOM,
      elementSize: 15,
    } as IArrayConfigModel),
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
      const generatedArray = arrayGenerator.generateArray(
        this.ordering,
        this.elementSize
      );
      console.log(generatedArray);
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

export const useSortingStore = defineStore("sorting", {
  state: () =>
    ({
      numberArray: [],
      sortingAlgorithmFactory: new SortingAlgorithmFactory(),
      pseudoCode: "",
      steps: [],
      algorithmChosen: false,
      sortingAlgorithm: "",
    } as ISortingModel),

  actions: {
    setNumberArray(newNumberArray: number[]) {
      this.numberArray = newNumberArray;
    },
    sort() {
      this.sortingAlgorithmFactory.sort(this.numberArray);
      this.selectAlgorithm(
        this.sortingAlgorithm == "" ? this.keys[0] : this.sortingAlgorithm
      );
    },
    selectAlgorithm(choice: string) {
      const chosenOne = this.sortingAlgorithmFactory.select(choice);
      this.steps = chosenOne.steps;
      this.pseudoCode = chosenOne.pseudoCode;
      this.sortingAlgorithm = choice;
    },
  },
  getters: {
    keys(): string[] {
      return this.sortingAlgorithmFactory.getKeys();
    },
    pseudoCode1(): string {
      return this.pseudoCode;
    },
    sortingSteps(): SortingStep[] {
      return this.steps;
    },
    numberArraySet(): boolean {
      return this.numberArray && this.numberArray.length > 0;
    },
  },
});
