import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import BoatGame from '../../artifacts/contracts/BoatGame.sol/BoatGame.json';
import { ArenaContainer } from './styled';
import { takeCoverage } from 'v8';

// TODO: this is duped, abstract away wallet/ethereum connection stuff
// so typescript doesn't complain about `window.ethereum`
declare let window: any;

const Arena = ({ activeCharacter, setActiveCharacter }: any) => {
	const [gameContract, setGameContract] = useState<any>();
	const [boat, setBoat] = useState<any>();
	const [actionState, setActionState] = useState<string>('');

	// set boat game contract on each render <-- REFACTOR THIS
	useEffect(() => {
		const { BOAT_CONTRACT_ADDR } = process.env;
		if (
			typeof window !== 'undefined' &&
			typeof window.ethereum !== 'undefined' &&
			BOAT_CONTRACT_ADDR !== undefined
		) {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			const gameContract = new ethers.Contract(
				BOAT_CONTRACT_ADDR,
				BoatGame.abi,
				signer
			);

			setGameContract(gameContract);
		} else {
			console.warn(
				'Environment missing global window obj, browser wallet or contract address'
			);
		}
	}, []);

	// Fetch boat & setup on-chain event listeners when gameContract becomes available
	useEffect(() => {
		// Fetch & parse boat data from chain
		const fetchBoat = async (gameContract: any) => {
			try {
				const tx = await gameContract.getTheBoat();
				return {
					waterLvl: tx.waterLvl.toNumber(),
					maxWaterLvl: tx.maxWaterLvl.toNumber(),
					actionCost: tx.actionCost.toNumber(),
					name: tx.name,
					imgURI: tx.imgURI,
				};
			} catch (error) {
				console.error(error);
			}
		};

		// Handler for water bail event
		const onWaterBailed = (
			sender: any,
			tokenId: any,
			waterAmount: any,
			newWaterLvl: any,
			newSailorStamina: any
		) => {
			const eventData = {
				sender,
				tokenId: tokenId?.toNumber(),
				waterAmount: waterAmount?.toNumber(),
				newWaterLvl: newWaterLvl?.toNumber(),
				newSailorStamina: newSailorStamina?.toNumber(),
			};

			// Update new water level and stamina values
			setBoat((prevState: any) => {
				return { ...prevState, waterLvl: newWaterLvl };
			});

			setActiveCharacter((prevState: any) => {
				return { ...prevState, stamina: newSailorStamina };
			});

			console.log('\nwater bailed from the boat!\n', eventData);
		};

		if (gameContract) {
			fetchBoat(gameContract).then(data => {
				setBoat(data);
			});

			gameContract.on('WaterBailed', onWaterBailed);
		}

		return () => {
			if (gameContract) {
				gameContract.off('WaterBailed', onWaterBailed);
			}
		};
	}, [gameContract]);

	const runAction = async () => {
		try {
			if (gameContract) {
				setActionState('bailing');
				console.log('bailing water...');
				const tx = await gameContract.bailWater();
				await tx.wait();
				console.log('bail tx', tx);
				setActionState('success');
			}
		} catch (error) {
			console.error('bailWater() error:', error);
			setActionState('');
		}
	};

	return (
		<ArenaContainer>
			{boat !== undefined && (
				<div className="boat-container">
					<div className={`boat-content ${actionState}`}>
						<h2>🔥 {boat.name} 🔥</h2>
						<div className="image-content">
							<img src={boat.imgURI} alt={`Boss ${boat.name}`} />
							<div className="health-bar">
								<progress value={boat.waterLvl} max={boat.maxWaterLvl} />
								<p>{`${boat.waterLvl} / ${boat.waterLvl}`}</p>
							</div>
						</div>
					</div>
					<div className="attack-container">
						<button className="cta-button" onClick={() => runAction()}>
							{`⚠️ BAIL OUT ${boat.name}`}
						</button>
					</div>
				</div>
			)}

			{activeCharacter && (
				<div className="players-container">
					<div className="player-container">
						<h2>Your Character</h2>
						<div className="player">
							<div className="image-content">
								<h2>{activeCharacter.className}</h2>
								<img
									src={activeCharacter.imgURI}
									alt={`Character ${activeCharacter.className}`}
								/>
								<div className="health-bar">
									<progress
										value={activeCharacter.stamina}
										max={activeCharacter.maxStamina}
									/>
									<p>{`${activeCharacter.maxStamina} / ${activeCharacter.maxStamina} HP`}</p>
								</div>
							</div>
							<div className="stats">
								<h4>{`🌊 Bailing Strength: ${activeCharacter.strength}`}</h4>
							</div>
						</div>
					</div>
				</div>
			)}
		</ArenaContainer>
	);
};

export default Arena;
