import {
	Box,
	Heading,
	Text,
	Link,
	Table,
	Tbody,
	Tr,
	Td
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

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

export default function Forum() {
	const [amount, setAmount] = useState({
		announcements: 0,
		general: 0
	});

	useEffect(() => {
		(async function fetchAnnouncementsAmount() {
			try {
				const response = await instance.get('/forum/announcements/get/amount');
				if (response === null) return;
				setAmount({ ...amount, announcements: response.data });
			} catch (error) {
				console.error('Error fetching announcements:', error);
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
							<Text fontSize='2xl'>{amount.announcements}</Text>
							<Text>Posts</Text>
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
							<Text fontSize='2xl'>{amount.general}</Text>
							<Text>Posts</Text>
						</Td>
					</Tr>
				</Tbody>
			</Table>
		</Box>
	);
}
