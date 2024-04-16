import SortingStep, { SortingOperation } from './SortingStep';
import ISortingAlgorithm from './ISortingAlgorithm';

export default class MergeSort implements ISortingAlgorithm {
  pseudoCode = `
  function mergeSort(array)
    if length(array) <= 1: return array
    mid = length(array) // 2
    return merge(mergeSort(array[:mid]), mergeSort(array[mid:]))

  function merge(left, right)
    result = []
    while left and right:
      result.append(min(left, right))
      left = left[1:] if left else []
      right = right[1:] if right else []
    return result + left + right`;

  keyMap = new Map();
  operations = new Map();
  steps: SortingStep[] = [];
  arrayStore: number[] = [];

  constructor() {
    this.keyMap.set('Left partition', 'merge-left');
    this.keyMap.set('Right partition', 'merge-right');
    this.keyMap.set('Compare', 'compare');
    this.keyMap.set('Merge Inject', 'merge-added');
    this.keyMap.set('Merge Result', 'merge-back');
    this.keyMap.set('Sorted', 'sorted');
  }

  sort(numberArray: number[]) {
    this.arrayStore = [...numberArray];
    this.steps = [];

    this.mergeSort(0, this.arrayStore.length - 1);
    this.steps.push(SortingOperation.sorted());
  }

  mergeSort(start: number, end: number) {
    if (end - start < 1) {
      return this.arrayStore[start];
    }

    var middle = Math.floor((end + start) / 2);

    this.mergeSort(start, middle);

    this.mergeSort(middle + 1, end);

    this.merge(start, middle, end);
  }

  merge(start: number, middle: number, end: number) {
    let leftIndex = start;
    let rightIndex = middle + 1;
    const mergeArray: number[] = [];

    this.steps.push(SortingOperation.merge(start, middle, end));

    let mergeIndex = 0;

    while (leftIndex <= middle || rightIndex <= end) {
      // If they're both smaller than their respective ends, a compare happens.
      if (leftIndex <= middle && rightIndex <= end) {
        this.steps.push(SortingOperation.compare(leftIndex, rightIndex));
      }

      if (rightIndex > end || (leftIndex <= middle && this.arrayStore[leftIndex] < this.arrayStore[rightIndex])) {
        this.steps.push(SortingOperation.mergeAdd(leftIndex, start + mergeIndex++));
        mergeArray.push(this.arrayStore[leftIndex]);
        leftIndex++;
      } else {
        this.steps.push(SortingOperation.mergeAdd(rightIndex, start + mergeIndex++));
        mergeArray.push(this.arrayStore[rightIndex]);
        rightIndex++;
      }
    }

    for (let i = start, j = 0; i <= end; i++, j++) {
      this.arrayStore[i] = mergeArray[j];
    }

    this.steps.push(SortingOperation.mergeBack(start, end));
  }
}
