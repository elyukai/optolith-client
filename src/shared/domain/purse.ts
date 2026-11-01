import type { Purse as RawPurse } from "@optolith/character-schema/types"
import { observable } from "mobx"

/**
 * The money the character owns.
 */
export class Purse {
  /**
   * The number of kreutzers the character owns.
   */
  @observable accessor kreutzers: number = 0

  /**
   * The number of halers the character owns.
   */
  @observable accessor halers: number = 0

  /**
   * The number of silverthalers the character owns.
   */
  @observable accessor silverthalers: number = 0

  /**
   * The number of ducats the character owns.
   */
  @observable accessor ducats: number = 0

  static fromJSON(raw: RawPurse): Purse {
    const purse = new Purse()
    purse.kreutzers = raw.kreutzers
    purse.halers = raw.halers
    purse.silverthalers = raw.silverthalers
    purse.ducats = raw.ducats
    return purse
  }

  toJSON(): RawPurse {
    return {
      kreutzers: this.kreutzers,
      halers: this.halers,
      silverthalers: this.silverthalers,
      ducats: this.ducats,
    }
  }
}
