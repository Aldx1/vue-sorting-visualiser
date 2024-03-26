import { SortingHelper } from '@/componentHelper/SortingStepHelper';

export interface IAnimationControlModel {
  animationSpeed: number;
  animationStep: number;
  play: boolean;
  helper: SortingHelper | null;
  barXPlacement: number;
  barWidth: number;
  barSpacing: number;
  maxBarHeight: number;
}
