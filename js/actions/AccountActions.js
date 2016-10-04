import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import WebAPIUtils from '../utils/WebAPIUtils';
import reactAlert from '../utils/reactAlert';
import AccountStore from '../stores/core/AccountStore';

var AccountActions = {
	register: function(email, username, password) {
		
		AppDispatcher.dispatch({
			actionType: ActionTypes.WAIT_START
		});
		
		Promise.all([WebAPIUtils.checkEmail(email), WebAPIUtils.checkUsername(username)])
		.then(function(used){
		
			if (used[0] == 'true' && used[1] == 'true') {
			
				reactAlert('Daten bereits vorhanden', 'Sowohl die E-Mail-Adresse als auch der Benutzername sind bereits vorhanden.\n\nHast du deine Bestätigungs-E-Mail nicht empfangen? Dann melde dich einfach mit deinen Benutzerdaten an, sodass du deine E-Mail neu oder an einer andere Adresse verschicken kannst.');
		
				AppDispatcher.dispatch({
					actionType: ActionTypes.WAIT_END
				});
				
			} else if (used[0] == 'true' && used[1] == 'false') {
			
				reactAlert('E-Mail-Adresse bereits vorhanden', 'Die E-Mail-Adresse wird bereits verwendet.');
		
				AppDispatcher.dispatch({
					actionType: ActionTypes.WAIT_END
				});
				
			} else if (used[0] == 'false' && used[1] == 'true') {
			
				reactAlert('Benutzername bereits vorhanden', 'Der Benutzername wird bereits verwendet.');
		
				AppDispatcher.dispatch({
					actionType: ActionTypes.WAIT_END
				});
				
			} else if (used[0] == 'false' && used[1] == 'false') {
			
				return WebAPIUtils.register(email, username, password);
				
			}
		})
		.then(function(callback) {
			
			AppDispatcher.dispatch({
				actionType: ActionTypes.REGISTRATION_SUCCESS
			});
			
		})
		.catch(function() {
	
			AppDispatcher.dispatch({
				actionType: ActionTypes.WAIT_END
			});
			
		});

	},
	forgotPassword: function(email) {
		
		AppDispatcher.dispatch({
			actionType: ActionTypes.WAIT_START
		});
		
		WebAPIUtils.sendPasswordCode(email)
		.then(function(callback) {
			if ( callback == 'false' ) {
			
				reactAlert('E-Mail nicht vorhanden', 'Die eingegebene E-Mail-Adresse ist nicht registriert.');
		
				AppDispatcher.dispatch({
					actionType: ActionTypes.WAIT_END
				});
				
			} else if ( callback == 'true' ) {
			
				reactAlert('E-Mail erfolgreich verschickt', 'Du kannst jetzt in dein Postfach schauen; wir haben dir die E-Mail mit dem Link zum Zurücksetzen deines Passworts geschickt!');
				
				AppDispatcher.dispatch({
					actionType: ActionTypes.WAIT_END
				});
				
			}
		})
		.catch(function(){
	
			AppDispatcher.dispatch({
				actionType: ActionTypes.WAIT_END
			});
				
		});

	},
	forgotUsername: function(email) {
		
		AppDispatcher.dispatch({
			actionType: ActionTypes.WAIT_START
		});
		
		WebAPIUtils.sendUsername(email)
		.then(function(callback) {
			if ( callback == 'false' ) {
			
				reactAlert('E-Mail nicht vorhanden', 'Die eingegebene E-Mail-Adresse ist nicht registriert.');
		
				AppDispatcher.dispatch({
					actionType: ActionTypes.WAIT_END
				});
				
			} else if ( callback == 'true' ) {
			
				reactAlert('E-Mail erfolgreich verschickt', 'Du kannst jetzt in dein Postfach schauen; wir haben dir die E-Mail mit deinem Benutzernamen geschickt!');
				
				AppDispatcher.dispatch({
					actionType: ActionTypes.WAIT_END
				});
				
			}
		})
		.catch(function(){
	
			AppDispatcher.dispatch({
				actionType: ActionTypes.WAIT_END
			});
				
		});

	},
	resendActivation: function(email) {
		
		AppDispatcher.dispatch({
			actionType: ActionTypes.WAIT_START
		});
		
		WebAPIUtils.resendActivation(email)
		.then(function(callback) {
			if ( callback == 'false' ) {
				
				reactAlert('E-Mail nicht vorhanden', 'Die eingegebene E-Mail-Adresse ist nicht registriert.');
		
				AppDispatcher.dispatch({
					actionType: ActionTypes.WAIT_END
				});
				
			} else if ( callback == 'true' ) {
			
				reactAlert('E-Mail erfolgreich verschickt', 'Du kannst jetzt in dein Postfach schauen; wir haben dir dieAktivierungsemail erneut geschickt!');
				
				AppDispatcher.dispatch({
					actionType: ActionTypes.WAIT_END
				});
				
			}
		})
		.catch(function(){
	
			AppDispatcher.dispatch({
				actionType: ActionTypes.WAIT_END
			});
				
		});

	},
	login: function(username, password) {
		
		AppDispatcher.dispatch({
			actionType: ActionTypes.WAIT_START
		});
		
		var userid;
		
		WebAPIUtils.login(username, password)
		.then(function(callback) {
			
			if ( callback == 'false' ) {
			
				reactAlert('Anmeldeversuch fehlgeschlagen', 'Die eigegebene Kombination aus Benutzername und Passwort wurde nicht erkannt. Stelle sicher, dass du dich nicht vertippt hast und versuche es nochmal.');
		
				AppDispatcher.dispatch({
					actionType: ActionTypes.WAIT_END
				});
			
			} else if ( callback == 'notactive' ) {
			
				reactAlert('Benutzerkonto nicht aktiviert', 'Das hinterlegte Benutzerkonto wurde noch nicht aktivert. Bitte aktiviere das Konto über den Aktivierungslink in der Aktivierungsemail.');
		
				AppDispatcher.dispatch({
					actionType: ActionTypes.WAIT_END
				});
			
			} else if ( callback == 'logged' ) {
			
				reactAlert('Benutzer bereits angemeldet', 'Das Konto ist momentan an einem anderen Ort (Gerät oder Browser) angemeldet. Es kann nicht mehrere Male auf ein Konto zugegriffen werden.');
		
				AppDispatcher.dispatch({
					actionType: ActionTypes.WAIT_END
				});
				
			} else {
				
				userid = callback;
				
				return WebAPIUtils.getHeroes(userid);
				
			}
		})
		.then(function(callback) {
			
			if ( userid !== undefined ) {
				if ( callback == 'false' ) {
					
					reactAlert('Da hat etwas nicht geklappt', 'Dies darf nicht passieren! Melde dies bitte als Fehler! Wir versuchen, das Problem schnellstmöglich zu beheben!');
			
					AppDispatcher.dispatch({
						actionType: ActionTypes.WAIT_END
					});
					
				} else {
					
					AppDispatcher.dispatch({
						actionType: ActionTypes.RECEIVE_ACCOUNT,
						userid,
						username,
						raw: callback
					});
					
				}
			}
			
		})
		.catch(function(){
	
			AppDispatcher.dispatch({
				actionType: ActionTypes.WAIT_END
			});
				
		});

	},
	logout: function(src) {
		
		let userid = AccountStore.getID();
		
		if (userid > 0) {
			if (src == 'end') {
				WebAPIUtils.logoutSync();
			}
			else {
				AppDispatcher.dispatch({
					actionType: ActionTypes.WAIT_START
				});
			
				WebAPIUtils.logout()
				.then(function(callback) {
					
					if ( callback == 'true' ) {
				
						reactAlert('Abmeldung erfolgreich', 'Du wurdest erfolgreich abgemeldet.');
						
						AppDispatcher.dispatch({
							actionType: ActionTypes.CLEAR_ACCOUNT
						});
						
					}
					
				})
				.catch(function(){
			
					AppDispatcher.dispatch({
						actionType: ActionTypes.WAIT_END
					});
						
				});
			}
		}
		
	},
	changeUsername: function(username) {
		
		AppDispatcher.dispatch({
			actionType: ActionTypes.WAIT_START
		});
		
		WebAPIUtils.setNewUsername(username)
		.then(function(callback) {
			if ( callback == 'false' ) {
				
				reactAlert('Da hat etwas nicht geklappt', 'Dies darf nicht passieren! Melde dies bitte als Fehler! Wir versuchen, das Problem schnellstmöglich zu beheben!');
		
				AppDispatcher.dispatch({
					actionType: ActionTypes.WAIT_END
				});
				
			} else if ( callback == 'true' ) {
			
				reactAlert('E-Benutzernamen erfolgreich geändert', 'Dein Benutzername wurde erfolgreich geändert.');
				
				AppDispatcher.dispatch({
					actionType: ActionTypes.UPDATE_USERNAME,
					username
				});
				
			}
		})
		.catch(function(){
	
			AppDispatcher.dispatch({
				actionType: ActionTypes.WAIT_END
			});
				
		});
	},
	changePassword: function(password) {
		
		AppDispatcher.dispatch({
			actionType: ActionTypes.WAIT_START
		});
		
		WebAPIUtils.setNewPassword(password)
		.then(function(callback) {
			if ( callback == 'false' ) {
				
				reactAlert('Da hat etwas nicht geklappt', 'Dies darf nicht passieren! Melde dies bitte als Fehler! Wir versuchen, das Problem schnellstmöglich zu beheben!');
		
				AppDispatcher.dispatch({
					actionType: ActionTypes.WAIT_END
				});
				
			} else if ( callback == 'true' ) {
			
				reactAlert('Passwort erfolgreich geändert', 'Dein Passwort wurde erfolgreich geändert.');
				
				AppDispatcher.dispatch({
					actionType: ActionTypes.PASSWORD_CHANGE_SUCCESS
				});
				
			}
		})
		.catch(function(){
	
			AppDispatcher.dispatch({
				actionType: ActionTypes.WAIT_END
			});
				
		});
		
	},
	delete: function(password) {
		
		AppDispatcher.dispatch({
			actionType: ActionTypes.WAIT_START
		});
		
		WebAPIUtils.deleteAccount()
		.then(function(callback) {
			if ( callback == 'false' ) {
				
				reactAlert('Da hat etwas nicht geklappt', 'Dies darf nicht passieren! Melde dies bitte als Fehler! Wir versuchen, das Problem schnellstmöglich zu beheben!');
		
				AppDispatcher.dispatch({
					actionType: ActionTypes.WAIT_END
				});
				
			} else if ( callback == 'true' ) {
			
				reactAlert('Konto gelöscht', 'Dein Konto wurde mitsamt aller Helden und Gruppen erfolgreich gelöscht.');
				
				AppDispatcher.dispatch({
					actionType: ActionTypes.CLEAR_ACCOUNT
				});
				
			}
		})
		.catch(function(){
	
			AppDispatcher.dispatch({
				actionType: ActionTypes.WAIT_END
			});
				
		});
		
	}
};

export default AccountActions;
