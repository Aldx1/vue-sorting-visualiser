<template>
  <div
    :class="isLandscape ? 'row m-2' : 'flex-col-space'"
    :style="isLandscape ? { width: '99vw', height: '98vh' } : { height: '99vh' }"
  >
    <div
      :class="(isLandscape ? 'col-10 flex-col-space' : 'row m-2') + ' p-0 '"
      :style="isLandscape ? '' : 'margin-top: 100px !important;'"
    >
      <AnimationSVG class="visualiser p-3" />
    </div>

    <InfoContainer :isLandscape="isLandscape" :isWidescreen="isWidescreen" />
    <InputContainer :isLandscape="isLandscape" :isMobile="isMobile" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted } from 'vue';

import AnimationSVG from './components/AnimationSVG.vue';
import InputContainer from './components/InputContainer.vue';
import InfoContainer from './components/InfoContainer.vue';

import { useArrayCreationStore } from './store/ArrayCreationStore';
import { useWindowSizeStore } from './store/WindowSizeStore';

export default defineComponent({
  name: 'App',
  setup() {
    const windowStore = useWindowSizeStore();
    const arrayCreationStore = useArrayCreationStore();

    const isLandscape = computed(() => windowStore.isLandscape);
    const isMobile = computed(() => windowStore.isMobile);
    const isWidescreen = computed(() => windowStore.isWidescreen);

    const updateWindowSize = () => {
      windowStore.windowHeight = window.innerHeight;
      windowStore.windowWidth = window.innerWidth;
    };

    onMounted(() => {
      arrayCreationStore.generateArray();
      window.addEventListener('resize', updateWindowSize);
      updateWindowSize();
    });

    onUnmounted(() => {
      window.removeEventListener('resize', updateWindowSize);
    });

    return { isLandscape, isMobile, isWidescreen };
  },
  components: {
    AnimationSVG,
    InputContainer,
    InfoContainer,
  },
});
</script>

<style></style>
