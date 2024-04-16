import SortingStep, { SortingStepType } from '@/sortingAlgorithms/SortingStep';

class moveUpdate {
  fromIndex: number;
  toIndex: number;
  element?: HTMLElement;
  constructor(fromIndex: number, toIndex: number) {
    this.fromIndex = fromIndex;
    this.toIndex = toIndex;
  }
}

class DOMAnimationManipulation {
  /// Expect 2 number array [left, right]
  /// Swap the x positions with transform
  static performSwap(indexArray: number[]) {
    const left = indexArray[0];
    const right = indexArray[1];
    const leftBar = document.querySelector(`[data-index="g-${left}"]`) as HTMLElement;
    const rightBar = document.querySelector(`[data-index="g-${right}"]`) as HTMLElement;

    if (leftBar && rightBar) {
      const temp = leftBar.style.transform;
      leftBar.style.transform = rightBar.style.transform;
      rightBar.style.transform = temp;

      leftBar.setAttribute('data-index', `g-${right}`);
      rightBar.setAttribute('data-index', `g-${left}`);

      leftBar.classList.add('swapped');
      leftBar.classList.remove('compare');
      rightBar.classList.add('swapped');
      rightBar.classList.remove('compare');
    }
  }

  /// Updates the elements data index for selector
  static updateDataIndex(moveUpdates: moveUpdate[]) {
    moveUpdates.forEach((element) => {
      const bar = document.querySelector(`[data-index="g-${element.fromIndex}"]`) as HTMLElement;
      if (bar) {
        element.element = bar;
      }
    });

    moveUpdates.forEach((element) => {
      if (element.element) {
        element.element.setAttribute('data-index', `g-${element.toIndex}`);
      }
    });
  }

  // Highlight left and right partitions
  static merge(start: number, middle: number, end: number) {
    const leftArrayIndices: number[] = [];
    const rightArrayIndices: number[] = [];
    for (let i = start; i <= middle; i++) leftArrayIndices.push(i);
    for (let i = middle + 1; i <= end; i++) rightArrayIndices.push(i);
    this.addClass('merge-left', leftArrayIndices);
    this.addClass('merge-right', rightArrayIndices);
  }

  // Highlight the array elements added after comparison
  static mergeAdded(highlightedIndices: number[], barXPlacement: number, barWidth: number, barSpacing: number) {
    const index = highlightedIndices[0];
    this.addClass('merge-added', [index]);
    this.removeClass('merge-left', [index]);
    this.removeClass('merge-right', [index]);

    const mergeIndex = highlightedIndices[1];

    let transform = `translate(${barXPlacement + mergeIndex * (barWidth + barSpacing)}px, 200px)`;

    const bar = document.querySelector(`[data-index="g-${index}"]`) as HTMLElement;

    if (bar) {
      bar.style.transform = transform;
    }
  }

  // Handle moving the array back after merge is finished.
  static mergeBack(
    highlightedIndices: number[],
    barXPlacement: number,
    barWidth: number,
    barSpacing: number,
    moveUpdatesArr: moveUpdate[]
  ) {
    this.updateDataIndex(moveUpdatesArr);
    const indices = [];
    for (let i = highlightedIndices[0]; i <= highlightedIndices[1]; i++) {
      const mergeIndex = i;
      let transform = `translate(${barXPlacement + mergeIndex * (barWidth + barSpacing)}px, 0px)`;
      indices.push(i);

      const bar = document.querySelector(`[data-index="g-${mergeIndex}"]`) as HTMLElement;
      if (bar) {
        bar.style.transform = transform;
      }
    }
    this.addClass('merge-back', indices);
  }

  // Handle moving the array back after merge is finished.
  static mergeSorted(lastIndex: number) {
    for (let element = 0; element <= lastIndex; element++) {
      const bar = document.querySelector(`[data-index="g-${element}"]`) as HTMLElement;
      if (bar) {
        const xPlacement = bar.style.transform.split('(')[1].split(',')[0];
        const transform = `translate(${xPlacement}, 75px)`;
        bar.style.transform = transform;
      }
    }
  }

  // Add classes to elements
  static addClass(className: string, indices?: number[]) {
    indices?.forEach((index) => {
      const element = document.querySelector(`[data-index="g-${index}"]`) as HTMLElement;
      element?.classList.add(className);
    });
  }

  // Remove classes from elements
  static removeClass(className: string, indices: number[]) {
    indices.forEach((index) => {
      const element = document.querySelector(`[data-index="g-${index}"]`) as HTMLElement;
      element?.classList.remove(className);
    });
  }
}

// Class to handle displaying the current animation step.
export class AnimationHelper {
  barXPlacement: number;
  barWidth: number;
  barSpacing: number;
  numberArray: number[];
  sortingAlgorithm: string;

  sortingSteps: SortingStep[] = [];
  currentSortingStep?: SortingStep;

  constructor(
    barXp: number,
    barWidth: number,
    barSpacing: number,
    numberArray: number[],
    sortingAlgorithm: string,
    sortingSteps: SortingStep[]
  ) {
    this.barXPlacement = barXp;
    this.barWidth = barWidth;
    this.barSpacing = barSpacing;
    this.numberArray = numberArray;
    this.sortingSteps = sortingSteps;
    this.sortingAlgorithm = sortingAlgorithm;
  }

  // Used for Merge : Keep track of indexes moved to and fro pos'
  moveUpdatesArr: moveUpdate[] = [];
  insertionIndex: number = -1;
  selectionIndex: number = -1;

  playStep(stepCounter: number) {
    this.tidyLastStep();
    this.playCurrentStep(stepCounter);
  }

  tidyLastStep() {
    if (this.currentSortingStep) {
      const { sortingStepType, indices } = this.currentSortingStep;
      switch (sortingStepType) {
        case SortingStepType.COMPARE:
          DOMAnimationManipulation.removeClass('compare', indices);
          break;
        case SortingStepType.SWAP:
          DOMAnimationManipulation.removeClass('swapped', indices);
          break;
        case SortingStepType.MERGEBACK:
          const startEndIndices: number[] = [];
          for (let i = indices[0]; i <= indices[1]; i++) startEndIndices.push(i);
          DOMAnimationManipulation.removeClass('merge-back', startEndIndices);
          DOMAnimationManipulation.removeClass('merge-added', startEndIndices);
          break;
      }
    }
  }

  playCurrentStep(stepCounter: number) {
    // Perform current step
    this.currentSortingStep = this.sortingSteps[stepCounter];
    const { sortingStepType, indices, sortedIndices } = this.currentSortingStep;

    switch (sortingStepType) {
      case SortingStepType.COMPARE:
        DOMAnimationManipulation.addClass('compare', indices);
        break;
      case SortingStepType.SWAP:
        DOMAnimationManipulation.performSwap(indices);
        break;
      case SortingStepType.SORTED:
        DOMAnimationManipulation.addClass(
          'sorted',
          this.numberArray.map((_, index) => index)
        );
        if (this.sortingAlgorithm == 'Merge') DOMAnimationManipulation.mergeSorted(this.numberArray.length - 1);
        break;
      case SortingStepType.MERGE:
        DOMAnimationManipulation.merge(indices[0], indices[1], indices[2]);
        break;
      case SortingStepType.MERGEADD:
        if (indices[0] !== indices[1]) {
          this.moveUpdatesArr.push(new moveUpdate(indices[0], indices[1]));
        }
        DOMAnimationManipulation.mergeAdded(indices, this.barXPlacement, this.barWidth, this.barSpacing);
        break;
      case SortingStepType.MERGEBACK:
        DOMAnimationManipulation.mergeBack(
          indices,
          this.barXPlacement,
          this.barWidth,
          this.barSpacing,
          this.moveUpdatesArr
        );
        this.moveUpdatesArr.splice(0);
        break;
    }

    DOMAnimationManipulation.addClass('sorted', sortedIndices);
    this.handleAdditionalData();

    stepCounter++;
  }

  handleAdditionalData() {
    if (!this.currentSortingStep || !this.currentSortingStep.additionalData) return;

    // Insertion Sort additional data
    if (this.currentSortingStep.additionalData.insertionIndex) {
      if (this.insertionIndex === -1) {
        this.insertionIndex = this.currentSortingStep.additionalData.insertionIndex;
        DOMAnimationManipulation.addClass('current', [this.insertionIndex]);
      } else {
        if (this.currentSortingStep.sortingStepType == 'Swap') this.insertionIndex = this.currentSortingStep.indices[1];

        DOMAnimationManipulation.removeClass('current', [this.insertionIndex]);
        if (this.currentSortingStep.sortingStepType !== 'Sorted') {
          this.insertionIndex = this.currentSortingStep.additionalData.insertionIndex;
          DOMAnimationManipulation.addClass('current', [this.insertionIndex]);
        }
      }
    }

    // Selection Sort addition data
    if (this.currentSortingStep.additionalData.selection) {
      if (this.selectionIndex === -1) {
        this.selectionIndex = this.currentSortingStep.additionalData.selectionIndex;
        DOMAnimationManipulation.addClass('current', [this.selectionIndex]);
      } else {
        if (this.currentSortingStep.sortingStepType == 'Swap') {
          DOMAnimationManipulation.removeClass('current', this.currentSortingStep.indices);
        } else {
          DOMAnimationManipulation.removeClass('current', [this.selectionIndex]);

          if (this.currentSortingStep.sortingStepType !== 'Sorted') {
            this.selectionIndex = this.currentSortingStep.additionalData.selectionIndex;
            DOMAnimationManipulation.addClass('current', [this.selectionIndex]);
          }
        }
      }
    }
  }
}
