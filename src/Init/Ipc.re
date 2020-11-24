type messageFromMain =
  | InitMinimal(
      Ley_StrMap.t(Locale.Supported.t),
      Locale.order,
      AppConfig.t,
      Messages.t,
    )
  | InitProgress(InitProgress.t)
  | InitDone(Static.t)
  | UpdateNotAvailable
  | UpdateAvailable(ElectronUpdater.updateInfo)
  | DownloadProgress(ElectronUpdater.progressInfo)
  | AutoUpdaterError(Js.Exn.t);

type messageFromRenderer =
  | DownloadUpdate
  | CheckForUpdates;

module FromMain = {
  type message = messageFromMain;

  type event;

  [@bs.send] [@bs.scope "webContents"]
  external send:
    (Electron.BrowserWindow.t, [@bs.string] [ | `messageFromMain(message)]) =>
    unit =
    "send";

  /**
   * Send a message from the main process to the renderer process.
   */
  let send = (emitter, message) => send(emitter, `messageFromMain(message));

  [@bs.send]
  external addListener:
    (
      Electron.IpcRenderer.t,
      [@bs.string] [ | `messageFromMain((event, message) => unit)]
    ) =>
    unit =
    "addListener";

  /**
   * Listen to messages from the main process in the renderer process.
   */
  let addListener = (emitter, callback) =>
    addListener(emitter, `messageFromMain(callback));

  [@bs.send]
  external removeListener:
    (
      Electron.IpcRenderer.t,
      [@bs.string] [ | `messageFromMain((event, message) => unit)]
    ) =>
    unit =
    "removeListener";

  let removeListener = (emitter, callback) =>
    removeListener(emitter, `messageFromMain(callback));

  [@bs.send] [@bs.scope "sender"]
  external reply:
    (event, [@bs.string] [ | `messageFromRenderer(messageFromRenderer)]) =>
    unit =
    "send";

  /**
   * Reply to a message from the main process in the renderer process via the
   * passed event.
   */
  let reply = (emitter, message) =>
    reply(emitter, `messageFromRenderer(message));
};

module FromRenderer = {
  type message = messageFromRenderer;

  type event;

  [@bs.send]
  external send:
    (
      Electron.IpcRenderer.t,
      [@bs.string] [ | `messageFromRenderer(message)]
    ) =>
    unit =
    "send";

  /**
   * Send a message from the renderer process to the main process.
   */
  let send = (emitter, message) =>
    send(emitter, `messageFromRenderer(message));

  [@bs.send]
  external addListener:
    (
      Electron.IpcMain.t,
      [@bs.string] [ | `messageFromRenderer((event, message) => unit)]
    ) =>
    unit =
    "addListener";

  /**
   * Listen to messages from the renderer process in the main process.
   */
  let addListener = (emitter, callback) =>
    addListener(emitter, `messageFromRenderer(callback));

  [@bs.send]
  external removeListener:
    (
      Electron.IpcMain.t,
      [@bs.string] [ | `messageFromRenderer((event, message) => unit)]
    ) =>
    unit =
    "removeListener";

  let removeListener = (emitter, callback) =>
    removeListener(emitter, `messageFromRenderer(callback));

  [@bs.send] [@bs.scope "sender"]
  external reply:
    (event, [@bs.string] [ | `messageFromMain(messageFromMain)]) => unit =
    "send";

  /**
   * Reply to a message from the renderer process in the main process via the
   * passed event.
   */
  let reply = (emitter, message) =>
    reply(emitter, `messageFromMain(message));
};
