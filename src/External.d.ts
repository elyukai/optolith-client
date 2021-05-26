declare module "react-progress-arc" {
  interface Props {
    completed: number
    diameter?: number
    strokeWidth?: number
  }

  // eslint-disable-next-line react/prefer-stateless-function
  class ProgressArc extends React.Component<Props> {}

  export = ProgressArc
}

declare module "react-textfit" {
  interface TextfitProps {
    className?: string

    /**
     * Algorithm to fit the text. Use single for headlines and multi for
     * paragraphs.
     * @default `multi`
     */
    mode?: "single" | "multi"

    /**
     * When `mode` is `single` and `forceSingleModeWidth` is `true`, the
     * element's height will be ignored.
     * @default `true`
     */
    forceSingleModeWidth?: boolean

    /**
     * Minimum font size in pixel.
     * @default `1`
     */
    min?: number

    /**
     * Maximum font size in pixel.
     * @default `100`
     */
    max?: number

    /**
     * Window resize throttle in milliseconds.
     * @default `50`
     */
    throttle?: number

    /**
     * Will be called when text is fitted.
     */
    onReady? (): void
  }

  // eslint-disable-next-line react/prefer-stateless-function
  export class Textfit extends React.Component<TextfitProps> {}
}

declare namespace Intl {
  export function getCanonicalLocales (locales: string | string[]): string[]

  export class RelativeTimeFormat {
      constructor (locale: string);
  }

  export class ListFormat {
      constructor (locale: string, options?: ListFormatOptions);

      format (list: Iterable<string>): string;
  }

  export type ListFormatOptions = {
    localeMatcher?: "lookup" | "best fit"
    type: "conjunction" | "disjunction" | "unit"
    style?: "long"
  } | {
    localeMatcher?: "lookup" | "best fit"
    type: "unit"
    style: "short" | "narrow"
  }
}
