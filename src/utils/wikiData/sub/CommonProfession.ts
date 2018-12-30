import { List } from '../../structures/List';
import { fromDefault } from '../../structures/Record';

export interface CommonProfession {
  list: List<string | number>
  reverse: boolean
}

export const CommonProfession =
  fromDefault<CommonProfession> ({
    list: List.empty,
    reverse: false,
  })
