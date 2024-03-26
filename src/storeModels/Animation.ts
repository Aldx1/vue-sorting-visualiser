import { SortingHelper } from '@/componentHelper/SortingStepHelper';
import SortingStep from '@/sortingAlgorithms/SortingStep';

export interface IAnimationControlModel {
  animationSpeed: number;
  animationStep: number;
  paused: boolean;
  finished: boolean;
  helper: SortingHelper | null;
  barXPlacement: number;
  barWidth: number;
  barSpacing: number;
  maxBarHeight: 200;
  disabled: boolean;
}
