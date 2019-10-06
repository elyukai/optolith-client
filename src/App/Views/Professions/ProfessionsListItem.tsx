import * as React from "react";
import { useDispatch } from "react-redux";
import { flip } from "../../../Data/Function";
import { fmap, fmapF } from "../../../Data/Functor";
import { notNull, toArray } from "../../../Data/List";
import { bind, fromMaybe, mapMaybe, Maybe, maybe, maybeRNull } from "../../../Data/Maybe";
import { lookupF } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { selectProfession } from "../../Actions/ProfessionActions";
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
  showAddSlidein (): void
}

const PCA_ = ProfessionCombinedA_

export function ProfessionsListItem (props: ProfessionsListItemProps) {
  const {
    showAddSlidein,
    currentProfessionId,
    profession,
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

  const dispatch = useDispatch ()

  const handleProfessionSelect =
    React.useCallback (
      () => dispatch (selectProfession (id)),
      [dispatch]
    )

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
        {maybeRNull ((cost: number) => <div className="cost">{cost}</div>)
                    (PCA_.ap (profession))}
      </ListItemValues>
      <ListItemButtons>
        <IconButton
          icon="&#xE90a;"
          onClick={handleProfessionSelect}
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
