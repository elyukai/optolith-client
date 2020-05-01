open ListH;
open Function;
open Ord;

type searchAccessor('a) =
  | Flat('a => string)
  | Multi('a => list(string));

/**
 * `searchByMulti accs text xs` searches a list of records `xs` by checking
 * if the given `text` matches any of the results of the provided accessor
 * functions (`accs`).
 */
let searchByMulti = (searchAccessors, filterText, xs) =>
  switch (searchAccessors) {
  | [] => xs
  | searchAccessors =>
    filter(
      x =>
        Foldable.any(
          pred =>
            switch (pred) {
            | Flat(f) =>
              x |> f |> Extra.lower |> isInfixOf(Extra.lower(filterText))
            | Multi(f) =>
              x
              |> f
              |> Foldable.any(x' =>
                   x' |> Extra.lower |> isInfixOf(Extra.lower(filterText))
                 )
            },
          searchAccessors,
        ),
      xs,
    )
  };

let searchStrings = (filterText: string, xs) =>
  Foldable.elem(filterText, xs);

type sortOption('a) = {
  compare: compare('a),
  reverse: bool,
};

let%private rec combinedCompare = (sortFunctions, a, b) =>
  switch (sortFunctions) {
  | [] => EQ
  | [f, ...fs] =>
    switch (f(a, b)) {
    | EQ => combinedCompare(fs, a, b)
    | LT as ord
    | GT as ord => ord
    }
  };

/**
 * Sort a list based on the passed sort options array. A sort option is an
 * object containing a compare function and if the sort order should be reversed
 * for the compare function. The first sort option takes precedence over the
 * second sort option and so on.
 */
let sortByMulti = (sortOptions, xs) =>
  if (Foldable.length(xs) < 2 || Foldable.null(sortOptions)) {
    xs;
  } else {
    let sortFunctions =
      sortOptions |> map(x => x.reverse ? flip(x.compare) : x.compare);

    sortBy(combinedCompare(sortFunctions), xs);
  };

/**
 * `sortStrings` sorts a list of strings with respect to the passed
 * locale.
 */
let sortStrings = (staticData: Static.t, xs) =>
  ListH.sortBy(
    Intl.Collator.compare(
      Intl.Collator.createWithOptions(
        staticData.messages.id,
        {numeric: Some(true)},
      ),
    ),
    xs,
  );

/**
 * A combination of `filterByMulti` and `sortByMulti`.
 */
let searchAndSortByMulti = (searchAccessors, sortOptions, filterText, xs) =>
  xs
  |> searchByMulti(searchAccessors, filterText)
  |> sortByMulti(sortOptions);
