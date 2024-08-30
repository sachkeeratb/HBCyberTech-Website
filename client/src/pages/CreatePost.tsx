import React, { useState, useEffect } from 'react';
import {
	Container,
	FormControl,
	FormLabel,
	Input,
	Textarea,
	Stack,
	Button,
	Heading,
	VStack,
	Center,
	useColorModeValue,
	Text,
	FormErrorMessage
} from '@chakra-ui/react';
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { jwtDecode } from 'jwt-decode';

// Define the data types
interface FormData {
	title: string;
	body: string;
}

interface ErrorData {
	titleErr: boolean;
	bodyErr: boolean;
}

interface Chars {
	title: number;
	body: number;
}

interface UserData {
	username: string;
	email: string;
	verified: boolean;
}

// Create an instance of axios with custom configurations
const instance = axios.create({
	baseURL: import.meta.env.VITE_AXIOS_BASE_URL, // Base URL for API requests
	timeout: 1000, // Request timeout in milliseconds
	withCredentials: false, // Whether to send cookies with the request
	headers: {
		'Access-Control-Allow-Origin': '*', // Allow requests from any origin
		'Access-Control-Allow-Methods': '*', // Allow any HTTP method
		'Access-Control-Allow-Headers': '*', // Allow any headers
		'Content-Type': 'application/json' // Set the content type to JSON
	}
});

export default function CreatePost() {
	const navigate = useNavigate();
	const [cookies] = useCookies(['user']);

	// Store the data, errors, and the available characters
	const [data, setData] = useState<FormData>({
		title: '',
		body: ''
	});
	const [error, setError] = useState<ErrorData>({
		titleErr: false,
		bodyErr: false
	});
	const [chars, setChars] = useState<Chars>({
		title: 20,
		body: 600
	});

	// Store the user data
	const [user, setUser] = useState<UserData>({
		username: '',
		email: '',
		verified: false
	});

	// Fetch the user data from the local storage
	useEffect(() => {
		if (cookies.user) {
			const decoded = jwtDecode<UserData>(cookies.user);
			setUser({
				username: decoded.username,
				email: decoded.email,
				verified: decoded.verified
			});
		}
	}, []);

	// Handle the input change for the title
	const handleTitleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (
			!e.target.value ||
			e.target.value.length < 5 ||
			e.target.value.length > 20
		)
			setError({ ...error, titleErr: true });
		else setError({ ...error, titleErr: false });
		setChars({ ...chars, title: 20 - e.target.value.length });

		setData({ ...data, title: e.target.value });
	};

	// Handle the input change for the body
	const handleBodyInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		if (
			!e.target.value ||
			e.target.value.length < 20 ||
			e.target.value.length > 600
		)
			setError({ ...error, bodyErr: true });
		else setError({ ...error, bodyErr: false });
		setChars({ ...chars, body: 600 - e.target.value.length });

		setData({ ...data, body: e.target.value });
	};

	// Handle the form submission
	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!data.title || !data.body) {
			toast.error('Please fill in all fields.');
			return;
		}

		const lastPostTime = localStorage.getItem('lastPostTime');
		const now = new Date().getTime();
		if (lastPostTime && now - parseInt(lastPostTime) < 10 * 60 * 1000) {
			toast.error('You must wait 10 minutes between posting comments.');
			return;
		} else localStorage.setItem('lastPostTime', now.toString());

		const { username, email } = user;
		const { title, body } = data;
		try {
			const { data } = await instance.post('/forum/general/create', {
				author: username,
				email: email,
				date_created: new Date().toISOString(),
				title: title,
				body: body
			});

			if (data.error) {
				toast.error(data.error);
				throw new Error(data.error);
			}

			setData({} as FormData);
			toast.success('Post created successfully.');
			new Promise((resolve) => setTimeout(resolve, 1500)).then(() => {
				navigate('/forum/general');
			});
		} catch (error) {
			console.log(error);
		}
	};

	const toastColour = useColorModeValue('black', 'white');
	const bgColour = useColorModeValue('#F2F3F4', '#181818');

	// If the user is not verified, display a message
	if (!user.verified) {
		return (
			<Container maxW='7xl' p={{ base: 5, md: 10 }}>
				<Center>
					<Text>
						A verified account is required to create forum posts. You may need
						to sign out and sign back in to do so. To verify, you must click the
						link in your email.
					</Text>
				</Center>
			</Container>
		);
	}

	return (
		<Container maxW='7xl' p={{ base: 5, md: 10 }}>
			<Toaster
				position='bottom-right'
				reverseOrder={false}
				toastOptions={{
					style: {
						color: toastColour,
						background: bgColour
					}
				}}
			/>
			<Center>
				<Stack spacing={4}>
					<Stack align='center'>
						<Heading fontSize='2xl'>Create a Forum Post</Heading>
					</Stack>
					<VStack
						as='form'
						boxSize={{ base: 'xs', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' }}
						onSubmit={handleSubmit}
					>
						<FormControl id='author' isReadOnly isRequired>
							<FormLabel>Author</FormLabel>
							<Input
								type='text'
								value={
									JSON.parse(localStorage.getItem('user') || '{}').username
								}
								readOnly
							/>
						</FormControl>
						<FormControl id='email' isReadOnly isRequired>
							<FormLabel>Email</FormLabel>
							<Input
								type='text'
								value={JSON.parse(localStorage.getItem('user') || '{}').email}
								readOnly
							/>
						</FormControl>
						<FormControl id='title' isRequired isInvalid={error.titleErr}>
							<FormLabel>Title</FormLabel>
							<Input
								type='text'
								value={data.title}
								onChange={handleTitleInputChange}
							/>
							{error.titleErr ? (
								chars.title > 15 ? (
									<FormErrorMessage>
										You must input a title with a minimum of 5 characters.
									</FormErrorMessage>
								) : chars.title <= 0 ? (
									<FormErrorMessage>
										The title has a maximum of 20 characters.
									</FormErrorMessage>
								) : (
									<></>
								)
							) : (
								<></>
							)}
							{chars.title > 5 && chars.title <= 15 ? (
								<Text fontSize='sm' textAlign={'right'}>
									{chars.title}
								</Text>
							) : (
								<Text fontSize='sm' textAlign={'right'} color={'red'}>
									{chars.title}
								</Text>
							)}
						</FormControl>
						<FormControl id='body' isRequired isInvalid={error.bodyErr}>
							<FormLabel>Body</FormLabel>
							<Textarea value={data.body} onChange={handleBodyInputChange} />
							{error.bodyErr ? (
								chars.body > 580 ? (
									<FormErrorMessage>
										You must input a body with a minimum of 20 characters.
									</FormErrorMessage>
								) : chars.body <= 0 ? (
									<FormErrorMessage>
										The body has a maximum of 600 characters.
									</FormErrorMessage>
								) : (
									<></>
								)
							) : (
								<></>
							)}
							{chars.body > 50 && chars.body <= 580 ? (
								<Text fontSize='sm' textAlign={'right'}>
									{chars.body}
								</Text>
							) : (
								<Text fontSize='sm' textAlign={'right'} color={'red'}>
									{chars.body}
								</Text>
							)}
						</FormControl>
						<Button type='submit' colorScheme='purple' size='lg'>
							Submit
						</Button>
					</VStack>
				</Stack>
			</Center>
		</Container>
	);
}
