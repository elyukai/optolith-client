[@gentype "Id"]
type id = [
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

[@gentype "ActivatableId"]
type activatableId = [
  | `Advantage(int)
  | `Disadvantage(int)
  | `SpecialAbility(int)
];

[@gentype "ActivatableAndSkillId"]
type activatableAndSkillId = [
  | `Advantage(int)
  | `Disadvantage(int)
  | `SpecialAbility(int)
  | `Spell(int)
  | `LiturgicalChant(int)
];

[@gentype "ActivatableSkillId"]
type activatableSkillId = [ | `Spell(int) | `LiturgicalChant(int)];

[@gentype "SkillId"]
type skillId = [ | `Skill(int) | `CombatTechnique(int)];

[@gentype "SelectOptionId"]
type selectOptionId = [
  | `Generic(int)
  | `Skill(int)
  | `CombatTechnique(int)
  | `Spell(int)
  | `Cantrip(int)
  | `LiturgicalChant(int)
  | `Blessing(int)
];

[@gentype "HitZoneArmorZoneItemId"]
type hitZoneArmorZoneItemId =
  | Template(int)
  | Custom(int);

module Phase = {
  [@gentype "Phase"]
  type t =
    | Outline
    | Definition
    | Advancement;

  let unsafeFromInt = id =>
    switch (id) {
    | 1 => Outline
    | 2 => Definition
    | 3 => Advancement
    | x =>
      invalid_arg(
        "unsafeFromInt: " ++ Int.show(x) ++ " is not a valid phase",
      )
    };

  let toInt = id =>
    switch (id) {
    | Outline => 1
    | Definition => 2
    | Advancement => 3
    };

  [@gentype]
  let rcp = 1;
  [@gentype]
  let creation = 2;
  [@gentype]
  let inGame = 3;
};

module ExperienceLevelId = {
  type t =
    | Inexperienced
    | Ordinary
    | Experienced
    | Competent
    | Masterly
    | Brilliant
    | Legendary;

  let unsafeFromInt = id =>
    switch (id) {
    | 1 => Inexperienced
    | 2 => Ordinary
    | 3 => Experienced
    | 4 => Competent
    | 5 => Masterly
    | 6 => Brilliant
    | 7 => Legendary
    | x =>
      invalid_arg(
        "unsafeFromInt: " ++ Int.show(x) ++ " is not a valid experience level",
      )
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

  [@gentype]
  let inexperienced = "EL_1";
  [@gentype]
  let ordinary = "EL_2";
  [@gentype]
  let experienced = "EL_3";
  [@gentype]
  let competent = "EL_4";
  [@gentype]
  let masterly = "EL_5";
  [@gentype]
  let brilliant = "EL_6";
  [@gentype]
  let legendary = "EL_7";
};

module RaceId = {
  [@gentype]
  let humans = "R_1";
  [@gentype]
  let elves = "R_2";
  [@gentype]
  let halfElves = "R_3";
  [@gentype]
  let dwarves = "R_4";
};

module CultureId = {
  [@gentype]
  let gladeElves = "C_19";
  [@gentype]
  let firnelves = "C_20";
  [@gentype]
  let woodElves = "C_21";
  [@gentype]
  let steppenelfen = "C_28";
};

module ProfessionId = {
  [@gentype]
  let customProfession = "P_0";
};

module AttrId = {
  type t =
    | Courage
    | Sagacity
    | Intuition
    | Charisma
    | Dexterity
    | Agility
    | Constitution
    | Strength;

  let unsafeFromInt = id =>
    switch (id) {
    | 1 => Courage
    | 2 => Sagacity
    | 3 => Intuition
    | 4 => Charisma
    | 5 => Dexterity
    | 6 => Agility
    | 7 => Constitution
    | 8 => Strength
    | x =>
      invalid_arg(
        "unsafeFromInt: " ++ Int.show(x) ++ " is not a valid attribute",
      )
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

  [@gentype]
  let courage = "ATTR_1";
  [@gentype]
  let sagacity = "ATTR_2";
  [@gentype]
  let intuition = "ATTR_3";
  [@gentype]
  let charisma = "ATTR_4";
  [@gentype]
  let dexterity = "ATTR_5";
  [@gentype]
  let agility = "ATTR_6";
  [@gentype]
  let constitution = "ATTR_7";
  [@gentype]
  let strength = "ATTR_8";
};

module DCId = {
  [@gentype]
  let lifePoints = "LP";
  [@gentype]
  let arcaneEnergy = "AE";
  [@gentype]
  let karmaPoints = "KP";
  [@gentype]
  let spirit = "SPI";
  [@gentype]
  let toughness = "TOU";
  [@gentype]
  let dodge = "DO";
  [@gentype]
  let initiative = "INI";
  [@gentype]
  let movement = "MOV";
  [@gentype]
  let woundThreshold = "WT";
};

module AdvantageId = {
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

  [@gentype]
  let aptitude = "ADV_4"; // Begabung
  [@gentype]
  let nimble = "ADV_9"; // Flink
  [@gentype]
  let blessed = "ADV_12";
  [@gentype]
  let luck = "ADV_14";
  [@gentype]
  let exceptionalSkill = "ADV_16";
  [@gentype]
  let exceptionalCombatTechnique = "ADV_17";
  [@gentype]
  let increasedAstralPower = "ADV_23";
  [@gentype]
  let increasedKarmaPoints = "ADV_24";
  [@gentype]
  let increasedLifePoints = "ADV_25";
  [@gentype]
  let increasedSpirit = "ADV_26";
  [@gentype]
  let increasedToughness = "ADV_27";
  [@gentype]
  let immunityToPoison = "ADV_28";
  [@gentype]
  let immunityToDisease = "ADV_29";
  [@gentype]
  let magicalAttunement = "ADV_32";
  [@gentype]
  let rich = "ADV_36";
  [@gentype]
  let sociallyAdaptable = "ADV_40";
  [@gentype]
  let inspireConfidence = "ADV_46";
  [@gentype]
  let weaponAptitude = "ADV_47";
  [@gentype]
  let spellcaster = "ADV_50";
  [@gentype]
  let unyielding = "ADV_54"; // Eisern
  [@gentype]
  let largeSpellSelection = "ADV_58";
  [@gentype]
  let hatredOf = "ADV_68";
  [@gentype]
  let prediger = "ADV_77";
  [@gentype]
  let visionaer = "ADV_78";
  [@gentype]
  let zahlreichePredigten = "ADV_79";
  [@gentype]
  let zahlreicheVisionen = "ADV_80";
  [@gentype]
  let leichterGang = "ADV_92";
  [@gentype]
  let einkommen = "ADV_99";
};

module DisadvantageId = {
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

  [@gentype]
  let afraidOf = "DISADV_1";
  [@gentype]
  let poor = "DISADV_2";
  [@gentype]
  let slow = "DISADV_4";
  [@gentype]
  let noFlyingBalm = "DISADV_17";
  [@gentype]
  let noFamiliar = "DISADV_18";
  [@gentype]
  let magicalRestriction = "DISADV_24";
  [@gentype]
  let decreasedArcanePower = "DISADV_26";
  [@gentype]
  let decreasedKarmaPoints = "DISADV_27";
  [@gentype]
  let decreasedLifePoints = "DISADV_28";
  [@gentype]
  let decreasedSpirit = "DISADV_29";
  [@gentype]
  let decreasedToughness = "DISADV_30";
  [@gentype]
  let badLuck = "DISADV_31";
  [@gentype]
  let personalityFlaw = "DISADV_33";
  [@gentype]
  let principles = "DISADV_34";
  [@gentype]
  let badHabit = "DISADV_36";
  [@gentype]
  let negativeTrait = "DISADV_37"; // Schlechte Eigenschaft
  [@gentype]
  let stigma = "DISADV_45";
  [@gentype]
  let deaf = "DISADV_47"; // Taub
  [@gentype]
  let incompetent = "DISADV_48";
  [@gentype]
  let obligations = "DISADV_50"; // Verpflichtungen
  [@gentype]
  let maimed = "DISADV_51"; // Verstümmelt
  [@gentype]
  let brittleBones = "DISADV_56"; // Gläsern
  [@gentype]
  let smallSpellSelection = "DISADV_59";
  [@gentype]
  let wenigePredigten = "DISADV_72";
  [@gentype]
  let wenigeVisionen = "DISADV_73";
};

module SkillId = {
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
    | Clothworking;

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
    | x => invalid_arg("fromInt: " ++ Int.show(x) ++ " is not a valid skill")
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
    };

  // Physical
  [@gentype]
  let flying = "TAL_1";
  [@gentype]
  let gaukelei = "TAL_2";
  [@gentype]
  let climbing = "TAL_3";
  [@gentype]
  let bodyControl = "TAL_4";
  [@gentype]
  let featOfStrength = "TAL_5";
  [@gentype]
  let riding = "TAL_6";
  [@gentype]
  let swimming = "TAL_7";
  [@gentype]
  let selfControl = "TAL_8";
  [@gentype]
  let singing = "TAL_9";
  [@gentype]
  let perception = "TAL_10";
  [@gentype]
  let dancing = "TAL_11";
  [@gentype]
  let pickpocket = "TAL_12";
  [@gentype]
  let stealth = "TAL_13";
  [@gentype]
  let carousing = "TAL_14";
  // Social
  [@gentype]
  let persuasion = "TAL_15";
  [@gentype]
  let seduction = "TAL_16";
  [@gentype]
  let intimidation = "TAL_17";
  [@gentype]
  let etiquette = "TAL_18";
  [@gentype]
  let streetwise = "TAL_19";
  [@gentype]
  let empathy = "TAL_20";
  [@gentype]
  let fastTalk = "TAL_21";
  [@gentype]
  let disguise = "TAL_22";
  [@gentype]
  let willpower = "TAL_23";
  // Nature
  [@gentype]
  let tracking = "TAL_24";
  [@gentype]
  let ropes = "TAL_25";
  [@gentype]
  let fishing = "TAL_26";
  [@gentype]
  let orienting = "TAL_27";
  [@gentype]
  let plantLore = "TAL_28";
  [@gentype]
  let animalLore = "TAL_29";
  [@gentype]
  let survival = "TAL_30";
  // Knowledge
  [@gentype]
  let gambling = "TAL_31";
  [@gentype]
  let geography = "TAL_32";
  [@gentype]
  let history = "TAL_33";
  [@gentype]
  let religions = "TAL_34";
  [@gentype]
  let warfare = "TAL_35";
  [@gentype]
  let magicalLore = "TAL_36";
  [@gentype]
  let mechanics = "TAL_37";
  [@gentype]
  let math = "TAL_38";
  [@gentype]
  let law = "TAL_39";
  [@gentype]
  let mythsAndLegends = "TAL_40";
  [@gentype]
  let sphereLore = "TAL_41";
  [@gentype]
  let astronomy = "TAL_42";
  // Craft
  [@gentype]
  let alchemy = "TAL_43";
  [@gentype]
  let sailing = "TAL_44";
  [@gentype]
  let driving = "TAL_45";
  [@gentype]
  let commerce = "TAL_46";
  [@gentype]
  let treatPoison = "TAL_47";
  [@gentype]
  let treatDisease = "TAL_48";
  [@gentype]
  let treatSoul = "TAL_49";
  [@gentype]
  let treatWounds = "TAL_50";
  [@gentype]
  let woodworking = "TAL_51";
  [@gentype]
  let prepareFood = "TAL_52";
  [@gentype]
  let leatherworking = "TAL_53";
  [@gentype]
  let artisticAbility = "TAL_54";
  [@gentype]
  let metalworking = "TAL_55";
  [@gentype]
  let music = "TAL_56";
  [@gentype]
  let pickLocks = "TAL_57";
  [@gentype]
  let earthencraft = "TAL_58";
  [@gentype]
  let clothworking = "TAL_59";
};

module CombatTechniqueId = {
  [@gentype]
  let crossbows = "CT_1";
  [@gentype]
  let bows = "CT_2";
  [@gentype]
  let daggers = "CT_3";
  [@gentype]
  let fencingWeapons = "CT_4";
  [@gentype]
  let impactWeapons = "CT_5";
  [@gentype]
  let chainWeapons = "CT_6";
  [@gentype]
  let lances = "CT_7";
  [@gentype]
  let brawling = "CT_9";
  [@gentype]
  let shields = "CT_10";
  [@gentype]
  let slings = "CT_11";
  [@gentype]
  let swords = "CT_12";
  [@gentype]
  let polearms = "CT_13";
  [@gentype]
  let thrownWeapons = "CT_14";
  [@gentype]
  let twoHandedImpactWeapons = "CT_15";
  [@gentype]
  let twoHandedSwords = "CT_16";
  [@gentype]
  let spittingFire = "CT_17";
  [@gentype]
  let blowguns = "CT_18";
  [@gentype]
  let discuses = "CT_19";
  [@gentype]
  let faecher = "CT_20";
  [@gentype]
  let spiesswaffen = "CT_21";
};

module SpecialAbilityId = {
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

  [@gentype]
  let skillSpecialization = "SA_9";
  [@gentype]
  let terrainKnowledge = "SA_12";
  [@gentype]
  let craftInstruments = "SA_17";
  [@gentype]
  let hunter = "SA_18";
  [@gentype]
  let areaKnowledge = "SA_22";
  [@gentype]
  let literacy = "SA_27";
  [@gentype]
  let language = "SA_29";
  [@gentype]
  let combatReflexes = "SA_51";
  [@gentype]
  let improvedDodge = "SA_64";
  [@gentype]
  let traditionGuildMages = 70;
  [@gentype]
  let propertyKnowledge = "SA_72";
  [@gentype]
  let propertyFocus = "SA_81";
  [@gentype]
  let aspectKnowledge = "SA_87";
  [@gentype]
  let traditionChurchOfPraios = "SA_86";
  [@gentype]
  let feuerschlucker = "SA_109";
  [@gentype]
  let combatStyleCombination = "SA_164";
  [@gentype]
  let adaptionZauber = "SA_231";
  [@gentype]
  let exorzist = "SA_240";
  [@gentype]
  let favoriteSpellwork = "SA_250"; // Lieblingszauber
  [@gentype]
  let traditionWitches = "SA_255";
  [@gentype]
  let magicStyleCombination = "SA_266";
  [@gentype]
  let harmoniezauberei = "SA_296";
  [@gentype]
  let matrixzauberei = "SA_303";
  [@gentype]
  let traditionElves = "SA_345";
  [@gentype]
  let traditionDruids = "SA_346";
  [@gentype]
  let spellEnhancement = 414;
  [@gentype]
  let forschungsgebiet = "SA_472";
  [@gentype]
  let expertenwissen = "SA_473";
  [@gentype]
  let wissensdurst = "SA_531";
  [@gentype]
  let recherchegespuer = "SA_533";
  [@gentype]
  let predigtDerGemeinschaft = "SA_544";
  [@gentype]
  let predigtDerZuversicht = "SA_545";
  [@gentype]
  let predigtDesGottvertrauens = "SA_546";
  [@gentype]
  let predigtDesWohlgefallens = "SA_547";
  [@gentype]
  let predigtWiderMissgeschicke = "SA_548";
  [@gentype]
  let visionDerBestimmung = "SA_549";
  [@gentype]
  let visionDerEntrueckung = "SA_550"; // Vision der Entrückung
  [@gentype]
  let visionDerGottheit = "SA_551";
  [@gentype]
  let visionDesSchicksals = "SA_552";
  [@gentype]
  let visionDesWahrenGlaubens = "SA_553";
  [@gentype]
  let hoheWeihe = "SA_563";
  [@gentype]
  let lieblingsliturgie = "SA_569";
  [@gentype]
  let zugvoegel = "SA_623";
  [@gentype]
  let jaegerinnenDerWeissenMaid = "SA_625"; // Jägerinnen der Weißen Maid
  [@gentype]
  let anhaengerDesGueldenen = "SA_632";
  [@gentype]
  let gebieterDesAspekts = "SA_639";
  [@gentype]
  let chantEnhancement = 663;
  [@gentype]
  let dunklesAbbildDerBuendnisgabe = "SA_667";
  [@gentype]
  let traditionIllusionist = "SA_676"; // Tradition (Scharlatane)
  [@gentype]
  let traditionArcaneBard = "SA_677"; // Tradition (Zauberbarden)
  [@gentype]
  let traditionArcaneDancer = "SA_678"; // Tradition (Zaubertaenzer)
  [@gentype]
  let traditionIntuitiveMage = "SA_679";
  [@gentype]
  let traditionSavant = "SA_680"; // Tradition (Meistertalentierte)
  [@gentype]
  let traditionQabalyaMage = "SA_681";
  [@gentype]
  let traditionChurchOfRondra = "SA_682";
  [@gentype]
  let traditionChurchOfBoron = "SA_683";
  [@gentype]
  let traditionChurchOfHesinde = "SA_684";
  [@gentype]
  let traditionChurchOfPhex = "SA_685";
  [@gentype]
  let traditionChurchOfPeraine = "SA_686";
  [@gentype]
  let traditionChurchOfEfferd = "SA_687";
  [@gentype]
  let traditionChurchOfTravia = "SA_688";
  [@gentype]
  let traditionChurchOfFirun = "SA_689";
  [@gentype]
  let traditionChurchOfTsa = "SA_690";
  [@gentype]
  let traditionChurchOfIngerimm = "SA_691";
  [@gentype]
  let traditionChurchOfRahja = "SA_692";
  [@gentype]
  let traditionCultOfTheNamelessOne = "SA_693";
  [@gentype]
  let traditionChurchOfAves = "SA_694";
  [@gentype]
  let traditionChurchOfIfirn = "SA_695";
  [@gentype]
  let traditionChurchOfKor = "SA_696";
  [@gentype]
  let traditionChurchOfNandus = "SA_697";
  [@gentype]
  let traditionChurchOfSwafnir = "SA_698";
  [@gentype]
  let languageSpecializations = "SA_699";
  [@gentype]
  let traditionSchelme = "SA_726";
  [@gentype]
  let traditionZauberalchimisten = "SA_750";
  [@gentype]
  let grosseMeditation = "SA_772";
  [@gentype]
  let imitationszauberei = "SA_775";
  [@gentype]
  let kraftliniennutzung = "SA_781";
  [@gentype]
  let scholarDerHalleDesLebensZuNorburg = "SA_802";
  [@gentype]
  let scholarDesKreisesDerEinfuehlung = "SA_808";
  [@gentype]
  let madaschwesternStil = "SA_821";
  [@gentype]
  let garetherGossenStil = "SA_901";
  [@gentype]
  let wegDerGelehrten = "SA_1040";
  [@gentype]
  let traditionCultOfNuminoru = "SA_1049";
  [@gentype]
  let wegDerKuenstlerin = "SA_1069";
  [@gentype]
  let wegDerSchreiberin = "SA_1075";
  [@gentype]
  let fachwissen = "SA_1100";
  [@gentype]
  let handwerkskunst = "SA_1108";
  [@gentype]
  let kindDerNatur = "SA_1110";
  [@gentype]
  let koerperlichesGeschick = "SA_1112";
  [@gentype]
  let sozialeKompetenz = "SA_1123";
  [@gentype]
  let universalgenie = "SA_1127";
  [@gentype]
  let scholarDesMagierkollegsZuHoningen = "SA_1147";
  [@gentype]
  let traditionAnimisten = "SA_1221";
  [@gentype]
  let traditionGeoden = "SA_1255";
  [@gentype]
  let traditionZibilijas = "SA_1293";
  [@gentype]
  let zaubervariabilitaet = "SA_1391";
  [@gentype]
  let traditionBrobimGeoden = "SA_1438";
};

module SocialStatusId = {
  [@gentype]
  let notFree = 1;
  [@gentype]
  let free = 2;
  [@gentype]
  let lesserNoble = 3;
  [@gentype]
  let noble = 4;
  [@gentype]
  let aristocracy = 5;
};

module OptionalRuleId = {
  [@gentype]
  let maximumAttributeScores = "OR_8";
  [@gentype]
  let languageSpecialization = "OR_15";
  [@gentype]
  let higherDefenseStats = "OR_17";
};

module ConditionId = {
  [@gentype]
  let sikaryanVerlust = "COND_11";
  [@gentype]
  let daemonischeAuszehrung = "COND_14";
};
