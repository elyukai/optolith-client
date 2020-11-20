type t;

type logger;

type cancellationToken;

type updateFileInfo = {url: string};

type releaseNoteInfo = {
  version: string,
  note: Js.Nullable.t(string),
};

type updateInfo = {
  version: string,
  files: array(updateFileInfo),
  releaseName: Js.Nullable.t(string),
  releaseNotes: Js.Nullable.t(string),
  releaseDate: string,
  stagingPercentage: option(int),
};

type updateCheckResult = {
  updateInfo,
  cancellationToken: option(cancellationToken),
};

[@bs.module "electron-updater"] [@bs.val]
external autoUpdater: t = "autoUpdater";

[@bs.send]
external checkForUpdates: t => IO.t(updateCheckResult) = "checkForUpdates";

[@bs.send]
external addListener:
  (
    t,
    [@bs.string] [
      | [@bs.as "update-available"] `updateAvailable(updateInfo => unit)
      | [@bs.as "update-not-available"] `updateNotAvailable(
          updateInfo => unit,
        )
      | `error(Js.Exn.t => unit)
    ]
  ) =>
  unit =
  "on";

[@bs.send] external removeAllListeners: t => unit = "removeAllListeners";

[@bs.send]
external removeAllListenersOfEvent:
  (
    t,
    [@bs.string] [
      | [@bs.as "update-available"] `updateAvailable
      | [@bs.as "update-not-available"] `updateNotAvailable
      | `error
    ]
  ) =>
  unit =
  "removeAllListeners";

[@bs.send]
external downloadUpdate: (t, option(cancellationToken)) => unit =
  "downloadUpdate";

type progressInfo = {
  total: int,
  delta: int,
  transferred: int,
  percent: int,
  bytesPerSecond: int,
};

[@bs.send] [@bs.scope "signals"]
external progress: (t, progressInfo => unit) => unit = "progress";

[@bs.send] [@bs.scope "signals"]
external updateDownloaded: (t, unit => unit) => unit = "updateDownloaded";

[@bs.send] external quitAndInstall: t => unit = "quitAndInstall";

type config = {
  mutable logger,
  mutable autoDownload: bool,
};

[@bs.module "electron-updater"] external config: config = "autoUpdater";

type loggerFileConfig = {mutable level: string};

[@bs.module "electron-updater"]
[@bs.scope ("autoUpdater", "logger", "transports")]
external loggerFileConfig: loggerFileConfig = "file";
