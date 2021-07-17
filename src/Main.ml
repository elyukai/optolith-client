external __dirname : string = "__dirname" [@@bs.val]

let install_devtools () =
  ElectronDevtoolsInstaller.(install' [| reactDeveloperTools; reduxDevtools |])

let make_window_state () =
  ElectronWindowState.(
    options ~defaultWidth:1280 ~defaultHeight:720 ~file:"window.json" () |> make)

let make_window (window_state : ElectronWindowState.t) =
  Electron.BrowserWindow.(
    let options =
      options
        ~title:Electron.App.(t |. get_name)
        ?x:window_state.x ?y:window_state.y ~width:window_state.width
        ~height:window_state.height ~minWidth:1280 ~minHeight:720 ~frame:false
        ~center:true ~acceptFirstMouse:true ~show:false ~resizable:true
        ~backgroundColor:"#111111"
        ~webPreferences:
          (web_preferences ~nodeIntegration:true ~contextIsolation:false ())
        ()
    in
    make ~options ())

let main () =
  let () = Electron.App.(t |. set_app_user_model_id "lukasobermann.optolith") in
  let window_state = make_window_state () in
  let window = make_window window_state in
  let () = window_state |. ElectronWindowState.manage window in
  install_devtools ()
  |> Js.Promise.then_ (fun _ ->
         window
         |. Electron.BrowserWindow.load_url
              Node.Url.(
                path_to_file_url (Node.Path.join2 __dirname "index.html")
                |> href))
  |> Js.Promise.then_ (fun _ ->
         let () = window |. Electron.BrowserWindow.show in
         let () =
           if Option.value ~default:false window_state.isMaximized then
             Electron.BrowserWindow.maximize window
           else ()
         in
         Js.Promise.resolve ())
  |> Js.Promise.then_ (fun _ ->
         DatabaseReader.Entities.read_files ~set_progress:(fun _progress -> ()))
  |> Js.Promise.then_ (fun raw_data ->
         Js.Promise.make (fun ~resolve ~reject ->
             Node.WorkerThreads.Worker.(
               make' "DatabaseWorker.bs.js" (options ~workerData:raw_data)
               |. on (`online (fun () -> ()))
               |. on (`message (fun msg -> (resolve msg [@bs])))
               |. on (`error (fun err -> (reject err [@bs])))
               |. on (`messageerror (fun err -> (reject err [@bs])))
               |. on (`exit (fun ~exit_code -> exit_code |> ignore))
               |> ignore)))
  |> Js.Promise.catch (fun err ->
         let () = Js.Console.error err in
         Js.Promise.resolve ())
  |> ignore

let () = Electron.App.(t |. on (`ready main) |> ignore)
