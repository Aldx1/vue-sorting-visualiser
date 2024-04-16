<template>
  <div v-if="props.isLandscape" class="col p-0 flex-col-space">
    <div></div>
    <div style="height: 55%" class="flex-col-space">
      <ArrayGenerator />
      <AlgorithmSelector />
      <AnimationControls />
    </div>
  </div>

  <div v-else-if="props.isMobile">
    <div class="row m-1 mb-0">
      <div class="col p-0">
        <ArrayGenerator />
      </div>
      <div class="col p-0">
        <AlgorithmSelector />
      </div>
    </div>
    <div class="row m-1 mt-0">
      <div class="col p-0">
        <AnimationControls />
      </div>
    </div>
  </div>

  <!-- !isLandscape -->
  <div v-else>
    <div class="row m-1">
      <div class="col p-0">
        <ArrayGenerator />
      </div>
      <div class="col p-0">
        <AlgorithmSelector />
      </div>
      <div class="col p-0">
        <AnimationControls />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ArrayGenerator from './containerComponents/inputCardComponents/ArrayGenerator.vue';
import AlgorithmSelector from './containerComponents/inputCardComponents/AlgorithmSelector.vue';
import AnimationControls from './containerComponents/inputCardComponents/AnimationControls.vue';

export default defineComponent({
  name: 'InputContainer',
  props: {
    isLandscape: {
      type: Boolean,
      required: true,
    },
    isMobile: {
      type: Boolean,
      required: true,
    },
  },
  components: { ArrayGenerator, AlgorithmSelector, AnimationControls },
  setup(props) {
    return { props };
  },
});
</script>

<style></style>
