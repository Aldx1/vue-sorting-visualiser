<template>
  <svg viewBox="0 0 950 500">
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
      <rect :y="maxBarHeight - (value + 15)" :width="barWidth" :height="value + 15" rx="0.3rem" />
      <text :x="barWidth / 2" :y="maxBarHeight + 40" class="svg-group-text">
        {{ value }}
      </text>
    </g>
  </svg>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, watch } from 'vue';
import { useSortingStore } from '@/store/SortingStore';
import { storeToRefs } from 'pinia';

import { useAnimationControlsStore } from '@/store/AnimationStore';

export default defineComponent({
  name: 'AnimationSVG',

  setup() {
    const sortingStore = useSortingStore();
    const animationStore = useAnimationControlsStore();

    const { numberArray, sortingAlgorithm } = storeToRefs(sortingStore);
    const { animationSpeed, barXPlacement, barWidth, barSpacing, maxBarHeight, play, animationStep } =
      storeToRefs(animationStore);

    let interval: number;

    watch(sortingAlgorithm, () => {
      reset();
    });

    watch(animationStep, () => {
      if (animationStep.value == 0) {
        reset();
      }
    });

    watch(animationSpeed, () => {
      if (play.value) {
        clearInternalInterval();
        setInternalInterval();
      }
    });

    watch([numberArray], () => {
      clearInternalInterval();
      resetNumberArray();
      setInternalInterval();
    });

    watch(play, () => {
      if (play.value) {
        setInternalInterval();
      } else {
        clearInternalInterval();
      }
    });

    const reset = () => {
      numberArray.value = [...sortingStore.numberArray];
      resetNumberArray();
    };

    const clearInternalInterval = () => {
      clearInterval(interval);
    };

    const setInternalInterval = () => {
      interval = setInterval(() => {
        if (play.value && animationStore.canStepForward) {
          animationStore.playForwardStep();
        } else {
          clearInternalInterval();
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

    onMounted(() => {
      clearInternalInterval();
      setInternalInterval();
    });

    onUnmounted(() => {
      clearInternalInterval();
    });

    return { numberArray, barWidth, barSpacing, maxBarHeight, barXPlacement };
  },
});
</script>
