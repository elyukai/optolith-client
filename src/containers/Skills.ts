import { connect } from 'react-redux';
import { AppState } from '../reducers/app';
import { get, getDependent } from '../selectors/dependentInstancesSelectors';
import { SpecialAbilityInstance } from '../types/data.d';
import { getSids, isActive } from '../utils/ActivatableUtils';
import { Skills, SkillsDispatchProps, SkillsOwnProps, SkillsStateProps } from '../views/skills/Skills';

function mapStateToProps(state: AppState) {
	const dependent = getDependent(state);
	return {
		showChants: isActive(get(dependent, 'SA_102') as SpecialAbilityInstance),
		showSpells: isActive(get(dependent, 'SA_86') as SpecialAbilityInstance) && getSids(get(dependent, 'SA_86') as SpecialAbilityInstance)[0] !== 9,
	};
}

function mapDispatchToProps() {
	return {};
}

export const SkillsContainer = connect<SkillsStateProps, SkillsDispatchProps, SkillsOwnProps>(mapStateToProps, mapDispatchToProps)(Skills);
