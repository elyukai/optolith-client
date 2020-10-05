// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE

import * as Curry from "bs-platform/lib/es6/curry.js";
import * as Caml_obj from "bs-platform/lib/es6/caml_obj.js";
import * as Json_decode from "@glennsl/bs-json/src/Json_decode.bs.js";
import * as Id$OptolithClient from "../Misc/Id.bs.js";
import * as Erratum$OptolithClient from "../Sources/Erratum.bs.js";
import * as Ley_Int$OptolithClient from "../Data/Ley_Int.bs.js";
import * as Advantage$OptolithClient from "./Advantage.bs.js";
import * as OneOrMany$OptolithClient from "../Utilities/OneOrMany.bs.js";
import * as JsonStrict$OptolithClient from "../Misc/JsonStrict.bs.js";
import * as Ley_IntMap$OptolithClient from "../Data/Ley_IntMap.bs.js";
import * as Ley_Option$OptolithClient from "../Data/Ley_Option.bs.js";
import * as Prerequisite$OptolithClient from "../Prerequisites/Prerequisite.bs.js";
import * as SelectOption$OptolithClient from "./SelectOption.bs.js";
import * as PublicationRef$OptolithClient from "../Sources/PublicationRef.bs.js";
import * as TranslationMap$OptolithClient from "../Misc/TranslationMap.bs.js";

function decode(json) {
  return {
          name: JsonStrict$OptolithClient.field("name", JsonStrict$OptolithClient.string, json),
          nameInWiki: JsonStrict$OptolithClient.optionalField("nameInWiki", JsonStrict$OptolithClient.string, json),
          rules: JsonStrict$OptolithClient.optionalField("rules", JsonStrict$OptolithClient.string, json),
          effect: JsonStrict$OptolithClient.optionalField("effect", JsonStrict$OptolithClient.string, json),
          input: JsonStrict$OptolithClient.optionalField("input", JsonStrict$OptolithClient.string, json),
          penalty: JsonStrict$OptolithClient.optionalField("penalty", JsonStrict$OptolithClient.string, json),
          combatTechniques: JsonStrict$OptolithClient.optionalField("combatTechniques", JsonStrict$OptolithClient.string, json),
          aeCost: JsonStrict$OptolithClient.optionalField("aeCost", JsonStrict$OptolithClient.string, json),
          protectiveCircle: JsonStrict$OptolithClient.optionalField("protectiveCircle", JsonStrict$OptolithClient.string, json),
          wardingCircle: JsonStrict$OptolithClient.optionalField("wardingCircle", JsonStrict$OptolithClient.string, json),
          volume: JsonStrict$OptolithClient.optionalField("volume", JsonStrict$OptolithClient.string, json),
          bindingCost: JsonStrict$OptolithClient.optionalField("bindingCost", JsonStrict$OptolithClient.string, json),
          property: JsonStrict$OptolithClient.optionalField("property", JsonStrict$OptolithClient.string, json),
          prerequisites: JsonStrict$OptolithClient.optionalField("prerequisites", JsonStrict$OptolithClient.string, json),
          prerequisitesStart: JsonStrict$OptolithClient.optionalField("prerequisitesStart", JsonStrict$OptolithClient.string, json),
          prerequisitesEnd: JsonStrict$OptolithClient.optionalField("prerequisitesEnd", JsonStrict$OptolithClient.string, json),
          apValue: JsonStrict$OptolithClient.optionalField("apValue", JsonStrict$OptolithClient.string, json),
          apValueAppend: JsonStrict$OptolithClient.optionalField("apValueAppend", JsonStrict$OptolithClient.string, json),
          errata: JsonStrict$OptolithClient.field("errata", Erratum$OptolithClient.decodeList, json)
        };
}

var Translations = {
  decode: decode
};

var TranslationMap = TranslationMap$OptolithClient.Make(Translations);

function partial_arg_0(json) {
  return /* List */{
          _0: Json_decode.list(Json_decode.$$int, json)
        };
}

var partial_arg_1 = {
  hd: (function (json) {
      var x = Json_decode.$$int(json);
      var switcher = x - 1 | 0;
      if (switcher > 4 || switcher < 0) {
        throw {
              RE_EXN_ID: Json_decode.DecodeError,
              _1: "Unknown combat technique category: " + Ley_Int$OptolithClient.show(x),
              Error: new Error()
            };
      }
      return switcher;
    }),
  tl: /* [] */0
};

var partial_arg = {
  hd: partial_arg_0,
  tl: partial_arg_1
};

function decodeCombatTechniques(param) {
  return Json_decode.oneOf(partial_arg, param);
}

function decodeMultilingual(json) {
  var partial_arg = OneOrMany$OptolithClient.Decode.t(JsonStrict$OptolithClient.$$int);
  return {
          id: JsonStrict$OptolithClient.field("id", JsonStrict$OptolithClient.$$int, json),
          levels: JsonStrict$OptolithClient.optionalField("levels", JsonStrict$OptolithClient.$$int, json),
          max: JsonStrict$OptolithClient.optionalField("max", JsonStrict$OptolithClient.$$int, json),
          selectOptionCategories: JsonStrict$OptolithClient.optionalField("selectOptionCategories", (function (param) {
                  return JsonStrict$OptolithClient.list(SelectOption$OptolithClient.Category.WithGroups.decode, param);
                }), json),
          selectOptions: Ley_Option$OptolithClient.option(SelectOption$OptolithClient.$$Map.empty, SelectOption$OptolithClient.$$Map.fromList, JsonStrict$OptolithClient.optionalField("selectOptions", (function (param) {
                      return JsonStrict$OptolithClient.list(SelectOption$OptolithClient.decodeMultilingualPair, param);
                    }), json)),
          extended: JsonStrict$OptolithClient.optionalField("extended", (function (param) {
                  return JsonStrict$OptolithClient.list(partial_arg, param);
                }), json),
          combatTechniques: JsonStrict$OptolithClient.optionalField("combatTechniques", decodeCombatTechniques, json),
          property: JsonStrict$OptolithClient.optionalField("property", JsonStrict$OptolithClient.$$int, json),
          aspect: JsonStrict$OptolithClient.optionalField("aspect", JsonStrict$OptolithClient.$$int, json),
          brew: JsonStrict$OptolithClient.optionalField("brew", JsonStrict$OptolithClient.$$int, json),
          prerequisites: JsonStrict$OptolithClient.field("prerequisites", Prerequisite$OptolithClient.Collection.General.decodeMultilingual, json),
          apValue: JsonStrict$OptolithClient.optionalField("apValue", Advantage$OptolithClient.Static.decodeApValue, json),
          gr: JsonStrict$OptolithClient.field("gr", JsonStrict$OptolithClient.$$int, json),
          subgr: JsonStrict$OptolithClient.optionalField("subgr", JsonStrict$OptolithClient.$$int, json),
          src: JsonStrict$OptolithClient.field("src", PublicationRef$OptolithClient.decodeMultilingualList, json),
          translations: JsonStrict$OptolithClient.field("translations", TranslationMap.decode, json)
        };
}

function decode$1(blessings, cantrips, combatTechniques, liturgicalChants, skills, spells, langs, json) {
  var x = decodeMultilingual(json);
  return Curry._2(Ley_Option$OptolithClient.Infix.$less$amp$great, Curry._2(TranslationMap.getFromLanguageOrder, langs, x.translations), (function (translation) {
                return [
                        x.id,
                        {
                          id: x.id,
                          name: translation.name,
                          nameInWiki: translation.nameInWiki,
                          levels: x.levels,
                          max: x.max,
                          rules: translation.rules,
                          effect: translation.effect,
                          selectOptions: SelectOption$OptolithClient.ResolveCategories.mergeSelectOptions(Curry._2(SelectOption$OptolithClient.$$Map.mapMaybe, (function (param) {
                                      return SelectOption$OptolithClient.resolveTranslations(langs, param);
                                    }), x.selectOptions), SelectOption$OptolithClient.ResolveCategories.resolveCategories(blessings, cantrips, combatTechniques, liturgicalChants, skills, spells, x.selectOptionCategories)),
                          input: translation.input,
                          penalty: translation.penalty,
                          combatTechniques: x.combatTechniques,
                          combatTechniquesText: translation.combatTechniques,
                          aeCost: translation.aeCost,
                          protectiveCircle: translation.protectiveCircle,
                          wardingCircle: translation.wardingCircle,
                          volume: translation.volume,
                          bindingCost: translation.bindingCost,
                          property: x.property,
                          propertyText: translation.property,
                          aspect: x.aspect,
                          brew: x.brew,
                          extended: x.extended,
                          prerequisites: Curry._2(Prerequisite$OptolithClient.Collection.General.resolveTranslations, langs, x.prerequisites),
                          prerequisitesText: translation.prerequisites,
                          prerequisitesTextStart: translation.prerequisitesStart,
                          prerequisitesTextEnd: translation.prerequisitesEnd,
                          apValue: x.apValue,
                          apValueText: translation.apValue,
                          apValueTextAppend: translation.apValueAppend,
                          gr: x.gr,
                          subgr: x.subgr,
                          src: PublicationRef$OptolithClient.resolveTranslationsList(langs, x.src),
                          errata: translation.errata
                        }
                      ];
              }));
}

function modifyParsed(specialAbilities) {
  return Curry._3(Ley_IntMap$OptolithClient.adjust, (function (specialAbility) {
                return Ley_Option$OptolithClient.option(specialAbility, (function (language) {
                              var newrecord = Caml_obj.caml_obj_dup(specialAbility);
                              newrecord.selectOptions = language.selectOptions;
                              return newrecord;
                            }), Curry._2(Ley_IntMap$OptolithClient.lookup, Id$OptolithClient.SpecialAbility.toInt(/* Language */6), specialAbilities));
              }), Id$OptolithClient.SpecialAbility.toInt(/* LanguageSpecializations */71), specialAbilities);
}

var Static = {
  decode: decode$1,
  modifyParsed: modifyParsed
};

export {
  Static ,
  
}
/* TranslationMap Not a pure module */