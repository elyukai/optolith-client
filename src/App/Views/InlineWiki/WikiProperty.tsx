import * as React from "react";
import { L10n, L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";

export interface WikiPropertyProps {
  children?: React.ReactNode
  locale: L10nRecord
  title: keyof L10n
}

export function WikiProperty (props: WikiPropertyProps) {
  const { children, locale, title } = props

  return <p>
    <span>{translate (locale) (title)}</span>
    {children !== null && children !== undefined ? <span>{children}</span> : null}
  </p>
}
