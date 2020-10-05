/**
 * Decode a main entry. If successful, the returned pair is the decoded main
 * entry with it's associated id to be able to be directly used to be inserted
 * into a map.
 */
type assocDecoder('a) =
  Locale.order => Json.Decode.decoder(option((int, 'a)));

let decodeAssoc = (decoder, toAssoc, langs, json) =>
  Ley_Option.Infix.(decoder(langs, json) <&> toAssoc);

module type SubType = {
  type t;

  module Decode: {
    type multilingual;

    let multilingual: Json.Decode.decoder(multilingual);

    let resolveTranslations: (Locale.order, multilingual) => t;
  };
};

module type SubTypeWrapper = {
  type t('a);

  module Decode: {
    let multilingual: Json.Decode.decoder('a) => Json.Decode.decoder(t('a));

    let resolveTranslations:
      (Locale.order, (Locale.order, 'a) => 'b, t('a)) => t('b);
  };
};
