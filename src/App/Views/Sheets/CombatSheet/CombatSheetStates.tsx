import * as React from 'react';
import { translate, UIMessagesObject } from '../../../App/Utils/I18n';
import { List, Record, Tuple } from '../../../utils/dataUtils';
import { sortObjects } from '../../../utils/FilterSortUtils';

export interface CombatSheetStatesProps {
  locale: UIMessagesObject;
}

export function CombatSheetStates ({ locale }: CombatSheetStatesProps) {
  const conditions = sortObjects (
    List.of (
      Record.of ({
        id: 1,
        name: translate (locale, 'charactersheet.combat.conditionsstates.conditions.animosity'),
      }),
      Record.of ({
        id: 2,
        name: translate (locale, 'charactersheet.combat.conditionsstates.conditions.encumbrance'),
      }),
      Record.of ({
        id: 3,
        name: translate (locale, 'charactersheet.combat.conditionsstates.conditions.intoxicated'),
      }),
      Record.of ({
        id: 4,
        name: translate (locale, 'charactersheet.combat.conditionsstates.conditions.stupor'),
      }),
      Record.of ({
        id: 5,
        name: translate (locale, 'charactersheet.combat.conditionsstates.conditions.rapture'),
      }),
      Record.of ({
        id: 6,
        name: translate (locale, 'charactersheet.combat.conditionsstates.conditions.fear'),
      }),
      Record.of ({
        id: 7,
        name: translate (locale, 'charactersheet.combat.conditionsstates.conditions.paralysis'),
      }),
      Record.of ({
        id: 8,
        name: translate (locale, 'charactersheet.combat.conditionsstates.conditions.pain'),
      }),
      Record.of ({
        id: 9,
        name: translate (locale, 'charactersheet.combat.conditionsstates.conditions.confusion'),
      })
    ),
    locale .get ('id')
  );

  const statesSecond = sortObjects (
    List.of (
      Record.of ({
        id: 1,
        name: translate (locale, 'charactersheet.combat.conditionsstates.states.immobilized'),
      }),
      Record.of ({
        id: 2,
        name: translate (locale, 'charactersheet.combat.conditionsstates.states.unconscious'),
      }),
      Record.of ({
        id: 3,
        name: translate (locale, 'charactersheet.combat.conditionsstates.states.blind'),
      }),
      Record.of ({
        id: 4,
        name: translate (locale, 'charactersheet.combat.conditionsstates.states.bloodlust'),
      }),
      Record.of ({
        id: 5,
        name: translate (locale, 'charactersheet.combat.conditionsstates.states.burning'),
      }),
      Record.of ({
        id: 6,
        name: translate (locale, 'charactersheet.combat.conditionsstates.states.cramped'),
      }),
      Record.of ({
        id: 7,
        name: translate (locale, 'charactersheet.combat.conditionsstates.states.bound'),
      }),
      Record.of ({
        id: 8,
        name: translate (locale, 'charactersheet.combat.conditionsstates.states.incapacitated'),
      }),
      Record.of ({
        id: 9,
        name: translate (locale, 'charactersheet.combat.conditionsstates.states.diseased'),
      }),
      Record.of ({
        id: 10,
        name: translate (locale, 'charactersheet.combat.conditionsstates.states.prone'),
      }),
      Record.of ({
        id: 11,
        name: translate (locale, 'charactersheet.combat.conditionsstates.states.misfortune'),
      }),
      Record.of ({
        id: 12,
        name: translate (locale, 'charactersheet.combat.conditionsstates.states.rage'),
      }),
      Record.of ({
        id: 13,
        name: translate (locale, 'charactersheet.combat.conditionsstates.states.mute'),
      }),
      Record.of ({
        id: 14,
        name: translate (locale, 'charactersheet.combat.conditionsstates.states.deaf'),
      }),
      Record.of ({
        id: 15,
        name: translate (locale, 'charactersheet.combat.conditionsstates.states.surprised'),
      }),
      Record.of ({
        id: 16,
        name: translate (locale, 'charactersheet.combat.conditionsstates.states.badsmell'),
      }),
      Record.of ({
        id: 17,
        name: translate (locale, 'charactersheet.combat.conditionsstates.states.invisible'),
      }),
      Record.of ({
        id: 18,
        name: translate (locale, 'charactersheet.combat.conditionsstates.states.poisoned'),
      }),
      Record.of ({
        id: 19,
        name: translate (locale, 'charactersheet.combat.conditionsstates.states.petrified'),
      })
    ),
    locale .get ('id')
  );

  const statesSplit = List.splitAt<Record<{ id: number; name: string }>> (9) (statesSecond);

  return (
    <div className="status">
      <div className="status-tiers">
        <header>
          <h4>{translate (locale, 'charactersheet.combat.conditionsstates.conditions')}</h4>
          <div>I</div>
          <div>II</div>
          <div>III</div>
          <div>IV</div>
        </header>
        {conditions.map (e => (
          <div key={e .get ('id')}>
            <span>{e .get ('name')}</span>
            <div>
              <div></div>
            </div>
            <div>
              <div></div>
            </div>
            <div>
              <div></div>
            </div>
            <div>
              <div></div>
            </div>
          </div>
        ))}
      </div>
      <div className="status-effects">
        <header>
          <h4>{translate (locale, 'charactersheet.combat.conditionsstates.states')}</h4>
        </header>
        {Tuple.fst (statesSplit) .map (e => (
          <div key={e .get ('id')}>
            <span>{e .get ('name')}</span>
            <div>
              <div></div>
            </div>
          </div>
        ))}
      </div>
      <div className="status-effects">
        {Tuple.snd (statesSplit) .map (e => (
          <div key={e .get ('id')}>
            <span>{e .get ('name')}</span>
            <div>
              <div></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
