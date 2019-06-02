import * as React from "react";
import { L10n, L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";

export interface WikiPropertyProps {
  children?: React.ReactNode
  l10n: L10nRecord
  title: keyof L10n
}

export function WikiProperty (props: WikiPropertyProps) {
  const { children, l10n, title } = props

  return <p>
    <span>{translate (l10n) (title)}</span>
    {children !== null && children !== undefined ? <span>{children}</span> : null}
  </p>
}
