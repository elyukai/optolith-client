import * as React from "react";
import { List, map } from "../../../Data/List";
import { fromJust, isJust, isNothing, Just, Maybe, Nothing, orN } from "../../../Data/Maybe";
import { elems, OrderedMap } from "../../../Data/OrderedMap";
import { OrderedSet, toggle } from "../../../Data/OrderedSet";
import { Record } from "../../../Data/Record";
import { Sex } from "../../Models/Hero/heroTypeHelpers";
import { Book } from "../../Models/Wiki/Book";
import { ExperienceLevel } from "../../Models/Wiki/ExperienceLevel";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { pipe_ } from "../../Utilities/pipe";
import { BookSelection } from "../Rules/BookSelection";
import { Dialog } from "../Universal/Dialog";
import { Dropdown, DropdownOption } from "../Universal/Dropdown";
import { Hr } from "../Universal/Hr";
import { Scroll } from "../Universal/Scroll";
import { Option, SegmentedControls } from "../Universal/SegmentedControls";
import { TextField } from "../Universal/TextField";

const ELA = ExperienceLevel.A

export interface HeroCreationProps {
  isOpen: boolean
  l10n: L10nRecord
  experienceLevels: OrderedMap<string, Record<ExperienceLevel>>
  sortedBooks: List<Record<Book>>
  close (): void
  createHero (
    name: string,
    sex: "m" | "f",
    el: string,
    enableAllRuleBooks: boolean,
    enabledRuleBooks: OrderedSet<string>
  ): void
}

export interface HeroCreationState {
  name: string
  sex: Maybe<"m" | "f">
  el: Maybe<string>
  enableAllRuleBooks: boolean
  enabledRuleBooks: OrderedSet<string>
}

export const HeroCreation: React.FC<HeroCreationProps> = props => {
  const {
    createHero,
    experienceLevels: experienceLevelsMap,
    l10n,
    sortedBooks,
    isOpen,
    close,
  } = props

  const [name, setName] = React.useState ("")
  const [enableAllRuleBooks, setEnableAllRuleBooks] = React.useState (false)
  const [enabledRuleBooks, setEnabledRuleBooks] =
    React.useState<OrderedSet<string>> (OrderedSet.empty)
  const [msex, setSex] = React.useState<Maybe<Sex>> (Nothing)
  const [mel, setEL] = React.useState<Maybe<string>> (Nothing)
  const [prevIsOpen, setPrevIsOpen] = React.useState (isOpen)

  const handleSubmit = React.useCallback (
    () => {
      if (name.length > 0 && isJust (msex) && isJust (mel)) {
        createHero (
          name,
          fromJust (msex),
          fromJust (mel),
          enableAllRuleBooks,
          enabledRuleBooks
        )
      }
    },
    [createHero, enableAllRuleBooks, enabledRuleBooks, mel, msex, name]
  )

  const handleClear = React.useCallback (
    () => {
      setName ("")
      setSex (Nothing)
      setEL (Nothing)
    },
    []
  )

  const handleClose = React.useCallback (
    () => {
      close ()
      handleClear ()
    },
    [handleClear, close]
  )

  const handleSwitchEnableAllRuleBooks = React.useCallback (
    () => {
      setEnableAllRuleBooks (!enableAllRuleBooks)
    },
    [setEnableAllRuleBooks, enableAllRuleBooks]
  )

  const handleSwitchEnableRuleBook = React.useCallback (
    (id: string) => {
      setEnabledRuleBooks (toggle (id) (enabledRuleBooks))
    },
    [setEnabledRuleBooks, enabledRuleBooks]
  )

  if (!isOpen && orN (prevIsOpen)) {
    handleClear ()
    setPrevIsOpen (false)
  }

  const experienceLevels =
    pipe_ (
      experienceLevelsMap,
      elems,
      map (e => DropdownOption ({
                  id: Just (ELA.id (e)),
                  name: `${ELA.name (e)} (${ELA.ap (e)} ${translate (l10n) ("adventurepoints.short")})`,
                }))
    )

  return (
    <Dialog
      id="herocreation"
      title={translate (l10n) ("herocreation")}
      close={handleClose}
      buttons={[
        {
          disabled: name === ""
                    || isNothing (msex)
                    || isNothing (mel),
          label: translate (l10n) ("start"),
          onClick: handleSubmit,
          primary: true,
        },
      ]}
      isOpen={isOpen}
      >
      <TextField
        hint={translate (l10n) ("nameofhero")}
        value={name}
        onChange={setName}
        fullWidth
        autoFocus
        />
      <SegmentedControls
        active={msex}
        onClick={setSex}
        options={List (
          Option<Sex> ({
            value: Just<Sex> ("m"),
            name: translate (l10n) ("male"),
          }),
          Option<Sex> ({
            value: Just<Sex> ("f"),
            name: translate (l10n) ("female"),
          })
        )}
        />
      <Dropdown
        value={mel}
        onChange={setEL}
        options={experienceLevels}
        hint={translate (l10n) ("selectexperiencelevel")}
        fullWidth
        />
      <Hr />
      <Scroll>
        <BookSelection
          allRuleBooksEnabled={enableAllRuleBooks}
          enabledRuleBooks={enabledRuleBooks}
          l10n={l10n}
          sortedBooks={sortedBooks}
          switchEnableAllRuleBooks={handleSwitchEnableAllRuleBooks}
          switchEnableRuleBook={handleSwitchEnableRuleBook}
          />
      </Scroll>
    </Dialog>
  )
}
