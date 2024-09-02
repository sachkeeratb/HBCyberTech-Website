// Admin dashboard to navigate to different admin pages

// React and Chakra UI components
import { useEffect } from 'react';
import {
	Text,
	Container,
	SlideFade,
	Heading,
	Box,
	Stack,
	Button,
	chakra
} from '@chakra-ui/react';

// Axios for making HTTP requests
import axios from 'axios';

// Framer Motion for animations
import { motion } from 'framer-motion';

// Cookies for storing user data
import { useCookies } from 'react-cookie';

// To navigate to different pages
import { useNavigate } from 'react-router-dom';

// Create an instance of axios with custom configurations
const instance = axios.create({
	baseURL: import.meta.env.VITE_AXIOS_BASE_URL, // Base URL for API requests
	timeout: 60000, // Request timeout in milliseconds
	withCredentials: false, // Whether to send cookies with the request
	headers: {
		'Access-Control-Allow-Origin': '*', // Allow requests from any origin
		'Access-Control-Allow-Methods': '*', // Allow any HTTP method
		'Access-Control-Allow-Headers': '*', // Allow any headers
		'Content-Type': 'application/json' // Set the content type to JSON
	}
});

// Admin dashboard component
export default function AdminDashboard() {
	// To navigate to different pages
	const navigate = useNavigate();
	// To get and remove cookies
	const [cookies, , removeCookie] = useCookies(['user', 'admin']);

	// Check if the user is an admin
	useEffect(() => {
		if (!cookies.admin) navigate('/');
		(async function verify() {
			try {
				const request = await instance.post('/admin/verify', {
					token: cookies.admin
				});

				// If the user is not an admin, remove the cookie and redirect to the home page
				if (request.data !== true) {
					removeCookie('admin');
					navigate('/');
				}
			} catch (error) {
				console.error(error);
				navigate('/');
			}
		})();
	}, []);

	return (
		<>
			<Container maxW='5xl' py={2} pb={10} mx='auto'>
				<SlideFade in={true} offsetY='50vh'>
					<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
						<Heading
							fontWeight={600}
							fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
							lineHeight={'110%'}
							textAlign='center'
						>
							<Text
								as={'span'}
								color={'blue.400'}
								bgGradient='linear(to-r, blue.200, purple.500)'
								bgClip='text'
							>
								Admin Dashboard
							</Text>
						</Heading>
					</motion.div>
				</SlideFade>
			</Container>

			{LinksList.map((Link, i) => (
				<Box
					as='a'
					href={Link.href}
					role={'group'}
					display={'block'}
					p={2}
					rounded={'md'}
					key={i}
				>
					<Stack direction={'column'} align={'center'}>
						<Button mb={'7vh'}>
							<chakra.h3
								fontSize='2xl'
								transition={'all .3s ease'}
								_groupHover={{ color: 'purple.400' }}
								fontWeight={500}
							>
								{Link.label}
							</chakra.h3>
						</Button>
					</Stack>
				</Box>
			))}
		</>
	);
}

// Links to different admin pages
interface Link {
	label: string;
	href: string;
}

const LinksList: Link[] = [
	{
		label: 'Executive Member Applications',
		href: '/admin/executives'
	},
	{
		label: 'General Members List',
		href: '/admin/generals'
	},
	{
		label: 'Accounts List',
		href: '/admin/accounts'
	}
];
