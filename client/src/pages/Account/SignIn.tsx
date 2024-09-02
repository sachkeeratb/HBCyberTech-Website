// Sign in page for users to sign in to their accounts

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

// Toast notifications
import { toast, Toaster } from 'react-hot-toast';

// Cookies for storing user data
import { useCookies } from 'react-cookie';

// Axios for making HTTP requests
import axios from 'axios';

// Interface for form values
interface FormVals {
	email: string;
	password: string;
}

// Interface for form errors
interface FormErrors {
	emailErr: boolean;
	passwordErr: boolean;
}

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

// Sign in component
export default function SignIn() {
	// Cookies for storing user data
	const [cookies, setCookie] = useCookies(['user', 'admin']);

	// State variables for form values and errors
	const [data, setData] = useState<FormVals>({
		email: '',
		password: ''
	});
	const [error, setError] = useState<FormErrors>({
		emailErr: false,
		passwordErr: false
	});
	// State variable for showing the password
	const [show, setShow] = useState(false);
	const handleClick = () => setShow(!show);

	// Handle input change for email
	const handleEmailInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setData((prevData) => ({
			...prevData,
			email: e.target.value
		}));

		// Check if the email is valid
		let isEmailErr = true;
		if (
			/^[0-9]{7}@pdsb.net$/.test(e.target.value) &&
			e.target.value.charAt(0) === '1' &&
			parseInt(e.target.value.charAt(1)) <= 2
		)
			isEmailErr = false;
		else if (
			/^[0-9]{6}@pdsb.net$/.test(e.target.value) &&
			parseInt(e.target.value.charAt(0)) >= 6
		)
			isEmailErr = false;
		setError({
			...error,
			emailErr: isEmailErr
		});
	};

	// Check if the user exists in the database
	const doesNotExist = async (email: string): Promise<boolean> => {
		const recievedEmail = await instance.get(`/account/get/${email}`);

		if (recievedEmail.data.length > 0) return false;

		toast.error('You have not signed up.');
		return true;
	};

	// Handle input change for password
	const handlePasswordInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setData((prevData) => ({
			...prevData,
			password: e.target.value
		}));
		setError({ ...error, passwordErr: e.target.value.length > 50 });
	};

	// Handle form submission
	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		// Check if the user has invalid inputs
		if (error.emailErr || error.passwordErr) {
			toast.error('You have invalid inputs. Please try again.');
			return;
		}

		// Check if the user has exceeded the maximum login attempts
		if (localStorage.getItem('lockoutTime')) {
			// Keep the user locked out while the lockout time is still in effect
			const currentTime = new Date().getTime();
			const lockoutTime = new Date(localStorage.getItem('lockoutTime') || '');
			if (currentTime < lockoutTime.getTime()) {
				toast.error(
					'You have exceeded the maximum login attempts. Please try again later.'
				);
				return;
			}

			// Otherwise, remove the lockout time and login attempts
			localStorage.removeItem('lockoutTime');
			localStorage.removeItem('loginAttempts');
		}

		// Get the email and password from the form
		const { email, password } = data;

		try {
			// Check if the user exists in the database
			if (await doesNotExist(email)) return;

			// Check if the user is already signed in
			if (cookies.user || cookies.admin) {
				toast.error('You are already signed in.');
				return;
			}

			// Sign in the user
			const { data } = await instance.post('/account/post/signin', {
				email: email,
				password: password
			});

			// Check if the user has entered the wrong password
			if (!data) {
				// Keep track of the number of login attempts
				if (!localStorage.getItem('loginAttempts'))
					localStorage.setItem('loginAttempts', '0');
				const loginAttempts = parseInt(
					localStorage.getItem('loginAttempts') || '0'
				);

				// Lock the user out if they have exceeded the maximum login attempts
				if (loginAttempts < 2) {
					localStorage.setItem('loginAttempts', (loginAttempts + 1).toString());
					toast.error(
						"Invalid password. If you've forgotten your password, please contact an administrator."
					);
					toast.error('You have ' + (3 - loginAttempts) + ' attempt(s) left.');
					return;
				}

				// Lock the user out for 1 hour
				const currentTime = new Date().getTime();
				const lockoutTime = new Date(currentTime + 1000 * 60 * 60); // Lockout for 1 hour
				localStorage.setItem('lockoutTime', lockoutTime.toString());
				toast.error(
					'You have exceeded the maximum login attempts. Please try again after 1 hour.'
				);
				return;
			}

			// Show the user if any input is invalid
			if (data.error) {
				toast.error(data.error);
				throw new Error(data.error);
			}

			// Store the user's token in a cookie
			const { token } = data;
			setCookie('user', token, {
				httpOnly: false,
				sameSite: 'lax',
				secure: true,
				path: '/',
				expires: new Date(Date.now() + 60 * 60 * 1000 * 6) // Expires in 6 hours
			});

			// Allow the user to continue
			setData({} as FormVals);
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
						<Heading fontSize='2xl'>Sign in to your account</Heading>
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
							<FormControl isRequired isInvalid={error.emailErr}>
								<FormLabel>Email</FormLabel>
								<Input
									type='email'
									placeholder='123456@pdsb.net'
									value={data.email}
									onChange={handleEmailInputChange}
								/>
								{!error.emailErr ? (
									<></>
								) : (
									<FormErrorMessage>
										A valid PDSB email is required.
									</FormErrorMessage>
								)}
							</FormControl>
							<FormControl
								id='password'
								isRequired
								isInvalid={error.passwordErr}
							>
								<FormLabel>Password</FormLabel>
								<InputGroup size='md'>
									<Input
										rounded='md'
										type={show ? 'text' : 'password'}
										value={data.password}
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
								{!error.passwordErr ? (
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
