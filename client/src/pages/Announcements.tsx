import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import axios from 'axios';
import {
	Box,
	Heading,
	Text,
	VStack,
	useColorModeValue,
	Flex
} from '@chakra-ui/react';

// Define the shape of the announcement request
interface AnnouncementRequest {
	author: string;
	date_created: string;
	title: string;
	body: string;
}

// Define the shape of the announcement
interface Announcement {
	author: string;
	date: string;
	time: string;
	title: string;
	body: string;
}

// Component for displaying announcement on desktop
const DesktopAnnouncementPost: React.FC<Announcement> = ({
	author,
	date,
	time,
	title,
	body
}) => {
	const BG = useColorModeValue('white', 'gray.800');
	return (
		<Box bg={BG} p={5} borderRadius='md' minWidth={'100%'}>
			<Flex justify='space-between' align='center'>
				<Flex>
					<Text fontSize='xl' fontWeight='bold' mr={2} align='left'>
						{title}
					</Text>
					<Text fontSize='md' color='gray.400' mt={1} align='left'>
						by {author}
					</Text>
				</Flex>
				<Text fontSize='sm' color='gray.400' align='right'>
					{date} at {time}
				</Text>
			</Flex>
			<Flex mt={4}>
				<Text fontSize='md' align='left'>
					{body}
				</Text>
			</Flex>
		</Box>
	);
};

// Component for displaying announcement on mobile
const MobileAnnouncementPost: React.FC<Announcement> = ({
	author,
	date,
	time,
	title,
	body
}) => {
	const BG = useColorModeValue('white', 'gray.800');
	return (
		<Box bg={BG} p={5} borderRadius='md' minWidth={'100%'}>
			<Flex direction='column' align='left'>
				<Text fontSize='xl' fontWeight='bold' mr={2} align='left'>
					{title}
				</Text>
				<Text fontSize='md' color='gray.400' align='left'>
					by {author}
				</Text>
			</Flex>
			<Text fontSize='sm' color='gray.400' align='left'>
				{date} at {time}
			</Text>
			<Flex mt={4}>
				<Text fontSize='md' align='left'>
					{body}
				</Text>
			</Flex>
		</Box>
	);
};

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

// Main component for displaying announcements
export default function Announcements() {
	const [announcements, setAnnouncements] = useState<Announcement[]>([]);

	useEffect(() => {
		// Fetch announcements from the server
		(async function fetchAnnouncements() {
			try {
				const response = await instance.get('/forum/announcements/get');
				const responseArr: AnnouncementRequest[] = [];
				const anouncementArr: Announcement[] = [];
				for (let i = 0; i < response.data.length; i++) {
					responseArr.push(JSON.parse(JSON.stringify(response.data[i])));
					const ymd = responseArr[i].date_created.substring(0, 10) + 'T';
					let hms =
						responseArr[i].date_created.substring(
							11,
							responseArr[i].date_created.indexOf('.')
						) + '.000Z';
					if (hms.length != 13) {
						hms = '0' + hms;
					}
					const givenDate = new Date(ymd + hms);
					const author = responseArr[i].author;
					const date = givenDate.toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					});
					const time = givenDate.toLocaleString('en-US', {
						hour: 'numeric',
						minute: 'numeric',
						hour12: true
					});
					const title = responseArr[i].title;
					const body = responseArr[i].body;
					anouncementArr.push({ author, date, time, title, body });
				}
				setAnnouncements(anouncementArr);
			} catch (error) {
				console.error('Error fetching announcements:', error);
			}
		})();
	}, []);

	const BG = useColorModeValue('gray.700', 'purple.700');

	return (
		<Box>
			<Heading as='h1' size='xl' mb={6} mt={4}>
				Announcements
			</Heading>
			<div>
				<div>
					<VStack
						spacing={2}
						w='100%'
						bg={BG}
						rounded='lg'
						boxShadow='lg'
						p={{ base: 1, sm: 1 }}
					>
						{announcements.map((announcement, key) => (
							<VStack spacing={4} w='100%' key={key}>
								{isMobile ? (
									<MobileAnnouncementPost
										author={announcement.author}
										date={announcement.date}
										time={announcement.time}
										title={announcement.title}
										body={announcement.body}
									/>
								) : (
									<DesktopAnnouncementPost
										author={announcement.author}
										date={announcement.date}
										time={announcement.time}
										title={announcement.title}
										body={announcement.body}
									/>
								)}
							</VStack>
						))}
					</VStack>
				</div>
			</div>
		</Box>
	);
}
