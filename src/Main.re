[@bs.val] external __dirname: string = "__dirname";

Electron.App.setAppUserModelId("lukasobermann.optolith");

/**
 * Set the `userData` path based on if a prerelease or a stable release is
 * running.
 */
let setDerivedUserDataPath = () => {
  let isPrerelease =
    Ley_Option.isNone(Semver.prerelease(Electron.App.getVersion()));

  let userDataPath =
    Node.Path.join2(
      Electron.App.getPath(`appData),
      isPrerelease ? "Optolith Insider" : "Optolith",
    );

  IO.Infix.(
    userDataPath
    |> IO.existsFile
    >>= (exists => exists ? IO.mkdir(userDataPath) : IO.return())
    <&> (_ => Electron.App.setPath(`userData, userDataPath))
  );
};

/**
 * Create and show the main application window.
 */
let createWindow = () => {
  Js.Console.log("main (window): Initialize window state keeper");

  let mainWindowState =
    ElectronWindowState.init({
      defaultHeight: 720,
      defaultWidth: 1280,
      file: "window.json",
    });

  Js.Console.log("main (window): Initialize browser window");

  let mainWindow =
    Electron.BrowserWindow.create({
      x: mainWindowState.x,
      y: mainWindowState.y,
      height: mainWindowState.height,
      width: mainWindowState.width,
      minHeight: 720,
      minWidth: 1280,
      resizable: true,
      icon: Node.Path.join([|Electron.App.getAppPath(), "src", "icon.png"|]),
      frame: false,
      center: true,
      title: "Optolith",
      acceptFirstMouse: true,
      backgroundColor: "#111111",
      show: false,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
      },
    });

  Js.Console.log("main (window): Manage browser window with state keeper");

  ElectronWindowState.manage(mainWindowState, mainWindow);

  Js.Console.log("main (window): Load url");

  IO.Infix.(
    mainWindow->Electron.BrowserWindow.loadUrl(
      Url.formatObject(
        Url.urlObject(
          ~pathname=Node.Path.join2(__dirname, "index.html"),
          ~protocol="file:",
          ~slashes=true,
          (),
        ),
      ),
    )
    <&> (
      _ => {
        // Electron.BrowserWindow.WebContents.openDevTools(mainWindow);

        Js.Console.log("main (window): Show window");

        Electron.BrowserWindow.show(mainWindow);

        if (mainWindowState.isMaximized) {
          Js.Console.log("main (window): Maximize window ...");

          Electron.BrowserWindow.maximize(mainWindow);
        };

        Electron.IpcMain.addListener(
          `loadingDone(
            () => {
              let cancellationToken:
                ref(option(ElectronUpdater.cancellationToken)) =
                ref(None);

              if (CheckForUpdates.isUpdaterEnabled()) {
                Js.Console.log(
                  "main: Updater is enabled, check for updates ...",
                );

                ElectronUpdater.autoUpdater->ElectronUpdater.addListener(
                  `updateAvailable(
                    info => {
                      mainWindow
                      |> Electron.BrowserWindow.WebContents.send(
                           `updateAvailable(info),
                         );
                      ElectronUpdater.autoUpdater->ElectronUpdater.removeAllListenersOfEvent(
                        `updateNotAvailable,
                      );
                    },
                  ),
                );

                Electron.IpcMain.addListener(
                  `downloadUpdate(
                    () => {
                      ElectronUpdater.autoUpdater->ElectronUpdater.downloadUpdate(
                        cancellationToken.contents,
                      )
                    },
                  ),
                );

                Electron.IpcMain.addListener(
                  `checkForUpdates(
                    () => {
                      ElectronUpdater.autoUpdater->ElectronUpdater.checkForUpdates
                      <&> (
                        res => {
                          switch (res.cancellationToken) {
                          | None =>
                            mainWindow
                            |> Electron.BrowserWindow.WebContents.send(
                                 `updateNotAvailable(),
                               )
                          | Some(token) =>
                            cancellationToken := Some(token);

                            mainWindow
                            |> Electron.BrowserWindow.WebContents.send(
                                 `updateAvailable(res.updateInfo),
                               );
                          };
                        }
                      )
                      |> ignore
                    },
                  ),
                );

                ElectronUpdater.autoUpdater->ElectronUpdater.progress(
                  progressObj => {
                  mainWindow
                  |> Electron.BrowserWindow.WebContents.send(
                       `downloadProgress(progressObj),
                     )
                });

                ElectronUpdater.autoUpdater->ElectronUpdater.addListener(
                  `error(
                    err => {
                      mainWindow
                      |> Electron.BrowserWindow.WebContents.send(
                           `autoUpdaterError(err),
                         )
                    },
                  ),
                );

                ElectronUpdater.autoUpdater->ElectronUpdater.updateDownloaded(
                  () => {
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

                      mainWindow
                      |> Electron.BrowserWindow.WebContents.send(
                           `updateAvailable(res.updateInfo),
                         );
                    };
                  }
                )
                |> ignore;
              } else {
                Js.Console.log("main: Updater is not available");
              };
            },
          ),
        );
      }
    )
  );
};

let main = () => {
  ElectronUpdater.config.logger = ElectronLog.log;
  ElectronUpdater.loggerFileConfig.level = "info";
  ElectronUpdater.config.autoDownload = false;

  Js.Console.log("main: Set user data path ...");

  IO.Infix.(
    setDerivedUserDataPath()
    >>= (
      () =>
        {
          Js.Console.log("main: Install extensions ...");

          ElectronDevtoolsInstaller.install([|
            ElectronDevtoolsInstaller.reactDeveloperTools,
            ElectronDevtoolsInstaller.reduxDevtools,
          |]);
        }
        >>= (
          installedExtensions =>
            {
              Js.Console.log(
                "main: Installed extensions: " ++ installedExtensions,
              );

              Js.Console.log("main: Create Window ...");

              createWindow();
            }
            <&> (
              () => {
                Electron.App.on(
                  `windowAllClosed(() => {Electron.App.quit()}),
                );
              }
            )
        )
    )
  );
};
//
// app.on("ready") expects a callback that returns void and not a Promise
let mainVoid = () => {
  main()
  |> Js.Promise.catch(err => {
       Js.Console.error(err);
       IO.return();
     })
  |> ignore;
};

Electron.App.on(`ready(mainVoid));
