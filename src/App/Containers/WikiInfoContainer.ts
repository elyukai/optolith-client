import { connect } from "react-redux"
import { SpecialAbilityId } from "../Constants/Ids"
import { AppStateRecord } from "../Reducers/appReducer"
import { getAllCultures, getAllProfessions, getAllRaces } from "../Selectors/rcpSelectors"
import * as stateSelectors from "../Selectors/stateSelectors"
import { mapGetToSlice } from "../Utilities/SelectorsUtils"
import { WikiInfo, WikiInfoDispatchProps, WikiInfoOwnProps } from "../Views/InlineWiki/WikiInfo"
import { WikiInfoContentStateProps } from "../Views/InlineWiki/WikiInfoContent"

const mapStateToProps =
  (state: AppStateRecord, ownProps: WikiInfoOwnProps): WikiInfoContentStateProps => ({
    combinedCultures: getAllCultures (state),
    combinedRaces: getAllRaces (state),
    combinedProfessions: getAllProfessions (state, ownProps),
    languages: mapGetToSlice (stateSelectors.getWikiSpecialAbilities)
                             (SpecialAbilityId.Language)
                             (state),
    items: stateSelectors.getItemsState (state),
    liturgicalChantExtensions: mapGetToSlice (stateSelectors.getWikiSpecialAbilities)
                                             (SpecialAbilityId.ChantEnhancement)
                                             (state),
    scripts: mapGetToSlice (stateSelectors.getWikiSpecialAbilities)
                           (SpecialAbilityId.Literacy)
                           (state),
    sex: stateSelectors.getSex (state),
    spellExtensions: mapGetToSlice (stateSelectors.getWikiSpecialAbilities)
                                   (SpecialAbilityId.SpellEnhancement) (state),
    wiki: stateSelectors.getWiki (state),
  })

export const connectWikiInfo =
  connect<WikiInfoContentStateProps, WikiInfoDispatchProps, WikiInfoOwnProps, AppStateRecord> (
    mapStateToProps
  )

export const WikiInfoContainer = connectWikiInfo (WikiInfo)
