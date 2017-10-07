import { connect } from 'react-redux';
import { AppState } from '../reducers/app';
import { getPhase } from '../selectors/stateSelectors';
import { Profile, ProfileDispatchProps, ProfileOwnProps, ProfileStateProps } from '../views/profile/Profile';

function mapStateToProps(state: AppState) {
	return {
		phase: getPhase(state)
	};
}

function mapDispatchToProps() {
	return {};
}

export const ProfileContainer = connect<ProfileStateProps, ProfileDispatchProps, ProfileOwnProps>(mapStateToProps, mapDispatchToProps)(Profile);
