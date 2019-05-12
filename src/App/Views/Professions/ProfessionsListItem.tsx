import * as React from "react";
import { flip } from "../../../Data/Function";
import { fmap, fmapF } from "../../../Data/Functor";
import { notNull, toArray } from "../../../Data/List";
import { bind, fromMaybe, mapMaybe, Maybe, maybe } from "../../../Data/Maybe";
import { lookupF } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { Sex } from "../../Models/Hero/heroTypeHelpers";
import { ProfessionCombined, ProfessionCombinedA_ } from "../../Models/View/ProfessionCombined";
import { Book } from "../../Models/Wiki/Book";
import { SourceLink } from "../../Models/Wiki/sub/SourceLink";
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { getNameBySex, getNameBySexM } from "../../Utilities/rcpUtils";
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
  wiki: WikiModelRecord
  selectProfession (id: string): void
  showAddSlidein (): void
}

const PCA_ = ProfessionCombinedA_

export function ProfessionsListItem (props: ProfessionsListItemProps) {
  const {
    showAddSlidein,
    currentProfessionId,
    profession,
    selectProfession,
    sex: msex,
    wiki,
  } = props

  const professionName = fmapF (msex) (flip (getNameBySex) (PCA_.name (profession)))

  const professionSubName = bind (msex) (flip (getNameBySexM) (PCA_.subname (profession)))

  const fullName = fmapF (professionName)
                         (name => maybe (name)
                                        ((subname: string) => `${name} (${subname})`)
                                        (professionSubName))

  const id = PCA_.id (profession)
  const src = PCA_.src (profession)

  return (
    <ListItem active={Maybe.elem (id) (currentProfessionId)}>
      <ListItemName name={fromMaybe ("") (fullName)} />
      <ListItemSeparator />
      {notNull (src)
        ? (
            <ListItemGroup small>
              {pipe_ (
                src,
                mapMaybe (pipe (
                  SourceLink.A.id,
                  lookupF (WikiModel.A.books (wiki)),
                  fmap (book => <span key={Book.A.id (book)}>{Book.A.short (book)}</span>)
                )),
                toArray
              )}
            </ListItemGroup>
          )
        : null}
      <ListItemValues>
        <div className="cost">{PCA_.ap (profession)}</div>
      </ListItemValues>
      <ListItemButtons>
        <IconButton
          icon="&#xE90a;"
          onClick={() => selectProfession (id)}
          disabled={Maybe.elem (id) (currentProfessionId)}
          />
        <IconButton
          icon="&#xE90e;"
          onClick={showAddSlidein}
          disabled={Maybe.notElem (id) (currentProfessionId)}
          />
      </ListItemButtons>
    </ListItem>
  )
}
