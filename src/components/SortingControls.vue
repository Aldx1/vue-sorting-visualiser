<template>
  <bcard tag="article" style="max-width: 14rem; color: white" class="m-2 bg-secondary shadow-lg align-items-sm-center">
    <btn-toolbar class="m-2">
      <btn-group class="mx-1">
        <btn class="bg-primary">&lsaquo;</btn>
      </btn-group>
      <btn-group :disabled="playDisabled" class="mx-1">
        <btn class="bg-primary" style="min-width: 40px" @click="playPauseToggle">{{ playText }}</btn>
      </btn-group>
      <btn-group class="mx-1">
        <btn class="bg-primary">&rsaquo;</btn>
      </btn-group>
    </btn-toolbar>
    <b-form-input
      id="array-size-range"
      type="range"
      style="align-items: center; max-width: 15rem"
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

    const minSpeed = animationStore.getMinSpeed;
    const playPause = storeToRefs(animationStore).paused;
    const playText = computed(() => {
      if (!playPause.value) return 'Pause';
      else return 'Play';
    });

    const playDisabled = storeToRefs(animationStore).disabled;

    let animationSpeed = (minSpeed - 100) / 2;

    const setAnimSpeed = (newSpeed: string) => {
      const newSpeedNumber = minSpeed - Number(newSpeed);
      animationSpeed = newSpeedNumber;
      animationStore.setAnimationSpeed(animationSpeed);
    };

    const stepBack = () => {
      animationStore.paused = true;
      animationStore.playStep(false);
    };

    const stepForward = () => {
      animationStore.paused = true;
      animationStore.playStep(true);
    };

    const playPauseToggle = () => {
      animationStore.paused = !playPause.value;
    };

    return {
      minSpeed,
      animationSpeed,
      playText,
      playDisabled,
      playPauseToggle,
      setAnimSpeed,
      stepBack,
      stepForward,
    };
  },
});
</script>

<style></style>
@/store/AnimationStore
