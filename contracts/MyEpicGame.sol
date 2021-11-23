// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import './libraries/Base64.sol';

import 'hardhat/console.sol';

// BUILDSPACE NFT GAME PROJECT (🛠️, 🌈)
// One character NFT per wallet
// Player chooses character class on mint

contract MyEpicGame is ERC721 {
	using Counters for Counters.Counter;

	struct CharacterAttributes {
		uint256 classKey;
		uint256 stamina;
		uint256 strength;
		string name;
		string imgURI;
	}

	Counters.Counter private _tokenIds;

	CharacterAttributes[] public charClassTemplates;
	mapping(uint256 => CharacterAttributes) public charIdToAttributes;
	mapping(address => uint256) public addressToCharId;

	// ----------------------------------------------------------------------- constructor
	constructor(
		string[] memory charNames,
		string[] memory charImgURIs,
		uint256[] memory charStaminas,
		uint256[] memory charStrengths
	) ERC721('Buildspace NFT Game', 'GAME') {
		// Generate the default character class template choices
		for (uint256 i = 1; i < charNames.length; i++) {
			charClassTemplates.push(
				CharacterAttributes({
					classKey: i,
					stamina: charStaminas[i],
					strength: charStrengths[i],
					name: charNames[i],
					imgURI: charImgURIs[i]
				})
			);
		}

		// Initialize counter to 1 so first minted character ID isn't 0
		_tokenIds.increment();
	}

	// ----------------------------------------------------------------------- functions
	function mintCharacter(uint256 _classKey) external {
		// Assign a token to the calling address
		uint256 newCharId = _tokenIds.current();
		_safeMint(msg.sender, newCharId);

		// Set class template defaults to the new character record
		CharacterAttributes memory charTemplate = charClassTemplates[_classKey];
		charIdToAttributes[newCharId] = CharacterAttributes({
			classKey: _classKey,
			stamina: charTemplate.stamina,
			strength: charTemplate.strength,
			name: charTemplate.name,
			imgURI: charTemplate.imgURI
		});

		// TODO: emit a 'Mint(address, classKey)' event?

		// A convenience mapping to link the minter to their new character
		addressToCharId[msg.sender] = newCharId;

		// Prep the token ID for the next address that mints
		_tokenIds.increment();
	}

	function tokenURI(uint256 _tokenId)
		public
		view
		override
		returns (string memory)
	{
		CharacterAttributes memory char = charIdToAttributes[_tokenId];
		string memory json = Base64.encode(
			string(
				abi.encodePacked(
					'{"id": "',
					Strings.toString(_tokenId),
					'", "classKey": "',
					Strings.toString(char.classKey),
					'", "stamina": "',
					Strings.toString(char.stamina),
					'", "strength": "',
					Strings.toString(char.strength),
					'", "name": "',
					char.name,
					'", "imgURI": "',
					char.imgURI,
					'"}'
				)
			)
		);

		return string(abi.encodePacked('data:application/json;base64,', json));
	}
}
