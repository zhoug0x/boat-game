import hre from 'hardhat';

const main = async () => {
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

	console.log('Minting test character...');
	const tx = await gameContract.mintCharacter(0);
	await tx.wait();

	const newTokenURI = await gameContract.tokenURI(1);
	console.log('Mint complete! tokenURI:\n', newTokenURI);
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
