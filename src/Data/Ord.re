type ordering =
  | LT
  | EQ
  | GT;

/**
 * A compare function returns how the elements are related in terms of order.
 *
 * The returned `Ordering` is to be read *x Ordering y*, so that if `x` is
 * larger than `y`, `GT` is returned.
 */
type compare('a) = ('a, 'a) => ordering;

/**
 * Convert a native ordering returned from a native compare function (e.g.
 * `Intl.Collator#compare`) into `Ordering` where a negative number will be
 * converted to `LT`, a positive number to `GT` and `0` to `EQ`.
 */
let toOrdering = n => n < 0 ? LT : n > 0 ? GT : EQ;

let fromOrdering = ord =>
  switch (ord) {
  | LT => (-1)
  | EQ => 0
  | GT => 1
  };
