open Ley_Function;

type t('a) = option('a);

include (
          Ley_Functor.Make({
            type nonrec t('a) = t('a);

            let fmap = (f, mx) =>
              switch (mx) {
              | Some(x) => x->f->Some
              | None => None
              };
          }):
            Ley_Functor.T with type t('a) := t('a)
        );

include (
          Ley_Applicative.Make({
            type nonrec t('a) = t('a);

            let pure = x => Some(x);

            let fmap = fmap;

            let ap = (mf, mx) =>
              switch (mf) {
              | Some(f) => fmap(f, mx)
              | None => None
              };
          }):
            Ley_Applicative.T with type t('a) := t('a)
        );

include (
          Ley_Applicative.Alternative.Make({
            type nonrec t('a) = t('a);

            let empty = None;

            let alt = (mx, my) =>
              switch (mx) {
              | None => my
              | x => x
              };
          }):
            Ley_Applicative.Alternative.T with type t('a) := t('a)
        );

include (
          Ley_Monad.Make({
            type nonrec t('a) = t('a);

            let pure = pure;

            let fmap = fmap;

            let bind = (f, mx) =>
              switch (mx) {
              | Some(x) => f(x)
              | None => None
              };
          }):
            Ley_Monad.T with type t('a) := t('a)
        );

include (
          Ley_Foldable.Make({
            type nonrec t('a) = t('a);

            let foldr = (f, init, mx) =>
              switch (mx) {
              | Some(x) => f(x, init)
              | None => init
              };

            let foldl = (f, init, mx) =>
              switch (mx) {
              | Some(x) => f(init, x)
              | None => init
              };
          }):
            Ley_Foldable.T with type t('a) := t('a)
        );

let sappend = (mxs, mys) =>
  switch (mxs) {
  | Some(xs) =>
    switch (mys) {
    | Some(ys) => Some(List.append(xs, ys))
    | None => mxs
    }
  | None => mxs
  };

let isSome = m =>
  switch (m) {
  | Some(_) => true
  | None => false
  };

let isNone = m =>
  switch (m) {
  | Some(_) => false
  | None => true
  };

let fromSome =
  fun
  | Some(x) => x
  | None => invalid_arg("Cannot unwrap None.");

let fromOption = (def, mx) =>
  switch (mx) {
  | Some(x) => x
  | None => def
  };

let option = (def, f, mx) =>
  switch (mx) {
  | Some(x) => f(x)
  | None => def
  };

let listToOption = xs =>
  switch (xs) {
  | [x, ..._] => Some(x)
  | [] => None
  };

let optionToList = toList;

let catOptions = xs =>
  List.fold_right(option(id, (x, xs) => [x, ...xs]), xs, []);

let mapOption = (f, xs) =>
  List.fold_right(x => x |> f |> option(id, (x, xs) => [x, ...xs]), xs, []);

let ensure = (pred, x) => pred(x) ? Some(x) : None;

let rec imapOptionAux = (f, index, xs) =>
  switch (xs) {
  | [] => []
  | [x, ...xs] =>
    switch (f(index, x)) {
    | Some(y) => [y, ...imapOptionAux(f, index + 1, xs)]
    | None => imapOptionAux(f, index + 1, xs)
    }
  };

let imapOption = (f, xs) => imapOptionAux(f, 0, xs);

let liftDef = (f, x) =>
  switch (f(x)) {
  | Some(y) => y
  | None => x
  };

module Infix = {
  include (
            Ley_Functor.MakeInfix({
              type nonrec t('a) = t('a);

              let fmap = fmap;
            }):
              Ley_Functor.Infix with type t('a) := t('a)
          );

  include (
            Ley_Applicative.MakeInfix({
              type nonrec t('a) = t('a);

              let pure = x => Some(x);

              let fmap = (<$>);

              let ap = (mf, mx) =>
                switch (mf) {
                | Some(f) => f <$> mx
                | None => None
                };
            }):
              Ley_Applicative.Infix with type t('a) := t('a)
          );

  include (
            Ley_Applicative.Alternative.MakeInfix({
              type nonrec t('a) = t('a);

              let empty = None;

              let alt = (mx, my) =>
                switch (mx) {
                | None => my
                | x => x
                };
            }):
              Ley_Applicative.Alternative.Infix with type t('a) := t('a)
          );

  include (
            Ley_Monad.MakeInfix({
              type nonrec t('a) = t('a);

              let pure = pure;

              let fmap = fmap;

              let bind = (f, mx) =>
                switch (mx) {
                | Some(x) => f(x)
                | None => None
                };
            }):
              Ley_Monad.Infix with type t('a) := t('a)
          );
};
