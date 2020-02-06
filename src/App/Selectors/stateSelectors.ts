import { fmap } from "../../Data/Functor"
import { List } from "../../Data/List"
import { bind, bindF, Maybe } from "../../Data/Maybe"
import { lookupF } from "../../Data/OrderedMap"
import { peekFst } from "../../Data/Queue"
import { Record } from "../../Data/Record"
import { AppState, AppStateRecord } from "../Models/AppState"
import { FiltersState } from "../Models/FiltersState"
import { Belongings } from "../Models/Hero/Belongings"
import { Energies } from "../Models/Hero/Energies"
import { HeroModel, HeroModelRecord } from "../Models/Hero/HeroModel"
import { PersonalData } from "../Models/Hero/PersonalData"
import { Rules } from "../Models/Hero/Rules"
import { HeroesState } from "../Models/HeroesState"
import { LocaleState } from "../Models/LocaleState"
import { SubWindowsState } from "../Models/SubWindowsState"
import { UIState } from "../Models/UIState"
import { UIWikiState } from "../Models/UIWikiState"
import { L10nRecord } from "../Models/Wiki/L10n"
import { WikiModel } from "../Models/Wiki/WikiModel"
import { heroReducer } from "../Reducers/heroReducer"
import { createMaybeSelector } from "../Utilities/createMaybeSelector"
import { pipe } from "../Utilities/pipe"
import { UndoState } from "../Utilities/undo"

const App = AppState.A
const UIA = UIState.A
const LSA = LocaleState.A
const HSA = HeroesState.A
const HRA = heroReducer.A
const HA = HeroModel.A
const Filt = FiltersState.A
const SubW = SubWindowsState.A
const WikiUI = UIWikiState.A

export const getCurrentTab = pipe (App.ui, UIA.location)

export const getLoadingPhase = App.isReady

export const getLocaleMessages = pipe (App.l10n, LSA.messages)
export const getLocaleId = pipe (App.l10n, LSA.id)
export const getLocaleType = pipe (App.l10n, LSA.type)

export const getLocaleAsProp =
  (_: AppStateRecord, props: { l10n: L10nRecord }) => props.l10n

export const getCurrentHeroId = pipe (App.herolist, HSA.currentId)
export const getHeroes = pipe (App.herolist, HSA.heroes)
export const getUsers = pipe (App.herolist, HSA.users)


export const getCurrentHero = createMaybeSelector (
  getCurrentHeroId,
  getHeroes,
  (mid, heroes): Maybe<Record<UndoState<HeroModelRecord>>> => bind (mid) (lookupF (heroes))
)

export const getHeroProp =
  (_: AppStateRecord, props: { hero: HeroModelRecord }) => props.hero

export const getMaybeHeroProp =
  (_: AppStateRecord, props: { mhero: Maybe<HeroModelRecord> }) => props.mhero


export const getCurrentHeroPresent: (state: AppStateRecord) => Maybe<HeroModelRecord> =
  pipe (getCurrentHero, fmap (HRA.present))

export const getCurrentHeroPast: (state: AppStateRecord) => Maybe<List<HeroModelRecord>> =
  pipe (getCurrentHero, fmap (HRA.past))

export const getCurrentHeroFuture: (state: AppStateRecord) => Maybe<List<HeroModelRecord>> =
  pipe (getCurrentHero, fmap (HRA.future))


export const getHeroLocale =
  createMaybeSelector (getHeroProp, HA.locale)

export const getTotalAdventurePoints =
  pipe (getCurrentHeroPresent, fmap (HA.adventurePointsTotal))


export const getAdvantages =
  pipe (getCurrentHeroPresent, fmap (HA.advantages))

export const getAttributes =
  createMaybeSelector (getHeroProp, HA.attributes)

export const getCurrentAttributeAdjustmentId =
  pipe (getCurrentHeroPresent, fmap (HA.attributeAdjustmentSelected))

export const getBlessings =
  pipe (getCurrentHeroPresent, fmap (HA.blessings))

export const getCantrips =
  pipe (getCurrentHeroPresent, fmap (HA.cantrips))

export const getCombatTechniques =
  pipe (getCurrentHeroPresent, fmap (HA.combatTechniques))

export const getDisadvantages =
  pipe (getCurrentHeroPresent, fmap (HA.disadvantages))

export const getLiturgicalChants =
  pipe (getCurrentHeroPresent, fmap (HA.liturgicalChants))

export const getSkills =
  pipe (getCurrentHeroPresent, fmap (HA.skills))

export const getSpecialAbilities =
  pipe (getHeroProp, HA.specialAbilities)

export const getMaybeSpecialAbilities =
  pipe (getMaybeHeroProp, fmap (HA.specialAbilities))

export const getSpells =
  pipe (getCurrentHeroPresent, fmap (HA.spells))


export const getBlessedStyleDependencies =
  pipe (getHeroProp, HA.blessedStyleDependencies)

export const getCombatStyleDependencies =
  pipe (getHeroProp, HA.combatStyleDependencies)

export const getMagicalStyleDependencies =
  pipe (getHeroProp, HA.magicalStyleDependencies)

export const getSkillStyleDependencies =
  pipe (getHeroProp, HA.skillStyleDependencies)

export const getSocialDependencies =
  pipe (getHeroProp, HA.socialStatusDependencies)


export const getCurrentHeroName =
  pipe (getCurrentHeroPresent, fmap (HA.name))


export const getProfile =
  pipe (getCurrentHeroPresent, fmap (HA.personalData))

const Pers = PersonalData.A

export const getCultureAreaKnowledge =
  pipe (getCurrentHeroPresent, bindF (pipe (HA.personalData, Pers.cultureAreaKnowledge)))

export const getSex =
  pipe (getCurrentHeroPresent, fmap (HA.sex))

export const getSize =
  pipe (getCurrentHeroPresent, bindF (pipe (HA.personalData, Pers.size)))

export const getWeight =
  pipe (getCurrentHeroPresent, bindF (pipe (HA.personalData, Pers.weight)))

export const getAvatar =
  pipe (getCurrentHeroPresent, bindF (HA.avatar))

export const getSocialStatus =
  pipe (getHeroProp, HA.personalData, Pers.socialStatus)


export const getPact =
  pipe (getCurrentHeroPresent, bindF (HA.pact))


export const getRules =
  pipe (getHeroProp, HA.rules)

export const getRulesM =
  pipe (getMaybeHeroProp, fmap (HA.rules))

const Rul = Rules.A

export const getAttributeValueLimit =
  pipe (getCurrentHeroPresent, fmap (pipe (HA.rules, Rul.attributeValueLimit)))

export const getHigherParadeValues =
  pipe (getCurrentHeroPresent, fmap (pipe (HA.rules, Rul.higherParadeValues)))

export const getAreAllRuleBooksEnabled =
  pipe (getCurrentHeroPresent, fmap (pipe (HA.rules, Rul.enableAllRuleBooks)))

export const getEnabledRuleBooks =
  pipe (getCurrentHeroPresent, fmap (pipe (HA.rules, Rul.enabledRuleBooks)))


export const getRaceId =
  pipe (getHeroProp, HA.race)

export const getRaceIdM =
  pipe (getMaybeHeroProp, bindF (HA.race))

export const getCurrentRaceId =
  pipe (getCurrentHeroPresent, bindF (HA.race))

export const getRaceVariantId =
  pipe (getHeroProp, HA.raceVariant)

export const getCurrentRaceVariantId =
  pipe (getCurrentHeroPresent, bindF (HA.raceVariant))

export const getCultureId =
  pipe (getHeroProp, HA.culture)

export const getCurrentCultureId =
  pipe (getCurrentHeroPresent, bindF (HA.culture))

export const getCurrentProfessionId =
  pipe (getCurrentHeroPresent, bindF (HA.profession))

export const getCustomProfessionName =
  pipe (getCurrentHeroPresent, bindF (HA.professionName))

export const getCurrentProfessionVariantId =
  pipe (getCurrentHeroPresent, bindF (HA.professionVariant))


export const getEnergies =
  pipe (getCurrentHeroPresent, fmap (HA.energies))

const Ener = Energies.A

export const getAddedLifePoints =
  pipe (getCurrentHeroPresent, fmap (pipe (HA.energies, Ener.addedLifePoints)))

export const getAddedArcaneEnergyPoints =
  pipe (getCurrentHeroPresent, fmap (pipe (HA.energies, Ener.addedArcaneEnergyPoints)))

export const getAddedKarmaPoints =
  pipe (getCurrentHeroPresent, fmap (pipe (HA.energies, Ener.addedKarmaPoints)))

export const getPermanentLifePoints =
  pipe (getCurrentHeroPresent, fmap (pipe (HA.energies, Ener.permanentLifePoints)))

export const getPermanentArcaneEnergyPoints =
  pipe (getCurrentHeroPresent, fmap (pipe (HA.energies, Ener.permanentArcaneEnergyPoints)))

export const getPermanentKarmaPoints =
  pipe (getCurrentHeroPresent, fmap (pipe (HA.energies, Ener.permanentKarmaPoints)))


export const getCurrentPhase =
  pipe (getCurrentHeroPresent, fmap (HA.phase))

export const getPhase =
  pipe (getHeroProp, HA.phase)


export const getExperienceLevelStartId =
  pipe (getCurrentHeroPresent, fmap (HA.experienceLevel))


export const getEquipmentState =
  pipe (getCurrentHeroPresent, fmap (HA.belongings))

const Belo = Belongings.A

export const getItemsState =
  pipe (getCurrentHeroPresent, fmap (pipe (HA.belongings, Belo.items)))

export const getHitZoneArmorsState =
  pipe (getCurrentHeroPresent, fmap (pipe (HA.belongings, Belo.hitZoneArmors)))

export const getPurse =
  pipe (getCurrentHeroPresent, fmap (pipe (HA.belongings, Belo.purse)))

export const getItemEditorInstance =
  pipe (getCurrentHeroPresent, bindF (pipe (HA.belongings, Belo.itemInEditor)))

export const getIsItemCreation =
  pipe (getCurrentHeroPresent, fmap (pipe (HA.belongings, Belo.isInItemCreation)))

export const getArmorZonesEditorInstance =
  pipe (getCurrentHeroPresent, bindF (pipe (HA.belongings, Belo.hitZoneArmorInEditor)))

export const getIsInHitZoneArmorCreation =
  pipe (getCurrentHeroPresent, fmap (pipe (HA.belongings, Belo.isInHitZoneArmorCreation)))

export const getPets =
  pipe (getCurrentHeroPresent, fmap (HA.pets))

export const getPetEditorInstance =
  pipe (getCurrentHeroPresent, bindF (HA.petInEditor))

export const getIsInPetCreation =
  pipe (getCurrentHeroPresent, fmap (HA.isInPetCreation))


export const getTransferredUnfamiliarSpells = pipe (getHeroProp, HA.transferredUnfamiliarSpells)


export const getAlerts = pipe (App.ui, UIA.alerts)

export const getCurrentAlert = pipe (App.ui, UIA.alerts, peekFst)


export const getUpdateDownloadProgress =
  pipe (App.ui, UIA.subwindows, SubW.updateDownloadProgress)

export const getAddPermanentEnergy =
  pipe (App.ui, UIA.subwindows, SubW.addPermanentEnergy)

export const getEditPermanentEnergy =
  pipe (App.ui, UIA.subwindows, SubW.editPermanentEnergy)

export const getIsAddAdventurePointsOpen =
  pipe (App.ui, UIA.subwindows, SubW.isAddAdventurePointsOpen)

export const getIsCharacterCreatorOpen =
  pipe (App.ui, UIA.subwindows, SubW.isCharacterCreatorOpen)

export const getIsSettingsOpen =
  pipe (App.ui, UIA.subwindows, SubW.isSettingsOpen)

export const getIsEditCharacterAvatarOpen =
  pipe (App.ui, UIA.subwindows, SubW.isEditCharacterAvatarOpen)

export const getIsEditPetAvatarOpen =
  pipe (App.ui, UIA.subwindows, SubW.isEditPetAvatarOpen)


export const getAdvantagesFilterText =
  pipe (App.ui, UIA.filters, Filt.advantagesFilterText)

export const getCombatTechniquesFilterText =
  pipe (App.ui, UIA.filters, Filt.combatTechniquesFilterText)

export const getCulturesFilterText =
  pipe (App.ui, UIA.filters, Filt.culturesFilterText)

export const getDisadvantagesFilterText =
  pipe (App.ui, UIA.filters, Filt.disadvantagesFilterText)

export const getEquipmentFilterText =
  pipe (App.ui, UIA.filters, Filt.equipmentFilterText)

export const getHerolistFilterText =
  pipe (App.ui, UIA.filters, Filt.herolistFilterText)

export const getInactiveAdvantagesFilterText =
  pipe (App.ui, UIA.filters, Filt.inactiveAdvantagesFilterText)

export const getInactiveDisadvantagesFilterText =
  pipe (App.ui, UIA.filters, Filt.inactiveDisadvantagesFilterText)

export const getInactiveLiturgicalChantsFilterText =
  pipe (App.ui, UIA.filters, Filt.inactiveLiturgicalChantsFilterText)

export const getInactiveSpecialAbilitiesFilterText =
  pipe (App.ui, UIA.filters, Filt.inactiveSpecialAbilitiesFilterText)

export const getInactiveSpellsFilterText =
  pipe (App.ui, UIA.filters, Filt.inactiveSpellsFilterText)

export const getItemTemplatesFilterText =
  pipe (App.ui, UIA.filters, Filt.itemTemplatesFilterText)

export const getLiturgicalChantsFilterText =
  pipe (App.ui, UIA.filters, Filt.liturgicalChantsFilterText)

export const getProfessionsFilterText =
  pipe (App.ui, UIA.filters, Filt.professionsFilterText)

export const getRacesFilterText =
  pipe (App.ui, UIA.filters, Filt.racesFilterText)

export const getSkillsFilterText =
  pipe (App.ui, UIA.filters, Filt.skillsFilterText)

export const getSpecialAbilitiesFilterText =
  pipe (App.ui, UIA.filters, Filt.specialAbilitiesFilterText)

export const getSpellsFilterText =
  pipe (App.ui, UIA.filters, Filt.spellsFilterText)

export const getZoneArmorFilterText =
  pipe (App.ui, UIA.filters, Filt.hitZoneArmorFilterText)


export const getWikiFilterText =
  pipe (App.ui, UIA.wiki, WikiUI.filter)

export const getWikiFilterAll =
  pipe (App.ui, UIA.wiki, WikiUI.filterAll)

export const getWikiMainCategory =
  pipe (App.ui, UIA.wiki, WikiUI.category1)

export const getWikiCombatTechniquesGroup =
  pipe (App.ui, UIA.wiki, WikiUI.combatTechniquesGroup)

export const getWikiItemTemplatesGroup =
  pipe (App.ui, UIA.wiki, WikiUI.itemTemplatesGroup)

export const getWikiLiturgicalChantsGroup =
  pipe (App.ui, UIA.wiki, WikiUI.liturgicalChantsGroup)

export const getWikiProfessionsGroup =
  pipe (App.ui, UIA.wiki, WikiUI.professionsGroup)

export const getWikiSkillsGroup =
  pipe (App.ui, UIA.wiki, WikiUI.skillsGroup)

export const getWikiSpecialAbilitiesGroup =
  pipe (App.ui, UIA.wiki, WikiUI.specialAbilitiesGroup)

export const getWikiSpellsGroup =
  pipe (App.ui, UIA.wiki, WikiUI.spellsGroup)


export const getWiki = App.wiki

const Wiki = WikiModel.A

export const getWikiAdvantages = pipe (App.wiki, Wiki.advantages)

export const getWikiAttributes = pipe (App.wiki, Wiki.attributes)

export const getWikiBlessings = pipe (App.wiki, Wiki.blessings)

export const getWikiBooks = pipe (App.wiki, Wiki.books)

export const getWikiCantrips = pipe (App.wiki, Wiki.cantrips)

export const getWikiCombatTechniques = pipe (App.wiki, Wiki.combatTechniques)

export const getWikiCultures = pipe (App.wiki, Wiki.cultures)

export const getWikiDisadvantages = pipe (App.wiki, Wiki.disadvantages)

export const getWikiExperienceLevels = pipe (App.wiki, Wiki.experienceLevels)

export const getWikiItemTemplates = pipe (App.wiki, Wiki.itemTemplates)

export const getWikiLiturgicalChants = pipe (App.wiki, Wiki.liturgicalChants)

export const getWikiProfessions = pipe (App.wiki, Wiki.professions)

export const getWikiProfessionVariants = pipe (App.wiki, Wiki.professionVariants)

export const getWikiRaces = pipe (App.wiki, Wiki.races)

export const getWikiRaceVariants = pipe (App.wiki, Wiki.raceVariants)

export const getWikiSkills = pipe (App.wiki, Wiki.skills)

export const getWikiSpecialAbilities = pipe (App.wiki, Wiki.specialAbilities)

export const getWikiSpells = pipe (App.wiki, Wiki.spells)
