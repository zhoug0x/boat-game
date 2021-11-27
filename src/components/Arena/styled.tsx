import styled from 'styled-components';

export const ArenaContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: auto;
	color: black;

	.boat-container {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		margin-bottom: 50px;
	}

	.boat-container .boat-content {
		display: flex;
		flex-direction: column;
		padding: 15px;
		border-radius: 10px;
		background-image: linear-gradient(
			to right,
			#ff8177 0%,
			#ff867a 0%,
			#ff8c7f 21%,
			#f99185 52%,
			#cf556c 78%,
			#b12a5b 100%
		);
		background-size: 600% 600%;
		animation: gradient-animation 8s ease infinite;
		margin-bottom: 25px;
	}

	.boat-content h2 {
		margin: 0;
		padding: 5px 0 10px 0;
	}

	.boat-content .image-content,
	.player .image-content {
		position: relative;
	}

	.boat-content .image-content img {
		width: 350px;
		height: 300px;
		border-radius: 10px;
		object-fit: cover;
	}

	.image-content .health-bar {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 30px;
	}

	.health-bar progress[value] {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 100%;
	}

	.health-bar progress[value]::-webkit-progress-bar {
		background-color: #e5652e;
		border-bottom-left-radius: 15px;
		border-bottom-right-radius: 15px;
		overflow: hidden;
	}

	.health-bar progress[value]::-webkit-progress-value {
		background-color: #70cb1b;
	}

	.health-bar p {
		position: absolute;
		width: 100%;
		font-weight: bold;
		color: black;
		bottom: -10px;
	}

	.arena-container .players-container {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: space-around;
	}

	.players-container .player {
		display: flex;
		flex-direction: column;
		max-height: 80%;
		padding: 10px;
		border-radius: 10px;
		background-color: gray;
	}

	.player .image-content img {
		width: 250px;
		height: 300px;
		border-radius: 10px;
		object-fit: cover;
	}

	.players-container .active-players {
		display: flex;
		flex-direction: column;
	}

	.active-players .players-list {
		display: flex;
		flex-direction: column;
		max-height: 400px;
		overflow: scroll;
	}

	.players-list .active-player-item {
		display: flex;
		align-items: center;
		background-color: #b12a5b;
		border-radius: 8px;
		margin: 5px;
		padding: 10px;
		font-size: 18px;
		font-weight: bold;
	}

	.active-player-item .player-image {
		width: 64px;
		height: 64px;
		background-color: gray;
		margin-right: 15px;
		border-radius: 8px;
	}

	.active-player-item .player-content {
		flex-direction: column;
		text-align: left;
	}

	.players-container .attack-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.attack-container button {
		height: 60px;
		font-size: 18px;
		background-image: linear-gradient(135deg, #ff6528 0%, #ffb413 100%);
		background-size: 200% 200%;
		animation: gradient-animation 4s ease infinite;
	}

	/* Effects */
	.boat-container .bailing {
		animation: shake 1.2s cubic-bezier(0.36, 0.07, 0.19, 0.97) both infinite;
		transform: translate3d(0, 0, 0);
		backface-visibility: hidden;
		perspective: 1000px;
	}

	.boat-container .success {
		animation: hit-bounce 1s ease;
	}

	@keyframes shake {
		10%,
		90% {
			transform: translate3d(-1px, 0, 0);
		}

		20%,
		80% {
			transform: translate3d(2px, 0, 0);
		}

		30%,
		50%,
		70% {
			transform: translate3d(-4px, 0, 0);
		}

		40%,
		60% {
			transform: translate3d(4px, 0, 0);
		}
	}

	@keyframes hit-bounce {
		0% {
			transform: scale(1) translateY(0);
		}
		10% {
			transform: scale(1.2, 0.6);
		}
		30% {
			transform: scale(0.8, 1.1) translateY(-10px);
		}
		50% {
			transform: scale(1) translateY(0);
		}
		100% {
			transform: translateY(0);
		}
	}

	/* Toast */
	#toast {
		visibility: hidden;
		max-width: 500px;
		height: 90px;
		margin: auto;
		background-color: gray;
		color: #fff;
		text-align: center;
		border-radius: 10px;
		position: fixed;
		z-index: 1;
		left: 0;
		right: 0;
		bottom: 30px;
		font-size: 17px;
		white-space: nowrap;
	}

	#toast #desc {
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		font-size: 28px;
		font-weight: bold;
		height: 90px;
		overflow: hidden;
		white-space: nowrap;
	}
`;
