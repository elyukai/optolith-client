import { Identity } from "../Control/Monad/Identity";
import { Either } from "./Either";
import { Const } from "./Functor/Const";
import { List } from "./List";
import { Maybe } from "./Maybe";
import { OrderedMap } from "./OrderedMap";
import { OrderedSet } from "./OrderedSet";

export type Data<A> = Const<A>
                    | Either<any, A>
                    | Identity<A>
                    | List<A>
                    | Maybe<A>
                    | OrderedMap<any, A>
                    | OrderedSet<A>

export type SameData<D extends Data<any>, A> =
  D extends Const<any>
  ? Const<A>
  : D extends Either<any, any>
  ? Either<any, A>
  : D extends Identity<any>
  ? Identity<A>
  : D extends List<any>
  ? List<A>
  : D extends Maybe<any>
  ? Maybe<A>
  : D extends OrderedMap<any, any>
  ? OrderedMap<any, A>
  : D extends OrderedSet<any>
  ? OrderedSet<A>
  : never
