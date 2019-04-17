import * as React from "react";
import { Sex } from "../../Models/Hero/heroTypeHelpers";
import { ProfessionCombined } from "../../Models/View/viewTypeHelpers";
import { Book, NameBySex, SourceLink, WikiAll } from "../../Models/Wiki/wikiTypeHelpers";
import { IconButton } from "../Universal/IconButton";
import { ListItem } from "../Universal/ListItem";
import { ListItemButtons } from "../Universal/ListItemButtons";
import { ListItemGroup } from "../Universal/ListItemGroup";
import { ListItemName } from "../Universal/ListItemName";
import { ListItemSeparator } from "../Universal/ListItemSeparator";
import { ListItemValues } from "../Universal/ListItemValues";

export interface ProfessionsListItemProps {
  currentProfessionId: Maybe<string>
  currentProfessionVariantId: Maybe<string>
  profession: Record<ProfessionCombined>
  sex: Maybe<Sex>
  wiki: Record<WikiAll>
  selectProfession (id: string): void
  showAddSlidein (): void
}

export function ProfessionsListItem (props: ProfessionsListItemProps) {
  const {
    showAddSlidein,
    currentProfessionId,
    profession,
    selectProfession,
    sex: maybeSex,
    wiki,
  } = props

  const professionName = maybeSex
    .fmap (
      sex => {
        const name = profession .get ("name")

        return name instanceof Record ? name .get (sex) : name
      }
    )

  const professionSubName =
    Maybe.liftM2<Sex, string | Record<NameBySex>, string>
      (sex => subname => subname instanceof Record ? subname .get (sex) : subname)
      (maybeSex)
      (profession .lookup ("subname"))

  const fullName = professionName
    .fmap (
      name => Maybe.maybe<string, string>
        (name)
        (subname => `${name} (${subname})`)
        (professionSubName)
    )

  const src = profession .get ("src")

  return (
    <ListItem active={Maybe.elem (profession .get ("id")) (currentProfessionId)}>
      <ListItemName name={Maybe.fromMaybe ("") (fullName)} />
      <ListItemSeparator />
      {!src .null () && (
        <ListItemGroup small>
          {
            Maybe.mapMaybe<Record<SourceLink>, Record<Book>>
              (e => wiki .get ("books") .lookup (e .get ("id")))
              (src)
              .map (
                e => (
                  <span key={e .get ("id")}>
                    {e .get ("short")}
                  </span>
                )
              )
              .toArray ()
          }
        </ListItemGroup>
      )}
      <ListItemValues>
        <div className="cost">{profession .get ("ap")}</div>
      </ListItemValues>
      <ListItemButtons>
        <IconButton
          icon="&#xE90a"
          onClick={() => selectProfession (profession .get ("id"))}
          disabled={Maybe.elem (profession .get ("id")) (currentProfessionId)}
          />
        <IconButton
          icon="&#xE90e"
          onClick={showAddSlidein}
          disabled={Maybe.notElem (profession .get ("id")) (currentProfessionId)}
          />
      </ListItemButtons>
    </ListItem>
  )
}
