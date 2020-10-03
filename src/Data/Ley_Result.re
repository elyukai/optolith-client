type t('l, 'r) = result('r, 'l);

module Extra = {
  /**
   * Return the contents of a `Error`-value or a default value otherwise.
   *
   * `fromError 1 (Error 3) == 3`
   * `fromError 1 (Ok "foo") == 1`
   */
  let fromError = (def, x) =>
    switch (x) {
    | Error(l) => l
    | Ok(_) => def
    };

  /**
   * Return the contents of a `Ok`-value or a default value otherwise.
   *
   * `fromOk 1 (Ok 3) == 3`
   * `fromOk 1 (Error "foo") == 1`
   */
  let fromOk = (def, x) =>
    switch (x) {
    | Error(_) => def
    | Ok(r) => r
    };

  /**
   * Pull the value out of an `Either` where both alternatives have the same type.
   *
   * `\x -> fromEither (Error x ) == x`
   * `\x -> fromEither (Ok x) == x`
   */
  let fromResult = x =>
    switch (x) {
    | Error(l) => l
    | Ok(r) => r
    };

  /**
   * `fromError' :: Either l r -> l`
   *
   * The `fromError'` function extracts the element out of a `Error` and throws
   * an error if its argument is `Ok`. Much like `fromJust`, using this function
   * in polished code is usually a bad idea.
   *
   * `\x -> fromError' (Error  x) == x`
   * `\x -> fromError' (Ok x) == undefined`
   *
   * @throws TypeError
   */
  let fromError' = x =>
    switch (x) {
    | Error(l) => l
    | Ok(_) =>
      invalid_arg("fromError': Cannot extract a Error value out of a Ok")
    };

  /**
   * `fromOk' :: Either l r -> r`
   *
   * The `fromOk'` function extracts the element out of a `Ok` and throws an
   * error if its argument is `Error`. Much like `fromJust`, using this function
   * in polished code is usually a bad idea.
   *
   * `\x -> fromOk' (Ok x) == x`
   * `\x -> fromOk' (Error  x) == undefined`
   *
   * @throws TypeError
   */
  let fromOk' = x =>
    switch (x) {
    | Error(_) =>
      invalid_arg("fromOk': Cannot extract a Ok value out of a Error")
    | Ok(r) => r
    };

  /**
   * `eitherToMaybe :: Either a b -> Maybe b`
   *
   * Given an `Either`, convert it to a `Maybe`, where `Error` becomes `Nothing`.
   *
   * `\x -> eitherToMaybe (Error x) == Nothing`
   * `\x -> eitherToMaybe (Ok x) == Just x`
   */
  let resultToOption = x =>
    switch (x) {
    | Error(_) => None
    | Ok(r) => Some(r)
    };

  /**
   * `maybeToEither :: a -> Maybe b -> Either a b`
   *
   * Given a `Maybe`, convert it to an `Either`, providing a suitable value for
   * the `Error` should the value be `Nothing`.
   *
   * `\a b -> maybeToEither a (Just b) == Ok b`
   * `\a -> maybeToEither a Nothing == Error a`
   */
  let optionToResult = (error, x) =>
    switch (x) {
    | None => Error(error)
    | Some(r) => Ok(r)
    };

  /**
   * `maybeToEither' :: (() -> a) -> Maybe b -> Either a b`
   *
   * Given a `Maybe`, convert it to an `Either`, providing a suitable value for
   * the `Error` should the value be `Nothing`.
   *
   * `\a b -> maybeToEither a (Just b) == Ok b`
   * `\a -> maybeToEither a Nothing == Error a`
   *
   * Lazy version of `maybeToEither`.
   */
  let optionToResult' = (error, x) =>
    switch (x) {
    | None => Error(error())
    | Some(r) => Ok(r)
    };
};

module Functor = {
  let (<$>) = (f, x) =>
    switch (x) {
    | Error(l) => Error(l)
    | Ok(r) => Ok(f(r))
    };

  let fmap = (<$>);
};

module Bifunctor = {
  let bimap = (fError, fOk, x) =>
    switch (x) {
    | Error(l) => Error(fError(l))
    | Ok(r) => Ok(fOk(r))
    };

  let first = (f, x) =>
    switch (x) {
    | Error(l) => Error(f(l))
    | Ok(r) => Ok(r)
    };

  let second = Functor.(<$>);
};

module Applicative = {
  open Functor;

  let (<*>) = (f, x) =>
    switch (f) {
    | Ok(r) => r <$> x
    | Error(l) => Error(l)
    };

  let ap = (<*>);
};

module Monad = {
  open Functor;
  open Ley_Function;

  let (>>=) = (x, f) =>
    switch (x) {
    | Ok(r) => f(r)
    | Error(l) => Error(l)
    };

  let (=<<) = (f, mx) => mx >>= f;

  let (>>) = (x, y) => x >>= const(y);

  let (>=>) = (f, g, x) => x->f >>= g;

  let join = x => x >>= id;

  let rec mapM = (f, xs) =>
    switch (xs) {
    | [] => Ok([])
    | [x, ...ys] =>
      switch (f(x)) {
      | Error(e) => Error(e)
      | Ok(z) => (zs => [z, ...zs]) <$> mapM(f, ys)
      }
    };

  let liftM2 = (f, mx, my) => mx >>= (x => f(x) <$> my);

  let liftM3 = (f, mx, my, mz) => mx >>= (x => my >>= (y => f(x, y) <$> mz));

  let liftM4 = (f, mx, my, mz, ma) =>
    mx >>= (x => my >>= (y => mz >>= (z => f(x, y, z) <$> ma)));
};

module Foldable = {
  let foldr = (f, init, mx) =>
    switch (mx) {
    | Ok(x) => f(x, init)
    | Error(_) => init
    };

  let foldl = (f, init, mx) =>
    switch (mx) {
    | Ok(x) => f(init, x)
    | Error(_) => init
    };

  let toList = mx =>
    switch (mx) {
    | Ok(x) => [x]
    | Error(_) => []
    };

  let null = mx =>
    switch (mx) {
    | Ok(_) => false
    | Error(_) => true
    };

  let length = mx =>
    switch (mx) {
    | Ok(_) => 1
    | Error(_) => 0
    };

  let elem = (e, mx) =>
    switch (mx) {
    | Ok(x) => e === x
    | Error(_) => false
    };

  let sum = mx =>
    switch (mx) {
    | Ok(x) => x
    | Error(_) => 0
    };

  let product = mx =>
    switch (mx) {
    | Ok(x) => x
    | Error(_) => 1
    };

  let concat = mxs =>
    switch (mxs) {
    | Ok(xs) => xs
    | Error(_) => []
    };

  let concatMap = (f, mx) =>
    switch (mx) {
    | Ok(x) => f(x)
    | Error(_) => []
    };

  let con = mx =>
    switch (mx) {
    | Ok(x) => x
    | Error(_) => true
    };

  let dis = mx =>
    switch (mx) {
    | Ok(x) => x
    | Error(_) => false
    };

  let any = (pred, mx) =>
    switch (mx) {
    | Ok(x) => pred(x)
    | Error(_) => false
    };

  let all = (pred, mx) =>
    switch (mx) {
    | Ok(x) => pred(x)
    | Error(_) => true
    };

  let notElem = (e, mx) => !elem(e, mx);

  let find = (pred, mx) =>
    switch (mx) {
    | Ok(x) => pred(x) ? Some(x) : None
    | Error(_) => None
    };
};

/**
 * Case analysis for the `Either` type. If the value is `Error a`, apply the
 * first function to `a` if it is `Ok b`, apply the second function to `b`.
 */
let result = (fError, fOk, x) =>
  switch (x) {
  | Error(l) => fError(l)
  | Ok(r) => fOk(r)
  };

/**
 * Extracts from a list of `Either` all the `Error` elements. All the `Error`
 * elements are extracted in order.
 */
let errors = xs =>
  Ley_List.foldr(
    (x, acc) =>
      switch (x) {
      | Error(l) => [l, ...acc]
      | Ok(_) => acc
      },
    [],
    xs,
  );

/**
 * Extracts from a list of `Either` all the `Ok` elements. All the `Ok`
 * elements are extracted in order.
 */
let oks = xs =>
  Ley_List.foldr(
    (x, acc) =>
      switch (x) {
      | Error(_) => acc
      | Ok(r) => [r, ...acc]
      },
    [],
    xs,
  );

/**
 * Partitions a list of `Either` into two lists. All the `Error` elements are
 * extracted, in order, to the first component of the output. Similarly the
 * `Ok` elements are extracted to the second component of the output.
 */
let partitionResults = xs =>
  Ley_List.foldr(
    (x, (ls, rs)) =>
      switch (x) {
      | Error(l) => ([l, ...ls], rs)
      | Ok(r) => (ls, [r, ...rs])
      },
    ([], []),
    xs,
  );

/**
 * Converts an `Error` into a `Ok` and a `Ok` into an `Error`.
 */
let swap =
  fun
  | Ok(x) => Error(x)
  | Error(x) => Ok(x);
