external __dirname : string = "__dirname" [@@bs.val]

(**
 * Set the `userData` path based on if a prerelease or a stable release is
 * running.
 *)
let setDerivedUserDataPath =
  let () = Js.Console.log "main: Set user data path ..." in

  let isPrerelease =
    Ley_Option.isNone (Semver.prerelease (Electron.App.getVersion ()))
  in

  let userDataPath =
    Node.Path.join2
      (Electron.App.getPath `appData)
      (if isPrerelease then "Optolith Insider" else "Optolith")
  in

  IO.Infix.(
    (userDataPath |> IO.existsFile >>= function
     | true -> IO.return ()
     | false -> IO.mkdir userDataPath)
    <&> fun _ ->
    let () = Electron.App.setPath `userData userDataPath in
    Js.Console.log ("main: User data path set to \"" ^ userDataPath ^ "\""))

let installDevelopmentExtensions () =
  IO.Infix.(
    let () = Js.Console.log "main: Install extensions ..." in

    ElectronDevtoolsInstaller.install
      [|
        ElectronDevtoolsInstaller.reactDeveloperTools;
        ElectronDevtoolsInstaller.reduxDevtools;
      |]
    <&> fun installedExtensions ->
    Js.Console.log ("main: Installed extensions: " ^ installedExtensions))

(**
 * Create and show the main application window.
 *)
let createWindow () =
  let () = Js.Console.log "main: Create Window ..." in

  let () = Js.Console.log "main (window): Initialize window state keeper" in

  let mainWindowState =
    ElectronWindowState.init
      { defaultHeight = 720; defaultWidth = 1280; file = "window.json" }
  in

  let () = Js.Console.log "main (window): Initialize browser window" in

  let mainWindow =
    Electron.BrowserWindow.create
      {
        x = mainWindowState.x;
        y = mainWindowState.y;
        height = mainWindowState.height;
        width = mainWindowState.width;
        minHeight = 720;
        minWidth = 1280;
        resizable = true;
        icon =
          Node.Path.join [| Electron.App.getAppPath (); "src"; "icon.png" |];
        frame = false;
        center = true;
        title = "Optolith";
        acceptFirstMouse = true;
        backgroundColor = "#111111";
        show = false;
        webPreferences = { nodeIntegration = true; enableRemoteModule = true };
      }
  in

  let () =
    Js.Console.log "main (window): Manage browser window with state keeper"
  in

  let () = ElectronWindowState.manage mainWindowState mainWindow in

  let () = Js.Console.log "main (window): Load url" in
  IO.Infix.(
    Electron.BrowserWindow.loadUrl mainWindow
      (Url.formatObject
         (Url.urlObject
            ~pathname:(Node.Path.join2 __dirname "index.html")
            ~protocol:"file:" ~slashes:true ()))
    <&> fun _ ->
    let () = Electron.BrowserWindow.WebContents.openDevTools mainWindow in

    let () = Js.Console.log "main (window): Show window" in

    let () = Electron.BrowserWindow.show mainWindow in

    if mainWindowState.isMaximized then
      let () = Js.Console.log "main (window): Maximize window ..." in

      let () = Electron.BrowserWindow.maximize mainWindow in
      mainWindow
    else mainWindow)

let initializeData mainWindow =
  let () = Js.Console.timeStart "parseStaticData" in

  IO.Infix.(
    Init.getInitialData
      ~onMinimalDataReceived:
        (fun ~supportedLanguages ~localeOrder ~config ~uiMessages ->
        Ipc.FromMain.send mainWindow
          (InitMinimal (supportedLanguages, localeOrder, config, uiMessages)))
      ~initWorkerPath:Node.Path.join2 __dirname "initWorker.js"
      ~onProgress:(fun progress ->
        Ipc.FromMain.send mainWindow (InitProgress progress))
    <&> fun staticData ->
    let () = Js.Console.timeEnd "parseStaticData" in

    mainWindow |> Ipc.FromMain.send (InitDone staticData))

let main () =
  IO.Infix.(
    setDerivedUserDataPath () >>= installDevelopmentExtensions >>= createWindow
    >>= (fun mainWindow ->
          initializeData mainWindow <&> fun _ ->
          let () = AutoUpdates.listenAndRun mainWindow in
          Electron.App.on (`windowAllClosed (fun () -> Electron.App.quit ())))
    |> Js.Promise.catch (fun err ->
           let () = Js.Console.error err in
           IO.return ())
    |> ignore)

let () =
  let () = Electron.App.setAppUserModelId "lukasobermann.optolith" in

  Electron.App.on (`ready main)
