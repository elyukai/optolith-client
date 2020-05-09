module ListFormat: {
  type formatType =
    | Conjunction
    | Disjunction;

  /**
   * Formats a list language-specific by joining it's items.
   *
   * ```reason
   * let staticData = { messages: { id: "en-US", ... }, ...};
   *
   * format(Disjunction, staticData, ["1", "2", "3"]) === "1, 2 or 3"
   * ```
   */
  let format: (formatType, Static.t, list(string)) => string;
};

module Collator: {
  type t;

  /**
   * Collator options
   */
  type options = {numeric: option(bool)};

  /**
   * Creates a new collator for the passed language ID with default options.
   */
  let create: string => t;

  /**
   * Creates a new collator for the passed language ID, which allows you to
   * provide some options.
   */
  let createWithOptions: (string, options) => t;

  /**
   * Compares values by using the passed collator.
   */
  let compare: (t, string, string) => Ord.ordering;
};
