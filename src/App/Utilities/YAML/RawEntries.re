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

module CheckModifier = {
  module Spells = {
    type t =
      | SPI
      | DOUBLE_SPI
      | TOU
      | MAX_SPI_TOU;

    let fromJson =
      oneOf([
        map(_ => SPI, const("SPI")),
        map(_ => DOUBLE_SPI, const("SPI/2")),
        map(_ => TOU, const("TOU")),
        map(_ => MAX_SPI_TOU, const("SPI/TOU")),
      ]);
  };
}

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

  let fromJson = yaml => yaml.animistForcesL10n |> list(l10n);
};

module AnimistForcesUniv = {
  // TODO

  type t = {
    id: int,
    check: (int, int, int),
    checkMod: Maybe.t(CheckModifier.Spells.t),
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

  let%private univ = json => {
    id: json |> field("id", int),
    check: (
      json |> field("check1", int),
      json |> field("check2", int),
      json |> field("check3", int),
    ),
    checkMod: json |> field("checkMod", maybe(CheckModifier.Spells.fromJson)),
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

  let fromJson = yaml => yaml.cursesL10n |> list(l10n);
};

module CursesUniv = {
  // TODO

  type t = {
    id: int,
    check: (int, int, int),
    checkMod: Maybe.t(CheckModifier.Spells.t),
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

  let%private univ = json => {
    id: json |> field("id", int),
    check: (
      json |> field("check1", int),
      json |> field("check2", int),
      json |> field("check3", int),
    ),
    checkMod: json |> field("checkMod", maybe(CheckModifier.Spells.fromJson)),
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

  let fromJson = yaml => yaml.dominationRitualsL10n |> list(l10n);
};

module DominationRitualsUniv = {
  // TODO

  type t = {
    id: int,
    check: (int, int, int),
    checkMod: Maybe.t(CheckModifier.Spells.t),
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

  let%private univ = json => {
    id: json |> field("id", int),
    check: (
      json |> field("check1", int),
      json |> field("check2", int),
      json |> field("check3", int),
    ),
    checkMod: json |> field("checkMod", maybe(CheckModifier.Spells.fromJson)),
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

  let fromJson = yaml => yaml.dominationRitualsUniv |> list(univ);
};

module ElvenMagicalSongsL10n = {
  // TODO

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

  let fromJson = yaml => yaml.elvenMagicalSongsL10n |> list(l10n);
};

module ElvenMagicalSongsUniv = {
  // TODO

  type t = {
    id: int,
    check: (int, int, int),
    checkMod: Maybe.t(CheckModifier.Spells.t),
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

  let%private univ = json => {
    id: json |> field("id", int),
    check: (
      json |> field("check1", int),
      json |> field("check2", int),
      json |> field("check3", int),
    ),
    checkMod: json |> field("checkMod", maybe(CheckModifier.Spells.fromJson)),
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

  let fromJson = yaml => yaml.geodeRitualsL10n |> list(l10n);
};

module GeodeRitualsUniv = {
  // TODO

  type t = {
    id: int,
    check: (int, int, int),
    checkMod: Maybe.t(CheckModifier.Spells.t),
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

  let%private univ = json => {
    id: json |> field("id", int),
    check: (
      json |> field("check1", int),
      json |> field("check2", int),
      json |> field("check3", int),
    ),
    checkMod: json |> field("checkMod", maybe(CheckModifier.Spells.fromJson)),
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
  type level = {
    id: int,
    name: string,
    effect: string,
  };

  let%private level = json => {
    id: json |> field("id", int),
    name: json |> field("name", string),
    effect: json |> field("effect", string),
  };

  type t = {
    target: int,
    level1: level,
    level2: level,
    level3: level,
    src: list(Static.SourceRef.t),
    errata: list(Static.Erratum.t),
  };

  let%private l10n = json => {
    target: json |> field("target", int),
    level1: json |> field("level1", level),
    level2: json |> field("level2", level),
    level3: json |> field("level3", level),
    src: json |> field("src", SourceRefs.fromJson),
    errata: json |> field("errata", Errata.fromJson),
  };

  let fromJson = yaml => yaml.liturgicalChantEnhancementsL10n |> list(l10n);
};

module LiturgicalChantEnhancementsUniv = {
  type level1 = {
    id: int,
    cost: int,
  };

  let%private level1 = json => {
    id: json |> field("id", int),
    cost: json |> field("cost", int),
  };

  type level2 = {
    id: int,
    cost: int,
    previousRequirement: bool,
  };

  let%private level2 = json => {
    id: json |> field("id", int),
    cost: json |> field("cost", int),
    previousRequirement: json |> field("previousRequirement", maybe(const(1))) |> Maybe.isJust,
  };

  type level3Prerequisite = First | Second;

  type level3 = {
    id: int,
    cost: int,
    previousRequirement: Maybe.t(level3Prerequisite),
  };

  let%private level3 = json => {
    id: json |> field("id", int),
    cost: json |> field("cost", int),
    previousRequirement: json |> field("previousRequirement", maybe(oneOf([
      map(_ => First, const(1)),
      map(_ => Second, const(2)),
    ]))),
  };

  type t = {
    target: int,
    level1,
    level2,
    level3,
  };

  let%private univ = json => {
    target: json |> field("target", int),
    level1: json |> field("level1", level1),
    level2: json |> field("level2", level2),
    level3: json |> field("level3", level3),
  };

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

  let fromJson = yaml => yaml.magicalDancesL10n |> list(l10n);
};

module MagicalDancesUniv = {
  // TODO

  type t = {
    id: int,
    check: (int, int, int),
    checkMod: Maybe.t(CheckModifier.Spells.t),
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

  let%private univ = json => {
    id: json |> field("id", int),
    check: (
      json |> field("check1", int),
      json |> field("check2", int),
      json |> field("check3", int),
    ),
    checkMod: json |> field("checkMod", maybe(CheckModifier.Spells.fromJson)),
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

  let fromJson = yaml => yaml.magicalDancesUniv |> list(univ);
};

module MagicalMelodiesL10n = {
  // TODO

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

  let fromJson = yaml => yaml.magicalMelodiesL10n |> list(l10n);
};

module MagicalMelodiesUniv = {
  // TODO

  type t = {
    id: int,
    check: (int, int, int),
    checkMod: Maybe.t(CheckModifier.Spells.t),
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

  let%private univ = json => {
    id: json |> field("id", int),
    check: (
      json |> field("check1", int),
      json |> field("check2", int),
      json |> field("check3", int),
    ),
    checkMod: json |> field("checkMod", maybe(CheckModifier.Spells.fromJson)),
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

  let fromJson = yaml => yaml.rogueSpellsL10n |> list(l10n);
};

module RogueSpellsUniv = {
  type t = {
    id: int,
    check: (int, int, int),
    checkMod: Maybe.t(CheckModifier.Spells.t),
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

  let%private univ = json => {
    id: json |> field("id", int),
    check: (
      json |> field("check1", int),
      json |> field("check2", int),
      json |> field("check3", int),
    ),
    checkMod: json |> field("checkMod", maybe(CheckModifier.Spells.fromJson)),
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
  type level = {
    id: int,
    name: string,
    effect: string,
  };

  let%private level = json => {
    id: json |> field("id", int),
    name: json |> field("name", string),
    effect: json |> field("effect", string),
  };

  type t = {
    target: int,
    level1: level,
    level2: level,
    level3: level,
    src: list(Static.SourceRef.t),
    errata: list(Static.Erratum.t),
  };

  let%private l10n = json => {
    target: json |> field("target", int),
    level1: json |> field("level1", level),
    level2: json |> field("level2", level),
    level3: json |> field("level3", level),
    src: json |> field("src", SourceRefs.fromJson),
    errata: json |> field("errata", Errata.fromJson),
  };

  let fromJson = yaml => yaml.spellEnhancementsL10n |> list(l10n);
};

module SpellEnhancementsUniv = {
  type level1 = {
    id: int,
    cost: int,
  };

  let%private level1 = json => {
    id: json |> field("id", int),
    cost: json |> field("cost", int),
  };

  type level2 = {
    id: int,
    cost: int,
    previousRequirement: bool,
  };

  let%private level2 = json => {
    id: json |> field("id", int),
    cost: json |> field("cost", int),
    previousRequirement: json |> field("previousRequirement", maybe(const(1))) |> Maybe.isJust,
  };

  type level3Prerequisite = First | Second;

  type level3 = {
    id: int,
    cost: int,
    previousRequirement: Maybe.t(level3Prerequisite),
  };

  let%private level3 = json => {
    id: json |> field("id", int),
    cost: json |> field("cost", int),
    previousRequirement: json |> field("previousRequirement", maybe(oneOf([
      map(_ => First, const(1)),
      map(_ => Second, const(2)),
    ]))),
  };

  type t = {
    target: int,
    level1,
    level2,
    level3,
  };

  let%private univ = json => {
    target: json |> field("target", int),
    level1: json |> field("level1", level1),
    level2: json |> field("level2", level2),
    level3: json |> field("level3", level3),
  };

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
  type t = {
    id: int,
    check: (int, int, int),
    checkMod: Maybe.t(CheckModifier.Spells.t),
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

  let%private univ = json => {
    id: json |> field("id", int),
    check: (
      json |> field("check1", int),
      json |> field("check2", int),
      json |> field("check3", int),
    ),
    checkMod: json |> field("checkMod", maybe(CheckModifier.Spells.fromJson)),
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
  include RawUIMessages;

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
    checkMod: Maybe.t(CheckModifier.Spells.t),
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
    checkMod: json |> field("checkMod", maybe(CheckModifier.Spells.fromJson)),
    ic: json |> field("ic", ICUniv.fromJson),
    property: json |> field("property", int),
    castingTimeNoMod: json |> field("castingTimeNoMod", bool),
    aeCostNoMod: json |> field("aeCostNoMod", bool),
    rangeNoMod: json |> field("rangeNoMod", bool),
    durationNoMod: json |> field("durationNoMod", bool),
  };

  let fromJson = yaml => yaml.zibiljaRitualsUniv |> list(univ);
};
