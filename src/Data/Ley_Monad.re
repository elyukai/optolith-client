// S for signature
module type S = {
  type t('a);

  /**
   * `pure x` lifts the value `x` into the type.
   */
  let pure: 'a => t('a);

  /**
   * `fmap f x` applies `f` to all values in `x`.
   */
  let fmap: ('a => 'b, t('a)) => t('b);

  /**
   * `bind f x` applies `f` to all values in `x` and unwraps the results.
   */
  let bind: ('a => t('b), t('a)) => t('b);
};

module type Infix = {
  type t('a);

  /**
   * `f >>= x` applies `f` to all values in `x` and unwraps the results.
   */
  let (>>=): (t('a), 'a => t('b)) => t('b);

  /**
   * `x =<< f` applies `f` to all values in `x` and unwraps the results.
   */
  let (=<<): ('a => t('b), t('a)) => t('b);

  /**
   * `(f >=> g) x` composes `f` and `g`, both returning a wrapped value. `x` is
   * applied to `f` and then the unwrapped value is applied to `g`.
   */
  let (>=>): ('a => t('b), 'b => t('c), 'a) => t('c);

  /**
   * `(g <=< f) x` composes `f` and `g`, both returning a wrapped value. `x` is
   * applied to `f` and then the unwrapped value is applied to `g`.
   */
  let (<=<): ('b => t('c), 'a => t('b), 'a) => t('c);
};

module MakeInfix = (Arg: S) : (Infix with type t('a) = Arg.t('a)) => {
  type t('a) = Arg.t('a);

  let (>>=) = (x, f) => Arg.bind(f, x);

  let (=<<) = (x, f) => f >>= x;

  let (>=>) = (f, g, x) => x |> f >>= g;

  let (<=<) = (g, f, x) => (f >=> g)(x);
};

module type T = {
  type t('a);

  /**
   * `return x` lifts the value `x` into the type.
   */
  let return: 'a => t('a);

  /**
   * `join x` removes one structure level.
   */
  let join: t(t('a)) => t('a);

  /**
   * Lift a function to be applied to two wrapped values and returns the result
   * unwrapped.
   */
  let liftM2: (('a, 'b) => 'c, t('a), t('b)) => t('c);

  /**
   * Lift a function to be applied to three wrapped values and returns the
   * result unwrapped.
   */
  let liftM3: (('a, 'b, 'c) => 'd, t('a), t('b), t('c)) => t('d);

  /**
   * Lift a function to be applied to four wrapped values and returns the result
   * unwrapped.
   */
  let liftM4:
    (('a, 'b, 'c, 'd) => 'e, t('a), t('b), t('c), t('d)) => t('e);

  /**
   * Lift a function to be applied to five wrapped values and returns the result
   * unwrapped.
   */
  let liftM5:
    (('a, 'b, 'c, 'd, 'e) => 'f, t('a), t('b), t('c), t('d), t('e)) =>
    t('f);
};

module Make = (Arg: S) : (T with type t('a) = Arg.t('a)) => {
  type t('a) = Arg.t('a);

  let return = Arg.pure;

  let join = x => Arg.bind(y => y, x);

  let liftM2 = (f, a, b) =>
    Arg.bind(a' => Arg.fmap(b' => f(a', b'), b), a);

  let liftM3 = (f, a, b, c) =>
    Arg.bind(a' => Arg.bind(b' => Arg.fmap(c' => f(a', b', c'), c), b), a);

  let liftM4 = (f, a, b, c, d) =>
    Arg.bind(
      a' =>
        Arg.bind(
          b' => Arg.bind(c' => Arg.fmap(d' => f(a', b', c', d'), d), c),
          b,
        ),
      a,
    );

  let liftM5 = (f, a, b, c, d, e) =>
    Arg.bind(
      a' =>
        Arg.bind(
          b' =>
            Arg.bind(
              c' =>
                Arg.bind(d' => Arg.fmap(e' => f(a', b', c', d', e'), e), d),
              c,
            ),
          b,
        ),
      a,
    );
};
