import * as React from "react";
import { notNull } from "../../../../Data/List";
import { OrderedMap } from "../../../../Data/OrderedMap";
import { Record } from "../../../../Data/Record";
import { Advantage } from "../../../Models/Wiki/Advantage";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { Skill } from "../../../Models/Wiki/Skill";
import { SpecialAbility } from "../../../Models/Wiki/SpecialAbility";
import { WikiProperty } from "../WikiProperty";

export interface WikiApplicationsProps {
  advantages: OrderedMap<string, Record<Advantage>>
  currentObject: Record<Skill>
  l10n: L10nRecord
  showNewApplications?: boolean
  specialAbilities: OrderedMap<string, Record<SpecialAbility>>
}

export function WikiApplications (props: WikiApplicationsProps): JSX.Element | null {
  const {
    advantages,
    currentObject,
    l10n,
    showNewApplications = false,
    specialAbilities,
  } = props

  const applications = Skill.A.applications (currentObject)
  const applicationsInput = Skill.A.applicationsInput (currentObject)

  if (notNull (applications)) {
    if (showNewApplications) {
      const newApplications = applications.filter(e => {
        return typeof e.prerequisites === "object" &&
          (advantages.has(e.prerequisites[0].id as string) ||
          specialAbilities.has(e.prerequisites[0].id as string))
      })

      if (newApplications.length === 0) {
        return null
      }

      const sortedApplications = sortStrings(
        newApplications.map(e => e.name),
        l10n.id,
      )

      return (
        <WikiProperty locale={l10n} title="info.newapplications">
          {sortedApplications.intercalate(", ")}
        </WikiProperty>
      )
    }

    const defaultApplications = applications.filter(e => {
      return e.prerequisites === undefined
    })

    const sortedApplications = sortStrings(
      defaultApplications.map(e => e.name),
      l10n.id
    )

    return (
      <WikiProperty locale={l10n} title="info.applications">
        {sortedApplications.intercalate(", ")}
        {applicationsInput && ", "}
        {applicationsInput}
      </WikiProperty>
    )
  }

  return null
}
