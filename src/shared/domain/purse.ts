import type { Purse as RawPurse } from "@optolith/character-schema/types"
import { observable } from "mobx"

/**
 * The money the character owns.
 */
export class Purse {
  /**
   * The number of kreutzers the character owns.
   */
  @observable accessor kreutzers = 0

  /**
   * The number of halers the character owns.
   */
  @observable accessor halers = 0

  /**
   * The number of silverthalers the character owns.
   */
  @observable accessor silverthalers = 0

  /**
   * The number of ducats the character owns.
   */
  @observable accessor ducats = 0

  constructor(raw?: RawPurse) {
    this.kreutzers = raw?.kreutzers ?? 0
    this.halers = raw?.halers ?? 0
    this.silverthalers = raw?.silverthalers ?? 0
    this.ducats = raw?.ducats ?? 0
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
