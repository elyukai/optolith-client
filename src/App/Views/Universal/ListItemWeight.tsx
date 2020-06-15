import * as React from "react"
import { Maybe, maybe } from "../../../Data/Maybe"
import { ndash } from "../../Utilities/Chars.bs"
import { pipe } from "../../Utilities/pipe"
import { localizeSize, localizeNumber } from "../../Utilities/I18n"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"

interface Props {
  weight: Maybe<number>
  small?: boolean
  staticData: StaticDataRecord
}

export const ListItemWeight: React.FC<Props> = props => {
  const { weight, staticData } = props

  const content = maybe (ndash)
                        (pipe (localizeSize (staticData), localizeNumber (staticData)))
                        (weight)

  return (
    <div className="weight">
      {content}
    </div>
  )
}
