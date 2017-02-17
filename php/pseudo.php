<?php
	// Login
	echo json_encode(array(
		'name' => 'username',
		'displayName' => '...',
		'email' => '...',
		'sessionToken' => '...',
		'herolist' => [
			array(
				'clientVersion' => 'x.x.x',
				'dateCreated' => '...',
				'dateModified' => '...',
				'player' => array(
					'id' => 'USER_X',
					'displayName' => '...'
				),
				'id' => 'HERO_X',
				'phase' => '...',
				'name' => '...',
				'avatar' => '...',
				'ap' => array(/* ... */),
				'el' => '...',
				'r' => '...',
				'c' => '...',
				'p' => '...',
				'pv' => '...',
				'sex' => '...'
			),
			array( /* ... */ )
			// , ........
		]
	));

	// Update herolist / Request herolist
	echo json_encode([
		array(
			'clientVersion' => 'x.x.x',
			'dateCreated' => '...',
			'dateModified' => '...',
			'player' => array(
				'id' => 'USER_X',
				'displayName' => '...'
			),
			'id' => 'HERO_X',
			'phase' => '...',
			'name' => '...',
			'avatar' => '...',
			'ap' => array(/* ... */),
			'el' => '...',
			'r' => '...',
			'c' => '...',
			'p' => '...',
			'pv' => '...',
			'sex' => '...'
		),
		array( /* ... */ )
		// , ........
	]);
?>
