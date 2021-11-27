import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import BoatGame from '../../abi.json';
import { SelectCharacterContainer } from './styled';

// TODO: this is duped, abstract away wallet/ethereum connection stuff
// so typescript doesn't complain about `window.ethereum`
declare let window: any;

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
	// -------------------------------------------------------------------------------- state
	const [characterClasses, setCharacterClasses] = useState<any>([]);
	const [gameContract, setGameContract] = useState<any>();
	const [isMinting, setIsMinting] = useState<boolean>(false);

	// -------------------------------------------------------------------------------- functions
	const getCharacterClasses = async () => {
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

	const mintNewCharacter = async (classKey: number) => {
		try {
			if (gameContract) {
				setIsMinting(true);
				const tx = await gameContract.mintCharacter(classKey);
				await tx.wait();
				setIsMinting(false);
				location.reload();
			}
		} catch (error) {
			console.error(error);
		}
	};

	// -------------------------------------------------------------------------------- useEffects
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
			setIsMinting(true);
			getCharacterClasses().then(data => {
				setCharacterClasses(data);
				setIsMinting(false);
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

	// -------------------------------------------------------------------------------- event handlers
	const handleMintClick = (classKey: number) => mintNewCharacter(classKey);

	// -------------------------------------------------------------------------------- render
	return (
		<SelectCharacterContainer>
			<h2>Mint your Sailor. Choose wisely...</h2>

			{isMinting ? (
				<div className="loading">
					<div className="indicator">
						<h1>⌛ Minting Sailor In Progress... ⌛</h1>
					</div>
					<img
						src="https://media2.giphy.com/media/AT6nNPRQSVS1i/giphy.gif"
						alt="Minting loading indicator"
					/>
				</div>
			) : (
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
			)}
		</SelectCharacterContainer>
	);
};

export default SelectCharacter;
