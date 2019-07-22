import * as React from "react";
import { equals } from "../../../Data/Eq";
import { fmap } from "../../../Data/Functor";
import { find, intercalate, List, toArray } from "../../../Data/List";
import { bind, ensure, fromMaybeR, imapMaybe, liftM2, mapMaybe, Maybe } from "../../../Data/Maybe";
import { gt } from "../../../Data/Num";
import { lookupF, OrderedMap } from "../../../Data/OrderedMap";
import { elems, OrderedSet, size } from "../../../Data/OrderedSet";
import { Record } from "../../../Data/Record";
import { AttributeCombined, AttributeCombinedA_ } from "../../Models/View/AttributeCombined";
import { DerivedCharacteristic } from "../../Models/View/DerivedCharacteristic";
import { CheckModifier } from "../../Models/Wiki/wikiTypeHelpers";
import { DCIds } from "../../Selectors/derivedCharacteristicsSelectors";
import { minus } from "../../Utilities/Chars";
import { pipe, pipe_ } from "../../Utilities/pipe";

export interface SkillCheckProps {
  attributes: List<Record<AttributeCombined>>
  check?: List<string>
  checkDisabled?: boolean
  checkmod?: OrderedSet<CheckModifier>
  derivedCharacteristics?: OrderedMap<DCIds, Record<DerivedCharacteristic>>
}

export function SkillCheck (props: SkillCheckProps) {
  const {
    attributes,
    check,
    checkDisabled,
    checkmod,
    derivedCharacteristics: derived,
  } = props

  if (checkDisabled !== true && check !== undefined) {
    return (
      <>
        {pipe_ (
          check,
          imapMaybe (index => id => pipe_ (
                                      attributes,
                                      find (pipe (AttributeCombinedA_.id, equals (id))),
                                      fmap (attr => (
                                        <div key={`${id}${index}`} className={`check ${id}`}>
                                          <span className="short">
                                            {AttributeCombinedA_.short (attr)}
                                          </span>
                                          <span className="value">
                                            {AttributeCombinedA_.value (attr)}
                                          </span>
                                        </div>
                                      ))
                                    )),
          toArray
        )}
        {pipe_ (
          liftM2 ((dcs: OrderedMap<DCIds, Record<DerivedCharacteristic<DCIds>>>) =>
                  (check_mod: OrderedSet<CheckModifier>) =>
                    pipe_ (
                      check_mod,
                      elems,
                      mapMaybe (pipe (lookupF (dcs), fmap (DerivedCharacteristic.A.short))),
                      intercalate ("/")
                    ))
                 (Maybe (derived))
                 (bind (Maybe (checkmod)) (ensure (pipe (size, gt (0))))),
          fmap (characteristic => <div className="check mod">{minus}{characteristic}</div>),
          fromMaybeR (null)
        )}
      </>
    )
  }

  return null
}
