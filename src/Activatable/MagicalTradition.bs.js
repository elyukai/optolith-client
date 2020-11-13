// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Curry from "bs-platform/lib/es6/curry.js";
import * as Json_decode from "@glennsl/bs-json/src/Json_decode.bs.js";
import * as Decoder$OptolithClient from "../Utilities/Decoder.bs.js";
import * as JsonStrict$OptolithClient from "../Misc/JsonStrict.bs.js";
import * as Ley_Option$OptolithClient from "../Data/Ley_Option.bs.js";
import * as TranslationMap$OptolithClient from "../Misc/TranslationMap.bs.js";

function t(json) {
  return {
          name: JsonStrict$OptolithClient.field("name", JsonStrict$OptolithClient.string, json)
        };
}

var Translation = {
  t: t
};

var TranslationMap = TranslationMap$OptolithClient.Make(Translation);

function multilingual(json) {
  return {
          id: JsonStrict$OptolithClient.field("id", JsonStrict$OptolithClient.$$int, json),
          numId: JsonStrict$OptolithClient.optionalField("numId", JsonStrict$OptolithClient.$$int, json),
          primary: JsonStrict$OptolithClient.optionalField("primary", JsonStrict$OptolithClient.$$int, json),
          aeMod: JsonStrict$OptolithClient.optionalField("aeMod", Json_decode.$$float, json),
          canLearnCantrips: JsonStrict$OptolithClient.field("canLearnCantrips", JsonStrict$OptolithClient.bool, json),
          canLearnSpells: JsonStrict$OptolithClient.field("canLearnSpells", JsonStrict$OptolithClient.bool, json),
          canLearnRituals: JsonStrict$OptolithClient.field("canLearnRituals", JsonStrict$OptolithClient.bool, json),
          allowMultipleTraditions: JsonStrict$OptolithClient.field("allowMultipleTraditions", JsonStrict$OptolithClient.bool, json),
          isDisAdvAPMaxHalved: JsonStrict$OptolithClient.field("isDisAdvAPMaxHalved", JsonStrict$OptolithClient.bool, json),
          areDisAdvRequiredApplyToMagActionsOrApps: JsonStrict$OptolithClient.field("areDisAdvRequiredApplyToMagActionsOrApps", JsonStrict$OptolithClient.bool, json),
          translations: JsonStrict$OptolithClient.field("translations", TranslationMap.Decode.t, json)
        };
}

function t$1(langs, json) {
  var x = multilingual(json);
  return Curry._2(Ley_Option$OptolithClient.Infix.$less$amp$great, Curry._2(TranslationMap.Decode.getFromLanguageOrder, langs, x.translations), (function (translation) {
                return {
                        id: x.id,
                        name: translation.name,
                        numId: x.numId,
                        primary: x.primary,
                        aeMod: x.aeMod,
                        canLearnCantrips: x.canLearnCantrips,
                        canLearnSpells: x.canLearnSpells,
                        canLearnRituals: x.canLearnRituals,
                        allowMultipleTraditions: x.allowMultipleTraditions,
                        isDisAdvAPMaxHalved: x.isDisAdvAPMaxHalved,
                        areDisAdvRequiredApplyToMagActionsOrApps: x.areDisAdvRequiredApplyToMagActionsOrApps
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

var Decode = {
  assoc: assoc
};

export {
  Decode ,
  
}
/* TranslationMap Not a pure module */
