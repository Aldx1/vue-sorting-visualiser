export class moveUpdate {
  fromIndex: number;
  toIndex: number;
  element?: HTMLElement;
  constructor(fromIndex: number, toIndex: number) {
    this.fromIndex = fromIndex;
    this.toIndex = toIndex;
  }
}

export function performSwap(index1: number, index2: number) {
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

export function updateIndexes(moveUpdates?: moveUpdate[]) {
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

export function merge(start: number, middle: number, end: number) {
  const leftArrayIndices: number[] = [];
  const rightArrayIndices: number[] = [];
  for (let i = start; i <= middle; i++) leftArrayIndices.push(i);
  for (let i = middle + 1; i <= end; i++) rightArrayIndices.push(i);
  addClass('mergeLeft', leftArrayIndices);
  addClass('mergeRight', rightArrayIndices);
}

export function mergeAdded(highlightedIndices: number[], barXPlacement: number, barWidth: number, barSpacing: number) {
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

export function mergeBack(highlightedIndices: number[], barXPlacement: number, barWidth: number, barSpacing: number) {
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

export function removeClass(className: string, indices: number[]) {
  indices.forEach((index) => {
    const element = document.querySelector(`[data-index="g-${index}"]`) as HTMLElement;
    element?.classList.remove(className);
  });
}

export function addClass(className: string, indices?: number[]) {
  indices?.forEach((index) => {
    const element = document.querySelector(`[data-index="g-${index}"]`) as HTMLElement;
    element?.classList.add(className);
  });
}
