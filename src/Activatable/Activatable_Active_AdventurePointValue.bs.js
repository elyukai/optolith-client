// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Curry from "bs-platform/lib/es6/curry.js";
import * as IC$OptolithClient from "../Increasable/IC.bs.js";
import * as Id$OptolithClient from "../Misc/Id.bs.js";
import * as Ley_Int$OptolithClient from "../Data/Ley_Int.bs.js";
import * as Ley_List$OptolithClient from "../Data/Ley_List.bs.js";
import * as Ley_IntMap$OptolithClient from "../Data/Ley_IntMap.bs.js";
import * as Ley_Option$OptolithClient from "../Data/Ley_Option.bs.js";
import * as Ley_Function$OptolithClient from "../Data/Ley_Function.bs.js";
import * as Activatable_Convert$OptolithClient from "./Activatable_Convert.bs.js";
import * as Activatable_Accessors$OptolithClient from "./Activatable_Accessors.bs.js";
import * as Activatable_SelectOptions$OptolithClient from "./Activatable_SelectOptions.bs.js";

function ensureFlat(x) {
  if (x.TAG) {
    return ;
  } else {
    return x._0;
  }
}

function ensurePerLevel(x) {
  if (x.TAG) {
    return x._0;
  }
  
}

function getDefaultEntryCost(staticEntry, singleHeroEntry) {
  var sid1 = Activatable_SelectOptions$OptolithClient.getOption1(singleHeroEntry);
  var level = Ley_Option$OptolithClient.fromOption(1, singleHeroEntry.level);
  var apValue = Ley_Option$OptolithClient.fromOption({
        TAG: /* Flat */0,
        _0: 0
      }, Activatable_Accessors$OptolithClient.apValue(staticEntry));
  var optionApValue = Curry._2(Ley_Option$OptolithClient.Infix.$great$great$eq, sid1, (function (param) {
          return Activatable_SelectOptions$OptolithClient.getSelectOptionCost(staticEntry, param);
        }));
  if (optionApValue !== undefined) {
    return optionApValue;
  }
  if (!apValue.TAG) {
    return Math.imul(apValue._0, level);
  }
  var xs = apValue._0;
  switch (staticEntry.TAG | 0) {
    case /* Advantage */0 :
    case /* Disadvantage */1 :
        return Ley_List$OptolithClient.Safe.atMay(xs, level - 1 | 0);
    case /* SpecialAbility */2 :
        return Curry._1(Ley_List$OptolithClient.sum, Ley_List$OptolithClient.take(Ley_Int$OptolithClient.max(1, level), xs));
    
  }
}

function getPrinciplesObligationsMaxLevels(param) {
  return Curry._3(Ley_List$OptolithClient.foldr, (function (active, param) {
                var prevSndMax = param[1];
                var prevMax = param[0];
                var match = active.level;
                var match$1 = active.customCost;
                if (match !== undefined && !(match$1 !== undefined || match <= prevMax)) {
                  return [
                          match,
                          prevMax
                        ];
                } else {
                  return [
                          prevMax,
                          prevSndMax
                        ];
                }
              }), [
              0,
              0
            ], param.active);
}

function getEntrySpecificCost(isEntryToAdd, staticData, hero, staticEntry, heroEntry, singleHeroEntry) {
  var sid1 = Activatable_SelectOptions$OptolithClient.getOption1(singleHeroEntry);
  var level = singleHeroEntry.level;
  var apValue = Ley_Option$OptolithClient.fromOption({
        TAG: /* Flat */0,
        _0: 0
      }, Activatable_Accessors$OptolithClient.apValue(staticEntry));
  switch (staticEntry.TAG | 0) {
    case /* Advantage */0 :
        var match = Id$OptolithClient.Advantage.fromInt(staticEntry._0.id);
        var exit = 0;
        if (typeof match !== "number") {
          return getDefaultEntryCost(staticEntry, singleHeroEntry);
        }
        if (match !== 17) {
          if (match >= 6) {
            return getDefaultEntryCost(staticEntry, singleHeroEntry);
          }
          switch (match) {
            case /* Nimble */1 :
            case /* Blessed */2 :
            case /* Luck */3 :
                return getDefaultEntryCost(staticEntry, singleHeroEntry);
            case /* Aptitude */0 :
            case /* ExceptionalSkill */4 :
                exit = 1;
                break;
            case /* ExceptionalCombatTechnique */5 :
                exit = 2;
                break;
            
          }
        } else {
          exit = 2;
        }
        switch (exit) {
          case 1 :
              return Curry._2(Ley_Option$OptolithClient.Infix.$great$great$eq, Activatable_SelectOptions$OptolithClient.getOption1(singleHeroEntry), (function (sid) {
                            if (sid.TAG) {
                              return ;
                            }
                            var match = sid._0;
                            switch (match[0]) {
                              case /* Skill */1 :
                                  if (!apValue.TAG) {
                                    return ;
                                  }
                                  var apValues = apValue._0;
                                  return Curry._2(Ley_Option$OptolithClient.Infix.$great$great$eq, Curry._2(Ley_IntMap$OptolithClient.lookup, match[1], staticData.skills), (function ($$static) {
                                                return Ley_List$OptolithClient.Safe.atMay(apValues, IC$OptolithClient.icToIx($$static.ic));
                                              }));
                              case /* Spell */3 :
                                  if (!apValue.TAG) {
                                    return ;
                                  }
                                  var apValues$1 = apValue._0;
                                  return Curry._2(Ley_Option$OptolithClient.Infix.$great$great$eq, Curry._2(Ley_IntMap$OptolithClient.lookup, match[1], staticData.spells), (function ($$static) {
                                                return Ley_List$OptolithClient.Safe.atMay(apValues$1, IC$OptolithClient.icToIx($$static.ic));
                                              }));
                              case /* LiturgicalChant */5 :
                                  if (!apValue.TAG) {
                                    return ;
                                  }
                                  var apValues$2 = apValue._0;
                                  return Curry._2(Ley_Option$OptolithClient.Infix.$great$great$eq, Curry._2(Ley_IntMap$OptolithClient.lookup, match[1], staticData.liturgicalChants), (function ($$static) {
                                                return Ley_List$OptolithClient.Safe.atMay(apValues$2, IC$OptolithClient.icToIx($$static.ic));
                                              }));
                              case /* Generic */0 :
                              case /* CombatTechnique */2 :
                              case /* Cantrip */4 :
                              case /* Blessing */6 :
                              case /* SpecialAbility */7 :
                              case /* TradeSecret */8 :
                              case /* Language */9 :
                              case /* Script */10 :
                              case /* AnimalShape */11 :
                                  return ;
                              
                            }
                          }));
          case 2 :
              return Curry._2(Ley_Option$OptolithClient.Infix.$great$great$eq, Activatable_SelectOptions$OptolithClient.getOption1(singleHeroEntry), (function (sid) {
                            if (sid.TAG) {
                              return ;
                            }
                            var match = sid._0;
                            if (match[0] !== 2) {
                              return ;
                            }
                            if (!apValue.TAG) {
                              return ;
                            }
                            var apValues = apValue._0;
                            return Curry._2(Ley_Option$OptolithClient.Infix.$great$great$eq, Curry._2(Ley_IntMap$OptolithClient.lookup, match[1], staticData.combatTechniques), (function ($$static) {
                                          return Ley_List$OptolithClient.Safe.atMay(apValues, IC$OptolithClient.icToIx($$static.ic));
                                        }));
                          }));
          
        }
        break;
    case /* Disadvantage */1 :
        var match$1 = Id$OptolithClient.Disadvantage.fromInt(staticEntry._0.id);
        if (typeof match$1 !== "number") {
          return getDefaultEntryCost(staticEntry, singleHeroEntry);
        }
        if (match$1 < 12) {
          return getDefaultEntryCost(staticEntry, singleHeroEntry);
        }
        switch (match$1 - 12 | 0) {
          case /* AfraidOf */0 :
              if (sid1 === undefined) {
                return ;
              }
              if (sid1.TAG) {
                return ;
              }
              var match$2 = sid1._0;
              if (match$2[0] !== 0) {
                return ;
              }
              var selected_option = match$2[1];
              var matchOption = function (target_option, current) {
                if (current === undefined) {
                  return false;
                }
                if (current.TAG) {
                  return false;
                }
                var match = current._0;
                if (match[0] !== 0) {
                  return false;
                } else {
                  return match[1] === target_option;
                }
              };
              var isPersonalityFlawNotPaid = function (target_option, paid_entries_max) {
                if (target_option === selected_option) {
                  return Ley_List$OptolithClient.countBy((function (e) {
                                if (matchOption(target_option, Ley_Option$OptolithClient.listToOption(e.options))) {
                                  return Ley_Option$OptolithClient.isNone(e.customCost);
                                } else {
                                  return false;
                                }
                              }), heroEntry.active) > (
                          isEntryToAdd ? paid_entries_max - 1 | 0 : paid_entries_max
                        );
                } else {
                  return false;
                }
              };
              if (isPersonalityFlawNotPaid(7, 1) || isPersonalityFlawNotPaid(8, 2)) {
                return 0;
              } else {
                return Activatable_SelectOptions$OptolithClient.getSelectOptionCost(staticEntry, {
                            TAG: /* Preset */0,
                            _0: [
                              /* Generic */0,
                              selected_option
                            ]
                          });
              }
          case /* Slow */2 :
              return Curry._2(Ley_Option$OptolithClient.find, (function (param) {
                            return Ley_List$OptolithClient.countBy((function (e) {
                                          return Ley_Option$OptolithClient.isNone(e.customCost);
                                        }), heroEntry.active) > (
                                    isEntryToAdd ? 2 : 3
                                  );
                          }), ensureFlat(apValue));
          case /* DecreasedArcanePower */6 :
              return Curry._2(Ley_Option$OptolithClient.Infix.$great$great$eq, Activatable_SelectOptions$OptolithClient.getOption1(singleHeroEntry), (function (sid) {
                            if (sid.TAG) {
                              return ;
                            }
                            var match = sid._0;
                            if (match[0] !== 1) {
                              return ;
                            }
                            if (!apValue.TAG) {
                              return ;
                            }
                            var apValues = apValue._0;
                            return Curry._2(Ley_Option$OptolithClient.Infix.$great$great$eq, Curry._2(Ley_IntMap$OptolithClient.lookup, match[1], staticData.skills), (function ($$static) {
                                          return Ley_List$OptolithClient.Safe.atMay(apValues, IC$OptolithClient.icToIx($$static.ic));
                                        }));
                          }));
          case /* Poor */1 :
          case /* DecreasedKarmaPoints */7 :
              break;
          case /* NoFlyingBalm */3 :
          case /* NoFamiliar */4 :
          case /* MagicalRestriction */5 :
          case /* DecreasedLifePoints */8 :
          case /* DecreasedSpirit */9 :
          case /* DecreasedToughness */10 :
          case /* BadLuck */11 :
          case /* PersonalityFlaw */12 :
              return getDefaultEntryCost(staticEntry, singleHeroEntry);
          
        }
        return Curry._2(Ley_Option$OptolithClient.Infix.$great$great$eq, level, (function (level) {
                      var match = getPrinciplesObligationsMaxLevels(heroEntry);
                      if (match[0] > level || Ley_List$OptolithClient.countBy((function (e) {
                                return Curry._2(Ley_Option$OptolithClient.elem, level, e.level);
                              }), heroEntry.active) > (
                          isEntryToAdd ? 0 : 1
                        )) {
                        return ;
                      }
                      var partial_arg = level - match[1] | 0;
                      return Curry._2(Ley_Option$OptolithClient.Infix.$less$amp$great, ensureFlat(apValue), (function (param) {
                                    return Math.imul(partial_arg, param);
                                  }));
                    }));
    case /* SpecialAbility */2 :
        var match$3 = Id$OptolithClient.SpecialAbility.fromInt(staticEntry._0.id);
        var exit$1 = 0;
        if (typeof match$3 !== "number") {
          return getDefaultEntryCost(staticEntry, singleHeroEntry);
        }
        if (match$3 >= 42) {
          if (match$3 < 71) {
            return getDefaultEntryCost(staticEntry, singleHeroEntry);
          }
          switch (match$3 - 71 | 0) {
            case /* SkillSpecialization */0 :
                return Curry._2(Ley_Option$OptolithClient.Infix.$great$great$eq, ensureFlat(apValue), (function (flatAp) {
                              return Curry._2(Ley_Option$OptolithClient.Infix.$great$great$eq, Curry._2(Ley_Option$OptolithClient.Infix.$great$great$eq, sid1, Activatable_SelectOptions$OptolithClient.getGenericId), (function (languageId) {
                                            return Curry._2(Ley_Option$OptolithClient.Infix.$great$great$eq, Curry._2(Ley_IntMap$OptolithClient.lookup, Id$OptolithClient.SpecialAbility.toInt(/* Language */6), hero.specialAbilities), (function (language) {
                                                          return Curry._2(Ley_Option$OptolithClient.Infix.$great$great$eq, Curry._2(Ley_List$OptolithClient.find, (function (e) {
                                                                            return Curry._2(Ley_Option$OptolithClient.elem, languageId, Curry._2(Ley_Option$OptolithClient.Infix.$great$great$eq, Ley_Option$OptolithClient.listToOption(e.options), Activatable_SelectOptions$OptolithClient.getGenericId));
                                                                          }), language.active), (function (selectedLanguage) {
                                                                        return Curry._2(Ley_Option$OptolithClient.Infix.$less$amp$great, selectedLanguage.level, (function (param) {
                                                                                      if (param !== 4) {
                                                                                        return flatAp;
                                                                                      } else {
                                                                                        return 0;
                                                                                      }
                                                                                    }));
                                                                      }));
                                                        }));
                                          }));
                            }));
            case /* PropertyKnowledge */10 :
            case /* AspectKnowledge */12 :
            case /* Feuerschlucker */14 :
                exit$1 = 3;
                break;
            case /* CombatStyleCombination */15 :
            case /* AdaptionZauber */16 :
            case /* Exorzist */17 :
            case /* FavoriteSpellwork */18 :
            case /* TraditionWitches */19 :
                exit$1 = 4;
                break;
            case /* TerrainKnowledge */1 :
            case /* CraftInstruments */2 :
            case /* Hunter */3 :
            case /* AreaKnowledge */4 :
            case /* Literacy */5 :
            case /* Language */6 :
            case /* CombatReflexes */7 :
            case /* ImprovedDodge */8 :
            case /* TraditionGuildMages */9 :
            case /* PropertyFocus */11 :
            case /* TraditionChurchOfPraios */13 :
            case /* MagicStyleCombination */20 :
            case /* Harmoniezauberei */21 :
            case /* Matrixzauberei */22 :
            case /* TraditionElves */23 :
            case /* TraditionDruids */24 :
            case /* SpellEnhancement */25 :
                return getDefaultEntryCost(staticEntry, singleHeroEntry);
            
          }
        } else {
          switch (match$3) {
            case /* SkillSpecialization */0 :
                return Curry._2(Ley_Option$OptolithClient.Infix.$less$amp$great, Curry._2(Ley_Option$OptolithClient.Infix.$great$great$eq, sid1, (function (param) {
                                  return Activatable_SelectOptions$OptolithClient.getSkillFromOption(staticData, param);
                                })), (function (skill) {
                              return Math.imul(Ley_List$OptolithClient.countBy((function (e) {
                                                if (Curry._2(Ley_Option$OptolithClient.elem, {
                                                        TAG: /* Preset */0,
                                                        _0: [
                                                          /* Skill */1,
                                                          skill.id
                                                        ]
                                                      }, Ley_Option$OptolithClient.listToOption(e.options))) {
                                                  return Ley_Option$OptolithClient.isNone(e.customCost);
                                                } else {
                                                  return false;
                                                }
                                              }), heroEntry.active) + (
                                          isEntryToAdd ? 1 : 0
                                        ) | 0, IC$OptolithClient.getAPForActivatation(skill.ic));
                            }));
            case /* Language */6 :
                return Curry._2(Ley_Option$OptolithClient.Infix.$great$great$eq, level, (function (level) {
                              if (level !== 4) {
                                return Curry._2(Ley_Option$OptolithClient.Infix.$less$amp$great, ensureFlat(apValue), (function (param) {
                                              return Math.imul(level, param);
                                            }));
                              } else {
                                return 0;
                              }
                            }));
            case /* PropertyKnowledge */10 :
            case /* AspectKnowledge */12 :
                exit$1 = 1;
                break;
            case /* AdaptionZauber */16 :
            case /* FavoriteSpellwork */18 :
                exit$1 = 2;
                break;
            case /* TraditionWitches */19 :
                var decreaseCost = function (id, cost) {
                  if (Activatable_Accessors$OptolithClient.isActiveM(Curry._2(Ley_IntMap$OptolithClient.lookup, id, hero.disadvantages))) {
                    return cost - 10 | 0;
                  } else {
                    return cost;
                  }
                };
                return Curry._2(Ley_Option$OptolithClient.Infix.$less$amp$great, ensureFlat(apValue), (function (flatAp) {
                              return decreaseCost(Id$OptolithClient.Disadvantage.toInt(/* NoFamiliar */4), decreaseCost(Id$OptolithClient.Disadvantage.toInt(/* NoFlyingBalm */3), flatAp));
                            }));
            case /* Forschungsgebiet */26 :
            case /* Expertenwissen */27 :
            case /* Wissensdurst */28 :
                exit$1 = 3;
                break;
            case /* Recherchegespuer */29 :
                return Curry._2(Ley_Option$OptolithClient.Infix.$great$great$eq, Curry._2(Ley_IntMap$OptolithClient.lookup, Id$OptolithClient.SpecialAbility.toInt(/* Wissensdurst */28), hero.specialAbilities), (function (wissensdurst) {
                              return Curry._2(Ley_Option$OptolithClient.Infix.$great$great$eq, ensurePerLevel(apValue), (function (apPerLevel) {
                                            var getCostFromHeroEntry = function (entry) {
                                              return Curry._2(Ley_Option$OptolithClient.Infix.$great$great$eq, Curry._2(Ley_Option$OptolithClient.Infix.$great$great$eq, Activatable_SelectOptions$OptolithClient.getOption1(entry), (function (param) {
                                                                return Activatable_SelectOptions$OptolithClient.getSkillFromOption(staticData, param);
                                                              })), (function (skill) {
                                                            return Ley_List$OptolithClient.Safe.atMay(apPerLevel, IC$OptolithClient.icToIx(skill.ic));
                                                          }));
                                            };
                                            return Curry._3(Ley_Option$OptolithClient.liftM2, (function (prim, prim$1) {
                                                          return prim + prim$1 | 0;
                                                        }), getCostFromHeroEntry(singleHeroEntry), Curry._2(Ley_Option$OptolithClient.Infix.$great$great$eq, Ley_Option$OptolithClient.listToOption(wissensdurst.active), (function (fst) {
                                                              return getCostFromHeroEntry(Activatable_Convert$OptolithClient.singleToSingleWithId(heroEntry, 0, fst));
                                                            })));
                                          }));
                            }));
            case /* TerrainKnowledge */1 :
            case /* CraftInstruments */2 :
            case /* Hunter */3 :
            case /* AreaKnowledge */4 :
            case /* Literacy */5 :
            case /* CombatReflexes */7 :
            case /* ImprovedDodge */8 :
            case /* TraditionGuildMages */9 :
            case /* PropertyFocus */11 :
            case /* TraditionChurchOfPraios */13 :
            case /* Feuerschlucker */14 :
            case /* CombatStyleCombination */15 :
            case /* Exorzist */17 :
            case /* MagicStyleCombination */20 :
            case /* Harmoniezauberei */21 :
            case /* Matrixzauberei */22 :
            case /* TraditionElves */23 :
            case /* TraditionDruids */24 :
            case /* SpellEnhancement */25 :
            case /* PredigtDerGemeinschaft */30 :
            case /* PredigtDerZuversicht */31 :
            case /* PredigtDesGottvertrauens */32 :
            case /* PredigtDesWohlgefallens */33 :
            case /* PredigtWiderMissgeschicke */34 :
            case /* VisionDerBestimmung */35 :
            case /* VisionDerEntrueckung */36 :
            case /* VisionDerGottheit */37 :
            case /* VisionDesSchicksals */38 :
            case /* VisionDesWahrenGlaubens */39 :
            case /* HoheWeihe */40 :
                return getDefaultEntryCost(staticEntry, singleHeroEntry);
            case /* Lieblingsliturgie */41 :
                return Curry._2(Ley_Option$OptolithClient.Infix.$great$great$eq, Activatable_SelectOptions$OptolithClient.getOption1(singleHeroEntry), (function (sid) {
                              if (sid.TAG) {
                                return ;
                              }
                              var match = sid._0;
                              if (match[0] !== 5) {
                                return ;
                              }
                              if (!apValue.TAG) {
                                return ;
                              }
                              var apValues = apValue._0;
                              return Curry._2(Ley_Option$OptolithClient.Infix.$great$great$eq, Curry._2(Ley_IntMap$OptolithClient.lookup, match[1], staticData.liturgicalChants), (function ($$static) {
                                            return Ley_List$OptolithClient.Safe.atMay(apValues, IC$OptolithClient.icToIx($$static.ic));
                                          }));
                            }));
            
          }
        }
        switch (exit$1) {
          case 1 :
              return Curry._2(Ley_Option$OptolithClient.Infix.$great$great$eq, ensurePerLevel(apValue), (function (apPerLevel) {
                            var amountActive = Ley_List$OptolithClient.countBy((function (e) {
                                    return Ley_Option$OptolithClient.isNone(e.customCost);
                                  }), heroEntry.active);
                            var index = amountActive + (
                              isEntryToAdd ? 0 : -1
                            ) | 0;
                            return Ley_List$OptolithClient.Safe.atMay(apPerLevel, index);
                          }));
          case 2 :
              return Curry._2(Ley_Option$OptolithClient.Infix.$great$great$eq, Activatable_SelectOptions$OptolithClient.getOption1(singleHeroEntry), (function (sid) {
                            if (sid.TAG) {
                              return ;
                            }
                            var match = sid._0;
                            if (match[0] !== 3) {
                              return ;
                            }
                            if (!apValue.TAG) {
                              return ;
                            }
                            var apValues = apValue._0;
                            return Curry._2(Ley_Option$OptolithClient.Infix.$great$great$eq, Curry._2(Ley_IntMap$OptolithClient.lookup, match[1], staticData.spells), (function ($$static) {
                                          return Ley_List$OptolithClient.Safe.atMay(apValues, IC$OptolithClient.icToIx($$static.ic));
                                        }));
                          }));
          case 3 :
              return Curry._2(Ley_Option$OptolithClient.Infix.$great$great$eq, Activatable_SelectOptions$OptolithClient.getOption1(singleHeroEntry), (function (sid) {
                            if (sid.TAG) {
                              return ;
                            }
                            var match = sid._0;
                            if (match[0] !== 1) {
                              return ;
                            }
                            if (!apValue.TAG) {
                              return ;
                            }
                            var apValues = apValue._0;
                            return Curry._2(Ley_Option$OptolithClient.Infix.$great$great$eq, Curry._2(Ley_IntMap$OptolithClient.lookup, match[1], staticData.skills), (function ($$static) {
                                          return Ley_List$OptolithClient.Safe.atMay(apValues, IC$OptolithClient.icToIx($$static.ic));
                                        }));
                          }));
          case 4 :
              return Ley_Option$OptolithClient.ensure((function (param) {
                            return 0 < param;
                          }), Curry._1(Ley_List$OptolithClient.sum, Ley_Option$OptolithClient.mapOption((function (sid) {
                                    if (sid.TAG) {
                                      return ;
                                    }
                                    var match = sid._0;
                                    if (match[0] !== 1) {
                                      return ;
                                    }
                                    if (!apValue.TAG) {
                                      return ;
                                    }
                                    var apValues = apValue._0;
                                    return Curry._2(Ley_Option$OptolithClient.Infix.$great$great$eq, Curry._2(Ley_IntMap$OptolithClient.lookup, match[1], staticData.skills), (function ($$static) {
                                                  return Ley_List$OptolithClient.Safe.atMay(apValues, IC$OptolithClient.icToIx($$static.ic));
                                                }));
                                  }), Ley_List$OptolithClient.take(3, singleHeroEntry.options))));
          
        }
        break;
    
  }
}

function getApValueDifferenceOnChange(isEntryToAdd, automaticAdvantages, staticData, hero, staticEntry, heroEntry, singleHeroEntry) {
  var isAutomatic = Curry._2(Ley_List$OptolithClient.elem, singleHeroEntry.id, automaticAdvantages);
  var modifyAbs;
  switch (staticEntry.TAG | 0) {
    case /* Disadvantage */1 :
        modifyAbs = Ley_Int$OptolithClient.negate;
        break;
    case /* Advantage */0 :
    case /* SpecialAbility */2 :
        modifyAbs = Ley_Function$OptolithClient.id;
        break;
    
  }
  var customCost = singleHeroEntry.customCost;
  if (customCost !== undefined) {
    return {
            apValue: Curry._1(modifyAbs, customCost),
            isAutomatic: isAutomatic
          };
  } else {
    return {
            apValue: Curry._1(modifyAbs, Ley_Option$OptolithClient.fromOption(0, getEntrySpecificCost(isEntryToAdd, staticData, hero, staticEntry, heroEntry, singleHeroEntry))),
            isAutomatic: isAutomatic
          };
  }
}

export {
  getApValueDifferenceOnChange ,
  
}
/* Ley_List-OptolithClient Not a pure module */
