import { lazy } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import './App.css';

// Top Navigation Bar
const NavBar = lazy(() => import('./components/NavBar'));

// Pages
const Home = lazy(() => import('./pages/General/Home.tsx'));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard.tsx'));
const About = lazy(() => import('./pages/General/About.tsx'));
const Links = lazy(() => import('./pages/Misc/Links.tsx'));
const SignUp = lazy(() => import('./pages/Account/SignUp.tsx'));
const SignIn = lazy(() => import('./pages/Account/SignIn.tsx'));
const AdminSignIn = lazy(() => import('./pages/Admin/AdminSignIn.tsx'));
const Forum = lazy(() => import('./pages/Forum/Forum.tsx'));
import CreatePost from './pages/Forum/CreatePost.tsx';
import Announcements from './pages/Forum/Announcements.tsx';
import General from './pages/Forum/GeneralDiscussion.tsx';
import Post from './pages/Forum/Post.tsx';
import GenMemList from './pages/Admin/GenMemList';
import ExecMemList from './pages/Admin/ExecMemList';
import AccountList from './pages/Admin/AccountList';
const GeneralForm = lazy(() => import('./pages/Misc/GeneralForm.tsx'));
const ExecForm = lazy(() => import('./pages/Misc/ExecForm.tsx'));

import theme from './theme.ts';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { useCookies } from 'react-cookie';

/**
 * Renders the main application component.
 *
 * @returns The JSX element representing the application.
 */

function App() {
	const [cookies] = useCookies(['admin']);
	return (
		<ChakraProvider theme={theme}>
			<NavBar />
			<Router>
				<Routes>
					<Route index path='/' element={<Home />} />
					<Route
						path='/admin'
						element={cookies.admin ? <AdminDashboard /> : <Home />}
					/>
					<Route path='/admin/signin' element={<AdminSignIn />} />
					<Route
						path='/admin/generals'
						element={cookies.admin ? <GenMemList /> : <Home />}
					/>
					<Route
						path='/admin/executives'
						element={cookies.admin ? <ExecMemList /> : <Home />}
					/>{' '}
					<Route
						path='/admin/accounts'
						element={cookies.admin ? <AccountList /> : <Home />}
					/>
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
