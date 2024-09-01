import { ChangeEvent, useState } from 'react';
import axios from 'axios';
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
import { toast, Toaster } from 'react-hot-toast';
import { useCookies } from 'react-cookie';

interface FormVals {
	email: string;
	password: string;
}

interface FormErrors {
	emailErr: boolean;
	passwordErr: boolean;
}

const instance = axios.create({
	baseURL: import.meta.env.VITE_AXIOS_BASE_URL,
	timeout: 1000,
	withCredentials: false,
	headers: {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': '*',
		'Access-Control-Allow-Headers': '*',
		'Content-Type': 'application/json'
	}
});

export default function SignIn() {
	const [cookies, setCookie] = useCookies(['user']);

	const [data, setData] = useState<FormVals>({
		email: '',
		password: ''
	});
	const [error, setError] = useState<FormErrors>({
		emailErr: false,
		passwordErr: false
	});
	const [show, setShow] = useState(false);
	const handleClick = () => setShow(!show);

	const handleEmailInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setData((prevData) => ({
			...prevData,
			email: e.target.value
		}));
		setError({
			...error,
			emailErr:
				!e.target.value.endsWith('@pdsb.net') ||
				e.target.value.length < 15 ||
				e.target.value.length > 20 ||
				!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(e.target.value)
		});
	};

	const doesNotExist = async (email: string): Promise<boolean> => {
		const recievedEmail = await instance.get(`/account/get/${email}`);

		if (recievedEmail.data.length > 0) return false;

		toast.error('You have not signed up.');
		return true;
	};

	const handlePasswordInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setData((prevData) => ({
			...prevData,
			password: e.target.value
		}));
		setError({ ...error, passwordErr: e.target.value.length > 50 });
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (error.emailErr || error.passwordErr) {
			toast.error('You have invalid inputs. Please try again.');
			return;
		}

		if (localStorage.getItem('lockoutTime')) {
			const currentTime = new Date().getTime();
			const lockoutTime = new Date(localStorage.getItem('lockoutTime') || '');
			if (currentTime < lockoutTime.getTime()) {
				toast.error(
					'You have exceeded the maximum login attempts. Please try again later.'
				);
				return;
			}
			localStorage.removeItem('lockoutTime');
			localStorage.removeItem('loginAttempts');
		}

		const { email, password } = data;

		try {
			if (await doesNotExist(email)) return;
			if (cookies.user) {
				toast.error('You are already signed in.');
				return;
			}

			const { data } = await instance.post('/account/post/signin', {
				email: email,
				password: password
			});

			if (!data) {
				if (!localStorage.getItem('loginAttempts'))
					localStorage.setItem('loginAttempts', '0');
				const loginAttempts = parseInt(
					localStorage.getItem('loginAttempts') || '0'
				);
				if (loginAttempts < 2) {
					localStorage.setItem('loginAttempts', (loginAttempts + 1).toString());
					toast.error(
						"Invalid password. If you've forgotten your password, please contact an administrator."
					);
					toast.error('You have ' + (3 - loginAttempts) + ' attempt(s) left.');
					return;
				}

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

			const { token } = data;
			setCookie('user', token, {
				httpOnly: false,
				path: '/',
				expires: new Date(Date.now() + 60 * 60 * 1000 * 6)
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
