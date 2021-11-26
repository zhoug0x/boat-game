// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import './libraries/Base64.sol';

import 'hardhat/console.sol';

contract BoatGame is ERC721 {
	using Counters for Counters.Counter;

	struct Boat {
		uint256 waterLvl;
		uint256 maxWaterLvl;
		uint256 actionCost;
		string name;
		string imgURI;
	}

	struct Sailor {
		uint256 classKey;
		uint256 stamina;
		uint256 maxStamina;
		uint256 strength;
		string className;
		string imgURI;
	}

	Counters.Counter private _tokenIds;

	Boat public theBoat;
	Sailor[] public sailorClassTemplates;

	mapping(uint256 => Sailor) public sailorIdToAttributes;
	mapping(address => uint256) public addressToSailorId;

	// ----------------------------------------------------------------------- constructor
	constructor(
		string[] memory charNames,
		string[] memory charImgURIs,
		uint256[] memory charStaminas,
		uint256[] memory charStrengths,
		uint256 actionCost,
		uint256 startingWaterLvl,
		string memory boatName,
		string memory boatImgURI
	) ERC721('Boat Game', 'BOAT') {
		theBoat = Boat({
			waterLvl: startingWaterLvl,
			maxWaterLvl: startingWaterLvl,
			actionCost: actionCost,
			name: boatName,
			imgURI: boatImgURI
		});

		// Generate the default character class template choices
		for (uint256 i = 0; i < charNames.length; i++) {
			sailorClassTemplates.push(
				Sailor({
					classKey: i,
					stamina: charStaminas[i],
					maxStamina: charStaminas[i],
					strength: charStrengths[i],
					className: charNames[i],
					imgURI: charImgURIs[i]
				})
			);

			Sailor memory sailor = sailorClassTemplates[i];
			console.log(
				'\nclassKey: %s\nclassName: %s\nimg: %s\n---\n',
				sailor.classKey,
				sailor.className,
				sailor.imgURI
			);
		}

		// Initialize counter to 1 so first minted character ID isn't 0
		_tokenIds.increment();
	}

	// ----------------------------------------------------------------------- functions

	function bailWater() external {
		require(theBoat.waterLvl > 0, 'No water left in boat, great job!');

		uint256 sailorId = addressToSailorId[msg.sender];
		Sailor storage sailorAttr = sailorIdToAttributes[sailorId];

		require(
			sailorAttr.stamina >= theBoat.actionCost,
			'Not enough stamina to do action'
		);

		console.log(
			'Player bailing water! %s strength & %s stamina...',
			sailorAttr.strength,
			sailorAttr.stamina
		);
		console.log('Boat has water level of %s', theBoat.waterLvl);

		// Decumulate water level based on character strength
		if (sailorAttr.strength > theBoat.waterLvl) {
			theBoat.waterLvl = 0;
		} else {
			theBoat.waterLvl -= sailorAttr.strength;
		}

		// Decumulate spent action point from character stamina pool
		sailorAttr.stamina -= theBoat.actionCost;

		console.log(
			'\nPlayer bailed %s water for %s stamina point(s)\n',
			sailorAttr.strength,
			theBoat.actionCost
		);
		console.log('Player has %s stamina remaining\n', sailorAttr.stamina);
		console.log(
			'Boat has %s water level remaining...\n--------\n',
			theBoat.waterLvl
		);
	}

	function mintCharacter(uint256 _classKey) external {
		// Assign a token to the calling address
		uint256 newSailorId = _tokenIds.current();
		_safeMint(msg.sender, newSailorId);

		// Set class template defaults to the new character record
		Sailor memory charTemplate = sailorClassTemplates[_classKey];
		sailorIdToAttributes[newSailorId] = Sailor({
			classKey: _classKey,
			stamina: charTemplate.stamina,
			maxStamina: charTemplate.stamina,
			strength: charTemplate.strength,
			className: charTemplate.className,
			imgURI: charTemplate.imgURI
		});

		// A convenience mapping to link the minter to their new character
		addressToSailorId[msg.sender] = newSailorId;

		// Prep the token ID for the next address that mints
		_tokenIds.increment();
	}

	function tokenURI(uint256 _tokenId)
		public
		view
		override
		returns (string memory)
	{
		string memory tokenDesc = 'A game regarding a boat';
		string memory tokenName = 'Boat Game';
		string memory extURL = 'TBD';

		Sailor memory char = sailorIdToAttributes[_tokenId];
		string memory json = Base64.encode(
			string(
				abi.encodePacked(
					'{"description":"',
					tokenDesc,
					'","external_url":"',
					extURL,
					'","image":"',
					char.imgURI,
					'","name":"',
					tokenName,
					' - #',
					Strings.toString(_tokenId),
					'","attributes":[{',
					'"trait_type":"Class","value":"',
					char.className,
					'"},{"trait_type":"Stamina","value":"',
					Strings.toString(char.stamina),
					'","max_value":"',
					Strings.toString(char.maxStamina),
					'"},{"trait_type":"Strength","value":"',
					Strings.toString(char.strength),
					'"}]}'
				)
			)
		);

		// return string(abi.encodePacked('data:application/json;base64,', json));
		return json;
	}
}
