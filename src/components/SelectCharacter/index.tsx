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

const mintNewCharacter = async (gameContract: any, classKey: number) => {
	try {
		if (gameContract) {
			alert(
				'New character minting! standby for next alert, as there is no loading spinner lmao...'
			);
			const tx = await gameContract.mintCharacter(classKey);
			await tx.wait();
			alert('New character minted! Check the console for details...');
		}
	} catch (error) {
		console.error(error);
	}
};

// handler for mint event emitted from chain
const onNewSailorMinted = (sender: any, tokenId: any, classKey: any) => {
	const newSailor = {
		sender,
		tokenId: tokenId?.toNumber(),
		classKey: classKey?.toNumber(),
	};

	console.log('\nnew sailor minted!\n', newSailor);
	alert(
		`new sailor minted! address: ${sender}, classKey: ${classKey}, id: ${tokenId}`
	);
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

	// Use gameContract when it becomes available
	useEffect(() => {
		if (gameContract) {
			getCharacterClasses(gameContract).then(data => {
				setCharacterClasses(data);
			});

			// connect event handler to Solidity mint event
			gameContract.on('NewSailorMinted', onNewSailorMinted);
		}

		// Cleanup event handlers when component unmounts
		return () => {
			if (gameContract) {
				gameContract.off('NewSailorMinted', onNewSailorMinted);
			}
		};
	}, [gameContract]);

	const handleMintClick = (classKey: number) => {
		mintNewCharacter(gameContract, classKey);
	};

	return (
		<SelectCharacterContainer>
			<h2>Mint your Sailor. Choose wisely...</h2>

			<div className="character-container">
				{characterClasses?.length > 0 &&
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
