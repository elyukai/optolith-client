import * as React from "react"
import { Textfit } from "react-textfit"
import { equals } from "../../../../Data/Eq"
import { fmap } from "../../../../Data/Functor"
import { find, intercalate, List, map, toArray } from "../../../../Data/List"
import { mapMaybe, maybe } from "../../../../Data/Maybe"
import { Record } from "../../../../Data/Record"
import { fst, Pair, snd } from "../../../../Data/Tuple"
import { icFromJs } from "../../../Constants/Groups"
import { ApplicationWithAffection } from "../../../Models/View/ApplicationWithAffection"
import { AttributeCombined, AttributeCombinedA_ } from "../../../Models/View/AttributeCombined"
import {
  SkillWithActivations,
SkillWithActivationsA_,
} from "../../../Models/View/SkillWithActivations"
import { Application } from "../../../Models/Wiki/sub/Application"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { ndash } from "../../../Utilities/Chars"
import { compareLocale, translate } from "../../../Utilities/I18n"
import { icToStr } from "../../../Utilities/IC.gen"
import { getMinCheckModForRoutine } from "../../../Utilities/Increasable/skillUtils"
import { sign } from "../../../Utilities/NumberUtils"
import { pipe, pipe_ } from "../../../Utilities/pipe"
import { comparingR, sortByMulti } from "../../../Utilities/sortBy"

export const iterateList =
  (staticData: StaticDataRecord) =>
  (checkValueVisibility: boolean, generateNotes: boolean) =>
  (attributes: List<Record<AttributeCombined>>) =>
  (skills: List<Record<SkillWithActivations>>): JSX.Element[] =>
    pipe_ (
      skills,
      sortByMulti ([ comparingR (SkillWithActivationsA_.name) (compareLocale (staticData)) ]),
      map (obj => {
        const check_vals = mapMaybe (pipe (
                                      (id: string) => find (pipe (
                                                             AttributeCombinedA_.id,
                                                             equals (id)
                                                           ))
                                                           (attributes),
                                      fmap (AttributeCombinedA_.value)
                                    ))
                                    (SkillWithActivationsA_.check (obj))

        const check_str =
          pipe_ (
            obj,
            SkillWithActivationsA_.check,
            mapMaybe (pipe (
              id => find (pipe (AttributeCombinedA_.id, equals (id)))
                         (attributes),
              fmap ((attr: Record<AttributeCombined>) => checkValueVisibility
                              ? AttributeCombinedA_.value (attr)
                              : AttributeCombinedA_.short (attr))
            )),
            intercalate ("/")
          )

        const enc = SkillWithActivationsA_.encumbrance (obj)

        const enc_str = enc === "true"
          ? translate (staticData) ("sheets.gamestatssheet.skillstable.encumbrance.yes")
          : enc === "false"
          ? translate (staticData) ("sheets.gamestatssheet.skillstable.encumbrance.no")
          : translate (staticData) ("sheets.gamestatssheet.skillstable.encumbrance.maybe")

        const mroutine = getMinCheckModForRoutine (check_vals) (SkillWithActivationsA_.value (obj))

        let notes = ""
        if (generateNotes) {
          const activeApplications = pipe_ (
            obj,
            SkillWithActivations.A.activeApplications,
            List.map (item => Application.A.name (item)),
            intercalate (", ")
          )

          if (activeApplications.length) {
            notes += activeApplications
          }

          const activeAffections = pipe_ (
            obj,
            SkillWithActivations.A.activeAffections,
            List.map (item => {
              const name = Application.A.name (ApplicationWithAffection.A.entry (item))
              let bonus = `${ApplicationWithAffection.A.bonus (item)}`
              let penalty = `${ApplicationWithAffection.A.penalty (item)}`
              const situative = ApplicationWithAffection.A.situative (item)

              const bonusOnAttribute = ApplicationWithAffection.A.bonusOnAttribute (item)
              if (bonusOnAttribute.CH) {
                bonus = `${bonusOnAttribute.CH}(CH)`
              }
              if (bonusOnAttribute.KL) {
                bonus = `${bonusOnAttribute.KL}(KL)`
              }

              const penaltyOnAttribute = ApplicationWithAffection.A.penaltyOnAttribute (item)
              if (penaltyOnAttribute.CH) {
                penalty = `${penaltyOnAttribute.CH}(CH)`
              }
              if (penaltyOnAttribute.KL) {
                penalty = `${penaltyOnAttribute.KL}(KL)`
              }

              if (!penalty && situative) {
                return `${name}:\u00a00/+${bonus || 0}`
              }
              if (situative) {
                return `${name}:\u00a0-${penalty || 0}/+${bonus || 0}`
              }
              if (bonus !== "0" && penalty !== "0") {
                return `${name}:\u00a0-${penalty}/+${bonus}`
              }
              if (bonus !== "0") {
                return `${name}:\u00a0+${bonus}`
              }
              if (penalty !== "0") {
                return `${name}:\u00a0-${penalty}`
              }

              return name
            }),
            intercalate (", ")
          )

          if (activeAffections.length) {
            notes += (notes.length ? ", " : "")
            notes += activeAffections
          }
        }

        return (
          <tr key={SkillWithActivationsA_.id (obj)}>
            <td className="name">{SkillWithActivationsA_.name (obj)}</td>
            <td className="check">{check_str}</td>
            <td className="enc">{enc_str}</td>
            <td className="ic">{icToStr (icFromJs (SkillWithActivationsA_.ic (obj)))}</td>
            <td className="sr">{SkillWithActivationsA_.value (obj)}</td>
            <td className="routine">
              {maybe (ndash)
                     ((routine: Pair<number, boolean>) =>
                       `${sign (fst (routine))}${snd (routine) ? "!" : ""}`)
                     (mroutine)}
            </td>
            <td className="comment">
              <Textfit mode="multi" min={6} max={11}>
                {notes}
              </Textfit>
            </td>
          </tr>
        )
      }),
      toArray
    )
