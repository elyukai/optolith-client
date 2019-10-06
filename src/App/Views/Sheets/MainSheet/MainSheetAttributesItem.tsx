import * as React from "react";
import { fmap } from "../../../../Data/Functor";
import { imap, List, toArray } from "../../../../Data/List";
import { fromMaybe, guardReplace, isNothing, Just, Maybe, maybeRNull, or } from "../../../../Data/Maybe";
import { ndash } from "../../../Utilities/Chars";
import { classListMaybe } from "../../../Utilities/CSS";
import { pipe, pipe_ } from "../../../Utilities/pipe";
import { renderMaybeWith } from "../../../Utilities/ReactUtils";

export interface MainSheetAttributesItemProps {
  add: Maybe<number>
  calc: string
  empty: Maybe<boolean>
  label: string
  base: Maybe<number>
  max: Maybe<number>
  purchased: Maybe<number>
  subArray: Maybe<List<number>>
  subLabel: Maybe<string>
}

export function MainSheetAttributesItem (props: MainSheetAttributesItemProps) {
  const {
    add,
    base,
    calc,
    empty,
    label,
    purchased,
    max,
    subArray: maybeSubList,
    subLabel,
  } = props

  return (
    <div>
      <div className="label">
        <h3>{label}</h3>
        <span className="calc">{calc}</span>
        {maybeRNull ((str: string) => <span className="sub">{str}:</span>) (subLabel)}
      </div>
      <div className="values">
        <div className="base">
          {or (empty) ? ndash : fromMaybe<string | number> (ndash) (base)}
        </div>
        <div className="add">
          {or (empty) ? ndash : Maybe.sum (add)}
        </div>
        <div
          className={classListMaybe (List (
            guardReplace (isNothing (purchased)) ("blocked"),
            Just ("purchased")
          ))}
          >
          {renderMaybeWith ((num: number) => or (empty) ? ndash : num) (purchased)}
        </div>
        <div className="max">
          {or (empty) ? ndash : Maybe.sum (max)}
        </div>
        {pipe_ (
          maybeSubList,
          fmap (pipe (
            imap (i => x => (
              <div key={`${label}${i}`} className="sub">
                {or (empty) ? ndash : x}
              </div>
            )),
            toArray
          )),
          fromMaybe (null as React.ReactNode)
        )}
      </div>
    </div>
  )
}
