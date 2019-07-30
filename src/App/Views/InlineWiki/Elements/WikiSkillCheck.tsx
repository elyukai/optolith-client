import * as React from "react";
import { thrush } from "../../../../Data/Function";
import { fmap, fmapF } from "../../../../Data/Functor";
import { intercalate, List, map, notNull } from "../../../../Data/List";
import { ensure, fromMaybe, mapMaybe, Maybe } from "../../../../Data/Maybe";
import { lookupF, OrderedMap } from "../../../../Data/OrderedMap";
import { OrderedSet, toList } from "../../../../Data/OrderedSet";
import { Record, RecordBase } from "../../../../Data/Record";
import { Attribute } from "../../../Models/Wiki/Attribute";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { CheckModifier } from "../../../Models/Wiki/wikiTypeHelpers";
import { localizeOrList, translate } from "../../../Utilities/I18n";
import { pipe, pipe_ } from "../../../Utilities/pipe";
import { renderMaybeWith } from "../../../Utilities/ReactUtils";
import { WikiProperty } from "../WikiProperty";

interface Accessors<A extends RecordBase> {
  check: (r: Record<A>) => List<string>
  checkmod?: (r: Record<A>) => OrderedSet<CheckModifier>
}

export interface WikiSkillCheckProps<A extends RecordBase> {
  attributes: OrderedMap<string, Record<Attribute>>
  x: Record<A>
  acc: Accessors<A>
  l10n: L10nRecord
}

export function WikiSkillCheck<A extends RecordBase> (props: WikiSkillCheckProps<A>) {
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

  const mod = map ((id: CheckModifier) =>
                    id === "SPI"
                      ? translate (l10n) ("spirit.short")
                      : id === "TOU" ? translate (l10n) ("toughness.short")
                        : translate (l10n) ("spirithalf.short"))
                  (fromMaybe (List<CheckModifier> ()) (checkmods))

  return (
    <WikiProperty l10n={l10n} title="check">
      {checkString}
      {renderMaybeWith (pipe (localizeOrList (l10n), str => `(+${str})`))
                       (ensure (notNull) (mod))}
    </WikiProperty>
  )
}
