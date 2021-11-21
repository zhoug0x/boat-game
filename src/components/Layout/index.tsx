import React from 'react';
import Head from 'next/head';

import * as S from './styled';

interface LayoutProps {
	title: string;
}

const Layout: React.FC<LayoutProps> = ({ title, children }) => {
	return (
		<S.Container>
			<Head>
				<title>{title}</title>
			</Head>
			{children}
		</S.Container>
	);
};

export default Layout;
