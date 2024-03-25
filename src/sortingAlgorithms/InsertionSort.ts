import SortingStep, { SortingOperation } from './SortingStep';
import ISortingAlgorithm from './ISortingAlgorithm';

export default class InsertionSort implements ISortingAlgorithm {
  pseudoCode = `
  function insertionSort(array)
    for index from 1 to length(array)
      key = array[index]
      j = index - 1

      while j >= 0 and array[j] > key
        array[j + 1] = array[j]
        j = j - 1

      array[j + 1] = key
    return array`;

  totalOperations = 0;
  operations: Map<string, number>;
  steps: SortingStep[] = [];
  sortedIndices: number[] = [];
  sorted = false;

  constructor() {
    this.operations = new Map();
  }

  sort(numberArray: number[]) {
    this.steps = [];
    const sortedNumberArray = this.insertionSort(numberArray);
  }

  insertionSort(numberArray: number[]): number[] {
    let insertionIndex = 0;
    for (insertionIndex; insertionIndex < numberArray.length; insertionIndex++) {
      let j = insertionIndex;

      const additionalData = { insertionIndex: insertionIndex };

      while (j > 0 && this.compare(numberArray, j, j - 1, additionalData)) {
        this.steps.push(SortingOperation.swap(j, j - 1, undefined, additionalData));
        let temp = numberArray[j];
        numberArray[j] = numberArray[j - 1];
        numberArray[j - 1] = temp;
        j--;
      }
    }

    this.steps.push(SortingOperation.sorted({ insertionIndex: insertionIndex }));
    return numberArray;
  }

  compare(numberArray: number[], j: number, current: number, additionalData: any): boolean {
    this.steps.push(SortingOperation.compare(j, current, undefined, additionalData));
    return numberArray[j] < numberArray[current];
  }
}
