// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE

import * as Curry from "bs-platform/lib/es6/curry.js";
import * as Decoder$OptolithClient from "../Utilities/Decoder.bs.js";
import * as Erratum$OptolithClient from "../Sources/Erratum.bs.js";
import * as JsonStrict$OptolithClient from "../Misc/JsonStrict.bs.js";
import * as Ley_IntSet$OptolithClient from "../Data/Ley_IntSet.bs.js";
import * as Ley_Option$OptolithClient from "../Data/Ley_Option.bs.js";
import * as Prerequisite$OptolithClient from "../Prerequisites/Prerequisite.bs.js";
import * as PublicationRef$OptolithClient from "../Sources/PublicationRef.bs.js";
import * as TranslationMap$OptolithClient from "../Misc/TranslationMap.bs.js";

function t(json) {
  return {
          name: JsonStrict$OptolithClient.field("name", JsonStrict$OptolithClient.string, json),
          effect: JsonStrict$OptolithClient.field("effect", JsonStrict$OptolithClient.string, json),
          range: JsonStrict$OptolithClient.field("range", JsonStrict$OptolithClient.string, json),
          duration: JsonStrict$OptolithClient.field("duration", JsonStrict$OptolithClient.string, json),
          target: JsonStrict$OptolithClient.field("target", JsonStrict$OptolithClient.string, json),
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
          property: JsonStrict$OptolithClient.field("property", JsonStrict$OptolithClient.$$int, json),
          traditions: Curry._1(Ley_IntSet$OptolithClient.fromList, JsonStrict$OptolithClient.field("traditions", (function (param) {
                      return JsonStrict$OptolithClient.list(JsonStrict$OptolithClient.$$int, param);
                    }), json)),
          prerequisites: Ley_Option$OptolithClient.fromOption(/* [] */0, JsonStrict$OptolithClient.optionalField("prerequisites", (function (param) {
                      return JsonStrict$OptolithClient.list(Prerequisite$OptolithClient.Activatable.Decode.t, param);
                    }), json)),
          src: JsonStrict$OptolithClient.field("src", PublicationRef$OptolithClient.Decode.multilingualList, json),
          translations: JsonStrict$OptolithClient.field("translations", TranslationMap.Decode.t, json)
        };
}

function t$1(langs, json) {
  var x = multilingual(json);
  return Curry._2(Ley_Option$OptolithClient.Infix.$less$amp$great, Curry._2(TranslationMap.Decode.getFromLanguageOrder, langs, x.translations), (function (translation) {
                return {
                        id: x.id,
                        name: translation.name,
                        effect: translation.effect,
                        range: translation.range,
                        duration: translation.duration,
                        target: translation.target,
                        property: x.property,
                        traditions: x.traditions,
                        prerequisites: x.prerequisites,
                        src: PublicationRef$OptolithClient.Decode.resolveTranslationsList(langs, x.src),
                        errata: translation.errata
                      };
              }));
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

var Static = {
  Decode: {
    assoc: assoc
  }
};

export {
  Static ,
  
}
/* TranslationMap Not a pure module */
