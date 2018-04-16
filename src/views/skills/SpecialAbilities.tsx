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
import { Slidein } from '../../components/Slidein';
import { SortOptions } from '../../components/SortOptions';
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
	filterText: string;
	inactiveFilterText: string;
	get(id: string): Instance | undefined;
}

export interface SpecialAbilitiesDispatchProps {
	setSortOrder(sortOrder: string): void;
	switchActiveItemHints(): void;
	addToList(args: ActivateArgs): void;
	removeFromList(args: DeactivateArgs): void;
	setTier(id: string, index: number, tier: number): void;
	setFilterText(filterText: string): void;
	setInactiveFilterText(filterText: string): void;
}

export type SpecialAbilitiesProps = SpecialAbilitiesStateProps & SpecialAbilitiesDispatchProps & SpecialAbilitiesOwnProps;

export interface SpecialAbilitiesState {
	showAddSlidein: boolean;
	currentId?: string;
	currentSlideinId?: string;
}

export class SpecialAbilities extends React.Component<SpecialAbilitiesProps, SpecialAbilitiesState> {
	state = {
		showAddSlidein: false,
		currentId: undefined,
		currentSlideinId: undefined
	};

	filter = (event: InputTextEvent) => this.props.setFilterText(event.target.value);
	filterSlidein = (event: InputTextEvent) => this.props.setInactiveFilterText(event.target.value);
	showAddSlidein = () => this.setState({ showAddSlidein: true } as SpecialAbilitiesState);
	hideAddSlidein = () => this.setState({ showAddSlidein: false, filterTextSlidein: '' } as SpecialAbilitiesState);
	showInfo = (id: string) => this.setState({ currentId: id } as SpecialAbilitiesState);
	showSlideinInfo = (id: string) => this.setState({ currentSlideinId: id } as SpecialAbilitiesState);

	render() {
		const { activeList, addToList, deactiveList, enableActiveItemHints, get, locale, isRemovingEnabled, removeFromList, setSortOrder, setTier, sortOrder, switchActiveItemHints, filterText, inactiveFilterText } = this.props;
		const { showAddSlidein } = this.state;

		return (
			<Page id="specialabilities">
				<Slidein isOpened={showAddSlidein} close={this.hideAddSlidein}>
					<Options>
						<TextField hint={_translate(locale, 'options.filtertext')} value={inactiveFilterText} onChange={this.filterSlidein} fullWidth />
						<SortOptions
							sortOrder={sortOrder}
							sort={setSortOrder}
							options={['name', 'groupname']}
							locale={locale}
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
							addToList={addToList}
							list={deactiveList}
							locale={locale}
							get={get}
							selectForInfo={this.showSlideinInfo}
							/>
					</MainContent>
					<WikiInfoContainer {...this.props} currentId={this.state.currentSlideinId}/>
				</Slidein>
				<Options>
					<TextField hint={_translate(locale, 'options.filtertext')} value={filterText} onChange={this.filter} fullWidth />
					<SortOptions
						sortOrder={sortOrder}
						sort={setSortOrder}
						options={['name', 'groupname']}
						locale={locale}
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
						list={activeList}
						locale={locale}
						isRemovingEnabled={isRemovingEnabled}
						removeFromList={removeFromList}
						setTier={setTier}
						selectForInfo={this.showInfo}
						/>
				</MainContent>
				<WikiInfoContainer {...this.props} {...this.state} />
			</Page>
		);
	}
}
