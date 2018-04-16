import { connect } from 'react-redux';
import { Help, HelpDispatchProps, HelpOwnProps, HelpStateProps } from '../views/help/Help';

function mapStateToProps() {
	return {};
}

function mapDispatchToProps() {
	return {};
}

export const HelpContainer = connect<HelpStateProps, HelpDispatchProps, HelpOwnProps>(mapStateToProps, mapDispatchToProps)(Help);
