import { equals } from "../../Data/Eq";
import { fmap } from "../../Data/Functor";
import { find, List, map } from "../../Data/List";
import { Maybe, maybe, sum } from "../../Data/Maybe";
import { Record } from "../../Data/Record";
import { AttributeDependent } from "../Models/ActiveEntries/AttributeDependent";
import { AttributeCombined } from "../Models/View/AttributeCombined";
import { Attribute } from "../Models/Wiki/Attribute";
import { pipe } from "./pipe";

const { stateEntry, wikiEntry } = AttributeCombined.A
const { id, short } = Attribute.A
const { value } = AttributeDependent.A

/**
 * If `attributeValueVisibility` is `True`, this function returns a string of
 * attribute values based on the passed id list, separated by "/".
 *
 * If `attributeValueVisibility` is `False`, this function returns a string of
 * attribute abbreviations based on the passed id list, separated by "/".
 */
export const getAttributeStringByIdList =
  (attributeValueVisibility: boolean) =>
  (attributes: List<Record<AttributeCombined>>) =>
    pipe (
      map<string, string | number> (
        pipe (
          findAttribute (attributes),
          getValuesOrShorts (attributeValueVisibility)
        )
      ),
      List.intercalate ("/")
    )

const findAttribute =
  (attributes: List<Record<AttributeCombined>>) =>
  (x: string) =>
    find<Record<AttributeCombined>> (pipe (wikiEntry, id, equals (x)))
                                    (attributes)

type ValuesOrShorts = (x: Maybe<Record<AttributeCombined>>) => string | number

/**
 * Returns list of values (`True`) or list of abbreviations (`False`) based on
 * the passed boolean.
 */
const getValuesOrShorts =
  (attributeValueVisibility: boolean): ValuesOrShorts =>
    attributeValueVisibility
      ? pipe (fmap (pipe (stateEntry, value)), sum)
      : maybe ("") (pipe (wikiEntry, short))
