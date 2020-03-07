[@gentype "SID"]
type selectOptionId =
  | Numeric(int)
  | Skill(string)
  | CombatTechnique(string);

module PhaseId = {
  [@gentype]
  let rcp = 1;
  [@gentype]
  let creation = 2;
  [@gentype]
  let inGame = 3;
};

module ExperienceLevelId = {
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
  let traditionGuildMages = "SA_70";
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
  let spellEnhancement = "SA_414";
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
  let chantEnhancement = "SA_663";
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
