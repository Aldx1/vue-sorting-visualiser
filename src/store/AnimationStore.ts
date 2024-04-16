import { AnimationHelper } from '@/componentHelper/SortingStepHelper';
import SortingStep from '@/sortingAlgorithms/SortingStep';
import { IAnimationControlModel } from '@/storeModels/Animation';
import { defineStore } from 'pinia';

export const useAnimationControlsStore = defineStore('animationControls', {
  state: () =>
    ({
      barXPlacement: 0,
      barSpacing: 0,
      barWidth: 0,
      maxBarHeight: 350,
      animationSpeed: 500,
      animationDisplaySpeed: 500,
      animationStep: 0,
      play: false,
      _helper: null,
    } as IAnimationControlModel),
  actions: {
    setAnimationSpeed(newSpeed: number) {
      this.animationDisplaySpeed = newSpeed;
      this.animationSpeed = this.minSpeed - newSpeed;
    },
    resetStep() {
      this.animationStep = 0;
    },
    pause() {
      this.play = false;
    },
    resume() {
      if (this.canStepForward) this.play = true;
    },
    incrementStep() {
      if (this._helper && this.animationStep <= this._helper.sortingSteps.length - 1) this.animationStep++;
    },
    playForwardStep() {
      if (this.animationStep < 0) this.animationStep = 0;

      if (this.canStepForward) {
        this._helper?.playStep(this.animationStep);

        this.incrementStep();
      }
    },
    setHelperBitsAndSteps(numberArray: number[], steps: SortingStep[], sortingAlgorithm: string) {
      this.resetStep();
      this.setMaxBarHeight(sortingAlgorithm);
      const arrayLength = numberArray.length;
      this.barWidth = 700 / arrayLength;
      this.barSpacing = 250 / arrayLength;
      this.barXPlacement = (950 - (arrayLength * this.barWidth + (arrayLength - 1) * this.barSpacing)) / 2;

      this._helper = new AnimationHelper(
        this.barXPlacement,
        this.barWidth,
        this.barSpacing,
        numberArray,
        sortingAlgorithm,
        steps
      );
    },
    setMaxBarHeight(algorithm: string): void {
      if (algorithm && algorithm.toLowerCase() == 'merge') this.maxBarHeight = 150;
      else this.maxBarHeight = 225;
    },
  },
  getters: {
    canStepForward(): boolean {
      return this._helper != null && this.animationStep <= this._helper.sortingSteps.length - 1;
    },
    minSpeed(): number {
      return 1000 - 50;
    },
  },
});
