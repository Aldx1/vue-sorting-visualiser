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
import { computed, defineComponent, watch } from 'vue';
import { useSortingStore } from '@/store/sortingVisualiserStore';
import { storeToRefs } from 'pinia';
import SortingStep from '@/sortingAlgorithms/SortingStep';
import {
  moveUpdate,
  performSwap,
  removeClass,
  addClass,
  merge,
  mergeAdded,
  mergeBack,
  updateIndexes,
} from '../componentHelper/SortingStepHelper';

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

    const resetNumberArray = () => {
      numberArray.value.forEach((_, index) => {
        let element = document.getElementById('g-' + index);
        if (element) {
          element.setAttribute('class', 'elem');
          element.setAttribute('data-index', `g-${index}`);
        }
      });
    };

    const moveUpdatesArr: moveUpdate[] = [];

    let intervalCounter = 0;
    let insertionIndex: number = -1;
    let selectionIndex: number = -1;

    const playStep = (stepCounter: number) => {
      // Tidy up previous step
      if (currentSortingStep) {
        const { type: sortingStepType, highlightedIndices } = currentSortingStep;
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
      currentSortingStep = sortingSteps.value[stepCounter];
      const { type: sortingStepType, highlightedIndices, sortedIndices, additionalData } = currentSortingStep;

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
            moveUpdatesArr.push(new moveUpdate(highlightedIndices[0], highlightedIndices[1]));
          }
          mergeAdded(highlightedIndices, barXPlacement.value, barWidth.value, barSpacing.value);
          break;
        case 'MergeBack':
          updateIndexes(moveUpdatesArr);
          mergeBack(highlightedIndices, barXPlacement.value, barWidth.value, barSpacing.value);
          moveUpdatesArr.splice(0);
          break;
        case 'Sorted':
          addClass(
            'sorted',
            numberArray.value.map((_, index) => index)
          );
          break;
      }

      addClass('sorted', sortedIndices);
      handleAdditionalData(additionalData);

      stepCounter++;
    };

    function handleAdditionalData(additionalData?: any) {
      if (!additionalData) return;

      // Insertion Sort additional data
      if (additionalData.insertionIndex) {
        if (insertionIndex === -1) {
          insertionIndex = currentSortingStep.additionalData.insertionIndex;
          addClass('current', [insertionIndex]);
        } else {
          if (currentSortingStep.type == 'Swap') insertionIndex = currentSortingStep.highlightedIndices[1];

          removeClass('current', [insertionIndex]);
          if (currentSortingStep.type !== 'Sorted') {
            insertionIndex = currentSortingStep.additionalData.insertionIndex;
            addClass('current', [insertionIndex]);
          }
        }
      }

      // Selection Sort addition data
      if (additionalData.selection) {
        if (selectionIndex === -1) {
          selectionIndex = currentSortingStep.additionalData.selectionIndex;
          addClass('current', [selectionIndex]);
        } else {
          if (currentSortingStep.type == 'Swap') {
            removeClass('current', currentSortingStep.highlightedIndices);
          } else {
            removeClass('current', [selectionIndex]);

            if (currentSortingStep.type !== 'Sorted') {
              selectionIndex = currentSortingStep.additionalData.selectionIndex;
              addClass('current', [selectionIndex]);
            }
          }
        }
      }
    }

    watch([numberArray, sortingSteps], () => {
      console.log(sortingSteps.value);
      intervalCounter = 0;
      clearInternalInterval();
      resetNumberArray();
      interval = setInterval(() => {
        if (intervalCounter < sortingSteps.value.length) {
          playStep(intervalCounter);
          intervalCounter++;
        } else {
          clearInternalInterval();
        }
      }, 500);
    });

    return { numberArray, barWidth, barSpacing, maxBarHeight, barXPlacement };
  },
});
</script>

<style scoped>
.elem {
  transition: transform 500ms cubic-bezier(0.2, 1, 0.3, 1);
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
  fill: #ff0000;
  stroke: #ff0000;
  stroke-width: 1;
}

.mergeAdded rect {
  fill: #57eb13;
  stroke: #57eb13;
  stroke-width: 1;
}

.mergeBack rect {
  fill: #00ffea !important;
  stroke: #00ffea !important;
  stroke-width: 1;
}

.current rect {
  stroke: rgb(255, 0, 212);
  stroke-width: 3;
}
</style>
