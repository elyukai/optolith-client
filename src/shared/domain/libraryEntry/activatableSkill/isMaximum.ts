import { Translate } from "../../../utils/translate.ts"
import { ResponsiveTextSize, responsive } from "../responsiveText.ts"

/**
 * Returns the text to prepend for the `is_maximum` property.
 */
export const getTextForIsMaximum = (
  is_maximum: boolean | undefined,
  translate: Translate,
  responsiveText: ResponsiveTextSize,
): string => {
  if (is_maximum !== true) {
    return ""
  }

  return responsive(
    responsiveText,
    () => translate("no more than "),
    () => translate("max. "),
  )
}
