declare module "pannellum";

interface PannellumViewer {
  destroy(): void;
  isLoading(): boolean;
  getYaw(): number;
  getPitch(): number;
  getHfov(): number;
}

interface PannellumConfig {
  type?: "equirectangular" | "cubemap" | "multires";
  panorama?: string;
  autoLoad?: boolean;
  autoRotate?: number;
  compass?: boolean;
  showZoomCtrl?: boolean;
  showFullscreenCtrl?: boolean;
  mouseZoom?: boolean;
  draggable?: boolean;
  disableKeyboardCtrl?: boolean;
  preview?: string;
  title?: string;
}

interface PannellumStatic {
  viewer(
    container: HTMLElement | string,
    config: PannellumConfig
  ): PannellumViewer;
}

interface Window {
  pannellum: PannellumStatic;
}
