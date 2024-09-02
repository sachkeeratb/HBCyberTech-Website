// Admin sign in page

// React and Chakra UI components
import { ChangeEvent, useState } from 'react';
import {
	Container,
	FormControl,
	FormLabel,
	Input,
	Stack,
	Button,
	Heading,
	useColorModeValue,
	VStack,
	Center,
	InputGroup,
	InputRightElement,
	FormErrorMessage
} from '@chakra-ui/react';

// Axios for making HTTP requests
import axios from 'axios';

// Toast notifications
import { toast, Toaster } from 'react-hot-toast';

// Cookies for storing user data
import { useCookies } from 'react-cookie';

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

// Admin sign in component
export default function AdminSignIn() {
	// Cookies for managing users
	const [cookies, setCookie, removeCookie] = useCookies(['user', 'admin']);

	// State variables for password and error
	const [password, setPassword] = useState('');
	const [error, setError] = useState(false);

	// Show or hide the password
	const [show, setShow] = useState(false);
	const handleClick = () => setShow(!show);

	// Handle password input change
	const handlePasswordInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
		setError(e.target.value.length > 50);
	};

	// Handle form submission
	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		// Show the user if any input is invalid
		if (error) {
			toast.error('You have invalid inputs. Please try again.');
			return;
		}

		// Check if the user has exceeded the maximum login attempts
		if (localStorage.getItem('adminLockoutTime')) {
			const currentTime = new Date().getTime();
			const lockoutTime = new Date(
				localStorage.getItem('adminLockoutTime') || ''
			);

			// If the time isn't up yet, show an error message
			if (currentTime < lockoutTime.getTime()) {
				toast.error(
					'You have exceeded the maximum login attempts. Please try again later.'
				);
				return;
			}

			// Otherwise, remove the lockout time and login attempts
			localStorage.removeItem('adminLockoutTime');
			localStorage.removeItem('adminLoginAttempts');
		}

		try {
			// If the user is signed in, sign them out
			if (cookies.user) removeCookie('user');
			if (cookies.admin) removeCookie('admin');

			// Sign in the user
			const { data } = await instance.post('/admin/signin', {
				password: password
			});

			// Show the user if any input is invalid
			if (!data) {
				// Create the login attempts
				if (!localStorage.getItem('adminLoginAttempts'))
					localStorage.setItem('adminLoginAttempts', '0');
				const loginAttempts = parseInt(
					localStorage.getItem('adminLoginAttempts') || '0'
				);

				// If the user has less than 2 attempts, increment the attempts
				if (loginAttempts < 2) {
					localStorage.setItem(
						'adminLoginAttempts',
						(loginAttempts + 1).toString()
					);
					toast.error('Invalid password.');
					toast.error('You have ' + (3 - loginAttempts) + ' attempt(s) left.');
					return;
				}

				// If the user has 3 total attempts, lock them out for 6 hours
				const currentTime = new Date().getTime();
				const lockoutTime = new Date(currentTime + 1000 * 60 * 60 + 6);
				localStorage.setItem('adminLockoutTime', lockoutTime.toString());
				toast.error(
					'You have exceeded the maximum login attempts. Please try again after 6 hours.'
				);
				return;
			}

			// Show the user if any input is invalid
			if (data.error) {
				toast.error(data.error);
				throw new Error(data.error);
			}

			// Set the admin cookie
			const { token } = data;
			setCookie('admin', token, {
				httpOnly: false,
				sameSite: 'lax',
				secure: true,
				path: '/',
				expires: new Date(Date.now() + 60 * 60 * 1000)
			});

			// Allow the user to continue
			setPassword('');
			toast.success('Sign in successful. Welcome back.');
			new Promise((resolve) => setTimeout(resolve, 1500)).then(() => {
				window.location.reload();
			});
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Container maxW='7xl' p={{ base: 5, md: 10 }}>
			<Toaster
				position='bottom-right'
				reverseOrder={false}
				toastOptions={{
					style: {
						color: useColorModeValue('black', 'white'),
						background: useColorModeValue('#F2F3F4', '#181818')
					}
				}}
			/>
			<Center>
				<Stack spacing={4}>
					<Stack align='center'>
						<Heading fontSize='2xl'>Welcome, Admin</Heading>
					</Stack>
					<VStack
						as='form'
						boxSize={{
							base: 'xs',
							sm: 'sm',
							md: 'md',
							lg: 'lg',
							xl: 'xl',
							'2xl': '2xl'
						}}
						h='max-content !important'
						bg={useColorModeValue('white', 'gray.700')}
						rounded='lg'
						boxShadow='lg'
						p={{ base: 5, sm: 10 }}
						spacing={8}
						onSubmit={handleSubmit}
					>
						<VStack spacing={4} w='100%'>
							<FormControl id='password' isRequired isInvalid={error}>
								<FormLabel>Password</FormLabel>
								<InputGroup size='md'>
									<Input
										rounded='md'
										type={show ? 'text' : 'password'}
										value={password}
										onChange={handlePasswordInputChange}
									/>
									<InputRightElement width='4.5rem'>
										<Button
											h='1.75rem'
											size='sm'
											rounded='md'
											bg={useColorModeValue('gray.300', 'gray.700')}
											_hover={{
												bg: useColorModeValue('gray.400', 'gray.800')
											}}
											onClick={handleClick}
										>
											{show ? 'Hide' : 'Show'}
										</Button>
									</InputRightElement>
								</InputGroup>
								{!error ? (
									<></>
								) : (
									<FormErrorMessage>
										Please keep your password at a reasonable length.
									</FormErrorMessage>
								)}
							</FormControl>
						</VStack>
						<VStack w='100%'>
							<Button
								type='submit'
								bg='purple.500'
								color='white'
								_hover={{
									bg: 'purple.700'
								}}
								rounded='md'
								w='100%'
							>
								Sign in
							</Button>
						</VStack>
					</VStack>
				</Stack>
			</Center>
		</Container>
	);
}
