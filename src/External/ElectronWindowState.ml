(** [electron-devtools-installer] package bindings *)

type t = {
  x : int option;
      (** The saved [x] coordinate of the loaded state. [None] if the state has
          not been saved yet. *)
  y : int option;
      (** The saved [y] coordinate of the loaded state. [None] if the state has
          not been saved yet. *)
  width : int;
      (** The saved [width] of loaded state. [defaultWidth] if the state has not
          been saved yet. *)
  height : int;
      (** The saved [heigth] of loaded state. [defaultHeight] if the state has
          not been saved yet. *)
  isMaximized : bool option;
      (** [Some true] if the window state was saved while the window was
          maximized. [None] if the state has not been saved yet. *)
  isFullScreen : bool option;
      (** [Some true] if the window state was saved while the window was in full
          screen mode. [None] if the state has not been saved yet. *)
}

type options

external options :
  ?defaultWidth:int ->
  ?defaultHeight:int ->
  ?path:string ->
  ?file:string ->
  ?maximize:bool ->
  ?fullScreen:bool ->
  unit ->
  options = ""
  [@@bs.obj]

external make : options -> t = "electron-window-state"
  [@@bs.module]
(**
 * Returns an array of prerelease components, or `null` if none exist.
 *)

external manage : t -> Electron.BrowserWindow.t -> unit = "manage"
  [@@bs.send]
(** Register listeners on the given [BrowserWindow] for events that are related
    to size or position changes ([resize], [move]). It will also restore the
    window's maximized or full screen state. When the window is closed we
    automatically remove the listeners and save the state. *)

external unmanage : t -> unit = "unmanage"
  [@@bs.send]
(** Removes all listeners of the managed [BrowserWindow] in case it does not
    need to be managed anymore. *)

external save_state : t -> Electron.BrowserWindow.t -> unit = "saveState"
  [@@bs.send]
(** Saves the current state of the given [BrowserWindow]. This exists mostly for
    legacy purposes, and in most cases it's better to just use [manage]. *)
