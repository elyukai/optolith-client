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

let const = (x: 'a, json) =>
  if ((Obj.magic(json): 'a) == x) {
    x;
  } else {
    raise(
      DecodeError(
        "Expected \""
        ++ _stringify(json)
        ++ "\", but received: "
        ++ _stringify(json),
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
    (field("scope", const(str), json), field("value", int, json)) |> snd;

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
  type t = Static.SourceRef.t;

  let%private l10n = (json): t => {
    id: json |> field("id", string),
    page: {
      let first = json |> field("firstPage", int);
      let mlast = json |> field("lastPage", maybe(int));

      Maybe.maybe((first, first), last => (first, last), mlast);
    },
  };

  let fromJson = list(l10n);
};

module Errata = {
  type t = Static.Erratum.t;

  let%private l10n = (json): t => {
    date: json |> field("id", date),
    description: json |> field("id", string),
  };

  let fromJson = json => json |> maybe(list(l10n)) |> Maybe.fromMaybe([]);
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
      id: json |> field("id", id),
      active: json |> field("active", bool),
      sid: json |> field("sid", maybe(selectOptionId)),
      sid2: json |> field("sid2", maybe(selectOptionId)),
      level: json |> field("level", maybe(int)),
    };
  };

  module ActivatableMultiEntry = {
    type t = Static.Prerequisites.ActivatableMultiEntry.t;

    let fromJson = (json): t => {
      id: json |> field("id", list(Activatable.id)),
      active: json |> field("active", bool),
      sid: json |> field("sid", maybe(Activatable.selectOptionId)),
      sid2: json |> field("sid2", maybe(Activatable.selectOptionId)),
      level: json |> field("level", maybe(int)),
    };
  };

  module ActivatableMultiSelect = {
    type t = Static.Prerequisites.ActivatableMultiSelect.t;

    let fromJson = (json): t => {
      id: json |> field("id", Activatable.id),
      active: json |> field("active", bool),
      sid: json |> field("sid", list(Activatable.selectOptionId)),
      sid2: json |> field("sid2", maybe(Activatable.selectOptionId)),
      level: json |> field("tier", maybe(int)),
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

    let fromJson = (json): t => {
      id: json |> field("id", id),
      active: json |> field("active", bool),
    };
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
      id: json |> field("id", increasableId),
      value: json |> field("value", int),
    };
  };

  module IncreasableMultiEntry = {
    type t = Static.Prerequisites.IncreasableMultiEntry.t;

    let fromJson = (json): t => {
      id: json |> field("id", list(Increasable.increasableId)),
      value: json |> field("value", int),
    };
  };
};

module SelectOptionsL10n = {
  type t = {
    id: int,
    name: string,
    description: Maybe.t(string),
  };

  let fromJson = json => {
    id: json |> field("id", int),
    name: json |> field("name", string),
    description: json |> field("description", maybe(string)),
  };
};

module ICUniv = {
  let fromJson =
    oneOf([
      map(_ => IC.A, const("A")),
      map(_ => IC.B, const("B")),
      map(_ => IC.C, const("C")),
      map(_ => IC.D, const("D")),
    ]);
};

module SelectOptionsUniv = {
  type t = {
    id: int,
    cost: Maybe.t(int),
  };

  let fromJson = json => {
    id: json |> field("id", int),
    cost: json |> field("cost", maybe(int)),
  };
};

module AdvantagesL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.advantagesL10n |> list(l10n);
};

module AdvantagesUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.advantagesUniv |> list(univ);
};

module AnimistForcesL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.animistForcesL10n |> list(l10n);
};

module AnimistForcesUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.animistForcesUniv |> list(univ);
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
  type t = {
    id: int,
    name: string,
    short: string,
  };

  let%private l10n = json => {
    id: json |> field("id", int),
    name: json |> field("name", string),
    short: json |> field("short", string),
  };

  let fromJson = yaml => yaml.attributesL10n |> list(l10n);
};

module BlessedTraditionsL10n = {
  type t = {
    id: int,
    name: string,
  };

  let%private l10n = (json): t => {
    id: json |> field("id", int),
    name: json |> field("name", string),
  };

  let fromJson = yaml => yaml.blessedTraditionsL10n |> list(l10n);
};

module BlessedTraditionsUniv = {
  type t = {
    numId: int,
    id: int,
    primary: int,
    aspects: Maybe.t((int, int)),
  };

  let%private univ = (json): t => {
    numId: json |> field("numId", int),
    id: json |> field("id", int),
    primary: json |> field("primary", int),
    aspects: json |> field("aspects", maybe(pair(int, int))),
  };

  let fromJson = yaml => yaml.blessedTraditionsUniv |> list(univ);
};

module BlessingsL10n = {
  type t = {
    id: int,
    name: string,
    effect: string,
    range: string,
    duration: string,
    target: string,
    src: list(Static.SourceRef.t),
    errata: list(Static.Erratum.t),
  };

  let%private l10n = json => {
    id: json |> field("id", int),
    name: json |> field("name", string),
    effect: json |> field("effect", string),
    range: json |> field("range", string),
    duration: json |> field("duration", string),
    target: json |> field("target", string),
    src: json |> SourceRefs.fromJson,
    errata: json |> Errata.fromJson,
  };

  let fromJson = yaml => yaml.blessingsL10n |> list(l10n);
};

module BlessingsUniv = {
  type t = {
    id: int,
    traditions: list(int),
  };

  let%private univ = json => {
    id: json |> field("id", int),
    traditions: json |> field("traditions", list(int)),
  };

  let fromJson = yaml => yaml.blessingsUniv |> list(univ);
};

module BrewsL10n = {
  let%private l10n = json => (
    json |> field("id", int),
    json |> field("name", string),
  );

  let fromJson = yaml => yaml.brewsL10n |> list(l10n);
};

module CantripsL10n = {
  type t = {
    id: int,
    name: string,
    effect: string,
    range: string,
    duration: string,
    target: string,
    src: list(Static.SourceRef.t),
    errata: list(Static.Erratum.t),
  };

  let%private l10n = json => {
    id: json |> field("id", int),
    name: json |> field("name", string),
    effect: json |> field("effect", string),
    range: json |> field("range", string),
    duration: json |> field("duration", string),
    target: json |> field("target", string),
    src: json |> SourceRefs.fromJson,
    errata: json |> Errata.fromJson,
  };

  let fromJson = yaml => yaml.cantripsL10n |> list(l10n);
};

module CantripsUniv = {
  type t = {
    id: int,
    traditions: list(int),
    property: int,
    activatablePrerequisites: list(Static.Prerequisites.Activatable.t),
  };

  let%private univ = json => {
    id: json |> field("id", int),
    traditions: json |> field("traditions", list(int)),
    property: json |> field("property", int),
    activatablePrerequisites:
      json
      |> field(
           "activatablePrerequisites",
           maybe(list(Prerequisites.Activatable.fromJson)),
         )
      |> Maybe.fromMaybe([]),
  };

  let fromJson = yaml => yaml.cantripsUniv |> list(univ);
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
  type t = {
    id: int,
    name: string,
    special: Maybe.t(string),
    src: list(Static.SourceRef.t),
    errata: list(Static.Erratum.t),
  };

  let%private l10n = json => {
    id: json |> field("id", int),
    name: json |> field("name", string),
    special: json |> field("special", maybe(string)),
    src: json |> field("src", SourceRefs.fromJson),
    errata: json |> field("errata", Errata.fromJson),
  };

  let fromJson = yaml => yaml.combatTechniquesL10n |> list(l10n);
};

module CombatTechniquesUniv = {
  type t = {
    id: int,
    ic: IC.t,
    primary: list(int),
    bpr: int,
    hasNoParry: bool,
    gr: int,
  };

  let%private univ = json => {
    id: json |> field("id", int),
    ic: json |> field("ic", ICUniv.fromJson),
    primary: json |> field("primary", list(int)),
    bpr: json |> field("bpr", int),
    hasNoParry:
      json |> field("hasNoParry", maybe(bool)) |> Maybe.fromMaybe(false),
    gr: json |> field("gr", int),
  };

  let fromJson = yaml => yaml.combatTechniquesUniv |> list(univ);
};

module ConditionsL10n = {
  type t = Static.Condition.t;

  let%private l10n = (json): t => {
    id: json |> field("id", int),
    name: json |> field("name", string),
    description: json |> field("description", maybe(string)),
    levelDescriptions: (
      json |> field("level1", string),
      json |> field("level2", string),
      json |> field("level3", string),
      json |> field("level4", string),
    ),
    levelColumnDescription: json |> field("levelDescription", maybe(string)),
    src: json |> field("src", SourceRefs.fromJson),
    errata: json |> field("errata", Errata.fromJson),
  };

  let fromJson = yaml => yaml.conditionsL10n |> list(l10n);
};

module CulturesL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.culturesL10n |> list(l10n);
};

module CulturesUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.culturesUniv |> list(univ);
};

module CursesL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.cursesL10n |> list(l10n);
};

module CursesUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.cursesUniv |> list(univ);
};

module DerivedCharacteristicsL10n = {
  type t = Static.DerivedCharacteristic.t;

  let%private l10n = (json): t => {
    id: json |> field("id", string),
    name: json |> field("name", string),
    short: json |> field("short", string),
    calc: json |> field("calc", string),
    calcHalfPrimary: json |> field("calcHalfPrimary", maybe(string)),
    calcNoPrimary: json |> field("calcNoPrimary", maybe(string)),
  };

  let fromJson = yaml => yaml.derivedCharacteristicsL10n |> list(l10n);
};

module DisadvantagesL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.disadvantagesL10n |> list(l10n);
};

module DisadvantagesUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.disadvantagesUniv |> list(univ);
};

module DominationRitualsL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.dominationRitualsL10n |> list(l10n);
};

module DominationRitualsUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.dominationRitualsUniv |> list(univ);
};

module ElvenMagicalSongsL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.elvenMagicalSongsL10n |> list(l10n);
};

module ElvenMagicalSongsUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.elvenMagicalSongsUniv |> list(univ);
};

module EquipmentL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.equipmentL10n |> list(l10n);
};

module EquipmentUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.equipmentUniv |> list(univ);
};

module EquipmentGroupsL10n = {
  let%private l10n = json => (
    json |> field("id", int),
    json |> field("name", string),
    id,
  );

  let fromJson = yaml => yaml.equipmentGroupsL10n |> list(l10n);
};

module EquipmentPackagesL10n = {
  type t = {
    id: int,
    name: string,
    src: list(Static.SourceRef.t),
    errata: list(Static.Erratum.t),
  };

  let%private l10n = json => {
    id: json |> field("id", int),
    name: json |> field("name", string),
    src: json |> SourceRefs.fromJson,
    errata: json |> Errata.fromJson,
  };

  let fromJson = yaml => yaml.equipmentPackagesL10n |> list(l10n);
};

module EquipmentPackagesUniv = {
  type item = {
    id: int,
    amount: int,
  };

  let%private item = json => {
    id: json |> field("id", int),
    amount: json |> field("amount", maybe(int)) |> Maybe.fromMaybe(1),
  };

  type t = {
    id: int,
    items: list(item),
  };

  let%private univ = json => {
    id: json |> field("id", int),
    items: json |> field("items", list(item)),
  };

  let fromJson = yaml => yaml.equipmentPackagesUniv |> list(univ);
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
  type t = {
    id: int,
    name: string,
    description: string,
    src: list(Static.SourceRef.t),
    errata: list(Static.Erratum.t),
  };

  let%private l10n = json => {
    id: json |> field("id", int),
    name: json |> field("name", string),
    description: json |> field("description", string),
    src: json |> SourceRefs.fromJson,
    errata: json |> Errata.fromJson,
  };

  let fromJson = yaml => yaml.focusRulesL10n |> list(l10n);
};

module FocusRulesUniv = {
  type t = {
    id: int,
    subject: int,
    level: int,
  };

  let%private univ = json => {
    id: json |> field("id", int),
    subject: json |> field("subject", int),
    level: json |> field("level", int),
  };

  let fromJson = yaml => yaml.focusRulesUniv |> list(univ);
};

module GeodeRitualsL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.geodeRitualsL10n |> list(l10n);
};

module GeodeRitualsUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.geodeRitualsUniv |> list(univ);
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

  let fromJson = yaml => yaml.liturgicalChantEnhancementsL10n |> list(l10n);
};

module LiturgicalChantEnhancementsUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.liturgicalChantEnhancementsUniv |> list(univ);
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

  let fromJson = yaml => yaml.liturgicalChantsL10n |> list(l10n);
};

module LiturgicalChantsUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.liturgicalChantsUniv |> list(univ);
};

module MagicalDancesL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.magicalDancesL10n |> list(l10n);
};

module MagicalDancesUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.magicalDancesUniv |> list(univ);
};

module MagicalMelodiesL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.magicalMelodiesL10n |> list(l10n);
};

module MagicalMelodiesUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.magicalMelodiesUniv |> list(univ);
};

module MagicalTraditionsL10n = {
  type t = {
    id: int,
    name: string,
  };

  let%private l10n = (json): t => {
    id: json |> field("id", int),
    name: json |> field("name", string),
  };

  let fromJson = yaml => yaml.magicalTraditionsL10n |> list(l10n);
};

module MagicalTraditionsUniv = {
  type t = {
    id: int,
    numId: int,
    primary: Maybe.t(int),
    aeMod: Maybe.t(float),
    canLearnCantrips: bool,
    canLearnSpells: bool,
    canLearnRituals: bool,
    allowMultipleTraditions: bool,
    isDisAdvAPMaxHalved: bool,
    areDisAdvRequiredApplyToMagActionsOrApps: bool,
  };

  let%private univ = (json): t => {
    id: json |> field("id", int),
    numId: json |> field("numId", int),
    primary: json |> field("primary", maybe(int)),
    aeMod: json |> field("aeMod", maybe(float)),
    canLearnCantrips: json |> field("canLearnCantrips", bool),
    canLearnSpells: json |> field("canLearnSpells", bool),
    canLearnRituals: json |> field("canLearnRituals", bool),
    allowMultipleTraditions: json |> field("allowMultipleTraditions", bool),
    isDisAdvAPMaxHalved: json |> field("isDisAdvAPMaxHalved", bool),
    areDisAdvRequiredApplyToMagActionsOrApps:
      json |> field("areDisAdvRequiredApplyToMagActionsOrApps", bool),
  };

  let fromJson = yaml => yaml.magicalTraditionsUniv |> list(univ);
};

module OptionalRulesL10n = {
  type t = {
    id: int,
    name: string,
    description: string,
    src: list(Static.SourceRef.t),
    errata: list(Static.Erratum.t),
  };

  let%private l10n = json => {
    id: json |> field("id", int),
    name: json |> field("name", string),
    description: json |> field("description", string),
    src: json |> SourceRefs.fromJson,
    errata: json |> Errata.fromJson,
  };

  let fromJson = yaml => yaml.optionalRulesL10n |> list(l10n);
};

module PactsL10n = {
  let%private type_ = json => (
    json |> field("id", int),
    json |> field("name", string),
  );

  let%private domain = json => (
    json |> field("id", int),
    json |> field("name", string),
  );

  type t = {
    id: int,
    name: string,
    types: list((int, string)),
    domains: list((int, string)),
    src: list(Static.SourceRef.t),
    errata: list(Static.Erratum.t),
  };

  let%private l10n = json => {
    id: json |> field("id", int),
    name: json |> field("name", string),
    types: json |> field("types", list(type_)),
    domains: json |> field("domains", list(domain)),
    src: json |> SourceRefs.fromJson,
    errata: json |> Errata.fromJson,
  };

  let fromJson = yaml => yaml.pactsL10n |> list(l10n);
};

module ProfessionsL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.professionsL10n |> list(l10n);
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
        amount: json |> field("amount", int),
        value: json |> field("value", int),
      };

      let fromJson = (json): t => {
        amount: json |> field("amount", int),
        value: json |> field("value", int),
        second: json |> field("second", maybe(second)),
        sid: json |> field("sid", list(int)),
      };
    };

    module Cantrips = {
      type t = Static.Profession.Options.CantripSelection.t;

      let fromJson = (json): t => {
        amount: json |> field("amount", int),
        sid: json |> field("sid", list(int)),
      };
    };

    module Curses = {
      let fromJson = int;
    };

    module Skills = {
      type t = Static.Profession.Options.SkillSelection.t;

      let fromJson = (json): t => {
        gr: json |> field("gr", maybe(int)),
        value: json |> field("value", int),
      };
    };

    module TerrainKnowledge = {
      let fromJson = list(int);
    };
  };

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.professionsUniv |> list(univ);
};

module ProfessionVariantsL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.professionVariantsL10n |> list(l10n);
};

module ProfessionVariantsUniv = {
  // TODO

  module Options = {
    module SkillSpecialization = {
      type t = Static.Profession.Options.SkillSpecializationSelection.tForVariant;

      let fromJson = json =>
        json
        |> oneOf([
             json =>
               json
               |> ProfessionsUniv.Options.SkillSpecialization.fromJson
               |> ((x) => (Override(x): t)),
             json => json |> map(_: t => Remove, const(false)),
           ]);
    };

    module CombatTechniques = {
      type t = Static.Profession.Options.CombatTechniqueSelection.tForVariant;
      type main = Static.Profession.Options.CombatTechniqueSelection.tWithReplace;
      type second = Static.Profession.Options.CombatTechniqueSelection.secondForVariant;

      let second = json =>
        json
        |> oneOf([
             json =>
               json
               |> ProfessionsUniv.Options.CombatTechniques.second
               |> ((x) => (Override(x): second)),
             json => json |> map(_: second => Remove, const(false)),
           ]);

      let fromJson = json =>
        json
        |> oneOf([
             json =>
               (
                 {
                   amount: json |> field("amount", int),
                   value: json |> field("value", int),
                   second: json |> field("second", maybe(second)),
                   sid: json |> field("sid", list(int)),
                 }: main
               )
               |> ((x) => (Override(x): t)),
             json => json |> map(_: t => Remove, const(false)),
           ]);
    };
  };

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.professionVariantsUniv |> list(univ);
};

module PropertiesL10n = {
  let%private l10n = json => (
    json |> field("id", int),
    json |> field("name", string),
  );

  let fromJson = yaml => yaml.propertiesL10n |> list(l10n);
};

module PublicationsL10n = {
  type t = Static.Publication.t;

  let%private l10n = (json): t => {
    id: json |> field("id", string),
    name: json |> field("name", string),
    short: json |> field("short", string),
    isCore: json |> field("isCore", bool),
    isAdultContent: json |> field("isAdultContent", bool),
  };

  let fromJson = json => json.booksL10n |> list(l10n);
};

module RacesL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.racesL10n |> list(l10n);
};

module RacesUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.racesUniv |> list(univ);
};

module RaceVariantL10n = {
  // TODO

  type t = {id: int};

  let%private l10n = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.raceVariantsL10n |> list(l10n);
};

module RaceVariantUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.raceVariantsUniv |> list(univ);
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

  let fromJson = yaml => yaml.rogueSpellsL10n |> list(l10n);
};

module RogueSpellsUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.rogueSpellsUniv |> list(univ);
};

module SkillGroupsL10n = {
  type t = {
    id: int,
    name: string,
    fullName: string,
  };

  let%private l10n = json => {
    id: json |> field("id", int),
    name: json |> field("name", string),
    fullName: json |> field("fullName", string),
  };

  let fromJson = yaml => yaml.skillGroupsL10n |> list(l10n);
};

module SkillsL10n = {
  let%private application = json => (
    json |> field("id", int),
    json |> field("name", string),
  );

  let%private use = json => (
    json |> field("id", int),
    json |> field("name", string),
  );

  type t = {
    id: int,
    name: string,
    applications: list((int, string)),
    applicationsInput: Maybe.t(string),
    uses: list((int, string)),
    encDescription: Maybe.t(string),
    tools: Maybe.t(string),
    quality: string,
    failed: string,
    critical: string,
    botch: string,
    src: list(Static.SourceRef.t),
    errata: list(Static.Erratum.t),
  };

  let%private l10n = json => {
    id: json |> field("id", int),
    name: json |> field("name", string),
    applications: json |> field("applications", list(application)),
    applicationsInput: json |> field("applicationsInput", maybe(string)),
    uses: json |> field("uses", list(use)),
    encDescription: json |> field("encDescription", maybe(string)),
    tools: json |> field("tools", maybe(string)),
    quality: json |> field("quality", string),
    failed: json |> field("failed", string),
    critical: json |> field("critical", string),
    botch: json |> field("botch", string),
    src: json |> field("src", SourceRefs.fromJson),
    errata: json |> field("errata", Errata.fromJson),
  };

  let fromJson = yaml => yaml.skillsL10n |> list(l10n);
};

module SkillsUniv = {
  let%private application = json => (
    json |> field("id", int),
    json |> field("prerequisite", Prerequisites.Activatable.fromJson),
  );

  let%private use = json => (
    json |> field("id", int),
    json |> field("prerequisite", Prerequisites.Activatable.fromJson),
  );

  type encumbrance =
    | True
    | False
    | Maybe;

  type t = {
    id: int,
    applications: list((int, Prerequisites.Activatable.t)),
    uses: list((int, Prerequisites.Activatable.t)),
    check: (int, int, int),
    ic: IC.t,
    enc: encumbrance,
    gr: int,
  };

  let%private enc =
    oneOf([
      map(_ => True, const("true")),
      map(_ => False, const("false")),
      map(_ => Maybe, const("maybe")),
    ]);

  let%private univ = json => {
    id: json |> field("id", int),
    applications: json |> field("applications", list(application)),
    uses: json |> field("uses", list(use)),
    check: (
      json |> field("check1", int),
      json |> field("check2", int),
      json |> field("check3", int),
    ),
    ic: json |> field("ic", ICUniv.fromJson),
    enc: json |> field("enc", enc),
    gr: json |> field("gr", int),
  };

  let fromJson = yaml => yaml.skillsUniv |> list(univ);
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

  let fromJson = yaml => yaml.specialAbilitiesL10n |> list(l10n);
};

module SpecialAbilitiesUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.specialAbilitiesUniv |> list(univ);
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

  let fromJson = yaml => yaml.spellEnhancementsL10n |> list(l10n);
};

module SpellEnhancementsUniv = {
  // TODO

  type t = {id: int};

  let%private univ = json => {id: json |> field("id", int)};

  let fromJson = yaml => yaml.spellEnhancementsUniv |> list(univ);
};

module SpellGroupsL10n = {
  let%private l10n = json => (
    json |> field("id", int),
    json |> field("name", string),
  );

  let fromJson = yaml => yaml.spellGroupsL10n |> list(l10n);
};

module SpellsL10n = {
  type t = {
    id: int,
    name: string,
    effect: string,
    castingTime: string,
    castingTimeShort: string,
    aeCost: string,
    aeCostShort: string,
    range: string,
    rangeShort: string,
    duration: string,
    durationShort: string,
    target: string,
    src: list(Static.SourceRef.t),
    errata: list(Static.Erratum.t),
  };

  let%private l10n = json => {
    id: json |> field("id", int),
    name: json |> field("name", string),
    effect: json |> field("effect", string),
    castingTime: json |> field("castingTime", string),
    castingTimeShort: json |> field("castingTimeShort", string),
    aeCost: json |> field("aeCost", string),
    aeCostShort: json |> field("aeCostShort", string),
    range: json |> field("range", string),
    rangeShort: json |> field("rangeShort", string),
    duration: json |> field("duration", string),
    durationShort: json |> field("durationShort", string),
    target: json |> field("target", string),
    src: json |> field("src", SourceRefs.fromJson),
    errata: json |> field("errata", Errata.fromJson),
  };

  let fromJson = yaml => yaml.spellsL10n |> list(l10n);
};

module SpellsUniv = {
  type checkMod =
    | SPI
    | DOUBLE_SPI
    | TOU
    | MAX_SPI_TOU;

  type t = {
    id: int,
    check: (int, int, int),
    checkMod: Maybe.t(checkMod),
    ic: IC.t,
    traditions: list(int),
    property: int,
    castingTimeNoMod: bool,
    aeCostNoMod: bool,
    rangeNoMod: bool,
    durationNoMod: bool,
    activatablePrerequisites: list(Prerequisites.Activatable.t),
    increasablePrerequisites: list(Prerequisites.Increasable.t),
    gr: int,
  };

  let checkMod =
    oneOf([
      map(_ => SPI, const("SPI")),
      map(_ => DOUBLE_SPI, const("SPI/2")),
      map(_ => TOU, const("TOU")),
      map(_ => MAX_SPI_TOU, const("SPI/TOU")),
    ]);

  let%private univ = json => {
    id: json |> field("id", int),
    check: (
      json |> field("check1", int),
      json |> field("check2", int),
      json |> field("check3", int),
    ),
    checkMod: json |> field("checkMod", maybe(checkMod)),
    ic: json |> field("ic", ICUniv.fromJson),
    traditions: json |> field("traditions", list(int)),
    property: json |> field("property", int),
    castingTimeNoMod: json |> field("castingTimeNoMod", bool),
    aeCostNoMod: json |> field("aeCostNoMod", bool),
    rangeNoMod: json |> field("rangeNoMod", bool),
    durationNoMod: json |> field("durationNoMod", bool),
    activatablePrerequisites:
      json
      |> field(
           "activatablePrerequisites",
           maybe(list(Prerequisites.Activatable.fromJson)),
         )
      |> Maybe.fromMaybe([]),
    increasablePrerequisites:
      json
      |> field(
           "increasablePrerequisites",
           maybe(list(Prerequisites.Increasable.fromJson)),
         )
      |> Maybe.fromMaybe([]),
    gr: json |> field("gr", int),
  };

  let fromJson = yaml => yaml.spellsUniv |> list(univ);
};

module StatesL10n = {
  type t = Static.State.t;

  let%private l10n = (json): t => {
    id: json |> field("id", int),
    name: json |> field("name", string),
    description: json |> field("description", string),
    src: json |> SourceRefs.fromJson,
    errata: json |> Errata.fromJson,
  };

  let fromJson = yaml => yaml.statesL10n |> list(l10n);
};

module SubjectsL10n = {
  let%private l10n = json => (
    json |> field("id", int),
    json |> field("name", string),
  );

  let fromJson = yaml => yaml.subjectsL10n |> list(l10n);
};

module SupportedLanguagesL10n = {
  let%private l10n = json => (
    json |> field("id", string),
    json |> field("name", string),
  );

  let fromJson = list(l10n);
};

module TribesL10n = {
  let%private l10n = json => (
    json |> field("id", int),
    json |> field("name", string),
  );

  let fromJson = yaml => yaml.tribesL10n |> list(l10n);
};

module UI = {
  type t = {
    /**
     * - **0**: Name of the app
     */
    macosmenubar_aboutapp: string,
    macosmenubar_preferences: string,
    macosmenubar_quit: string,
    macosmenubar_edit: string,
    macosmenubar_view: string,

    initialization_loadtableserror: string,

    header_tabs_heroes: string,
    header_tabs_groups: string,
    header_tabs_wiki: string,
    header_tabs_faq: string,
    header_tabs_about: string,
    header_tabs_imprint: string,
    header_tabs_thirdpartylicenses: string,
    header_tabs_lastchanges: string,
    header_tabs_profile: string,
    header_tabs_overview: string,
    header_tabs_personaldata: string,
    header_tabs_charactersheet: string,
    header_tabs_pact: string,
    header_tabs_rules: string,
    header_tabs_racecultureandprofession: string,
    header_tabs_race: string,
    header_tabs_culture: string,
    header_tabs_profession: string,
    header_tabs_attributes: string,
    header_tabs_advantagesanddisadvantages: string,
    header_tabs_advantages: string,
    header_tabs_disadvantages: string,
    header_tabs_abilities: string,
    header_tabs_skills: string,
    header_tabs_combattechniques: string,
    header_tabs_specialabilities: string,
    header_tabs_spells: string,
    header_tabs_liturgicalchants: string,
    header_tabs_belongings: string,
    header_tabs_equipment: string,
    header_tabs_hitzonearmor: string,
    header_tabs_pets: string,

    /**
     * - **0**: AP left
     */
    header_apleft: string,
    header_savebtn: string,

    header_aptooltip_title: string,

    /**
     * - **0**: AP Total
     */
    header_aptooltip_total: string,

    /**
     * - **0**: AP Spent
     */
    header_aptooltip_spent: string,

    /**
     * - **0**: Current AP spent on advantages
     * - **1**: Maximum possible AP spent on advantages
     */
    header_aptooltip_spentonadvantages: string,

    /**
     * - **0**: Current AP spent on magic advantages
     * - **1**: Maximum possible AP spent on magic advantages
     */
    header_aptooltip_spentonmagicadvantages: string,

    /**
     * - **0**: Current AP spent on blessed advantages
     * - **1**: Maximum possible AP spent on blessed advantages
     */
    header_aptooltip_spentonblessedadvantages: string,

    /**
     * - **0**: Current AP spent on disadvantages
     * - **1**: Maximum possible AP spent on disadvantages
     */
    header_aptooltip_spentondisadvantages: string,

    /**
     * - **0**: Current AP spent on magic disadvantages
     * - **1**: Maximum possible AP spent on magic disadvantages
     */
    header_aptooltip_spentonmagicdisadvantages: string,

    /**
     * - **0**: Current AP spent on blessed disadvantages
     * - **1**: Maximum possible AP spent on blessed disadvantages
     */
    header_aptooltip_spentonblesseddisadvantages: string,

    /**
     * - **0**: AP spent on race
     */
    header_aptooltip_spentonrace: string,

    /**
     * - **0**: AP spent on profession
     */
    header_aptooltip_spentonprofession: string,

    /**
     * - **0**: AP spent on attributes
     */
    header_aptooltip_spentonattributes: string,

    /**
     * - **0**: AP spent on skills
     */
    header_aptooltip_spentonskills: string,

    /**
     * - **0**: AP spent on combat techniques
     */
    header_aptooltip_spentoncombattechniques: string,

    /**
     * - **0**: AP spent on spells
     */
    header_aptooltip_spentonspells: string,

    /**
     * - **0**: AP spent on cantrips
     */
    header_aptooltip_spentoncantrips: string,

    /**
     * - **0**: AP spent on liturgical chants
     */
    header_aptooltip_spentonliturgicalchants: string,

    /**
     * - **0**: AP spent on blessings
     */
    header_aptooltip_spentonblessings: string,

    /**
     * - **0**: AP spent on special abilities
     */
    header_aptooltip_spentonspecialabilities: string,

    /**
     * - **0**: AP spent on energies (LP/AE/KP)
     */
    header_aptooltip_spentonenergies: string,

    header_dialogs_herosaved: string,
    header_dialogs_allsaved: string,
    header_dialogs_everythingelsesaved: string,
    header_dialogs_saveconfigerror_title: string,
    header_dialogs_saveconfigerror_message: string,
    header_dialogs_saveheroeserror_title: string,
    header_dialogs_saveheroeserror_message: string,

    /**
     * - **0**: Weight in kg
     */
    general_weightvalue: string,

    /**
     * - **0**: Price in silverthalers
     */
    general_pricevalue: string,

    /**
     * - **0**: Length in cm
     */
    general_lengthvalue: string,
    general_dice: string,
    general_none: string,
    general_or: string,
    general_and: string,
    general_error: string,
    general_errorcode: string,
    general_emptylistplaceholder: string,
    general_emptylistnoresultsplaceholder: string,

    /**
     * - **0**: AP value
     */
    general_apvalue: string,

    /**
     * - **0**: AP value
     */
    general_apvalue_short: string,

    /**
     * - **0**: Name of element
     * - **1**: AP value
     */
    general_withapvalue: string,

    general_filters_searchfield_placeholder: string,
    general_filters_sort_alphabetically: string,
    general_filters_sort_bydatemodified: string,
    general_filters_sort_bygroup: string,
    general_filters_sort_byimprovementcost: string,
    general_filters_sort_byproperty: string,
    general_filters_sort_bylocation: string,
    general_filters_sort_bycost: string,
    general_filters_sort_byweight: string,
    general_filters_showactivatedentries: string,

    general_dialogs_savebtn: string,
    general_dialogs_donebtn: string,
    general_dialogs_deletebtn: string,
    general_dialogs_yesbtn: string,
    general_dialogs_nobtn: string,
    general_dialogs_okbtn: string,
    general_dialogs_cancelbtn: string,
    general_dialogs_copybtn: string,
    general_dialogs_createbtn: string,
    general_dialogs_applybtn: string,
    general_dialogs_addbtn: string,
    general_dialogs_notenoughap_title: string,

    /**
     * - **0**: Missing AP
     */
    general_dialogs_notenoughap_message: string,

    /**
     * - **0**: Category in which the limit is reached
     */
    general_dialogs_reachedaplimit_title: string,

    /**
     * - **0**: Missing AP
     * - **1**: Maximum possible AP spent on category
     * - **2**: Category in which the limit is reached
     */
    general_dialogs_reachedaplimit_message: string,
    general_dialogs_reachedaplimit_advantages: string,
    general_dialogs_reachedaplimit_magicaladvantages: string,
    general_dialogs_reachedaplimit_blessedadvantages: string,
    general_dialogs_reachedaplimit_disadvantages: string,
    general_dialogs_reachedaplimit_magicaldisadvantages: string,
    general_dialogs_reachedaplimit_blesseddisadvantages: string,

    settings_title: string,
    settings_language: string,
    settings_systemlanguage: string,
    settings_languagehint: string,
    settings_theme: string,
    settings_theme_dark: string,
    settings_theme_light: string,
    settings_showanimations: string,
    settings_enableeditingheroaftercreationphase: string,
    settings_checkforupdatesbtn: string,
    settings_newversionavailable_title: string,

    /**
     * - **0**: Version number
     */
    settings_newversionavailable_message: string,

    /**
     * - **0**: Version number
     * - **1**: Size of update package
     */
    settings_newversionavailable_messagewithsize: string,
    settings_newversionavailable_updatebtn: string,
    settings_nonewversionavailable_title: string,
    settings_nonewversionavailable_message: string,
    settings_downloadingupdate_title: string,

    heroes_filters_origin_allheroes: string,
    heroes_filters_origin_ownheroes: string,
    heroes_filters_origin_sharedheroes: string,
    heroes_importherobtn: string,
    heroes_createherobtn: string,
    heroes_exportheroasjsonbtn: string,
    heroes_duplicateherobtn: string,
    heroes_deleteherobtn: string,
    heroes_openherobtn: string,
    heroes_saveherobtn: string,
    heroes_unsavedhero_name: string,
    heroes_list_adventurepoints: string,
    heroes_dialogs_herosaved: string,
    heroes_dialogs_importheroerror_title: string,
    heroes_dialogs_importheroerror_message: string,
    heroes_dialogs_heroexportsavelocation_title: string,
    heroes_dialogs_herojsonsaveerror_title: string,
    heroes_dialogs_herojsonsaveerror_message: string,
    heroes_dialogs_unsavedactions_title: string,
    heroes_dialogs_unsavedactions_message: string,
    heroes_dialogs_unsavedactions_quit: string,
    heroes_dialogs_unsavedactions_saveandquit: string,

    /**
     * - **0**: Name of the hero to delete
     */
    heroes_dialogs_deletehero_title: string,
    heroes_dialogs_deletehero_message: string,
    heroes_dialogs_herocreation_title: string,
    heroes_dialogs_herocreation_nameofhero: string,
    heroes_dialogs_herocreation_sex_placeholder: string,
    heroes_dialogs_herocreation_sex_male: string,
    heroes_dialogs_herocreation_sex_female: string,
    heroes_dialogs_herocreation_experiencelevel_placeholder: string,
    heroes_dialogs_herocreation_startbtn: string,

    wiki_chooseacategory: string,
    wiki_chooseacategorytodisplayalist: string,
    wiki_filters_races: string,
    wiki_filters_cultures: string,
    wiki_filters_professions: string,
    wiki_filters_advantages: string,
    wiki_filters_disadvantages: string,
    wiki_filters_skills: string,
    wiki_filters_skills_all: string,
    wiki_filters_combattechniques: string,
    wiki_filters_combattechniques_all: string,
    wiki_filters_magic: string,
    wiki_filters_magic_all: string,
    wiki_filters_liturgicalchants: string,
    wiki_filters_liturgicalchants_all: string,
    wiki_filters_specialabilities: string,
    wiki_filters_specialabilities_all: string,
    wiki_filters_itemtemplates: string,
    wiki_filters_itemtemplates_all: string,

    imprint_title: string,

    profile_editprofessionnamebtn: string,
    profile_addadventurepointsbtn: string,
    profile_endherocreationbtn: string,
    profile_changeheroavatarbtn: string,
    profile_deleteavatarbtn: string,
    profile_dialogs_changeheroavatar_title: string,
    profile_dialogs_changeheroavatar_selectfilebtn: string,
    profile_dialogs_changeheroavatar_imagefiletype: string,
    profile_dialogs_changeheroavatar_invalidfilewarning: string,
    profile_dialogs_addadventurepoints_title: string,
    profile_dialogs_addadventurepoints_label: string,
    profile_advantages: string,
    profile_disadvantages: string,

    personaldata_title: string,
    personaldata_sex_male: string,
    personaldata_sex_female: string,
    personaldata_family: string,
    personaldata_placeofbirth: string,
    personaldata_dateofbirth: string,
    personaldata_age: string,
    personaldata_haircolor: string,
    personaldata_eyecolor: string,
    personaldata_size: string,
    personaldata_weight: string,
    personaldata_rank: string,
    personaldata_socialstatus: string,
    personaldata_characteristics: string,
    personaldata_otherinfo: string,
    personaldata_cultureareaknowledge: string,

    sheets_printtopdfbtn: string,
    sheets_dialogs_pdfexportsavelocation_title: string,
    sheets_dialogs_pdfsaved: string,
    sheets_dialogs_pdfsaveerror_title: string,
    sheets_dialogs_pdfsaveerror_message: string,
    sheets_dialogs_pdfcreationerror_title: string,
    sheets_dialogs_pdfcreationerror_message: string,
    sheets_showattributevalues: string,
    sheets_charactersheet: string,
    sheets_attributemodifiers_title: string,

    sheets_mainsheet_title: string,
    sheets_mainsheet_name: string,
    sheets_mainsheet_family: string,
    sheets_mainsheet_placeofbirth: string,
    sheets_mainsheet_dateofbirth: string,
    sheets_mainsheet_age: string,
    sheets_mainsheet_sex: string,
    sheets_mainsheet_race: string,
    sheets_mainsheet_size: string,
    sheets_mainsheet_weight: string,
    sheets_mainsheet_haircolor: string,
    sheets_mainsheet_eyecolor: string,
    sheets_mainsheet_culture: string,
    sheets_mainsheet_socialstatus: string,
    sheets_mainsheet_profession: string,
    sheets_mainsheet_rank: string,
    sheets_mainsheet_characteristics: string,
    sheets_mainsheet_otherinfo: string,
    sheets_mainsheet_experiencelevellabel: string,
    sheets_mainsheet_totalaplabel: string,
    sheets_mainsheet_apcollectedlabel: string,
    sheets_mainsheet_apspentlabel: string,
    sheets_mainsheet_avatarlabel: string,
    sheets_mainsheet_advantages: string,
    sheets_mainsheet_disadvantages: string,
    sheets_mainsheet_generalspecialabilites: string,
    sheets_mainsheet_fatepoints: string,
    sheets_mainsheet_derivedcharacteristics_labels_value: string,
    sheets_mainsheet_derivedcharacteristics_labels_bonuspenalty: string,
    sheets_mainsheet_derivedcharacteristics_labels_bonus: string,
    sheets_mainsheet_derivedcharacteristics_labels_bought: string,
    sheets_mainsheet_derivedcharacteristics_labels_max: string,
    sheets_mainsheet_derivedcharacteristics_labels_current: string,
    sheets_mainsheet_derivedcharacteristics_labels_basestat: string,
    sheets_mainsheet_derivedcharacteristics_labels_permanentlylostboughtback: string,

    sheets_gamestatssheet_title: string,
    sheets_gamestatssheet_skillstable_title: string,
    sheets_gamestatssheet_skillstable_labels_skill: string,
    sheets_gamestatssheet_skillstable_labels_check: string,
    sheets_gamestatssheet_skillstable_labels_encumbrance: string,
    sheets_gamestatssheet_skillstable_labels_improvementcost: string,
    sheets_gamestatssheet_skillstable_labels_skillrating: string,
    sheets_gamestatssheet_skillstable_labels_routinechecks: string,
    sheets_gamestatssheet_skillstable_labels_notes: string,
    sheets_gamestatssheet_skillstable_encumbrance_yes: string,
    sheets_gamestatssheet_skillstable_encumbrance_no: string,
    sheets_gamestatssheet_skillstable_encumbrance_maybe: string,
    sheets_gamestatssheet_skillstable_groups_pages: string,
    sheets_gamestatssheet_languages_title: string,
    sheets_gamestatssheet_languages_nativetongue: string,
    sheets_gamestatssheet_knownscripts_title: string,
    sheets_gamestatssheet_routinechecks_title: string,
    sheets_gamestatssheet_routinechecks_textRow1: string,
    sheets_gamestatssheet_routinechecks_textRow2: string,
    sheets_gamestatssheet_routinechecks_textRow3: string,
    sheets_gamestatssheet_routinechecks_textRow4: string,
    sheets_gamestatssheet_routinechecks_labels_checkmod: string,
    sheets_gamestatssheet_routinechecks_labels_neededsr: string,
    sheets_gamestatssheet_routinechecks_from3on: string,
    sheets_gamestatssheet_qualitylevels_title: string,
    sheets_gamestatssheet_qualitylevels_labels_skillpoints: string,
    sheets_gamestatssheet_qualitylevels_labels_qualitylevel: string,

    sheets_combatsheet_title: string,
    sheets_combatsheet_combattechniquestable_title: string,
    sheets_combatsheet_combattechniquestable_labels_combattechnique: string,
    sheets_combatsheet_combattechniquestable_labels_primaryattribute: string,
    sheets_combatsheet_combattechniquestable_labels_improvementcost: string,
    sheets_combatsheet_combattechniquestable_labels_combattechniquerating: string,
    sheets_combatsheet_combattechniquestable_labels_attackrangecombat: string,
    sheets_combatsheet_combattechniquestable_labels_parry: string,
    sheets_combatsheet_lifepoints_title: string,
    sheets_combatsheet_lifepoints_max: string,
    sheets_combatsheet_lifepoints_current: string,
    sheets_combatsheet_lifepoints_pain1: string,
    sheets_combatsheet_lifepoints_pain2: string,
    sheets_combatsheet_lifepoints_pain3: string,
    sheets_combatsheet_lifepoints_pain4: string,
    sheets_combatsheet_lifepoints_dying: string,
    sheets_combatsheet_closecombatweapons: string,
    sheets_combatsheet_closecombatweapons_labels_weapon: string,
    sheets_combatsheet_closecombatweapons_labels_combattechnique: string,
    sheets_combatsheet_closecombatweapons_labels_damagebonus: string,
    sheets_combatsheet_closecombatweapons_labels_damagepoints: string,
    sheets_combatsheet_closecombatweapons_labels_attackparrymodifier: string,
    sheets_combatsheet_closecombatweapons_labels_reach: string,
    sheets_combatsheet_closecombatweapons_labels_breakingpointrating: string,
    sheets_combatsheet_closecombatweapons_labels_damaged: string,
    sheets_combatsheet_closecombatweapons_labels_attack: string,
    sheets_combatsheet_closecombatweapons_labels_parry: string,
    sheets_combatsheet_closecombatweapons_labels_weight: string,
    sheets_combatsheet_rangedcombatweapons: string,
    sheets_combatsheet_rangedcombatweapons_labels_weapon: string,
    sheets_combatsheet_rangedcombatweapons_labels_combattechnique: string,
    sheets_combatsheet_rangedcombatweapons_labels_reloadtime: string,
    sheets_combatsheet_rangedcombatweapons_labels_damagepoints: string,
    sheets_combatsheet_rangedcombatweapons_labels_ammunition: string,
    sheets_combatsheet_rangedcombatweapons_labels_rangebrackets: string,
    sheets_combatsheet_rangedcombatweapons_labels_breakingpointrating: string,
    sheets_combatsheet_rangedcombatweapons_labels_damaged: string,
    sheets_combatsheet_rangedcombatweapons_labels_rangedcombat: string,
    sheets_combatsheet_rangedcombatweapons_labels_weight: string,
    sheets_combatsheet_armors_title: string,
    sheets_combatsheet_armors_labels_armor: string,
    sheets_combatsheet_armors_labels_sturdinessrating: string,
    sheets_combatsheet_armors_labels_wear: string,
    sheets_combatsheet_armors_labels_protection: string,
    sheets_combatsheet_armors_labels_encumbrance: string,
    sheets_combatsheet_armors_labels_movementinitiative: string,
    sheets_combatsheet_armors_labels_carriedwhereexamples: string,
    sheets_combatsheet_armors_labels_head: string,
    sheets_combatsheet_armors_labels_torso: string,
    sheets_combatsheet_armors_labels_leftarm: string,
    sheets_combatsheet_armors_labels_rightarm: string,
    sheets_combatsheet_armors_labels_leftleg: string,
    sheets_combatsheet_armors_labels_rightleg: string,
    sheets_combatsheet_armors_labels_weight: string,
    sheets_combatsheet_shieldparryingweapon_title: string,
    sheets_combatsheet_shieldparryingweapon_labels_shieldparryingweapon: string,
    sheets_combatsheet_shieldparryingweapon_labels_structurepoints: string,
    sheets_combatsheet_shieldparryingweapon_labels_breakingpointrating: string,
    sheets_combatsheet_shieldparryingweapon_labels_damaged: string,
    sheets_combatsheet_shieldparryingweapon_labels_attackparrymodifier: string,
    sheets_combatsheet_shieldparryingweapon_labels_weight: string,
    sheets_combatsheet_actions: string,
    sheets_combatsheet_combatspecialabilities: string,
    sheets_combatsheet_conditions: string,
    sheets_combatsheet_states: string,

    sheets_belongingssheet_title: string,
    sheets_belongingssheet_equipmenttable_title: string,
    sheets_belongingssheet_equipmenttable_labels_item: string,
    sheets_belongingssheet_equipmenttable_labels_number: string,
    sheets_belongingssheet_equipmenttable_labels_price: string,
    sheets_belongingssheet_equipmenttable_labels_weight: string,
    sheets_belongingssheet_equipmenttable_labels_carriedwhere: string,
    sheets_belongingssheet_equipmenttable_labels_total: string,
    sheets_belongingssheet_purse_title: string,
    sheets_belongingssheet_purse_ducats: string,
    sheets_belongingssheet_purse_silverthalers: string,
    sheets_belongingssheet_purse_halers: string,
    sheets_belongingssheet_purse_kreutzers: string,
    sheets_belongingssheet_purse_gems: string,
    sheets_belongingssheet_purse_jewelry: string,
    sheets_belongingssheet_purse_other: string,
    sheets_belongingssheet_carryingcapacity_title: string,
    sheets_belongingssheet_carryingcapacity_calc: string,
    sheets_belongingssheet_carryingcapacity_label: string,
    sheets_belongingssheet_animal_title: string,
    sheets_belongingssheet_animal_name: string,
    sheets_belongingssheet_animal_sizecategory: string,
    sheets_belongingssheet_animal_type: string,
    sheets_belongingssheet_animal_ap: string,
    sheets_belongingssheet_animal_protection: string,
    sheets_belongingssheet_animal_attackname: string,
    sheets_belongingssheet_animal_attack: string,
    sheets_belongingssheet_animal_parry: string,
    sheets_belongingssheet_animal_damagepoints: string,
    sheets_belongingssheet_animal_reach: string,
    sheets_belongingssheet_animal_actions: string,
    sheets_belongingssheet_animal_skills: string,
    sheets_belongingssheet_animal_specialabilities: string,
    sheets_belongingssheet_animal_notes: string,

    sheets_spellssheet_title: string,
    sheets_spellssheet_header_labels_aemax: string,
    sheets_spellssheet_header_labels_aecurrent: string,
    sheets_spellssheet_spellstable_title: string,
    sheets_spellssheet_spellstable_labels_spellorritual: string,
    sheets_spellssheet_spellstable_labels_check: string,
    sheets_spellssheet_spellstable_labels_skillrating: string,
    sheets_spellssheet_spellstable_labels_cost: string,
    sheets_spellssheet_spellstable_labels_castingtime: string,
    sheets_spellssheet_spellstable_labels_range: string,
    sheets_spellssheet_spellstable_labels_duration: string,
    sheets_spellssheet_spellstable_labels_property: string,
    sheets_spellssheet_spellstable_labels_improvementcost: string,
    sheets_spellssheet_spellstable_labels_effect: string,
    sheets_spellssheet_spellstable_labels_pages: string,
    sheets_spellssheet_spellstable_unfamiliarspell: string,
    sheets_spellssheet_primaryattribute: string,
    sheets_spellssheet_properties: string,
    sheets_spellssheet_tradition: string,
    sheets_spellssheet_magicalspecialabilities: string,
    sheets_spellssheet_cantrips: string,

    sheets_chantssheet_title: string,
    sheets_chantssheet_header_labels_kpmax: string,
    sheets_chantssheet_header_labels_kpcurrent: string,
    sheets_chantssheet_chantstable_title: string,
    sheets_chantssheet_chantstable_labels_chant: string,
    sheets_chantssheet_chantstable_labels_check: string,
    sheets_chantssheet_chantstable_labels_skillrating: string,
    sheets_chantssheet_chantstable_labels_cost: string,
    sheets_chantssheet_chantstable_labels_castingtime: string,
    sheets_chantssheet_chantstable_labels_range: string,
    sheets_chantssheet_chantstable_labels_duration: string,
    sheets_chantssheet_chantstable_labels_aspect: string,
    sheets_chantssheet_chantstable_labels_improvementcost: string,
    sheets_chantssheet_chantstable_labels_effect: string,
    sheets_chantssheet_chantstable_labels_pages: string,
    sheets_chantssheet_primaryattribute: string,
    sheets_chantssheet_aspects: string,
    sheets_chantssheet_tradition: string,
    sheets_chantssheet_blessedspecialabilities: string,
    sheets_chantssheet_blessings: string,

    pacts_pactcategory: string,
    pacts_nopact: string,
    pacts_pactlevel: string,
    pacts_fairytype: string,
    pacts_domain: string,
    pacts_userdefined: string,
    pacts_demontype: string,
    pacts_circleofdamnation: string,
    pacts_minorpact: string,
    pacts_pactisincompletehint: string,
    pacts_name: string,

    rules_rulebase: string,
    rules_enableallrulebooks: string,
    rules_focusrules: string,
    rules_optionalrules: string,
    rules_manualherodatarepair: string,
    rules_manualherodatarepairexplanation: string,

    inlinewiki_complementarysources: string,

    race_header_name: string,
    race_header_adventurepoints: string,
    race_header_adventurepoints_tooltip: string,

    inlinewiki_apvalue: string,
    inlinewiki_adventurepoints: string,
    inlinewiki_lifepointbasevalue: string,
    inlinewiki_spiritbasevalue: string,
    inlinewiki_toughnessbasevalue: string,
    inlinewiki_movementbasevalue: string,
    inlinewiki_attributeadjustments: string,
    inlinewiki_automaticadvantages: string,
    inlinewiki_stronglyrecommendedadvantages: string,
    inlinewiki_stronglyrecommendeddisadvantages: string,
    inlinewiki_commoncultures: string,
    inlinewiki_commonadvantages: string,
    inlinewiki_commondisadvantages: string,
    inlinewiki_uncommonadvantages: string,
    inlinewiki_uncommondisadvantages: string,

    culture_filters_common_allcultures: string,
    culture_filters_common_commoncultures: string,
    culture_header_name: string,

    inlinewiki_language: string,
    inlinewiki_script: string,
    inlinewiki_areaknowledge: string,
    inlinewiki_socialstatus: string,
    inlinewiki_commonprofessions: string,
    inlinewiki_commonprofessions_mundane: string,
    inlinewiki_commonprofessions_magic: string,
    inlinewiki_commonprofessions_blessed: string,
    inlinewiki_commonskills: string,
    inlinewiki_uncommonskills: string,
    inlinewiki_commonnames: string,

    /**
     * - **0**: Name of cultural package
     * - **1**: AP cost of the cultural package
     */
    inlinewiki_culturalpackage: string,

    profession_ownprofession: string,
    profession_variants_novariant: string,
    profession_filters_common_allprofessions: string,
    profession_filters_common_commonprofessions: string,
    profession_filters_groups_allprofessiongroups: string,
    profession_filters_groups_mundaneprofessions: string,
    profession_filters_groups_magicalprofessions: string,
    profession_filters_groups_blessedprofessions: string,
    profession_header_name: string,
    profession_header_adventurepoints: string,
    profession_header_adventurepoints_tooltip: string,

    inlinewiki_prerequisites: string,
    inlinewiki_race: string,
    inlinewiki_specialabilities: string,

    /**
     * - **0**: AP given
     */
    inlinewiki_languagesandliteracytotalingap: string,

    /**
     * - **0**: Skill name(s)
     */
    inlinewiki_skillspecialization: string,

    /**
     * - **0**: AP given
     * - **1**: Skill group
     */
    inlinewiki_skillsselection: string,
    inlinewiki_combattechniques: string,

    /**
     * - **0**: Amount of combat techniques to choose
     * - **1**: CtR of the selected combat techniques after application
     * - **2**: List of possible combat techniques
     */
    inlinewiki_combattechniqueselection: string,
    inlinewiki_combattechnique_one: string,
    inlinewiki_combattechnique_two: string,

    /**
     * - **0**: Amount of combat techniques to choose
     * - **1**: CtR of the selected combat techniques after application
     * - **2**: Amount of combat techniques to choose in a second selection
     * - **3**: CtR of the selected combat techniques from second selection after
     *   application
     * - **4**: List of possible combat techniques
     */
    inlinewiki_combattechniquesecondselection: string,
    inlinewiki_skills: string,
    inlinewiki_spells: string,

    /**
     * - **0**: AP given
     */
    inlinewiki_cursestotalingap: string,

    /**
     * - **0**: Amount of cantrips to choose
     * - **1**: List of possible cantrips
     */
    inlinewiki_cantripsfromlist: string,
    inlinewiki_cantrip_one: string,
    inlinewiki_cantrip_two: string,
    inlinewiki_liturgicalchants: string,
    inlinewiki_thetwelveblessings: string,

    /**
     * - **0**: name of first excluded blessing
     * - **1**: name of second excluded blessing
     * - **2**: name of third excluded blessing
     */
    inlinewiki_thetwelveblessingsexceptions: string,
    inlinewiki_sixblessings: string,
    inlinewiki_suggestedadvantages: string,
    inlinewiki_suggesteddisadvantages: string,
    inlinewiki_unsuitableadvantages: string,
    inlinewiki_unsuitabledisadvantages: string,
    inlinewiki_variants: string,
    inlinewiki_insteadof: string,

    rcpselectoptions_race: string,
    rcpselectoptions_culture: string,
    rcpselectoptions_profession: string,

    /**
     * - **0**: Amount of cantrips to choose
     */
    rcpselectoptions_cantripsfromlist: string,
    rcpselectoptions_cantrip_one: string,
    rcpselectoptions_cantrip_two: string,

    /**
     * - **0**: Amount of combat techniques to choose
     * - **1**: CtR of the selected combat techniques after application
     */
    rcpselectoptions_combattechniqueselection: string,
    rcpselectoptions_combattechnique_one: string,
    rcpselectoptions_combattechnique_two: string,
    rcpselectoptions_selectattributeadjustment: string,
    rcpselectoptions_buyculturalpackage: string,
    rcpselectoptions_nativetongue_placeholder: string,
    rcpselectoptions_buyscript: string,
    rcpselectoptions_script_placeholder: string,

    /**
     * - **0**: Amount of combat techniques to choose in a second selection
     * - **1**: CtR of the selected combat techniques from second selection after
     *   application
     */
    rcpselectoptions_combattechniquesecondselection: string,

    /**
     * - **0**: AP given
     * - **1**: AP left
     */
    rcpselectoptions_cursestotalingapleft: string,

    /**
     * - **0**: AP given
     * - **1**: AP left
     */
    rcpselectoptions_languagesandliteracytotalingapleft: string,
    rcpselectoptions_applicationforskillspecialization: string,

    /**
     * - **0**: Skill group
     * - **1**: AP given
     * - **2**: AP left
     */
    rcpselectoptions_skillselectionap: string,

    /**
     * - **0**: Skill name(s)
     */
    rcpselectoptions_skillspecialization: string,
    rcpselectoptions_completebtn: string,
    rcpselectoptions_unfamiliarspells: string,
    rcpselectoptions_unfamiliarspellselectionfortraditionguildmage: string,
    rcpselectoptions_unfamiliarspell_placeholder: string,
    rcpselectoptions_unfamiliarspell: string,

    attributes_totalpoints: string,
    attributes_attributeadjustmentselection: string,
    attributes_derivedcharacteristics_tooltips_modifier: string,
    attributes_derivedcharacteristics_tooltips_bought: string,
    attributes_derivedcharacteristics_tooltips_losttotal: string,
    attributes_derivedcharacteristics_tooltips_boughtback: string,
    attributes_lostpermanently_lifepoints: string,
    attributes_lostpermanently_lifepoints_short: string,
    attributes_lostpermanently_arcaneenergy: string,
    attributes_lostpermanently_arcaneenergy_short: string,
    attributes_lostpermanently_karmapoints: string,
    attributes_lostpermanently_karmapoints_short: string,
    attributes_removeenergypointslostpermanently_title: string,
    attributes_removeenergypointslostpermanently_message: string,
    attributes_removeenergypointslostpermanently_removebtn: string,
    attributes_pointslostpermanentlyeditor_boughtback: string,
    attributes_pointslostpermanentlyeditor_spent: string,

    advantages_filters_commonadvantages: string,
    disadvantages_filters_commondisadvantages: string,
    advantagesdisadvantages_addbtn: string,
    advantagesdisadvantages_afraidof: string,
    advantagesdisadvantages_immunityto: string,
    advantagesdisadvantages_hatredfor: string,
    advantagesdisadvantages_header_name: string,
    advantagesdisadvantages_header_adventurepoints: string,
    advantagesdisadvantages_header_adventurepoints_tooltip: string,

    /**
     * - **0**: Current AP spent on advantages
     * - **1**: Maximum possible AP spent on advantages
     */
    advantagesdisadvantages_apspent_spentonadvantages: string,

    /**
     * - **0**: Current AP spent on magic advantages
     * - **1**: Maximum possible AP spent on magic advantages
     */
    advantagesdisadvantages_apspent_spentonmagicadvantages: string,

    /**
     * - **0**: Current AP spent on blessed advantages
     * - **1**: Maximum possible AP spent on blessed advantages
     */
    advantagesdisadvantages_apspent_spentonblessedadvantages: string,

    /**
     * - **0**: Current AP spent on disadvantages
     * - **1**: Maximum possible AP spent on disadvantages
     */
    advantagesdisadvantages_apspent_spentondisadvantages: string,

    /**
     * - **0**: Current AP spent on magic disadvantages
     * - **1**: Maximum possible AP spent on magic disadvantages
     */
    advantagesdisadvantages_apspent_spentonmagicdisadvantages: string,

    /**
     * - **0**: Current AP spent on blessed disadvantages
     * - **1**: Maximum possible AP spent on blessed disadvantages
     */
    advantagesdisadvantages_apspent_spentonblesseddisadvantages: string,
    advantagesdisadvantages_dialogs_customcost_title: string,

    /**
     * - **0**: Entry name
     */
    advantagesdisadvantages_dialogs_customcost_for: string,
    specialabilities_addbtn: string,
    specialabilities_header_name: string,
    specialabilities_header_group: string,
    specialabilities_header_adventurepoints: string,
    specialabilities_header_adventurepoints_tooltip: string,
    specialabilities_nativetonguelevel: string,

    inlinewiki_rule: string,
    inlinewiki_effect: string,
    inlinewiki_extendedcombatspecialabilities: string,
    inlinewiki_extendedmagicalspecialabilities: string,
    inlinewiki_extendedblessedspecialabilities: string,
    inlinewiki_extendedskillspecialabilities: string,
    inlinewiki_penalty: string,
    inlinewiki_level: string,
    inlinewiki_perlevel: string,
    inlinewiki_volume: string,
    inlinewiki_aspect: string,
    inlinewiki_bindingcost: string,
    inlinewiki_protectivecircle: string,
    inlinewiki_wardingcircle: string,
    inlinewiki_actions: string,

    /**
     * - **0**: Entry name
     * - **1**: category (advantage, disadvantage,___)
     */
    inlinewiki_racecultureorprofessionrequiresautomaticorsuggested: string,
    inlinewiki_advantage: string,
    inlinewiki_disadvantage: string,
    inlinewiki_primaryattributeofthetradition: string,
    inlinewiki_knowledgeofspell: string,
    inlinewiki_knowledgeofliturgicalchant: string,
    inlinewiki_appropriatecombatstylespecialability: string,
    inlinewiki_appropriatemagicalstylespecialability: string,
    inlinewiki_appropriateblessedstylespecialability: string,
    inlinewiki_appropriateskillstylespecialability: string,
    inlinewiki_sex: string,
    inlinewiki_sex_male: string,
    inlinewiki_sex_female: string,
    inlinewiki_combattechniques_groups_all: string,
    inlinewiki_combattechniques_groups_allmeleecombattechniques: string,
    inlinewiki_combattechniques_groups_allrangedcombattechniques: string,
    inlinewiki_combattechniques_groups_allmeleecombattechniqueswithparry: string,
    inlinewiki_combattechniques_groups_allmeleecombattechniquesforonehandedweapons: string,

    /**
     * - **0**: Minimum social status
     */
    inlinewiki_socialstatusxorhigher: string,

    skills_commonskills: string,
    skills_header_name: string,
    skills_header_skillrating: string,
    skills_header_skillrating_tooltip: string,
    skills_header_group: string,
    skills_header_check: string,
    skills_header_improvementcost: string,
    skills_header_improvementcost_tooltip: string,

    inlinewiki_check: string,
    inlinewiki_newapplications: string,
    inlinewiki_applications: string,
    inlinewiki_uses: string,
    inlinewiki_encumbrance: string,
    inlinewiki_encumbrance_yes: string,
    inlinewiki_encumbrance_no: string,
    inlinewiki_encumbrance_maybe: string,
    inlinewiki_tools: string,
    inlinewiki_quality: string,
    inlinewiki_failedcheck: string,
    inlinewiki_criticalsuccess: string,
    inlinewiki_botch: string,
    inlinewiki_improvementcost: string,

    showfrequency_stronglyrecommended: string,
    showfrequency_common: string,
    showfrequency_uncommon: string,
    showfrequency_unfamiliarspells: string,

    combattechniques_header_name: string,
    combattechniques_header_group: string,
    combattechniques_header_combattechniquerating: string,
    combattechniques_header_combattechniquerating_tooltip: string,
    combattechniques_header_improvementcost: string,
    combattechniques_header_improvementcost_tooltip: string,
    combattechniques_header_primaryattribute: string,
    combattechniques_header_primaryattribute_tooltip: string,
    combattechniques_header_attack: string,
    combattechniques_header_attack_tooltip: string,
    combattechniques_header_parry: string,
    combattechniques_header_parry_tooltip: string,

    inlinewiki_special: string,
    inlinewiki_primaryattribute: string,

    spells_addbtn: string,
    spells_header_name: string,
    spells_header_property: string,
    spells_header_group: string,
    spells_header_skillrating: string,
    spells_header_skillrating_tooltip: string,
    spells_header_check: string,
    spells_header_checkmodifier: string,
    spells_header_checkmodifier_tooltip: string,
    spells_header_improvementcost: string,
    spells_header_improvementcost_tooltip: string,
    spells_groups_cantrip: string,
    spells_traditions_general: string,
    magicalactions_animistforces_tribes_general: string,

    inlinewiki_castingtime: string,
    inlinewiki_ritualtime: string,
    inlinewiki_aecost: string,
    inlinewiki_range: string,
    inlinewiki_duration: string,
    inlinewiki_targetcategory: string,
    inlinewiki_property: string,
    inlinewiki_traditions: string,
    inlinewiki_skill: string,
    inlinewiki_lengthoftime: string,
    inlinewiki_musictradition: string,
    inlinewiki_youcannotuseamodificationonthisspellscastingtime: string,
    inlinewiki_youcannotuseamodificationonthisspellsritualtime: string,
    inlinewiki_youcannotuseamodificationonthisspellscost: string,
    inlinewiki_youcannotuseamodificationonthisspellsrange: string,
    inlinewiki_youcannotuseamodificationonthisspellsduration: string,
    inlinewiki_spellenhancements: string,

    /**
     * - **0**: Enhancement name
     * - **1**: Required Skill Rating
     * - **2**: AP value
     * - **3**: Description
     */
    inlinewiki_spellenhancements_title: string,
    inlinewiki_tribaltraditions: string,
    inlinewiki_brew: string,
    inlinewiki_spirithalf: string,
    inlinewiki_spirithalf_short: string,
    inlinewiki_spiritortoughness: string,
    inlinewiki_spiritortoughness_short: string,
    inlinewiki_note: string,

    liturgicalchants_addbtn: string,
    liturgicalchants_header_name: string,
    liturgicalchants_header_traditions: string,
    liturgicalchants_header_group: string,
    liturgicalchants_header_skillrating: string,
    liturgicalchants_header_skillrating_tooltip: string,
    liturgicalchants_header_check: string,
    liturgicalchants_header_checkmodifier: string,
    liturgicalchants_header_checkmodifier_tooltip: string,
    liturgicalchants_header_improvementcost: string,
    liturgicalchants_header_improvementcost_tooltip: string,
    liturgicalchants_groups_blessing: string,
    liturgicalchants_aspects_general: string,

    inlinewiki_liturgicaltime: string,
    inlinewiki_ceremonialtime: string,
    inlinewiki_kpcost: string,
    inlinewiki_youcannotuseamodificationonthischantsliturgicaltime: string,
    inlinewiki_youcannotuseamodificationonthischantsceremonialtime: string,
    inlinewiki_youcannotuseamodificationonthischantscost: string,
    inlinewiki_youcannotuseamodificationonthischantsrange: string,
    inlinewiki_youcannotuseamodificationonthischantsduration: string,
    inlinewiki_liturgicalchantenhancements: string,

    /**
     * - **0**: Enhancement name
     * - **1**: Required Skill Rating
     * - **2**: AP value
     * - **3**: Description
     */
    inlinewiki_liturgicalchantenhancements_title: string,

    equipment_header_name: string,
    equipment_header_group: string,
    equipment_addbtn: string,
    equipment_createbtn: string,
    equipment_filters_allcombattechniques: string,

    equipment_purse_title: string,
    equipment_purse_ducats: string,
    equipment_purse_silverthalers: string,
    equipment_purse_halers: string,
    equipment_purse_kreutzers: string,
    equipment_purse_carryingcapacity: string,
    equipment_purse_initialstartingwealthandcarryingcapacity: string,

    equipment_dialogs_addedit_damage: string,
    equipment_dialogs_addedit_length: string,
    equipment_dialogs_addedit_range: string,
    equipment_dialogs_addedit_edititem: string,
    equipment_dialogs_addedit_createitem: string,
    equipment_dialogs_addedit_number: string,
    equipment_dialogs_addedit_name: string,
    equipment_dialogs_addedit_price: string,
    equipment_dialogs_addedit_weight: string,
    equipment_dialogs_addedit_carriedwhere: string,
    equipment_dialogs_addedit_itemgroup: string,
    equipment_dialogs_addedit_itemgrouphint: string,
    equipment_dialogs_addedit_improvisedweapon: string,
    equipment_dialogs_addedit_improvisedweapongroup: string,
    equipment_dialogs_addedit_template: string,
    equipment_dialogs_addedit_combattechnique: string,
    equipment_dialogs_addedit_primaryattributeanddamagethreshold: string,
    equipment_dialogs_addedit_primaryattribute: string,
    equipment_dialogs_addedit_primaryattribute_short: string,
    equipment_dialogs_addedit_damagethreshold: string,
    equipment_dialogs_addedit_separatedamagethresholds: string,
    equipment_dialogs_addedit_breakingpointratingmodifier: string,
    equipment_dialogs_addedit_damaged: string,
    equipment_dialogs_addedit_reach: string,
    equipment_dialogs_addedit_attackparrymodifier: string,
    equipment_dialogs_addedit_structurepoints: string,
    equipment_dialogs_addedit_lengthwithunit: string,
    equipment_dialogs_addedit_parryingweapon: string,
    equipment_dialogs_addedit_twohandedweapon: string,
    equipment_dialogs_addedit_reloadtime: string,
    equipment_dialogs_addedit_rangeclose: string,
    equipment_dialogs_addedit_rangemedium: string,
    equipment_dialogs_addedit_rangefar: string,
    equipment_dialogs_addedit_ammunition: string,
    equipment_dialogs_addedit_protection: string,
    equipment_dialogs_addedit_encumbrance: string,
    equipment_dialogs_addedit_armortype: string,
    equipment_dialogs_addedit_sturdinessmodifier: string,
    equipment_dialogs_addedit_wear: string,
    equipment_dialogs_addedit_hitzonearmoronly: string,
    equipment_dialogs_addedit_movementmodifier: string,
    equipment_dialogs_addedit_initiativemodifier: string,
    equipment_dialogs_addedit_additionalpenalties: string,

    hitzonearmors_header_name: string,
    hitzonearmors_createbtn: string,
    hitzonearmors_dialogs_addedit_name: string,
    hitzonearmors_dialogs_addedit_edithitzonearmor: string,
    hitzonearmors_dialogs_addedit_createhitzonearmor: string,
    hitzonearmors_dialogs_addedit_head: string,
    hitzonearmors_dialogs_addedit_torso: string,
    hitzonearmors_dialogs_addedit_leftarm: string,
    hitzonearmors_dialogs_addedit_rightarm: string,
    hitzonearmors_dialogs_addedit_leftleg: string,
    hitzonearmors_dialogs_addedit_rightleg: string,
    hitzonearmors_dialogs_addedit_wear: string,

    inlinewiki_equipment_weight: string,
    inlinewiki_equipment_price: string,
    inlinewiki_equipment_ammunition: string,
    inlinewiki_equipment_combattechnique: string,
    inlinewiki_equipment_damage: string,
    inlinewiki_equipment_primaryattributeanddamagethreshold: string,
    inlinewiki_equipment_attackparrymodifier: string,
    inlinewiki_equipment_reach: string,
    inlinewiki_equipment_length: string,
    inlinewiki_equipment_reloadtime: string,
    inlinewiki_equipment_range: string,

    /**
     * - **0**: Number of actions
     */
    inlinewiki_equipment_actionsvalue: string,
    inlinewiki_equipment_protection: string,
    inlinewiki_equipment_encumbrance: string,
    inlinewiki_equipment_additionalpenalties: string,
    inlinewiki_equipment_note: string,
    inlinewiki_equipment_rules: string,
    inlinewiki_equipment_weaponadvantage: string,
    inlinewiki_equipment_weapondisadvantage: string,
    inlinewiki_equipment_armoradvantage: string,
    inlinewiki_equipment_armordisadvantage: string,

    pets_dialogs_addedit_deleteavatarbtn: string,
    pets_dialogs_addedit_name: string,
    pets_dialogs_addedit_sizecategory: string,
    pets_dialogs_addedit_type: string,
    pets_dialogs_addedit_apspent: string,
    pets_dialogs_addedit_totalap: string,
    pets_dialogs_addedit_protection: string,
    pets_dialogs_addedit_attackname: string,
    pets_dialogs_addedit_attack: string,
    pets_dialogs_addedit_parry: string,
    pets_dialogs_addedit_damagepoints: string,
    pets_dialogs_addedit_reach: string,
    pets_dialogs_addedit_actions: string,
    pets_dialogs_addedit_skills: string,
    pets_dialogs_addedit_specialabilities: string,
    pets_dialogs_addedit_notes: string,
    pets_dialogs_addedit_addbtn: string,
    pets_dialogs_addedit_savebtn: string,
  };

  let%private l10n = json => {
    macosmenubar_aboutapp: json |> field("macosmenubar.aboutapp", string),
    macosmenubar_preferences: json |> field("macosmenubar.preferences", string),
    macosmenubar_quit: json |> field("macosmenubar.quit", string),
    macosmenubar_edit: json |> field("macosmenubar.edit", string),
    macosmenubar_view: json |> field("macosmenubar.view", string),

    initialization_loadtableserror: json |> field("initialization.loadtableserror", string),

    header_tabs_heroes: json |> field("header.tabs.heroes", string),
    header_tabs_groups: json |> field("header.tabs.groups", string),
    header_tabs_wiki: json |> field("header.tabs.wiki", string),
    header_tabs_faq: json |> field("header.tabs.faq", string),
    header_tabs_about: json |> field("header.tabs.about", string),
    header_tabs_imprint: json |> field("header.tabs.imprint", string),
    header_tabs_thirdpartylicenses: json |> field("header.tabs.thirdpartylicenses", string),
    header_tabs_lastchanges: json |> field("header.tabs.lastchanges", string),
    header_tabs_profile: json |> field("header.tabs.profile", string),
    header_tabs_overview: json |> field("header.tabs.overview", string),
    header_tabs_personaldata: json |> field("header.tabs.personaldata", string),
    header_tabs_charactersheet: json |> field("header.tabs.charactersheet", string),
    header_tabs_pact: json |> field("header.tabs.pact", string),
    header_tabs_rules: json |> field("header.tabs.rules", string),
    header_tabs_racecultureandprofession: json |> field("header.tabs.racecultureandprofession", string),
    header_tabs_race: json |> field("header.tabs.race", string),
    header_tabs_culture: json |> field("header.tabs.culture", string),
    header_tabs_profession: json |> field("header.tabs.profession", string),
    header_tabs_attributes: json |> field("header.tabs.attributes", string),
    header_tabs_advantagesanddisadvantages: json |> field("header.tabs.advantagesanddisadvantages", string),
    header_tabs_advantages: json |> field("header.tabs.advantages", string),
    header_tabs_disadvantages: json |> field("header.tabs.disadvantages", string),
    header_tabs_abilities: json |> field("header.tabs.abilities", string),
    header_tabs_skills: json |> field("header.tabs.skills", string),
    header_tabs_combattechniques: json |> field("header.tabs.combattechniques", string),
    header_tabs_specialabilities: json |> field("header.tabs.specialabilities", string),
    header_tabs_spells: json |> field("header.tabs.spells", string),
    header_tabs_liturgicalchants: json |> field("header.tabs.liturgicalchants", string),
    header_tabs_belongings: json |> field("header.tabs.belongings", string),
    header_tabs_equipment: json |> field("header.tabs.equipment", string),
    header_tabs_hitzonearmor: json |> field("header.tabs.hitzonearmor", string),
    header_tabs_pets: json |> field("header.tabs.pets", string),
    header_apleft: json |> field("header.apleft", string),
    header_savebtn: json |> field("header.savebtn", string),

    header_aptooltip_title: json |> field("header.aptooltip.title", string),
    header_aptooltip_total: json |> field("header.aptooltip.total", string),
    header_aptooltip_spent: json |> field("header.aptooltip.spent", string),
    header_aptooltip_spentonadvantages: json |> field("header.aptooltip.spentonadvantages", string),
    header_aptooltip_spentonmagicadvantages: json |> field("header.aptooltip.spentonmagicadvantages", string),
    header_aptooltip_spentonblessedadvantages: json |> field("header.aptooltip.spentonblessedadvantages", string),
    header_aptooltip_spentondisadvantages: json |> field("header.aptooltip.spentondisadvantages", string),
    header_aptooltip_spentonmagicdisadvantages: json |> field("header.aptooltip.spentonmagicdisadvantages", string),
    header_aptooltip_spentonblesseddisadvantages: json |> field("header.aptooltip.spentonblesseddisadvantages", string),
    header_aptooltip_spentonrace: json |> field("header.aptooltip.spentonrace", string),
    header_aptooltip_spentonprofession: json |> field("header.aptooltip.spentonprofession", string),
    header_aptooltip_spentonattributes: json |> field("header.aptooltip.spentonattributes", string),
    header_aptooltip_spentonskills: json |> field("header.aptooltip.spentonskills", string),
    header_aptooltip_spentoncombattechniques: json |> field("header.aptooltip.spentoncombattechniques", string),
    header_aptooltip_spentonspells: json |> field("header.aptooltip.spentonspells", string),
    header_aptooltip_spentoncantrips: json |> field("header.aptooltip.spentoncantrips", string),
    header_aptooltip_spentonliturgicalchants: json |> field("header.aptooltip.spentonliturgicalchants", string),
    header_aptooltip_spentonblessings: json |> field("header.aptooltip.spentonblessings", string),
    header_aptooltip_spentonspecialabilities: json |> field("header.aptooltip.spentonspecialabilities", string),
    header_aptooltip_spentonenergies: json |> field("header.aptooltip.spentonenergies", string),

    header_dialogs_herosaved: json |> field("header.dialogs.herosaved", string),
    header_dialogs_allsaved: json |> field("header.dialogs.allsaved", string),
    header_dialogs_everythingelsesaved: json |> field("header.dialogs.everythingelsesaved", string),
    header_dialogs_saveconfigerror_title: json |> field("header.dialogs.saveconfigerror.title", string),
    header_dialogs_saveconfigerror_message: json |> field("header.dialogs.saveconfigerror.message", string),
    header_dialogs_saveheroeserror_title: json |> field("header.dialogs.saveheroeserror.title", string),
    header_dialogs_saveheroeserror_message: json |> field("header.dialogs.saveheroeserror.message", string),
    general_weightvalue: json |> field("general.weightvalue", string),
    general_pricevalue: json |> field("general.pricevalue", string),
    general_lengthvalue: json |> field("general.lengthvalue", string),
    general_dice: json |> field("general.dice", string),
    general_none: json |> field("general.none", string),
    general_or: json |> field("general.or", string),
    general_and: json |> field("general.and", string),
    general_error: json |> field("general.error", string),
    general_errorcode: json |> field("general.errorcode", string),
    general_emptylistplaceholder: json |> field("general.emptylistplaceholder", string),
    general_emptylistnoresultsplaceholder: json |> field("general.emptylistnoresultsplaceholder", string),
    general_apvalue: json |> field("general.apvalue", string),
    general_apvalue_short: json |> field("general.apvalue.short", string),
    general_withapvalue: json |> field("general.withapvalue", string),

    general_filters_searchfield_placeholder: json |> field("general.filters.searchfield.placeholder", string),
    general_filters_sort_alphabetically: json |> field("general.filters.sort.alphabetically", string),
    general_filters_sort_bydatemodified: json |> field("general.filters.sort.bydatemodified", string),
    general_filters_sort_bygroup: json |> field("general.filters.sort.bygroup", string),
    general_filters_sort_byimprovementcost: json |> field("general.filters.sort.byimprovementcost", string),
    general_filters_sort_byproperty: json |> field("general.filters.sort.byproperty", string),
    general_filters_sort_bylocation: json |> field("general.filters.sort.bylocation", string),
    general_filters_sort_bycost: json |> field("general.filters.sort.bycost", string),
    general_filters_sort_byweight: json |> field("general.filters.sort.byweight", string),
    general_filters_showactivatedentries: json |> field("general.filters.showactivatedentries", string),

    general_dialogs_savebtn: json |> field("general.dialogs.savebtn", string),
    general_dialogs_donebtn: json |> field("general.dialogs.donebtn", string),
    general_dialogs_deletebtn: json |> field("general.dialogs.deletebtn", string),
    general_dialogs_yesbtn: json |> field("general.dialogs.yesbtn", string),
    general_dialogs_nobtn: json |> field("general.dialogs.nobtn", string),
    general_dialogs_okbtn: json |> field("general.dialogs.okbtn", string),
    general_dialogs_cancelbtn: json |> field("general.dialogs.cancelbtn", string),
    general_dialogs_copybtn: json |> field("general.dialogs.copybtn", string),
    general_dialogs_createbtn: json |> field("general.dialogs.createbtn", string),
    general_dialogs_applybtn: json |> field("general.dialogs.applybtn", string),
    general_dialogs_addbtn: json |> field("general.dialogs.addbtn", string),
    general_dialogs_notenoughap_title: json |> field("general.dialogs.notenoughap.title", string),
    general_dialogs_notenoughap_message: json |> field("general.dialogs.notenoughap.message", string),
    general_dialogs_reachedaplimit_title: json |> field("general.dialogs.reachedaplimit.title", string),
    general_dialogs_reachedaplimit_message: json |> field("general.dialogs.reachedaplimit.message", string),
    general_dialogs_reachedaplimit_advantages: json |> field("general.dialogs.reachedaplimit.advantages", string),
    general_dialogs_reachedaplimit_magicaladvantages: json |> field("general.dialogs.reachedaplimit.magicaladvantages", string),
    general_dialogs_reachedaplimit_blessedadvantages: json |> field("general.dialogs.reachedaplimit.blessedadvantages", string),
    general_dialogs_reachedaplimit_disadvantages: json |> field("general.dialogs.reachedaplimit.disadvantages", string),
    general_dialogs_reachedaplimit_magicaldisadvantages: json |> field("general.dialogs.reachedaplimit.magicaldisadvantages", string),
    general_dialogs_reachedaplimit_blesseddisadvantages: json |> field("general.dialogs.reachedaplimit.blesseddisadvantages", string),

    settings_title: json |> field("settings.title", string),
    settings_language: json |> field("settings.language", string),
    settings_systemlanguage: json |> field("settings.systemlanguage", string),
    settings_languagehint: json |> field("settings.languagehint", string),
    settings_theme: json |> field("settings.theme", string),
    settings_theme_dark: json |> field("settings.theme.dark", string),
    settings_theme_light: json |> field("settings.theme.light", string),
    settings_showanimations: json |> field("settings.showanimations", string),
    settings_enableeditingheroaftercreationphase: json |> field("settings.enableeditingheroaftercreationphase", string),
    settings_checkforupdatesbtn: json |> field("settings.checkforupdatesbtn", string),
    settings_newversionavailable_title: json |> field("settings.newversionavailable.title", string),
    settings_newversionavailable_message: json |> field("settings.newversionavailable.message", string),
    settings_newversionavailable_messagewithsize: json |> field("settings.newversionavailable.messagewithsize", string),
    settings_newversionavailable_updatebtn: json |> field("settings.newversionavailable.updatebtn", string),
    settings_nonewversionavailable_title: json |> field("settings.nonewversionavailable.title", string),
    settings_nonewversionavailable_message: json |> field("settings.nonewversionavailable.message", string),
    settings_downloadingupdate_title: json |> field("settings.downloadingupdate.title", string),

    heroes_filters_origin_allheroes: json |> field("heroes.filters.origin.allheroes", string),
    heroes_filters_origin_ownheroes: json |> field("heroes.filters.origin.ownheroes", string),
    heroes_filters_origin_sharedheroes: json |> field("heroes.filters.origin.sharedheroes", string),
    heroes_importherobtn: json |> field("heroes.importherobtn", string),
    heroes_createherobtn: json |> field("heroes.createherobtn", string),
    heroes_exportheroasjsonbtn: json |> field("heroes.exportheroasjsonbtn", string),
    heroes_duplicateherobtn: json |> field("heroes.duplicateherobtn", string),
    heroes_deleteherobtn: json |> field("heroes.deleteherobtn", string),
    heroes_openherobtn: json |> field("heroes.openherobtn", string),
    heroes_saveherobtn: json |> field("heroes.saveherobtn", string),
    heroes_unsavedhero_name: json |> field("heroes.unsavedhero.name", string),
    heroes_list_adventurepoints: json |> field("heroes.list.adventurepoints", string),
    heroes_dialogs_herosaved: json |> field("heroes.dialogs.herosaved", string),
    heroes_dialogs_importheroerror_title: json |> field("heroes.dialogs.importheroerror.title", string),
    heroes_dialogs_importheroerror_message: json |> field("heroes.dialogs.importheroerror.message", string),
    heroes_dialogs_heroexportsavelocation_title: json |> field("heroes.dialogs.heroexportsavelocation.title", string),
    heroes_dialogs_herojsonsaveerror_title: json |> field("heroes.dialogs.herojsonsaveerror.title", string),
    heroes_dialogs_herojsonsaveerror_message: json |> field("heroes.dialogs.herojsonsaveerror.message", string),
    heroes_dialogs_unsavedactions_title: json |> field("heroes.dialogs.unsavedactions.title", string),
    heroes_dialogs_unsavedactions_message: json |> field("heroes.dialogs.unsavedactions.message", string),
    heroes_dialogs_unsavedactions_quit: json |> field("heroes.dialogs.unsavedactions.quit", string),
    heroes_dialogs_unsavedactions_saveandquit: json |> field("heroes.dialogs.unsavedactions.saveandquit", string),
    heroes_dialogs_deletehero_title: json |> field("heroes.dialogs.deletehero.title", string),
    heroes_dialogs_deletehero_message: json |> field("heroes.dialogs.deletehero.message", string),
    heroes_dialogs_herocreation_title: json |> field("heroes.dialogs.herocreation.title", string),
    heroes_dialogs_herocreation_nameofhero: json |> field("heroes.dialogs.herocreation.nameofhero", string),
    heroes_dialogs_herocreation_sex_placeholder: json |> field("heroes.dialogs.herocreation.sex.placeholder", string),
    heroes_dialogs_herocreation_sex_male: json |> field("heroes.dialogs.herocreation.sex.male", string),
    heroes_dialogs_herocreation_sex_female: json |> field("heroes.dialogs.herocreation.sex.female", string),
    heroes_dialogs_herocreation_experiencelevel_placeholder: json |> field("heroes.dialogs.herocreation.experiencelevel.placeholder", string),
    heroes_dialogs_herocreation_startbtn: json |> field("heroes.dialogs.herocreation.startbtn", string),

    wiki_chooseacategory: json |> field("wiki.chooseacategory", string),
    wiki_chooseacategorytodisplayalist: json |> field("wiki.chooseacategorytodisplayalist", string),
    wiki_filters_races: json |> field("wiki.filters.races", string),
    wiki_filters_cultures: json |> field("wiki.filters.cultures", string),
    wiki_filters_professions: json |> field("wiki.filters.professions", string),
    wiki_filters_advantages: json |> field("wiki.filters.advantages", string),
    wiki_filters_disadvantages: json |> field("wiki.filters.disadvantages", string),
    wiki_filters_skills: json |> field("wiki.filters.skills", string),
    wiki_filters_skills_all: json |> field("wiki.filters.skills.all", string),
    wiki_filters_combattechniques: json |> field("wiki.filters.combattechniques", string),
    wiki_filters_combattechniques_all: json |> field("wiki.filters.combattechniques.all", string),
    wiki_filters_magic: json |> field("wiki.filters.magic", string),
    wiki_filters_magic_all: json |> field("wiki.filters.magic.all", string),
    wiki_filters_liturgicalchants: json |> field("wiki.filters.liturgicalchants", string),
    wiki_filters_liturgicalchants_all: json |> field("wiki.filters.liturgicalchants.all", string),
    wiki_filters_specialabilities: json |> field("wiki.filters.specialabilities", string),
    wiki_filters_specialabilities_all: json |> field("wiki.filters.specialabilities.all", string),
    wiki_filters_itemtemplates: json |> field("wiki.filters.itemtemplates", string),
    wiki_filters_itemtemplates_all: json |> field("wiki.filters.itemtemplates.all", string),

    imprint_title: json |> field("imprint.title", string),

    profile_editprofessionnamebtn: json |> field("profile.editprofessionnamebtn", string),
    profile_addadventurepointsbtn: json |> field("profile.addadventurepointsbtn", string),
    profile_endherocreationbtn: json |> field("profile.endherocreationbtn", string),
    profile_changeheroavatarbtn: json |> field("profile.changeheroavatarbtn", string),
    profile_deleteavatarbtn: json |> field("profile.deleteavatarbtn", string),
    profile_dialogs_changeheroavatar_title: json |> field("profile.dialogs.changeheroavatar.title", string),
    profile_dialogs_changeheroavatar_selectfilebtn: json |> field("profile.dialogs.changeheroavatar.selectfilebtn", string),
    profile_dialogs_changeheroavatar_imagefiletype: json |> field("profile.dialogs.changeheroavatar.imagefiletype", string),
    profile_dialogs_changeheroavatar_invalidfilewarning: json |> field("profile.dialogs.changeheroavatar.invalidfilewarning", string),
    profile_dialogs_addadventurepoints_title: json |> field("profile.dialogs.addadventurepoints.title", string),
    profile_dialogs_addadventurepoints_label: json |> field("profile.dialogs.addadventurepoints.label", string),
    profile_advantages: json |> field("profile.advantages", string),
    profile_disadvantages: json |> field("profile.disadvantages", string),

    personaldata_title: json |> field("personaldata.title", string),
    personaldata_sex_male: json |> field("personaldata.sex.male", string),
    personaldata_sex_female: json |> field("personaldata.sex.female", string),
    personaldata_family: json |> field("personaldata.family", string),
    personaldata_placeofbirth: json |> field("personaldata.placeofbirth", string),
    personaldata_dateofbirth: json |> field("personaldata.dateofbirth", string),
    personaldata_age: json |> field("personaldata.age", string),
    personaldata_haircolor: json |> field("personaldata.haircolor", string),
    personaldata_eyecolor: json |> field("personaldata.eyecolor", string),
    personaldata_size: json |> field("personaldata.size", string),
    personaldata_weight: json |> field("personaldata.weight", string),
    personaldata_rank: json |> field("personaldata.rank", string),
    personaldata_socialstatus: json |> field("personaldata.socialstatus", string),
    personaldata_characteristics: json |> field("personaldata.characteristics", string),
    personaldata_otherinfo: json |> field("personaldata.otherinfo", string),
    personaldata_cultureareaknowledge: json |> field("personaldata.cultureareaknowledge", string),

    sheets_printtopdfbtn: json |> field("sheets.printtopdfbtn", string),
    sheets_dialogs_pdfexportsavelocation_title: json |> field("sheets.dialogs.pdfexportsavelocation.title", string),
    sheets_dialogs_pdfsaved: json |> field("sheets.dialogs.pdfsaved", string),
    sheets_dialogs_pdfsaveerror_title: json |> field("sheets.dialogs.pdfsaveerror.title", string),
    sheets_dialogs_pdfsaveerror_message: json |> field("sheets.dialogs.pdfsaveerror.message", string),
    sheets_dialogs_pdfcreationerror_title: json |> field("sheets.dialogs.pdfcreationerror.title", string),
    sheets_dialogs_pdfcreationerror_message: json |> field("sheets.dialogs.pdfcreationerror.message", string),
    sheets_showattributevalues: json |> field("sheets.showattributevalues", string),
    sheets_charactersheet: json |> field("sheets.charactersheet", string),
    sheets_attributemodifiers_title: json |> field("sheets.attributemodifiers.title", string),

    sheets_mainsheet_title: json |> field("sheets.mainsheet.title", string),
    sheets_mainsheet_name: json |> field("sheets.mainsheet.name", string),
    sheets_mainsheet_family: json |> field("sheets.mainsheet.family", string),
    sheets_mainsheet_placeofbirth: json |> field("sheets.mainsheet.placeofbirth", string),
    sheets_mainsheet_dateofbirth: json |> field("sheets.mainsheet.dateofbirth", string),
    sheets_mainsheet_age: json |> field("sheets.mainsheet.age", string),
    sheets_mainsheet_sex: json |> field("sheets.mainsheet.sex", string),
    sheets_mainsheet_race: json |> field("sheets.mainsheet.race", string),
    sheets_mainsheet_size: json |> field("sheets.mainsheet.size", string),
    sheets_mainsheet_weight: json |> field("sheets.mainsheet.weight", string),
    sheets_mainsheet_haircolor: json |> field("sheets.mainsheet.haircolor", string),
    sheets_mainsheet_eyecolor: json |> field("sheets.mainsheet.eyecolor", string),
    sheets_mainsheet_culture: json |> field("sheets.mainsheet.culture", string),
    sheets_mainsheet_socialstatus: json |> field("sheets.mainsheet.socialstatus", string),
    sheets_mainsheet_profession: json |> field("sheets.mainsheet.profession", string),
    sheets_mainsheet_rank: json |> field("sheets.mainsheet.rank", string),
    sheets_mainsheet_characteristics: json |> field("sheets.mainsheet.characteristics", string),
    sheets_mainsheet_otherinfo: json |> field("sheets.mainsheet.otherinfo", string),
    sheets_mainsheet_experiencelevellabel: json |> field("sheets.mainsheet.experiencelevellabel", string),
    sheets_mainsheet_totalaplabel: json |> field("sheets.mainsheet.totalaplabel", string),
    sheets_mainsheet_apcollectedlabel: json |> field("sheets.mainsheet.apcollectedlabel", string),
    sheets_mainsheet_apspentlabel: json |> field("sheets.mainsheet.apspentlabel", string),
    sheets_mainsheet_avatarlabel: json |> field("sheets.mainsheet.avatarlabel", string),
    sheets_mainsheet_advantages: json |> field("sheets.mainsheet.advantages", string),
    sheets_mainsheet_disadvantages: json |> field("sheets.mainsheet.disadvantages", string),
    sheets_mainsheet_generalspecialabilites: json |> field("sheets.mainsheet.generalspecialabilites", string),
    sheets_mainsheet_fatepoints: json |> field("sheets.mainsheet.fatepoints", string),
    sheets_mainsheet_derivedcharacteristics_labels_value: json |> field("sheets.mainsheet.derivedcharacteristics.labels.value", string),
    sheets_mainsheet_derivedcharacteristics_labels_bonuspenalty: json |> field("sheets.mainsheet.derivedcharacteristics.labels.bonuspenalty", string),
    sheets_mainsheet_derivedcharacteristics_labels_bonus: json |> field("sheets.mainsheet.derivedcharacteristics.labels.bonus", string),
    sheets_mainsheet_derivedcharacteristics_labels_bought: json |> field("sheets.mainsheet.derivedcharacteristics.labels.bought", string),
    sheets_mainsheet_derivedcharacteristics_labels_max: json |> field("sheets.mainsheet.derivedcharacteristics.labels.max", string),
    sheets_mainsheet_derivedcharacteristics_labels_current: json |> field("sheets.mainsheet.derivedcharacteristics.labels.current", string),
    sheets_mainsheet_derivedcharacteristics_labels_basestat: json |> field("sheets.mainsheet.derivedcharacteristics.labels.basestat", string),
    sheets_mainsheet_derivedcharacteristics_labels_permanentlylostboughtback: json |> field("sheets.mainsheet.derivedcharacteristics.labels.permanentlylostboughtback", string),

    sheets_gamestatssheet_title: json |> field("sheets.gamestatssheet.title", string),
    sheets_gamestatssheet_skillstable_title: json |> field("sheets.gamestatssheet.skillstable.title", string),
    sheets_gamestatssheet_skillstable_labels_skill: json |> field("sheets.gamestatssheet.skillstable.labels.skill", string),
    sheets_gamestatssheet_skillstable_labels_check: json |> field("sheets.gamestatssheet.skillstable.labels.check", string),
    sheets_gamestatssheet_skillstable_labels_encumbrance: json |> field("sheets.gamestatssheet.skillstable.labels.encumbrance", string),
    sheets_gamestatssheet_skillstable_labels_improvementcost: json |> field("sheets.gamestatssheet.skillstable.labels.improvementcost", string),
    sheets_gamestatssheet_skillstable_labels_skillrating: json |> field("sheets.gamestatssheet.skillstable.labels.skillrating", string),
    sheets_gamestatssheet_skillstable_labels_routinechecks: json |> field("sheets.gamestatssheet.skillstable.labels.routinechecks", string),
    sheets_gamestatssheet_skillstable_labels_notes: json |> field("sheets.gamestatssheet.skillstable.labels.notes", string),
    sheets_gamestatssheet_skillstable_encumbrance_yes: json |> field("sheets.gamestatssheet.skillstable.encumbrance.yes", string),
    sheets_gamestatssheet_skillstable_encumbrance_no: json |> field("sheets.gamestatssheet.skillstable.encumbrance.no", string),
    sheets_gamestatssheet_skillstable_encumbrance_maybe: json |> field("sheets.gamestatssheet.skillstable.encumbrance.maybe", string),
    sheets_gamestatssheet_skillstable_groups_pages: json |> field("sheets.gamestatssheet.skillstable.groups.pages", string),
    sheets_gamestatssheet_languages_title: json |> field("sheets.gamestatssheet.languages.title", string),
    sheets_gamestatssheet_languages_nativetongue: json |> field("sheets.gamestatssheet.languages.nativetongue", string),
    sheets_gamestatssheet_knownscripts_title: json |> field("sheets.gamestatssheet.knownscripts.title", string),
    sheets_gamestatssheet_routinechecks_title: json |> field("sheets.gamestatssheet.routinechecks.title", string),
    sheets_gamestatssheet_routinechecks_textRow1: json |> field("sheets.gamestatssheet.routinechecks.textRow1", string),
    sheets_gamestatssheet_routinechecks_textRow2: json |> field("sheets.gamestatssheet.routinechecks.textRow2", string),
    sheets_gamestatssheet_routinechecks_textRow3: json |> field("sheets.gamestatssheet.routinechecks.textRow3", string),
    sheets_gamestatssheet_routinechecks_textRow4: json |> field("sheets.gamestatssheet.routinechecks.textRow4", string),
    sheets_gamestatssheet_routinechecks_labels_checkmod: json |> field("sheets.gamestatssheet.routinechecks.labels.checkmod", string),
    sheets_gamestatssheet_routinechecks_labels_neededsr: json |> field("sheets.gamestatssheet.routinechecks.labels.neededsr", string),
    sheets_gamestatssheet_routinechecks_from3on: json |> field("sheets.gamestatssheet.routinechecks.from3on", string),
    sheets_gamestatssheet_qualitylevels_title: json |> field("sheets.gamestatssheet.qualitylevels.title", string),
    sheets_gamestatssheet_qualitylevels_labels_skillpoints: json |> field("sheets.gamestatssheet.qualitylevels.labels.skillpoints", string),
    sheets_gamestatssheet_qualitylevels_labels_qualitylevel: json |> field("sheets.gamestatssheet.qualitylevels.labels.qualitylevel", string),

    sheets_combatsheet_title: json |> field("sheets.combatsheet.title", string),
    sheets_combatsheet_combattechniquestable_title: json |> field("sheets.combatsheet.combattechniquestable.title", string),
    sheets_combatsheet_combattechniquestable_labels_combattechnique: json |> field("sheets.combatsheet.combattechniquestable.labels.combattechnique", string),
    sheets_combatsheet_combattechniquestable_labels_primaryattribute: json |> field("sheets.combatsheet.combattechniquestable.labels.primaryattribute", string),
    sheets_combatsheet_combattechniquestable_labels_improvementcost: json |> field("sheets.combatsheet.combattechniquestable.labels.improvementcost", string),
    sheets_combatsheet_combattechniquestable_labels_combattechniquerating: json |> field("sheets.combatsheet.combattechniquestable.labels.combattechniquerating", string),
    sheets_combatsheet_combattechniquestable_labels_attackrangecombat: json |> field("sheets.combatsheet.combattechniquestable.labels.attackrangecombat", string),
    sheets_combatsheet_combattechniquestable_labels_parry: json |> field("sheets.combatsheet.combattechniquestable.labels.parry", string),
    sheets_combatsheet_lifepoints_title: json |> field("sheets.combatsheet.lifepoints.title", string),
    sheets_combatsheet_lifepoints_max: json |> field("sheets.combatsheet.lifepoints.max", string),
    sheets_combatsheet_lifepoints_current: json |> field("sheets.combatsheet.lifepoints.current", string),
    sheets_combatsheet_lifepoints_pain1: json |> field("sheets.combatsheet.lifepoints.pain1", string),
    sheets_combatsheet_lifepoints_pain2: json |> field("sheets.combatsheet.lifepoints.pain2", string),
    sheets_combatsheet_lifepoints_pain3: json |> field("sheets.combatsheet.lifepoints.pain3", string),
    sheets_combatsheet_lifepoints_pain4: json |> field("sheets.combatsheet.lifepoints.pain4", string),
    sheets_combatsheet_lifepoints_dying: json |> field("sheets.combatsheet.lifepoints.dying", string),
    sheets_combatsheet_closecombatweapons: json |> field("sheets.combatsheet.closecombatweapons", string),
    sheets_combatsheet_closecombatweapons_labels_weapon: json |> field("sheets.combatsheet.closecombatweapons.labels.weapon", string),
    sheets_combatsheet_closecombatweapons_labels_combattechnique: json |> field("sheets.combatsheet.closecombatweapons.labels.combattechnique", string),
    sheets_combatsheet_closecombatweapons_labels_damagebonus: json |> field("sheets.combatsheet.closecombatweapons.labels.damagebonus", string),
    sheets_combatsheet_closecombatweapons_labels_damagepoints: json |> field("sheets.combatsheet.closecombatweapons.labels.damagepoints", string),
    sheets_combatsheet_closecombatweapons_labels_attackparrymodifier: json |> field("sheets.combatsheet.closecombatweapons.labels.attackparrymodifier", string),
    sheets_combatsheet_closecombatweapons_labels_reach: json |> field("sheets.combatsheet.closecombatweapons.labels.reach", string),
    sheets_combatsheet_closecombatweapons_labels_breakingpointrating: json |> field("sheets.combatsheet.closecombatweapons.labels.breakingpointrating", string),
    sheets_combatsheet_closecombatweapons_labels_damaged: json |> field("sheets.combatsheet.closecombatweapons.labels.damaged", string),
    sheets_combatsheet_closecombatweapons_labels_attack: json |> field("sheets.combatsheet.closecombatweapons.labels.attack", string),
    sheets_combatsheet_closecombatweapons_labels_parry: json |> field("sheets.combatsheet.closecombatweapons.labels.parry", string),
    sheets_combatsheet_closecombatweapons_labels_weight: json |> field("sheets.combatsheet.closecombatweapons.labels.weight", string),
    sheets_combatsheet_rangedcombatweapons: json |> field("sheets.combatsheet.rangedcombatweapons", string),
    sheets_combatsheet_rangedcombatweapons_labels_weapon: json |> field("sheets.combatsheet.rangedcombatweapons.labels.weapon", string),
    sheets_combatsheet_rangedcombatweapons_labels_combattechnique: json |> field("sheets.combatsheet.rangedcombatweapons.labels.combattechnique", string),
    sheets_combatsheet_rangedcombatweapons_labels_reloadtime: json |> field("sheets.combatsheet.rangedcombatweapons.labels.reloadtime", string),
    sheets_combatsheet_rangedcombatweapons_labels_damagepoints: json |> field("sheets.combatsheet.rangedcombatweapons.labels.damagepoints", string),
    sheets_combatsheet_rangedcombatweapons_labels_ammunition: json |> field("sheets.combatsheet.rangedcombatweapons.labels.ammunition", string),
    sheets_combatsheet_rangedcombatweapons_labels_rangebrackets: json |> field("sheets.combatsheet.rangedcombatweapons.labels.rangebrackets", string),
    sheets_combatsheet_rangedcombatweapons_labels_breakingpointrating: json |> field("sheets.combatsheet.rangedcombatweapons.labels.breakingpointrating", string),
    sheets_combatsheet_rangedcombatweapons_labels_damaged: json |> field("sheets.combatsheet.rangedcombatweapons.labels.damaged", string),
    sheets_combatsheet_rangedcombatweapons_labels_rangedcombat: json |> field("sheets.combatsheet.rangedcombatweapons.labels.rangedcombat", string),
    sheets_combatsheet_rangedcombatweapons_labels_weight: json |> field("sheets.combatsheet.rangedcombatweapons.labels.weight", string),
    sheets_combatsheet_armors_title: json |> field("sheets.combatsheet.armors.title", string),
    sheets_combatsheet_armors_labels_armor: json |> field("sheets.combatsheet.armors.labels.armor", string),
    sheets_combatsheet_armors_labels_sturdinessrating: json |> field("sheets.combatsheet.armors.labels.sturdinessrating", string),
    sheets_combatsheet_armors_labels_wear: json |> field("sheets.combatsheet.armors.labels.wear", string),
    sheets_combatsheet_armors_labels_protection: json |> field("sheets.combatsheet.armors.labels.protection", string),
    sheets_combatsheet_armors_labels_encumbrance: json |> field("sheets.combatsheet.armors.labels.encumbrance", string),
    sheets_combatsheet_armors_labels_movementinitiative: json |> field("sheets.combatsheet.armors.labels.movementinitiative", string),
    sheets_combatsheet_armors_labels_carriedwhereexamples: json |> field("sheets.combatsheet.armors.labels.carriedwhereexamples", string),
    sheets_combatsheet_armors_labels_head: json |> field("sheets.combatsheet.armors.labels.head", string),
    sheets_combatsheet_armors_labels_torso: json |> field("sheets.combatsheet.armors.labels.torso", string),
    sheets_combatsheet_armors_labels_leftarm: json |> field("sheets.combatsheet.armors.labels.leftarm", string),
    sheets_combatsheet_armors_labels_rightarm: json |> field("sheets.combatsheet.armors.labels.rightarm", string),
    sheets_combatsheet_armors_labels_leftleg: json |> field("sheets.combatsheet.armors.labels.leftleg", string),
    sheets_combatsheet_armors_labels_rightleg: json |> field("sheets.combatsheet.armors.labels.rightleg", string),
    sheets_combatsheet_armors_labels_weight: json |> field("sheets.combatsheet.armors.labels.weight", string),
    sheets_combatsheet_shieldparryingweapon_title: json |> field("sheets.combatsheet.shieldparryingweapon.title", string),
    sheets_combatsheet_shieldparryingweapon_labels_shieldparryingweapon: json |> field("sheets.combatsheet.shieldparryingweapon.labels.shieldparryingweapon", string),
    sheets_combatsheet_shieldparryingweapon_labels_structurepoints: json |> field("sheets.combatsheet.shieldparryingweapon.labels.structurepoints", string),
    sheets_combatsheet_shieldparryingweapon_labels_breakingpointrating: json |> field("sheets.combatsheet.shieldparryingweapon.labels.breakingpointrating", string),
    sheets_combatsheet_shieldparryingweapon_labels_damaged: json |> field("sheets.combatsheet.shieldparryingweapon.labels.damaged", string),
    sheets_combatsheet_shieldparryingweapon_labels_attackparrymodifier: json |> field("sheets.combatsheet.shieldparryingweapon.labels.attackparrymodifier", string),
    sheets_combatsheet_shieldparryingweapon_labels_weight: json |> field("sheets.combatsheet.shieldparryingweapon.labels.weight", string),
    sheets_combatsheet_actions: json |> field("sheets.combatsheet.actions", string),
    sheets_combatsheet_combatspecialabilities: json |> field("sheets.combatsheet.combatspecialabilities", string),
    sheets_combatsheet_conditions: json |> field("sheets.combatsheet.conditions", string),
    sheets_combatsheet_states: json |> field("sheets.combatsheet.states", string),

    sheets_belongingssheet_title: json |> field("sheets.belongingssheet.title", string),
    sheets_belongingssheet_equipmenttable_title: json |> field("sheets.belongingssheet.equipmenttable.title", string),
    sheets_belongingssheet_equipmenttable_labels_item: json |> field("sheets.belongingssheet.equipmenttable.labels.item", string),
    sheets_belongingssheet_equipmenttable_labels_number: json |> field("sheets.belongingssheet.equipmenttable.labels.number", string),
    sheets_belongingssheet_equipmenttable_labels_price: json |> field("sheets.belongingssheet.equipmenttable.labels.price", string),
    sheets_belongingssheet_equipmenttable_labels_weight: json |> field("sheets.belongingssheet.equipmenttable.labels.weight", string),
    sheets_belongingssheet_equipmenttable_labels_carriedwhere: json |> field("sheets.belongingssheet.equipmenttable.labels.carriedwhere", string),
    sheets_belongingssheet_equipmenttable_labels_total: json |> field("sheets.belongingssheet.equipmenttable.labels.total", string),
    sheets_belongingssheet_purse_title: json |> field("sheets.belongingssheet.purse.title", string),
    sheets_belongingssheet_purse_ducats: json |> field("sheets.belongingssheet.purse.ducats", string),
    sheets_belongingssheet_purse_silverthalers: json |> field("sheets.belongingssheet.purse.silverthalers", string),
    sheets_belongingssheet_purse_halers: json |> field("sheets.belongingssheet.purse.halers", string),
    sheets_belongingssheet_purse_kreutzers: json |> field("sheets.belongingssheet.purse.kreutzers", string),
    sheets_belongingssheet_purse_gems: json |> field("sheets.belongingssheet.purse.gems", string),
    sheets_belongingssheet_purse_jewelry: json |> field("sheets.belongingssheet.purse.jewelry", string),
    sheets_belongingssheet_purse_other: json |> field("sheets.belongingssheet.purse.other", string),
    sheets_belongingssheet_carryingcapacity_title: json |> field("sheets.belongingssheet.carryingcapacity.title", string),
    sheets_belongingssheet_carryingcapacity_calc: json |> field("sheets.belongingssheet.carryingcapacity.calc", string),
    sheets_belongingssheet_carryingcapacity_label: json |> field("sheets.belongingssheet.carryingcapacity.label", string),
    sheets_belongingssheet_animal_title: json |> field("sheets.belongingssheet.animal.title", string),
    sheets_belongingssheet_animal_name: json |> field("sheets.belongingssheet.animal.name", string),
    sheets_belongingssheet_animal_sizecategory: json |> field("sheets.belongingssheet.animal.sizecategory", string),
    sheets_belongingssheet_animal_type: json |> field("sheets.belongingssheet.animal.type", string),
    sheets_belongingssheet_animal_ap: json |> field("sheets.belongingssheet.animal.ap", string),
    sheets_belongingssheet_animal_protection: json |> field("sheets.belongingssheet.animal.protection", string),
    sheets_belongingssheet_animal_attackname: json |> field("sheets.belongingssheet.animal.attackname", string),
    sheets_belongingssheet_animal_attack: json |> field("sheets.belongingssheet.animal.attack", string),
    sheets_belongingssheet_animal_parry: json |> field("sheets.belongingssheet.animal.parry", string),
    sheets_belongingssheet_animal_damagepoints: json |> field("sheets.belongingssheet.animal.damagepoints", string),
    sheets_belongingssheet_animal_reach: json |> field("sheets.belongingssheet.animal.reach", string),
    sheets_belongingssheet_animal_actions: json |> field("sheets.belongingssheet.animal.actions", string),
    sheets_belongingssheet_animal_skills: json |> field("sheets.belongingssheet.animal.skills", string),
    sheets_belongingssheet_animal_specialabilities: json |> field("sheets.belongingssheet.animal.specialabilities", string),
    sheets_belongingssheet_animal_notes: json |> field("sheets.belongingssheet.animal.notes", string),

    sheets_spellssheet_title: json |> field("sheets.spellssheet.title", string),
    sheets_spellssheet_header_labels_aemax: json |> field("sheets.spellssheet.header.labels.aemax", string),
    sheets_spellssheet_header_labels_aecurrent: json |> field("sheets.spellssheet.header.labels.aecurrent", string),
    sheets_spellssheet_spellstable_title: json |> field("sheets.spellssheet.spellstable.title", string),
    sheets_spellssheet_spellstable_labels_spellorritual: json |> field("sheets.spellssheet.spellstable.labels.spellorritual", string),
    sheets_spellssheet_spellstable_labels_check: json |> field("sheets.spellssheet.spellstable.labels.check", string),
    sheets_spellssheet_spellstable_labels_skillrating: json |> field("sheets.spellssheet.spellstable.labels.skillrating", string),
    sheets_spellssheet_spellstable_labels_cost: json |> field("sheets.spellssheet.spellstable.labels.cost", string),
    sheets_spellssheet_spellstable_labels_castingtime: json |> field("sheets.spellssheet.spellstable.labels.castingtime", string),
    sheets_spellssheet_spellstable_labels_range: json |> field("sheets.spellssheet.spellstable.labels.range", string),
    sheets_spellssheet_spellstable_labels_duration: json |> field("sheets.spellssheet.spellstable.labels.duration", string),
    sheets_spellssheet_spellstable_labels_property: json |> field("sheets.spellssheet.spellstable.labels.property", string),
    sheets_spellssheet_spellstable_labels_improvementcost: json |> field("sheets.spellssheet.spellstable.labels.improvementcost", string),
    sheets_spellssheet_spellstable_labels_effect: json |> field("sheets.spellssheet.spellstable.labels.effect", string),
    sheets_spellssheet_spellstable_labels_pages: json |> field("sheets.spellssheet.spellstable.labels.pages", string),
    sheets_spellssheet_spellstable_unfamiliarspell: json |> field("sheets.spellssheet.spellstable.unfamiliarspell", string),
    sheets_spellssheet_primaryattribute: json |> field("sheets.spellssheet.primaryattribute", string),
    sheets_spellssheet_properties: json |> field("sheets.spellssheet.properties", string),
    sheets_spellssheet_tradition: json |> field("sheets.spellssheet.tradition", string),
    sheets_spellssheet_magicalspecialabilities: json |> field("sheets.spellssheet.magicalspecialabilities", string),
    sheets_spellssheet_cantrips: json |> field("sheets.spellssheet.cantrips", string),

    sheets_chantssheet_title: json |> field("sheets.chantssheet.title", string),
    sheets_chantssheet_header_labels_kpmax: json |> field("sheets.chantssheet.header.labels.kpmax", string),
    sheets_chantssheet_header_labels_kpcurrent: json |> field("sheets.chantssheet.header.labels.kpcurrent", string),
    sheets_chantssheet_chantstable_title: json |> field("sheets.chantssheet.chantstable.title", string),
    sheets_chantssheet_chantstable_labels_chant: json |> field("sheets.chantssheet.chantstable.labels.chant", string),
    sheets_chantssheet_chantstable_labels_check: json |> field("sheets.chantssheet.chantstable.labels.check", string),
    sheets_chantssheet_chantstable_labels_skillrating: json |> field("sheets.chantssheet.chantstable.labels.skillrating", string),
    sheets_chantssheet_chantstable_labels_cost: json |> field("sheets.chantssheet.chantstable.labels.cost", string),
    sheets_chantssheet_chantstable_labels_castingtime: json |> field("sheets.chantssheet.chantstable.labels.castingtime", string),
    sheets_chantssheet_chantstable_labels_range: json |> field("sheets.chantssheet.chantstable.labels.range", string),
    sheets_chantssheet_chantstable_labels_duration: json |> field("sheets.chantssheet.chantstable.labels.duration", string),
    sheets_chantssheet_chantstable_labels_aspect: json |> field("sheets.chantssheet.chantstable.labels.aspect", string),
    sheets_chantssheet_chantstable_labels_improvementcost: json |> field("sheets.chantssheet.chantstable.labels.improvementcost", string),
    sheets_chantssheet_chantstable_labels_effect: json |> field("sheets.chantssheet.chantstable.labels.effect", string),
    sheets_chantssheet_chantstable_labels_pages: json |> field("sheets.chantssheet.chantstable.labels.pages", string),
    sheets_chantssheet_primaryattribute: json |> field("sheets.chantssheet.primaryattribute", string),
    sheets_chantssheet_aspects: json |> field("sheets.chantssheet.aspects", string),
    sheets_chantssheet_tradition: json |> field("sheets.chantssheet.tradition", string),
    sheets_chantssheet_blessedspecialabilities: json |> field("sheets.chantssheet.blessedspecialabilities", string),
    sheets_chantssheet_blessings: json |> field("sheets.chantssheet.blessings", string),

    pacts_pactcategory: json |> field("pacts.pactcategory", string),
    pacts_nopact: json |> field("pacts.nopact", string),
    pacts_pactlevel: json |> field("pacts.pactlevel", string),
    pacts_fairytype: json |> field("pacts.fairytype", string),
    pacts_domain: json |> field("pacts.domain", string),
    pacts_userdefined: json |> field("pacts.userdefined", string),
    pacts_demontype: json |> field("pacts.demontype", string),
    pacts_circleofdamnation: json |> field("pacts.circleofdamnation", string),
    pacts_minorpact: json |> field("pacts.minorpact", string),
    pacts_pactisincompletehint: json |> field("pacts.pactisincompletehint", string),
    pacts_name: json |> field("pacts.name", string),

    rules_rulebase: json |> field("rules.rulebase", string),
    rules_enableallrulebooks: json |> field("rules.enableallrulebooks", string),
    rules_focusrules: json |> field("rules.focusrules", string),
    rules_optionalrules: json |> field("rules.optionalrules", string),
    rules_manualherodatarepair: json |> field("rules.manualherodatarepair", string),
    rules_manualherodatarepairexplanation: json |> field("rules.manualherodatarepairexplanation", string),

    inlinewiki_complementarysources: json |> field("inlinewiki.complementarysources", string),

    race_header_name: json |> field("race.header.name", string),
    race_header_adventurepoints: json |> field("race.header.adventurepoints", string),
    race_header_adventurepoints_tooltip: json |> field("race.header.adventurepoints.tooltip", string),

    inlinewiki_apvalue: json |> field("inlinewiki.apvalue", string),
    inlinewiki_adventurepoints: json |> field("inlinewiki.adventurepoints", string),
    inlinewiki_lifepointbasevalue: json |> field("inlinewiki.lifepointbasevalue", string),
    inlinewiki_spiritbasevalue: json |> field("inlinewiki.spiritbasevalue", string),
    inlinewiki_toughnessbasevalue: json |> field("inlinewiki.toughnessbasevalue", string),
    inlinewiki_movementbasevalue: json |> field("inlinewiki.movementbasevalue", string),
    inlinewiki_attributeadjustments: json |> field("inlinewiki.attributeadjustments", string),
    inlinewiki_automaticadvantages: json |> field("inlinewiki.automaticadvantages", string),
    inlinewiki_stronglyrecommendedadvantages: json |> field("inlinewiki.stronglyrecommendedadvantages", string),
    inlinewiki_stronglyrecommendeddisadvantages: json |> field("inlinewiki.stronglyrecommendeddisadvantages", string),
    inlinewiki_commoncultures: json |> field("inlinewiki.commoncultures", string),
    inlinewiki_commonadvantages: json |> field("inlinewiki.commonadvantages", string),
    inlinewiki_commondisadvantages: json |> field("inlinewiki.commondisadvantages", string),
    inlinewiki_uncommonadvantages: json |> field("inlinewiki.uncommonadvantages", string),
    inlinewiki_uncommondisadvantages: json |> field("inlinewiki.uncommondisadvantages", string),

    culture_filters_common_allcultures: json |> field("culture.filters.common.allcultures", string),
    culture_filters_common_commoncultures: json |> field("culture.filters.common.commoncultures", string),
    culture_header_name: json |> field("culture.header.name", string),

    inlinewiki_language: json |> field("inlinewiki.language", string),
    inlinewiki_script: json |> field("inlinewiki.script", string),
    inlinewiki_areaknowledge: json |> field("inlinewiki.areaknowledge", string),
    inlinewiki_socialstatus: json |> field("inlinewiki.socialstatus", string),
    inlinewiki_commonprofessions: json |> field("inlinewiki.commonprofessions", string),
    inlinewiki_commonprofessions_mundane: json |> field("inlinewiki.commonprofessions.mundane", string),
    inlinewiki_commonprofessions_magic: json |> field("inlinewiki.commonprofessions.magic", string),
    inlinewiki_commonprofessions_blessed: json |> field("inlinewiki.commonprofessions.blessed", string),
    inlinewiki_commonskills: json |> field("inlinewiki.commonskills", string),
    inlinewiki_uncommonskills: json |> field("inlinewiki.uncommonskills", string),
    inlinewiki_commonnames: json |> field("inlinewiki.commonnames", string),
    inlinewiki_culturalpackage: json |> field("inlinewiki.culturalpackage", string),

    profession_ownprofession: json |> field("profession.ownprofession", string),
    profession_variants_novariant: json |> field("profession.variants.novariant", string),
    profession_filters_common_allprofessions: json |> field("profession.filters.common.allprofessions", string),
    profession_filters_common_commonprofessions: json |> field("profession.filters.common.commonprofessions", string),
    profession_filters_groups_allprofessiongroups: json |> field("profession.filters.groups.allprofessiongroups", string),
    profession_filters_groups_mundaneprofessions: json |> field("profession.filters.groups.mundaneprofessions", string),
    profession_filters_groups_magicalprofessions: json |> field("profession.filters.groups.magicalprofessions", string),
    profession_filters_groups_blessedprofessions: json |> field("profession.filters.groups.blessedprofessions", string),
    profession_header_name: json |> field("profession.header.name", string),
    profession_header_adventurepoints: json |> field("profession.header.adventurepoints", string),
    profession_header_adventurepoints_tooltip: json |> field("profession.header.adventurepoints.tooltip", string),

    inlinewiki_prerequisites: json |> field("inlinewiki.prerequisites", string),
    inlinewiki_race: json |> field("inlinewiki.race", string),
    inlinewiki_specialabilities: json |> field("inlinewiki.specialabilities", string),
    inlinewiki_languagesandliteracytotalingap: json |> field("inlinewiki.languagesandliteracytotalingap", string),
    inlinewiki_skillspecialization: json |> field("inlinewiki.skillspecialization", string),
    inlinewiki_skillsselection: json |> field("inlinewiki.skillsselection", string),
    inlinewiki_combattechniques: json |> field("inlinewiki.combattechniques", string),
    inlinewiki_combattechniqueselection: json |> field("inlinewiki.combattechniqueselection", string),
    inlinewiki_combattechnique_one: json |> field("inlinewiki.combattechnique.one", string),
    inlinewiki_combattechnique_two: json |> field("inlinewiki.combattechnique.two", string),
    inlinewiki_combattechniquesecondselection: json |> field("inlinewiki.combattechniquesecondselection", string),
    inlinewiki_skills: json |> field("inlinewiki.skills", string),
    inlinewiki_spells: json |> field("inlinewiki.spells", string),
    inlinewiki_cursestotalingap: json |> field("inlinewiki.cursestotalingap", string),
    inlinewiki_cantripsfromlist: json |> field("inlinewiki.cantripsfromlist", string),
    inlinewiki_cantrip_one: json |> field("inlinewiki.cantrip.one", string),
    inlinewiki_cantrip_two: json |> field("inlinewiki.cantrip.two", string),
    inlinewiki_liturgicalchants: json |> field("inlinewiki.liturgicalchants", string),
    inlinewiki_thetwelveblessings: json |> field("inlinewiki.thetwelveblessings", string),
    inlinewiki_thetwelveblessingsexceptions: json |> field("inlinewiki.thetwelveblessingsexceptions", string),
    inlinewiki_sixblessings: json |> field("inlinewiki.sixblessings", string),
    inlinewiki_suggestedadvantages: json |> field("inlinewiki.suggestedadvantages", string),
    inlinewiki_suggesteddisadvantages: json |> field("inlinewiki.suggesteddisadvantages", string),
    inlinewiki_unsuitableadvantages: json |> field("inlinewiki.unsuitableadvantages", string),
    inlinewiki_unsuitabledisadvantages: json |> field("inlinewiki.unsuitabledisadvantages", string),
    inlinewiki_variants: json |> field("inlinewiki.variants", string),
    inlinewiki_insteadof: json |> field("inlinewiki.insteadof", string),

    rcpselectoptions_race: json |> field("rcpselectoptions.race", string),
    rcpselectoptions_culture: json |> field("rcpselectoptions.culture", string),
    rcpselectoptions_profession: json |> field("rcpselectoptions.profession", string),
    rcpselectoptions_cantripsfromlist: json |> field("rcpselectoptions.cantripsfromlist", string),
    rcpselectoptions_cantrip_one: json |> field("rcpselectoptions.cantrip.one", string),
    rcpselectoptions_cantrip_two: json |> field("rcpselectoptions.cantrip.two", string),
    rcpselectoptions_combattechniqueselection: json |> field("rcpselectoptions.combattechniqueselection", string),
    rcpselectoptions_combattechnique_one: json |> field("rcpselectoptions.combattechnique.one", string),
    rcpselectoptions_combattechnique_two: json |> field("rcpselectoptions.combattechnique.two", string),
    rcpselectoptions_selectattributeadjustment: json |> field("rcpselectoptions.selectattributeadjustment", string),
    rcpselectoptions_buyculturalpackage: json |> field("rcpselectoptions.buyculturalpackage", string),
    rcpselectoptions_nativetongue_placeholder: json |> field("rcpselectoptions.nativetongue.placeholder", string),
    rcpselectoptions_buyscript: json |> field("rcpselectoptions.buyscript", string),
    rcpselectoptions_script_placeholder: json |> field("rcpselectoptions.script.placeholder", string),
    rcpselectoptions_combattechniquesecondselection: json |> field("rcpselectoptions.combattechniquesecondselection", string),
    rcpselectoptions_cursestotalingapleft: json |> field("rcpselectoptions.cursestotalingapleft", string),
    rcpselectoptions_languagesandliteracytotalingapleft: json |> field("rcpselectoptions.languagesandliteracytotalingapleft", string),
    rcpselectoptions_applicationforskillspecialization: json |> field("rcpselectoptions.applicationforskillspecialization", string),
    rcpselectoptions_skillselectionap: json |> field("rcpselectoptions.skillselectionap", string),
    rcpselectoptions_skillspecialization: json |> field("rcpselectoptions.skillspecialization", string),
    rcpselectoptions_completebtn: json |> field("rcpselectoptions.completebtn", string),
    rcpselectoptions_unfamiliarspells: json |> field("rcpselectoptions.unfamiliarspells", string),
    rcpselectoptions_unfamiliarspellselectionfortraditionguildmage: json |> field("rcpselectoptions.unfamiliarspellselectionfortraditionguildmage", string),
    rcpselectoptions_unfamiliarspell_placeholder: json |> field("rcpselectoptions.unfamiliarspell.placeholder", string),
    rcpselectoptions_unfamiliarspell: json |> field("rcpselectoptions.unfamiliarspell", string),

    attributes_totalpoints: json |> field("attributes.totalpoints", string),
    attributes_attributeadjustmentselection: json |> field("attributes.attributeadjustmentselection", string),
    attributes_derivedcharacteristics_tooltips_modifier: json |> field("attributes.derivedcharacteristics.tooltips.modifier", string),
    attributes_derivedcharacteristics_tooltips_bought: json |> field("attributes.derivedcharacteristics.tooltips.bought", string),
    attributes_derivedcharacteristics_tooltips_losttotal: json |> field("attributes.derivedcharacteristics.tooltips.losttotal", string),
    attributes_derivedcharacteristics_tooltips_boughtback: json |> field("attributes.derivedcharacteristics.tooltips.boughtback", string),
    attributes_lostpermanently_lifepoints: json |> field("attributes.lostpermanently.lifepoints", string),
    attributes_lostpermanently_lifepoints_short: json |> field("attributes.lostpermanently.lifepoints.short", string),
    attributes_lostpermanently_arcaneenergy: json |> field("attributes.lostpermanently.arcaneenergy", string),
    attributes_lostpermanently_arcaneenergy_short: json |> field("attributes.lostpermanently.arcaneenergy.short", string),
    attributes_lostpermanently_karmapoints: json |> field("attributes.lostpermanently.karmapoints", string),
    attributes_lostpermanently_karmapoints_short: json |> field("attributes.lostpermanently.karmapoints.short", string),
    attributes_removeenergypointslostpermanently_title: json |> field("attributes.removeenergypointslostpermanently.title", string),
    attributes_removeenergypointslostpermanently_message: json |> field("attributes.removeenergypointslostpermanently.message", string),
    attributes_removeenergypointslostpermanently_removebtn: json |> field("attributes.removeenergypointslostpermanently.removebtn", string),
    attributes_pointslostpermanentlyeditor_boughtback: json |> field("attributes.pointslostpermanentlyeditor.boughtback", string),
    attributes_pointslostpermanentlyeditor_spent: json |> field("attributes.pointslostpermanentlyeditor.spent", string),

    advantages_filters_commonadvantages: json |> field("advantages.filters.commonadvantages", string),
    disadvantages_filters_commondisadvantages: json |> field("disadvantages.filters.commondisadvantages", string),
    advantagesdisadvantages_addbtn: json |> field("advantagesdisadvantages.addbtn", string),
    advantagesdisadvantages_afraidof: json |> field("advantagesdisadvantages.afraidof", string),
    advantagesdisadvantages_immunityto: json |> field("advantagesdisadvantages.immunityto", string),
    advantagesdisadvantages_hatredfor: json |> field("advantagesdisadvantages.hatredfor", string),
    advantagesdisadvantages_header_name: json |> field("advantagesdisadvantages.header.name", string),
    advantagesdisadvantages_header_adventurepoints: json |> field("advantagesdisadvantages.header.adventurepoints", string),
    advantagesdisadvantages_header_adventurepoints_tooltip: json |> field("advantagesdisadvantages.header.adventurepoints.tooltip", string),
    advantagesdisadvantages_apspent_spentonadvantages: json |> field("advantagesdisadvantages.apspent.spentonadvantages", string),
    advantagesdisadvantages_apspent_spentonmagicadvantages: json |> field("advantagesdisadvantages.apspent.spentonmagicadvantages", string),
    advantagesdisadvantages_apspent_spentonblessedadvantages: json |> field("advantagesdisadvantages.apspent.spentonblessedadvantages", string),
    advantagesdisadvantages_apspent_spentondisadvantages: json |> field("advantagesdisadvantages.apspent.spentondisadvantages", string),
    advantagesdisadvantages_apspent_spentonmagicdisadvantages: json |> field("advantagesdisadvantages.apspent.spentonmagicdisadvantages", string),
    advantagesdisadvantages_apspent_spentonblesseddisadvantages: json |> field("advantagesdisadvantages.apspent.spentonblesseddisadvantages", string),
    advantagesdisadvantages_dialogs_customcost_title: json |> field("advantagesdisadvantages.dialogs.customcost.title", string),
    advantagesdisadvantages_dialogs_customcost_for: json |> field("advantagesdisadvantages.dialogs.customcost.for", string),
    specialabilities_addbtn: json |> field("specialabilities.addbtn", string),
    specialabilities_header_name: json |> field("specialabilities.header.name", string),
    specialabilities_header_group: json |> field("specialabilities.header.group", string),
    specialabilities_header_adventurepoints: json |> field("specialabilities.header.adventurepoints", string),
    specialabilities_header_adventurepoints_tooltip: json |> field("specialabilities.header.adventurepoints.tooltip", string),
    specialabilities_nativetonguelevel: json |> field("specialabilities.nativetonguelevel", string),

    inlinewiki_rule: json |> field("inlinewiki.rule", string),
    inlinewiki_effect: json |> field("inlinewiki.effect", string),
    inlinewiki_extendedcombatspecialabilities: json |> field("inlinewiki.extendedcombatspecialabilities", string),
    inlinewiki_extendedmagicalspecialabilities: json |> field("inlinewiki.extendedmagicalspecialabilities", string),
    inlinewiki_extendedblessedspecialabilities: json |> field("inlinewiki.extendedblessedspecialabilities", string),
    inlinewiki_extendedskillspecialabilities: json |> field("inlinewiki.extendedskillspecialabilities", string),
    inlinewiki_penalty: json |> field("inlinewiki.penalty", string),
    inlinewiki_level: json |> field("inlinewiki.level", string),
    inlinewiki_perlevel: json |> field("inlinewiki.perlevel", string),
    inlinewiki_volume: json |> field("inlinewiki.volume", string),
    inlinewiki_aspect: json |> field("inlinewiki.aspect", string),
    inlinewiki_bindingcost: json |> field("inlinewiki.bindingcost", string),
    inlinewiki_protectivecircle: json |> field("inlinewiki.protectivecircle", string),
    inlinewiki_wardingcircle: json |> field("inlinewiki.wardingcircle", string),
    inlinewiki_actions: json |> field("inlinewiki.actions", string),
    inlinewiki_racecultureorprofessionrequiresautomaticorsuggested: json |> field("inlinewiki.racecultureorprofessionrequiresautomaticorsuggested", string),
    inlinewiki_advantage: json |> field("inlinewiki.advantage", string),
    inlinewiki_disadvantage: json |> field("inlinewiki.disadvantage", string),
    inlinewiki_primaryattributeofthetradition: json |> field("inlinewiki.primaryattributeofthetradition", string),
    inlinewiki_knowledgeofspell: json |> field("inlinewiki.knowledgeofspell", string),
    inlinewiki_knowledgeofliturgicalchant: json |> field("inlinewiki.knowledgeofliturgicalchant", string),
    inlinewiki_appropriatecombatstylespecialability: json |> field("inlinewiki.appropriatecombatstylespecialability", string),
    inlinewiki_appropriatemagicalstylespecialability: json |> field("inlinewiki.appropriatemagicalstylespecialability", string),
    inlinewiki_appropriateblessedstylespecialability: json |> field("inlinewiki.appropriateblessedstylespecialability", string),
    inlinewiki_appropriateskillstylespecialability: json |> field("inlinewiki.appropriateskillstylespecialability", string),
    inlinewiki_sex: json |> field("inlinewiki.sex", string),
    inlinewiki_sex_male: json |> field("inlinewiki.sex.male", string),
    inlinewiki_sex_female: json |> field("inlinewiki.sex.female", string),
    inlinewiki_combattechniques_groups_all: json |> field("inlinewiki.combattechniques.groups.all", string),
    inlinewiki_combattechniques_groups_allmeleecombattechniques: json |> field("inlinewiki.combattechniques.groups.allmeleecombattechniques", string),
    inlinewiki_combattechniques_groups_allrangedcombattechniques: json |> field("inlinewiki.combattechniques.groups.allrangedcombattechniques", string),
    inlinewiki_combattechniques_groups_allmeleecombattechniqueswithparry: json |> field("inlinewiki.combattechniques.groups.allmeleecombattechniqueswithparry", string),
    inlinewiki_combattechniques_groups_allmeleecombattechniquesforonehandedweapons: json |> field("inlinewiki.combattechniques.groups.allmeleecombattechniquesforonehandedweapons", string),

    inlinewiki_socialstatusxorhigher: json |> field("inlinewiki.socialstatusxorhigher", string),

    skills_commonskills: json |> field("skills.commonskills", string),
    skills_header_name: json |> field("skills.header.name", string),
    skills_header_skillrating: json |> field("skills.header.skillrating", string),
    skills_header_skillrating_tooltip: json |> field("skills.header.skillrating.tooltip", string),
    skills_header_group: json |> field("skills.header.group", string),
    skills_header_check: json |> field("skills.header.check", string),
    skills_header_improvementcost: json |> field("skills.header.improvementcost", string),
    skills_header_improvementcost_tooltip: json |> field("skills.header.improvementcost.tooltip", string),

    inlinewiki_check: json |> field("inlinewiki.check", string),
    inlinewiki_newapplications: json |> field("inlinewiki.newapplications", string),
    inlinewiki_applications: json |> field("inlinewiki.applications", string),
    inlinewiki_uses: json |> field("inlinewiki.uses", string),
    inlinewiki_encumbrance: json |> field("inlinewiki.encumbrance", string),
    inlinewiki_encumbrance_yes: json |> field("inlinewiki.encumbrance.yes", string),
    inlinewiki_encumbrance_no: json |> field("inlinewiki.encumbrance.no", string),
    inlinewiki_encumbrance_maybe: json |> field("inlinewiki.encumbrance.maybe", string),
    inlinewiki_tools: json |> field("inlinewiki.tools", string),
    inlinewiki_quality: json |> field("inlinewiki.quality", string),
    inlinewiki_failedcheck: json |> field("inlinewiki.failedcheck", string),
    inlinewiki_criticalsuccess: json |> field("inlinewiki.criticalsuccess", string),
    inlinewiki_botch: json |> field("inlinewiki.botch", string),
    inlinewiki_improvementcost: json |> field("inlinewiki.improvementcost", string),

    showfrequency_stronglyrecommended: json |> field("showfrequency.stronglyrecommended", string),
    showfrequency_common: json |> field("showfrequency.common", string),
    showfrequency_uncommon: json |> field("showfrequency.uncommon", string),
    showfrequency_unfamiliarspells: json |> field("showfrequency.unfamiliarspells", string),

    combattechniques_header_name: json |> field("combattechniques.header.name", string),
    combattechniques_header_group: json |> field("combattechniques.header.group", string),
    combattechniques_header_combattechniquerating: json |> field("combattechniques.header.combattechniquerating", string),
    combattechniques_header_combattechniquerating_tooltip: json |> field("combattechniques.header.combattechniquerating.tooltip", string),
    combattechniques_header_improvementcost: json |> field("combattechniques.header.improvementcost", string),
    combattechniques_header_improvementcost_tooltip: json |> field("combattechniques.header.improvementcost.tooltip", string),
    combattechniques_header_primaryattribute: json |> field("combattechniques.header.primaryattribute", string),
    combattechniques_header_primaryattribute_tooltip: json |> field("combattechniques.header.primaryattribute.tooltip", string),
    combattechniques_header_attack: json |> field("combattechniques.header.attack", string),
    combattechniques_header_attack_tooltip: json |> field("combattechniques.header.attack.tooltip", string),
    combattechniques_header_parry: json |> field("combattechniques.header.parry", string),
    combattechniques_header_parry_tooltip: json |> field("combattechniques.header.parry.tooltip", string),

    inlinewiki_special: json |> field("inlinewiki.special", string),
    inlinewiki_primaryattribute: json |> field("inlinewiki.primaryattribute", string),

    spells_addbtn: json |> field("spells.addbtn", string),
    spells_header_name: json |> field("spells.header.name", string),
    spells_header_property: json |> field("spells.header.property", string),
    spells_header_group: json |> field("spells.header.group", string),
    spells_header_skillrating: json |> field("spells.header.skillrating", string),
    spells_header_skillrating_tooltip: json |> field("spells.header.skillrating.tooltip", string),
    spells_header_check: json |> field("spells.header.check", string),
    spells_header_checkmodifier: json |> field("spells.header.checkmodifier", string),
    spells_header_checkmodifier_tooltip: json |> field("spells.header.checkmodifier.tooltip", string),
    spells_header_improvementcost: json |> field("spells.header.improvementcost", string),
    spells_header_improvementcost_tooltip: json |> field("spells.header.improvementcost.tooltip", string),
    spells_groups_cantrip: json |> field("spells.groups.cantrip", string),
    spells_traditions_general: json |> field("spells.traditions.general", string),
    magicalactions_animistforces_tribes_general: json |> field("magicalactions.animistforces.tribes.general", string),

    inlinewiki_castingtime: json |> field("inlinewiki.castingtime", string),
    inlinewiki_ritualtime: json |> field("inlinewiki.ritualtime", string),
    inlinewiki_aecost: json |> field("inlinewiki.aecost", string),
    inlinewiki_range: json |> field("inlinewiki.range", string),
    inlinewiki_duration: json |> field("inlinewiki.duration", string),
    inlinewiki_targetcategory: json |> field("inlinewiki.targetcategory", string),
    inlinewiki_property: json |> field("inlinewiki.property", string),
    inlinewiki_traditions: json |> field("inlinewiki.traditions", string),
    inlinewiki_skill: json |> field("inlinewiki.skill", string),
    inlinewiki_lengthoftime: json |> field("inlinewiki.lengthoftime", string),
    inlinewiki_musictradition: json |> field("inlinewiki.musictradition", string),
    inlinewiki_youcannotuseamodificationonthisspellscastingtime: json |> field("inlinewiki.youcannotuseamodificationonthisspellscastingtime", string),
    inlinewiki_youcannotuseamodificationonthisspellsritualtime: json |> field("inlinewiki.youcannotuseamodificationonthisspellsritualtime", string),
    inlinewiki_youcannotuseamodificationonthisspellscost: json |> field("inlinewiki.youcannotuseamodificationonthisspellscost", string),
    inlinewiki_youcannotuseamodificationonthisspellsrange: json |> field("inlinewiki.youcannotuseamodificationonthisspellsrange", string),
    inlinewiki_youcannotuseamodificationonthisspellsduration: json |> field("inlinewiki.youcannotuseamodificationonthisspellsduration", string),
    inlinewiki_spellenhancements: json |> field("inlinewiki.spellenhancements", string),
    inlinewiki_spellenhancements_title: json |> field("inlinewiki.spellenhancements.title", string),
    inlinewiki_tribaltraditions: json |> field("inlinewiki.tribaltraditions", string),
    inlinewiki_brew: json |> field("inlinewiki.brew", string),
    inlinewiki_spirithalf: json |> field("inlinewiki.spirithalf", string),
    inlinewiki_spirithalf_short: json |> field("inlinewiki.spirithalf.short", string),
    inlinewiki_spiritortoughness: json |> field("inlinewiki.spiritortoughness", string),
    inlinewiki_spiritortoughness_short: json |> field("inlinewiki.spiritortoughness.short", string),
    inlinewiki_note: json |> field("inlinewiki.note", string),

    liturgicalchants_addbtn: json |> field("liturgicalchants.addbtn", string),
    liturgicalchants_header_name: json |> field("liturgicalchants.header.name", string),
    liturgicalchants_header_traditions: json |> field("liturgicalchants.header.traditions", string),
    liturgicalchants_header_group: json |> field("liturgicalchants.header.group", string),
    liturgicalchants_header_skillrating: json |> field("liturgicalchants.header.skillrating", string),
    liturgicalchants_header_skillrating_tooltip: json |> field("liturgicalchants.header.skillrating.tooltip", string),
    liturgicalchants_header_check: json |> field("liturgicalchants.header.check", string),
    liturgicalchants_header_checkmodifier: json |> field("liturgicalchants.header.checkmodifier", string),
    liturgicalchants_header_checkmodifier_tooltip: json |> field("liturgicalchants.header.checkmodifier.tooltip", string),
    liturgicalchants_header_improvementcost: json |> field("liturgicalchants.header.improvementcost", string),
    liturgicalchants_header_improvementcost_tooltip: json |> field("liturgicalchants.header.improvementcost.tooltip", string),
    liturgicalchants_groups_blessing: json |> field("liturgicalchants.groups.blessing", string),
    liturgicalchants_aspects_general: json |> field("liturgicalchants.aspects.general", string),

    inlinewiki_liturgicaltime: json |> field("inlinewiki.liturgicaltime", string),
    inlinewiki_ceremonialtime: json |> field("inlinewiki.ceremonialtime", string),
    inlinewiki_kpcost: json |> field("inlinewiki.kpcost", string),
    inlinewiki_youcannotuseamodificationonthischantsliturgicaltime: json |> field("inlinewiki.youcannotuseamodificationonthischantsliturgicaltime", string),
    inlinewiki_youcannotuseamodificationonthischantsceremonialtime: json |> field("inlinewiki.youcannotuseamodificationonthischantsceremonialtime", string),
    inlinewiki_youcannotuseamodificationonthischantscost: json |> field("inlinewiki.youcannotuseamodificationonthischantscost", string),
    inlinewiki_youcannotuseamodificationonthischantsrange: json |> field("inlinewiki.youcannotuseamodificationonthischantsrange", string),
    inlinewiki_youcannotuseamodificationonthischantsduration: json |> field("inlinewiki.youcannotuseamodificationonthischantsduration", string),
    inlinewiki_liturgicalchantenhancements: json |> field("inlinewiki.liturgicalchantenhancements", string),
    inlinewiki_liturgicalchantenhancements_title: json |> field("inlinewiki.liturgicalchantenhancements.title", string),

    equipment_header_name: json |> field("equipment.header.name", string),
    equipment_header_group: json |> field("equipment.header.group", string),
    equipment_addbtn: json |> field("equipment.addbtn", string),
    equipment_createbtn: json |> field("equipment.createbtn", string),
    equipment_filters_allcombattechniques: json |> field("equipment.filters.allcombattechniques", string),

    equipment_purse_title: json |> field("equipment.purse.title", string),
    equipment_purse_ducats: json |> field("equipment.purse.ducats", string),
    equipment_purse_silverthalers: json |> field("equipment.purse.silverthalers", string),
    equipment_purse_halers: json |> field("equipment.purse.halers", string),
    equipment_purse_kreutzers: json |> field("equipment.purse.kreutzers", string),
    equipment_purse_carryingcapacity: json |> field("equipment.purse.carryingcapacity", string),
    equipment_purse_initialstartingwealthandcarryingcapacity: json |> field("equipment.purse.initialstartingwealthandcarryingcapacity", string),

    equipment_dialogs_addedit_damage: json |> field("equipment.dialogs.addedit.damage", string),
    equipment_dialogs_addedit_length: json |> field("equipment.dialogs.addedit.length", string),
    equipment_dialogs_addedit_range: json |> field("equipment.dialogs.addedit.range", string),
    equipment_dialogs_addedit_edititem: json |> field("equipment.dialogs.addedit.edititem", string),
    equipment_dialogs_addedit_createitem: json |> field("equipment.dialogs.addedit.createitem", string),
    equipment_dialogs_addedit_number: json |> field("equipment.dialogs.addedit.number", string),
    equipment_dialogs_addedit_name: json |> field("equipment.dialogs.addedit.name", string),
    equipment_dialogs_addedit_price: json |> field("equipment.dialogs.addedit.price", string),
    equipment_dialogs_addedit_weight: json |> field("equipment.dialogs.addedit.weight", string),
    equipment_dialogs_addedit_carriedwhere: json |> field("equipment.dialogs.addedit.carriedwhere", string),
    equipment_dialogs_addedit_itemgroup: json |> field("equipment.dialogs.addedit.itemgroup", string),
    equipment_dialogs_addedit_itemgrouphint: json |> field("equipment.dialogs.addedit.itemgrouphint", string),
    equipment_dialogs_addedit_improvisedweapon: json |> field("equipment.dialogs.addedit.improvisedweapon", string),
    equipment_dialogs_addedit_improvisedweapongroup: json |> field("equipment.dialogs.addedit.improvisedweapongroup", string),
    equipment_dialogs_addedit_template: json |> field("equipment.dialogs.addedit.template", string),
    equipment_dialogs_addedit_combattechnique: json |> field("equipment.dialogs.addedit.combattechnique", string),
    equipment_dialogs_addedit_primaryattributeanddamagethreshold: json |> field("equipment.dialogs.addedit.primaryattributeanddamagethreshold", string),
    equipment_dialogs_addedit_primaryattribute: json |> field("equipment.dialogs.addedit.primaryattribute", string),
    equipment_dialogs_addedit_primaryattribute_short: json |> field("equipment.dialogs.addedit.primaryattribute.short", string),
    equipment_dialogs_addedit_damagethreshold: json |> field("equipment.dialogs.addedit.damagethreshold", string),
    equipment_dialogs_addedit_separatedamagethresholds: json |> field("equipment.dialogs.addedit.separatedamagethresholds", string),
    equipment_dialogs_addedit_breakingpointratingmodifier: json |> field("equipment.dialogs.addedit.breakingpointratingmodifier", string),
    equipment_dialogs_addedit_damaged: json |> field("equipment.dialogs.addedit.damaged", string),
    equipment_dialogs_addedit_reach: json |> field("equipment.dialogs.addedit.reach", string),
    equipment_dialogs_addedit_attackparrymodifier: json |> field("equipment.dialogs.addedit.attackparrymodifier", string),
    equipment_dialogs_addedit_structurepoints: json |> field("equipment.dialogs.addedit.structurepoints", string),
    equipment_dialogs_addedit_lengthwithunit: json |> field("equipment.dialogs.addedit.lengthwithunit", string),
    equipment_dialogs_addedit_parryingweapon: json |> field("equipment.dialogs.addedit.parryingweapon", string),
    equipment_dialogs_addedit_twohandedweapon: json |> field("equipment.dialogs.addedit.twohandedweapon", string),
    equipment_dialogs_addedit_reloadtime: json |> field("equipment.dialogs.addedit.reloadtime", string),
    equipment_dialogs_addedit_rangeclose: json |> field("equipment.dialogs.addedit.rangeclose", string),
    equipment_dialogs_addedit_rangemedium: json |> field("equipment.dialogs.addedit.rangemedium", string),
    equipment_dialogs_addedit_rangefar: json |> field("equipment.dialogs.addedit.rangefar", string),
    equipment_dialogs_addedit_ammunition: json |> field("equipment.dialogs.addedit.ammunition", string),
    equipment_dialogs_addedit_protection: json |> field("equipment.dialogs.addedit.protection", string),
    equipment_dialogs_addedit_encumbrance: json |> field("equipment.dialogs.addedit.encumbrance", string),
    equipment_dialogs_addedit_armortype: json |> field("equipment.dialogs.addedit.armortype", string),
    equipment_dialogs_addedit_sturdinessmodifier: json |> field("equipment.dialogs.addedit.sturdinessmodifier", string),
    equipment_dialogs_addedit_wear: json |> field("equipment.dialogs.addedit.wear", string),
    equipment_dialogs_addedit_hitzonearmoronly: json |> field("equipment.dialogs.addedit.hitzonearmoronly", string),
    equipment_dialogs_addedit_movementmodifier: json |> field("equipment.dialogs.addedit.movementmodifier", string),
    equipment_dialogs_addedit_initiativemodifier: json |> field("equipment.dialogs.addedit.initiativemodifier", string),
    equipment_dialogs_addedit_additionalpenalties: json |> field("equipment.dialogs.addedit.additionalpenalties", string),

    hitzonearmors_header_name: json |> field("hitzonearmors.header.name", string),
    hitzonearmors_createbtn: json |> field("hitzonearmors.createbtn", string),
    hitzonearmors_dialogs_addedit_name: json |> field("hitzonearmors.dialogs.addedit.name", string),
    hitzonearmors_dialogs_addedit_edithitzonearmor: json |> field("hitzonearmors.dialogs.addedit.edithitzonearmor", string),
    hitzonearmors_dialogs_addedit_createhitzonearmor: json |> field("hitzonearmors.dialogs.addedit.createhitzonearmor", string),
    hitzonearmors_dialogs_addedit_head: json |> field("hitzonearmors.dialogs.addedit.head", string),
    hitzonearmors_dialogs_addedit_torso: json |> field("hitzonearmors.dialogs.addedit.torso", string),
    hitzonearmors_dialogs_addedit_leftarm: json |> field("hitzonearmors.dialogs.addedit.leftarm", string),
    hitzonearmors_dialogs_addedit_rightarm: json |> field("hitzonearmors.dialogs.addedit.rightarm", string),
    hitzonearmors_dialogs_addedit_leftleg: json |> field("hitzonearmors.dialogs.addedit.leftleg", string),
    hitzonearmors_dialogs_addedit_rightleg: json |> field("hitzonearmors.dialogs.addedit.rightleg", string),
    hitzonearmors_dialogs_addedit_wear: json |> field("hitzonearmors.dialogs.addedit.wear", string),

    inlinewiki_equipment_weight: json |> field("inlinewiki.equipment.weight", string),
    inlinewiki_equipment_price: json |> field("inlinewiki.equipment.price", string),
    inlinewiki_equipment_ammunition: json |> field("inlinewiki.equipment.ammunition", string),
    inlinewiki_equipment_combattechnique: json |> field("inlinewiki.equipment.combattechnique", string),
    inlinewiki_equipment_damage: json |> field("inlinewiki.equipment.damage", string),
    inlinewiki_equipment_primaryattributeanddamagethreshold: json |> field("inlinewiki.equipment.primaryattributeanddamagethreshold", string),
    inlinewiki_equipment_attackparrymodifier: json |> field("inlinewiki.equipment.attackparrymodifier", string),
    inlinewiki_equipment_reach: json |> field("inlinewiki.equipment.reach", string),
    inlinewiki_equipment_length: json |> field("inlinewiki.equipment.length", string),
    inlinewiki_equipment_reloadtime: json |> field("inlinewiki.equipment.reloadtime", string),
    inlinewiki_equipment_range: json |> field("inlinewiki.equipment.range", string),

    inlinewiki_equipment_actionsvalue: json |> field("inlinewiki.equipment.actionsvalue", string),
    inlinewiki_equipment_protection: json |> field("inlinewiki.equipment.protection", string),
    inlinewiki_equipment_encumbrance: json |> field("inlinewiki.equipment.encumbrance", string),
    inlinewiki_equipment_additionalpenalties: json |> field("inlinewiki.equipment.additionalpenalties", string),
    inlinewiki_equipment_note: json |> field("inlinewiki.equipment.note", string),
    inlinewiki_equipment_rules: json |> field("inlinewiki.equipment.rules", string),
    inlinewiki_equipment_weaponadvantage: json |> field("inlinewiki.equipment.weaponadvantage", string),
    inlinewiki_equipment_weapondisadvantage: json |> field("inlinewiki.equipment.weapondisadvantage", string),
    inlinewiki_equipment_armoradvantage: json |> field("inlinewiki.equipment.armoradvantage", string),
    inlinewiki_equipment_armordisadvantage: json |> field("inlinewiki.equipment.armordisadvantage", string),

    pets_dialogs_addedit_deleteavatarbtn: json |> field("pets.dialogs.addedit.deleteavatarbtn", string),
    pets_dialogs_addedit_name: json |> field("pets.dialogs.addedit.name", string),
    pets_dialogs_addedit_sizecategory: json |> field("pets.dialogs.addedit.sizecategory", string),
    pets_dialogs_addedit_type: json |> field("pets.dialogs.addedit.type", string),
    pets_dialogs_addedit_apspent: json |> field("pets.dialogs.addedit.apspent", string),
    pets_dialogs_addedit_totalap: json |> field("pets.dialogs.addedit.totalap", string),
    pets_dialogs_addedit_protection: json |> field("pets.dialogs.addedit.protection", string),
    pets_dialogs_addedit_attackname: json |> field("pets.dialogs.addedit.attackname", string),
    pets_dialogs_addedit_attack: json |> field("pets.dialogs.addedit.attack", string),
    pets_dialogs_addedit_parry: json |> field("pets.dialogs.addedit.parry", string),
    pets_dialogs_addedit_damagepoints: json |> field("pets.dialogs.addedit.damagepoints", string),
    pets_dialogs_addedit_reach: json |> field("pets.dialogs.addedit.reach", string),
    pets_dialogs_addedit_actions: json |> field("pets.dialogs.addedit.actions", string),
    pets_dialogs_addedit_skills: json |> field("pets.dialogs.addedit.skills", string),
    pets_dialogs_addedit_specialabilities: json |> field("pets.dialogs.addedit.specialabilities", string),
    pets_dialogs_addedit_notes: json |> field("pets.dialogs.addedit.notes", string),
    pets_dialogs_addedit_addbtn: json |> field("pets.dialogs.addedit.addbtn", string),
    pets_dialogs_addedit_savebtn: json |> field("pets.dialogs.addedit.savebtn", string),
  };

  let fromJson = yaml => yaml.uiL10n |> list(l10n);
};

module ZibiljaRitualsL10n = {
  type t = {
    id: int,
    name: string,
    effect: string,
    ritualTime: string,
    ritualTimeShort: string,
    aeCost: string,
    aeCostShort: string,
    range: string,
    rangeShort: string,
    duration: string,
    durationShort: string,
    target: string,
    src: list(Static.SourceRef.t),
    errata: list(Static.Erratum.t),
  };

  let%private l10n = json => {
    id: json |> field("id", int),
    name: json |> field("name", string),
    effect: json |> field("effect", string),
    ritualTime: json |> field("ritualTime", string),
    ritualTimeShort: json |> field("ritualTimeShort", string),
    aeCost: json |> field("aeCost", string),
    aeCostShort: json |> field("aeCostShort", string),
    range: json |> field("range", string),
    rangeShort: json |> field("rangeShort", string),
    duration: json |> field("duration", string),
    durationShort: json |> field("durationShort", string),
    target: json |> field("target", string),
    src: json |> field("src", SourceRefs.fromJson),
    errata: json |> field("errata", Errata.fromJson),
  };

  let fromJson = yaml => yaml.zibiljaRitualsL10n |> list(l10n);
};

module ZibiljaRitualsUniv = {
  type t = {
    id: int,
    check: (int, int, int),
    checkMod: Maybe.t(SpellsUniv.checkMod),
    ic: IC.t,
    property: int,
    castingTimeNoMod: bool,
    aeCostNoMod: bool,
    rangeNoMod: bool,
    durationNoMod: bool,
  };

  let%private univ = json => {
    id: json |> field("id", int),
    check: (
      json |> field("check1", int),
      json |> field("check2", int),
      json |> field("check3", int),
    ),
    checkMod: json |> field("checkMod", maybe(SpellsUniv.checkMod)),
    ic: json |> field("ic", ICUniv.fromJson),
    property: json |> field("property", int),
    castingTimeNoMod: json |> field("castingTimeNoMod", bool),
    aeCostNoMod: json |> field("aeCostNoMod", bool),
    rangeNoMod: json |> field("rangeNoMod", bool),
    durationNoMod: json |> field("durationNoMod", bool),
  };

  let fromJson = yaml => yaml.zibiljaRitualsUniv |> list(univ);
};
