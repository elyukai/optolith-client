open Ley_Function;

[@genType]
[@genType.as "Option"]
type t('a) = option('a);

module Functor = {
  let (<$>) = (f, mx) =>
    switch (mx) {
    | Some(x) => x->f->Some
    | None => None
    };

  [@genType]
  let fmap = (<$>);

  let (<&>) = (mx, f) => f <$> mx;

  [@genType]
  let fmapF = (<&>);
};

module Applicative = {
  open Functor;

  let (<*>) = (mf, mx) =>
    switch (mf) {
    | Some(f) => f <$> mx
    | None => None
    };

  [@genType]
  let ap = (<*>);
};

module Alternative = {
  let (<|>) = (mx, my) =>
    switch (mx) {
    | None => my
    | x => x
    };

  [@genType]
  let alt = (<|>);

  [@genType]
  let guard = pred => pred ? Some() : None;
};

module Monad = {
  open Functor;

  [@genType]
  let return = x => Some(x);

  let (>>=) = (mx, f) =>
    switch (mx) {
    | Some(x) => f(x)
    | None => None
    };

  [@genType]
  let bind = (>>=);

  let (=<<) = (f, mx) => mx >>= f;

  [@genType]
  let bindF = (=<<);

  let (>>) = (x, y) => x >>= const(y);

  [@genType]
  [@genType.as "then"]
  let then_ = (>>);

  let (<<) = (x, y) => const(x) =<< y;

  [@genType]
  [@genType.as "thenF"]
  let thenF = (<<);

  [@genType]
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

  [@genType]
  let kleisli = (>=>);

  [@genType]
  let join = x => x >>= id;

  [@genType]
  let liftM2 = (f, mx, my) => mx >>= (x => f(x) <$> my);

  [@genType]
  let liftM3 = (f, mx, my, mz) => mx >>= (x => my >>= (y => f(x, y) <$> mz));

  [@genType]
  let liftM4 = (f, mx, my, mz, ma) =>
    mx >>= (x => my >>= (y => mz >>= (z => ma <&> f(x, y, z))));

  [@genType]
  let liftM5 = (f, mx, my, mz, ma, mb) =>
    mx
    >>= (x => my >>= (y => mz >>= (z => ma >>= (a => mb <&> f(x, y, z, a)))));
};

module Foldable = {
  [@genType]
  let foldr = (f, init, mx) =>
    switch (mx) {
    | Some(x) => f(x, init)
    | None => init
    };

  [@genType]
  let foldl = (f, init, mx) =>
    switch (mx) {
    | Some(x) => f(init, x)
    | None => init
    };

  [@genType]
  let toList = mx =>
    switch (mx) {
    | Some(x) => [x]
    | None => []
    };

  [@genType]
  [@genType.as "fnull"]
  let null =
    fun
    | None => true
    | Some(_) => false;

  [@genType]
  [@genType.as "flength"]
  let length = mx =>
    switch (mx) {
    | Some(_) => 1
    | None => 0
    };

  [@genType]
  let elem = (e, mx) =>
    switch (mx) {
    | Some(x) => e === x
    | None => false
    };

  [@genType]
  let sum = mx =>
    switch (mx) {
    | Some(x) => x
    | None => 0
    };

  [@genType]
  let product = mx =>
    switch (mx) {
    | Some(x) => x
    | None => 1
    };

  [@genType]
  let concat = mxs =>
    switch (mxs) {
    | Some(xs) => xs
    | None => []
    };

  [@genType]
  let concatMap = (f, mx) =>
    switch (mx) {
    | Some(x) => f(x)
    | None => []
    };

  [@genType]
  [@genType.as "and"]
  let con = mx =>
    switch (mx) {
    | Some(x) => x
    | None => true
    };

  [@genType]
  [@genType.as "or"]
  let dis = mx =>
    switch (mx) {
    | Some(x) => x
    | None => false
    };

  [@genType]
  let any = (pred, mx) =>
    switch (mx) {
    | Some(x) => pred(x)
    | None => false
    };

  [@genType]
  let all = (pred, mx) =>
    switch (mx) {
    | Some(x) => pred(x)
    | None => true
    };

  [@genType]
  let notElem = (e, mx) => !elem(e, mx);

  [@genType]
  let find = (pred, mx) =>
    switch (mx) {
    | Some(x) => pred(x) ? Some(x) : None
    | None => None
    };
};

module Semigroup = {
  [@genType]
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

[@genType]
let isSome = m =>
  switch (m) {
  | Some(_) => true
  | None => false
  };

[@genType]
let isNone = m =>
  switch (m) {
  | Some(_) => false
  | None => true
  };

[@genType]
let fromSome =
  fun
  | Some(x) => x
  | None => invalid_arg("Cannot unwrap None.");

[@genType]
let fromOption = (def, mx) =>
  switch (mx) {
  | Some(x) => x
  | None => def
  };

[@genType]
let option = (def, f, mx) =>
  switch (mx) {
  | Some(x) => f(x)
  | None => def
  };

[@genType]
let listToOption = xs =>
  switch (xs) {
  | [x, ..._] => Some(x)
  | [] => None
  };

[@genType]
let optionToList = Foldable.toList;

[@genType]
let catOptions = xs =>
  List.fold_right(option(id, (x, xs) => [x, ...xs]), xs, []);

[@genType]
let mapOption = (f, xs) =>
  List.fold_right(option(id, (x, xs) => [x, ...xs]) <- f, xs, []);

// [@genType]
// let maybeToOption = mx =>
//   switch (mx) {
//   | Some(x) => Some(x)
//   | None => None
//   };

// [@genType]
// let optionToMaybe = mx =>
//   switch (mx) {
//   | Some(x) => Some(x)
//   | None => None
//   };

[@genType]
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

[@genType]
let imapOption = (f, xs) => imapOptionAux(f, 0, xs);
