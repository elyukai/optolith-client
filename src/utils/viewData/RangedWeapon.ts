import { List } from '../structures/List';
import { Maybe, Nothing } from '../structures/Maybe';
import { fromDefault } from '../structures/Record';

export interface RangedWeapon {
  id: string
  name: string
  combatTechnique: string
  reloadTime: Maybe<number>
  damageDiceNumber: Maybe<number>
  damageDiceSides: Maybe<number>
  damageFlat: Maybe<number>
  at: number
  range: Maybe<List<number>>
  bf: number
  loss: Maybe<number>
  weight: Maybe<number>
  ammunition: Maybe<string>
}

const RangedWeapon =
  fromDefault<RangedWeapon> ({
    id: '',
    name: '',
    combatTechnique: '',
    reloadTime: Nothing,
    damageDiceNumber: Nothing,
    damageDiceSides: Nothing,
    damageFlat: Nothing,
    at: 0,
    range: Nothing,
    bf: 0,
    loss: Nothing,
    weight: Nothing,
    ammunition: Nothing,
  })
