import { ISortingAlgorithmFactory } from '@/factories/SortingAlgorithmFactory';

export interface ISortingModel {
  numberArray: number[];
  sortingAlgorithmFactory: ISortingAlgorithmFactory;
  sortingAlgorithm: string;
  sortingKey: Map<string, string>;
}
