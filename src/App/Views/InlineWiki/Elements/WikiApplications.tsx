import * as React from "react";
import { fmap } from "../../../../Data/Functor";
import { fnull, intercalate, List, notNull } from "../../../../Data/List";
import { bindF, ensure, isNothing, listToMaybe, mapMaybe, Maybe, maybe } from "../../../../Data/Maybe";
import { member, OrderedMap } from "../../../../Data/OrderedMap";
import { Record, RecordIBase } from "../../../../Data/Record";
import { Advantage } from "../../../Models/Wiki/Advantage";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { RequireActivatable } from "../../../Models/Wiki/prerequisites/ActivatableRequirement";
import { SpecialAbility } from "../../../Models/Wiki/SpecialAbility";
import { Application } from "../../../Models/Wiki/sub/Application";
import { pipe } from "../../../Utilities/pipe";
import { sortStrings } from "../../../Utilities/sortBy";
import { isString } from "../../../Utilities/typeCheckUtils";
import { WikiProperty } from "../WikiProperty";

interface Accessors<A extends RecordIBase<any>> {
  applications: (r: Record<A>) => List<Record<Application>>
  applicationsInput: (r: Record<A>) => Maybe<string>
}

export interface WikiApplicationsProps<A extends RecordIBase<any>> {
  advantages: OrderedMap<string, Record<Advantage>>
  x: Record<A>
  acc: Accessors<A>
  l10n: L10nRecord
  showNewApplications?: boolean
  specialAbilities: OrderedMap<string, Record<SpecialAbility>>
}

const AA = Application.A

export function WikiApplications <A extends RecordIBase<any>> (props: WikiApplicationsProps<A>) {
  const {
    advantages,
    x,
    acc,
    l10n,
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
                     AA.prerequisites,
                     bindF (listToMaybe),
                     bindF (ensure (RequireActivatable.is)),
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

      const sorted_new_apps = sortStrings (l10n) (new_apps)

      return (
        <WikiProperty l10n={l10n} title="newapplications">
          {intercalate (", ") (sorted_new_apps)}
        </WikiProperty>
      )
    }

    const default_apps =
      mapMaybe (pipe (ensure (pipe (AA.prerequisites, isNothing)), fmap (AA.name)))
               (applications)

    const sorted_default_apps = sortStrings (l10n) (default_apps)

    return (
      <WikiProperty l10n={l10n} title="applications">
        {intercalate (", ") (sorted_default_apps)}
        {maybe ("") ((input: string) => `, ${input}`) (applicationsInput)}
      </WikiProperty>
    )
  }

  return null
}
