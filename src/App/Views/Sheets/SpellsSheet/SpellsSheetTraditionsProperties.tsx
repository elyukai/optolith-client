import * as React from "react"
import { intercalate, List } from "../../../../Data/List"
import { Maybe } from "../../../../Data/Maybe"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { translate } from "../../../Utilities/I18n"
import { renderMaybe } from "../../../Utilities/ReactUtils"

interface Props {
  staticData: StaticDataRecord
  magicalPrimary: List<string>
  magicalTradition: string
  properties: Maybe<string>
}

export const SpellsSheetTraditionsProperties: React.FC<Props> = props => {
  const { magicalPrimary, magicalTradition, properties, staticData } = props

  return (
    <div className="tradition-properties">
      <div className="primary">
        <span className="label">
          {translate (staticData) ("sheets.spellssheet.primaryattribute")}
        </span>
        <span className="value">{intercalate ("/") (magicalPrimary)}</span>
      </div>
      <div className="properties">
        <span className="label">
          {translate (staticData) ("sheets.spellssheet.properties")}
        </span>
        <span className="value">
          {renderMaybe (properties)}
        </span>
      </div>
      <div className="tradition">
        <span className="label">
          {translate (staticData) ("sheets.spellssheet.tradition")}
        </span>
        <span className="value">{magicalTradition}</span>
      </div>
    </div>
  )
}
