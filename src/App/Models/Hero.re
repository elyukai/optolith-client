open GenericHelpers;

[@genType "Phase"]
type phase =
  | Outline
  | Definition
  | Advancement;

[@genType "Sex"]
type sex =
  | Male
  | Female;

[@genType "BaseOrWithVariant"]
type baseOrWithVariant =
  | Base(int)
  | WithVariant(int, int);

module Rules = {
  [@genType "ActiveRule"]
  type activeRule = {
    id: int,
    options: list(int),
  };

  [@genType "Rules"]
  type t = {
    areAllPublicationsActive: bool,
    activePublications: list(string),
    activeFocusRules: list(activeRule),
    activeOptionalRules: list(activeRule),
  };
};

[@genType "PersonalData"]
type personalData = {
  family: option(string),
  placeOfBirth: option(string),
  dateOfBirth: option(string),
  age: option(string),
  hairColor: option(int),
  eyeColor: option(int),
  size: option(string),
  weight: option(string),
  title: option(string),
  socialStatus: option(int),
  characteristics: option(string),
  otherInfo: option(string),
  cultureAreaKnowledge: option(string),
};

module Activatable = {
  type option = [
    | `Generic(int)
    | `Skill(int)
    | `CombatTechnique(int)
    | `Spell(int)
    | `Cantrip(int)
    | `LiturgicalChant(int)
    | `Blessing(int)
    | `CustomInput(string)
  ];

  [@genType "ActivatableSingle"]
  type single = {
    options: list(option),
    level: Ley.Option.t(int),
    customCost: Ley.Option.t(int),
  };

  [@genType "ActivatableDependency"]
  type dependency = {
    source: Ids.activatableId,
    target: oneOrMany(Ids.activatableId),
    active: bool,
    options: list(oneOrMany(Ids.selectOptionId)),
    level: Ley.Option.t(int),
  };

  [@genType "Activatable"]
  type t = {
    id: int,
    active: list(single),
    dependencies: list(dependency),
  };
};

module Attribute = {
  [@genType "AttributeDependency"]
  type dependency = {
    source: Ids.activatableId,
    target: oneOrMany(int),
    value: option(int),
  };

  [@genType "Attribute"]
  type t = {
    id: int,
    value: int,
    dependencies: list(dependency),
  };
};

module Energies = {
  [@genType "PermanentEnergyLoss"]
  type permanentEnergyLoss = {lost: int};

  [@genType "PermanentEnergyLossAndBoughtBack"]
  type permanentEnergyLossAndBoughtBack = {
    lost: int,
    boughtBack: int,
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
  type value =
    | Inactive
    | Active(int);

  [@genType "ActivatableSkillDependency"]
  type dependency = {
    source: Ids.activatableAndSkillId,
    target: oneOrMany(int),
    value,
  };

  [@genType "ActivatableSkill"]
  type t = {
    id: int,
    value,
    dependencies: list(dependency),
  };
};

module Skill = {
  [@genType "SkillDependency"]
  type dependency = {
    source: Ids.activatableId,
    target: oneOrMany(int),
    value: int,
  };

  [@genType "Skill"]
  type t = {
    id: int,
    value: int,
    dependencies: list(dependency),
  };
};

module Item = {
  [@genType "MundaneItem"]
  type mundaneItem = {structurePoints: option(oneOrMany(int))};

  [@genType "PrimaryAttributeDamageThreshold"]
  type primaryAttributeDamageThreshold =
    | SameAttribute(int)
    | AgilityStrength(int, int)
    | DifferentAttribute(int, int);

  [@genType "Damage"]
  type damage = {
    amount: int,
    sides: int,
    flat: option(int),
  };

  [@genType "MeleeWeapon"]
  type meleeWeapon = {
    combatTechnique: int,
    damage,
    primaryAttributeDamageThreshold: option(primaryAttributeDamageThreshold),
    at: option(int),
    pa: option(int),
    reach: option(int),
    length: option(int),
    structurePoints: option(oneOrMany(int)),
    breakingPointRatingMod: option(int),
    isParryingWeapon: bool,
    isTwoHandedWeapon: bool,
    isImprovisedWeapon: bool,
    damaged: option(int),
  };

  [@genType "RangedWeapon"]
  type rangedWeapon = {
    combatTechnique: int,
    damage: option(damage),
    length: option(int),
    range: (int, int, int),
    reloadTime: oneOrMany(int),
    ammunition: option(int),
    isImprovisedWeapon: bool,
    damaged: option(int),
  };

  [@genType "Armor"]
  type armor = {
    protection: int,
    encumbrance: int,
    hasAdditionalPenalties: bool,
    iniMod: option(int),
    movMod: option(int),
    sturdinessMod: option(int),
    armorType: int,
    wear: option(int),
    isHitZoneArmorOnly: option(bool),
  };

  [@genType "Special"]
  type special =
    | MundaneItem(mundaneItem)
    | MeleeWeapon(meleeWeapon)
    | RangedWeapon(rangedWeapon)
    | CombinedWeapon(meleeWeapon, rangedWeapon)
    | Armor(armor);

  [@genType "Item"]
  type t = {
    id: int,
    amount: option(int),
    price: option(int),
    weight: option(int),
    template: option(int),
    isTemplateLocked: bool,
    carriedWhere: option(string),
    special: option(special),
    gr: int,
  };
};

[@genType "HitZoneArmor"]
type hitZoneArmor = {
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
  head: option(Ids.hitZoneArmorZoneItemId),
  /**
   * The level of wear at zone *head*, if any. Ignores `wear` if custom armor is
   * used, even if `headWear` is not defined.
   */
  headWear: option(int),
  /**
   * ID of the armor at zone *left arm*. Can be either a template ID or the ID
   * of an armor from `items`.
   */
  leftArm: option(Ids.hitZoneArmorZoneItemId),
  /**
   * The level of wear at zone *left arm*, if any. Ignores `wear` if custom
   * armor is used, even if `leftArmWear` is not defined.
   */
  leftArmWear: option(int),
  /**
   * ID of the armor at zone *right arm*. Can be either a template ID or the ID
   * of an item from `items`.
   */
  rightArm: option(Ids.hitZoneArmorZoneItemId),
  /**
   * The level of wear at zone *right arm*, if any. Ignores `wear` if custom
   * armor is used, even if `rightArmWear` is not defined.
   */
  rightArmWear: option(int),
  /**
   * ID of the armor at zone *torso*. Can be either a template ID or the ID of
   * an armor from `items`.
   */
  torso: option(Ids.hitZoneArmorZoneItemId),
  /**
   * The level of wear at zone *torso*, if any. Ignores `wear` if custom armor
   * is used, even if `torsoWear` is not defined.
   */
  torsoWear: option(int),
  /**
   * ID of the armor at zone *left leg*. Can be either a template ID or the ID
   * of an armor from `items`.
   */
  leftLeg: option(Ids.hitZoneArmorZoneItemId),
  /**
   * The level of wear at zone *left leg*, if any. Ignores `wear` if custom
   * armor is used, even if `leftLegWear` is not defined.
   */
  leftLegWear: option(int),
  /**
   * ID of the armor at zone *right leg*. Can be either a template ID or the ID
   * of an armor from `items`.
   */
  rightLeg: option(Ids.hitZoneArmorZoneItemId),
  /**
   * The level of wear at zone *right leg*, if any. Ignores `wear` if custom
   * armor is used, even if `rightLegWear` is not defined.
   */
  rightLegWear: option(int),
};

[@genType "Purse"]
type purse = {
  ducats: int,
  silverthalers: int,
  halers: int,
  kreutzers: int,
};

[@genType "Pet"]
type pet = {
  id: int,
  name: string,
  avatar: option(string),
  size: option(string),
  [@bs.as "type"]
  type_: option(string),
  attack: option(string),
  dp: option(string),
  reach: option(string),
  actions: option(string),
  skills: option(string),
  abilities: option(string),
  notes: option(string),
  spentAp: option(string),
  totalAp: option(string),
  cou: option(string),
  sgc: option(string),
  int: option(string),
  cha: option(string),
  dex: option(string),
  agi: option(string),
  con: option(string),
  str: option(string),
  lp: option(string),
  ae: option(string),
  spi: option(string),
  tou: option(string),
  pro: option(string),
  ini: option(string),
  mov: option(string),
  at: option(string),
  pa: option(string),
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
    type_: int,
    domain,
    name: string,
  };
};

[@genType "StyleDependency"]
type styleDependency = {
  /**
   * The extended special ability or list of available special abilities.
   */
  id: oneOrMany(int),
  /**
   * If a ability meets a given id, then `Just id`, otherwise `Nothing`.
   */
  active: option(int),
  /**
   * The style's id.
   */
  origin: int,
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

[@genType "Hero"]
type t = {
  name: string,
  dateCreated: Js.Date.t,
  dateModified: Js.Date.t,
  adventurePointsTotal: int,
  experienceLevel: int,
  sex,
  phase,
  locale: string,
  avatar: option(string),
  race: option(int),
  raceVariant: option(baseOrWithVariant),
  culture: option(int),
  isCulturalPackageActive: bool,
  profession: option(baseOrWithVariant),
  professionName: option(string),
  rules: Rules.t,
  personalData,
  advantages: Ley.IntMap.t(Activatable.t),
  disadvantages: Ley.IntMap.t(Activatable.t),
  specialAbilities: Ley.IntMap.t(Activatable.t),
  attributes: Ley.IntMap.t(Attribute.t),
  attributeAdjustmentSelected: int,
  energies: Energies.t,
  skills: Ley.IntMap.t(Skill.t),
  combatTechniques: Ley.IntMap.t(Skill.t),
  spells: Ley.IntMap.t(ActivatableSkill.t),
  liturgicalChants: Ley.IntMap.t(ActivatableSkill.t),
  cantrips: Ley.IntSet.t,
  blessings: Ley.IntSet.t,
  items: list(Item.t),
  hitZoneArmors: list(hitZoneArmor),
  purse,
  pets: list(pet),
  pact: option(Pact.t),
  combatStyleDependencies: list(styleDependency),
  magicalStyleDependencies: list(styleDependency),
  blessedStyleDependencies: list(styleDependency),
  skillStyleDependencies: list(styleDependency),
  socialStatusDependencies: list(int),
  transferredUnfamiliarSpells: list(TransferUnfamiliar.t),
};
