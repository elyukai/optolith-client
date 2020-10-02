// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE

import * as Curry from "bs-platform/lib/es6/curry.js";
import * as Dice$OptolithClient from "../Misc/Dice.bs.js";
import * as Erratum$OptolithClient from "../Sources/Erratum.bs.js";
import * as JsonStrict$OptolithClient from "../Misc/JsonStrict.bs.js";
import * as Ley_IntMap$OptolithClient from "../Data/Ley_IntMap.bs.js";
import * as Ley_IntSet$OptolithClient from "../Data/Ley_IntSet.bs.js";
import * as Ley_Option$OptolithClient from "../Data/Ley_Option.bs.js";
import * as PublicationRef$OptolithClient from "../Sources/PublicationRef.bs.js";
import * as TranslationMap$OptolithClient from "../Misc/TranslationMap.bs.js";

var Dynamic = {};

function decode(json) {
  return {
          name: JsonStrict$OptolithClient.field("name", JsonStrict$OptolithClient.string, json),
          commonAdvantages: JsonStrict$OptolithClient.optionalField("commonAdvantages", JsonStrict$OptolithClient.string, json),
          commonDisadvantages: JsonStrict$OptolithClient.optionalField("commonDisadvantages", JsonStrict$OptolithClient.string, json),
          uncommonAdvantages: JsonStrict$OptolithClient.optionalField("uncommonAdvantages", JsonStrict$OptolithClient.string, json),
          uncommonDisadvantages: JsonStrict$OptolithClient.optionalField("uncommonDisadvantages", JsonStrict$OptolithClient.string, json)
        };
}

var Translations = {
  decode: decode
};

var TranslationMap = TranslationMap$OptolithClient.Make(Translations);

function decodeMultilingual(json) {
  return {
          id: JsonStrict$OptolithClient.field("id", JsonStrict$OptolithClient.$$int, json),
          commonCultures: Curry._1(Ley_IntSet$OptolithClient.fromList, JsonStrict$OptolithClient.field("commonCultures", (function (param) {
                      return JsonStrict$OptolithClient.list(JsonStrict$OptolithClient.$$int, param);
                    }), json)),
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
          hairColors: JsonStrict$OptolithClient.field("hairColors", (function (param) {
                  return JsonStrict$OptolithClient.list(JsonStrict$OptolithClient.$$int, param);
                }), json),
          eyeColors: JsonStrict$OptolithClient.field("eyeColors", (function (param) {
                  return JsonStrict$OptolithClient.list(JsonStrict$OptolithClient.$$int, param);
                }), json),
          sizeBase: JsonStrict$OptolithClient.field("sizeBase", JsonStrict$OptolithClient.$$int, json),
          sizeRandom: JsonStrict$OptolithClient.field("sizeRandom", (function (param) {
                  return JsonStrict$OptolithClient.list(Dice$OptolithClient.Decode.t, param);
                }), json),
          translations: JsonStrict$OptolithClient.field("translations", TranslationMap.decode, json)
        };
}

function decodeMultilingualPair(json) {
  var variant = decodeMultilingual(json);
  return [
          variant.id,
          variant
        ];
}

function decode$1(json) {
  return {
          name: JsonStrict$OptolithClient.field("name", JsonStrict$OptolithClient.string, json),
          attributeAdjustments: JsonStrict$OptolithClient.field("attributeAdjustments", JsonStrict$OptolithClient.string, json),
          automaticAdvantages: JsonStrict$OptolithClient.optionalField("automaticAdvantages", JsonStrict$OptolithClient.string, json),
          stronglyRecommendedAdvantages: JsonStrict$OptolithClient.optionalField("stronglyRecommendedAdvantages", JsonStrict$OptolithClient.string, json),
          stronglyRecommendedDisadvantages: JsonStrict$OptolithClient.optionalField("stronglyRecommendedDisadvantages", JsonStrict$OptolithClient.string, json),
          commonAdvantages: JsonStrict$OptolithClient.optionalField("commonAdvantages", JsonStrict$OptolithClient.string, json),
          commonDisadvantages: JsonStrict$OptolithClient.optionalField("commonDisadvantages", JsonStrict$OptolithClient.string, json),
          uncommonAdvantages: JsonStrict$OptolithClient.optionalField("uncommonAdvantages", JsonStrict$OptolithClient.string, json),
          uncommonDisadvantages: JsonStrict$OptolithClient.optionalField("uncommonDisadvantages", JsonStrict$OptolithClient.string, json),
          errata: JsonStrict$OptolithClient.field("errata", Erratum$OptolithClient.decodeList, json)
        };
}

var Translations$1 = {
  decode: decode$1
};

var TranslationMap$1 = TranslationMap$OptolithClient.Make(Translations$1);

function decodeVariantOptions(param) {
  return JsonStrict$OptolithClient.andThen((function (str) {
                switch (str) {
                  case "WithVariants" :
                      return function (json) {
                        return {
                                TAG: /* WithVariants */0,
                                variants: Curry._1(Ley_IntMap$OptolithClient.fromList, JsonStrict$OptolithClient.field("variants", (function (param) {
                                            return JsonStrict$OptolithClient.list(decodeMultilingualPair, param);
                                          }), json))
                              };
                      };
                  case "WithoutVariants" :
                      return function (json) {
                        return {
                                TAG: /* WithoutVariants */1,
                                commonCultures: Curry._1(Ley_IntSet$OptolithClient.fromList, JsonStrict$OptolithClient.field("commonCultures", (function (param) {
                                            return JsonStrict$OptolithClient.list(JsonStrict$OptolithClient.$$int, param);
                                          }), json)),
                                hairColors: JsonStrict$OptolithClient.field("hairColors", (function (param) {
                                        return JsonStrict$OptolithClient.list(JsonStrict$OptolithClient.$$int, param);
                                      }), json),
                                eyeColors: JsonStrict$OptolithClient.field("eyeColors", (function (param) {
                                        return JsonStrict$OptolithClient.list(JsonStrict$OptolithClient.$$int, param);
                                      }), json),
                                sizeBase: JsonStrict$OptolithClient.field("sizeBase", JsonStrict$OptolithClient.$$int, json),
                                sizeRandom: JsonStrict$OptolithClient.field("sizeRandom", (function (param) {
                                        return JsonStrict$OptolithClient.list(Dice$OptolithClient.Decode.t, param);
                                      }), json)
                              };
                      };
                  default:
                    throw {
                          RE_EXN_ID: JsonStrict$OptolithClient.DecodeError,
                          _1: "Unknown variant options: " + str,
                          Error: new Error()
                        };
                }
              }), (function (param) {
                return JsonStrict$OptolithClient.field("type", JsonStrict$OptolithClient.string, param);
              }), param);
}

function decodeMultilingual$1(json) {
  return {
          id: JsonStrict$OptolithClient.field("id", JsonStrict$OptolithClient.$$int, json),
          apValue: JsonStrict$OptolithClient.field("apValue", JsonStrict$OptolithClient.$$int, json),
          lp: JsonStrict$OptolithClient.field("lp", JsonStrict$OptolithClient.$$int, json),
          spi: JsonStrict$OptolithClient.field("spi", JsonStrict$OptolithClient.$$int, json),
          tou: JsonStrict$OptolithClient.field("tou", JsonStrict$OptolithClient.$$int, json),
          mov: JsonStrict$OptolithClient.field("mov", JsonStrict$OptolithClient.$$int, json),
          attributeAdjustments: Ley_Option$OptolithClient.option(Ley_IntMap$OptolithClient.empty, Ley_IntMap$OptolithClient.fromList, JsonStrict$OptolithClient.optionalField("attributeAdjustments", (function (param) {
                      return JsonStrict$OptolithClient.list((function (param) {
                                    return JsonStrict$OptolithClient.pair(JsonStrict$OptolithClient.$$int, JsonStrict$OptolithClient.$$int, param);
                                  }), param);
                    }), json)),
          attributeAdjustmentsSelectionValue: JsonStrict$OptolithClient.field("attributeAdjustmentsSelectionValue", JsonStrict$OptolithClient.$$int, json),
          attributeAdjustmentsSelectionList: Curry._1(Ley_IntSet$OptolithClient.fromList, JsonStrict$OptolithClient.field("attributeAdjustmentsSelectionList", (function (param) {
                      return JsonStrict$OptolithClient.list(JsonStrict$OptolithClient.$$int, param);
                    }), json)),
          automaticAdvantages: Ley_Option$OptolithClient.fromOption(/* [] */0, JsonStrict$OptolithClient.optionalField("automaticAdvantages", (function (param) {
                      return JsonStrict$OptolithClient.list(JsonStrict$OptolithClient.$$int, param);
                    }), json)),
          stronglyRecommendedAdvantages: Ley_Option$OptolithClient.fromOption(/* [] */0, JsonStrict$OptolithClient.optionalField("stronglyRecommendedAdvantages", (function (param) {
                      return JsonStrict$OptolithClient.list(JsonStrict$OptolithClient.$$int, param);
                    }), json)),
          stronglyRecommendedDisadvantages: Ley_Option$OptolithClient.fromOption(/* [] */0, JsonStrict$OptolithClient.optionalField("stronglyRecommendedDisadvantages", (function (param) {
                      return JsonStrict$OptolithClient.list(JsonStrict$OptolithClient.$$int, param);
                    }), json)),
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
          weightBase: JsonStrict$OptolithClient.field("weightBase", JsonStrict$OptolithClient.$$int, json),
          weightRandom: JsonStrict$OptolithClient.field("weightRandom", (function (param) {
                  return JsonStrict$OptolithClient.list(Dice$OptolithClient.Decode.t, param);
                }), json),
          variantOptions: JsonStrict$OptolithClient.field("typeSpecific", decodeVariantOptions, json),
          src: JsonStrict$OptolithClient.field("src", PublicationRef$OptolithClient.decodeMultilingualList, json),
          translations: JsonStrict$OptolithClient.field("translations", TranslationMap$1.decode, json)
        };
}

function decode$2(langs, json) {
  var x = decodeMultilingual$1(json);
  return Ley_Option$OptolithClient.Functor.$less$amp$great(Curry._2(TranslationMap$1.getFromLanguageOrder, langs, x.translations), (function (translation) {
                var options = x.variantOptions;
                var tmp;
                tmp = options.TAG ? ({
                      TAG: /* WithoutVariants */1,
                      commonCultures: options.commonCultures,
                      hairColors: options.hairColors,
                      eyeColors: options.eyeColors,
                      sizeBase: options.sizeBase,
                      sizeRandom: options.sizeRandom
                    }) : ({
                      TAG: /* WithVariants */0,
                      variants: Curry._2(Ley_IntMap$OptolithClient.mapMaybe, (function (param) {
                              return Ley_Option$OptolithClient.Functor.$less$amp$great(Curry._2(TranslationMap.getFromLanguageOrder, langs, param.translations), (function (translation) {
                                            return {
                                                    id: param.id,
                                                    name: translation.name,
                                                    commonCultures: param.commonCultures,
                                                    commonAdvantages: param.commonAdvantages,
                                                    commonAdvantagesText: translation.commonAdvantages,
                                                    commonDisadvantages: param.commonDisadvantages,
                                                    commonDisadvantagesText: translation.commonDisadvantages,
                                                    uncommonAdvantages: param.uncommonAdvantages,
                                                    uncommonAdvantagesText: translation.uncommonAdvantages,
                                                    uncommonDisadvantages: param.uncommonDisadvantages,
                                                    uncommonDisadvantagesText: translation.uncommonDisadvantages,
                                                    hairColors: param.hairColors,
                                                    eyeColors: param.eyeColors,
                                                    sizeBase: param.sizeBase,
                                                    sizeRandom: param.sizeRandom
                                                  };
                                          }));
                            }), options.variants)
                    });
                return {
                        id: x.id,
                        name: translation.name,
                        apValue: x.apValue,
                        lp: x.lp,
                        spi: x.spi,
                        tou: x.tou,
                        mov: x.mov,
                        attributeAdjustments: x.attributeAdjustments,
                        attributeAdjustmentsSelectionValue: x.attributeAdjustmentsSelectionValue,
                        attributeAdjustmentsSelectionList: x.attributeAdjustmentsSelectionList,
                        attributeAdjustmentsText: translation.attributeAdjustments,
                        automaticAdvantages: x.automaticAdvantages,
                        automaticAdvantagesText: translation.automaticAdvantages,
                        stronglyRecommendedAdvantages: x.stronglyRecommendedAdvantages,
                        stronglyRecommendedAdvantagesText: translation.stronglyRecommendedAdvantages,
                        stronglyRecommendedDisadvantages: x.stronglyRecommendedDisadvantages,
                        stronglyRecommendedDisadvantagesText: translation.stronglyRecommendedDisadvantages,
                        commonAdvantages: x.commonAdvantages,
                        commonAdvantagesText: translation.commonAdvantages,
                        commonDisadvantages: x.commonDisadvantages,
                        commonDisadvantagesText: translation.commonDisadvantages,
                        uncommonAdvantages: x.uncommonAdvantages,
                        uncommonAdvantagesText: translation.uncommonDisadvantages,
                        uncommonDisadvantages: x.uncommonDisadvantages,
                        uncommonDisadvantagesText: translation.uncommonDisadvantages,
                        weightBase: x.weightBase,
                        weightRandom: x.weightRandom,
                        variantOptions: tmp,
                        src: PublicationRef$OptolithClient.resolveTranslationsList(langs, x.src),
                        errata: translation.errata
                      };
              }));
}

var Static_Variant = {};

var Static = {
  Variant: Static_Variant,
  decode: decode$2
};

export {
  Dynamic ,
  Static ,
  
}
/* TranslationMap Not a pure module */
