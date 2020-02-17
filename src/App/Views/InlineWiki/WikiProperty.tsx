import * as React from "react"
import { L10nKey } from "../../Models/Wiki/L10n"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"

export interface WikiPropertyProps {
  children?: React.ReactNode
  staticData: StaticDataRecord
  title: L10nKey
}

export function WikiProperty (props: WikiPropertyProps) {
  const { children, staticData, title } = props

  return (
    <p>
      <span>
        {translate (staticData) (title)}
        {children !== null && children !== undefined ? ": " : null}
      </span>
      {children !== null && children !== undefined ? <span>{children}</span> : null}
    </p>
  )
}
