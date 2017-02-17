jest.mock('../../dispatcher/AppDispatcher');

import AuthStore from '../AuthStore';
import * as ActionTypes from '../../constants/ActionTypes';
import AppDispatcher from '../../dispatcher/AppDispatcher';

describe('AuthStore', () => {
	const callback = AppDispatcher.register.mock.calls[0][0];

	it('initializes with empty data fields', () => {
		const account = AuthStore.getAll();
		expect(account).toEqual({ id: null, name: '' });
	});

	it('receives new account', () => {
		callback({
			type: ActionTypes.RECEIVE_ACCOUNT,
			id: 4,
			name: 'Elytherion'
		});
		const account = AuthStore.getAll();
		expect(account).toEqual({ id: 4, name: 'Elytherion' });
	});
});
