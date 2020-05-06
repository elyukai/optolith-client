[@genType "Either"]
type t('l, 'r) =
  | Left('l)
  | Right('r);

type either('l, 'r) = t('l, 'r);

module Extra = {
  /**
   * Return the contents of a `Left`-value or a default value otherwise.
   *
   * `fromLeft 1 (Left 3) == 3`
   * `fromLeft 1 (Right "foo") == 1`
   */
  let fromLeft = (def, x) =>
    switch (x) {
    | Left(l) => l
    | Right(_) => def
    };

  /**
   * Return the contents of a `Right`-value or a default value otherwise.
   *
   * `fromRight 1 (Right 3) == 3`
   * `fromRight 1 (Left "foo") == 1`
   */
  let fromRight = (def, x) =>
    switch (x) {
    | Left(_) => def
    | Right(r) => r
    };

  /**
   * Pull the value out of an `Either` where both alternatives have the same type.
   *
   * `\x -> fromEither (Left x ) == x`
   * `\x -> fromEither (Right x) == x`
   */
  let fromEither = x =>
    switch (x) {
    | Left(l) => l
    | Right(r) => r
    };

  /**
   * `fromLeft' :: Either l r -> l`
   *
   * The `fromLeft'` function extracts the element out of a `Left` and throws an
   * error if its argument is `Right`. Much like `fromJust`, using this function
   * in polished code is usually a bad idea.
   *
   * `\x -> fromLeft' (Left  x) == x`
   * `\x -> fromLeft' (Right x) == undefined`
   *
   * @throws TypeError
   */
  let fromLeft' = x =>
    switch (x) {
    | Left(l) => l
    | Right(_) =>
      invalid_arg("fromLeft': Cannot extract a Left value out of a Right")
    };

  /**
   * `fromRight' :: Either l r -> r`
   *
   * The `fromRight'` function extracts the element out of a `Right` and throws an
   * error if its argument is `Left`. Much like `fromJust`, using this function
   * in polished code is usually a bad idea.
   *
   * `\x -> fromRight' (Right x) == x`
   * `\x -> fromRight' (Left  x) == undefined`
   *
   * @throws TypeError
   */
  let fromRight' = x =>
    switch (x) {
    | Left(_) =>
      invalid_arg("fromLeft': Cannot extract a Right value out of a Left")
    | Right(r) => r
    };

  /**
   * `eitherToMaybe :: Either a b -> Maybe b`
   *
   * Given an `Either`, convert it to a `Maybe`, where `Left` becomes `Nothing`.
   *
   * `\x -> eitherToMaybe (Left x) == Nothing`
   * `\x -> eitherToMaybe (Right x) == Just x`
   */
  let eitherToMaybe = x =>
    switch (x) {
    | Left(_) => Maybe.Nothing
    | Right(r) => Maybe.Just(r)
    };

  /**
   * `maybeToEither :: a -> Maybe b -> Either a b`
   *
   * Given a `Maybe`, convert it to an `Either`, providing a suitable value for
   * the `Left` should the value be `Nothing`.
   *
   * `\a b -> maybeToEither a (Just b) == Right b`
   * `\a -> maybeToEither a Nothing == Left a`
   */
  let maybeToEither = (left, x) =>
    switch (x) {
    | Maybe.Nothing => Left(left)
    | Maybe.Just(r) => Right(r)
    };

  /**
   * `maybeToEither' :: (() -> a) -> Maybe b -> Either a b`
   *
   * Given a `Maybe`, convert it to an `Either`, providing a suitable value for
   * the `Left` should the value be `Nothing`.
   *
   * `\a b -> maybeToEither a (Just b) == Right b`
   * `\a -> maybeToEither a Nothing == Left a`
   *
   * Lazy version of `maybeToEither`.
   */
  let maybeToEither' = (left, x) =>
    switch (x) {
    | Maybe.Nothing => Left(left())
    | Maybe.Just(r) => Right(r)
    };
};

module Functor = {
  let (<$>) = (f, x) =>
    switch (x) {
    | Left(l) => Left(l)
    | Right(r) => Right(f(r))
    };
};

module Bifunctor = {
  let bimap = (fLeft, fRight, x) =>
    switch (x) {
    | Left(l) => Left(fLeft(l))
    | Right(r) => Right(fRight(r))
    };

  let first = (f, x) =>
    switch (x) {
    | Left(l) => Left(f(l))
    | Right(r) => Right(r)
    };

  let second = Functor.(<$>);
};

module Applicative = {
  open Functor;

  let (<*>) = (f, x) =>
    switch (f) {
    | Right(r) => r <$> x
    | Left(l) => Left(l)
    };
};

module Monad = {
  open Functor;
  open Function;

  let (>>=) = (x, f) =>
    switch (x) {
    | Right(r) => f(r)
    | Left(l) => Left(l)
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
    | Right(x) => f(x, init)
    | Left(_) => init
    };

  let foldl = (f, init, mx) =>
    switch (mx) {
    | Right(x) => f(init, x)
    | Left(_) => init
    };

  let toList = mx =>
    switch (mx) {
    | Right(x) => [x]
    | Left(_) => []
    };

  let length = mx =>
    switch (mx) {
    | Right(_) => 1
    | Left(_) => 0
    };

  let elem = (e, mx) =>
    switch (mx) {
    | Right(x) => e === x
    | Left(_) => false
    };

  let sum = mx =>
    switch (mx) {
    | Right(x) => x
    | Left(_) => 0
    };

  let product = mx =>
    switch (mx) {
    | Right(x) => x
    | Left(_) => 1
    };

  let concat = mxs =>
    switch (mxs) {
    | Right(xs) => xs
    | Left(_) => []
    };

  let concatMap = (f, mx) =>
    switch (mx) {
    | Right(x) => f(x)
    | Left(_) => []
    };

  let con = mx =>
    switch (mx) {
    | Right(x) => x
    | Left(_) => true
    };

  let dis = mx =>
    switch (mx) {
    | Right(x) => x
    | Left(_) => false
    };

  let any = (pred, mx) =>
    switch (mx) {
    | Right(x) => pred(x)
    | Left(_) => false
    };

  let all = (pred, mx) =>
    switch (mx) {
    | Right(x) => pred(x)
    | Left(_) => true
    };

  let notElem = (e, mx) => !elem(e, mx);

  let find = (pred, mx) =>
    switch (mx) {
    | Right(x) => pred(x) ? Maybe.Just(x) : Maybe.Nothing
    | Left(_) => Maybe.Nothing
    };
};

/**
 * Case analysis for the `Either` type. If the value is `Left a`, apply the
 * first function to `a` if it is `Right b`, apply the second function to `b`.
 */
let either = (fLeft, fRight, x) =>
  switch (x) {
  | Left(l) => fLeft(l)
  | Right(r) => fRight(r)
  };

/**
 * Extracts from a list of `Either` all the `Left` elements. All the `Left`
 * elements are extracted in order.
 */
let lefts = xs =>
  ListH.Foldable.foldr(
    (x, acc) =>
      switch (x) {
      | Left(l) => [l, ...acc]
      | Right(_) => acc
      },
    [],
    xs,
  );

/**
 * Extracts from a list of `Either` all the `Right` elements. All the `Right`
 * elements are extracted in order.
 */
let rights = xs =>
  ListH.Foldable.foldr(
    (x, acc) =>
      switch (x) {
      | Left(_) => acc
      | Right(r) => [r, ...acc]
      },
    [],
    xs,
  );

/**
 * Partitions a list of `Either` into two lists. All the `Left` elements are
 * extracted, in order, to the first component of the output. Similarly the
 * `Right` elements are extracted to the second component of the output.
 */
let partitionEithers = xs =>
  ListH.Foldable.foldr(
    (x, (ls, rs)) =>
      switch (x) {
      | Left(l) => ([l, ...ls], rs)
      | Right(r) => (ls, [r, ...rs])
      },
    ([], []),
    xs,
  );
