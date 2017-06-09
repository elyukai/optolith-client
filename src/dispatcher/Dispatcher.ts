import invariant from 'fbjs/lib/invariant';

const prefix = 'ID_';

/**
 * Dispatcher is used to broadcast payloads to registered callbacks. This is
 * different from generic pub-sub systems in two ways:
 *
 *   1) Callbacks are not subscribed to particular events. Every payload is
 *      dispatched to every registered callback.
 *   2) Callbacks can be deferred in whole or part until other callbacks have
 *      been executed.
 *
 * For example, consider this hypothetical flight destination form, which
 * selects a default city when a country is selected:
 *
 *   var flightDispatcher = new Dispatcher();
 *
 *   // Keeps track of which country is selected
 *   var CountryStore = {country: null};
 *
 *   // Keeps track of which city is selected
 *   var CityStore = {city: null};
 *
 *   // Keeps track of the base flight price of the selected city
 *   var FlightPriceStore = {price: null}
 *
 * When a user changes the selected city, we dispatch the payload:
 *
 *   flightDispatcher.dispatch({
 *     actionType: 'city-update',
 *     selectedCity: 'paris'
 *   });
 *
 * This payload is digested by `CityStore`:
 *
 *   flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'city-update') {
 *       CityStore.city = payload.selectedCity;
 *     }
 *   });
 *
 * When the user selects a country, we dispatch the payload:
 *
 *   flightDispatcher.dispatch({
 *     actionType: 'country-update',
 *     selectedCountry: 'australia'
 *   });
 *
 * This payload is digested by both stores:
 *
 *   CountryStore.dispatchToken = flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'country-update') {
 *       CountryStore.country = payload.selectedCountry;
 *     }
 *   });
 *
 * When the callback to update `CountryStore` is registered, we save a reference
 * to the returned token. Using this token with `waitFor()`, we can guarantee
 * that `CountryStore` is updated before the callback that updates `CityStore`
 * needs to query its data.
 *
 *   CityStore.dispatchToken = flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'country-update') {
 *       // `CountryStore.country` may not be updated.
 *       flightDispatcher.waitFor([CountryStore.dispatchToken]);
 *       // `CountryStore.country` is now guaranteed to be updated.
 *
 *       // Select the default city for the new country
 *       CityStore.city = getDefaultCityForCountry(CountryStore.country);
 *     }
 *   });
 *
 * The usage of `waitFor()` can be chained, for example:
 *
 *   FlightPriceStore.dispatchToken =
 *     flightDispatcher.register(function(payload) {
 *       switch (payload.actionType) {
 *         case 'country-update':
 *         case 'city-update':
 *           flightDispatcher.waitFor([CityStore.dispatchToken]);
 *           FlightPriceStore.price =
 *             getFlightPriceStore(CountryStore.country, CityStore.city);
 *           break;
 *     }
 *   });
 *
 * The `country-update` payload will be guaranteed to invoke the stores'
 * registered callbacks in order: `CountryStore`, `CityStore`, then
 * `FlightPriceStore`.
 */

export class Dispatcher<Action> {
	private callbacks = new Map<string, (action: Action) => void>();
	private isDispatchingState = false;
	private isHandled = new Map<string, boolean>();
	private isPending = new Map<string, boolean>();
	private lastID = 1;
	private pendingPayload?: Action;

	/**
	 * Registers a callback to be invoked with every dispatched payload. Returns
	 * a token that can be used with `waitFor()`.
	 */
	register(callback: (action: Action) => void) {
		const id = prefix + this.lastID++;
		this.callbacks.set(id, callback);
		return id;
	}

	/**
	 * Removes a callback based on its token.
	 */
	unregister(id: string) {
		if (!this.callbacks.has(id)) {
			if (process.env.NODE_ENV !== 'production') {
				invariant(false, 'Dispatcher.unregister(...): `%s` does not map to a registered callback.', id);
			}
			else {
				invariant(false);
			}
		}
		this.callbacks.delete(id);
	}

	/**
	 * Waits for the callbacks specified to be invoked before continuing execution
	 * of the current callback. This method should only be used by a callback in
	 * response to a dispatched payload.
	 */
	waitFor(ids: string[]) {
		if (!this.isDispatchingState) {
			if (process.env.NODE_ENV !== 'production') {
				invariant(false, 'Dispatcher.waitFor(...): Must be invoked while dispatching.');
			}
			else {
				invariant(false);
			}
		}
		for (const id of ids) {
			if (this.isPending.get(id)) {
				if (!this.isHandled.get(id)) {
					if (process.env.NODE_ENV !== 'production') {
						invariant(false, 'Dispatcher.waitFor(...): Circular dependency detected while ' + 'waiting for `%s`.', id);
					}
					else {
						invariant(false);
					}
				}
				continue;
			}
			if (!this.callbacks.has(id)) {
				if (process.env.NODE_ENV !== 'production') {
					invariant(false, 'Dispatcher.waitFor(...): `%s` does not map to a registered callback.', id);
				}
				else {
					invariant(false);
				}
			}
			this.invokeCallback(id);
		}
	}

	/**
	 * Dispatches a payload to all registered callbacks.
	 */
	dispatch(payload: Action) {
		if (this.isDispatchingState) {
			if (process.env.NODE_ENV !== 'production') {
				invariant(false, 'Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.');
			}
			else {
				invariant(false);
			}
		}
		this.startDispatching(payload);
		try {
			for (const id in this.callbacks.keys()) {
				if (this.isPending.get(id)) {
					continue;
				}
				this.invokeCallback(id);
			}
		} finally {
			this.stopDispatching();
		}
	}

	/**
	 * Is this Dispatcher currently dispatching.
	 */
	isDispatching() {
		return this.isDispatchingState;
	}

	/**
	 * Call the callback stored with the given id. Also do some internal
	 * bookkeeping.
	 */
	private invokeCallback(id: string) {
		this.isPending.set(id, true);
		const callback = this.callbacks.get(id);
		if (callback && this.pendingPayload) {
			callback(this.pendingPayload);
		}
		this.isHandled.set(id, true);
	}

	/**
	 * Set up bookkeeping needed when dispatching.
	 */
	private startDispatching(payload: Action) {
		for (const id of this.callbacks.keys()) {
			this.isPending.set(id, false);
			this.isHandled.set(id, false);
		}
		this.pendingPayload = payload;
		this.isDispatchingState = true;
	}

	/**
	 * Clear bookkeeping used for dispatching.
	 */
	private stopDispatching() {
		delete this.pendingPayload;
		this.isDispatchingState = false;
	}
}
