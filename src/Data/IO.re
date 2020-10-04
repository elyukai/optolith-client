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

include (
          Ley_Functor.Make({
            type nonrec t('a) = t('a);

            let fmap = (f, m) =>
              Js.Promise.then_(x => f(x) |> Js.Promise.resolve, m);
          }):
            Ley_Functor.T with type t('a) := t('a)
        );

include (
          Ley_Monad.Make({
            type nonrec t('a) = t('a);

            let pure = Js.Promise.resolve;

            let fmap = fmap;

            let bind = Js.Promise.then_;
          }):
            Ley_Monad.T with type t('a) := t('a)
        );

module Infix = {
  include (
            Ley_Functor.MakeInfix({
              type nonrec t('a) = t('a);

              let fmap = fmap;
            }):
              Ley_Functor.Infix with type t('a) := t('a)
          );

  include (
            Ley_Monad.MakeInfix({
              type nonrec t('a) = t('a);

              let pure = return;

              let fmap = fmap;

              let bind = Js.Promise.then_;
            }):
              Ley_Monad.Infix with type t('a) := t('a)
          );
};

let rec mapM = (f, xs) =>
  switch (xs) {
  | [] => return([])
  | [x, ...ys] =>
    Infix.(f(x) >>= (z => mapM(f, ys) <&> (zs => [z, ...zs])))
  };

let rec imapMAux = (i, f, xs) =>
  switch (xs) {
  | [] => return([])
  | [x, ...ys] =>
    Infix.(f(i, x) >>= (z => imapMAux(i + 1, f, ys) <&> (zs => [z, ...zs])))
  };

let imapM = (f, xs) => imapMAux(0, f, xs);

let rec imapOptionMAux = (i, f, xs) =>
  switch (xs) {
  | [] => return([])
  | [x, ...ys] =>
    Infix.(
      f(i, x)
      >>= (
        maybeZ =>
          imapOptionMAux(i + 1, f, ys)
          <&> (zs => Ley_Option.option(zs, z => [z, ...zs], maybeZ))
      )
    )
  };

let imapOptionM = (f, xs) => imapOptionMAux(0, f, xs);

type filePath = string;

let readFile = (path: filePath) => FileSystem.Promises.readFile(path, `utf8);

let writeFile = (path: filePath, data: string) =>
  FileSystem.Promises.writeFileString(path, data, `utf8);

let deleteFile = (path: filePath) => FileSystem.Promises.unlink(path);

let existsFile = (path: filePath) =>
  FileSystem.Promises.access(path)
  |> Js.Promise.then_(_ => return(true))
  |> Js.Promise.catch(_ => return(false));

let copyFile = (origin: filePath, dest: filePath) =>
  FileSystem.Promises.copyFile(origin, dest);
