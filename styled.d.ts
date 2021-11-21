import 'styled-components';

declare module 'styled-components' {
	export interface DefaultTheme {
		colors: {
			text: string;
			lightText: string;
			link: string;
			background: string;
		};
	}
}
