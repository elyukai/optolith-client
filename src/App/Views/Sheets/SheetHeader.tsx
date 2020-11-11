import * as React from "react"
import { append, List, map, toArray } from "../../../Data/List"
import { Just, Maybe, Nothing } from "../../../Data/Maybe"
import { fromDefault, Record } from "../../../Data/Record"
import { AttributeCombined, AttributeCombinedA_ } from "../../Models/View/AttributeCombined"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { pipe_ } from "../../Utilities/pipe"
import { SheetHeaderAttribute } from "./SheetHeaderAttribute"

export interface HeaderValue {
  "@@name": "HeaderValue"
  id: string
  short: string
  value: Maybe<number | string>
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const HeaderValue =
  fromDefault ("HeaderValue") <HeaderValue> ({
                id: "",
                short: "",
                value: Nothing,
              })

interface Props {
  add?: List<Record<HeaderValue>>
  attributes: List<Record<AttributeCombined>>
  staticData: StaticDataRecord
  title: string
}

export const SheetHeader: React.FC<Props> = props => {
  const { add = List<Record<HeaderValue>> (), attributes, staticData, title } = props

  const list: List<Record<HeaderValue>> =
    append (map ((attr: Record<AttributeCombined>) =>
                  HeaderValue ({
                    id: AttributeCombinedA_.id (attr),
                    short: AttributeCombinedA_.short (attr),
                    value: Just (AttributeCombinedA_.value (attr)),
                  }))
                (attributes))
           (add)

  return (
    <div className="sheet-header">
      <div className="sheet-title">
        <h1>{translate (staticData) ("sheets.charactersheet")}</h1>
        <p>{title}</p>
        <img src="images/icon.svg" alt="" />
      </div>
      <div className="sheet-attributes">
        {pipe_ (
          list,
          map (attr => (
                <SheetHeaderAttribute
                  key={HeaderValue.A.id (attr)}
                  id={HeaderValue.A.id (attr)}
                  label={HeaderValue.A.short (attr)}
                  value={HeaderValue.A.value (attr)}
                  />
              )),
          toArray
        )}
      </div>
    </div>
  )
}
