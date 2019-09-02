import { fromDefault, isRecord, Record } from "../../../../Data/Record";
import { Sex } from "../../Hero/heroTypeHelpers";

export interface NameBySex {
  "@@name": "NameBySex"
  m: string
  f: string
}

export const NameBySex =
  fromDefault ("NameBySex")
              <NameBySex> ({
                m: "",
                f: "",
              })

export const nameBySex =
  (sex: Sex) => NameBySex.AL[sex] as unknown as (name: Record<NameBySex>) => string

export const nameBySexDef =
  (sex: Sex) => (name: string | Record<NameBySex>) =>
    isRecord (name) ? nameBySex (sex) (name) : name
