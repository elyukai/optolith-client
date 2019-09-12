import { fmap } from "../../Data/Functor";
import { bind, bindF, listToMaybe, Maybe } from "../../Data/Maybe";
import { lookupF } from "../../Data/OrderedMap";
import { Belongings } from "../Models/Hero/Belongings";
import { Energies } from "../Models/Hero/Energies";
import { HeroModel, HeroModelRecord } from "../Models/Hero/HeroModel";
import { PersonalData } from "../Models/Hero/PersonalData";
import { Rules } from "../Models/Hero/Rules";
import { L10nRecord } from "../Models/Wiki/L10n";
import { WikiModel } from "../Models/Wiki/WikiModel";
import { AppStateRecord } from "../Reducers/appReducer";
import { appSlicesReducer } from "../Reducers/appSlicesReducer";
import { FiltersState } from "../Reducers/filtersReducer";
import { HeroesState } from "../Reducers/herolistReducer";
import { heroReducer } from "../Reducers/heroReducer";
import { LocaleState } from "../Reducers/localeReducer";
import { SubWindowsState } from "../Reducers/subwindowsReducer";
import { uiReducer } from "../Reducers/uiReducer";
import { UIWikiState } from "../Reducers/wikiUIReducer";
import { createMaybeSelector } from "../Utilities/createMaybeSelector";
import { pipe } from "../Utilities/pipe";

const App = appSlicesReducer.A_

const UI = uiReducer.A_

export const getCurrentTab = pipe (App.ui, UI.location)


export const getLocaleMessages = pipe (App.l10n, LocaleState.AL.messages)
export const getLocaleId = pipe (App.l10n, LocaleState.AL.id)
export const getLocaleType = pipe (App.l10n, LocaleState.AL.type)

export const getLocaleAsProp =
  (_: AppStateRecord, props: { l10n: L10nRecord }) => props.l10n

export const getCurrentHeroId = pipe (App.herolist, HeroesState.AL.currentId)
export const getHeroes = pipe (App.herolist, HeroesState.AL.heroes)
export const getUsers = pipe (App.herolist, HeroesState.AL.users)


export const getCurrentHero = createMaybeSelector (
  getCurrentHeroId,
  getHeroes,
  (mid, heroes) => bind (mid) (lookupF (heroes))
)

export const getHeroProp =
  (_: AppStateRecord, props: { hero: HeroModelRecord }) => props.hero

export const getMaybeHeroProp =
  (_: AppStateRecord, props: { mhero: Maybe<HeroModelRecord> }) => props.mhero


export const getCurrentHeroPresent =
  createMaybeSelector (getCurrentHero, fmap (heroReducer.A.present))

export const getCurrentHeroPast =
  createMaybeSelector (getCurrentHero, fmap (heroReducer.A.past))

export const getCurrentHeroFuture =
  createMaybeSelector (getCurrentHero, fmap (heroReducer.A.future))


const Hero = HeroModel.A

export const getHeroLocale =
  createMaybeSelector (getHeroProp, Hero.locale)

export const getTotalAdventurePoints =
  pipe (getCurrentHeroPresent, fmap (Hero.adventurePointsTotal))


export const getAdvantages =
  pipe (getCurrentHeroPresent, fmap (Hero.advantages))

export const getAttributes =
  createMaybeSelector (getHeroProp, Hero.attributes)

export const getCurrentAttributeAdjustmentId =
  pipe (getCurrentHeroPresent, fmap (Hero.attributeAdjustmentSelected))

export const getBlessings =
  pipe (getCurrentHeroPresent, fmap (Hero.blessings))

export const getCantrips =
  pipe (getCurrentHeroPresent, fmap (Hero.cantrips))

export const getCombatTechniques =
  pipe (getCurrentHeroPresent, fmap (Hero.combatTechniques))

export const getDisadvantages =
  pipe (getCurrentHeroPresent, fmap (Hero.disadvantages))

export const getLiturgicalChants =
  pipe (getCurrentHeroPresent, fmap (Hero.liturgicalChants))

export const getSkills =
  pipe (getCurrentHeroPresent, fmap (Hero.skills))

export const getSpecialAbilities =
  pipe (getHeroProp, Hero.specialAbilities)

export const getMaybeSpecialAbilities =
  pipe (getMaybeHeroProp, fmap (Hero.specialAbilities))

export const getSpells =
  pipe (getCurrentHeroPresent, fmap (Hero.spells))


export const getBlessedStyleDependencies =
  pipe (getHeroProp, Hero.blessedStyleDependencies)

export const getCombatStyleDependencies =
  pipe (getHeroProp, Hero.combatStyleDependencies)

export const getMagicalStyleDependencies =
  pipe (getHeroProp, Hero.magicalStyleDependencies)

export const getSkillStyleDependencies =
  pipe (getHeroProp, Hero.skillStyleDependencies)

export const getSocialDependencies =
  pipe (getHeroProp, Hero.socialStatusDependencies)


export const getCurrentHeroName =
  pipe (getCurrentHeroPresent, fmap (Hero.name))


export const getProfile =
  pipe (getCurrentHeroPresent, fmap (Hero.personalData))

const Pers = PersonalData.A

export const getCultureAreaKnowledge =
  pipe (getCurrentHeroPresent, bindF (pipe (Hero.personalData, Pers.cultureAreaKnowledge)))

export const getSex =
  pipe (getCurrentHeroPresent, fmap (Hero.sex))

export const getSize =
  pipe (getCurrentHeroPresent, bindF (pipe (Hero.personalData, Pers.size)))

export const getWeight =
  pipe (getCurrentHeroPresent, bindF (pipe (Hero.personalData, Pers.weight)))

export const getAvatar =
  pipe (getCurrentHeroPresent, bindF (Hero.avatar))

export const getSocialStatus =
  pipe (getHeroProp, Hero.personalData, Pers.socialStatus)


export const getPact =
  pipe (getCurrentHeroPresent, bindF (Hero.pact))


export const getRules =
  pipe (getHeroProp, Hero.rules)

export const getRulesM =
  pipe (getMaybeHeroProp, fmap (Hero.rules))

const Rul = Rules.A

export const getAttributeValueLimit =
  pipe (getCurrentHeroPresent, fmap (pipe (Hero.rules, Rul.attributeValueLimit)))

export const getHigherParadeValues =
  pipe (getCurrentHeroPresent, fmap (pipe (Hero.rules, Rul.higherParadeValues)))

export const getAreAllRuleBooksEnabled =
  pipe (getCurrentHeroPresent, fmap (pipe (Hero.rules, Rul.enableAllRuleBooks)))

export const getEnabledRuleBooks =
  pipe (getCurrentHeroPresent, fmap (pipe (Hero.rules, Rul.enabledRuleBooks)))


export const getRaceId =
  pipe (getHeroProp, Hero.race)

export const getRaceIdM =
  pipe (getMaybeHeroProp, bindF (Hero.race))

export const getCurrentRaceId =
  pipe (getCurrentHeroPresent, bindF (Hero.race))

export const getCurrentRaceVariantId =
  pipe (getCurrentHeroPresent, bindF (Hero.raceVariant))

export const getCurrentCultureId =
  pipe (getCurrentHeroPresent, bindF (Hero.culture))

export const getCurrentProfessionId =
  pipe (getCurrentHeroPresent, bindF (Hero.profession))

export const getCustomProfessionName =
  pipe (getCurrentHeroPresent, bindF (Hero.professionName))

export const getCurrentProfessionVariantId =
  pipe (getCurrentHeroPresent, bindF (Hero.professionVariant))


export const getEnergies =
  pipe (getCurrentHeroPresent, fmap (Hero.energies))

const Ener = Energies.A

export const getAddedLifePoints =
  pipe (getCurrentHeroPresent, fmap (pipe (Hero.energies, Ener.addedLifePoints)))

export const getAddedArcaneEnergyPoints =
  pipe (getCurrentHeroPresent, fmap (pipe (Hero.energies, Ener.addedArcaneEnergyPoints)))

export const getAddedKarmaPoints =
  pipe (getCurrentHeroPresent, fmap (pipe (Hero.energies, Ener.addedKarmaPoints)))

export const getPermanentLifePoints =
  pipe (getCurrentHeroPresent, fmap (pipe (Hero.energies, Ener.permanentLifePoints)))

export const getPermanentArcaneEnergyPoints =
  pipe (getCurrentHeroPresent, fmap (pipe (Hero.energies, Ener.permanentArcaneEnergyPoints)))

export const getPermanentKarmaPoints =
  pipe (getCurrentHeroPresent, fmap (pipe (Hero.energies, Ener.permanentKarmaPoints)))


export const getPhase =
  pipe (getCurrentHeroPresent, fmap (Hero.phase))


export const getExperienceLevelStartId =
  pipe (getCurrentHeroPresent, fmap (Hero.experienceLevel))


export const getEquipmentState =
  pipe (getCurrentHeroPresent, fmap (Hero.belongings))

const Belo = Belongings.A

export const getItemsState =
  pipe (getCurrentHeroPresent, fmap (pipe (Hero.belongings, Belo.items)))

export const getHitZoneArmorsState =
  pipe (getCurrentHeroPresent, fmap (pipe (Hero.belongings, Belo.hitZoneArmors)))

export const getPurse =
  pipe (getCurrentHeroPresent, fmap (pipe (Hero.belongings, Belo.purse)))

export const getItemEditorInstance =
  pipe (getCurrentHeroPresent, bindF (pipe (Hero.belongings, Belo.itemInEditor)))

export const getIsItemCreation =
  pipe (getCurrentHeroPresent, fmap (pipe (Hero.belongings, Belo.isInItemCreation)))

export const getArmorZonesEditorInstance =
  pipe (getCurrentHeroPresent, bindF (pipe (Hero.belongings, Belo.hitZoneArmorInEditor)))

export const getIsInHitZoneArmorCreation =
  pipe (getCurrentHeroPresent, fmap (pipe (Hero.belongings, Belo.isInHitZoneArmorCreation)))

export const getPets =
  pipe (getCurrentHeroPresent, fmap (Hero.pets))

export const getPetEditorInstance =
  pipe (getCurrentHeroPresent, bindF (Hero.petInEditor))

export const getIsInPetCreation =
  pipe (getCurrentHeroPresent, fmap (Hero.isInPetCreation))


export const getAlerts = pipe (App.ui, UI.alerts)

export const getCurrentAlert = pipe (App.ui, UI.alerts, listToMaybe)


const SubW = SubWindowsState.A

export const getUpdateDownloadProgress =
  pipe (App.ui, UI.subwindows, SubW.updateDownloadProgress)

export const getAddPermanentEnergy =
  pipe (App.ui, UI.subwindows, SubW.addPermanentEnergy)

export const getEditPermanentEnergy =
  pipe (App.ui, UI.subwindows, SubW.editPermanentEnergy)

export const getIsAddAdventurePointsOpen =
  pipe (App.ui, UI.subwindows, SubW.isAddAdventurePointsOpen)

export const getIsCharacterCreatorOpen =
  pipe (App.ui, UI.subwindows, SubW.isCharacterCreatorOpen)

export const getIsSettingsOpen =
  pipe (App.ui, UI.subwindows, SubW.isSettingsOpen)

export const getIsEditCharacterAvatarOpen =
  pipe (App.ui, UI.subwindows, SubW.isEditCharacterAvatarOpen)

export const getIsEditPetAvatarOpen =
  pipe (App.ui, UI.subwindows, SubW.isEditPetAvatarOpen)


const Filt = FiltersState.A

export const getAdvantagesFilterText =
  pipe (App.ui, UI.filters, Filt.advantagesFilterText)

export const getCombatTechniquesFilterText =
  pipe (App.ui, UI.filters, Filt.combatTechniquesFilterText)

export const getCulturesFilterText =
  pipe (App.ui, UI.filters, Filt.culturesFilterText)

export const getDisadvantagesFilterText =
  pipe (App.ui, UI.filters, Filt.disadvantagesFilterText)

export const getEquipmentFilterText =
  pipe (App.ui, UI.filters, Filt.equipmentFilterText)

export const getHerolistFilterText =
  pipe (App.ui, UI.filters, Filt.herolistFilterText)

export const getInactiveAdvantagesFilterText =
  pipe (App.ui, UI.filters, Filt.inactiveAdvantagesFilterText)

export const getInactiveDisadvantagesFilterText =
  pipe (App.ui, UI.filters, Filt.inactiveDisadvantagesFilterText)

export const getInactiveLiturgicalChantsFilterText =
  pipe (App.ui, UI.filters, Filt.inactiveLiturgicalChantsFilterText)

export const getInactiveSpecialAbilitiesFilterText =
  pipe (App.ui, UI.filters, Filt.inactiveSpecialAbilitiesFilterText)

export const getInactiveSpellsFilterText =
  pipe (App.ui, UI.filters, Filt.inactiveSpellsFilterText)

export const getItemTemplatesFilterText =
  pipe (App.ui, UI.filters, Filt.itemTemplatesFilterText)

export const getLiturgicalChantsFilterText =
  pipe (App.ui, UI.filters, Filt.liturgicalChantsFilterText)

export const getProfessionsFilterText =
  pipe (App.ui, UI.filters, Filt.professionsFilterText)

export const getRacesFilterText =
  pipe (App.ui, UI.filters, Filt.racesFilterText)

export const getSkillsFilterText =
  pipe (App.ui, UI.filters, Filt.skillsFilterText)

export const getSpecialAbilitiesFilterText =
  pipe (App.ui, UI.filters, Filt.specialAbilitiesFilterText)

export const getSpellsFilterText =
  pipe (App.ui, UI.filters, Filt.spellsFilterText)

export const getZoneArmorFilterText =
  pipe (App.ui, UI.filters, Filt.hitZoneArmorFilterText)


const WikiUI = UIWikiState.A

export const getWikiFilterText =
  pipe (App.ui, UI.wiki, WikiUI.filter)

export const getWikiFilterAll =
  pipe (App.ui, UI.wiki, WikiUI.filterAll)

export const getWikiMainCategory =
  pipe (App.ui, UI.wiki, WikiUI.category1)

export const getWikiCombatTechniquesGroup =
  pipe (App.ui, UI.wiki, WikiUI.combatTechniquesGroup)

export const getWikiItemTemplatesGroup =
  pipe (App.ui, UI.wiki, WikiUI.itemTemplatesGroup)

export const getWikiLiturgicalChantsGroup =
  pipe (App.ui, UI.wiki, WikiUI.liturgicalChantsGroup)

export const getWikiProfessionsGroup =
  pipe (App.ui, UI.wiki, WikiUI.professionsGroup)

export const getWikiSkillsGroup =
  pipe (App.ui, UI.wiki, WikiUI.skillsGroup)

export const getWikiSpecialAbilitiesGroup =
  pipe (App.ui, UI.wiki, WikiUI.specialAbilitiesGroup)

export const getWikiSpellsGroup =
  pipe (App.ui, UI.wiki, WikiUI.spellsGroup)


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
