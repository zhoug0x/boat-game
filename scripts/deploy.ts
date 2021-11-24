import hre from 'hardhat';

// Current Rinkeby deploy:
// https://rinkeby.etherscan.io/address/0xeabc0990f6efd805f0f9ea2435cb67e79f6b78bd

// https://testnets.opensea.io/collection/buildspace-nft-game
// https://rinkeby.rarible.com/token/0xeabc0990f6efd805f0f9ea2435cb67e79f6b78bd:1

const main = async () => {
	console.log('Deploying contract...');
	const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
	const gameContract = await gameContractFactory.deploy(
		['Bones', 'Fish', 'Nanner'], // Names
		[
			'https://i.imgur.com/zlGIwgm.png', // Images
			'https://i.imgur.com/nfqoCC5.png',
			'https://i.imgur.com/qaHfDsv.png',
		],
		[1, 2, 3], // Stamina values
		[10, 5, 3] // Strength values
	);
	await gameContract.deployed();
	console.log('Contract deployed to:', gameContract.address);

	console.log('Minting test characters...');

	let tx;
	tx = await gameContract.mintCharacter(0);
	await tx.wait();
	console.log('#1 minted...');

	tx = await gameContract.mintCharacter(1);
	await tx.wait();
	console.log('#2 minted...');

	tx = await gameContract.mintCharacter(2);
	await tx.wait();
	console.log('#3 minted...');

	tx = await gameContract.mintCharacter(1);
	await tx.wait();
	console.log('#4 minted...');

	console.log('\nMinting complete\n🎉 Contract deployed!\n');
};

const runMain = async () => {
	try {
		await main();
		process.exit(0);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
};

runMain();
