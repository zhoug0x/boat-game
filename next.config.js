/** @type {import('next').NextConfig} */
module.exports = {
	reactStrictMode: true,
	env: {
		BOAT_CONTRACT_ADDR: process.env.BOAT_CONTRACT_ADDR,
	},
};
