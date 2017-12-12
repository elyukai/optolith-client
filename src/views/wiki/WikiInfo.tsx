import * as React from 'react';
import { Aside } from '../../components/Aside';
import { ErrorMessage } from '../../components/ErrorMessage';
import { DependentInstancesState } from '../../reducers/dependentInstances';
import { ActivatableInstance, AttributeInstance, BlessingInstance, Book, CantripInstance, CombatTechniqueInstance, ItemInstance, LiturgyInstance, RaceInstance, SecondaryAttribute, SpecialAbilityInstance, SpellInstance, TalentInstance } from '../../types/data.d';
import { Culture, Profession, Race, UIMessages } from '../../types/view.d';
import { WikiInfoContent } from './WikiInfoContent';

type Instance = BlessingInstance | CantripInstance | CombatTechniqueInstance | LiturgyInstance | SpellInstance | Culture | Profession | Race | ActivatableInstance | TalentInstance | ItemInstance;

export interface WikiInfoOwnProps {
	currentId?: string;
	locale: UIMessages;
	noWrapper?: boolean;
}

export interface WikiInfoStateProps {
	attributes: Map<string, AttributeInstance>;
	books: Map<string, Book>;
	cantrips: Map<string, CantripInstance>;
	combatTechniques: Map<string, CombatTechniqueInstance>;
	derivedCharacteristics: Map<string, SecondaryAttribute>;
	dependent: DependentInstancesState;
	languages: SpecialAbilityInstance;
	liturgicalChantExtensions: SpecialAbilityInstance | undefined;
	liturgicalChants: Map<string, LiturgyInstance>;
	list: Instance[];
	races: Map<string, RaceInstance>;
	scripts: SpecialAbilityInstance;
	sex: 'm' | 'f' | undefined;
	skills: Map<string, TalentInstance>;
	spellExtensions: SpecialAbilityInstance | undefined;
	spells: Map<string, SpellInstance>;
	specialAbilities: Map<string, SpecialAbilityInstance>;
	templates: Map<string, ItemInstance>;
}

export interface WikiInfoDispatchProps {}

export type WikiInfoProps = WikiInfoStateProps & WikiInfoDispatchProps & WikiInfoOwnProps;

export interface WikiInfoState {
	hasError?: {
		error: Error;
		info: any;
	};
}

export class WikiInfo extends React.Component<WikiInfoProps, WikiInfoState> {
	state: WikiInfoState = {};

	componentDidCatch(error: any, info: any) {
		this.setState(() => ({ hasError: { error, info }}));
	}

	render() {
		const { noWrapper } = this.props;
		const { hasError } = this.state;

		if (hasError) {
			const currentElement = <ErrorMessage stack={hasError.error.stack!} componentStack={hasError.info.componentStack} />;

			return noWrapper ? currentElement : <Aside>{currentElement}</Aside>;
		}

		return <WikiInfoContent {...this.props} />;
	}
}
