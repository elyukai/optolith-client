module All : sig
  type t =
    | ExperienceLevel of int
    | Race of int
    | Culture of int
    | Profession of int
    | Attribute of int
    | Advantage of int
    | Disadvantage of int
    | Skill of int
    | CombatTechnique of int
    | Spell of int
    | Curse of int
    | ElvenMagicalSong of int
    | DominationRitual of int
    | MagicalMelody of int
    | MagicalDance of int
    | RogueSpell of int
    | AnimistForce of int
    | GeodeRitual of int
    | ZibiljaRitual of int
    | Cantrip of int
    | LiturgicalChant of int
    | Blessing of int
    | SpecialAbility of int
    | Item of int
    | EquipmentPackage of int
    | HitZoneArmor of int
    | Familiar of int
    | Animal of int
    | FocusRule of int
    | OptionalRule of int
    | Condition of int
    | State of int

  val compare : t -> t -> int
  (** [compare x y] returns [0] if [x] and [y] are equal, a negative integer if
      [x] is smaller than [y], and a positive integer if [x] is greater than
      [y]. *)

  val ( = ) : t -> t -> bool
end

module ActivatableAndSkill : sig
  type t =
    | Advantage of int
    | Disadvantage of int
    | SpecialAbility of int
    | Spell of int
    | LiturgicalChant of int
end

module ActivatableSkill : sig
  type t = Spell of int | LiturgicalChant of int
end

module PermanentSkill : sig
  type t = Skill of int | CombatTechnique of int
end

module Increasable : sig
  type t =
    | Attribute of int
    | Skill of int
    | MeleeCombatTechnique of int
    | RangedCombatTechnique of int
    | Spell of int
    | Ritual of int
    | LiturgicalChant of int
    | Ceremony of int

  module Decode : sig
    val t : Js.Json.t -> t
  end
end

module CombatTechnique : sig
  type t = MeleeCombatTechnique of int | RangedCombatTechnique of int

  module Decode : sig
    val t : Js.Json.t -> t
  end
end

module Spellwork : sig
  type t = Spell of int | Ritual of int

  module Decode : sig
    val t : Js.Json.t -> t
  end
end

module LiturgicalChant : sig
  type t = LiturgicalChant of int | Ceremony of int

  module Decode : sig
    val t : Js.Json.t -> t
  end
end

module PrerequisiteSource : sig
  type t =
    | Advantage of int
    | Disadvantage of int
    | SpecialAbility of int
    | Attribute of int
    | Skill of int
    | CombatTechnique of int
    | Spell of int
    | LiturgicalChant of int
end

module HitZoneArmorZoneItem : sig
  type t = Template of int | Custom of int
end

module Phase : sig
  type t = Outline | Definition | Advancement

  val fromInt : int -> (t, int) result

  val toInt : t -> int
end

module ExperienceLevel : sig
  type t =
    | Inexperienced
    | Ordinary
    | Experienced
    | Competent
    | Masterly
    | Brilliant
    | Legendary

  val fromInt : int -> (t, int) result

  val toInt : t -> int
end

module Attribute : sig
  type t =
    | Courage
    | Sagacity
    | Intuition
    | Charisma
    | Dexterity
    | Agility
    | Constitution
    | Strength

  val fromInt : int -> (t, int) result

  val toInt : t -> int
end

module DerivedCharacteristic : sig
  type t =
    | LifePoints
    | ArcaneEnergy
    | KarmaPoints
    | Spirit
    | Toughness
    | Dodge
    | Initiative
    | Movement
    | WoundThreshold

  val fromString : string -> (t, string) result

  val toString : t -> string
end

module Pact : sig
  type t = Faery | Demon | Other of int

  val fromInt : int -> t

  val toInt : t -> int
end

module SocialStatus : sig
  type t = NotFree | Free | LesserNoble | Noble | Aristocracy

  val fromInt : int -> (t, int) result

  val toInt : t -> int
end

module OptionalRule : sig
  type t =
    | MaximumAttributeScores
    | LanguageSpecialization
    | HigherDefenseStats
    | Other of int

  val fromInt : int -> t

  val toInt : t -> int
end

module Advantage : sig
  type t =
    | Aptitude
    | Nimble
    | Blessed
    | Luck
    | ExceptionalSkill
    | ExceptionalCombatTechnique
    | IncreasedAstralPower
    | IncreasedKarmaPoints
    | IncreasedLifePoints
    | IncreasedSpirit
    | IncreasedToughness
    | ImmunityToPoison
    | ImmunityToDisease
    | MagicalAttunement
    | Rich
    | SociallyAdaptable
    | InspireConfidence
    | WeaponAptitude
    | Spellcaster
    | Unyielding
    | LargeSpellSelection
    | HatredFor
    | Prediger
    | Visionaer
    | ZahlreichePredigten
    | ZahlreicheVisionen
    | LeichterGang
    | Einkommen
    | Other of int

  val fromInt : int -> t

  val toInt : t -> int
end

module Disadvantage : sig
  type t =
    | AfraidOf
    | Poor
    | Slow
    | NoFlyingBalm
    | NoFamiliar
    | MagicalRestriction
    | DecreasedArcanePower
    | DecreasedKarmaPoints
    | DecreasedLifePoints
    | DecreasedSpirit
    | DecreasedToughness
    | BadLuck
    | PersonalityFlaw
    | Principles
    | BadHabit
    | NegativeTrait
    | Stigma
    | Deaf
    | Incompetent
    | Obligations
    | Maimed
    | BrittleBones
    | SmallSpellSelection
    | WenigePredigten
    | WenigeVisionen
    | Other of int

  val fromInt : int -> t

  val toInt : t -> int
end

module Skill : sig
  type t =
    | Flying
    | Gaukelei
    | Climbing
    | BodyControl
    | FeatOfStrength
    | Riding
    | Swimming
    | SelfControl
    | Singing
    | Perception
    | Dancing
    | Pickpocket
    | Stealth
    | Carousing
    | Persuasion
    | Seduction
    | Intimidation
    | Etiquette
    | Streetwise
    | Empathy
    | FastTalk
    | Disguise
    | Willpower
    | Tracking
    | Ropes
    | Fishing
    | Orienting
    | PlantLore
    | AnimalLore
    | Survival
    | Gambling
    | Geography
    | History
    | Religions
    | Warfare
    | MagicalLore
    | Mechanics
    | Math
    | Law
    | MythsAndLegends
    | SphereLore
    | Astronomy
    | Alchemy
    | Sailing
    | Driving
    | Commerce
    | TreatPoison
    | TreatDisease
    | TreatSoul
    | TreatWounds
    | Woodworking
    | PrepareFood
    | Leatherworking
    | ArtisticAbility
    | Metalworking
    | Music
    | PickLocks
    | Earthencraft
    | Clothworking
    | Other of int

  val fromInt : int -> t

  val toInt : t -> int

  module Group : sig
    type t = Physical | Social | Nature | Knowledge | Craft

    val fromInt : int -> (t, int) result

    val toInt : t -> int
  end
end

module MeleeCombatTechnique : sig
  type t =
    | Daggers
    | FencingWeapons
    | ImpactWeapons
    | ChainWeapons
    | Lances
    | Brawling
    | Shields
    | Swords
    | Polearms
    | TwoHandedImpactWeapons
    | TwoHandedSwords
    | Faecher
    | Spiesswaffen
    | Other of int

  val fromInt : int -> t

  val toInt : t -> int
end

module RangedCombatTechnique : sig
  type t =
    | Crossbows
    | Bows
    | Slings
    | ThrownWeapons
    | SpittingFire
    | Blowguns
    | Discuses
    | Other of int

  val fromInt : int -> t

  val toInt : t -> int
end

module MagicalTradition : sig
  type t =
    | General
    | GuildMages
    | Witches
    | Elves
    | Druids
    | Scharlatane
    | ArcaneBards
    | ArcaneDancers
    | IntuitiveZauberer
    | Meistertalentierte
    | Qabalyamagier
    | Kristallomanten
    | Geodes
    | Alchimisten
    | Rogues
    | Animists
    | Zibilija
    | BrobimGeoden
    | Other of int

  val fromInt : int -> t

  val toInt : t -> int
end

module Spell : sig
  module Group : sig
    type t = Spells | Rituals

    val fromInt : int -> (t, int) result

    val toInt : t -> int
  end
end

module Property : sig
  type t =
    | AntiMagic
    | Demonic
    | Influence
    | Elemental
    | Healing
    | Clairvoyance
    | Illusion
    | Spheres
    | Objekt
    | Telekinesis
    | Transformation
    | Temporal
    | Other of int

  val fromInt : int -> t

  val toInt : t -> int
end

module SpecialAbility : sig
  module GeneralSpecialAbility : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module FatePointSpecialAbility : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module CombatSpecialAbility : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module MagicalSpecialAbility : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module StaffEnchantment : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module FamiliarSpecialAbility : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module KarmaSpecialAbility : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module ProtectiveWardingCircleSpecialAbility : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module CombatStyleSpecialAbility : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module AdvancedCombatSpecialAbility : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module CommandSpecialAbility : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module MagicStyleSpecialAbility : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module AdvancedMagicalSpecialAbility : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module SpellSwordEnchantment : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module DaggerRitual : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module InstrumentEnchantment : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module AttireEnchantment : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module OrbEnchantment : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module WandEnchantment : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module BrawlingSpecialAbility : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module AncestorGlyph : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module CeremonialItemSpecialAbility : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module Sermon : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module LiturgicalStyleSpecialAbility : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module AdvancedKarmaSpecialAbility : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module Vision : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module MagicalTradition : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module BlessedTradition : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module Paktgeschenk : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module SikaryanRaubSonderfertigkeit : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module LykanthropischeGabe : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module Talentstilsonderfertigkeit : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module ErweiterteTalentsonderfertigkeit : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module Kugelzauber : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module Kesselzauber : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module Kappenzauber : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module Spielzeugzauber : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module Schalenzauber : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module SexSchicksalspunkteSonderfertigkeit : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module SexSonderfertigkeit : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module Waffenzauber : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module Sichelritual : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module Ringzauber : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  module Chronikzauber : sig
    type t = Other of int

    val fromInt : int -> t

    val toInt : t -> int
  end

  (* type t =
     | GeneralSpecialAbility of int
     | FatePointSpecialAbility of int
     | CombatSpecialAbility of int
     | MagicalSpecialAbility of int
     | StaffEnchantment of int
     | FamiliarSpecialAbility of int
     | KarmaSpecialAbility of int
     | ProtectiveWardingCircleSpecialAbility of int
     | CombatStyleSpecialAbility of int
     | AdvancedCombatSpecialAbility of int
     | CommandSpecialAbility of int
     | MagicStyleSpecialAbility of int
     | AdvancedMagicalSpecialAbility of int
     | SpellSwordEnchantment of int
     | DaggerRitual of int
     | InstrumentEnchantment of int
     | AttireEnchantment of int
     | OrbEnchantment of int
     | WandEnchantment of int
     | BrawlingSpecialAbility of int
     | AncestorGlyph of int
     | CeremonialItemSpecialAbility of int
     | Sermon of int
     | LiturgicalStyleSpecialAbility of int
     | AdvancedKarmaSpecialAbility of int
     | Vision of int
     | MagicalTradition of int
     | BlessedTradition of int
     | Paktgeschenk of int
     | SikaryanRaubSonderfertigkeit of int
     | LykanthropischeGabe of int
     | Talentstilsonderfertigkeit of int
     | ErweiterteTalentsonderfertigkeit of int
     | Kugelzauber of int
     | Kesselzauber of int
     | Kappenzauber of int
     | Spielzeugzauber of int
     | Schalenzauber of int
     | SexSchicksalspunkteSonderfertigkeit of int
     | SexSonderfertigkeit of int
     | Waffenzauber of int
     | Sichelritual of int
     | Ringzauber of int
     | Chronikzauber of int *)

  module Nested : sig
    type t =
      | GeneralSpecialAbility of GeneralSpecialAbility.t
      | FatePointSpecialAbility of FatePointSpecialAbility.t
      | CombatSpecialAbility of CombatSpecialAbility.t
      | MagicalSpecialAbility of MagicalSpecialAbility.t
      | StaffEnchantment of StaffEnchantment.t
      | FamiliarSpecialAbility of FamiliarSpecialAbility.t
      | KarmaSpecialAbility of KarmaSpecialAbility.t
      | ProtectiveWardingCircleSpecialAbility of
          ProtectiveWardingCircleSpecialAbility.t
      | CombatStyleSpecialAbility of CombatStyleSpecialAbility.t
      | AdvancedCombatSpecialAbility of AdvancedCombatSpecialAbility.t
      | CommandSpecialAbility of CommandSpecialAbility.t
      | MagicStyleSpecialAbility of MagicStyleSpecialAbility.t
      | AdvancedMagicalSpecialAbility of AdvancedMagicalSpecialAbility.t
      | SpellSwordEnchantment of SpellSwordEnchantment.t
      | DaggerRitual of DaggerRitual.t
      | InstrumentEnchantment of InstrumentEnchantment.t
      | AttireEnchantment of AttireEnchantment.t
      | OrbEnchantment of OrbEnchantment.t
      | WandEnchantment of WandEnchantment.t
      | BrawlingSpecialAbility of BrawlingSpecialAbility.t
      | AncestorGlyph of AncestorGlyph.t
      | CeremonialItemSpecialAbility of CeremonialItemSpecialAbility.t
      | Sermon of Sermon.t
      | LiturgicalStyleSpecialAbility of LiturgicalStyleSpecialAbility.t
      | AdvancedKarmaSpecialAbility of AdvancedKarmaSpecialAbility.t
      | Vision of Vision.t
      | MagicalTradition of MagicalTradition.t
      | BlessedTradition of BlessedTradition.t
      | Paktgeschenk of Paktgeschenk.t
      | SikaryanRaubSonderfertigkeit of SikaryanRaubSonderfertigkeit.t
      | LykanthropischeGabe of LykanthropischeGabe.t
      | Talentstilsonderfertigkeit of Talentstilsonderfertigkeit.t
      | ErweiterteTalentsonderfertigkeit of ErweiterteTalentsonderfertigkeit.t
      | Kugelzauber of Kugelzauber.t
      | Kesselzauber of Kesselzauber.t
      | Kappenzauber of Kappenzauber.t
      | Spielzeugzauber of Spielzeugzauber.t
      | Schalenzauber of Schalenzauber.t
      | SexSchicksalspunkteSonderfertigkeit of
          SexSchicksalspunkteSonderfertigkeit.t
      | SexSonderfertigkeit of SexSonderfertigkeit.t
      | Waffenzauber of Waffenzauber.t
      | Sichelritual of Sichelritual.t
      | Ringzauber of Ringzauber.t
      | Chronikzauber of Chronikzauber.t
  end

  type t =
    | SkillSpecialization
    | TerrainKnowledge
    | CraftInstruments
    | Hunter
    | AreaKnowledge
    | Literacy
    | Language
    | CombatReflexes
    | ImprovedDodge
    | TraditionGuildMages
    | PropertyKnowledge
    | PropertyFocus
    | AspectKnowledge
    | TraditionChurchOfPraios
    | Feuerschlucker
    | CombatStyleCombination
    | AdaptionZauber
    | Exorzist
    | FavoriteSpellwork
    | TraditionWitches
    | MagicStyleCombination
    | Harmoniezauberei
    | Matrixzauberei
    | TraditionElves
    | TraditionDruids
    | SpellEnhancement
    | Forschungsgebiet
    | Expertenwissen
    | Wissensdurst
    | Recherchegespuer
    | PredigtDerGemeinschaft
    | PredigtDerZuversicht
    | PredigtDesGottvertrauens
    | PredigtDesWohlgefallens
    | PredigtWiderMissgeschicke
    | VisionDerBestimmung
    | VisionDerEntrueckung
    | VisionDerGottheit
    | VisionDesSchicksals
    | VisionDesWahrenGlaubens
    | HoheWeihe
    | Lieblingsliturgie
    | Zugvoegel
    | JaegerinnenDerWeissenMaid
    | AnhaengerDesGueldenen
    | GebieterDesAspekts
    | ChantEnhancement
    | DunklesAbbildDerBuendnisgabe
    | TraditionIllusionist
    | TraditionArcaneBard
    | TraditionArcaneDancer
    | TraditionIntuitiveMage
    | TraditionSavant
    | TraditionQabalyaMage
    | TraditionChurchOfRondra
    | TraditionChurchOfBoron
    | TraditionChurchOfHesinde
    | TraditionChurchOfPhex
    | TraditionChurchOfPeraine
    | TraditionChurchOfEfferd
    | TraditionChurchOfTravia
    | TraditionChurchOfFirun
    | TraditionChurchOfTsa
    | TraditionChurchOfIngerimm
    | TraditionChurchOfRahja
    | TraditionCultOfTheNamelessOne
    | TraditionChurchOfAves
    | TraditionChurchOfIfirn
    | TraditionChurchOfKor
    | TraditionChurchOfNandus
    | TraditionChurchOfSwafnir
    | LanguageSpecializations
    | TraditionSchelme
    | TraditionZauberalchimisten
    | GrosseMeditation
    | Imitationszauberei
    | Kraftliniennutzung
    | ScholarDerHalleDesLebensZuNorburg
    | ScholarDesKreisesDerEinfuehlung
    | MadaschwesternStil
    | GaretherGossenStil
    | WegDerGelehrten
    | TraditionCultOfNuminoru
    | WegDerKuenstlerin
    | WegDerSchreiberin
    | Fachwissen
    | Handwerkskunst
    | KindDerNatur
    | KoerperlichesGeschick
    | SozialeKompetenz
    | Universalgenie
    | ScholarDesMagierkollegsZuHoningen
    | TraditionAnimisten
    | TraditionGeoden
    | TraditionZibilijas
    | Zaubervariabilitaet
    | TraditionBrobimGeoden
    | Other of int

  val fromInt : int -> t

  val toInt : t -> int
end

module Activatable : sig
  type t =
    | Advantage of int
    | Disadvantage of int
    | GeneralSpecialAbility of int
    | FatePointSpecialAbility of int
    | CombatSpecialAbility of int
    | MagicalSpecialAbility of int
    | StaffEnchantment of int
    | FamiliarSpecialAbility of int
    | KarmaSpecialAbility of int
    | ProtectiveWardingCircleSpecialAbility of int
    | CombatStyleSpecialAbility of int
    | AdvancedCombatSpecialAbility of int
    | CommandSpecialAbility of int
    | MagicStyleSpecialAbility of int
    | AdvancedMagicalSpecialAbility of int
    | SpellSwordEnchantment of int
    | DaggerRitual of int
    | InstrumentEnchantment of int
    | AttireEnchantment of int
    | OrbEnchantment of int
    | WandEnchantment of int
    | BrawlingSpecialAbility of int
    | AncestorGlyph of int
    | CeremonialItemSpecialAbility of int
    | Sermon of int
    | LiturgicalStyleSpecialAbility of int
    | AdvancedKarmaSpecialAbility of int
    | Vision of int
    | MagicalTradition of int
    | BlessedTradition of int
    | Paktgeschenk of int
    | SikaryanRaubSonderfertigkeit of int
    | LykanthropischeGabe of int
    | Talentstilsonderfertigkeit of int
    | ErweiterteTalentsonderfertigkeit of int
    | Kugelzauber of int
    | Kesselzauber of int
    | Kappenzauber of int
    | Spielzeugzauber of int
    | Schalenzauber of int
    | SexSchicksalspunkteSonderfertigkeit of int
    | SexSonderfertigkeit of int
    | Waffenzauber of int
    | Sichelritual of int
    | Ringzauber of int
    | Chronikzauber of int

  (* val toAll : t -> All.t *)

  (* val ( = ) : t -> t -> bool *)

  module Decode : sig
    val t : Js.Json.t -> t
  end

  module SelectOption : sig
    type t =
      | Generic of int
      | Blessing of int
      | Cantrip of int
      | TradeSecret of int
      | Language of int
      | Script of int
      | AnimalShape of int
      | SpellEnhancement of int
      | LiturgicalChantEnhancement of int
      | ArcaneBardTradition of int
      | ArcaneDancerTradition of int
      | Element of int
      | Property of int
      | Aspect of int
      | Disease of int
      | Poison of int
      | MeleeCombatTechnique of int
      | RangedCombatTechnique of int
      | LiturgicalChant of int
      | Ceremony of int
      | Skill of int
      | Spell of int
      | Ritual of int

    val compare : t -> t -> int
    (** [compare x y] returns [0] if [x] and [y] are equal, a negative integer
        if [x] is smaller than [y], and a positive integer if [x] is greater
        than [y]. *)

    val ( = ) : t -> t -> bool

    val ( <> ) : t -> t -> bool

    module Decode : sig
      val t : Js.Json.t -> t
    end
  end

  module Option : sig
    type t = Preset of SelectOption.t | CustomInput of string

    val ( = ) : t -> t -> bool
  end

  module DeepVariant : sig
    type t =
      | Advantage of Advantage.t
      | Disadvantage of Disadvantage.t
      | SpecialAbility of SpecialAbility.t
  end
end
