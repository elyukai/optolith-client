import * as React from "react"
import { Textfit } from "react-textfit"
import { DerivedCharacteristicId } from "../../../../../app/Database/Schema/DerivedCharacteristics/DerivedCharacteristics.l10n"
import { fmap } from "../../../../Data/Functor"
import { find, List } from "../../../../Data/List"
import { bind, bindF, Maybe } from "../../../../Data/Maybe"
import { lookup } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { AttrId } from "../../../Constants/Ids"
import { Pet } from "../../../Models/Hero/Pet"
import { AttributeCombined, AttributeCombinedA_ } from "../../../Models/View/AttributeCombined"
import { DerivedCharacteristic } from "../../../Models/Wiki/DerivedCharacteristic"
import { StaticData, StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { translate } from "../../../Utilities/I18n"
import { pipe, pipe_ } from "../../../Utilities/pipe"
import { renderMaybe } from "../../../Utilities/ReactUtils"
import { AvatarWrapper } from "../../Universal/AvatarWrapper"
import { TextBox } from "../../Universal/TextBox"

const SDA = StaticData.A
const ACA_ = AttributeCombinedA_

const getAttrShort =
  (id: AttrId) =>
    pipe (
      find ((a: Record<AttributeCombined>) => ACA_.id (a) === id),
      fmap (ACA_.short),
      renderMaybe
    )

const getDCShort =
  (id: DerivedCharacteristicId) =>
    pipe (
      SDA.derivedCharacteristics,
      lookup (id),
      fmap (DerivedCharacteristic.A.short),
      renderMaybe
    )

interface Props {
  attributes: List<Record<AttributeCombined>>
  staticData: StaticDataRecord
  pet: Maybe<Record<Pet>>
}

export const BelongingsSheetPet: React.FC<Props> = props => {
  const { attributes, staticData, pet: mpet } = props

  return (
    <div className="pet">
      <TextBox label={translate (staticData) ("sheets.belongingssheet.animal.title")}>
        <div className="pet-content">
          <div className="left">
            <div className="row pet-base">
              <div className="name">
                <span className="label">
                  {translate (staticData) ("sheets.belongingssheet.animal.name")}
                </span>
                <span className="value">
                  <Textfit max={11} min={7} mode="single">
                    {pipe_ (mpet, fmap (Pet.A.name), renderMaybe)}
                  </Textfit>
                </span>
              </div>
              <div className="size">
                <span className="label">
                  {translate (staticData) ("sheets.belongingssheet.animal.sizecategory")}
                </span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.size), renderMaybe)}
                </span>
              </div>
              <div className="type">
                <span className="label">
                  {translate (staticData) ("sheets.belongingssheet.animal.type")}
                </span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.type), renderMaybe)}
                </span>
              </div>
              <div className="ap">
                <span className="label">
                  {translate (staticData) ("sheets.belongingssheet.animal.ap")}
                </span>
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
                  {getAttrShort (AttrId.Courage) (attributes)}
                </span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.cou), renderMaybe)}
                </span>
              </div>
              <div>
                <span className="label">
                  {getAttrShort (AttrId.Sagacity) (attributes)}
                </span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.sgc), renderMaybe)}
                </span>
              </div>
              <div>
                <span className="label">
                  {getAttrShort (AttrId.Intuition) (attributes)}
                </span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.int), renderMaybe)}
                </span>
              </div>
              <div>
                <span className="label">
                  {getAttrShort (AttrId.Charisma) (attributes)}
                </span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.cha), renderMaybe)}
                </span>
              </div>
              <div>
                <span className="label">
                  {getAttrShort (AttrId.Dexterity) (attributes)}
                </span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.dex), renderMaybe)}
                </span>
              </div>
              <div>
                <span className="label">
                  {getAttrShort (AttrId.Agility) (attributes)}
                </span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.agi), renderMaybe)}
                </span>
              </div>
              <div>
                <span className="label">
                  {getAttrShort (AttrId.Constitution) (attributes)}
                </span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.con), renderMaybe)}
                </span>
              </div>
              <div>
                <span className="label">
                  {getAttrShort (AttrId.Strength) (attributes)}
                </span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.str), renderMaybe)}
                </span>
              </div>
            </div>
            <div className="row pet-secondary">
              <div className="lp">
                <span className="label">{getDCShort ("LP") (staticData)}</span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.lp), renderMaybe)}
                </span>
              </div>
              <div className="ae">
                <span className="label">{getDCShort ("AE") (staticData)}</span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.ae), renderMaybe)}
                </span>
              </div>
              <div className="spi">
                <span className="label">{getDCShort ("SPI") (staticData)}</span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.spi), renderMaybe)}
                </span>
              </div>
              <div className="tou">
                <span className="label">{getDCShort ("TOU") (staticData)}</span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.tou), renderMaybe)}
                </span>
              </div>
              <div className="pro">
                <span className="label">
                  {translate (staticData) ("sheets.belongingssheet.animal.protection")}
                </span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.pro), renderMaybe)}
                </span>
              </div>
              <div className="ini">
                <span className="label">{getDCShort ("INI") (staticData)}</span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.ini), renderMaybe)}
                </span>
              </div>
              <div className="mov">
                <span className="label">{getDCShort ("MOV") (staticData)}</span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.mov), renderMaybe)}
                </span>
              </div>
            </div>
            <div className="row pet-offensive">
              <div className="attack">
                <span className="label">
                  {translate (staticData) ("sheets.belongingssheet.animal.attackname")}
                </span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.attack), renderMaybe)}
                </span>
              </div>
              <div className="at">
                <span className="label">
                  {translate (staticData) ("sheets.belongingssheet.animal.attack")}
                </span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.at), renderMaybe)}
                </span>
              </div>
              <div className="pa">
                <span className="label">
                  {translate (staticData) ("sheets.belongingssheet.animal.parry")}
                </span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.pa), renderMaybe)}
                </span>
              </div>
              <div className="dp">
                <span className="label">
                  {translate (staticData) ("sheets.belongingssheet.animal.damagepoints")}
                </span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.dp), renderMaybe)}
                </span>
              </div>
              <div className="reach">
                <span className="label">
                  {translate (staticData) ("sheets.belongingssheet.animal.reach")}
                </span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.reach), renderMaybe)}
                </span>
              </div>
            </div>
            <div className="row pet-actions">
              <div className="actions">
                <span className="label">
                  {translate (staticData) ("sheets.belongingssheet.animal.actions")}
                </span>
                <span className="value">
                  <Textfit max={11} min={7} mode="single">
                    {pipe_ (mpet, bindF (Pet.A.actions), renderMaybe)}
                  </Textfit>
                </span>
              </div>
            </div>
            <div className="row pet-skills">
              <div className="skills">
                <span className="label">
                  {translate (staticData) ("sheets.belongingssheet.animal.skills")}
                </span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.talents), renderMaybe)}
                </span>
              </div>
            </div>
            <div className="row pet-specialabilities">
              <div className="specialabilities">
                <span className="label">
                  {translate (staticData) ("sheets.belongingssheet.animal.specialabilities")}
                </span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.skills), renderMaybe)}
                </span>
              </div>
            </div>
            <div className="row pet-notes">
              <div className="notes">
                <span className="label">
                  {translate (staticData) ("sheets.belongingssheet.animal.notes")}
                </span>
                <span className="value">
                  {pipe_ (mpet, bindF (Pet.A.notes), renderMaybe)}
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
