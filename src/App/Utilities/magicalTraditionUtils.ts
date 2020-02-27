import { ident } from "../../Data/Function"
import { consF, List } from "../../Data/List"
import { foldr } from "../../Data/OrderedMap"
import { Record } from "../../Data/Record"
import { MagicalTradition } from "../Models/Wiki/MagicalTradition"
import { StaticData } from "../Models/Wiki/WikiModel"
import { pipe, pipe_ } from "../Utilities/pipe"

const SDA = StaticData.A
const MTA = MagicalTradition.A

export const getMagicalTraditionsWithRituals = memoizeLast (pipe (
  SDA.magicalTraditions,
  foldr ((x: Record<MagicalTradition>): ident<List<string>> =>
          pipe_ (
            x,
            MTA.canLearnRituals,
            r => r ? consF (MTA.id (x)) : ident
          ))
        (List ())
))
