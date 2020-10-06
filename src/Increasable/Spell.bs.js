// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE

import * as Curry from "bs-platform/lib/es6/curry.js";
import * as IC$OptolithClient from "./IC.bs.js";
import * as Decoder$OptolithClient from "../Utilities/Decoder.bs.js";
import * as Erratum$OptolithClient from "../Sources/Erratum.bs.js";
import * as JsonStrict$OptolithClient from "../Misc/JsonStrict.bs.js";
import * as Ley_IntSet$OptolithClient from "../Data/Ley_IntSet.bs.js";
import * as Ley_Option$OptolithClient from "../Data/Ley_Option.bs.js";
import * as SkillCheck$OptolithClient from "./SkillCheck.bs.js";
import * as Enhancements$OptolithClient from "./Enhancements.bs.js";
import * as Prerequisite$OptolithClient from "../Prerequisites/Prerequisite.bs.js";
import * as CheckModifier$OptolithClient from "./CheckModifier.bs.js";
import * as PublicationRef$OptolithClient from "../Sources/PublicationRef.bs.js";
import * as TranslationMap$OptolithClient from "../Misc/TranslationMap.bs.js";
import * as ActivatableSkill$OptolithClient from "./ActivatableSkill.bs.js";

function t(json) {
  return {
          name: JsonStrict$OptolithClient.field("name", JsonStrict$OptolithClient.string, json),
          effect: JsonStrict$OptolithClient.field("effect", JsonStrict$OptolithClient.string, json),
          castingTime: JsonStrict$OptolithClient.field("castingTime", ActivatableSkill$OptolithClient.MainParameter.decode, json),
          cost: JsonStrict$OptolithClient.field("cost", ActivatableSkill$OptolithClient.MainParameter.decode, json),
          range: JsonStrict$OptolithClient.field("range", ActivatableSkill$OptolithClient.MainParameter.decode, json),
          duration: JsonStrict$OptolithClient.field("duration", ActivatableSkill$OptolithClient.MainParameter.decode, json),
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
          check: JsonStrict$OptolithClient.field("check", SkillCheck$OptolithClient.Decode.t, json),
          checkMod: JsonStrict$OptolithClient.optionalField("checkMod", CheckModifier$OptolithClient.Decode.t, json),
          castingTimeNoMod: JsonStrict$OptolithClient.field("castingTimeNoMod", JsonStrict$OptolithClient.bool, json),
          costNoMod: JsonStrict$OptolithClient.field("costNoMod", JsonStrict$OptolithClient.bool, json),
          rangeNoMod: JsonStrict$OptolithClient.field("rangeNoMod", JsonStrict$OptolithClient.bool, json),
          durationNoMod: JsonStrict$OptolithClient.field("durationNoMod", JsonStrict$OptolithClient.bool, json),
          property: JsonStrict$OptolithClient.field("property", JsonStrict$OptolithClient.$$int, json),
          traditions: Curry._1(Ley_IntSet$OptolithClient.fromList, JsonStrict$OptolithClient.field("traditions", (function (param) {
                      return JsonStrict$OptolithClient.list(JsonStrict$OptolithClient.$$int, param);
                    }), json)),
          ic: JsonStrict$OptolithClient.field("ic", IC$OptolithClient.Decode.t, json),
          prerequisites: Ley_Option$OptolithClient.fromOption(/* [] */0, JsonStrict$OptolithClient.optionalField("prerequisites", (function (param) {
                      return JsonStrict$OptolithClient.list(Prerequisite$OptolithClient.Increasable.Decode.t, param);
                    }), json)),
          gr: JsonStrict$OptolithClient.field("gr", JsonStrict$OptolithClient.$$int, json),
          enhancements: JsonStrict$OptolithClient.optionalField("enhancements", Enhancements$OptolithClient.Decode.multilingual, json),
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
                        check: x.check,
                        checkMod: x.checkMod,
                        effect: translation.effect,
                        castingTime: ActivatableSkill$OptolithClient.MainParameter.make(x.castingTimeNoMod, translation.castingTime),
                        cost: ActivatableSkill$OptolithClient.MainParameter.make(x.costNoMod, translation.cost),
                        range: ActivatableSkill$OptolithClient.MainParameter.make(x.rangeNoMod, translation.range),
                        duration: ActivatableSkill$OptolithClient.MainParameter.make(x.durationNoMod, translation.duration),
                        target: translation.target,
                        property: x.property,
                        traditions: x.traditions,
                        ic: x.ic,
                        prerequisites: x.prerequisites,
                        gr: x.gr,
                        enhancements: Curry._2(Ley_Option$OptolithClient.Infix.$great$great$eq, x.enhancements, (function (param) {
                                return Enhancements$OptolithClient.Decode.resolveTranslations(langs, param);
                              })),
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

var Dynamic = ActivatableSkill$OptolithClient.Dynamic;

var Static = {
  Decode: {
    assoc: assoc
  }
};

export {
  Dynamic ,
  Static ,
  
}
/* TranslationMap Not a pure module */
