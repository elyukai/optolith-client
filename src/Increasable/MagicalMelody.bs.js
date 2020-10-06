// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE

import * as Curry from "bs-platform/lib/es6/curry.js";
import * as IC$OptolithClient from "./IC.bs.js";
import * as Decoder$OptolithClient from "../Utilities/Decoder.bs.js";
import * as Erratum$OptolithClient from "../Sources/Erratum.bs.js";
import * as OneOrMany$OptolithClient from "../Utilities/OneOrMany.bs.js";
import * as JsonStrict$OptolithClient from "../Misc/JsonStrict.bs.js";
import * as Ley_IntMap$OptolithClient from "../Data/Ley_IntMap.bs.js";
import * as Ley_Option$OptolithClient from "../Data/Ley_Option.bs.js";
import * as SkillCheck$OptolithClient from "./SkillCheck.bs.js";
import * as PublicationRef$OptolithClient from "../Sources/PublicationRef.bs.js";
import * as TranslationMap$OptolithClient from "../Misc/TranslationMap.bs.js";
import * as ActivatableSkill$OptolithClient from "./ActivatableSkill.bs.js";

function t(json) {
  return JsonStrict$OptolithClient.field("name", JsonStrict$OptolithClient.string, json);
}

var MusicTraditionTranslation = {
  t: t
};

var MusicTraditionTranslationMap = TranslationMap$OptolithClient.Make(MusicTraditionTranslation);

function musicTraditionMultilingual(json) {
  return {
          id: JsonStrict$OptolithClient.field("id", JsonStrict$OptolithClient.$$int, json),
          translations: JsonStrict$OptolithClient.field("translations", MusicTraditionTranslationMap.Decode.t, json)
        };
}

function musicTraditionMultilingualAssoc(json) {
  var x = musicTraditionMultilingual(json);
  return [
          x.id,
          x
        ];
}

function t$1(json) {
  return {
          name: JsonStrict$OptolithClient.field("name", JsonStrict$OptolithClient.string, json),
          effect: JsonStrict$OptolithClient.field("effect", JsonStrict$OptolithClient.string, json),
          duration: JsonStrict$OptolithClient.field("duration", ActivatableSkill$OptolithClient.MainParameter.decode, json),
          cost: JsonStrict$OptolithClient.field("cost", ActivatableSkill$OptolithClient.MainParameter.decode, json),
          target: JsonStrict$OptolithClient.field("target", JsonStrict$OptolithClient.string, json),
          errata: JsonStrict$OptolithClient.field("errata", Erratum$OptolithClient.Decode.list, json)
        };
}

var Translation = {
  t: t$1
};

var TranslationMap = TranslationMap$OptolithClient.Make(Translation);

function multilingual(json) {
  return {
          id: JsonStrict$OptolithClient.field("id", JsonStrict$OptolithClient.$$int, json),
          check: JsonStrict$OptolithClient.field("check", SkillCheck$OptolithClient.Decode.t, json),
          skill: JsonStrict$OptolithClient.field("skill", OneOrMany$OptolithClient.Decode.t(JsonStrict$OptolithClient.$$int), json),
          musicTraditions: Curry._1(Ley_IntMap$OptolithClient.fromList, JsonStrict$OptolithClient.field("musicTraditions", (function (param) {
                      return JsonStrict$OptolithClient.list(musicTraditionMultilingualAssoc, param);
                    }), json)),
          property: JsonStrict$OptolithClient.field("property", JsonStrict$OptolithClient.$$int, json),
          ic: JsonStrict$OptolithClient.field("ic", IC$OptolithClient.Decode.t, json),
          src: JsonStrict$OptolithClient.field("src", PublicationRef$OptolithClient.Decode.multilingualList, json),
          translations: JsonStrict$OptolithClient.field("translations", TranslationMap.Decode.t, json)
        };
}

function t$2(langs, json) {
  var x = multilingual(json);
  return Curry._2(Ley_Option$OptolithClient.Infix.$less$amp$great, Curry._2(TranslationMap.Decode.getFromLanguageOrder, langs, x.translations), (function (translation) {
                return {
                        id: x.id,
                        name: translation.name,
                        check: x.check,
                        effect: translation.effect,
                        duration: ActivatableSkill$OptolithClient.MainParameter.make(false, translation.duration),
                        cost: ActivatableSkill$OptolithClient.MainParameter.make(false, translation.cost),
                        skill: x.skill,
                        musicTraditions: Curry._2(Ley_IntMap$OptolithClient.mapMaybe, (function (musicTradition) {
                                return Curry._2(MusicTraditionTranslationMap.Decode.getFromLanguageOrder, langs, musicTradition.translations);
                              }), x.musicTraditions),
                        property: x.property,
                        ic: x.ic,
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
  return Decoder$OptolithClient.decodeAssoc(t$2, toAssoc, param, param$1);
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
/* MusicTraditionTranslationMap Not a pure module */
