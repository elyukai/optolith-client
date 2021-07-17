(** Node.js bindings. *)

module Fs = struct
  module Promises = struct
    external access : string -> unit Js.Promise.t = "access"
      [@@bs.module "fs"] [@@bs.scope "promises"]
    (** [access path] tests a user's permissions for the file or directory
        specified by [path]. *)

    external copy_file : src:string -> dest:string -> unit Js.Promise.t
      = "copyFile"
      [@@bs.module "fs"] [@@bs.scope "promises"]
    (** [copy_file ~src ~dest] asynchronously copies [src] to [dest]. By
        default, [dest] is overwritten if it already exists. *)

    external mkdir : string -> unit Js.Promise.t = "mkdir"
      [@@bs.module "fs"] [@@bs.scope "promises"]
    (** [mkdir path] asynchronously creates a directory at [path]. *)

    external readdir : string -> string array Js.Promise.t = "readdir"
      [@@bs.module "fs"] [@@bs.scope "promises"]
    (** [readdir path] reads the contents of a directory at a specified [path].
        *)

    external read_file :
      string -> ([ `utf8 [@bs.as "utf-8"] ][@bs.string]) -> string Js.Promise.t
      = "readFile"
      [@@bs.module "fs"] [@@bs.scope "promises"]
    (** [read_file path encoding] asynchronously reads the entire contents of a
        file at the given [path] using the specified [encoding]. *)

    external rename : old_path:string -> new_path:string -> unit Js.Promise.t
      = "rename"
      [@@bs.module "fs"] [@@bs.scope "promises"]
    (** [rename ~old_path ~new_path] renames [old_path] to [new_path]. *)

    external rm : string -> unit Js.Promise.t = "rm"
      [@@bs.module "fs"] [@@bs.scope "promises"]
    (** [rm path] removes files and directories (modeled on the standard POSIX
        [rm] utility). *)

    type rm_options

    external rm_options : ?force:bool -> ?recursive:bool -> unit -> rm_options
      = ""
      [@@bs.obj]

    external rm' : string -> rm_options -> unit Js.Promise.t = "rm"
      [@@bs.module "fs"] [@@bs.scope "promises"]
    (** [rm path] removes files and directories (modeled on the standard POSIX
        [rm] utility). *)

    external unlink : string -> unit Js.Promise.t = "unlink"
      [@@bs.module "fs"] [@@bs.scope "promises"]
    (** [unlink path] deletes the file at the specified [path]. *)

    external write_file :
      path:string ->
      data:string ->
      ([ `utf8 [@bs.as "utf-8"] ][@bs.string]) ->
      unit Js.Promise.t = "writeFile"
      [@@bs.module "fs"] [@@bs.scope "promises"]
    (** [write_file ~path ~data encoding] asynchronously writes data to a file,
        replacing the file if it already exists. *)
  end
end

module Path = struct
  external join : string array -> string = "join"
    [@@bs.module "path"] [@@bs.variadic]
  (** [join segments] joins all given path segments together using the
      platform-specific separator as a delimiter, then normalizes the resulting
      path.

      Zero-length [path] segments are ignored. If the joined path string is a
      zero-length string then ["."] will be returned, representing the current
      working directory. *)

  external join2 : string -> string -> string = "join"
    [@@bs.module "path"]
  (** [join segment1 segment2] joins all given path segments together using the
      platform-specific separator as a delimiter, then normalizes the resulting
      path.

      Zero-length [path] segments are ignored. If the joined path string is a
      zero-length string then ["."] will be returned, representing the current
      working directory. *)
end

module Url = struct
  type t

  external path_to_file_url : string -> t = "pathToFileURL"
    [@@bs.module "url"]
  (** [unlink path] deletes the file at the specified [path]. *)

  external href : t -> string = "href" [@@bs.get]
end

module WorkerThreads = struct
  module MessagePort = struct
    type t
    (** Instances of the [MessagePort.t] class represent one end of an
        asynchronous, two-way communications channel. It can be used to transfer
        structured data, memory regions and other [MessagePort.t]s between
        different Workers. *)

    external post_message : t -> 'a -> unit = "postMessage"
      [@@bs.send]
    (** [post_message port value] sends a JavaScript value to the receiving side
        of this channel. [value] is transferred in a way which is compatible
        with the {{:https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm}HTML structured clone algorithm}.
        *)
  end

  module Worker = struct
    type t
    (** The [Worker.t] class represents an independent JavaScript execution
        thread. Most Node.js APIs are available inside of it. *)

    external make : string -> t = "Worker"
      [@@bs.module "worker_threads"] [@@bs.new]
    (** [make filename] creates a new [Worker.t] from the passed script or
        module path. *)

    type options

    external options : ?workerData:'a -> options = "" [@@bs.obj]

    external make' : string -> options -> t = "Worker"
      [@@bs.module "worker_threads"] [@@bs.new]
    (** [make filename options] creates a new [Worker.t] from the passed script
        or module path using a set of options. *)

    external on :
      t ->
      ([ `error of exn -> unit
         (** The [`error] event is emitted if the worker thread throws an
             uncaught exception. In that case, the worker is terminated. *)
       | `exit of exit_code:int -> unit
         (** The [`exit] event is emitted once the worker has stopped. If the
             worker exited by calling [Process.exit], the [~exit_code] parameter
             is the passed exit code. If the worker was terminated, the
             [~exit_code] parameter is [1].

             This is the final event emitted by any [Worker.t] instance. *)
       | `message of 'a -> unit
         (** The [`message] event is emitted when the worker thread has invoked
             [MessagePort.postMessage parent_port]. See the
             [MessagePort.on `message] event for more details.

             All messages sent from the worker thread are emitted before the
             [`exit] event is emitted on the [Worker.t] object. *)
       | `messageerror of exn -> unit
         (** The [`messageerror] event is emitted when deserializing a message
             failed. *)
       | `online of unit -> unit
         (** The [`online] event is emitted when the worker thread has started
             executing JavaScript code. *)
       ]
      [@bs.string]) ->
      t = "on"
      [@@bs.send]

    external post_message : t -> 'a -> unit = "postMessage"
      [@@bs.send]
    (** [post_message worker value] sends a message to the worker that is
        received via [MessagePort.on parent_port `message]. See
        [MessagePort.post_message] for more details. *)
  end

  external is_main_thread : bool = "isMainThread"
    [@@bs.module "worker_threads"] [@@bs.val]
  (** [is_main_thread] is [true] if this code is not running inside of a
      [Worker.t] thread. *)

  external parent_port : MessagePort.t = "parentPort"
    [@@bs.module "worker_threads"] [@@bs.val]
  (** If this thread is a [Worker.t], [parent_port] is a [MessagePort.t]
      allowing communication with the parent thread. Messages sent using
      [MessagePort.post_message] are available in the parent thread using
      [Worker.on `message], and messages sent from the parent thread using
      [Worker.post_message] are available in this thread using
      [MessagePort.on `message]. *)

  external worker_data : 'a = "workerData"
    [@@bs.module "worker_threads"] [@@bs.val]
  (** An arbitrary JavaScript value that contains a clone of the data passed to
      this thread’s [Worker.make] constructor. *)
end
