import { DropdownOption } from '../components/Dropdown';
import { Just, List, Nothing, Record, Tuple } from './dataUtils';
import { getRoman } from './NumberUtils';

const getElements = (max: number) =>
  List.unfoldr<Record<DropdownOption>, number>
    (current => current > max
      ? Nothing ()
      : current === 0
      ? Just (
        Tuple.of<Record<DropdownOption>, number>
          (Record.of<DropdownOption> ({ name: '0' }))
          (current + 1)
      )
      : Just (
        Tuple.of<Record<DropdownOption>, number>
          (Record.of<DropdownOption> ({ id: current, name: getRoman (current) }))
          (current + 1)
      ));

export const getLevelElements = (max: number) => getElements (max) (1);

export const getLevelElementsWithZero = (max: number) => getElements (max) (0);
