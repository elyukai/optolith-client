import * as React from 'react';
import IconButton from '../../components/IconButton';
import NumberBox from '../../components/NumberBox';
import createOverlay from '../../utils/createOverlay';
import AttributeBorder from './AttributeBorder';
import AttributesRemovePermanent from './AttributesRemovePermanent';

interface Props {
	label: string;
	name: string;
	redeemed: number;
	lost: number;
	phase: number;
	redeem(): void;
	removeRedeemed(): void;
	removePermanent(value: number): void;
}

export default (props: Props) => {
	const { label, name, phase, redeem, removePermanent, removeRedeemed, redeemed, lost } = props;
	const available = lost - redeemed;

	return (
		<AttributeBorder
			label={label}
			value={available}
			tooltip={<div className="calc-attr-overlay">
				<h4><span>{name}</span><span>{available}</span></h4>
				<p>Gesamt verloren: {lost}</p>
				<p>Zurückgekauft: {redeemed}</p>
			</div>}
			tooltipMargin={7}
			>
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
