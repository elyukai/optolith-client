import * as React from "react";
import { Textfit } from "react-textfit";
import { List } from "../../../../Data/List";
import { Maybe } from "../../../../Data/Maybe";
import { Record } from "../../../../Data/Record";
import { Armor } from "../../../Models/View/Armor";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { localizeNumber, localizeWeight, translate } from "../../../Utilities/I18n";
import { sign, toRoman } from "../../../Utilities/NumberUtils";
import { TextBox } from "../../Universal/TextBox";

export interface CombatSheetArmorProps {
  armors: Maybe<List<Record<Armor>>>
  l10n: L10nRecord
}

export function CombatSheetArmor (props: CombatSheetArmorProps) {
  const { l10n, armors: marmors } = props

  return (
    <TextBox
      label={translate (l10n) ("armor")}
      className="armor"
      >
      <table>
        <thead>
          <tr>
            <th className="name">{translate (l10n) ("armor")}</th>
            <th className="st">{translate (l10n) ("sturdinessrating.short")}</th>
            <th className="loss">{translate (l10n) ("wear.short")}</th>
            <th className="pro">{translate (l10n) ("pro")}</th>
            <th className="enc">{translate (l10n) ("enc")}</th>
            <th className="add-penalties">{translate (l10n) ("additionalpenalties")}</th>
            <th className="weight">{translate (l10n) ("weight")}</th>
            <th className="where">{translate (l10n) ("where")}</th>
          </tr>
        </thead>
        <tbody>
          {Maybe.fromMaybe<NonNullable<React.ReactNode>>
            (<></>)
            (marmors .fmap (
              armors => armors
                .map (e => {
                  const addPenalties = Maybe.catMaybes<string> (
                    List.of (
                      e .get ("mov") !== 0
                        ? Just (
                          `${sign (e .get ("mov"))} ${translate (l10n) ("secondaryattributes.mov.short")}`
                        )
                        : Nothing (),
                      e .get ("ini") !== 0
                        ? Just (
                          `${sign (e .get ("ini"))} ${translate (l10n) ("secondaryattributes.ini.short")}`
                        )
                        : Nothing ()
                    )
                  )

                  return (
                    <tr key={e .get ("id")}>
                      <td className="name">
                        <Textfit max={11} min={7} mode="single">{e .get ("name")}</Textfit>
                      </td>
                      <td className="st">{e .lookupWithDefault<"st"> (0) ("st")}</td>
                      <td className="loss">
                        {Maybe.fromMaybe ("") (e .lookup ("loss") .fmap (toRoman))}
                      </td>
                      <td className="pro">{e .lookupWithDefault<"pro"> (0) ("pro")}</td>
                      <td className="enc">{e .lookupWithDefault<"enc"> (0) ("enc")}</td>
                      <td className="add-penalties">
                        {addPenalties .null () ? "-" : addPenalties .intercalate (", ")}
                      </td>
                      <td className="weight">
                        {Maybe.fromMaybe<string | number>
                          ("")
                          (e .lookup ("weight") .fmap (
                            weight => localizeNumber (l10n .get ("id"))
                                                     (localizeWeight (l10n .get ("id")) (weight))
                          ))}
                        {" "}
                        {translate (l10n) ("weightunit")}
                      </td>
                      <td className="where">
                        <Textfit max={11} min={7} mode="single">
                          {e .lookupWithDefault<"where"> ("") ("where")}
                        </Textfit>
                      </td>
                    </tr>
                  )
                })
                .toArray ()
            ))}
          {List.unfoldr<JSX.Element, number>
            (x => x >= 4
              ? Nothing ()
              : Just (
                Tuple.of<JSX.Element, number>
                  (
                    <tr key={`undefined${3 - x}`}>
                      <td className="name"></td>
                      <td className="st"></td>
                      <td className="loss"></td>
                      <td className="pro"></td>
                      <td className="enc"></td>
                      <td className="add-penalties"></td>
                      <td className="weight"></td>
                      <td className="where"></td>
                    </tr>
                  )
                  (R.inc (x))
              )
            )
            (Maybe.fromMaybe (0) (marmors .fmap (List.lengthL)))}
        </tbody>
      </table>
    </TextBox>
  )
}
