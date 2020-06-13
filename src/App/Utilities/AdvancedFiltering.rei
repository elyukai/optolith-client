type searchAccessor('a) =
  | Flat('a => string)
  | Multi('a => list(string));

/**
 * `searchByMulti accs text xs` searches a list of records `xs` by checking
 * if the given `text` is part of any of the results of the provided accessor
 * functions (`accs`).
 */
let searchByMulti:
  (list(searchAccessor('a)), string, list('a)) => list('a);

type sortOption('a) = {
  compare: Ley.Ord.compare('a),
  reverse: bool,
};

/**
 * Sort a list based on the passed sort options array. A sort option is an
 * object containing a compare function and if the sort order should be reversed
 * for the compare function. The first sort option takes precedence over the
 * second sort option, and so on.
 */
let sortByMulti: (list(sortOption('a)), list('a)) => list('a);

/**
 * `sortStrings` sorts a list of strings with respect to the passed
 * locale.
 */
let sortStrings: (Static.t, list(string)) => list(string);

/**
 * A combination of `searchByMulti` and `sortByMulti`.
 */
let searchAndSortByMulti:
  (list(searchAccessor('a)), list(sortOption('a)), string, list('a)) =>
  list('a);
