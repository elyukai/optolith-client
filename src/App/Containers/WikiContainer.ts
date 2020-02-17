import { connect } from "react-redux"
import { Action, Dispatch } from "redux"
import { fromJust, isJust, Maybe } from "../../Data/Maybe"
import { setWikiCategory1, setWikiCategory2, setWikiCombatTechniquesGroup, setWikiFilter, setWikiFilterAll, setWikiItemTemplatesGroup, setWikiLiturgicalChantsGroup, setWikiProfessionsGroup, setWikiSkillsGroup, setWikiSpecialAbilitiesGroup, setWikiSpellsGroup } from "../Actions/WikiActions"
import { AppStateRecord } from "../Models/AppState"
import { getWikiCombatTechniquesGroup, getWikiFilterText, getWikiItemTemplatesGroup, getWikiLiturgicalChantsGroup, getWikiMainCategory, getWikiProfessionsGroup, getWikiSkillsGroup, getWikiSpecialAbilitiesGroup, getWikiSpellsGroup } from "../Selectors/stateSelectors"
import { getPreparedAdvantages, getPreparedBlessings, getPreparedCantrips, getPreparedCombatTechniques, getPreparedCultures, getPreparedDisadvantages, getPreparedItemTemplates, getPreparedLiturgicalChants, getPreparedProfessions, getPreparedRaces, getPreparedSkills, getPreparedSpecialAbilities, getPreparedSpells, getSpecialAbilityGroups } from "../Selectors/wikiSelectors"
import { Wiki, WikiDispatchProps, WikiOwnProps, WikiStateProps } from "../Views/Wiki/Wiki"

const mapStateToProps = (state: AppStateRecord): WikiStateProps => ({
  filterText: getWikiFilterText (state),
  category: getWikiMainCategory (state),
  races: getPreparedRaces (state),
  cultures: getPreparedCultures (state),
  professions: getPreparedProfessions (state),
  advantages: getPreparedAdvantages (state),
  disadvantages: getPreparedDisadvantages (state),
  skills: getPreparedSkills (state),
  combatTechniques: getPreparedCombatTechniques (state),
  specialAbilities: getPreparedSpecialAbilities (state),
  spells: getPreparedSpells (state),
  cantrips: getPreparedCantrips (state),
  liturgicalChants: getPreparedLiturgicalChants (state),
  blessings: getPreparedBlessings (state),
  itemTemplates: getPreparedItemTemplates (state),
  professionsGroup: getWikiProfessionsGroup (state),
  skillsGroup: getWikiSkillsGroup (state),
  combatTechniquesGroup: getWikiCombatTechniquesGroup (state),
  specialAbilitiesGroup: getWikiSpecialAbilitiesGroup (state),
  spellsGroup: getWikiSpellsGroup (state),
  liturgicalChantsGroup: getWikiLiturgicalChantsGroup (state),
  itemTemplatesGroup: getWikiItemTemplatesGroup (state),
  specialAbilityGroups: getSpecialAbilityGroups (state),
})

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  setCategory1 (category: Maybe<string>) {
    if (isJust (category)) {
      dispatch (setWikiCategory1 (fromJust (category)))
    }
  },
  setCategory2 (category: Maybe<string>) {
    if (isJust (category)) {
      dispatch (setWikiCategory2 (fromJust (category)))
    }
  },
  setFilter (filterText: string) {
    dispatch (setWikiFilter (filterText))
  },
  setFilterAll (filterText: string) {
    dispatch (setWikiFilterAll (filterText))
  },
  setProfessionsGroup (group: Maybe<number>) {
    dispatch (setWikiProfessionsGroup (group))
  },
  setSkillsGroup (group: Maybe<number>) {
    dispatch (setWikiSkillsGroup (group))
  },
  setCombatTechniquesGroup (group: Maybe<number>) {
    dispatch (setWikiCombatTechniquesGroup (group))
  },
  setSpecialAbilitiesGroup (group: Maybe<number>) {
    dispatch (setWikiSpecialAbilitiesGroup (group))
  },
  setSpellsGroup (group: Maybe<number>) {
    dispatch (setWikiSpellsGroup (group))
  },
  setLiturgicalChantsGroup (group: Maybe<number>) {
    dispatch (setWikiLiturgicalChantsGroup (group))
  },
  setItemTemplatesGroup (group: Maybe<number>) {
    dispatch (setWikiItemTemplatesGroup (group))
  },
})

const connectWiki = connect<WikiStateProps, WikiDispatchProps, WikiOwnProps, AppStateRecord> (
  mapStateToProps,
  mapDispatchToProps
)

export const WikiContainer = connectWiki (Wiki)
