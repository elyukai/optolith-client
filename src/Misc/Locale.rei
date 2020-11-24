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

module Supported: {
  /**
   * A language supported in Optolith. It's id is it's IETF language tag
   * (BCP47), and it features the languages name as well as the region name
   * defined in the standard.
   */
  type t = {
    id: string,
    name: string,
    region: string,
  };

  /**
   * Derive the default locale's id from the system locale's id.
   */
  let systemLocaleToId: (Ley_StrMap.t(t), string) => string;

  module Decode: {let map: Js.Json.t => Ley_StrMap.t(t);};
};

/**
 * `filterBySupported defaultLocale supportedLocales localeOrder` filters the
 * order of locales set by the user by the locales that are supported. If this
 * causes the order to be empty, a default locale will be used.
 */
let filterBySupported: (string, Ley_StrMap.t(Supported.t), order) => order;
