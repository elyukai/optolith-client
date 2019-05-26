import { connect } from "react-redux";
import { AppStateRecord } from "../Reducers/appReducer";
import { getAllCultures, getAllProfessions, getAllRaces } from "../Selectors/rcpSelectors";
import * as stateSelectors from "../Selectors/stateSelectors";
import { mapGetToSlice } from "../Utilities/SelectorsUtils";
import { WikiInfo, WikiInfoDispatchProps, WikiInfoOwnProps } from "../Views/InlineWiki/WikiInfo";
import { WikiInfoContentStateProps } from "../Views/InlineWiki/WikiInfoContent";

const mapStateToProps =
  (state: AppStateRecord, ownProps: WikiInfoOwnProps): WikiInfoContentStateProps => ({
    attributes: stateSelectors.getWikiAttributes (state),
    advantages: stateSelectors.getWikiAdvantages (state),
    blessings: stateSelectors.getWikiBlessings (state),
    books: stateSelectors.getWikiBooks (state),
    cantrips: stateSelectors.getWikiCantrips (state),
    combatTechniques: stateSelectors.getWikiCombatTechniques (state),
    cultures: stateSelectors.getWikiCultures (state),
    combinedCultures: getAllCultures (state),
    combinedRaces: getAllRaces (state),
    combinedProfessions: getAllProfessions (state, ownProps),
    disadvantages: stateSelectors.getWikiDisadvantages (state),
    languages: mapGetToSlice (stateSelectors.getWikiSpecialAbilities) ("SA_29") (state),
    items: stateSelectors.getItemsState (state),
    itemTemplates: stateSelectors.getWikiItemTemplates (state),
    professionVariants: stateSelectors.getWikiProfessionVariants (state),
    races: stateSelectors.getWikiRaces (state),
    liturgicalChantExtensions:
      mapGetToSlice (stateSelectors.getWikiSpecialAbilities) ("SA_663") (state),
    liturgicalChants: stateSelectors.getWikiLiturgicalChants (state),
    scripts: mapGetToSlice (stateSelectors.getWikiSpecialAbilities) ("SA_27") (state),
    sex: stateSelectors.getSex (state),
    skills: stateSelectors.getWikiSkills (state),
    spellExtensions: mapGetToSlice (stateSelectors.getWikiSpecialAbilities) ("SA_414") (state),
    spells: stateSelectors.getWikiSpells (state),
    specialAbilities: stateSelectors.getWikiSpecialAbilities (state),
    wiki: stateSelectors.getWiki (state),
  })

export const connectWikiInfo =
  connect<WikiInfoContentStateProps, WikiInfoDispatchProps, WikiInfoOwnProps, AppStateRecord> (
    mapStateToProps
  )

export const WikiInfoContainer = connectWikiInfo (WikiInfo)
