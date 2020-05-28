import { Item } from "../Hero/Item"
import { ItemTemplate } from "../Wiki/ItemTemplate"

export interface ItemForView {
  id: number
  name: string
  amount: number
  price?: number
  weight?: number
  where?: string
  gr: number
}

export const itemToItemForView =
  (x: Item): ItemForView =>
    ({
      id: x.id,
      name: x.name,
      amount: x.amount ?? 1,
      price: x.price,
      weight: x.weight,
      where: x.carriedWhere,
      gr: x.gr,
    })

export const itemTemplateToItemForView =
  (x: ItemTemplate): ItemForView =>
    ({
      id: x.id,
      name: x.name,
      amount: 1,
      price: x.price,
      weight: x.weight,
      gr: x.gr,
    })
