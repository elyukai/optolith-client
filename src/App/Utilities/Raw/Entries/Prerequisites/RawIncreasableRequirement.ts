import { intercalate, map } from "../../../../../Data/List";
import { Categories, IncreasableCategories } from "../../../../Constants/Categories";
import { IdPrefixes, IdPrefixesByCategory } from "../../../../Constants/IdPrefixes";
import { prefixId } from "../../../IDUtils";
import { naturalNumber } from "../../../RegexUtils";
import { AllRawRequirementObjects, RawProfessionPrerequisite } from "../rawTypeHelpers";

export interface RawRequireIncreasable {
  id: string | string[]
  value: number
}

export interface RawProfessionRequireIncreasable extends RawRequireIncreasable {
  id: string;
}

const availablePrefixes =
  map<Categories, IdPrefixes> (e => IdPrefixesByCategory [e])
                              (IncreasableCategories)

const prefixesRx = `(${intercalate ("|") (availablePrefixes)})`

const increasableId =
  new RegExp (prefixId (prefixesRx as IdPrefixes) (naturalNumber.source))

const isIncreasableId = (x: string) => increasableId .test (x)

export const isRawRequiringIncreasable =
  (req: AllRawRequirementObjects): req is RawRequireIncreasable =>
    (
      typeof req.id === "string" && isIncreasableId (req.id)
      || Array.isArray (req.id) && req.id.every (isIncreasableId)
    )
    // @ts-ignore
    && typeof req.value === "number"

export const isRawProfessionRequiringIncreasable =
  (req: RawProfessionPrerequisite): req is RawProfessionRequireIncreasable =>
    typeof req.id === "string" && isIncreasableId (req.id)
    // @ts-ignore
    && typeof req.value === "number"
