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

module type Id = sig
  type t

  val from_int : int -> t
  (** [from_int x] converts the integer [x] to its corresponding variant
      representation. *)

  val to_int : t -> int
  (** [from_int x] converts the variant [x] to its corresponding integer
      representation. *)

  val compare : t -> t -> int
  (** [compare x y] returns [0] if [x] is equal to [y], a negative integer if
      [x] is less than [y], and a positive integer if [x] is greater than [y].
      *)

  (** A configured [Set] module with the identifier variant as the key. *)
  module Set : sig
    include SetX.T with type key = t

    val from_int_list : int list -> t
    (** [from_int_list xs] creates a configured Set from the given list [xs],
        converting each list item to its corresponding variant representation.
        *)
  end

  (** A configured [Map] module with the identifier variant as the key. *)
  module Map : sig
    include MapX.T with type key = t

    val from_int_list : (int * 'a) list -> 'a t
    (** [from_int_list xs] creates a configured Map from the given list [xs],
        converting each list item tuple's first value to its corresponding
        variant representation. *)
  end

  (** Decode identifier variants directly, which makes it easier to use. *)
  module Decode : sig
    val t : t Decoders_bs.Decode.decoder
    (** Convert a single integer identifier into it's corresponding variant
        representation. *)

    val set : Set.t Decoders_bs.Decode.decoder
    (** Convert a list of integer identifiers into a set of it's corresponding
        variant representations. *)
  end
end

module Publication : sig
  type t = Other of int

  include Id with type t := t
end

module FocusRule : sig
  type t = Other of int

  include Id with type t := t
end

module OptionalRule : sig
  type t =
    | MaximumAttributeScores
    | LanguageSpecialization
    | HigherDefenseStats
    | Other of int

  include Id with type t := t
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

  include Id with type t := t
end

module Race : sig
  type t = Other of int

  include Id with type t := t
end

module Culture : sig
  type t = Other of int

  include Id with type t := t
end

module Profession : sig
  type t = Other of int

  include Id with type t := t
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

  include Id with type t := t
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

  include Id with type t := t
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

  include Id with type t := t
end

module Skill : sig
  module Group : sig
    type t = Physical | Social | Nature | Knowledge | Craft | Other of int

    include Id with type t := t
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

  include Id with type t := t
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

  include Id with type t := t
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

  include Id with type t := t
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

  include Id with type t := t
end

module Cantrip : sig
  type t = Other of int

  include Id with type t := t
end

module Spell : sig
  type t = Other of int

  include Id with type t := t
end

module Ritual : sig
  type t = Other of int

  include Id with type t := t
end

module Curse : sig
  type t = Other of int

  include Id with type t := t
end

module ElvenMagicalSong : sig
  type t = Other of int

  include Id with type t := t
end

module DominationRitual : sig
  type t = Other of int

  include Id with type t := t
end

module MagicalMelody : sig
  type t = Other of int

  include Id with type t := t
end

module MagicalDance : sig
  type t = Other of int

  include Id with type t := t
end

module JesterTrick : sig
  type t = Other of int

  include Id with type t := t
end

module AnimistPower : sig
  type t = Other of int

  include Id with type t := t
end

module GeodeRitual : sig
  type t = Other of int

  include Id with type t := t
end

module ZibiljaRitual : sig
  type t = Other of int

  include Id with type t := t
end

module Aspect : sig
  type t = Other of int

  include Id with type t := t
end

module Blessing : sig
  type t = Other of int

  include Id with type t := t
end

module LiturgicalChant : sig
  type t = Other of int

  include Id with type t := t
end

module Ceremony : sig
  type t = Other of int

  include Id with type t := t
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

  include Id with type t := t

  module TradeSecret : sig
    type t = Other of int

    include Id with type t := t
  end
end

module Script : sig
  type t = Other of int

  include Id with type t := t
end

module Language : sig
  type t = Other of int

  include Id with type t := t
end

module FatePointSpecialAbility : sig
  type t = Other of int

  include Id with type t := t
end

module CombatSpecialAbility : sig
  type t =
    | CombatReflexes
    | ImprovedDodge
    | CombatStyleCombination
    | Other of int

  include Id with type t := t
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

  include Id with type t := t
end

module StaffEnchantment : sig
  type t = PropertyFocus | Other of int

  include Id with type t := t

  module AnimalShape : sig
    type t = Other of int

    include Id with type t := t
  end
end

module FamiliarSpecialAbility : sig
  type t = Other of int

  include Id with type t := t
end

module KarmaSpecialAbility : sig
  type t =
    | AspectKnowledge
    | HigherOrdination
    | FavoriteLiturgicalChant
    | Other of int

  include Id with type t := t
end

module ProtectiveWardingCircleSpecialAbility : sig
  type t = Other of int

  include Id with type t := t
end

module CombatStyleSpecialAbility : sig
  type t = GaretherGossenStil | Other of int

  include Id with type t := t
end

module AdvancedCombatSpecialAbility : sig
  type t = Other of int

  include Id with type t := t
end

module CommandSpecialAbility : sig
  type t = Other of int

  include Id with type t := t
end

module MagicStyleSpecialAbility : sig
  type t =
    | ScholarDerHalleDesLebensZuNorburg
    | ScholarDesKreisesDerEinfuehlung
    | MadaschwesternStil
    | ScholarDesMagierkollegsZuHoningen
    | Other of int

  include Id with type t := t
end

module AdvancedMagicalSpecialAbility : sig
  type t = HarmoniousMagic | MatrixCasting | Other of int

  include Id with type t := t
end

module SpellSwordEnchantment : sig
  type t = Other of int

  include Id with type t := t
end

module DaggerRitual : sig
  type t = Other of int

  include Id with type t := t
end

module InstrumentEnchantment : sig
  type t = Other of int

  include Id with type t := t
end

module AttireEnchantment : sig
  type t = Other of int

  include Id with type t := t
end

module OrbEnchantment : sig
  type t = Other of int

  include Id with type t := t
end

module WandEnchantment : sig
  type t = Other of int

  include Id with type t := t
end

module BrawlingSpecialAbility : sig
  type t = Other of int

  include Id with type t := t
end

module AncestorGlyph : sig
  type t = Other of int

  include Id with type t := t
end

module CeremonialItemSpecialAbility : sig
  type t =
    | FieldOfResearch
    | ExpertKnowledge
    | ThirstForKnowledge
    | ResearchInstinct
    | Other of int

  include Id with type t := t
end

module Sermon : sig
  type t =
    | PredigtDerGemeinschaft
    | PredigtDerZuversicht
    | PredigtDesGottvertrauens
    | PredigtDesWohlgefallens
    | PredigtWiderMissgeschicke
    | Other of int

  include Id with type t := t
end

module LiturgicalStyleSpecialAbility : sig
  type t =
    | BirdsOfPassage
    | HuntressesOfTheWhiteMaiden
    | FollowersOfTheGoldenOne
    | Other of int

  include Id with type t := t
end

module AdvancedKarmaSpecialAbility : sig
  type t = MasterOfAspect | Other of int

  include Id with type t := t
end

module Vision : sig
  type t =
    | VisionDerBestimmung
    | VisionDerEntrueckung
    | VisionDerGottheit
    | VisionDesSchicksals
    | VisionDesWahrenGlaubens
    | Other of int

  include Id with type t := t
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

  include Id with type t := t

  module ArcaneBardTradition : sig
    type t = Other of int

    include Id with type t := t
  end

  module ArcaneDancerTradition : sig
    type t = Other of int

    include Id with type t := t
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

  include Id with type t := t
end

module PactGift : sig
  type t = DunklesAbbildDerBuendnisgabe | Zaubervariabilitaet | Other of int

  include Id with type t := t
end

module SikaryanDrainSpecialAbility : sig
  type t = Other of int

  include Id with type t := t
end

module LycantropicGift : sig
  type t = Other of int

  include Id with type t := t
end

module SkillStyleSpecialAbility : sig
  type t =
    | WegDerGelehrten
    | WegDerKuenstlerin
    | WegDerSchreiberin
    | Other of int

  include Id with type t := t
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

  include Id with type t := t
end

module ArcaneOrbEnchantment : sig
  type t = Other of int

  include Id with type t := t
end

module CauldronEnchantment : sig
  type t = Other of int

  include Id with type t := t
end

module FoolsHatEnchantment : sig
  type t = Other of int

  include Id with type t := t
end

module ToyEnchantment : sig
  type t = Other of int

  include Id with type t := t
end

module BowlEnchantment : sig
  type t = Other of int

  include Id with type t := t
end

module FatePointSexSpecialAbility : sig
  type t = Other of int

  include Id with type t := t
end

module SexSpecialAbility : sig
  type t = Other of int

  include Id with type t := t
end

module WeaponEnchantment : sig
  type t = Other of int

  include Id with type t := t
end

module SickleRitual : sig
  type t = Other of int

  include Id with type t := t
end

module RingEnchantment : sig
  type t = Other of int

  include Id with type t := t
end

module ChronicleEnchantment : sig
  type t = Other of int

  include Id with type t := t
end

module Element : sig
  type t = Other of int

  include Id with type t := t
end

module SexPractice : sig
  type t = Other of int

  include Id with type t := t
end

module Poison : sig
  type t = Other of int

  include Id with type t := t
end

module Disease : sig
  type t = Other of int

  include Id with type t := t
end
