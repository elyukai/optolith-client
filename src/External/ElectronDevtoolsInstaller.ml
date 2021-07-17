(** [electron-devtools-installer] package bindings *)

type id

external reactDeveloperTools : id = "REACT_DEVELOPER_TOOLS"
  [@@bs.module "electron-devtools-installer"] [@@bs.val]

external reduxDevtools : id = "REDUX_DEVTOOLS"
  [@@bs.module "electron-devtools-installer"] [@@bs.val]

external install : id -> string Js.Promise.t = "default"
  [@@bs.module "electron-devtools-installer"]
(** Installs a Chromium DevTools extension using the given ChromeStore ID. *)

external install' : id array -> string Js.Promise.t = "default"
  [@@bs.module "electron-devtools-installer"]
(** Installs multiple Chromium DevTools extensions using the given ChromeStore
    IDs. *)
