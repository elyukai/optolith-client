// S for signature
module type S = {
  type t('a);

  /**
   * `fmap f x` applies `f` to all values in `x`.
   */
  let fmap: ('a => 'b, t('a)) => t('b);
};

module type Infix = {
  type t('a);

  /**
   * `f <$> x` applies `f` to all values in `x`.
   */
  let (<$>): ('a => 'b, t('a)) => t('b);

  /**
   * `x <&> f` applies `f` to all values in `x`.
   */
  let (<&>): (t('a), 'a => 'b) => t('b);

  /**
   * `x <$ y` replaces all values in `y` with `x`.
   */
  let (<$): ('a, t('b)) => t('a);

  /**
   * `x $> y` replaces all values in `x` with `y`.
   */
  let ($>): (t('a), 'b) => t('b);
};

module MakeInfix = (Arg: S) : (Infix with type t('a) = Arg.t('a)) => {
  type t('a) = Arg.t('a);

  let (<$>) = Arg.fmap;

  let (<&>) = (x, f) => f <$> x;

  let (<$) = (x, y) => Arg.fmap(_ => x, y);

  let ($>) = (x, y) => y <$ x;
};

module type T = {
  type t('a);

  /**
   * `fmap f x` applies `f` to all values in `x`.
   */
  let fmap: ('a => 'b, t('a)) => t('b);
};

module Make = (Arg: S) : (T with type t('a) = Arg.t('a)) => {
  type t('a) = Arg.t('a);

  let fmap = Arg.fmap;
};
