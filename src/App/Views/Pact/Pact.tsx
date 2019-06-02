import * as React from "react";
import { isNumber, isString } from "util";
import { fmap, fmapF } from "../../../Data/Functor";
import { consF, imap, notNullStr, subscript, unfoldr } from "../../../Data/List";
import { and, bindF, ensure, isNothing, Just, Maybe, maybe, Nothing } from "../../../Data/Maybe";
import { Pair } from "../../../Data/Pair";
import { Record } from "../../../Data/Record";
import { InputTextEvent } from "../../Models/Hero/heroTypeHelpers";
import { Pact } from "../../Models/Hero/Pact";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { dec, gte, inc } from "../../Utilities/mathUtils";
import { toRoman } from "../../Utilities/NumberUtils";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { misNumberM, misStringM } from "../../Utilities/typeCheckUtils";
import { Dropdown, DropdownOption } from "../Universal/Dropdown";
import { Page } from "../Universal/Page";
import { TextField } from "../Universal/TextField";

export interface PactSettingsOwnProps {
  l10n: L10nRecord
}

export interface PactSettingsStateProps {
  pact: Maybe<Record<Pact>>
  isPactValid: boolean
  isPactEditable: Maybe<boolean>
}

export interface PactSettingsDispatchProps {
  setPactCategory (category: Maybe<number>): void
  setPactLevel (level: Maybe<number>): void
  setTargetType (level: Maybe<number>): void
  setTargetDomain (domain: Maybe<number | string>): void
  setTargetName (name: string): void
}

export type PactSettingsProps =
  PactSettingsStateProps
  & PactSettingsDispatchProps
  & PactSettingsOwnProps

export function PactSettings (props: PactSettingsProps) {
  const {
    pact: mpact,
    isPactEditable,
    setPactCategory,
    setPactLevel,
    setTargetDomain,
    setTargetName,
    setTargetType,
    l10n,
  } = props

  const isPactNotEditable = Maybe.elem (false) (isPactEditable)

  return (
    <Page id="pact">
      <div className="pact-content">
        <Dropdown
          label={translate (l10n) ("pactcategory")}
          options={pipe_ (
            translate (l10n) ("pactcategories"),
            imap (i => name => DropdownOption ({
              id: Just (i + 1),
              name,
            })),
            consF (DropdownOption ({
              name: translate (l10n) ("nopact"),
            }))
          )}
          onChange={setPactCategory}
          value={fmapF (mpact) (Pact.A.category)}
          disabled={isPactNotEditable}
          />
        <Dropdown
          label={translate (l10n) ("pactlevel")}
          options={
            unfoldr ((id: number) => id > 3
                      ? Nothing
                      : Just (
                        Pair (
                          DropdownOption ({
                            id: Just (id),
                            name: toRoman (id),
                            disabled: Just (maybe (isPactNotEditable)
                                                  (pipe (Pact.A.level, gte (id)))
                                                  (mpact)),
                          }),
                          inc (id)
                        )
                      ))
                    (1)}
          onChange={setPactLevel}
          value={fmapF (mpact) (Pact.A.level)}
          disabled={isNothing (mpact)}
          />
        <Dropdown
          label={translate (l10n) ("fairytype")}
          options={imap (i => (name: string) => DropdownOption ({
                          id: Just (i + 1),
                          name,
                        }))
                        (translate (l10n) ("fairytypes"))}
          onChange={setTargetType}
          value={fmapF (mpact) (Pact.A.type)}
          disabled={isPactNotEditable || isNothing (mpact)}
          />
        <Dropdown
          label={translate (l10n) ("domain")}
          options={imap (i => (name: string) => DropdownOption ({
                          id: Just (i + 1),
                          name,
                        }))
                        (translate (l10n) ("fairydomains"))}
          onChange={setTargetDomain}
          value={pipe_ (mpact, fmap (Pact.A.domain), misNumberM)}
          disabled={
            isPactNotEditable
            || pipe_ (mpact, fmap (pipe (Pact.A.domain, d => isString (d) && notNullStr (d))), and)
          }
          />
        <TextField
          label={`${translate (l10n) ("domain")} (${translate (l10n) ("userdefined")})`}
          hint={pipe_ (
            mpact,
            bindF (pipe (Pact.A.domain, ensure (isNumber))),
            bindF (pipe (dec, subscript (translate (l10n) ("fairydomains"))))
          )}
          onChange={(event: InputTextEvent) => setTargetDomain (Just (event.target.value))}
          value={pipe_ (mpact, fmap (Pact.A.domain), misStringM)}
          disabled={isPactNotEditable || isNothing (mpact)}
          />
        <TextField
          label={translate (l10n) ("name")}
          onChange={(event: InputTextEvent) => setTargetName (event.target.value)}
          value={fmapF (mpact) (Pact.A.name)}
          disabled={isPactNotEditable || isNothing (mpact)}
          />
      </div>
    </Page>
  )
}
