<template></template>

<script lang="ts">
import { defineComponent } from 'vue';
import AlgorithmKey from './containerComponents/infoComponents/AlgorithmKey.vue';

export default defineComponent({
  name: 'InfoContainer',
  props: {
    isLandscape: {
      type: Boolean,
      required: true,
    },
    isWidescreen: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    AlgorithmKey,
  },
  setup(props) {
    return { props };
  },
});
</script>

<style></style>
