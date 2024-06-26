import SortingStep, { SortingOperation } from './SortingStep';
import ISortingAlgorithm from './ISortingAlgorithm';

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

  keyMap = new Map();
  operations = new Map();
  steps: SortingStep[] = [];

  constructor() {
    this.keyMap.set('Current index', 'current');
    this.keyMap.set('Compare', 'compare');
    this.keyMap.set('Swap', 'swapped');
    this.keyMap.set('Sorted', 'sorted');
  }

  sort(numberArray: number[]) {
    this.steps = [];
    const sortedNumberArray = this.selectionSort(numberArray);
  }

  selectionSort(numberArray: number[]): number[] {
    const sortedIndices: number[] = [];

    let Iindex = 0;

    for (Iindex; Iindex < numberArray.length - 1; Iindex++) {
      let minIndex = Iindex;

      const additionalData = { selectionIndex: Iindex, selection: true };

      for (let j = Iindex + 1; j < numberArray.length; j++) {
        this.steps.push(SortingOperation.compare(minIndex, j, [...sortedIndices], additionalData));
        if (numberArray[j] < numberArray[minIndex]) {
          minIndex = j;
        }
      }

      if (minIndex !== Iindex) {
        this.steps.push(SortingOperation.swap(minIndex, Iindex, [...sortedIndices], additionalData));

        const temp = numberArray[Iindex];
        numberArray[Iindex] = numberArray[minIndex];
        numberArray[minIndex] = temp;
      }

      sortedIndices.push(Iindex);
    }

    this.steps.push(SortingOperation.sorted({ selectionIndex: Iindex, selection: true }));
    return numberArray;
  }
}
