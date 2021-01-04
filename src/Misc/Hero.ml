type baseOrWithVariant = Base of int | WithVariant of int * int

module Rules = struct
  type activeRule = { id : int; options : int list }

  type t = {
    areAllPublicationsActive : bool;
    activePublications : Ley_IntSet.t;
    activeFocusRules : activeRule Ley_IntMap.t;
    activeOptionalRules : activeRule Ley_IntMap.t;
  }
end

type personalData = {
  family : string option;
  placeOfBirth : string option;
  dateOfBirth : string option;
  age : string option;
  hairColor : int option;
  eyeColor : int option;
  size : string option;
  weight : string option;
  title : string option;
  socialStatus : int option;
  characteristics : string option;
  otherInfo : string option;
  cultureAreaKnowledge : string option;
}

module Energies = struct
  type permanentEnergyLoss = { lost : int }

  type permanentEnergyLossAndBoughtBack = { lost : int; boughtBack : int }

  type t = {
    addedLifePoints : int;
    addedArcaneEnergyPoints : int;
    addedKarmaPoints : int;
    permanentLifePoints : permanentEnergyLoss;
    permanentArcaneEnergyPoints : permanentEnergyLossAndBoughtBack;
    permanentKarmaPoints : permanentEnergyLossAndBoughtBack;
  }
end

module MagicalActions = struct
  type t = {
    curses : Curse.Dynamic.t Ley_IntMap.t;
    elvenMagicalSongs : ElvenMagicalSong.Dynamic.t Ley_IntMap.t;
    dominationRituals : DominationRitual.Dynamic.t Ley_IntMap.t;
    magicalDances : MagicalDance.Dynamic.t Ley_IntMap.t;
    magicalMelodies : MagicalMelody.Dynamic.t Ley_IntMap.t;
    schelmenzauber : Schelmenzauber.Dynamic.t Ley_IntMap.t;
    animistenkraefte : Animistenkraft.Dynamic.t Ley_IntMap.t;
    geodenrituale : Geodenritual.Dynamic.t Ley_IntMap.t;
    zibiljarituale : Zibiljaritual.Dynamic.t Ley_IntMap.t;
  }
end

module Item = struct
  type mundaneItem = { structurePoints : int OneOrMany.t option }

  type newAttribute = { attribute : int; threshold : int }

  type agilityStrength = { agility : int; strength : int }

  type primaryAttributeDamageThreshold =
    | DefaultAttribute of int
    | DifferentAttribute of newAttribute
    | AgilityStrength of agilityStrength

  type damage = { amount : int; sides : int; flat : int option }

  type meleeWeapon = {
    combatTechnique : int;
    damage : damage;
    primaryAttributeDamageThreshold : primaryAttributeDamageThreshold option;
    at : int option;
    pa : int option;
    reach : int option;
    length : int option;
    structurePoints : int OneOrMany.t option;
    breakingPointRatingMod : int option;
    isParryingWeapon : bool;
    isTwoHandedWeapon : bool;
    isImprovisedWeapon : bool;
    damaged : int option;
  }

  type rangedWeapon = {
    combatTechnique : int;
    damage : damage option;
    length : int option;
    range : int * int * int;
    reloadTime : int OneOrMany.t;
    ammunition : int option;
    isImprovisedWeapon : bool;
    damaged : int option;
  }

  type armor = {
    protection : int;
    encumbrance : int;
    hasAdditionalPenalties : bool;
    iniMod : int option;
    movMod : int option;
    sturdinessMod : int option;
    armorType : int;
    wear : int option;
    isHitZoneArmorOnly : bool option;
  }

  type special =
    | MundaneItem of mundaneItem
    | MeleeWeapon of meleeWeapon
    | RangedWeapon of rangedWeapon
    | CombinedWeapon of meleeWeapon * rangedWeapon
    | Armor of armor

  type t = {
    id : int;
    name : string;
    amount : int option;
    price : int option;
    weight : int option;
    template : int option;
    isTemplateLocked : bool;
    carriedWhere : string option;
    special : special option;
    gr : int;
  }
end

type hitZoneArmor = {
  id : int;
  name : string;
  head : Id.HitZoneArmorZoneItem.t option;
  headWear : int option;
  leftArm : Id.HitZoneArmorZoneItem.t option;
  leftArmWear : int option;
  rightArm : Id.HitZoneArmorZoneItem.t option;
  rightArmWear : int option;
  torso : Id.HitZoneArmorZoneItem.t option;
  torsoWear : int option;
  leftLeg : Id.HitZoneArmorZoneItem.t option;
  leftLegWear : int option;
  rightLeg : Id.HitZoneArmorZoneItem.t option;
  rightLegWear : int option;
}

type purse = {
  ducats : int;
  silverthalers : int;
  halers : int;
  kreutzers : int;
}

type pet = {
  id : int;
  name : string;
  avatar : string option;
  size : string option; [@bs.as "type"]
  type_ : string option;
  attack : string option;
  dp : string option;
  reach : string option;
  actions : string option;
  skills : string option;
  abilities : string option;
  notes : string option;
  spentAp : string option;
  totalAp : string option;
  cou : string option;
  sgc : string option;
  int : string option;
  cha : string option;
  dex : string option;
  agi : string option;
  con : string option;
  str : string option;
  lp : string option;
  ae : string option;
  spi : string option;
  tou : string option;
  pro : string option;
  ini : string option;
  mov : string option;
  at : string option;
  pa : string option;
}

type styleDependency = {
  id : int OneOrMany.t;
  active : int option;
  origin : int;
}
(** One of the three options for an advanced special ability of a style special
    ability. There can be exactly one advanced special ability or a set of
    special abilities. If such a dependency is used, the special ability that is
    using that dependency is registered in [active]. [origin] holds the style
    special ability's id that created this dependency. *)

module TransferUnfamiliar = struct
  type id = Spell of int | Spells | LiturgicalChant of int | LiturgicalChants

  type t = { id : id; srcId : int }
end

type t = {
  id : int;
  name : string;
  dateCreated : Js.Date.t;
  dateModified : Js.Date.t;
  adventurePointsTotal : int;
  experienceLevel : int;
  sex : Sex.t;
  phase : Id.Phase.t;
  locale : string;
  avatar : string option;
  race : baseOrWithVariant option;
  culture : int option;
  isCulturalPackageActive : bool;
  profession : baseOrWithVariant option;
  professionName : string option;
  rules : Rules.t;
  personalData : personalData;
  advantages : Activatable_Dynamic.t Ley_IntMap.t;
  disadvantages : Activatable_Dynamic.t Ley_IntMap.t;
  specialAbilities : Activatable_Dynamic.t Ley_IntMap.t;
  attributes : Attribute.Dynamic.t Ley_IntMap.t;
  attributeAdjustmentSelected : int;
  energies : Energies.t;
  skills : Skill.Dynamic.t Ley_IntMap.t;
  meleeCombatTechniques : CombatTechnique.Melee.Dynamic.t Ley_IntMap.t;
  rangedCombatTechniques : CombatTechnique.Ranged.Dynamic.t Ley_IntMap.t;
  spells : Spell.Dynamic.t Ley_IntMap.t;
  magicalActions : MagicalActions.t;
  liturgicalChants : LiturgicalChant.Dynamic.t Ley_IntMap.t;
  cantrips : Ley_IntSet.t;
  blessings : Ley_IntSet.t;
  items : Item.t Ley_IntMap.t;
  hitZoneArmors : hitZoneArmor Ley_IntMap.t;
  purse : purse;
  pets : pet Ley_IntMap.t;
  pact : Pact.Dynamic.t option;
  combatStyleDependencies : styleDependency list;
  magicalStyleDependencies : styleDependency list;
  blessedStyleDependencies : styleDependency list;
  skillStyleDependencies : styleDependency list;
  socialStatusDependencies : int list;
  transferredUnfamiliarSpells : TransferUnfamiliar.t list;
}
