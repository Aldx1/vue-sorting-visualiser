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
        class="bar"
        v-for="(value, index) in numberArray"
        :key="index"
        :style="{
          transform: `translate(${
            (950 -
              (numberArray.length * barWidth +
                (numberArray.length - 1) * barSpacing)) /
              2 +
            index * (barWidth + barSpacing)
          }px, 0)`,
        }"
      >
        <rect
          :y="maxBarHeight - value"
          :width="barWidth"
          :height="value"
          fill="green"
          rx="0.3rem"
        />
        <text :x="barWidth / 2" :y="maxBarHeight + textOffset">
          {{ value }}
        </text>
      </g>
    </svg>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useSortingStore } from "@/store/sortingVisualiserStore";

import { storeToRefs } from "pinia";

export default defineComponent({
  name: "ArrayDisplay",

  setup() {
    const sortingStore = useSortingStore();
    const numberArray = storeToRefs(sortingStore).numberArray;

    const barWidth = computed(() => 700 / sortingStore.numberArray.length);
    const barSpacing = 10;
    const textOffset = 20;
    const maxBarHeight = 200;

    console.log(barWidth);

    return { numberArray, barWidth, barSpacing, textOffset, maxBarHeight };
  },
});
</script>

<style scoped>
.bar {
  transition: transform 250ms cubic-bezier(0.18, 0.89, 0.32, 1.28);
}
.bar rect {
  fill: #3f3b6c;
  stroke: #3f3b6c;
  stroke-width: 1;
}
.bar text {
  font-size: 0.8rem;
  fill: var(--text-body-color);
  text-anchor: middle;
}
.current {
  fill: #7858a6;
  stroke: #9d71ea;
}
.swapped rect {
  fill: #5b4b8a;
  stroke: #5b4b8a;
}
</style>
