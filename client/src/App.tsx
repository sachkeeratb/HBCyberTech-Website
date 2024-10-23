import { lazy } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import './App.css';

// Top Navigation Bar
const NavBar = lazy(() => import('./components/NavBar'));

// Pages
const Home = lazy(() => import('./pages/General/Home'));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const Links = lazy(() => import('./pages/Misc/Links'));
const SignUp = lazy(() => import('./pages/Account/SignUp'));
const SignIn = lazy(() => import('./pages/Account/SignIn'));
const AdminSignIn = lazy(() => import('./pages/Admin/AdminSignIn'));
const Forum = lazy(() => import('./pages/Forum/Forum'));
import {
	AboutCore,
	AboutDev,
	AboutMarketing,
	AboutEvents
} from './pages/General/About';
import CreatePost from './pages/Forum/CreatePost';
import CreateAnnouncement from './pages/Forum/CreateAnnouncement';
import Announcements from './pages/Forum/Announcements';
import General from './pages/Forum/GeneralDiscussion';
import Post from './pages/Forum/Post';
import GenMemList from './pages/Admin/GenMemList';
import ExecMemList from './pages/Admin/ExecMemList';
import AccountList from './pages/Admin/AccountList';
const GeneralForm = lazy(() => import('./pages/Misc/GeneralForm'));
// const ExecForm = lazy(() => import('./pages/Misc/ExecForm'));

import theme from './theme.ts';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import TransitionLink from './components/TransitionLink.tsx';

/**
 * Renders the main application component.
 *
 * @returns The JSX element representing the application.
 */

function App() {
	// Get the admin cookie
	const [cookies] = useCookies(['admin']);
	return (
		<ChakraProvider theme={theme}>
			<NavBar />
			<Router>
				<Routes>
					<Route
						index
						path='/'
						element={
							<TransitionLink>
								<Home />
							</TransitionLink>
						}
					/>
					<Route
						path='/admin'
						element={
							cookies.admin ? (
								<TransitionLink>
									<AdminDashboard />
								</TransitionLink>
							) : (
								<TransitionLink>
									<Home />
								</TransitionLink>
							)
						}
					/>
					<Route
						path='/admin/signin'
						element={
							<TransitionLink>
								<AdminSignIn />
							</TransitionLink>
						}
					/>
					<Route
						path='/admin/generals'
						element={
							cookies.admin ? (
								<TransitionLink>
									<GenMemList />
								</TransitionLink>
							) : (
								<TransitionLink>
									<Home />
								</TransitionLink>
							)
						}
					/>
					<Route
						path='/admin/executives'
						element={
							cookies.admin ? (
								<TransitionLink>
									<ExecMemList />
								</TransitionLink>
							) : (
								<TransitionLink>
									<Home />
								</TransitionLink>
							)
						}
					/>
					<Route
						path='/admin/accounts'
						element={
							cookies.admin ? (
								<TransitionLink>
									<AccountList />
								</TransitionLink>
							) : (
								<TransitionLink>
									<Home />
								</TransitionLink>
							)
						}
					/>
					<Route
						path='/about/core'
						element={
							<TransitionLink>
								<AboutCore />
							</TransitionLink>
						}
					/>
					<Route
						path='/about/development'
						element={
							<TransitionLink>
								<AboutDev />
							</TransitionLink>
						}
					/>
					<Route
						path='/about/marketing'
						element={
							<TransitionLink>
								<AboutMarketing />
							</TransitionLink>
						}
					/>
					<Route
						path='/about/events'
						element={
							<TransitionLink>
								<AboutEvents />
							</TransitionLink>
						}
					/>
					<Route
						path='/links'
						element={
							<TransitionLink>
								<Links />
							</TransitionLink>
						}
					/>
					<Route
						path='/signup'
						element={
							<TransitionLink>
								<SignUp />
							</TransitionLink>
						}
					/>
					<Route
						path='/signin'
						element={
							<TransitionLink>
								<SignIn />
							</TransitionLink>
						}
					/>
					<Route
						path='/forum'
						element={
							<TransitionLink>
								<Forum />
							</TransitionLink>
						}
					/>
					<Route
						path='/forum/announcements'
						element={
							<TransitionLink>
								<Announcements />
							</TransitionLink>
						}
					/>
					<Route
						path='/forum/announcements/create'
						element={
							cookies.admin ? (
								<TransitionLink>
									<CreateAnnouncement />
								</TransitionLink>
							) : (
								<TransitionLink>
									<Home />
								</TransitionLink>
							)
						}
					/>
					<Route
						path='/forum/general'
						element={
							<TransitionLink>
								<General />
							</TransitionLink>
						}
					/>
					<Route
						path='/forum/general/create'
						element={
							<TransitionLink>
								<CreatePost />
							</TransitionLink>
						}
					/>
					<Route
						path='/forum/general/:id'
						element={
							<TransitionLink>
								<Post />
							</TransitionLink>
						}
					/>
					<Route
						path='/form/general'
						element={
							<TransitionLink>
								<GeneralForm />
							</TransitionLink>
						}
					/>
					{/* <Route path='/form/executive' element={ TransitionLink> <ExecForm /> </TransitionLink> } /> */}
				</Routes>
			</Router>
		</ChakraProvider>
	);
}

export default App;
