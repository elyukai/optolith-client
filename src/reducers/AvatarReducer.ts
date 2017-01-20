import { SetHeroAvatarAction } from '../actions/ProfileActions';
import { ReceiveHeroAvatarAction, ReceiveHeroDataAction } from '../actions/ServerActions';
import { RECEIVE_HERO_AVATAR, RECEIVE_HERO_DATA, SET_HERO_AVATAR } from '../constants/ActionTypes';

type Action = ReceiveHeroAvatarAction | ReceiveHeroDataAction | SetHeroAvatarAction;

export type AvatarState = string;

export default (state: AvatarState = '', action: Action): AvatarState => {
	switch (action.type) {
		case RECEIVE_HERO_AVATAR:
		case SET_HERO_AVATAR:
			return action.payload.url;

		case RECEIVE_HERO_DATA:
			return action.payload.data.avatar;

		default:
			return state;
	}
};
