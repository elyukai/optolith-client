// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE

import * as Curry from "bs-platform/lib/es6/curry.js";
import * as Json_decode from "@glennsl/bs-json/src/Json_decode.bs.js";
import * as Decoder$OptolithClient from "../Utilities/Decoder.bs.js";
import * as Erratum$OptolithClient from "../Sources/Erratum.bs.js";
import * as JsonStrict$OptolithClient from "./JsonStrict.bs.js";
import * as Ley_IntMap$OptolithClient from "../Data/Ley_IntMap.bs.js";
import * as Ley_Option$OptolithClient from "../Data/Ley_Option.bs.js";
import * as PublicationRef$OptolithClient from "../Sources/PublicationRef.bs.js";
import * as TranslationMap$OptolithClient from "./TranslationMap.bs.js";

function t(json) {
  return JsonStrict$OptolithClient.field("name", JsonStrict$OptolithClient.string, json);
}

var Translation = {
  t: t
};

var TranslationMap = TranslationMap$OptolithClient.Make(Translation);

function multilingual(json) {
  return {
          id: Json_decode.field("id", Json_decode.$$int, json),
          translations: Json_decode.field("translations", TranslationMap.Decode.t, json)
        };
}

function multilingualAssoc(json) {
  var x = multilingual(json);
  return [
          x.id,
          x
        ];
}

var Specialization = {
  Translation: Translation,
  TranslationMap: TranslationMap,
  multilingual: multilingual,
  multilingualAssoc: multilingualAssoc
};

function t$1(json) {
  return {
          name: JsonStrict$OptolithClient.field("name", JsonStrict$OptolithClient.string, json),
          specializationInput: JsonStrict$OptolithClient.optionalField("description", JsonStrict$OptolithClient.string, json),
          errata: JsonStrict$OptolithClient.field("errata", Erratum$OptolithClient.Decode.list, json)
        };
}

var Translation$1 = {
  t: t$1
};

var TranslationMap$1 = TranslationMap$OptolithClient.Make(Translation$1);

function multilingual$1(json) {
  return {
          id: JsonStrict$OptolithClient.field("id", JsonStrict$OptolithClient.$$int, json),
          maxLevel: JsonStrict$OptolithClient.optionalField("maxLevel", JsonStrict$OptolithClient.$$int, json),
          specializations: Ley_Option$OptolithClient.option(Ley_IntMap$OptolithClient.empty, Ley_IntMap$OptolithClient.fromList, JsonStrict$OptolithClient.optionalField("specializations", (function (param) {
                      return JsonStrict$OptolithClient.list(multilingualAssoc, param);
                    }), json)),
          continent: JsonStrict$OptolithClient.field("continent", JsonStrict$OptolithClient.$$int, json),
          isExtinct: JsonStrict$OptolithClient.field("isExtinct", JsonStrict$OptolithClient.bool, json),
          src: JsonStrict$OptolithClient.field("src", PublicationRef$OptolithClient.Decode.multilingualList, json),
          translations: JsonStrict$OptolithClient.field("translations", TranslationMap$1.Decode.t, json)
        };
}

function resolveTranslations(langs, x) {
  return Curry._2(Ley_Option$OptolithClient.Infix.$less$amp$great, Curry._2(TranslationMap$1.Decode.getFromLanguageOrder, langs, x.translations), (function (translation) {
                return {
                        id: x.id,
                        name: translation.name,
                        maxLevel: x.maxLevel,
                        specializations: Curry._2(Ley_IntMap$OptolithClient.mapMaybe, (function (specialization) {
                                return Curry._2(TranslationMap.Decode.getFromLanguageOrder, langs, specialization.translations);
                              }), x.specializations),
                        specializationInput: translation.specializationInput,
                        continent: x.continent,
                        isExtinct: x.isExtinct,
                        src: PublicationRef$OptolithClient.Decode.resolveTranslationsList(langs, x.src),
                        errata: translation.errata
                      };
              }));
}

function t$2(langs, json) {
  return resolveTranslations(langs, multilingual$1(json));
}

function toAssoc(x) {
  return [
          x.id,
          x
        ];
}

function assoc(param, param$1) {
  return Decoder$OptolithClient.decodeAssoc(t$2, toAssoc, param, param$1);
}

var Decode = {
  Specialization: Specialization,
  Translation: Translation$1,
  TranslationMap: TranslationMap$1,
  multilingual: multilingual$1,
  resolveTranslations: resolveTranslations,
  t: t$2,
  toAssoc: toAssoc,
  assoc: assoc
};

export {
  Decode ,
  
}
/* TranslationMap Not a pure module */
