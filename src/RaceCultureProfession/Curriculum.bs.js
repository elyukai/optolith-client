// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Curry from "bs-platform/lib/es6/curry.js";
import * as Json_decode from "@glennsl/bs-json/src/Json_decode.bs.js";
import * as Decoder$OptolithClient from "../Utilities/Decoder.bs.js";
import * as Erratum$OptolithClient from "../Sources/Erratum.bs.js";
import * as JsonStrict$OptolithClient from "../Misc/JsonStrict.bs.js";
import * as Ley_IntMap$OptolithClient from "../Data/Ley_IntMap.bs.js";
import * as Ley_Option$OptolithClient from "../Data/Ley_Option.bs.js";
import * as PublicationRef$OptolithClient from "../Sources/PublicationRef.bs.js";
import * as TranslationMap$OptolithClient from "../Misc/TranslationMap.bs.js";

var Dynamic = {};

function t(json) {
  return {
          name: Json_decode.field("name", Json_decode.string, json)
        };
}

var LessonPackageTranslation = {
  t: t
};

var LessonPackageTranslationMap = TranslationMap$OptolithClient.Make(LessonPackageTranslation);

function lessonPackageMultilingual(json) {
  return {
          id: JsonStrict$OptolithClient.field("id", JsonStrict$OptolithClient.$$int, json),
          apValue: JsonStrict$OptolithClient.field("apValue", JsonStrict$OptolithClient.$$int, json),
          combatTechniques: Ley_Option$OptolithClient.option(Ley_IntMap$OptolithClient.empty, Ley_IntMap$OptolithClient.fromList, JsonStrict$OptolithClient.optionalField("combatTechniques", (function (param) {
                      return JsonStrict$OptolithClient.list((function (json) {
                                    return [
                                            JsonStrict$OptolithClient.field("id", JsonStrict$OptolithClient.$$int, json),
                                            JsonStrict$OptolithClient.field("value", JsonStrict$OptolithClient.$$int, json)
                                          ];
                                  }), param);
                    }), json)),
          skills: Ley_Option$OptolithClient.option(Ley_IntMap$OptolithClient.empty, Ley_IntMap$OptolithClient.fromList, JsonStrict$OptolithClient.optionalField("skills", (function (param) {
                      return JsonStrict$OptolithClient.list((function (json) {
                                    return [
                                            JsonStrict$OptolithClient.field("id", JsonStrict$OptolithClient.$$int, json),
                                            JsonStrict$OptolithClient.field("value", JsonStrict$OptolithClient.$$int, json)
                                          ];
                                  }), param);
                    }), json)),
          spells: Curry._1(Ley_IntMap$OptolithClient.fromList, JsonStrict$OptolithClient.field("spells", (function (param) {
                      return JsonStrict$OptolithClient.list((function (json) {
                                    return [
                                            JsonStrict$OptolithClient.field("id", JsonStrict$OptolithClient.$$int, json),
                                            JsonStrict$OptolithClient.field("value", JsonStrict$OptolithClient.$$int, json)
                                          ];
                                  }), param);
                    }), json)),
          translations: JsonStrict$OptolithClient.field("translations", LessonPackageTranslationMap.Decode.t, json)
        };
}

function lessonPackageMultilingualAssoc(json) {
  var x = lessonPackageMultilingual(json);
  return [
          x.id,
          x
        ];
}

function resolveLessonPackageTranslations(langs, x) {
  return Curry._2(Ley_Option$OptolithClient.Infix.$less$amp$great, Curry._2(LessonPackageTranslationMap.Decode.getFromLanguageOrder, langs, x.translations), (function (translation) {
                return {
                        id: x.id,
                        name: translation.name,
                        apValue: x.apValue,
                        combatTechniques: x.combatTechniques,
                        skills: x.skills,
                        spells: x.spells
                      };
              }));
}

function restrictedSpellwork(param) {
  return Json_decode.andThen((function (str) {
                switch (str) {
                  case "Borbaradian" :
                      return function (param) {
                        return /* Borbaradian */1;
                      };
                  case "DamageIntelligent" :
                      return function (param) {
                        return /* DamageIntelligent */2;
                      };
                  case "DemonSummoning" :
                      return function (param) {
                        return /* DemonSummoning */0;
                      };
                  case "OneFromProperty" :
                      return function (param) {
                        return Json_decode.map((function (id) {
                                      return {
                                              TAG: /* OneFromProperty */2,
                                              _0: id
                                            };
                                    }), (function (param) {
                                      return Json_decode.field("value", Json_decode.$$int, param);
                                    }), param);
                      };
                  case "Property" :
                      return function (param) {
                        return Json_decode.map((function (id) {
                                      return {
                                              TAG: /* Property */1,
                                              _0: id
                                            };
                                    }), (function (param) {
                                      return Json_decode.field("value", Json_decode.$$int, param);
                                    }), param);
                      };
                  case "Spell" :
                      return function (param) {
                        return Json_decode.map((function (id) {
                                      return {
                                              TAG: /* Spell */0,
                                              _0: id
                                            };
                                    }), (function (param) {
                                      return Json_decode.field("value", Json_decode.$$int, param);
                                    }), param);
                      };
                  default:
                    throw {
                          RE_EXN_ID: Json_decode.DecodeError,
                          _1: "Unknown restricted spellwork type: " + str,
                          Error: new Error()
                        };
                }
              }), (function (param) {
                return Json_decode.field("type", Json_decode.string, param);
              }), param);
}

function t$1(json) {
  return {
          name: Json_decode.field("name", Json_decode.string, json),
          errata: Json_decode.field("errata", Erratum$OptolithClient.Decode.list, json)
        };
}

var Translation = {
  t: t$1
};

var TranslationMap = TranslationMap$OptolithClient.Make(Translation);

function multilingual(json) {
  return {
          id: Json_decode.field("id", Json_decode.$$int, json),
          guideline: Json_decode.field("guideline", Json_decode.$$int, json),
          electiveSpellworks: Json_decode.field("electiveSpellworks", (function (param) {
                  return Json_decode.list(Json_decode.$$int, param);
                }), json),
          restrictedSpellworks: Json_decode.field("restrictedSpellworks", (function (param) {
                  return Json_decode.list(restrictedSpellwork, param);
                }), json),
          lessonPackages: Curry._1(Ley_IntMap$OptolithClient.fromList, Json_decode.field("lessonPackages", (function (param) {
                      return Json_decode.list(lessonPackageMultilingualAssoc, param);
                    }), json)),
          src: Json_decode.field("src", PublicationRef$OptolithClient.Decode.multilingualList, json),
          translations: Json_decode.field("translations", TranslationMap.Decode.t, json)
        };
}

function resolveTranslations(langs, x) {
  return Curry._2(Ley_Option$OptolithClient.Infix.$less$amp$great, Curry._2(TranslationMap.Decode.getFromLanguageOrder, langs, x.translations), (function (translation) {
                return {
                        id: x.id,
                        name: translation.name,
                        guideline: x.guideline,
                        electiveSpellworks: x.electiveSpellworks,
                        restrictedSpellworks: x.restrictedSpellworks,
                        lessonPackages: Curry._2(Ley_IntMap$OptolithClient.mapMaybe, (function (param) {
                                return resolveLessonPackageTranslations(langs, param);
                              }), x.lessonPackages),
                        src: PublicationRef$OptolithClient.Decode.resolveTranslationsList(langs, x.src),
                        errata: translation.errata
                      };
              }));
}

function t$2(langs, json) {
  return resolveTranslations(langs, multilingual(json));
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

var Decode = {
  LessonPackageTranslation: LessonPackageTranslation,
  LessonPackageTranslationMap: LessonPackageTranslationMap,
  lessonPackageMultilingual: lessonPackageMultilingual,
  lessonPackageMultilingualAssoc: lessonPackageMultilingualAssoc,
  resolveLessonPackageTranslations: resolveLessonPackageTranslations,
  restrictedSpellwork: restrictedSpellwork,
  Translation: Translation,
  TranslationMap: TranslationMap,
  multilingual: multilingual,
  resolveTranslations: resolveTranslations,
  t: t$2,
  toAssoc: toAssoc,
  assoc: assoc
};

var Static = {
  Decode: Decode
};

export {
  Dynamic ,
  Static ,
  
}
/* LessonPackageTranslationMap Not a pure module */
