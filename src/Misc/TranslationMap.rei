type partialTranslations('a);
type translations('a);

module type Decodable = {
  type t;
  let t: Json.Decode.decoder(t);
};

module Make:
  (Decodable: Decodable) =>
   {
    type t = partialTranslations(Decodable.t);

    module Decode: {
      /**
       * Decodes a set of `Decodable` values.
       */
      let t: Json.Decode.decoder(t);

      /**
       * `getFromLanguageOrder langs mp` takes an ordered list of languages and
       * the language. The languages should be ordered by importance in descending
       * order. It returns the `Decodable` value of the most important language
       * that exists.
       *
       * For example, if you want `[Dutch, English, German]` (you prefer Dutch,
       * if the entry is not available in Dutch, take the one in English, if the
       * entry is not available in English, take the one in German) and you have
       * an English and a German entry, the English one is returned.
       */
      let getFromLanguageOrder: (Locale.order, t) => option(Decodable.t);

      /**
       * `getFromLanguageOrderWith pred langs mp` takes a predicate, an ordered
       * list of languages and the language. The languages should be ordered by
       * importance in descending order. It returns the `Decodable` value of the
       * most important language that exists where the predicate returns `true`
       * on the result.
       *
       * For example, if you want `[Dutch, English, German]` (you prefer Dutch,
       * if the entry is not available in Dutch, take the one in English, if the
       * entry is not available in English, take the one in German) and you have
       * an English and a German entry, the English one is returned. If the
       * predicate returns `false` for the English entry, though, the German one
       * is returned.
       */
      let getFromLanguageOrderWith:
        (Decodable.t => bool, Locale.order, t) => option(Decodable.t);
    };
  };
