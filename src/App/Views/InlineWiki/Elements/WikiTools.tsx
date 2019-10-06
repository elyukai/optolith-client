import * as React from "react";
import { Maybe, maybe } from "../../../../Data/Maybe";
import { Record, RecordIBase } from "../../../../Data/Record";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { translate } from "../../../Utilities/I18n";
import { ReactReturn } from "../../../Utilities/ReactUtils";
import { Markdown } from "../../Universal/Markdown";

interface Accessors<A extends RecordIBase<any>> {
  tools: (r: Record<A>) => Maybe<string>
}

export interface WikiToolsProps<A extends RecordIBase<any>> {
  x: Record<A>
  acc: Accessors<A>
  l10n: L10nRecord
}

export const WikiTools = <A extends RecordIBase<any>> (props: WikiToolsProps<A>): ReactReturn => {
  const {
    x,
    acc,
    l10n,
  } = props

  return maybe (null as ReactReturn)
               ((tools: string) => (
                 <Markdown source={`**${translate (l10n) ("tools")}:** ${tools}`} />
               ))
               (acc.tools (x))
}
