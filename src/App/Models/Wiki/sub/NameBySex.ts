import { fromDefault, isRecord, Record } from "../../../../Data/Record";
import { Sex } from "../../../../types/data";

export interface NameBySex {
  m: string
  f: string
}

export const NameBySex =
  fromDefault<NameBySex> ({
    m: "",
    f: "",
  })

export const nameBySex =
  (sex: Sex) => NameBySex.A[sex] as unknown as (name: Record<NameBySex>) => string

export const nameBySexDef =
  (sex: Sex) => (name: string | Record<NameBySex>) =>
    isRecord (name) ? nameBySex (sex) (name) : name
