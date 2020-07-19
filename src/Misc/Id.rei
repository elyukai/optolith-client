type category = [
  | `ExperienceLevel
  | `Race
  | `Culture
  | `Profession
  | `Attribute
  | `Advantage
  | `Disadvantage
  | `Skill
  | `CombatTechnique
  | `Spell
  | `Curse
  | `ElvenMagicalSong
  | `DominationRitual
  | `MagicalMelody
  | `MagicalDance
  | `RogueSpell
  | `AnimistForce
  | `GeodeRitual
  | `ZibiljaRitual
  | `Cantrip
  | `LiturgicalChant
  | `Blessing
  | `SpecialAbility
  | `Item
  | `EquipmentPackage
  | `HitZoneArmor
  | `Familiar
  | `Animal
  | `FocusRule
  | `OptionalRule
  | `Condition
  | `State
];

type t = (category, int);

type all = t;

/**
 * `compare x y` returns `0` if `x` and `y` are equal, a negative integer if
 * `x` is smaller than `y`, and a positive integer if `x` is greater than
 * `y`.
 */
let compare: (t, t) => int;

let (==): (t, t) => bool;

module Activatable: {
  type category = [ | `Advantage | `Disadvantage | `SpecialAbility];

  type t = (category, int);

  let (==): (t, t) => bool;

  module SelectOption: {
    type category = [
      | `Generic
      | `Skill
      | `CombatTechnique
      | `Spell
      | `Cantrip
      | `LiturgicalChant
      | `Blessing
      | `SpecialAbility
    ];

    type t = (category, int);

    /**
     * `compare x y` returns `0` if `x` and `y` are equal, a negative integer if
     * `x` is smaller than `y`, and a positive integer if `x` is greater than
     * `y`.
     */
    let compare: (t, t) => int;

    let (==): (t, t) => bool;

    let (!=): (t, t) => bool;
  };

  module Option: {
    type t =
      | Preset(SelectOption.t)
      | CustomInput(string);

    let (==): (t, t) => bool;
  };
};

module ActivatableAndSkill: {
  type category = [
    | `Advantage
    | `Disadvantage
    | `SpecialAbility
    | `Spell
    | `LiturgicalChant
  ];

  type t = (category, int);
};

module ActivatableSkill: {
  type category = [ | `Spell | `LiturgicalChant];

  type t = (category, int);
};

module PermanentSkill: {
  type category = [ | `Skill | `CombatTechnique];

  type t = (category, int);
};

module Increasable: {
  type category = [
    | `Attribute
    | `Skill
    | `CombatTechnique
    | `Spell
    | `LiturgicalChant
  ];

  type t = (category, int);
};

module PrerequisiteSource: {
  type category = [
    | `Advantage
    | `Disadvantage
    | `SpecialAbility
    | `Attribute
    | `Skill
    | `CombatTechnique
    | `Spell
    | `LiturgicalChant
  ];

  type t = (category, int);
};

module HitZoneArmorZoneItem: {
  type t =
    | Template(int)
    | Custom(int);
};

module Phase: {
  type t =
    | Outline
    | Definition
    | Advancement;

  let fromInt: int => result(t, int);

  let toInt: t => int;
};

module ExperienceLevel: {
  type t =
    | Inexperienced
    | Ordinary
    | Experienced
    | Competent
    | Masterly
    | Brilliant
    | Legendary;

  let fromInt: int => result(t, int);

  let toInt: t => int;
};

module Attribute: {
  type t =
    | Courage
    | Sagacity
    | Intuition
    | Charisma
    | Dexterity
    | Agility
    | Constitution
    | Strength;

  let fromInt: int => result(t, int);

  let toInt: t => int;
};

module DerivedCharacteristic: {
  type t =
    | LifePoints
    | ArcaneEnergy
    | KarmaPoints
    | Spirit
    | Toughness
    | Dodge
    | Initiative
    | Movement
    | WoundThreshold;

  let fromString: string => result(t, string);

  let toString: t => string;
};

module Pact: {
  type t =
    | Faery
    | Demon
    | Other(int);

  let fromInt: int => t;

  let toInt: t => int;
};

module SocialStatus: {
  type t =
    | NotFree
    | Free
    | LesserNoble
    | Noble
    | Aristocracy;

  let fromInt: int => result(t, int);

  let toInt: t => int;
};

module OptionalRule: {
  type t =
    | MaximumAttributeScores
    | LanguageSpecialization
    | HigherDefenseStats
    | Other(int);

  let fromInt: int => t;

  let toInt: t => int;
};

module Advantage: {
  type t =
    | Aptitude // Begabung
    | Nimble // Flink
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
    | Unyielding // Eisern
    | LargeSpellSelection
    | HatredFor
    | Prediger
    | Visionaer
    | ZahlreichePredigten
    | ZahlreicheVisionen
    | LeichterGang
    | Einkommen
    | Other(int);

  let fromInt: int => t;

  let toInt: t => int;
};

module Disadvantage: {
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
    | NegativeTrait // Schlechte Eigenschaft
    | Stigma
    | Deaf // Taub
    | Incompetent
    | Obligations // Verpflichtungen
    | Maimed // Verstümmelt
    | BrittleBones // Gläsern
    | SmallSpellSelection
    | WenigePredigten
    | WenigeVisionen
    | Other(int);

  let fromInt: int => t;

  let toInt: t => int;
};

module Skill: {
  type t =
    // Physical
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
    // Social
    | Persuasion
    | Seduction
    | Intimidation
    | Etiquette
    | Streetwise
    | Empathy
    | FastTalk
    | Disguise
    | Willpower
    // Nature
    | Tracking
    | Ropes
    | Fishing
    | Orienting
    | PlantLore
    | AnimalLore
    | Survival
    // Knowledge
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
    // Craft
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
    | Other(int);

  let fromInt: int => t;

  let toInt: t => int;

  module Group: {
    type t =
      | Physical
      | Social
      | Nature
      | Knowledge
      | Craft;

    let fromInt: int => result(t, int);

    let toInt: t => int;
  };
};

module CombatTechnique: {
  type t =
    | Crossbows
    | Bows
    | Daggers
    | FencingWeapons
    | ImpactWeapons
    | ChainWeapons
    | Lances
    | Brawling
    | Shields
    | Slings
    | Swords
    | Polearms
    | ThrownWeapons
    | TwoHandedImpactWeapons
    | TwoHandedSwords
    | SpittingFire
    | Blowguns
    | Discuses
    | Faecher
    | Spiesswaffen
    | Other(int);

  let fromInt: int => t;

  let toInt: t => int;

  module Group: {
    type t =
      | Melee
      | Ranged;

    let fromInt: int => result(t, int);

    let toInt: t => int;
  };
};

module MagicalTradition: {
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
    | Other(int);

  let fromInt: int => t;

  let toInt: t => int;
};

module Spell: {
  module Group: {
    type t =
      | Spells
      | Rituals;

    let fromInt: int => result(t, int);

    let toInt: t => int;
  };
};

module Property: {
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
    | Other(int);

  let fromInt: int => t;

  let toInt: t => int;
};

module SpecialAbility: {
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
    | FavoriteSpellwork // Lieblingszauber
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
    | VisionDerEntrueckung // Vision der Entrückung
    | VisionDerGottheit
    | VisionDesSchicksals
    | VisionDesWahrenGlaubens
    | HoheWeihe
    | Lieblingsliturgie
    | Zugvoegel
    | JaegerinnenDerWeissenMaid // Jägerinnen der Weißen Maid
    | AnhaengerDesGueldenen
    | GebieterDesAspekts
    | ChantEnhancement
    | DunklesAbbildDerBuendnisgabe
    | TraditionIllusionist // Tradition (Scharlatane)
    | TraditionArcaneBard // Tradition (Zauberbarden)
    | TraditionArcaneDancer // Tradition (Zaubertaenzer)
    | TraditionIntuitiveMage
    | TraditionSavant // Tradition (Meistertalentierte)
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
    | Other(int);

  let fromInt: int => t;

  let toInt: t => int;

  module Group: {
    type t =
      | General
      | Fate
      | Combat
      | Magical
      | StaffEnchantments
      | Witch
      | Karma
      | ProtectiveWardingCircles
      | CombatStylesArmed
      | CombatStylesUnarmed
      | CombatExtended
      | Commands
      | MagicalStyles
      | MagicalExtended
      | Bannschwert
      | Dolch
      | Instrument
      | Gewand
      | Kugel
      | Stecken
      | Pruegel
      | Ahnenzeichen
      | Zeremonialgegenstaende
      | Predigten
      | BlessedStyles
      | KarmaExtended
      | Visionen
      | MagicalTraditions
      | BlessedTraditions
      | Paktgeschenke
      | Vampirismus
      | Lykanthropie
      | SkillStyles
      | SkillExtended
      | Magierkugel
      | Hexenkessel
      | Narrenkappe
      | Schelmenspielzeug
      | Alchimistenschale
      | SexSchicksal
      | Sex
      | WaffenzauberAnimisten
      | Sichelrituale
      | Ringzauber
      | Chronikzauber
      | Other(int);

    let fromInt: int => t;

    let toInt: t => int;
  };
};
