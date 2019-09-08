/**
 * Please keep enum members sorted by value and not by key!
 */

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
  GrosseZauberauswahl = "ADV_58",
  HatredOf = "ADV_68",
  Prediger = "ADV_77",
  Visionaer = "ADV_78",
  ZahlreichePredigten = "ADV_79",
  ZahlreicheVisionen = "ADV_80",
  LeichterGang = "ADV_92",
}

export enum DisadvantageId {
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
  Incompetent = "DISADV_48",
  // Verpflichtungen
  Obligations = "DISADV_50",
  // Verstümmelt
  Maimed = "DISADV_51",
  // Gläsern
  BrittleBones = "DISADV_56",
  KleineZauberauswahl = "DISADV_59",
  WenigePredigten = "DISADV_72",
  WenigeVisionen = "DISADV_73",
}

export enum SkillId {
  Woodworking = "TAL_51",
  Metalworking = "TAL_55",
}

export enum CombatTechniqueId {
  Lances = "CT_7",
  Shields = "CT_10",
  Feuerspeien = "CT_17",
}

export enum SpecialAbilityId {
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
  Lieblingszauber = "SA_250",
  TraditionWitches = "SA_255",
  MagicalStyleCombination = "SA_266",
  TraditionElves = "SA_345",
  TraditionDruids = "SA_346",
  SpellExtensions = "SA_414",
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
  ChantExtensions = "SA_663",
  DunklesAbbildDerBuendnisgabe = "SA_667",
  TraditionScharlatane = "SA_676",
  TraditionZauberbarden = "SA_677",
  TraditionZaubertaenzer = "SA_678",
  TraditionIntuitiveZauberer = "SA_679",
  TraditionMeistertalentierte = "SA_680",
  TraditionQabalyamagier = "SA_681",
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
  WegDerGelehrten = "SA_1040",
  TraditionCultOfNuminoru = "SA_1049",
  WegDerSchreiberin = "SA_1075",
  Fachwissen = "SA_1100",
  Handwerkskunst = "SA_1108",
  KindDerNatur = "SA_1110",
  KoerperlichesGeschick = "SA_1112",
  SozialeKompetenz = "SA_1123",
  Universalgenie = "SA_1127",
  TraditionAnimisten = "SA_1221",
  TraditionGeoden = "SA_1255",
  TraditionZibilijas = "SA_1293",
  TraditionBrobimGeoden = "SA_1438",
  TraditionKristallomanten = "",
}
