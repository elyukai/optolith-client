// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Curry from "bs-platform/lib/es6/curry.js";
import * as Id$OptolithClient from "../Misc/Id.bs.js";
import * as Ley_Int$OptolithClient from "../Data/Ley_Int.bs.js";
import * as Ley_List$OptolithClient from "../Data/Ley_List.bs.js";
import * as Ley_IntMap$OptolithClient from "../Data/Ley_IntMap.bs.js";
import * as Ley_Option$OptolithClient from "../Data/Ley_Option.bs.js";
import * as EntryGroups$OptolithClient from "../Misc/EntryGroups.bs.js";
import * as Dependencies$OptolithClient from "../Prerequisites/Dependencies.bs.js";
import * as Ley_Function$OptolithClient from "../Data/Ley_Function.bs.js";
import * as Prerequisites$OptolithClient from "../Prerequisites/Prerequisites.bs.js";
import * as Activatable_Accessors$OptolithClient from "./Activatable_Accessors.bs.js";

function getActivePactGiftsCount(specialAbilityPairs) {
  return Curry._3(Ley_IntMap$OptolithClient.foldr, (function (param) {
                var heroEntry = param[1];
                var match = param[0];
                var apValue = match.apValue;
                if (heroEntry === undefined) {
                  return Ley_Function$OptolithClient.id;
                }
                var active = heroEntry.active;
                if (!Activatable_Accessors$OptolithClient.isActive(heroEntry)) {
                  return Ley_Function$OptolithClient.id;
                }
                if (match.prerequisites.TAG && apValue !== undefined && apValue.TAG && match.levels !== undefined && active) {
                  var level = active.hd.level;
                  if (level !== undefined) {
                    return function (param) {
                      return level + param | 0;
                    };
                  }
                  
                }
                return function (param) {
                  return 1 + param | 0;
                };
              }), 0, EntryGroups$OptolithClient.SpecialAbility.getFromGroup(/* Paktgeschenke */29, specialAbilityPairs));
}

function isSpecialAbilitySpecificAdditionEnabled(rules, maybePact, param, specialAbility) {
  var matchingLanguagesScripts = param.matchingLanguagesScripts;
  var activePactGiftsCount = param.activePactGiftsCount;
  var magicalStylesCount = param.magicalStylesCount;
  var unarmedCombatStylesCount = param.unarmedCombatStylesCount;
  var armedCombatStylesCount = param.armedCombatStylesCount;
  var match = Id$OptolithClient.SpecialAbility.fromInt(specialAbility.id);
  var match$1 = Curry._1(Id$OptolithClient.SpecialAbility.Group.fromInt, specialAbility.gr);
  var exit = 0;
  var exit$1 = 0;
  var exit$2 = 0;
  if (typeof match$1 === "number") {
    if (match$1 === 12) {
      return magicalStylesCount < (
              Activatable_Accessors$OptolithClient.isActiveM(param.magicalStyleCombination) ? 2 : 1
            );
    }
    if (match$1 >= 10) {
      if (match$1 === 24) {
        return !param.isBlessedStyleActive;
      }
      exit$2 = 4;
    } else {
      if (match$1 >= 8) {
        var equalTypeStylesActive = typeof match$1 === "number" ? (
            match$1 !== 8 ? (
                match$1 !== 9 ? 0 : unarmedCombatStylesCount
              ) : armedCombatStylesCount
          ) : 0;
        if (!Activatable_Accessors$OptolithClient.isActiveM(param.combatStyleCombination)) {
          return equalTypeStylesActive === 0;
        }
        var totalActive = armedCombatStylesCount + unarmedCombatStylesCount | 0;
        if (totalActive < 3) {
          return true;
        } else {
          return equalTypeStylesActive < 2;
        }
      }
      exit$2 = 4;
    }
  } else {
    exit$2 = 4;
  }
  if (exit$2 === 4) {
    if (typeof match === "number") {
      if (match >= 21) {
        if (match === 47) {
          return activePactGiftsCount === 0;
        }
        if (match === 84) {
          if (Curry._1(Ley_List$OptolithClient.length, matchingLanguagesScripts.languagesWithMatchingScripts) >= 1) {
            return Curry._1(Ley_List$OptolithClient.length, matchingLanguagesScripts.scriptsWithMatchingLanguages) >= 1;
          } else {
            return false;
          }
        }
        exit$1 = 3;
      } else {
        if (match === 15) {
          return (armedCombatStylesCount + unarmedCombatStylesCount | 0) > 0;
        }
        if (match >= 20) {
          return magicalStylesCount > 0;
        }
        exit$1 = 3;
      }
    } else {
      exit$1 = 3;
    }
  }
  if (exit$1 === 3) {
    if (typeof match$1 === "number" && match$1 === 29) {
      if (maybePact === undefined) {
        return false;
      }
      var match$2 = Id$OptolithClient.Pact.fromInt(maybePact.category);
      if (typeof match$2 === "number") {
        if (match$2 !== 0) {
          if (maybePact.level <= 0) {
            return activePactGiftsCount < 3;
          } else {
            return (maybePact.level + 7 | 0) > activePactGiftsCount;
          }
        } else if (Activatable_Accessors$OptolithClient.isActiveM(param.dunklesAbbild)) {
          return false;
        } else {
          return maybePact.level > activePactGiftsCount;
        }
      } else {
        return false;
      }
    }
    exit = 2;
  }
  if (exit === 2 && typeof match === "number" && match === 71) {
    return Curry._2(Ley_IntMap$OptolithClient.member, Id$OptolithClient.OptionalRule.toInt(/* LanguageSpecialization */1), rules.activeOptionalRules);
  }
  if (typeof match$1 === "number") {
    return !(match$1 === 31 || match$1 === 30);
  } else {
    return true;
  }
}

function isEntrySpecificAdditionEnabled(cache, staticData, hero, staticEntry) {
  var tmp;
  switch (staticEntry.TAG | 0) {
    case /* Advantage */0 :
    case /* Disadvantage */1 :
        tmp = true;
        break;
    case /* SpecialAbility */2 :
        tmp = isSpecialAbilitySpecificAdditionEnabled(hero.rules, hero.pact, cache, staticEntry._0);
        break;
    
  }
  if (tmp) {
    return Prerequisites$OptolithClient.Validation.arePrerequisitesMet(staticData, hero, Id$OptolithClient.Activatable.toAll(Activatable_Accessors$OptolithClient.id(staticEntry)), Prerequisites$OptolithClient.Activatable.getFlatFirstPrerequisites(staticEntry));
  } else {
    return false;
  }
}

function hasNoGenerallyRestrictingDependency(param) {
  if (param !== undefined) {
    return Curry._2(Ley_List$OptolithClient.all, (function (param) {
                  if (param.target.TAG || param.active || param.options) {
                    return true;
                  } else {
                    return param.level !== undefined;
                  }
                }), param.dependencies);
  } else {
    return true;
  }
}

function hasNotReachedMaximumEntries(maxLevel, maybeHeroEntry) {
  if (maxLevel !== undefined) {
    if (maxLevel !== 0) {
      if (maybeHeroEntry !== undefined) {
        return maxLevel > Curry._1(Ley_List$OptolithClient.length, maybeHeroEntry.active);
      } else {
        return true;
      }
    } else {
      return false;
    }
  } else {
    return true;
  }
}

function isValidExtendedSpecialAbility(param, staticEntry) {
  var validExtendedSpecialAbilities = param.validExtendedSpecialAbilities;
  switch (staticEntry.TAG | 0) {
    case /* Advantage */0 :
    case /* Disadvantage */1 :
        return true;
    case /* SpecialAbility */2 :
        var staticSpecialAbility = staticEntry._0;
        var match = Curry._1(Id$OptolithClient.SpecialAbility.Group.fromInt, staticSpecialAbility.gr);
        if (typeof match === "number") {
          if (match >= 14) {
            if (match !== 25 && match !== 33) {
              return true;
            } else {
              return Curry._2(Ley_List$OptolithClient.elem, staticSpecialAbility.id, validExtendedSpecialAbilities);
            }
          } else if (match !== 10 && match < 13) {
            return true;
          } else {
            return Curry._2(Ley_List$OptolithClient.elem, staticSpecialAbility.id, validExtendedSpecialAbilities);
          }
        } else {
          return true;
        }
    
  }
}

function isAdditionValid(cache, staticData, hero, maxLevel, staticEntry, maybeHeroEntry) {
  if (isEntrySpecificAdditionEnabled(cache, staticData, hero, staticEntry) && hasNoGenerallyRestrictingDependency(maybeHeroEntry) && hasNotReachedMaximumEntries(maxLevel, maybeHeroEntry) && isValidExtendedSpecialAbility(cache, staticEntry)) {
    switch (staticEntry.TAG | 0) {
      case /* Advantage */0 :
      case /* Disadvantage */1 :
          break;
      case /* SpecialAbility */2 :
          return true;
      
    }
    if (cache.requiredApplyToMagicalActions) {
      return !staticEntry._0.isExclusiveToArcaneSpellworks;
    } else {
      return true;
    }
  } else {
    return false;
  }
}

function getMaxLevel(staticData, hero, staticEntry, maybeHeroEntry) {
  var computedMax = Dependencies$OptolithClient.getMaxLevel(staticData, hero, Id$OptolithClient.Activatable.toAll(Activatable_Accessors$OptolithClient.id(staticEntry)), Ley_Option$OptolithClient.option(/* [] */0, (function (param) {
              return param.dependencies;
            }), maybeHeroEntry), Prerequisites$OptolithClient.Activatable.getLevelPrerequisites(staticEntry));
  var match = Activatable_Accessors$OptolithClient.max(staticEntry);
  if (computedMax !== undefined) {
    if (match !== undefined) {
      return Ley_Int$OptolithClient.min(computedMax, match);
    } else {
      return computedMax;
    }
  } else if (match !== undefined) {
    return match;
  } else {
    return ;
  }
}

export {
  getActivePactGiftsCount ,
  isAdditionValid ,
  getMaxLevel ,
  
}
/* Ley_List-OptolithClient Not a pure module */
