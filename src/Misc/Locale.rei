/**
 * The user defines in which order languages should be used to fill the app with
 * data.
 */
type order;

/**
 * `fromList xs` returns the order of locale identifiers defined by a list in
 * descending order, from the most preferred locale to the least preferred
 * locale.
 */
let fromList: list(string) => order;

/**
 * `toList order` returns the order of locale identifiers as a list in
 * descending order, from the most preferred locale to the least preferred
 * locale.
 */
let toList: order => list(string);

/**
 * `getPreferred order` returns the main preferred locale identifier from the
 * order of possible locales.
 */
let getPreferred: order => string;
