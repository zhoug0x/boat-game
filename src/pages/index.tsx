import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import BoatGame from '../artifacts/contracts/BoatGame.sol/BoatGame.json';
import Layout from '../components/Layout';
import { ExtLink } from '../components/Shared';
import SelectCharacter from '../components/SelectCharacter';

// so typescript doesn't complain about `window.ethereum`
declare let window: any;

const fetchCharacterData = async () => {
	const { BOAT_CONTRACT_ADDR } = process.env;

	if (BOAT_CONTRACT_ADDR !== undefined) {
		try {
			// Connect wallet to network
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			const gameContract = new ethers.Contract(
				BOAT_CONTRACT_ADDR,
				BoatGame.abi,
				signer
			);

			// Fetch the character
			const tx = await gameContract.getYourSailor();

			// If account has a populated character record, parse and return the data
			if (tx.className) {
				return {
					classKey: tx.classKey.toNumber(),
					className: tx.className,
					imgURI: tx.imgURI,
					stamina: tx.stamina.toNumber(),
					maxStamina: tx.maxStamina.toNumber(),
					strength: tx.strength.toNumber(),
				};
			} else {
				console.log('No character found...');
			}
		} catch (error) {
			console.error(error);
		}
	}
};

const PAGE_TITLE = 'BOAT GAME';

const HomePage: React.FC = () => {
	const [web3IsAvailable, setWeb3IsAvailable] = useState<boolean>(false);
	const [activeAccount, setActiveAccount] = useState<string>();
	const [activeCharacter, setActiveCharacter] = useState<any>();

	// Check if browser is ready for web3
	useEffect(() => {
		if (
			typeof window !== 'undefined' &&
			typeof window.ethereum !== 'undefined'
		) {
			setWeb3IsAvailable(true);
		}
	}, []);

	// Fetched connected account's character
	useEffect(() => {
		if (activeAccount) {
			fetchCharacterData().then(data => {
				if (data) {
					console.log('character data', data);
				}
			});
		}
	}, [activeAccount]);

	const connectAccount = async () => {
		if (web3IsAvailable) {
			try {
				const accounts = await window.ethereum.request({
					method: 'eth_requestAccounts',
				});

				if (accounts.length > 0) {
					const account = accounts[0];
					setActiveAccount(account);
					console.info('Account connected!\n', account);
				} else {
					console.log('Error: No valid accounts found');
				}
			} catch (error) {
				console.error(error);
			}
		} else {
			console.error('Error: No wallet detected in browser');
		}
	};

	const renderContent = () => {
		// Display message to user if no wallet detected in browser
		if (!web3IsAvailable) {
			return (
				<Layout title={`no wallet | ${PAGE_TITLE}`}>
					<h1>
						please install{' '}
						<a href="https://metamask.io" target="_blank">
							metamask
						</a>
					</h1>
				</Layout>
			);
		}

		// web3 available but no active user, show "connect wallet" prompt
		if (!activeAccount) {
			return (
				<div className="connect-wallet-container">
					<img
						src="https://media.giphy.com/media/5qVezULI35guQ/giphy.gif"
						alt="Boat Gif"
					/>
					<button
						className="cta-button connect-wallet-button"
						onClick={() => connectAccount()}
					>
						Connect Wallet
					</button>
				</div>
			);
		}

		// account active but no character selected, show character selection view
		if (activeAccount && !activeCharacter) {
			return (
				<SelectCharacter
					web3IsAvailable={web3IsAvailable}
					setActiveCharacter={setActiveCharacter}
				/>
			);
		}
	};

	return (
		<div className="App">
			<div className="container">
				<div className="header-container">
					<p className="header gradient-text">⛵ BOAT GAME ⛵</p>
					<p className="sub-text">a cooperative game involving a boat</p>
					{renderContent()}
				</div>
				<div className="footer-container">
					by:<ExtLink href="https://twitter.com/zhoug0x">zhoug</ExtLink>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
