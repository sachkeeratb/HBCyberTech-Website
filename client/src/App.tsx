import { lazy } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import './App.css';

const NavBar = lazy(() => import('./components/NavBar'));
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Links = lazy(() => import('./pages/Links'));
const SignUp = lazy(() => import('./pages/SignUp'));
const Forum = lazy(() => import('./pages/Forum'));
import Announcements from './pages/Announcements';
import General from './pages/GeneralDiscussion';
import Replies from './pages/Replies';
const GeneralForm = lazy(() => import('./pages/GeneralForm'));
const ExecForm = lazy(() => import('./pages/ExecForm'));
// const Feedback = lazy(() => import('./pages/Feedback'));

import theme from './theme.ts';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

function App() {
	return (
		<ChakraProvider theme={theme}>
			<NavBar />
			<Router>
				<Routes>
					<Route index path='/' element={<Home />} />
					<Route path='/about' element={<About />} />
					<Route path='/links' element={<Links />} />
					<Route path='/forum' element={<Forum />} />
					<Route path='/signup' element={<SignUp />} />
					<Route path='/forum/announcements' element={<Announcements />} />
					<Route path='/forum/general' element={<General />} />
					<Route path='/forum/general/:id' element={<Replies />} />
					<Route path='/form/general' element={<GeneralForm />} />
					<Route path='/form/executive' element={<ExecForm />} />
					{/* <Route path='/form/feedback' element={<Feedback />} /> */}
				</Routes>
			</Router>
		</ChakraProvider>
	);
}

export default App;
