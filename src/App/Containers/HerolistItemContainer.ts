import { connect } from "react-redux"
import { Action } from "redux"
import { join, Just } from "../../Data/Maybe"
import { ReduxDispatch } from "../Actions/Actions"
import * as HerolistActions from "../Actions/HerolistActions"
import * as LocationActions from "../Actions/LocationActions"
import { AppStateRecord } from "../Models/AppState"
import { HeroModel } from "../Models/Hero/HeroModel"
import { getAPObjectMap } from "../Selectors/adventurePointsSelectors"
import { getUnsavedHeroesById } from "../Selectors/herolistSelectors"
import { getUsers, getWiki } from "../Selectors/stateSelectors"
import { TabId } from "../Utilities/LocationUtils"
import { HerolistItem, HerolistItemDispatchProps, HerolistItemOwnProps, HerolistItemStateProps } from "../Views/Heroes/HerolistItem"

const HA = HeroModel.A

const mapStateToProps = (state: AppStateRecord, props: HerolistItemOwnProps) => ({
  ap: join (getAPObjectMap (HA.id (props .hero)) (state, props)),
  unsavedHeroesById: getUnsavedHeroesById (state),
  users: getUsers (state),
  wiki: getWiki (state),
})

const mapDispatchToProps = (
  dispatch: ReduxDispatch<Action>,
  { l10n, hero }: HerolistItemOwnProps
) => ({
  loadHero () {
    dispatch (HerolistActions.loadHero (HA.id (hero)))
  },
  showHero () {
    dispatch (LocationActions.setTab (TabId.Profile))
  },
  async saveHero () {
    await dispatch (HerolistActions.saveHero (l10n) (Just (HA.id (hero))))
  },
  saveHeroAsJSON () {
    dispatch (HerolistActions.exportHeroValidate (l10n) (HA.id (hero)))
  },
  async deleteHero () {
    await dispatch (HerolistActions.deleteHeroValidate (l10n) (HA.id (hero)))
  },
  duplicateHero () {
    dispatch (HerolistActions.duplicateHero (HA.id (hero)))
  },
})

const connectHerolistItem =
  connect<HerolistItemStateProps, HerolistItemDispatchProps, HerolistItemOwnProps, AppStateRecord> (
    mapStateToProps,
    mapDispatchToProps
  )

export const HerolistItemContainer = connectHerolistItem (HerolistItem)
