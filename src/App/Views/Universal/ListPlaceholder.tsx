import classNames from "classnames";
import * as React from "react";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { IconButton } from "./IconButton";
import { ListView } from "./List";
import { ListItem } from "./ListItem";
import { ListItemButtons } from "./ListItemButtons";
import { ListItemName } from "./ListItemName";
import { ListItemSeparator } from "./ListItemSeparator";
import { ListItemValues } from "./ListItemValues";

export type ListPlaceholderType =
  "races"
  | "cultures"
  | "professions"
  | "advantages"
  | "disadvantages"
  | "specialAbilities"
  | "inactiveAdvantages"
  | "inactiveDisadvantages"
  | "inactiveSpecialAbilities"
  | "wiki"
  | "skills"
  | "combatTechniques"
  | "spells"
  | "liturgicalChants"
  | "inactiveSpells"
  | "inactiveLiturgicalChants"
  | "equipment"
  | "itemTemplates"
  | "zoneArmor"

export interface ListPlaceholderProps {
  l10n: L10nRecord
  noResults?: boolean
  wikiInitial?: boolean
  type?: ListPlaceholderType
}

export function ListPlaceholder (props: ListPlaceholderProps) {
  const { type = "advantages" } = props
  let placeholder: JSX.Element | undefined

  switch (type) {
    case "races":
    case "professions":
      placeholder = (
        <ListItem className="placeholder">
          <ListItemName name="" />
          <ListItemSeparator/>
          <ListItemValues>
            <div className="cost"><div className="placeholder-text"></div></div>
          </ListItemValues>
          <ListItemButtons>
            <IconButton icon="&#xE90a;" disabled />
            <IconButton icon="&#xE90e;" disabled />
          </ListItemButtons>
        </ListItem>
      )
      break

    case "cultures":
      placeholder = (
        <ListItem className="placeholder">
          <ListItemName name="" />
          <ListItemSeparator/>
          <ListItemButtons>
            <IconButton icon="&#xE90a;" disabled />
            <IconButton icon="&#xE90e;" disabled />
          </ListItemButtons>
        </ListItem>
      )
      break

    case "advantages":
    case "disadvantages":
    case "specialAbilities":
      placeholder = (
        <ListItem className="placeholder">
          <ListItemName name="" />
          <ListItemSeparator/>
          <ListItemValues>
            <div className="cost"><div className="placeholder-text"></div></div>
          </ListItemValues>
          <ListItemButtons>
            <IconButton icon="&#xE90b;" flat disabled />
            <IconButton icon="&#xE912;" flat disabled />
          </ListItemButtons>
        </ListItem>
      )
      break

    case "inactiveAdvantages":
    case "inactiveDisadvantages":
    case "inactiveSpecialAbilities":
      placeholder = (
        <ListItem className="placeholder">
          <ListItemName name="" />
          <ListItemSeparator/>
          <ListItemValues>
            <div className="cost"><div className="placeholder-text"></div></div>
          </ListItemValues>
          <ListItemButtons>
            <IconButton icon="&#xE916;" flat disabled />
            <IconButton icon="&#xE912;" flat disabled />
          </ListItemButtons>
        </ListItem>
      )
      break

    case "skills":
    case "spells":
    case "liturgicalChants":
      placeholder = (
        <ListItem className="placeholder">
          <ListItemName name="" />
          <ListItemSeparator/>
          <ListItemValues>
            <div className="sr"></div>
            <div className="check"></div>
            <div className="check"></div>
            <div className="check"></div>
            <div className="fill"></div>
            <div className="ic"></div>
          </ListItemValues>
          <ListItemButtons>
            <IconButton icon="&#xE908;" flat disabled />
            <IconButton icon="&#xE909;" flat disabled />
            <IconButton icon="&#xE912;" flat disabled />
          </ListItemButtons>
        </ListItem>
      )
      break

    case "inactiveSpells":
    case "inactiveLiturgicalChants":
      placeholder = (
        <ListItem className="placeholder">
          <ListItemName name="" />
          <ListItemSeparator/>
          <ListItemValues>
            <div className="sr"></div>
            <div className="check"></div>
            <div className="check"></div>
            <div className="check"></div>
            <div className="fill"></div>
            <div className="ic"></div>
          </ListItemValues>
          <ListItemButtons>
            <IconButton icon="&#xE916;" flat disabled />
            <IconButton icon="&#xE912;" flat disabled />
          </ListItemButtons>
        </ListItem>
      )
      break

    case "combatTechniques":
      placeholder = (
        <ListItem className="placeholder">
          <ListItemName name="" />
          <ListItemSeparator/>
          <ListItemValues>
            <div className="sr"></div>
            <div className="ic"></div>
            <div className="primary"></div>
            <div className="at"></div>
            <div className="atpa"></div>
            <div className="pa"></div>
          </ListItemValues>
          <ListItemButtons>
            <IconButton icon="&#xE908;" flat disabled />
            <IconButton icon="&#xE909;" flat disabled />
            <IconButton icon="&#xE912;" flat disabled />
          </ListItemButtons>
        </ListItem>
      )
      break

    case "equipment":
      placeholder = (
        <ListItem className="placeholder">
          <ListItemName name="" />
          <ListItemSeparator/>
          <ListItemButtons>
            <IconButton icon="&#xE90c;" flat disabled />
            <IconButton icon="&#xE90b;" flat disabled />
            <IconButton icon="&#xE912;" flat disabled />
          </ListItemButtons>
        </ListItem>
      )
      break

    case "itemTemplates":
      placeholder = (
        <ListItem className="placeholder">
          <ListItemName name="" />
          <ListItemSeparator/>
          <ListItemButtons>
            <IconButton icon="&#xE916;" flat disabled />
            <IconButton icon="&#xE912;" flat disabled />
          </ListItemButtons>
        </ListItem>
      )
      break

    case "zoneArmor":
      placeholder = (
        <ListItem className="placeholder">
          <ListItemName name="" />
          <ListItemSeparator/>
          <ListItemButtons>
            <IconButton icon="&#xE90c;" flat disabled />
            <IconButton icon="&#xE90b;" flat disabled />
          </ListItemButtons>
        </ListItem>
      )
      break

    case "wiki":
      placeholder = (
        <ListItem className="placeholder">
          <ListItemName name="" />
          <ListItemSeparator/>
        </ListItem>
      )
      break
  }

  return (
    <ListView
      className={
        classNames (
          "placeholder-wrapper",
          [
            "advantages",
            "disadvantages",
            "specialAbilities",
            "inactiveAdvantages",
            "inactiveDisadvantages",
            "inactiveSpecialAbilities",
          ].includes (type)
            ? "increased-padding"
            : undefined
        )
      }
      >
      {placeholder}
      {placeholder}
      {placeholder}
      {placeholder}
      {placeholder}
      <div
        className={
          classNames (
            "placeholder-message",
            props.wikiInitial === true ? "wiki-initial" : undefined
          )
        }
        >
        {
          props.wikiInitial === true
            ? translate (props.l10n) ("chooseacategorytodisplayalist")
            : props.noResults === true
            ? translate (props.l10n) ("emptylistnoresults")
            : translate (props.l10n) ("emptylist")
        }
      </div>
    </ListView>
  )
}
