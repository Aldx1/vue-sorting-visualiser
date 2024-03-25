import SortingStep from './SortingStep';

export default interface ISortingAlgorithm {
  sort: (numberArray: number[]) => void;
  pseudoCode: string;
  sorted: boolean;
  totalOperations: number;
  operations: Map<string, number>;
  steps: SortingStep[];
  sortedIndices: number[];
}
