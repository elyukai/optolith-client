module type Id = sig
  type t

  val from_int : int -> t

  val to_int : t -> int

  val compare : t -> t -> int

  module Set : sig
    include SetX.T with type key = t

    val from_int_list : int list -> t
  end

  module Map : sig
    include MapX.T with type key = t

    val from_int_list : (int * 'a) list -> 'a t
  end
end

module Make (S : sig
  type t

  val from_int : int -> t

  val to_int : t -> int
end) : Id with type t := S.t = struct
  let from_int = S.from_int

  let to_int = S.to_int

  let compare = Function.(flip on to_int compare)

  module Set = struct
    include SetX.Make (struct
      type nonrec t = S.t

      let compare = compare
    end)

    let from_int_list xs = xs |> List.map from_int |> fromList
  end

  module Map = struct
    include MapX.Make (struct
      type nonrec t = S.t

      let compare = compare
    end)

    let from_int_list xs = xs |> List.map (Tuple.first from_int) |> fromList
  end
end

module FocusRule = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module OptionalRule = struct
  type t =
    | MaximumAttributeScores
    | LanguageSpecialization
    | HigherDefenseStats
    | Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function
      | 8 -> MaximumAttributeScores
      | 15 -> LanguageSpecialization
      | 17 -> HigherDefenseStats
      | x -> Other x

    let to_int = function
      | MaximumAttributeScores -> 8
      | LanguageSpecialization -> 15
      | HigherDefenseStats -> 17
      | Other x -> x
  end)
end

module ExperienceLevel = struct
  type t =
    | Inexperienced
    | Ordinary
    | Experienced
    | Competent
    | Masterly
    | Brilliant
    | Legendary
    | Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function
      | 1 -> Inexperienced
      | 2 -> Ordinary
      | 3 -> Experienced
      | 4 -> Competent
      | 5 -> Masterly
      | 6 -> Brilliant
      | 7 -> Legendary
      | x -> Other x

    let to_int = function
      | Inexperienced -> 1
      | Ordinary -> 2
      | Experienced -> 3
      | Competent -> 4
      | Masterly -> 5
      | Brilliant -> 6
      | Legendary -> 7
      | Other x -> x
  end)
end

module Race = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module Culture = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module Profession = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module Attribute = struct
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

  include Make (struct
    type nonrec t = t

    let from_int = function
      | 1 -> Courage
      | 2 -> Sagacity
      | 3 -> Intuition
      | 4 -> Charisma
      | 5 -> Dexterity
      | 6 -> Agility
      | 7 -> Constitution
      | 8 -> Strength
      | x -> Other x

    let to_int = function
      | Courage -> 1
      | Sagacity -> 2
      | Intuition -> 3
      | Charisma -> 4
      | Dexterity -> 5
      | Agility -> 6
      | Constitution -> 7
      | Strength -> 8
      | Other x -> x
  end)
end

module Advantage = struct
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

  include Make (struct
    type nonrec t = t

    let from_int = function
      | 4 -> Aptitude
      | 9 -> Nimble
      | 12 -> Blessed
      | 14 -> Luck
      | 16 -> ExceptionalSkill
      | 17 -> ExceptionalCombatTechnique
      | 20 -> IncreasedAstralPower
      | 21 -> IncreasedKarmaPoints
      | 22 -> IncreasedLifePoints
      | 23 -> IncreasedSpirit
      | 24 -> IncreasedToughness
      | 25 -> ImmunityToPoison
      | 26 -> ImmunityToDisease
      | 29 -> MagicalAttunement
      | 33 -> Rich
      | 37 -> SociallyAdaptable
      | 43 -> InspireConfidence
      | 44 -> WeaponAptitude
      | 47 -> Spellcaster
      | 51 -> Unyielding
      | 55 -> HatredFor
      | 66 -> LargeSpellSelection
      | 85 -> LeichterGang
      | 91 -> Prediger
      | 92 -> Visionaer
      | 93 -> ZahlreichePredigten
      | 94 -> ZahlreicheVisionen
      | 129 -> Einkommen
      | x -> Other x

    let to_int = function
      | Aptitude -> 4
      | Nimble -> 9
      | Blessed -> 12
      | Luck -> 14
      | ExceptionalSkill -> 16
      | ExceptionalCombatTechnique -> 17
      | IncreasedAstralPower -> 20
      | IncreasedKarmaPoints -> 21
      | IncreasedLifePoints -> 22
      | IncreasedSpirit -> 23
      | IncreasedToughness -> 24
      | ImmunityToPoison -> 25
      | ImmunityToDisease -> 26
      | MagicalAttunement -> 29
      | Rich -> 33
      | SociallyAdaptable -> 37
      | InspireConfidence -> 43
      | WeaponAptitude -> 44
      | Spellcaster -> 47
      | Unyielding -> 51
      | HatredFor -> 55
      | LargeSpellSelection -> 66
      | LeichterGang -> 85
      | Prediger -> 91
      | Visionaer -> 92
      | ZahlreichePredigten -> 93
      | ZahlreicheVisionen -> 94
      | Einkommen -> 129
      | Other x -> x
  end)
end

module Disadvantage = struct
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

  include Make (struct
    type nonrec t = t

    let from_int = function
      | 1 -> AfraidOf
      | 2 -> Poor
      | 4 -> Slow
      | 14 -> NoFlyingBalm
      | 15 -> NoFamiliar
      | 21 -> MagicalRestriction
      | 23 -> DecreasedArcanePower
      | 24 -> DecreasedKarmaPoints
      | 25 -> DecreasedLifePoints
      | 26 -> DecreasedSpirit
      | 27 -> DecreasedToughness
      | 28 -> BadLuck
      | 30 -> PersonalityFlaw
      | 31 -> Principles
      | 33 -> BadHabit
      | 34 -> NegativeTrait
      | 42 -> Stigma
      | 44 -> Deaf
      | 45 -> Incompetent
      | 47 -> Obligations
      | 48 -> Maimed
      | 56 -> BrittleBones
      | 64 -> SmallSpellSelection
      | 70 -> WenigePredigten
      | 71 -> WenigeVisionen
      | x -> Other x

    let to_int = function
      | AfraidOf -> 1
      | Poor -> 2
      | Slow -> 4
      | NoFlyingBalm -> 14
      | NoFamiliar -> 15
      | MagicalRestriction -> 21
      | DecreasedArcanePower -> 23
      | DecreasedKarmaPoints -> 24
      | DecreasedLifePoints -> 25
      | DecreasedSpirit -> 26
      | DecreasedToughness -> 27
      | BadLuck -> 28
      | PersonalityFlaw -> 30
      | Principles -> 31
      | BadHabit -> 33
      | NegativeTrait -> 34
      | Stigma -> 42
      | Deaf -> 44
      | Incompetent -> 45
      | Obligations -> 47
      | Maimed -> 48
      | BrittleBones -> 56
      | SmallSpellSelection -> 64
      | WenigePredigten -> 70
      | WenigeVisionen -> 71
      | Other x -> x
  end)
end

module Skill = struct
  module Group = struct
    type t = Physical | Social | Nature | Knowledge | Craft | Other of int

    include Make (struct
      type nonrec t = t

      let from_int = function
        | 1 -> Physical
        | 2 -> Social
        | 3 -> Nature
        | 4 -> Knowledge
        | 5 -> Craft
        | x -> Other x

      let to_int = function
        | Physical -> 1
        | Social -> 2
        | Nature -> 3
        | Knowledge -> 4
        | Craft -> 5
        | Other x -> x
    end)
  end

  type t =
    (* Physical *)
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
    (* Social *)
    | Persuasion
    | Seduction
    | Intimidation
    | Etiquette
    | Streetwise
    | Empathy
    | FastTalk
    | Disguise
    | Willpower
    (* Nature *)
    | Tracking
    | Ropes
    | Fishing
    | Orienting
    | PlantLore
    | AnimalLore
    | Survival
    (* Knowledge *)
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
    (* Craft *)
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

  include Make (struct
    type nonrec t = t

    let from_int = function
      | 1 -> Flying
      | 2 -> Gaukelei
      | 3 -> Climbing
      | 4 -> BodyControl
      | 5 -> FeatOfStrength
      | 6 -> Riding
      | 7 -> Swimming
      | 8 -> SelfControl
      | 9 -> Singing
      | 10 -> Perception
      | 11 -> Dancing
      | 12 -> Pickpocket
      | 13 -> Stealth
      | 14 -> Carousing
      | 15 -> Persuasion
      | 16 -> Seduction
      | 17 -> Intimidation
      | 18 -> Etiquette
      | 19 -> Streetwise
      | 20 -> Empathy
      | 21 -> FastTalk
      | 22 -> Disguise
      | 23 -> Willpower
      | 24 -> Tracking
      | 25 -> Ropes
      | 26 -> Fishing
      | 27 -> Orienting
      | 28 -> PlantLore
      | 29 -> AnimalLore
      | 30 -> Survival
      | 31 -> Gambling
      | 32 -> Geography
      | 33 -> History
      | 34 -> Religions
      | 35 -> Warfare
      | 36 -> MagicalLore
      | 37 -> Mechanics
      | 38 -> Math
      | 39 -> Law
      | 40 -> MythsAndLegends
      | 41 -> SphereLore
      | 42 -> Astronomy
      | 43 -> Alchemy
      | 44 -> Sailing
      | 45 -> Driving
      | 46 -> Commerce
      | 47 -> TreatPoison
      | 48 -> TreatDisease
      | 49 -> TreatSoul
      | 50 -> TreatWounds
      | 51 -> Woodworking
      | 52 -> PrepareFood
      | 53 -> Leatherworking
      | 54 -> ArtisticAbility
      | 55 -> Metalworking
      | 56 -> Music
      | 57 -> PickLocks
      | 58 -> Earthencraft
      | 59 -> Clothworking
      | x -> Other x

    let to_int = function
      | Flying -> 1
      | Gaukelei -> 2
      | Climbing -> 3
      | BodyControl -> 4
      | FeatOfStrength -> 5
      | Riding -> 6
      | Swimming -> 7
      | SelfControl -> 8
      | Singing -> 9
      | Perception -> 10
      | Dancing -> 11
      | Pickpocket -> 12
      | Stealth -> 13
      | Carousing -> 14
      | Persuasion -> 15
      | Seduction -> 16
      | Intimidation -> 17
      | Etiquette -> 18
      | Streetwise -> 19
      | Empathy -> 20
      | FastTalk -> 21
      | Disguise -> 22
      | Willpower -> 23
      | Tracking -> 24
      | Ropes -> 25
      | Fishing -> 26
      | Orienting -> 27
      | PlantLore -> 28
      | AnimalLore -> 29
      | Survival -> 30
      | Gambling -> 31
      | Geography -> 32
      | History -> 33
      | Religions -> 34
      | Warfare -> 35
      | MagicalLore -> 36
      | Mechanics -> 37
      | Math -> 38
      | Law -> 39
      | MythsAndLegends -> 40
      | SphereLore -> 41
      | Astronomy -> 42
      | Alchemy -> 43
      | Sailing -> 44
      | Driving -> 45
      | Commerce -> 46
      | TreatPoison -> 47
      | TreatDisease -> 48
      | TreatSoul -> 49
      | TreatWounds -> 50
      | Woodworking -> 51
      | PrepareFood -> 52
      | Leatherworking -> 53
      | ArtisticAbility -> 54
      | Metalworking -> 55
      | Music -> 56
      | PickLocks -> 57
      | Earthencraft -> 58
      | Clothworking -> 59
      | Other x -> x
  end)
end

module MeleeCombatTechnique = struct
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

  include Make (struct
    type nonrec t = t

    let from_int = function
      | 1 -> Daggers
      | 2 -> FencingWeapons
      | 3 -> ImpactWeapons
      | 4 -> ChainWeapons
      | 5 -> Lances
      | 6 -> Brawling
      | 7 -> Shields
      | 8 -> Swords
      | 9 -> Polearms
      | 10 -> TwoHandedImpactWeapons
      | 11 -> TwoHandedSwords
      | 12 -> Whips
      | 13 -> Faecher
      | 14 -> Spiesswaffen
      | x -> Other x

    let to_int = function
      | Daggers -> 1
      | FencingWeapons -> 2
      | ImpactWeapons -> 3
      | ChainWeapons -> 4
      | Lances -> 5
      | Brawling -> 6
      | Shields -> 7
      | Swords -> 8
      | Polearms -> 9
      | TwoHandedImpactWeapons -> 10
      | TwoHandedSwords -> 11
      | Whips -> 12
      | Faecher -> 13
      | Spiesswaffen -> 14
      | Other x -> x
  end)
end

module RangedCombatTechnique = struct
  type t =
    | Crossbows
    | Bows
    | Slings
    | ThrownWeapons
    | SpittingFire
    | Blowguns
    | Discuses
    | Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function
      | 1 -> Crossbows
      | 2 -> Bows
      | 3 -> ThrownWeapons
      | 4 -> SpittingFire
      | 5 -> Slings
      | 6 -> Blowguns
      | 7 -> Discuses
      | x -> Other x

    let to_int = function
      | Crossbows -> 1
      | Bows -> 2
      | ThrownWeapons -> 3
      | SpittingFire -> 4
      | Slings -> 5
      | Blowguns -> 6
      | Discuses -> 7
      | Other x -> x
  end)
end

module Property = struct
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

  include Make (struct
    type nonrec t = t

    let from_int = function
      | 1 -> AntiMagic
      | 2 -> Demonic
      | 3 -> Influence
      | 4 -> Elemental
      | 5 -> Healing
      | 6 -> Clairvoyance
      | 7 -> Illusion
      | 8 -> Spheres
      | 9 -> Object
      | 10 -> Telekinesis
      | 11 -> Transformation
      | 12 -> Temporal
      | x -> Other x

    let to_int = function
      | AntiMagic -> 1
      | Demonic -> 2
      | Influence -> 3
      | Elemental -> 4
      | Healing -> 5
      | Clairvoyance -> 6
      | Illusion -> 7
      | Spheres -> 8
      | Object -> 9
      | Telekinesis -> 10
      | Transformation -> 11
      | Temporal -> 12
      | Other x -> x
  end)
end

module Cantrip = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module Spell = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module Ritual = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module AnimistPower = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module Aspect = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module Blessing = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module LiturgicalChant = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module Ceremony = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module GeneralSpecialAbility = struct
  module TradeSecret = struct
    type t = Other of int

    include Make (struct
      type nonrec t = t

      let from_int = function x -> Other x

      let to_int = function Other x -> x
    end)
  end

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

  include Make (struct
    type nonrec t = t

    let from_int = function
      | 9 -> SkillSpecialization
      | 12 -> TerrainKnowledge
      | 17 -> CraftInstruments
      | 18 -> Hunter
      | 22 -> AreaKnowledge
      | 27 -> Literacy
      | 29 -> Language
      | 30 -> LanguageSpecialization
      | 53 -> FireEater
      | x -> Other x

    let to_int = function
      | SkillSpecialization -> 9
      | TerrainKnowledge -> 12
      | CraftInstruments -> 17
      | Hunter -> 18
      | AreaKnowledge -> 22
      | Literacy -> 27
      | Language -> 29
      | LanguageSpecialization -> 30
      | FireEater -> 53
      | Other x -> x
  end)
end

module Script = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module Language = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module FatePointSpecialAbility = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module CombatSpecialAbility = struct
  type t =
    | CombatReflexes
    | ImprovedDodge
    | CombatStyleCombination
    | Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function
      | 12 -> CombatReflexes
      | 25 -> ImprovedDodge
      | 45 -> CombatStyleCombination
      | x -> Other x

    let to_int = function
      | CombatReflexes -> 12
      | ImprovedDodge -> 25
      | CombatStyleCombination -> 45
      | Other x -> x
  end)
end

module MagicalSpecialAbility = struct
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

  include Make (struct
    type nonrec t = t

    let from_int = function
      | 3 -> PropertyKnowledge
      | 18 -> Adaptation
      | 25 -> Exorcist
      | 31 -> FavoriteSpellwork
      | 43 -> MagicStyleCombination
      | 48 -> GrosseMeditation
      | 51 -> Imitationszauberei
      | 57 -> Kraftliniennutzung
      | x -> Other x

    let to_int = function
      | PropertyKnowledge -> 3
      | Adaptation -> 18
      | Exorcist -> 25
      | FavoriteSpellwork -> 31
      | MagicStyleCombination -> 43
      | GrosseMeditation -> 48
      | Imitationszauberei -> 51
      | Kraftliniennutzung -> 57
      | Other x -> x
  end)
end

module StaffEnchantment = struct
  module AnimalShape = struct
    type t = Other of int

    include Make (struct
      type nonrec t = t

      let from_int = function x -> Other x

      let to_int = function Other x -> x
    end)
  end

  type t = PropertyFocus | Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function 6 -> PropertyFocus | x -> Other x

    let to_int = function PropertyFocus -> 6 | Other x -> x
  end)
end

module FamiliarSpecialAbility = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module KarmaSpecialAbility = struct
  type t =
    | AspectKnowledge
    | HigherOrdination
    | FavoriteLiturgicalChant
    | Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function
      | 1 -> AspectKnowledge
      | 14 -> HigherOrdination
      | 20 -> FavoriteLiturgicalChant
      | x -> Other x

    let to_int = function
      | AspectKnowledge -> 1
      | HigherOrdination -> 14
      | FavoriteLiturgicalChant -> 20
      | Other x -> x
  end)
end

module ProtectiveWardingCircleSpecialAbility = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module CombatStyleSpecialAbility = struct
  type t = GaretherGossenStil | Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function 40 -> GaretherGossenStil | x -> Other x

    let to_int = function GaretherGossenStil -> 40 | Other x -> x
  end)
end

module AdvancedCombatSpecialAbility = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module CommandSpecialAbility = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module MagicStyleSpecialAbility = struct
  type t =
    | ScholarDerHalleDesLebensZuNorburg
    | ScholarDesKreisesDerEinfuehlung
    | MadaschwesternStil
    | ScholarDesMagierkollegsZuHoningen
    | Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function
      | 37 -> ScholarDerHalleDesLebensZuNorburg
      | 42 -> ScholarDesKreisesDerEinfuehlung
      | 55 -> MadaschwesternStil
      | 24 -> ScholarDesMagierkollegsZuHoningen
      | x -> Other x

    let to_int = function
      | ScholarDerHalleDesLebensZuNorburg -> 37
      | ScholarDesKreisesDerEinfuehlung -> 42
      | MadaschwesternStil -> 55
      | ScholarDesMagierkollegsZuHoningen -> 24
      | Other x -> x
  end)
end

module AdvancedMagicalSpecialAbility = struct
  type t = HarmoniousMagic | MatrixCasting | Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function
      | 12 -> HarmoniousMagic
      | 19 -> MatrixCasting
      | x -> Other x

    let to_int = function
      | HarmoniousMagic -> 12
      | MatrixCasting -> 19
      | Other x -> x
  end)
end

module SpellSwordEnchantment = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module DaggerRitual = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module InstrumentEnchantment = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module AttireEnchantment = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module OrbEnchantment = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module WandEnchantment = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module BrawlingSpecialAbility = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module AncestorGlyph = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module CeremonialItemSpecialAbility = struct
  type t =
    | FieldOfResearch
    | ExpertKnowledge
    | ThirstForKnowledge
    | ResearchInstinct
    | Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function
      | 32 -> FieldOfResearch
      | 33 -> ExpertKnowledge
      | 91 -> ThirstForKnowledge
      | 93 -> ResearchInstinct
      | x -> Other x

    let to_int = function
      | FieldOfResearch -> 32
      | ExpertKnowledge -> 33
      | ThirstForKnowledge -> 91
      | ResearchInstinct -> 93
      | Other x -> x
  end)
end

module Sermon = struct
  type t =
    | PredigtDerGemeinschaft
    | PredigtDerZuversicht
    | PredigtDesGottvertrauens
    | PredigtDesWohlgefallens
    | PredigtWiderMissgeschicke
    | Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function
      | 1 -> PredigtDerGemeinschaft
      | 2 -> PredigtDerZuversicht
      | 3 -> PredigtDesGottvertrauens
      | 4 -> PredigtDesWohlgefallens
      | 5 -> PredigtWiderMissgeschicke
      | x -> Other x

    let to_int = function
      | PredigtDerGemeinschaft -> 1
      | PredigtDerZuversicht -> 2
      | PredigtDesGottvertrauens -> 3
      | PredigtDesWohlgefallens -> 4
      | PredigtWiderMissgeschicke -> 5
      | Other x -> x
  end)
end

module LiturgicalStyleSpecialAbility = struct
  type t =
    | BirdsOfPassage
    | HuntressesOfTheWhiteMaiden
    | FollowersOfTheGoldenOne
    | Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function
      | 38 -> BirdsOfPassage
      | 40 -> HuntressesOfTheWhiteMaiden
      | 47 -> FollowersOfTheGoldenOne
      | x -> Other x

    let to_int = function
      | BirdsOfPassage -> 38
      | HuntressesOfTheWhiteMaiden -> 40
      | FollowersOfTheGoldenOne -> 47
      | Other x -> x
  end)
end

module AdvancedKarmaSpecialAbility = struct
  type t = MasterOfAspect | Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function 5 -> MasterOfAspect | x -> Other x

    let to_int = function MasterOfAspect -> 5 | Other x -> x
  end)
end

module Vision = struct
  type t =
    | VisionDerBestimmung
    | VisionDerEntrueckung
    | VisionDerGottheit
    | VisionDesSchicksals
    | VisionDesWahrenGlaubens
    | Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function
      | 1 -> VisionDerBestimmung
      | 2 -> VisionDerEntrueckung
      | 3 -> VisionDerGottheit
      | 4 -> VisionDesSchicksals
      | 5 -> VisionDesWahrenGlaubens
      | x -> Other x

    let to_int = function
      | VisionDerBestimmung -> 1
      | VisionDerEntrueckung -> 2
      | VisionDerGottheit -> 3
      | VisionDesSchicksals -> 4
      | VisionDesWahrenGlaubens -> 5
      | Other x -> x
  end)
end

module MagicalTradition = struct
  module ArcaneBardTradition = struct
    type t = Other of int

    include Make (struct
      type nonrec t = t

      let from_int = function x -> Other x

      let to_int = function Other x -> x
    end)
  end

  module ArcaneDancerTradition = struct
    type t = Other of int

    include Make (struct
      type nonrec t = t

      let from_int = function x -> Other x

      let to_int = function Other x -> x
    end)
  end

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

  include Make (struct
    type nonrec t = t

    let from_int = function
      | 1 -> TraditionGuildMages
      | 2 -> TraditionWitches
      | 3 -> TraditionElves
      | 4 -> TraditionDruids
      | 5 -> TraditionQabalyaMage
      | 6 -> TraditionIntuitiveMage
      | 7 -> TraditionSavant
      | 8 -> TraditionIllusionist
      | 9 -> TraditionArcaneBard
      | 10 -> TraditionArcaneDancer
      | 11 -> TraditionSchelme
      | 12 -> TraditionZauberalchimisten
      | 13 -> TraditionTsatuariaAnhaengerinnen
      | 14 -> TraditionAnimisten
      | 15 -> TraditionGeoden
      | 16 -> TraditionZibilijas
      | 17 -> TraditionBrobimGeoden
      | x -> Other x

    let to_int = function
      | TraditionGuildMages -> 1
      | TraditionWitches -> 2
      | TraditionElves -> 3
      | TraditionDruids -> 4
      | TraditionQabalyaMage -> 5
      | TraditionIntuitiveMage -> 6
      | TraditionSavant -> 7
      | TraditionIllusionist -> 8
      | TraditionArcaneBard -> 9
      | TraditionArcaneDancer -> 10
      | TraditionSchelme -> 11
      | TraditionZauberalchimisten -> 12
      | TraditionTsatuariaAnhaengerinnen -> 13
      | TraditionAnimisten -> 14
      | TraditionGeoden -> 15
      | TraditionZibilijas -> 16
      | TraditionBrobimGeoden -> 17
      | Other x -> x
  end)
end

module BlessedTradition = struct
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

  include Make (struct
    type nonrec t = t

    let from_int = function
      | 1 -> TraditionChurchOfPraios
      | 2 -> TraditionChurchOfRondra
      | 3 -> TraditionChurchOfBoron
      | 4 -> TraditionChurchOfHesinde
      | 5 -> TraditionChurchOfPhex
      | 6 -> TraditionChurchOfPeraine
      | 7 -> TraditionChurchOfEfferd
      | 8 -> TraditionChurchOfTravia
      | 9 -> TraditionChurchOfFirun
      | 10 -> TraditionChurchOfTsa
      | 11 -> TraditionChurchOfIngerimm
      | 12 -> TraditionChurchOfRahja
      | 13 -> TraditionCultOfTheNamelessOne
      | 14 -> TraditionChurchOfAves
      | 15 -> TraditionChurchOfIfirn
      | 16 -> TraditionChurchOfKor
      | 17 -> TraditionChurchOfNandus
      | 18 -> TraditionChurchOfSwafnir
      | 19 -> TraditionCultOfLevthan
      | 20 -> TraditionCultOfNuminoru
      | x -> Other x

    let to_int = function
      | TraditionChurchOfPraios -> 1
      | TraditionChurchOfRondra -> 2
      | TraditionChurchOfBoron -> 3
      | TraditionChurchOfHesinde -> 4
      | TraditionChurchOfPhex -> 5
      | TraditionChurchOfPeraine -> 6
      | TraditionChurchOfEfferd -> 7
      | TraditionChurchOfTravia -> 8
      | TraditionChurchOfFirun -> 9
      | TraditionChurchOfTsa -> 10
      | TraditionChurchOfIngerimm -> 11
      | TraditionChurchOfRahja -> 12
      | TraditionCultOfTheNamelessOne -> 13
      | TraditionChurchOfAves -> 14
      | TraditionChurchOfIfirn -> 15
      | TraditionChurchOfKor -> 16
      | TraditionChurchOfNandus -> 17
      | TraditionChurchOfSwafnir -> 18
      | TraditionCultOfLevthan -> 19
      | TraditionCultOfNuminoru -> 20
      | Other x -> x
  end)
end

module PactGift = struct
  type t = DunklesAbbildDerBuendnisgabe | Zaubervariabilitaet | Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function
      | 3 -> DunklesAbbildDerBuendnisgabe
      | 65 -> Zaubervariabilitaet
      | x -> Other x

    let to_int = function
      | DunklesAbbildDerBuendnisgabe -> 3
      | Zaubervariabilitaet -> 65
      | Other x -> x
  end)
end

module SikaryanDrainSpecialAbility = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module LycantropicGift = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module SkillStyleSpecialAbility = struct
  type t =
    | WegDerGelehrten
    | WegDerKuenstlerin
    | WegDerSchreiberin
    | Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function
      | 4 -> WegDerGelehrten
      | 8 -> WegDerKuenstlerin
      | 14 -> WegDerSchreiberin
      | x -> Other x

    let to_int = function
      | WegDerGelehrten -> 4
      | WegDerKuenstlerin -> 8
      | WegDerSchreiberin -> 14
      | Other x -> x
  end)
end

module AdvancedSkillSpecialAbility = struct
  type t =
    | Fachwissen
    | Handwerkskunst
    | KindDerNatur
    | KoerperlichesGeschick
    | SozialeKompetenz
    | Universalgenie
    | Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function
      | 7 -> Fachwissen
      | 15 -> Handwerkskunst
      | 17 -> KindDerNatur
      | 19 -> KoerperlichesGeschick
      | 30 -> SozialeKompetenz
      | 34 -> Universalgenie
      | x -> Other x

    let to_int = function
      | Fachwissen -> 7
      | Handwerkskunst -> 15
      | KindDerNatur -> 17
      | KoerperlichesGeschick -> 19
      | SozialeKompetenz -> 30
      | Universalgenie -> 34
      | Other x -> x
  end)
end

module ArcaneOrbEnchantment = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module CauldronEnchantment = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module FoolsHatEnchantment = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module ToyEnchantment = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module BowlEnchantment = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module FatePointSexSpecialAbility = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module SexSpecialAbility = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module WeaponEnchantment = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module SickleRitual = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module RingEnchantment = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module ChronicleEnchantment = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module Element = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module SexPractice = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module Poison = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end

module Disease = struct
  type t = Other of int

  include Make (struct
    type nonrec t = t

    let from_int = function x -> Other x

    let to_int = function Other x -> x
  end)
end
