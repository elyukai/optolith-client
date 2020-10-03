// S for signature
module type S = {
  include Ley_Functor.T;

  /**
   * `pure x` lifts the value `x` into the type.
   */
  let pure: 'a => t('a);

  /**
   * `ap f x` applies all functions in `f` to all values in `x`.
   */
  let ap: (t('a => 'b), t('a)) => t('b);
};

module type Infix = {
  type t('a);

  /**
   * `f <*> x` applies all functions in `f` to all values in `x`.
   */
  let (<*>): (t('a => 'b), t('a)) => t('b);

  /**
   * `x <**> f` applies all functions in `f` to all values in `x`.
   */
  let (<**>): (t('a), t('a => 'b)) => t('b);
};

module MakeInfix = (Arg: S) : (Infix with type t('a) = Arg.t('a)) => {
  type t('a) = Arg.t('a);

  let (<*>) = Arg.ap;

  let (<**>) = (x, f) => f <*> x;
};

module type T = {
  type t('a);

  /**
   * `pure x` lifts the value `x` into the type.
   */
  let pure: 'a => t('a);

  /**
   * `liftA2 f x y` applies the function `f` to the values in `x` and `y`.
   */
  let liftA2: (('a, 'b) => 'c, t('a), t('b)) => t('c);
};

module Make = (Arg: S) : (T with type t('a) = Arg.t('a)) => {
  type t('a) = Arg.t('a);

  let pure = Arg.pure;

  let liftA2 = (f, x, y) => Arg.ap(Arg.fmap(f, x), y);
};

module Alternative = {
  // S for signature
  module type S = {
    type t('a);

    /**
     * `empty` is the empty representation of the structure.
     */
    let empty: t('a);

    /**
     * `alt x y` returns `x` if it is not empty, otherwise `y`.
     */
    let alt: (t('a), t('a)) => t('a);
  };

  module type Infix = {
    type t('a);

    /**
     * `x <|> y` returns `x` if it is not empty, otherwise `y`.
     */
    let (<|>): (t('a), t('a)) => t('a);
  };

  module MakeInfix = (Arg: S) : (Infix with type t('a) = Arg.t('a)) => {
    type t('a) = Arg.t('a);

    let (<|>) = Arg.alt;
  };

  module type T = {
    type t('a);

    /**
     * `empty` is the empty representation of the structure.
     */
    let empty: t('a);
  };

  module Make = (Arg: S) : (T with type t('a) = Arg.t('a)) => {
    type t('a) = Arg.t('a);

    let empty = Arg.empty;
  };
};
