<template>
  <div
    style="
      width: 60%;
      height: auto;
      max-height: 600px;
      float: left;
      display: inline-block;
      margin: 10px 0px 20px 0;
      padding: 15px;
      border-style: double;
      border-radius: 10px;
    "
    class="shadow-lg"
  >
    <svg viewBox="0 0 950 500" style="align-items: center">
      <g
        v-for="(value, index) in numberArray"
        class="elem"
        :key="index"
        :id="'g-' + index"
        :data-index="'g-' + index"
        :style="{
          transform: `translate(${barXPlacement + index * (barWidth + barSpacing)}px, 0)`,
        }"
      >
        <rect :y="maxBarHeight - value" :width="barWidth" :height="value" rx="0.3rem" />
        <text :x="barWidth / 2" :y="maxBarHeight + 20">
          {{ value }}
        </text>
      </g>
    </svg>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useSortingStore } from '@/store/sortingVisualiserStore';

import { storeToRefs } from 'pinia';
import SortingStep from '@/sortingAlgorithms/SortingStep';

export default defineComponent({
  name: 'SortingVisualiser',

  setup() {
    const sortingStore = useSortingStore();

    const barWidth = computed(() => 700 / sortingStore.numberArray.length);
    const barSpacing = computed(() => 250 / sortingStore.numberArray.length);
    const barXPlacement = computed(
      () =>
        (950 -
          (sortingStore.numberArray.length * barWidth.value +
            (sortingStore.numberArray.length - 1) * barSpacing.value)) /
        2
    );
    const maxBarHeight = 200;

    let interval: number;
    let currentSortingStep: SortingStep;

    const clearInternalInterval = () => {
      clearInterval(interval);
    };

    const numberArray = storeToRefs(sortingStore).numberArray;
    const sortingSteps = storeToRefs(sortingStore).sortingSteps;

    watch(
      () => sortingStore.sortingAlgorithm,
      () => {
        numberArray.value = [...sortingStore.numberArray];
        resetNumberArray();
      }
    );

    const resetNumberArray = (sortedIndices?: number[], minIndex?: number) => {
      numberArray.value.forEach((_, index) => {
        let element = document.getElementById('g-' + index);
        if (element) {
          element.setAttribute('class', 'elem');
          element.setAttribute('data-index', `g-${index}`);
        }
      });
    };

    const performStep = () => {};

    class moveUpdate {
      fromIndex: number;
      toIndex: number;
      element?: HTMLElement;
      constructor(fromIndex: number, toIndex: number) {
        this.fromIndex = fromIndex;
        this.toIndex = toIndex;
      }
    }

    let stepCounter = 0;
    const moveUpdatesArr: moveUpdate[] = [];

    watch([numberArray, sortingSteps], () => {
      console.log(sortingSteps.value);
      //debugger;
      stepCounter = 0;
      clearInternalInterval();
      resetNumberArray();
      interval = setInterval(() => {
        if (stepCounter < sortingSteps.value.length) {
          if (currentSortingStep) {
            if (currentSortingStep.type == 'Compare') {
              removeClass('compare', currentSortingStep.highlightedIndices);
            } else if (currentSortingStep.type == 'Swap') {
              removeClass('swapped', currentSortingStep.highlightedIndices);
            } else if (currentSortingStep.type == 'MoveBack') {
              const indices: number[] = [];
              let highlighted = currentSortingStep.highlightedIndices;
              for (let i = highlighted[0]; i <= highlighted[1]; i++) indices.push(i);
              removeClass('mergeMoveBack', indices);
              removeClass('mergeAdded', indices);
            }
          }

          currentSortingStep = sortingSteps.value[stepCounter];

          if (currentSortingStep.type == 'Compare') {
            addClass('compare', currentSortingStep.highlightedIndices);
          }

          if (currentSortingStep.type == 'Swap') {
            const highlightedIndexes = currentSortingStep.highlightedIndices;
            swapBars(highlightedIndexes[0], highlightedIndexes[1]);
          }

          if (currentSortingStep.type == 'Merge') {
            let leftAndRightVals = currentSortingStep.highlightedIndices;
            merge(leftAndRightVals[0], leftAndRightVals[1], leftAndRightVals[2]);
          }

          if (currentSortingStep.type == 'M-Add') {
            if (currentSortingStep.highlightedIndices[0] !== currentSortingStep.highlightedIndices[1]) {
              moveUpdatesArr.push(
                new moveUpdate(currentSortingStep.highlightedIndices[0], currentSortingStep.highlightedIndices[1])
              );
            }

            mergeAdded(currentSortingStep.highlightedIndices);
          }

          if (currentSortingStep.type == 'MoveBack') {
            updateIndexes(moveUpdatesArr);
            mergeMoveBack(currentSortingStep.highlightedIndices);
            moveUpdatesArr.splice(0);
          }

          if (currentSortingStep.type == 'Sorted') {
            const indices: number[] = [];

            numberArray.value.forEach((_, index) => {
              indices.push(index);
            });

            removeClass('current', indices);
            addClass('sorted', indices);
          }

          if (currentSortingStep.additionalData) {
            if (currentSortingStep.additionalData.insertionIndex) {
              addClass('current', [currentSortingStep.additionalData.insertionIndex]);

              const indicesToRemove: number[] = [];
              numberArray.value.forEach((_, index) => {
                if (currentSortingStep.additionalData.insertionIndex !== index) {
                  indicesToRemove.push(index);
                }
              });
              removeClass('current', indicesToRemove);
            }
          }

          addClass('sorted', currentSortingStep.sortedIndices);

          stepCounter++;
        } else {
          clearInternalInterval();
        }
      }, 500);
    });

    function swapBars(index1: number, index2: number) {
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

    function mergeAdded(highlightedIndices: number[]) {
      const index = highlightedIndices[0];
      addClass('mergeAdded', [index]);
      removeClass('mergeLeft', [index]);
      removeClass('mergeRight', [index]);

      const mergeIndex = highlightedIndices[1];

      let transform = `translate(${barXPlacement.value + mergeIndex * (barWidth.value + barSpacing.value)}px, 150px)`;

      const bar1 = document.querySelector(`[data-index="g-${index}"]`) as HTMLElement;
      //const bar2 = document.querySelector(`[data-index="g-${mergeIndex}"]`) as HTMLElement;
      if (bar1) {
        bar1.style.transform = transform;
      }
    }

    function mergeMoveBack(highlightedIndices: number[]) {
      const indices = [];
      for (let i = highlightedIndices[0]; i <= highlightedIndices[1]; i++) {
        const mergeIndex = i;
        let transform = `translate(${barXPlacement.value + mergeIndex * (barWidth.value + barSpacing.value)}px, 0px)`;
        indices.push(i);

        const bar1 = document.querySelector(`[data-index="g-${mergeIndex}"]`) as HTMLElement;
        if (bar1) {
          bar1.style.transform = transform;
        }
      }
      addClass('mergeMoveBack', indices);
    }

    /* function mergeMoveBack(index: number) {
      const leftArrayIndices: number[] = [];
      const rightArrayIndices: number[] = [];
      for (let i = start; i <= middle; i++) leftArrayIndices.push(i);
      for (let i = middle + 1; i <= end; i++) rightArrayIndices.push(i);
      removeClass('mergeLeft', leftArrayIndices);
      removeClass('mergeRight', rightArrayIndices);
    } */

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

    return { numberArray, barWidth, barSpacing, maxBarHeight, barXPlacement };
  },
});
</script>

<style scoped>
.elem {
  transition: transform 700ms cubic-bezier(0.2, 1, 0.3, 1);
}

.elem rect {
  fill: #3f3b6c;
  stroke: #3f3b6c;
  stroke-width: 1;
}

.elem text {
  font-size: 0.8rem;
  text-anchor: middle;
}

.swapped rect {
  fill: #57eb13;
  stroke: #57eb13;
  stroke-width: 1;
}

.sorted rect {
  fill: #ffa65c;
  stroke: #ffa65c;
  stroke-width: 1;
}

.mergeLeft rect {
  fill: #ea00ff;
  stroke: #ea00ff;
  stroke-width: 1;
}

.mergeRight rect {
  fill: #041dff;
  stroke: #041dff;
  stroke-width: 1;
}

.compare rect {
  fill: #960000;
  stroke: #960000;
  stroke-width: 1;
}

.mergeAdded rect {
  fill: #57eb13;
  stroke: #57eb13;
  stroke-width: 1;
}

.mergeMoveBack rect {
  fill: #00ffea !important;
  stroke: #00ffea !important;
  stroke-width: 1;
}

.current rect {
  stroke: rgb(255, 0, 212);
  stroke-width: 3;
}
</style>
