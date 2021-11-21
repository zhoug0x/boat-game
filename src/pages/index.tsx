import React, { useState, useEffect, ChangeEvent } from 'react';
import { ethers } from 'ethers';

import Greeter from '../artifacts/contracts/Greeter.sol/Greeter.json';
import Layout from '../components/Layout';
import { ExtLink } from '../components/Shared';

// so typescript doesn't complain about `window.ethereum`
declare let window: any;

// greeter contract deployed on Rinkeby:
// https://rinkeby.etherscan.io/address/0x4d18e9ADF506d8125736D166911219EE844ae347
const GREETER_ADDRESS = '0x4d18e9ADF506d8125736D166911219EE844ae347';

const HomePage: React.FC = () => {
	const [greetingInput, setGreetingInput] = useState<string>('');
	const [web3IsAvailable, setWeb3IsAvailable] = useState<boolean>(false);

	// Check if browser has a wallet available
	useEffect(() => {
		if (
			typeof window !== 'undefined' &&
			typeof window.ethereum !== 'undefined'
		) {
			setWeb3IsAvailable(true);
		}
	}, []);

	const requestAccount = async () => {
		await window.ethereum.request({ method: 'eth_requestAccounts' });
	};

	const fetchGreeting = async () => {
		if (web3IsAvailable) {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const contract = new ethers.Contract(
				GREETER_ADDRESS,
				Greeter.abi,
				provider
			);

			try {
				const data = await contract.greet();
				console.log('data: ', data);
			} catch (error) {
				console.error(error);
			}
		}
	};

	const setGreeting = async () => {
		if (greetingInput === '') return;

		if (web3IsAvailable) {
			await requestAccount();

			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(
				GREETER_ADDRESS,
				Greeter.abi,
				signer
			);

			const tx = await contract.setGreeting(greetingInput);
			await tx.wait();
			fetchGreeting();
		}
	};

	// Event handlers
	const onGreetingInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setGreetingInput(e.target.value);
	};
	const onFetchGreetingClick = () => fetchGreeting();
	const onSetGreetingClick = () => setGreeting();

	return (
		<Layout title="dapp starter">
			<h1>dapp starter</h1>
			<small>
				by <ExtLink href="https://github.com/zhoug0x">zhoug</ExtLink>{' '}
			</small>
			<ul style={{ listStyle: 'none' }}>
				<li>✅ next.js &amp; typescript</li>
				<li>✅ styled-components</li>
				<li>✅ hardhat</li>
			</ul>
			<input
				type="text"
				placeholder="set greeting"
				value={greetingInput}
				onChange={onGreetingInputChange}
			/>
			<button onClick={onSetGreetingClick}>set greeting</button>
			<br />
			<br />
			<button onClick={onFetchGreetingClick}>fetch on-chain greeting</button>
		</Layout>
	);
};

export default HomePage;
