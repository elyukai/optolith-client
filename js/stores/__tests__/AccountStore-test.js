jest.mock('../../dispatcher/AppDispatcher');

import AccountStore from '../AccountStore';
import ActionTypes from '../../constants/ActionTypes';
import AppDispatcher from '../../dispatcher/AppDispatcher';

describe('AccountStore', () => {
	const callback = AppDispatcher.register.mock.calls[0][0];

	it('initializes with empty data fields', () => {
		const account = AccountStore.getAll();
		expect(account).toEqual({ id: null, name: '' });
	});

	it('receives new account', () => {
		callback({
			actionType: ActionTypes.RECEIVE_ACCOUNT,
			id: 4,
			name: 'Elytherion'
		});
		const account = AccountStore.getAll();
		expect(account).toEqual({ id: 4, name: 'Elytherion' });
	});
});
