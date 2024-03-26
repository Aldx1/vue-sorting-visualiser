import SortingStep from '@/sortingAlgorithms/SortingStep';

export class moveUpdate {
  fromIndex: number;
  toIndex: number;
  element?: HTMLElement;
  constructor(fromIndex: number, toIndex: number) {
    this.fromIndex = fromIndex;
    this.toIndex = toIndex;
  }
}

function performSwap(index1: number, index2: number) {
  // Get the bars
  const bar1 = document.querySelector(`[data-index="g-${index1}"]`) as HTMLElement;
  const bar2 = document.querySelector(`[data-index="g-${index2}"]`) as HTMLElement;

  if (bar1 && bar2) {
    const temp = bar1.style.transform;
    bar1.style.transform = bar2.style.transform;
    bar2.style.transform = temp;

    bar1.setAttribute('data-index', `g-${index2}`);
    bar2.setAttribute('data-index', `g-${index1}`);

    bar1.classList.add('swapped');
    bar1.classList.remove('compare');
    bar2.classList.add('swapped');
    bar2.classList.remove('compare');
  }
}

function updateIndexes(moveUpdates?: moveUpdate[]) {
  moveUpdates?.forEach((element) => {
    const bar1 = document.querySelector(`[data-index="g-${element.fromIndex}"]`) as HTMLElement;
    if (bar1) {
      element.element = bar1;
    }
  });

  moveUpdates?.forEach((element) => {
    if (element.element) {
      element.element.setAttribute('data-index', `g-${element.toIndex}`);
    }
  });
}
function merge(start: number, middle: number, end: number) {
  const leftArrayIndices: number[] = [];
  const rightArrayIndices: number[] = [];
  for (let i = start; i <= middle; i++) leftArrayIndices.push(i);
  for (let i = middle + 1; i <= end; i++) rightArrayIndices.push(i);
  addClass('mergeLeft', leftArrayIndices);
  addClass('mergeRight', rightArrayIndices);
}

function mergeAdded(highlightedIndices: number[], barXPlacement: number, barWidth: number, barSpacing: number) {
  const index = highlightedIndices[0];
  addClass('mergeAdded', [index]);
  removeClass('mergeLeft', [index]);
  removeClass('mergeRight', [index]);

  const mergeIndex = highlightedIndices[1];

  let transform = `translate(${barXPlacement + mergeIndex * (barWidth + barSpacing)}px, 150px)`;

  const bar1 = document.querySelector(`[data-index="g-${index}"]`) as HTMLElement;

  if (bar1) {
    bar1.style.transform = transform;
  }
}

function mergeBack(highlightedIndices: number[], barXPlacement: number, barWidth: number, barSpacing: number) {
  const indices = [];
  for (let i = highlightedIndices[0]; i <= highlightedIndices[1]; i++) {
    const mergeIndex = i;
    let transform = `translate(${barXPlacement + mergeIndex * (barWidth + barSpacing)}px, 0px)`;
    indices.push(i);

    const bar1 = document.querySelector(`[data-index="g-${mergeIndex}"]`) as HTMLElement;
    if (bar1) {
      bar1.style.transform = transform;
    }
  }
  addClass('mergeBack', indices);
}

function removeClass(className: string, indices: number[]) {
  indices.forEach((index) => {
    const element = document.querySelector(`[data-index="g-${index}"]`) as HTMLElement;
    element?.classList.remove(className);
  });
}

function addClass(className: string, indices?: number[]) {
  indices?.forEach((index) => {
    const element = document.querySelector(`[data-index="g-${index}"]`) as HTMLElement;
    element?.classList.add(className);
  });
}

export class SortingHelper {
  barXPlacement: number;
  barWidth: number;
  barSpacing: number;
  numberArray: number[];

  sortingSteps: SortingStep[] = [];
  currentSortingStep?: SortingStep;

  constructor(barXp: number, barWidth: number, barSpacing: number, numberArray: number[]) {
    this.barXPlacement = barXp;
    this.barWidth = barWidth;
    this.barSpacing = barSpacing;
    this.numberArray = numberArray;
  }

  moveUpdatesArr: moveUpdate[] = [];
  insertionIndex: number = -1;
  selectionIndex: number = -1;

  playStep(stepCounter: number) {
    // Tidy up previous step
    if (this.currentSortingStep) {
      const { type: sortingStepType, highlightedIndices } = this.currentSortingStep;
      switch (sortingStepType) {
        case 'Compare':
          removeClass('compare', highlightedIndices);
          break;
        case 'Swap':
          removeClass('swapped', highlightedIndices);
          break;
        case 'MergeBack':
          const indices: number[] = [];
          for (let i = highlightedIndices[0]; i <= highlightedIndices[1]; i++) indices.push(i);
          removeClass('mergeBack', indices);
          removeClass('mergeAdded', indices);
          break;
      }
    }

    // Perform current step
    this.currentSortingStep = this.sortingSteps[stepCounter];
    const { type: sortingStepType, highlightedIndices, sortedIndices, additionalData } = this.currentSortingStep;

    switch (sortingStepType) {
      case 'Compare':
        addClass('compare', highlightedIndices);
        break;
      case 'Swap':
        performSwap(highlightedIndices[0], highlightedIndices[1]);
        break;
      case 'Merge':
        merge(highlightedIndices[0], highlightedIndices[1], highlightedIndices[2]);
        break;
      case 'MergeAdd':
        if (highlightedIndices[0] !== highlightedIndices[1]) {
          this.moveUpdatesArr.push(new moveUpdate(highlightedIndices[0], highlightedIndices[1]));
        }
        mergeAdded(highlightedIndices, this.barXPlacement, this.barWidth, this.barSpacing);
        break;
      case 'MergeBack':
        updateIndexes(this.moveUpdatesArr);
        mergeBack(highlightedIndices, this.barXPlacement, this.barWidth, this.barSpacing);
        this.moveUpdatesArr.splice(0);
        break;
      case 'Sorted':
        addClass(
          'sorted',
          this.numberArray.map((_, index) => index)
        );
        break;
    }

    addClass('sorted', sortedIndices);
    this.handleAdditionalData(additionalData);

    stepCounter++;
  }

  handleAdditionalData(additionalData?: any) {
    if (!additionalData || !this.currentSortingStep) return;

    // Insertion Sort additional data
    if (additionalData.insertionIndex) {
      if (this.insertionIndex === -1) {
        this.insertionIndex = this.currentSortingStep.additionalData.insertionIndex;
        addClass('current', [this.insertionIndex]);
      } else {
        if (this.currentSortingStep.type == 'Swap') this.insertionIndex = this.currentSortingStep.highlightedIndices[1];

        removeClass('current', [this.insertionIndex]);
        if (this.currentSortingStep.type !== 'Sorted') {
          this.insertionIndex = this.currentSortingStep.additionalData.insertionIndex;
          addClass('current', [this.insertionIndex]);
        }
      }
    }

    // Selection Sort addition data
    if (additionalData.selection) {
      if (this.selectionIndex === -1) {
        this.selectionIndex = this.currentSortingStep.additionalData.selectionIndex;
        addClass('current', [this.selectionIndex]);
      } else {
        if (this.currentSortingStep.type == 'Swap') {
          removeClass('current', this.currentSortingStep.highlightedIndices);
        } else {
          removeClass('current', [this.selectionIndex]);

          if (this.currentSortingStep.type !== 'Sorted') {
            this.selectionIndex = this.currentSortingStep.additionalData.selectionIndex;
            addClass('current', [this.selectionIndex]);
          }
        }
      }
    }
  }
}
