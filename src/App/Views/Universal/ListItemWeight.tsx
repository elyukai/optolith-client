import * as React from "react"
import { Maybe, maybe } from "../../../Data/Maybe"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { ndash } from "../../Utilities/Chars"
import { localizeNumber, localizeWeight } from "../../Utilities/I18n"
import { pipe } from "../../Utilities/pipe"

interface Props {
  weight: Maybe<number>
  staticData: StaticDataRecord
}

export const ListItemWeight: React.FC<Props> = props => {
  const { weight, staticData } = props

  const content = maybe (ndash)
                        (pipe (localizeWeight (staticData), localizeNumber (staticData)))
                        (weight)

  return (
    <div className="weight">
      {content}
    </div>
  )
}
