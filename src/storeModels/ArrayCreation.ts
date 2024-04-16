export enum ArrayOrderingOption {
  RANDOM = 'Random',
  ASCENDING = 'Ascending',
  PARTIALLY_SORTED = 'Partially Sorted',
  DESCENDING = 'Descending',
}

export interface IArrayCreationModel {
  arraySize: number;
  arrayOrder: ArrayOrderingOption;
}
