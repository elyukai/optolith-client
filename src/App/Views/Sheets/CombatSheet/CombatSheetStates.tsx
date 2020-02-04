import * as React from "react";
import { List, map, splitAt, toArray } from "../../../../Data/List";
import { Record } from "../../../../Data/Record";
import { fst, snd } from "../../../../Data/Tuple";
import { NumIdName } from "../../../Models/NumIdName";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { translate } from "../../../Utilities/I18n";
import { toRoman } from "../../../Utilities/NumberUtils";
import { pipe_ } from "../../../Utilities/pipe";

interface Props {
  l10n: L10nRecord
  conditions: List<Record<NumIdName>>
  states: List<Record<NumIdName>>
}

export const CombatSheetStates: React.FC<Props> = props => {
  const { l10n, conditions, states } = props

  const statesSplit = splitAt (9) (states)

  return (
    <div className="status">
      <div className="status-tiers">
        <header>
          <h4>{translate (l10n) ("conditions")}</h4>
          <div>{toRoman (1)}</div>
          <div>{toRoman (2)}</div>
          <div>{toRoman (3)}</div>
          <div>{toRoman (4)}</div>
        </header>
        {pipe_ (
          conditions,
          map (e => (
            <div key={NumIdName.A.id (e)}>
              <span>{NumIdName.A.name (e)}</span>
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
          <h4>{translate (l10n) ("states")}</h4>
        </header>
        {pipe_ (
          statesSplit,
          fst,
          map (e => (
            <div key={NumIdName.A.id (e)}>
              <span>{NumIdName.A.name (e)}</span>
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
            <div key={NumIdName.A.id (e)}>
              <span>{NumIdName.A.name (e)}</span>
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
