import { AppState } from '../reducers/appReducer';
import { Alert, Hero } from '../types/data';
import { createMaybeSelector } from '../utils/createMaybeSelector';
import { Maybe, OrderedMap, Record } from '../utils/dataUtils';
import { UIMessages } from '../utils/I18n';
import { UndoState } from '../utils/undo';

export const getCurrentTab = (state: AppState) => state.ui.location.tab;


export const getLocaleMessages = createMaybeSelector (
  (state: AppState) => state.locale.messages,
  messages => Maybe.of (messages).fmap (Record.of)
);

export const getLocaleAsProp = (_: AppState, props: { locale: Record<UIMessages> }) => props.locale;
export const getLocaleId = createMaybeSelector ((state: AppState) => state.locale.id, Maybe.of);
export const getLocaleType = (state: AppState) => state.locale.type;


export const getCurrentHeroId = (state: AppState) => state.herolist.lookup ('currentId');
export const getHeroes = (state: AppState) => state.herolist.get ('heroes');
export const getUsers = (state: AppState) => state.herolist.get ('users');


export const getCurrentHero = createMaybeSelector (
  getCurrentHeroId,
  getHeroes,
  (maybeId, heroes) => maybeId.bind (id => OrderedMap.lookup<string, UndoState<Hero>> (id) (heroes))
);

export const getCurrentHeroPresent = createMaybeSelector (
  getCurrentHero,
  currentHero => currentHero.fmap (just => just.present)
);

export const getCurrentHeroPast = createMaybeSelector (
  getCurrentHero,
  currentHero => currentHero.fmap (just => just.past)
);

export const getCurrentHeroFuture = createMaybeSelector (
  getCurrentHero,
  currentHero => currentHero.fmap (just => just.future)
);


export const getTotalAdventurePoints = (state: AppState) =>
  getCurrentHero (state).fmap (just => just.present.get ('adventurePointsTotal'));


export const getAdvantages = (state: AppState) =>
  getCurrentHero (state).fmap (just => just.present.get ('advantages'));

export const getAttributes = (state: AppState) =>
  getCurrentHero (state).fmap (just => just.present.get ('attributes'));

export const getBlessings = (state: AppState) =>
  getCurrentHero (state).fmap (just => just.present.get ('blessings'));

export const getCantrips = (state: AppState) =>
  getCurrentHero (state).fmap (just => just.present.get ('cantrips'));

export const getCombatTechniques = (state: AppState) =>
  getCurrentHero (state).fmap (just => just.present.get ('combatTechniques'));

export const getDisadvantages = (state: AppState) =>
  getCurrentHero (state).fmap (just => just.present.get ('disadvantages'));

export const getLiturgicalChants = (state: AppState) =>
  getCurrentHero (state).fmap (just => just.present.get ('liturgicalChants'));

export const getSkills = (state: AppState) =>
  getCurrentHero (state).fmap (just => just.present.get ('skills'));

export const getSpecialAbilities = (state: AppState) =>
  getCurrentHero (state).fmap (just => just.present.get ('specialAbilities'));

export const getSpells = (state: AppState) =>
  getCurrentHero (state).fmap (just => just.present.get ('spells'));


export const getBlessedStyleDependencies = (state: AppState) =>
  getCurrentHero (state).fmap (just => just.present.get ('blessedStyleDependencies'));

export const getCombatStyleDependencies = (state: AppState) =>
  getCurrentHero (state).fmap (just => just.present.get ('combatStyleDependencies'));

export const getMagicalStyleDependencies = (state: AppState) =>
  getCurrentHero (state).fmap (just => just.present.get ('magicalStyleDependencies'));


export const getProfile = (state: AppState) =>
  getCurrentHero (state).fmap (just => just.present.get ('personalData'));

export const getCultureAreaKnowledge = (state: AppState) =>
  getCurrentHero (state)
    .bind (just => just.present.get ('personalData').lookup ('cultureAreaKnowledge'));

export const getSex = (state: AppState) =>
  getCurrentHero (state).fmap (just => just.present.get ('sex'));

export const getSize = (state: AppState) =>
  getCurrentHero (state).bind (just => just.present.get ('personalData').lookup ('size'));

export const getWeight = (state: AppState) =>
  getCurrentHero (state).bind (just => just.present.get ('personalData').lookup ('weight'));

export const getAvatar = (state: AppState) =>
  getCurrentHero (state).bind (just => just.present.lookup ('avatar'));


export const getPact = (state: AppState) =>
  getCurrentHero (state).bind (just => just.present.lookup ('pact'));


export const getRules = (state: AppState) =>
  getCurrentHero (state).fmap (just => just.present.get ('rules'));

export const getAttributeValueLimit = (state: AppState) =>
  getCurrentHero (state).fmap (just => just.present.get ('rules').get ('attributeValueLimit'));

export const getHigherParadeValues = (state: AppState) =>
  getCurrentHero (state).fmap (just => just.present.get ('rules').get ('higherParadeValues'));

export const getAreAllRuleBooksEnabled = (state: AppState) =>
  getCurrentHero (state).fmap (just => just.present.get ('rules').get ('enableAllRuleBooks'));

export const getEnabledRuleBooks = (state: AppState) =>
  getCurrentHero (state).fmap (just => just.present.get ('rules').get ('enabledRuleBooks'));


export const getCurrentRaceId = (state: AppState) =>
  getCurrentHero (state).bind (just => just.present.lookup ('race'));

export const getCurrentRaceVariantId = (state: AppState) =>
  getCurrentHero (state).bind (just => just.present.lookup ('raceVariant'));

export const getCurrentCultureId = (state: AppState) =>
  getCurrentHero (state).bind (just => just.present.lookup ('culture'));

export const getCurrentProfessionId = (state: AppState) =>
  getCurrentHero (state).bind (just => just.present.lookup ('profession'));

export const getCurrentProfessionVariantId = (state: AppState) =>
  getCurrentHero (state).bind (just => just.present.lookup ('professionVariant'));


export const getEnergies = (state: AppState) =>
  getCurrentHero (state).fmap (just => just.present.get ('energies'));

export const getAddedLifePoints = (state: AppState) =>
  getCurrentHero (state).fmap (just => just.present.get ('energies').get ('addedLifePoints'));

export const getAddedArcaneEnergyPoints = (state: AppState) =>
  getCurrentHero (state)
    .fmap (just => just.present.get ('energies').get ('addedArcaneEnergyPoints'));

export const getAddedKarmaPoints = (state: AppState) =>
  getCurrentHero (state).fmap (just => just.present.get ('energies').get ('addedKarmaPoints'));

export const getPermanentLifePoints = (state: AppState) =>
  getCurrentHero (state).fmap (just => just.present.get ('energies').get ('permanentLifePoints'));

export const getPermanentArcaneEnergyPoints = (state: AppState) =>
  getCurrentHero (state)
    .fmap (just => just.present.get ('energies').get ('permanentArcaneEnergyPoints'));

export const getPermanentKarmaPoints = (state: AppState) =>
  getCurrentHero (state).fmap (just => just.present.get ('energies').get ('permanentKarmaPoints'));


export const getPhase = (state: AppState) =>
  getCurrentHero (state).fmap (just => just.present.get ('phase'));


export const getExperienceLevelStartId = (state: AppState) =>
  getCurrentHero (state).fmap (just => just.present.get ('experienceLevel'));


export const getEquipmentState = (state: AppState) =>
  getCurrentHero (state).fmap (just => just.present.get ('belongings'));

export const getItemsState = (state: AppState) =>
  getCurrentHero (state).bind (just => just.present.get ('belongings').lookup ('items'));

export const getArmorZonesState = (state: AppState) =>
  getCurrentHero (state).bind (just => just.present.get ('belongings').lookup ('armorZones'));

export const getPurse = (state: AppState) =>
  getCurrentHero (state).bind (just => just.present.get ('belongings').lookup ('purse'));

export const getItemEditorInstance = (state: AppState) =>
  getCurrentHero (state).bind (just => just.present.get ('belongings').lookup ('itemInEditor'));

export const getIsItemCreation = (state: AppState) =>
  getCurrentHero (state).fmap (just => just.present.get ('belongings').get ('isInItemCreation'));

export const getArmorZonesEditorInstance = (state: AppState) =>
  getCurrentHero (state)
    .bind (just => just.present.get ('belongings').lookup ('zoneArmorInEditor'));

export const getIsArmorZonesCreation = (state: AppState) =>
  getCurrentHero (state)
    .fmap (just => just.present.get ('belongings').get ('isInZoneArmorCreation'));

export const getPets = (state: AppState) =>
  getCurrentHero (state).fmap (just => just.present.get ('pets'));


export const getAlerts = (state: AppState) => state.ui.alerts;
export const getCurrentAlert = (state: AppState): Maybe<Alert> =>
  Maybe.listToMaybe (state.ui.alerts);
export const getUpdateDownloadProgress = (state: AppState) =>
  Maybe.of (state.ui.subwindows.updateDownloadProgress);
export const getAddPermanentEnergy = (state: AppState) =>
  Maybe.of (state.ui.subwindows.addPermanentEnergy);
export const getEditPermanentEnergy = (state: AppState) =>
  Maybe.of (state.ui.subwindows.editPermanentEnergy);
export const getIsAddAdventurePointsOpen = (state: AppState) =>
  state.ui.subwindows.isAddAdventurePointsOpen;
export const getIsCharacterCreatorOpen = (state: AppState) =>
  state.ui.subwindows.isCharacterCreatorOpen;
export const getIsSettingsOpen = (state: AppState) => state.ui.subwindows.isSettingsOpen;
export const getIsEditCharacterAvatarOpen = (state: AppState) =>
  state.ui.subwindows.isEditCharacterAvatarOpen;
export const getIsEditPetAvatarOpen = (state: AppState) => state.ui.subwindows.isEditPetAvatarOpen;


export const getAdvantagesFilterText = (state: AppState) => state.ui.filters.advantagesFilterText;
export const getCombatTechniquesFilterText = (state: AppState) =>
  state.ui.filters.combatTechniquesFilterText;
export const getCulturesFilterText = (state: AppState) => state.ui.filters.culturesFilterText;
export const getDisadvantagesFilterText = (state: AppState) =>
  state.ui.filters.disadvantagesFilterText;
export const getEquipmentFilterText = (state: AppState) => state.ui.filters.equipmentFilterText;
export const getHerolistFilterText = (state: AppState) => state.ui.filters.herolistFilterText;
export const getInactiveAdvantagesFilterText = (state: AppState) =>
  state.ui.filters.inactiveAdvantagesFilterText;
export const getInactiveDisadvantagesFilterText = (state: AppState) =>
  state.ui.filters.inactiveDisadvantagesFilterText;
export const getInactiveLiturgicalChantsFilterText = (state: AppState) =>
  state.ui.filters.inactiveLiturgicalChantsFilterText;
export const getInactiveSpecialAbilitiesFilterText = (state: AppState) =>
  state.ui.filters.inactiveSpecialAbilitiesFilterText;
export const getInactiveSpellsFilterText = (state: AppState) =>
  state.ui.filters.inactiveSpellsFilterText;
export const getItemTemplatesFilterText = (state: AppState) =>
  state.ui.filters.itemTemplatesFilterText;
export const getLiturgicalChantsFilterText = (state: AppState) =>
  state.ui.filters.liturgicalChantsFilterText;
export const getProfessionsFilterText = (state: AppState) => state.ui.filters.professionsFilterText;
export const getRacesFilterText = (state: AppState) => state.ui.filters.racesFilterText;
export const getSkillsFilterText = (state: AppState) => state.ui.filters.skillsFilterText;
export const getSpecialAbilitiesFilterText = (state: AppState) =>
  state.ui.filters.specialAbilitiesFilterText;
export const getSpellsFilterText = (state: AppState) => state.ui.filters.spellsFilterText;
export const getZoneArmorFilterText = (state: AppState) => state.ui.filters.zoneArmorFilterText;


export const getWikiFilterText = (state: AppState) => state.ui.wiki.get ('filter');
export const getWikiFilterAll = (state: AppState) => state.ui.wiki.get ('filterAll');
export const getWikiMainCategory = (state: AppState) => state.ui.wiki.lookup ('category1');
export const getWikiCombatTechniquesGroup = (state: AppState) =>
  state.ui.wiki.lookup ('combatTechniquesGroup');
export const getWikiItemTemplatesGroup = (state: AppState) =>
  state.ui.wiki.lookup ('itemTemplatesGroup');
export const getWikiLiturgicalChantsGroup =(state: AppState) =>
  state.ui.wiki.lookup ('liturgicalChantsGroup');
export const getWikiProfessionsGroup = (state: AppState) =>
  state.ui.wiki.lookup ('professionsGroup');
export const getWikiSkillsGroup = (state: AppState) =>
  state.ui.wiki.lookup ('skillsGroup');
export const getWikiSpecialAbilitiesGroup = (state: AppState) =>
  state.ui.wiki.lookup ('specialAbilitiesGroup');
export const getWikiSpellsGroup = (state: AppState) =>
  state.ui.wiki.lookup ('spellsGroup');


export const getWiki = (state: AppState) => state.wiki;
export const getWikiAdvantages = (state: AppState) => state.wiki.get ('advantages');
export const getWikiAttributes = (state: AppState) => state.wiki.get ('attributes');
export const getWikiBlessings = (state: AppState) => state.wiki.get ('blessings');
export const getWikiBooks = (state: AppState) => state.wiki.get ('books');
export const getWikiCantrips = (state: AppState) => state.wiki.get ('cantrips');
export const getWikiCombatTechniques = (state: AppState) => state.wiki.get ('combatTechniques');
export const getWikiCultures = (state: AppState) => state.wiki.get ('cultures');
export const getWikiDisadvantages = (state: AppState) => state.wiki.get ('disadvantages');
export const getWikiExperienceLevels = (state: AppState) => state.wiki.get ('experienceLevels');
export const getWikiItemTemplates = (state: AppState) => state.wiki.get ('itemTemplates');
export const getWikiLiturgicalChants = (state: AppState) => state.wiki.get ('liturgicalChants');
export const getWikiProfessions = (state: AppState) => state.wiki.get ('professions');
export const getWikiProfessionVariants = (state: AppState) => state.wiki.get ('professionVariants');
export const getWikiRaces = (state: AppState) => state.wiki.get ('races');
export const getWikiRaceVariants = (state: AppState) => state.wiki.get ('raceVariants');
export const getWikiSkills = (state: AppState) => state.wiki.get ('skills');
export const getWikiSpecialAbilities = (state: AppState) => state.wiki.get ('specialAbilities');
export const getWikiSpells = (state: AppState) => state.wiki.get ('spells');
