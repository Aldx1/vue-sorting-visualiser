<template>
  <btn :class="props.buttonClass" @click="props.buttonClick" :variant="props.variant"
    ><span v-html="props.buttonText"></span
  ></btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Components } from 'bootstrap-vue-3';
import { BaseButtonVariant } from 'bootstrap-vue-3/dist/types';

export default defineComponent({
  name: 'BButton',
  components: {
    btn: Components.BButton,
  },
  props: {
    buttonClick: {
      type: Function,
      required: true,
    },
    buttonText: {
      type: String,
      required: true,
    },
    buttonClass: {
      type: String,
      default: null,
    },
    variant: {
      type: String as () => keyof BaseButtonVariant | undefined,
      default: null,
    },
  },
  setup(props) {
    return { props };
  },
});
</script>
