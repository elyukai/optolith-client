import * as React from "react";
import { AttributeCombined, SkillCombined } from "../../../Models/View/viewTypeHelpers";
import { getICName } from "../../../Utilities/AdventurePoints/improvementCostUtils";
import { translate, UIMessagesObject } from "../../../Utilities/I18n";
import { sign } from "../../../Utilities/NumberUtils";

export const iterateList = (locale: UIMessagesObject) =>
  (checkValueVisibility: boolean) =>
    (attributes: List<Record<AttributeCombined>>) =>
      (skills: List<Record<SkillCombined>>): ReadonlyArray<JSX.Element> =>
        sortObjects (skills, locale .get ("id"))
          .map (obj => {
            const checkValues =
              Maybe.mapMaybe<string, number> (R.pipe (
                                               e => attributes .find (
                                                 attr => attr .get ("id") === e
                                               ),
                                               Maybe.fmap (
                                                 Record.get<AttributeCombined, "value"> ("value")
                                               )
                                             ))
                                             (obj .get ("check"))

            const checkString = obj
              .get ("check")
              .map (e => {
                const maybeAttribute = attributes .find (
                  attr => attr .get ("id") === e
                )

                if (checkValueVisibility === true) {
                  return Maybe.fromMaybe (0) (maybeAttribute .fmap (attr => attr .get ("value")))
                }
                else {
                  return Maybe.fromMaybe ("") (maybeAttribute .fmap (attr => attr .get ("short")))
                }
              })
              .intercalate ("/")

            const encString = obj .get ("encumbrance") === "true"
              ? translate (l10n) ("charactersheet.gamestats.skills.enc.yes")
              : obj .get ("encumbrance") === "false"
              ? translate (l10n) ("charactersheet.gamestats.skills.enc.no")
              : translate (l10n) ("charactersheet.gamestats.skills.enc.maybe")

            const maybeRoutine = getRoutineValue (obj .get ("value"), checkValues)

            return (
              <tr key={obj .get ("id")}>
                <td className="name">{obj .get ("name")}</td>
                <td className="check">{checkString}</td>
                <td className="enc">{encString}</td>
                <td className="ic">{getICName (obj .get ("ic"))}</td>
                <td className="sr">{obj .get ("value")}</td>
                <td className="routine">
                  {Maybe.fromMaybe
                    ("-")
                    (maybeRoutine .fmap (
                      routine => `${sign (Tuple.fst (routine))}${Tuple.snd (routine) ? "!" : ""}`
                    ))}
                </td>
                <td className="comment"></td>
              </tr>
            )
          })
          .toArray ()
