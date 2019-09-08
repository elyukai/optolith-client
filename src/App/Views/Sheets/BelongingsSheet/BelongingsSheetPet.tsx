import * as React from "react";
import { Textfit } from "react-textfit";
import { equals } from "../../../../Data/Eq";
import { fmap } from "../../../../Data/Functor";
import { find, List } from "../../../../Data/List";
import { bind, bindF, Maybe } from "../../../../Data/Maybe";
import { Record } from "../../../../Data/Record";
import { AttrId } from "../../../Constants/Ids";
import { Pet } from "../../../Models/Hero/Pet";
import { AttributeCombined, AttributeCombinedA_ } from "../../../Models/View/AttributeCombined";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { translate } from "../../../Utilities/I18n";
import { pipe, pipe_ } from "../../../Utilities/pipe";
import { renderMaybe, renderMaybeWith } from "../../../Utilities/ReactUtils";
import { AvatarWrapper } from "../../Universal/AvatarWrapper";
import { TextBox } from "../../Universal/TextBox";

export interface BelongingsSheetPetProps {
  attributes: List<Record<AttributeCombined>>
  l10n: L10nRecord
  pet: Maybe<Record<Pet>>
}

export function BelongingsSheetPet (props: BelongingsSheetPetProps) {
  const { attributes, l10n, pet: mpet } = props

  return (
    <div className="pet">
      <TextBox label={translate (l10n) ("title")}>
        <div className="pet-content">
          <div className="left">
            <div className="row pet-base">
              <div className="name">
                <span className="label">{translate (l10n) ("name")}</span>
                <span className="value">
                  <Textfit max={11} min={7} mode="single">
                    {pipe_ (mpet, fmap (Pet.A.name), renderMaybe)}
                  </Textfit>
                </span>
              </div>
              <div className="size">
                <span className="label">{translate (l10n) ("sizecategory")}</span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.size), renderMaybe)}
                </span>
              </div>
              <div className="type">
                <span className="label">{translate (l10n) ("type")}</span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.type), renderMaybe)}
                </span>
              </div>
              <div className="ap">
                <span className="label">{translate (l10n) ("adventurepoints.short")}</span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.spentAp), renderMaybe)}
                </span>
                <span className="label">{"/"}</span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.totalAp), renderMaybe)}
                </span>
              </div>
            </div>
            <div className="row pet-primary">
              <div>
                <span className="label">
                  {pipe_ (
                    attributes,
                    find (pipe (AttributeCombinedA_.id, equals<string> (AttrId.Courage))),
                    renderMaybeWith (AttributeCombinedA_.short)
                  )}
                </span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.cou), renderMaybe)}
                </span>
              </div>
              <div>
                <span className="label">
                  {pipe_ (
                    attributes,
                    find (pipe (AttributeCombinedA_.id, equals<string> (AttrId.Sagacity))),
                    renderMaybeWith (AttributeCombinedA_.short)
                  )}
                </span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.sgc), renderMaybe)}
                </span>
              </div>
              <div>
                <span className="label">
                  {pipe_ (
                    attributes,
                    find (pipe (AttributeCombinedA_.id, equals<string> (AttrId.Intuition))),
                    renderMaybeWith (AttributeCombinedA_.short)
                  )}
                </span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.int), renderMaybe)}
                </span>
              </div>
              <div>
                <span className="label">
                  {pipe_ (
                    attributes,
                    find (pipe (AttributeCombinedA_.id, equals<string> (AttrId.Charisma))),
                    renderMaybeWith (AttributeCombinedA_.short)
                  )}
                </span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.cha), renderMaybe)}
                </span>
              </div>
              <div>
                <span className="label">
                  {pipe_ (
                    attributes,
                    find (pipe (AttributeCombinedA_.id, equals<string> (AttrId.Dexterity))),
                    renderMaybeWith (AttributeCombinedA_.short)
                  )}
                </span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.dex), renderMaybe)}
                </span>
              </div>
              <div>
                <span className="label">
                  {pipe_ (
                    attributes,
                    find (pipe (AttributeCombinedA_.id, equals<string> (AttrId.Agility))),
                    renderMaybeWith (AttributeCombinedA_.short)
                  )}
                </span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.agi), renderMaybe)}
                </span>
              </div>
              <div>
                <span className="label">
                  {pipe_ (
                    attributes,
                    find (pipe (AttributeCombinedA_.id, equals<string> (AttrId.Constitution))),
                    renderMaybeWith (AttributeCombinedA_.short)
                  )}
                </span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.con), renderMaybe)}
                </span>
              </div>
              <div>
                <span className="label">
                  {pipe_ (
                    attributes,
                    find (pipe (AttributeCombinedA_.id, equals<string> (AttrId.Strength))),
                    renderMaybeWith (AttributeCombinedA_.short)
                  )}
                </span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.str), renderMaybe)}
                </span>
              </div>
            </div>
            <div className="row pet-secondary">
              <div className="lp">
                <span className="label">{translate (l10n) ("lifepoints.short")}</span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.lp), renderMaybe)}
                </span>
              </div>
              <div className="ae">
                <span className="label">{translate (l10n) ("arcaneenergy.short")}</span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.ae), renderMaybe)}
                </span>
              </div>
              <div className="spi">
                <span className="label">{translate (l10n) ("spirit.short")}</span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.spi), renderMaybe)}
                </span>
              </div>
              <div className="tou">
                <span className="label">{translate (l10n) ("toughness.short")}</span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.tou), renderMaybe)}
                </span>
              </div>
              <div className="pro">
                <span className="label">{translate (l10n) ("protection.short")}</span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.pro), renderMaybe)}
                </span>
              </div>
              <div className="ini">
                <span className="label">{translate (l10n) ("initiative.short")}</span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.ini), renderMaybe)}
                </span>
              </div>
              <div className="mov">
                <span className="label">{translate (l10n) ("movement.short")}</span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.mov), renderMaybe)}
                </span>
              </div>
            </div>
            <div className="row pet-offensive">
              <div className="attack">
                <span className="label">{translate (l10n) ("attack")}</span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.attack), renderMaybe)}
                </span>
              </div>
              <div className="at">
                <span className="label">{translate (l10n) ("attack.short")}</span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.at), renderMaybe)}
                </span>
              </div>
              <div className="pa">
                <span className="label">{translate (l10n) ("parry.short")}</span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.pa), renderMaybe)}
                </span>
              </div>
              <div className="dp">
                <span className="label">{translate (l10n) ("damagepoints.short")}</span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.dp), renderMaybe)}
                </span>
              </div>
              <div className="reach">
                <span className="label">{translate (l10n) ("reach")}</span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.reach), renderMaybe)}
                </span>
              </div>
            </div>
            <div className="row pet-actions">
              <div className="actions">
                <span className="label">{translate (l10n) ("actions")}</span>
                <span className="value">
                  <Textfit max={11} min={7} mode="single">
                    {pipe_ (mpet, bindF (Pet.A.actions), renderMaybe)}
                  </Textfit>
                </span>
              </div>
            </div>
            <div className="row pet-skills">
              <div className="skills">
                <span className="label">{translate (l10n) ("skills")}</span>
                <span className="value">
                  <Textfit max={11} min={7} mode="single">
                    {pipe_ (mpet, bindF (Pet.A.talents), renderMaybe)}
                  </Textfit>
                </span>
              </div>
            </div>
            <div className="row pet-specialabilities">
              <div className="specialabilities">
                <span className="label">{translate (l10n) ("specialabilities")}</span>
                <span className="value">
                  <Textfit max={11} min={7} mode="single">
                    {pipe_ (mpet, bindF (Pet.A.skills), renderMaybe)}
                  </Textfit>
                </span>
              </div>
            </div>
            <div className="row pet-notes">
              <div className="notes">
                <span className="label">{translate (l10n) ("notes")}</span>
                <span className="value">
                  <Textfit max={11} min={7} mode="single">
                    {pipe_ (mpet, bindF (Pet.A.notes), renderMaybe)}
                  </Textfit>
                </span>
              </div>
            </div>
          </div>
          <div className="right">
            <AvatarWrapper
              src={bind (mpet) (Pet.A.avatar)}
              />
          </div>
        </div>
      </TextBox>
    </div>
  )
}
