module FileSystem = {
  module Promises = {
    [@bs.module "fs"] [@bs.scope "promises"]
    external readFile:
      (string, [@bs.string] [ | [@bs.as "utf-8"] `utf8]) =>
      Js.Promise.t(string) =
      "readFile";

    [@bs.module "fs"] [@bs.scope "promises"]
    external writeFileString:
      (string, string, [@bs.string] [ | [@bs.as "utf-8"] `utf8]) =>
      Js.Promise.t(unit) =
      "writeFile";

    // [@bs.module "fs"] [@bs.scope "promises"]
    // external writeFileBuffer: (string, Node_buffer.t) => Js.Promise.t(unit) =
    //   "writeFile";

    [@bs.module "fs"] [@bs.scope "promises"]
    external unlink: string => Js.Promise.t(unit) = "unlink";

    [@bs.module "fs"] [@bs.scope "promises"]
    external access: string => Js.Promise.t(unit) = "access";

    // [@bs.module "fs"] [@bs.scope "promises"]
    // external accessWithMode:
    //   (
    //     string,
    //     [@bs.int] [
    //       | [@bs.as 0] `F_OK
    //       | [@bs.as 1] `X_OK
    //       | [@bs.as 2] `W_OK
    //       | [@bs.as 4] `R_OK
    //     ]
    //   ) =>
    //   Js.Promise.t(unit) =
    //   "access";

    [@bs.module "fs"] [@bs.scope "promises"]
    external copyFile: (string, string) => Js.Promise.t(unit) = "copyFile";
  };
};

type t('a) = Js.Promise.t('a);

type io('a) = t('a);

module Functor = {
  let (<$>) = (f, m) =>
    Js.Promise.then_(x => f(x) |> Js.Promise.resolve, m);

  let (<&>) = (m, f) => f <$> m;
};

module Monad = {
  let pure = Js.Promise.resolve;

  let (>>=) = (mx, f) => Js.Promise.then_(f, mx);

  let (=<<) = (f, mx) => mx >>= f;
};

type filePath = string;

let readFile = (path: filePath) => FileSystem.Promises.readFile(path, `utf8);

let writeFile = (path: filePath, data: string) =>
  FileSystem.Promises.writeFileString(path, data, `utf8);

let deleteFile = (path: filePath) => FileSystem.Promises.unlink(path);

let existsFile = (path: filePath) =>
  FileSystem.Promises.access(path)
  |> Js.Promise.then_(_ => Monad.pure(true))
  |> Js.Promise.catch(_ => Monad.pure(false));

let copyFile = (origin: filePath, dest: filePath) =>
  FileSystem.Promises.copyFile(origin, dest);
