import * as React from "react";
import { equals } from "../../../../Data/Eq";
import { fmap } from "../../../../Data/Functor";
import { find, imap, intercalate, List, subscriptF } from "../../../../Data/List";
import { mapMaybe } from "../../../../Data/Maybe";
import { lookup, OrderedMap } from "../../../../Data/OrderedMap";
import { Record } from "../../../../Data/Record";
import { fst, Pair, snd } from "../../../../Data/Tuple";
import { AttrId } from "../../../Constants/Ids";
import { AttributeCombined, AttributeCombinedA_ } from "../../../Models/View/AttributeCombined";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { ndash } from "../../../Utilities/Chars";
import { translate } from "../../../Utilities/I18n";
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
  (attributes: List<Record<AttributeCombined>>) => {
    const groupChecksIds = List (
      List (AttrId.Courage, AttrId.Agility, AttrId.Strength),
      List (AttrId.Intuition, AttrId.Charisma, AttrId.Charisma),
      List (AttrId.Courage, AttrId.Agility, AttrId.Constitution),
      List (AttrId.Sagacity, AttrId.Sagacity, AttrId.Intuition),
      List (AttrId.Dexterity, AttrId.Dexterity, AttrId.Constitution)
    )

    const groupNameKeys = List<GroupNameKeys> (
      "physicalskills",
      "socialskills",
      "natureskills",
      "knowledgeskills",
      "craftskills"
    )

    const page = translate (l10n) ("page.short")

    return imap (index => pipe (
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
                                <td className="enc" />
                                <td className="ic" />
                                <td className="sr" />
                                <td className="routine" />
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
  }
