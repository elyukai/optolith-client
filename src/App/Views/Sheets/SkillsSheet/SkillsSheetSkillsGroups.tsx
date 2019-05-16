import * as React from "react";
import { equals } from "../../../../Data/Eq";
import { fmap } from "../../../../Data/Functor";
import { find, imap, intercalate, List, subscriptF } from "../../../../Data/List";
import { mapMaybe, Maybe } from "../../../../Data/Maybe";
import { lookup, OrderedMap } from "../../../../Data/OrderedMap";
import { Record } from "../../../../Data/Record";
import { fst, Pair, snd } from "../../../../Data/Tuple";
import { AttributeCombined, AttributeCombinedA_ } from "../../../Models/View/AttributeCombined";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { ndash } from "../../../Utilities/Chars";
import { translate } from "../../../Utilities/I18n";
import { prefixAttr } from "../../../Utilities/IDUtils";
import { pipe, pipe_ } from "../../../Utilities/pipe";
import { renderMaybeWith } from "../../../Utilities/ReactUtils";

type GroupNameKeys = "physicalskills"
                   | "socialskills"
                   | "natureskills"
                   | "knowledgeskills"
                   | "craftskills"

export const iterateGroupHeaders =
  (l10n: L10nRecord) =>
  (checkAttributeValueVisibility: boolean) =>
  (pages: OrderedMap<number, Pair<number, number>>) =>
  (mattributes: Maybe<List<Record<AttributeCombined>>>) => {
    const groupChecksIds = List (
      List (prefixAttr (1), prefixAttr (6), prefixAttr (8)),
      List (prefixAttr (3), prefixAttr (4), prefixAttr (4)),
      List (prefixAttr (1), prefixAttr (6), prefixAttr (7)),
      List (prefixAttr (2), prefixAttr (2), prefixAttr (3)),
      List (prefixAttr (5), prefixAttr (5), prefixAttr (7))
    )

    const groupNameKeys = List<GroupNameKeys> (
      "physicalskills",
      "socialskills",
      "natureskills",
      "knowledgeskills",
      "craftskills"
    )

    const page = translate (l10n) ("page.short")

    return fmap ((attributes: List<Record<AttributeCombined>>) =>
                  imap (index => pipe (
                                   mapMaybe (pipe (
                                     (id: string) => find (pipe (
                                                            AttributeCombinedA_.id,
                                                            equals (id)
                                                          ))
                                                          (attributes),
                                     fmap (attr => checkAttributeValueVisibility
                                                     ? AttributeCombinedA_.value (attr)
                                                     : AttributeCombinedA_.short (attr))
                                   )),
                                   intercalate ("/"),
                                   check => (
                                     <tr className="group">
                                       <td className="name">
                                         {pipe_ (
                                           groupNameKeys,
                                           subscriptF (index),
                                           renderMaybeWith (translate (l10n))
                                         )}
                                       </td>
                                       <td className="check">{check}</td>
                                       <td className="enc"></td>
                                       <td className="ic"></td>
                                       <td className="sr"></td>
                                       <td className="routine"></td>
                                       <td className="comment">
                                         {pipe_ (
                                           pages,
                                           lookup (index + 1),
                                           renderMaybeWith (
                                             p => `${page} ${fst (p)}${ndash}${snd (p)}`
                                           )
                                         )}
                                       </td>
                                     </tr>
                                   )
                                 ))
                       (groupChecksIds)
                )
                (mattributes)
  }
