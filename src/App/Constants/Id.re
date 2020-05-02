[@gentype "Id"]
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

[@gentype "ActivatableId"]
type activatable = [
  | `Advantage(int)
  | `Disadvantage(int)
  | `SpecialAbility(int)
];

[@gentype "ActivatableAndSkillId"]
type activatableAndSkill = [
  | `Advantage(int)
  | `Disadvantage(int)
  | `SpecialAbility(int)
  | `Spell(int)
  | `LiturgicalChant(int)
];

[@gentype "ActivatableSkillId"]
type activatableSkill = [ | `Spell(int) | `LiturgicalChant(int)];

[@gentype "PermanentSkillId"]
type permanentSkill = [ | `Skill(int) | `CombatTechnique(int)];

[@gentype "SelectOptionId"]
type selectOption = [
  | `Generic(int)
  | `Skill(int)
  | `CombatTechnique(int)
  | `Spell(int)
  | `Cantrip(int)
  | `LiturgicalChant(int)
  | `Blessing(int)
];

[@gentype "HitZoneArmorZoneItemId"]
type hitZoneArmorZoneItem =
  | Template(int)
  | Custom(int);

[@gentype "Phase"]
type phase =
  | Outline
  | Definition
  | Advancement;

let unsafePhaseFromInt = id =>
  switch (id) {
  | 1 => Outline
  | 2 => Definition
  | 3 => Advancement
  | x =>
    invalid_arg(
      "unsafePhaseFromInt: " ++ Int.show(x) ++ " is not a valid phase",
    )
  };

let phaseToInt = id =>
  switch (id) {
  | Outline => 1
  | Definition => 2
  | Advancement => 3
  };

type experienceLevel =
  | Inexperienced
  | Ordinary
  | Experienced
  | Competent
  | Masterly
  | Brilliant
  | Legendary;

let unsafeExperienceLevelFromInt = id =>
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
      "unsafeExperienceLevelFromInt: "
      ++ Int.show(x)
      ++ " is not a valid experience level",
    )
  };

let experienceLevelToInt = id =>
  switch (id) {
  | Inexperienced => 1
  | Ordinary => 2
  | Experienced => 3
  | Competent => 4
  | Masterly => 5
  | Brilliant => 6
  | Legendary => 7
  };

type attribute =
  | Courage
  | Sagacity
  | Intuition
  | Charisma
  | Dexterity
  | Agility
  | Constitution
  | Strength;

let unsafeAttributeFromInt = id =>
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
      "unsafeAttributeFromInt: " ++ Int.show(x) ++ " is not a valid attribute",
    )
  };

let attributeToInt = id =>
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

type derivedCharacteristic =
  | LifePoints
  | ArcaneEnergy
  | KarmaPoints
  | Spirit
  | Toughness
  | Dodge
  | Initiative
  | Movement
  | WoundThreshold;

let unsafeDerivedCharacteristicFromString = id =>
  switch (id) {
  | "LP" => LifePoints
  | "AE" => ArcaneEnergy
  | "KP" => KarmaPoints
  | "SPI" => Spirit
  | "TOU" => Toughness
  | "DO" => Dodge
  | "INI" => Initiative
  | "MOV" => Movement
  | "WT" => WoundThreshold
  | x =>
    invalid_arg(
      "unsafeDerivedCharacteristicFromString: "
      ++ x
      ++ " is not a valid derived characteristic",
    )
  };

let derivedCharacteristicToString = id =>
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

type advantage =
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

let advantageFromInt = id =>
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

let advantageToInt = id =>
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

type disadvantage =
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

let disadvantageFromInt = id =>
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

let disadvantageToInt = id =>
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

type skill =
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

let unsafeSkillFromInt = id =>
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
  | x =>
    invalid_arg(
      "unsafeSkillFromInt: " ++ Int.show(x) ++ " is not a valid skill",
    )
  };

let skillToInt = id =>
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

type combatTechnique =
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

let combatTechniqueFromInt = id =>
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

let combatTechniqueToInt = id =>
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

type combatTechniqueGroup =
  | Melee
  | Ranged;

let unsafeCombatTechniqueGroupFromInt = id =>
  switch (id) {
  | 1 => Melee
  | 2 => Ranged
  | x =>
    invalid_arg(
      "unsafeCombatTechniqueGroupFromInt: "
      ++ Int.show(x)
      ++ " is not a valid combat technique group",
    )
  };

let combatTechniqueGroupToInt = id =>
  switch (id) {
  | Melee => 1
  | Ranged => 2
  };

type property =
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

let propertyFromInt = id =>
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

let propertyToInt = id =>
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

type specialAbility =
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

let specialAbilityFromInt = id =>
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

let specialAbilityToInt = id =>
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
