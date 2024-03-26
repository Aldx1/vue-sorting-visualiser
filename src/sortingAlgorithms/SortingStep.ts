export enum SortingStepType {
  COMPARE = 'Compare',
  SWAP = 'Swap',
  SORTED = 'Sorted',
  MERGE = 'Merge',
  MERGEADD = 'MergeAdd',
  MERGEBACK = 'MergeBack',
}

export default class SortingStep {
  type: SortingStepType;
  highlightedIndices: number[];
  sortedIndices?: number[];
  additionalData: any;
  constructor(type: SortingStepType, highlightedIndices?: number[], sortedIndices?: number[], additionalData?: any) {
    this.type = type;
    this.sortedIndices = sortedIndices;
    this.highlightedIndices = highlightedIndices || [];
    this.additionalData = additionalData; // Optional data specific to the step
  }
}

export abstract class SortingOperation {
  public static compare(
    leftIndex: number,
    rightIndex: number,
    sortedIndices?: number[],
    additionalData?: any
  ): SortingStep {
    return new SortingStep(SortingStepType.COMPARE, [leftIndex, rightIndex], sortedIndices, additionalData);
  }

  public static swap(
    leftIndex: number,
    rightIndex: number,
    sortedIndices?: number[],
    additionalData?: any
  ): SortingStep {
    return new SortingStep(SortingStepType.SWAP, [leftIndex, rightIndex], sortedIndices, additionalData);
  }

  public static sorted(additionalData?: any): SortingStep {
    return new SortingStep(SortingStepType.SORTED, undefined, undefined, additionalData);
  }

  public static merge(start: number, middle: number, end: number): SortingStep {
    return new SortingStep(SortingStepType.MERGE, [start, middle, end]);
  }

  public static mergeAdd(addedIndex: number, mergeIndex: number): SortingStep {
    return new SortingStep(SortingStepType.MERGEADD, [addedIndex, mergeIndex]);
  }

  public static mergeBack(start: number, end: number): SortingStep {
    return new SortingStep(SortingStepType.MERGEBACK, [start, end]);
  }
}
