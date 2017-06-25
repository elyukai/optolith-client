import * as React from 'react';
import { IconButton } from '../../components/IconButton';
import { NumberBox } from '../../components/NumberBox';
import { AttributeInstance, ExperienceLevel } from '../../types/data.d';
import { isDecreasable, isIncreasable } from '../../utils/AttributeUtils';
import { AttributeBorder } from './AttributeBorder';

export interface AttributeListItemProps {
	attribute: AttributeInstance;
	el: ExperienceLevel;
	phase: number;
	addPoint(id: string): void;
	removePoint(id: string): void;
}

export class AttributeListItem extends React.Component<AttributeListItemProps, {}> {
	render() {
		const { attribute, el, phase } = this.props;
		const { id, short, name, value, mod } = attribute;

		const valueHeader = phase === 2 ? `${value} / ${el.maxAttributeValue + mod}` : value;

		return (
			<AttributeBorder className={id} label={short} value={value} tooltip={<div className="calc-attr-overlay">
					<h4><span>{name}</span><span>{valueHeader}</span></h4>
				</div>} tooltipMargin={11}>
				{phase === 2 &&
					<NumberBox max={el.maxAttributeValue + mod} />
				}
				<IconButton
					className="add"
					icon="&#xE145;"
					onClick={this.props.addPoint.bind(null, id)}
					disabled={!isIncreasable(attribute)}
					/>
				{phase === 2 &&
					<IconButton
						className="remove"
						icon="&#xE15B;"
						onClick={this.props.removePoint.bind(null, id)}
						disabled={!isDecreasable(attribute)}
						/>
				}
			</AttributeBorder>
		);
	}
}
