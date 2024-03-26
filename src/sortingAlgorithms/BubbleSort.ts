import SortingStep, { SortingOperation } from './SortingStep';
import ISortingAlgorithm from './ISortingAlgorithm';

export default class BubbleSort implements ISortingAlgorithm {
  pseudoCode = `
  function bubbleSort(array)
    for i from 0 to length(array) - 1
      swapped = false
      for j from 0 to length(array) - 2 - i
        if array[j] > array[j + 1]
          swap(array[j], array[j + 1])
          swapped = true
      if not swapped:
        break  // Early termination if no swaps occurred
  return array`;

  keyMap = new Map();
  operations = new Map();
  steps: SortingStep[] = [];

  constructor() {
    this.keyMap.set('Compare', 'compare');
    this.keyMap.set('Swap', 'swapped');
    this.keyMap.set('Sorted', 'sorted');
  }

  sort(numberArray: number[]) {
    this.steps = [];
    const sortedNumberArray = this.bubbleSort(numberArray);
  }

  bubbleSort(numberArray: number[]): number[] {
    let sortedIndices: number[] = [];

    for (var i = numberArray.length - 1; i >= 0; i--) {
      let swaps = 0;
      for (var j = 1; j <= i; j++) {
        this.steps.push(SortingOperation.compare(j - 1, j, [...sortedIndices]));
        if (numberArray[j - 1] > numberArray[j]) {
          this.steps.push(SortingOperation.swap(j - 1, j, [...sortedIndices]));
          let temp = numberArray[j - 1];
          numberArray[j - 1] = numberArray[j];
          numberArray[j] = temp;
          swaps++;
        }
      }

      sortedIndices.push(i);

      if (swaps == 0) {
        this.steps.push(SortingOperation.sorted());
        return numberArray;
      }
    }

    this.steps.push(SortingOperation.sorted());
    return numberArray;
  }
}
