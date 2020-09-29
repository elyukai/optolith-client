import { List } from "../../Data/List"
import { bind, bindF, fmap, Maybe } from "../../Data/Maybe"
import { peekFst } from "../../Data/Queue"
import { lookupF } from "../../Data/StrMap"
import { AppState } from "../Models/AppState"
import { Hero } from "../Models/Hero/Hero"
import { L10nRecord } from "../Models/Wiki/L10n"
import { createMaybeSelector } from "../Utilities/createMaybeSelector"
import { pipe } from "../Utilities/pipe"
import { UndoState } from "../Utilities/undo"

export const getCurrentTab = (state: AppState) => state.ui.location

export const getLocaleMessages = (state: AppState) => state.l10n.messages
export const getLocaleId = (state: AppState) => state.l10n.id
export const getLocaleType = (state: AppState) => state.l10n.type
export const getFallbackLocaleId = (state: AppState) => state.l10n.fallbackId
export const getFallbackLocaleType = (state: AppState) => state.l10n.fallbackType
export const getAvailableLanguages = (state: AppState) => state.l10n.availableLangs

export const getLocaleAsProp = (_: AppState, props: { l10n: L10nRecord }) => props.l10n

export const getCurrentHeroId = (state: AppState) => state.herolist.currentId
export const getHeroes = (state: AppState) => state.herolist.heroes
export const getUsers = (state: AppState) => state.herolist.users


export const getCurrentHero = createMaybeSelector (
  getCurrentHeroId,
  getHeroes,
  (mid, heroes): Maybe<UndoState<Hero>> => bind (mid) (lookupF (heroes))
)

export const getHeroProp = (_: AppState, props: { hero: Hero }) => props.hero
export const getMaybeHeroProp = (_: AppState, props: { mhero: Maybe<Hero> }) => props.mhero


export const getCurrentHeroPresent: (state: AppState) => Maybe<Hero> =
  pipe (getCurrentHero, fmap (hero => hero.present))

export const getCurrentHeroPast: (state: AppState) => Maybe<List<Hero>> =
  pipe (getCurrentHero, fmap (hero => hero.past))

export const getCurrentHeroFuture: (state: AppState) => Maybe<List<Hero>> =
  pipe (getCurrentHero, fmap (hero => hero.future))


export const getHeroLocale =
  createMaybeSelector (getHeroProp, hero => hero.locale)

export const getTotalAdventurePoints =
  pipe (getCurrentHeroPresent, fmap (hero => hero.adventurePointsTotal))


export const getAdvantages =
  pipe (getCurrentHeroPresent, fmap (hero => hero.advantages))

export const getAttributes =
  createMaybeSelector (getHeroProp, hero => hero.attributes)

export const getCurrentAttributeAdjustmentId =
  pipe (getCurrentHeroPresent, fmap (hero => hero.attributeAdjustmentSelected))

export const getBlessings =
  pipe (getCurrentHeroPresent, fmap (hero => hero.blessings))

export const getCantrips =
  pipe (getCurrentHeroPresent, fmap (hero => hero.cantrips))

export const getCombatTechniques =
  pipe (getCurrentHeroPresent, fmap (hero => hero.combatTechniques))

export const getDisadvantages =
  pipe (getCurrentHeroPresent, fmap (hero => hero.disadvantages))

export const getLiturgicalChants =
  pipe (getCurrentHeroPresent, fmap (hero => hero.liturgicalChants))

export const getSkills =
  pipe (getCurrentHeroPresent, fmap (hero => hero.skills))

export const getSpecialAbilities =
  pipe (getHeroProp, hero => hero.specialAbilities)

export const getMaybeSpecialAbilities =
  pipe (getMaybeHeroProp, fmap (hero => hero.specialAbilities))

export const getSpells =
  pipe (getCurrentHeroPresent, fmap (hero => hero.spells))


export const getBlessedStyleDependencies =
  pipe (getHeroProp, hero => hero.blessedStyleDependencies)

export const getCombatStyleDependencies =
  pipe (getHeroProp, hero => hero.combatStyleDependencies)

export const getMagicalStyleDependencies =
  pipe (getHeroProp, hero => hero.magicalStyleDependencies)

export const getSkillStyleDependencies =
  pipe (getHeroProp, hero => hero.skillStyleDependencies)

export const getSocialDependencies =
  pipe (getHeroProp, hero => hero.socialStatusDependencies)


export const getCurrentHeroName =
  pipe (getCurrentHeroPresent, fmap (hero => hero.name))


export const getProfile =
  pipe (getHeroProp, hero => hero.personalData)

export const getCultureAreaKnowledge =
  pipe (getCurrentHeroPresent, bindF (hero => hero.personalData.cultureAreaKnowledge))

export const getSex =
  pipe (getHeroProp, hero => hero.sex)

export const getCurrentSex =
  pipe (getCurrentHeroPresent, fmap (hero => hero.sex))

export const getSize =
  pipe (getCurrentHeroPresent, bindF (hero => hero.personalData.size))

export const getWeight =
  pipe (getCurrentHeroPresent, bindF (hero => hero.personalData.weight))

export const getAvatar =
  pipe (getCurrentHeroPresent, bindF (hero => hero.avatar))

export const getSocialStatus =
  pipe (getHeroProp, hero => hero.personalData.socialStatus)


export const getPact =
  pipe (getCurrentHeroPresent, bindF (hero => hero.pact))


export const getRules =
  pipe (getHeroProp, hero => hero.rules)

export const getRulesM =
  pipe (getMaybeHeroProp, fmap (hero => hero.rules))

export const getAttributeValueLimit =
  pipe (getCurrentHeroPresent, fmap (hero => hero.rules.attributeValueLimit))

export const getHigherParadeValues =
  pipe (getCurrentHeroPresent, fmap (hero => hero.rules.higherParadeValues))

export const getAreAllRuleBooksEnabled =
  pipe (getCurrentHeroPresent, fmap (hero => hero.rules.enableAllRuleBooks))

export const getEnabledRuleBooks =
  pipe (getCurrentHeroPresent, fmap (hero => hero.rules.enabledRuleBooks))


export const getRaceId =
  pipe (getHeroProp, hero => hero.race)

export const getRaceIdM =
  pipe (getMaybeHeroProp, bindF (hero => hero.race))

export const getCurrentRaceId =
  pipe (getCurrentHeroPresent, bindF (hero => hero.race))

export const getRaceVariantId =
  pipe (getHeroProp, hero => hero.raceVariant)

export const getCurrentRaceVariantId =
  pipe (getCurrentHeroPresent, bindF (hero => hero.raceVariant))

export const getCultureId =
  pipe (getHeroProp, hero => hero.culture)

export const getCurrentCultureId =
  pipe (getCurrentHeroPresent, bindF (hero => hero.culture))

export const getProfessionId =
  pipe (getHeroProp, hero => hero.profession)

export const getCurrentProfessionId =
  pipe (getCurrentHeroPresent, bindF (hero => hero.profession))

export const getCustomProfessionName =
  pipe (getHeroProp, hero => hero.professionName)

export const getCurrentCustomProfessionName =
  pipe (getCurrentHeroPresent, bindF (hero => hero.professionName))

export const getProfessionVariantId =
  pipe (getHeroProp, hero => hero.professionVariant)

export const getCurrentProfessionVariantId =
  pipe (getCurrentHeroPresent, bindF (hero => hero.professionVariant))


export const getEnergies =
  pipe (getCurrentHeroPresent, fmap (hero => hero.energies))

export const getAddedLifePoints =
  pipe (getCurrentHeroPresent, fmap (hero => hero.energies.addedLifePoints))

export const getAddedArcaneEnergyPoints =
  pipe (getCurrentHeroPresent, fmap (hero => hero.energies.addedArcaneEnergyPoints))

export const getAddedKarmaPoints =
  pipe (getCurrentHeroPresent, fmap (hero => hero.energies.addedKarmaPoints))

export const getPermanentLifePoints =
  pipe (getCurrentHeroPresent, fmap (hero => hero.energies.permanentLifePoints))

export const getPermanentArcaneEnergyPoints =
  pipe (getCurrentHeroPresent, fmap (hero => hero.energies.permanentArcaneEnergyPoints))

export const getPermanentKarmaPoints =
  pipe (getCurrentHeroPresent, fmap (hero => hero.energies.permanentKarmaPoints))


export const getCurrentPhase =
  pipe (getCurrentHeroPresent, fmap (hero => hero.phase))

export const getPhase =
  pipe (getHeroProp, hero => hero.phase)


export const getExperienceLevelStartId =
  pipe (getCurrentHeroPresent, fmap (hero => hero.experienceLevel))


export const getEquipmentState =
  pipe (getCurrentHeroPresent, fmap (hero => hero.belongings))

export const getItemsState =
  pipe (getCurrentHeroPresent, fmap (hero => hero.belongings.items))

export const getHitZoneArmorsState =
  pipe (getCurrentHeroPresent, fmap (hero => hero.belongings.hitZoneArmors))

export const getPurse =
  pipe (getCurrentHeroPresent, fmap (hero => hero.belongings.purse))

export const getItemEditorInstance =
  pipe (getCurrentHeroPresent, bindF (hero => hero.belongings.itemInEditor))

export const getIsItemCreation =
  pipe (getCurrentHeroPresent, fmap (hero => hero.belongings.isInItemCreation))

export const getArmorZonesEditorInstance =
  pipe (getCurrentHeroPresent, bindF (hero => hero.belongings.hitZoneArmorInEditor))

export const getIsInHitZoneArmorCreation =
  pipe (getCurrentHeroPresent, fmap (hero => hero.belongings.isInHitZoneArmorCreation))

export const getPets =
  pipe (getCurrentHeroPresent, fmap (hero => hero.pets))

export const getPetEditorInstance =
  pipe (getCurrentHeroPresent, bindF (hero => hero.petInEditor))

export const getIsInPetCreation =
  pipe (getCurrentHeroPresent, fmap (hero => hero.isInPetCreation))


export const getTransferredUnfamiliarSpells =
  pipe (getHeroProp, hero => hero.transferredUnfamiliarSpells)


export const getAlerts = (state: AppState) => state.ui.alerts

export const getCurrentAlert = (state: AppState) => peekFst (state.ui.alerts)


export const getUpdateDownloadProgress =
  (state: AppState) => state.ui.subwindows.updateDownloadProgress

export const getAddPermanentEnergy =
  (state: AppState) => state.ui.subwindows.addPermanentEnergy

export const getEditPermanentEnergy =
  (state: AppState) => state.ui.subwindows.editPermanentEnergy

export const getIsAddAdventurePointsOpen =
  (state: AppState) => state.ui.subwindows.isAddAdventurePointsOpen

export const getIsCharacterCreatorOpen =
  (state: AppState) => state.ui.subwindows.isCharacterCreatorOpen

export const getIsSettingsOpen =
  (state: AppState) => state.ui.subwindows.isSettingsOpen

export const getIsEditCharacterAvatarOpen =
  (state: AppState) => state.ui.subwindows.isEditCharacterAvatarOpen

export const getIsEditPetAvatarOpen =
  (state: AppState) => state.ui.subwindows.isEditPetAvatarOpen

export const getIsAddRemoveMoneyOpen =
  pipe (ASA.ui, UIA.subwindows, SubW.isAddRemoveMoneyOpen)

export const getAdvantagesFilterText =
  (state: AppState) => state.ui.filters.advantagesFilterText

export const getCombatTechniquesFilterText =
  (state: AppState) => state.ui.filters.combatTechniquesFilterText

export const getCulturesFilterText =
  (state: AppState) => state.ui.filters.culturesFilterText

export const getDisadvantagesFilterText =
  (state: AppState) => state.ui.filters.disadvantagesFilterText

export const getEquipmentFilterText =
  (state: AppState) => state.ui.filters.equipmentFilterText

export const getHerolistFilterText =
  (state: AppState) => state.ui.filters.herolistFilterText

export const getInactiveAdvantagesFilterText =
  (state: AppState) => state.ui.filters.inactiveAdvantagesFilterText

export const getInactiveDisadvantagesFilterText =
  (state: AppState) => state.ui.filters.inactiveDisadvantagesFilterText

export const getInactiveLiturgicalChantsFilterText =
  (state: AppState) => state.ui.filters.inactiveLiturgicalChantsFilterText

export const getInactiveSpecialAbilitiesFilterText =
  (state: AppState) => state.ui.filters.inactiveSpecialAbilitiesFilterText

export const getInactiveSpellsFilterText =
  (state: AppState) => state.ui.filters.inactiveSpellsFilterText

export const getItemTemplatesFilterText =
  (state: AppState) => state.ui.filters.itemTemplatesFilterText

export const getLiturgicalChantsFilterText =
  (state: AppState) => state.ui.filters.liturgicalChantsFilterText

export const getProfessionsFilterText =
  (state: AppState) => state.ui.filters.professionsFilterText

export const getRacesFilterText =
  (state: AppState) => state.ui.filters.racesFilterText

export const getSkillsFilterText =
  (state: AppState) => state.ui.filters.skillsFilterText

export const getSpecialAbilitiesFilterText =
  (state: AppState) => state.ui.filters.specialAbilitiesFilterText

export const getSpellsFilterText =
  (state: AppState) => state.ui.filters.spellsFilterText

export const getZoneArmorFilterText =
  (state: AppState) => state.ui.filters.hitZoneArmorFilterText


export const getWikiFilterText = (state: AppState) => state.ui.wiki.filter
export const getWikiFilterAll = (state: AppState) => state.ui.wiki.filterAll
export const getWikiMainCategory = (state: AppState) => state.ui.wiki.category1
export const getWikiCombatTechniquesGroup = (state: AppState) => state.ui.wiki.combatTechniquesGroup
export const getWikiItemTemplatesGroup = (state: AppState) => state.ui.wiki.itemTemplatesGroup
export const getWikiLiturgicalChantsGroup = (state: AppState) => state.ui.wiki.liturgicalChantsGroup
export const getWikiProfessionsGroup = (state: AppState) => state.ui.wiki.professionsGroup
export const getWikiSkillsGroup = (state: AppState) => state.ui.wiki.skillsGroup
export const getWikiSpecialAbilitiesGroup = (state: AppState) => state.ui.wiki.specialAbilitiesGroup
export const getWikiSpellsGroup = (state: AppState) => state.ui.wiki.spellsGroup

export const getWiki = (state: AppState) => state.wiki
export const getWikiAdvantages = (state: AppState) => state.wiki.advantages
export const getWikiAttributes = (state: AppState) => state.wiki.attributes
export const getWikiBlessings = (state: AppState) => state.wiki.blessings
export const getWikiBooks = (state: AppState) => state.wiki.books
export const getWikiCantrips = (state: AppState) => state.wiki.cantrips
export const getWikiCombatTechniques = (state: AppState) => state.wiki.combatTechniques
export const getWikiCultures = (state: AppState) => state.wiki.cultures
export const getWikiDisadvantages = (state: AppState) => state.wiki.disadvantages
export const getWikiExperienceLevels = (state: AppState) => state.wiki.experienceLevels
export const getWikiItemTemplates = (state: AppState) => state.wiki.itemTemplates
export const getWikiLiturgicalChants = (state: AppState) => state.wiki.liturgicalChants
export const getWikiProfessions = (state: AppState) => state.wiki.professions
export const getWikiProfessionVariants = (state: AppState) => state.wiki.professionVariants
export const getWikiRaces = (state: AppState) => state.wiki.races
export const getWikiRaceVariants = (state: AppState) => state.wiki.raceVariants
export const getWikiSkills = (state: AppState) => state.wiki.skills
export const getWikiSpecialAbilities = (state: AppState) => state.wiki.specialAbilities
export const getWikiSpells = (state: AppState) => state.wiki.spells
