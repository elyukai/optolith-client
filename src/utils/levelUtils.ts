import { DropdownOption, DropdownOptionCreator } from '../components/Dropdown';
import { toRoman } from './NumberUtils';
import { List } from './structures/List';
import { Just, Nothing } from './structures/Maybe';
import { fromBoth } from './structures/Pair';
import { Record } from './structures/Record';

const getElements = (max: number) =>
  List.unfoldr<Record<DropdownOption>, number>
    (current => current > max
      ? Nothing
      : current === 0
      ? Just (
        fromBoth<Record<DropdownOption>, number>
          (DropdownOptionCreator ({ name: '0' }))
          (current + 1)
      )
      : Just (
        fromBoth<Record<DropdownOption>, number>
          (DropdownOptionCreator ({ id: Just (current), name: toRoman (current) }))
          (current + 1)
      ))

export const getLevelElements = (max: number) => getElements (max) (1)

export const getLevelElementsWithZero = (max: number) => getElements (max) (0)
