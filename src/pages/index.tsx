import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import { NETWORKS } from '../constants';
import BoatGame from '../artifacts/contracts/BoatGame.sol/BoatGame.json';
import Layout from '../components/Layout';
import { ExtLink } from '../components/Shared';
import SvgTwitterLogo from '../assets/twitter-logo.svg';

// so typescript doesn't complain about `window.ethereum`
declare let window: any;

const PAGE_TITLE = 'BOAT GAME';
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const HomePage: React.FC = () => {
	const [web3IsAvailable, setWeb3IsAvailable] = useState<boolean>(false);
	const [activeAccount, setActiveAccount] = useState<any>();

	// Check if browser is web3-capable on every render
	useEffect(() => {
		if (
			typeof window !== 'undefined' &&
			typeof window.ethereum !== 'undefined'
		) {
			setWeb3IsAvailable(true);
		}
	}, []);

	useEffect(() => {
		console.log('active account:\n', activeAccount);
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

	// Display message to user if no wallet detected in browser
	if (!web3IsAvailable)
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

	return (
		<div className="App">
			<div className="container">
				<div className="header-container">
					<p className="header gradient-text">⛵ BOAT GAME ⛵</p>
					<p className="sub-text">a cooperative game involving a boat</p>
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
				</div>

				<div className="footer-container"></div>
			</div>
		</div>
	);
};

export default HomePage;
