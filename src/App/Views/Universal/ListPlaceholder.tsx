import * as React from "react";
import { List } from "../../../Data/List";
import { guardReplace, Just, orN } from "../../../Data/Maybe";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { classListMaybe } from "../../Utilities/CSS";
import { translate } from "../../Utilities/I18n";
import { IconButton } from "./IconButton";
import { ListView } from "./List";
import { ListItem } from "./ListItem";
import { ListItemButtons } from "./ListItemButtons";
import { ListItemName } from "./ListItemName";
import { ListItemSeparator } from "./ListItemSeparator";
import { ListItemValues } from "./ListItemValues";

export type ListPlaceholderType = "races"
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

interface Props {
  l10n: L10nRecord
  noResults?: boolean
  wikiInitial?: boolean
  type?: ListPlaceholderType
}

export const ListPlaceholder: React.FC<Props> = props => {
  const { l10n, noResults, type = "advantages", wikiInitial } = props
  let placeholder: JSX.Element | undefined = undefined

  switch (type) {
    case "races":
    case "professions":
      placeholder = (
        <ListItem className="placeholder">
          <ListItemName name="" />
          <ListItemSeparator />
          <ListItemValues>
            <div className="cost"><div className="placeholder-text" /></div>
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
          <ListItemSeparator />
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
          <ListItemSeparator />
          <ListItemValues>
            <div className="cost"><div className="placeholder-text" /></div>
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
          <ListItemSeparator />
          <ListItemValues>
            <div className="cost"><div className="placeholder-text" /></div>
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
          <ListItemSeparator />
          <ListItemValues>
            <div className="sr" />
            <div className="check" />
            <div className="check" />
            <div className="check" />
            <div className="fill" />
            <div className="ic" />
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
          <ListItemSeparator />
          <ListItemValues>
            <div className="sr" />
            <div className="check" />
            <div className="check" />
            <div className="check" />
            <div className="fill" />
            <div className="ic" />
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
          <ListItemSeparator />
          <ListItemValues>
            <div className="sr" />
            <div className="ic" />
            <div className="primary" />
            <div className="at" />
            <div className="atpa" />
            <div className="pa" />
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
          <ListItemSeparator />
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
          <ListItemSeparator />
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
          <ListItemSeparator />
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
          <ListItemSeparator />
        </ListItem>
      )
      break

    default:
      placeholder = undefined
  }

  return (
    <ListView
      className={
        classListMaybe (List (
          Just ("placeholder-wrapper"),
          guardReplace ([
                         "advantages",
                         "disadvantages",
                         "specialAbilities",
                         "inactiveAdvantages",
                         "inactiveDisadvantages",
                         "inactiveSpecialAbilities",
                       ].includes (type))
                       ("increased-padding")
        ))
      }
      >
      {placeholder}
      {placeholder}
      {placeholder}
      {placeholder}
      {placeholder}
      <div
        className={
          classListMaybe (List (
            Just ("placeholder-message"),
            guardReplace (orN (wikiInitial)) ("wiki-initial")
          ))
        }
        >
        {
          orN (wikiInitial)
            ? translate (l10n) ("chooseacategorytodisplayalist")
            : orN (noResults)
            ? translate (l10n) ("emptylistnoresults")
            : translate (l10n) ("emptylist")
        }
      </div>
    </ListView>
  )
}
