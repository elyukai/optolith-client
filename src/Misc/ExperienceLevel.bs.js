// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE

import * as Curry from "bs-platform/lib/es6/curry.js";
import * as JsonStrict$OptolithClient from "./JsonStrict.bs.js";
import * as Ley_Option$OptolithClient from "../Data/Ley_Option.bs.js";
import * as TranslationMap$OptolithClient from "./TranslationMap.bs.js";

function decode(json) {
  return {
          name: JsonStrict$OptolithClient.field("name", JsonStrict$OptolithClient.string, json)
        };
}

var Translations = {
  decode: decode
};

var TranslationMap = TranslationMap$OptolithClient.Make(Translations);

function decodeMultilingual(json) {
  return {
          id: JsonStrict$OptolithClient.field("id", JsonStrict$OptolithClient.$$int, json),
          ap: JsonStrict$OptolithClient.field("ap", JsonStrict$OptolithClient.$$int, json),
          maxAttributeValue: JsonStrict$OptolithClient.field("maxAttributeValue", JsonStrict$OptolithClient.$$int, json),
          maxSkillRating: JsonStrict$OptolithClient.field("maxSkillRating", JsonStrict$OptolithClient.$$int, json),
          maxCombatTechniqueRating: JsonStrict$OptolithClient.field("maxCombatTechniqueRating", JsonStrict$OptolithClient.$$int, json),
          maxTotalAttributeValues: JsonStrict$OptolithClient.field("maxTotalAttributeValues", JsonStrict$OptolithClient.$$int, json),
          maxSpellsLiturgicalChants: JsonStrict$OptolithClient.field("maxSpellsLiturgicalChants", JsonStrict$OptolithClient.$$int, json),
          maxUnfamiliarSpells: JsonStrict$OptolithClient.field("maxUnfamiliarSpells", JsonStrict$OptolithClient.$$int, json),
          translations: JsonStrict$OptolithClient.field("translations", TranslationMap.decode, json)
        };
}

function decode$1(langs, json) {
  var x = decodeMultilingual(json);
  return Curry._2(Ley_Option$OptolithClient.Infix.$less$amp$great, Curry._2(TranslationMap.getFromLanguageOrder, langs, x.translations), (function (translation) {
                return [
                        x.id,
                        {
                          id: x.id,
                          name: translation.name,
                          ap: x.ap,
                          maxAttributeValue: x.maxAttributeValue,
                          maxSkillRating: x.maxSkillRating,
                          maxCombatTechniqueRating: x.maxCombatTechniqueRating,
                          maxTotalAttributeValues: x.maxTotalAttributeValues,
                          maxSpellsLiturgicalChants: x.maxSpellsLiturgicalChants,
                          maxUnfamiliarSpells: x.maxUnfamiliarSpells
                        }
                      ];
              }));
}

export {
  decode$1 as decode,
  
}
/* TranslationMap Not a pure module */