// React and Chakra UI components
import { ChangeEvent, useState } from 'react';
import {
	Container,
	FormControl,
	FormLabel,
	Input,
	Stack,
	Text,
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

// To navigate to different pages
import { useNavigate } from 'react-router';

// Axios for making HTTP requests
import axios from 'axios';

// Cookies for storing user data
import { useCookies } from 'react-cookie';

// Interface for form values
interface FormVals {
	username: string;
	email: string;
	password: string;
}

// Interface for form errors
interface FormErrors {
	usernameErr: boolean;
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

// Sign up component
export default function SignUp() {
	// Navigate to different pages
	const navigate = useNavigate();

	// Cookies for storing user data
	const [cookies] = useCookies(['user', 'admin']);

	// State variables for form values and errors
	const [data, setData] = useState<FormVals>({
		username: '',
		email: '',
		password: ''
	});
	const [error, setError] = useState<FormErrors>({
		usernameErr: false,
		emailErr: false,
		passwordErr: false
	});
	// State variable for showing the password
	const [show, setShow] = useState(false);
	const handleClick = () => setShow(!show);

	const [loading, setLoading] = useState(false);

	// Handle username input change
	const handleUsernameInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setData((prevData) => ({
			...prevData,
			username: e.target.value
		}));
		setError({
			...error,
			usernameErr: !/^[a-zA-Z0-9._%+-]{2,20}$/.test(e.target.value)
		});
	};

	// Handle email input change
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

	// Handle password input change
	const handlePasswordInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setData((prevData) => ({
			...prevData,
			password: e.target.value
		}));
		setError({ ...error, passwordErr: e.target.value.length > 50 });
	};

	// Check if the user can submit the form
	function canSubmit(): boolean {
		return !(error.usernameErr || error.emailErr || error.passwordErr);
	}

	// Check if the user has already signed up
	const isDuplicate = async (
		username: string,
		email: string
	): Promise<boolean> => {
		// Check if there is a user with the same username or email
		const recievedUsername = await instance.get(`/account/get/${username}`);
		const recievedEmail = await instance.get(`/account/get/${email}`);

		// If the user doesn't exist, return false
		if (recievedUsername.data.length <= 0 && recievedEmail.data.length <= 0)
			return false;

		// If the user exists, show an error message and return true
		toast.error('You have already signed up.');
		return true;
	};

	// Handle form submission
	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		// Check if the user has invalid inputs
		if (!canSubmit()) {
			toast.error('You have invalid inputs. Please try again.');
			return;
		}

		// Get the username, email, and password from the form
		const { username, email, password } = data;

		try {
			setLoading(true);
			// Check if the user has already signed up
			if (await isDuplicate(username, email)) return;

			// Check if the user is already signed in
			if (cookies.user || cookies.admin) {
				toast.error('You are already signed in.');
				return;
			}

			// Make a POST request to the server to sign up the user
			const { data } = await instance.post('/account/post/signup', {
				username: username,
				email: email,
				password: password,
				verified: false,
				date_created: new Date().toISOString()
			});

			// Show the user if any input is invalid
			if (data.error) {
				toast.error(data.error);
				throw new Error(data.error);
			}

			// Allow the user to continue
			toast.success('Registration successful. Welcome.');
			new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
				navigate('/signin');
			});
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
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
						<Heading fontSize='2xl'>Create Your Account</Heading>
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
							<Stack
								w='100%'
								spacing={3}
								direction={{ base: 'column', md: 'row' }}
							>
								<FormControl isRequired isInvalid={error.usernameErr}>
									<FormLabel>Username</FormLabel>
									<Input
										type='username'
										placeholder='SachkeeratSinghBrar1'
										value={data.username}
										onChange={handleUsernameInputChange}
									/>
									{!error.usernameErr ? (
										<></>
									) : data.username === '' ? (
										<FormErrorMessage>
											A username cannot be empty
										</FormErrorMessage>
									) : data.username.length < 2 || data.username.length > 20 ? (
										<FormErrorMessage>
											Invalid length. Must be between 2-20.
										</FormErrorMessage>
									) : !/^[a-zA-Z0-9._%+-]+$/.test(data.username) ? (
										<FormErrorMessage>Invalid characters.</FormErrorMessage>
									) : (
										<></>
									)}
								</FormControl>
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
							</Stack>
							<FormControl
								id='password'
								isRequired
								isInvalid={data.password.length > 50}
							>
								<FormLabel>Password</FormLabel>
								<InputGroup size='md'>
									<Input
										rounded='md'
										placeholder='Not even we can see this!'
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
							<Text>
								Make sure to verify using the email sent to you.
								<br />
								&#40;Check your spam folder&#41;
							</Text>
							<Button
								type='submit'
								bg='purple.500'
								color='white'
								_hover={{
									bg: 'purple.700'
								}}
								rounded='md'
								w='100%'
								isLoading={loading}
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
