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

    let stepCounter = 0;
    watch([numberArray, sortingSteps], () => {
      console.log(numberArray.value);
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
            // Highlight left and right array
          }

          if (currentSortingStep.type == 'M-Add') {
            // Move element into merge array
          }

          if (currentSortingStep.type == 'MoveBack') {
            // Move elements back from merge into original array
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
      }, 1000);
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

.compare rect {
  fill: #960000;
  stroke: #960000;
  stroke-width: 1;
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

.current rect {
  stroke: rgb(255, 0, 212);
  stroke-width: 3;
}
</style>
