import { ChakraProvider } from '@chakra-ui/react';
import './App.css';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import About from './pages/About';
import Links from './pages/Links';
import GeneralForm from './pages/GeneralForm';
import ExecForm from './pages/ExecForm';
import theme from './theme.ts';
import {
	createBrowserRouter,
	createRoutesFromElements,
	RouterProvider,
	Route
} from 'react-router-dom';

const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route path='/' element={<Home />} />
			<Route path='/about' element={<About />} />
			<Route path='/links' element={<Links />} />
			<Route path='/form/general' element={<GeneralForm />} />
			<Route path='/form/executive' element={<ExecForm />} />
		</>
	)
);

function App() {
	return (
		<ChakraProvider theme={theme}>
			<NavBar />
			<RouterProvider router={router} />
		</ChakraProvider>
	);
}

export default App;
