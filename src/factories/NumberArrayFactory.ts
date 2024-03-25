import { ArrayOrderingOption } from '@/storeModels/ArrayConfigModel';

export default interface INumberArrayGenerator {
  generateArray: (order: ArrayOrderingOption, arraySize: number) => number[];
}

export class NumberArrayGenerator implements INumberArrayGenerator {
  #numberArray: number[] = [];
  #arraySize: number = 15;
  #minArrayValue: number = 1;
  #maxArrayValue: number = 100;

  generateArray(order: ArrayOrderingOption, arraySize: number): number[] {
    this.#numberArray = [];
    this.#arraySize = arraySize;

    switch (order) {
      case ArrayOrderingOption.RANDOM:
        this.#createRandom();
        break;
      case ArrayOrderingOption.ASCENDING:
        this.#createSorted();
        break;
      case ArrayOrderingOption.PARTIALLY_SORTED:
        this.#createAlmostSorted();
        break;
      case ArrayOrderingOption.DESCENDING:
        this.#createReverseSorted();
        break;
    }
    return [...this.#numberArray];
  }

  /** Create a number array which is randomly sorted */
  #createRandom(): void {
    for (let i = 0; i < this.#arraySize; i++) {
      const randomNumber =
        Math.floor(Math.random() * (this.#maxArrayValue - this.#minArrayValue + 1)) + this.#minArrayValue;

      this.#numberArray.push(randomNumber);
    }
  }

  /** Create a number array which is already sorted, alternative to using Array.sort */
  #createSorted(): void {
    const targetElementValue = this.#maxArrayValue / this.#arraySize;

    for (let i = 0; i < this.#arraySize; i++) {
      const currentLimit = targetElementValue * (i + 1);

      let numberElement = Math.floor(Math.random() * (currentLimit - this.#minArrayValue) + this.#minArrayValue);

      if (i === 0) {
        this.#numberArray.push(numberElement);
        continue;
      }

      while (numberElement < this.#numberArray[i - 1]) {
        numberElement = Math.floor(Math.random() * (currentLimit - this.#minArrayValue) + this.#minArrayValue);
      }

      this.#numberArray.push(numberElement);
    }
  }

  /** Create an almost sorted number array */
  #createAlmostSorted(): void {
    const shiftPercentage: number = 0.3;

    // Generate a sorted random array using the built in Array.sort function
    const sortedArray = Array.from(
      { length: this.#arraySize },
      () => Math.floor(Math.random() * (this.#maxArrayValue - this.#minArrayValue + 1)) + this.#minArrayValue
    ).sort((a, b) => a - b);

    // Apply "almost sorting" by shifting elements
    const almostSortedArray = sortedArray.slice();
    const shiftAmount = Math.floor(this.#arraySize * shiftPercentage);

    for (let i = 0; i < this.#arraySize; i++) {
      // Select a random index
      const randomShiftIndex = Math.floor(Math.random() * shiftAmount);

      // Ensure the shift stays within bounds
      const shiftedIndex = Math.min(i + randomShiftIndex, this.#arraySize - 1);

      // Swap current element with the shifted element
      [almostSortedArray[i], almostSortedArray[shiftedIndex]] = [almostSortedArray[shiftedIndex], almostSortedArray[i]];
    }

    this.#numberArray = almostSortedArray;
  }

  /** Create a number array which is reverse sorted */
  #createReverseSorted(): void {
    const targetElementValue = this.#maxArrayValue / this.#arraySize;

    for (let i = 0; i < this.#arraySize; i++) {
      const remainingValueForElement = targetElementValue * (i + 1);
      const currentLimit = this.#maxArrayValue - remainingValueForElement;

      let numberElement = Math.floor(Math.random() * (this.#maxArrayValue - currentLimit) + currentLimit);

      if (i === 0) {
        this.#numberArray.push(numberElement);
        continue;
      }

      while (numberElement > this.#numberArray[i - 1]) {
        numberElement = Math.floor(Math.random() * (this.#maxArrayValue - currentLimit) + currentLimit);
      }

      if (numberElement < this.#minArrayValue) {
        numberElement = this.#minArrayValue;
      }

      this.#numberArray.push(numberElement);
    }
  }
}
