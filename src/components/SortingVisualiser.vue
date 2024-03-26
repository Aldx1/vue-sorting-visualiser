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
import { defineComponent, watch } from 'vue';
import { useSortingStore } from '@/store/SortingStore';
import { storeToRefs } from 'pinia';

import { useAnimationControlsStore } from '@/store/AnimationStore';

export default defineComponent({
  name: 'SortingVisualiser',

  setup() {
    const sortingStore = useSortingStore();
    const animationStore = useAnimationControlsStore();

    const { numberArray, algorithmSet, sortingAlgorithm } = storeToRefs(sortingStore);
    const { animationSpeed, barXPlacement, barWidth, barSpacing, maxBarHeight, paused } = storeToRefs(animationStore);

    let interval: number;

    watch(sortingAlgorithm, () => {
      numberArray.value = [...sortingStore.numberArray];
      resetNumberArray();
    });

    watch(animationSpeed, () => {
      if (!paused.value) {
        clearInterval(interval);
        setInternalInterval();
      }
    });

    watch([numberArray, algorithmSet], () => {
      clearInterval(interval);
      resetNumberArray();
      setInternalInterval();
      paused.value = false;
      animationStore.paused = false;
    });

    watch(paused, () => {
      if (paused.value) {
        clearInterval(interval);
      } else {
        setInternalInterval();
      }
    });

    const setInternalInterval = () => {
      interval = setInterval(() => {
        if (!paused.value) {
          animationStore.playStep();
        } else {
          clearInterval(interval);
        }
      }, animationSpeed.value);
    };

    const resetNumberArray = () => {
      numberArray.value.forEach((_, index) => {
        let element = document.getElementById('g-' + index);
        if (element) {
          element.setAttribute('class', 'elem');
          element.setAttribute('data-index', `g-${index}`);
        }
      });
    };

    return { numberArray, barWidth, barSpacing, maxBarHeight, barXPlacement };
  },
});
</script>
