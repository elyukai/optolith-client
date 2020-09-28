import { set } from "../../../Data/Lens"
import { List } from "../../../Data/List"
import { makeLenses } from "../../../Data/Record"
import { L10n } from "../../Models/Wiki/L10n"
import { StaticData, StaticDataL } from "../../Models/Wiki/WikiModel"
import * as I18n from "../I18n"
import { pipe_ } from "../pipe"

const L10nL = makeLenses (L10n)

describe ("localizeOrList", () => {
  const testL10n =
    pipe_ (
      L10n.default,
      set (L10nL.id) ("de-DE"),
      set (L10nL["general.or"]) ("oder")
    )

  const staticData = set (StaticDataL.ui) (testL10n) (StaticData.default)

  it ("returns an empty string on an empty list", () => {
    expect (I18n.localizeOrList (staticData) (List ())) .toEqual ("")
  })

  it ("returns the stringified element if the list contains 1 item", () => {
    expect (I18n.localizeOrList (staticData) (List (13))) .toEqual ("13")
  })

  it ("returns 2 concatenated items", () => {
    expect (I18n.localizeOrList (staticData) (List (13, 24))) .toEqual ("13 oder 24")
  })

  it ("returns 3 concatenated items", () => {
    expect (I18n.localizeOrList (staticData) (List (13, 24, 45))) .toEqual ("13, 24 oder 45")
  })

  it ("returns 4 concatenated items", () => {
    expect (I18n.localizeOrList (staticData) (List (13, 15, 24, 45)))
      .toEqual ("13, 15, 24 oder 45")
  })
})
