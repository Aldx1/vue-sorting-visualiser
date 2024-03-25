export default class SortingStep {
  type: string;
  highlightedIndices: number[];
  sortedIndices?: number[];
  additionalData: any;
  constructor(
    type: 'Swap' | 'Compare' | 'Sorted' | 'Merge' | 'MergeAdd' | 'MergeBack',
    highlightedIndices?: number[],
    sortedIndices?: number[],
    additionalData?: any
  ) {
    this.type = type;
    this.sortedIndices = sortedIndices;
    this.highlightedIndices = highlightedIndices || [];
    this.additionalData = additionalData; // Optional data specific to the step
  }
}

export abstract class SortingOperation {
  public static swap(
    leftIndex: number,
    rightIndex: number,
    sortedIndices?: number[],
    additionalData?: any
  ): SortingStep {
    return new SortingStep('Swap', [leftIndex, rightIndex], sortedIndices, additionalData);
  }

  public static compare(
    leftIndex: number,
    rightIndex: number,
    sortedIndices?: number[],
    additionalData?: any
  ): SortingStep {
    return new SortingStep('Compare', [leftIndex, rightIndex], sortedIndices, additionalData);
  }

  public static sorted(additionalData?: any): SortingStep {
    return new SortingStep('Sorted', undefined, undefined, additionalData);
  }

  public static merge(start: number, middle: number, end: number): SortingStep {
    // Store start, middle, and end indices
    return new SortingStep('Merge', [start, middle, end]);
  }

  public static moveBack(start: number, end: number): SortingStep {
    // Move elements back from merge array to "unsorted array"
    return new SortingStep('MergeBack', [start, end]);
  }

  public static mAdd(addedIndex: number, mergeIndex: number): SortingStep {
    // Add to the merge array
    return new SortingStep('MergeAdd', [addedIndex, mergeIndex]);
  }
}
