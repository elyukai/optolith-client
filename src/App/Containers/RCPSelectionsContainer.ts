import { connect } from "react-redux"
import { List } from "../../Data/List"
import { Maybe } from "../../Data/Maybe"
import { Record } from "../../Data/Record"
import { ReduxDispatch } from "../Actions/Actions"
import * as ProfessionActions from "../Actions/ProfessionActions"
import { AppStateRecord } from "../Models/AppState"
import { HeroModelRecord } from "../Models/Hero/HeroModel"
import { Selections as SelectionsInterface } from "../Models/Hero/heroTypeHelpers"
import { DropdownOption } from "../Models/View/DropdownOption"
import { Culture } from "../Models/Wiki/Culture"
import { L10nRecord } from "../Models/Wiki/L10n"
import { Profession } from "../Models/Wiki/Profession"
import { ProfessionVariant } from "../Models/Wiki/ProfessionVariant"
import { Race } from "../Models/Wiki/Race"
import { WikiModelRecord } from "../Models/Wiki/WikiModel"
import { getCurrentCulture, getCurrentProfession, getCurrentProfessionVariant, getRace } from "../Selectors/rcpSelectors"
import { getAllSpellsForManualGuildMageSelect } from "../Selectors/spellsSelectors"
import { getWiki } from "../Selectors/stateSelectors"
import { RCPOptionSelectionsEnsure } from "../Views/RCPOptionSelections/RCPOptionSelectionsEnsure"

interface OwnProps {
  hero: HeroModelRecord
  l10n: L10nRecord
  close (): void
}

interface StateProps {
  wiki: WikiModelRecord
  race: Maybe<Record<Race>>
  culture: Maybe<Record<Culture>>
  profession: Maybe<Record<Profession>>
  professionVariant: Maybe<Record<ProfessionVariant>>
  munfamiliar_spells: Maybe<List<Record<DropdownOption>>>
}

interface DispatchProps {
  setSelections (selections: SelectionsInterface): void
}

const mapStateToProps =
  (state: AppStateRecord, ownProps: OwnProps): StateProps => ({
    race: getRace (state, ownProps),
    culture: getCurrentCulture (state),
    profession: getCurrentProfession (state),
    professionVariant: getCurrentProfessionVariant (state),
    wiki: getWiki (state),
    munfamiliar_spells: getAllSpellsForManualGuildMageSelect (state, ownProps),
  })

const mapDispatchToProps = (dispatch: ReduxDispatch): DispatchProps => ({
  setSelections (selections: SelectionsInterface) {
    dispatch (ProfessionActions.setSelections (selections))
  },
})

export const connectSelections =
  connect<StateProps, DispatchProps, OwnProps, AppStateRecord> (
    mapStateToProps,
    mapDispatchToProps
  )

export const SelectionsContainer = connectSelections (RCPOptionSelectionsEnsure)
