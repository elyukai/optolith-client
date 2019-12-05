import * as React from "react";
import { fmap } from "../../../Data/Functor";
import { List, map, toArray } from "../../../Data/List";
import { Maybe, maybe } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { AttributeWithRequirements } from "../../Models/View/AttributeWithRequirements";
import { Attribute } from "../../Models/Wiki/Attribute";
import { pipe_ } from "../../Utilities/pipe";
import { AttributeListItem } from "./AttributeListItem";

export interface AttributeListProps {
  attributes: Maybe<List<Record<AttributeWithRequirements>>>
  isInCharacterCreation: boolean
  isRemovingEnabled: boolean
  maxTotalAttributeValues: Maybe<number>
  sum: number
  addPoint (id: string): void
  removePoint (id: string): void
}

export const AttributeList: React.FC<AttributeListProps> = props => {
  const {
    attributes,
    isInCharacterCreation,
    isRemovingEnabled,
    maxTotalAttributeValues,
    sum,
    addPoint,
    removePoint,
  } = props

  return (
    <div className="main">
      {pipe_ (
        attributes,
        fmap (map (
          attr => (
            <AttributeListItem
              key={pipe_ (attr, AttributeWithRequirements.A.wikiEntry, Attribute.A.id)}
              attribute={attr}
              isInCharacterCreation={isInCharacterCreation}
              isRemovingEnabled={isRemovingEnabled}
              maxTotalAttributeValues={maxTotalAttributeValues}
              sum={sum}
              addPoint={addPoint}
              removePoint={removePoint}
              />
          )
        )),
        maybe<JSX.Element[]> ([]) (toArray)
      )}
    </div>
  )
}
