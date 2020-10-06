// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE

import * as Curry from "bs-platform/lib/es6/curry.js";
import * as Decoder$OptolithClient from "../Utilities/Decoder.bs.js";
import * as Erratum$OptolithClient from "../Sources/Erratum.bs.js";
import * as JsonStrict$OptolithClient from "./JsonStrict.bs.js";
import * as Ley_Option$OptolithClient from "../Data/Ley_Option.bs.js";
import * as Prerequisite$OptolithClient from "../Prerequisites/Prerequisite.bs.js";
import * as PublicationRef$OptolithClient from "../Sources/PublicationRef.bs.js";
import * as TranslationMap$OptolithClient from "./TranslationMap.bs.js";

function t(json) {
  return {
          name: JsonStrict$OptolithClient.field("name", JsonStrict$OptolithClient.string, json),
          description: JsonStrict$OptolithClient.optionalField("description", JsonStrict$OptolithClient.string, json),
          errata: JsonStrict$OptolithClient.field("errata", Erratum$OptolithClient.Decode.list, json)
        };
}

var Translation = {
  t: t
};

var TranslationMap = TranslationMap$OptolithClient.Make(Translation);

function multilingual(json) {
  return {
          id: JsonStrict$OptolithClient.field("id", JsonStrict$OptolithClient.$$int, json),
          apValue: JsonStrict$OptolithClient.field("apValue", JsonStrict$OptolithClient.$$int, json),
          isSecretKnowledge: JsonStrict$OptolithClient.field("isSecretKnowledge", JsonStrict$OptolithClient.bool, json),
          prerequisites: JsonStrict$OptolithClient.optionalField("prerequisites", Prerequisite$OptolithClient.Collection.Profession.Decode.multilingual, json),
          src: JsonStrict$OptolithClient.field("src", PublicationRef$OptolithClient.Decode.multilingualList, json),
          translations: JsonStrict$OptolithClient.field("translations", TranslationMap.Decode.t, json)
        };
}

function resolveTranslations(langs, x) {
  return Curry._2(Ley_Option$OptolithClient.Infix.$less$amp$great, Curry._2(TranslationMap.Decode.getFromLanguageOrder, langs, x.translations), (function (translation) {
                return {
                        id: x.id,
                        name: translation.name,
                        description: translation.description,
                        apValue: x.apValue,
                        isSecretKnowledge: x.isSecretKnowledge,
                        prerequisites: Ley_Option$OptolithClient.option(/* [] */0, Curry._1(Prerequisite$OptolithClient.Collection.Profession.Decode.resolveTranslations, langs), x.prerequisites),
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
