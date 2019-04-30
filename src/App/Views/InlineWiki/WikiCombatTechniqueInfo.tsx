import * as React from "react";
import { Attribute, Book, CombatTechnique } from "../../Models/Wiki/wikiTypeHelpers";
import { getICName } from "../../Utilities/AdventurePoints/improvementCostUtils";
import { translate, UIMessages } from "../../Utilities/I18n";
import { Markdown } from "../Universal/Markdown";
import { WikiSource } from "./Elements/WikiSource";
import { WikiBoxTemplate } from "./WikiBoxTemplate";
import { WikiProperty } from "./WikiProperty";

export interface WikiCombatTechniqueInfoProps {
  attributes: Map<string, Attribute>
  books: Map<string, Book>
  currentObject: CombatTechnique
  locale: UIMessages
  sex: "m" | "f" | undefined
}

export function WikiCombatTechniqueInfo(props: WikiCombatTechniqueInfoProps) {
  const { attributes, currentObject, locale } = props

  if (["nl-BE"].includes(locale.id)) {
    return (
      <WikiBoxTemplate className="combattechnique" title={currentObject.name}>
        <WikiProperty l10n={locale} title="primaryattribute.long">{currentObject.primary.map(e => attributes.has(e) ? attributes.get(e)!.name : "...").intercalate("/")}</WikiProperty>
        <WikiProperty l10n={locale} title="info.improvementcost">{getICName(currentObject.ic)}</WikiProperty>
      </WikiBoxTemplate>
    )
  }

  return (
    <WikiBoxTemplate className="combattechnique" title={currentObject.name}>
      {currentObject.special && <Markdown source={`**${translate(locale, "info.special")}:** ${currentObject.special}`} />}
      <WikiProperty l10n={locale} title="primaryattribute.long">{currentObject.primary.map(e => attributes.has(e) ? attributes.get(e)!.name : "...").intercalate("/")}</WikiProperty>
      <WikiProperty l10n={locale} title="info.improvementcost">{getICName(currentObject.ic)}</WikiProperty>
      <WikiSource {...props} />
    </WikiBoxTemplate>
  )
}
