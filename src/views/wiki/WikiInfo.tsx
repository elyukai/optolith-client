import * as React from 'react';
import { Aside } from '../../components/Aside';
import { ErrorMessage } from '../../components/ErrorMessage';
import { DependentInstancesState } from '../../reducers/dependentInstances';
import { WikiState } from '../../reducers/wikiReducer';
import { ActivatableInstance, SecondaryAttribute } from '../../types/data.d';
import { Culture, Profession, Race as RaceView, UIMessages } from '../../types/view.d';
import { Attribute, Blessing, Book, Cantrip, CombatTechnique, ItemTemplate, LiturgicalChant, Race, Skill, SpecialAbility, Spell } from '../../types/wiki';
import { WikiInfoContent } from './WikiInfoContent';

type Instance = ActivatableInstance | Blessing | Cantrip | CombatTechnique | Culture | ItemTemplate | LiturgicalChant | Profession | RaceView | Skill | Spell;

export interface WikiInfoOwnProps {
	currentId?: string;
	locale: UIMessages;
	noWrapper?: boolean;
}

export interface WikiInfoStateProps {
	attributes: Map<string, Attribute>;
	books: Map<string, Book>;
	cantrips: Map<string, Cantrip>;
	combatTechniques: Map<string, CombatTechnique>;
	derivedCharacteristics: Map<string, SecondaryAttribute>;
	dependent: DependentInstancesState;
	languages: SpecialAbility;
	liturgicalChantExtensions: SpecialAbility | undefined;
	liturgicalChants: Map<string, LiturgicalChant>;
	list: Instance[];
	races: Map<string, Race>;
	scripts: SpecialAbility;
	sex: 'm' | 'f' | undefined;
	skills: Map<string, Skill>;
	spellExtensions: SpecialAbility | undefined;
	spells: Map<string, Spell>;
	specialAbilities: Map<string, SpecialAbility>;
	templates: Map<string, ItemTemplate>;
	wiki: WikiState;
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
