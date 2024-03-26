import SortingStep from './SortingStep';

export default interface ISortingAlgorithm {
  keyMap: Map<string, string>;
  operations: Map<string, number>;
  pseudoCode: string;
  steps: SortingStep[];
  sort: (numberArray: number[]) => void;
}
