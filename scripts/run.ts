import hre from 'hardhat';

// current rink deploy:
// 0xAdC4D2F788Aff5d145Dc342C7c62cA83b6785732

// on OS:
// https://testnets.opensea.io/collection/boat-game

// rarible:
// https://rinkeby.rarible.com/token/0xAdC4D2F788Aff5d145Dc342C7c62cA83b6785732:1

const main = async () => {
	console.log('Deploying contract...');
	const gameContractFactory = await hre.ethers.getContractFactory('BoatGame');
	const gameContract = await gameContractFactory.deploy(
		['Bones', 'Fish', 'Nanner'], // Sailor names
		[
			'https://i.imgur.com/zlGIwgm.png', // Sailor images
			'https://i.imgur.com/nfqoCC5.png',
			'https://i.imgur.com/qaHfDsv.png',
		],
		[1, 2, 3], // Stamina values
		[10, 5, 3], // Strength values
		1, // Stamina cost-per-action on the boat
		100, // Starting boat water level
		'SS Boatsey', // Boat name
		'https://i.imgur.com/phmKdkz.png' // Boat image url
	);
	await gameContract.deployed();
	console.log('Contract deployed to:', gameContract.address);

	console.log('Minting test characters...');

	let tx;
	tx = await gameContract.mintCharacter(0);
	await tx.wait();
	console.log('#1 minted...');

	const results = await gameContract.tokenURI(1);
	console.log(results);

	return
	

	tx = await gameContract.mintCharacter(1);
	await tx.wait();
	console.log('#2 minted...');

	tx = await gameContract.mintCharacter(2);
	await tx.wait();
	console.log('#3 minted...');

	console.log('\nMinting complete\n');

	console.log('Bailing water...');
	tx = await gameContract.bailWater();
	await tx.wait();

	console.log('Bailing water again...');
	tx = await gameContract.bailWater();
	await tx.wait();

	console.log('Complete!');
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
