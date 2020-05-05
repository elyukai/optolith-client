/* TypeScript file generated from Ids.re by genType. */
/* eslint-disable import/first */


// tslint:disable-next-line:no-var-requires
const IdsBS = require('./Ids.bs');

// tslint:disable-next-line:interface-over-type-literal
export type id = 
    { tag: "ExperienceLevel"; value: number }
  | { tag: "Race"; value: number }
  | { tag: "Culture"; value: number }
  | { tag: "Profession"; value: number }
  | { tag: "Attribute"; value: number }
  | { tag: "Advantage"; value: number }
  | { tag: "Disadvantage"; value: number }
  | { tag: "Skill"; value: number }
  | { tag: "CombatTechnique"; value: number }
  | { tag: "Spell"; value: number }
  | { tag: "Curse"; value: number }
  | { tag: "ElvenMagicalSong"; value: number }
  | { tag: "DominationRitual"; value: number }
  | { tag: "MagicalMelody"; value: number }
  | { tag: "MagicalDance"; value: number }
  | { tag: "RogueSpell"; value: number }
  | { tag: "AnimistForce"; value: number }
  | { tag: "GeodeRitual"; value: number }
  | { tag: "ZibiljaRitual"; value: number }
  | { tag: "Cantrip"; value: number }
  | { tag: "LiturgicalChant"; value: number }
  | { tag: "Blessing"; value: number }
  | { tag: "SpecialAbility"; value: number }
  | { tag: "Item"; value: number }
  | { tag: "EquipmentPackage"; value: number }
  | { tag: "HitZoneArmor"; value: number }
  | { tag: "Familiar"; value: number }
  | { tag: "Animal"; value: number }
  | { tag: "FocusRule"; value: number }
  | { tag: "OptionalRule"; value: number }
  | { tag: "Condition"; value: number }
  | { tag: "State"; value: number };
export type Id = id;

// tslint:disable-next-line:interface-over-type-literal
export type activatableId = 
    { tag: "Advantage"; value: number }
  | { tag: "Disadvantage"; value: number }
  | { tag: "SpecialAbility"; value: number };
export type ActivatableId = activatableId;

// tslint:disable-next-line:interface-over-type-literal
export type activatableAndSkillId = 
    { tag: "Advantage"; value: number }
  | { tag: "Disadvantage"; value: number }
  | { tag: "SpecialAbility"; value: number }
  | { tag: "Spell"; value: number }
  | { tag: "LiturgicalChant"; value: number };
export type ActivatableAndSkillId = activatableAndSkillId;

// tslint:disable-next-line:interface-over-type-literal
export type activatableSkillId = 
    { tag: "Spell"; value: number }
  | { tag: "LiturgicalChant"; value: number };
export type ActivatableSkillId = activatableSkillId;

// tslint:disable-next-line:interface-over-type-literal
export type skillId = 
    { tag: "Skill"; value: number }
  | { tag: "CombatTechnique"; value: number };
export type SkillId = skillId;

// tslint:disable-next-line:interface-over-type-literal
export type selectOptionId = 
    { tag: "Generic"; value: number }
  | { tag: "Skill"; value: number }
  | { tag: "CombatTechnique"; value: number }
  | { tag: "Spell"; value: number }
  | { tag: "Cantrip"; value: number }
  | { tag: "LiturgicalChant"; value: number }
  | { tag: "Blessing"; value: number };
export type SelectOptionId = selectOptionId;

// tslint:disable-next-line:interface-over-type-literal
export type hitZoneArmorZoneItemId = 
    { tag: "Template"; value: number }
  | { tag: "Custom"; value: number };
export type HitZoneArmorZoneItemId = hitZoneArmorZoneItemId;

// tslint:disable-next-line:interface-over-type-literal
export type Phase_t = "Outline" | "Definition" | "Advancement";
export type Phase = Phase_t;

export const Phase_rcp: number = IdsBS.Phase.rcp;

export const Phase_creation: number = IdsBS.Phase.creation;

export const Phase_inGame: number = IdsBS.Phase.inGame;

export const ExperienceLevelId_inexperienced: string = IdsBS.ExperienceLevelId.inexperienced;

export const ExperienceLevelId_ordinary: string = IdsBS.ExperienceLevelId.ordinary;

export const ExperienceLevelId_experienced: string = IdsBS.ExperienceLevelId.experienced;

export const ExperienceLevelId_competent: string = IdsBS.ExperienceLevelId.competent;

export const ExperienceLevelId_masterly: string = IdsBS.ExperienceLevelId.masterly;

export const ExperienceLevelId_brilliant: string = IdsBS.ExperienceLevelId.brilliant;

export const ExperienceLevelId_legendary: string = IdsBS.ExperienceLevelId.legendary;

export const RaceId_humans: string = IdsBS.RaceId.humans;

export const RaceId_elves: string = IdsBS.RaceId.elves;

export const RaceId_halfElves: string = IdsBS.RaceId.halfElves;

export const RaceId_dwarves: string = IdsBS.RaceId.dwarves;

export const CultureId_gladeElves: string = IdsBS.CultureId.gladeElves;

export const CultureId_firnelves: string = IdsBS.CultureId.firnelves;

export const CultureId_woodElves: string = IdsBS.CultureId.woodElves;

export const CultureId_steppenelfen: string = IdsBS.CultureId.steppenelfen;

export const ProfessionId_customProfession: string = IdsBS.ProfessionId.customProfession;

export const AttrId_courage: string = IdsBS.AttrId.courage;

export const AttrId_sagacity: string = IdsBS.AttrId.sagacity;

export const AttrId_intuition: string = IdsBS.AttrId.intuition;

export const AttrId_charisma: string = IdsBS.AttrId.charisma;

export const AttrId_dexterity: string = IdsBS.AttrId.dexterity;

export const AttrId_agility: string = IdsBS.AttrId.agility;

export const AttrId_constitution: string = IdsBS.AttrId.constitution;

export const AttrId_strength: string = IdsBS.AttrId.strength;

export const DCId_lifePoints: string = IdsBS.DCId.lifePoints;

export const DCId_arcaneEnergy: string = IdsBS.DCId.arcaneEnergy;

export const DCId_karmaPoints: string = IdsBS.DCId.karmaPoints;

export const DCId_spirit: string = IdsBS.DCId.spirit;

export const DCId_toughness: string = IdsBS.DCId.toughness;

export const DCId_dodge: string = IdsBS.DCId.dodge;

export const DCId_initiative: string = IdsBS.DCId.initiative;

export const DCId_movement: string = IdsBS.DCId.movement;

export const DCId_woundThreshold: string = IdsBS.DCId.woundThreshold;

export const AdvantageId_aptitude: string = IdsBS.AdvantageId.aptitude;

export const AdvantageId_nimble: string = IdsBS.AdvantageId.nimble;

export const AdvantageId_blessed: string = IdsBS.AdvantageId.blessed;

export const AdvantageId_luck: string = IdsBS.AdvantageId.luck;

export const AdvantageId_exceptionalSkill: string = IdsBS.AdvantageId.exceptionalSkill;

export const AdvantageId_exceptionalCombatTechnique: string = IdsBS.AdvantageId.exceptionalCombatTechnique;

export const AdvantageId_increasedAstralPower: string = IdsBS.AdvantageId.increasedAstralPower;

export const AdvantageId_increasedKarmaPoints: string = IdsBS.AdvantageId.increasedKarmaPoints;

export const AdvantageId_increasedLifePoints: string = IdsBS.AdvantageId.increasedLifePoints;

export const AdvantageId_increasedSpirit: string = IdsBS.AdvantageId.increasedSpirit;

export const AdvantageId_increasedToughness: string = IdsBS.AdvantageId.increasedToughness;

export const AdvantageId_immunityToPoison: string = IdsBS.AdvantageId.immunityToPoison;

export const AdvantageId_immunityToDisease: string = IdsBS.AdvantageId.immunityToDisease;

export const AdvantageId_magicalAttunement: string = IdsBS.AdvantageId.magicalAttunement;

export const AdvantageId_rich: string = IdsBS.AdvantageId.rich;

export const AdvantageId_sociallyAdaptable: string = IdsBS.AdvantageId.sociallyAdaptable;

export const AdvantageId_inspireConfidence: string = IdsBS.AdvantageId.inspireConfidence;

export const AdvantageId_weaponAptitude: string = IdsBS.AdvantageId.weaponAptitude;

export const AdvantageId_spellcaster: string = IdsBS.AdvantageId.spellcaster;

export const AdvantageId_unyielding: string = IdsBS.AdvantageId.unyielding;

export const AdvantageId_largeSpellSelection: string = IdsBS.AdvantageId.largeSpellSelection;

export const AdvantageId_hatredOf: string = IdsBS.AdvantageId.hatredOf;

export const AdvantageId_prediger: string = IdsBS.AdvantageId.prediger;

export const AdvantageId_visionaer: string = IdsBS.AdvantageId.visionaer;

export const AdvantageId_zahlreichePredigten: string = IdsBS.AdvantageId.zahlreichePredigten;

export const AdvantageId_zahlreicheVisionen: string = IdsBS.AdvantageId.zahlreicheVisionen;

export const AdvantageId_leichterGang: string = IdsBS.AdvantageId.leichterGang;

export const AdvantageId_einkommen: string = IdsBS.AdvantageId.einkommen;

export const DisadvantageId_afraidOf: string = IdsBS.DisadvantageId.afraidOf;

export const DisadvantageId_poor: string = IdsBS.DisadvantageId.poor;

export const DisadvantageId_slow: string = IdsBS.DisadvantageId.slow;

export const DisadvantageId_noFlyingBalm: string = IdsBS.DisadvantageId.noFlyingBalm;

export const DisadvantageId_noFamiliar: string = IdsBS.DisadvantageId.noFamiliar;

export const DisadvantageId_magicalRestriction: string = IdsBS.DisadvantageId.magicalRestriction;

export const DisadvantageId_decreasedArcanePower: string = IdsBS.DisadvantageId.decreasedArcanePower;

export const DisadvantageId_decreasedKarmaPoints: string = IdsBS.DisadvantageId.decreasedKarmaPoints;

export const DisadvantageId_decreasedLifePoints: string = IdsBS.DisadvantageId.decreasedLifePoints;

export const DisadvantageId_decreasedSpirit: string = IdsBS.DisadvantageId.decreasedSpirit;

export const DisadvantageId_decreasedToughness: string = IdsBS.DisadvantageId.decreasedToughness;

export const DisadvantageId_badLuck: string = IdsBS.DisadvantageId.badLuck;

export const DisadvantageId_personalityFlaw: string = IdsBS.DisadvantageId.personalityFlaw;

export const DisadvantageId_principles: string = IdsBS.DisadvantageId.principles;

export const DisadvantageId_badHabit: string = IdsBS.DisadvantageId.badHabit;

export const DisadvantageId_negativeTrait: string = IdsBS.DisadvantageId.negativeTrait;

export const DisadvantageId_stigma: string = IdsBS.DisadvantageId.stigma;

export const DisadvantageId_deaf: string = IdsBS.DisadvantageId.deaf;

export const DisadvantageId_incompetent: string = IdsBS.DisadvantageId.incompetent;

export const DisadvantageId_obligations: string = IdsBS.DisadvantageId.obligations;

export const DisadvantageId_maimed: string = IdsBS.DisadvantageId.maimed;

export const DisadvantageId_brittleBones: string = IdsBS.DisadvantageId.brittleBones;

export const DisadvantageId_smallSpellSelection: string = IdsBS.DisadvantageId.smallSpellSelection;

export const DisadvantageId_wenigePredigten: string = IdsBS.DisadvantageId.wenigePredigten;

export const DisadvantageId_wenigeVisionen: string = IdsBS.DisadvantageId.wenigeVisionen;

export const SkillId_flying: string = IdsBS.SkillId.flying;

export const SkillId_gaukelei: string = IdsBS.SkillId.gaukelei;

export const SkillId_climbing: string = IdsBS.SkillId.climbing;

export const SkillId_bodyControl: string = IdsBS.SkillId.bodyControl;

export const SkillId_featOfStrength: string = IdsBS.SkillId.featOfStrength;

export const SkillId_riding: string = IdsBS.SkillId.riding;

export const SkillId_swimming: string = IdsBS.SkillId.swimming;

export const SkillId_selfControl: string = IdsBS.SkillId.selfControl;

export const SkillId_singing: string = IdsBS.SkillId.singing;

export const SkillId_perception: string = IdsBS.SkillId.perception;

export const SkillId_dancing: string = IdsBS.SkillId.dancing;

export const SkillId_pickpocket: string = IdsBS.SkillId.pickpocket;

export const SkillId_stealth: string = IdsBS.SkillId.stealth;

export const SkillId_carousing: string = IdsBS.SkillId.carousing;

export const SkillId_persuasion: string = IdsBS.SkillId.persuasion;

export const SkillId_seduction: string = IdsBS.SkillId.seduction;

export const SkillId_intimidation: string = IdsBS.SkillId.intimidation;

export const SkillId_etiquette: string = IdsBS.SkillId.etiquette;

export const SkillId_streetwise: string = IdsBS.SkillId.streetwise;

export const SkillId_empathy: string = IdsBS.SkillId.empathy;

export const SkillId_fastTalk: string = IdsBS.SkillId.fastTalk;

export const SkillId_disguise: string = IdsBS.SkillId.disguise;

export const SkillId_willpower: string = IdsBS.SkillId.willpower;

export const SkillId_tracking: string = IdsBS.SkillId.tracking;

export const SkillId_ropes: string = IdsBS.SkillId.ropes;

export const SkillId_fishing: string = IdsBS.SkillId.fishing;

export const SkillId_orienting: string = IdsBS.SkillId.orienting;

export const SkillId_plantLore: string = IdsBS.SkillId.plantLore;

export const SkillId_animalLore: string = IdsBS.SkillId.animalLore;

export const SkillId_survival: string = IdsBS.SkillId.survival;

export const SkillId_gambling: string = IdsBS.SkillId.gambling;

export const SkillId_geography: string = IdsBS.SkillId.geography;

export const SkillId_history: string = IdsBS.SkillId.history;

export const SkillId_religions: string = IdsBS.SkillId.religions;

export const SkillId_warfare: string = IdsBS.SkillId.warfare;

export const SkillId_magicalLore: string = IdsBS.SkillId.magicalLore;

export const SkillId_mechanics: string = IdsBS.SkillId.mechanics;

export const SkillId_math: string = IdsBS.SkillId.math;

export const SkillId_law: string = IdsBS.SkillId.law;

export const SkillId_mythsAndLegends: string = IdsBS.SkillId.mythsAndLegends;

export const SkillId_sphereLore: string = IdsBS.SkillId.sphereLore;

export const SkillId_astronomy: string = IdsBS.SkillId.astronomy;

export const SkillId_alchemy: string = IdsBS.SkillId.alchemy;

export const SkillId_sailing: string = IdsBS.SkillId.sailing;

export const SkillId_driving: string = IdsBS.SkillId.driving;

export const SkillId_commerce: string = IdsBS.SkillId.commerce;

export const SkillId_treatPoison: string = IdsBS.SkillId.treatPoison;

export const SkillId_treatDisease: string = IdsBS.SkillId.treatDisease;

export const SkillId_treatSoul: string = IdsBS.SkillId.treatSoul;

export const SkillId_treatWounds: string = IdsBS.SkillId.treatWounds;

export const SkillId_woodworking: string = IdsBS.SkillId.woodworking;

export const SkillId_prepareFood: string = IdsBS.SkillId.prepareFood;

export const SkillId_leatherworking: string = IdsBS.SkillId.leatherworking;

export const SkillId_artisticAbility: string = IdsBS.SkillId.artisticAbility;

export const SkillId_metalworking: string = IdsBS.SkillId.metalworking;

export const SkillId_music: string = IdsBS.SkillId.music;

export const SkillId_pickLocks: string = IdsBS.SkillId.pickLocks;

export const SkillId_earthencraft: string = IdsBS.SkillId.earthencraft;

export const SkillId_clothworking: string = IdsBS.SkillId.clothworking;

export const CombatTechniqueId_crossbows: string = IdsBS.CombatTechniqueId.crossbows;

export const CombatTechniqueId_bows: string = IdsBS.CombatTechniqueId.bows;

export const CombatTechniqueId_daggers: string = IdsBS.CombatTechniqueId.daggers;

export const CombatTechniqueId_fencingWeapons: string = IdsBS.CombatTechniqueId.fencingWeapons;

export const CombatTechniqueId_impactWeapons: string = IdsBS.CombatTechniqueId.impactWeapons;

export const CombatTechniqueId_chainWeapons: string = IdsBS.CombatTechniqueId.chainWeapons;

export const CombatTechniqueId_lances: string = IdsBS.CombatTechniqueId.lances;

export const CombatTechniqueId_brawling: string = IdsBS.CombatTechniqueId.brawling;

export const CombatTechniqueId_shields: string = IdsBS.CombatTechniqueId.shields;

export const CombatTechniqueId_slings: string = IdsBS.CombatTechniqueId.slings;

export const CombatTechniqueId_swords: string = IdsBS.CombatTechniqueId.swords;

export const CombatTechniqueId_polearms: string = IdsBS.CombatTechniqueId.polearms;

export const CombatTechniqueId_thrownWeapons: string = IdsBS.CombatTechniqueId.thrownWeapons;

export const CombatTechniqueId_twoHandedImpactWeapons: string = IdsBS.CombatTechniqueId.twoHandedImpactWeapons;

export const CombatTechniqueId_twoHandedSwords: string = IdsBS.CombatTechniqueId.twoHandedSwords;

export const CombatTechniqueId_spittingFire: string = IdsBS.CombatTechniqueId.spittingFire;

export const CombatTechniqueId_blowguns: string = IdsBS.CombatTechniqueId.blowguns;

export const CombatTechniqueId_discuses: string = IdsBS.CombatTechniqueId.discuses;

export const CombatTechniqueId_faecher: string = IdsBS.CombatTechniqueId.faecher;

export const CombatTechniqueId_spiesswaffen: string = IdsBS.CombatTechniqueId.spiesswaffen;

export const SpecialAbilityId_skillSpecialization: string = IdsBS.SpecialAbilityId.skillSpecialization;

export const SpecialAbilityId_terrainKnowledge: string = IdsBS.SpecialAbilityId.terrainKnowledge;

export const SpecialAbilityId_craftInstruments: string = IdsBS.SpecialAbilityId.craftInstruments;

export const SpecialAbilityId_hunter: string = IdsBS.SpecialAbilityId.hunter;

export const SpecialAbilityId_areaKnowledge: string = IdsBS.SpecialAbilityId.areaKnowledge;

export const SpecialAbilityId_literacy: string = IdsBS.SpecialAbilityId.literacy;

export const SpecialAbilityId_language: string = IdsBS.SpecialAbilityId.language;

export const SpecialAbilityId_combatReflexes: string = IdsBS.SpecialAbilityId.combatReflexes;

export const SpecialAbilityId_improvedDodge: string = IdsBS.SpecialAbilityId.improvedDodge;

export const SpecialAbilityId_traditionGuildMages: number = IdsBS.SpecialAbilityId.traditionGuildMages;

export const SpecialAbilityId_propertyKnowledge: string = IdsBS.SpecialAbilityId.propertyKnowledge;

export const SpecialAbilityId_propertyFocus: string = IdsBS.SpecialAbilityId.propertyFocus;

export const SpecialAbilityId_aspectKnowledge: string = IdsBS.SpecialAbilityId.aspectKnowledge;

export const SpecialAbilityId_traditionChurchOfPraios: string = IdsBS.SpecialAbilityId.traditionChurchOfPraios;

export const SpecialAbilityId_feuerschlucker: string = IdsBS.SpecialAbilityId.feuerschlucker;

export const SpecialAbilityId_combatStyleCombination: string = IdsBS.SpecialAbilityId.combatStyleCombination;

export const SpecialAbilityId_adaptionZauber: string = IdsBS.SpecialAbilityId.adaptionZauber;

export const SpecialAbilityId_exorzist: string = IdsBS.SpecialAbilityId.exorzist;

export const SpecialAbilityId_favoriteSpellwork: string = IdsBS.SpecialAbilityId.favoriteSpellwork;

export const SpecialAbilityId_traditionWitches: string = IdsBS.SpecialAbilityId.traditionWitches;

export const SpecialAbilityId_magicStyleCombination: string = IdsBS.SpecialAbilityId.magicStyleCombination;

export const SpecialAbilityId_harmoniezauberei: string = IdsBS.SpecialAbilityId.harmoniezauberei;

export const SpecialAbilityId_matrixzauberei: string = IdsBS.SpecialAbilityId.matrixzauberei;

export const SpecialAbilityId_traditionElves: string = IdsBS.SpecialAbilityId.traditionElves;

export const SpecialAbilityId_traditionDruids: string = IdsBS.SpecialAbilityId.traditionDruids;

export const SpecialAbilityId_spellEnhancement: number = IdsBS.SpecialAbilityId.spellEnhancement;

export const SpecialAbilityId_forschungsgebiet: string = IdsBS.SpecialAbilityId.forschungsgebiet;

export const SpecialAbilityId_expertenwissen: string = IdsBS.SpecialAbilityId.expertenwissen;

export const SpecialAbilityId_wissensdurst: string = IdsBS.SpecialAbilityId.wissensdurst;

export const SpecialAbilityId_recherchegespuer: string = IdsBS.SpecialAbilityId.recherchegespuer;

export const SpecialAbilityId_predigtDerGemeinschaft: string = IdsBS.SpecialAbilityId.predigtDerGemeinschaft;

export const SpecialAbilityId_predigtDerZuversicht: string = IdsBS.SpecialAbilityId.predigtDerZuversicht;

export const SpecialAbilityId_predigtDesGottvertrauens: string = IdsBS.SpecialAbilityId.predigtDesGottvertrauens;

export const SpecialAbilityId_predigtDesWohlgefallens: string = IdsBS.SpecialAbilityId.predigtDesWohlgefallens;

export const SpecialAbilityId_predigtWiderMissgeschicke: string = IdsBS.SpecialAbilityId.predigtWiderMissgeschicke;

export const SpecialAbilityId_visionDerBestimmung: string = IdsBS.SpecialAbilityId.visionDerBestimmung;

export const SpecialAbilityId_visionDerEntrueckung: string = IdsBS.SpecialAbilityId.visionDerEntrueckung;

export const SpecialAbilityId_visionDerGottheit: string = IdsBS.SpecialAbilityId.visionDerGottheit;

export const SpecialAbilityId_visionDesSchicksals: string = IdsBS.SpecialAbilityId.visionDesSchicksals;

export const SpecialAbilityId_visionDesWahrenGlaubens: string = IdsBS.SpecialAbilityId.visionDesWahrenGlaubens;

export const SpecialAbilityId_hoheWeihe: string = IdsBS.SpecialAbilityId.hoheWeihe;

export const SpecialAbilityId_lieblingsliturgie: string = IdsBS.SpecialAbilityId.lieblingsliturgie;

export const SpecialAbilityId_zugvoegel: string = IdsBS.SpecialAbilityId.zugvoegel;

export const SpecialAbilityId_jaegerinnenDerWeissenMaid: string = IdsBS.SpecialAbilityId.jaegerinnenDerWeissenMaid;

export const SpecialAbilityId_anhaengerDesGueldenen: string = IdsBS.SpecialAbilityId.anhaengerDesGueldenen;

export const SpecialAbilityId_gebieterDesAspekts: string = IdsBS.SpecialAbilityId.gebieterDesAspekts;

export const SpecialAbilityId_chantEnhancement: number = IdsBS.SpecialAbilityId.chantEnhancement;

export const SpecialAbilityId_dunklesAbbildDerBuendnisgabe: string = IdsBS.SpecialAbilityId.dunklesAbbildDerBuendnisgabe;

export const SpecialAbilityId_traditionIllusionist: string = IdsBS.SpecialAbilityId.traditionIllusionist;

export const SpecialAbilityId_traditionArcaneBard: string = IdsBS.SpecialAbilityId.traditionArcaneBard;

export const SpecialAbilityId_traditionArcaneDancer: string = IdsBS.SpecialAbilityId.traditionArcaneDancer;

export const SpecialAbilityId_traditionIntuitiveMage: string = IdsBS.SpecialAbilityId.traditionIntuitiveMage;

export const SpecialAbilityId_traditionSavant: string = IdsBS.SpecialAbilityId.traditionSavant;

export const SpecialAbilityId_traditionQabalyaMage: string = IdsBS.SpecialAbilityId.traditionQabalyaMage;

export const SpecialAbilityId_traditionChurchOfRondra: string = IdsBS.SpecialAbilityId.traditionChurchOfRondra;

export const SpecialAbilityId_traditionChurchOfBoron: string = IdsBS.SpecialAbilityId.traditionChurchOfBoron;

export const SpecialAbilityId_traditionChurchOfHesinde: string = IdsBS.SpecialAbilityId.traditionChurchOfHesinde;

export const SpecialAbilityId_traditionChurchOfPhex: string = IdsBS.SpecialAbilityId.traditionChurchOfPhex;

export const SpecialAbilityId_traditionChurchOfPeraine: string = IdsBS.SpecialAbilityId.traditionChurchOfPeraine;

export const SpecialAbilityId_traditionChurchOfEfferd: string = IdsBS.SpecialAbilityId.traditionChurchOfEfferd;

export const SpecialAbilityId_traditionChurchOfTravia: string = IdsBS.SpecialAbilityId.traditionChurchOfTravia;

export const SpecialAbilityId_traditionChurchOfFirun: string = IdsBS.SpecialAbilityId.traditionChurchOfFirun;

export const SpecialAbilityId_traditionChurchOfTsa: string = IdsBS.SpecialAbilityId.traditionChurchOfTsa;

export const SpecialAbilityId_traditionChurchOfIngerimm: string = IdsBS.SpecialAbilityId.traditionChurchOfIngerimm;

export const SpecialAbilityId_traditionChurchOfRahja: string = IdsBS.SpecialAbilityId.traditionChurchOfRahja;

export const SpecialAbilityId_traditionCultOfTheNamelessOne: string = IdsBS.SpecialAbilityId.traditionCultOfTheNamelessOne;

export const SpecialAbilityId_traditionChurchOfAves: string = IdsBS.SpecialAbilityId.traditionChurchOfAves;

export const SpecialAbilityId_traditionChurchOfIfirn: string = IdsBS.SpecialAbilityId.traditionChurchOfIfirn;

export const SpecialAbilityId_traditionChurchOfKor: string = IdsBS.SpecialAbilityId.traditionChurchOfKor;

export const SpecialAbilityId_traditionChurchOfNandus: string = IdsBS.SpecialAbilityId.traditionChurchOfNandus;

export const SpecialAbilityId_traditionChurchOfSwafnir: string = IdsBS.SpecialAbilityId.traditionChurchOfSwafnir;

export const SpecialAbilityId_languageSpecializations: string = IdsBS.SpecialAbilityId.languageSpecializations;

export const SpecialAbilityId_traditionSchelme: string = IdsBS.SpecialAbilityId.traditionSchelme;

export const SpecialAbilityId_traditionZauberalchimisten: string = IdsBS.SpecialAbilityId.traditionZauberalchimisten;

export const SpecialAbilityId_grosseMeditation: string = IdsBS.SpecialAbilityId.grosseMeditation;

export const SpecialAbilityId_imitationszauberei: string = IdsBS.SpecialAbilityId.imitationszauberei;

export const SpecialAbilityId_kraftliniennutzung: string = IdsBS.SpecialAbilityId.kraftliniennutzung;

export const SpecialAbilityId_scholarDerHalleDesLebensZuNorburg: string = IdsBS.SpecialAbilityId.scholarDerHalleDesLebensZuNorburg;

export const SpecialAbilityId_scholarDesKreisesDerEinfuehlung: string = IdsBS.SpecialAbilityId.scholarDesKreisesDerEinfuehlung;

export const SpecialAbilityId_madaschwesternStil: string = IdsBS.SpecialAbilityId.madaschwesternStil;

export const SpecialAbilityId_garetherGossenStil: string = IdsBS.SpecialAbilityId.garetherGossenStil;

export const SpecialAbilityId_wegDerGelehrten: string = IdsBS.SpecialAbilityId.wegDerGelehrten;

export const SpecialAbilityId_traditionCultOfNuminoru: string = IdsBS.SpecialAbilityId.traditionCultOfNuminoru;

export const SpecialAbilityId_wegDerKuenstlerin: string = IdsBS.SpecialAbilityId.wegDerKuenstlerin;

export const SpecialAbilityId_wegDerSchreiberin: string = IdsBS.SpecialAbilityId.wegDerSchreiberin;

export const SpecialAbilityId_fachwissen: string = IdsBS.SpecialAbilityId.fachwissen;

export const SpecialAbilityId_handwerkskunst: string = IdsBS.SpecialAbilityId.handwerkskunst;

export const SpecialAbilityId_kindDerNatur: string = IdsBS.SpecialAbilityId.kindDerNatur;

export const SpecialAbilityId_koerperlichesGeschick: string = IdsBS.SpecialAbilityId.koerperlichesGeschick;

export const SpecialAbilityId_sozialeKompetenz: string = IdsBS.SpecialAbilityId.sozialeKompetenz;

export const SpecialAbilityId_universalgenie: string = IdsBS.SpecialAbilityId.universalgenie;

export const SpecialAbilityId_scholarDesMagierkollegsZuHoningen: string = IdsBS.SpecialAbilityId.scholarDesMagierkollegsZuHoningen;

export const SpecialAbilityId_traditionAnimisten: string = IdsBS.SpecialAbilityId.traditionAnimisten;

export const SpecialAbilityId_traditionGeoden: string = IdsBS.SpecialAbilityId.traditionGeoden;

export const SpecialAbilityId_traditionZibilijas: string = IdsBS.SpecialAbilityId.traditionZibilijas;

export const SpecialAbilityId_zaubervariabilitaet: string = IdsBS.SpecialAbilityId.zaubervariabilitaet;

export const SpecialAbilityId_traditionBrobimGeoden: string = IdsBS.SpecialAbilityId.traditionBrobimGeoden;

export const SocialStatusId_notFree: number = IdsBS.SocialStatusId.notFree;

export const SocialStatusId_free: number = IdsBS.SocialStatusId.free;

export const SocialStatusId_lesserNoble: number = IdsBS.SocialStatusId.lesserNoble;

export const SocialStatusId_noble: number = IdsBS.SocialStatusId.noble;

export const SocialStatusId_aristocracy: number = IdsBS.SocialStatusId.aristocracy;

export const OptionalRuleId_maximumAttributeScores: string = IdsBS.OptionalRuleId.maximumAttributeScores;

export const OptionalRuleId_languageSpecialization: string = IdsBS.OptionalRuleId.languageSpecialization;

export const OptionalRuleId_higherDefenseStats: string = IdsBS.OptionalRuleId.higherDefenseStats;

export const ConditionId_sikaryanVerlust: string = IdsBS.ConditionId.sikaryanVerlust;

export const ConditionId_daemonischeAuszehrung: string = IdsBS.ConditionId.daemonischeAuszehrung;

export const ExperienceLevelId: {
  masterly: string; 
  inexperienced: string; 
  brilliant: string; 
  ordinary: string; 
  experienced: string; 
  competent: string; 
  legendary: string
} = IdsBS.ExperienceLevelId

export const ProfessionId: { customProfession: string } = IdsBS.ProfessionId

export const DCId: {
  dodge: string; 
  movement: string; 
  initiative: string; 
  woundThreshold: string; 
  toughness: string; 
  karmaPoints: string; 
  arcaneEnergy: string; 
  spirit: string; 
  lifePoints: string
} = IdsBS.DCId

export const SkillId: {
  sailing: string; 
  treatPoison: string; 
  metalworking: string; 
  etiquette: string; 
  commerce: string; 
  treatSoul: string; 
  prepareFood: string; 
  music: string; 
  plantLore: string; 
  driving: string; 
  pickLocks: string; 
  flying: string; 
  religions: string; 
  riding: string; 
  empathy: string; 
  gambling: string; 
  sphereLore: string; 
  singing: string; 
  stealth: string; 
  gaukelei: string; 
  dancing: string; 
  persuasion: string; 
  intimidation: string; 
  carousing: string; 
  animalLore: string; 
  bodyControl: string; 
  history: string; 
  earthencraft: string; 
  survival: string; 
  astronomy: string; 
  perception: string; 
  treatWounds: string; 
  seduction: string; 
  selfControl: string; 
  disguise: string; 
  ropes: string; 
  climbing: string; 
  willpower: string; 
  fastTalk: string; 
  streetwise: string; 
  fishing: string; 
  geography: string; 
  mechanics: string; 
  treatDisease: string; 
  orienting: string; 
  law: string; 
  warfare: string; 
  pickpocket: string; 
  artisticAbility: string; 
  clothworking: string; 
  featOfStrength: string; 
  tracking: string; 
  mythsAndLegends: string; 
  math: string; 
  leatherworking: string; 
  swimming: string; 
  magicalLore: string; 
  woodworking: string; 
  alchemy: string
} = IdsBS.SkillId

export const CultureId: {
  woodElves: string; 
  gladeElves: string; 
  firnelves: string; 
  steppenelfen: string
} = IdsBS.CultureId

export const Phase: {
  creation: number; 
  inGame: number; 
  rcp: number
} = IdsBS.Phase

export const AdvantageId: {
  luck: string; 
  exceptionalSkill: string; 
  weaponAptitude: string; 
  largeSpellSelection: string; 
  hatredOf: string; 
  zahlreichePredigten: string; 
  einkommen: string; 
  aptitude: string; 
  prediger: string; 
  sociallyAdaptable: string; 
  immunityToDisease: string; 
  nimble: string; 
  increasedKarmaPoints: string; 
  visionaer: string; 
  inspireConfidence: string; 
  spellcaster: string; 
  exceptionalCombatTechnique: string; 
  increasedAstralPower: string; 
  zahlreicheVisionen: string; 
  leichterGang: string; 
  increasedLifePoints: string; 
  unyielding: string; 
  rich: string; 
  blessed: string; 
  increasedSpirit: string; 
  immunityToPoison: string; 
  increasedToughness: string; 
  magicalAttunement: string
} = IdsBS.AdvantageId

export const CombatTechniqueId: {
  discuses: string; 
  swords: string; 
  faecher: string; 
  chainWeapons: string; 
  twoHandedSwords: string; 
  daggers: string; 
  crossbows: string; 
  brawling: string; 
  thrownWeapons: string; 
  lances: string; 
  impactWeapons: string; 
  slings: string; 
  spittingFire: string; 
  blowguns: string; 
  fencingWeapons: string; 
  twoHandedImpactWeapons: string; 
  spiesswaffen: string; 
  bows: string; 
  shields: string; 
  polearms: string
} = IdsBS.CombatTechniqueId

export const SocialStatusId: {
  free: number; 
  aristocracy: number; 
  lesserNoble: number; 
  notFree: number; 
  noble: number
} = IdsBS.SocialStatusId

export const DisadvantageId: {
  obligations: string; 
  slow: string; 
  wenigeVisionen: string; 
  badLuck: string; 
  maimed: string; 
  wenigePredigten: string; 
  decreasedLifePoints: string; 
  incompetent: string; 
  afraidOf: string; 
  deaf: string; 
  magicalRestriction: string; 
  decreasedSpirit: string; 
  noFlyingBalm: string; 
  poor: string; 
  smallSpellSelection: string; 
  noFamiliar: string; 
  decreasedArcanePower: string; 
  principles: string; 
  negativeTrait: string; 
  stigma: string; 
  badHabit: string; 
  decreasedKarmaPoints: string; 
  brittleBones: string; 
  decreasedToughness: string; 
  personalityFlaw: string
} = IdsBS.DisadvantageId

export const ConditionId: { sikaryanVerlust: string; daemonischeAuszehrung: string } = IdsBS.ConditionId

export const RaceId: {
  humans: string; 
  elves: string; 
  dwarves: string; 
  halfElves: string
} = IdsBS.RaceId

export const AttrId: {
  intuition: string; 
  charisma: string; 
  agility: string; 
  courage: string; 
  sagacity: string; 
  constitution: string; 
  dexterity: string; 
  strength: string
} = IdsBS.AttrId

export const SpecialAbilityId: {
  universalgenie: string; 
  traditionChurchOfTravia: string; 
  imitationszauberei: string; 
  garetherGossenStil: string; 
  magicStyleCombination: string; 
  forschungsgebiet: string; 
  anhaengerDesGueldenen: string; 
  visionDerBestimmung: string; 
  visionDerEntrueckung: string; 
  languageSpecializations: string; 
  chantEnhancement: number; 
  traditionChurchOfPhex: string; 
  traditionChurchOfFirun: string; 
  traditionChurchOfNandus: string; 
  harmoniezauberei: string; 
  craftInstruments: string; 
  hoheWeihe: string; 
  wegDerKuenstlerin: string; 
  jaegerinnenDerWeissenMaid: string; 
  kraftliniennutzung: string; 
  sozialeKompetenz: string; 
  traditionDruids: string; 
  madaschwesternStil: string; 
  expertenwissen: string; 
  terrainKnowledge: string; 
  recherchegespuer: string; 
  visionDerGottheit: string; 
  traditionChurchOfBoron: string; 
  traditionGuildMages: number; 
  traditionGeoden: string; 
  dunklesAbbildDerBuendnisgabe: string; 
  grosseMeditation: string; 
  propertyKnowledge: string; 
  traditionCultOfTheNamelessOne: string; 
  areaKnowledge: string; 
  traditionArcaneDancer: string; 
  zugvoegel: string; 
  traditionChurchOfAves: string; 
  gebieterDesAspekts: string; 
  propertyFocus: string; 
  fachwissen: string; 
  adaptionZauber: string; 
  favoriteSpellwork: string; 
  traditionArcaneBard: string; 
  traditionSavant: string; 
  traditionZauberalchimisten: string; 
  wissensdurst: string; 
  language: string; 
  wegDerGelehrten: string; 
  feuerschlucker: string; 
  predigtDesGottvertrauens: string; 
  traditionChurchOfHesinde: string; 
  traditionChurchOfRahja: string; 
  traditionChurchOfIfirn: string; 
  traditionAnimisten: string; 
  lieblingsliturgie: string; 
  zaubervariabilitaet: string; 
  traditionChurchOfPraios: string; 
  predigtWiderMissgeschicke: string; 
  scholarDesKreisesDerEinfuehlung: string; 
  matrixzauberei: string; 
  predigtDesWohlgefallens: string; 
  exorzist: string; 
  predigtDerGemeinschaft: string; 
  kindDerNatur: string; 
  traditionBrobimGeoden: string; 
  traditionChurchOfPeraine: string; 
  traditionIntuitiveMage: string; 
  traditionElves: string; 
  visionDesWahrenGlaubens: string; 
  traditionWitches: string; 
  traditionChurchOfIngerimm: string; 
  literacy: string; 
  combatReflexes: string; 
  combatStyleCombination: string; 
  scholarDerHalleDesLebensZuNorburg: string; 
  traditionChurchOfEfferd: string; 
  traditionChurchOfSwafnir: string; 
  wegDerSchreiberin: string; 
  koerperlichesGeschick: string; 
  hunter: string; 
  visionDesSchicksals: string; 
  traditionCultOfNuminoru: string; 
  traditionZibilijas: string; 
  improvedDodge: string; 
  traditionQabalyaMage: string; 
  aspectKnowledge: string; 
  spellEnhancement: number; 
  traditionSchelme: string; 
  predigtDerZuversicht: string; 
  traditionChurchOfTsa: string; 
  scholarDesMagierkollegsZuHoningen: string; 
  skillSpecialization: string; 
  traditionChurchOfRondra: string; 
  traditionChurchOfKor: string; 
  traditionIllusionist: string; 
  handwerkskunst: string
} = IdsBS.SpecialAbilityId

export const OptionalRuleId: {
  higherDefenseStats: string; 
  maximumAttributeScores: string; 
  languageSpecialization: string
} = IdsBS.OptionalRuleId
