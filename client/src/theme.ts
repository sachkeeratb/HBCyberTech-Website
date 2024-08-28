import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

// Define the configuration for the theme
const config: ThemeConfig = {
	initialColorMode: 'system', // Set the initial colour mode to the system's colour mode
	useSystemColorMode: false //let the user change colour modes
};

// Extend the default Chakra UI theme with the custom configuration
const theme = extendTheme({ config });

export default theme;
