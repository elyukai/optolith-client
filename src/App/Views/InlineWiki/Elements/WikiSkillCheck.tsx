import * as React from "react";
import { thrush } from "../../../../Data/Function";
import { fmap, fmapF } from "../../../../Data/Functor";
import { intercalate, List, map, notNull } from "../../../../Data/List";
import { ensure, fromMaybe, mapMaybe, Maybe } from "../../../../Data/Maybe";
import { lookupF, OrderedMap } from "../../../../Data/OrderedMap";
import { OrderedSet, toList } from "../../../../Data/OrderedSet";
import { Record, RecordIBase } from "../../../../Data/Record";
import { Attribute } from "../../../Models/Wiki/Attribute";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { CheckModifier } from "../../../Models/Wiki/wikiTypeHelpers";
import { minus } from "../../../Utilities/Chars";
import { localizeOrList, translate } from "../../../Utilities/I18n";
import { pipe, pipe_ } from "../../../Utilities/pipe";
import { renderMaybeWith } from "../../../Utilities/ReactUtils";
import { WikiProperty } from "../WikiProperty";

interface Accessors<A extends RecordIBase<any>> {
  check: (r: Record<A>) => List<string>
  checkmod?: (r: Record<A>) => OrderedSet<CheckModifier>
}

export interface WikiSkillCheckProps<A extends RecordIBase<any>> {
  attributes: OrderedMap<string, Record<Attribute>>
  x: Record<A>
  acc: Accessors<A>
  l10n: L10nRecord
}

export function WikiSkillCheck<A extends RecordIBase<any>> (props: WikiSkillCheckProps<A>) {
  const {
    attributes,
    x,
    acc,
    l10n,
  } = props

  const checkString =
    pipe_ (
      x,
      acc.check,
      mapMaybe (pipe (lookupF (attributes), fmap (Attribute.A.short))),
      intercalate ("/")
    )

  const checkmods = fmapF (Maybe (acc.checkmod)) (pipe (thrush (x), toList))

  const mod = map (getCheckModStr (l10n))
                  (fromMaybe (List<CheckModifier> ()) (checkmods))

  return (
    <WikiProperty l10n={l10n} title="check">
      {checkString}
      {renderMaybeWith (pipe (localizeOrList (l10n), str => `(${minus}${str})`))
                       (ensure (notNull) (mod))}
    </WikiProperty>
  )
}

export const getCheckModStr = (l10n: L10nRecord) =>
                              (id: CheckModifier) => id === "SPI"
                                                     ? translate (l10n) ("spirit.short")
                                                     : id === "TOU"
                                                     ? translate (l10n) ("toughness.short")
                                                     : translate (l10n) ("spirithalf.short")
