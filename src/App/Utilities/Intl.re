module ListFormat = {
  open Static;
  open Maybe;

  type formatType =
    | Conjunction
    | Disjunction;

  let%private getSeparator = (type_, staticData) =>
    switch (type_) {
    | Conjunction => staticData.messages.general_and
    | Disjunction => staticData.messages.general_or
    };

  let%private joinLastWithSeparator = (type_, staticData, lastStr, initStr) =>
    initStr ++ " " ++ getSeparator(type_, staticData) ++ " " ++ lastStr;

  /**
   * Formats a list language-specific by joining it's items.
   *
   * ```reason
   * let staticData = { messages: { id: "en-US", ... }, ...};
   *
   * format(Disjunction, staticData, ["1", "2", "3"]) === "1, 2 or 3"
   * ```
   */
  let format = (type_, staticData, xs) =>
    switch (xs) {
    | [] => ""
    | [x] => x
    | xs =>
      xs
      |> ListH.Extra.unsnoc
      |> maybe("", ((init, last)) =>
           init
           |> ListH.intercalate(", ")
           |> joinLastWithSeparator(type_, staticData, last)
         )
    };
};

module Collator = {
  type t;

  type options = {numeric: option(bool)};

  [@bs.scope "Intl"] [@bs.val] external create: string => t = "Collator";
  [@bs.scope "Intl"] [@bs.val]
  external createWithOptions: (string, options) => t = "Collator";
  [@bs.send] external compareN: (t, string, string) => int = "compare";

  let compare = (collator, a, b) =>
    compareN(collator, a, b) |> Ord.toOrdering;
};
