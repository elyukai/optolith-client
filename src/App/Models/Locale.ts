import { fromDefault } from "../../Data/Record"

export interface Locale {
  "@@name": "Locale"

  /**
   * IETF language tag (BCP47).
   */
  id: string
  name: string
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Locale =
  fromDefault ("Locale")
              <Locale> ({
                id: "",
                name: "",
              })
