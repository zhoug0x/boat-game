import hre from 'hardhat';

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
	console.log('Contract deployed to address:\n', gameContract.address);
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
