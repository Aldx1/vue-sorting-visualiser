<template>
  <div :class="props.rangeClass">
    <div v-if="props.rangeLabel">
      <label :for="props.rangeId">{{ props.rangeLabel }}</label>
    </div>
    <b-form-input
      :id="props.rangeId"
      type="range"
      :min="props.minRangeValue"
      :max="props.maxRangeValue"
      v-model="model"
      @input="props.rangeInput"
    ></b-form-input>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Components } from 'bootstrap-vue-3';

export default defineComponent({
  name: 'BRange',
  components: {
    'b-form-input': Components.BFormInput,
  },
  props: {
    rangeModel: {
      type: Number,
      required: true,
    },
    rangeInput: {
      type: Function,
      required: true,
    },
    minRangeValue: {
      type: Number,
      required: true,
    },
    maxRangeValue: {
      type: Number,
      required: true,
    },
    rangeId: {
      type: String,
      required: true,
    },
    rangeLabel: {
      type: String,
      default: null,
    },
    rangeClass: {
      type: String,
      default: null,
    },
  },
  setup(props) {
    return {
      props,
      model: props.rangeModel,
    };
  },
});
</script>
