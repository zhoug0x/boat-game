import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import BoatGame from '../abi.json';
import Layout from '../components/Layout';
import { ExtLink } from '../components/Shared';

import SelectCharacter from '../components/SelectCharacter';
import Arena from '../components/Arena';

// so typescript doesn't complain about `window.ethereum`
declare let window: any;

// !!!!!!!
// TODO:
// CATCH WHEN WALLET ON WRONG CHAIN ID (any chain other than Rinkeby in this case)
// !!!!!!!

// current deploy on OS
// https://testnets.opensea.io/collection/a-boat-game

// TODO: put this somwhere else
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
					classKey: tx.classKey?.toNumber(),
					className: tx.className,
					imgURI: tx.imgURI,
					stamina: tx.stamina?.toNumber(),
					maxStamina: tx.maxStamina?.toNumber(),
					strength: tx.strength?.toNumber(),
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
	const [isLoading, setIsLoading] = useState<boolean>(false);

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
		console.log(activeAccount);

		if (activeAccount) {
			setIsLoading(true);
			fetchCharacterData().then(data => {
				setActiveCharacter(data);
				setIsLoading(false);
			});
		}
	}, [activeAccount]);

	const connectAccount = async () => {
		if (web3IsAvailable) {
			setIsLoading(true);
			try {
				const accounts = await window.ethereum.request({
					method: 'eth_requestAccounts',
				});

				if (accounts.length > 0) {
					const account = accounts[0];
					setActiveAccount(account);
				} else {
					console.log('Error: No valid accounts found');
				}
			} catch (error) {
				console.error(error);
			}
			setIsLoading(false);
		} else {
			console.error('Error: No wallet detected in browser');
		}
	};

	const renderContent = () => {
		if (isLoading) {
			// return <LoadingIndicator />;
			return <h1>LOADING</h1>;
		}

		// Display message to user if no wallet detected in browser
		if (!web3IsAvailable) {
			return (
				<Layout title={`no wallet | ${PAGE_TITLE}`}>
					<h1>
						please install{' '}
						<a href="https://metamask.io" target="_blank" rel="noreferrer">
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
						Connect Wallet to Rinkeby
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

		// active account & associated character - time 2 play!
		if (activeAccount && activeCharacter) {
			return (
				<Arena
					activeCharacter={activeCharacter}
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
					<p className="sub-text">
						an untested, cooperative Rinkeby game involving a sinking boat
					</p>

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
