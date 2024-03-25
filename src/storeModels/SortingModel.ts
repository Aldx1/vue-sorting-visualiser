import { ISortingAlgorithmFactory } from '@/factories/SortingAlgorithmFactory';
import SortingStep from '@/sortingAlgorithms/SortingStep';

export interface ISortingModel {
  numberArray: number[];
  sortingAlgorithmFactory: ISortingAlgorithmFactory;
  pseudoCode: string;
  steps: SortingStep[];
  sortingAlgorithm: string;
}
