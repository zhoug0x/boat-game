import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
	body {
		font-size: 16px;
		font-family: sans-serif;
		color: ${({ theme }) => theme.colors.text};
		background-color: ${({ theme }) => theme.colors.background};
	}
	
	a {
		text-decoration: none;
		color: ${({ theme }) => theme.colors.link};

		&:hover {
			opacity: 0.75;
		}

	}
`;

export default GlobalStyle;
