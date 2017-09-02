declare module 'react-progress-arc' {
	interface Props {
		completed: number;
		diameter?: number;
		strokeWidth?: number;
	}

	class ProgressArc extends React.Component<Props, any> {}

	export = ProgressArc;
}

declare module 'react-gemini-scrollbar' {
	interface Props {
		className?: string;
	}

	class GeminiScrollbar extends React.Component<Props, any> {}

	export = GeminiScrollbar;
}
