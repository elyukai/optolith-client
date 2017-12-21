import * as React from 'react';
import { IconButton } from '../../components/IconButton';
import { ListItem } from '../../components/ListItem';
import { ListItemButtons } from '../../components/ListItemButtons';
import { ListItemGroup } from '../../components/ListItemGroup';
import { ListItemName } from '../../components/ListItemName';
import { ListItemSeparator } from '../../components/ListItemSeparator';
import { ListItemValues } from '../../components/ListItemValues';
import { AttributeInstance, SecondaryAttribute } from '../../types/data.d';
import { DCIds } from '../../utils/derivedCharacteristics';
import { getICName } from '../../utils/ICUtils';

export interface SkillListItemProps {
	attributes: Map<string, AttributeInstance>;
	activateDisabled?: boolean;
	addDisabled?: boolean;
	addFillElement?: boolean;
	addValues?: Array<{ className: string; value?: string | number }>;
	addText?: string;
	check?: string[];
	checkDisabled?: boolean;
	checkmod?: 'SPI' | 'TOU';
	derivedCharacteristics?: Map<DCIds, SecondaryAttribute>;
	groupList?: string[];
	groupIndex?: number;
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
}

export class SkillListItem extends React.Component<SkillListItemProps, {}> {
	showInfo = () => {
		const { selectForInfo } = this.props;
		if (selectForInfo) {
			selectForInfo(this.props.id);
		}
	}

	shouldComponentUpdate(nextProps: SkillListItemProps) {
		return this.props.sr !== nextProps.sr || this.props.addText !== nextProps.addText || this.props.attributes !== nextProps.attributes || this.props.derivedCharacteristics !== nextProps.derivedCharacteristics || this.props.typ !== nextProps.typ || this.props.untyp !== nextProps.untyp;
	}

	render() {
		const { attributes, typ, untyp, name, sr, check, checkDisabled, checkmod, derivedCharacteristics, selectForInfo, ic, isNotActive, activate, activateDisabled, addPoint, addDisabled, removePoint, removeDisabled, addValues = [], addFillElement, noIncrease, insertTopMargin, addText, groupIndex, groupList } = this.props;

		const values: JSX.Element[] = [];

		if (typeof sr === 'number') {
			values.push(<div key="sr" className="sr">{sr}</div>);
		}
		else if (!addPoint && !isNotActive && !noIncrease) {
			values.push(<div key="sr"  className="sr empty"></div>);
		}

		if (!checkDisabled) {
			if (check) {
				check.forEach((id, index) => {
					const attribute = attributes.get(id)!;
					values.push(
						<div key={id + index} className={'check ' + id}>
							<span className="short">{attribute.short}</span>
							<span className="value">{attribute.value}</span>
						</div>
					);
				});
				if (checkmod && derivedCharacteristics) {
					const characteristic = derivedCharacteristics.get(checkmod);
					if (characteristic) {
						values.push(
							<div key="mod" className="check mod">+{characteristic.short}</div>
						);
					}
				}
			}
		}

		if (addFillElement) {
			values.push(<div key="fill" className="fill"></div>);
		}

		if (ic) {
			values.push(<div key="ic" className="ic">{getICName(ic)}</div>);
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
				{addText && <ListItemGroup index={groupIndex} list={groupList} text={addText}></ListItemGroup>}
				<ListItemValues>
					{values}
				</ListItemValues>
				{btnElement}
			</ListItem>
		);
	}
}
