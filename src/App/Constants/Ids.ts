import { List } from "../../Data/List"

/**
 * Please keep enum members sorted by value and not by key!
 */

export enum Phase {
  RCP = 1,
  Creation = 2,
  InGame = 3,
}

export enum ExperienceLevelId {
  Inexperienced = "EL_1",
  Ordinary = "EL_2",
  Experienced = "EL_3",
  Competent = "EL_4",
  Masterly = "EL_5",
  Brilliant = "EL_6",
  Legendary = "EL_7",
}

export enum RaceId {
  Humans = "R_1",
  Elves = "R_2",
  HalfElves = "R_3",
  Dwarves = "R_4",
}

export enum CultureId {
  GladeElves = "C_19",
  Firnelves = "C_20",
  WoodElves = "C_21",
  Steppenelfen = "C_28",
}

export enum ProfessionId {
  CustomProfession = "P_0",
}

export enum AttrId {
  Courage = "ATTR_1",
  Sagacity = "ATTR_2",
  Intuition = "ATTR_3",
  Charisma = "ATTR_4",
  Dexterity = "ATTR_5",
  Agility = "ATTR_6",
  Constitution = "ATTR_7",
  Strength = "ATTR_8",
}

export enum DCId {
  LP = "LP",
  AE = "AE",
  KP = "KP",
  SPI = "SPI",
  TOU = "TOU",
  DO = "DO",
  INI = "INI",
  MOV = "MOV",
  WT = "WT",
}

export enum EnergyId {
  LP = DCId.LP,
  AE = DCId.AE,
  KP = DCId.KP,
}

export enum AdvantageId {
  CustomAdvantage = "ADV_0",

  // Begabung
  Aptitude = "ADV_4",

  // Flink
  Nimble = "ADV_9",
  Blessed = "ADV_12",
  Luck = "ADV_14",
  ExceptionalSkill = "ADV_16",
  ExceptionalCombatTechnique = "ADV_17",
  IncreasedAstralPower = "ADV_23",
  IncreasedKarmaPoints = "ADV_24",
  IncreasedLifePoints = "ADV_25",
  IncreasedSpirit = "ADV_26",
  IncreasedToughness = "ADV_27",
  ImmunityToPoison = "ADV_28",
  ImmunityToDisease = "ADV_29",
  MagicalAttunement = "ADV_32",
  Rich = "ADV_36",
  SociallyAdaptable = "ADV_40",
  InspireConfidence = "ADV_46",
  WeaponAptitude = "ADV_47",
  Spellcaster = "ADV_50",

  // Eisern
  Unyielding = "ADV_54",
  LargeSpellSelection = "ADV_58",
  HatredOf = "ADV_68",
  Prediger = "ADV_77",
  Visionaer = "ADV_78",
  ZahlreichePredigten = "ADV_79",
  ZahlreicheVisionen = "ADV_80",
  LeichterGang = "ADV_92",
  Einkommen = "ADV_99",
}

/**
 * Lists advantage IDs that have no influence on the AP maximum for advantages.
 */
export const AdvantageIdsNoMaxInfl = List<AdvantageId> (AdvantageId.Einkommen)

export enum DisadvantageId {
  CustomDisadvantage = "DISADV_0",
  AfraidOf = "DISADV_1",
  Poor = "DISADV_2",
  Slow = "DISADV_4",
  NoFlyingBalm = "DISADV_17",
  NoFamiliar = "DISADV_18",
  MagicalRestriction = "DISADV_24",
  DecreasedArcanePower = "DISADV_26",
  DecreasedKarmaPoints = "DISADV_27",
  DecreasedLifePoints = "DISADV_28",
  DecreasedSpirit = "DISADV_29",
  DecreasedToughness = "DISADV_30",
  BadLuck = "DISADV_31",
  PersonalityFlaw = "DISADV_33",
  Principles = "DISADV_34",
  BadHabit = "DISADV_36",

  // Schlechte Eigenschaft
  NegativeTrait = "DISADV_37",
  Stigma = "DISADV_45",

  // Taub
  Deaf = "DISADV_47",
  Incompetent = "DISADV_48",

  // Verpflichtungen
  Obligations = "DISADV_50",

  // Verstümmelt
  Maimed = "DISADV_51",

  // Gläsern
  BrittleBones = "DISADV_56",
  SmallSpellSelection = "DISADV_59",
  WenigePredigten = "DISADV_72",
  WenigeVisionen = "DISADV_73",
}

export enum SkillId {
  Flying = "TAL_1",
  Gaukelei = "TAL_2",
  Climbing = "TAL_3",
  BodyControl = "TAL_4",
  FeatOfStrength = "TAL_5",
  Riding = "TAL_6",
  Swimming = "TAL_7",
  SelfControl = "TAL_8",
  Singing = "TAL_9",
  Perception = "TAL_10",
  Dancing = "TAL_11",
  Pickpocket = "TAL_12",
  Stealth = "TAL_13",
  Carousing = "TAL_14",
  Persuasion = "TAL_15",
  Seduction = "TAL_16",
  Intimidation = "TAL_17",
  Etiquette = "TAL_18",
  Streetwise = "TAL_19",
  Empathy = "TAL_20",
  FastTalk = "TAL_21",
  Disguise = "TAL_22",
  Willpower = "TAL_23",
  Tracking = "TAL_24",
  Ropes = "TAL_25",
  Fishing = "TAL_26",
  Orienting = "TAL_27",
  PlantLore = "TAL_28",
  AnimalLore = "TAL_29",
  Survival = "TAL_30",
  Gambling = "TAL_31",
  Geography = "TAL_32",
  History = "TAL_33",
  Religions = "TAL_34",
  Warfare = "TAL_35",
  MagicalLore = "TAL_36",
  Mechanics = "TAL_37",
  Math = "TAL_38",
  Law = "TAL_39",
  MythsAndLegends = "TAL_40",
  SphereLore = "TAL_41",
  Astronomy = "TAL_42",
  Alchemy = "TAL_43",
  Sailing = "TAL_44",
  Driving = "TAL_45",
  Commerce = "TAL_46",
  TreatPoison = "TAL_47",
  TreatDisease = "TAL_48",
  TreatSoul = "TAL_49",
  TreatWounds = "TAL_50",
  Woodworking = "TAL_51",
  PrepareFood = "TAL_52",
  Leatherworking = "TAL_53",
  ArtisticAbility = "TAL_54",
  Metalworking = "TAL_55",
  Music = "TAL_56",
  PickLocks = "TAL_57",
  Earthencraft = "TAL_58",
  Clothworking = "TAL_59",
}

export enum CombatTechniqueId {
  Crossbows = "CT_1",
  Bows = "CT_2",
  Daggers = "CT_3",
  FencingWeapons = "CT_4",
  ImpactWeapons = "CT_5",
  ChainWeapons = "CT_6",
  Lances = "CT_7",
  Brawling = "CT_9",
  Shields = "CT_10",
  Slings = "CT_11",
  Swords = "CT_12",
  Polearms = "CT_13",
  ThrownWeapons = "CT_14",
  TwoHandedImpactWeapons = "CT_15",
  TwoHandedSwords = "CT_16",
  SpittingFire = "CT_17",
  Blowguns = "CT_18",
  Discuses = "CT_19",
  Faecher = "CT_20",
  Spiesswaffen = "CT_21",
}

export enum MeleeCombatTechniqueId {
  Daggers = CombatTechniqueId.Daggers,
  FencingWeapons = CombatTechniqueId.FencingWeapons,
  ImpactWeapons = CombatTechniqueId.ImpactWeapons,
  ChainWeapons = CombatTechniqueId.ChainWeapons,
  Lances = CombatTechniqueId.Lances,
  Brawling = CombatTechniqueId.Brawling,
  Shields = CombatTechniqueId.Shields,
  Swords = CombatTechniqueId.Swords,
  Polearms = CombatTechniqueId.Polearms,
  TwoHandedImpactWeapons = CombatTechniqueId.TwoHandedImpactWeapons,
  TwoHandedSwords = CombatTechniqueId.TwoHandedSwords,
  Faecher = CombatTechniqueId.Faecher,
  Spiesswaffen = CombatTechniqueId.Spiesswaffen,
}

export enum RangedCombatTechniqueId {
  Crossbows = CombatTechniqueId.Crossbows,
  Bows = CombatTechniqueId.Bows,
  Slings = CombatTechniqueId.Slings,
  ThrownWeapons = CombatTechniqueId.ThrownWeapons,
  SpittingFire = CombatTechniqueId.SpittingFire,
  Blowguns = CombatTechniqueId.Blowguns,
  Discuses = CombatTechniqueId.Discuses,
}

export enum SpecialAbilityId {
  CustomSpecialAbility = "SA_0",
  SkillSpecialization = "SA_9",
  TerrainKnowledge = "SA_12",
  CraftInstruments = "SA_17",
  Hunter = "SA_18",
  AreaKnowledge = "SA_22",
  Literacy = "SA_27",
  Language = "SA_29",
  CombatReflexes = "SA_51",
  ImprovedDodge = "SA_64",
  TraditionGuildMages = "SA_70",
  PropertyKnowledge = "SA_72",
  PropertyFocus = "SA_81",
  AspectKnowledge = "SA_87",
  TraditionChurchOfPraios = "SA_86",
  Feuerschlucker = "SA_109",
  CombatStyleCombination = "SA_164",
  AdaptionZauber = "SA_231",
  Exorzist = "SA_240",

  // Lieblingszauber
  FavoriteSpellwork = "SA_250",
  TraditionWitches = "SA_255",
  MagicStyleCombination = "SA_266",
  TraditionElves = "SA_345",
  TraditionDruids = "SA_346",
  SpellEnhancement = "SA_414",
  Forschungsgebiet = "SA_472",
  Expertenwissen = "SA_473",
  Wissensdurst = "SA_531",
  Recherchegespuer = "SA_533",
  PredigtDerGemeinschaft = "SA_544",
  PredigtDerZuversicht = "SA_545",
  PredigtDesGottvertrauens = "SA_546",
  PredigtDesWohlgefallens = "SA_547",
  PredigtWiderMissgeschicke = "SA_548",
  VisionDerBestimmung = "SA_549",
  VisionDerEntrückung = "SA_550",
  VisionDerGottheit = "SA_551",
  VisionDesSchicksals = "SA_552",
  VisionDesWahrenGlaubens = "SA_553",
  HoheWeihe = "SA_563",
  Lieblingsliturgie = "SA_569",
  Zugvoegel = "SA_623",
  JaegerinnenDerWeißenMaid = "SA_625",
  AnhaengerDesGueldenen = "SA_632",
  GebieterDesAspekts = "SA_639",
  ChantEnhancement = "SA_663",
  DunklesAbbildDerBuendnisgabe = "SA_667",

  // Tradition (Scharlatane)
  TraditionIllusionist = "SA_676",

  // Tradition (Zauberbarden)
  TraditionArcaneBard = "SA_677",

  // Tradition (Zaubertaenzer)
  TraditionArcaneDancer = "SA_678",
  TraditionIntuitiveMage = "SA_679",

  // Tradition (Meistertalentierte)
  TraditionSavant = "SA_680",
  TraditionQabalyaMage = "SA_681",
  TraditionChurchOfRondra = "SA_682",
  TraditionChurchOfBoron = "SA_683",
  TraditionChurchOfHesinde = "SA_684",
  TraditionChurchOfPhex = "SA_685",
  TraditionChurchOfPeraine = "SA_686",
  TraditionChurchOfEfferd = "SA_687",
  TraditionChurchOfTravia = "SA_688",
  TraditionChurchOfFirun = "SA_689",
  TraditionChurchOfTsa = "SA_690",
  TraditionChurchOfIngerimm = "SA_691",
  TraditionChurchOfRahja = "SA_692",
  TraditionCultOfTheNamelessOne = "SA_693",
  TraditionChurchOfAves = "SA_694",
  TraditionChurchOfIfirn = "SA_695",
  TraditionChurchOfKor = "SA_696",
  TraditionChurchOfNandus = "SA_697",
  TraditionChurchOfSwafnir = "SA_698",
  LanguageSpecializations = "SA_699",
  TraditionSchelme = "SA_726",
  TraditionZauberalchimisten = "SA_750",
  GrosseMeditation = "SA_772",
  ScholarDerHalleDesLebensZuNorburg = "SA_802",
  ScholarDesKreisesDerEinfuehlung = "SA_808",
  MadaschwesternStil = "SA_821",
  GaretherGossenStil = "SA_901",
  WegDerGelehrten = "SA_1040",
  TraditionCultOfNuminoru = "SA_1049",
  WegDerKuenstlerin = "SA_1069",
  WegDerSchreiberin = "SA_1075",
  Fachwissen = "SA_1100",
  Handwerkskunst = "SA_1108",
  KindDerNatur = "SA_1110",
  KoerperlichesGeschick = "SA_1112",
  SozialeKompetenz = "SA_1123",
  Universalgenie = "SA_1127",
  ScholarDesMagierkollegsZuHoningen = "SA_1147",
  TraditionAnimisten = "SA_1221",
  TraditionGeoden = "SA_1255",
  TraditionZibilijas = "SA_1293",
  Zaubervariabilitaet = "SA_1391",
  TraditionBrobimGeoden = "SA_1438",
  TraditionKristallomanten = "",
}

export enum SocialStatusId {
  NotFree = 1,
  Free = 2,
  LesserNoble = 3,
  Noble = 4,
  Aristocracy = 5,
}

export enum OptionalRuleId {
  MaximumAttributeScores = "OR_8",
  LanguageSpecialization = "OR_15",
  HigherDefenseStats = "OR_17",
}
