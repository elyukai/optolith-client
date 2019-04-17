import * as React from "react";
import { Textfit } from "react-textfit";
import { PetInstance } from "../../../Models/Hero/heroTypeHelpers";
import { AttributeCombined } from "../../../Models/View/viewTypeHelpers";
import { translate, UIMessagesObject } from "../../../Utilities/I18n";
import { AvatarWrapper } from "../../Universal/AvatarWrapper";
import { TextBox } from "../../Universal/TextBox";

export interface BelongingsSheetPetProps {
  attributes: List<Record<AttributeCombined>>
  locale: UIMessagesObject
  pet: Maybe<Record<PetInstance>>
}

export function BelongingsSheetPet (props: BelongingsSheetPetProps) {
  const {
    attributes,
    locale,
    pet: maybePet,
  } = props

  return (
    <div className="pet">
      <TextBox label={translate (locale, "charactersheet.belongings.animal.title")}>
        <div className="pet-content">
          <div className="left">
            <div className="row pet-base">
              <div className="name">
                <span className="label">{translate (locale, "pet.name")}</span>
                <span className="value">
                  <Textfit max={11} min={7} mode="single">
                    {Maybe.fromMaybe
                      ("")
                      (maybePet .fmap (Record.get<PetInstance, "name"> ("name")))}
                  </Textfit>
                </span>
              </div>
              <div className="size">
                <span className="label">{translate (locale, "pet.sizecategory")}</span>
                <span className="value">
                  {Maybe.fromMaybe
                    ("")
                    (maybePet .bind (Record.lookup<PetInstance, "size"> ("size")))}
                </span>
              </div>
              <div className="type">
                <span className="label">{translate (locale, "pet.type")}</span>
                <span className="value">
                  {Maybe.fromMaybe
                    ("")
                    (maybePet .bind (Record.lookup<PetInstance, "type"> ("type")))}
                </span>
              </div>
              <div className="ap">
                <span className="label">{translate (locale, "pet.ap")}</span>
                <span className="value">
                  {Maybe.fromMaybe
                    ("")
                    (maybePet .bind (Record.lookup<PetInstance, "spentAp"> ("spentAp")))}
                </span>
                <span className="label">/</span>
                <span className="value">
                  {Maybe.fromMaybe
                    ("")
                    (maybePet .bind (Record.lookup<PetInstance, "totalAp"> ("totalAp")))}
                </span>
              </div>
            </div>
            <div className="row pet-primary">
              <div>
                <span className="label">
                  {Maybe.fromMaybe
                    ("")
                    (attributes
                      .find (e => e .get ("id") === "ATTR_1")
                      .fmap (Record.get<AttributeCombined, "short"> ("short")))}
                </span>
                <span className="value">
                  {Maybe.fromMaybe
                    ("")
                    (maybePet .bind (Record.lookup<PetInstance, "cou"> ("cou")))}
                </span>
              </div>
              <div>
                <span className="label">
                  {Maybe.fromMaybe
                    ("")
                    (attributes
                      .find (e => e .get ("id") === "ATTR_2")
                      .fmap (Record.get<AttributeCombined, "short"> ("short")))}
                </span>
                <span className="value">
                  {Maybe.fromMaybe
                    ("")
                    (maybePet .bind (Record.lookup<PetInstance, "sgc"> ("sgc")))}
                </span>
              </div>
              <div>
                <span className="label">
                  {Maybe.fromMaybe
                    ("")
                    (attributes
                      .find (e => e .get ("id") === "ATTR_3")
                      .fmap (Record.get<AttributeCombined, "short"> ("short")))}
                </span>
                <span className="value">
                  {Maybe.fromMaybe
                    ("")
                    (maybePet .bind (Record.lookup<PetInstance, "int"> ("int")))}
                </span>
              </div>
              <div>
                <span className="label">
                  {Maybe.fromMaybe
                    ("")
                    (attributes
                      .find (e => e .get ("id") === "ATTR_4")
                      .fmap (Record.get<AttributeCombined, "short"> ("short")))}
                </span>
                <span className="value">
                  {Maybe.fromMaybe
                    ("")
                    (maybePet .bind (Record.lookup<PetInstance, "cha"> ("cha")))}
                </span>
              </div>
              <div>
                <span className="label">
                  {Maybe.fromMaybe
                    ("")
                    (attributes
                      .find (e => e .get ("id") === "ATTR_5")
                      .fmap (Record.get<AttributeCombined, "short"> ("short")))}
                </span>
                <span className="value">
                  {Maybe.fromMaybe
                    ("")
                    (maybePet .bind (Record.lookup<PetInstance, "dex"> ("dex")))}
                </span>
              </div>
              <div>
                <span className="label">
                  {Maybe.fromMaybe
                    ("")
                    (attributes
                      .find (e => e .get ("id") === "ATTR_6")
                      .fmap (Record.get<AttributeCombined, "short"> ("short")))}
                </span>
                <span className="value">
                  {Maybe.fromMaybe
                    ("")
                    (maybePet .bind (Record.lookup<PetInstance, "agi"> ("agi")))}
                </span>
              </div>
              <div>
                <span className="label">
                  {Maybe.fromMaybe
                    ("")
                    (attributes
                      .find (e => e .get ("id") === "ATTR_7")
                      .fmap (Record.get<AttributeCombined, "short"> ("short")))}
                </span>
                <span className="value">
                  {Maybe.fromMaybe
                    ("")
                    (maybePet .bind (Record.lookup<PetInstance, "con"> ("con")))}
                </span>
              </div>
              <div>
                <span className="label">
                  {Maybe.fromMaybe
                    ("")
                    (attributes
                      .find (e => e .get ("id") === "ATTR_8")
                      .fmap (Record.get<AttributeCombined, "short"> ("short")))}
                </span>
                <span className="value">
                  {Maybe.fromMaybe
                    ("")
                    (maybePet .bind (Record.lookup<PetInstance, "str"> ("str")))}
                </span>
              </div>
            </div>
            <div className="row pet-secondary">
              <div className="lp">
                <span className="label">{translate (locale, "pet.lp")}</span>
                <span className="value">
                  {Maybe.fromMaybe
                    ("")
                    (maybePet .bind (Record.lookup<PetInstance, "lp"> ("lp")))}
                </span>
              </div>
              <div className="ae">
                <span className="label">{translate (locale, "pet.ae")}</span>
                <span className="value">
                  {Maybe.fromMaybe
                    ("")
                    (maybePet .bind (Record.lookup<PetInstance, "ae"> ("ae")))}
                </span>
              </div>
              <div className="spi">
                <span className="label">{translate (locale, "pet.spi")}</span>
                <span className="value">
                  {Maybe.fromMaybe
                    ("")
                    (maybePet .bind (Record.lookup<PetInstance, "spi"> ("spi")))}
                </span>
              </div>
              <div className="tou">
                <span className="label">{translate (locale, "pet.tou")}</span>
                <span className="value">
                  {Maybe.fromMaybe
                    ("")
                    (maybePet .bind (Record.lookup<PetInstance, "tou"> ("tou")))}
                </span>
              </div>
              <div className="pro">
                <span className="label">{translate (locale, "pet.pro")}</span>
                <span className="value">
                  {Maybe.fromMaybe
                    ("")
                    (maybePet .bind (Record.lookup<PetInstance, "pro"> ("pro")))}
                </span>
              </div>
              <div className="ini">
                <span className="label">{translate (locale, "pet.ini")}</span>
                <span className="value">
                  {Maybe.fromMaybe
                    ("")
                    (maybePet .bind (Record.lookup<PetInstance, "ini"> ("ini")))}
                </span>
              </div>
              <div className="mov">
                <span className="label">{translate (locale, "pet.mov")}</span>
                <span className="value">
                  {Maybe.fromMaybe
                    ("")
                    (maybePet .bind (Record.lookup<PetInstance, "mov"> ("mov")))}
                </span>
              </div>
            </div>
            <div className="row pet-offensive">
              <div className="attack">
                <span className="label">{translate (locale, "pet.attack")}</span>
                <span className="value">
                  {Maybe.fromMaybe
                    ("")
                    (maybePet .bind (Record.lookup<PetInstance, "attack"> ("attack")))}
                </span>
              </div>
              <div className="at">
                <span className="label">{translate (locale, "pet.at")}</span>
                <span className="value">
                  {Maybe.fromMaybe
                    ("")
                    (maybePet .bind (Record.lookup<PetInstance, "at"> ("at")))}
                </span>
              </div>
              <div className="pa">
                <span className="label">{translate (locale, "pet.pa")}</span>
                <span className="value">
                  {Maybe.fromMaybe
                    ("")
                    (maybePet .bind (Record.lookup<PetInstance, "pa"> ("pa")))}
                </span>
              </div>
              <div className="dp">
                <span className="label">{translate (locale, "pet.dp")}</span>
                <span className="value">
                  {Maybe.fromMaybe
                    ("")
                    (maybePet .bind (Record.lookup<PetInstance, "dp"> ("dp")))}
                </span>
              </div>
              <div className="reach">
                <span className="label">{translate (locale, "pet.reach")}</span>
                <span className="value">
                  {Maybe.fromMaybe
                    ("")
                    (maybePet .bind (Record.lookup<PetInstance, "reach"> ("reach")))}
                </span>
              </div>
            </div>
            <div className="row pet-actions">
              <div className="actions">
                <span className="label">{translate (locale, "pet.actions")}</span>
                <span className="value">
                  <Textfit max={11} min={7} mode="single">
                    {Maybe.fromMaybe
                      ("")
                      (maybePet .bind (Record.lookup<PetInstance, "actions"> ("actions")))}
                  </Textfit>
                </span>
              </div>
            </div>
            <div className="row pet-skills">
              <div className="skills">
                <span className="label">{translate (locale, "pet.skills")}</span>
                <span className="value">
                  <Textfit max={11} min={7} mode="single">
                    {Maybe.fromMaybe
                      ("")
                      (maybePet .bind (Record.lookup<PetInstance, "talents"> ("talents")))}
                  </Textfit>
                </span>
              </div>
            </div>
            <div className="row pet-specialabilities">
              <div className="specialabilities">
                <span className="label">{translate (locale, "pet.specialabilities")}</span>
                <span className="value">
                  <Textfit max={11} min={7} mode="single">
                    {Maybe.fromMaybe
                      ("")
                      (maybePet .bind (Record.lookup<PetInstance, "skills"> ("skills")))}
                  </Textfit>
                </span>
              </div>
            </div>
            <div className="row pet-notes">
              <div className="notes">
                <span className="label">{translate (locale, "pet.notes")}</span>
                <span className="value">
                  <Textfit max={11} min={7} mode="single">
                    {Maybe.fromMaybe
                      ("")
                      (maybePet .bind (Record.lookup<PetInstance, "notes"> ("notes")))}
                  </Textfit>
                </span>
              </div>
            </div>
          </div>
          <div className="right">
            <AvatarWrapper
              src={maybePet .bind (Record.lookup<PetInstance, "avatar"> ("avatar"))}
              />
          </div>
        </div>
      </TextBox>
    </div>
  )
}
