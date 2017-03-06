import * as React from 'react';
import IconButton from '../../components/IconButton';
import NumberBox from '../../components/NumberBox';
import createOverlay from '../../utils/createOverlay';
import AttributeBorder from './AttributeBorder';
import AttributesRemovePermanent from './AttributesRemovePermanent';

interface Props {
	redeemed: number;
	lost: number;
	phase: number;
	redeem(): void;
	removeRedeemed(): void;
	removePermanent(value: number): void;
}

export default (props: Props) => {
	const { phase, redeem, removePermanent, removeRedeemed, redeemed, lost } = props;
	const available = lost - redeemed;

	return (
		<AttributeBorder value={available}>
			{ phase === 2 ? (
				<NumberBox max={lost} />
			) : null }
			{ phase === 2 ? (
				<IconButton
					className="add"
					icon="&#xE145;"
					onClick={removeRedeemed}
					disabled={lost <= available}
					/>
			) : null }
			{ phase === 3 ? (
				<IconButton
					className="add"
					icon="&#xE318;"
					onClick={() => createOverlay(<AttributesRemovePermanent remove={removePermanent} />)}
					disabled={available > 0}
					/>
			) : null }
			<IconButton
				className="remove"
				icon="&#xE15B;"
				onClick={redeem}
				disabled={available <= 0}
				/>
		</AttributeBorder>
	);
};
