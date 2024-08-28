import { lazy } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import './App.css';

// Top Navigation Bar
const NavBar = lazy(() => import('./components/NavBar'));

// Pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Links = lazy(() => import('./pages/Links'));
const SignUp = lazy(() => import('./pages/SignUp'));
const SignIn = lazy(() => import('./pages/SignIn'));
const Forum = lazy(() => import('./pages/Forum'));
import CreatePost from './pages/CreatePost';
import Announcements from './pages/Announcements';
import General from './pages/GeneralDiscussion';
import Post from './pages/Post';
const GeneralForm = lazy(() => import('./pages/GeneralForm'));
const ExecForm = lazy(() => import('./pages/ExecForm'));

import theme from './theme.ts';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

/**
 * Renders the main application component.
 *
 * @returns The JSX element representing the application.
 */

function App() {
	return (
		<ChakraProvider theme={theme}>
			<NavBar />
			<Router>
				<Routes>
					<Route index path='/' element={<Home />} />
					<Route path='/about' element={<About />} />
					<Route path='/links' element={<Links />} />
					<Route path='/signup' element={<SignUp />} />
					<Route path='/signin' element={<SignIn />} />
					<Route path='/forum' element={<Forum />} />
					<Route path='/forum/create' element={<CreatePost />} />
					<Route path='/forum/announcements' element={<Announcements />} />
					<Route path='/forum/general' element={<General />} />
					<Route path='/forum/general/:id' element={<Post />} />
					<Route path='/form/general' element={<GeneralForm />} />
					<Route path='/form/executive' element={<ExecForm />} />
				</Routes>
			</Router>
		</ChakraProvider>
	);
}

export default App;
