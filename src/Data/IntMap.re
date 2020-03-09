module IntMap = Map.Make(Int32);

type t('a) = IntMap.t('a);

/**
 * Right-associative fold of a structure.
 */
let foldr = (f, initial, mp) => IntMap.fold(f, mp, initial);

module Experimental = {
  /**
   * `Bin` includes the height, the left subtree, the (key, value) and the
   * right subtree. The lowest key is on the left.
   */
  type t('a) =
    | Bin(int, t('a), (int, 'a), t('a))
    | Tip;

  /**
   * Gets the height of a map. Does not recalculate the value.
   */
  let height = x =>
    switch (x) {
    | Bin(h, _, _, _) => h
    | Tip => 0
    };

  /**
   * Returns the slope of the passed node. The "Slope" is the difference in
   * heights between the left and right subtrees of a node. A positive slope
   * means the right subtree is "higher" than the left subtree; zero if there is
   * no height difference.
   */
  let slope = x =>
    switch (x) {
    | Bin(_, tleft, _, tright) => height(tright) - height(tleft)
    | Tip => 0
    };

  /**
   * Before:
   *
   * ```txt
   *      x
   *     / \
   *    y   t3
   *   / \
   * t1   t2
   * ```
   *
   * where t1 has a greater height than t3 and t2 may have a greater height than
   * t3.
   *
   * After:
   *
   * ```txt
   *    y
   *   / \
   * t1   x
   *     / \
   *   t2   t3
   * ```
   */
  let rotateright = x =>
    switch (x) {
    | Bin(_, Bin(_, t1, x, t2), y, t3) =>
      Bin(height(t2) + 2, t1, x, Bin(height(t2) + 1, t2, y, t3))
    | x => x
    };

  /**
   * Inverse of `rotateright`.
   */
  let rotateleft = x =>
    switch (x) {
    | Bin(_, t1, x, Bin(_, t2, y, t3)) =>
      Bin(height(t2) + 2, Bin(height(t2) + 1, t1, x, t2), y, t3)
    | x => x
    };

  /**
   * Rebalances a tree. Assumes the subtrees are already balanced.
   */
  let rebalance = mp =>
    switch (mp) {
    | Tip => Tip
    | Bin(h, tleft, x, tright) =>
      let slope_main = slope(Bin(h, tleft, x, tright));

      // Dont do anything if most possible balanced and there is not more weight
      // on the right than on the left tree.
      if (slope_main === 0 || slope_main === (-1)) {
        Bin(h, tleft, x, tright);
      } else if
        // If left has too much weight, rotate right to compensate
        (slope_main === (-2)) {
        rotateright(Bin(h, tleft, x, tright));
      } else if
        // is right has too much weight and the right tree is exactly balanced,
        // rotate left to compensate
        (slope_main === 1 && slope(tright) === 0) {
        rotateleft(Bin(h, tleft, x, tright));
      } else {
        // otherwise, the right tree must have a heavier left subtree, so it needs
        // to be rotated right first before the main tree can be rotated left.
        rotateleft(
          Bin(h, tleft, x, rotateright(tright)),
        );
      };
    };
};
