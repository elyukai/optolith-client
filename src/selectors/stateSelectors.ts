import { AppState } from '../reducers/app';
import { UIMessages } from '../utils/I18n';

export const getCurrentTab = (state: AppState) => state.ui.location.tab;

export const getWikiFilter = (state: AppState) => state.ui.wiki.filter;
export const getWikiFilterAll = (state: AppState) => state.ui.wiki.filterAll;
export const getWikiCategory1 = (state: AppState) => state.ui.wiki.category1;
export const getWikiCategory2 = (state: AppState) => state.ui.wiki.category2;

export const getLocaleMessages = (state: AppState) => state.locale.messages;
export const getLocaleAsProp = (_: AppState, props: { locale: UIMessages }) => props.locale;
export const getLocaleId = (state: AppState) => state.locale.id;
export const getLocaleType = (state: AppState) => state.locale.type;
export const getBooks = (state: AppState) => state.locale.books;

export const getCurrentHeroPresent = (state: AppState) => state.currentHero.present;

export const getDependentInstances = (state: AppState) => state.currentHero.present.dependent;
export const getAdvantages = (state: AppState) => state.currentHero.present.dependent.advantages;
export const getAttributes = (state: AppState) => state.currentHero.present.dependent.attributes;
export const getBlessings = (state: AppState) => state.currentHero.present.dependent.blessings;
export const getCantrips = (state: AppState) => state.currentHero.present.dependent.cantrips;
export const getCombatTechniques = (state: AppState) => state.currentHero.present.dependent.combatTechniques;
export const getCultures = (state: AppState) => state.currentHero.present.dependent.cultures;
export const getDisadvantages = (state: AppState) => state.currentHero.present.dependent.disadvantages;
export const getLiturgicalChants = (state: AppState) => state.currentHero.present.dependent.liturgies;
export const getProfessions = (state: AppState) => state.currentHero.present.dependent.professions;
export const getProfessionVariants = (state: AppState) => state.currentHero.present.dependent.professionVariants;
export const getRaces = (state: AppState) => state.currentHero.present.dependent.races;
export const getRaceVariants = (state: AppState) => state.currentHero.present.dependent.raceVariants;
export const getSkills = (state: AppState) => state.currentHero.present.dependent.talents;
export const getSpecialAbilities = (state: AppState) => state.currentHero.present.dependent.specialAbilities;
export const getSpells = (state: AppState) => state.currentHero.present.dependent.spells;
export const getBlessedStyleDependencies = (state: AppState) => state.currentHero.present.dependent.blessedStyleDependencies;
export const getCombatStyleDependencies = (state: AppState) => state.currentHero.present.dependent.combatStyleDependencies;
export const getMagicalStyleDependencies = (state: AppState) => state.currentHero.present.dependent.magicalStyleDependencies;

export const getProfile = (state: AppState) => state.currentHero.present.profile;
export const getCultureAreaKnowledge = (state: AppState) => state.currentHero.present.profile.cultureAreaKnowledge;
export const getSex = (state: AppState) => state.currentHero.present.profile.sex;

export const getRules = (state: AppState) => state.currentHero.present.rules;
export const getAttributeValueLimit = (state: AppState) => state.currentHero.present.rules.attributeValueLimit;
export const getHigherParadeValues = (state: AppState) => state.currentHero.present.rules.higherParadeValues;
export const areAllRuleBooksEnabled = (state: AppState) => state.currentHero.present.rules.enableAllRuleBooks;
export const getEnabledRuleBooks = (state: AppState) => state.currentHero.present.rules.enabledRuleBooks;

export const getCurrentRaceId = (state: AppState) => state.currentHero.present.rcp.race;
export const getCurrentRaceVariantId = (state: AppState) => state.currentHero.present.rcp.raceVariant;
export const getCurrentCultureId = (state: AppState) => state.currentHero.present.rcp.culture;
export const getCurrentProfessionId = (state: AppState) => state.currentHero.present.rcp.profession;
export const getCurrentProfessionVariantId = (state: AppState) => state.currentHero.present.rcp.professionVariant;

export const getEnergies = (state: AppState) => state.currentHero.present.energies;
export const getAddedLifePoints = (state: AppState) => state.currentHero.present.energies.addedLifePoints;
export const getAddedArcaneEnergyPoints = (state: AppState) => state.currentHero.present.energies.addedArcaneEnergy;
export const getAddedKarmaPoints = (state: AppState) => state.currentHero.present.energies.addedKarmaPoints;
export const getPermanentLifePoints = (state: AppState) => state.currentHero.present.energies.permanentLifePoints;
export const getPermanentArcaneEnergyPoints = (state: AppState) => state.currentHero.present.energies.permanentArcaneEnergy;
export const getPermanentKarmaPoints = (state: AppState) => state.currentHero.present.energies.permanentKarmaPoints;

export const getPhase = (state: AppState) => state.currentHero.present.phase;

export const getItemEditorInstance = (state: AppState) => state.currentHero.present.equipment.itemEditor;
export const getIsItemCreation = (state: AppState) => state.currentHero.present.equipment.isItemCreation;
export const getArmorZonesEditorInstance = (state: AppState) => state.currentHero.present.equipment.armorZoneEditor;
export const getIsArmorZonesCreation = (state: AppState) => state.currentHero.present.equipment.isArmorZonesCreation;

export const getCurrentAlert = (state: AppState) => state.ui.alerts;
export const getUpdateDownloadProgress = (state: AppState) => state.ui.subwindows.updateDownloadProgress;
export const getAddPermanentEnergy = (state: AppState) => state.ui.subwindows.addPermanentEnergy;
export const getEditPermanentEnergy = (state: AppState) => state.ui.subwindows.editPermanentEnergy;
export const isAddAdventurePointsOpen = (state: AppState) => state.ui.subwindows.isAddAdventurePointsOpen;
export const isCharacterCreatorOpen = (state: AppState) => state.ui.subwindows.isCharacterCreatorOpen;
export const isSettingsOpen = (state: AppState) => state.ui.subwindows.isSettingsOpen;
export const isEditCharacterAvatarOpen = (state: AppState) => state.ui.subwindows.isEditCharacterAvatarOpen;
export const isEditPetAvatarOpen = (state: AppState) => state.ui.subwindows.isEditPetAvatarOpen;
