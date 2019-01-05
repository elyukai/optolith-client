import * as R from 'ramda';
import { AttributeCombined } from '../App/Models/View/viewTypeHelpers';
import { List, Maybe, Record } from './dataUtils';

/**
 * If `attributeValueVisibility` is `True`, this function returns a string of
 * attribute values based on the passed id list, separated by "/".
 *
 * If `attributeValueVisibility` is `False`, this function returns a string of
 * attribute abbreviations based on the passed id list, separated by "/".
 */
export const getAttributeStringByIdList = (attributeValueVisibility: boolean) =>
  (attributes: List<Record<AttributeCombined>>) =>
    R.pipe (
      List.map<string, string | number> (
        id => {
          const attribute = attributes .find (attr => attr .get ('id') === id);

          return attributeValueVisibility
            ? Maybe.fromMaybe
              (0)
              (attribute .fmap (Record.get<AttributeCombined, 'value'> ('value')))
            : Maybe.fromMaybe
              ('')
              (attribute .fmap (Record.get<AttributeCombined, 'short'> ('short')));
        }
      ),
      List.intercalate ('/')
    );
