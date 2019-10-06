import * as React from "react";
import { equals } from "../../../Data/Eq";
import { fmap } from "../../../Data/Functor";
import { find, intercalate, List, map, toArray } from "../../../Data/List";
import { bindF, ensure, fromMaybe, imapMaybe, Maybe } from "../../../Data/Maybe";
import { gt } from "../../../Data/Num";
import { elems, OrderedSet, size } from "../../../Data/OrderedSet";
import { Record } from "../../../Data/Record";
import { AttributeCombined, AttributeCombinedA_ } from "../../Models/View/AttributeCombined";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { CheckModifier } from "../../Models/Wiki/wikiTypeHelpers";
import { minus } from "../../Utilities/Chars";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { getCheckModStr } from "../InlineWiki/Elements/WikiSkillCheck";

export interface SkillCheckProps {
  attributes: List<Record<AttributeCombined>>
  check?: List<string>
  checkDisabled?: boolean
  checkmod?: OrderedSet<CheckModifier>
  l10n: L10nRecord
}

export function SkillCheck (props: SkillCheckProps) {
  const {
    attributes,
    check,
    checkDisabled,
    checkmod,
    l10n,
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
          Maybe (checkmod),
          bindF (ensure (pipe (size, gt (0)))),
          fmap (pipe (
            elems,
            map (getCheckModStr (l10n)),
            intercalate ("/"),
            characteristic => <div className="check mod">{minus}{characteristic}</div>
          )),
          fromMaybe (null as React.ReactNode)
        )}
      </>
    )
  }

  return null
}
