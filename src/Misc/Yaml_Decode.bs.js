// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Curry from "bs-platform/lib/es6/curry.js";
import * as Json_decode from "@glennsl/bs-json/src/Json_decode.bs.js";
import * as Item$OptolithClient from "../Equipment/Item.bs.js";
import * as Pact$OptolithClient from "./Pact.bs.js";
import * as Race$OptolithClient from "../RaceCultureProfession/Race.bs.js";
import * as Curse$OptolithClient from "../Increasable/Curse.bs.js";
import * as Skill$OptolithClient from "../Increasable/Skill.bs.js";
import * as Spell$OptolithClient from "../Increasable/Spell.bs.js";
import * as State$OptolithClient from "./State.bs.js";
import * as IdName$OptolithClient from "./IdName.bs.js";
import * as Script$OptolithClient from "./Script.bs.js";
import * as Cantrip$OptolithClient from "../Activatable/Cantrip.bs.js";
import * as Culture$OptolithClient from "../RaceCultureProfession/Culture.bs.js";
import * as Blessing$OptolithClient from "../Activatable/Blessing.bs.js";
import * as CoreRule$OptolithClient from "../Rules/CoreRule.bs.js";
import * as Language$OptolithClient from "./Language.bs.js";
import * as Ley_List$OptolithClient from "../Data/Ley_List.bs.js";
import * as Messages$OptolithClient from "./Messages.bs.js";
import * as Advantage$OptolithClient from "../Activatable/Advantage.bs.js";
import * as Attribute$OptolithClient from "../Increasable/Attribute.bs.js";
import * as Condition$OptolithClient from "./Condition.bs.js";
import * as FocusRule$OptolithClient from "../Rules/FocusRule.bs.js";
import * as Curriculum$OptolithClient from "../RaceCultureProfession/Curriculum.bs.js";
import * as Ley_IntMap$OptolithClient from "../Data/Ley_IntMap.bs.js";
import * as Ley_Option$OptolithClient from "../Data/Ley_Option.bs.js";
import * as Profession$OptolithClient from "../RaceCultureProfession/Profession.bs.js";
import * as RogueSpell$OptolithClient from "../Increasable/RogueSpell.bs.js";
import * as SkillGroup$OptolithClient from "../Increasable/SkillGroup.bs.js";
import * as AnimalShape$OptolithClient from "../Activatable/AnimalShape.bs.js";
import * as GeodeRitual$OptolithClient from "../Increasable/GeodeRitual.bs.js";
import * as Publication$OptolithClient from "../Sources/Publication.bs.js";
import * as TradeSecret$OptolithClient from "./TradeSecret.bs.js";
import * as AnimistForce$OptolithClient from "../Increasable/AnimistForce.bs.js";
import * as Disadvantage$OptolithClient from "../Activatable/Disadvantage.bs.js";
import * as MagicalDance$OptolithClient from "../Increasable/MagicalDance.bs.js";
import * as OptionalRule$OptolithClient from "../Rules/OptionalRule.bs.js";
import * as MagicalMelody$OptolithClient from "../Increasable/MagicalMelody.bs.js";
import * as ZibiljaRitual$OptolithClient from "../Increasable/ZibiljaRitual.bs.js";
import * as SpecialAbility$OptolithClient from "../Activatable/SpecialAbility.bs.js";
import * as ArcaneTradition$OptolithClient from "../Activatable/ArcaneTradition.bs.js";
import * as CombatTechnique$OptolithClient from "../Increasable/CombatTechnique.bs.js";
import * as ExperienceLevel$OptolithClient from "./ExperienceLevel.bs.js";
import * as LiturgicalChant$OptolithClient from "../Increasable/LiturgicalChant.bs.js";
import * as BlessedTradition$OptolithClient from "../Activatable/BlessedTradition.bs.js";
import * as DominationRitual$OptolithClient from "../Increasable/DominationRitual.bs.js";
import * as ElvenMagicalSong$OptolithClient from "../Increasable/ElvenMagicalSong.bs.js";
import * as EquipmentPackage$OptolithClient from "../Equipment/EquipmentPackage.bs.js";
import * as MagicalTradition$OptolithClient from "../Activatable/MagicalTradition.bs.js";
import * as DerivedCharacteristic$OptolithClient from "./DerivedCharacteristic.bs.js";
import * as EnhancementsSpecialAbility$OptolithClient from "../Increasable/EnhancementsSpecialAbility.bs.js";

var decodeUI = Messages$OptolithClient.Decode.t;

function idName(json) {
  return [
          Json_decode.field("id", Json_decode.$$int, json),
          Json_decode.field("name", Json_decode.string, json)
        ];
}

function idNames(json) {
  return Curry._1(Ley_IntMap$OptolithClient.fromList, Json_decode.list(idName, json));
}

function decodeFilesOfEntryType(decoder, fileContents) {
  return Curry._3(Ley_List$OptolithClient.foldl, (function (mp, fileContent) {
                return Ley_Option$OptolithClient.option(mp, (function (param) {
                              return Curry._3(Ley_IntMap$OptolithClient.insert, param[0], param[1], mp);
                            }), Curry._1(decoder, fileContent));
              }), Ley_IntMap$OptolithClient.empty, fileContents);
}

function decodeFiles(langs, messages, parsedData) {
  var animalShapes = decodeFilesOfEntryType((function (param) {
          return AnimalShape$OptolithClient.Decode.assoc(langs, param);
        }), parsedData.animalShapes);
  var animalShapePaths = decodeFilesOfEntryType((function (param) {
          return IdName$OptolithClient.Decode.assoc(langs, param);
        }), parsedData.animalShapePaths);
  var animalShapeSizes = decodeFilesOfEntryType(Curry._1(AnimalShape$OptolithClient.Size.Decode.assoc, langs), parsedData.animalShapeSizes);
  var animistForces = decodeFilesOfEntryType(Curry._1(AnimistForce$OptolithClient.Static.Decode.assoc, langs), parsedData.animistForces);
  var arcaneBardTraditions = decodeFilesOfEntryType((function (param) {
          return ArcaneTradition$OptolithClient.Decode.assoc(langs, param);
        }), parsedData.arcaneBardTraditions);
  var arcaneDancerTraditions = decodeFilesOfEntryType((function (param) {
          return ArcaneTradition$OptolithClient.Decode.assoc(langs, param);
        }), parsedData.arcaneDancerTraditions);
  var armorTypes = decodeFilesOfEntryType((function (param) {
          return IdName$OptolithClient.Decode.assoc(langs, param);
        }), parsedData.armorTypes);
  var aspects = decodeFilesOfEntryType((function (param) {
          return IdName$OptolithClient.Decode.assoc(langs, param);
        }), parsedData.aspects);
  var attributes = decodeFilesOfEntryType(Curry._1(Attribute$OptolithClient.Static.Decode.assoc, langs), parsedData.attributes);
  var blessedTraditions = decodeFilesOfEntryType((function (param) {
          return BlessedTradition$OptolithClient.Decode.assoc(langs, param);
        }), parsedData.blessedTraditions);
  var blessings = decodeFilesOfEntryType(Curry._1(Blessing$OptolithClient.Static.Decode.assoc, langs), parsedData.blessings);
  var brews = decodeFilesOfEntryType((function (param) {
          return IdName$OptolithClient.Decode.assoc(langs, param);
        }), parsedData.brews);
  var cantrips = decodeFilesOfEntryType(Curry._1(Cantrip$OptolithClient.Static.Decode.assoc, langs), parsedData.cantrips);
  var combatSpecialAbilityGroups = decodeFilesOfEntryType((function (param) {
          return IdName$OptolithClient.Decode.assoc(langs, param);
        }), parsedData.combatSpecialAbilityGroups);
  var combatTechniqueGroups = decodeFilesOfEntryType((function (param) {
          return IdName$OptolithClient.Decode.assoc(langs, param);
        }), parsedData.combatTechniqueGroups);
  var combatTechniques = decodeFilesOfEntryType(Curry._1(CombatTechnique$OptolithClient.Static.Decode.assoc, langs), parsedData.combatTechniques);
  var conditions = decodeFilesOfEntryType(Curry._1(Condition$OptolithClient.Static.Decode.assoc, langs), parsedData.conditions);
  var coreRules = decodeFilesOfEntryType((function (param) {
          return CoreRule$OptolithClient.Decode.assoc(langs, param);
        }), parsedData.coreRules);
  var cultures = decodeFilesOfEntryType(Curry._1(Culture$OptolithClient.Static.Decode.assoc, langs), parsedData.cultures);
  var curricula = decodeFilesOfEntryType(Curry._1(Curriculum$OptolithClient.Static.Decode.assoc, langs), parsedData.curricula);
  var curses = decodeFilesOfEntryType(Curry._1(Curse$OptolithClient.Static.Decode.assoc, langs), parsedData.curses);
  var derivedCharacteristics = decodeFilesOfEntryType(Curry._1(DerivedCharacteristic$OptolithClient.Static.Decode.assoc, langs), parsedData.derivedCharacteristics);
  var dominationRituals = decodeFilesOfEntryType(Curry._1(DominationRitual$OptolithClient.Static.Decode.assoc, langs), parsedData.dominationRituals);
  var elvenMagicalSongs = decodeFilesOfEntryType(Curry._1(ElvenMagicalSong$OptolithClient.Static.Decode.assoc, langs), parsedData.elvenMagicalSongs);
  var items = decodeFilesOfEntryType((function (param) {
          return Item$OptolithClient.Decode.assoc(langs, param);
        }), parsedData.items);
  var equipmentGroups = decodeFilesOfEntryType((function (param) {
          return IdName$OptolithClient.Decode.assoc(langs, param);
        }), parsedData.equipmentGroups);
  var equipmentPackages = decodeFilesOfEntryType((function (param) {
          return EquipmentPackage$OptolithClient.Decode.assoc(langs, param);
        }), parsedData.equipmentPackages);
  var experienceLevels = decodeFilesOfEntryType((function (param) {
          return ExperienceLevel$OptolithClient.Decode.assoc(langs, param);
        }), parsedData.experienceLevels);
  var eyeColors = decodeFilesOfEntryType((function (param) {
          return IdName$OptolithClient.Decode.assoc(langs, param);
        }), parsedData.eyeColors);
  var focusRules = decodeFilesOfEntryType(Curry._1(FocusRule$OptolithClient.Static.Decode.assoc, langs), parsedData.focusRules);
  var geodeRituals = decodeFilesOfEntryType(Curry._1(GeodeRitual$OptolithClient.Static.Decode.assoc, langs), parsedData.geodeRituals);
  var hairColors = decodeFilesOfEntryType((function (param) {
          return IdName$OptolithClient.Decode.assoc(langs, param);
        }), parsedData.hairColors);
  var languages = decodeFilesOfEntryType((function (param) {
          return Language$OptolithClient.Decode.assoc(langs, param);
        }), parsedData.languages);
  var liturgicalChantGroups = decodeFilesOfEntryType((function (param) {
          return IdName$OptolithClient.Decode.assoc(langs, param);
        }), parsedData.liturgicalChantGroups);
  var liturgicalChants = decodeFilesOfEntryType(Curry._1(LiturgicalChant$OptolithClient.Static.Decode.assoc, langs), parsedData.liturgicalChants);
  var liturgicalChantEnhancements = EnhancementsSpecialAbility$OptolithClient.liturgicalChantsToSpecialAbilityOptions(liturgicalChants);
  var magicalDances = decodeFilesOfEntryType(Curry._1(MagicalDance$OptolithClient.Static.Decode.assoc, langs), parsedData.magicalDances);
  var magicalMelodies = decodeFilesOfEntryType(Curry._1(MagicalMelody$OptolithClient.Static.Decode.assoc, langs), parsedData.magicalMelodies);
  var magicalTraditions = decodeFilesOfEntryType((function (param) {
          return MagicalTradition$OptolithClient.Decode.assoc(langs, param);
        }), parsedData.magicalTraditions);
  var optionalRules = decodeFilesOfEntryType(Curry._1(OptionalRule$OptolithClient.Static.Decode.assoc, langs), parsedData.optionalRules);
  var pacts = decodeFilesOfEntryType(Curry._1(Pact$OptolithClient.Static.Decode.assoc, langs), parsedData.pacts);
  var professions = decodeFilesOfEntryType(Curry._1(Profession$OptolithClient.Static.Decode.assoc, langs), parsedData.professions);
  var properties = decodeFilesOfEntryType((function (param) {
          return IdName$OptolithClient.Decode.assoc(langs, param);
        }), parsedData.properties);
  var publications = decodeFilesOfEntryType((function (param) {
          return Publication$OptolithClient.Decode.assoc(langs, param);
        }), parsedData.publications);
  var races = decodeFilesOfEntryType(Curry._1(Race$OptolithClient.Static.Decode.assoc, langs), parsedData.races);
  var reaches = decodeFilesOfEntryType((function (param) {
          return IdName$OptolithClient.Decode.assoc(langs, param);
        }), parsedData.reaches);
  var rogueSpells = decodeFilesOfEntryType(Curry._1(RogueSpell$OptolithClient.Static.Decode.assoc, langs), parsedData.rogueSpells);
  var scripts = decodeFilesOfEntryType((function (param) {
          return Script$OptolithClient.Decode.assoc(langs, param);
        }), parsedData.scripts);
  var skillGroups = decodeFilesOfEntryType((function (param) {
          return SkillGroup$OptolithClient.Decode.assoc(langs, param);
        }), parsedData.skillGroups);
  var skills = decodeFilesOfEntryType(Curry._1(Skill$OptolithClient.Static.Decode.assoc, langs), parsedData.skills);
  var socialStatuses = decodeFilesOfEntryType((function (param) {
          return IdName$OptolithClient.Decode.assoc(langs, param);
        }), parsedData.socialStatuses);
  var specialAbilityGroups = decodeFilesOfEntryType((function (param) {
          return IdName$OptolithClient.Decode.assoc(langs, param);
        }), parsedData.specialAbilityGroups);
  var spellGroups = decodeFilesOfEntryType((function (param) {
          return IdName$OptolithClient.Decode.assoc(langs, param);
        }), parsedData.spellGroups);
  var spells = decodeFilesOfEntryType(Curry._1(Spell$OptolithClient.Static.Decode.assoc, langs), parsedData.spells);
  var spellEnhancements = EnhancementsSpecialAbility$OptolithClient.spellsToSpecialAbilityOptions(spells);
  var states = decodeFilesOfEntryType(Curry._1(State$OptolithClient.Static.Decode.assoc, langs), parsedData.states);
  var subjects = decodeFilesOfEntryType((function (param) {
          return IdName$OptolithClient.Decode.assoc(langs, param);
        }), parsedData.subjects);
  var tradeSecrets = decodeFilesOfEntryType((function (param) {
          return TradeSecret$OptolithClient.Decode.assoc(langs, param);
        }), parsedData.tradeSecrets);
  var tribes = decodeFilesOfEntryType((function (param) {
          return IdName$OptolithClient.Decode.assoc(langs, param);
        }), parsedData.tribes);
  var zibiljaRituals = decodeFilesOfEntryType(Curry._1(ZibiljaRitual$OptolithClient.Static.Decode.assoc, langs), parsedData.zibiljaRituals);
  var advantages = decodeFilesOfEntryType(Curry.app(Advantage$OptolithClient.Static.Decode.assoc, [
            blessings,
            cantrips,
            combatTechniques,
            liturgicalChants,
            skills,
            spells,
            tradeSecrets,
            languages,
            scripts,
            animalShapes,
            spellEnhancements,
            liturgicalChantEnhancements,
            langs
          ]), parsedData.advantages);
  var disadvantages = decodeFilesOfEntryType(Curry.app(Disadvantage$OptolithClient.Static.Decode.assoc, [
            blessings,
            cantrips,
            combatTechniques,
            liturgicalChants,
            skills,
            spells,
            tradeSecrets,
            languages,
            scripts,
            animalShapes,
            spellEnhancements,
            liturgicalChantEnhancements,
            langs
          ]), parsedData.disadvantages);
  var baseSpecialAbilities = decodeFilesOfEntryType(Curry.app(SpecialAbility$OptolithClient.Static.Decode.assoc, [
            blessings,
            cantrips,
            combatTechniques,
            liturgicalChants,
            skills,
            spells,
            tradeSecrets,
            languages,
            scripts,
            animalShapes,
            spellEnhancements,
            liturgicalChantEnhancements,
            langs
          ]), parsedData.specialAbilities);
  var specialAbilities = Curry._1(SpecialAbility$OptolithClient.Static.Decode.modifyParsed, baseSpecialAbilities);
  return {
          advantages: advantages,
          animalShapes: animalShapes,
          animalShapePaths: animalShapePaths,
          animalShapeSizes: animalShapeSizes,
          animistForces: animistForces,
          arcaneBardTraditions: arcaneBardTraditions,
          arcaneDancerTraditions: arcaneDancerTraditions,
          armorTypes: armorTypes,
          aspects: aspects,
          attributes: attributes,
          blessedTraditions: blessedTraditions,
          blessings: blessings,
          brews: brews,
          cantrips: cantrips,
          combatSpecialAbilityGroups: combatSpecialAbilityGroups,
          combatTechniqueGroups: combatTechniqueGroups,
          combatTechniques: combatTechniques,
          conditions: conditions,
          coreRules: coreRules,
          cultures: cultures,
          curricula: curricula,
          curses: curses,
          derivedCharacteristics: derivedCharacteristics,
          disadvantages: disadvantages,
          dominationRituals: dominationRituals,
          elvenMagicalSongs: elvenMagicalSongs,
          items: items,
          equipmentGroups: equipmentGroups,
          equipmentPackages: equipmentPackages,
          experienceLevels: experienceLevels,
          eyeColors: eyeColors,
          focusRules: focusRules,
          geodeRituals: geodeRituals,
          hairColors: hairColors,
          languages: languages,
          liturgicalChantEnhancements: liturgicalChantEnhancements,
          liturgicalChantGroups: liturgicalChantGroups,
          liturgicalChants: liturgicalChants,
          magicalDances: magicalDances,
          magicalMelodies: magicalMelodies,
          magicalTraditions: magicalTraditions,
          messages: messages,
          optionalRules: optionalRules,
          pacts: pacts,
          professions: professions,
          properties: properties,
          publications: publications,
          races: races,
          reaches: reaches,
          rogueSpells: rogueSpells,
          scripts: scripts,
          skillGroups: skillGroups,
          skills: skills,
          socialStatuses: socialStatuses,
          specialAbilities: specialAbilities,
          specialAbilityGroups: specialAbilityGroups,
          spellEnhancements: spellEnhancements,
          spellGroups: spellGroups,
          spells: spells,
          states: states,
          subjects: subjects,
          tradeSecrets: tradeSecrets,
          tribes: tribes,
          zibiljaRituals: zibiljaRituals
        };
}

var IM;

export {
  IM ,
  decodeUI ,
  idName ,
  idNames ,
  decodeFilesOfEntryType ,
  decodeFiles ,
  
}
/* Item-OptolithClient Not a pure module */
