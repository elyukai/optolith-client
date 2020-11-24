[@bs.val] external __dirname: string = "__dirname";

Electron.App.setAppUserModelId("lukasobermann.optolith");

/**
 * Set the `userData` path based on if a prerelease or a stable release is
 * running.
 */
let setDerivedUserDataPath = () => {
  Js.Console.log("main: Set user data path ...");

  let isPrerelease =
    Ley_Option.isNone(Semver.prerelease(Electron.App.getVersion()));

  Js.Console.log(isPrerelease);

  let userDataPath =
    Node.Path.join2(
      Electron.App.getPath(`appData),
      isPrerelease ? "Optolith Insider" : "Optolith",
    );
  Js.Console.log(userDataPath);

  IO.Infix.(
    userDataPath
    |> IO.existsFile
    >>= (exists => exists ? IO.return() : IO.mkdir(userDataPath))
    <&> (_ => Electron.App.setPath(`userData, userDataPath))
  );
};

let installDevelopmentExtensions = () => {
  open IO.Infix;

  Js.Console.log("main: Install extensions ...");

  ElectronDevtoolsInstaller.install([|
    ElectronDevtoolsInstaller.reactDeveloperTools,
    ElectronDevtoolsInstaller.reduxDevtools,
  |])
  <&> (
    installedExtensions => {
      Js.Console.log("main: Installed extensions: " ++ installedExtensions);
    }
  );
};

/**
 * Create and show the main application window.
 */
let createWindow = () => {
  Js.Console.log("main: Create Window ...");

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

        mainWindow;
      }
    )
  );
};

let initializeData = mainWindow => {
  Js.Console.timeStart("parseStaticData");

  IO.Infix.(
    Init.getInitialData(
      ~onMinimalDataReceived=
        (~supportedLanguages, ~localeOrder, ~config, ~uiMessages) => {
          mainWindow->Ipc.FromMain.send(
            InitMinimal(supportedLanguages, localeOrder, config, uiMessages),
          )
        },
      ~initWorkerPath=Node.Path.join2(__dirname, "initWorker.js"),
      ~onProgress=
        progress => mainWindow->Ipc.FromMain.send(InitProgress(progress)),
    )
    <&> (
      staticData => {
        Js.Console.timeEnd("parseStaticData");

        mainWindow->Ipc.FromMain.send(InitDone(staticData));
      }
    )
  );
};

let main = () => {
  IO.Infix.(
    setDerivedUserDataPath()
    >>= installDevelopmentExtensions
    >>= createWindow
    >>= (
      mainWindow =>
        initializeData(mainWindow)
        <&> (
          _ => {
            AutoUpdates.listenAndRun(mainWindow);
            Electron.App.on(`windowAllClosed(() => {Electron.App.quit()}));
          }
        )
    )
    |> Js.Promise.catch(err => {
         Js.Console.error(err);
         IO.return();
       })
    |> ignore
  );
};

Electron.App.on(`ready(main));
