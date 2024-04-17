import { defineStore } from 'pinia';

export const useWindowSizeStore = defineStore('windowSize', {
  state: () => ({
    windowWidth: 0,
    windowHeight: 0,
  }),
  actions: {
    setWindowWidth(newWidth: number) {
      this.windowWidth = newWidth;
    },
    setWindowHeight(newHeight: number) {
      this.windowHeight = newHeight;
    },
  },
  getters: {
    isLandscape(): boolean {
      return this.windowHeight < this.windowWidth;
    },
    isMobile(): boolean {
      return !this.isLandscape && this.windowWidth / this.windowHeight < 0.65;
    },
    isWidescreen(): boolean {
      return this.isLandscape && this.windowWidth / this.windowHeight > 1.5;
    },
  },
});
