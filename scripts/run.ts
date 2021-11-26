import hre from 'hardhat';

const main = async () => {
	console.log('Deploying contract...');
	const gameContractFactory = await hre.ethers.getContractFactory('BoatGame');
	const gameContract = await gameContractFactory.deploy(
		['Marine', 'Swabbie', 'Boatswain'], // Sailor class names
		[
			'https://i.imgur.com/zlGIwgm.png', // Sailor class images
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

	let tx;
	let results;

	console.log('\nMinting test sailor...');
	tx = await gameContract.mintCharacter(2);
	await tx.wait();
	console.log('sailor minted!\n');

	results = await gameContract.tokenURI(1);
	console.log('tokenURI before:\n', results, '\n---\n');

	console.log('Bailing water...');
	tx = await gameContract.bailWater();
	await tx.wait();
	console.log('Water bailed!\n');

	results = await gameContract.tokenURI(1);
	console.log('tokenURI after:\n', results, '\n---\n');

	console.log('Fetching sailor data...');
	const sailorData = await gameContract.getYourSailor();
	console.log('Sailor:\n', sailorData);

	console.log('\nComplete!\n\n');
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
