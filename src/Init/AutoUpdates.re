let isUpdaterEnabled = () => {
  switch (Os.platform()) {
  | `win32 => Electron.App.isPackaged
  | _ => false
  };
};

let listenAndRun = mainWindow => {
  open IO.Infix;

  ElectronUpdater.config.logger = ElectronLog.log;
  ElectronUpdater.loggerFileConfig.level = "info";
  ElectronUpdater.config.autoDownload = false;

  let cancellationToken: ref(option(ElectronUpdater.cancellationToken)) =
    ref(None);

  if (isUpdaterEnabled()) {
    Js.Console.log("main: Updater is enabled, check for updates ...");

    ElectronUpdater.autoUpdater->ElectronUpdater.addListener(
      `updateAvailable(
        info => {
          mainWindow->Ipc.FromMain.send(UpdateAvailable(info));
          ElectronUpdater.autoUpdater->ElectronUpdater.removeAllListenersOfEvent(
            `updateNotAvailable,
          );
        },
      ),
    );

    Electron.IpcMain.t->Ipc.FromRenderer.addListener(event =>
      fun
      | DownloadUpdate => {
          ElectronUpdater.autoUpdater->ElectronUpdater.downloadUpdate(
            cancellationToken.contents,
          );
        }
      | CheckForUpdates => {
          ElectronUpdater.autoUpdater->ElectronUpdater.checkForUpdates
          <&> (
            res => {
              switch (res.cancellationToken) {
              | None => event->Ipc.FromRenderer.reply(UpdateNotAvailable)
              | Some(token) =>
                cancellationToken := Some(token);

                event->Ipc.FromRenderer.reply(
                  UpdateAvailable(res.updateInfo),
                );
              };
            }
          )
          |> ignore;
        }
    );

    ElectronUpdater.autoUpdater->ElectronUpdater.progress(progressObj => {
      mainWindow->Ipc.FromMain.send(DownloadProgress(progressObj))
    });

    ElectronUpdater.autoUpdater->ElectronUpdater.addListener(
      `error(err => {mainWindow->Ipc.FromMain.send(AutoUpdaterError(err))}),
    );

    ElectronUpdater.autoUpdater->ElectronUpdater.updateDownloaded(() => {
      ElectronUpdater.autoUpdater->ElectronUpdater.quitAndInstall
    });

    ElectronUpdater.autoUpdater->ElectronUpdater.checkForUpdates
    <&> (
      res => {
        switch (res.cancellationToken) {
        | None => Js.Console.log("main: No update available")
        | Some(token) =>
          cancellationToken := Some(token);
          Js.Console.log("main: Update is available");

          mainWindow->Ipc.FromMain.send(UpdateAvailable(res.updateInfo));
        };
      }
    )
    |> ignore;
  } else {
    Js.Console.log("main: Updater is not available");
  };
};
