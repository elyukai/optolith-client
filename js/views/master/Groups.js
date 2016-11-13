import BorderButton from '../../components/BorderButton';
import GroupsActions from '../../actions/GroupsActions';
import GroupsStore from '../../stores/GroupsStore';
import React, { Component } from 'react';
import Scroll from '../../components/Scroll';
import Slidein from '../../components/Slidein';

class Groups extends Component {

	state = { 
		requestsOpen: GroupsStore.getRequestsSlideinState()
	};
	
	_updateGroupsStore = () => this.setState({ 
		requestsOpen: GroupsStore.getRequestsSlideinState()
	});

	openRequests = () => GroupsActions.checkRequests();
	closeRequests = () => GroupsActions.closeRequests();
	
	componentDidMount() {
		GroupsStore.addChangeListener(this._updateGroupsStore);
	}
	
	componentWillUnmount() {
		GroupsStore.removeChangeListener(this._updateGroupsStore);
	}

	render() {
		return (
			<div className="page" id="groups">
				<Slidein isOpen={this.state.requestsOpen} close={this.closeRequests}>
					Liste mit den Namen der Helden und dazugehörigen Spieler, die ihren Helden freigeben wollen, und Annahme- und Ablehnoptionen
				</Slidein>
				<Scroll className="full">
					<BorderButton label="Anfragen" onClick={this.openRequests} />
				</Scroll>
			</div>
		);
	}
}

export default Groups;
