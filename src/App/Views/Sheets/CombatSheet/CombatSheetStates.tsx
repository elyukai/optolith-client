import * as React from "react"
import { flength, List, map, splitAt, toArray } from "../../../../Data/List"
import { even } from "../../../../Data/Num"
import { Record } from "../../../../Data/Record"
import { fst, snd } from "../../../../Data/Tuple"
import { Condition } from "../../../Models/Wiki/Condition"
import { State } from "../../../Models/Wiki/State"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { translate } from "../../../Utilities/I18n"
import { toRoman } from "../../../Utilities/NumberUtils"
import { pipe_ } from "../../../Utilities/pipe"

interface Props {
  staticData: StaticDataRecord
  conditions: List<Record<Condition>>
  states: List<Record<State>>
}

export const CombatSheetStates: React.FC<Props> = props => {
  const { staticData, conditions, states } = props

  const len = flength (states)

  const statesSplit = splitAt (even (len) ? len : Math.floor (len / 2)) (states)

  return (
    <div className="status">
      <div className="status-tiers">
        <header>
          <h4>{translate (staticData) ("sheets.combatsheet.conditions")}</h4>
          <div>{toRoman (1)}</div>
          <div>{toRoman (2)}</div>
          <div>{toRoman (3)}</div>
          <div>{toRoman (4)}</div>
        </header>
        {pipe_ (
          conditions,
          map (e => (
            <div key={Condition.A.id (e)}>
              <span>{Condition.A.name (e)}</span>
              <div>
                <div />
              </div>
              <div>
                <div />
              </div>
              <div>
                <div />
              </div>
              <div>
                <div />
              </div>
            </div>
          )),
          toArray
        )}
      </div>
      <div className="status-effects">
        <header>
          <h4>{translate (staticData) ("sheets.combatsheet.states")}</h4>
        </header>
        {pipe_ (
          statesSplit,
          fst,
          map (e => (
            <div key={State.A.id (e)}>
              <span>{State.A.name (e)}</span>
              <div>
                <div />
              </div>
            </div>
          )),
          toArray
        )}
      </div>
      <div className="status-effects">
        {pipe_ (
          statesSplit,
          snd,
          map (e => (
            <div key={State.A.id (e)}>
              <span>{State.A.name (e)}</span>
              <div>
                <div />
              </div>
            </div>
          )),
          toArray
        )}
      </div>
    </div>
  )
}
