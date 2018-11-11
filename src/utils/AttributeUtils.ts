import * as Data from '../types/data';
import * as Wiki from '../types/wiki';
import { Maybe, OrderedMap, Record } from './dataUtils';

export const getSkillCheckValues =
  (attributes: OrderedMap<string, Record<Data.AttributeDependent>>) => Maybe.mapMaybe (
    (id: string) => attributes .lookup (id) .fmap (e => e.get ('value'))
  );

export function convertId<T extends string | undefined> (id: T): T {
  switch (id) {
    case 'COU':
      return 'ATTR_1' as T;
    case 'SGC':
      return 'ATTR_2' as T;
    case 'INT':
      return 'ATTR_3' as T;
    case 'CHA':
      return 'ATTR_4' as T;
    case 'DEX':
      return 'ATTR_5' as T;
    case 'AGI':
      return 'ATTR_6' as T;
    case 'CON':
      return 'ATTR_7' as T;
    case 'STR':
      return 'ATTR_8' as T;

    default:
      return id;
  }
}

export const getAbbreviation = Record.get<Wiki.Attribute, 'short'> ('short');

export const getAttributeValueWithDefault =
  Maybe.maybe<Record<Data.AttributeDependent>, number> (8) (attribute => attribute .get ('value'));
