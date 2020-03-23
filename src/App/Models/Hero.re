open Maybe;
open GenericHelpers;

module Phase = {
  [@genType "Phase"]
  type t =
    | Outline
    | Definition
    | Advancement;
};

module RaceCultureProfession = {
  [@genType "BaseOrWithVariant"]
  type baseOrWithVariant =
    | Base(int)
    | WithVariant(int, int);
};

module Rules = {
  [@genType "HigherParadeValuesConfig"]
  type higherParadeValuesConfig =
    | Two
    | Four;

  [@genType "OptionalRulesConfig"]
  type optionalRulesConfig = {
    higherParadeValues: maybe(higherParadeValuesConfig),
  };

  [@genType "Rules"]
  type t = {
    areAllPublicationsActive: bool,
    activePublications: list(string),
    activeFocusRules: list(int),
    activeOptionalRules: list(int),
    optionalRules: optionalRulesConfig,
  };
};

module PersonalData = {
  [@genType "PersonalData"]
  type t = {
    family: maybe(string),
    placeOfBirth: maybe(string),
    dateOfBirth: maybe(string),
    age: maybe(string),
    hairColor: maybe(int),
    eyeColor: maybe(int),
    size: maybe(string),
    weight: maybe(string),
    title: maybe(string),
    socialStatus: maybe(int),
    characteristics: maybe(string),
    otherInfo: maybe(string),
    cultureAreaKnowledge: maybe(string),
  };
};

module Activatable = {
  module Single = {
    [@genType "ActivatableSingle"]
    type t = {
      options: list(Ids.selectOptionId),
      level: maybe(int),
    };

    [@genType "ActivatableSingleCustomCost"]
    module CustomCost = {
      type t = {
        options: list(Ids.selectOptionId),
        level: maybe(int),
        customCost: maybe(int),
      };
    };
  };

  module Dependency = {
    [@genType "ActivatableDependency"]
    type t = {
      source: Ids.activatableId,
      target: oneOrMany(Ids.activatableId),
      active: bool,
      options: list(oneOrMany(Ids.selectOptionId)),
      level: maybe(int),
    };
  };
};

module DisAdvantage = {
  open Activatable;

  [@genType "DisAdvantage"]
  type t = {
    id: int,
    active: list(Single.CustomCost.t),
    dependencies: list(Dependency.t),
  };
};

module SpecialAbility = {
  open Activatable;

  [@genType "SpecialAbility"]
  type t = {
    id: int,
    active: list(Single.t),
    dependencies: list(Dependency.t),
  };
};

module Attribute = {
  module Dependency = {
    [@genType "AttributeDependency"]
    type t = {
      source: Ids.activatableId,
      target: oneOrMany(int),
      value: maybe(int),
    };
  };

  [@genType "Attribute"]
  type t = {
    id: int,
    value: int,
    dependencies: list(Dependency.t),
  };
};

module Energies = {
  [@genType "PermanentEnergyLoss"]
  type permanentEnergyLoss = {
    lost: int,
    redeemed: int,
  };

  [@genType "PermanentEnergyLossAndBoughtBack"]
  type permanentEnergyLossAndBoughtBack = {
    lost: int,
    redeemed: int,
  };

  [@genType "Energies"]
  type t = {
    addedLifePoints: int,
    addedArcaneEnergyPoints: int,
    addedKarmaPoints: int,
    permanentLifePoints: permanentEnergyLoss,
    permanentArcaneEnergyPoints: permanentEnergyLossAndBoughtBack,
    permanentKarmaPoints: permanentEnergyLossAndBoughtBack,
  };
};

module ActivatableSkill = {
  [@genType "ActivatableSkillDependency"]
  module Dependency = {
    type t = {
      source: Ids.activatableAndSkillId,
      target: oneOrMany(Ids.activatableSkillId),
      value: maybe(int),
    };
  };

  [@genType "ActivatableSkill"]
  type t = {
    id: int,
    value: maybe(int),
    dependencies: list(Dependency.t),
  };
};

module Skill = {
  [@genType "SkillDependency"]
  module Dependency = {
    type t = {
      source: Ids.activatableId,
      target: oneOrMany(Ids.skillId),
      value: int,
    };
  };

  [@genType "Skill"]
  type t = {
    id: int,
    value: maybe(int),
    dependencies: list(Dependency.t),
  };
};

module Item = {
  [@genType "MundaneItem"]
  type mundaneItem = {structurePoints: maybe(oneOrMany(int))};

  [@genType "PrimaryAttributeDamageThreshold"]
  type primaryAttributeDamageThreshold =
    | SameAttribute(int)
    | AgilityStrength(int, int)
    | DifferentAttribute(int, int);

  [@genType "Damage"]
  type damage = {
    amount: int,
    sides: int,
    flat: maybe(int),
  };

  [@genType "MeleeWeapon"]
  type meleeWeapon = {
    combatTechnique: int,
    damage,
    primaryAttributeDamageThreshold: maybe(primaryAttributeDamageThreshold),
    at: maybe(int),
    pa: maybe(int),
    reach: maybe(int),
    length: maybe(int),
    structurePoints: maybe(oneOrMany(int)),
    breakingPointRatingMod: maybe(int),
    isParryingWeapon: bool,
    isTwoHandedWeapon: bool,
    isImprovisedWeapon: bool,
    damaged: maybe(int),
  };

  [@genType "RangedWeapon"]
  type rangedWeapon = {
    combatTechnique: int,
    damage: maybe(damage),
    length: maybe(int),
    closeRange: int,
    mediumRange: int,
    farRange: int,
    reloadTime: oneOrMany(int),
    ammunition: maybe(int),
    isImprovisedWeapon: bool,
    damaged: maybe(int),
  };

  [@genType "CombinedWeapon"]
  type combinedWeapon = {
    melee: meleeWeapon,
    ranged: rangedWeapon,
  };

  [@genType "Armor"]
  type armor = {
    protection: int,
    encumbrance: int,
    hasAdditionalPenalties: bool,
    iniMod: maybe(int),
    movMod: maybe(int),
    sturdinessMod: maybe(int),
    armorType: int,
    wear: maybe(int),
    isHitZoneArmorOnly: maybe(bool),
  };

  [@genType "Special"]
  type special =
    | MundaneItem(mundaneItem)
    | CombinedWeapon(combinedWeapon)
    | MeleeWeapon(meleeWeapon)
    | RangedWeapon(rangedWeapon)
    | Armor(armor);

  [@genType "Item"]
  type t = {
    id: int,
    amount: maybe(int),
    price: maybe(int),
    weight: maybe(int),
    template: maybe(int),
    isTemplateLocked: bool,
    carriedWhere: maybe(string),
    special: maybe(special),
    gr: int,
  };
};

module HitZoneArmor = {
  [@genType "HitZoneArmor"]
  type t = {
    /**
     * The hit zone armor's ID.
     */
    id: int,
    /**
     * The name of the hit zone armor.
     */
    name: string,
    /**
     * ID of the armor at zone *head*. Can be either a template ID or the ID of an
     * armor from `items`.
     */
    head: maybe(Ids.hitZoneArmorZoneItemId),
    /**
     * The level of wear at zone *head*, if any. Ignores `wear` if custom armor is
     * used, even if `headWear` is not defined.
     */
    headWear: maybe(int),
    /**
     * ID of the armor at zone *left arm*. Can be either a template ID or the ID
     * of an armor from `items`.
     */
    leftArm: maybe(Ids.hitZoneArmorZoneItemId),
    /**
     * The level of wear at zone *left arm*, if any. Ignores `wear` if custom
     * armor is used, even if `leftArmWear` is not defined.
     */
    leftArmWear: maybe(int),
    /**
     * ID of the armor at zone *right arm*. Can be either a template ID or the ID
     * of an item from `items`.
     */
    rightArm: maybe(Ids.hitZoneArmorZoneItemId),
    /**
     * The level of wear at zone *right arm*, if any. Ignores `wear` if custom
     * armor is used, even if `rightArmWear` is not defined.
     */
    rightArmWear: maybe(int),
    /**
     * ID of the armor at zone *torso*. Can be either a template ID or the ID of
     * an armor from `items`.
     */
    torso: maybe(Ids.hitZoneArmorZoneItemId),
    /**
     * The level of wear at zone *torso*, if any. Ignores `wear` if custom armor
     * is used, even if `torsoWear` is not defined.
     */
    torsoWear: maybe(int),
    /**
     * ID of the armor at zone *left leg*. Can be either a template ID or the ID
     * of an armor from `items`.
     */
    leftLeg: maybe(Ids.hitZoneArmorZoneItemId),
    /**
     * The level of wear at zone *left leg*, if any. Ignores `wear` if custom
     * armor is used, even if `leftLegWear` is not defined.
     */
    leftLegWear: maybe(int),
    /**
     * ID of the armor at zone *right leg*. Can be either a template ID or the ID
     * of an armor from `items`.
     */
    rightLeg: maybe(Ids.hitZoneArmorZoneItemId),
    /**
     * The level of wear at zone *right leg*, if any. Ignores `wear` if custom
     * armor is used, even if `rightLegWear` is not defined.
     */
    rightLegWear: maybe(int),
  };
};

module Purse = {
  [@genType "Purse"]
  type t = {
    ducats: int,
    silverthalers: int,
    halers: int,
    kreutzers: int,
  };
};

module Pet = {
  [@genType "Pet"]
  type t = {
    id: int,
    name: string,
    avatar: maybe(string),
    size: maybe(string),
    [@bs.as "type"]
    _type: maybe(string),
    attack: maybe(string),
    dp: maybe(string),
    reach: maybe(string),
    actions: maybe(string),
    skills: maybe(string),
    abilities: maybe(string),
    notes: maybe(string),
    spentAp: maybe(string),
    totalAp: maybe(string),
    cou: maybe(string),
    sgc: maybe(string),
    int: maybe(string),
    cha: maybe(string),
    dex: maybe(string),
    agi: maybe(string),
    con: maybe(string),
    str: maybe(string),
    lp: maybe(string),
    ae: maybe(string),
    spi: maybe(string),
    tou: maybe(string),
    pro: maybe(string),
    ini: maybe(string),
    mov: maybe(string),
    at: maybe(string),
    pa: maybe(string),
  };
};

module Pact = {
  [@genType "PactDomain"]
  type domain =
    | Predefined(int)
    | Custom(string);

  [@genType "Pact"]
  type t = {
    category: int,
    level: int,
    [@bs.as "type"]
    _type: int,
    domain,
    name: string,
  };
};

module Styles = {
  module Dependency = {
    [@genType "StyleDependency"]
    type t = {
      /**
       * The extended special ability or list of available special abilities.
       */
      id: oneOrMany(int),
      /**
       * If a ability meets a given id, then `Just id`, otherwise `Nothing`.
       */
      active: maybe(int),
      /**
       * The style's id.
       */
      origin: int,
    };
  };
};

module TransferUnfamiliar = {
  [@genType "TransferUnfamiliarId"]
  type id =
    | Spell(int)
    | Spells
    | LiturgicalChant(int)
    | LiturgicalChants;

  [@genType "TransferUnfamiliar"]
  type t = {
    id,
    srcId: int,
  };
};

type t = {
  name: string,
  dateCreated: Js.Date.t,
  dateModified: Js.Date.t,
  adventurePointsTotal: int,
  experienceLevel: int,
  sex: Static.Prerequisites.SexPrerequisite.sex,
  phase: Phase.t,
  locale: string,
  avatar: maybe(string),
  race: maybe(int),
  raceVariant: maybe(RaceCultureProfession.baseOrWithVariant),
  culture: maybe(int),
  isCulturalPackageActive: bool,
  profession: maybe(RaceCultureProfession.baseOrWithVariant),
  professionName: maybe(string),
  rules: Rules.t,
  personalData: PersonalData.t,
  advantages: IntMap.t(DisAdvantage.t),
  disadvantages: IntMap.t(DisAdvantage.t),
  specialAbilities: IntMap.t(SpecialAbility.t),
  attributes: IntMap.t(Attribute.t),
  attributeAdjustmentSelected: int,
  energies: Energies.t,
  skills: IntMap.t(Skill.t),
  combatTechniques: IntMap.t(Skill.t),
  spells: IntMap.t(ActivatableSkill.t),
  liturgicalChants: IntMap.t(ActivatableSkill.t),
  cantrips: IntSet.t,
  blessings: IntSet.t,
  items: list(Item.t),
  hitZoneArmors: list(HitZoneArmor.t),
  purse: Purse.t,
  pets: list(Pet.t),
  pact: maybe(Pact.t),
  combatStyleDependencies: list(Styles.Dependency.t),
  magicalStyleDependencies: list(Styles.Dependency.t),
  blessedStyleDependencies: list(Styles.Dependency.t),
  skillStyleDependencies: list(Styles.Dependency.t),
  socialStatusDependencies: list(int),
  transferredUnfamiliarSpells: list(TransferUnfamiliar.t),
};
