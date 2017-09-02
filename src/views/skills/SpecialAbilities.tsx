import * as React from 'react';
import { ActivatableAddList } from '../../components/ActivatableAddList';
import { ActivatableRemoveList } from '../../components/ActivatableRemoveList';
import { BorderButton } from '../../components/BorderButton';
import { Checkbox } from '../../components/Checkbox';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { RadioButtonGroup } from '../../components/RadioButtonGroup';
import { Slidein } from '../../components/Slidein';
import { TextField } from '../../components/TextField';
import { ActivateArgs, ActiveViewObject, DeactivateArgs, DeactiveViewObject, InputTextEvent, Instance } from '../../types/data.d';
import { UIMessages } from '../../types/ui.d';
import { _translate } from '../../utils/I18n';

export interface SpecialAbilitiesOwnProps {
	locale: UIMessages;
}

export interface SpecialAbilitiesStateProps {
	activeList: ActiveViewObject[];
	deactiveList: DeactiveViewObject[];
	enableActiveItemHints: boolean;
	phase: number;
	sortOrder: string;
	get(id: string): Instance | undefined;
}

export interface SpecialAbilitiesDispatchProps {
	setSortOrder(sortOrder: string): void;
	switchActiveItemHints(): void;
	addToList(args: ActivateArgs): void;
	removeFromList(args: DeactivateArgs): void;
	setTier(id: string, index: number, tier: number, cost: number): void;
}

export type SpecialAbilitiesProps = SpecialAbilitiesStateProps & SpecialAbilitiesDispatchProps & SpecialAbilitiesOwnProps;

export interface SpecialAbilitiesState {
	filterText: string;
	filterTextSlidein: string;
	showAddSlidein: boolean;
}

export class SpecialAbilities extends React.Component<SpecialAbilitiesProps, SpecialAbilitiesState> {
	state = {
		filterText: '',
		filterTextSlidein: '',
		showAddSlidein: false
	};

	filter = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as SpecialAbilitiesState);
	filterSlidein = (event: InputTextEvent) => this.setState({ filterTextSlidein: event.target.value } as SpecialAbilitiesState);
	showAddSlidein = () => this.setState({ showAddSlidein: true } as SpecialAbilitiesState);
	hideAddSlidein = () => this.setState({ showAddSlidein: false, filterTextSlidein: '' } as SpecialAbilitiesState);

	render() {
		const { activeList, addToList, deactiveList, enableActiveItemHints, get, locale, phase, removeFromList, setSortOrder, setTier, sortOrder, switchActiveItemHints } = this.props;
		const { filterText, filterTextSlidein, showAddSlidein } = this.state;

		const sortArray = [
			{ name: _translate(locale, 'options.sortorder.alphabetically'), value: 'name' },
			{ name: _translate(locale, 'options.sortorder.group'), value: 'groupname' }
		];

		const groupNames = _translate(locale, 'specialabilities.view.groups');

		return (
			<Page id="specialabilities">
				<Slidein isOpen={showAddSlidein} close={this.hideAddSlidein}>
					<Options>
						<TextField hint={_translate(locale, 'options.filtertext')} value={filterTextSlidein} onChange={this.filterSlidein} fullWidth />
						<RadioButtonGroup
							active={sortOrder}
							onClick={setSortOrder}
							array={sortArray}
							/>
						<Checkbox checked={enableActiveItemHints} onClick={switchActiveItemHints}>{_translate(locale, 'options.showactivated')}</Checkbox>
					</Options>
					<ActivatableAddList
						activeList={enableActiveItemHints ? activeList : undefined}
						addToList={addToList}
						filterText={filterTextSlidein}
						groupNames={groupNames}
						list={deactiveList}
						locale={locale}
						sortOrder={sortOrder}
						get={get}
						/>
				</Slidein>
				<Options>
					<TextField hint={_translate(locale, 'options.filtertext')} value={filterText} onChange={this.filter} fullWidth />
					<RadioButtonGroup
						active={sortOrder}
						onClick={setSortOrder}
						array={sortArray}
						/>
					<BorderButton label={_translate(locale, 'actions.addtolist')} onClick={this.showAddSlidein} />
				</Options>
				<ActivatableRemoveList
					filterText={filterText}
					groupNames={groupNames}
					list={activeList}
					phase={phase}
					removeFromList={removeFromList}
					setTier={setTier}
					sortOrder={sortOrder}
					/>
			</Page>
		);
	}
}
