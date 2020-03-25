open Json.Decode;

[@bs.val] external _stringify: Js.Json.t => string = "JSON.stringify";

type yamlData = {
  advantagesL10n: Js.Json.t,
  advantagesUniv: Js.Json.t,
  animistForcesL10n: Js.Json.t,
  animistForcesUniv: Js.Json.t,
  arcaneBardTraditionsL10n: Js.Json.t,
  arcaneDancerTraditionsL10n: Js.Json.t,
  armorTypesL10n: Js.Json.t,
  aspectsL10n: Js.Json.t,
  attributesL10n: Js.Json.t,
  blessedTraditionsL10n: Js.Json.t,
  blessedTraditionsUniv: Js.Json.t,
  blessingsL10n: Js.Json.t,
  blessingsUniv: Js.Json.t,
  booksL10n: Js.Json.t,
  brewsL10n: Js.Json.t,
  cantripsL10n: Js.Json.t,
  cantripsUniv: Js.Json.t,
  combatSpecialAbilityGroupsL10n: Js.Json.t,
  combatTechniqueGroupsL10n: Js.Json.t,
  combatTechniquesL10n: Js.Json.t,
  combatTechniquesUniv: Js.Json.t,
  conditionsL10n: Js.Json.t,
  culturesL10n: Js.Json.t,
  culturesUniv: Js.Json.t,
  cursesL10n: Js.Json.t,
  cursesUniv: Js.Json.t,
  derivedCharacteristicsL10n: Js.Json.t,
  disadvantagesL10n: Js.Json.t,
  disadvantagesUniv: Js.Json.t,
  dominationRitualsL10n: Js.Json.t,
  dominationRitualsUniv: Js.Json.t,
  elvenMagicalSongsL10n: Js.Json.t,
  elvenMagicalSongsUniv: Js.Json.t,
  equipmentL10n: Js.Json.t,
  equipmentUniv: Js.Json.t,
  equipmentGroupsL10n: Js.Json.t,
  equipmentPackagesL10n: Js.Json.t,
  equipmentPackagesUniv: Js.Json.t,
  experienceLevelsL10n: Js.Json.t,
  experienceLevelsUniv: Js.Json.t,
  eyeColorsL10n: Js.Json.t,
  focusRulesL10n: Js.Json.t,
  focusRulesUniv: Js.Json.t,
  geodeRitualsL10n: Js.Json.t,
  geodeRitualsUniv: Js.Json.t,
  hairColorsL10n: Js.Json.t,
  liturgicalChantEnhancementsL10n: Js.Json.t,
  liturgicalChantEnhancementsUniv: Js.Json.t,
  liturgicalChantGroupsL10n: Js.Json.t,
  liturgicalChantsL10n: Js.Json.t,
  liturgicalChantsUniv: Js.Json.t,
  magicalDancesL10n: Js.Json.t,
  magicalDancesUniv: Js.Json.t,
  magicalMelodiesL10n: Js.Json.t,
  magicalMelodiesUniv: Js.Json.t,
  magicalTraditionsL10n: Js.Json.t,
  magicalTraditionsUniv: Js.Json.t,
  optionalRulesL10n: Js.Json.t,
  pactsL10n: Js.Json.t,
  professionsL10n: Js.Json.t,
  professionsUniv: Js.Json.t,
  professionVariantsL10n: Js.Json.t,
  professionVariantsUniv: Js.Json.t,
  propertiesL10n: Js.Json.t,
  racesL10n: Js.Json.t,
  racesUniv: Js.Json.t,
  raceVariantsL10n: Js.Json.t,
  raceVariantsUniv: Js.Json.t,
  reachesL10n: Js.Json.t,
  rogueSpellsL10n: Js.Json.t,
  rogueSpellsUniv: Js.Json.t,
  skillGroupsL10n: Js.Json.t,
  skillsL10n: Js.Json.t,
  skillsUniv: Js.Json.t,
  socialStatusesL10n: Js.Json.t,
  specialAbilitiesL10n: Js.Json.t,
  specialAbilitiesUniv: Js.Json.t,
  specialAbilityGroupsL10n: Js.Json.t,
  spellEnhancementsL10n: Js.Json.t,
  spellEnhancementsUniv: Js.Json.t,
  spellGroupsL10n: Js.Json.t,
  spellsL10n: Js.Json.t,
  spellsUniv: Js.Json.t,
  statesL10n: Js.Json.t,
  subjectsL10n: Js.Json.t,
  tribesL10n: Js.Json.t,
  uiL10n: Js.Json.t,
  zibiljaRitualsL10n: Js.Json.t,
  zibiljaRitualsUniv: Js.Json.t,
};

let conststr = (str: string, json) =>
  if ((Obj.magic(json): Js.String.t) == str) {
    str;
  } else {
    raise(
      DecodeError(
        "Expected \"" ++ str ++ "\", but received: " ++ _stringify(json),
      ),
    );
  };

let maybe = (decode: decoder('a), json) =>
  if ((Obj.magic(json): Js.undefined('a)) == Js.undefined) {
    Maybe.Nothing;
  } else {
    Maybe.Just(decode(json));
  };

let oneOrManyInt =
  oneOf([
    map((id): GenericHelpers.oneOrMany(int) => One(id), int),
    map((id): GenericHelpers.oneOrMany(int) => Many(id), list(int)),
  ]);

module Id = {
  let generic = (str, json) =>
    (field("scope", conststr(str), json), field("value", int, json)) |> snd;

  let experienceLevel = generic("ExperienceLevel");
  let race = generic("Race");
  let culture = generic("Culture");
  let profession = generic("Profession");
  let attribute = generic("Attribute");
  let advantage = generic("Advantage");
  let disadvantage = generic("Disadvantage");
  let skill = generic("Skill");
  let combatTechnique = generic("CombatTechnique");
  let spell = generic("Spell");
  let curse = generic("Curse");
  let elvenMagicalSong = generic("ElvenMagicalSong");
  let dominationRitual = generic("DominationRitual");
  let magicalMelody = generic("MagicalMelody");
  let magicalDance = generic("MagicalDance");
  let rogueSpell = generic("RogueSpell");
  let animistForce = generic("AnimistForce");
  let geodeRitual = generic("GeodeRitual");
  let zibiljaRitual = generic("ZibiljaRitual");
  let cantrip = generic("Cantrip");
  let liturgicalChant = generic("LiturgicalChant");
  let blessing = generic("Blessing");
  let specialAbility = generic("SpecialAbility");
  let item = generic("Item");
  let equipmentPackage = generic("EquipmentPackage");
  let hitZoneArmor = generic("HitZoneArmor");
  let familiar = generic("Familiar");
  let animal = generic("Animal");
  let focusRule = generic("FocusRule");
  let optionalRule = generic("OptionalRule");
  let condition = generic("Condition");
  let state = generic("State");
};

module SourceRefs = {
  type t = {
    id: string,
    firstPage: int,
    lastPage: Maybe.t(int),
  };

  let%private l10n = json => {
    id: json |> field("id", string),
    firstPage: json |> field("firstPage", int),
    lastPage: json |> field("lastPage", maybe(int)),
  };

  let fromJson = list(l10n);
};

module Errata = {
  type t = {
    date: Js.Date.t,
    description: string,
  };

  let%private l10n = json => {
    date: json |> field("id", date),
    description: json |> field("id", string),
  };

  let fromJson = list(l10n);
};

module Prerequisites = {
  module Sex = {
    type t = Static.Prerequisites.Sex.sex;

    let%private sexEnum = (str): t =>
      switch (str) {
      | "m" => Male
      | "f" => Female
      | _ => raise(DecodeError("Unknown sex prerequisite: " ++ str))
      };

    let fromJson = json => json |> string |> sexEnum;
  };

  module Race = {
    type t = Static.Prerequisites.Race.t;

    let fromJson =
      oneOf([
        (json) => ({id: json |> oneOrManyInt, active: true}: t),
        (json) => (
          {
            id: json |> field("id", oneOrManyInt),
            active: json |> field("active", bool),
          }: t
        ),
      ]);
  };

  module Culture = {
    type t = Static.Prerequisites.Culture.t;

    let fromJson = oneOrManyInt;
  };

  module PrimaryAttribute = {
    type t = Static.Prerequisites.PrimaryAttribute.t;
    type primaryType = Static.Prerequisites.PrimaryAttribute.primaryAttributeType;

    let%private typeEnum = (str): primaryType =>
      switch (str) {
      | "blessed" => Blessed
      | "magical" => Magical
      | _ => raise(DecodeError("Unknown primary attribute type: " ++ str))
      };

    let fromJson = (json): t => {
      scope: json |> field("type", string) |> typeEnum,
      value: json |> field("value", int),
    };
  };

  module Pact = {
    type t = Static.Prerequisites.Pact.t;

    let fromJson = (json): t => {
      category: json |> field("category", int),
      domain: json |> field("domain", maybe(oneOrManyInt)),
      level: json |> field("level", maybe(int)),
    };
  };

  module SocialStatus = {
    type t = Static.Prerequisites.SocialStatus.t;

    let fromJson = int;
  };

  module Activatable = {
    type t = Static.Prerequisites.Activatable.t;

    let id = json =>
      json
      |> oneOf([
           map(
             x => Static.Prerequisites.Activatable.Advantage(x),
             Id.advantage,
           ),
           map(
             x => Static.Prerequisites.Activatable.Disadvantage(x),
             Id.disadvantage,
           ),
           map(
             x => Static.Prerequisites.Activatable.SpecialAbility(x),
             Id.specialAbility,
           ),
         ]);

    let selectOptionId = (json): Ids.selectOptionId =>
      json
      |> oneOf([
           map(x => Ids.Generic(x), int),
           map(x => Ids.Skill(x), Id.skill),
           map(x => Ids.CombatTechnique(x), Id.combatTechnique),
         ]);

    let fromJson = (json): t => {
      id: json |> id,
      active: json |> bool,
      sid: json |> maybe(selectOptionId),
      sid2: json |> maybe(selectOptionId),
      tier: json |> maybe(int),
    };
  };

  module ActivatableMultiEntry = {
    type t = Static.Prerequisites.ActivatableMultiEntry.t;

    let fromJson = (json): t => {
      id: json |> list(Activatable.id),
      active: json |> bool,
      sid: json |> maybe(Activatable.selectOptionId),
      sid2: json |> maybe(Activatable.selectOptionId),
      tier: json |> maybe(int),
    };
  };

  module ActivatableMultiSelect = {
    type t = Static.Prerequisites.ActivatableMultiSelect.t;

    let fromJson = (json): t => {
      id: json |> Activatable.id,
      active: json |> bool,
      sid: json |> list(Activatable.selectOptionId),
      sid2: json |> maybe(Activatable.selectOptionId),
      tier: json |> maybe(int),
    };
  };

  module ActivatableSkill = {
    type t = Static.Prerequisites.ActivatableSkill.t;

    let id = json =>
      json
      |> oneOf([
           map(
             x => Static.Prerequisites.ActivatableSkill.Spell(x),
             Id.spell,
           ),
           map(
             x => Static.Prerequisites.ActivatableSkill.LiturgicalChant(x),
             Id.liturgicalChant,
           ),
         ]);

    let fromJson = (json): t => {id: json |> id, active: json |> bool};
  };

  module Increasable = {
    type t = Static.Prerequisites.Increasable.t;

    let increasableId = json =>
      json
      |> oneOf([
           map(
             x => Static.Prerequisites.Increasable.Attribute(x),
             Id.attribute,
           ),
           map(x => Static.Prerequisites.Increasable.Skill(x), Id.skill),
           map(
             x => Static.Prerequisites.Increasable.CombatTechnique(x),
             Id.combatTechnique,
           ),
           map(x => Static.Prerequisites.Increasable.Spell(x), Id.spell),
           map(
             x => Static.Prerequisites.Increasable.LiturgicalChant(x),
             Id.liturgicalChant,
           ),
         ]);

    let fromJson = (json): t => {
      id: json |> increasableId,
      value: json |> int,
    };
  };

  module IncreasableMultiEntry = {
    type t = Static.Prerequisites.IncreasableMultiEntry.t;

    let fromJson = (json): t => {
      id: json |> list(Increasable.increasableId),
      value: json |> int,
    };
  };
};

module SelectOptionsL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsL10n |> list(l10n);
};

module ProfessionSelectOptionsUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsUniv |> list(univ);
};

module AdvantagesL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsL10n |> list(l10n);
};

module AdvantagesUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsUniv |> list(univ);
};

module AnimistForcesL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsL10n |> list(l10n);
};

module AnimistForcesUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsUniv |> list(univ);
};

module ArcaneBardTraditionsL10n = {
  let%private l10n = json => (
    json |> field("id", int),
    json |> field("name", string),
  );

  let fromJson = yaml => yaml.arcaneBardTraditionsL10n |> list(l10n);
};

module ArcaneDancerTraditionsL10n = {
  let%private l10n = json => (
    json |> field("id", int),
    json |> field("name", string),
  );

  let fromJson = yaml => yaml.arcaneDancerTraditionsL10n |> list(l10n);
};

module ArmorTypesL10n = {
  let%private l10n = json => (
    json |> field("id", int),
    json |> field("name", string),
  );

  let fromJson = yaml => yaml.armorTypesL10n |> list(l10n);
};

module AspectsL10n = {
  let%private l10n = json => (
    json |> field("id", int),
    json |> field("name", string),
  );

  let fromJson = yaml => yaml.aspectsL10n |> list(l10n);
};

module AttributesL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsL10n |> list(l10n);
};

module BlessedTraditionsL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsL10n |> list(l10n);
};

module BlessedTraditionsUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsUniv |> list(univ);
};

module BlessingsL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsL10n |> list(l10n);
};

module BlessingsUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsUniv |> list(univ);
};

module BrewsL10n = {
  let%private l10n = json => (
    json |> field("id", int),
    json |> field("name", string),
  );

  let fromJson = yaml => yaml.brewsL10n |> list(l10n);
};

module CantripsL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsL10n |> list(l10n);
};

module CantripsUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsUniv |> list(univ);
};

module CombatSpecialAbilityGroupsL10n = {
  let%private l10n = json => (
    json |> field("id", int),
    json |> field("name", string),
  );

  let fromJson = yaml => yaml.combatSpecialAbilityGroupsL10n |> list(l10n);
};

module CombatTechniqueGroupsL10n = {
  let%private l10n = json => (
    json |> field("id", int),
    json |> field("name", string),
  );

  let fromJson = yaml => yaml.combatTechniqueGroupsL10n |> list(l10n);
};

module CombatTechniquesL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsL10n |> list(l10n);
};

module CombatTechniquesUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsUniv |> list(univ);
};

module ConditionsL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsL10n |> list(l10n);
};

module CulturesL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsL10n |> list(l10n);
};

module CulturesUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsUniv |> list(univ);
};

module CursesL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsL10n |> list(l10n);
};

module CursesUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsUniv |> list(univ);
};

module DerivedCharacteristicsL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsL10n |> list(l10n);
};

module DisadvantagesL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsL10n |> list(l10n);
};

module DisadvantagesUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsUniv |> list(univ);
};

module DominationRitualsL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsL10n |> list(l10n);
};

module DominationRitualsUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsUniv |> list(univ);
};

module ElvenMagicalSongsL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsL10n |> list(l10n);
};

module ElvenMagicalSongsUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsUniv |> list(univ);
};

module EquipmentL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsL10n |> list(l10n);
};

module EquipmentUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsUniv |> list(univ);
};

module EquipmentGroupsL10n = {
  let%private l10n = json => (
    json |> field("id", int),
    json |> field("name", string),
  );

  let fromJson = yaml => yaml.equipmentGroupsL10n |> list(l10n);
};

module EquipmentPackagesL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsL10n |> list(l10n);
};

module EquipmentPackagesUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsUniv |> list(univ);
};

module ExperienceLevelsL10n = {
  type t = {
    id: int,
    name: string,
  };

  let%private l10n = json => {
    id: json |> field("id", int),
    name: json |> field("name", string),
  };

  let fromJson = yaml => yaml.experienceLevelsL10n |> list(l10n);
};

module ExperienceLevelsUniv = {
  type t = {
    id: int,
    ap: int,
    maxAttributeValue: int,
    maxSkillRating: int,
    maxCombatTechniqueRating: int,
    maxTotalAttributeValues: int,
    maxSpellsLiturgicalChants: int,
    maxUnfamiliarSpells: int,
  };

  let%private univ = json => {
    id: json |> field("id", int),
    ap: json |> field("ap", int),
    maxAttributeValue: json |> field("maxAttributeValue", int),
    maxSkillRating: json |> field("maxSkillRating", int),
    maxCombatTechniqueRating: json |> field("maxCombatTechniqueRating", int),
    maxTotalAttributeValues: json |> field("maxTotalAttributeValues", int),
    maxSpellsLiturgicalChants:
      json |> field("maxSpellsLiturgicalChants", int),
    maxUnfamiliarSpells: json |> field("maxUnfamiliarSpells", int),
  };

  let fromJson = yaml => yaml.experienceLevelsUniv |> list(univ);
};

module EyeColorsL10n = {
  let%private l10n = json => (
    json |> field("id", int),
    json |> field("name", string),
  );

  let fromJson = yaml => yaml.eyeColorsL10n |> list(l10n);
};

module FocusRulesL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsL10n |> list(l10n);
};

module FocusRulesUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsUniv |> list(univ);
};

module GeodeRitualsL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsL10n |> list(l10n);
};

module GeodeRitualsUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsUniv |> list(univ);
};

module HairColorsL10n = {
  let%private l10n = json => (
    json |> field("id", int),
    json |> field("name", string),
  );

  let fromJson = yaml => yaml.hairColorsL10n |> list(l10n);
};

module LiturgicalChantEnhancementsL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsL10n |> list(l10n);
};

module LiturgicalChantEnhancementsUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsUniv |> list(univ);
};

module LiturgicalChantGroupsL10n = {
  let%private l10n = json => (
    json |> field("id", int),
    json |> field("name", string),
  );

  let fromJson = yaml => yaml.liturgicalChantGroupsL10n |> list(l10n);
};

module LiturgicalChantsL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsL10n |> list(l10n);
};

module LiturgicalChantsUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsUniv |> list(univ);
};

module MagicalDancesL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsL10n |> list(l10n);
};

module MagicalDancesUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsUniv |> list(univ);
};

module MagicalMelodiesL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsL10n |> list(l10n);
};

module MagicalMelodiesUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsUniv |> list(univ);
};

module MagicalTraditionsL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsL10n |> list(l10n);
};

module MagicalTraditionsUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsUniv |> list(univ);
};

module OptionalRulesL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsL10n |> list(l10n);
};

module PactsL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsL10n |> list(l10n);
};

module ProfessionsL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsL10n |> list(l10n);
};

module ProfessionsUniv = {
  // TODO

  module Options = {
    module SkillSpecialization = {
      let fromJson = oneOrManyInt;
    };

    module LanguagesAndScripts = {
      let fromJson = int;
    };

    module CombatTechniques = {
      type t = Static.Profession.Options.CombatTechniqueSelection.t;
      type second = Static.Profession.Options.CombatTechniqueSelection.second;

      let second = (json): second => {
        amount: json |> int,
        value: json |> int,
      };

      let fromJson = (json): t => {
        amount: json |> int,
        value: json |> int,
        second: json |> maybe(second),
        sid: json |> list(int),
      };
    };
  };

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsUniv |> list(univ);
};

module ProfessionVariantsL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsL10n |> list(l10n);
};

module ProfessionVariantsUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsUniv |> list(univ);
};

module PropertiesL10n = {
  let%private l10n = json => (
    json |> field("id", int),
    json |> field("name", string),
  );

  let fromJson = yaml => yaml.propertiesL10n |> list(l10n);
};

module PublicationsL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsL10n |> list(l10n);
};

module RacesL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsL10n |> list(l10n);
};

module RacesUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsUniv |> list(univ);
};

module RaceVariantL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsL10n |> list(l10n);
};

module RaceVariantUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsUniv |> list(univ);
};

module ReachesL10n = {
  let%private l10n = json => (
    json |> field("id", int),
    json |> field("name", string),
  );

  let fromJson = yaml => yaml.reachesL10n |> list(l10n);
};

module RogueSpellsL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsL10n |> list(l10n);
};

module RogueSpellsUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsUniv |> list(univ);
};

module SkillGroupsL10n = {
  let%private l10n = json => (
    json |> field("id", int),
    json |> field("name", string),
  );

  let fromJson = yaml => yaml.skillGroupsL10n |> list(l10n);
};

module SkillsL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsL10n |> list(l10n);
};

module SkillsUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsUniv |> list(univ);
};

module SocialStatusesL10n = {
  let%private l10n = json => (
    json |> field("id", int),
    json |> field("name", string),
  );

  let fromJson = yaml => yaml.socialStatusesL10n |> list(l10n);
};

module SpecialAbilitiesL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsL10n |> list(l10n);
};

module SpecialAbilitiesUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsUniv |> list(univ);
};

module SpecialAbilityGroupsL10n = {
  let%private l10n = json => (
    json |> field("id", int),
    json |> field("name", string),
  );

  let fromJson = yaml => yaml.specialAbilityGroupsL10n |> list(l10n);
};

module SpellEnhancementsL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsL10n |> list(l10n);
};

module SpellEnhancementsUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsUniv |> list(univ);
};

module SpellGroupsL10n = {
  let%private l10n = json => (
    json |> field("id", int),
    json |> field("name", string),
  );

  let fromJson = yaml => yaml.spellGroupsL10n |> list(l10n);
};

module SpellsL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsL10n |> list(l10n);
};

module SpellsUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsUniv |> list(univ);
};

module StatesL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsL10n |> list(l10n);
};

module SubjectsL10n = {
  let%private l10n = json => (
    json |> field("id", int),
    json |> field("name", string),
  );

  let fromJson = yaml => yaml.subjectsL10n |> list(l10n);
};

module SupportedLanguagesL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsL10n |> list(l10n);
};

module TribesL10n = {
  let%private l10n = json => (
    json |> field("id", int),
    json |> field("name", string),
  );

  let fromJson = yaml => yaml.tribesL10n |> list(l10n);
};

module UI = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsL10n |> list(l10n);
};

module ZibiljaRitualsL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsL10n |> list(l10n);
};

module ZibiljaRitualsUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.experienceLevelsUniv |> list(univ);
};
