import { lazy } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import './App.css';

// Top Navigation Bar
const NavBar = lazy(() => import('./components/NavBar'));

// Pages
const Home = lazy(() => import('./pages/General/Home'));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const About = lazy(() => import('./pages/General/About'));
const Links = lazy(() => import('./pages/Misc/Links'));
const SignUp = lazy(() => import('./pages/Account/SignUp'));
const SignIn = lazy(() => import('./pages/Account/SignIn'));
const AdminSignIn = lazy(() => import('./pages/Admin/AdminSignIn'));
const Forum = lazy(() => import('./pages/Forum/Forum'));
import CreatePost from './pages/Forum/CreatePost';
import CreateAnnouncement from './pages/Forum/CreateAnnouncement';
import Announcements from './pages/Forum/Announcements';
import General from './pages/Forum/GeneralDiscussion';
import Post from './pages/Forum/Post';
import GenMemList from './pages/Admin/GenMemList';
import ExecMemList from './pages/Admin/ExecMemList';
import AccountList from './pages/Admin/AccountList';
const GeneralForm = lazy(() => import('./pages/Misc/GeneralForm'));
const ExecForm = lazy(() => import('./pages/Misc/ExecForm'));

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
					<Route path='/forum/announcements' element={<Announcements />} />
					<Route
						path='/forum/announcements/create'
						element={cookies.admin ? <CreateAnnouncement /> : <Home />}
					/>
					<Route path='/forum/general' element={<General />} />
					<Route path='/forum/generalcreate' element={<CreatePost />} />
					<Route path='/forum/general/:id' element={<Post />} />
					<Route path='/form/general' element={<GeneralForm />} />
					<Route path='/form/executive' element={<ExecForm />} />
				</Routes>
			</Router>
		</ChakraProvider>
	);
}

export default App;
