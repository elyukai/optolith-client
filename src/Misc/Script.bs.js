// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Curry from "bs-platform/lib/es6/curry.js";
import * as Json_decode from "@glennsl/bs-json/src/Json_decode.bs.js";
import * as Decoder$OptolithClient from "../Utilities/Decoder.bs.js";
import * as Erratum$OptolithClient from "../Sources/Erratum.bs.js";
import * as Ley_Option$OptolithClient from "../Data/Ley_Option.bs.js";
import * as PublicationRef$OptolithClient from "../Sources/PublicationRef.bs.js";
import * as TranslationMap$OptolithClient from "./TranslationMap.bs.js";

function t(json) {
  return {
          name: Json_decode.field("name", Json_decode.string, json),
          errata: Json_decode.field("errata", Erratum$OptolithClient.Decode.list, json)
        };
}

var Translation = {
  t: t
};

var TranslationMap = TranslationMap$OptolithClient.Make(Translation);

function multilingual(json) {
  return {
          id: Json_decode.field("id", Json_decode.$$int, json),
          apValue: Json_decode.field("apValue", Json_decode.$$int, json),
          languages: Json_decode.field("languages", (function (param) {
                  return Json_decode.list(Json_decode.$$int, param);
                }), json),
          continent: Json_decode.field("continent", Json_decode.$$int, json),
          isExtinct: Json_decode.field("isExtinct", Json_decode.bool, json),
          src: Json_decode.field("src", PublicationRef$OptolithClient.Decode.multilingualList, json),
          translations: Json_decode.field("translations", TranslationMap.Decode.t, json)
        };
}

function resolveTranslations(langs, x) {
  return Curry._2(Ley_Option$OptolithClient.Infix.$less$amp$great, Curry._2(TranslationMap.Decode.getFromLanguageOrder, langs, x.translations), (function (translation) {
                return {
                        id: x.id,
                        name: translation.name,
                        apValue: x.apValue,
                        languages: x.languages,
                        continent: x.continent,
                        isExtinct: x.isExtinct,
                        src: PublicationRef$OptolithClient.Decode.resolveTranslationsList(langs, x.src),
                        errata: translation.errata
                      };
              }));
}

function t$1(langs, json) {
  return resolveTranslations(langs, multilingual(json));
}

function toAssoc(x) {
  return [
          x.id,
          x
        ];
}

function assoc(param, param$1) {
  return Decoder$OptolithClient.decodeAssoc(t$1, toAssoc, param, param$1);
}

var Decode = {
  Translation: Translation,
  TranslationMap: TranslationMap,
  multilingual: multilingual,
  resolveTranslations: resolveTranslations,
  t: t$1,
  toAssoc: toAssoc,
  assoc: assoc
};

export {
  Decode ,
  
}
/* TranslationMap Not a pure module */
