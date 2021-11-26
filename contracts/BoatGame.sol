// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import './libraries/Base64.sol';

// BOAT GAME

// current rinkeby:
// https://rinkeby.etherscan.io/address/0xd9581699e98a748ad746e09ba9945b879d1f0469

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

	// ---------------------------------------------------------------------------- constructor
	constructor(
		string[] memory charNames,
		string[] memory charImgURIs,
		uint256[] memory charStaminas,
		uint256[] memory charStrengths,
		uint256 actionCost,
		uint256 startingWaterLvl,
		string memory boatName,
		string memory boatImgURI
	) ERC721('A Boat Game', 'BOAT') {
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
		}

		// Initialize counter to 1 so first minted character ID isn't 0
		_tokenIds.increment();
	}

	// ---------------------------------------------------------------------------- events

	event NewSailorMinted(address sender, uint256 tokenId, uint256 classKey);
	event WaterBailed(
		address sender,
		uint256 tokenId,
		uint256 waterAmount,
		uint256 newWaterLvl,
		uint256 newSailorStamina
	);

	// ---------------------------------------------------------------------------- view/pure
	function getTheBoat() public view returns (Boat memory) {
		return theBoat;
	}

	function getSailorClassTemplates() public view returns (Sailor[] memory) {
		return sailorClassTemplates;
	}

	function getSailorByAddress(address _address)
		public
		view
		returns (Sailor memory)
	{
		uint256 sailorId = addressToSailorId[_address];

		// Check if a sailor ID is assigned to the address
		if (sailorId > 0) {
			return sailorIdToAttributes[sailorId];
		} else {
			// If no sailor, return empty sailor struct
			Sailor memory emptySailor;
			return emptySailor;
		}
	}

	function getYourSailor() public view returns (Sailor memory) {
		return getSailorByAddress(msg.sender);
	}

	// ---------------------------------------------------------------------------- tx
	function bailWater() external {
		require(theBoat.waterLvl > 0, 'No water left in boat, great job!');

		uint256 sailorId = addressToSailorId[msg.sender];
		Sailor storage sailorAttr = sailorIdToAttributes[sailorId];

		require(
			sailorAttr.stamina >= theBoat.actionCost,
			'Not enough stamina to do action'
		);

		// Decumulate water level based on character strength
		if (sailorAttr.strength > theBoat.waterLvl) {
			theBoat.waterLvl = 0;
		} else {
			theBoat.waterLvl -= sailorAttr.strength;
		}

		// Decumulate spent action point from character stamina pool
		sailorAttr.stamina -= theBoat.actionCost;

		emit WaterBailed(
			msg.sender,
			sailorId,
			sailorAttr.strength,
			theBoat.waterLvl,
			sailorAttr.stamina
		);
	}

	function mintCharacter(uint256 _classKey) external {
		// Assign a token to the calling address
		uint256 newSailorId = _tokenIds.current();
		_safeMint(msg.sender, newSailorId);

		// Use the class template to assign attributes to the newly minted character
		Sailor memory charTemplate = sailorClassTemplates[_classKey];
		sailorIdToAttributes[newSailorId] = Sailor({
			classKey: _classKey,
			stamina: charTemplate.stamina,
			maxStamina: charTemplate.stamina,
			strength: charTemplate.strength,
			className: charTemplate.className,
			imgURI: charTemplate.imgURI
		});

		// Map the minter's address to the character token
		addressToSailorId[msg.sender] = newSailorId;

		// Iterate to the next token ID for the next character mint
		_tokenIds.increment();

		emit NewSailorMinted(msg.sender, newSailorId, _classKey);
	}

	// ---------------------------------------------------------------------------- tokenURI
	function tokenURI(uint256 _tokenId)
		public
		view
		override
		returns (string memory)
	{
		string memory tokenDesc = 'A game regarding a leaking boat';
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
					'","name":"Sailor #',
					Strings.toString(_tokenId),
					'","attributes":[{',
					'"trait_type":"Class","value":"',
					char.className,
					'"},{"trait_type":"Stamina","value":',
					Strings.toString(char.stamina),
					',"max_value":',
					Strings.toString(char.maxStamina),
					'},{"trait_type":"Strength","value":',
					Strings.toString(char.strength),
					'}]}'
				)
			)
		);

		return string(abi.encodePacked('data:application/json;base64,', json));
	}
}
