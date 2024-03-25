import BubbleSort from '../sortingAlgorithms/BubbleSort';
import ISortingAlgorithm from '../sortingAlgorithms/ISortingAlgorithm';
import InsertionSort from '../sortingAlgorithms/InsertionSort';
import MergeSort from '../sortingAlgorithms/MergeSort';
import SelectionSort from '../sortingAlgorithms/SelectionSort';

export interface ISortingAlgorithmFactory {
  select: (key: string) => ISortingAlgorithm;
  getKeys: () => string[];
  sort: (numberArray: number[]) => void;
}

export class SortingAlgorithmFactory implements ISortingAlgorithmFactory {
  sortingAlgorithms: Map<string, ISortingAlgorithm>;
  keys: string[];

  constructor() {
    this.sortingAlgorithms = new Map();
    this.sortingAlgorithms.set('Selection', new SelectionSort());
    this.sortingAlgorithms.set('Bubble', new BubbleSort());
    this.sortingAlgorithms.set('Insertion', new InsertionSort());
    this.sortingAlgorithms.set('Merge', new MergeSort());

    this.keys = [];
    this.sortingAlgorithms.forEach((_value: ISortingAlgorithm, key: string) => {
      this.keys.push(key);
    });
  }

  select(key: string): ISortingAlgorithm {
    const algorithm = this.sortingAlgorithms.get(key);
    if (!algorithm) {
      throw new Error(`Sorting algorithm "${key}" not found.`);
    }
    return algorithm;
  }

  getKeys(): string[] {
    return this.keys;
  }

  sort(numberArray: number[]): void {
    this.sortingAlgorithms.forEach((value: ISortingAlgorithm) => {
      const numberArrayCopy: number[] = [...numberArray];
      value.sort(numberArrayCopy);
    });
  }
}
