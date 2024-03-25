<template>
  <bcard
    tag="article"
    style="max-width: 14rem; color: white"
    class="m-2 bg-success shadow-lg align-items-sm-center"
  >
    <btn-toolbar class="m-2">
      <btn-group class="mx-1">
        <btn>&lsaquo;</btn>
      </btn-group>
      <btn-group class="mx-1">
        <btn>Play</btn>
      </btn-group>
      <btn-group class="mx-1">
        <btn>&rsaquo;</btn>
      </btn-group>
    </btn-toolbar>
    <b-form-input
      id="array-size-range"
      type="range"
      style="align-items: center; max-width: 15rem"
      :min="1000"
      :max="6000"
    ></b-form-input>
  </bcard>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Components } from "bootstrap-vue-3";

export default defineComponent({
  name: "SortingControls",
  components: {
    bcard: Components.BCard,
    btn: Components.BButton,
    "btn-toolbar": Components.BButtonToolbar,
    "btn-group": Components.BButtonGroup,
    "b-form-input": Components.BFormInput,
  },
  setup() {},
});
</script>

<style></style>
