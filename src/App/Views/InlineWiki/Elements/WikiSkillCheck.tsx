import * as React from "react";
import { fmap } from "../../../../Data/Functor";
import { intercalate, List } from "../../../../Data/List";
import { fromMaybe, join, liftM2, mapMaybe, Maybe } from "../../../../Data/Maybe";
import { lookup, lookupF, OrderedMap } from "../../../../Data/OrderedMap";
import { Record, RecordBase } from "../../../../Data/Record";
import { DerivedCharacteristic } from "../../../Models/View/DerivedCharacteristic";
import { Attribute } from "../../../Models/Wiki/Attribute";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { CheckModifier } from "../../../Models/Wiki/wikiTypeHelpers";
import { DCIds } from "../../../Selectors/derivedCharacteristicsSelectors";
import { pipe, pipe_ } from "../../../Utilities/pipe";
import { WikiProperty } from "../WikiProperty";

interface Accessors<A extends RecordBase> {
  check: (r: Record<A>) => List<string>
  checkmod: (r: Record<A>) => Maybe<CheckModifier>
}

export interface WikiSkillCheckProps<A extends RecordBase> {
  attributes: OrderedMap<string, Record<Attribute>>
  x: Record<A>
  acc: Accessors<A>
  derivedCharacteristics: Maybe<OrderedMap<DCIds, Record<DerivedCharacteristic>>>
  l10n: L10nRecord
}

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

  const mcheckmod = acc.checkmod (x)

  const mod =
    pipe_ (
      mderived_characteristics,
      liftM2 (lookup as lookup<DCIds, Record<DerivedCharacteristic>>) (mcheckmod),
      join,
      fmap (DerivedCharacteristic.A.short)
    )

  return (
    <WikiProperty l10n={l10n} title="check">
      {checkString}
      {fromMaybe ("") (mod)}
    </WikiProperty>
  )
}
