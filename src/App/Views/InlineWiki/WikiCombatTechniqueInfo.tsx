import * as React from "react";
import { fmap } from "../../../Data/Functor";
import { intercalate } from "../../../Data/List";
import { mapMaybe, Maybe, maybeRNullF } from "../../../Data/Maybe";
import { lookupF, OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { Sex } from "../../Models/Hero/heroTypeHelpers";
import { Attribute } from "../../Models/Wiki/Attribute";
import { Book } from "../../Models/Wiki/Book";
import { CombatTechnique } from "../../Models/Wiki/CombatTechnique";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { getICName } from "../../Utilities/AdventurePoints/improvementCostUtils";
import { translate } from "../../Utilities/I18n";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { Markdown } from "../Universal/Markdown";
import { WikiSource } from "./Elements/WikiSource";
import { WikiBoxTemplate } from "./WikiBoxTemplate";
import { WikiProperty } from "./WikiProperty";

export interface WikiCombatTechniqueInfoProps {
  attributes: OrderedMap<string, Record<Attribute>>
  books: OrderedMap<string, Record<Book>>
  x: Record<CombatTechnique>
  l10n: L10nRecord
  sex: Maybe<Sex>
}

const CTA = CombatTechnique.A

export function WikiCombatTechniqueInfo (props: WikiCombatTechniqueInfoProps) {
  const { attributes, x, l10n, books } = props

  return (
    <WikiBoxTemplate className="combattechnique" title={CTA.name (x)}>
      {maybeRNullF (CTA.special (x))
                   (str => (
                     <Markdown source={`**${translate (l10n) ("special")}:** ${str}`} />
                   ))}
      <WikiProperty l10n={l10n} title="primaryattribute">
        {pipe_ (
          x,
          CTA.primary,
          mapMaybe (pipe (lookupF (attributes), fmap (Attribute.A.name))),
          intercalate ("/")
        )}
      </WikiProperty>
      <WikiProperty l10n={l10n} title="improvementcost">{getICName (CTA.ic (x))}</WikiProperty>
      <WikiSource
        books={books}
        x={x}
        l10n={l10n}
        acc={CTA}
        />
    </WikiBoxTemplate>
  )
}
