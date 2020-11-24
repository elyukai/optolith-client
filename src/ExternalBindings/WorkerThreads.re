[@bs.module "worker_threads"] [@bs.val]
external isMainThread: bool = "isMainThread";

module Outside = {
  type worker;

  [@bs.module "worker_threads"] [@bs.new]
  external create: string => worker = "Worker";

  type options('a) = {workerData: 'a};

  [@bs.module "worker_threads"] [@bs.new]
  external createWithOptions: (string, options('a)) => worker = "Worker";

  [@bs.send] external postMessage: (worker, 'a) => unit = "postMessage";

  [@bs.send]
  external on:
    (
      worker,
      [@bs.string] [
        | `online(unit => unit)
        | `message('a => unit)
        | `error(exn => unit)
        | `exit(int => unit)
      ]
    ) =>
    unit =
    "on";
};

module Inside = {
  type parentPort;

  [@bs.module "worker_threads"] [@bs.val]
  external parentPort: parentPort = "parentPort";

  [@bs.send] external postMessage: (parentPort, 'a) => unit = "postMessage";

  [@bs.module "worker_threads"] [@bs.val]
  external workerData: 'a = "workerData";
};
