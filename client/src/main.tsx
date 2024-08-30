import * as React from 'react';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import theme from './theme.ts';
import { CookiesProvider } from 'react-cookie';

const rootElement = document.getElementById('root')!;
ReactDOM.createRoot(rootElement).render(
	<React.StrictMode>
		<CookiesProvider>
			<ChakraProvider>
				<ColorModeScript initialColorMode={theme.config.initialColorMode} />
				<App />
			</ChakraProvider>
		</CookiesProvider>
	</React.StrictMode>
);
