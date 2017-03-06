import classNames from 'classnames';
import * as React from 'react';

export interface MainSheetAttributesItem {
	add?: number;
	calc: string;
	empty?: boolean;
	label: string;
	max?: number;
	purchased?: number;
	subArray?: number[];
	subLabel?: string;
	value: number | string;
}

export default (props: MainSheetAttributesItem) => {
	const { add = 0, value, purchased, max } = props;
	let final;
	if (typeof value === 'string') {
		final = '-';
	}
	else {
		final = value + add;
		if (purchased) {
			final += purchased;
		}
		if (max) {
			final += max;
		}
	}

	return (
		<div>
			<div className="label">
				<h3>{props.label}</h3>
				<span className="calc">{props.calc}</span>
				{
					props.subLabel ? (
						<span className="sub">{props.subLabel}:</span>
					) : null
				}
			</div>
			<div className="values">
				<div className="base">{props.empty ? '-' : props.value}</div>
				<div className="add">{props.empty ? '-' : props.add}</div>
				<div
					className={classNames({
						'blocked': props.purchased === null,
						'purchased': true,
					})}
					>
					{ props.purchased === null ? '\uE14B' : props.empty ? '-' : props.purchased}
				</div>
				<div className="max">{final}</div>
				{
					props.subArray ? props.subArray.map(
						(value, index) => <div key={props.label + index} className="sub">{props.empty ? '-' : value}</div>,
					) : null
				}
			</div>
		</div>
	);
};
