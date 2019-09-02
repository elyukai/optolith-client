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
import { Dialog, DialogProps } from "../Universal/DialogNew";
import { Dropdown, DropdownOption } from "../Universal/Dropdown";
import { Hr } from "../Universal/Hr";
import { Scroll } from "../Universal/Scroll";
import { Option, SegmentedControls } from "../Universal/SegmentedControls";
import { TextField } from "../Universal/TextField";

export interface HeroCreationProps extends DialogProps {
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

export class HeroCreation extends React.Component<HeroCreationProps, HeroCreationState> {
  state: HeroCreationState = {
    name: "",
    enableAllRuleBooks: false,
    enabledRuleBooks: OrderedSet.empty,
    sex: Nothing,
    el: Nothing,
  }

  changeName = (name: string) => this.setState (() => ({ name }))

  changeGender = (sex: Maybe<"m" | "f">) => this.setState (() => ({ sex }))

  changeEL = (el: Maybe<string>) => this.setState (() => ({ el }))

  create = () => {
    const { name, sex, el, enableAllRuleBooks, enabledRuleBooks } = this.state

    if (name.length > 0 && isJust (sex) && isJust (el)) {
      this.props.createHero (
        name,
        fromJust (sex),
        fromJust (el),
        enableAllRuleBooks,
        enabledRuleBooks
      )
    }
  }

  clear = () => this.setState (() => ({ name: "", sex: Nothing, el: Nothing }))

  close = () => {
    this.props.close ()
    this.clear ()
  }

  switchEnableAllRuleBooks = (): void => {
    this.setState (({ enableAllRuleBooks }) => ({ enableAllRuleBooks: !enableAllRuleBooks }))
  }

  switchEnableRuleBook = (id: string): void => {
    this.setState (({ enabledRuleBooks }) => ({ enabledRuleBooks: toggle (id) (enabledRuleBooks) }))
  }

  componentWillReceiveProps (nextProps: HeroCreationProps) {
    if (nextProps.isOpen === false && orN (this.props.isOpen)) {
      this.clear ()
    }
  }

  render () {
    const { experienceLevels: experienceLevelsMap, l10n, sortedBooks, ...other } = this.props
    const { enableAllRuleBooks, enabledRuleBooks } = this.state

    const experienceLevels =
      pipe_ (
        experienceLevelsMap,
        elems,
        map (e => DropdownOption ({
                    id: Just (ExperienceLevel.A.id (e)),
                    name: `${ExperienceLevel.A.name (e)} (${ExperienceLevel.A.ap (e)} AP)`,
                  }))
      )

    return (
      <Dialog
        {...other}
        id="herocreation"
        title={translate (l10n) ("herocreation")}
        close={this.close}
        buttons={[
          {
            disabled: this.state.name === ""
                      || isNothing (this.state.sex)
                      || isNothing (this.state.el),
            label: translate (l10n) ("start"),
            onClick: this.create,
            primary: true,
          },
        ]}
        >
        <TextField
          hint={translate (l10n) ("nameofhero")}
          value={this.state.name}
          onChangeString={this.changeName}
          fullWidth
          autoFocus
          />
        <SegmentedControls
          active={this.state.sex}
          onClick={this.changeGender}
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
          value={this.state.el}
          onChange={this.changeEL}
          options={experienceLevels}
          hint={translate (l10n) ("selectexperiencelevel")}
          fullWidth
          />
        <Hr/>
        <Scroll>
          <BookSelection
            allRuleBooksEnabled={enableAllRuleBooks}
            enabledRuleBooks={enabledRuleBooks}
            l10n={l10n}
            sortedBooks={sortedBooks}
            switchEnableAllRuleBooks={this.switchEnableAllRuleBooks}
            switchEnableRuleBook={this.switchEnableRuleBook}
            />
        </Scroll>
      </Dialog>
    )
  }
}
