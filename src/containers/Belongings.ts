import { connect } from 'react-redux';
import { Belongings, BelongingsDispatchProps, BelongingsOwnProps, BelongingsStateProps } from '../views/belongings/Belongings';

function mapStateToProps() {
	return {};
}

function mapDispatchToProps() {
	return {};
}

export const BelongingsContainer = connect<BelongingsStateProps, BelongingsDispatchProps, BelongingsOwnProps>(mapStateToProps, mapDispatchToProps)(Belongings);
