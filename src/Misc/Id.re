type t = [
  | `ExperienceLevel(int)
  | `Race(int)
  | `Culture(int)
  | `Profession(int)
  | `Attribute(int)
  | `Advantage(int)
  | `Disadvantage(int)
  | `Skill(int)
  | `CombatTechnique(int)
  | `Spell(int)
  | `Curse(int)
  | `ElvenMagicalSong(int)
  | `DominationRitual(int)
  | `MagicalMelody(int)
  | `MagicalDance(int)
  | `RogueSpell(int)
  | `AnimistForce(int)
  | `GeodeRitual(int)
  | `ZibiljaRitual(int)
  | `Cantrip(int)
  | `LiturgicalChant(int)
  | `Blessing(int)
  | `SpecialAbility(int)
  | `Item(int)
  | `EquipmentPackage(int)
  | `HitZoneArmor(int)
  | `Familiar(int)
  | `Animal(int)
  | `FocusRule(int)
  | `OptionalRule(int)
  | `Condition(int)
  | `State(int)
];

let outerToInt = id =>
  switch (id) {
  | `ExperienceLevel(_) => 1
  | `Race(_) => 2
  | `Culture(_) => 3
  | `Profession(_) => 4
  | `Attribute(_) => 5
  | `Advantage(_) => 6
  | `Disadvantage(_) => 7
  | `Skill(_) => 8
  | `CombatTechnique(_) => 9
  | `Spell(_) => 10
  | `Curse(_) => 11
  | `ElvenMagicalSong(_) => 12
  | `DominationRitual(_) => 13
  | `MagicalMelody(_) => 14
  | `MagicalDance(_) => 15
  | `RogueSpell(_) => 16
  | `AnimistForce(_) => 17
  | `GeodeRitual(_) => 18
  | `ZibiljaRitual(_) => 19
  | `Cantrip(_) => 20
  | `LiturgicalChant(_) => 21
  | `Blessing(_) => 22
  | `SpecialAbility(_) => 23
  | `Item(_) => 24
  | `EquipmentPackage(_) => 25
  | `HitZoneArmor(_) => 26
  | `Familiar(_) => 27
  | `Animal(_) => 28
  | `FocusRule(_) => 29
  | `OptionalRule(_) => 30
  | `Condition(_) => 31
  | `State(_) => 32
  };

let innerToInt = id =>
  switch (id) {
  | `ExperienceLevel(x)
  | `Race(x)
  | `Culture(x)
  | `Profession(x)
  | `Attribute(x)
  | `Advantage(x)
  | `Disadvantage(x)
  | `Skill(x)
  | `CombatTechnique(x)
  | `Spell(x)
  | `Curse(x)
  | `ElvenMagicalSong(x)
  | `DominationRitual(x)
  | `MagicalMelody(x)
  | `MagicalDance(x)
  | `RogueSpell(x)
  | `AnimistForce(x)
  | `GeodeRitual(x)
  | `ZibiljaRitual(x)
  | `Cantrip(x)
  | `LiturgicalChant(x)
  | `Blessing(x)
  | `SpecialAbility(x)
  | `Item(x)
  | `EquipmentPackage(x)
  | `HitZoneArmor(x)
  | `Familiar(x)
  | `Animal(x)
  | `FocusRule(x)
  | `OptionalRule(x)
  | `Condition(x)
  | `State(x) => x
  };

let compare = (x: t, y: t) => {
  let x' = outerToInt(x);
  let y' = outerToInt(y);

  if (x' === y') {
    innerToInt(x) - innerToInt(y);
  } else {
    x' - y';
  };
};

let (==) = (x, y) => compare(x, y) === 0;

module Activatable = {
  type t = [ | `Advantage(int) | `Disadvantage(int) | `SpecialAbility(int)];

  let (==) = (x, y) =>
    switch (x, y) {
    | (`Advantage(x), `Advantage(y))
    | (`Disadvantage(x), `Disadvantage(y))
    | (`SpecialAbility(x), `SpecialAbility(y)) => x === y
    | _ => false
    };

  module Option = {
    type t = [
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

    let (==) = (x, y) =>
      switch (x, y) {
      | (`Generic(x), `Generic(y))
      | (`Skill(x), `Skill(y))
      | (`CombatTechnique(x), `CombatTechnique(y))
      | (`Spell(x), `Spell(y))
      | (`Cantrip(x), `Cantrip(y))
      | (`LiturgicalChant(x), `LiturgicalChant(y))
      | (`Blessing(x), `Blessing(y))
      | (`SpecialAbility(x), `SpecialAbility(y)) => x === y
      | (`CustomInput(x), `CustomInput(y)) => x === y
      | _ => false
      };
  };
};

module ActivatableAndSkill = {
  type t = [
    | `Advantage(int)
    | `Disadvantage(int)
    | `SpecialAbility(int)
    | `Spell(int)
    | `LiturgicalChant(int)
  ];
};

module ActivatableSkill = {
  type t = [ | `Spell(int) | `LiturgicalChant(int)];
};

module PermanentSkill = {
  type t = [ | `Skill(int) | `CombatTechnique(int)];
};

module Increasable = {
  type t = [
    | `Attribute(int)
    | `Skill(int)
    | `CombatTechnique(int)
    | `Spell(int)
    | `LiturgicalChant(int)
  ];
};

module PrerequisiteSource = {
  type t = [
    | `Advantage(int)
    | `Disadvantage(int)
    | `SpecialAbility(int)
    | `Attribute(int)
    | `Skill(int)
    | `CombatTechnique(int)
    | `Spell(int)
    | `LiturgicalChant(int)
  ];
};

module SelectOption = {
  type t = [
    | `Generic(int)
    | `Skill(int)
    | `CombatTechnique(int)
    | `Spell(int)
    | `Cantrip(int)
    | `LiturgicalChant(int)
    | `Blessing(int)
    | `SpecialAbility(int)
  ];

  let outerToInt = id =>
    switch (id) {
    | `Generic(_) => 1
    | `Skill(_) => 2
    | `CombatTechnique(_) => 3
    | `Spell(_) => 4
    | `Cantrip(_) => 5
    | `LiturgicalChant(_) => 6
    | `Blessing(_) => 7
    | `SpecialAbility(_) => 8
    };

  let innerToInt = id =>
    switch (id) {
    | `Generic(x)
    | `Skill(x)
    | `CombatTechnique(x)
    | `Spell(x)
    | `Cantrip(x)
    | `LiturgicalChant(x)
    | `Blessing(x)
    | `SpecialAbility(x) => x
    };

  let compare = (x, y) => {
    let x' = outerToInt(x);
    let y' = outerToInt(y);

    if (x' === y') {
      innerToInt(x) - innerToInt(y);
    } else {
      x' - y';
    };
  };

  let (==) = (x, y) => compare(x, y) === 0;

  let (!=) = (x, y) => compare(x, y) !== 0;
};

module HitZoneArmorZoneItem = {
  type t =
    | Template(int)
    | Custom(int);
};

module Phase = {
  type t =
    | Outline
    | Definition
    | Advancement;

  let fromInt = id =>
    switch (id) {
    | 1 => Ok(Outline)
    | 2 => Ok(Definition)
    | 3 => Ok(Advancement)
    | x => Error(x)
    };

  let toInt = id =>
    switch (id) {
    | Outline => 1
    | Definition => 2
    | Advancement => 3
    };
};

module ExperienceLevel = {
  type t =
    | Inexperienced
    | Ordinary
    | Experienced
    | Competent
    | Masterly
    | Brilliant
    | Legendary;

  let fromInt = id =>
    switch (id) {
    | 1 => Ok(Inexperienced)
    | 2 => Ok(Ordinary)
    | 3 => Ok(Experienced)
    | 4 => Ok(Competent)
    | 5 => Ok(Masterly)
    | 6 => Ok(Brilliant)
    | 7 => Ok(Legendary)
    | x => Error(x)
    };

  let toInt = id =>
    switch (id) {
    | Inexperienced => 1
    | Ordinary => 2
    | Experienced => 3
    | Competent => 4
    | Masterly => 5
    | Brilliant => 6
    | Legendary => 7
    };
};

module Attribute = {
  type t =
    | Courage
    | Sagacity
    | Intuition
    | Charisma
    | Dexterity
    | Agility
    | Constitution
    | Strength;

  let fromInt = id =>
    switch (id) {
    | 1 => Ok(Courage)
    | 2 => Ok(Sagacity)
    | 3 => Ok(Intuition)
    | 4 => Ok(Charisma)
    | 5 => Ok(Dexterity)
    | 6 => Ok(Agility)
    | 7 => Ok(Constitution)
    | 8 => Ok(Strength)
    | x => Error(x)
    };

  let toInt = id =>
    switch (id) {
    | Courage => 1
    | Sagacity => 2
    | Intuition => 3
    | Charisma => 4
    | Dexterity => 5
    | Agility => 6
    | Constitution => 7
    | Strength => 8
    };
};

module DerivedCharacteristic = {
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

  let fromString = id =>
    switch (id) {
    | "LP" => Ok(LifePoints)
    | "AE" => Ok(ArcaneEnergy)
    | "KP" => Ok(KarmaPoints)
    | "SPI" => Ok(Spirit)
    | "TOU" => Ok(Toughness)
    | "DO" => Ok(Dodge)
    | "INI" => Ok(Initiative)
    | "MOV" => Ok(Movement)
    | "WT" => Ok(WoundThreshold)
    | x => Error(x)
    };

  let toString = id =>
    switch (id) {
    | LifePoints => "LP"
    | ArcaneEnergy => "AE"
    | KarmaPoints => "KP"
    | Spirit => "SPI"
    | Toughness => "TOU"
    | Dodge => "DO"
    | Initiative => "INI"
    | Movement => "MOV"
    | WoundThreshold => "WT"
    };
};

module Pact = {
  type t =
    | Faery
    | Demon
    | Other(int);

  let fromInt = id =>
    switch (id) {
    | 1 => Faery
    | 2 => Demon
    | x => Other(x)
    };

  let toInt = id =>
    switch (id) {
    | Faery => 1
    | Demon => 2
    | Other(x) => x
    };
};

module SocialStatus = {
  type t =
    | NotFree
    | Free
    | LesserNoble
    | Noble
    | Aristocracy;

  let fromInt = id =>
    switch (id) {
    | 1 => Ok(NotFree)
    | 2 => Ok(Free)
    | 3 => Ok(LesserNoble)
    | 4 => Ok(Noble)
    | 5 => Ok(Aristocracy)
    | x => Error(x)
    };

  let toInt = id =>
    switch (id) {
    | NotFree => 1
    | Free => 2
    | LesserNoble => 3
    | Noble => 4
    | Aristocracy => 5
    };
};

module OptionalRule = {
  type t =
    | MaximumAttributeScores
    | LanguageSpecialization
    | HigherDefenseStats
    | Other(int);

  let fromInt = id =>
    switch (id) {
    | 8 => MaximumAttributeScores
    | 15 => LanguageSpecialization
    | 17 => HigherDefenseStats
    | x => Other(x)
    };

  let toInt = id =>
    switch (id) {
    | MaximumAttributeScores => 8
    | LanguageSpecialization => 15
    | HigherDefenseStats => 17
    | Other(x) => x
    };
};

module Advantage = {
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

  let fromInt = id =>
    switch (id) {
    | 4 => Aptitude
    | 9 => Nimble
    | 12 => Blessed
    | 14 => Luck
    | 16 => ExceptionalSkill
    | 17 => ExceptionalCombatTechnique
    | 23 => IncreasedAstralPower
    | 24 => IncreasedKarmaPoints
    | 25 => IncreasedLifePoints
    | 26 => IncreasedSpirit
    | 27 => IncreasedToughness
    | 28 => ImmunityToPoison
    | 29 => ImmunityToDisease
    | 32 => MagicalAttunement
    | 36 => Rich
    | 40 => SociallyAdaptable
    | 46 => InspireConfidence
    | 47 => WeaponAptitude
    | 50 => Spellcaster
    | 54 => Unyielding
    | 58 => LargeSpellSelection
    | 68 => HatredFor
    | 77 => Prediger
    | 78 => Visionaer
    | 79 => ZahlreichePredigten
    | 80 => ZahlreicheVisionen
    | 92 => LeichterGang
    | 99 => Einkommen
    | x => Other(x)
    };

  let toInt = id =>
    switch (id) {
    | Aptitude => 4
    | Nimble => 9
    | Blessed => 12
    | Luck => 14
    | ExceptionalSkill => 16
    | ExceptionalCombatTechnique => 17
    | IncreasedAstralPower => 23
    | IncreasedKarmaPoints => 24
    | IncreasedLifePoints => 25
    | IncreasedSpirit => 26
    | IncreasedToughness => 27
    | ImmunityToPoison => 28
    | ImmunityToDisease => 29
    | MagicalAttunement => 32
    | Rich => 36
    | SociallyAdaptable => 40
    | InspireConfidence => 46
    | WeaponAptitude => 47
    | Spellcaster => 50
    | Unyielding => 54
    | LargeSpellSelection => 58
    | HatredFor => 68
    | Prediger => 77
    | Visionaer => 78
    | ZahlreichePredigten => 79
    | ZahlreicheVisionen => 80
    | LeichterGang => 92
    | Einkommen => 99
    | Other(x) => x
    };
};

module Disadvantage = {
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

  let fromInt = id =>
    switch (id) {
    | 1 => AfraidOf
    | 2 => Poor
    | 4 => Slow
    | 17 => NoFlyingBalm
    | 18 => NoFamiliar
    | 24 => MagicalRestriction
    | 26 => DecreasedArcanePower
    | 27 => DecreasedKarmaPoints
    | 28 => DecreasedLifePoints
    | 29 => DecreasedSpirit
    | 30 => DecreasedToughness
    | 31 => BadLuck
    | 33 => PersonalityFlaw
    | 34 => Principles
    | 36 => BadHabit
    | 37 => NegativeTrait
    | 45 => Stigma
    | 47 => Deaf
    | 48 => Incompetent
    | 50 => Obligations
    | 51 => Maimed
    | 56 => BrittleBones
    | 59 => SmallSpellSelection
    | 72 => WenigePredigten
    | 73 => WenigeVisionen
    | x => Other(x)
    };

  let toInt = id =>
    switch (id) {
    | AfraidOf => 1
    | Poor => 2
    | Slow => 4
    | NoFlyingBalm => 17
    | NoFamiliar => 18
    | MagicalRestriction => 24
    | DecreasedArcanePower => 26
    | DecreasedKarmaPoints => 27
    | DecreasedLifePoints => 28
    | DecreasedSpirit => 29
    | DecreasedToughness => 30
    | BadLuck => 31
    | PersonalityFlaw => 33
    | Principles => 34
    | BadHabit => 36
    | NegativeTrait => 37
    | Stigma => 45
    | Deaf => 47
    | Incompetent => 48
    | Obligations => 50
    | Maimed => 51
    | BrittleBones => 56
    | SmallSpellSelection => 59
    | WenigePredigten => 72
    | WenigeVisionen => 73
    | Other(x) => x
    };
};

module Skill = {
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

  let fromInt = id =>
    switch (id) {
    | 1 => Flying
    | 2 => Gaukelei
    | 3 => Climbing
    | 4 => BodyControl
    | 5 => FeatOfStrength
    | 6 => Riding
    | 7 => Swimming
    | 8 => SelfControl
    | 9 => Singing
    | 10 => Perception
    | 11 => Dancing
    | 12 => Pickpocket
    | 13 => Stealth
    | 14 => Carousing
    | 15 => Persuasion
    | 16 => Seduction
    | 17 => Intimidation
    | 18 => Etiquette
    | 19 => Streetwise
    | 20 => Empathy
    | 21 => FastTalk
    | 22 => Disguise
    | 23 => Willpower
    | 24 => Tracking
    | 25 => Ropes
    | 26 => Fishing
    | 27 => Orienting
    | 28 => PlantLore
    | 29 => AnimalLore
    | 30 => Survival
    | 31 => Gambling
    | 32 => Geography
    | 33 => History
    | 34 => Religions
    | 35 => Warfare
    | 36 => MagicalLore
    | 37 => Mechanics
    | 38 => Math
    | 39 => Law
    | 40 => MythsAndLegends
    | 41 => SphereLore
    | 42 => Astronomy
    | 43 => Alchemy
    | 44 => Sailing
    | 45 => Driving
    | 46 => Commerce
    | 47 => TreatPoison
    | 48 => TreatDisease
    | 49 => TreatSoul
    | 50 => TreatWounds
    | 51 => Woodworking
    | 52 => PrepareFood
    | 53 => Leatherworking
    | 54 => ArtisticAbility
    | 55 => Metalworking
    | 56 => Music
    | 57 => PickLocks
    | 58 => Earthencraft
    | 59 => Clothworking
    | x => Other(x)
    };

  let toInt = id =>
    switch (id) {
    | Flying => 1
    | Gaukelei => 2
    | Climbing => 3
    | BodyControl => 4
    | FeatOfStrength => 5
    | Riding => 6
    | Swimming => 7
    | SelfControl => 8
    | Singing => 9
    | Perception => 10
    | Dancing => 11
    | Pickpocket => 12
    | Stealth => 13
    | Carousing => 14
    | Persuasion => 15
    | Seduction => 16
    | Intimidation => 17
    | Etiquette => 18
    | Streetwise => 19
    | Empathy => 20
    | FastTalk => 21
    | Disguise => 22
    | Willpower => 23
    | Tracking => 24
    | Ropes => 25
    | Fishing => 26
    | Orienting => 27
    | PlantLore => 28
    | AnimalLore => 29
    | Survival => 30
    | Gambling => 31
    | Geography => 32
    | History => 33
    | Religions => 34
    | Warfare => 35
    | MagicalLore => 36
    | Mechanics => 37
    | Math => 38
    | Law => 39
    | MythsAndLegends => 40
    | SphereLore => 41
    | Astronomy => 42
    | Alchemy => 43
    | Sailing => 44
    | Driving => 45
    | Commerce => 46
    | TreatPoison => 47
    | TreatDisease => 48
    | TreatSoul => 49
    | TreatWounds => 50
    | Woodworking => 51
    | PrepareFood => 52
    | Leatherworking => 53
    | ArtisticAbility => 54
    | Metalworking => 55
    | Music => 56
    | PickLocks => 57
    | Earthencraft => 58
    | Clothworking => 59
    | Other(x) => x
    };

  module Group = {
    type t =
      | Physical
      | Social
      | Nature
      | Knowledge
      | Craft;

    let fromInt = id =>
      switch (id) {
      | 1 => Ok(Physical)
      | 2 => Ok(Social)
      | 3 => Ok(Nature)
      | 4 => Ok(Knowledge)
      | 5 => Ok(Craft)
      | x => Error(x)
      };

    let toInt = id =>
      switch (id) {
      | Physical => 1
      | Social => 2
      | Nature => 3
      | Knowledge => 4
      | Craft => 5
      };
  };
};

module CombatTechnique = {
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

  let fromInt = id =>
    switch (id) {
    | 1 => Crossbows
    | 2 => Bows
    | 3 => Daggers
    | 4 => FencingWeapons
    | 5 => ImpactWeapons
    | 6 => ChainWeapons
    | 7 => Lances
    | 9 => Brawling
    | 10 => Shields
    | 11 => Slings
    | 12 => Swords
    | 13 => Polearms
    | 14 => ThrownWeapons
    | 15 => TwoHandedImpactWeapons
    | 16 => TwoHandedSwords
    | 17 => SpittingFire
    | 18 => Blowguns
    | 19 => Discuses
    | 20 => Faecher
    | 21 => Spiesswaffen
    | x => Other(x)
    };

  let toInt = id =>
    switch (id) {
    | Crossbows => 1
    | Bows => 2
    | Daggers => 3
    | FencingWeapons => 4
    | ImpactWeapons => 5
    | ChainWeapons => 6
    | Lances => 7
    | Brawling => 9
    | Shields => 10
    | Slings => 11
    | Swords => 12
    | Polearms => 13
    | ThrownWeapons => 14
    | TwoHandedImpactWeapons => 15
    | TwoHandedSwords => 16
    | SpittingFire => 17
    | Blowguns => 18
    | Discuses => 19
    | Faecher => 20
    | Spiesswaffen => 21
    | Other(x) => x
    };

  module Group = {
    type t =
      | Melee
      | Ranged;

    let fromInt = id =>
      switch (id) {
      | 1 => Ok(Melee)
      | 2 => Ok(Ranged)
      | x => Error(x)
      };

    let toInt = id =>
      switch (id) {
      | Melee => 1
      | Ranged => 2
      };
  };
};

module MagicalTradition = {
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

  let fromInt = id =>
    switch (id) {
    | 1 => General
    | 2 => GuildMages
    | 3 => Witches
    | 4 => Elves
    | 5 => Druids
    | 6 => Scharlatane
    | 7 => ArcaneBards
    | 8 => ArcaneDancers
    | 9 => IntuitiveZauberer
    | 10 => Meistertalentierte
    | 11 => Qabalyamagier
    | 12 => Kristallomanten
    | 13 => Geodes
    | 14 => Alchimisten
    | 15 => Rogues
    | 16 => Animists
    | 17 => Zibilija
    | 18 => BrobimGeoden
    | x => Other(x)
    };

  let toInt = id =>
    switch (id) {
    | General => 1
    | GuildMages => 2
    | Witches => 3
    | Elves => 4
    | Druids => 5
    | Scharlatane => 6
    | ArcaneBards => 7
    | ArcaneDancers => 8
    | IntuitiveZauberer => 9
    | Meistertalentierte => 10
    | Qabalyamagier => 11
    | Kristallomanten => 12
    | Geodes => 13
    | Alchimisten => 14
    | Rogues => 15
    | Animists => 16
    | Zibilija => 17
    | BrobimGeoden => 18
    | Other(x) => x
    };
};

module Property = {
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

  let fromInt = id =>
    switch (id) {
    | 1 => AntiMagic
    | 2 => Demonic
    | 3 => Influence
    | 4 => Elemental
    | 5 => Healing
    | 6 => Clairvoyance
    | 7 => Illusion
    | 8 => Spheres
    | 9 => Objekt
    | 10 => Telekinesis
    | 11 => Transformation
    | 12 => Temporal
    | x => Other(x)
    };

  let toInt = id =>
    switch (id) {
    | AntiMagic => 1
    | Demonic => 2
    | Influence => 3
    | Elemental => 4
    | Healing => 5
    | Clairvoyance => 6
    | Illusion => 7
    | Spheres => 8
    | Objekt => 9
    | Telekinesis => 10
    | Transformation => 11
    | Temporal => 12
    | Other(x) => x
    };
};

module SpecialAbility = {
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

  let fromInt = id =>
    switch (id) {
    | 9 => SkillSpecialization
    | 12 => TerrainKnowledge
    | 17 => CraftInstruments
    | 18 => Hunter
    | 22 => AreaKnowledge
    | 27 => Literacy
    | 29 => Language
    | 51 => CombatReflexes
    | 64 => ImprovedDodge
    | 70 => TraditionGuildMages
    | 72 => PropertyKnowledge
    | 81 => PropertyFocus
    | 87 => AspectKnowledge
    | 86 => TraditionChurchOfPraios
    | 109 => Feuerschlucker
    | 164 => CombatStyleCombination
    | 231 => AdaptionZauber
    | 240 => Exorzist
    | 250 => FavoriteSpellwork
    | 255 => TraditionWitches
    | 266 => MagicStyleCombination
    | 296 => Harmoniezauberei
    | 303 => Matrixzauberei
    | 345 => TraditionElves
    | 346 => TraditionDruids
    | 414 => SpellEnhancement
    | 472 => Forschungsgebiet
    | 473 => Expertenwissen
    | 531 => Wissensdurst
    | 533 => Recherchegespuer
    | 544 => PredigtDerGemeinschaft
    | 545 => PredigtDerZuversicht
    | 546 => PredigtDesGottvertrauens
    | 547 => PredigtDesWohlgefallens
    | 548 => PredigtWiderMissgeschicke
    | 549 => VisionDerBestimmung
    | 550 => VisionDerEntrueckung
    | 551 => VisionDerGottheit
    | 552 => VisionDesSchicksals
    | 553 => VisionDesWahrenGlaubens
    | 563 => HoheWeihe
    | 569 => Lieblingsliturgie
    | 623 => Zugvoegel
    | 625 => JaegerinnenDerWeissenMaid
    | 632 => AnhaengerDesGueldenen
    | 639 => GebieterDesAspekts
    | 663 => ChantEnhancement
    | 667 => DunklesAbbildDerBuendnisgabe
    | 676 => TraditionIllusionist
    | 677 => TraditionArcaneBard
    | 678 => TraditionArcaneDancer
    | 679 => TraditionIntuitiveMage
    | 680 => TraditionSavant
    | 681 => TraditionQabalyaMage
    | 682 => TraditionChurchOfRondra
    | 683 => TraditionChurchOfBoron
    | 684 => TraditionChurchOfHesinde
    | 685 => TraditionChurchOfPhex
    | 686 => TraditionChurchOfPeraine
    | 687 => TraditionChurchOfEfferd
    | 688 => TraditionChurchOfTravia
    | 689 => TraditionChurchOfFirun
    | 690 => TraditionChurchOfTsa
    | 691 => TraditionChurchOfIngerimm
    | 692 => TraditionChurchOfRahja
    | 693 => TraditionCultOfTheNamelessOne
    | 694 => TraditionChurchOfAves
    | 695 => TraditionChurchOfIfirn
    | 696 => TraditionChurchOfKor
    | 697 => TraditionChurchOfNandus
    | 698 => TraditionChurchOfSwafnir
    | 699 => LanguageSpecializations
    | 726 => TraditionSchelme
    | 750 => TraditionZauberalchimisten
    | 772 => GrosseMeditation
    | 775 => Imitationszauberei
    | 781 => Kraftliniennutzung
    | 802 => ScholarDerHalleDesLebensZuNorburg
    | 808 => ScholarDesKreisesDerEinfuehlung
    | 821 => MadaschwesternStil
    | 901 => GaretherGossenStil
    | 1040 => WegDerGelehrten
    | 1049 => TraditionCultOfNuminoru
    | 1069 => WegDerKuenstlerin
    | 1075 => WegDerSchreiberin
    | 1100 => Fachwissen
    | 1108 => Handwerkskunst
    | 1110 => KindDerNatur
    | 1112 => KoerperlichesGeschick
    | 1123 => SozialeKompetenz
    | 1127 => Universalgenie
    | 1147 => ScholarDesMagierkollegsZuHoningen
    | 1221 => TraditionAnimisten
    | 1255 => TraditionGeoden
    | 1293 => TraditionZibilijas
    | 1391 => Zaubervariabilitaet
    | 1438 => TraditionBrobimGeoden
    | x => Other(x)
    };

  let toInt = id =>
    switch (id) {
    | SkillSpecialization => 9
    | TerrainKnowledge => 12
    | CraftInstruments => 17
    | Hunter => 18
    | AreaKnowledge => 22
    | Literacy => 27
    | Language => 29
    | CombatReflexes => 51
    | ImprovedDodge => 64
    | TraditionGuildMages => 70
    | PropertyKnowledge => 72
    | PropertyFocus => 81
    | AspectKnowledge => 87
    | TraditionChurchOfPraios => 86
    | Feuerschlucker => 109
    | CombatStyleCombination => 164
    | AdaptionZauber => 231
    | Exorzist => 240
    | FavoriteSpellwork => 250
    | TraditionWitches => 255
    | MagicStyleCombination => 266
    | Harmoniezauberei => 296
    | Matrixzauberei => 303
    | TraditionElves => 345
    | TraditionDruids => 346
    | SpellEnhancement => 414
    | Forschungsgebiet => 472
    | Expertenwissen => 473
    | Wissensdurst => 531
    | Recherchegespuer => 533
    | PredigtDerGemeinschaft => 544
    | PredigtDerZuversicht => 545
    | PredigtDesGottvertrauens => 546
    | PredigtDesWohlgefallens => 547
    | PredigtWiderMissgeschicke => 548
    | VisionDerBestimmung => 549
    | VisionDerEntrueckung => 550
    | VisionDerGottheit => 551
    | VisionDesSchicksals => 552
    | VisionDesWahrenGlaubens => 553
    | HoheWeihe => 563
    | Lieblingsliturgie => 569
    | Zugvoegel => 623
    | JaegerinnenDerWeissenMaid => 625
    | AnhaengerDesGueldenen => 632
    | GebieterDesAspekts => 639
    | ChantEnhancement => 663
    | DunklesAbbildDerBuendnisgabe => 667
    | TraditionIllusionist => 676
    | TraditionArcaneBard => 677
    | TraditionArcaneDancer => 678
    | TraditionIntuitiveMage => 679
    | TraditionSavant => 680
    | TraditionQabalyaMage => 681
    | TraditionChurchOfRondra => 682
    | TraditionChurchOfBoron => 683
    | TraditionChurchOfHesinde => 684
    | TraditionChurchOfPhex => 685
    | TraditionChurchOfPeraine => 686
    | TraditionChurchOfEfferd => 687
    | TraditionChurchOfTravia => 688
    | TraditionChurchOfFirun => 689
    | TraditionChurchOfTsa => 690
    | TraditionChurchOfIngerimm => 691
    | TraditionChurchOfRahja => 692
    | TraditionCultOfTheNamelessOne => 693
    | TraditionChurchOfAves => 694
    | TraditionChurchOfIfirn => 695
    | TraditionChurchOfKor => 696
    | TraditionChurchOfNandus => 697
    | TraditionChurchOfSwafnir => 698
    | LanguageSpecializations => 699
    | TraditionSchelme => 726
    | TraditionZauberalchimisten => 750
    | GrosseMeditation => 772
    | Imitationszauberei => 775
    | Kraftliniennutzung => 781
    | ScholarDerHalleDesLebensZuNorburg => 802
    | ScholarDesKreisesDerEinfuehlung => 808
    | MadaschwesternStil => 821
    | GaretherGossenStil => 901
    | WegDerGelehrten => 1040
    | TraditionCultOfNuminoru => 1049
    | WegDerKuenstlerin => 1069
    | WegDerSchreiberin => 1075
    | Fachwissen => 1100
    | Handwerkskunst => 1108
    | KindDerNatur => 1110
    | KoerperlichesGeschick => 1112
    | SozialeKompetenz => 1123
    | Universalgenie => 1127
    | ScholarDesMagierkollegsZuHoningen => 1147
    | TraditionAnimisten => 1221
    | TraditionGeoden => 1255
    | TraditionZibilijas => 1293
    | Zaubervariabilitaet => 1391
    | TraditionBrobimGeoden => 1438
    | Other(x) => x
    };

  module Group = {
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

    let fromInt = id =>
      switch (id) {
      | 1 => General
      | 2 => Fate
      | 3 => Combat
      | 4 => Magical
      | 5 => StaffEnchantments
      | 6 => Witch
      | 7 => Karma
      | 8 => ProtectiveWardingCircles
      | 9 => CombatStylesArmed
      | 10 => CombatStylesUnarmed
      | 11 => CombatExtended
      | 12 => Commands
      | 13 => MagicalStyles
      | 14 => MagicalExtended
      | 15 => Bannschwert
      | 16 => Dolch
      | 17 => Instrument
      | 18 => Gewand
      | 19 => Kugel
      | 20 => Stecken
      | 21 => Pruegel
      | 22 => Ahnenzeichen
      | 23 => Zeremonialgegenstaende
      | 24 => Predigten
      | 25 => BlessedStyles
      | 26 => KarmaExtended
      | 27 => Visionen
      | 28 => MagicalTraditions
      | 29 => BlessedTraditions
      | 30 => Paktgeschenke
      | 31 => Vampirismus
      | 32 => Lykanthropie
      | 33 => SkillStyles
      | 34 => SkillExtended
      | 35 => Magierkugel
      | 36 => Hexenkessel
      | 37 => Narrenkappe
      | 38 => Schelmenspielzeug
      | 39 => Alchimistenschale
      | 40 => SexSchicksal
      | 41 => Sex
      | 42 => WaffenzauberAnimisten
      | 43 => Sichelrituale
      | 44 => Ringzauber
      | 45 => Chronikzauber
      | x => Other(x)
      };

    let toInt = id =>
      switch (id) {
      | General => 1
      | Fate => 2
      | Combat => 3
      | Magical => 4
      | StaffEnchantments => 5
      | Witch => 6
      | Karma => 7
      | ProtectiveWardingCircles => 8
      | CombatStylesArmed => 9
      | CombatStylesUnarmed => 10
      | CombatExtended => 11
      | Commands => 12
      | MagicalStyles => 13
      | MagicalExtended => 14
      | Bannschwert => 15
      | Dolch => 16
      | Instrument => 17
      | Gewand => 18
      | Kugel => 19
      | Stecken => 20
      | Pruegel => 21
      | Ahnenzeichen => 22
      | Zeremonialgegenstaende => 23
      | Predigten => 24
      | BlessedStyles => 25
      | KarmaExtended => 26
      | Visionen => 27
      | MagicalTraditions => 28
      | BlessedTraditions => 29
      | Paktgeschenke => 30
      | Vampirismus => 31
      | Lykanthropie => 32
      | SkillStyles => 33
      | SkillExtended => 34
      | Magierkugel => 35
      | Hexenkessel => 36
      | Narrenkappe => 37
      | Schelmenspielzeug => 38
      | Alchimistenschale => 39
      | SexSchicksal => 40
      | Sex => 41
      | WaffenzauberAnimisten => 42
      | Sichelrituale => 43
      | Ringzauber => 44
      | Chronikzauber => 45
      | Other(x) => x
      };
  };
};
