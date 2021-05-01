(** This module contains modules for every entity type in Optolith and provides
    mapping functions to convert the integer identifiers from the database to
    readable variants, which is especially useful if custom code is required for
    certain entries. Each module features the variant type, where [Other x]
    is every identifier that does not need to be referenced directly, converters
    from and to integers as well as a [compare] function so you can use each
    module for generating type-dependent data structures such as [Map]s.

    Each module works exactly the same way, which is outlined above, and why no
    duplicate documentation is present below.

    Normal variants are used so that we can be sure we use the correct one if
    multiple occur in one place. *)

module FocusRule : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module OptionalRule : sig
  type t =
    | MaximumAttributeScores
    | LanguageSpecialization
    | HigherDefenseStats
    | Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
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
    | Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module Race : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module Culture : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module Profession : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
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
    | Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module Advantage : sig
  type t =
    | Aptitude  (** Begabung *)
    | Nimble  (** Flink *)
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
    | Unyielding  (** Eisern *)
    | LargeSpellSelection
    | HatredFor
    | Prediger
    | Visionaer
    | ZahlreichePredigten
    | ZahlreicheVisionen
    | LeichterGang
    | Einkommen
    | Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
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
    | NegativeTrait  (** Schlechte Eigenschaft *)
    | Stigma
    | Deaf  (** Taub *)
    | Incompetent
    | Obligations  (** Verpflichtungen *)
    | Maimed  (** Verstümmelt *)
    | BrittleBones  (** Gläsern *)
    | SmallSpellSelection
    | WenigePredigten
    | WenigeVisionen
    | Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module Skill : sig
  module Group : sig
    type t = Physical | Social | Nature | Knowledge | Craft | Other of int

    val from_int : int -> t

    val to_int : t -> int

    val compare : t -> t -> int
  end

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

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
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
    | Whips
    | Faecher
    | Spiesswaffen
    | Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
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

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
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
    | Object
    | Telekinesis
    | Transformation
    | Temporal
    | Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module Cantrip : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module Spell : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module Ritual : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module Aspect : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module Blessing : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module LiturgicalChant : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module Ceremony : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module GeneralSpecialAbility : sig
  type t =
    | SkillSpecialization
    | TerrainKnowledge
    | CraftInstruments
    | Hunter
    | AreaKnowledge
    | Literacy
    | Language
    | FireEater
    | LanguageSpecialization
    | Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int

  module TradeSecret : sig
    type t = Other of int

    val from_int : int -> t

    val to_int : t -> int

    val compare : t -> t -> int
  end
end

module Script : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module Language : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module FatePointSpecialAbility : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module CombatSpecialAbility : sig
  type t =
    | CombatReflexes
    | ImprovedDodge
    | CombatStyleCombination
    | Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module MagicalSpecialAbility : sig
  type t =
    | PropertyKnowledge
    | Adaptation
    | Exorcist
    | FavoriteSpellwork  (** Lieblingszauber *)
    | MagicStyleCombination
    | GrosseMeditation
    | Imitationszauberei
    | Kraftliniennutzung
    | Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module StaffEnchantment : sig
  type t = PropertyFocus | Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int

  module AnimalShape : sig
    type t = Other of int

    val from_int : int -> t

    val to_int : t -> int

    val compare : t -> t -> int
  end
end

module FamiliarSpecialAbility : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module KarmaSpecialAbility : sig
  type t =
    | AspectKnowledge
    | HigherOrdination
    | FavoriteLiturgicalChant
    | Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module ProtectiveWardingCircleSpecialAbility : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module CombatStyleSpecialAbility : sig
  type t = GaretherGossenStil | Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module AdvancedCombatSpecialAbility : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module CommandSpecialAbility : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module MagicStyleSpecialAbility : sig
  type t =
    | ScholarDerHalleDesLebensZuNorburg
    | ScholarDesKreisesDerEinfuehlung
    | MadaschwesternStil
    | ScholarDesMagierkollegsZuHoningen
    | Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module AdvancedMagicalSpecialAbility : sig
  type t = HarmoniousMagic | MatrixCasting | Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module SpellSwordEnchantment : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module DaggerRitual : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module InstrumentEnchantment : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module AttireEnchantment : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module OrbEnchantment : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module WandEnchantment : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module BrawlingSpecialAbility : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module AncestorGlyph : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module CeremonialItemSpecialAbility : sig
  type t =
    | FieldOfResearch
    | ExpertKnowledge
    | ThirstForKnowledge
    | ResearchInstinct
    | Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module Sermon : sig
  type t =
    | PredigtDerGemeinschaft
    | PredigtDerZuversicht
    | PredigtDesGottvertrauens
    | PredigtDesWohlgefallens
    | PredigtWiderMissgeschicke
    | Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module LiturgicalStyleSpecialAbility : sig
  type t =
    | BirdsOfPassage
    | HuntressesOfTheWhiteMaiden
    | FollowersOfTheGoldenOne
    | Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module AdvancedKarmaSpecialAbility : sig
  type t = MasterOfAspect | Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module Vision : sig
  type t =
    | VisionDerBestimmung
    | VisionDerEntrueckung
    | VisionDerGottheit
    | VisionDesSchicksals
    | VisionDesWahrenGlaubens
    | Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module MagicalTradition : sig
  type t =
    | TraditionGuildMages
    | TraditionWitches
    | TraditionElves
    | TraditionDruids
    | TraditionQabalyaMage
    | TraditionIntuitiveMage
    | TraditionSavant
    | TraditionIllusionist
    | TraditionArcaneBard
    | TraditionArcaneDancer
    | TraditionSchelme
    | TraditionZauberalchimisten
    | TraditionTsatuariaAnhaengerinnen
    | TraditionAnimisten
    | TraditionGeoden
    | TraditionZibilijas
    | TraditionBrobimGeoden
    | Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int

  module ArcaneBardTradition : sig
    type t = Other of int

    val from_int : int -> t

    val to_int : t -> int

    val compare : t -> t -> int
  end

  module ArcaneDancerTradition : sig
    type t = Other of int

    val from_int : int -> t

    val to_int : t -> int

    val compare : t -> t -> int
  end
end

module BlessedTradition : sig
  type t =
    | TraditionChurchOfPraios
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
    | TraditionCultOfLevthan
    | TraditionCultOfNuminoru
    | Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module PactGift : sig
  type t = DunklesAbbildDerBuendnisgabe | Zaubervariabilitaet | Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module SikaryanDrainSpecialAbility : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module LycantropicGift : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module SkillStyleSpecialAbility : sig
  type t =
    | WegDerGelehrten
    | WegDerKuenstlerin
    | WegDerSchreiberin
    | Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module AdvancedSkillSpecialAbility : sig
  type t =
    | Fachwissen
    | Handwerkskunst
    | KindDerNatur
    | KoerperlichesGeschick
    | SozialeKompetenz
    | Universalgenie
    | Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module ArcaneOrbEnchantment : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module CauldronEnchantment : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module FoolsHatEnchantment : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module ToyEnchantment : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module BowlEnchantment : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module FatePointSexSpecialAbility : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module SexSpecialAbility : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module WeaponEnchantment : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module SickleRitual : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module RingEnchantment : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module ChronicleEnchantment : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module Element : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module SexPractice : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module Poison : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end

module Disease : sig
  type t = Other of int

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int
end
