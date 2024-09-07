// To show the general and announcements sections of the forum

// Import necessary components from React and Chakra UI
import { useEffect, useState } from 'react';
import {
	Box,
	Heading,
	Text,
	Link,
	Table,
	Tbody,
	Tr,
	Td,
	Spinner
} from '@chakra-ui/react';

// Import the Link component from React Router
import { Link as RouterLink } from 'react-router-dom';

// Import Axios for making HTTP requests
import axios from 'axios';

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

// Main component for displaying the forum
export default function Forum() {
	// Define the amount of posts in each category
	const [amount, setAmount] = useState({
		announcements: 0,
		general: 0
	});

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Fetch the amount of posts in each category
		(async function fetchData() {
			try {
				const responseAnnouncements = await instance.get(
					'/forum/announcements/get/amount'
				);
				const responseGeneral = await instance.get('/forum/general/get/amount');
				if (responseAnnouncements === null || responseGeneral === null) return;
				setAmount({
					announcements: responseAnnouncements.data,
					general: responseGeneral.data
				});
			} catch (error) {
				console.error('Error fetching posts:', error);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	return (
		<Box mt={8} mx='auto' w='100%'>
			<Table>
				<Tbody>
					<Tr>
						<Td>
							<Heading as='h2' size='lg' mb={4}>
								<Link as={RouterLink} to='/forum/announcements'>
									Announcements
								</Link>
							</Heading>
							<Text mb={2}>
								This category is for important announcements and updates.
							</Text>
						</Td>
						<Td textAlign='center'>
							{loading ? (
								<Box sx={{ display: 'flex', justifyContent: 'center' }}>
									<Spinner />
								</Box>
							) : (
								<Text fontSize='2xl'>{amount.announcements}</Text>
							)}
							{loading ? (
								<></>
							) : amount.announcements === 1 ? (
								<Text>Post</Text>
							) : (
								<Text>Posts</Text>
							)}
						</Td>
					</Tr>
					<Tr>
						<Td>
							<Heading as='h2' size='lg' mb={4}>
								<Link as={RouterLink} to='/forum/general'>
									General Discussion
								</Link>
							</Heading>
							<Text mb={2}>
								This category is for general discussions and conversations.
							</Text>
						</Td>
						<Td textAlign='center'>
							{loading ? (
								<Box sx={{ display: 'flex', justifyContent: 'center' }}>
									<Spinner />
								</Box>
							) : (
								<Text fontSize='2xl'>{amount.general}</Text>
							)}
							{loading ? (
								<></>
							) : amount.general === 1 ? (
								<Text>Post</Text>
							) : (
								<Text>Posts</Text>
							)}
						</Td>
					</Tr>
				</Tbody>
			</Table>
		</Box>
	);
}
