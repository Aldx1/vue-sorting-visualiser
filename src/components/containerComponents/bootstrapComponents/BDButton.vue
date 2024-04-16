<template>
  <label :for="props.dropdownId" v-if="props.label">{{ props.label }}</label>
  <b-dropdown
    split
    :id="props.dropdownId"
    :text="props.selectedOption"
    @click="props.handleClick()"
    :variant="props.variant"
    :class="props.dropdownClass"
    :split-variant="props.splitVariant"
  >
    <b-dropdown-item v-for="(option, index) in options" :key="index" @click="handleOptionClick(option)">{{
      option
    }}</b-dropdown-item>
  </b-dropdown>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Components } from 'bootstrap-vue-3';

export default defineComponent({
  name: 'BDButton',
  components: {
    'b-dropdown': Components.BDropdown,
    'b-dropdown-item': Components.BDropdownItem,
  },
  props: {
    options: {
      type: Array,
      required: true,
    },
    selectedOption: {
      type: String,
      required: true,
    },
    handleOptionClick: {
      type: Function,
      required: true,
    },
    handleClick: {
      type: Function,
      required: true,
    },
    dropdownId: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: null,
    },
    variant: {
      type: String,
      default: null,
    },
    splitVariant: {
      type: String,
      default: null,
    },
    dropdownClass: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    return {
      props,
    };
  },
});
</script>

<style></style>
