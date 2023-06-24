import { useAppSelector } from "../../../main_window/hooks/redux.ts"
import { selectCanRemove } from "../../../main_window/selectors/characterSelectors.ts"
import { classList } from "../../utils/classList.ts"
import { assertExhaustive } from "../../utils/typeSafety.ts"
import { IconButton } from "../iconButton/IconButton.tsx"
import { List } from "./List.tsx"
import { ListItem } from "./ListItem.tsx"
import { ListItemButtons } from "./ListItemButtons.tsx"
import { ListItemName } from "./ListItemName.tsx"
import { ListItemSeparator } from "./ListItemSeparator.tsx"
import { ListItemValues } from "./ListItemValues.tsx"

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

type Props = {
  type?: ListPlaceholderType
  message: string
}

export const ListPlaceholder: React.FC<Props> = props => {
  const { type = "advantages", message } = props
  const canRemove = useAppSelector(selectCanRemove)

  const placeholder = (() => {
    switch (type) {
      case "races":
      case "professions":
        return (
          <ListItem className="placeholder">
            <ListItemName name="" />
            <ListItemSeparator />
            <ListItemValues>
              <div className="cost"><div className="placeholder-text" /></div>
            </ListItemValues>
            <ListItemButtons>
              <IconButton label="" icon="&#xE90a;" disabled />
              <IconButton label="" icon="&#xE90e;" disabled />
            </ListItemButtons>
          </ListItem>
        )

      case "cultures":
        return (
          <ListItem className="placeholder">
            <ListItemName name="" />
            <ListItemSeparator />
            <ListItemButtons>
              <IconButton label="" icon="&#xE90a;" disabled />
              <IconButton label="" icon="&#xE90e;" disabled />
            </ListItemButtons>
          </ListItem>
        )

      case "advantages":
      case "disadvantages":
      case "specialAbilities":
        return (
          <ListItem className="placeholder">
            <ListItemName name="" />
            <ListItemSeparator />
            <ListItemValues>
              <div className="cost"><div className="placeholder-text" /></div>
            </ListItemValues>
            <ListItemButtons>
              <IconButton
                label=""
                icon="&#xE90b;"
                flat
                disabled
                />
              <IconButton
                label=""
                icon="&#xE912;"
                flat
                disabled
                />
            </ListItemButtons>
          </ListItem>
        )

      case "inactiveAdvantages":
      case "inactiveDisadvantages":
      case "inactiveSpecialAbilities":
        return (
          <ListItem className="placeholder">
            <ListItemName name="" />
            <ListItemSeparator />
            <ListItemValues>
              <div className="cost"><div className="placeholder-text" /></div>
            </ListItemValues>
            <ListItemButtons>
              <IconButton
                label=""
                icon="&#xE916;"
                flat
                disabled
                />
              <IconButton
                label=""
                icon="&#xE912;"
                flat
                disabled
                />
            </ListItemButtons>
          </ListItem>
        )

      case "skills":
      case "spells":
      case "liturgicalChants":
        return (
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
              <IconButton
                label=""
                icon="&#xE908;"
                flat
                disabled
                />
              {canRemove
                ? (
                  <IconButton
                    label=""
                    icon="&#xE909;"
                    flat
                    disabled
                    />
                )
                : null}
              <IconButton
                label=""
                icon="&#xE912;"
                flat
                disabled
                />
            </ListItemButtons>
          </ListItem>
        )

      case "inactiveSpells":
      case "inactiveLiturgicalChants":
        return (
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
              <IconButton
                label=""
                icon="&#xE916;"
                flat
                disabled
                />
              <IconButton
                label=""
                icon="&#xE912;"
                flat
                disabled
                />
            </ListItemButtons>
          </ListItem>
        )

      case "combatTechniques":
        return (
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
              <IconButton
                label=""
                icon="&#xE908;"
                flat
                disabled
                />
              <IconButton
                label=""
                icon="&#xE909;"
                flat
                disabled
                />
              <IconButton
                label=""
                icon="&#xE912;"
                flat
                disabled
                />
            </ListItemButtons>
          </ListItem>
        )

      case "equipment":
        return (
          <ListItem className="placeholder">
            <ListItemName name="" />
            <ListItemSeparator />
            <ListItemButtons>
              <IconButton
                label=""
                icon="&#xE90c;"
                flat
                disabled
                />
              <IconButton
                label=""
                icon="&#xE90b;"
                flat
                disabled
                />
              <IconButton
                label=""
                icon="&#xE912;"
                flat
                disabled
                />
            </ListItemButtons>
          </ListItem>
        )

      case "itemTemplates":
        return (
          <ListItem className="placeholder">
            <ListItemName name="" />
            <ListItemSeparator />
            <ListItemButtons>
              <IconButton
                label=""
                icon="&#xE916;"
                flat
                disabled
                />
              <IconButton
                label=""
                icon="&#xE912;"
                flat
                disabled
                />
            </ListItemButtons>
          </ListItem>
        )

      case "zoneArmor":
        return (
          <ListItem className="placeholder">
            <ListItemName name="" />
            <ListItemSeparator />
            <ListItemButtons>
              <IconButton
                label=""
                icon="&#xE90c;"
                flat
                disabled
                />
              <IconButton
                label=""
                icon="&#xE90b;"
                flat
                disabled
                />
            </ListItemButtons>
          </ListItem>
        )

      case "wiki":
        return (
          <ListItem className="placeholder">
            <ListItemName name="" />
            <ListItemSeparator />
          </ListItem>
        )

      default: return assertExhaustive(type)
    }
  })()

  return (
    <List
      className={classList(
        "placeholder-wrapper",
        {
          "increased-padding": [
            "advantages",
            "disadvantages",
            "specialAbilities",
            "inactiveAdvantages",
            "inactiveDisadvantages",
            "inactiveSpecialAbilities",
          ].includes(type),
        }
      )}
      >
      {placeholder}
      {placeholder}
      {placeholder}
      {placeholder}
      {placeholder}
      <div className="placeholder-message">
        {message}
        {/* {orN(wikiInitial)
          ? translate(staticData)("wiki.chooseacategorytodisplayalist")
          : orN(noResults)
          ? translate(staticData)("general.emptylistnoresultsplaceholder")
          : translate(staticData)("general.emptylistplaceholder")} */}
      </div>
    </List>
  )
}
