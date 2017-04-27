import * as React from 'react';
import { IconButton } from '../../components/IconButton';
import { ListItem } from '../../components/ListItem';
import { ListItemButtons } from '../../components/ListItemButtons';
import { ListItemName } from '../../components/ListItemName';
import { ListItemSeparator } from '../../components/ListItemSeparator';
import { ListItemValues } from '../../components/ListItemValues';
import { get } from '../../stores/ListStore';
import { AttributeInstance } from '../../types/data.d';
import { createOverlay } from '../../utils/createOverlay';
import { SkillInfo } from './SkillInfo';

export interface SkillListItemProps {
	activateDisabled?: boolean;
	addDisabled?: boolean;
	addFillElement?: boolean;
	addValues?: Array<{ className: string; value?: string | number }>;
	check?: string[];
	checkDisabled?: boolean;
	checkmod?: string;
	enableInfo?: boolean;
	ic?: number;
	id: string;
	insertTopMargin?: boolean;
	isNotActive?: boolean;
	name: string;
	noIncrease?: boolean;
	removeDisabled?: boolean;
	sr?: number;
	typ?: boolean;
	untyp?: boolean;
	activate?(): void;
	addPoint?(): void;
	removePoint?(): void;
}

export class SkillListItem extends React.Component<SkillListItemProps, {}> {
	showInfo = () => createOverlay(<SkillInfo id={this.props.id} />);

	render() {
		const { typ, untyp, name, sr, check, checkDisabled, checkmod, enableInfo, ic, isNotActive, activate, activateDisabled, addPoint, addDisabled, removePoint, removeDisabled, addValues = [], children, addFillElement, noIncrease, insertTopMargin } = this.props;

		const values: JSX.Element[] = [];

		if (typeof sr === 'number') {
			values.push(<div key="sr" className="sr">{sr}</div>);
		}
		else if (!addPoint && !isNotActive && !noIncrease) {
			values.push(<div key="sr"  className="sr empty"></div>);
		}

		if (!checkDisabled) {
			if (check) {
				check.forEach((attr, index) => values.push(
					<div key={attr + index} className={'check ' + attr}>{(get(attr) as AttributeInstance).short}</div>
				));
				if (checkmod) {
					values.push(<div key="mod" className="check mod">+{checkmod}</div>);
				}
			}
		}

		const COMP = ['A', 'B', 'C', 'D', 'E'];

		if (addFillElement) {
			values.push(<div key="fill" className="fill"></div>);
		}

		if (ic) {
			values.push(<div key="ic" className="ic">{COMP[ic - 1]}</div>);
		}

		values.push(...addValues.map(e => <div key={e.className} className={e.className}>{e.value}</div>));

		const btnElement = isNotActive ? (
			<ListItemButtons>
				<IconButton icon="&#xE03B;" onClick={activate} disabled={activateDisabled} flat />
			</ListItemButtons>
		) : (
			<ListItemButtons>
				{ addPoint ? <IconButton icon="&#xE145;" onClick={addPoint} disabled={addDisabled} flat /> : null }
				{ removePoint ? (
					<IconButton
						icon={ic && sr === 0 && !removeDisabled || !ic ? '\uE872' : '\uE15B'}
						onClick={removePoint}
						disabled={removeDisabled}
						flat
						/>
				) : null }
				<IconButton icon="&#xE88F;" flat onClick={this.showInfo} disabled={!enableInfo} />
			</ListItemButtons>
		);

		return (
			<ListItem noIncrease={noIncrease} recommended={typ} unrecommended={untyp} insertTopMargin={insertTopMargin}>
				<ListItemName name={name} />
				<ListItemSeparator />
				{children}
				<ListItemValues>
					{values}
				</ListItemValues>
				{btnElement}
			</ListItem>
		);
	}
}
