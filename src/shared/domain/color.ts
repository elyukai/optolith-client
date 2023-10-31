/**
 * An eye or hair color selection.
 */
export type Color = PredefinedColor | CustomColor

/**
 * A predefined color.
 */
export type PredefinedColor = {
  type: "Predefined"

  /**
   * The color identifier.
   */
  id: number
}

/**
 * A custom color.
 */
export type CustomColor = {
  type: "Custom"

  /**
   * The custom color name.
   */
  name: string
}
