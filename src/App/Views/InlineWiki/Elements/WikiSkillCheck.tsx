import * as React from "react";
import { fmap, fmapF } from "../../../../Data/Functor";
import { intercalate, List } from "../../../../Data/List";
import { mapMaybe, Maybe } from "../../../../Data/Maybe";
import { lookupF, OrderedMap } from "../../../../Data/OrderedMap";
import { OrderedSet, toList } from "../../../../Data/OrderedSet";
import { Record, RecordBase } from "../../../../Data/Record";
import { DerivedCharacteristic } from "../../../Models/View/DerivedCharacteristic";
import { Attribute } from "../../../Models/Wiki/Attribute";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { CheckModifier } from "../../../Models/Wiki/wikiTypeHelpers";
import { DCIds } from "../../../Selectors/derivedCharacteristicsSelectors";
import { pipe, pipe_ } from "../../../Utilities/pipe";
import { renderMaybeWith } from "../../../Utilities/ReactUtils";
import { WikiProperty } from "../WikiProperty";

interface Accessors<A extends RecordBase> {
  check: (r: Record<A>) => List<string>
  checkmod: (r: Record<A>) => OrderedSet<CheckModifier>
}

export interface WikiSkillCheckProps<A extends RecordBase> {
  attributes: OrderedMap<string, Record<Attribute>>
  x: Record<A>
  acc: Accessors<A>
  derivedCharacteristics: Maybe<OrderedMap<DCIds, Record<DerivedCharacteristic>>>
  l10n: L10nRecord
}

const DCA = DerivedCharacteristic.A

export function WikiSkillCheck<A extends RecordBase> (props: WikiSkillCheckProps<A>) {
  const {
    attributes,
    x,
    acc,
    derivedCharacteristics: mderived_characteristics,
    l10n,
  } = props

  const checkString =
    pipe_ (
      x,
      acc.check,
      mapMaybe (pipe (lookupF (attributes), fmap (Attribute.A.short))),
      intercalate ("/")
    )

  const checkmods = acc.checkmod (x)

  const mod = fmapF (mderived_characteristics)
                    (dc => mapMaybe (pipe (lookupF (dc), fmap (DCA.short)))
                                    (toList (checkmods)))

  return (
    <WikiProperty l10n={l10n} title="check">
      {checkString}
      {renderMaybeWith (intercalate ("/")) (mod)}
    </WikiProperty>
  )
}
