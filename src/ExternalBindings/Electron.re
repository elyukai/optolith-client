module App = {
  type t;

  [@bs.module "electron"] external t: t = "app";

  /**
   * `setAppUserModelId id` changes the Application User Model ID to `id`.
   */
  [@bs.module "electron"] [@bs.scope "app"]
  external setAppUserModelId: string => unit = "setAppUserModelId";

  /**
   * The version of the loaded application. If no version is found in the
   * application's `package.json` file, the version of the current bundle or
   * executable is returned.
   */
  [@bs.module "electron"] [@bs.scope "app"]
  external getVersion: unit => string = "getVersion";

  /**
   * A path to a special directory or file associated with `name`. On failure,
   * an `Error` is thrown.
   *
   * If `app.getPath('logs')` is called without called `app.setAppLogsPath()`
   * being called first, a default log directory will be created equivalent to
   * calling `app.setAppLogsPath()` without a `path` parameter.
   */
  [@bs.module "electron"] [@bs.scope "app"]
  external getPath:
    (
    [@bs.string]
    [
      | `home
      | `appData
      | `userData
      | `cache
      | `temp
      | `exe
      | [@bs.as "module"] `module_
      | `desktop
      | `documents
      | `downloads
      | `music
      | `pictures
      | `videos
      | `recent
      | `logs
      | `pepperFlashSystemPlugin
      | `crashDumps
    ]
    ) =>
    string =
    "getPath";

  /**
   * Overrides the `path` to a special directory or file associated with `name`.
   * If the path specifies a directory that does not exist, an `Error` is
   * thrown. In that case, the directory should be created with `fs.mkdirSync`
   * or similar.
   *
   * You can only override paths of a `name` defined in `app.getPath`.
   *
   * By default, web pages' cookies and caches will be stored under the
   * `userData` directory. If you want to change this location, you have to
   * override the `userData` path before the `ready` event of the `app` module
   * is emitted.
   */
  [@bs.module "electron"] [@bs.scope "app"]
  external setPath:
    (
      [@bs.string] [
        | `home
        | `appData
        | `userData
        | `cache
        | `temp
        | `exe
        | [@bs.as "module"] `module_
        | `desktop
        | `documents
        | `downloads
        | `music
        | `pictures
        | `videos
        | `recent
        | `logs
        | `pepperFlashSystemPlugin
        | `crashDumps
      ],
      string
    ) =>
    unit =
    "setPath";

  /**
   * The current application directory.
   */
  [@bs.module "electron"] [@bs.scope "app"]
  external getAppPath: unit => string = "getAppPath";

  [@bs.send]
  external on:
    (
      t,
      [@bs.string] [
        | `ready(unit => unit)
        | [@bs.as "window-all-closed"] `windowAllClosed(unit => unit)
      ]
    ) =>
    unit =
    "on";

  let on = on(t);

  /**
   * A `Boolean` property that returns `true` if the app is packaged, `false`
   * otherwise. For many apps, this property can be used to distinguish
   * development and production environments.
   */
  [@bs.module "electron"] [@bs.scope "app"] [@bs.val]
  external isPackaged: bool = "isPackaged";

  [@bs.module "electron"] [@bs.scope "app"]
  external quit: unit => unit = "quit";

  /**
   * The current application locale. Possible return values are documented
   * [here](https://www.electronjs.org/docs/api/locales).
   *
   * To set the locale, you'll want to use a command line switch at app startup,
   * which may be found here.
   *
   * **Note:** When distributing your packaged app, you have to also ship the
   * `locales` folder.
   *
   * **Note:** On Windows, you have to call it after the ready events gets
   * emitted.
   */
  [@bs.module "electron"] [@bs.scope "app"]
  external getLocale: unit => string = "getLocale";
};

module BrowserWindow = {
  type t;

  type webPreferences = {
    nodeIntegration: bool,
    enableRemoteModule: bool,
  };

  type options = {
    width: int,
    height: int,
    x: int,
    y: int,
    minWidth: int,
    minHeight: int,
    center: bool,
    resizable: bool,
    title: string,
    icon: string,
    show: bool,
    frame: bool,
    acceptFirstMouse: bool,
    backgroundColor: string,
    webPreferences,
  };

  [@bs.module "electron"] [@bs.new]
  external create: options => t = "BrowserWindow";

  /**
   * the promise will resolve when the page has finished loading (see
   * `did-finish-load`), and rejects if the page fails to load (see
   * `did-fail-load`).
   *
   * Same as `webContents.loadURL(url[, options])`.
   *
   * The `url` can be a remote address (e.g. `http://`) or a path to a local
   * HTML file using the `file://` protocol.
   *
   * To ensure that file URLs are properly formatted, it is recommended to use
   * Node's `url.format` method.
   */
  [@bs.send]
  external loadUrl: (t, string) => IO.t(unit) = "loadURL";

  /**
   * Shows and gives focus to the window.
   */
  [@bs.send]
  external show: t => unit = "show";

  /**
   * Maximizes the window. This will also show (but not focus) the window if it
   * isn't being displayed already.
   */
  [@bs.send]
  external maximize: t => unit = "maximize";

  module WebContents = {
    [@bs.send] [@bs.scope "webContents"]
    external openDevTools: t => unit = "openDevTools";
  };
};

module IpcMain = {
  type t;

  [@bs.module "electron"] external t: t = "ipcMain";
};

module IpcRenderer = {
  type t;

  [@bs.module "electron"] external t: t = "ipcRenderer";
};

module WebFrame = {
  /**
   * Changes the zoom factor to the specified factor. Zoom factor is zoom
   * percent divided by 100, so 300% = 3.0.
   *
   * The factor must be greater than 0.0.
   */
  [@bs.module "electron"] [@bs.scope "webFrame"]
  external setZoomFactor: float => unit = "setZoomFactor";

  /**
   * Sets the maximum and minimum pinch-to-zoom level.
   *
   * **Note:** Visual zoom is disabled by default in Electron.
   */
  [@bs.module "electron"] [@bs.scope "webFrame"]
  external setVisualZoomLevelLimits: (float, float) => unit =
    "setVisualZoomLevelLimits";
};
