import * as React from 'react';
import { IconButton } from '../../components/IconButton';
import { NumberBox } from '../../components/NumberBox';
import { AttributeWithRequirements } from '../../types/view.d';
import { AttributeBorder } from './AttributeBorder';

export interface AttributeListItemProps {
	attribute: AttributeWithRequirements;
	phase: number;
	addPoint(id: string): void;
	removePoint(id: string): void;
}

export class AttributeListItem extends React.Component<AttributeListItemProps, {}> {
	render() {
		const { attribute, phase } = this.props;
		const { id, short, name, value, max, min } = attribute;

		const valueHeader = phase === 2 ? `${value} / ${max}` : value;

		return (
			<AttributeBorder className={id} label={short} value={value} tooltip={<div className="calc-attr-overlay">
					<h4><span>{name}</span><span>{valueHeader}</span></h4>
				</div>} tooltipMargin={11}>
				{phase === 2 &&
					<NumberBox max={max || 0} />
				}
				<IconButton
					className="add"
					icon="&#xE145;"
					onClick={this.props.addPoint.bind(null, id)}
					disabled={max ? value >= max : undefined}
					/>
				{phase === 2 &&
					<IconButton
						className="remove"
						icon="&#xE15B;"
						onClick={this.props.removePoint.bind(null, id)}
						disabled={value <= min}
						/>
				}
			</AttributeBorder>
		);
	}
}
