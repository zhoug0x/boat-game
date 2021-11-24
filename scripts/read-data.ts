import hre from 'hardhat';

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

	let tx;

	console.log('Minting test character...');
	tx = await gameContract.mintCharacter(0);
	await tx.wait();
	console.log('Character minted');

	console.log('Fetching character data...');
	const result = await gameContract.tokenURI(1);
	console.log(`\ntoken data:\n${result}\n`);
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
