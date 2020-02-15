import * as React from "react"
import { List, map } from "../../../Data/List"
import { fromJust, isJust, isNothing, Just, Maybe, Nothing, orN } from "../../../Data/Maybe"
import { elems, OrderedMap } from "../../../Data/OrderedMap"
import { OrderedSet, toggle } from "../../../Data/OrderedSet"
import { Record } from "../../../Data/Record"
import { Sex } from "../../Models/Hero/heroTypeHelpers"
import { DropdownOption } from "../../Models/View/DropdownOption"
import { RadioOption } from "../../Models/View/RadioOption"
import { Book } from "../../Models/Wiki/Book"
import { ExperienceLevel } from "../../Models/Wiki/ExperienceLevel"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate, translateP } from "../../Utilities/I18n"
import { pipe_ } from "../../Utilities/pipe"
import { BookSelection } from "../Rules/BookSelection"
import { Dialog } from "../Universal/Dialog"
import { Dropdown } from "../Universal/Dropdown"
import { Hr } from "../Universal/Hr"
import { Scroll } from "../Universal/Scroll"
import { SegmentedControls } from "../Universal/SegmentedControls"
import { TextField } from "../Universal/TextField"

const ELA = ExperienceLevel.A

export interface HeroCreationProps {
  isOpen: boolean
  staticData: StaticDataRecord
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
    staticData,
    sortedBooks,
    isOpen,
    close,
  } = props

  const [ name, setName ] = React.useState ("")
  const [ enableAllRuleBooks, setEnableAllRuleBooks ] = React.useState (false)
  const [ enabledRuleBooks, setEnabledRuleBooks ] =
    React.useState<OrderedSet<string>> (OrderedSet.empty)
  const [ msex, setSex ] = React.useState<Maybe<Sex>> (Nothing)
  const [ mel, setEL ] = React.useState<Maybe<string>> (Nothing)
  const [ prevIsOpen, setPrevIsOpen ] = React.useState (isOpen)

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
    [ createHero, enableAllRuleBooks, enabledRuleBooks, mel, msex, name ]
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
    [ handleClear, close ]
  )

  const handleSwitchEnableAllRuleBooks = React.useCallback (
    () => {
      setEnableAllRuleBooks (!enableAllRuleBooks)
    },
    [ setEnableAllRuleBooks, enableAllRuleBooks ]
  )

  const handleSwitchEnableRuleBook = React.useCallback (
    (id: string) => {
      setEnabledRuleBooks (toggle (id) (enabledRuleBooks))
    },
    [ setEnabledRuleBooks, enabledRuleBooks ]
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
                  name: translateP (staticData)
                                   ("general.withapvalue")
                                   (List<string | number> (ELA.name (e), ELA.ap (e))),
                }))
    )

  return (
    <Dialog
      id="herocreation"
      title={translate (staticData) ("heroes.dialogs.herocreation.title")}
      close={handleClose}
      buttons={[
        {
          disabled: name === ""
                    || isNothing (msex)
                    || isNothing (mel),
          label: translate (staticData) ("heroes.dialogs.herocreation.startbtn"),
          onClick: handleSubmit,
          primary: true,
        },
      ]}
      isOpen={isOpen}
      >
      <TextField
        hint={translate (staticData) ("heroes.dialogs.herocreation.nameofhero")}
        value={name}
        onChange={setName}
        fullWidth
        autoFocus
        />
      <SegmentedControls
        active={msex}
        onClick={setSex}
        options={List (
          RadioOption<Sex> ({
            value: Just<Sex> ("m"),
            name: translate (staticData) ("heroes.dialogs.herocreation.sex.male"),
          }),
          RadioOption<Sex> ({
            value: Just<Sex> ("f"),
            name: translate (staticData) ("heroes.dialogs.herocreation.sex.female"),
          })
        )}
        />
      <Dropdown
        value={mel}
        onChange={setEL}
        options={experienceLevels}
        hint={translate (staticData) ("heroes.dialogs.herocreation.experiencelevel.placeholder")}
        fullWidth
        />
      <Hr />
      <Scroll>
        <BookSelection
          allRuleBooksEnabled={enableAllRuleBooks}
          enabledRuleBooks={enabledRuleBooks}
          staticData={staticData}
          sortedBooks={sortedBooks}
          switchEnableAllRuleBooks={handleSwitchEnableAllRuleBooks}
          switchEnableRuleBook={handleSwitchEnableRuleBook}
          />
      </Scroll>
    </Dialog>
  )
}
