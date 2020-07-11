open Ley_Function;

type t('a) = option('a);

module Functor = {
  let (<$>) = (f, mx) =>
    switch (mx) {
    | Some(x) => x->f->Some
    | None => None
    };

  let fmap = (<$>);

  let (<&>) = (mx, f) => f <$> mx;
};

module Applicative = {
  open Functor;

  let (<*>) = (mf, mx) =>
    switch (mf) {
    | Some(f) => f <$> mx
    | None => None
    };

  let ap = (<*>);
};

module Alternative = {
  let (<|>) = (mx, my) =>
    switch (mx) {
    | None => my
    | x => x
    };

  let alt = (<|>);

  let guard = pred => pred ? Some() : None;
};

module Monad = {
  include Functor;

  let return = x => Some(x);

  let (>>=) = (mx, f) =>
    switch (mx) {
    | Some(x) => f(x)
    | None => None
    };

  let (=<<) = (f, mx) => mx >>= f;

  let (>>) = (x, y) => x >>= const(y);

  let (<<) = (x, y) => const(x) =<< y;

  let rec mapM = (f, xs) =>
    switch (xs) {
    | [] => Some([])
    | [x, ...ys] =>
      switch (f(x)) {
      | None => None
      | Some(z) => (zs => [z, ...zs]) <$> mapM(f, ys)
      }
    };

  let (>=>) = (f, g, x) => x |> f >>= g;

  let kleisli = (>=>);

  let join = x => x >>= id;

  let liftM2 = (f, mx, my) => mx >>= (x => f(x) <$> my);

  let liftM3 = (f, mx, my, mz) => mx >>= (x => my >>= (y => f(x, y) <$> mz));

  let liftM4 = (f, mx, my, mz, ma) =>
    mx >>= (x => my >>= (y => mz >>= (z => ma <&> f(x, y, z))));

  let liftM5 = (f, mx, my, mz, ma, mb) =>
    mx
    >>= (x => my >>= (y => mz >>= (z => ma >>= (a => mb <&> f(x, y, z, a)))));
};

module Foldable = {
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

  let toList = mx =>
    switch (mx) {
    | Some(x) => [x]
    | None => []
    };

  let null =
    fun
    | None => true
    | Some(_) => false;

  let length = mx =>
    switch (mx) {
    | Some(_) => 1
    | None => 0
    };

  let elem = (e, mx) =>
    switch (mx) {
    | Some(x) => e === x
    | None => false
    };

  let sum = mx =>
    switch (mx) {
    | Some(x) => x
    | None => 0
    };

  let product = mx =>
    switch (mx) {
    | Some(x) => x
    | None => 1
    };

  let concat = mxs =>
    switch (mxs) {
    | Some(xs) => xs
    | None => []
    };

  let concatMap = (f, mx) =>
    switch (mx) {
    | Some(x) => f(x)
    | None => []
    };

  let con = mx =>
    switch (mx) {
    | Some(x) => x
    | None => true
    };

  let dis = mx =>
    switch (mx) {
    | Some(x) => x
    | None => false
    };

  let any = (pred, mx) =>
    switch (mx) {
    | Some(x) => pred(x)
    | None => false
    };

  let all = (pred, mx) =>
    switch (mx) {
    | Some(x) => pred(x)
    | None => true
    };

  let notElem = (e, mx) => !elem(e, mx);

  let find = (pred, mx) =>
    switch (mx) {
    | Some(x) => pred(x) ? Some(x) : None
    | None => None
    };
};

module Semigroup = {
  let sappend = (mxs, mys) =>
    switch (mxs) {
    | Some(xs) =>
      switch (mys) {
      | Some(ys) => Some(List.append(xs, ys))
      | None => mxs
      }
    | None => mxs
    };
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

let optionToList = Foldable.toList;

let catOptions = xs =>
  List.fold_right(option(id, (x, xs) => [x, ...xs]), xs, []);

let mapOption = (f, xs) =>
  List.fold_right(option(id, (x, xs) => [x, ...xs]) <- f, xs, []);

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
