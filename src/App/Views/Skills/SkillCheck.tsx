import * as React from "react"
import { equals } from "../../../Data/Eq"
import { fmap } from "../../../Data/Functor"
import { find, List, toArray } from "../../../Data/List"
import { fromMaybe, imapMaybe, Maybe, normalize } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { AttributeCombined, AttributeCombinedA_ } from "../../Models/View/AttributeCombined"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { CheckModifier } from "../../Models/Wiki/wikiTypeHelpers"
import { minus } from "../../Utilities/Chars"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { getCheckModStr } from "../InlineWiki/Elements/WikiSkillCheck"

interface Props {
  attributes: List<Record<AttributeCombined>>
  check?: List<string>
  checkDisabled?: boolean
  checkmod?: Maybe<CheckModifier>
  staticData: StaticDataRecord
}

export const SkillCheck: React.FC<Props> = props => {
  const {
    attributes,
    check,
    checkDisabled,
    checkmod,
    staticData,
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
          normalize (checkmod),
          fmap (pipe (
            getCheckModStr (staticData),
            characteristic => (
              <div className="check mod">
                {minus}
                {characteristic}
              </div>
            )
          )),
          fromMaybe (null as React.ReactNode)
        )}
      </>
    )
  }

  return null
}
