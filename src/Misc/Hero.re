type sex =
  | Male
  | Female;

type baseOrWithVariant =
  | Base(int)
  | WithVariant(int, int);

module Rules = {
  type activeRule = {
    id: int,
    options: list(int),
  };

  type t = {
    areAllPublicationsActive: bool,
    activePublications: Ley_StrSet.t,
    activeFocusRules: Ley_IntMap.t(activeRule),
    activeOptionalRules: Ley_IntMap.t(activeRule),
  };
};

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
  type optionId = [
    | `Generic(int)
    | `Skill(int)
    | `CombatTechnique(int)
    | `Spell(int)
    | `Cantrip(int)
    | `LiturgicalChant(int)
    | `Blessing(int)
    | `SpecialAbility(int)
    | `CustomInput(string)
  ];

  type single = {
    options: list(optionId),
    level: option(int),
    customCost: option(int),
  };

  type dependency = {
    source: Id.activatable,
    target: OneOrMany.t(int),
    active: bool,
    options: list(OneOrMany.t(Id.selectOption)),
    level: option(int),
  };

  type t = {
    id: int,
    active: list(single),
    dependencies: list(dependency),
  };

  let empty = id => {id, active: [], dependencies: []};

  let isUnused = x =>
    Ley_List.Foldable.null(x.active)
    && Ley_List.Foldable.null(x.dependencies);
};

module Skill = {
  type dependency = {
    source: Id.activatableAndSkill,
    target: OneOrMany.t(int),
    value: int,
  };

  type t = {
    id: int,
    value: int,
    dependencies: list(dependency),
  };

  let emptySkill = id => {id, value: 0, dependencies: []};

  let emptyCombatTechnique = id => {id, value: 6, dependencies: []};

  let isUnusedSkill = x =>
    x.value <= 0 && Ley_List.Foldable.null(x.dependencies);

  let isUnusedCombatTechnique = x =>
    x.value <= 6 && Ley_List.Foldable.null(x.dependencies);
};

module Attribute = {
  type t = {
    id: int,
    value: int,
    dependencies: list(Skill.dependency),
  };

  let empty = id => {id, value: 8, dependencies: []};

  let isUnused = x => x.value <= 8 && Ley_List.Foldable.null(x.dependencies);
};

module Energies = {
  type permanentEnergyLoss = {lost: int};

  type permanentEnergyLossAndBoughtBack = {
    lost: int,
    boughtBack: int,
  };

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

  type t = {
    id: int,
    value,
    dependencies: list(Skill.dependency),
  };

  let empty = id => {id, value: Inactive, dependencies: []};

  let isUnused = x =>
    x.value === Inactive && Ley_List.Foldable.null(x.dependencies);
};

module Item = {
  type mundaneItem = {structurePoints: option(OneOrMany.t(int))};

  type newAttribute = {
    attribute: int,
    threshold: int,
  };

  type agilityStrength = {
    agility: int,
    strength: int,
  };

  type primaryAttributeDamageThreshold =
    | DefaultAttribute(int)
    | DifferentAttribute(newAttribute)
    | AgilityStrength(agilityStrength);

  type damage = {
    amount: int,
    sides: int,
    flat: option(int),
  };

  type meleeWeapon = {
    combatTechnique: int,
    damage,
    primaryAttributeDamageThreshold: option(primaryAttributeDamageThreshold),
    at: option(int),
    pa: option(int),
    reach: option(int),
    length: option(int),
    structurePoints: option(OneOrMany.t(int)),
    breakingPointRatingMod: option(int),
    isParryingWeapon: bool,
    isTwoHandedWeapon: bool,
    isImprovisedWeapon: bool,
    damaged: option(int),
  };

  type rangedWeapon = {
    combatTechnique: int,
    damage: option(damage),
    length: option(int),
    range: (int, int, int),
    reloadTime: OneOrMany.t(int),
    ammunition: option(int),
    isImprovisedWeapon: bool,
    damaged: option(int),
  };

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

  type special =
    | MundaneItem(mundaneItem)
    | MeleeWeapon(meleeWeapon)
    | RangedWeapon(rangedWeapon)
    | CombinedWeapon(meleeWeapon, rangedWeapon)
    | Armor(armor);

  type t = {
    id: int,
    name: string,
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
  head: option(Id.hitZoneArmorZoneItem),
  /**
   * The level of wear at zone *head*, if any. Ignores `wear` if custom armor is
   * used, even if `headWear` is not defined.
   */
  headWear: option(int),
  /**
   * ID of the armor at zone *left arm*. Can be either a template ID or the ID
   * of an armor from `items`.
   */
  leftArm: option(Id.hitZoneArmorZoneItem),
  /**
   * The level of wear at zone *left arm*, if any. Ignores `wear` if custom
   * armor is used, even if `leftArmWear` is not defined.
   */
  leftArmWear: option(int),
  /**
   * ID of the armor at zone *right arm*. Can be either a template ID or the ID
   * of an item from `items`.
   */
  rightArm: option(Id.hitZoneArmorZoneItem),
  /**
   * The level of wear at zone *right arm*, if any. Ignores `wear` if custom
   * armor is used, even if `rightArmWear` is not defined.
   */
  rightArmWear: option(int),
  /**
   * ID of the armor at zone *torso*. Can be either a template ID or the ID of
   * an armor from `items`.
   */
  torso: option(Id.hitZoneArmorZoneItem),
  /**
   * The level of wear at zone *torso*, if any. Ignores `wear` if custom armor
   * is used, even if `torsoWear` is not defined.
   */
  torsoWear: option(int),
  /**
   * ID of the armor at zone *left leg*. Can be either a template ID or the ID
   * of an armor from `items`.
   */
  leftLeg: option(Id.hitZoneArmorZoneItem),
  /**
   * The level of wear at zone *left leg*, if any. Ignores `wear` if custom
   * armor is used, even if `leftLegWear` is not defined.
   */
  leftLegWear: option(int),
  /**
   * ID of the armor at zone *right leg*. Can be either a template ID or the ID
   * of an armor from `items`.
   */
  rightLeg: option(Id.hitZoneArmorZoneItem),
  /**
   * The level of wear at zone *right leg*, if any. Ignores `wear` if custom
   * armor is used, even if `rightLegWear` is not defined.
   */
  rightLegWear: option(int),
};

type purse = {
  ducats: int,
  silverthalers: int,
  halers: int,
  kreutzers: int,
};

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
  type domain =
    | Predefined(int)
    | Custom(string);

  type t = {
    category: int,
    level: int,
    [@bs.as "type"]
    type_: int,
    domain,
    name: string,
  };
};

type styleDependency = {
  /**
   * The extended special ability or list of available special abilities.
   */
  id: OneOrMany.t(int),
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
  type id =
    | Spell(int)
    | Spells
    | LiturgicalChant(int)
    | LiturgicalChants;

  type t = {
    id,
    srcId: int,
  };
};

type t = {
  id: int,
  name: string,
  dateCreated: Js.Date.t,
  dateModified: Js.Date.t,
  adventurePointsTotal: int,
  experienceLevel: int,
  sex,
  phase: Id.phase,
  locale: string,
  avatar: option(string),
  race: option(baseOrWithVariant),
  culture: option(int),
  isCulturalPackageActive: bool,
  profession: option(baseOrWithVariant),
  professionName: option(string),
  rules: Rules.t,
  personalData,
  advantages: Ley_IntMap.t(Activatable.t),
  disadvantages: Ley_IntMap.t(Activatable.t),
  specialAbilities: Ley_IntMap.t(Activatable.t),
  attributes: Ley_IntMap.t(Attribute.t),
  attributeAdjustmentSelected: int,
  energies: Energies.t,
  skills: Ley_IntMap.t(Skill.t),
  combatTechniques: Ley_IntMap.t(Skill.t),
  spells: Ley_IntMap.t(ActivatableSkill.t),
  liturgicalChants: Ley_IntMap.t(ActivatableSkill.t),
  cantrips: Ley_IntSet.t,
  blessings: Ley_IntSet.t,
  items: Ley_IntMap.t(Item.t),
  hitZoneArmors: Ley_IntMap.t(hitZoneArmor),
  purse,
  pets: Ley_IntMap.t(pet),
  pact: option(Pact.t),
  combatStyleDependencies: list(styleDependency),
  magicalStyleDependencies: list(styleDependency),
  blessedStyleDependencies: list(styleDependency),
  skillStyleDependencies: list(styleDependency),
  socialStatusDependencies: list(int),
  transferredUnfamiliarSpells: list(TransferUnfamiliar.t),
};
