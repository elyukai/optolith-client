import { intercalate, map } from "../../../../../Data/List";
import { ActivatableLikeCategories, ActivatableLikeCategory } from "../../../../Constants/Categories";
import { IdPrefixes, IdPrefixesByCategory } from "../../../../Constants/IdPrefixes";
import { prefixId } from "../../../IDUtils";
import { exactR, naturalNumberU } from "../../../RegexUtils";
import { isNumber } from "../../../typeCheckUtils";
import { AllRawRequirementObjects, RawProfessionPrerequisite, RawSID } from "../rawTypeHelpers";

export interface RawRequireActivatable {
  id: string | string[]
  active: boolean
  sid?: RawSID
  sid2?: string | number
  tier?: number
}

export interface RawProfessionRequireActivatable {
  id: string
  active?: boolean
  sid?: string | number
  sid2?: string | number
  tier?: number
}

const availablePrefixes =
  map<ActivatableLikeCategory, IdPrefixes> (e => IdPrefixesByCategory [e])
                                           (ActivatableLikeCategories)

const prefixesRx = `(${intercalate ("|") (availablePrefixes)})`

const activatableLikeId =
  new RegExp (exactR (prefixId (prefixesRx as IdPrefixes) (naturalNumberU)))

const isActivatableLikeId = (x: string) => activatableLikeId .test (x)

export const isRawRequiringActivatable =
  (req: AllRawRequirementObjects): req is RawRequireActivatable =>
    (
      typeof req.id === "string" && isActivatableLikeId (req .id)
      || Array.isArray (req .id) && req .id .length > 0 && req .id .every (isActivatableLikeId)
    )
    // @ts-ignore
    && typeof req.active === "boolean"
    && (
      // @ts-ignore
      typeof req.sid === "string"
      // @ts-ignore
      || typeof req.sid === "number"
      // @ts-ignore
      || Array.isArray (req .sid) && req .sid .length > 0 && req .sid .every (isNumber)
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
    typeof req.id === "string"
    // @ts-ignore
    && (typeof req.active === "boolean" || req.active === undefined)
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
