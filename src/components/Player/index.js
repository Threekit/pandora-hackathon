import React, { useState, useEffect } from 'react';
import { apply2DSpin } from '../../heleprs/spin';
import "./style.css"
function Player(props) {
	const [attrs, setAttrs] = useState([]);

    /* 
        Set config will interact with our configurator API. Only available after the player is initialized 
        https://docs.threekit.com/docs/configurator-api
    */
	const setConfig = (attr, val) => {
		window.configurator.setConfiguration({ [attr]: { assetId: val } });
	};
	useEffect(() => {
		/* This code will not need to be updated other than the Auth Token. Threekit needs to be
        authorized on a per-dmain basis. 
        */
		window
			.threekitPlayer({
				authToken: 'b27b8105-b113-4b39-a8e7-06c57c34326b',
				el: document.getElementById('player'),
				assetId: 'ada8ee80-68a6-4dca-811a-c429ca4b4a73',
				display: 'image',
				// You can set showConfigurator to 'true' to see our default config form.
				showConfigurator: false,
			})
			.then(async (player) => {
				window.player = player;
				window.configurator = await player.getConfigurator();

				await player.when('loaded');

				// This helps preload all the images
				await window.configurator.prefetchAttributes(['Rotate']);

				apply2DSpin({ attrName: 'Rotate', direction: 1 })(player);
				// End Spin

				// Storing the displayattributs in state. More info below. 
				setAttrs(window.configurator.getDisplayAttributes());
			});
	}, []);
	return (
		<div>
			<div id="player" style={{ height: '500px', width: '100vw' }}></div>
			<div className="attr-container">
				{attrs.map((e) => {
					/* 
					We can use our getDisplayAttributes() API to create UI elements for the available
					attributes. 
					https://docs.threekit.com/docs/202190-april-23-2021

					We are only creating UI options for Asset types, the only other type of attribute 
                    here drives rotations and we don't need an input for that
                    */
					if (e.type === 'Asset') {
						return (
							<div className="attr-options">
								<p>{e.name}</p>
								{e.values.map((f) => {
									return (
										<button
											key={f.assetId}
											value={f.assetId}
											onClick={(event) => setConfig(e.name, event.target.value)}
										>
											{f.name}
										</button>
									);
								})}
							</div>
						);
					}
				})}
			</div>
		</div>
	);
}

export default Player;
