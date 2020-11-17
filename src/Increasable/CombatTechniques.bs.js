// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Curry from "bs-platform/lib/es6/curry.js";
import * as Js_math from "bs-platform/lib/es6/js_math.js";
import * as Id$OptolithClient from "../Misc/Id.bs.js";
import * as Ley_Int$OptolithClient from "../Data/Ley_Int.bs.js";
import * as Ley_List$OptolithClient from "../Data/Ley_List.bs.js";
import * as Attribute$OptolithClient from "./Attribute.bs.js";
import * as Ley_IntMap$OptolithClient from "../Data/Ley_IntMap.bs.js";
import * as Ley_Option$OptolithClient from "../Data/Ley_Option.bs.js";
import * as Dependencies$OptolithClient from "../Prerequisites/Dependencies.bs.js";
import * as CombatTechnique$OptolithClient from "./CombatTechnique.bs.js";

function getMaxPrimaryAttributeValueById(heroAttrs, ps) {
  return Curry._1(Ley_List$OptolithClient.maximum, Ley_List$OptolithClient.$less$plus$great(0, Curry._2(Ley_List$OptolithClient.map, (function (p) {
                        return Curry._1(Attribute$OptolithClient.Dynamic.getValueDef, Curry._2(Ley_IntMap$OptolithClient.lookup, p, heroAttrs));
                      }), ps)));
}

function attributeValueToMod(value) {
  return Ley_Int$OptolithClient.max(0, (value - 8 | 0) / 3 | 0);
}

function getAttack(heroAttrs, staticEntry, heroEntry) {
  var ps = staticEntry.gr === 1 ? ({
        hd: Id$OptolithClient.Attribute.toInt(/* Courage */0),
        tl: /* [] */0
      }) : staticEntry.primary;
  return attributeValueToMod(getMaxPrimaryAttributeValueById(heroAttrs, ps)) + Curry._1(CombatTechnique$OptolithClient.Dynamic.getValueDef, heroEntry) | 0;
}

function getParry(heroAttrs, staticEntry, heroEntry) {
  if (staticEntry.gr === Curry._1(Id$OptolithClient.CombatTechnique.Group.toInt, /* Melee */0) && staticEntry.id !== Id$OptolithClient.CombatTechnique.toInt(/* ChainWeapons */5) && staticEntry.id !== Id$OptolithClient.CombatTechnique.toInt(/* Brawling */7)) {
    return attributeValueToMod(getMaxPrimaryAttributeValueById(heroAttrs, staticEntry.primary)) + Js_math.floor(Math.round(2.0 / Curry._1(CombatTechnique$OptolithClient.Dynamic.getValueDef, heroEntry))) | 0;
  }
  
}

function getExceptionalCombatTechniqueBonus(exceptionalCombatTechnique, id) {
  return Ley_Option$OptolithClient.option(0, (function (x) {
                return Ley_Option$OptolithClient.fromOption(0, Curry._2(Ley_Option$OptolithClient.Infix.$less$amp$great, Ley_Option$OptolithClient.listToOption(x.active), (function (a) {
                                  var hasBonus = Curry._2(Ley_Option$OptolithClient.elem, {
                                        TAG: /* Preset */0,
                                        _0: {
                                          TAG: /* CombatTechnique */2,
                                          _0: id
                                        }
                                      }, Ley_Option$OptolithClient.listToOption(a.options));
                                  if (hasBonus) {
                                    return 1;
                                  } else {
                                    return 0;
                                  }
                                })));
              }), exceptionalCombatTechnique);
}

function getMaxCtrFromEl(el, phase) {
  if (phase >= 2) {
    return ;
  } else {
    return el.maxCombatTechniqueRating;
  }
}

function getMax(startEl, phase, heroAttrs, exceptionalCombatTechnique, staticEntry) {
  return getExceptionalCombatTechniqueBonus(exceptionalCombatTechnique, staticEntry.id) + Curry._1(Ley_List$OptolithClient.minimum, Ley_Option$OptolithClient.catOptions({
                  hd: getMaxPrimaryAttributeValueById(heroAttrs, staticEntry.primary),
                  tl: {
                    hd: getMaxCtrFromEl(startEl, phase),
                    tl: /* [] */0
                  }
                })) | 0;
}

function isIncreasable(startEl, phase, heroAttrs, exceptionalCombatTechnique, staticEntry, heroEntry) {
  return heroEntry.value < getMax(startEl, phase, heroAttrs, exceptionalCombatTechnique, staticEntry);
}

function getMinCtrByHunter(onlyOneCombatTechniqueForHunter, staticEntry) {
  if (onlyOneCombatTechniqueForHunter && staticEntry.gr === Curry._1(Id$OptolithClient.CombatTechnique.Group.toInt, /* Ranged */1)) {
    return 10;
  }
  
}

function getMinCtrByDeps(heroCombatTechniques, heroEntry) {
  return Curry._2(Ley_Option$OptolithClient.Infix.$less$amp$great, Ley_Option$OptolithClient.ensure(Ley_List$OptolithClient.Extra.notNull, Dependencies$OptolithClient.Flatten.flattenSkillDependencies((function (id) {
                        return Curry._1(CombatTechnique$OptolithClient.Dynamic.getValueDef, Curry._2(Ley_IntMap$OptolithClient.lookup, id, heroCombatTechniques));
                      }), heroEntry.id, heroEntry.dependencies)), Ley_List$OptolithClient.maximum);
}

function getMin(onlyOneCombatTechniqueForHunter, heroCombatTechniques, staticEntry, heroEntry) {
  return Curry._2(Ley_Option$OptolithClient.Infix.$less$amp$great, Ley_Option$OptolithClient.ensure(Ley_List$OptolithClient.Extra.notNull, Ley_Option$OptolithClient.catOptions({
                      hd: getMinCtrByDeps(heroCombatTechniques, heroEntry),
                      tl: {
                        hd: getMinCtrByHunter(onlyOneCombatTechniqueForHunter, staticEntry),
                        tl: /* [] */0
                      }
                    })), Ley_List$OptolithClient.maximum);
}

function isDecreasable(onlyOneCombatTechniqueForHunter, heroCombatTechniques, staticEntry, heroEntry) {
  return heroEntry.value > Ley_Option$OptolithClient.fromOption(6, getMin(onlyOneCombatTechniqueForHunter, heroCombatTechniques, staticEntry, heroEntry));
}

export {
  getAttack ,
  getParry ,
  getMax ,
  isIncreasable ,
  getMin ,
  isDecreasable ,
  
}
/* Id-OptolithClient Not a pure module */
