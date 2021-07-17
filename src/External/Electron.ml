(** [electron] package bindings.

    To update types for IPC, you need to update the following functions:

    For messages to [renderer] process:
    - [WebContents.send]
    - [WebContents.reply]
    - [IpcRenderer.on]

    For messages to [main] process:
    - [IpcRenderer.send]
    - [WebContents.on]

    The limitations of ReScript
    *)

(** Control your application's event lifecycle. *)
module App = struct
  type t

  external t : t = "app" [@@bs.module "electron"]

  external on :
    t ->
    ([ `ready of unit -> unit
       (** Emitted once, when Electron has finished initializing. *) ]
    [@bs.string]) ->
    t = "on"
    [@@bs.send]

  external get_path :
    t ->
    [ `home  (** User's home directory. *)
    | `appData  (** Per-user application data directory. *)
    | `userData
      (** The directory for storing your app's configuration files, which by default it is the [`appData] directory appended with your app's name. *)
    | `cache
    | `temp  (** Temporary directory. *) ] ->
    string = "getPath"
    [@@bs.send]
  (** [t |. get_path name] returns a path to a special directory or file
      associated with [name]. On failure, an [Error] is thrown.

      If [app.getPath('logs')] is called without called [app.setAppLogsPath()]
      being called first, a default log directory will be created equivalent to
      calling [app.setAppLogsPath()] without a path parameter. *)

  external quit : t -> unit = "quit"
    [@@bs.send]
  (** Try to close all windows. The [before-quit] event will be emitted first.
      If all windows are successfully closed, the [will-quit] event will be
      emitted and by default the application will terminate.

      This method guarantees that all [beforeunload] and [unload] event handlers
      are correctly executed. It is possible that a window cancels the quitting
      by returning [false] in the [beforeunload] event handler. *)

  external get_app_path : t -> string = "getAppPath"
    [@@bs.send]
  (** The current application directory. *)

  external get_version : t -> string = "getVersion"
    [@@bs.send]
  (** The version of the loaded application. If no version is found in the
      application's [package.json] file, the version of the current bundle or
      executable is returned. *)

  external get_name : t -> string = "getName"
    [@@bs.send]
  (** The current application's name, which is the [name] in the application's
      [package.json] file.

      Usually the [name] field of [package.json] is a short lowercase name,
      according to the npm modules spec. You should usually also specify a
      [productName] field, which is your application's full capitalized name,
      and which will be preferred over [name] by Electron. *)

  external set_name : t -> string -> unit = "setName"
    [@@bs.send]
  (** Overrides the current application's name.

      {b Note:} This function overrides the name used internally by Electron; it
      does not affect the name that the OS uses. *)

  external get_locale : t -> string = "getLocale"
    [@@bs.send]
  (** The current application locale. Possible return values are documented
      {{:https://www.electronjs.org/docs/api/locales}here}.

      To set the locale, you'll want to use a command line switch at app
      startup, which may be found {{:https://github.com/electron/electron/blob/master/docs/api/command-line-switches.md}here}.

      {b Note}: When distributing your packaged app, you have to also ship the
      [locales] folder.

      {b Note}: On Windows, you have to call it after the [ready] events gets
      emitted. *)

  external set_app_user_model_id : t -> string -> unit = "setAppUserModelId"
    [@@bs.send]
  (** Changes the {{:https://msdn.microsoft.com/en-us/library/windows/desktop/dd378459(v=vs.85).aspx}
      Application User Model ID} to [id]. *)
end

(** Render and control web pages. *)
module WebContents = struct
  type t

  type event

  external on :
    t ->
    ([ `domready of event -> unit
       [@bs.as "dom-ready"]
       (** Emitted when the document in the given frame is loaded. *)
     | `x of unit -> unit ]
    [@bs.string]) ->
    t = "on"
    [@@bs.send]

  external send : t -> ([ `database_process of float ][@bs.string]) -> unit
    = "send"
    [@@bs.send]
  (** [send web_contents message] sends an asynchronous message to the renderer
      process via ["message"], along with arguments. Arguments will be
      serialized with the Structured Clone Algorithm, just like [postMessage],
      so prototype chains will not be included. Sending Functions, Promises,
      Symbols, WeakMaps, or WeakSets will throw an exception.

      The renderer process can handle the message by listening to channel with
      the [IpcRenderer] module. *)

  external reply : event -> ([ `database_process of float ][@bs.string]) -> unit
    = "reply"
    [@@bs.send]
  (** [reply ipc_main_event message] sends an IPC message to the renderer frame
      that sent the original message that you are currently handling. You should
      use this method to "reply" to the sent message in order to guarantee the
      reply will go to the correct process and frame. *)
end

(** Create and control browser windows. *)
module BrowserWindow = struct
  type t
  (** The browser window type. *)

  type web_preferences
  (** Settings of web page's features. *)

  external web_preferences :
    ?nodeIntegration:bool ->
    ?enableRemoteModule:bool ->
    ?contextIsolation:bool ->
    unit ->
    web_preferences = ""
    [@@bs.obj]
  (** Settings of web page's features. *)

  type options
  (** [BrowserWindow] options. *)

  external options :
    ?width:int ->
    ?height:int ->
    ?x:int ->
    ?y:int ->
    ?center:bool ->
    ?minWidth:int ->
    ?minHeight:int ->
    ?resizable:bool ->
    ?title:string ->
    ?icon:string ->
    ?show:bool ->
    ?frame:bool ->
    ?acceptFirstMouse:bool ->
    ?backgroundColor:string ->
    ?webPreferences:web_preferences ->
    unit ->
    options = ""
    [@@bs.obj]
  (** [BrowserWindow] options.

      @param width Window's width in pixels. Default is [800].
      @param height Window's height in pixels. Default is [600].
      @param x Window's left offset from screen. Default is to center the
      window. {b Required} if y is used.
      @param y Window's top offset from screen. Default is to center the window.
      {b Required} if x is used.
      @param center Show window in the center of the screen.
      @param minWidth Window's minimum width. Default is [0].
      @param minHeight Window's minimum height. Default is [0].
      @param resizable Whether window is resizable. Default is [true].
      @param title Default window title. Default is ["Electron"]. If the HTML
      tag [<title>] is defined in the HTML file loaded by [loadURL()], this
      property will be ignored.
      @param icon The window icon. On Windows it is recommended to use [ICO]
      icons to get best visual effects, you can also leave it undefined so the
      executable's icon will be used.
      @param show Whether window should be shown when created. Default is
      [true].
      @param frame Specify false to create a Frameless Window. Default is
      [true].
      @param acceptFirstMouse Whether the web view accepts a single mouse-down
      event that simultaneously activates the window. Default is [false].
      @param backgroundColor Window's background color as a hexadecimal value,
      like [#66CD00] or [#FFF] or [#80FFFFFF] (alpha in [#AARRGGBB] format is
      supported if [transparent] is set to [true]). Default is [#FFF] (white).
      @param webPreferences Settings of web page's features.
      *)

  external make : ?options:options -> unit -> t = "BrowserWindow"
    [@@bs.module "electron"] [@@bs.new]
  (** It creates a new [BrowserWindow] with native properties as set by the
  [options]. *)

  external show : t -> unit = "show"
    [@@bs.send]
  (** Shows and gives focus to the window. *)

  external maximize : t -> unit = "maximize"
    [@@bs.send]
  (** Maximizes the window. This will also show (but not focus) the window if it
      isn't being displayed already. *)

  external load_url : t -> string -> unit Js.Promise.t = "loadURL"
    [@@bs.send]
  (** [load_url url] returns a promise that will resolve when the page has
      finished loading (see [did-finish-load]), and rejects if the page fails to
      load (see [did-fail-load]).

      The [url] can be a remote address (e.g. [http://]) or a path to a local
      HTML file using the [file://] protocol.

      To ensure that file URLs are properly formatted, it is recommended to use
      Node's [url.format] method. *)
end

module IpcRenderer = struct
  type t

  external t : t = "ipcRenderer" [@@bs.module "electron"]

  type event

  external on :
    t -> ([ `database_process of event -> float -> unit ][@bs.string]) -> t
    = "on"
    [@@bs.send]

  external send : t -> ([ `x of unit ][@bs.string]) -> unit = "send"
    [@@bs.send]
  (** [send web_contents message] sends an asynchronous message to the renderer
      process via ["message"], along with arguments. Arguments will be
      serialized with the Structured Clone Algorithm, just like [postMessage],
      so prototype chains will not be included. Sending Functions, Promises,
      Symbols, WeakMaps, or WeakSets will throw an exception.

      The renderer process can handle the message by listening to channel with
      the [IpcRenderer] module. *)
end
