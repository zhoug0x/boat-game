import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import BoatGame from '../../artifacts/contracts/BoatGame.sol/BoatGame.json';
import { SelectCharacterContainer } from './styled';

// TODO: this is duped, abstract away wallet/ethereum connection stuff
// so typescript doesn't complain about `window.ethereum`
declare let window: any;

const getCharacterClasses = async (gameContract: any) => {
	try {
		const tx = await gameContract.getSailorClassTemplates();

		const characters = tx.map((char: any) => {
			return {
				classKey: char.classKey.toNumber(),
				className: char.className,
				imgURI: char.imgURI,
				stamina: char.stamina.toNumber(),
				maxStamina: char.maxStamina.toNumber(),
				strength: char.strength.toNumber(),
			};
		});

		return characters;
	} catch (error) {
		console.error(error);
	}
};

const SelectCharacter = ({ web3IsAvailable, setActiveCharacter }: any) => {
	const [characterClasses, setCharacterClasses] = useState<any>([]);
	const [gameContract, setGameContract] = useState<any>();

	// connect to game contract on render (put this in context later)
	// TODO: all the connection stuff is duped
	useEffect(() => {
		const { BOAT_CONTRACT_ADDR } = process.env;
		if (web3IsAvailable && BOAT_CONTRACT_ADDR !== undefined) {
			try {
				const provider = new ethers.providers.Web3Provider(window.ethereum);
				const signer = provider.getSigner();
				const gameContract = new ethers.Contract(
					BOAT_CONTRACT_ADDR,
					BoatGame.abi,
					signer
				);

				setGameContract(gameContract);
			} catch (error) {
				console.error(error);
			}
		} else {
			console.log('No wallet detected in browser');
		}
	}, []);

	useEffect(() => {
		if (gameContract) {
			getCharacterClasses(gameContract).then(data => {
				setCharacterClasses(data);
			});
		}
	}, [gameContract]);

	useEffect(() => {
		console.info('available classes:', characterClasses);
	}, [characterClasses]);

	const handleMintClick = (classKey: number) => {
		console.log('mint event for class key: ', classKey);
	};

	return (
		<SelectCharacterContainer>
			<h2>Mint your Sailor. Choose wisely...</h2>

			<div className="character-container">
				{characterClasses.length > 0 &&
					characterClasses.map((charClass: any) => (
						<div key={charClass.className}>
							<div className="character-img-wrapper">
								<img src={charClass.imgURI} alt={charClass.className} />
							</div>
							<br />
							<button
								type="button"
								className="character-mint-button"
								onClick={() => handleMintClick(charClass.classKey)}
							>{`Mint ${charClass.className}`}</button>
						</div>
					))}
			</div>
		</SelectCharacterContainer>
	);
};

export default SelectCharacter;
