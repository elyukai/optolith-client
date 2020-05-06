export interface RawHero {
  /**
   * A date in milliseconds with the `H_` prefix.
   */
  id: string

  /**
   * The name of the hero.
   */
  name: string

  /**
   * The date of creation.
   */
  dateCreated: string

  /**
   * The date of last modification.
   */
  dateModified: string

  /**
   * The client version the hero was created with.
   */
  clientVersion: string

  /**
   * The locale the hero was created with.
   */
  locale?: string

  /**
   * A path to an image or a base64-encoded image.
   */
  avatar?: string

  /**
   * The adventure points.
   */
  ap: {
    /**
     * The amount of total AP.
     */
    total: number
  }

  /**
   * The selected race's ID.
   */
  r?: string

  /**
   * The selected race variant's ID.
   */
  rv?: string

  /**
   * The selected culture's ID.
   */
  c?: string

  /**
   * Has the cultural package been activated?
   */
  isCulturalPackageActive?: boolean

  /**
   * The selected profession's ID.
   */
  p?: string

  /**
   * The changed profession name for a Custom Profession.
   */
  professionName?: string

  /**
   * The selected profession variant's ID.
   */
  pv?: string

  /**
   * The selected sex.
   */
  sex: "m" | "f"

  /**
   * The rules defined for this hero.
   */
  rules: {
    /**
     * Optional Rule Higher Parade Values. `0` means inactive.
     */
    higherParadeValues: number

    /**
     * Optional Rule Attribute Value Limit.
     */
    attributeValueLimit: boolean

    /**
     * If all rule books except those with adult content are enabled.
     */
    enableAllRuleBooks?: boolean

    /**
     * Explicitly enabled rule books.
     */
    enabledRuleBooks?: string[]

    /**
     * Optional Rule Language Specializations
     */
    enableLanguageSpecializations: boolean
  }

  /**
   * The creation phase. `1` is RCP selection, `2` standard hero creation and
   * `3` after hero creation.
   */
  phase: number

  /**
   * Personal Data
   */
  pers: {
    family?: string
    placeofbirth?: string
    dateofbirth?: string
    age?: string
    haircolor?: number
    eyecolor?: number
    size?: string
    weight?: string
    title?: string
    socialstatus?: number
    characteristics?: string
    otherinfo?: string
    cultureAreaKnowledge?: string
  }

  /**
   * A dictionary of active advantages, disadvantages and special abilities,
   * where the key is the ID of the entry and the value are the options.
   */
  activatable: {
    [id: string]: {
      sid?: string | number
      sid2?: string | number
      sid3?: string | number
      tier?: number
      cost?: number
    }[]
  }

  /**
   * Attributes and energy settings. Either the older version with attribute
   * values as tuples or the newer version with objects as attribute values and
   * a separate value for the selected attribute with adjustment.
   */
  attr: {
    /**
     * An array of attribute tuples. The first elememt is the ID, the second the
     * value and the third the attribute adjustment.
     */
    values: [string, number, number][]
    lp: number
    ae: number
    kp: number
    permanentLP?: {
      lost: number
    }
    permanentAE: {
      lost: number
      redeemed: number
    }
    permanentKP: {
      lost: number
      redeemed: number
    }
  } | {
    /**
     * The list of attributes and their values.
     */
    values: { id: string; value: number }[]
    attributeAdjustmentSelected: string
    lp: number
    ae: number
    kp: number
    permanentLP?: {
      lost: number
    }
    permanentAE: {
      lost: number
      redeemed: number
    }
    permanentKP: {
      lost: number
      redeemed: number
    }
  }

  /**
   * A dictionary of active skills, where the key is the ID of the skill and the
   * value is the SR.
   */
  talents: { [id: string]: number }

  /**
   * A dictionary of active combat techniques, where the key is the ID of the
   * combat technique and the value is the CtR.
   */
  ct: { [id: string]: number }

  /**
   * A dictionary of active spells, where the key is the ID of the spell and the
   * value is the SR. A spell listed here is always activated, all others are
   * inactive.
   */
  spells: { [id: string]: number }

  /**
   * Activated cantrips by ID.
   */
  cantrips: string[]

  /**
   * A dictionary of active liturgical chants, where the key is the ID of the
   * liturgical chant and the value is the SR. A liturgical chant listed here is
   * always activated, all others are inactive.
   */
  liturgies: { [id: string]: number }

  /**
   * Activated blessings by ID.
   */
  blessings: string[]

  /**
   * The belongings of the hero.
   */
  belongings: {
    /**
     * A dictionary of items, where the key is the ID of the item and the value
     * are the item's values.
     */
    items: {
      [id: string]: {
        id: string
        price?: number
        weight?: number
        template?: string
        imp?: number
        gr: number
        combatTechnique?: string
        damageDiceNumber?: number
        damageDiceSides?: number
        damageFlat?: number
        primaryThreshold?: {
          /**
           * May be either `string` (before `1.3.0-alpha.2`) or
           * `string | [string, string]`.
           */
          primary?: string | [string, string]
          threshold: number | number[]
        }
        at?: number
        pa?: number
        reach?: number
        length?: number

        /**
         * May be either `string | number` (before `1.1.0-alpha.9`), `string`
         * (before `1.3.0-alpha.2`) or `number | number[]`.
         */
        stp?: string | number | number[]
        range?: number[]

        /**
         * May be either `string | number` (before `1.1.0-alpha.9`), `string`
         * (before `1.3.0-alpha.2`) or `number | number[]`.
         */
        reloadTime?: string | number | number[]
        ammunition?: string
        pro?: number
        enc?: number
        addPenalties?: boolean
        isParryingWeapon?: boolean
        isTwoHandedWeapon?: boolean
        armorType?: number
        iniMod?: number
        movMod?: number
        stabilityMod?: number
        name: string
        amount: number
        isTemplateLocked: boolean
        loss?: number
        forArmorZoneOnly?: boolean
        where?: string
      }
    }

    /**
     * A dictionary of hit zone armors, where the key is the ID of the hit zone
     * armor and the value are the hit zone armor's values.
     */
    armorZones?: {
      [id: string]: {
        id: string
        name: string
        head?: string
        headLoss?: number
        leftArm?: string
        leftArmLoss?: number
        rightArm?: string
        rightArmLoss?: number
        torso?: string
        torsoLoss?: number
        leftLeg?: string
        leftLegLoss?: number
        rightLeg?: string
        rightLegLoss?: number
      }
    }

    /**
     * The money of the hero.
     */
    purse: {
      d: string
      s: string
      h: string
      k: string
    }
  }

  /**
   * A dictionary of pets, where the key is the ID of the pet and the value are
   * the pet's values.
   */
  pets?: {
    [id: string]: {
      id: string
      name: string
      avatar?: string
      size?: string
      type?: string
      attack?: string
      dp?: string
      reach?: string
      actions?: string
      talents?: string
      skills?: string
      notes?: string
      spentAp?: string
      totalAp?: string
      cou?: string
      sgc?: string
      int?: string
      cha?: string
      dex?: string
      agi?: string
      con?: string
      str?: string
      lp?: string
      ae?: string
      spi?: string
      tou?: string
      pro?: string
      ini?: string
      mov?: string
      at?: string
      pa?: string
    }
  }

  /**
   * The pact, if applicable.
   */
  pact?: {
    category: number
    level: number
    type: number
    domain: number | string
    name: string
  }
}
