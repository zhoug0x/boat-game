// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import 'hardhat/console.sol';

contract MyEpicGame {
	struct CharacterAttributes {
		uint256 characterIndex;
		uint256 stamina;
		uint256 maxStamina;
		uint256 strength;
		string name;
		string imageURI;
	}

	CharacterAttributes[] defaultCharacters;

	constructor(
		string[] memory characterNames,
		string[] memory characterImageURIs,
		uint256[] memory characterStamina,
		uint256[] memory characterStrength
	) {
		for (uint256 i = 0; i < characterNames.length; i += 1) {
			defaultCharacters.push(
				CharacterAttributes({
					characterIndex: i,
					name: characterNames[i],
					imageURI: characterImageURIs[i],
					stamina: characterStamina[i],
					maxStamina: characterStamina[i],
					strength: characterStrength[i]
				})
			);

			CharacterAttributes memory c = defaultCharacters[i];
			console.log(
				'"%s"\n- stamina: %s\n- strength: %s\n',
				c.name,
				c.stamina,
				c.strength
			);
			console.log('img: %s\n---\n', c.imageURI);
		}
	}
}
