import { SortingHelper } from '@/componentHelper/SortingStepHelper';
import SortingStep from '@/sortingAlgorithms/SortingStep';
import { IAnimationControlModel } from '@/storeModels/Animation';
import { defineStore } from 'pinia';

const minSpeed = 4000;

export const useAnimationControlsStore = defineStore('animationControls', {
  state: () =>
    ({
      animationSpeed: 2000,
      animationStep: 0,
      paused: true,
      finished: false,
      helper: null,
      barXPlacement: 0,
      barSpacing: 0,
      barWidth: 0,
      maxBarHeight: 200,
    } as IAnimationControlModel),
  actions: {
    setAnimationSpeed(newSpeed: number) {
      this.animationSpeed = newSpeed;
    },
    resetStep() {
      this.animationStep = 0;
    },
    incrementStep() {
      if (this.helper && this.animationStep < this.helper.sortingSteps.length) this.animationStep++;
    },
    decrementStep() {
      if (this.animationStep > 0) this.animationStep--;
    },
    playStep(increment: boolean = true) {
      if (this.helper !== null && this.animationStep < this.helper.sortingSteps.length && this.animationStep >= 0) {
        this.helper.playStep(this.animationStep);
        this.disabled = false;

        if (increment) this.incrementStep();
        else this.decrementStep();
      }

      if (this.helper && this.animationStep >= this.helper.sortingSteps.length) {
        this.animationStep = this.helper.sortingSteps.length - 1;
        this.disabled = true;
        this.paused = true;
      }
    },
    setHelperBitsAndSteps(numberArray: number[], steps: SortingStep[]) {
      this.resetStep();
      this.barWidth = 700 / numberArray.length;
      this.barSpacing = 250 / numberArray.length;
      this.barXPlacement =
        (950 - (numberArray.length * this.barWidth + (numberArray.length - 1) * this.barSpacing)) / 2;

      this.helper = new SortingHelper(this.barXPlacement, this.barWidth, this.barSpacing, numberArray);
      this.helper.sortingSteps = steps;
    },
  },
  getters: {
    getMinSpeed() {
      return minSpeed;
    },
  },
});
