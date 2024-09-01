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

const instance = axios.create({
	baseURL: import.meta.env.VITE_AXIOS_BASE_URL,
	timeout: 60000,
	withCredentials: false,
	headers: {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': '*',
		'Access-Control-Allow-Headers': '*',
		'Content-Type': 'application/json'
	}
});

export default function AdminSignIn() {
	const [cookies, setCookie, removeCookie] = useCookies(['user', 'admin']);

	const [password, setPassword] = useState('');
	const [error, setError] = useState(false);
	const [show, setShow] = useState(false);
	const handleClick = () => setShow(!show);

	const handlePasswordInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
		setError(e.target.value.length > 50);
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (error) {
			toast.error('You have invalid inputs. Please try again.');
			return;
		}

		if (localStorage.getItem('adminLockoutTime')) {
			const currentTime = new Date().getTime();
			const lockoutTime = new Date(
				localStorage.getItem('adminLockoutTime') || ''
			);
			if (currentTime < lockoutTime.getTime()) {
				toast.error(
					'You have exceeded the maximum login attempts. Please try again later.'
				);
				return;
			}
			localStorage.removeItem('adminLockoutTime');
			localStorage.removeItem('adminLoginAttempts');
		}

		try {
			if (cookies.user) removeCookie('user');
			if (cookies.admin) removeCookie('admin');

			const { data } = await instance.post('/admin/signin', {
				password: password
			});

			if (!data) {
				if (!localStorage.getItem('adminLoginAttempts'))
					localStorage.setItem('adminLoginAttempts', '0');
				const loginAttempts = parseInt(
					localStorage.getItem('adminLoginAttempts') || '0'
				);
				if (loginAttempts < 2) {
					localStorage.setItem(
						'adminLoginAttempts',
						(loginAttempts + 1).toString()
					);
					toast.error('Invalid password.');
					toast.error('You have ' + (3 - loginAttempts) + ' attempt(s) left.');
					return;
				}

				const currentTime = new Date().getTime();
				const lockoutTime = new Date(currentTime + 1000 * 60 * 60 + 6); // Lockout for 6 hours
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

			const { token } = data;
			setCookie('admin', token, {
				httpOnly: false,
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
