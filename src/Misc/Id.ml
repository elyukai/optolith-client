module DecodeUtils = struct
  let tag inner = Json.Decode.(field "type" string |> andThen inner)

  let value f = Json.Decode.(field "value" int |> map f)

  let raiseUnknownScope ~scopeName ~invalidValue =
    raise
      (Json.Decode.DecodeError
         ( "Unknown scope id of scope range \"" ^ scopeName ^ "\": "
         ^ invalidValue ))
end

module OrdUtils = struct
  let makeCompare outerToInt innerToInt x y =
    let x' = outerToInt x in
    let y' = outerToInt y in

    if x' == y' then innerToInt x - innerToInt y else x' - y'
end

module All = struct
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

  let outerToInt = function
    | ExperienceLevel _ -> 1
    | Race _ -> 2
    | Culture _ -> 3
    | Profession _ -> 4
    | Attribute _ -> 5
    | Advantage _ -> 6
    | Disadvantage _ -> 7
    | Skill _ -> 8
    | CombatTechnique _ -> 9
    | Spell _ -> 10
    | Curse _ -> 11
    | ElvenMagicalSong _ -> 12
    | DominationRitual _ -> 13
    | MagicalMelody _ -> 14
    | MagicalDance _ -> 15
    | RogueSpell _ -> 16
    | AnimistForce _ -> 17
    | GeodeRitual _ -> 18
    | ZibiljaRitual _ -> 19
    | Cantrip _ -> 20
    | LiturgicalChant _ -> 21
    | Blessing _ -> 22
    | SpecialAbility _ -> 23
    | Item _ -> 24
    | EquipmentPackage _ -> 25
    | HitZoneArmor _ -> 26
    | Familiar _ -> 27
    | Animal _ -> 28
    | FocusRule _ -> 29
    | OptionalRule _ -> 30
    | Condition _ -> 31
    | State _ -> 32

  let innerToInt = function
    | ExperienceLevel x
    | Race x
    | Culture x
    | Profession x
    | Attribute x
    | Advantage x
    | Disadvantage x
    | Skill x
    | CombatTechnique x
    | Spell x
    | Curse x
    | ElvenMagicalSong x
    | DominationRitual x
    | MagicalMelody x
    | MagicalDance x
    | RogueSpell x
    | AnimistForce x
    | GeodeRitual x
    | ZibiljaRitual x
    | Cantrip x
    | LiturgicalChant x
    | Blessing x
    | SpecialAbility x
    | Item x
    | EquipmentPackage x
    | HitZoneArmor x
    | Familiar x
    | Animal x
    | FocusRule x
    | OptionalRule x
    | Condition x
    | State x ->
        x

  let compare = OrdUtils.makeCompare outerToInt innerToInt

  let ( = ) x y = compare x y == 0
end

module ActivatableAndSkill = struct
  type t =
    | Advantage of int
    | Disadvantage of int
    | SpecialAbility of int
    | Spell of int
    | LiturgicalChant of int
end

module ActivatableSkill = struct
  type t = Spell of int | LiturgicalChant of int
end

module PermanentSkill = struct
  type t = Skill of int | CombatTechnique of int
end

module Increasable = struct
  type t =
    | Attribute of int
    | Skill of int
    | MeleeCombatTechnique of int
    | RangedCombatTechnique of int
    | Spell of int
    | Ritual of int
    | LiturgicalChant of int
    | Ceremony of int

  module Decode = struct
    let t =
      DecodeUtils.(
        tag (function
          | "Attribute" -> value (fun x -> Attribute x)
          | "Skill" -> value (fun x -> Skill x)
          | "MeleeCombatTechnique" -> value (fun x -> MeleeCombatTechnique x)
          | "RangedCombatTechnique" -> value (fun x -> RangedCombatTechnique x)
          | "Spell" -> value (fun x -> Spell x)
          | "Ritual" -> value (fun x -> Ritual x)
          | "LiturgicalChant" -> value (fun x -> LiturgicalChant x)
          | "Ceremony" -> value (fun x -> Ceremony x)
          | scope ->
              raiseUnknownScope ~scopeName:"Increasable" ~invalidValue:scope))
  end
end

module CombatTechnique = struct
  type t = MeleeCombatTechnique of int | RangedCombatTechnique of int

  module Decode = struct
    let t =
      DecodeUtils.(
        tag (function
          | "MeleeCombatTechnique" -> value (fun x -> MeleeCombatTechnique x)
          | "RangedCombatTechnique" -> value (fun x -> RangedCombatTechnique x)
          | scope ->
              raiseUnknownScope ~scopeName:"CombatTechnique" ~invalidValue:scope))
  end
end

module Spellwork = struct
  type t = Spell of int | Ritual of int

  module Decode = struct
    let t =
      DecodeUtils.(
        tag (function
          | "Spell" -> value (fun x -> Spell x)
          | "Ritual" -> value (fun x -> Ritual x)
          | scope ->
              raiseUnknownScope ~scopeName:"Spellwork" ~invalidValue:scope))
  end
end

module LiturgicalChant = struct
  type t = LiturgicalChant of int | Ceremony of int

  module Decode = struct
    let t =
      DecodeUtils.(
        tag (function
          | "LiturgicalChant" -> value (fun x -> LiturgicalChant x)
          | "Ceremony" -> value (fun x -> Ceremony x)
          | scope ->
              raiseUnknownScope ~scopeName:"LiturgicalChant" ~invalidValue:scope))
  end
end

module PrerequisiteSource = struct
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

module HitZoneArmorZoneItem = struct
  type t = Template of int | Custom of int
end

module Phase = struct
  type t = Outline | Definition | Advancement

  let fromInt = function
    | 1 -> Ok Outline
    | 2 -> Ok Definition
    | 3 -> Ok Advancement
    | x -> Error x

  let toInt = function Outline -> 1 | Definition -> 2 | Advancement -> 3
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

  let fromInt = function
    | 1 -> Ok Inexperienced
    | 2 -> Ok Ordinary
    | 3 -> Ok Experienced
    | 4 -> Ok Competent
    | 5 -> Ok Masterly
    | 6 -> Ok Brilliant
    | 7 -> Ok Legendary
    | x -> Error x

  let toInt = function
    | Inexperienced -> 1
    | Ordinary -> 2
    | Experienced -> 3
    | Competent -> 4
    | Masterly -> 5
    | Brilliant -> 6
    | Legendary -> 7
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

  let fromInt = function
    | 1 -> Ok Courage
    | 2 -> Ok Sagacity
    | 3 -> Ok Intuition
    | 4 -> Ok Charisma
    | 5 -> Ok Dexterity
    | 6 -> Ok Agility
    | 7 -> Ok Constitution
    | 8 -> Ok Strength
    | x -> Error x

  let toInt = function
    | Courage -> 1
    | Sagacity -> 2
    | Intuition -> 3
    | Charisma -> 4
    | Dexterity -> 5
    | Agility -> 6
    | Constitution -> 7
    | Strength -> 8
end

module DerivedCharacteristic = struct
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

  let fromString = function
    | "LP" -> Ok LifePoints
    | "AE" -> Ok ArcaneEnergy
    | "KP" -> Ok KarmaPoints
    | "SPI" -> Ok Spirit
    | "TOU" -> Ok Toughness
    | "DO" -> Ok Dodge
    | "INI" -> Ok Initiative
    | "MOV" -> Ok Movement
    | "WT" -> Ok WoundThreshold
    | x -> Error x

  let toString = function
    | LifePoints -> "LP"
    | ArcaneEnergy -> "AE"
    | KarmaPoints -> "KP"
    | Spirit -> "SPI"
    | Toughness -> "TOU"
    | Dodge -> "DO"
    | Initiative -> "INI"
    | Movement -> "MOV"
    | WoundThreshold -> "WT"
end

module Pact = struct
  type t = Faery | Demon | Other of int

  let fromInt = function 1 -> Faery | 2 -> Demon | x -> Other x

  let toInt = function Faery -> 1 | Demon -> 2 | Other x -> x
end

module SocialStatus = struct
  type t = NotFree | Free | LesserNoble | Noble | Aristocracy

  let fromInt = function
    | 1 -> Ok NotFree
    | 2 -> Ok Free
    | 3 -> Ok LesserNoble
    | 4 -> Ok Noble
    | 5 -> Ok Aristocracy
    | x -> Error x

  let toInt = function
    | NotFree -> 1
    | Free -> 2
    | LesserNoble -> 3
    | Noble -> 4
    | Aristocracy -> 5
end

module OptionalRule = struct
  type t =
    | MaximumAttributeScores
    | LanguageSpecialization
    | HigherDefenseStats
    | Other of int

  let fromInt = function
    | 8 -> MaximumAttributeScores
    | 15 -> LanguageSpecialization
    | 17 -> HigherDefenseStats
    | x -> Other x

  let toInt = function
    | MaximumAttributeScores -> 8
    | LanguageSpecialization -> 15
    | HigherDefenseStats -> 17
    | Other x -> x
end

module Advantage = struct
  type t =
    | Aptitude (* Begabung *)
    | Nimble (* Flink *)
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
    | Unyielding (* Eisern *)
    | LargeSpellSelection
    | HatredFor
    | Prediger
    | Visionaer
    | ZahlreichePredigten
    | ZahlreicheVisionen
    | LeichterGang
    | Einkommen
    | Other of int

  let fromInt = function
    | 4 -> Aptitude
    | 9 -> Nimble
    | 12 -> Blessed
    | 14 -> Luck
    | 16 -> ExceptionalSkill
    | 17 -> ExceptionalCombatTechnique
    | 23 -> IncreasedAstralPower
    | 24 -> IncreasedKarmaPoints
    | 25 -> IncreasedLifePoints
    | 26 -> IncreasedSpirit
    | 27 -> IncreasedToughness
    | 28 -> ImmunityToPoison
    | 29 -> ImmunityToDisease
    | 32 -> MagicalAttunement
    | 36 -> Rich
    | 40 -> SociallyAdaptable
    | 46 -> InspireConfidence
    | 47 -> WeaponAptitude
    | 50 -> Spellcaster
    | 54 -> Unyielding
    | 58 -> LargeSpellSelection
    | 68 -> HatredFor
    | 77 -> Prediger
    | 78 -> Visionaer
    | 79 -> ZahlreichePredigten
    | 80 -> ZahlreicheVisionen
    | 92 -> LeichterGang
    | 99 -> Einkommen
    | x -> Other x

  let toInt = function
    | Aptitude -> 4
    | Nimble -> 9
    | Blessed -> 12
    | Luck -> 14
    | ExceptionalSkill -> 16
    | ExceptionalCombatTechnique -> 17
    | IncreasedAstralPower -> 23
    | IncreasedKarmaPoints -> 24
    | IncreasedLifePoints -> 25
    | IncreasedSpirit -> 26
    | IncreasedToughness -> 27
    | ImmunityToPoison -> 28
    | ImmunityToDisease -> 29
    | MagicalAttunement -> 32
    | Rich -> 36
    | SociallyAdaptable -> 40
    | InspireConfidence -> 46
    | WeaponAptitude -> 47
    | Spellcaster -> 50
    | Unyielding -> 54
    | LargeSpellSelection -> 58
    | HatredFor -> 68
    | Prediger -> 77
    | Visionaer -> 78
    | ZahlreichePredigten -> 79
    | ZahlreicheVisionen -> 80
    | LeichterGang -> 92
    | Einkommen -> 99
    | Other x -> x
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
    | NegativeTrait (* Schlechte Eigenschaft *)
    | Stigma
    | Deaf (* Taub *)
    | Incompetent
    | Obligations (* Verpflichtungen *)
    | Maimed (* Verstümmelt *)
    | BrittleBones (* Gläsern *)
    | SmallSpellSelection
    | WenigePredigten
    | WenigeVisionen
    | Other of int

  let fromInt = function
    | 1 -> AfraidOf
    | 2 -> Poor
    | 4 -> Slow
    | 17 -> NoFlyingBalm
    | 18 -> NoFamiliar
    | 24 -> MagicalRestriction
    | 26 -> DecreasedArcanePower
    | 27 -> DecreasedKarmaPoints
    | 28 -> DecreasedLifePoints
    | 29 -> DecreasedSpirit
    | 30 -> DecreasedToughness
    | 31 -> BadLuck
    | 33 -> PersonalityFlaw
    | 34 -> Principles
    | 36 -> BadHabit
    | 37 -> NegativeTrait
    | 45 -> Stigma
    | 47 -> Deaf
    | 48 -> Incompetent
    | 50 -> Obligations
    | 51 -> Maimed
    | 56 -> BrittleBones
    | 59 -> SmallSpellSelection
    | 72 -> WenigePredigten
    | 73 -> WenigeVisionen
    | x -> Other x

  let toInt = function
    | AfraidOf -> 1
    | Poor -> 2
    | Slow -> 4
    | NoFlyingBalm -> 17
    | NoFamiliar -> 18
    | MagicalRestriction -> 24
    | DecreasedArcanePower -> 26
    | DecreasedKarmaPoints -> 27
    | DecreasedLifePoints -> 28
    | DecreasedSpirit -> 29
    | DecreasedToughness -> 30
    | BadLuck -> 31
    | PersonalityFlaw -> 33
    | Principles -> 34
    | BadHabit -> 36
    | NegativeTrait -> 37
    | Stigma -> 45
    | Deaf -> 47
    | Incompetent -> 48
    | Obligations -> 50
    | Maimed -> 51
    | BrittleBones -> 56
    | SmallSpellSelection -> 59
    | WenigePredigten -> 72
    | WenigeVisionen -> 73
    | Other x -> x
end

module Skill = struct
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

  let fromInt = function
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

  let toInt = function
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

  module Group = struct
    type t = Physical | Social | Nature | Knowledge | Craft

    let fromInt = function
      | 1 -> Ok Physical
      | 2 -> Ok Social
      | 3 -> Ok Nature
      | 4 -> Ok Knowledge
      | 5 -> Ok Craft
      | x -> Error x

    let toInt = function
      | Physical -> 1
      | Social -> 2
      | Nature -> 3
      | Knowledge -> 4
      | Craft -> 5
  end
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
    | Faecher
    | Spiesswaffen
    | Other of int

  let fromInt = function
    | 3 -> Daggers
    | 4 -> FencingWeapons
    | 5 -> ImpactWeapons
    | 6 -> ChainWeapons
    | 7 -> Lances
    | 9 -> Brawling
    | 10 -> Shields
    | 12 -> Swords
    | 13 -> Polearms
    | 15 -> TwoHandedImpactWeapons
    | 16 -> TwoHandedSwords
    | 20 -> Faecher
    | 21 -> Spiesswaffen
    | x -> Other x

  let toInt = function
    | Daggers -> 3
    | FencingWeapons -> 4
    | ImpactWeapons -> 5
    | ChainWeapons -> 6
    | Lances -> 7
    | Brawling -> 9
    | Shields -> 10
    | Swords -> 12
    | Polearms -> 13
    | TwoHandedImpactWeapons -> 15
    | TwoHandedSwords -> 16
    | Faecher -> 20
    | Spiesswaffen -> 21
    | Other x -> x
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

  let fromInt = function
    | 1 -> Crossbows
    | 2 -> Bows
    | 11 -> Slings
    | 14 -> ThrownWeapons
    | 17 -> SpittingFire
    | 18 -> Blowguns
    | 19 -> Discuses
    | x -> Other x

  let toInt = function
    | Crossbows -> 1
    | Bows -> 2
    | Slings -> 11
    | ThrownWeapons -> 14
    | SpittingFire -> 17
    | Blowguns -> 18
    | Discuses -> 19
    | Other x -> x
end

module MagicalTradition = struct
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

  let fromInt = function
    | 1 -> General
    | 2 -> GuildMages
    | 3 -> Witches
    | 4 -> Elves
    | 5 -> Druids
    | 6 -> Scharlatane
    | 7 -> ArcaneBards
    | 8 -> ArcaneDancers
    | 9 -> IntuitiveZauberer
    | 10 -> Meistertalentierte
    | 11 -> Qabalyamagier
    | 12 -> Kristallomanten
    | 13 -> Geodes
    | 14 -> Alchimisten
    | 15 -> Rogues
    | 16 -> Animists
    | 17 -> Zibilija
    | 18 -> BrobimGeoden
    | x -> Other x

  let toInt = function
    | General -> 1
    | GuildMages -> 2
    | Witches -> 3
    | Elves -> 4
    | Druids -> 5
    | Scharlatane -> 6
    | ArcaneBards -> 7
    | ArcaneDancers -> 8
    | IntuitiveZauberer -> 9
    | Meistertalentierte -> 10
    | Qabalyamagier -> 11
    | Kristallomanten -> 12
    | Geodes -> 13
    | Alchimisten -> 14
    | Rogues -> 15
    | Animists -> 16
    | Zibilija -> 17
    | BrobimGeoden -> 18
    | Other x -> x
end

module Spell = struct
  module Group = struct
    type t = Spells | Rituals

    let fromInt = function 1 -> Ok Spells | 2 -> Ok Rituals | x -> Error x

    let toInt = function Spells -> 1 | Rituals -> 2
  end
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
    | Objekt
    | Telekinesis
    | Transformation
    | Temporal
    | Other of int

  let fromInt = function
    | 1 -> AntiMagic
    | 2 -> Demonic
    | 3 -> Influence
    | 4 -> Elemental
    | 5 -> Healing
    | 6 -> Clairvoyance
    | 7 -> Illusion
    | 8 -> Spheres
    | 9 -> Objekt
    | 10 -> Telekinesis
    | 11 -> Transformation
    | 12 -> Temporal
    | x -> Other x

  let toInt = function
    | AntiMagic -> 1
    | Demonic -> 2
    | Influence -> 3
    | Elemental -> 4
    | Healing -> 5
    | Clairvoyance -> 6
    | Illusion -> 7
    | Spheres -> 8
    | Objekt -> 9
    | Telekinesis -> 10
    | Transformation -> 11
    | Temporal -> 12
    | Other x -> x
end

module SpecialAbility = struct
  module GeneralSpecialAbility = struct
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

    let fromInt = function
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

    let toInt = function
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
  end

  module FatePointSpecialAbility = struct
    type t = Other of int

    let fromInt = function x -> Other x

    let toInt = function Other x -> x
  end

  module CombatSpecialAbility = struct
    type t =
      | CombatReflexes
      | ImprovedDodge
      | CombatStyleCombination
      | Other of int

    let fromInt = function
      | 12 -> CombatReflexes
      | 25 -> ImprovedDodge
      | 45 -> CombatStyleCombination
      | x -> Other x

    let toInt = function
      | CombatReflexes -> 12
      | ImprovedDodge -> 25
      | CombatStyleCombination -> 45
      | Other x -> x
  end

  module MagicalSpecialAbility = struct
    type t =
      | PropertyKnowledge
      | Adaptation
      | Exorcist
      | FavoriteSpellwork (* Lieblingszauber *)
      | MagicStyleCombination
      | GrosseMeditation
      | Imitationszauberei
      | Kraftliniennutzung
      | Other of int

    let fromInt = function
      | 3 -> PropertyKnowledge
      | 18 -> Adaptation
      | 25 -> Exorcist
      | 31 -> FavoriteSpellwork
      | 43 -> MagicStyleCombination
      | 48 -> GrosseMeditation
      | 51 -> Imitationszauberei
      | 57 -> Kraftliniennutzung
      | x -> Other x

    let toInt = function
      | PropertyKnowledge -> 3
      | Adaptation -> 18
      | Exorcist -> 25
      | FavoriteSpellwork -> 31
      | MagicStyleCombination -> 43
      | GrosseMeditation -> 48
      | Imitationszauberei -> 51
      | Kraftliniennutzung -> 57
      | Other x -> x
  end

  module StaffEnchantment = struct
    type t = PropertyFocus | Other of int

    let fromInt = function 6 -> PropertyFocus | x -> Other x

    let toInt = function PropertyFocus -> 6 | Other x -> x
  end

  module FamiliarSpecialAbility = struct
    type t = Other of int

    let fromInt = function x -> Other x

    let toInt = function Other x -> x
  end

  module KarmaSpecialAbility = struct
    type t =
      | AspectKnowledge
      | HigherOrdination
      | FavoriteLiturgicalChant
      | Other of int

    let fromInt = function
      | 1 -> AspectKnowledge
      | 14 -> HigherOrdination
      | 20 -> FavoriteLiturgicalChant
      | x -> Other x

    let toInt = function
      | AspectKnowledge -> 1
      | HigherOrdination -> 14
      | FavoriteLiturgicalChant -> 20
      | Other x -> x
  end

  module ProtectiveWardingCircleSpecialAbility = struct
    type t = Other of int

    let fromInt = function x -> Other x

    let toInt = function Other x -> x
  end

  module CombatStyleSpecialAbility = struct
    type t = GaretherGossenStil | Other of int

    let fromInt = function x -> Other x

    let toInt = function Other x -> x
  end

  module AdvancedCombatSpecialAbility = struct
    type t = Other of int

    let fromInt = function x -> Other x

    let toInt = function Other x -> x
  end

  module CommandSpecialAbility = struct
    type t = Other of int

    let fromInt = function x -> Other x

    let toInt = function Other x -> x
  end

  module MagicStyleSpecialAbility = struct
    type t =
      | ScholarDerHalleDesLebensZuNorburg
      | ScholarDesKreisesDerEinfuehlung
      | MadaschwesternStil
      | ScholarDesMagierkollegsZuHoningen
      | Other of int

    let fromInt = function x -> Other x

    let toInt = function Other x -> x
  end

  module AdvancedMagicalSpecialAbility = struct
    type t = HarmoniousMagic | MatrixCasting | Other of int

    let fromInt = function
      | 12 -> HarmoniousMagic
      | 19 -> MatrixCasting
      | x -> Other x

    let toInt = function
      | HarmoniousMagic -> 12
      | MatrixCasting -> 19
      | Other x -> x
  end

  module SpellSwordEnchantment = struct
    type t = Other of int

    let fromInt = function x -> Other x

    let toInt = function Other x -> x
  end

  module DaggerRitual = struct
    type t = Other of int

    let fromInt = function x -> Other x

    let toInt = function Other x -> x
  end

  module InstrumentEnchantment = struct
    type t = Other of int

    let fromInt = function x -> Other x

    let toInt = function Other x -> x
  end

  module AttireEnchantment = struct
    type t = Other of int

    let fromInt = function x -> Other x

    let toInt = function Other x -> x
  end

  module OrbEnchantment = struct
    type t = Other of int

    let fromInt = function x -> Other x

    let toInt = function Other x -> x
  end

  module WandEnchantment = struct
    type t = Other of int

    let fromInt = function x -> Other x

    let toInt = function Other x -> x
  end

  module BrawlingSpecialAbility = struct
    type t = Other of int

    let fromInt = function x -> Other x

    let toInt = function Other x -> x
  end

  module AncestorGlyph = struct
    type t = Other of int

    let fromInt = function x -> Other x

    let toInt = function Other x -> x
  end

  module CeremonialItemSpecialAbility = struct
    type t =
      | FieldOfResearch
      | ExpertKnowledge
      | ThirstForKnowledge
      | ResearchInstinct
      | Other of int

    let fromInt = function
      | 32 -> FieldOfResearch
      | 33 -> ExpertKnowledge
      | 91 -> ThirstForKnowledge
      | 93 -> ResearchInstinct
      | x -> Other x

    let toInt = function
      | FieldOfResearch -> 32
      | ExpertKnowledge -> 33
      | ThirstForKnowledge -> 91
      | ResearchInstinct -> 93
      | Other x -> x
  end

  module Sermon = struct
    type t =
      | PredigtDerGemeinschaft
      | PredigtDerZuversicht
      | PredigtDesGottvertrauens
      | PredigtDesWohlgefallens
      | PredigtWiderMissgeschicke
      | Other of int

    let fromInt = function
      | 1 -> PredigtDerGemeinschaft
      | 2 -> PredigtDerZuversicht
      | 3 -> PredigtDesGottvertrauens
      | 4 -> PredigtDesWohlgefallens
      | 5 -> PredigtWiderMissgeschicke
      | x -> Other x

    let toInt = function
      | PredigtDerGemeinschaft -> 1
      | PredigtDerZuversicht -> 2
      | PredigtDesGottvertrauens -> 3
      | PredigtDesWohlgefallens -> 4
      | PredigtWiderMissgeschicke -> 5
      | Other x -> x
  end

  module LiturgicalStyleSpecialAbility = struct
    type t =
      | BirdsOfPassage
      | HuntressesOfTheWhiteMaiden
      | FollowersOfTheGoldenOne
      | Other of int

    let fromInt = function x -> Other x

    let toInt = function Other x -> x
  end

  module AdvancedKarmaSpecialAbility = struct
    type t = MasterOfAspect | Other of int

    let fromInt = function 5 -> MasterOfAspect | x -> Other x

    let toInt = function MasterOfAspect -> 5 | Other x -> x
  end

  module Vision = struct
    type t =
      | VisionDerBestimmung
      | VisionDerEntrueckung
      | VisionDerGottheit
      | VisionDesSchicksals
      | VisionDesWahrenGlaubens
      | Other of int

    let fromInt = function
      | 1 -> VisionDerBestimmung
      | 2 -> VisionDerEntrueckung
      | 3 -> VisionDerGottheit
      | 4 -> VisionDesSchicksals
      | 5 -> VisionDesWahrenGlaubens
      | x -> Other x

    let toInt = function
      | VisionDerBestimmung -> 1
      | VisionDerEntrueckung -> 2
      | VisionDerGottheit -> 3
      | VisionDesSchicksals -> 4
      | VisionDesWahrenGlaubens -> 5
      | Other x -> x
  end

  module MagicalTradition = struct
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

    let fromInt = function
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

    let toInt = function
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

    let fromInt = function
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

    let toInt = function
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
  end

  module Paktgeschenk = struct
    type t = DunklesAbbildDerBuendnisgabe | Zaubervariabilitaet | Other of int

    let fromInt = function
      | 3 -> DunklesAbbildDerBuendnisgabe
      | 65 -> Zaubervariabilitaet
      | x -> Other x

    let toInt = function
      | DunklesAbbildDerBuendnisgabe -> 3
      | Zaubervariabilitaet -> 65
      | Other x -> x
  end

  module SikaryanRaubSonderfertigkeit = struct
    type t = Other of int

    let fromInt = function x -> Other x

    let toInt = function Other x -> x
  end

  module LykanthropischeGabe = struct
    type t = Other of int

    let fromInt = function x -> Other x

    let toInt = function Other x -> x
  end

  module Talentstilsonderfertigkeit = struct
    type t =
      | WegDerGelehrten
      | WegDerKuenstlerin
      | WegDerSchreiberin
      | Other of int

    let fromInt = function
      | 4 -> WegDerGelehrten
      | 8 -> WegDerKuenstlerin
      | 14 -> WegDerSchreiberin
      | x -> Other x

    let toInt = function
      | WegDerGelehrten -> 4
      | WegDerKuenstlerin -> 8
      | WegDerSchreiberin -> 14
      | Other x -> x
  end

  module ErweiterteTalentsonderfertigkeit = struct
    type t =
      | Fachwissen
      | Handwerkskunst
      | KindDerNatur
      | KoerperlichesGeschick
      | SozialeKompetenz
      | Universalgenie
      | Other of int

    let fromInt = function
      | 7 -> Fachwissen
      | 15 -> Handwerkskunst
      | 17 -> KindDerNatur
      | 19 -> KoerperlichesGeschick
      | 30 -> SozialeKompetenz
      | 34 -> Universalgenie
      | x -> Other x

    let toInt = function
      | Fachwissen -> 7
      | Handwerkskunst -> 15
      | KindDerNatur -> 17
      | KoerperlichesGeschick -> 19
      | SozialeKompetenz -> 30
      | Universalgenie -> 34
      | Other x -> x
  end

  module Kugelzauber = struct
    type t = Other of int

    let fromInt = function x -> Other x

    let toInt = function Other x -> x
  end

  module Kesselzauber = struct
    type t = Other of int

    let fromInt = function x -> Other x

    let toInt = function Other x -> x
  end

  module Kappenzauber = struct
    type t = Other of int

    let fromInt = function x -> Other x

    let toInt = function Other x -> x
  end

  module Spielzeugzauber = struct
    type t = Other of int

    let fromInt = function x -> Other x

    let toInt = function Other x -> x
  end

  module Schalenzauber = struct
    type t = Other of int

    let fromInt = function x -> Other x

    let toInt = function Other x -> x
  end

  module SexSchicksalspunkteSonderfertigkeit = struct
    type t = Other of int

    let fromInt = function x -> Other x

    let toInt = function Other x -> x
  end

  module SexSonderfertigkeit = struct
    type t = Other of int

    let fromInt = function x -> Other x

    let toInt = function Other x -> x
  end

  module Waffenzauber = struct
    type t = Other of int

    let fromInt = function x -> Other x

    let toInt = function Other x -> x
  end

  module Sichelritual = struct
    type t = Other of int

    let fromInt = function x -> Other x

    let toInt = function Other x -> x
  end

  module Ringzauber = struct
    type t = Other of int

    let fromInt = function x -> Other x

    let toInt = function Other x -> x
  end

  module Chronikzauber = struct
    type t = Other of int

    let fromInt = function x -> Other x

    let toInt = function Other x -> x
  end

  type t =
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

  module Nested = struct
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
end

module Activatable = struct
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

  (* let toAll = function
     | Advantage x -> All.Advantage x
     | Disadvantage x -> All.Disadvantage x
     | SpecialAbility x -> All.SpecialAbility x *)

  (* let ( = ) x y =
     match[@warning "-4"] ((x : t), (y : t)) with
     | Advantage x, Advantage y
     | Disadvantage x, Disadvantage y
     | SpecialAbility x, SpecialAbility y ->
         x == y
     | _ -> false *)

  module Decode = struct
    let t =
      DecodeUtils.(
        tag (function
          | "Advantage" -> value (fun x -> Advantage x)
          | "Disadvantage" -> value (fun x -> Disadvantage x)
          | "GeneralSpecialAbility" -> value (fun x -> GeneralSpecialAbility x)
          | "FatePointSpecialAbility" ->
              value (fun x -> FatePointSpecialAbility x)
          | "CombatSpecialAbility" -> value (fun x -> CombatSpecialAbility x)
          | "MagicalSpecialAbility" -> value (fun x -> MagicalSpecialAbility x)
          | "StaffEnchantment" -> value (fun x -> StaffEnchantment x)
          | "FamiliarSpecialAbility" ->
              value (fun x -> FamiliarSpecialAbility x)
          | "KarmaSpecialAbility" -> value (fun x -> KarmaSpecialAbility x)
          | "ProtectiveWardingCircleSpecialAbility" ->
              value (fun x -> ProtectiveWardingCircleSpecialAbility x)
          | "CombatStyleSpecialAbility" ->
              value (fun x -> CombatStyleSpecialAbility x)
          | "AdvancedCombatSpecialAbility" ->
              value (fun x -> AdvancedCombatSpecialAbility x)
          | "CommandSpecialAbility" -> value (fun x -> CommandSpecialAbility x)
          | "MagicStyleSpecialAbility" ->
              value (fun x -> MagicStyleSpecialAbility x)
          | "AdvancedMagicalSpecialAbility" ->
              value (fun x -> AdvancedMagicalSpecialAbility x)
          | "SpellSwordEnchantment" -> value (fun x -> SpellSwordEnchantment x)
          | "DaggerRitual" -> value (fun x -> DaggerRitual x)
          | "InstrumentEnchantment" -> value (fun x -> InstrumentEnchantment x)
          | "AttireEnchantment" -> value (fun x -> AttireEnchantment x)
          | "OrbEnchantment" -> value (fun x -> OrbEnchantment x)
          | "WandEnchantment" -> value (fun x -> WandEnchantment x)
          | "BrawlingSpecialAbility" ->
              value (fun x -> BrawlingSpecialAbility x)
          | "AncestorGlyph" -> value (fun x -> AncestorGlyph x)
          | "CeremonialItemSpecialAbility" ->
              value (fun x -> CeremonialItemSpecialAbility x)
          | "Sermon" -> value (fun x -> Sermon x)
          | "LiturgicalStyleSpecialAbility" ->
              value (fun x -> LiturgicalStyleSpecialAbility x)
          | "AdvancedKarmaSpecialAbility" ->
              value (fun x -> AdvancedKarmaSpecialAbility x)
          | "Vision" -> value (fun x -> Vision x)
          | "MagicalTradition" -> value (fun x -> MagicalTradition x)
          | "BlessedTradition" -> value (fun x -> BlessedTradition x)
          | "Paktgeschenk" -> value (fun x -> Paktgeschenk x)
          | "SikaryanRaubSonderfertigkeit" ->
              value (fun x -> SikaryanRaubSonderfertigkeit x)
          | "LykanthropischeGabe" -> value (fun x -> LykanthropischeGabe x)
          | "Talentstilsonderfertigkeit" ->
              value (fun x -> Talentstilsonderfertigkeit x)
          | "ErweiterteTalentsonderfertigkeit" ->
              value (fun x -> ErweiterteTalentsonderfertigkeit x)
          | "Kugelzauber" -> value (fun x -> Kugelzauber x)
          | "Kesselzauber" -> value (fun x -> Kesselzauber x)
          | "Kappenzauber" -> value (fun x -> Kappenzauber x)
          | "Spielzeugzauber" -> value (fun x -> Spielzeugzauber x)
          | "Schalenzauber" -> value (fun x -> Schalenzauber x)
          | "SexSchicksalspunkteSonderfertigkeit" ->
              value (fun x -> SexSchicksalspunkteSonderfertigkeit x)
          | "SexSonderfertigkeit" -> value (fun x -> SexSonderfertigkeit x)
          | "Waffenzauber" -> value (fun x -> Waffenzauber x)
          | "Sichelritual" -> value (fun x -> Sichelritual x)
          | "Ringzauber" -> value (fun x -> Ringzauber x)
          | "Chronikzauber" -> value (fun x -> Chronikzauber x)
          | scope ->
              raiseUnknownScope ~scopeName:"Activatable" ~invalidValue:scope))
  end

  module SelectOption = struct
    type t =
      | Generic of int
      | Blessing of int
      | Cantrip of int
      | TradeSecret of int
      | Language of int
      | Script of int
      | AnimalShape of int
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

    let outerToInt = function
      | Generic _ -> 1
      | Blessing _ -> 2
      | Cantrip _ -> 3
      | TradeSecret _ -> 4
      | Language _ -> 5
      | Script _ -> 6
      | AnimalShape _ -> 7
      | ArcaneBardTradition _ -> 8
      | ArcaneDancerTradition _ -> 9
      | Element _ -> 10
      | Property _ -> 11
      | Aspect _ -> 12
      | Disease _ -> 13
      | Poison _ -> 14
      | MeleeCombatTechnique _ -> 15
      | RangedCombatTechnique _ -> 16
      | LiturgicalChant _ -> 17
      | Ceremony _ -> 18
      | Skill _ -> 19
      | Spell _ -> 20
      | Ritual _ -> 21

    let innerToInt = function
      | Generic x
      | Blessing x
      | Cantrip x
      | TradeSecret x
      | Language x
      | Script x
      | AnimalShape x
      | ArcaneBardTradition x
      | ArcaneDancerTradition x
      | Element x
      | Property x
      | Aspect x
      | Disease x
      | Poison x
      | MeleeCombatTechnique x
      | RangedCombatTechnique x
      | LiturgicalChant x
      | Ceremony x
      | Skill x
      | Spell x
      | Ritual x ->
          x

    let compare = OrdUtils.makeCompare outerToInt innerToInt

    let ( = ) x y = compare x y == 0

    let ( <> ) x y = compare x y != 0

    let show = function
      | Generic x -> "Generic " ^ Ley_Int.show x
      | Blessing x -> "Blessing " ^ Ley_Int.show x
      | Cantrip x -> "Cantrip " ^ Ley_Int.show x
      | TradeSecret x -> "TradeSecret " ^ Ley_Int.show x
      | Language x -> "Language " ^ Ley_Int.show x
      | Script x -> "Script " ^ Ley_Int.show x
      | AnimalShape x -> "AnimalShape " ^ Ley_Int.show x
      | ArcaneBardTradition x -> "ArcaneBardTradition " ^ Ley_Int.show x
      | ArcaneDancerTradition x -> "ArcaneDancerTradition " ^ Ley_Int.show x
      | Element x -> "Element " ^ Ley_Int.show x
      | Property x -> "Property " ^ Ley_Int.show x
      | Aspect x -> "Aspect " ^ Ley_Int.show x
      | Disease x -> "Disease " ^ Ley_Int.show x
      | Poison x -> "Poison " ^ Ley_Int.show x
      | MeleeCombatTechnique x -> "MeleeCombatTechnique " ^ Ley_Int.show x
      | RangedCombatTechnique x -> "RangedCombatTechnique " ^ Ley_Int.show x
      | LiturgicalChant x -> "LiturgicalChant " ^ Ley_Int.show x
      | Ceremony x -> "Ceremony " ^ Ley_Int.show x
      | Skill x -> "Skill " ^ Ley_Int.show x
      | Spell x -> "Spell " ^ Ley_Int.show x
      | Ritual x -> "Ritual " ^ Ley_Int.show x

    module Decode = struct
      open Json.Decode

      let scoped =
        DecodeUtils.(
          tag (function
            | "Blessing" -> value (fun x -> Blessing x)
            | "Cantrip" -> value (fun x -> Cantrip x)
            | "TradeSecret" -> value (fun x -> TradeSecret x)
            | "Language" -> value (fun x -> Language x)
            | "Script" -> value (fun x -> Script x)
            | "AnimalShape" -> value (fun x -> AnimalShape x)
            | "ArcaneBardTradition" -> value (fun x -> ArcaneBardTradition x)
            | "ArcaneDancerTradition" ->
                value (fun x -> ArcaneDancerTradition x)
            | "Element" -> value (fun x -> Element x)
            | "Property" -> value (fun x -> Property x)
            | "Aspect" -> value (fun x -> Aspect x)
            | "Disease" -> value (fun x -> Disease x)
            | "Poison" -> value (fun x -> Poison x)
            | "MeleeCombatTechnique" -> value (fun x -> MeleeCombatTechnique x)
            | "RangedCombatTechnique" ->
                value (fun x -> RangedCombatTechnique x)
            | "LiturgicalChant" -> value (fun x -> LiturgicalChant x)
            | "Ceremony" -> value (fun x -> Ceremony x)
            | "Skill" -> value (fun x -> Skill x)
            | "Spell" -> value (fun x -> Spell x)
            | "Ritual" -> value (fun x -> Ritual x)
            | scope ->
                raiseUnknownScope ~scopeName:"SelectOption" ~invalidValue:scope))

      let t json : t = json |> oneOf [ int |> map (fun x -> Generic x); scoped ]
    end
  end

  module Option = struct
    type t = Preset of SelectOption.t | CustomInput of string

    let ( = ) x y =
      match[@warning "-4"] (x, y) with
      | Preset x, Preset y -> SelectOption.( = ) x y
      | CustomInput x, CustomInput y -> x == y
      | _ -> false
  end

  module Nested = struct
    type t =
      | Advantage of Advantage.t
      | Disadvantage of Disadvantage.t
      | GeneralSpecialAbility of SpecialAbility.GeneralSpecialAbility.t
      | FatePointSpecialAbility of SpecialAbility.FatePointSpecialAbility.t
      | CombatSpecialAbility of SpecialAbility.CombatSpecialAbility.t
      | MagicalSpecialAbility of SpecialAbility.MagicalSpecialAbility.t
      | StaffEnchantment of SpecialAbility.StaffEnchantment.t
      | FamiliarSpecialAbility of SpecialAbility.FamiliarSpecialAbility.t
      | KarmaSpecialAbility of SpecialAbility.KarmaSpecialAbility.t
      | ProtectiveWardingCircleSpecialAbility of
          SpecialAbility.ProtectiveWardingCircleSpecialAbility.t
      | CombatStyleSpecialAbility of SpecialAbility.CombatStyleSpecialAbility.t
      | AdvancedCombatSpecialAbility of
          SpecialAbility.AdvancedCombatSpecialAbility.t
      | CommandSpecialAbility of SpecialAbility.CommandSpecialAbility.t
      | MagicStyleSpecialAbility of SpecialAbility.MagicStyleSpecialAbility.t
      | AdvancedMagicalSpecialAbility of
          SpecialAbility.AdvancedMagicalSpecialAbility.t
      | SpellSwordEnchantment of SpecialAbility.SpellSwordEnchantment.t
      | DaggerRitual of SpecialAbility.DaggerRitual.t
      | InstrumentEnchantment of SpecialAbility.InstrumentEnchantment.t
      | AttireEnchantment of SpecialAbility.AttireEnchantment.t
      | OrbEnchantment of SpecialAbility.OrbEnchantment.t
      | WandEnchantment of SpecialAbility.WandEnchantment.t
      | BrawlingSpecialAbility of SpecialAbility.BrawlingSpecialAbility.t
      | AncestorGlyph of SpecialAbility.AncestorGlyph.t
      | CeremonialItemSpecialAbility of
          SpecialAbility.CeremonialItemSpecialAbility.t
      | Sermon of SpecialAbility.Sermon.t
      | LiturgicalStyleSpecialAbility of
          SpecialAbility.LiturgicalStyleSpecialAbility.t
      | AdvancedKarmaSpecialAbility of
          SpecialAbility.AdvancedKarmaSpecialAbility.t
      | Vision of SpecialAbility.Vision.t
      | MagicalTradition of SpecialAbility.MagicalTradition.t
      | BlessedTradition of SpecialAbility.BlessedTradition.t
      | Paktgeschenk of SpecialAbility.Paktgeschenk.t
      | SikaryanRaubSonderfertigkeit of
          SpecialAbility.SikaryanRaubSonderfertigkeit.t
      | LykanthropischeGabe of SpecialAbility.LykanthropischeGabe.t
      | Talentstilsonderfertigkeit of
          SpecialAbility.Talentstilsonderfertigkeit.t
      | ErweiterteTalentsonderfertigkeit of
          SpecialAbility.ErweiterteTalentsonderfertigkeit.t
      | Kugelzauber of SpecialAbility.Kugelzauber.t
      | Kesselzauber of SpecialAbility.Kesselzauber.t
      | Kappenzauber of SpecialAbility.Kappenzauber.t
      | Spielzeugzauber of SpecialAbility.Spielzeugzauber.t
      | Schalenzauber of SpecialAbility.Schalenzauber.t
      | SexSchicksalspunkteSonderfertigkeit of
          SpecialAbility.SexSchicksalspunkteSonderfertigkeit.t
      | SexSonderfertigkeit of SpecialAbility.SexSonderfertigkeit.t
      | Waffenzauber of SpecialAbility.Waffenzauber.t
      | Sichelritual of SpecialAbility.Sichelritual.t
      | Ringzauber of SpecialAbility.Ringzauber.t
      | Chronikzauber of SpecialAbility.Chronikzauber.t
  end

  let to_nested : t -> Nested.t = function
    | Advantage x -> Advantage (Advantage.fromInt x)
    | Disadvantage x -> Disadvantage (Disadvantage.fromInt x)
    | GeneralSpecialAbility x ->
        GeneralSpecialAbility (SpecialAbility.GeneralSpecialAbility.fromInt x)
    | FatePointSpecialAbility x ->
        FatePointSpecialAbility
          (SpecialAbility.FatePointSpecialAbility.fromInt x)
    | CombatSpecialAbility x ->
        CombatSpecialAbility (SpecialAbility.CombatSpecialAbility.fromInt x)
    | MagicalSpecialAbility x ->
        MagicalSpecialAbility (SpecialAbility.MagicalSpecialAbility.fromInt x)
    | StaffEnchantment x ->
        StaffEnchantment (SpecialAbility.StaffEnchantment.fromInt x)
    | FamiliarSpecialAbility x ->
        FamiliarSpecialAbility (SpecialAbility.FamiliarSpecialAbility.fromInt x)
    | KarmaSpecialAbility x ->
        KarmaSpecialAbility (SpecialAbility.KarmaSpecialAbility.fromInt x)
    | ProtectiveWardingCircleSpecialAbility x ->
        ProtectiveWardingCircleSpecialAbility
          (SpecialAbility.ProtectiveWardingCircleSpecialAbility.fromInt x)
    | CombatStyleSpecialAbility x ->
        CombatStyleSpecialAbility
          (SpecialAbility.CombatStyleSpecialAbility.fromInt x)
    | AdvancedCombatSpecialAbility x ->
        AdvancedCombatSpecialAbility
          (SpecialAbility.AdvancedCombatSpecialAbility.fromInt x)
    | CommandSpecialAbility x ->
        CommandSpecialAbility (SpecialAbility.CommandSpecialAbility.fromInt x)
    | MagicStyleSpecialAbility x ->
        MagicStyleSpecialAbility
          (SpecialAbility.MagicStyleSpecialAbility.fromInt x)
    | AdvancedMagicalSpecialAbility x ->
        AdvancedMagicalSpecialAbility
          (SpecialAbility.AdvancedMagicalSpecialAbility.fromInt x)
    | SpellSwordEnchantment x ->
        SpellSwordEnchantment (SpecialAbility.SpellSwordEnchantment.fromInt x)
    | DaggerRitual x -> DaggerRitual (SpecialAbility.DaggerRitual.fromInt x)
    | InstrumentEnchantment x ->
        InstrumentEnchantment (SpecialAbility.InstrumentEnchantment.fromInt x)
    | AttireEnchantment x ->
        AttireEnchantment (SpecialAbility.AttireEnchantment.fromInt x)
    | OrbEnchantment x ->
        OrbEnchantment (SpecialAbility.OrbEnchantment.fromInt x)
    | WandEnchantment x ->
        WandEnchantment (SpecialAbility.WandEnchantment.fromInt x)
    | BrawlingSpecialAbility x ->
        BrawlingSpecialAbility (SpecialAbility.BrawlingSpecialAbility.fromInt x)
    | AncestorGlyph x -> AncestorGlyph (SpecialAbility.AncestorGlyph.fromInt x)
    | CeremonialItemSpecialAbility x ->
        CeremonialItemSpecialAbility
          (SpecialAbility.CeremonialItemSpecialAbility.fromInt x)
    | Sermon x -> Sermon (SpecialAbility.Sermon.fromInt x)
    | LiturgicalStyleSpecialAbility x ->
        LiturgicalStyleSpecialAbility
          (SpecialAbility.LiturgicalStyleSpecialAbility.fromInt x)
    | AdvancedKarmaSpecialAbility x ->
        AdvancedKarmaSpecialAbility
          (SpecialAbility.AdvancedKarmaSpecialAbility.fromInt x)
    | Vision x -> Vision (SpecialAbility.Vision.fromInt x)
    | MagicalTradition x ->
        MagicalTradition (SpecialAbility.MagicalTradition.fromInt x)
    | BlessedTradition x ->
        BlessedTradition (SpecialAbility.BlessedTradition.fromInt x)
    | Paktgeschenk x -> Paktgeschenk (SpecialAbility.Paktgeschenk.fromInt x)
    | SikaryanRaubSonderfertigkeit x ->
        SikaryanRaubSonderfertigkeit
          (SpecialAbility.SikaryanRaubSonderfertigkeit.fromInt x)
    | LykanthropischeGabe x ->
        LykanthropischeGabe (SpecialAbility.LykanthropischeGabe.fromInt x)
    | Talentstilsonderfertigkeit x ->
        Talentstilsonderfertigkeit
          (SpecialAbility.Talentstilsonderfertigkeit.fromInt x)
    | ErweiterteTalentsonderfertigkeit x ->
        ErweiterteTalentsonderfertigkeit
          (SpecialAbility.ErweiterteTalentsonderfertigkeit.fromInt x)
    | Kugelzauber x -> Kugelzauber (SpecialAbility.Kugelzauber.fromInt x)
    | Kesselzauber x -> Kesselzauber (SpecialAbility.Kesselzauber.fromInt x)
    | Kappenzauber x -> Kappenzauber (SpecialAbility.Kappenzauber.fromInt x)
    | Spielzeugzauber x ->
        Spielzeugzauber (SpecialAbility.Spielzeugzauber.fromInt x)
    | Schalenzauber x -> Schalenzauber (SpecialAbility.Schalenzauber.fromInt x)
    | SexSchicksalspunkteSonderfertigkeit x ->
        SexSchicksalspunkteSonderfertigkeit
          (SpecialAbility.SexSchicksalspunkteSonderfertigkeit.fromInt x)
    | SexSonderfertigkeit x ->
        SexSonderfertigkeit (SpecialAbility.SexSonderfertigkeit.fromInt x)
    | Waffenzauber x -> Waffenzauber (SpecialAbility.Waffenzauber.fromInt x)
    | Sichelritual x -> Sichelritual (SpecialAbility.Sichelritual.fromInt x)
    | Ringzauber x -> Ringzauber (SpecialAbility.Ringzauber.fromInt x)
    | Chronikzauber x -> Chronikzauber (SpecialAbility.Chronikzauber.fromInt x)
end
