<template>
  <bcard header="Control" class="sortingCard shadow-lg" bodyClass="flex-col-space">
    <BRange
      :minRangeValue="0"
      :maxRangeValue="minSpeed"
      rangeId="sort-speed-range"
      :rangeModel="animationDisplaySpeed"
      :rangeInput="setAnimationSpeed"
      rangeClass="mt-1"
    />

    <BButton
      :buttonText="playText"
      :buttonClick="playPauseRestart"
      :variant="'outline-success'"
      buttonClass="mt-4"
    ></BButton>
  </bcard>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useAnimationControlsStore } from '@/store/AnimationStore';
import { storeToRefs } from 'pinia';
import BButton from '../bootstrapComponents/BButton.vue';
import BRange from '../bootstrapComponents/BRange.vue';
import { Components } from 'bootstrap-vue-3';

export default defineComponent({
  name: 'AnimationController',
  components: {
    bcard: Components.BCard,
    BButton,
    BRange,
  },
  setup() {
    const animationStore = useAnimationControlsStore();
    const { play, animationDisplaySpeed } = storeToRefs(animationStore);

    const playText = computed(() => {
      if (disablePlay.value) return `<i class="bi bi-rewind"></i> Restart`;
      else if (play.value) return `<span><i class="bi bi-pause"></i> Pause</span>`;
      else return `<span><i class="bi bi-play"></i> Play</span>`;
    });

    const disablePlay = computed(() => {
      if (animationStore.canStepForward) return false;
      return true;
    });

    const setAnimationSpeed = (newSpeed: string) => {
      animationDisplaySpeed.value = Number(newSpeed);
      animationStore.setAnimationSpeed(animationDisplaySpeed.value);
    };

    const playPauseRestart = () => {
      if (disablePlay.value) restart();
      else if (play.value) animationStore.pause();
      else animationStore.resume();
    };

    const restart = () => {
      animationStore.resetStep();
      animationStore.resume();
    };

    return {
      minSpeed: animationStore.minSpeed,
      animationDisplaySpeed,
      playText,
      disablePlay,
      setAnimationSpeed,
      playPauseRestart,
    };
  },
});
</script>

<style></style>
