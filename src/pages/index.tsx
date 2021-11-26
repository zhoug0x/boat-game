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

	const connectAccount = async () => {
		if (web3IsAvailable) {
			try {
				await window.ethereum.request({ method: 'eth_requestAccounts' });

				const { selectedAddress, networkVersion } = window.ethereum;
				console.log('connected wallet:', {
					address: selectedAddress,
					networkName: NETWORKS[networkVersion] || 'Unknown network',
					chainId: networkVersion,
				});
			} catch (error) {
				console.error(error);
			}
		} else {
			console.error('Error: No wallet detected in browser');
		}
	};

	// Check for browser wallet on every render
	useEffect(() => {
		if (
			typeof window !== 'undefined' &&
			typeof window.ethereum !== 'undefined'
		) {
			setWeb3IsAvailable(true);
		}
	}, []);

	// Display message to user if no wallet detected in browser
	if (!web3IsAvailable)
		return (
			<Layout title={`wallet | ${PAGE_TITLE}`}>
				<h1>
					please install{' '}
					<a href="https://metamask.io" target="_blank">
						metamask
					</a>
				</h1>
			</Layout>
		);

	// return (
	// 	<Layout title={PAGE_TITLE}>
	// 		<h1>BOAT GAME</h1>
	// 		<small>
	// 			by <ExtLink href="https://github.com/zhoug0x">zhoug</ExtLink>{' '}
	// 		</small>
	// 		<hr />
	// 		<button onClick={connectAccount}>connect wallet</button>
	// 	</Layout>
	// );

	return (
		<div className="App">
			<div className="container">
				<div className="header-container">
					<p className="header gradient-text">⚔️ Metaverse Slayer ⚔️</p>
					<p className="sub-text">Team up to protect the Metaverse!</p>
					<div className="connect-wallet-container">
						<img
							src="https://64.media.tumblr.com/tumblr_mbia5vdmRd1r1mkubo1_500.gifv"
							alt="Monty Python Gif"
						/>
					</div>
				</div>
				<div className="footer-container">
					<SvgTwitterLogo alt="Twitter Logo" />

					<a
						className="footer-text"
						href={TWITTER_LINK}
						target="_blank"
						rel="noreferrer"
					>{`built with @${TWITTER_HANDLE}`}</a>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
