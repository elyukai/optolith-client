function getHomeState() {
	return {
		options: HomeStore.getOptions(),
		progress: HomeStore.getProgress(),
		preparing: HomeStore.getPreparingSource()
	};
}

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = getHomeState();
		this._update = this._update.bind(this);
		this._optionBool = this._optionBool.bind(this);
		this._onChange = this._onChange.bind(this);
	}

	_update() {
		this.setState( getHomeState() );
	}
	componentDidMount() {
		HomeStore.bind( 'change', this._update );
	}
	componentWillUnmount() {
		HomeStore.unbind( 'change', this._update );
	}
	prepareTalents() {
		HomeActions.prepareTalents();
	}
	_optionBool(option) {
		HomeActions.optionBool(option);
	}
	_onChange(option, event) {
		HomeActions.linkValue(option, event.target.value);
	}

	render() {
		var devprogressElement;

		if (this.state.options.showProgress) {
			devprogressElement = React.createElement(Card, {title: 'Cha5App Entwicklungsfortschritt', className: 'default-1-1'},
				React.DOM.div({className: 'devprogress'},
					React.DOM.div({className: 'devprogress-step'},
						this.state.progress.step
					),
					React.DOM.div({className: 'devprogress-bar'},
						React.DOM.div({className: 'devprogress-bar-bg', style: {width: this.state.progress.percent + '%'}}),
						React.DOM.div({className: 'devprogress-bar-num', dangerouslySetInnerHTML: {__html: (this.state.progress.percent + '% &ndash; ' + this.state.progress.content)}})
					)
				)
			);
		}

		return React.createElement(PageContainer, this.props,
			React.createElement(Card, {className: 'featured default-1-1'},
				'Willkommen im neuen Heldengenerator und Verwaltungstool für ',
				React.DOM.i({}, 'Das Schwarze Auge' ),
				', der Cha5App! Der Generator basiert auf DSA4.1 und wird später auch DSA5 unterstützen.'
			),
			devprogressElement,
			React.createElement(Card, {className: 'default-1-1'},
				React.createElement(Text, {
					label: 'JSON finalisieren',
					value: this.state.preparing,
					onChange: this._onChange.bind(this, 'preparing'),
					className: 'default-1-1',
					type: 'field'
				}),
				React.createElement(Btn, {name: 'Talente-JSON vorbereiten', click: this.prepareTalents})
			),
			React.createElement(Card, {title: 'Überall verfügbar'},
				'Ob ihr auf eurem Smartphone, Tablet oder PC eure Helden verwalten wollt, ist egal. Mit der Cha5App könnt ihr das auf allen Android-, iOS/Mac- und Windows-10-Geräten und in jedem Browser, der die neusten Webtechnologien unterstützt, bewerkstelligen. Ihr könnt Helden sowohl offline auf dem Gerät als auch online lagern und somit auch von überall auf die Helden zugreifen.',
				React.DOM.br({}),
				React.DOM.br({}),
				React.DOM.i({},
					'Zur Browserkompatibilität: Internet Explorer 10 und 11 sind nur begrenzt kompatibel, unter Version 10 nicht kompatibel. Edge ist vollständig kompatibel; ebenso wie die neuesten Versionen von Chrome und Firefox. Für andere Browser liegen noch keine Tests vor; diese sollten jedoch mindestens begrenzt kompatibel sein.'
				)
			),
			React.createElement(Card, {title: 'Das wachende Auge des Meisters'},
				'Wir haben für Helden eine Meisterfunktion eingebaut. Diese ermöglicht es, für einen Helden sowohl Spieler als auch Meister festzulegen. Der Meister erhält dabei eine neue Funktion: Er kann die Veränderung des Helden verhindern. Dies ist eine nützliche Funktion, da der Meister so sicherstellen kann, dass innerhalb eines Abenteuers die Spieler keine Änderungen an ihren Helden vornehmen. Ausnahmen bilden natürlich Spezielle Erfahrungen, die man während des Abenteuers erhält. Diese Funktion muss zuvor vom Spieler selbst aktiviert werden - ist somit also 100%ig optional - und kann nur vom Meister deaktiviert werden.'
			),
			React.createElement(Card, {title: 'GameApp'},
				'Die GameApp, die auch online verfübar ist, ist mit in der Cha5App integriert. Sie kann im Tab ',
				React.DOM.i({}, 'InGame-Verwaltung' ),
				' gefunden werden. Die Integration ermöglicht ein einfacheres Aktualisieren von Werten sowie dem schnellen Eintragen von Wertveränderungen wie pAsP oder pLeP, die dann auch auf den jeweiligen Charakter direkt übertragen werden können. Natürlich werden auch alle bisherigen unfangreichen Funktionen der GameApp übernommen.'
			),
			React.createElement(Card, {title: 'Viele Anpassungsmöglichkeiten'},
				'Die Cha5App hat viele Einstellungen zur Darstellung in der App und auf dem Charakterbogen zu bieten. Dazu zählen u.A. Sortierfilter. Somit könnt ihr euch die Listen immer so anzeigen lassen, wie ihr sie gerade braucht.'
			)
		);
	}
}
