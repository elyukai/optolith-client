// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Curry from "bs-platform/lib/es6/curry.js";
import * as Decoder$OptolithClient from "../Utilities/Decoder.bs.js";
import * as JsonStrict$OptolithClient from "./JsonStrict.bs.js";
import * as Ley_IntSet$OptolithClient from "../Data/Ley_IntSet.bs.js";
import * as Ley_Option$OptolithClient from "../Data/Ley_Option.bs.js";
import * as TranslationMap$OptolithClient from "./TranslationMap.bs.js";

function t(json) {
  return {
          name: JsonStrict$OptolithClient.field("name", JsonStrict$OptolithClient.string, json)
        };
}

var Translation = {
  t: t
};

TranslationMap$OptolithClient.Make(Translation);

function t$1(json) {
  return {
          name: JsonStrict$OptolithClient.field("name", JsonStrict$OptolithClient.string, json)
        };
}

var Translation$1 = {
  t: t$1
};

var TranslationMap = TranslationMap$OptolithClient.Make(Translation$1);

function multilingual(json) {
  return {
          id: JsonStrict$OptolithClient.field("id", JsonStrict$OptolithClient.$$int, json),
          category: JsonStrict$OptolithClient.field("category", JsonStrict$OptolithClient.$$int, json),
          skills: JsonStrict$OptolithClient.field("skills", (function (param) {
                  return JsonStrict$OptolithClient.tuple3(JsonStrict$OptolithClient.$$int, JsonStrict$OptolithClient.$$int, JsonStrict$OptolithClient.$$int, param);
                }), json),
          limitedToCultures: Curry._1(Ley_IntSet$OptolithClient.fromList, JsonStrict$OptolithClient.field("limitedToCultures", (function (param) {
                      return JsonStrict$OptolithClient.list(JsonStrict$OptolithClient.$$int, param);
                    }), json)),
          isLimitedToCulturesReverse: JsonStrict$OptolithClient.field("isLimitedToCulturesReverse", JsonStrict$OptolithClient.bool, json),
          translations: JsonStrict$OptolithClient.field("translations", TranslationMap.Decode.t, json)
        };
}

function t$2(langs, json) {
  var x = multilingual(json);
  return Curry._2(Ley_Option$OptolithClient.Infix.$less$amp$great, Curry._2(TranslationMap.Decode.getFromLanguageOrder, langs, x.translations), (function (translation) {
                return {
                        id: x.id,
                        name: translation.name,
                        category: x.category,
                        skills: x.skills,
                        limitedToCultures: x.limitedToCultures,
                        isLimitedToCulturesReverse: x.isLimitedToCulturesReverse
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
  return Decoder$OptolithClient.decodeAssoc(t$2, toAssoc, param, param$1);
}

var Category = {};

var Decode = {
  assoc: assoc
};

export {
  Category ,
  Decode ,
  
}
/*  Not a pure module */