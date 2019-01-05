import * as R from 'ramda';
import * as React from 'react';
import { AttributeCombined, CombatTechniqueWithAttackParryBase } from '../../../App/Models/View/viewTypeHelpers';
import { TextBox } from '../../../components/TextBox';
import { getICName } from '../../../utils/adventurePoints/improvementCostUtils';
import { List, Maybe, Record } from '../../../utils/dataUtils';
import { sortObjects } from '../../../utils/FilterSortUtils';
import { translate, UIMessagesObject } from '../../../utils/I18n';

export interface CombatSheetTechniquesProps {
  attributes: List<Record<AttributeCombined>>;
  combatTechniques: Maybe<List<Record<CombatTechniqueWithAttackParryBase>>>;
  locale: UIMessagesObject;
}

export function CombatSheetTechniques (props: CombatSheetTechniquesProps) {
  const { attributes, combatTechniques: maybeCombatTechniques, locale } = props;

  return (
    <TextBox
      className="combat-techniques"
      label={translate (locale, 'charactersheet.combat.combattechniques.title')}
      >
      <table>
        <thead>
          <tr>
            <th className="name">
              {translate (locale, 'charactersheet.combat.combattechniques.headers.name')}
            </th>
            <th className="primary">
              {translate (
                locale,
                'charactersheet.combat.combattechniques.headers.primaryattribute'
              )}
            </th>
            <th className="ic">
              {translate (locale, 'charactersheet.combat.combattechniques.headers.ic')}
            </th>
            <th className="value">
              {translate (locale, 'charactersheet.combat.combattechniques.headers.ctr')}
            </th>
            <th className="at">
              {translate (locale, 'charactersheet.combat.combattechniques.headers.atrc')}
            </th>
            <th className="pa">
              {translate (locale, 'charactersheet.combat.combattechniques.headers.pa')}
            </th>
          </tr>
        </thead>
        <tbody>
          {
            Maybe.fromMaybe<NonNullable<React.ReactNode>>
              (<></>)
              (maybeCombatTechniques .fmap (
                combatTechniques => sortObjects (combatTechniques, locale .get ('id'))
                  .map (e => (
                    <tr key={e .get ('id')}>
                      <td className="name">{e .get ('name')}</td>
                      <td className="primary">
                        {Maybe.mapMaybe<string, string>
                          (R.pipe (
                            id => attributes .find (attr => attr .get ('id') === id),
                            Maybe.fmap (Record.get<AttributeCombined, 'short'> ('short'))
                          ))
                          (e .get ('primary'))
                          .intercalate ('/')}
                      </td>
                      <td className="ic">{getICName (e .get ('ic'))}</td>
                      <td className="value">{e .get ('value')}</td>
                      <td className="at">{e .get ('at')}</td>
                      <td className="pa">
                        {Maybe.fromMaybe<string | number> ('-') (e .lookup ('pa'))}
                      </td>
                    </tr>
                  ))
                  .toArray ()
              ))
          }
        </tbody>
      </table>
    </TextBox>
  );
}
