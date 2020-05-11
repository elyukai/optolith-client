import * as React from "react"
import { fmap } from "../../../../Data/Functor"
import { fnull, intercalate, List, notNull } from "../../../../Data/List"
import { bindF, ensure, isNothing, mapMaybe, Maybe, maybe } from "../../../../Data/Maybe"
import { member } from "../../../../Data/OrderedMap"
import { Record, RecordIBase } from "../../../../Data/Record"
import { Advantage } from "../../../Models/Wiki/Advantage"
import { RequireActivatable } from "../../../Models/Wiki/prerequisites/ActivatableRequirement"
import { SpecialAbility } from "../../../Models/Wiki/SpecialAbility"
import { Application } from "../../../Models/Wiki/sub/Application"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { pipe } from "../../../Utilities/pipe"
import { sortStrings } from "../../../Utilities/sortBy"
import { isString } from "../../../Utilities/typeCheckUtils"
import { WikiProperty } from "../WikiProperty"

interface Accessors<A extends RecordIBase<any>> {
  applications: (r: Record<A>) => List<Record<Application>>
  applicationsInput: (r: Record<A>) => Maybe<string>
}

export interface WikiApplicationsProps<A extends RecordIBase<any>> {
  advantages: StrMap<Record<Advantage>>
  x: Record<A>
  acc: Accessors<A>
  staticData: StaticDataRecord
  showNewApplications?: boolean
  specialAbilities: StrMap<Record<SpecialAbility>>
}

const AA = Application.A

type FC = <A extends RecordIBase<any>> (props: WikiApplicationsProps<A>) => ReturnType<React.FC>

export const WikiApplications: FC = props => {
  const {
    advantages,
    x,
    acc,
    staticData,
    showNewApplications = false,
    specialAbilities,
  } = props

  const applications = acc.applications (x)
  const applicationsInput = acc.applicationsInput (x)

  if (notNull (applications)) {
    if (showNewApplications) {
      const new_apps =
        mapMaybe (pipe (
                   ensure (pipe (
                     AA.prerequisite,
                     bindF (pipe (RequireActivatable.A.id, ensure (isString))),
                     maybe (false)
                           (id => member (id) (advantages) || member (id) (specialAbilities))
                   )),
                   fmap (AA.name)
                 ))
                 (applications)

      if (fnull (new_apps)) {
        return null
      }

      const sorted_new_apps = sortStrings (staticData) (new_apps)

      return (
        <WikiProperty staticData={staticData} title="inlinewiki.newapplications">
          {intercalate (", ") (sorted_new_apps)}
        </WikiProperty>
      )
    }

    const default_apps =
      mapMaybe (pipe (ensure (pipe (AA.prerequisite, isNothing)), fmap (AA.name)))
               (applications)

    const sorted_default_apps = sortStrings (staticData) (default_apps)

    return (
      <WikiProperty staticData={staticData} title="inlinewiki.applications">
        {intercalate (", ") (sorted_default_apps)}
        {maybe ("") ((input: string) => `, ${input}`) (applicationsInput)}
      </WikiProperty>
    )
  }

  return null
}
