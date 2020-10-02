// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE

import * as Curry from "bs-platform/lib/es6/curry.js";
import * as Erratum$OptolithClient from "../Sources/Erratum.bs.js";
import * as JsonStrict$OptolithClient from "../Misc/JsonStrict.bs.js";
import * as Ley_IntSet$OptolithClient from "../Data/Ley_IntSet.bs.js";
import * as Ley_Option$OptolithClient from "../Data/Ley_Option.bs.js";
import * as PublicationRef$OptolithClient from "../Sources/PublicationRef.bs.js";
import * as TranslationMap$OptolithClient from "../Misc/TranslationMap.bs.js";

function decode(json) {
  return {
          name: JsonStrict$OptolithClient.field("name", JsonStrict$OptolithClient.string, json),
          effect: JsonStrict$OptolithClient.field("effect", JsonStrict$OptolithClient.string, json),
          range: JsonStrict$OptolithClient.field("range", JsonStrict$OptolithClient.string, json),
          duration: JsonStrict$OptolithClient.field("duration", JsonStrict$OptolithClient.string, json),
          target: JsonStrict$OptolithClient.field("target", JsonStrict$OptolithClient.string, json),
          errata: JsonStrict$OptolithClient.field("errata", Erratum$OptolithClient.decodeList, json)
        };
}

var Translations = {
  decode: decode
};

var TranslationMap = TranslationMap$OptolithClient.Make(Translations);

function decodeMultilingual(json) {
  return {
          id: JsonStrict$OptolithClient.field("id", JsonStrict$OptolithClient.$$int, json),
          traditions: Curry._1(Ley_IntSet$OptolithClient.fromList, JsonStrict$OptolithClient.field("traditions", (function (param) {
                      return JsonStrict$OptolithClient.list(JsonStrict$OptolithClient.$$int, param);
                    }), json)),
          src: JsonStrict$OptolithClient.field("src", PublicationRef$OptolithClient.decodeMultilingualList, json),
          translations: JsonStrict$OptolithClient.field("translations", TranslationMap.decode, json)
        };
}

function decode$1(langs, json) {
  var x = decodeMultilingual(json);
  return Ley_Option$OptolithClient.Functor.$less$amp$great(Curry._2(TranslationMap.getFromLanguageOrder, langs, x.translations), (function (translation) {
                return {
                        id: x.id,
                        name: translation.name,
                        effect: translation.effect,
                        range: translation.range,
                        duration: translation.duration,
                        target: translation.target,
                        traditions: x.traditions,
                        src: PublicationRef$OptolithClient.resolveTranslationsList(langs, x.src),
                        errata: translation.errata
                      };
              }));
}

export {
  decode$1 as decode,
  
}
/* TranslationMap Not a pure module */
