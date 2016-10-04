var HeroListItemX = React.createClass({
	displayName: 'HeroListItem',

	render: function render() {
		var name = this.props.name,
			prof = this.props.prof,
			player = this.props.player,
			playerText,
			level = this.props.level,
			perc = this.props.perc;

		if (player !== undefined) {
			playerText = ' [' + player + ']';
		}

		return React.DOM.li({className: 'hero-list-item'},
			React.DOM.div({className: 'hero-ap'},
				React.createElement(ProgressArc, {size: 64, strokeWidth: 4, complete: perc}),
				React.DOM.span({className: 'hero-level'},
					level
				)
			),
			React.DOM.div({className: 'hero-main'},
				React.DOM.span({className: 'hero-name'},
					name,
					playerText
				),
				React.DOM.span({className: 'hero-prof'},
					prof
				)
			)
		);
	}
});
