import { DropdownOption } from "../../components/Dropdown";
import { List } from "../../Data/List";
import { Just, Nothing } from "../../Data/Maybe";
import { Pair } from "../../Data/Pair";
import { Record } from "../../Data/Record";
import { toRoman } from "./NumberUtils";

const getElements = (max: number) =>
  List.unfoldr<Record<DropdownOption>, number>
    (current => current > max
      ? Nothing
      : current === 0
      ? Just (
        Pair
          (DropdownOption ({ name: "0" }))
          (current + 1)
      )
      : Just (
        Pair
          (DropdownOption ({ id: Just (current), name: toRoman (current) }))
          (current + 1)
      ))

export const getLevelElements = (max: number) => getElements (max) (1)

export const getLevelElementsWithZero = (max: number) => getElements (max) (0)