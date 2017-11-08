import * as React from 'react';
import { IconButton } from '../../components/IconButton';
import { ListItem } from '../../components/ListItem';
import { ListItemButtons } from '../../components/ListItemButtons';
import { ListItemName } from '../../components/ListItemName';
import { ListItemSeparator } from '../../components/ListItemSeparator';
import { ListItemValues } from '../../components/ListItemValues';
import { AttributeInstance, Instance, SecondaryAttribute } from '../../types/data.d';
import { DCIds } from '../../utils/derivedCharacteristics';

export interface SkillListItemProps {
	activateDisabled?: boolean;
	addDisabled?: boolean;
	addFillElement?: boolean;
	addValues?: Array<{ className: string; value?: string | number }>;
	check?: string[];
	checkDisabled?: boolean;
	checkmod?: 'SPI' | 'TOU';
	children?: React.ReactNode;
	derivedCharacteristics?: Map<DCIds, SecondaryAttribute>;
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
	selectForInfo?(id: string): void;
	get?(id: string): Instance | undefined;
}

export class SkillListItem extends React.Component<SkillListItemProps, {}> {
	showInfo = () => {
		const { selectForInfo } = this.props;
		if (selectForInfo) {
			selectForInfo(this.props.id);
		}
	}

	shouldComponentUpdate(nextProps: SkillListItemProps) {
		return this.props.sr !== nextProps.sr || this.props.children !== nextProps.children;
	}

	render() {
		const { typ, untyp, name, sr, check, checkDisabled, checkmod, get, derivedCharacteristics, selectForInfo, ic, isNotActive, activate, activateDisabled, addPoint, addDisabled, removePoint, removeDisabled, addValues = [], children, addFillElement, noIncrease, insertTopMargin } = this.props;

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
					<div key={attr + index} className={'check ' + attr}>{get && (get(attr) as AttributeInstance).short}</div>
				));
				if (checkmod && derivedCharacteristics) {
					const characteristic = derivedCharacteristics.get(checkmod);
					if (characteristic) {
						values.push(<div key="mod" className="check mod">+{characteristic.short}</div>);
					}
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
				<IconButton icon="&#xE916;" onClick={activate} disabled={activateDisabled} flat />
				{selectForInfo && <IconButton icon="&#xE912;" flat onClick={this.showInfo} />}
			</ListItemButtons>
		) : (
			<ListItemButtons>
				{addPoint && <IconButton icon="&#xE908;" onClick={addPoint} disabled={addDisabled} flat />}
				{removePoint && (
					<IconButton
						icon={ic && sr === 0 && !removeDisabled || !ic ? '\uE90b' : '\uE909'}
						onClick={removePoint}
						disabled={removeDisabled}
						flat
						/>
				)}
				<IconButton icon="&#xE912;" flat onClick={this.showInfo} disabled={!selectForInfo} />
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
