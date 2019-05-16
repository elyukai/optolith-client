import * as React from "react";
import { imap, List } from "../../../../Data/List";
import { Record } from "../../../../Data/Record";
import { AttributeCombined } from "../../../Models/View/AttributeCombined";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { translate } from "../../../Utilities/I18n";
import { prefixAttr } from "../../../Utilities/IDUtils";
import { pipe_ } from "../../../Utilities/pipe";

export const iterateGroupHeaders =
  (l10n: L10nRecord) =>
  (checkAttributeValueVisibility: boolean) =>
  (attributes: List<Record<AttributeCombined>>) => {
      const groupChecksIds = List (
        List (prefixAttr (1), prefixAttr (6), prefixAttr (8)),
        List (prefixAttr (3), prefixAttr (4), prefixAttr (4)),
        List (prefixAttr (1), prefixAttr (6), prefixAttr (7)),
        List (prefixAttr (2), prefixAttr (2), prefixAttr (3)),
        List (prefixAttr (5), prefixAttr (5), prefixAttr (7))
      )

      const groupNameKeys = List (
        "physical",
        "social",
        "nature",
        "knowledge",
        "craft"
      )

      pipe_ (
        groupChecksIds,
        imap
      )

      return groupChecksIds
        .imap (index => attibuteIds => {
          const check = attibuteIds
            .map (id => {
              const attribute = attributes .find (e => e .get ("id") === id)

              return checkAttributeValueVisibility
                ? Maybe.fromMaybe (0)
                                  (attribute .fmap (
                                    Record.get<AttributeCombined, "value"> ("value")
                                  ))
                : Maybe.fromMaybe ("")
                                  (attribute .fmap (
                                    Record.get<AttributeCombined, "short"> ("short")
                                  ))
            })
            .intercalate ("/")

          return (
            <tr className="group">
              <td className="name">
                {Maybe.fromMaybe
                  ("")
                  (groupNameKeys
                    .subscript (index)
                    .fmap (
                      key => translate (
                        l10n,
                        `charactersheet.gamestats.skills.subheaders.${key}` as
                          "charactersheet.gamestats.skills.subheaders.physical"
                      )
                    ))}
              </td>
              <td className="check">{check}</td>
              <td className="enc"></td>
              <td className="ic"></td>
              <td className="sr"></td>
              <td className="routine"></td>
              <td className="comment">
                {Maybe.fromMaybe
                  ("")
                  (groupNameKeys
                    .subscript (index)
                    .fmap (
                      key => translate (
                        l10n,
                        `charactersheet.gamestats.skills.subheaders.${key}pages` as
                          "charactersheet.gamestats.skills.subheaders.physicalpages"
                      )
                    ))}
              </td>
            </tr>
          )
        })
    }
