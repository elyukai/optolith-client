import * as React from 'react';
import classNames from 'classnames';

export interface MainSheetAttributesItem {
	add?: number,
	calc: string,
	empty?: boolean,
	label: string,
	max?: number,
	purchased?: number,
	subArray?: number[],
	subLabel?: string,
	value: number | string;
}

export default (props: MainSheetAttributesItem) => {
	let max = props.empty ? '-' : props.value + props.add;
	if (!props.empty) {
		if (props.purchased !== null) max += props.purchased;
		if (props.max) max += props.max;
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
				<div className={classNames(
					'purchased',
					props.purchased === null && 'blocked'
				)}>{ props.purchased === null ? '\uE14B' : props.empty ? '-' : props.purchased}</div>
				<div className="max">{max}</div>
				{
					props.subArray ? props.subArray.map(
						(value, index) => <div key={props.label + index} className="sub">{props.empty ? '-' : value}</div>
					) : null
				}
			</div>
		</div>
	);
}
