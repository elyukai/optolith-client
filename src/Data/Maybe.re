open Function;

type t('a) =
  | Just('a)
  | Nothing;

type maybe('a) = t('a);

module Functor = {
  let (<$>) = (f, mx) =>
    switch (mx) {
    | Just(x) => x->f->Just
    | Nothing => Nothing
    };

  let (<&>) = (mx, f) => f <$> mx;
};

module Applicative = {
  open Functor;

  let (<*>) = (mf, mx) =>
    switch (mf) {
    | Just(f) => f <$> mx
    | Nothing => Nothing
    };
};

module Alternative = {
  let (<|>) = (mx, my) =>
    switch (mx) {
    | Nothing => my
    | x => x
    };

  let guard = pred => pred ? Just() : Nothing;
};

module Monad = {
  open Functor;

  let (>>=) = (mx, f) =>
    switch (mx) {
    | Just(x) => f(x)
    | Nothing => Nothing
    };

  let (=<<) = (f, mx) => mx >>= f;

  let (>>) = (x, y) => x >>= const(y);

  let (>=>) = (f, g, x) => x->f >>= g;

  let join = x => x >>= id;

  let liftM2 = (f, mx, my) => mx >>= (x => f(x) <$> my);

  let liftM3 = (f, mx, my, mz) => mx >>= (x => my >>= (y => f(x, y) <$> mz));

  let liftM4 = (f, mx, my, mz, ma) =>
    mx >>= (x => my >>= (y => mz >>= (z => f(x, y, z) <$> ma)));
};

module Foldable = {
  let foldr = (f, init, mx) =>
    switch (mx) {
    | Just(x) => f(x, init)
    | Nothing => init
    };

  let foldl = (f, init, mx) =>
    switch (mx) {
    | Just(x) => f(init, x)
    | Nothing => init
    };

  let toList = mx =>
    switch (mx) {
    | Just(x) => [x]
    | Nothing => []
    };

  let length = mx =>
    switch (mx) {
    | Just(_) => 1
    | Nothing => 0
    };

  let elem = (e, mx) =>
    switch (mx) {
    | Just(x) => e === x
    | Nothing => false
    };

  let sum = mx =>
    switch (mx) {
    | Just(x) => x
    | Nothing => 0
    };

  let product = mx =>
    switch (mx) {
    | Just(x) => x
    | Nothing => 1
    };

  let concat = mxs =>
    switch (mxs) {
    | Just(xs) => xs
    | Nothing => []
    };

  let concatMap = (f, mx) =>
    switch (mx) {
    | Just(x) => f(x)
    | Nothing => []
    };

  let con = mx =>
    switch (mx) {
    | Just(x) => x
    | Nothing => true
    };

  let dis = mx =>
    switch (mx) {
    | Just(x) => x
    | Nothing => false
    };

  let any = (pred, mx) =>
    switch (mx) {
    | Just(x) => pred(x)
    | Nothing => false
    };

  let all = (pred, mx) =>
    switch (mx) {
    | Just(x) => pred(x)
    | Nothing => true
    };

  let notElem = (e, mx) => !elem(e, mx);

  let find = (pred, mx) =>
    switch (mx) {
    | Just(x) => pred(x) ? Just(x) : Nothing
    | Nothing => Nothing
    };
};

module Semigroup = {
  let sappend = (mxs, mys) =>
    switch (mxs) {
    | Just(xs) =>
      switch (mys) {
      | Just(ys) => Just(List.append(xs, ys))
      | Nothing => Nothing
      }
    | Nothing => Nothing
    };
};

let isJust = m =>
  switch (m) {
  | Just(_) => true
  | Nothing => false
  };

let isNothing = m =>
  switch (m) {
  | Just(_) => false
  | Nothing => true
  };

let fromMaybe = (def, mx) =>
  switch (mx) {
  | Just(x) => x
  | Nothing => def
  };

let maybe = (def, f, mx) =>
  switch (mx) {
  | Just(x) => f(x)
  | Nothing => def
  };

let listToMaybe = xs =>
  switch (xs) {
  | [x, ..._] => Just(x)
  | [] => Nothing
  };

let maybeToList = Foldable.toList;

let catMaybes = xs =>
  List.fold_right(maybe(id, (x, xs) => [x, ...xs]), xs, []);

let mapMaybe = (f, xs) =>
  List.fold_right(maybe(id, (x, xs) => [x, ...xs]) <- f, xs, []);

let maybeToOption = mx =>
  switch (mx) {
  | Just(x) => Some(x)
  | Nothing => None
  };

let optionToMaybe = mx =>
  switch (mx) {
  | Some(x) => Just(x)
  | None => Nothing
  };

let ensure = (pred, x) => pred(x) ? Just(x) : Nothing;
