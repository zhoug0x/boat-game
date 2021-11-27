import styled from 'styled-components';

export const SelectCharacterContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	color: white;

	@media only screen and (min-width: 1140px) {
		padding: 0 6rem;
	}

	@media only screen and (min-width: 2560px) {
		padding: 0 42rem;
	}

	> h2 {
		margin: 4rem 0;
	}

	.character-container {
		width: 100%;

		display: flex;
		justify-content: space-around;

		& .character-img-wrapper {
			margin-bottom: 0.5rem;

			& > img {
				border-radius: 20px;
			}
		}

		& .character-mint-button {
			cursor: pointer;
			border: none;
			border-radius: 5px;
			padding: 0.5rem 0.75rem;
			font-size: 1.25rem;
			font-weight: bold;
			color: #352016;
			background: linear-gradient(90deg, #e06464 0%, #ff9500 100%);

			&:hover {
				opacity: 0.75;
			}
		}
	}

	.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 75px;
	}

	.loading .indicator {
		display: flex;
	}

	.loading .indicator p {
		font-weight: bold;
		font-size: 28px;
		padding-left: 5px;
	}

	.loading img {
		width: 450px;
		padding-top: 25px;
	}
`;
