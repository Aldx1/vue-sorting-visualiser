import { AnimationHelper } from '@/componentHelper/SortingStepHelper';

export interface IAnimationControlModel {
  barSpacing: number;
  barWidth: number;
  barXPlacement: number;
  maxBarHeight: number;

  animationDisplaySpeed: number;
  animationSpeed: number;
  animationStep: number;
  play: boolean;

  _helper: AnimationHelper | null;
}
