import SortingStep, { SortingOperation } from "./SortingStep";
import ISortingAlgorithm from "./ISortingAlgorithm";

export default class SelectionSort implements ISortingAlgorithm {
  pseudoCode = `
  function selectionSort(array)
    for i from 0 to length(array) - 1
      minIndex = i
      for j from i + 1 to length(array)
        if array[j] < array[minIndex]
          minIndex = j
      if minIndex != i
        swap(array[i], array[minIndex])
    return array`;

  totalOperations: number;
  operations: Map<string, number>;
  comparisons: number;
  swaps: number;
  steps: SortingStep[] = [];
  sorted = false;
  sortedIndices: number[] = [];

  constructor() {
    this.totalOperations = 0;
    this.operations = new Map<string, number>();
    this.comparisons = 0;
    this.swaps = 0;
  }

  sort(numberArray: number[]) {
    this.steps = [];
    const sortedNumberArray = this.selectionSort(numberArray);
    console.log("Hi Selection", sortedNumberArray);
  }

  selectionSort(numberArray: number[]): number[] {
    const sortedIndices: number[] = [];

    for (let i = 0; i < numberArray.length - 1; i++) {
      let minIndex = i;

      for (let j = i + 1; j < numberArray.length; j++) {
        this.steps.push(
          SortingOperation.compare(minIndex, j, [...sortedIndices])
        );
        if (numberArray[j] < numberArray[minIndex]) {
          minIndex = j;
        }
      }

      if (minIndex !== i) {
        this.steps.push(SortingOperation.swap(minIndex, i, [...sortedIndices]));

        const temp = numberArray[i];
        numberArray[i] = numberArray[minIndex];
        numberArray[minIndex] = temp;
      }

      sortedIndices.push(i);

      if (i == numberArray.length - 2) {
        sortedIndices.push(i + 1);
      }
    }

    this.steps.push(SortingOperation.sorted([...sortedIndices]));
    return numberArray;
  }
}
