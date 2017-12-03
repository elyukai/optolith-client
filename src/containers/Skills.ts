import { connect } from 'react-redux';
import { AppState } from '../reducers/app';
import { getBlessedTradition } from '../selectors/liturgiesSelectors';
import { getMagicalTraditions } from '../selectors/spellsSelectors';
import { Skills, SkillsDispatchProps, SkillsOwnProps, SkillsStateProps } from '../views/skills/Skills';

function mapStateToProps(state: AppState) {
	const magicalTraditions = getMagicalTraditions(state);
	return {
		showChants: typeof getBlessedTradition === 'object',
		showSpells: magicalTraditions.length > 0 && magicalTraditions[0].id !== 'SA_680',
	};
}

function mapDispatchToProps() {
	return {};
}

export const SkillsContainer = connect<SkillsStateProps, SkillsDispatchProps, SkillsOwnProps>(mapStateToProps, mapDispatchToProps)(Skills);
