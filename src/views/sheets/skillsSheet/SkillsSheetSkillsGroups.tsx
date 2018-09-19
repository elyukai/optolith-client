import * as React from 'react';
import { AttributeCombined } from '../../../types/view';
import { List, Maybe, Record } from '../../../utils/dataUtils';
import { translate, UIMessagesObject } from '../../../utils/I18n';

export const iterateGroupHeaders = (attributes: List<Record<AttributeCombined>>) =>
  (checkAttributeValueVisibility: boolean) =>
    (locale: UIMessagesObject) => {
      const groupChecksIds = List.of (
        List.of ('ATTR_1', 'ATTR_6', 'ATTR_8'),
        List.of ('ATTR_3', 'ATTR_4', 'ATTR_4'),
        List.of ('ATTR_1', 'ATTR_6', 'ATTR_7'),
        List.of ('ATTR_2', 'ATTR_2', 'ATTR_3'),
        List.of ('ATTR_5', 'ATTR_5', 'ATTR_7')
      );

      const groupNameKeys = List.of (
        'physical',
        'social',
        'nature',
        'knowledge',
        'craft'
      );

      return groupChecksIds
        .imap (index => attibuteIds => {
          const check = attibuteIds
            .map (id => {
              const attribute = attributes .find (e => e .get ('id') === id);

              return checkAttributeValueVisibility
                ? Maybe.fromMaybe (0)
                                  (attribute .fmap (
                                    Record.get<AttributeCombined, 'value'> ('value')
                                  ))
                : Maybe.fromMaybe ('')
                                  (attribute .fmap (
                                    Record.get<AttributeCombined, 'short'> ('short')
                                  ));
            })
            .intercalate ('/');

          return (
            <tr className="group">
              <td className="name">
                {Maybe.fromMaybe
                  ('')
                  (groupNameKeys
                    .subscript (index)
                    .fmap (
                      key => translate (
                        locale,
                        `charactersheet.gamestats.skills.subheaders.${key}` as
                          'charactersheet.gamestats.skills.subheaders.physical'
                      )
                    ))}
              </td>
              <td className="check">{check}</td>
              <td className="enc"></td>
              <td className="ic"></td>
              <td className="sr"></td>
              <td className="routine"></td>
              <td className="comment">
                {Maybe.fromMaybe
                  ('')
                  (groupNameKeys
                    .subscript (index)
                    .fmap (
                      key => translate (
                        locale,
                        `charactersheet.gamestats.skills.subheaders.${key}pages` as
                          'charactersheet.gamestats.skills.subheaders.physicalpages'
                      )
                    ))}
              </td>
            </tr>
          );
        });
    };
