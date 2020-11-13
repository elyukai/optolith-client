// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Curry from "bs-platform/lib/es6/curry.js";
import * as Json_decode from "@glennsl/bs-json/src/Json_decode.bs.js";
import * as IC$OptolithClient from "./IC.bs.js";
import * as Decoder$OptolithClient from "../Utilities/Decoder.bs.js";
import * as Erratum$OptolithClient from "../Sources/Erratum.bs.js";
import * as JsonStrict$OptolithClient from "../Misc/JsonStrict.bs.js";
import * as Ley_Option$OptolithClient from "../Data/Ley_Option.bs.js";
import * as Increasable$OptolithClient from "./Increasable.bs.js";
import * as PublicationRef$OptolithClient from "../Sources/PublicationRef.bs.js";
import * as TranslationMap$OptolithClient from "../Misc/TranslationMap.bs.js";

var Dynamic = Increasable$OptolithClient.Dynamic.Make({
      minValue: 6
    });

function t(json) {
  return {
          name: JsonStrict$OptolithClient.field("name", JsonStrict$OptolithClient.string, json),
          special: JsonStrict$OptolithClient.optionalField("special", JsonStrict$OptolithClient.string, json),
          errata: JsonStrict$OptolithClient.field("errata", Erratum$OptolithClient.Decode.list, json)
        };
}

var Translation = {
  t: t
};

var TranslationMap = TranslationMap$OptolithClient.Make(Translation);

function multilingual(json) {
  return {
          id: Json_decode.field("id", Json_decode.$$int, json),
          ic: Json_decode.field("ic", IC$OptolithClient.Decode.t, json),
          primary: Json_decode.field("primary", (function (param) {
                  return Json_decode.list(Json_decode.$$int, param);
                }), json),
          hasNoParry: Json_decode.field("hasNoParry", Json_decode.bool, json),
          breakingPointRating: Json_decode.field("breakingPointRating", Json_decode.$$int, json),
          gr: Json_decode.field("gr", Json_decode.$$int, json),
          src: Json_decode.field("src", PublicationRef$OptolithClient.Decode.multilingualList, json),
          translations: Json_decode.field("translations", TranslationMap.Decode.t, json)
        };
}

function t$1(langs, json) {
  var x = multilingual(json);
  return Curry._2(Ley_Option$OptolithClient.Infix.$less$amp$great, Curry._2(TranslationMap.Decode.getFromLanguageOrder, langs, x.translations), (function (translation) {
                return {
                        id: x.id,
                        name: translation.name,
                        ic: x.ic,
                        primary: x.primary,
                        special: translation.special,
                        hasNoParry: x.hasNoParry,
                        breakingPointRating: x.breakingPointRating,
                        gr: x.gr,
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

var Dynamic_empty = Dynamic.empty;

var Dynamic_isEmpty = Dynamic.isEmpty;

var Dynamic_getValueDef = Dynamic.getValueDef;

var Dynamic$1 = {
  empty: Dynamic_empty,
  isEmpty: Dynamic_isEmpty,
  getValueDef: Dynamic_getValueDef
};

var Static = {
  Decode: {
    assoc: assoc
  }
};

export {
  Dynamic$1 as Dynamic,
  Static ,
  
}
/* Dynamic Not a pure module */
