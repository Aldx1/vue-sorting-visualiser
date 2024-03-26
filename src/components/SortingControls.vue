<template>
  <bcard tag="article" style="max-width: 14rem; color: white" class="m-2 bg-secondary shadow-lg align-items-sm-center">
    <btn v-if="!disablePlay" class="bg-primary m-2" @click="playPause"><span v-html="playText"></span></btn>
    <btn v-if="disablePlay" class="bg-primary m-2" @click="restart"><i class="bi bi-rewind"></i> Restart</btn>
    <b-form-input
      id="array-size-range"
      type="range"
      style="align-items: center; max-width: 10rem"
      :min="0"
      :max="minSpeed - 100"
      v-model="animationSpeed"
      @input="setAnimSpeed"
    ></b-form-input>
  </bcard>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from 'vue';
import { Components } from 'bootstrap-vue-3';
import { useAnimationControlsStore } from '@/store/AnimationStore';
import { storeToRefs } from 'pinia';

export default defineComponent({
  name: 'SortingControls',
  components: {
    bcard: Components.BCard,
    btn: Components.BButton,
    'btn-toolbar': Components.BButtonToolbar,
    'btn-group': Components.BButtonGroup,
    'b-form-input': Components.BFormInput,
  },
  setup() {
    const animationStore = useAnimationControlsStore();
    const { play } = storeToRefs(animationStore);
    const minSpeed = animationStore.getMinSpeed;
    let animationSpeed = (minSpeed - 100) / 2;

    const playText = computed(() => {
      if (play.value) return `<span><i class="bi bi-pause"></i> Pause</span>`;
      else return `<span><i class="bi bi-play"></i> Play</span>`;
    });

    const disablePlay = computed(() => {
      if (animationStore.canStepForward) return false;
      return true;
    });

    const disableBackStep = computed(() => {
      if (animationStore.canStepBack) return false;
      return true;
    });

    const setAnimSpeed = (newSpeed: string) => {
      const newSpeedNumber = minSpeed - Number(newSpeed);
      animationSpeed = newSpeedNumber;
      animationStore.setAnimationSpeed(animationSpeed);
    };

    const playPause = () => {
      if (play.value) animationStore.pause();
      else animationStore.resume();
    };

    const restart = () => {
      animationStore.resetStep();
      animationStore.resume();
    };

    return {
      minSpeed,
      animationSpeed,
      playText,
      disablePlay,
      disableBackStep,
      setAnimSpeed,
      playPause,
      restart,
    };
  },
});
</script>

<style></style>
