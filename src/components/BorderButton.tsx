import * as React from 'react';
import Button from './Button';
import Text from './Text';

interface Props {
	autoWidth?: boolean;
	children?: React.ReactNode;
	className?: string;
	disabled?: boolean;
	flat?: boolean;
	fullWidth?: boolean;
	label: string;
	primary?: boolean;
	onClick?(): void;
}

export default (props: Props) => {
	const { children, label, ...other } = props;

	return (
		<Button {...other}>
			<Text>{label || children}</Text>
		</Button>
	);
};
