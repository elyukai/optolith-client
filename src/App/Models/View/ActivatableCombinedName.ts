import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault } from "../../../Data/Record";

export interface ActivatableCombinedName {
  name: string
  baseName: string
  addName: Maybe<string>
}

export const ActivatableCombinedName =
  fromDefault<ActivatableCombinedName> ({
    name: "",
    baseName: "",
    addName: Nothing,
  })
