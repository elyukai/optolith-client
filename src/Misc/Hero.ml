module IM = Ley_IntMap

type baseOrWithVariant = Base of int | WithVariant of int * int

module Rules = struct
  type activeRule = { id : int; options : int list }

  type t = {
    areAllPublicationsActive : bool;
    activePublications : Ley_IntSet.t;
    activeFocusRules : activeRule IM.t;
    activeOptionalRules : activeRule IM.t;
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

module SpecialAbilities = struct
  type t = {
    advanced_combat_special_abilities :
      AdvancedCombatSpecialAbility.Static.t Activatable_Dynamic.t IM.t;
    advanced_karma_special_abilities :
      AdvancedKarmaSpecialAbility.Static.t Activatable_Dynamic.t IM.t;
    advanced_magical_special_abilities :
      AdvancedMagicalSpecialAbility.Static.t Activatable_Dynamic.t IM.t;
    ancestor_glyphs : AncestorGlyph.Static.t Activatable_Dynamic.t IM.t;
    attire_enchantments : AttireEnchantment.Static.t Activatable_Dynamic.t IM.t;
    blessed_traditions : BlessedTradition.Static.t Activatable_Dynamic.t IM.t;
    brawling_special_abilities :
      BrawlingSpecialAbility.Static.t Activatable_Dynamic.t IM.t;
    ceremonial_item_special_abilities :
      CeremonialItemSpecialAbility.Static.t Activatable_Dynamic.t IM.t;
    chronikzauber : Chronikzauber.Static.t Activatable_Dynamic.t IM.t;
    combat_special_abilities :
      CombatSpecialAbility.Static.t Activatable_Dynamic.t IM.t;
    combat_style_special_abilities :
      CombatStyleSpecialAbility.Static.t Activatable_Dynamic.t IM.t;
    command_special_abilities :
      CommandSpecialAbility.Static.t Activatable_Dynamic.t IM.t;
    dagger_rituals : DaggerRitual.Static.t Activatable_Dynamic.t IM.t;
    erweiterte_talentsonderfertigkeiten :
      ErweiterteTalentsonderfertigkeit.Static.t Activatable_Dynamic.t IM.t;
    familiar_special_abilities :
      FamiliarSpecialAbility.Static.t Activatable_Dynamic.t IM.t;
    fate_point_special_abilities :
      FatePointSpecialAbility.Static.t Activatable_Dynamic.t IM.t;
    general_special_abilities :
      GeneralSpecialAbility.Static.t Activatable_Dynamic.t IM.t;
    instrument_enchantments :
      InstrumentEnchantment.Static.t Activatable_Dynamic.t IM.t;
    kappenzauber : Kappenzauber.Static.t Activatable_Dynamic.t IM.t;
    karma_special_abilities :
      KarmaSpecialAbility.Static.t Activatable_Dynamic.t IM.t;
    kesselzauber : Kesselzauber.Static.t Activatable_Dynamic.t IM.t;
    kugelzauber : Kugelzauber.Static.t Activatable_Dynamic.t IM.t;
    liturgical_style_special_abilities :
      LiturgicalStyleSpecialAbility.Static.t Activatable_Dynamic.t IM.t;
    lykanthropische_gaben :
      LykanthropischeGabe.Static.t Activatable_Dynamic.t IM.t;
    magical_special_abilities :
      MagicalSpecialAbility.Static.t Activatable_Dynamic.t IM.t;
    magical_traditions : MagicalTradition.Static.t Activatable_Dynamic.t IM.t;
    magic_style_special_abilities :
      MagicStyleSpecialAbility.Static.t Activatable_Dynamic.t IM.t;
    orb_enchantments : OrbEnchantment.Static.t Activatable_Dynamic.t IM.t;
    paktgeschenke : Paktgeschenk.Static.t Activatable_Dynamic.t IM.t;
    protective_warding_circle_special_abilities :
      ProtectiveWardingCircleSpecialAbility.Static.t Activatable_Dynamic.t IM.t;
    ringzauber : Ringzauber.Static.t Activatable_Dynamic.t IM.t;
    schalenzauber : Schalenzauber.Static.t Activatable_Dynamic.t IM.t;
    sermons : Sermon.Static.t Activatable_Dynamic.t IM.t;
    sex_schicksalspunkte_sonderfertigkeiten :
      SexSchicksalspunkteSonderfertigkeit.Static.t Activatable_Dynamic.t IM.t;
    sex_sonderfertigkeiten :
      SexSonderfertigkeit.Static.t Activatable_Dynamic.t IM.t;
    sichelrituale : Sichelritual.Static.t Activatable_Dynamic.t IM.t;
    sikaryan_raub_sonderfertigkeiten :
      SikaryanRaubSonderfertigkeit.Static.t Activatable_Dynamic.t IM.t;
    spell_sword_enchantments :
      SpellSwordEnchantment.Static.t Activatable_Dynamic.t IM.t;
    spielzeugzauber : Spielzeugzauber.Static.t Activatable_Dynamic.t IM.t;
    staff_enchantments : StaffEnchantment.Static.t Activatable_Dynamic.t IM.t;
    talentstilsonderfertigkeiten :
      Talentstilsonderfertigkeit.Static.t Activatable_Dynamic.t IM.t;
    vampirische_gaben : VampirischeGabe.Static.t Activatable_Dynamic.t IM.t;
    visions : Vision.Static.t Activatable_Dynamic.t IM.t;
    waffenzauber : Waffenzauber.Static.t Activatable_Dynamic.t IM.t;
    wand_enchantments : WandEnchantment.Static.t Activatable_Dynamic.t IM.t;
  }
end

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
    curses : Curse.Dynamic.t IM.t;
    elven_magical_songs : ElvenMagicalSong.Dynamic.t IM.t;
    domination_rituals : DominationRitual.Dynamic.t IM.t;
    magical_dances : MagicalDance.Dynamic.t IM.t;
    magical_melodies : MagicalMelody.Dynamic.t IM.t;
    schelmenzauber : Schelmenzauber.Dynamic.t IM.t;
    animistenkraefte : Animistenkraft.Dynamic.t IM.t;
    geodenrituale : Geodenritual.Dynamic.t IM.t;
    zibiljarituale : Zibiljaritual.Dynamic.t IM.t;
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
  advantages : Activatable_Dynamic.t IM.t;
  disadvantages : Activatable_Dynamic.t IM.t;
  specialAbilities : Activatable_Dynamic.t IM.t;
  attributes : Attribute.Dynamic.t IM.t;
  attributeAdjustmentSelected : int;
  energies : Energies.t;
  skills : Skill.Dynamic.t IM.t;
  meleeCombatTechniques : CombatTechnique.Melee.Dynamic.t IM.t;
  rangedCombatTechniques : CombatTechnique.Ranged.Dynamic.t IM.t;
  spells : Spell.Dynamic.t IM.t;
  magicalActions : MagicalActions.t;
  liturgicalChants : LiturgicalChant.Dynamic.t IM.t;
  cantrips : Ley_IntSet.t;
  blessings : Ley_IntSet.t;
  items : Item.t IM.t;
  hitZoneArmors : hitZoneArmor IM.t;
  purse : purse;
  pets : pet IM.t;
  pact : Pact.Dynamic.t option;
  combatStyleDependencies : styleDependency list;
  magicalStyleDependencies : styleDependency list;
  blessedStyleDependencies : styleDependency list;
  skillStyleDependencies : styleDependency list;
  socialStatusDependencies : int list;
  transferredUnfamiliarSpells : TransferUnfamiliar.t list;
}
