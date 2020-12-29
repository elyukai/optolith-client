// S for signature
module type S = {
  type t('a);

  /**
   * `foldr f init x` reduces the container `x` from right to left by
   * accumulating it's values with the function `f`, which takes the current
   * value in the container and the current accumulated value. `init` is the
   * accumulated value at the beginning.
   */
  let foldr: (('a, 'b) => 'b, 'b, t('a)) => 'b;

  /**
   * `foldl f init x` reduces the container `x` from left to right by
   * accumulating it's values with the function `f`, which takes the current
   * value in the container and the current accumulated value. `init` is the
   * accumulated value at the beginning.
   */
  let foldl: (('a, 'b) => 'a, 'a, t('b)) => 'a;
};

module type T = {
  type t('a);

  /**
   * `foldr f init x` reduces the container `x` from right to left by
   * accumulating it's values with the function `f`, which takes the current
   * value in the container and the current accumulated value. `init` is the
   * accumulated value at the beginning.
   */
  let foldr: (('a, 'b) => 'b, 'b, t('a)) => 'b;

  /**
   * `foldl f init x` reduces the container `x` from left to right by
   * accumulating it's values with the function `f`, which takes the current
   * value in the container and the current accumulated value. `init` is the
   * accumulated value at the beginning.
   */
  let foldl: (('a, 'b) => 'a, 'a, t('b)) => 'a;

  /**
   * `foldl' f init x` reduces the container `x` from left to right by
   * accumulating it's values with the function `f`, which takes the current
   * value in the container and the current accumulated value. `init` is the
   * accumulated value at the beginning.
   */
  let foldl': (('a, 'b) => 'b, t('a), 'b) => 'b;

  /**
   * `toList x` converts the container `x` to a list.
   */
  let toList: t('a) => list('a);

  /**
   * `null x` checks whether the container `x` is empty.
   */
  let null: t('a) => bool;

  /**
   * `length x` returns the length of the container `x`.
   */
  let length: t('a) => int;

  /**
   * `elem e x` returns if the value `e` occurs in the container `x`.
   */
  let elem: ('a, t('a)) => bool;

  /**
   * `sum x` returns the sum of the values in `x`.
   */
  let sum: t(int) => int;

  /**
   * `maximum x` returns the largest integer in `x`.
   */
  let maximum: t(int) => int;

  /**
   * `minimum x` returns the smallest integer in `x`.
   */
  let minimum: t(int) => int;

  /**
   * `concat x` concatenates all elements in `x`.
   */
  let concat: t(list('a)) => list('a);

  /**
   * `concatMap f x` maps the function `f` over all the elements of container
   * `x` and concatenates the resulting lists.
   */
  let concatMap: ('a => list('b), t('a)) => list('b);

  /**
   * `con x` is the conjunction (logical AND) of all elements in the container.
   */
  let con: t(bool) => bool;

  /**
   * `dis x` is the disjunction (logical OR) of all elements in the container.
   */
  let dis: t(bool) => bool;

  /**
   * `any pred x` returns true if at least one value in the container `x`
   * matches the given predicate `pred`.
   */
  let any: ('a => bool, t('a)) => bool;

  /**
   * `all pred x` returns true if all values in the container `x` matche the
   * given predicate `pred`.
   */
  let all: ('a => bool, t('a)) => bool;

  /**
   * `notElem e x` returns if the value `e` does not occur in the container `x`.
   */
  let notElem: ('a, t('a)) => bool;

  /**
   * `find pred x` takes a predicate `pred` and a structure `x` and returns the
   * leftmost element of the structure matching the predicate, or `None` if
   * there is no such element.
   */
  let find: ('a => bool, t('a)) => option('a);
};

module Make = (Arg: S) : (T with type t('a) = Arg.t('a)) => {
  type t('a) = Arg.t('a);

  let foldr = Arg.foldr;

  let foldl = Arg.foldl;

  let foldl' = (f, x, init) => foldl((acc, e) => f(e, acc), init, x);

  let toList = x => foldr((e, xs) => [e, ...xs], [], x);

  let null = x => foldr((_, _) => false, true, x);

  let length = x => foldr((_, len) => len + 1, 0, x);

  let any = (f, x) => foldr((e, res) => f(e) ? true : res, false, x);

  let all = (f, x) => foldr((e, res) => f(e) ? res : false, true, x);

  let elem = (e, x) => any(x' => e == x', x);

  let sum = x => foldr((+), 0, x);

  let maximum = xs => foldr(Js.Math.max_int, Js.Int.min, xs);

  let minimum = xs => foldr(Js.Math.min_int, Js.Int.max, xs);

  let concat = x => foldr((@), [], x);

  let concatMap = (f, x) => foldr((e, rs) => f(e) @ rs, [], x);

  let con = x => foldr((e, acc) => acc && e, true, x);

  let dis = x => foldr((e, acc) => acc || e, false, x);

  let notElem = (e, x) => all(x' => e != x', x);

  let find = (f, x) =>
    foldr(
      (e, res) =>
        switch (res) {
        | Some(_) as x => x
        | None => f(e) ? Some(e) : None
        },
      None,
      x,
    );
};
