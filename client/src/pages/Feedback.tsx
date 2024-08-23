// To add later

import {
	Container,
	FormControl,
	FormLabel,
	FormErrorMessage,
	Textarea,
	Stack,
	Button,
	Heading,
	useColorModeValue,
	VStack,
	Flex,
	Text,
	Divider
} from '@chakra-ui/react';
import { useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';

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

export default function Feedback() {
	const [message, setMessage] = useState('');
	const [messageErr, setMessageErr] = useState(false);
	const [messageChars, setMessageChars] = useState(1000);

	const validateMessage = (val: string) => {
		if (val.length > 1000) setMessageErr(true);
		else setMessageErr(false);
	};

	const handleMessageInputChange = (e: { target: { value: string } }) => {
		setMessage(e.target.value);
		setMessageChars(1000 - e.target.value.length);
		validateMessage(e.target.value);
	};

	const canSubmit = (): boolean => {
		return !messageErr && message.length > 0;
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!canSubmit()) {
			toast.error('You have invalid inputs. Please try again.');
			return;
		}

		try {
			const token = localStorage.getItem('feedbackToken');
			if (token) {
				const decoded = jwtDecode(token) as { exp: number };
				const currentTime = Date.now() / 1000;
				if (decoded.exp > currentTime) {
					toast.error('You can only submit feedback once every 6 hours.');
					return;
				}
			}

			const { data } = await instance.post('/feedback/post', {
				message: message,
				date_created: new Date().toISOString()
			});

			if (data.error) {
				toast.error(data.error);
				throw new Error(data.error);
			}

			const newToken = data.token;
			localStorage.setItem('feedbackToken', newToken);

			setMessage('');
			toast.success('Feedback submitted successfully. Thank you.');
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Container maxW='7xl' py={10} px={{ base: 5, md: 8 }}>
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
			<Stack spacing={10}>
				<Flex align='center' justify='center'>
					<Stack spacing={5}>
						<Heading fontSize={{ base: '3xl', md: '4xl' }} textAlign='center'>
							Feedback Form
						</Heading>
						<Divider />
						<VStack
							as='form'
							spacing={8}
							w={{ base: 'xs', sm: 'sm', md: 'md' }}
							onSubmit={handleSubmit}
						>
							<FormControl isInvalid={messageErr}>
								<FormLabel>Message</FormLabel>
								<Textarea
									placeholder='Your feedback'
									value={message}
									onChange={handleMessageInputChange}
									maxLength={1000}
								/>
								<FormErrorMessage>
									Message cannot exceed 1000 characters.
								</FormErrorMessage>
								<Text fontSize='sm' color='gray.500'>
									{messageChars} characters remaining
								</Text>
							</FormControl>
							<Button
								type='submit'
								colorScheme='teal'
								isDisabled={!canSubmit()}
							>
								Submit
							</Button>
						</VStack>
					</Stack>
				</Flex>
			</Stack>
		</Container>
	);
}
