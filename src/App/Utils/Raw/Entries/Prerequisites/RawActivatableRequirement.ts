import { ActivatableLikeCategories, ActivatableLikeCategory } from "../../../../../constants/Categories";
import { IdPrefixes, IdPrefixesByCategory } from "../../../../../constants/IdPrefixes";
import { intercalate, map } from "../../../../../Data/List";
import { prefixId } from "../../../IDUtils";
import { naturalNumber } from "../../../RegexUtils";
import { isNumber } from "../../../typeCheckUtils";
import { AllRawRequirementObjects, RawProfessionPrerequisite, RawSID } from "../rawTypeHelpers";

export interface RawRequireActivatable {
  id: string | string[]
  active: boolean
  sid?: RawSID
  sid2?: string | number
  tier?: number
}

export interface RawProfessionRequireActivatable extends RawRequireActivatable {
  id: string
  sid?: string | number
}

const availablePrefixes =
  map<ActivatableLikeCategory, IdPrefixes> (e => IdPrefixesByCategory [e])
                                           (ActivatableLikeCategories)

const prefixesRx = `(${intercalate ("|") (availablePrefixes)})`

const activatableLikeId =
  new RegExp (prefixId (prefixesRx as IdPrefixes) (naturalNumber.source))

const isActivatableLikeId = (x: string) => activatableLikeId .test (x)

export const isRawRequiringActivatable =
  (req: AllRawRequirementObjects): req is RawRequireActivatable =>
    (
      typeof req.id === "string" && isActivatableLikeId (req.id)
      || Array.isArray (req.id) && req.id.every (isActivatableLikeId)
    )
    // @ts-ignore
    && typeof req.active === "boolean"
    && (
      // @ts-ignore
      typeof req.sid === "string"
      // @ts-ignore
      || typeof req.sid === "number"
      // @ts-ignore
      || Array.isArray (req.sid) && req.sid.every (isNumber)
      // @ts-ignore
      || req.sid === undefined
    )
    && (
      // @ts-ignore
      typeof req.sid2 === "string"
      // @ts-ignore
      || typeof req.sid2 === "number"
      // @ts-ignore
      || req.sid2 === undefined
    )
    // @ts-ignore
    && (typeof req.tier === "number" || req.tier === undefined)

export const isRawProfessionRequiringActivatable =
  (req: RawProfessionPrerequisite): req is RawProfessionRequireActivatable =>
    typeof req.id === "string" && isActivatableLikeId (req.id)
    // @ts-ignore
    && typeof req.active === "boolean"
    && (
      // @ts-ignore
      typeof req.sid === "string"
      // @ts-ignore
      || typeof req.sid === "number"
      // @ts-ignore
      || req.sid === undefined
    )
    && (
      // @ts-ignore
      typeof req.sid2 === "string"
      // @ts-ignore
      || typeof req.sid2 === "number"
      // @ts-ignore
      || req.sid2 === undefined
    )
    // @ts-ignore
    && (typeof req.tier === "number" || req.tier === undefined)
