import { Belongings } from '../../types/data';
import { Nothing } from '../structures/Maybe';
import { OrderedMap } from '../structures/OrderedMap';
import { fromDefault, makeGetters, makeLenses_ } from '../structures/Record';
import { PurseCreator } from './PurseCreator';

/**
 * Create a new `Belongings` object.
 */
export const BelongingsCreator =
  fromDefault<Belongings> ({
    items: OrderedMap.empty,
    itemInEditor: Nothing,
    isInItemCreation: false,
    armorZones: OrderedMap.empty,
    zoneArmorInEditor: Nothing,
    isInZoneArmorCreation: false,
    purse: PurseCreator ({ }),
  })

export const BelongingsG = makeGetters (BelongingsCreator)
export const BelongingsL = makeLenses_ (BelongingsG) (BelongingsCreator)
