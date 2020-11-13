// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Curry from "bs-platform/lib/es6/curry.js";
import * as Json_decode from "@glennsl/bs-json/src/Json_decode.bs.js";
import * as Decoder$OptolithClient from "../Utilities/Decoder.bs.js";
import * as Ley_Option$OptolithClient from "../Data/Ley_Option.bs.js";
import * as Increasable$OptolithClient from "./Increasable.bs.js";
import * as TranslationMap$OptolithClient from "../Misc/TranslationMap.bs.js";

var Dynamic = Increasable$OptolithClient.Dynamic.Make({
      minValue: 8
    });

function t(json) {
  return {
          name: Json_decode.field("name", Json_decode.string, json),
          nameAbbr: Json_decode.field("nameAbbr", Json_decode.string, json)
        };
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

function t$1(langs, json) {
  var x = multilingual(json);
  return Curry._2(Ley_Option$OptolithClient.Infix.$less$amp$great, Curry._2(TranslationMap.Decode.getFromLanguageOrder, langs, x.translations), (function (translation) {
                return {
                        id: x.id,
                        name: translation.name,
                        nameAbbr: translation.nameAbbr
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