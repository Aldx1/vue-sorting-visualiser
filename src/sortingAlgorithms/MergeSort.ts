import SortingStep, { SortingOperation } from "./SortingStep";
import ISortingAlgorithm from "./ISortingAlgorithm";

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

  totalOperations = 0;
  operations = new Map();
  steps: SortingStep[] = [];
  sorted = false;
  sortedIndices: number[] = [];
  arrayStore: number[] = [];

  constructor() {}

  sort(numberArray: number[]) {
    this.arrayStore = [...numberArray];
    this.steps = [];

    this.mergeSort2(0, this.arrayStore.length - 1);
    console.log("Hi Merge", this.arrayStore.values);
  }

  mergeSort2(start: number, end: number) {
    if (end - start < 1) {
      return this.arrayStore[start];
    }

    var middle = Math.floor((end + start) / 2);

    this.mergeSort2(start, middle);

    this.mergeSort2(middle + 1, end);

    return this.merge2(start, middle, end);
  }

  merge2(start: number, middle: number, end: number) {
    let leftIndex = start;
    let rightIndex = middle + 1;
    const mergeArray: number[] = [];

    this.steps.push(SortingOperation.merge(start, middle, end));

    while (leftIndex <= middle || rightIndex <= end) {
      // If they're both smaller than their respective ends, a compare happens.
      if (leftIndex <= middle && rightIndex <= end) {
        this.steps.push(SortingOperation.compare(leftIndex, rightIndex));
      }

      if (
        rightIndex > end ||
        (leftIndex <= middle &&
          this.arrayStore[leftIndex] < this.arrayStore[rightIndex])
      ) {
        this.steps.push(SortingOperation.mAdd(leftIndex));
        mergeArray.push(this.arrayStore[leftIndex]);
        leftIndex++;
      } else {
        this.steps.push(SortingOperation.mAdd(rightIndex));
        mergeArray.push(this.arrayStore[rightIndex]);
        rightIndex++;
      }
    }

    for (let i = start, j = 0; i <= end; i++, j++) {
      this.arrayStore[i] = mergeArray[j];
    }

    this.steps.push(SortingOperation.moveBack(start, end));
  }

  mergeSort(numberArray: number[], start: number = 0): number[] {
    if (numberArray.length <= 1) {
      return numberArray;
    }
    const middleIndex = Math.floor(numberArray.length / 2);
    const leftHalf = this.mergeSort(numberArray.slice(0, middleIndex), start);
    const rightHalf = this.mergeSort(
      numberArray.slice(middleIndex),
      start + middleIndex
    );

    const middle = start + middleIndex;
    const end = start + numberArray.length - 1;

    this.steps.push(SortingOperation.merge(start, middle, end));

    return this.merge(leftHalf, rightHalf, start, middle);
  }

  merge(
    left: number[],
    right: number[],
    start: number,
    middle: number
  ): number[] {
    const result: number[] = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length || rightIndex < right.length) {
      if (leftIndex < left.length && rightIndex < right.length) {
        this.steps.push(
          SortingOperation.compare(start + leftIndex, middle + rightIndex)
        );
      }

      if (
        rightIndex >= right.length ||
        (leftIndex < left.length && left[leftIndex] < right[rightIndex])
      ) {
        this.steps.push(SortingOperation.mAdd(start + leftIndex));
        result.push(left[leftIndex]);
        leftIndex++;
      } else {
        this.steps.push(SortingOperation.mAdd(middle + (rightIndex - 1)));
        result.push(right[rightIndex]);
        rightIndex++;
      }
    }

    this.steps.push(
      SortingOperation.moveBack(start, middle + (rightIndex - 1))
    );

    return result;
  }
}
