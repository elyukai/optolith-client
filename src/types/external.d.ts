declare module 'react-progress-arc' {
	interface Props {
		completed: number;
		diameter?: number;
		strokeWidth?: number;
	}

	class ProgressArc extends React.Component<Props, any> {}

	export = ProgressArc;
}

declare module 'react-textfit' {
	interface TextfitProps {
		/**
		 * Algorithm to fit the text. Use single for headlines and multi for paragraphs.
		 * @default `multi`
		 */
		mode?: 'single' | 'multi';
		/**
		 * When `mode` is `single` and `forceSingleModeWidth` is `true`, the element's height will be ignored.
		 * @default `true`
		 */
		forceSingleModeWidth?: boolean;
		/**
		 * Minimum font size in pixel.
		 * @default `1`
		 */
		min?: number;
		/**
		 * Maximum font size in pixel.
		 * @default `100`
		 */
		max?: number;
		/**
		 * Window resize throttle in milliseconds.
		 * @default `50`
		 */
		throttle?: number;
		/**
		 * Will be called when text is fitted.
		 */
		onReady?(): void;
	}

	export class Textfit extends React.Component<TextfitProps> {}
}
