import { isIdentity } from "../Control/Monad/Identity";
import { DataStructureType } from "./Data";
import { isEither, isLeft } from "./Either";
import { isConst } from "./Functor/Const";

// export type Serialized =

export const serialize = (x: any) => {
  if (isConst (x)) {
    return {
      "@@type": DataStructureType.Const,
      value: x .value
    }
  }

  if (isIdentity (x)) {
    return {
      "@@type": DataStructureType.Identity,
      value: x .value,
    }
  }

  if (isEither (x)) {
    if (isLeft (x)) {

    }
  }
}

export const deserialize = (x: any) => {

}
