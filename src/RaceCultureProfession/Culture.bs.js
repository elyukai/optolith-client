// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE

import * as Curry from "bs-platform/lib/es6/curry.js";
import * as Erratum$OptolithClient from "../Sources/Erratum.bs.js";
import * as JsonStrict$OptolithClient from "../Misc/JsonStrict.bs.js";
import * as Ley_IntMap$OptolithClient from "../Data/Ley_IntMap.bs.js";
import * as Ley_Option$OptolithClient from "../Data/Ley_Option.bs.js";
import * as PublicationRef$OptolithClient from "../Sources/PublicationRef.bs.js";
import * as TranslationMap$OptolithClient from "../Misc/TranslationMap.bs.js";

var Dynamic = {};

function decode(json) {
  return {
          name: JsonStrict$OptolithClient.field("name", JsonStrict$OptolithClient.string, json),
          areaKnowledge: JsonStrict$OptolithClient.field("areaKnowledge", JsonStrict$OptolithClient.string, json),
          areaKnowledgeShort: JsonStrict$OptolithClient.field("areaKnowledgeShort", JsonStrict$OptolithClient.string, json),
          commonMundaneProfessions: JsonStrict$OptolithClient.optionalField("commonMundaneProfessions", JsonStrict$OptolithClient.string, json),
          commonMagicalProfessions: JsonStrict$OptolithClient.optionalField("commonMagicalProfessions", JsonStrict$OptolithClient.string, json),
          commonBlessedProfessions: JsonStrict$OptolithClient.optionalField("commonBlessedProfessions", JsonStrict$OptolithClient.string, json),
          commonAdvantages: JsonStrict$OptolithClient.optionalField("commonAdvantages", JsonStrict$OptolithClient.string, json),
          commonDisadvantages: JsonStrict$OptolithClient.optionalField("commonDisadvantages", JsonStrict$OptolithClient.string, json),
          uncommonAdvantages: JsonStrict$OptolithClient.optionalField("uncommonAdvantages", JsonStrict$OptolithClient.string, json),
          uncommonDisadvantages: JsonStrict$OptolithClient.optionalField("uncommonDisadvantages", JsonStrict$OptolithClient.string, json),
          commonNames: JsonStrict$OptolithClient.field("commonNames", JsonStrict$OptolithClient.string, json),
          errata: JsonStrict$OptolithClient.field("errata", Erratum$OptolithClient.decodeList, json)
        };
}

var Translations = {
  decode: decode
};

var TranslationMap = TranslationMap$OptolithClient.Make(Translations);

function decodeFrequencyException(param) {
  return JsonStrict$OptolithClient.andThen((function (str) {
                switch (str) {
                  case "Group" :
                      return function (json) {
                        return {
                                TAG: /* Group */1,
                                _0: JsonStrict$OptolithClient.field("value", JsonStrict$OptolithClient.$$int, json)
                              };
                      };
                  case "Single" :
                      return function (json) {
                        return {
                                TAG: /* Single */0,
                                _0: JsonStrict$OptolithClient.field("value", JsonStrict$OptolithClient.$$int, json)
                              };
                      };
                  default:
                    throw {
                          RE_EXN_ID: JsonStrict$OptolithClient.DecodeError,
                          _1: "Unknown frequency exception: " + str,
                          Error: new Error()
                        };
                }
              }), (function (param) {
                return JsonStrict$OptolithClient.field("scope", JsonStrict$OptolithClient.string, param);
              }), param);
}

function decodeMultilingual(json) {
  return {
          id: JsonStrict$OptolithClient.field("id", JsonStrict$OptolithClient.$$int, json),
          languages: JsonStrict$OptolithClient.field("languages", (function (param) {
                  return JsonStrict$OptolithClient.list(JsonStrict$OptolithClient.$$int, param);
                }), json),
          literacy: JsonStrict$OptolithClient.optionalField("literacy", (function (param) {
                  return JsonStrict$OptolithClient.list(JsonStrict$OptolithClient.$$int, param);
                }), json),
          social: JsonStrict$OptolithClient.field("social", (function (param) {
                  return JsonStrict$OptolithClient.list(JsonStrict$OptolithClient.$$int, param);
                }), json),
          commonMundaneProfessionsAll: JsonStrict$OptolithClient.field("commonMundaneProfessionsAll", JsonStrict$OptolithClient.bool, json),
          commonMundaneProfessionsExceptions: JsonStrict$OptolithClient.optionalField("commonMundaneProfessionsExceptions", (function (param) {
                  return JsonStrict$OptolithClient.list(decodeFrequencyException, param);
                }), json),
          commonMagicalProfessionsAll: JsonStrict$OptolithClient.field("commonMagicalProfessionsAll", JsonStrict$OptolithClient.bool, json),
          commonMagicalProfessionsExceptions: JsonStrict$OptolithClient.optionalField("commonMagicalProfessionsExceptions", (function (param) {
                  return JsonStrict$OptolithClient.list(decodeFrequencyException, param);
                }), json),
          commonBlessedProfessionsAll: JsonStrict$OptolithClient.field("commonBlessedProfessionsAll", JsonStrict$OptolithClient.bool, json),
          commonBlessedProfessionsExceptions: JsonStrict$OptolithClient.optionalField("commonBlessedProfessionsExceptions", (function (param) {
                  return JsonStrict$OptolithClient.list(decodeFrequencyException, param);
                }), json),
          commonAdvantages: Ley_Option$OptolithClient.fromOption(/* [] */0, JsonStrict$OptolithClient.optionalField("commonAdvantages", (function (param) {
                      return JsonStrict$OptolithClient.list(JsonStrict$OptolithClient.$$int, param);
                    }), json)),
          commonDisadvantages: Ley_Option$OptolithClient.fromOption(/* [] */0, JsonStrict$OptolithClient.optionalField("commonDisadvantages", (function (param) {
                      return JsonStrict$OptolithClient.list(JsonStrict$OptolithClient.$$int, param);
                    }), json)),
          uncommonAdvantages: Ley_Option$OptolithClient.fromOption(/* [] */0, JsonStrict$OptolithClient.optionalField("uncommonAdvantages", (function (param) {
                      return JsonStrict$OptolithClient.list(JsonStrict$OptolithClient.$$int, param);
                    }), json)),
          uncommonDisadvantages: Ley_Option$OptolithClient.fromOption(/* [] */0, JsonStrict$OptolithClient.optionalField("uncommonDisadvantages", (function (param) {
                      return JsonStrict$OptolithClient.list(JsonStrict$OptolithClient.$$int, param);
                    }), json)),
          commonSkills: JsonStrict$OptolithClient.field("commonSkills", (function (param) {
                  return JsonStrict$OptolithClient.list(JsonStrict$OptolithClient.$$int, param);
                }), json),
          uncommonSkills: Ley_Option$OptolithClient.fromOption(/* [] */0, JsonStrict$OptolithClient.optionalField("uncommonSkills", (function (param) {
                      return JsonStrict$OptolithClient.list(JsonStrict$OptolithClient.$$int, param);
                    }), json)),
          culturalPackageApValue: JsonStrict$OptolithClient.field("culturalPackageApValue", JsonStrict$OptolithClient.$$int, json),
          culturalPackageSkills: Curry._1(Ley_IntMap$OptolithClient.fromList, JsonStrict$OptolithClient.field("culturalPackageSkills", (function (param) {
                      return JsonStrict$OptolithClient.list((function (param) {
                                    return JsonStrict$OptolithClient.pair(JsonStrict$OptolithClient.$$int, JsonStrict$OptolithClient.$$int, param);
                                  }), param);
                    }), json)),
          src: JsonStrict$OptolithClient.field("src", PublicationRef$OptolithClient.decodeMultilingualList, json),
          translations: JsonStrict$OptolithClient.field("translations", TranslationMap.decode, json)
        };
}

function decode$1(langs, json) {
  var x = decodeMultilingual(json);
  return Ley_Option$OptolithClient.Functor.$less$amp$great(Curry._2(TranslationMap.getFromLanguageOrder, langs, x.translations), (function (translation) {
                return {
                        id: x.id,
                        name: translation.name,
                        language: x.languages,
                        script: x.literacy,
                        areaKnowledge: translation.areaKnowledge,
                        areaKnowledgeShort: translation.areaKnowledgeShort,
                        socialStatus: x.social,
                        commonMundaneProfessionsAll: x.commonMundaneProfessionsAll,
                        commonMundaneProfessionsExceptions: x.commonMundaneProfessionsExceptions,
                        commonMundaneProfessionsText: translation.commonMundaneProfessions,
                        commonMagicProfessionsAll: x.commonMagicalProfessionsAll,
                        commonMagicProfessionsExceptions: x.commonMagicalProfessionsExceptions,
                        commonMagicProfessionsText: translation.commonMagicalProfessions,
                        commonBlessedProfessionsAll: x.commonBlessedProfessionsAll,
                        commonBlessedProfessionsExceptions: x.commonBlessedProfessionsExceptions,
                        commonBlessedProfessionsText: translation.commonBlessedProfessions,
                        commonAdvantages: x.commonAdvantages,
                        commonAdvantagesText: translation.commonAdvantages,
                        commonDisadvantages: x.commonDisadvantages,
                        commonDisadvantagesText: translation.commonDisadvantages,
                        uncommonAdvantages: x.uncommonAdvantages,
                        uncommonAdvantagesText: translation.uncommonAdvantages,
                        uncommonDisadvantages: x.uncommonDisadvantages,
                        uncommonDisadvantagesText: translation.uncommonDisadvantages,
                        commonSkills: x.commonSkills,
                        uncommonSkills: x.uncommonSkills,
                        commonNames: translation.commonNames,
                        culturalPackageApValue: x.culturalPackageApValue,
                        culturalPackageSkills: x.culturalPackageSkills,
                        src: PublicationRef$OptolithClient.resolveTranslationsList(langs, x.src),
                        errata: translation.errata
                      };
              }));
}

var Static = {
  decode: decode$1
};

export {
  Dynamic ,
  Static ,
  
}
/* TranslationMap Not a pure module */
