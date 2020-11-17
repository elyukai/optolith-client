// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Curry from "bs-platform/lib/es6/curry.js";
import * as IC$OptolithClient from "../Increasable/IC.bs.js";
import * as Id$OptolithClient from "../Misc/Id.bs.js";
import * as Skill$OptolithClient from "../Increasable/Skill.bs.js";
import * as Ley_List$OptolithClient from "../Data/Ley_List.bs.js";
import * as Ley_IntMap$OptolithClient from "../Data/Ley_IntMap.bs.js";
import * as Ley_Option$OptolithClient from "../Data/Ley_Option.bs.js";
import * as EntryGroups$OptolithClient from "../Misc/EntryGroups.bs.js";
import * as ActivatableSkills$OptolithClient from "../Increasable/ActivatableSkills.bs.js";
import * as Activatable_Modifier$OptolithClient from "./Activatable_Modifier.bs.js";
import * as Activatable_Accessors$OptolithClient from "./Activatable_Accessors.bs.js";
import * as Activatable_Active_Validation$OptolithClient from "./Activatable_Active_Validation.bs.js";
import * as Activatable_Inactive_Validation$OptolithClient from "./Activatable_Inactive_Validation.bs.js";
import * as Activatable_Inactive_SelectOptions$OptolithClient from "./Activatable_Inactive_SelectOptions.bs.js";

function getSermonOrVisionCountMax(hero, advantageId, disadvantageId) {
  return Activatable_Modifier$OptolithClient.modifyByLevel(3, Curry._2(Ley_IntMap$OptolithClient.lookup, Id$OptolithClient.Advantage.toInt(advantageId), hero.advantages), Curry._2(Ley_IntMap$OptolithClient.lookup, Id$OptolithClient.Disadvantage.toInt(disadvantageId), hero.disadvantages));
}

function getInactive(cache, staticData, hero, staticEntry, maybeHeroEntry) {
  var maxLevel = Activatable_Inactive_Validation$OptolithClient.getMaxLevel(staticData, hero, staticEntry, maybeHeroEntry);
  var isAdditionValid = Activatable_Inactive_Validation$OptolithClient.isAdditionValid(cache, staticData, hero, maxLevel, staticEntry, maybeHeroEntry);
  if (isAdditionValid) {
    return Ley_Option$OptolithClient.option({
                TAG: /* Invalid */1,
                _0: staticEntry
              }, (function (base) {
                  return {
                          TAG: /* Valid */0,
                          _0: base
                        };
                }), Curry._2(Ley_Option$OptolithClient.Infix.$great$great$eq, Curry._2(Ley_Option$OptolithClient.Infix.$less$amp$great, Activatable_Inactive_SelectOptions$OptolithClient.getAvailableSelectOptions(staticData, hero, cache.magicalTraditions, staticEntry, maybeHeroEntry), (function (selectOptions) {
                          var tmp;
                          switch (staticEntry.TAG | 0) {
                            case /* Advantage */0 :
                                tmp = Curry._2(Ley_List$OptolithClient.elem, staticEntry._0.id, cache.automaticAdvantages);
                                break;
                            case /* Disadvantage */1 :
                            case /* SpecialAbility */2 :
                                tmp = false;
                                break;
                            
                          }
                          return {
                                  id: Activatable_Accessors$OptolithClient.id$prime(staticEntry),
                                  name: Activatable_Accessors$OptolithClient.name(staticEntry),
                                  apValue: Activatable_Accessors$OptolithClient.apValue$prime(staticEntry),
                                  minLevel: undefined,
                                  maxLevel: maxLevel,
                                  selectOptions: selectOptions,
                                  heroEntry: maybeHeroEntry,
                                  staticEntry: staticEntry,
                                  customCostDisabled: true,
                                  isAutomatic: tmp
                                };
                        })), (function (base) {
                      switch (staticEntry.TAG | 0) {
                        case /* Advantage */0 :
                            return base;
                        case /* Disadvantage */1 :
                            var match = Id$OptolithClient.Disadvantage.fromInt(staticEntry._0.id);
                            if (typeof match === "number") {
                              if (match !== 22) {
                                if (match >= 23) {
                                  return {
                                          id: base.id,
                                          name: base.name,
                                          apValue: base.apValue,
                                          minLevel: base.minLevel,
                                          maxLevel: Ley_Option$OptolithClient.ensure((function (param) {
                                                  return 0 < param;
                                                }), Activatable_Active_Validation$OptolithClient.getMaxLevelForDecreaseEntry(3, EntryGroups$OptolithClient.SpecialAbility.countActiveFromGroup(typeof match === "number" && match === 23 ? /* Predigten */23 : /* Visionen */26, cache.specialAbilityPairs))),
                                          selectOptions: base.selectOptions,
                                          heroEntry: base.heroEntry,
                                          staticEntry: base.staticEntry,
                                          customCostDisabled: base.customCostDisabled,
                                          isAutomatic: base.isAutomatic
                                        };
                                } else {
                                  return base;
                                }
                              } else {
                                return {
                                        id: base.id,
                                        name: base.name,
                                        apValue: base.apValue,
                                        minLevel: base.minLevel,
                                        maxLevel: Ley_Option$OptolithClient.ensure((function (param) {
                                                return 0 < param;
                                              }), Activatable_Active_Validation$OptolithClient.getMaxLevelForDecreaseEntry(3, ActivatableSkills$OptolithClient.countActiveSkillEntries(/* Spells */0, hero))),
                                        selectOptions: base.selectOptions,
                                        heroEntry: base.heroEntry,
                                        staticEntry: base.staticEntry,
                                        customCostDisabled: base.customCostDisabled,
                                        isAutomatic: base.isAutomatic
                                      };
                              }
                            } else {
                              return base;
                            }
                        case /* SpecialAbility */2 :
                            var staticSpecialAbility = staticEntry._0;
                            var match$1 = Id$OptolithClient.SpecialAbility.fromInt(staticSpecialAbility.id);
                            var exit = 0;
                            if (typeof match$1 !== "number") {
                              return base;
                            }
                            if (match$1 >= 54) {
                              if (match$1 >= 71) {
                                switch (match$1 - 71 | 0) {
                                  case /* PropertyFocus */11 :
                                      exit = 3;
                                      break;
                                  case /* Harmoniezauberei */21 :
                                      exit = 6;
                                      break;
                                  case /* SkillSpecialization */0 :
                                  case /* Hunter */3 :
                                  case /* AreaKnowledge */4 :
                                  case /* Literacy */5 :
                                  case /* Language */6 :
                                  case /* CombatReflexes */7 :
                                  case /* ImprovedDodge */8 :
                                  case /* TraditionGuildMages */9 :
                                  case /* PropertyKnowledge */10 :
                                  case /* AspectKnowledge */12 :
                                  case /* TraditionChurchOfPraios */13 :
                                  case /* Feuerschlucker */14 :
                                  case /* CombatStyleCombination */15 :
                                  case /* AdaptionZauber */16 :
                                  case /* Exorzist */17 :
                                  case /* FavoriteSpellwork */18 :
                                  case /* TraditionWitches */19 :
                                  case /* MagicStyleCombination */20 :
                                  case /* TraditionElves */23 :
                                  case /* TraditionDruids */24 :
                                      return base;
                                  case /* TerrainKnowledge */1 :
                                  case /* CraftInstruments */2 :
                                  case /* Matrixzauberei */22 :
                                  case /* SpellEnhancement */25 :
                                      exit = 1;
                                      break;
                                  
                                }
                              } else {
                                exit = 3;
                              }
                            } else {
                              switch (match$1) {
                                case /* CraftInstruments */2 :
                                    var getSkillValue = function (skill) {
                                      return Curry._1(Skill$OptolithClient.Dynamic.getValueDef, Curry._2(Ley_IntMap$OptolithClient.lookup, Id$OptolithClient.Skill.toInt(skill), hero.skills));
                                    };
                                    if ((getSkillValue(/* Woodworking */50) + getSkillValue(/* Metalworking */54) | 0) >= 12) {
                                      return base;
                                    } else {
                                      return ;
                                    }
                                case /* Hunter */3 :
                                    if (Curry._2(Ley_IntMap$OptolithClient.any, (function (param) {
                                              var heroEntry = param[1];
                                              return heroEntry !== undefined ? heroEntry.value >= 10 : false;
                                            }), EntryGroups$OptolithClient.CombatTechnique.getFromGroup(/* Ranged */1, cache.combatTechniquePairs))) {
                                      return base;
                                    } else {
                                      return ;
                                    }
                                case /* PropertyKnowledge */10 :
                                case /* AspectKnowledge */12 :
                                    exit = 2;
                                    break;
                                case /* TraditionChurchOfPraios */13 :
                                    exit = 3;
                                    break;
                                case /* Recherchegespuer */29 :
                                    return Curry._2(Ley_Option$OptolithClient.Infix.$great$great$eq, Curry._2(Ley_Option$OptolithClient.Infix.$great$great$eq, Curry._2(Ley_Option$OptolithClient.Infix.$great$great$eq, Curry._2(Ley_Option$OptolithClient.Infix.$great$great$eq, Curry._2(Ley_Option$OptolithClient.Infix.$less$amp$great, Curry._2(Ley_IntMap$OptolithClient.lookup, Id$OptolithClient.SpecialAbility.toInt(/* Wissensdurst */28), hero.specialAbilities), (function (param) {
                                                                  return param.active;
                                                                })), Ley_Option$OptolithClient.listToOption), (function (param) {
                                                          return Ley_Option$OptolithClient.listToOption(param.options);
                                                        })), (function (param) {
                                                      if (param.TAG) {
                                                        return ;
                                                      }
                                                      var skillId = param._0;
                                                      if (skillId.TAG === /* Skill */1) {
                                                        return Curry._2(Ley_IntMap$OptolithClient.lookup, skillId._0, staticData.skills);
                                                      }
                                                      
                                                    })), (function (param) {
                                                  var match = staticSpecialAbility.apValue;
                                                  if (match === undefined) {
                                                    return ;
                                                  }
                                                  if (!match.TAG) {
                                                    return ;
                                                  }
                                                  var partial_arg = IC$OptolithClient.getAPForActivatation(param.ic);
                                                  var sumValues = Curry._2(Ley_List$OptolithClient.map, (function (param) {
                                                          return partial_arg + param | 0;
                                                        }), match._0);
                                                  return Curry._1(Ley_Option$OptolithClient.$$return, {
                                                              id: base.id,
                                                              name: base.name,
                                                              apValue: {
                                                                TAG: /* Many */1,
                                                                _0: sumValues
                                                              },
                                                              minLevel: base.minLevel,
                                                              maxLevel: base.maxLevel,
                                                              selectOptions: base.selectOptions,
                                                              heroEntry: base.heroEntry,
                                                              staticEntry: base.staticEntry,
                                                              customCostDisabled: base.customCostDisabled,
                                                              isAutomatic: base.isAutomatic
                                                            });
                                                }));
                                case /* PredigtDerGemeinschaft */30 :
                                case /* PredigtDerZuversicht */31 :
                                case /* PredigtDesGottvertrauens */32 :
                                case /* PredigtDesWohlgefallens */33 :
                                case /* PredigtWiderMissgeschicke */34 :
                                    exit = 4;
                                    break;
                                case /* VisionDerBestimmung */35 :
                                case /* VisionDerEntrueckung */36 :
                                case /* VisionDerGottheit */37 :
                                case /* VisionDesSchicksals */38 :
                                case /* VisionDesWahrenGlaubens */39 :
                                    exit = 5;
                                    break;
                                case /* SkillSpecialization */0 :
                                case /* TerrainKnowledge */1 :
                                case /* AreaKnowledge */4 :
                                case /* Literacy */5 :
                                case /* Language */6 :
                                case /* CombatReflexes */7 :
                                case /* ImprovedDodge */8 :
                                case /* PropertyFocus */11 :
                                case /* Feuerschlucker */14 :
                                case /* CombatStyleCombination */15 :
                                case /* AdaptionZauber */16 :
                                case /* Exorzist */17 :
                                case /* FavoriteSpellwork */18 :
                                case /* MagicStyleCombination */20 :
                                case /* Harmoniezauberei */21 :
                                case /* Matrixzauberei */22 :
                                case /* SpellEnhancement */25 :
                                case /* Forschungsgebiet */26 :
                                case /* Expertenwissen */27 :
                                case /* Wissensdurst */28 :
                                case /* HoheWeihe */40 :
                                case /* Lieblingsliturgie */41 :
                                case /* Zugvoegel */42 :
                                case /* JaegerinnenDerWeissenMaid */43 :
                                case /* AnhaengerDesGueldenen */44 :
                                case /* GebieterDesAspekts */45 :
                                case /* ChantEnhancement */46 :
                                    return base;
                                case /* DunklesAbbildDerBuendnisgabe */47 :
                                    return Curry._2(Ley_Option$OptolithClient.Infix.$great$great$eq, hero.pact, (function (param) {
                                                  var level = param.level;
                                                  if (level > 0) {
                                                    return {
                                                            id: base.id,
                                                            name: base.name,
                                                            apValue: base.apValue,
                                                            minLevel: base.minLevel,
                                                            maxLevel: level,
                                                            selectOptions: base.selectOptions,
                                                            heroEntry: base.heroEntry,
                                                            staticEntry: base.staticEntry,
                                                            customCostDisabled: base.customCostDisabled,
                                                            isAutomatic: base.isAutomatic
                                                          };
                                                  }
                                                  
                                                }));
                                case /* TraditionArcaneBard */49 :
                                case /* TraditionArcaneDancer */50 :
                                case /* TraditionIntuitiveMage */51 :
                                case /* TraditionSavant */52 :
                                    exit = 6;
                                    break;
                                case /* TraditionGuildMages */9 :
                                case /* TraditionWitches */19 :
                                case /* TraditionElves */23 :
                                case /* TraditionDruids */24 :
                                case /* TraditionIllusionist */48 :
                                case /* TraditionQabalyaMage */53 :
                                    exit = 1;
                                    break;
                                
                              }
                            }
                            switch (exit) {
                              case 1 :
                                  if (Curry._1(Ley_List$OptolithClient.$$null, cache.magicalTraditions)) {
                                    return base;
                                  } else {
                                    return ;
                                  }
                              case 2 :
                                  var match$2 = staticSpecialAbility.apValue;
                                  if (match$2 === undefined) {
                                    return ;
                                  }
                                  if (!match$2.TAG) {
                                    return ;
                                  }
                                  var index = Ley_Option$OptolithClient.option(0, (function (param) {
                                          return Curry._1(Ley_List$OptolithClient.length, param.active);
                                        }), maybeHeroEntry);
                                  return Curry._2(Ley_Option$OptolithClient.Infix.$less$amp$great, Ley_List$OptolithClient.Safe.atMay(match$2._0, index), (function (apValue) {
                                                return {
                                                        id: base.id,
                                                        name: base.name,
                                                        apValue: {
                                                          TAG: /* One */0,
                                                          _0: apValue
                                                        },
                                                        minLevel: base.minLevel,
                                                        maxLevel: base.maxLevel,
                                                        selectOptions: base.selectOptions,
                                                        heroEntry: base.heroEntry,
                                                        staticEntry: base.staticEntry,
                                                        customCostDisabled: base.customCostDisabled,
                                                        isAutomatic: base.isAutomatic
                                                      };
                                              }));
                              case 3 :
                                  if (Ley_Option$OptolithClient.isNone(cache.blessedTradition)) {
                                    return base;
                                  } else {
                                    return ;
                                  }
                              case 4 :
                                  var isAdvActive = function (id) {
                                    return Activatable_Accessors$OptolithClient.isActiveM(Curry._2(Ley_IntMap$OptolithClient.lookup, Id$OptolithClient.Advantage.toInt(id), hero.advantages));
                                  };
                                  var max = getSermonOrVisionCountMax(hero, /* ZahlreichePredigten */24, /* WenigePredigten */23);
                                  var isLessThanMax = EntryGroups$OptolithClient.SpecialAbility.countActiveFromGroup(/* Predigten */23, cache.specialAbilityPairs) < max;
                                  if (isAdvActive(/* Prediger */22) && isLessThanMax || isAdvActive(/* Blessed */2)) {
                                    return base;
                                  } else {
                                    return ;
                                  }
                              case 5 :
                                  var isAdvActive$1 = function (id) {
                                    return Activatable_Accessors$OptolithClient.isActiveM(Curry._2(Ley_IntMap$OptolithClient.lookup, Id$OptolithClient.Advantage.toInt(id), hero.advantages));
                                  };
                                  var max$1 = getSermonOrVisionCountMax(hero, /* ZahlreicheVisionen */25, /* WenigeVisionen */24);
                                  var isLessThanMax$1 = EntryGroups$OptolithClient.SpecialAbility.countActiveFromGroup(/* Visionen */26, cache.specialAbilityPairs) < max$1;
                                  if (isAdvActive$1(/* Visionaer */23) && isLessThanMax$1 || isAdvActive$1(/* Blessed */2)) {
                                    return base;
                                  } else {
                                    return ;
                                  }
                              case 6 :
                                  if (cache.adventurePoints.spentOnMagicalAdvantages <= 25 && cache.adventurePoints.spentOnMagicalDisadvantages <= 25 && Curry._1(Ley_List$OptolithClient.$$null, cache.magicalTraditions)) {
                                    return base;
                                  } else {
                                    return ;
                                  }
                              
                            }
                            break;
                        
                      }
                    })));
  } else {
    return {
            TAG: /* Invalid */1,
            _0: staticEntry
          };
  }
}

export {
  getInactive ,
  
}
/* Id-OptolithClient Not a pure module */
