import { ChangeEvent, useState } from 'react';
import axios from 'axios'; // Import axios
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
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router';

interface FormVals {
	username: string;
	email: string;
	password: string;
}

interface FormErrors {
	usernameErr: boolean;
	emailErr: boolean;
	passwordErr: boolean;
}

const instance = axios.create({
	baseURL: import.meta.env.VITE_AXIOS_BASE_URL,
	withCredentials: false,
	headers: {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': '*',
		'Access-Control-Allow-Headers': '*',
		'Content-Type': 'application/json'
	}
});

export default function SignUp() {
	const navigate = useNavigate();
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
	const [show, setShow] = useState(false);
	const handleClick = () => setShow(!show);

	const handleUsernameInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setData((prevData) => ({
			...prevData,
			username: e.target.value
		}));
		if (
			e.target.value === '' ||
			e.target.value.length < 2 ||
			e.target.value.length > 20 ||
			!/^[a-zA-Z0-9._%+-]+$/.test(e.target.value)
		)
			setError({ ...error, usernameErr: true });
		else setError({ ...error, usernameErr: false });
	};

	const handleEmailInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setData((prevData) => ({
			...prevData,
			email: e.target.value
		}));
		if (
			!e.target.value.endsWith('@pdsb.net') ||
			e.target.value.length < 15 ||
			e.target.value.length > 20 ||
			!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(e.target.value)
		)
			setError({ ...error, emailErr: true });
		else setError({ ...error, emailErr: false });
	};

	const handlePasswordInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setData((prevData) => ({
			...prevData,
			password: e.target.value
		}));
		if (e.target.value.length > 50) setError({ ...error, passwordErr: true });
		else setError({ ...error, passwordErr: false });
	};

	function canSubmit(): boolean {
		return !(error.usernameErr || error.emailErr || error.passwordErr);
	}

	const isDuplicate = async (
		username: string,
		email: string
	): Promise<boolean> => {
		const recievedUsername = await instance.get(`/account/get/${username}`);
		const recievedEmail = await instance.get(`/account/get/${email}`);

		if (recievedUsername.data.length <= 0 && recievedEmail.data.length <= 0)
			return false;

		toast.error('You have already signed up.');
		return true;
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!canSubmit()) {
			toast.error('You have invalid inputs. Please try again.');
			return;
		}

		const { username, email, password } = data;

		try {
			if (await isDuplicate(username, email)) return;

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
							<Text>Make sure to verify using the email sent to you.</Text>
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
