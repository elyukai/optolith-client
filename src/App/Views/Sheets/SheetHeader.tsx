import * as React from "react";
import { append, List, map, toArray } from "../../../Data/List";
import { Just, Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault, Record } from "../../../Data/Record";
import { AttributeCombined, AttributeCombinedA_ } from "../../Models/View/AttributeCombined";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { pipe_ } from "../../Utilities/pipe";
import { SheetHeaderAttribute } from "./SheetHeaderAttribute";

export interface HeaderValue {
  "@@name": "HeaderValue"
  id: string
  short: string
  value: Maybe<number | string>
}

export const HeaderValue =
  fromDefault ("HeaderValue") <HeaderValue> ({
                id: "",
                short: "",
                value: Nothing,
              })

export interface SheetHeaderProps {
  add?: List<Record<HeaderValue>>
  attributes: List<Record<AttributeCombined>>
  l10n: L10nRecord
  title: string
}

export function SheetHeader (props: SheetHeaderProps) {
  const { add = List<Record<HeaderValue>> (), attributes, l10n, title } = props

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
        <h1>{translate (l10n) ("charactersheet")}</h1>
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
