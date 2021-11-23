// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import './libraries/Base64.sol';

import 'hardhat/console.sol';

contract MyEpicGame is ERC721 {
	using Counters for Counters.Counter;

	struct CharacterAttributes {
		uint256 characterIndex;
		uint256 stamina;
		uint256 maxStamina;
		uint256 strength;
		string name;
		string imageURI;
	}

	Counters.Counter private _tokenIds;
	CharacterAttributes[] defaultCharacters;

	// -------------------------------------------------------- constructor
	constructor(
		string[] memory characterNames,
		string[] memory characterImageURIs,
		uint256[] memory characterStamina,
		uint256[] memory characterStrength
	) ERC721('Buildspace NFT Game', 'GAME') {
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

	// -------------------------------------------------------- functions
	function tokenURI(uint256 _tokenId)
		public
		view
		override
		returns (string memory)
	{
		return Base64.encode(string(abi.encodePacked('{"id": "', _tokenId, '"}')));
	}
}
