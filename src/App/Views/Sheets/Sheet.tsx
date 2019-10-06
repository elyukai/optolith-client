import * as React from "react";
import { List } from "../../../Data/List";
import { Record } from "../../../Data/Record";
import { AttributeCombined } from "../../Models/View/AttributeCombined";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { HeaderValue, SheetHeader } from "./SheetHeader";

export interface SheetProps {
  addHeaderInfo?: List<Record<HeaderValue>>
  attributes: List<Record<AttributeCombined>>
  id: string
  l10n: L10nRecord
  title: string
}

export const Sheet: React.FC<SheetProps> = props => {
  const { addHeaderInfo, attributes, children, id, l10n, title } = props

  return (
    <div className="sheet" id={id}>
      <SheetHeader
        title={title}
        add={addHeaderInfo}
        attributes={attributes}
        l10n={l10n}
        />
      {children}
    </div>
  )
}
