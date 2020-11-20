type t = {
  x: int,
  y: int,
  height: int,
  width: int,
  isMaximized: bool,
};

type options = {
  defaultHeight: int,
  defaultWidth: int,
  file: string,
};

/**
 * Returns an array of prerelease components, or `null` if none exist.
 */
[@bs.module "electron-window-state"]
external init: options => t = "default";

[@bs.send] external manage: (t, Electron.BrowserWindow.t) => unit = "manage";
