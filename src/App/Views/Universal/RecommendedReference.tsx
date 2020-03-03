import * as React from "react"
import { orN } from "../../../Data/Maybe"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"

interface Props {
  staticData: StaticDataRecord
  strongly?: boolean
  unfamiliarSpells?: boolean
}

export const RecommendedReference: React.FC<Props> = props => {
  const { staticData, strongly, unfamiliarSpells } = props

  if (orN (unfamiliarSpells)) {
    return (
      <div className="recommended-ref">
        <div className="unrec">
          <div className="icon" />
          <div className="name">{translate (staticData) ("showfrequency.unfamiliarspells")}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="recommended-ref">
      {orN (strongly)
        ? (
          <div className="strongly-recommended">
            <div className="icon" />
            <div className="name">
              {translate (staticData) ("showfrequency.stronglyrecommended")}
            </div>
          </div>
        )
        : null}
      <div className="rec">
        <div className="icon" />
        <div className="name">{translate (staticData) ("showfrequency.common")}</div>
      </div>
      <div className="unrec">
        <div className="icon" />
        <div className="name">{translate (staticData) ("showfrequency.uncommon")}</div>
      </div>
    </div>
  )
}
