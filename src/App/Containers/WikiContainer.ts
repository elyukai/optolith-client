import { connect } from "react-redux";
import { Action, Dispatch } from "redux";
import { setWikiCategory1, setWikiCategory2, setWikiCombatTechniquesGroup, setWikiFilter, setWikiFilterAll, setWikiItemTemplatesGroup, setWikiLiturgicalChantsGroup, setWikiProfessionsGroup, setWikiSkillsGroup, setWikiSpecialAbilitiesGroup, setWikiSpellsGroup } from "../Actions/WikiActions";
import { AppState } from "../Reducers/appReducer";
import { getSex, getWikiCombatTechniquesGroup, getWikiFilterAll, getWikiFilterText, getWikiItemTemplatesGroup, getWikiLiturgicalChantsGroup, getWikiMainCategory, getWikiProfessionsGroup, getWikiSkillsGroup, getWikiSpecialAbilitiesGroup, getWikiSpellsGroup } from "../Selectors/stateSelectors";
import { getPreparedAdvantages, getPreparedBlessings, getPreparedCantrips, getPreparedCombatTechniques, getPreparedCultures, getPreparedDisadvantages, getPreparedItemTemplates, getPreparedLiturgicalChants, getPreparedProfessions, getPreparedRaces, getPreparedSkills, getPreparedSpecialAbilities, getPreparedSpells, getSpecialAbilityGroups } from "../Selectors/wikiSelectors";
import { Wiki, WikiDispatchProps, WikiOwnProps, WikiStateProps } from "../Views/Wiki/Wiki";

const mapStateToProps = (state: AppState, props: WikiOwnProps) => ({
  filterText: getWikiFilterText (state),
  filterAllText: getWikiFilterAll (state),
  category: getWikiMainCategory (state),
  sex: getSex (state),
  races: getPreparedRaces (state, props),
  cultures: getPreparedCultures (state, props),
  professions: getPreparedProfessions (state, props),
  advantages: getPreparedAdvantages (state, props),
  disadvantages: getPreparedDisadvantages (state, props),
  skills: getPreparedSkills (state, props),
  combatTechniques: getPreparedCombatTechniques (state, props),
  specialAbilities: getPreparedSpecialAbilities (state, props),
  spells: getPreparedSpells (state, props),
  cantrips: getPreparedCantrips (state, props),
  liturgicalChants: getPreparedLiturgicalChants (state, props),
  blessings: getPreparedBlessings (state, props),
  itemTemplates: getPreparedItemTemplates (state, props),
  professionsGroup: getWikiProfessionsGroup (state),
  skillsGroup: getWikiSkillsGroup (state),
  combatTechniquesGroup: getWikiCombatTechniquesGroup (state),
  specialAbilitiesGroup: getWikiSpecialAbilitiesGroup (state),
  spellsGroup: getWikiSpellsGroup (state),
  liturgicalChantsGroup: getWikiLiturgicalChantsGroup (state),
  itemTemplatesGroup: getWikiItemTemplatesGroup (state),
  specialAbilityGroups: getSpecialAbilityGroups (state, props),
})

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  setCategory1 (category: Maybe<string>) {
    if (Maybe.isJust (category)) {
      dispatch (setWikiCategory1 (Maybe.fromJust (category)))
    }
  },
  setCategory2 (category: Maybe<string>) {
    if (Maybe.isJust (category)) {
      dispatch (setWikiCategory2 (Maybe.fromJust (category)))
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

const connectWiki = connect<WikiStateProps, WikiDispatchProps, WikiOwnProps, AppState> (
  mapStateToProps,
  mapDispatchToProps
)

export const WikiContainer = connectWiki (Wiki)
