import * as React from "react"
import { Maybe } from "../../../../Data/Maybe"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { translate } from "../../../Utilities/I18n"
import { renderMaybe } from "../../../Utilities/ReactUtils"

interface Props {
  staticData: StaticDataRecord
  aspects: Maybe<string>
  blessedPrimary: Maybe<string>
  blessedTradition: Maybe<string>
}

export const LiturgicalChantsSheetTraditionsAspects: React.FC<Props> = props => {
  const { aspects, blessedPrimary, blessedTradition, staticData } = props

  return (
    <div className="tradition-aspects">
      <div className="primary">
        <span className="label">
          {translate (staticData) ("sheets.chantssheet.primaryattribute")}
        </span>
        <span className="value">{renderMaybe (blessedPrimary)}</span>
      </div>
      <div className="aspects">
        <span className="label">
          {translate (staticData) ("sheets.chantssheet.aspects")}
        </span>
        <span className="value">
          {renderMaybe (aspects)}
        </span>
      </div>
      <div className="tradition">
        <span className="label">
          {translate (staticData) ("sheets.chantssheet.tradition")}
        </span>
        <span className="value">{renderMaybe (blessedTradition)}</span>
      </div>
    </div>
  )
}
