import * as dotenv from 'dotenv';
import '@nomiclabs/hardhat-waffle';
import { task, HardhatUserConfig } from 'hardhat/config';

dotenv.config();

task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
	const accounts = await hre.ethers.getSigners();

	for (const account of accounts) {
		console.log(account.address);
	}
});

const hardhatConfig: HardhatUserConfig = {
	solidity: '0.8.9',
	paths: {
		artifacts: './src/artifacts',
	},
	networks: {
		hardhat: {
			chainId: 1337,
		},
		// rinkeby: {
		// 	url: process.env.RINKEBY_URL,
		// 	accounts: [`0x${process.env.PRIVATE_KEY}`],
		// },
	},
};

module.exports = hardhatConfig;
