import React, { useState, useEffect } from 'react';

import BoatGame from '../artifacts/contracts/BoatGame.sol/BoatGame.json';
import Layout from '../components/Layout';
import { ExtLink } from '../components/Shared';
import SelectCharacter from '../components/SelectCharacter';

// so typescript doesn't complain about `window.ethereum`
declare let window: any;

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

	const connectAccount = async () => {
		if (web3IsAvailable) {
			try {
				const accounts = await window.ethereum.request({
					method: 'eth_requestAccounts',
				});

				if (accounts.length > 0) {
					const account = accounts[0];
					setActiveAccount(account);
					console.log('Account connected! ' + account);
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
			return <SelectCharacter setCharacterNFT={setActiveCharacter} />;
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
				<div className="footer-container">by zhoug</div>
			</div>
		</div>
	);
};

export default HomePage;
