import * as React from 'react';
import { ActivatableAddList } from '../../components/ActivatableAddList';
import { ActivatableRemoveList } from '../../components/ActivatableRemoveList';
import { BorderButton } from '../../components/BorderButton';
import { Checkbox } from '../../components/Checkbox';
import { ListHeader } from '../../components/ListHeader';
import { ListHeaderTag } from '../../components/ListHeaderTag';
import { MainContent } from '../../components/MainContent';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { RadioButtonGroup } from '../../components/RadioButtonGroup';
import { Slidein } from '../../components/Slidein';
import { TextField } from '../../components/TextField';
import { WikiInfoContainer } from '../../containers/WikiInfo';
import { ActivateArgs, ActiveViewObject, DeactivateArgs, DeactiveViewObject, InputTextEvent, Instance, SpecialAbilityInstance } from '../../types/data.d';
import { UIMessages } from '../../types/ui.d';
import { _translate } from '../../utils/I18n';

export interface SpecialAbilitiesOwnProps {
	locale: UIMessages;
}

export interface SpecialAbilitiesStateProps {
	activeList: ActiveViewObject[];
	deactiveList: DeactiveViewObject[];
	list: SpecialAbilityInstance[];
	enableActiveItemHints: boolean;
	isRemovingEnabled: boolean;
	sortOrder: string;
	get(id: string): Instance | undefined;
}

export interface SpecialAbilitiesDispatchProps {
	setSortOrder(sortOrder: string): void;
	switchActiveItemHints(): void;
	addToList(args: ActivateArgs): void;
	removeFromList(args: DeactivateArgs): void;
	setTier(id: string, index: number, tier: number): void;
}

export type SpecialAbilitiesProps = SpecialAbilitiesStateProps & SpecialAbilitiesDispatchProps & SpecialAbilitiesOwnProps;

export interface SpecialAbilitiesState {
	filterText: string;
	filterTextSlidein: string;
	showAddSlidein: boolean;
	currentId?: string;
	currentSlideinId?: string;
}

export class SpecialAbilities extends React.Component<SpecialAbilitiesProps, SpecialAbilitiesState> {
	state = {
		filterText: '',
		filterTextSlidein: '',
		showAddSlidein: false,
		currentId: undefined,
		currentSlideinId: undefined
	};

	filter = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as SpecialAbilitiesState);
	filterSlidein = (event: InputTextEvent) => this.setState({ filterTextSlidein: event.target.value } as SpecialAbilitiesState);
	showAddSlidein = () => this.setState({ showAddSlidein: true } as SpecialAbilitiesState);
	hideAddSlidein = () => this.setState({ showAddSlidein: false, filterTextSlidein: '' } as SpecialAbilitiesState);
	showInfo = (id: string) => this.setState({ currentId: id } as SpecialAbilitiesState);
	showSlideinInfo = (id: string) => this.setState({ currentSlideinId: id } as SpecialAbilitiesState);

	render() {
		const { activeList, addToList, deactiveList, enableActiveItemHints, get, locale, isRemovingEnabled, removeFromList, setSortOrder, setTier, sortOrder, switchActiveItemHints } = this.props;
		const { filterText, filterTextSlidein, showAddSlidein } = this.state;

		const sortArray = [
			{ name: _translate(locale, 'options.sortorder.alphabetically'), value: 'name' },
			{ name: _translate(locale, 'options.sortorder.group'), value: 'groupname' }
		];

		const groupNames = _translate(locale, 'specialabilities.view.groups');

		return (
			<Page id="specialabilities">
				<Slidein isOpened={showAddSlidein} close={this.hideAddSlidein}>
					<Options>
						<TextField hint={_translate(locale, 'options.filtertext')} value={filterTextSlidein} onChange={this.filterSlidein} fullWidth />
						<RadioButtonGroup
							active={sortOrder}
							onClick={setSortOrder}
							array={sortArray}
							/>
						<Checkbox checked={enableActiveItemHints} onClick={switchActiveItemHints}>{_translate(locale, 'options.showactivated')}</Checkbox>
					</Options>
					<MainContent>
						<ListHeader>
							<ListHeaderTag className="name">
								{_translate(locale, 'name')}
							</ListHeaderTag>
							<ListHeaderTag className="group">
								{_translate(locale, 'group')}
								</ListHeaderTag>
							<ListHeaderTag className="cost" hint={_translate(locale, 'aptext')}>
								{_translate(locale, 'apshort')}
							</ListHeaderTag>
							<ListHeaderTag className="btn-placeholder" />
							<ListHeaderTag className="btn-placeholder" />
						</ListHeader>
						<ActivatableAddList
							activeList={enableActiveItemHints ? activeList : undefined}
							addToList={addToList}
							filterText={filterTextSlidein}
							groupNames={groupNames}
							list={deactiveList}
							locale={locale}
							sortOrder={sortOrder}
							get={get}
							selectForInfo={this.showSlideinInfo}
							/>
					</MainContent>
					<WikiInfoContainer {...this.props} currentId={this.state.currentSlideinId}/>
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
				<MainContent>
					<ListHeader>
						<ListHeaderTag className="name">
							{_translate(locale, 'name')}
						</ListHeaderTag>
						<ListHeaderTag className="group">
							{_translate(locale, 'group')}
							</ListHeaderTag>
						<ListHeaderTag className="cost" hint={_translate(locale, 'aptext')}>
							{_translate(locale, 'apshort')}
						</ListHeaderTag>
						{isRemovingEnabled && <ListHeaderTag className="btn-placeholder" />}
						<ListHeaderTag className="btn-placeholder" />
					</ListHeader>
					<ActivatableRemoveList
						filterText={filterText}
						groupNames={groupNames}
						list={activeList}
						locale={locale}
						isRemovingEnabled={isRemovingEnabled}
						removeFromList={removeFromList}
						setTier={setTier}
						sortOrder={sortOrder}
						selectForInfo={this.showInfo}
						/>
				</MainContent>
				<WikiInfoContainer {...this.props} {...this.state} />
			</Page>
		);
	}
}
